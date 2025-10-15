import { Bell, Calendar, FileText, Info, MessageSquare, Settings, Users } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-500">Stay updated with your teaching activities</p>
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
          <Users size={14} />
          Students
        </button>
        <button className="px-3 py-1 text-sm border rounded-md flex items-center gap-1">
          <FileText size={14} />
          Assignments
        </button>
        <button className="px-3 py-1 text-sm border rounded-md flex items-center gap-1">
          <Calendar size={14} />
          Schedule
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
      case "student":
        return <Users className="h-5 w-5 text-blue-600" />
      case "assignment":
        return <FileText className="h-5 w-5 text-amber-600" />
      case "schedule":
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
    title: "New Assignment Submissions",
    message: "5 students have submitted their assignments for 'Advanced Programming'.",
    time: "1 hour ago",
    unread: true,
    action: "Review Submissions",
  },
  {
    id: 2,
    type: "student",
    title: "Student Request",
    message: "Alex Johnson has requested an extension for the upcoming project.",
    time: "3 hours ago",
    unread: true,
    action: "Respond to Request",
  },
]

const yesterdayNotifications = [
  {
    id: 3,
    type: "schedule",
    title: "Class Rescheduled",
    message: "Your 'Data Structures' class on Friday has been moved to Room 302.",
    time: "Yesterday, 2:15 PM",
    unread: false,
    action: "View Schedule",
  },
  {
    id: 4,
    type: "message",
    title: "Department Meeting",
    message: "Reminder: Faculty meeting tomorrow at 9:00 AM in the conference room.",
    time: "Yesterday, 11:30 AM",
    unread: false,
    action: "Add to Calendar",
  },
]

const earlierNotifications = [
  {
    id: 5,
    type: "info",
    title: "Grading System Update",
    message: "The online grading system has been updated with new features.",
    time: "3 days ago",
    unread: false,
    action: "Learn More",
  },
  {
    id: 6,
    type: "student",
    title: "Student Performance Alert",
    message: "Three students in your 'Web Development' class are at risk of failing.",
    time: "5 days ago",
    unread: false,
    action: "View Student Records",
  },
]
