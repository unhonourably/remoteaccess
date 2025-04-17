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
  register: (email: string, password: string, name: string, role: UserRole, school: SchoolName) => Promise<void>
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
      const parsedUser = JSON.parse(storedUser)
      // Get fresh user data from accounts.json
      const freshUserData = accounts.users.find(u => u.email === parsedUser.email)
      if (freshUserData) {
        const { password: _, ...userWithoutPassword } = freshUserData
        const updatedUser: User = {
          ...userWithoutPassword,
          school: userWithoutPassword.school as SchoolName,
          role: userWithoutPassword.role as UserRole,
          lastLogin: parsedUser.lastLogin
        }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
      } else {
        // If user no longer exists in accounts.json, log them out
        setUser(null)
        localStorage.removeItem('user')
      }
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

  const register = async (email: string, password: string, name: string, role: UserRole, school: SchoolName) => {
    try {
      // Validate email domain
      if (!email.endsWith(VALID_EMAIL_DOMAIN)) {
        throw new Error('Please use your @parkwayschools.net email address')
      }

      // Send registration request to API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          school,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Registration failed')
      }

      const newUser = await response.json()
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