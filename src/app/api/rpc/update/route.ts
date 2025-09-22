import { NextRequest, NextResponse } from 'next/server'

interface RichPresenceData {
  image: string
  title: string
  line1: string
  line2: string
}

let currentPresenceData: RichPresenceData = {
  image: '',
  title: '',
  line1: '',
  line2: ''
}

let registeredClients: { url: string; lastSeen: Date }[] = []

export async function POST(request: NextRequest) {
  try {
    const data: RichPresenceData = await request.json()
    
    currentPresenceData = data
    
    const webhookPromises = registeredClients.map(async (client) => {
      try {
        const response = await fetch(`${client.url}/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(5000)
        })
        
        if (response.ok) {
          client.lastSeen = new Date()
          return { success: true, client: client.url }
        } else {
          return { success: false, client: client.url, error: 'Request failed' }
        }
      } catch (error) {
        return { success: false, client: client.url, error: 'Connection failed' }
      }
    })
    
    const results = await Promise.allSettled(webhookPromises)
    const successfulUpdates = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length
    
    registeredClients = registeredClients.filter(client => {
      const timeDiff = Date.now() - client.lastSeen.getTime()
      return timeDiff < 300000
    })
    
    return NextResponse.json({
      success: true,
      message: `Rich Presence updated successfully`,
      clientsNotified: successfulUpdates,
      totalClients: registeredClients.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update Rich Presence' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    currentData: currentPresenceData,
    connectedClients: registeredClients.length,
    clients: registeredClients.map(c => ({ url: c.url, lastSeen: c.lastSeen }))
  })
}
