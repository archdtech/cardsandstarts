import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }
    
    const user = await db.user.findUnique({
      where: { email },
      include: {
        profile: true,
        interactions: {
          include: {
            card: true
          }
        }
      }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error getting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, expertiseKeywords, interestKeywords, connectionPreference } = body
    
    if (!email || !expertiseKeywords || !interestKeywords || !connectionPreference) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Check if user exists
    let user = await db.user.findUnique({
      where: { email }
    })
    
    if (user) {
      // Update existing user
      user = await db.user.update({
        where: { email },
        data: {
          name,
          expertiseKeywords,
          interestKeywords,
          connectionPreference
        },
        include: {
          profile: true
        }
      })
    } else {
      // Create new user
      user = await db.user.create({
        data: {
          email,
          name,
          expertiseKeywords,
          interestKeywords,
          connectionPreference
        },
        include: {
          profile: true
        }
      })
    }
    
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error creating/updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, sendDigestToManager, managerEmail } = body
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    const user = await db.user.update({
      where: { id: userId },
      data: {
        sendDigestToManager,
        managerEmail
      }
    })
    
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}