'use client'

import { useState } from 'react'
import { Search, Star, MoreVertical, Paperclip, Send, Mic, MessageSquare, Plus, Filter, Radio } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { cn } from "@/lib/utils"

export default function LecturerMessagesPage() {
  const [activeTab, setActiveTab] = useState(1)

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-3 py-1 mb-2 rounded-full bg-primary-100/10 border border-primary-100/20">
            <span className="text-primary-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3" />
              Lecturer Inbox
            </span>
          </div>
          <TextGenerateEffect
            words="Messenger Inbox"
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          />
          <p className="text-muted-foreground font-medium mt-1">Manage student inquiries and department chats</p>
        </div>
        <Button variant="premium" className="rounded-xl px-6 py-5 shadow-neon-primary group">
          <Radio className="mr-2 h-4 w-4 group-hover:animate-pulse" />
          Broadcast Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[600px]">
        {/* Sidebar: Conversations List */}
        <Card className="lg:col-span-1 border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl flex flex-col overflow-hidden">
          <CardHeader className="p-4 border-b border-white/10 dark:border-slate-800/50 bg-white/10 dark:bg-slate-900/10">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg font-bold uppercase tracking-widest text-primary-100">All Messages</CardTitle>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary-100 transition-colors" />
              </div>
              <Input
                placeholder="Search candidates..."
                className="pl-10 h-10 rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700 focus:ring-primary-100 focus:border-primary-100 transition-all text-sm"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-primary-100/20">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setActiveTab(conversation.id)}
                className={cn(
                  "p-4 border-b border-white/5 dark:border-slate-800/30 cursor-pointer transition-all duration-300 group relative",
                  activeTab === conversation.id
                    ? "bg-primary-100/10 dark:bg-primary-100/5"
                    : "hover:bg-white/30 dark:hover:bg-slate-800/30"
                )}
              >
                {activeTab === conversation.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-100 shadow-neon-primary" />
                )}
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 dark:border-slate-700 p-0.5 shadow-sm">
                      <img
                        src={conversation.avatar || "/placeholder.svg"}
                        alt={conversation.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={cn(
                        "font-bold truncate text-sm tracking-tight",
                        activeTab === conversation.id ? "text-primary-100" : "text-gray-900 dark:text-gray-100"
                      )}>
                        {conversation.name}
                      </h3>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-80">{conversation.time.split('|')[1].trim()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate font-medium mt-0.5">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 border-white/20 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl flex flex-col shadow-2xl overflow-hidden">
          {/* Chat Header */}
          <CardHeader className="p-4 border-b border-white/10 dark:border-slate-800/50 flex flex-row items-center justify-between bg-white/10 dark:bg-slate-900/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border-2 border-primary-100/30 p-0.5">
                <img
                  src={conversations[0].avatar}
                  alt="Chat active user"
                  className="w-full h-full object-cover rounded-full shadow-sm"
                />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">{conversations[0].name}</CardTitle>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50 animate-pulse" />
                  <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20 text-muted-foreground">
                <Search size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20 text-muted-foreground">
                <Star size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20 text-muted-foreground">
                <MoreVertical size={18} />
              </Button>
            </div>
          </CardHeader>

          {/* Messages List */}
          <CardContent className="p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin scrollbar-thumb-primary-100/20 bg-gradient-to-b from-transparent to-primary-100/5">
            <div className="flex justify-center">
              <Badge variant="glass" className="py-1 px-4">Last Modified: Today</Badge>
            </div>

            <div className="flex justify-start items-end gap-2 group">
              <div className="w-8 h-8 rounded-full flex-shrink-0 border border-white/20">
                <img src={conversations[0].avatar} className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl rounded-bl-none p-3 shadow-lg border border-white/30 dark:border-slate-700/50 max-w-[70%]">
                <p className="text-sm font-medium leading-relaxed">Oh, hello! All perfectly. I've reviewed your thesis draft.</p>
                <p className="text-sm font-medium leading-relaxed mt-1">I will check it and get back to you with detailed feedback soon.</p>
                <span className="text-[9px] font-bold text-muted-foreground mt-2 block uppercase tracking-widest text-right">04:45 PM</span>
              </div>
            </div>

            <div className="flex justify-end group">
              <div className="bg-gradient-to-br from-primary-100 to-primary-100/90 text-white rounded-2xl rounded-br-none p-3 shadow-neon-primary max-w-[70%]">
                <p className="text-sm font-semibold leading-relaxed">Thank you, Professor! I appreciate the quick response. Looking forward to your notes.</p>
                <span className="text-[9px] font-bold text-primary-100/100 brightness-150 mt-2 block uppercase tracking-widest">04:50 PM • Read</span>
              </div>
            </div>

            <div className="flex justify-start items-end gap-2 group">
              <div className="w-8 h-8 rounded-full flex-shrink-0 border border-white/20">
                <img src={conversations[0].avatar} className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl rounded-bl-none p-4 shadow-lg border border-white/30 dark:border-slate-700/50 max-w-[70%] w-full">
                <div className="flex items-center gap-3 mb-2">
                  <Button size="icon" className="w-8 h-8 rounded-full bg-primary-100 shadow-neon-primary hover:scale-110 transition-transform">
                    <Mic size={14} className="text-white" />
                  </Button>
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-primary-100 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">01:24</span>
                </div>
                <span className="text-[9px] font-bold text-muted-foreground block uppercase tracking-widest text-right">04:55 PM</span>
              </div>
            </div>
          </CardContent>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/10 dark:border-slate-800/50 bg-white/20 dark:bg-slate-900/20 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3 max-w-4xl mx-auto">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary-100/10 text-primary-100 flex-shrink-0">
                <Paperclip size={20} />
              </Button>
              <div className="relative flex-1 group">
                <Input
                  placeholder="Type your message here..."
                  className="h-12 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700 rounded-2xl focus:ring-primary-100 focus:border-primary-100 transition-all font-medium pr-12"
                />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1 bottom-1 h-10 w-10 text-muted-foreground hover:text-primary-100 rounded-xl">
                  <Mic size={18} />
                </Button>
              </div>
              <Button variant="premium" size="icon" className="h-12 w-12 rounded-2xl shadow-neon-primary shrink-0 transition-transform active:scale-95">
                <Send size={18} className="translate-x-0.5 -translate-y-0.5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

const conversations = [
  {
    id: 1,
    name: "Ammi Watts",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ammi",
    lastMessage: "Hello! Did you finish the DFD requirements?",
    time: "Today | 09:30 PM",
    unread: false,
  },
  {
    id: 2,
    name: "Aleisha Barrie",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aleisha",
    lastMessage: "Please forward the notes to Mr Abdulai",
    time: "Today | 02:15 PM",
    unread: false,
  },
  {
    id: 3,
    name: "David Elson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    lastMessage: "Hey! Did you finish the Hi-Fi wireframes?",
    time: "Today | 11:30 AM",
    unread: false,
  },
  {
    id: 4,
    name: "Mary Freund",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mary",
    lastMessage: "Hey! Did you finish the project overview?",
    time: "Today | 10:11 AM",
    unread: false,
  },
]
