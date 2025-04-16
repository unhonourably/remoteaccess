'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, loading } = useAuth()
  const [bio, setBio] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!user) return null

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Implement profile update API call
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header/Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-red-500 to-red-600"></div>

          {/* Profile Section */}
          <div className="relative px-6 pb-6">
            {/* Profile Picture */}
            <div className="relative -mt-16 mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                )}
              </div>
              {isEditing && (
                <button
                  className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700"
                  onClick={() => {/* TODO: Implement image upload */}}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-500">{user.school} • {user.role}</p>
                </div>
                <div className="space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write something about yourself..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  rows={4}
                />
              ) : (
                <p className="text-gray-600">
                  {bio || "No bio yet"}
                </p>
              )}

              {/* Account Actions */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 