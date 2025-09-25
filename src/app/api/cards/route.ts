import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Simple keyword matching function
function calculateKeywordMatch(userKeywords: string, cardKeywords: string): number {
  if (!userKeywords || !cardKeywords) return 0
  
  const userWords = userKeywords.toLowerCase().split(',').map(w => w.trim())
  const cardWords = cardKeywords.toLowerCase().split(',').map(w => w.trim())
  
  let matches = 0
  for (const userWord of userWords) {
    for (const cardWord of cardWords) {
      if (userWord === cardWord || cardWord.includes(userWord) || userWord.includes(cardWord)) {
        matches++
      }
    }
  }
  
  return matches / Math.max(userWords.length, cardWords.length)
}

// Recency weighting - newer cards get higher scores
function calculateRecencyWeight(createdAt: Date): number {
  const now = new Date()
  const daysOld = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  
  // Weight decreases by 10% per day, max 1.0 for today, 0.1 for 9+ days old
  return Math.max(0.1, 1.0 - (daysOld * 0.1))
}

// Basic AI matching logic
async function getMatchingCardsForUser(userId: string) {
  try {
    // Get user profile
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { interactions: true }
    })
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // Get all active cards
    const cards = await db.card.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
    
    // Get user's negative interactions (Not Now, Never Show)
    const negativeInteractions = user.interactions.filter(interaction => 
      interaction.type === 'NOT_NOW' || interaction.type === 'NEVER_SHOW'
    )
    
    // Score and filter cards
    const scoredCards = cards.map(card => {
      let score = 0
      
      // Keyword matching (50% weight)
      const expertiseMatch = calculateKeywordMatch(user.expertiseKeywords, card.keywords)
      const interestMatch = calculateKeywordMatch(user.interestKeywords, card.keywords)
      const keywordScore = Math.max(expertiseMatch, interestMatch) * 0.5
      
      // Recency weighting (30% weight)
      const recencyWeight = calculateRecencyWeight(card.createdAt)
      const recencyScore = recencyWeight * 0.3
      
      // Priority weighting (20% weight)
      const priorityScore = (card.priority / 5) * 0.2
      
      // Negative interaction penalty
      let penalty = 0
      const negativeInteraction = negativeInteractions.find(interaction => interaction.cardId === card.id)
      if (negativeInteraction) {
        penalty = negativeInteraction.type === 'NEVER_SHOW' ? 1.0 : 0.5
      }
      
      score = keywordScore + recencyScore + priorityScore - penalty
      
      return {
        ...card,
        score: Math.max(0, score)
      }
    })
    
    // Sort by score and return top 5 cards
    const matchingCards = scoredCards
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ score, ...card }) => card)
    
    return matchingCards
  } catch (error) {
    console.error('Error getting matching cards:', error)
    throw error
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    const cards = await getMatchingCardsForUser(userId)
    
    return NextResponse.json({ cards })
  } catch (error) {
    console.error('Error in cards API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, cardId, action, sharedWith, notes } = body
    
    if (!userId || !cardId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Record user interaction
    const interaction = await db.userInteraction.create({
      data: {
        userId,
        cardId,
        type: action.toUpperCase(),
        sharedWith,
        notes
      }
    })
    
    // If this is a share action, create/update weekly digest
    if (action.toUpperCase() === 'SHARE') {
      const now = new Date()
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      // Get or create weekly digest
      let weeklyDigest = await db.weeklyDigest.findUnique({
        where: { userId_weekStart: { userId, weekStart } }
      })
      
      if (!weeklyDigest) {
        weeklyDigest = await db.weeklyDigest.create({
          data: {
            userId,
            weekStart,
            weekEnd,
            content: ''
          }
        })
      }
      
      // Add item to digest
      const card = await db.card.findUnique({ where: { id: cardId } })
      if (card) {
        await db.weeklyDigestItem.create({
          data: {
            digestId: weeklyDigest.id,
            cardId,
            cardType: card.type,
            cardTitle: card.title,
            interaction: 'SHARE',
            sharedWith
          }
        })
      }
    }
    
    return NextResponse.json({ success: true, interaction })
  } catch (error) {
    console.error('Error recording interaction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}