import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/gigs - Get all gigs or gigs by startup ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startupId = searchParams.get("startupId")
    
    if (startupId) {
      // Get gigs by startup ID
      const gigs = await db.gig.findMany({
        where: { startupId },
        include: {
          startup: true,
          offers: true,
          startupInteractions: true
        },
        orderBy: { createdAt: "desc" }
      })
      
      return NextResponse.json(gigs)
    } else {
      // Get all gigs
      const gigs = await db.gig.findMany({
        include: {
          startup: true,
          offers: true,
          startupInteractions: true
        },
        orderBy: { createdAt: "desc" }
      })
      
      return NextResponse.json(gigs)
    }
  } catch (error) {
    console.error("Error fetching gigs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/gigs - Create new gig
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      startupId,
      title,
      description,
      type,
      budget,
      duration,
      requirements,
      deliverables,
      skills,
      experience,
      location,
      priority
    } = body
    
    // Validate required fields
    if (!startupId || !title || !description || !type) {
      return NextResponse.json({ 
        error: "Startup ID, title, description, and type are required" 
      }, { status: 400 })
    }
    
    // Check if startup exists
    const startup = await db.startup.findUnique({
      where: { id: startupId }
    })
    
    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }
    
    // Create gig
    const gig = await db.gig.create({
      data: {
        startupId,
        title,
        description,
        type,
        budget,
        duration,
        requirements,
        deliverables,
        skills,
        experience,
        location,
        priority: priority ? parseInt(priority) : 1
      },
      include: {
        startup: true,
        offers: true,
        startupInteractions: true
      }
    })
    
    return NextResponse.json(gig, { status: 201 })
  } catch (error) {
    console.error("Error creating gig:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}