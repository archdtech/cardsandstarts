import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// POST /api/offers/[id]/decline - Decline an offer
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
    
    // Update offer status to DECLINED
    const offer = await db.offer.update({
      where: { id },
      data: {
        status: "DECLINED",
        updatedAt: new Date()
      },
      include: {
        startup: true,
        gig: true,
        startupInteractions: true
      }
    })
    
    return NextResponse.json({ 
      message: "Offer declined successfully", 
      offer 
    })
  } catch (error) {
    console.error("Error declining offer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}