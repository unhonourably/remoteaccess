import { NextRequest, NextResponse } from 'next/server'

let registeredClients: { url: string; lastSeen: Date }[] = []

export async function POST(request: NextRequest) {
  try {
    const clearData = {
      image: '',
      title: '',
      line1: '',
      line2: ''
    }
    
    const webhookPromises = registeredClients.map(async (client) => {
      try {
        const response = await fetch(`${client.url}/clear`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
    const successfulClears = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length
    
    registeredClients = registeredClients.filter(client => {
      const timeDiff = Date.now() - client.lastSeen.getTime()
      return timeDiff < 300000
    })
    
    return NextResponse.json({
      success: true,
      message: `Rich Presence cleared successfully`,
      clientsNotified: successfulClears,
      totalClients: registeredClients.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to clear Rich Presence' },
      { status: 500 }
    )
  }
}
