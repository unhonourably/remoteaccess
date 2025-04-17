'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import LoginForm from '@/components/LoginForm'
import { SchoolSettings, Counselor } from '@/types'
import Link from 'next/link'
import ChatInterface from '@/components/Chat/ChatInterface'

// Icons for the sidebar
const icons = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  resources: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  counselors: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  emergency: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

interface UserStats {
  activeChats: number
  recentSessions: number
  resourcesAccessed: number
  upcomingAppointments: number
}

interface RecentChat {
  counselorEmail: string
  counselorName: string
  lastMessage: string
  timestamp: string
}

function GetHelpContent() {
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [settings, setSettings] = useState<SchoolSettings | null>(null)
  const [activeSection, setActiveSection] = useState('resources')
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null)
  const [userStats, setUserStats] = useState<UserStats>({
    activeChats: 0,
    recentSessions: 0,
    resourcesAccessed: 0,
    upcomingAppointments: 0
  })
  const [recentChats, setRecentChats] = useState<RecentChat[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const school = searchParams.get('school')

  // Redirect if user tries to access a different school's page
  useEffect(() => {
    if (!loading && user && school) {
      if (user.school !== school) {
        window.location.href = `/get-help?school=${encodeURIComponent(user.school)}`
      }
    }
  }, [user, school, loading])
  
  useEffect(() => {
    if (!school) return

    // Load school settings from JSON file
    fetch(`/api/schools/${school.toLowerCase().replace(' ', '-')}.json`)
      .then(res => res.json())
      .then(data => {
        // Remove counselors from settings as we'll fetch them separately
        const { counselors, ...rest } = data
        setSettings(rest)
        
        // Fetch counselors from accounts.json through API
        return fetch(`/api/schools/counselors?school=${encodeURIComponent(school)}`)
      })
      .then(res => res.json())
      .then(data => {
        setSettings(prev => {
          if (!prev) return prev
          return {
            ...prev,
            counselors: data.counselors
          }
        })
      })
      .catch(err => {
        setError('Failed to load school data')
        console.error('Error loading school data:', err)
      })
  }, [school])

  useEffect(() => {
    if (!user) return

    // Load user stats
    const loadStats = async () => {
      try {
        const response = await fetch(`/api/user/stats?userId=${user.id}`)
        const data = await response.json()
        setUserStats(data.stats)
      } catch (error) {
        setError('Failed to load user stats')
        console.error('Error loading user stats:', error)
      }
    }

    // Load recent chats
    const loadRecentChats = async () => {
      try {
        const response = await fetch(`/api/chat/recent?userId=${user.id}`)
        const data = await response.json()
        setRecentChats(data.chats)
      } catch (error) {
        setError('Failed to load recent chats')
        console.error('Error loading recent chats:', error)
      }
    }

    loadStats()
    loadRecentChats()

    // Poll for updates
    const statsInterval = setInterval(loadStats, 30000) // Every 30 seconds
    const chatsInterval = setInterval(loadRecentChats, 3000) // Every 3 seconds

    return () => {
      clearInterval(statsInterval)
      clearInterval(chatsInterval)
    }
  }, [user])

  if (!school) {
    if (!loading && user) {
      window.location.href = `/get-help?school=${encodeURIComponent(user.school)}`
      return null
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading School Information</h1>
          <p className="text-gray-600">Please wait while we redirect you to your school's support page.</p>
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoginForm 
          school={school} 
          onSuccess={() => {
            window.location.reload()
          }} 
        />
      </div>
    )
  }

  if (error || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">{error || 'Failed to load settings'}</p>
        </div>
      </div>
    )
  }

  const handleStartChat = (counselor: Counselor) => {
    setSelectedCounselor(counselor)
    setActiveSection('chat')
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* School Logo and Name */}
        <div className="p-4 border-b border-gray-100">
          <img 
            src={`/${school?.toLowerCase().split(' ')[1]}.${school?.toLowerCase().includes('south') ? 'jpg' : 'png'}`}
            alt={`${settings.name} logo`}
            className="h-16 w-auto mx-auto mb-2 object-contain"
          />
          <div className="text-center font-medium text-gray-900">
            {settings.name}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {[
            { id: 'home', label: 'Home' },
            { id: 'resources', label: 'Resources' },
            { id: 'counselors', label: 'Counselors' },
            { id: 'chat', label: 'Chat' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id)
                if (item.id === 'chat') setSelectedCounselor(null)
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${activeSection === item.id 
                  ? 'bg-red-50 text-red-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              {icons[item.id as keyof typeof icons]}
              {item.label}
            </button>
          ))}

          {/* Emergency Button */}
          <Link
            href="/emergency"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4"
          >
            {icons.emergency}
            Emergency Help
          </Link>
        </nav>

        {/* Recent Chats */}
        {recentChats.length > 0 && (
          <>
            <div className="px-2 py-3 border-t border-gray-100">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Recent Chats
              </h3>
              <div className="mt-2 space-y-1">
                {recentChats.map((chat) => {
                  // Find the full counselor details from settings
                  const counselor = settings?.counselors?.find(c => c.email === chat.counselorEmail)
                  if (!counselor) return null

                  return (
                    <button
                      key={chat.counselorEmail}
                      onClick={() => {
                        setSelectedCounselor(counselor)
                        setActiveSection('chat')
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="flex-1 truncate">
                        <div className="font-medium">{counselor.name}</div>
                        <div className="text-xs text-gray-500 truncate">{chat.lastMessage}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* User Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-medium text-red-600">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 pt-20">
        {activeSection === 'home' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
              <p className="text-gray-600 mt-2">Here's an overview of your support activities</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Active Chats */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Active Chats</h3>
                  <span className="p-2 bg-blue-50 rounded-full">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{userStats.activeChats}</p>
                <p className="mt-1 text-sm text-gray-500">Open conversations</p>
              </div>

              {/* Recent Support Sessions */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Recent Sessions</h3>
                  <span className="p-2 bg-green-50 rounded-full">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{userStats.recentSessions}</p>
                <p className="mt-1 text-sm text-gray-500">Sessions this month</p>
              </div>

              {/* Resources Accessed */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Resources Used</h3>
                  <span className="p-2 bg-purple-50 rounded-full">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{userStats.resourcesAccessed}</p>
                <p className="mt-1 text-sm text-gray-500">Resources accessed</p>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Scheduled</h3>
                  <span className="p-2 bg-yellow-50 rounded-full">
                    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{userStats.upcomingAppointments}</p>
                <p className="mt-1 text-sm text-gray-500">Upcoming appointments</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <div className="mt-4 space-y-4">
                  <div className="text-center text-gray-500 py-8">
                    No recent activity to display
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Chat */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Need to Talk?</h3>
                <p className="text-gray-600 mb-4">Connect with a counselor instantly through our chat system.</p>
                <button 
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                  onClick={() => setActiveSection('counselors')}
                >
                  Choose a Counselor
                </button>
              </div>

              {/* Schedule Meeting */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule a Meeting</h3>
                <p className="text-gray-600 mb-4">Book a face-to-face session with your counselor.</p>
                <button 
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                  onClick={() => {/* To be implemented */}}
                >
                  Schedule Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Section */}
        {activeSection === 'chat' && (
          <div className="max-w-4xl mx-auto">
            {selectedCounselor ? (
              <ChatInterface 
                counselor={selectedCounselor}
                onClose={() => {
                  setSelectedCounselor(null)
                }}
              />
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Conversations</h2>
                {recentChats.length > 0 ? (
                  <div className="grid gap-4">
                    {recentChats.map((chat) => {
                      const counselor = settings?.counselors?.find(c => c.email === chat.counselorEmail)
                      if (!counselor) return null

                      return (
                        <div 
                          key={chat.counselorEmail}
                          onClick={() => setSelectedCounselor(counselor)}
                          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-red-100 hover:cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{counselor.name}</h3>
                              <p className="text-sm text-gray-600">{counselor.title}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              Available
                            </div>
                          </div>
                          <div className="text-gray-600 text-sm">
                            <p className="line-clamp-2">{chat.lastMessage}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(chat.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                    <p className="text-gray-600">No recent conversations</p>
                    <button
                      onClick={() => setActiveSection('counselors')}
                      className="mt-4 text-red-600 hover:text-red-700 font-medium"
                    >
                      Start a new conversation
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeSection === 'counselors' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Counseling Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settings.counselors.map((counselor) => (
                <div 
                  key={counselor.email}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-red-100 transition-colors"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{counselor.name}</h3>
                  <p className="text-gray-600 mb-2">{counselor.title}</p>
                  {counselor.availability && counselor.availability.length > 0 && (
                    <p className="text-gray-500 text-sm mb-4">
                      Available: {counselor.availability.join(', ')}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartChat(counselor)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Start Chat
                    </button>
                    <a 
                      href={`mailto:${counselor.email}`}
                      className="px-4 py-2 border border-gray-200 rounded-md hover:border-red-200 hover:text-red-600 transition-colors"
                    >
                      Email
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'resources' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settings.resources.map((resource) => (
                <div 
                  key={resource.title}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:border-red-100 transition-colors"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <a 
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Learn More
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function GetHelpPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600" />
        </div>
      }
    >
      <GetHelpContent />
    </Suspense>
  )
} 