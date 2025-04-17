'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import ChatInterface from '@/components/Chat/ChatInterface'
import Image from 'next/image'

type Message = {
  id: string
  content: string
  timestamp: string
  isUser: boolean
}

interface Chat {
  userId: string
  counselorEmail: string
  messages: Message[]
}

interface CounselorStats {
  activeChats: number
  totalStudentsHelped: number
  averageResponseTime: string
  upcomingAppointments: number
}

const DEFAULT_STATS: CounselorStats = {
  activeChats: 0,
  totalStudentsHelped: 0,
  averageResponseTime: '0m',
  upcomingAppointments: 0
}

const StatCard = ({ icon, color, label, value }: { 
  icon: React.ReactNode
  color: string
  label: string
  value: string | number 
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-red-200 transition-colors">
    <div className="flex items-center gap-4">
      <div className={`p-3 bg-${color}-50 rounded-lg`}>
        <div className={`w-6 h-6 text-${color}-600`}>{icon}</div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
)

const ChatListItem = ({ 
  chat, 
  isSelected, 
  onClick 
}: { 
  chat: Chat
  isSelected: boolean
  onClick: () => void 
}) => {
  const lastMessage = chat.messages[chat.messages.length - 1]
  
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-colors ${
        isSelected
          ? 'bg-red-50 border border-red-100'
          : 'hover:bg-gray-50 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">
            {chat.userId[0].toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
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
        </div>
        {isSelected && (
          <div className="w-2 h-2 rounded-full bg-red-500" />
        )}
      </div>
    </button>
  )
}

export default function CounselorPortalPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeChats, setActiveChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<CounselorStats>(DEFAULT_STATS)

  useEffect(() => {
    if (!user) return
    if (user.role !== 'counselor') {
      router.push('/')
      return
    }

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

    const loadStats = async () => {
      try {
        const response = await fetch(`/api/counselor/stats?counselorEmail=${user.email}`)
        const data = await response.json()
        setStats(data.stats)
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    loadChats()
    loadStats()

    const chatsInterval = setInterval(loadChats, 3000)
    const statsInterval = setInterval(loadStats, 30000)

    return () => {
      clearInterval(chatsInterval)
      clearInterval(statsInterval)
    }
  }, [user, router])

  if (!user || user.role !== 'counselor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only counselors can access this portal.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600" />
      </div>
    )
  }

  const statsConfig = [
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'red',
      label: 'Active Chats',
      value: stats.activeChats
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'green',
      label: 'Students Helped',
      value: stats.totalStudentsHelped
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'blue',
      label: 'Avg. Response Time',
      value: stats.averageResponseTime
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'purple',
      label: 'Upcoming Appointments',
      value: stats.upcomingAppointments
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Top Banner */}
      <div className="bg-white border-b border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Image
                src="/bigparkway.png"
                alt="Parkway Schools"
                width={160}
                height={40}
                className="h-10 w-auto"
              />
              <div className="h-6 w-px bg-gray-200" />
              <h1 className="text-xl font-bold text-gray-900">Counselor Portal</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">{user.school}</div>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-red-600">
                    {user.name[0]}
                  </span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-gray-500">Counselor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsConfig.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="flex gap-8">
          {/* Chat List */}
          <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Active Chats</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your student conversations</p>
            </div>
            <div className="p-4">
              {activeChats.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No active chats</p>
                  <p className="text-sm text-gray-400 mt-1">Students will appear here when they start a conversation</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeChats.map((chat) => (
                    <ChatListItem
                      key={chat.userId}
                      chat={chat}
                      isSelected={selectedChat === chat.userId}
                      onClick={() => setSelectedChat(chat.userId)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Interface or Welcome Screen */}
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="max-w-lg mx-auto text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">Welcome to Your Portal</h3>
                  <div className="space-y-4 text-gray-600">
                    <p>Select a student chat from the list to start messaging.</p>
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <p className="font-medium text-gray-900 mb-2">Quick Tips:</p>
                      <ul className="text-sm space-y-2 text-left list-disc list-inside">
                        <li>Respond promptly to new messages</li>
                        <li>Use a professional and supportive tone</li>
                        <li>Document important conversations</li>
                        <li>Follow up with students regularly</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 