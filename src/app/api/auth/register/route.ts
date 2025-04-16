import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { User, UserRole, SchoolName } from '@/types'

export async function POST(request: Request) {
  try {
    const { email, password, name, role, school } = await request.json()

    // Read current accounts
    const accountsPath = path.join(process.cwd(), 'src/data/accounts.json')
    const accountsData = await fs.readFile(accountsPath, 'utf-8')
    const accounts = JSON.parse(accountsData)

    // Check if email exists
    if (accounts.users.some((u: User) => u.email === email)) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Create new user
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password,
      name,
      school,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      bio: ''
    }

    // Add user to accounts
    const updatedAccounts = {
      users: [...accounts.users, newUser]
    }

    // Write updated accounts
    await fs.writeFile(
      accountsPath,
      JSON.stringify(updatedAccounts, null, 2)
    )

    
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
} 