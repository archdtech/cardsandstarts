import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// POST /api/sample-data - Create sample data for testing
export async function POST(request: NextRequest) {
  try {
    // First, create a sample user if it doesn't exist
    const sampleUser = await db.user.upsert({
      where: { id: "user_1" },
      update: {},
      create: {
        id: "user_1",
        email: "startup@techflow.io",
        name: "TechFlow Founder",
        expertiseKeywords: "AI,workflow,automation,SaaS",
        interestKeywords: "startups,technology,investment",
        connectionPreference: "collaboration"
      }
    })

    // Create a sample startup if it doesn't exist
    const sampleStartup = await db.startup.upsert({
      where: { userId: "user_1" },
      update: {},
      create: {
        userId: "user_1",
        name: "TechFlow Inc.",
        description: "AI-powered workflow automation platform for modern teams",
        industry: "SaaS",
        stage: "Series A",
        teamSize: 15,
        website: "https://techflow.io",
        location: "San Francisco, CA",
        foundedYear: 2021,
        funding: "$5M",
        techStack: "React, Node.js, Python, PostgreSQL, AWS",
        businessModel: "B2B SaaS",
        targetMarket: "Mid-market enterprises"
      }
    })

    // Create sample gigs
    const sampleGigs = await Promise.all([
      db.gig.upsert({
        where: { id: "gig_1" },
        update: {},
        create: {
          id: "gig_1",
          startupId: sampleStartup.id,
          title: "Frontend Development for Dashboard",
          description: "Need experienced React developer to build new analytics dashboard",
          type: "DEVELOPMENT",
          status: "ACTIVE",
          budget: "$3000-5000",
          duration: "2-3 weeks",
          requirements: "Strong React, TypeScript, and chart library experience",
          deliverables: "Fully functional analytics dashboard with responsive design",
          skills: "React, TypeScript, D3.js, CSS",
          experience: "3+ years",
          location: "Remote",
          priority: 4
        }
      }),
      db.gig.upsert({
        where: { id: "gig_2" },
        update: {},
        create: {
          id: "gig_2",
          startupId: sampleStartup.id,
          title: "UI/UX Design for Mobile App",
          description: "Looking for talented designer to redesign mobile app interface",
          type: "DESIGN",
          status: "ACTIVE",
          budget: "$2000-3500",
          duration: "1-2 weeks",
          requirements: "Experience with mobile app design and Figma",
          deliverables: "Complete design system and mockups for mobile app",
          skills: "Figma, Mobile Design, UI/UX",
          experience: "2+ years",
          location: "Remote",
          priority: 3
        }
      })
    ])

    // Create sample offers
    const sampleOffers = await Promise.all([
      db.offer.upsert({
        where: { id: "offer_1" },
        update: {},
        create: {
          id: "offer_1",
          startupId: sampleStartup.id,
          type: "PROJECT",
          status: "PENDING",
          title: "Enterprise Client Project",
          description: "Large enterprise client needs custom workflow automation solution",
          company: "Fortune 500 Company",
          contact: "john@enterprise.com",
          budget: "$50,000-75,000",
          timeline: "3-4 months",
          terms: "Fixed price project with milestone payments",
          priority: 5
        }
      }),
      db.offer.upsert({
        where: { id: "offer_2" },
        update: {},
        create: {
          id: "offer_2",
          startupId: sampleStartup.id,
          type: "PARTNERSHIP",
          status: "INTERESTED",
          title: "Strategic Partnership Opportunity",
          description: "Leading CRM platform wants to integrate with our solution",
          company: "CRM Corp",
          contact: "partnerships@crmcorp.com",
          budget: "Revenue sharing",
          timeline: "Ongoing",
          terms: "50/50 revenue sharing on joint customers",
          priority: 4
        }
      }),
      db.offer.upsert({
        where: { id: "offer_3" },
        update: {},
        create: {
          id: "offer_3",
          startupId: sampleStartup.id,
          type: "INVESTMENT",
          status: "PENDING",
          title: "Series A Investment Opportunity",
          description: "VC firm interested in leading your Series A round",
          company: "Tech Ventures LLC",
          contact: "sarah@techventures.com",
          budget: "$10M",
          timeline: "Due diligence in 2 months",
          terms: "Standard Series A terms with 20% option pool",
          priority: 5
        }
      })
    ])

    return NextResponse.json({
      message: "Sample data created successfully",
      startup: sampleStartup,
      gigs: sampleGigs,
      offers: sampleOffers
    })
  } catch (error) {
    console.error("Error creating sample data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}