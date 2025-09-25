import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// POST /api/offers/[id]/accept - Accept an offer
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    // Check if offer exists
    const existingOffer = await db.offer.findUnique({
      where: { id }
    })
    
    if (!existingOffer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }
    
    // Update offer status to ACCEPTED
    const offer = await db.offer.update({
      where: { id },
      data: {
        status: "ACCEPTED",
        updatedAt: new Date()
      },
      include: {
        startup: true,
        gig: true,
        startupInteractions: true
      }
    })
    
    return NextResponse.json({ 
      message: "Offer accepted successfully", 
      offer 
    })
  } catch (error) {
    console.error("Error accepting offer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}