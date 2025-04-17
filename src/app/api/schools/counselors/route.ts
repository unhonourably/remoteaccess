import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    // Get school from query params
    const school = request.nextUrl.searchParams.get('school')
    if (!school) {
      return NextResponse.json({ error: 'School parameter is required' }, { status: 400 })
    }

    // Read accounts.json
    const accountsPath = path.join(process.cwd(), 'src/data/accounts.json')
    const accountsData = await fs.readFile(accountsPath, 'utf-8')
    const accounts = JSON.parse(accountsData)

    // Filter counselors for the specific school
    const counselors = accounts.users
      .filter((user: any) => 
        user.role === 'counselor' && 
        user.school === school
      )
      .map((counselor: any) => ({
        name: counselor.name,
        email: counselor.email,
        title: counselor.title || 'School Counselor',
        availability: counselor.availability || []
      }))

    return NextResponse.json({ counselors })
  } catch (error) {
    console.error('Error fetching counselors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch counselors' },
      { status: 500 }
    )
  }
} 