import { NextRequest, NextResponse } from 'next/server'

let registeredClients: { url: string; lastSeen: Date }[] = []

export async function POST(request: NextRequest) {
  try {
    const { clientUrl } = await request.json()
    
    if (!clientUrl || typeof clientUrl !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Client URL is required' },
        { status: 400 }
      )
    }
    
    const existingClient = registeredClients.find(client => client.url === clientUrl)
    
    if (existingClient) {
      existingClient.lastSeen = new Date()
    } else {
      registeredClients.push({
        url: clientUrl,
        lastSeen: new Date()
      })
    }
    
    registeredClients = registeredClients.filter(client => {
      const timeDiff = Date.now() - client.lastSeen.getTime()
      return timeDiff < 300000
    })
    
    return NextResponse.json({
      success: true,
      message: 'Client registered successfully',
      totalClients: registeredClients.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to register client' },
      { status: 500 }
    )
  }
}

export async function GET() {
  registeredClients = registeredClients.filter(client => {
    const timeDiff = Date.now() - client.lastSeen.getTime()
    return timeDiff < 300000
  })
  
  return NextResponse.json({
    connectedClients: registeredClients.length,
    clients: registeredClients.map(c => ({ url: c.url, lastSeen: c.lastSeen }))
  })
}
