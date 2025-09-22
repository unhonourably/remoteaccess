import { NextRequest, NextResponse } from 'next/server'
import { clientStore } from '../../../../lib/clientStore'

export async function POST(request: NextRequest) {
  console.log(`[${new Date().toISOString()}] 📋 Client registration request received`)
  
  try {
    const { clientUrl } = await request.json()
    console.log(`[${new Date().toISOString()}] 🔍 Registering client: ${clientUrl}`)
    
    if (!clientUrl || typeof clientUrl !== 'string') {
      console.log(`[${new Date().toISOString()}] ❌ Invalid client URL provided`)
      return NextResponse.json(
        { success: false, message: 'Client URL is required' },
        { status: 400 }
      )
    }
    
    const totalClients = clientStore.registerClient(clientUrl)
    console.log(`[${new Date().toISOString()}] ✅ Client registered successfully. Total clients: ${totalClients}`)
    
    return NextResponse.json({
      success: true,
      message: 'Client registered successfully',
      totalClients: totalClients
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.log(`[${new Date().toISOString()}] ❌ Registration error: ${errorMessage}`)
    return NextResponse.json(
      { success: false, message: 'Failed to register client', error: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET() {
  const clients = clientStore.getClients()
  console.log(`[${new Date().toISOString()}] 📊 Status check: ${clients.length} clients connected`)
  
  return NextResponse.json({
    connectedClients: clients.length,
    clients: clients.map(c => ({ url: c.url, lastSeen: c.lastSeen }))
  })
}
