import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const CHATS_FILE = path.join(process.cwd(), 'data', 'chats.json')
const STATS_FILE = path.join(process.cwd(), 'data', 'user-stats.json')

// Initialize stats file if it doesn't exist
async function initStatsFile() {
  try {
    await fs.access(STATS_FILE)
  } catch {
    await fs.mkdir(path.dirname(STATS_FILE), { recursive: true })
    await fs.writeFile(STATS_FILE, JSON.stringify({ users: {} }))
  }
}

// GET /api/user/stats
export async function GET(request: Request) {
  await initStatsFile()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    
    const chatsData = await fs.readFile(CHATS_FILE, 'utf-8')
    const { chats } = JSON.parse(chatsData)
    const activeChats = new Set(chats.filter((chat: any) => chat.userId === userId).map((chat: any) => chat.counselorEmail)).size

    // Get user stats
    const statsData = await fs.readFile(STATS_FILE, 'utf-8')
    const { users } = JSON.parse(statsData)
    const userStats = users[userId] || {
      recentSessions: 0,
      resourcesAccessed: 0,
      upcomingAppointments: 0
    }

    return NextResponse.json({
      stats: {
        activeChats,
        recentSessions: userStats.recentSessions,
        resourcesAccessed: userStats.resourcesAccessed,
        upcomingAppointments: userStats.upcomingAppointments
      }
    })
  } catch (error) {
    console.error('Error reading stats:', error)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}

// POST /api/user/stats
export async function POST(request: Request) {
  await initStatsFile()
  const body = await request.json()
  const { userId, type } = body

  if (!userId || !type) {
    return NextResponse.json({ error: 'User ID and stat type are required' }, { status: 400 })
  }

  try {
    const statsData = await fs.readFile(STATS_FILE, 'utf-8')
    const data = JSON.parse(statsData)
    
    if (!data.users[userId]) {
      data.users[userId] = {
        recentSessions: 0,
        resourcesAccessed: 0,
        upcomingAppointments: 0
      }
    }

    // Increment the specified stat
    switch (type) {
      case 'session':
        data.users[userId].recentSessions++
        break
      case 'resource':
        data.users[userId].resourcesAccessed++
        break
      case 'appointment':
        data.users[userId].upcomingAppointments++
        break
      default:
        return NextResponse.json({ error: 'Invalid stat type' }, { status: 400 })
    }

    await fs.writeFile(STATS_FILE, JSON.stringify(data, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating stats:', error)
    return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 })
  }
} 