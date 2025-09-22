import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'online',
    message: 'Discord RPC Control Panel API is running',
    timestamp: new Date().toISOString()
  })
}
