import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const CHATS_FILE = path.join(process.cwd(), 'data', 'chats.json')

// GET /api/chat/recent
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const chatsData = await fs.readFile(CHATS_FILE, 'utf-8')
    const { chats } = JSON.parse(chatsData)
    
    // Get all chats for this user
    const userChats = chats.filter((chat: any) => chat.userId === userId)
    
    // Group chats by counselor and get the most recent message
    const recentChats = userChats.reduce((acc: any[], chat: any) => {
      const existingChat = acc.find((c) => c.counselorEmail === chat.counselorEmail)
      const lastMessage = chat.messages[chat.messages.length - 1]
      
      if (!existingChat && lastMessage) {
        acc.push({
          counselorEmail: chat.counselorEmail,
          counselorName: chat.counselorName || 'Counselor', // Fallback name
          lastMessage: lastMessage.content,
          timestamp: lastMessage.timestamp
        })
      }
      return acc
    }, [])

    // Sort by most recent first
    recentChats.sort((a: { timestamp: string }, b: { timestamp: string }) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Limit to 5 most recent chats
    return NextResponse.json({ chats: recentChats.slice(0, 5) })
  } catch (error) {
    console.error('Error reading chats:', error)
    return NextResponse.json({ error: 'Failed to load recent chats' }, { status: 500 })
  }
} 