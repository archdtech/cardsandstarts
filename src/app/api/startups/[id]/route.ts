import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// PUT /api/startups/[id] - Update startup
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { id } = params
    
    const {
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
    
    // Check if startup exists
    const existingStartup = await db.startup.findUnique({
      where: { id }
    })
    
    if (!existingStartup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }
    
    // Update startup
    const startup = await db.startup.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(industry !== undefined && { industry }),
        ...(stage !== undefined && { stage }),
        ...(teamSize !== undefined && { teamSize: teamSize ? parseInt(teamSize) : null }),
        ...(website !== undefined && { website }),
        ...(location !== undefined && { location }),
        ...(foundedYear !== undefined && { foundedYear: foundedYear ? parseInt(foundedYear) : null }),
        ...(funding !== undefined && { funding }),
        ...(techStack !== undefined && { techStack }),
        ...(businessModel !== undefined && { businessModel }),
        ...(targetMarket !== undefined && { targetMarket }),
        updatedAt: new Date()
      },
      include: {
        gigs: true,
        offers: true,
        startupInteractions: true
      }
    })
    
    return NextResponse.json(startup)
  } catch (error) {
    console.error("Error updating startup:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/startups/[id] - Delete startup
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    // Check if startup exists
    const existingStartup = await db.startup.findUnique({
      where: { id }
    })
    
    if (!existingStartup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }
    
    // Delete startup (cascade will handle related records)
    await db.startup.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: "Startup deleted successfully" })
  } catch (error) {
    console.error("Error deleting startup:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}