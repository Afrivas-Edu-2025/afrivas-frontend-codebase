"use client"

import { useState } from "react"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function TopBar() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New assignment posted",
      description: "A new assignment has been posted in Mathematics",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Upcoming exam",
      description: "Reminder: Physics exam scheduled for next week",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "Grade updated",
      description: "Your grade for English Literature has been updated",
      time: "Yesterday",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search..."
          className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
        />
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Mark all as read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start p-3 cursor-pointer ${notification.read ? "opacity-70" : "bg-blue-50 dark:bg-blue-900/20"}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between w-full">
                    <span className="font-medium">{notification.title}</span>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 ml-2 mt-1.5"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.description}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-2">{notification.time}</span>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm text-blue-600 dark:text-blue-400">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Help</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 dark:text-red-400">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
