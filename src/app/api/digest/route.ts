import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    // Get current week's digest
    const now = new Date()
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    const weeklyDigest = await db.weeklyDigest.findUnique({
      where: { userId_weekStart: { userId, weekStart } },
      include: {
        digestItems: {
          include: {
            card: true
          }
        },
        user: true
      }
    })
    
    if (!weeklyDigest) {
      // Create empty digest if it doesn't exist
      const newDigest = await db.weeklyDigest.create({
        data: {
          userId,
          weekStart,
          weekEnd,
          content: ''
        },
        include: {
          digestItems: {
            include: {
              card: true
            }
          },
          user: true
        }
      })
      
      return NextResponse.json({ digest: newDigest })
    }
    
    return NextResponse.json({ digest: weeklyDigest })
  } catch (error) {
    console.error('Error getting digest:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, content } = body
    
    if (!userId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Get current week's digest
    const now = new Date()
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    // Update or create digest
    const weeklyDigest = await db.weeklyDigest.upsert({
      where: { userId_weekStart: { userId, weekStart } },
      update: {
        content
      },
      create: {
        userId,
        weekStart,
        weekEnd,
        content
      },
      include: {
        digestItems: {
          include: {
            card: true
          }
        },
        user: true
      }
    })
    
    return NextResponse.json({ digest: weeklyDigest })
  } catch (error) {
    console.error('Error creating/updating digest:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { digestId, isSent } = body
    
    if (!digestId) {
      return NextResponse.json({ error: 'Digest ID required' }, { status: 400 })
    }
    
    const weeklyDigest = await db.weeklyDigest.update({
      where: { id: digestId },
      data: {
        isSent,
        sentAt: isSent ? new Date() : null
      },
      include: {
        digestItems: {
          include: {
            card: true
          }
        },
        user: true
      }
    })
    
    return NextResponse.json({ digest: weeklyDigest })
  } catch (error) {
    console.error('Error updating digest:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}