import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

interface LoginFormProps {
  school: string
  onSuccess: () => void
}

export default function LoginForm({ school, onSuccess }: LoginFormProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, school)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in with your Parkway email</h2>
      <p className="text-gray-600 mb-6">
        Please use your @parkwayschools.net email address to continue.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.name@parkwayschools.net"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full px-4 py-2 rounded-lg font-medium text-white
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700'
            }
            transition-colors
          `}
        >
          {isLoading ? 'Signing in...' : 'Continue'}
        </button>
      </form>
    </div>
  )
} 