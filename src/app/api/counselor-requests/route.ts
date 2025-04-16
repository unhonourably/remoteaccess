import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { SchoolName } from '@/types'

interface CounselorRequest {
  id: string
  userId: string
  name: string
  email: string
  school: SchoolName
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

interface RequestData {
  requests: CounselorRequest[]
}

const requestsFilePath = path.join(process.cwd(), 'src/data/counselor-requests.json')

async function readRequestsFile(): Promise<RequestData> {
  try {
    const data = await fs.readFile(requestsFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return empty array
    return { requests: [] }
  }
}

async function writeRequestsFile(data: RequestData): Promise<void> {
  await fs.writeFile(requestsFilePath, JSON.stringify(data, null, 2))
}

export async function GET(): Promise<NextResponse> {
  try {
    const data = await readRequestsFile()
    return NextResponse.json(data.requests)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch counselor requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId, name, email, school, reason } = await request.json()

    // Validate required fields
    if (!userId || !name || !email || !school || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const data = await readRequestsFile()

    // Check if user already has a pending request
    const existingRequest = data.requests.find(
      (req) => req.userId === userId && req.status === 'pending'
    )

    if (existingRequest) {
      return NextResponse.json(
        { error: 'User already has a pending request' },
        { status: 400 }
      )
    }

    const newRequest: CounselorRequest = {
      id: uuidv4(),
      userId,
      name,
      email,
      school,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    data.requests.push(newRequest)
    await writeRequestsFile(data)

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create counselor request' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const { requestId, status } = await request.json()

    if (!requestId || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid request ID or status' },
        { status: 400 }
      )
    }

    const data = await readRequestsFile()
    const requestIndex = data.requests.findIndex((req) => req.id === requestId)

    if (requestIndex === -1) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      )
    }

    data.requests[requestIndex] = {
      ...data.requests[requestIndex],
      status,
      updatedAt: new Date().toISOString(),
    }

    await writeRequestsFile(data)
    return NextResponse.json(data.requests[requestIndex])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update counselor request' },
      { status: 500 }
    )
  }
} 