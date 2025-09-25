import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// PUT /api/gigs/[id] - Update gig
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { id } = params
    
    const {
      title,
      description,
      type,
      status,
      budget,
      duration,
      requirements,
      deliverables,
      skills,
      experience,
      location,
      priority,
      isActive
    } = body
    
    // Check if gig exists
    const existingGig = await db.gig.findUnique({
      where: { id }
    })
    
    if (!existingGig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 })
    }
    
    // Update gig
    const gig = await db.gig.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(status !== undefined && { status }),
        ...(budget !== undefined && { budget }),
        ...(duration !== undefined && { duration }),
        ...(requirements !== undefined && { requirements }),
        ...(deliverables !== undefined && { deliverables }),
        ...(skills !== undefined && { skills }),
        ...(experience !== undefined && { experience }),
        ...(location !== undefined && { location }),
        ...(priority !== undefined && { priority: parseInt(priority) }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date()
      },
      include: {
        startup: true,
        offers: true,
        startupInteractions: true
      }
    })
    
    return NextResponse.json(gig)
  } catch (error) {
    console.error("Error updating gig:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/gigs/[id] - Delete gig
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    // Check if gig exists
    const existingGig = await db.gig.findUnique({
      where: { id }
    })
    
    if (!existingGig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 })
    }
    
    // Delete gig (cascade will handle related records)
    await db.gig.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: "Gig deleted successfully" })
  } catch (error) {
    console.error("Error deleting gig:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}