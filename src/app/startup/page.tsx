"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Building2, 
  Plus, 
  Briefcase, 
  Handshake, 
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Settings,
  User,
  Edit,
  Eye,
  Check,
  X,
  Star,
  Loader2,
  Target,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { StartupProfile } from "@/components/startup/StartupProfile"
import { CreateGig } from "@/components/startup/CreateGig"
import { GigList } from "@/components/startup/GigList"
import { OfferList } from "@/components/startup/OfferList"
import { FocusChart } from "@/components/FocusChart"
import { TaskBoard } from "@/components/TaskBoard"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Task, BusinessCategory, GOAL_PRESETS } from "@/lib/business-types"

// API interfaces
interface Startup {
  id: string
  userId: string
  name: string
  description?: string
  industry?: string
  stage?: string
  teamSize?: number
  website?: string
  location?: string
  foundedYear?: number
  funding?: string
  techStack?: string
  businessModel?: string
  targetMarket?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  gigs?: Gig[]
  offers?: Offer[]
}

interface Gig {
  id: string
  startupId: string
  title: string
  description: string
  type: string
  status: string
  budget?: string
  duration?: string
  requirements?: string
  deliverables?: string
  skills?: string
  experience?: string
  location?: string
  priority: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Offer {
  id: string
  startupId: string
  gigId?: string
  type: string
  status: string
  title: string
  description: string
  company?: string
  contact?: string
  budget?: string
  timeline?: string
  terms?: string
  priority: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function StartupDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startup, setStartup] = useState<Startup | null>(null)
  const [gigs, setGigs] = useState<Gig[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [updatingOffer, setUpdatingOffer] = useState<string | null>(null)
  const [showEditProfile, setShowEditProfile] = useState(false)
  
  // Form state for editing profile
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    industry: '',
    stage: '',
    teamSize: '',
    website: '',
    location: '',
    foundedYear: '',
    funding: '',
    techStack: '',
    businessModel: '',
    targetMarket: ''
  })

  // New state for enhanced functionality
  const [tasks, setTasks] = useState<Task[]>([])
  const [focusWeights, setFocusWeights] = useState<Record<BusinessCategory, number>>({
    People: 15,
    Product: 25,
    GTM: 20,
    Tech: 20,
    Strategy: 10,
    Operations: 5,
    Finance: 3,
    Hiring: 1,
    Management: 1,
  })
  const [selectedPreset, setSelectedPreset] = useState<string>("")

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // For demo purposes, we'll fetch the first startup
        // In a real app, this would be based on the authenticated user
        const response = await fetch('/api/startups')
        if (!response.ok) {
          throw new Error('Failed to fetch startup data')
        }
        
        const startups = await response.json()
        if (startups && startups.length > 0) {
          const startupData = startups[0]
          setStartup(startupData)
          setGigs(startupData.gigs || [])
          setOffers(startupData.offers || [])
        } else {
          setError('No startup found')
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handler functions
  const handleEditProfile = () => {
    if (startup) {
      setEditForm({
        name: startup.name || '',
        description: startup.description || '',
        industry: startup.industry || '',
        stage: startup.stage || '',
        teamSize: startup.teamSize?.toString() || '',
        website: startup.website || '',
        location: startup.location || '',
        foundedYear: startup.foundedYear?.toString() || '',
        funding: startup.funding || '',
        techStack: startup.techStack || '',
        businessModel: startup.businessModel || '',
        targetMarket: startup.targetMarket || ''
      })
      setShowEditProfile(true)
    }
  }

  const handleUpdateStartup = async () => {
    if (!startup) return

    try {
      const updatedData: Partial<Startup> = {
        name: editForm.name || undefined,
        description: editForm.description || undefined,
        industry: editForm.industry || undefined,
        stage: editForm.stage || undefined,
        teamSize: editForm.teamSize ? parseInt(editForm.teamSize) : undefined,
        website: editForm.website || undefined,
        location: editForm.location || undefined,
        foundedYear: editForm.foundedYear ? parseInt(editForm.foundedYear) : undefined,
        funding: editForm.funding || undefined,
        techStack: editForm.techStack || undefined,
        businessModel: editForm.businessModel || undefined,
        targetMarket: editForm.targetMarket || undefined,
      }

      const response = await fetch(`/api/startups/${startup.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error('Failed to update startup profile')
      }

      const updatedStartup = await response.json()
      setStartup(updatedStartup)
      setShowEditProfile(false)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error('Error updating startup:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const handleAcceptOffer = async (offerId: string) => {
    try {
      setUpdatingOffer(offerId)
      
      const response = await fetch(`/api/offers/${offerId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to accept offer')
      }

      const result = await response.json()
      
      // Update the offers list
      setOffers(prevOffers => 
        prevOffers.map(offer => 
          offer.id === offerId 
            ? { ...offer, status: 'ACCEPTED' }
            : offer
        )
      )

      toast({
        title: "Success",
        description: result.message || "Offer accepted successfully",
      })
    } catch (error) {
      console.error('Error accepting offer:', error)
      toast({
        title: "Error",
        description: "Failed to accept offer",
        variant: "destructive",
      })
    } finally {
      setUpdatingOffer(null)
    }
  }

  const handleDeclineOffer = async (offerId: string) => {
    try {
      setUpdatingOffer(offerId)
      
      const response = await fetch(`/api/offers/${offerId}/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to decline offer')
      }

      const result = await response.json()
      
      // Update the offers list
      setOffers(prevOffers => 
        prevOffers.map(offer => 
          offer.id === offerId 
            ? { ...offer, status: 'DECLINED' }
            : offer
        )
      )

      toast({
        title: "Success",
        description: result.message || "Offer declined successfully",
      })
    } catch (error) {
      console.error('Error declining offer:', error)
      toast({
        title: "Error",
        description: "Failed to decline offer",
        variant: "destructive",
      })
    } finally {
      setUpdatingOffer(null)
    }
  }

  const handleFormChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Task management handlers
  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    )
  }

  const handleTaskCreate = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks(prevTasks => [...prevTasks, newTask])
    toast({
      title: "Task Created",
      description: `"${newTask.title}" has been added to your task board.`,
    })
  }

  const handleTaskDelete = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
    toast({
      title: "Task Deleted",
      description: "Task has been removed from your task board.",
    })
  }

  // Focus weights handler
  const handleFocusWeightChange = (category: BusinessCategory, weight: number) => {
    setFocusWeights(prev => ({
      ...prev,
      [category]: weight
    }))
  }

  // Goal preset handler
  const handlePresetChange = (presetId: string) => {
    const preset = GOAL_PRESETS.find(p => p.id === presetId)
    if (preset) {
      setSelectedPreset(presetId)
      setFocusWeights(preset.focusWeights)
      
      // Add preset tasks to the task board
      const newTasks = preset.tasks.map(taskData => ({
        ...taskData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "todo" as const,
      }))
      
      setTasks(prevTasks => [...prevTasks, ...newTasks])
      
      toast({
        title: "Goal Preset Applied",
        description: `"${preset.name}" tasks have been added to your board.`,
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading startup dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <X className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-lg text-muted-foreground">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">No startup found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{startup.name}</h1>
                <p className="text-muted-foreground">{startup.industry} • {startup.stage}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" onClick={handleEditProfile}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Company Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Company Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{startup.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="font-medium">{startup.teamSize} people</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Founded</p>
                    <p className="font-medium">{startup.foundedYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Funding</p>
                    <p className="font-medium">{startup.funding}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{startup.location}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tech Stack</p>
                  <p className="text-sm">{startup.techStack}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business Model</p>
                  <p className="text-sm">{startup.businessModel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Market</p>
                  <p className="text-sm">{startup.targetMarket}</p>
                </div>
                {startup.website && (
                  <div>
                    <p className="text-sm text-muted-foreground">Website</p>
                    <a 
                      href={startup.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {startup.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{gigs.length}</p>
                      <p className="text-xs text-muted-foreground">Active Gigs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Handshake className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{offers.length}</p>
                      <p className="text-xs text-muted-foreground">Opportunities</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="gigs">Services ({gigs.length})</TabsTrigger>
                <TabsTrigger value="offers">Opportunities ({offers.length})</TabsTrigger>
                <TabsTrigger value="focus">Focus ({Object.values(focusWeights).reduce((a, b) => a + b, 0)}%)</TabsTrigger>
                <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New investment opportunity</p>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Project proposal received</p>
                            <p className="text-xs text-muted-foreground">1 day ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Partnership inquiry</p>
                            <p className="text-xs text-muted-foreground">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="h-5 w-5 mr-2" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Gig
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View All Opportunities
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Team
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Opportunities Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Handshake className="h-5 w-5 mr-2" />
                      Recent Opportunities
                    </CardTitle>
                    <CardDescription>Latest business opportunities and offers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {offers.slice(0, 3).map((offer) => (
                        <div key={offer.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{offer.title}</p>
                            <p className="text-xs text-muted-foreground">{offer.company}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={offer.status === 'PENDING' ? 'secondary' : 'default'}>
                              {offer.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {offers.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          No opportunities available
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Collaborative Pod Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Collaborative Pod Insights
                    </CardTitle>
                    <CardDescription>Strategic advantages for your startup journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          The 100% of Nothing Paradox
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Consider strategic partnerships over complete ownership of a smaller venture.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                          Collaborative Flywheel Effect
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Each new partnership amplifies the value of all existing relationships.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-purple-500" />
                          Risk Distribution Advantage
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Spread both financial and operational risk across multiple partnerships.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-orange-500" />
                          Cross-Pollination Innovation
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Generate unexpected innovations through complementary business partnerships.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gigs" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your Services</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Service
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {gigs.map((gig) => (
                    <Card key={gig.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{gig.title}</CardTitle>
                          <Badge variant={gig.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {gig.status}
                          </Badge>
                        </div>
                        <CardDescription>{gig.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Type</p>
                            <p className="font-medium">{gig.type}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Budget</p>
                            <p className="font-medium">{gig.budget}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">{gig.duration}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Priority</p>
                            <p className="font-medium">{gig.priority}/5</p>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {gigs.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No services created yet</p>
                        <Button className="mt-4">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Service
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="offers" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Business Opportunities</h2>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {offers.map((offer) => (
                    <Card key={offer.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{offer.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant={offer.status === 'PENDING' ? 'secondary' : 'default'}>
                              {offer.status}
                            </Badge>
                            <Badge variant="outline">{offer.type}</Badge>
                          </div>
                        </div>
                        <CardDescription>{offer.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Company</p>
                            <p className="font-medium">{offer.company}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Budget</p>
                            <p className="font-medium">{offer.budget}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Timeline</p>
                            <p className="font-medium">{offer.timeline}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Priority</p>
                            <p className="font-medium">{offer.priority}/5</p>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleAcceptOffer(offer.id)}
                            disabled={updatingOffer === offer.id}
                          >
                            {updatingOffer === offer.id ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Check className="h-3 w-3 mr-1" />
                            )}
                            Accept
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeclineOffer(offer.id)}
                            disabled={updatingOffer === offer.id}
                          >
                            {updatingOffer === offer.id ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            Decline
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {offers.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Handshake className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No business opportunities available</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Check back later for new opportunities
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="focus" className="space-y-6">
                <FocusChart 
                  focusWeights={focusWeights}
                  onWeightChange={handleFocusWeightChange}
                  selectedPreset={selectedPreset}
                  onPresetChange={handlePresetChange}
                />
              </TabsContent>

              <TabsContent value="tasks" className="space-y-6">
                <TaskBoard 
                  tasks={tasks}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskCreate={handleTaskCreate}
                  onTaskDelete={handleTaskDelete}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Startup Profile</DialogTitle>
            <DialogDescription>
              Update your startup information and profile details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Startup Name</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={editForm.industry}
                  onChange={(e) => handleFormChange('industry', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editForm.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Input
                  id="stage"
                  value={editForm.stage}
                  onChange={(e) => handleFormChange('stage', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  type="number"
                  value={editForm.teamSize}
                  onChange={(e) => handleFormChange('teamSize', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editForm.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="foundedYear">Founded Year</Label>
                <Input
                  id="foundedYear"
                  type="number"
                  value={editForm.foundedYear}
                  onChange={(e) => handleFormChange('foundedYear', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="funding">Funding</Label>
              <Input
                id="funding"
                value={editForm.funding}
                onChange={(e) => handleFormChange('funding', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack</Label>
              <Input
                id="techStack"
                value={editForm.techStack}
                onChange={(e) => handleFormChange('techStack', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessModel">Business Model</Label>
                <Input
                  id="businessModel"
                  value={editForm.businessModel}
                  onChange={(e) => handleFormChange('businessModel', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetMarket">Target Market</Label>
                <Input
                  id="targetMarket"
                  value={editForm.targetMarket}
                  onChange={(e) => handleFormChange('targetMarket', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={editForm.website}
                onChange={(e) => handleFormChange('website', e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditProfile(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStartup}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}