'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AlertTriangle, Bell, GraduationCap, Info, MessageSquare, RefreshCw, Settings, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/auth-context'
import {
  useGetAdminCalendarEventsQuery,
  useGetAdminMessagesQuery,
  useGetUsersQuery,
} from '@/services/adminApi'
import { getAdminDashboardSettings, getDefaultAdminSettings } from '@/lib/admin-dashboard-settings'
import { connectRealtimeSocket } from '@/lib/socket/realtime-client'

type NotificationType = 'system' | 'user' | 'academic' | 'message' | 'info'
type NotificationFilter = 'ALL' | 'SYSTEM' | 'USERS' | 'ACADEMIC' | 'MESSAGES'

type NotificationItemModel = {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: string
  unread: boolean
  actionLabel?: string
  actionHref?: string
}

const keyForReadNotifications = (userId: string | number) => `admin_read_notifications_${String(userId)}`

const toDate = (value?: string | null): Date => {
  const date = value ? new Date(value) : new Date()
  return Number.isNaN(date.getTime()) ? new Date() : date
}

const formatTimeAgo = (value: string): string => {
  const date = toDate(value)
  const diffMs = Date.now() - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / minute))}m ago`
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`
  if (diffMs < day * 7) return `${Math.floor(diffMs / day)}d ago`
  return date.toLocaleDateString()
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('ALL')
  const [readIds, setReadIds] = useState<string[]>([])

  const { data: messagesResponse, isLoading: loadingMessages, refetch: refetchMessages } = useGetAdminMessagesQuery()
  const { data: eventsResponse, isLoading: loadingEvents, refetch: refetchEvents } = useGetAdminCalendarEventsQuery()
  const { data: usersResponse, isLoading: loadingUsers, refetch: refetchUsers } = useGetUsersQuery({})

  const settings = useMemo(
    () =>
      getAdminDashboardSettings(user?.id, {
        institutionName: user?.universityName || user?.username || 'Afrivas University',
      }) || getDefaultAdminSettings(),
    [user?.id, user?.universityName, user?.username],
  )

  useEffect(() => {
    if (!user?.id) return
    const raw = localStorage.getItem(keyForReadNotifications(user.id))
    if (!raw) {
      setReadIds([])
      return
    }
    try {
      const parsed = JSON.parse(raw) as string[]
      setReadIds(Array.isArray(parsed) ? parsed : [])
    } catch {
      setReadIds([])
    }
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) return
    localStorage.setItem(keyForReadNotifications(user.id), JSON.stringify(readIds))
  }, [readIds, user?.id])

  useEffect(() => {
    let cleanup = () => {}
    let cancelled = false

    const setup = async () => {
      const socket = await connectRealtimeSocket()
      if (!socket || cancelled) return

      const onMessage = () => {
        refetchMessages()
      }

      const onCalendar = () => {
        refetchEvents()
      }

      socket.on('message:new', onMessage)
      socket.on('calendar:event:new', onCalendar)
      socket.on('calendar:event:update', onCalendar)

      cleanup = () => {
        socket.off('message:new', onMessage)
        socket.off('calendar:event:new', onCalendar)
        socket.off('calendar:event:update', onCalendar)
      }
    }

    setup()
    return () => {
      cancelled = true
      cleanup()
    }
  }, [refetchEvents, refetchMessages])

  const messageNotifications = useMemo(() => {
    if (!settings.enableMessageNotifications) return []
    const rows = messagesResponse?.data || []
    return rows.slice(0, 30).map((message) => ({
      id: `message:${message.id}`,
      type: 'message' as const,
      title: message.subject || 'New direct message',
      message: `To ${message.recipientEmail}: ${message.body}`,
      createdAt: message.createdAt,
      unread: !readIds.includes(`message:${message.id}`),
      actionLabel: 'Open Messages',
      actionHref: '/admin/messages',
    }))
  }, [messagesResponse?.data, readIds, settings.enableMessageNotifications])

  const eventNotifications = useMemo(() => {
    if (!settings.enableCalendarNotifications) return []
    const rows = eventsResponse?.data || []
    return rows.slice(0, 30).map((event) => ({
      id: `event:${event.id}`,
      type: 'academic' as const,
      title: `Calendar event: ${event.title}`,
      message: `Starts ${toDate(event.startAt).toLocaleString()} (${event.visibility})`,
      createdAt: event.updatedAt || event.createdAt,
      unread: !readIds.includes(`event:${event.id}`),
      actionLabel: 'Open Calendar',
      actionHref: '/admin/calendar',
    }))
  }, [eventsResponse?.data, readIds, settings.enableCalendarNotifications])

  const userNotifications = useMemo(() => {
    if (!settings.enableUserNotifications) return []
    const rows = (usersResponse?.data || [])
      .slice()
      .sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime())
      .slice(0, 20)

    return rows.map((row) => ({
      id: `user:${row.id}`,
      type: 'user' as const,
      title: `New ${String(row.role || 'USER').toLowerCase()} account`,
      message: `${row.firstName || ''} ${row.lastName || ''}`.trim() || row.email || 'Unnamed user',
      createdAt: row.createdAt || new Date().toISOString(),
      unread: !readIds.includes(`user:${row.id}`),
      actionLabel: 'Open Users',
      actionHref: '/admin/users',
    }))
  }, [readIds, settings.enableUserNotifications, usersResponse?.data])

  const systemNotifications: NotificationItemModel[] = settings.enableSystemNotifications
    ? [
        {
          id: 'system:realtime-online',
          type: 'system',
          title: 'Realtime synchronization enabled',
          message: 'Message and calendar notifications now update automatically.',
          createdAt: new Date().toISOString(),
          unread: !readIds.includes('system:realtime-online'),
          actionLabel: 'Notification Settings',
          actionHref: '/admin/dashboard/settings',
        },
      ]
    : []

  const allNotifications = useMemo(
    () =>
      [...messageNotifications, ...eventNotifications, ...userNotifications, ...systemNotifications].sort(
        (a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime(),
      ),
    [eventNotifications, messageNotifications, userNotifications, systemNotifications],
  )

  const filteredNotifications = useMemo(() => {
    switch (activeFilter) {
      case 'SYSTEM':
        return allNotifications.filter((item) => item.type === 'system' || item.type === 'info')
      case 'USERS':
        return allNotifications.filter((item) => item.type === 'user')
      case 'ACADEMIC':
        return allNotifications.filter((item) => item.type === 'academic')
      case 'MESSAGES':
        return allNotifications.filter((item) => item.type === 'message')
      default:
        return allNotifications
    }
  }, [activeFilter, allNotifications])

  const unreadCount = allNotifications.filter((item) => item.unread).length
  const isLoading = loadingMessages || loadingEvents || loadingUsers

  const markAsRead = (id: string) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const markAllAsRead = () => {
    setReadIds(Array.from(new Set([...readIds, ...allNotifications.map((item) => item.id)])))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400">Live system, user, academic, and messaging updates.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { refetchMessages(); refetchEvents(); refetchUsers() }}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/dashboard/settings">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="glass">Unread: {unreadCount}</Badge>
        <Badge variant="outline">Total: {allNotifications.length}</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterButton icon={<Bell size={14} />} label="All" active={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} />
        <FilterButton icon={<AlertTriangle size={14} />} label="System" active={activeFilter === 'SYSTEM'} onClick={() => setActiveFilter('SYSTEM')} />
        <FilterButton icon={<Users size={14} />} label="Users" active={activeFilter === 'USERS'} onClick={() => setActiveFilter('USERS')} />
        <FilterButton icon={<GraduationCap size={14} />} label="Academic" active={activeFilter === 'ACADEMIC'} onClick={() => setActiveFilter('ACADEMIC')} />
        <FilterButton icon={<MessageSquare size={14} />} label="Messages" active={activeFilter === 'MESSAGES'} onClick={() => setActiveFilter('MESSAGES')} />
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading notifications...</p>
        ) : filteredNotifications.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No notifications for this filter.</p>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  )
}

function FilterButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`px-3 py-1 text-sm rounded-md border flex items-center gap-1 ${
        active ? 'bg-blue-600 text-white border-blue-600' : 'border-border hover:bg-muted/30'
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  )
}

function NotificationItem({
  notification,
  onMarkAsRead,
}: {
  notification: NotificationItemModel
  onMarkAsRead: (id: string) => void
}) {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'system':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'user':
        return <Users className="h-5 w-5 text-blue-600" />
      case 'academic':
        return <GraduationCap className="h-5 w-5 text-green-600" />
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-600" />
      case 'info':
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div
      className={`p-4 border rounded-lg flex items-start gap-3 ${
        notification.unread
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'
          : 'bg-white/40 dark:bg-slate-900/40'
      }`}
    >
      <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-700 flex-shrink-0">{getIcon(notification.type)}</div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium">{notification.title}</h3>
          <span className="text-xs text-gray-500">{formatTimeAgo(notification.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
        <div className="mt-2 flex items-center gap-4">
          {notification.actionHref && notification.actionLabel && (
            <Link
              href={notification.actionHref}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {notification.actionLabel}
            </Link>
          )}
          {notification.unread && (
            <button
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => onMarkAsRead(notification.id)}
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
      {notification.unread && <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2"></div>}
    </div>
  )
}
