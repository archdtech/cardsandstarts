import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// PUT /api/offers/[id] - Update offer
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { id } = params
    
    const {
      type,
      status,
      title,
      description,
      company,
      contact,
      budget,
      timeline,
      terms,
      priority,
      isActive
    } = body
    
    // Check if offer exists
    const existingOffer = await db.offer.findUnique({
      where: { id }
    })
    
    if (!existingOffer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }
    
    // Update offer
    const offer = await db.offer.update({
      where: { id },
      data: {
        ...(type !== undefined && { type }),
        ...(status !== undefined && { status }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(company !== undefined && { company }),
        ...(contact !== undefined && { contact }),
        ...(budget !== undefined && { budget }),
        ...(timeline !== undefined && { timeline }),
        ...(terms !== undefined && { terms }),
        ...(priority !== undefined && { priority: parseInt(priority) }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date()
      },
      include: {
        startup: true,
        gig: true,
        startupInteractions: true
      }
    })
    
    return NextResponse.json(offer)
  } catch (error) {
    console.error("Error updating offer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/offers/[id] - Delete offer
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    // Check if offer exists
    const existingOffer = await db.offer.findUnique({
      where: { id }
    })
    
    if (!existingOffer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }
    
    // Delete offer (cascade will handle related records)
    await db.offer.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: "Offer deleted successfully" })
  } catch (error) {
    console.error("Error deleting offer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}