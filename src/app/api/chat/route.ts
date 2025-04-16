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

// GET /api/chat
export async function GET(request: Request) {
  await initChatsFile()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const counselorEmail = searchParams.get('counselorEmail')

  if (!userId || !counselorEmail) {
    return NextResponse.json({ error: 'User ID and counselor email are required' }, { status: 400 })
  }

  const chatsData = await fs.readFile(CHATS_FILE, 'utf-8')
  const { chats } = JSON.parse(chatsData)
  const userChats = chats.filter((chat: any) => 
    chat.userId === userId && chat.counselorEmail === counselorEmail
  )

  return NextResponse.json({ chats: userChats })
}

// POST /api/chat
export async function POST(request: Request) {
  await initChatsFile()
  const body = await request.json()
  const { userId, counselorEmail, message, isUser } = body

  if (!userId || !counselorEmail || !message) {
    return NextResponse.json({ error: 'User ID, counselor email, and message are required' }, { status: 400 })
  }

  const chatsData = await fs.readFile(CHATS_FILE, 'utf-8')
  const data = JSON.parse(chatsData)
  
  const newMessage = {
    id: Date.now().toString(),
    userId,
    counselorEmail,
    content: message,
    timestamp: new Date().toISOString(),
    isUser: isUser ?? true
  }

  // Find user's chat with specific counselor or create new one
  const chatIndex = data.chats.findIndex((chat: any) => 
    chat.userId === userId && chat.counselorEmail === counselorEmail
  )
  
  if (chatIndex === -1) {
    data.chats.push({
      userId,
      counselorEmail,
      messages: [newMessage]
    })
  } else {
    data.chats[chatIndex].messages.push(newMessage)
  }

  await fs.writeFile(CHATS_FILE, JSON.stringify(data, null, 2))
  return NextResponse.json({ message: newMessage })
} 