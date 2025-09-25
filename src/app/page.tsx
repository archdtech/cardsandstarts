"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  HandMetal, 
  Eye, 
  Share2, 
  Clock, 
  X, 
  Check,
  User,
  Settings,
  TrendingUp,
  Lightbulb,
  Users,
  Zap,
  Building2
} from "lucide-react"

// Mock data for cards - in real app this would come from API
const mockCards = [
  {
    id: "1",
    type: "PROJECT" as const,
    title: "Project Phoenix API Architecture",
    description: "New initiative needing your distributed systems expertise",
    content: "The team is designing a new microservices architecture for Project Phoenix and needs input on API design patterns, service communication, and scalability considerations.",
    reason: "Your distributed systems expertise matches this project's technical requirements perfectly.",
    priority: 4,
    createdAt: new Date()
  },
  {
    id: "2", 
    type: "INSIGHT" as const,
    title: "New Database Indexing Research",
    description: "Research paper on novel indexing techniques",
    content: "A breakthrough paper from VLDB 2024 introduces a new indexing approach that could improve query performance by 40% for time-series data.",
    reason: "This research aligns with your interest in database optimization and performance tuning.",
    priority: 3,
    createdAt: new Date()
  },
  {
    id: "3",
    type: "CONNECTION" as const,
    title: "Connect with Raj - Mobile Performance",
    description: "Shared interest in performance optimization",
    content: "You and Raj from the Mobile team are both working on performance optimization challenges. A 15-minute chat could be highly valuable for both of you.",
    reason: "Both of you have expertise in performance optimization and are tackling similar problems.",
    priority: 2,
    createdAt: new Date()
  },
  {
    id: "4",
    type: "NUDGE" as const,
    title: "API Architecture Debate - Input Needed",
    description: "Your input could prevent 2 weeks of rework",
    content: "The team is currently debating between REST vs GraphQL for Project Phoenix. Your experience with API architecture could help them avoid costly mistakes.",
    reason: "Your expertise is needed now to prevent architectural decisions that could cause significant rework.",
    priority: 5,
    createdAt: new Date()
  }
]

const getCardConfig = (type: string) => {
  switch (type) {
    case "PROJECT":
      return {
        icon: TrendingUp,
        color: "border-blue-500 bg-blue-50 dark:bg-blue-950",
        badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      }
    case "INSIGHT":
      return {
        icon: Lightbulb,
        color: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950",
        badgeColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      }
    case "CONNECTION":
      return {
        icon: Users,
        color: "border-green-500 bg-green-50 dark:bg-green-950",
        badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      }
    case "NUDGE":
      return {
        icon: Zap,
        color: "border-red-500 bg-red-50 dark:bg-red-950",
        badgeColor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      }
    default:
      return {
        icon: Eye,
        color: "border-gray-500 bg-gray-50 dark:bg-gray-950",
        badgeColor: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      }
  }
}

interface CardComponentProps {
  card: typeof mockCards[0]
  onAction: (cardId: string, action: string) => void
}

