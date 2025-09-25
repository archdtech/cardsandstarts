import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/startups - Get all startups or startup by user ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    
    if (userId) {
      // Get startup by user ID
      const startup = await db.startup.findUnique({
        where: { userId },
        include: {
          gigs: true,
          offers: true,
          startupInteractions: true
        }
      })
      
      if (!startup) {
        return NextResponse.json({ error: "Startup not found" }, { status: 404 })
      }
      
      return NextResponse.json(startup)
    } else {
      // Get all startups
      const startups = await db.startup.findMany({
        include: {
          gigs: true,
          offers: true,
          startupInteractions: true
        }
      })
      
      return NextResponse.json(startups)
    }
  } catch (error) {
    console.error("Error fetching startups:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/startups - Create new startup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      userId,
      name,
      description,
      industry,
      stage,
      teamSize,
      website,
      location,
      foundedYear,
      funding,
      techStack,
      businessModel,
      targetMarket
    } = body
    
    // Validate required fields
    if (!userId || !name) {
      return NextResponse.json({ error: "User ID and name are required" }, { status: 400 })
    }
    
    // Check if startup already exists for this user
    const existingStartup = await db.startup.findUnique({
      where: { userId }
    })
    
    if (existingStartup) {
      return NextResponse.json({ error: "Startup already exists for this user" }, { status: 400 })
    }
    
    // Create startup
    const startup = await db.startup.create({
      data: {
        userId,
        name,
        description,
        industry,
        stage,
        teamSize: teamSize ? parseInt(teamSize) : null,
        website,
        location,
        foundedYear: foundedYear ? parseInt(foundedYear) : null,
        funding,
        techStack,
        businessModel,
        targetMarket
      },
      include: {
        gigs: true,
        offers: true,
        startupInteractions: true
      }
    })
    
    return NextResponse.json(startup, { status: 201 })
  } catch (error) {
    console.error("Error creating startup:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}