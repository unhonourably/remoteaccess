'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { User, UserRole, SchoolName } from '../types'
import accounts from '../data/accounts.json'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const VALID_EMAIL_DOMAIN = '@parkwayschools.net'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Validate email domain
      if (!email.endsWith(VALID_EMAIL_DOMAIN)) {
        throw new Error('Please use your @parkwayschools.net email address')
      }

      // Find user in accounts.json
      const foundUser = accounts.users.find(
        (u) => u.email === email && u.password === password
      )

      if (!foundUser) {
        throw new Error('Invalid email or password')
      }

      // Create user object without password and ensure proper types
      const { password: _, ...userWithoutPassword } = foundUser
      
      // Update last login and ensure proper types
      const userToStore: User = {
        ...userWithoutPassword,
        school: userWithoutPassword.school as SchoolName,
        role: userWithoutPassword.role as UserRole,
        lastLogin: new Date().toISOString()
      }

      setUser(userToStore)
      localStorage.setItem('user', JSON.stringify(userToStore))
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      // Validate email domain
      if (!email.endsWith(VALID_EMAIL_DOMAIN)) {
        throw new Error('Please use your @parkwayschools.net email address')
      }

      // Check if email already exists
      if (accounts.users.some(u => u.email === email)) {
        throw new Error('Email already exists')
      }

      // In a real app, you would make an API call to create the user
      // For now, we'll just create a mock user
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        school: 'Parkway North' as SchoolName,
        role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    loading,
    login,
    logout,
    register
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 