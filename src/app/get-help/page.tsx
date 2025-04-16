'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import LoginForm from '@/components/LoginForm'
import { SchoolSettings } from '@/types'

export default function GetHelpPage() {
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [settings, setSettings] = useState<SchoolSettings | null>(null)
  
  const school = searchParams.get('school')
  
  useEffect(() => {
    if (!school) return

    // Load school settings from JSON file
    fetch(`/api/schools/${school.toLowerCase().replace(' ', '-')}.json`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Error loading school settings:', err))
  }, [school])

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">School Not Found</h1>
          <p className="text-gray-600">Please select your school from the home page.</p>
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
            // Reload settings after login
            window.location.reload()
          }} 
        />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading School Resources</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{settings.name} Resources</h1>
          <p className="text-gray-600">Welcome, {user.email}</p>
        </div>

        {/* Counselors Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Counseling Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settings.counselors.map((counselor) => (
              <div 
                key={counselor.email}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{counselor.name}</h3>
                <p className="text-gray-600 mb-4">{counselor.title}</p>
                <a 
                  href={`mailto:${counselor.email}`}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Contact
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Resources Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settings.resources.map((resource) => (
              <div 
                key={resource.title}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
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
        </section>
      </div>
    </main>
  )
} 