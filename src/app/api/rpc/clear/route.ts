import { NextRequest, NextResponse } from 'next/server'
import { clientStore } from '../../../../lib/clientStore'
import { presenceStore } from '../../../../lib/presenceStore'

export async function POST(request: NextRequest) {
  console.log(`[${new Date().toISOString()}] 🧹 RPC Clear request received`)
  
  try {
    presenceStore.clearPresence()
    
    const clearData = {
      image: '',
      title: '',
      line1: '',
      line2: ''
    }
    
    const registeredClients = clientStore.getClients()
    console.log(`[${new Date().toISOString()}] 📡 Sending clear webhooks to ${registeredClients.length} clients`)
    
    const webhookPromises = registeredClients.map(async (client, index) => {
      console.log(`[${new Date().toISOString()}] 🔄 Sending clear webhook ${index + 1}/${registeredClients.length} to ${client.url}`)
      
      try {
        const response = await fetch(`${client.url}/clear`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(5000)
        })
        
        if (response.ok) {
          clientStore.updateClientLastSeen(client.url)
          console.log(`[${new Date().toISOString()}] ✅ Clear webhook success: ${client.url}`)
          return { success: true, client: client.url }
        } else {
          console.log(`[${new Date().toISOString()}] ❌ Clear webhook failed: ${client.url} (Status: ${response.status})`)
          return { success: false, client: client.url, error: `HTTP ${response.status}` }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.log(`[${new Date().toISOString()}] ❌ Clear webhook error: ${client.url} (${errorMessage})`)
        return { success: false, client: client.url, error: errorMessage }
      }
    })
    
    const results = await Promise.allSettled(webhookPromises)
    const successfulClears = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length
    
    const finalClientCount = clientStore.getClientCount()
    console.log(`[${new Date().toISOString()}] 📊 Clear complete: ${successfulClears}/${finalClientCount} clients notified`)
    
    return NextResponse.json({
      success: true,
      message: `Rich Presence cleared successfully`,
      clientsNotified: successfulClears,
      totalClients: finalClientCount
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.log(`[${new Date().toISOString()}] ❌ Clear API Error: ${errorMessage}`)
    return NextResponse.json(
      { success: false, message: 'Failed to clear Rich Presence', error: errorMessage },
      { status: 500 }
    )
  }
}
