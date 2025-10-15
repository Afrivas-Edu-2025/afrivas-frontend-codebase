import { Search, Star, MoreVertical, Paperclip, Send, Mic } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Messenger Inbox</h1>
          <p className="text-gray-500">Manage your chats</p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          + Broadcast Message
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
                  alt="Ammi Watts"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium">Ammi Watts</h3>
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
                  <p className="text-sm">Oh, hello! All perfectly.</p>
                  <p className="text-sm">I will check it and get back to you soon</p>
                  <span className="text-xs text-gray-500 mt-1 block">04:45 PM</span>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm">Oh, hello! All perfectly.</p>
                  <p className="text-sm">I will check it and get back to you soon</p>
                  <span className="text-xs text-blue-200 mt-1 block">04:45 PM</span>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm">Oh, hello! All perfectly.</p>
                  <p className="text-sm">I will check it and get back to you soon</p>
                  <span className="text-xs text-gray-500 mt-1 block">04:45 PM</span>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm">Oh, hello! All perfectly.</p>
                  <p className="text-sm">I will check it and get back to you soon</p>
                  <span className="text-xs text-blue-200 mt-1 block">04:45 PM</span>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <Mic size={16} />
                    </div>
                    <div className="flex-1 h-6 bg-gray-200 rounded-full relative">
                      <div className="absolute inset-0 flex items-center px-3">
                        <div className="w-full h-1 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">01:24</span>
                  </div>
                  <span className="text-xs text-gray-500 block">04:45 PM</span>
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
    name: "Ammi Watts",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hello! Did you finish the DFD requirements?",
    time: "Today | 09:30 PM",
    unread: false,
  },
  {
    id: 2,
    name: "Aleisha Barrie",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Please forward the notes to Mr Abdulai",
    time: "Today | 02:15 PM",
    unread: false,
  },
  {
    id: 3,
    name: "David Elson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
    time: "Today | 11:30 AM",
    unread: false,
  },
  {
    id: 4,
    name: "Mary Freund",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
    time: "Today | 10:11 AM",
    unread: false,
  },
]
