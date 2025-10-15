import { Search, Star, MoreVertical, Paperclip, Send, Mic } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-gray-500">Manage your conversations</p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          + New Message
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">All Messages</h2>
              <button>
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search or start a new chat"
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100%-80px)]">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${conversation.id === 1 ? "bg-gray-50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={conversation.avatar || "/placeholder.svg"}
                      alt={conversation.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{conversation.name}</h3>
                      <button className="text-gray-400 hover:text-blue-500">
                        <Star size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-400 flex items-center gap-1">{conversation.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden lg:col-span-2">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt="Professor Smith"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium">Professor Smith</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-blue-500">
                <Star size={18} />
              </button>
              <button className="text-gray-400 hover:text-blue-500">
                <Search size={18} />
              </button>
              <button className="text-gray-400 hover:text-blue-500">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100%-140px)]">
            <div className="space-y-4">
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm">Hello! How is your assignment coming along?</p>
                  <span className="text-xs text-gray-500 mt-1 block">10:30 AM</span>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm">
                    Hi Professor! I'm making good progress. Just had a question about the third section.
                  </p>
                  <span className="text-xs text-blue-200 mt-1 block">10:45 AM</span>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm">Sure, what's your question?</p>
                  <span className="text-xs text-gray-500 mt-1 block">10:47 AM</span>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm">
                    For the data analysis part, should we use the methods discussed in class or can we explore other
                    approaches?
                  </p>
                  <span className="text-xs text-blue-200 mt-1 block">10:50 AM</span>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm">
                    You're welcome to explore other approaches as long as you justify your choice in the methodology
                    section. Just make sure it's appropriate for the type of data you're analyzing.
                  </p>
                  <span className="text-xs text-gray-500 mt-1 block">11:00 AM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <button className="text-blue-500 p-2 rounded-full hover:bg-blue-50">
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                placeholder="Type your message here..."
                className="flex-1 px-4 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="text-blue-500 p-2 rounded-full hover:bg-blue-50">
                <Mic size={20} />
              </button>
              <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const conversations = [
  {
    id: 1,
    name: "Professor Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "You're welcome to explore other approaches...",
    time: "Today | 11:00 AM",
    unread: false,
  },
  {
    id: 2,
    name: "Study Group - CS101",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "When are we meeting for the project?",
    time: "Today | 09:15 AM",
    unread: true,
  },
  {
    id: 3,
    name: "Academic Advisor",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Your course registration has been approved",
    time: "Yesterday | 03:30 PM",
    unread: false,
  },
  {
    id: 4,
    name: "Library Services",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Your requested books are now available",
    time: "Yesterday | 10:45 AM",
    unread: false,
  },
]
