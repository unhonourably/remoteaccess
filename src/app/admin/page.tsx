'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SchoolName } from '@/types'

interface CounselorRequest {
  id: string
  userId: string
  name: string
  email: string
  school: SchoolName
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('accounts')
  const [accounts, setAccounts] = useState<any[]>([])
  const [accountsLoading, setAccountsLoading] = useState(false)
  const [showNewAccountModal, setShowNewAccountModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<any>(null)
  const [newAccount, setNewAccount] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    school: 'Parkway North'
  })
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [counselorRequests, setCounselorRequests] = useState<CounselorRequest[]>([])
  const [requestsLoading, setRequestsLoading] = useState(false)
  const router = useRouter()

  // Icons for the sidebar
  const icons = {
    accounts: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    counselors: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    analytics: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (!response.ok) {
        throw new Error('Invalid password')
      }

      setIsAuthenticated(true)
      loadAccounts()
    } catch (err) {
      setError('Invalid password')
    } finally {
      setIsLoading(false)
    }
  }

  const loadAccounts = async () => {
    setAccountsLoading(true)
    try {
      const response = await fetch('/api/admin/accounts')
      if (!response.ok) throw new Error('Failed to load accounts')
      const data = await response.json()
      setAccounts(data.accounts || [])
    } catch (err) {
      console.error('Error loading accounts:', err)
      setAccounts([])
    } finally {
      setAccountsLoading(false)
    }
  }

  const handleUpdateAccount = async (email: string, updates: any) => {
    try {
      const response = await fetch('/api/admin/accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, updates })
      })

      if (!response.ok) throw new Error('Failed to update account')
      loadAccounts() // Refresh the accounts list
    } catch (err) {
      console.error('Error updating account:', err)
    }
  }

  const handleDeleteAccount = async (email: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return

    try {
      const response = await fetch('/api/admin/accounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) throw new Error('Failed to delete account')
      loadAccounts() // Refresh the accounts list
    } catch (err) {
      console.error('Error deleting account:', err)
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create account')
      }

      setShowNewAccountModal(false)
      setNewAccount({
        name: '',
        email: '',
        password: '',
        role: 'student',
        school: 'Parkway North'
      })
      loadAccounts()
    } catch (err: any) {
      console.error('Error creating account:', err)
      alert(err.message)
    }
  }

  const handleEditAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editingAccount.originalEmail,
          updates: {
            name: editingAccount.name,
            email: editingAccount.email,
            password: editingAccount.password,
            bio: editingAccount.bio
          }
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update account')
      }

      setShowEditModal(false)
      setEditingAccount(null)
      loadAccounts()
    } catch (err: any) {
      console.error('Error updating account:', err)
      alert(err.message)
    }
  }

  const openEditModal = (account: any) => {
    setEditingAccount({
      ...account,
      originalEmail: account.email // Keep original email for reference
    })
    setShowEditModal(true)
  }

  const loadCounselorRequests = async () => {
    setRequestsLoading(true)
    try {
      const response = await fetch('/api/counselor-requests')
      if (!response.ok) throw new Error('Failed to load counselor requests')
      const data = await response.json()
      setCounselorRequests(data || [])
    } catch (err) {
      console.error('Error loading counselor requests:', err)
      setCounselorRequests([])
    } finally {
      setRequestsLoading(false)
    }
  }

  const handleRequestAction = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      // Update request status
      const response = await fetch('/api/counselor-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status })
      })

      if (!response.ok) throw new Error('Failed to update request status')

      // If approved, update user role to counselor
      if (status === 'approved') {
        const request = counselorRequests.find(r => r.id === requestId)
        if (request) {
          await fetch('/api/admin/accounts', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: request.email,
              updates: { role: 'counselor' }
            })
          })
        }
      }

      // Refresh the requests list
      loadCounselorRequests()
    } catch (err) {
      console.error('Error updating request:', err)
    }
  }

  useEffect(() => {
    if (isAuthenticated && activeSection === 'counselors') {
      loadCounselorRequests()
    }
  }, [isAuthenticated, activeSection])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Admin Access
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="px-4 h-16 flex items-center border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'accounts', label: 'Manage Accounts' },
            { id: 'counselors', label: 'Counselors' },
            { id: 'analytics', label: 'Analytics' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
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
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeSection === 'accounts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Manage Accounts</h2>
              <button
                onClick={() => setShowNewAccountModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Add New Account
              </button>
            </div>

            {/* New Account Modal */}
            {showNewAccountModal && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Create New Account</h3>
                    <button
                      onClick={() => setShowNewAccountModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleCreateAccount} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        required
                        value={newAccount.name}
                        onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        required
                        value={newAccount.email}
                        onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <div className="relative mt-1">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          value={newAccount.password}
                          onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                          className="block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showNewPassword ? (
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <select
                        value={newAccount.role}
                        onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      >
                        <option value="student">Student</option>
                        <option value="counselor">Counselor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">School</label>
                      <select
                        value={newAccount.school}
                        onChange={(e) => setNewAccount({ ...newAccount, school: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      >
                        <option value="Parkway North">Parkway North</option>
                        <option value="Parkway South">Parkway South</option>
                        <option value="Parkway West">Parkway West</option>
                        <option value="Parkway Central">Parkway Central</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowNewAccountModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Create Account
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Account Modal */}
            {showEditModal && editingAccount && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Edit Account</h3>
                    <button
                      onClick={() => {
                        setShowEditModal(false)
                        setEditingAccount(null)
                      }}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleEditAccount} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        required
                        value={editingAccount.name}
                        onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        required
                        value={editingAccount.email}
                        onChange={(e) => setEditingAccount({ ...editingAccount, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Password (leave blank to keep current)
                      </label>
                      <div className="relative mt-1">
                        <input
                          type={showEditPassword ? "text" : "password"}
                          value={editingAccount.password || ''}
                          onChange={(e) => setEditingAccount({ ...editingAccount, password: e.target.value })}
                          className="block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowEditPassword(!showEditPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showEditPassword ? (
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        value={editingAccount.bio || ''}
                        onChange={(e) => setEditingAccount({ ...editingAccount, bio: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false)
                          setEditingAccount(null)
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-white shadow-sm rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        School
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accountsLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                            <span className="ml-2">Loading accounts...</span>
                          </div>
                        </td>
                      </tr>
                    ) : accounts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No accounts found
                        </td>
                      </tr>
                    ) : (
                      accounts.map((account) => (
                        <tr key={account.email}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {account.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {account.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${account.role === 'counselor' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'}`}
                            >
                              {account.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {account.school}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => openEditModal(account)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(account.email)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'counselors' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Manage Counselors</h2>
            
            <div className="bg-white shadow-sm rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        School
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {counselorRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {request.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {request.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {request.school}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">
                            {request.reason}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleRequestAction(request.id, 'approved')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRequestAction(request.id, 'rejected')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            {/* TODO: Add analytics dashboard */}
          </div>
        )}
      </div>
    </div>
  )
} 