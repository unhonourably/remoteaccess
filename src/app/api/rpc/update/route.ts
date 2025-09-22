import { NextRequest, NextResponse } from 'next/server'
import { clientStore } from '../../../../lib/clientStore'

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

export async function POST(request: NextRequest) {
  console.log(`[${new Date().toISOString()}] 📥 RPC Update request received`)
  
  try {
    const data: RichPresenceData = await request.json()
    console.log(`[${new Date().toISOString()}] 📝 RPC Data:`, JSON.stringify(data))
    
    currentPresenceData = data
    
    const registeredClients = clientStore.getClients()
    console.log(`[${new Date().toISOString()}] 📡 Sending webhooks to ${registeredClients.length} clients`)
    
    const webhookPromises = registeredClients.map(async (client, index) => {
      console.log(`[${new Date().toISOString()}] 🔄 Sending webhook ${index + 1}/${registeredClients.length} to ${client.url}`)
      
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
          clientStore.updateClientLastSeen(client.url)
          console.log(`[${new Date().toISOString()}] ✅ Webhook success: ${client.url}`)
          return { success: true, client: client.url }
        } else {
          console.log(`[${new Date().toISOString()}] ❌ Webhook failed: ${client.url} (Status: ${response.status})`)
          return { success: false, client: client.url, error: `HTTP ${response.status}` }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.log(`[${new Date().toISOString()}] ❌ Webhook error: ${client.url} (${errorMessage})`)
        return { success: false, client: client.url, error: errorMessage }
      }
    })
    
    const results = await Promise.allSettled(webhookPromises)
    const successfulUpdates = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length
    
    const finalClientCount = clientStore.getClientCount()
    console.log(`[${new Date().toISOString()}] 📊 Update complete: ${successfulUpdates}/${finalClientCount} clients notified`)
    
    return NextResponse.json({
      success: true,
      message: `Rich Presence updated successfully`,
      clientsNotified: successfulUpdates,
      totalClients: finalClientCount,
      webhookResults: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: 'Promise rejected' })
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.log(`[${new Date().toISOString()}] ❌ API Error:`, error)
    return NextResponse.json(
      { success: false, message: 'Failed to update Rich Presence', error: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET() {
  const clients = clientStore.getClients()
  return NextResponse.json({
    currentData: currentPresenceData,
    connectedClients: clients.length,
    clients: clients.map(c => ({ url: c.url, lastSeen: c.lastSeen }))
  })
}