function CardComponent({ card, onAction }: CardComponentProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const config = getCardConfig(card.type)
  const Icon = config.icon

  return (
    <div 
      className="relative w-80 h-96 cursor-pointer transition-all duration-300 hover:scale-105"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`absolute inset-0 rounded-xl shadow-lg border-2 ${config.color} transition-all duration-300 ${isFlipped ? 'opacity-0 rotate-y-180' : 'opacity-100'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5" />
              <Badge className={config.badgeColor}>{card.type}</Badge>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: card.priority }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-orange-400 rounded-full" />
              ))}
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{card.description}</p>
          
          <div className="flex-1" />
          
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click to see why this matters →
          </p>
        </div>
      </div>
      
      <div className={`absolute inset-0 rounded-xl shadow-lg border-2 ${config.color} bg-white dark:bg-slate-900 transition-all duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 rotate-y-180'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Icon className="w-5 h-5" />
            <Badge className={config.badgeColor}>{card.type}</Badge>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">{card.content}</p>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg mb-4">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Why This? Why Now?</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">{card.reason}</p>
          </div>
          
          <div className="flex-1" />
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  onAction(card.id, "act")
                }}
              >
                Act On It
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  onAction(card.id, "share")
                }}
              >
                Share...
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="ghost"
                className="flex-1 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onAction(card.id, "not_now")
                }}
              >
                Not Now
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                className="flex-1 text-red-600 hover:text-red-800 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation()
                  onAction(card.id, "never_show")
                }}
              >
                Never Show
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [cards, setCards] = useState(mockCards)
  const [showDigest, setShowDigest] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  const handleCardAction = (cardId: string, action: string) => {
    console.log(`Card ${cardId} action: ${action}`)
    
    if (action === "not_now" || action === "never_show") {
      // Remove card from hand and move to next card
      const newCards = cards.filter(card => card.id !== cardId)
      setCards(newCards)
      
      // Adjust current card index if needed
      if (currentCardIndex >= newCards.length) {
        setCurrentCardIndex(Math.max(0, newCards.length - 1))
      }
      
      if (action === "never_show") {
        // Show a more professional notification instead of alert
        setTimeout(() => {
          alert("This card will never be shown to you again. The AI has learned your preference.")
        }, 300)
      }
    } else if (action === "share") {
      // Show share dialog
      alert("Share dialog would open here - you could share with your manager or team")
    } else if (action === "act") {
      // Add to personal todo list
      alert("Added to your personal todo list - you can track this in your weekly digest")
    }
  }

  const nextCard = () => {
    setCurrentCardIndex((prev) => Math.min(prev + 1, cards.length - 1))
  }

  const prevCard = () => {
    setCurrentCardIndex((prev) => Math.max(prev - 1, 0))
  }

  const goToCard = (index: number) => {
    setCurrentCardIndex(index)
  }

  // If no cards, show empty state
  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <HandMetal className="w-8 h-8 text-blue-600" />
                <h1 className="text-xl font-bold">Lens</h1>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/onboarding"}>
                <Settings className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
            </div>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              No Cards This Week
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              You've processed all your opportunities. Check back next week for new curated cards!
            </p>
            <div className="space-y-4">
              <Button onClick={() => window.location.href = "/onboarding"}>
                Update Your Profile
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/startup"}>
                <Building2 className="w-4 h-4 mr-2" />
                Go to Startup Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <HandMetal className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold">Lens</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setShowDigest(true)}>
                <Eye className="w-4 h-4 mr-2" />
                Weekly Digest
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/startup"}>
                <Building2 className="w-4 h-4 mr-2" />
                Startup Dashboard
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Profile Settings</DialogTitle>
                    <DialogDescription>
                      Adjust your focus and preferences
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Adjust Your Focus
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="w-4 h-4 mr-2" />
                      View Activity History
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = "/startup"}>
                      <Building2 className="w-4 h-4 mr-2" />
                      Startup Dashboard
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Your Weekly Hand
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
            3-5 curated opportunities to maximize your impact
          </p>
          <p className="text-sm text-slate-500">
            Card {currentCardIndex + 1} of {cards.length}
          </p>
        </div>

        {/* Card Navigation */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            className="flex items-center gap-2"
          >
            Previous
          </Button>
          
          {/* Card Indicators */}
          <div className="flex gap-2">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => goToCard(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentCardIndex
                    ? "bg-blue-600"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextCard}
            disabled={currentCardIndex === cards.length - 1}
            className="flex items-center gap-2"
          >
            Next
          </Button>
        </div>

        {/* Current Card Display */}
        <div className="flex justify-center items-center min-h-[500px] mb-12">
          <CardComponent 
            card={cards[currentCardIndex]} 
            onAction={handleCardAction}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => window.location.href = "/onboarding"}>
            <Settings className="w-4 h-4 mr-2" />
            Update Profile
          </Button>
          <Button onClick={() => setShowDigest(true)}>
            <Eye className="w-4 h-4 mr-2" />
            View Weekly Digest
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/startup"}>
            <Building2 className="w-4 h-4 mr-2" />
            Startup Dashboard
          </Button>
        </div>
      </main>

      {/* Weekly Digest Dialog */}
      <Dialog open={showDigest} onOpenChange={setShowDigest}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Your Weekly Digest</DialogTitle>
            <DialogDescription>
              Summary of your activities this week
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">This Week's Activities</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium">🧠 Insight Shared</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      You identified and shared a key research paper on new database indexing techniques that could impact our Platform project.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium">🤝 Connection Made</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      You were introduced to Raj from the Mobile team to advise on their performance optimization work.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium">⚡️ High-Leverage Action</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      You provided critical input on the API architecture debate, preventing potential rework.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Current Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Distributed Systems</Badge>
                <Badge variant="secondary">Performance Optimization</Badge>
                <Badge variant="secondary">API Architecture</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Send Weekly Digest to Manager</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Your manager will receive a summary of your activities
                </p>
              </div>
              <Button>Approve & Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}