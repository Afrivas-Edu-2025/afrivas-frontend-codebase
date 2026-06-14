'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, Send, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { TextGenerateEffect } from '@/components/aceternity/text-generate-effect'
import {
  useGetAdminMessagesQuery,
  useGetMessageRecipientsQuery,
  useSendAdminMessageMutation,
} from '@/services/adminApi'
import { cn } from '@/lib/utils'
import { connectRealtimeSocket } from '@/lib/socket/realtime-client'

export default function MessagesPage() {
  const [recipientSearch, setRecipientSearch] = useState('')
  const [selectedRecipientUserId, setSelectedRecipientUserId] = useState<number | null>(null)
  const [fallbackRecipientEmail, setFallbackRecipientEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const { data: recipientsResponse, isLoading: recipientsLoading, refetch: refetchRecipients } = useGetMessageRecipientsQuery({
    query: recipientSearch || undefined,
  })

  const { data: messagesResponse, isLoading: messagesLoading, refetch: refetchMessages } = useGetAdminMessagesQuery(
    selectedRecipientUserId ? { recipientUserId: selectedRecipientUserId } : undefined,
  )

  const [sendMessage, { isLoading: sending }] = useSendAdminMessageMutation()

  const recipients = recipientsResponse?.data || []
  const selectedRecipient = recipients.find((recipient) => recipient.userId === selectedRecipientUserId) || null
  const messages = messagesResponse?.data || []

  const canSend = useMemo(() => {
    const hasRecipient = Boolean(selectedRecipientUserId || fallbackRecipientEmail.trim())
    return hasRecipient && body.trim().length > 0
  }, [selectedRecipientUserId, fallbackRecipientEmail, body])

  useEffect(() => {
    let cleanup = () => {}
    let cancelled = false

    const setup = async () => {
      const socket = await connectRealtimeSocket()
      if (!socket || cancelled) return

      const onMessageNew = () => {
        refetchMessages()
        refetchRecipients()
      }

      socket.on('message:new', onMessageNew)
      if (selectedRecipientUserId) {
        socket.emit('join:admin:conversation', { recipientUserId: selectedRecipientUserId })
      }

      cleanup = () => {
        socket.off('message:new', onMessageNew)
      }
    }

    setup()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [refetchMessages, refetchRecipients, selectedRecipientUserId])

  const handleSend = async () => {
    if (!canSend) return

    try {
      await sendMessage({
        recipientId: selectedRecipientUserId || undefined,
        recipientEmail: selectedRecipientUserId ? undefined : fallbackRecipientEmail.trim(),
        subject: subject.trim() || undefined,
        body: body.trim(),
      }).unwrap()

      setBody('')
      setSubject('')
      toast.success('Message sent successfully')
      refetchMessages()
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to send message')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3" />
              Communication Hub
            </span>
          </div>
          <TextGenerateEffect
            words="Messenger Inbox"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">Send messages to lecturers and students in your university directory</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        <Card className="lg:col-span-1 overflow-hidden border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl flex flex-col">
          <CardHeader className="p-4 border-b border-white/10 dark:border-slate-800/50 bg-white/10 dark:bg-slate-900/10">
            <CardTitle className="text-base font-bold">Recipients</CardTitle>
            <div className="relative group mt-3">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
              </div>
              <Input
                placeholder="Search by ID, name, or email"
                value={recipientSearch}
                onChange={(event) => setRecipientSearch(event.target.value)}
                className="pl-10 h-10 rounded-xl"
              />
            </div>
            <div className="mt-3">
              <Input
                placeholder="Or type recipient email directly"
                value={fallbackRecipientEmail}
                onChange={(event) => {
                  setFallbackRecipientEmail(event.target.value)
                  if (event.target.value.trim()) {
                    setSelectedRecipientUserId(null)
                  }
                }}
                className="h-10 rounded-xl"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-y-auto flex-1">
            {recipientsLoading ? (
              <p className="p-4 text-sm text-muted-foreground">Loading recipients...</p>
            ) : recipients.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No recipients found.</p>
            ) : (
              recipients.map((recipient) => (
                <button
                  type="button"
                  key={recipient.userId}
                  onClick={() => {
                    setSelectedRecipientUserId(recipient.userId)
                    setFallbackRecipientEmail('')
                  }}
                  className={cn(
                    'w-full text-left p-4 border-b border-white/5 dark:border-slate-800/30 transition-colors',
                    selectedRecipientUserId === recipient.userId
                      ? 'bg-primary-100/10'
                      : 'hover:bg-white/30 dark:hover:bg-slate-800/30',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold truncate">
                      {recipient.firstName} {recipient.lastName}
                    </p>
                    <Badge variant="glass" className="text-[10px] font-bold">
                      {recipient.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-1">{recipient.email}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Student ID: {recipient.studentRecordId ?? '-'} | Lecturer ID: {recipient.lecturerRecordId ?? '-'}
                  </p>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 overflow-hidden border-white/20 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl flex flex-col shadow-2xl">
          <CardHeader className="p-4 border-b border-white/10 dark:border-slate-800/50">
            <CardTitle className="text-base font-bold">
              {selectedRecipient
                ? `Conversation with ${selectedRecipient.firstName} ${selectedRecipient.lastName}`
                : fallbackRecipientEmail
                ? `Conversation with ${fallbackRecipientEmail}`
                : 'Select a recipient'}
            </CardTitle>
            <CardDescription>
              Admin can send announcements and direct support messages to students and lecturers.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 overflow-y-auto flex-1 space-y-3 bg-gradient-to-b from-transparent to-primary-100/5">
            {messagesLoading ? (
              <p className="text-sm text-muted-foreground">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages yet for this recipient.</p>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="ml-auto max-w-[80%] bg-gradient-to-br from-primary-100 to-primary-100/90 text-white rounded-2xl rounded-br-none p-3 shadow-neon-primary">
                  {message.subject && <p className="text-xs font-bold uppercase tracking-wider mb-1">{message.subject}</p>}
                  <p className="text-sm font-medium">{message.body}</p>
                  <p className="text-[10px] mt-2 text-white/80 uppercase tracking-wider">{new Date(message.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </CardContent>

          <div className="p-4 border-t border-white/10 dark:border-slate-800/50 space-y-3 bg-white/20 dark:bg-slate-900/20">
            <Input
              placeholder="Subject (optional)"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="h-10 rounded-xl"
            />
            <Input
              placeholder="Type your message..."
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="h-12 rounded-xl"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSend}
                disabled={!canSend || sending}
                variant="premium"
                className="rounded-xl px-6"
              >
                <Send className="mr-2 h-4 w-4" />
                {sending ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
