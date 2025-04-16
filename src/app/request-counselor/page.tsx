'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { SchoolName } from '@/types'

export default function RequestCounselorPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [school, setSchool] = useState<SchoolName>('Parkway North')
  const [reason, setReason] = useState('')
  const [experience, setExperience] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else if (user.role === 'counselor') {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/counselor-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          name: user?.name,
          email: user?.email,
          school,
          reason,
          experience,
          status: 'pending',
          submittedAt: new Date().toISOString()
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit request')
      }

      router.push('/dashboard?requestSubmitted=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const schools: SchoolName[] = [
    'Parkway North',
    'Parkway South',
    'Parkway West',
    'Parkway Central'
  ]

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Request to Become a Counselor
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                School
              </label>
              <select
                value={school}
                onChange={(e) => setSchool(e.target.value as SchoolName)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
              >
                {schools.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Why do you want to become a counselor?
              </label>
              <textarea
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                placeholder="Explain your motivation..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Relevant Experience
              </label>
              <textarea
                required
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                placeholder="Describe any relevant experience..."
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 