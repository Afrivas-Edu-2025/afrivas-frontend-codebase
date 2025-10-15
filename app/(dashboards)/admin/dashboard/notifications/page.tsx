import { Bell, GraduationCap, Info, MessageSquare, Settings, Users, AlertTriangle } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-500">System and administrative alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm border rounded-md">Mark all as read</button>
          <button className="px-3 py-1 text-sm border rounded-md flex items-center gap-1">
            <Settings size={14} />
            Settings
          </button>
        </div>
      </div>

      {/* Notification Filters */}
      <div className="flex flex-wrap gap-2">
        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">All</button>
        <button className="px-3 py-1 text-sm border rounded-md flex items-center gap-1">
          <AlertTriangle size={14} />
          System
        </button>
        <button className="px-3 py-1 text-sm border rounded-md flex items-center gap-1">
          <Users size={14} />
          Users
        </button>
        <button className="px-3 py-1 text-sm border rounded-md flex items-center gap-1">
          <GraduationCap size={14} />
          Academic
        </button>
        <button className="px-3 py-1 text-sm border rounded-md flex items-center gap-1">
          <MessageSquare size={14} />
          Messages
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-gray-500">Today</h2>
        <div className="space-y-2">
          {todayNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>

        <h2 className="text-sm font-medium text-gray-500 pt-4">Yesterday</h2>
        <div className="space-y-2">
          {yesterdayNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>

        <h2 className="text-sm font-medium text-gray-500 pt-4">Earlier</h2>
        <div className="space-y-2">
          {earlierNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    </div>
  )
}

function NotificationItem({ notification }) {
  const getIcon = (type) => {
    switch (type) {
      case "system":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "user":
        return <Users className="h-5 w-5 text-blue-600" />
      case "academic":
        return <GraduationCap className="h-5 w-5 text-green-600" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-purple-600" />
      case "info":
        return <Info className="h-5 w-5 text-gray-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div
      className={`p-4 border rounded-lg flex items-start gap-3 ${
        notification.unread
          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
          : "bg-white dark:bg-gray-800"
      }`}
    >
      <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-700 flex-shrink-0">{getIcon(notification.type)}</div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h3 className="font-medium">{notification.title}</h3>
          <span className="text-xs text-gray-500">{notification.time}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
        {notification.action && (
          <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            {notification.action}
          </button>
        )}
      </div>
      {notification.unread && <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>}
    </div>
  )
}

const todayNotifications = [
  {
    id: 1,
    type: "system",
    title: "System Alert",
    message: "Database backup completed successfully. All systems operational.",
    time: "30 minutes ago",
    unread: true,
    action: "View Details",
  },
  {
    id: 2,
    type: "user",
    title: "New User Registrations",
    message: "15 new student accounts were created today.",
    time: "2 hours ago",
    unread: true,
    action: "Review Accounts",
  },
]

const yesterdayNotifications = [
  {
    id: 3,
    type: "academic",
    title: "Course Catalog Update",
    message: "The course catalog for the upcoming semester has been finalized.",
    time: "Yesterday, 4:30 PM",
    unread: false,
    action: "View Catalog",
  },
  {
    id: 4,
    type: "system",
    title: "Maintenance Completed",
    message: "Scheduled system maintenance has been completed successfully.",
    time: "Yesterday, 9:15 AM",
    unread: false,
  },
]

const earlierNotifications = [
  {
    id: 5,
    type: "info",
    title: "Policy Update",
    message: "The academic integrity policy has been updated. Please review the changes.",
    time: "3 days ago",
    unread: false,
    action: "View Policy",
  },
  {
    id: 6,
    type: "message",
    title: "Department Heads Meeting",
    message: "Minutes from the last department heads meeting are now available.",
    time: "5 days ago",
    unread: false,
    action: "View Minutes",
  },
]
