import { NextResponse } from 'next/server'
import parkwaySouth from '@/data/schools/parkway-south.json'
import parkwayWest from '@/data/schools/parkway-west.json'
import parkwayCentral from '@/data/schools/parkway-central.json'

export const dynamic = 'force-dynamic'

const schools = {
  'parkway-south': parkwaySouth,
  'parkway-west': parkwayWest,
  'parkway-central': parkwayCentral
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const school = url.pathname.split('/').pop()

    if (!school || !schools[school as keyof typeof schools]) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      )
    }

    const schoolData = schools[school as keyof typeof schools]
    return NextResponse.json({ counselors: schoolData.counselors })
  } catch (error) {
    console.error('Error fetching counselors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch counselors' },
      { status: 500 }
    )
  }
} 