import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const CHATS_FILE = path.join(process.cwd(), 'data', 'chats.json')

// Initialize chats file if it doesn't exist
async function initChatsFile() {
  try {
    await fs.access(CHATS_FILE)
  } catch {
    await fs.mkdir(path.dirname(CHATS_FILE), { recursive: true })
    await fs.writeFile(CHATS_FILE, JSON.stringify({ chats: [] }))
  }
}

async function readChatsFile() {
  await initChatsFile()
  const chatsData = await fs.readFile(CHATS_FILE, 'utf-8')
  return JSON.parse(chatsData)
}

async function writeChatsFile(data: any) {
  await fs.writeFile(CHATS_FILE, JSON.stringify(data, null, 2))
}

// GET /api/chat
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const counselorEmail = searchParams.get('counselorEmail')
  const since = searchParams.get('since')

  if (!userId || !counselorEmail) {
    return NextResponse.json({ error: 'User ID and counselor email are required' }, { status: 400 })
  }

  const { chats } = await readChatsFile()
  
  // Find the specific chat thread between this user and counselor
  const chat = chats.find((chat: any) => 
    chat.userId === userId && chat.counselorEmail === counselorEmail
  )

  if (!chat) {
    return NextResponse.json({ chats: [] })
  }

  let messages = chat.messages

  if (since) {
    const sinceDate = new Date(since)
    messages = messages.filter((msg: any) => new Date(msg.timestamp) > sinceDate)
  }

  return NextResponse.json({ 
    chats: [{
      userId,
      counselorEmail,
      messages: messages
    }]
  })
}

// POST /api/chat
export async function POST(request: Request) {
  const body = await request.json()
  const { userId, counselorEmail, message, isUser } = body

  if (!userId || !counselorEmail || !message) {
    return NextResponse.json({ error: 'User ID, counselor email, and message are required' }, { status: 400 })
  }

  const data = await readChatsFile()
  
  const newMessage = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    counselorEmail,
    content: message,
    timestamp: new Date().toISOString(),
    isUser: isUser ?? true
  }

  // Find or create the chat thread
  let chat = data.chats.find((chat: any) => 
    chat.userId === userId && chat.counselorEmail === counselorEmail
  )
  
  if (!chat) {
    chat = {
      userId,
      counselorEmail,
      messages: []
    }
    data.chats.push(chat)
  }

  chat.messages.push(newMessage)
  chat.messages.sort((a: any, b: any) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  await writeChatsFile(data)
  return NextResponse.json({ message: newMessage })
} 