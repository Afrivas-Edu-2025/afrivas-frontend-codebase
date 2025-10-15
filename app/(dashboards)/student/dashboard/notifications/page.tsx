import { Bell, Calendar, FileText, GraduationCap, Info, MessageSquare, Settings } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-500">Stay updated with your academic activities</p>
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
          <GraduationCap size={14} />
          Academic
        </button>
        <button className="px-3 py-1 text-sm border rounded-md flex items-center gap-1">
          <FileText size={14} />
          Assignments
        </button>
        <button className="px-3 py-1 text-sm border rounded-md flex items-center gap-1">
          <Calendar size={14} />
          Events
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
      case "academic":
        return <GraduationCap className="h-5 w-5 text-blue-600" />
      case "assignment":
        return <FileText className="h-5 w-5 text-amber-600" />
      case "event":
        return <Calendar className="h-5 w-5 text-green-600" />
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
    type: "assignment",
    title: "Assignment Due Reminder",
    message: "Your 'Data Structures' assignment is due tomorrow at 11:59 PM.",
    time: "2 hours ago",
    unread: true,
    action: "View Assignment",
  },
  {
    id: 2,
    type: "message",
    title: "New Message from Professor Smith",
    message: "I've reviewed your draft and left some comments for you to address.",
    time: "4 hours ago",
    unread: true,
    action: "Read Message",
  },
]

const yesterdayNotifications = [
  {
    id: 3,
    type: "academic",
    title: "Grade Posted",
    message: "Your grade for 'Introduction to Computer Science' midterm has been posted.",
    time: "Yesterday, 3:45 PM",
    unread: false,
    action: "View Grade",
  },
  {
    id: 4,
    type: "event",
    title: "Event Reminder",
    message: "The 'Career Fair' event is scheduled for next Monday at 10:00 AM.",
    time: "Yesterday, 10:30 AM",
    unread: false,
    action: "Add to Calendar",
  },
]

const earlierNotifications = [
  {
    id: 5,
    type: "info",
    title: "System Maintenance",
    message: "The student portal will be undergoing maintenance this weekend.",
    time: "3 days ago",
    unread: false,
  },
  {
    id: 6,
    type: "academic",
    title: "Course Registration Open",
    message: "Registration for next semester courses is now open.",
    time: "5 days ago",
    unread: false,
    action: "Register Now",
  },
]
