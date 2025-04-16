'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import ChatInterface from '@/components/Chat/ChatInterface'

interface Chat {
  userId: string
  counselorEmail: string
  messages: Array<{
    id: string
    content: string
    timestamp: string
    isUser: boolean
  }>
}

export default function CounselorPage() {
  const { user } = useAuth()
  const [activeChats, setActiveChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadChats = async () => {
      try {
        const response = await fetch(`/api/counselor/chats?counselorEmail=${user.email}`)
        const data = await response.json()
        setActiveChats(data.chats || [])
      } catch (error) {
        console.error('Error loading chats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadChats()
    // Poll for new messages every 3 seconds
    const interval = setInterval(loadChats, 3000)
    return () => clearInterval(interval)
  }, [user])

  if (!user || user.role !== 'counselor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You must be logged in as a counselor to view this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Chat List */}
          <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Chats</h2>
            {activeChats.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active chats</p>
            ) : (
              <div className="space-y-2">
                {activeChats.map((chat) => {
                  const lastMessage = chat.messages[chat.messages.length - 1]
                  return (
                    <button
                      key={chat.userId}
                      onClick={() => setSelectedChat(chat.userId)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedChat === chat.userId
                          ? 'bg-red-50 text-red-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-gray-900">Student {chat.userId}</div>
                      {lastMessage && (
                        <div className="text-sm text-gray-500 truncate">
                          {lastMessage.content}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        {lastMessage
                          ? new Date(lastMessage.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'No messages'}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Chat Window */}
          <div className="flex-1">
            {selectedChat ? (
              <ChatInterface
                counselor={{
                  name: user.name,
                  email: user.email,
                  title: 'School Counselor'
                }}
                userId={selectedChat}
                isCounselor={true}
                onClose={() => setSelectedChat(null)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Chat</h3>
                <p className="text-gray-600">Choose a student chat from the list to start messaging.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 