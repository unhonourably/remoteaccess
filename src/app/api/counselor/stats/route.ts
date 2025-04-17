import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const CHATS_FILE = path.join(process.cwd(), 'data', 'chats.json')

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
    
    // Calculate statistics
    const uniqueStudents = new Set(counselorChats.map((chat: any) => chat.userId))
    const activeChats = counselorChats.filter((chat: any) => {
      const lastMessage = chat.messages[chat.messages.length - 1]
      if (!lastMessage) return false
      // Consider a chat active if there's a message in the last 24 hours
      const lastMessageTime = new Date(lastMessage.timestamp).getTime()
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
      return lastMessageTime > oneDayAgo
    })

    // Calculate average response time
    let totalResponseTime = 0
    let responseCount = 0
    counselorChats.forEach((chat: any) => {
      let lastStudentMessage: any = null
      chat.messages.forEach((message: any) => {
        if (message.isUser) {
          lastStudentMessage = message
        } else if (lastStudentMessage) {
          const responseTime = new Date(message.timestamp).getTime() - new Date(lastStudentMessage.timestamp).getTime()
          totalResponseTime += responseTime
          responseCount++
          lastStudentMessage = null
        }
      })
    })

    const averageResponseTime = responseCount > 0 
      ? Math.round(totalResponseTime / responseCount / 1000 / 60) // Convert to minutes
      : 0

    // For now, upcoming appointments is a placeholder
    const upcomingAppointments = 0

    return NextResponse.json({
      stats: {
        activeChats: activeChats.length,
        totalStudentsHelped: uniqueStudents.size,
        averageResponseTime: `${averageResponseTime}m`,
        upcomingAppointments
      }
    })
  } catch (error) {
    console.error('Error calculating counselor stats:', error)
    return NextResponse.json({ error: 'Failed to load counselor stats' }, { status: 500 })
  }
} 