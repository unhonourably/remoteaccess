'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

interface Counselor {
  name: string
  email: string
  title: string
  availability?: string[]
}

interface Message {
  id: string
  content: string
  userId: string
  counselorEmail: string
  timestamp: string
  isUser: boolean
}

interface ChatResponse {
  chats: Array<{
    userId: string
    counselorEmail: string
    messages: Message[]
  }>
}

interface ChatInterfaceProps {
  counselor: Counselor
  userId?: string // Optional for counselor view
  isCounselor?: boolean // To differentiate between student and counselor views
  onClose?: () => void
}

export default function ChatInterface({ counselor, userId, isCounselor, onClose }: ChatInterfaceProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const pollInterval = useRef<NodeJS.Timeout>()
  const lastMessageTimestamp = useRef<string>('')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load existing messages
  useEffect(() => {
    if (!user) return
    const chatUserId = isCounselor ? userId : user.id

    if (!chatUserId) return

    const loadMessages = async () => {
      try {
        const params = new URLSearchParams({
          userId: chatUserId,
          counselorEmail: counselor.email
        })

        const response = await fetch(`/api/chat?${params}`)
        const data: ChatResponse = await response.json()
        
        if (data.chats && data.chats.length > 0) {
          const newMessages = data.chats[0].messages
          
          // Update messages, ensuring proper order
          setMessages(prevMessages => {
            const messageMap = new Map([...prevMessages, ...newMessages].map(msg => [msg.id, msg]))
            return Array.from(messageMap.values()).sort((a, b) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            )
          })

          // Update last message timestamp for next poll if we have messages
          if (newMessages.length > 0) {
            const timestamps = newMessages.map(msg => new Date(msg.timestamp).getTime())
            lastMessageTimestamp.current = new Date(Math.max(...timestamps)).toISOString()
          }
        }
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Initial load
    loadMessages()

    // Set up polling for new messages
    pollInterval.current = setInterval(loadMessages, 1000)

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current)
      }
    }
  }, [user, counselor.email, userId, isCounselor])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    const chatUserId = isCounselor ? userId : user.id
    if (!chatUserId) return

    const messageToSend = newMessage.trim()
    setNewMessage('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: chatUserId,
          counselorEmail: counselor.email,
          message: messageToSend,
          isUser: !isCounselor
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      // Add the new message to the UI
      setMessages(prev => {
        const newMessages = [...prev, data.message]
        return newMessages.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
      })
      
      // Update last message timestamp
      lastMessageTimestamp.current = data.message.timestamp
      
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 2000)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-sm border border-gray-100 items-center justify-center">
        <p className="text-gray-600">Please log in to use the chat.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-sm border border-gray-100 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        <p className="mt-4 text-gray-600">Loading chat...</p>
      </div>
    )
  }

  const chatTitle = isCounselor 
    ? `Chat with Student ${userId}`
    : `Chat with ${counselor.name}`

  const chatSubtitle = isCounselor
    ? 'Counselor View'
    : counselor.title

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div>
            <h2 className="font-semibold text-gray-900">{chatTitle}</h2>
            <p className="text-sm text-gray-500">{chatSubtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {isTyping ? 'Typing...' : 'Online'}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${(message.isUser && !isCounselor) || (!message.isUser && isCounselor) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  (message.isUser && !isCounselor) || (!message.isUser && isCounselor)
                    ? 'bg-red-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${(message.isUser && !isCounselor) || (!message.isUser && isCounselor) ? 'text-red-100' : 'text-gray-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Type your message...`}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
} 