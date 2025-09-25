import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/offers - Get all offers or offers by startup ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startupId = searchParams.get("startupId")
    
    if (startupId) {
      // Get offers by startup ID
      const offers = await db.offer.findMany({
        where: { startupId },
        include: {
          startup: true,
          gig: true,
          startupInteractions: true
        },
        orderBy: { createdAt: "desc" }
      })
      
      return NextResponse.json(offers)
    } else {
      // Get all offers
      const offers = await db.offer.findMany({
        include: {
          startup: true,
          gig: true,
          startupInteractions: true
        },
        orderBy: { createdAt: "desc" }
      })
      
      return NextResponse.json(offers)
    }
  } catch (error) {
    console.error("Error fetching offers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/offers - Create new offer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      startupId,
      gigId,
      type,
      title,
      description,
      company,
      contact,
      budget,
      timeline,
      terms,
      priority
    } = body
    
    // Validate required fields
    if (!startupId || !type || !title || !description) {
      return NextResponse.json({ 
        error: "Startup ID, type, title, and description are required" 
      }, { status: 400 })
    }
    
    // Check if startup exists
    const startup = await db.startup.findUnique({
      where: { id: startupId }
    })
    
    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }
    
    // If gigId is provided, check if gig exists
    if (gigId) {
      const gig = await db.gig.findUnique({
        where: { id: gigId }
      })
      
      if (!gig) {
        return NextResponse.json({ error: "Gig not found" }, { status: 404 })
      }
    }
    
    // Create offer
    const offer = await db.offer.create({
      data: {
        startupId,
        gigId,
        type,
        title,
        description,
        company,
        contact,
        budget,
        timeline,
        terms,
        priority: priority ? parseInt(priority) : 1
      },
      include: {
        startup: true,
        gig: true,
        startupInteractions: true
      }
    })
    
    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    console.error("Error creating offer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}