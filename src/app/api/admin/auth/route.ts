import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const ADMIN_FILE = path.join(process.cwd(), 'src', 'data', 'admin.json')

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const adminData = JSON.parse(await fs.readFile(ADMIN_FILE, 'utf-8'))

    if (password === adminData.password) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
} 