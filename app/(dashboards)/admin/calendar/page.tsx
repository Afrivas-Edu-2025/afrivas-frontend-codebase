'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calendar as CalendarIcon, Plus, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TextGenerateEffect } from '@/components/aceternity/text-generate-effect'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  useCreateAdminCalendarEventMutation,
  useGetAdminCalendarEventsQuery,
  useGetMessageRecipientsQuery,
  useUpdateAdminCalendarEventMutation,
} from '@/services/adminApi'
import { connectRealtimeSocket } from '@/lib/socket/realtime-client'

type Visibility = 'ALL' | 'STUDENT' | 'LECTURER' | 'CUSTOM'

export default function CalendarPage() {
  const [visibility, setVisibility] = useState<Visibility>('ALL')
  const [selectedTargetUsers, setSelectedTargetUsers] = useState<number[]>([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    startAt: '',
    endAt: '',
    reminderAt: '',
    isActive: true,
  })

  const { data: eventsResponse, isLoading, refetch } = useGetAdminCalendarEventsQuery()
  const { data: recipientsResponse } = useGetMessageRecipientsQuery()
  const [createEvent, { isLoading: creating }] = useCreateAdminCalendarEventMutation()
  const [updateEvent, { isLoading: updating }] = useUpdateAdminCalendarEventMutation()

  const events = eventsResponse?.data || []
  const recipients = recipientsResponse?.data || []

  const eligibleTargets = useMemo(() => {
    if (visibility === 'ALL') return recipients
    return recipients.filter((recipient) => recipient.role === visibility)
  }, [recipients, visibility])

  useEffect(() => {
    if (visibility !== 'CUSTOM') {
      setSelectedTargetUsers([])
    }
  }, [visibility])

  useEffect(() => {
    let cleanup = () => {}
    let cancelled = false

    const setup = async () => {
      const socket = await connectRealtimeSocket()
      if (!socket || cancelled) return

      const onCalendarChange = () => {
        refetch()
      }

      socket.on('calendar:event:new', onCalendarChange)
      socket.on('calendar:event:update', onCalendarChange)

      cleanup = () => {
        socket.off('calendar:event:new', onCalendarChange)
        socket.off('calendar:event:update', onCalendarChange)
      }
    }

    setup()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [refetch])

  const handleCreate = async () => {
    if (!form.title.trim() || !form.startAt) {
      toast.error('Title and start date are required')
      return
    }
    if (visibility === 'CUSTOM' && selectedTargetUsers.length === 0) {
      toast.error('Choose at least one target user for custom visibility')
      return
    }

    try {
      await createEvent({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        startAt: new Date(form.startAt).toISOString(),
        endAt: form.endAt ? new Date(form.endAt).toISOString() : undefined,
        reminderAt: form.reminderAt ? new Date(form.reminderAt).toISOString() : undefined,
        visibility,
        isActive: form.isActive,
        targetUserIds: visibility === 'CUSTOM' ? selectedTargetUsers : undefined,
      }).unwrap()

      toast.success('Event created successfully')
      setForm({ title: '', description: '', startAt: '', endAt: '', reminderAt: '', isActive: true })
      setVisibility('ALL')
      setSelectedTargetUsers([])
      refetch()
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create event')
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateEvent({ id, data: { isActive: !isActive } }).unwrap()
      toast.success('Event status updated')
      refetch()
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update event')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <CalendarIcon className="w-3 h-3" />
              Institutional Schedule
            </span>
          </div>
          <TextGenerateEffect
            words="Academic Calendar"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">Create event reminders and control who can see each event</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="rounded-xl">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl">
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
          <CardDescription>Admins can choose audience visibility and active status.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Event title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <Input
            placeholder="Description (optional)"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <Input
            type="datetime-local"
            value={form.startAt}
            onChange={(event) => setForm((prev) => ({ ...prev, startAt: event.target.value }))}
          />
          <Input
            type="datetime-local"
            value={form.endAt}
            onChange={(event) => setForm((prev) => ({ ...prev, endAt: event.target.value }))}
          />
          <Input
            type="datetime-local"
            value={form.reminderAt}
            onChange={(event) => setForm((prev) => ({ ...prev, reminderAt: event.target.value }))}
          />

          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={visibility}
            onChange={(event) => setVisibility(event.target.value as Visibility)}
          >
            <option value="ALL">All Users</option>
            <option value="STUDENT">Students Only</option>
            <option value="LECTURER">Lecturers Only</option>
            <option value="CUSTOM">Custom Users</option>
          </select>

          {visibility === 'CUSTOM' && (
            <div className="md:col-span-2 border rounded-md p-3 space-y-2 max-h-44 overflow-y-auto">
              {eligibleTargets.length === 0 ? (
                <p className="text-sm text-muted-foreground">No target users available.</p>
              ) : (
                eligibleTargets.map((recipient) => {
                  const checked = selectedTargetUsers.includes(recipient.userId)
                  return (
                    <label key={recipient.userId} className="flex items-center justify-between gap-3 text-sm">
                      <span>
                        {recipient.firstName} {recipient.lastName} ({recipient.role})
                      </span>
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(value) => {
                          setSelectedTargetUsers((prev) => {
                            if (value) return [...prev, recipient.userId]
                            return prev.filter((id) => id !== recipient.userId)
                          })
                        }}
                      />
                    </label>
                  )
                })
              )}
            </div>
          )}

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={form.isActive}
              onCheckedChange={(value) => setForm((prev) => ({ ...prev, isActive: Boolean(value) }))}
            />
            Event is active
          </label>

          <div className="md:col-span-2 flex justify-end">
            <Button onClick={handleCreate} disabled={creating || updating} variant="premium" className="rounded-xl px-6">
              <Plus className="mr-2 h-4 w-4" />
              {creating ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl">
        <CardHeader>
          <CardTitle>Calendar Events</CardTitle>
          <CardDescription>Manage visibility, reminders, and active status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events created yet.</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold">{event.title}</p>
                    <Badge variant="glass">{event.visibility}</Badge>
                    <Badge variant="glass">{event.isActive ? 'ACTIVE' : 'INACTIVE'}</Badge>
                  </div>
                  {event.description && <p className="text-sm text-muted-foreground mt-1">{event.description}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    Starts: {new Date(event.startAt).toLocaleString()} | Ends: {event.endAt ? new Date(event.endAt).toLocaleString() : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Reminder: {event.reminderAt ? new Date(event.reminderAt).toLocaleString() : 'N/A'}
                  </p>
                  {event.targetUserIds.length > 0 && (
                    <p className="text-xs text-muted-foreground">Custom targets: {event.targetUserIds.join(', ')}</p>
                  )}
                </div>

                <Button variant="outline" onClick={() => toggleActive(event.id, event.isActive)} disabled={updating}>
                  {event.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
