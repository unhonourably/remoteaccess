import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const CHATS_FILE = path.join(process.cwd(), 'data', 'chats.json')

// GET /api/counselor/chats
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const counselorEmail = searchParams.get('counselorEmail')

  if (!counselorEmail) {
    return NextResponse.json({ error: 'Counselor email is required' }, { status: 400 })
  }

  try {
    const chatsData = await fs.readFile(CHATS_FILE, 'utf-8')
    const { chats } = JSON.parse(chatsData)
    
    // Get all chats for this counselor
    const counselorChats = chats.filter((chat: any) => chat.counselorEmail === counselorEmail)
    
    // Group chats by userId to get unique conversations
    const uniqueChats = counselorChats.reduce((acc: any[], chat: any) => {
      const existingChat = acc.find((c) => c.userId === chat.userId)
      if (!existingChat) {
        acc.push(chat)
      }
      return acc
    }, [])

    return NextResponse.json({ chats: uniqueChats })
  } catch (error) {
    console.error('Error reading chats:', error)
    return NextResponse.json({ error: 'Failed to load chats' }, { status: 500 })
  }
} 