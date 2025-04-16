import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const ACCOUNTS_FILE = path.join(process.cwd(), 'src', 'data', 'accounts.json')

// Initialize accounts file if it doesn't exist
async function initAccountsFile() {
  try {
    await fs.access(ACCOUNTS_FILE)
  } catch {
    await fs.mkdir(path.dirname(ACCOUNTS_FILE), { recursive: true })
    await fs.writeFile(ACCOUNTS_FILE, JSON.stringify({ users: [] }))
  }
}

// GET /api/admin/accounts
export async function GET() {
  await initAccountsFile()
  
  try {
    const data = await fs.readFile(ACCOUNTS_FILE, 'utf-8')
    const { users } = JSON.parse(data)
    return NextResponse.json({ accounts: users })
  } catch (error) {
    console.error('Error reading accounts:', error)
    return NextResponse.json({ error: 'Failed to load accounts' }, { status: 500 })
  }
}

// POST /api/admin/accounts
export async function POST(request: Request) {
  await initAccountsFile()
  
  try {
    const newAccount = await request.json()
    const data = JSON.parse(await fs.readFile(ACCOUNTS_FILE, 'utf-8'))
    
    // Check if email already exists
    if (data.users.some((account: any) => account.email === newAccount.email)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }
    
    // Generate a unique ID
    newAccount.id = Math.random().toString(36).substr(2, 9)
    newAccount.createdAt = new Date().toISOString()
    newAccount.lastLogin = new Date().toISOString()
    newAccount.bio = newAccount.bio || ""
    
    data.users.push(newAccount)
    await fs.writeFile(ACCOUNTS_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ success: true, account: newAccount })
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}

// PUT /api/admin/accounts
export async function PUT(request: Request) {
  await initAccountsFile()
  
  try {
    const { email, updates } = await request.json()
    const data = JSON.parse(await fs.readFile(ACCOUNTS_FILE, 'utf-8'))
    
    const accountIndex = data.users.findIndex((account: any) => account.email === email)
    if (accountIndex === -1) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }
    
    data.users[accountIndex] = { ...data.users[accountIndex], ...updates }
    await fs.writeFile(ACCOUNTS_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ success: true, account: data.users[accountIndex] })
  } catch (error) {
    console.error('Error updating account:', error)
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 })
  }
}

// DELETE /api/admin/accounts
export async function DELETE(request: Request) {
  await initAccountsFile()
  
  try {
    const { email } = await request.json()
    const data = JSON.parse(await fs.readFile(ACCOUNTS_FILE, 'utf-8'))
    
    const accountIndex = data.users.findIndex((account: any) => account.email === email)
    if (accountIndex === -1) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }
    
    data.users.splice(accountIndex, 1)
    await fs.writeFile(ACCOUNTS_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
} 