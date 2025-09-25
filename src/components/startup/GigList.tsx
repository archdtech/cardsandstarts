"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Briefcase, 
  Edit, 
  Eye, 
  Pause, 
  Play, 
  Trash2, 
  DollarSign, 
  Clock, 
  MapPin,
  Star,
  Users
} from "lucide-react"

interface Gig {
  id: string
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

interface GigListProps {
  gigs: Gig[]
  onGigUpdate: (gig: Gig) => void
}

export function GigList({ gigs, onGigUpdate }: GigListProps) {
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null)

  const getGigTypeConfig = (type: string) => {
    const configs = {
      DEVELOPMENT: { icon: Briefcase, color: "bg-blue-100 text-blue-800", label: "Development" },
      CONSULTING: { icon: Users, color: "bg-purple-100 text-purple-800", label: "Consulting" },
      DESIGN: { icon: Eye, color: "bg-pink-100 text-pink-800", label: "Design" },
      MARKETING: { icon: Star, color: "bg-green-100 text-green-800", label: "Marketing" },
      SALES: { icon: DollarSign, color: "bg-yellow-100 text-yellow-800", label: "Sales" },
      RESEARCH: { icon: Star, color: "bg-indigo-100 text-indigo-800", label: "Research" },
      SUPPORT: { icon: Users, color: "bg-gray-100 text-gray-800", label: "Support" },
      TRAINING: { icon: Users, color: "bg-orange-100 text-orange-800", label: "Training" },
      OTHER: { icon: Briefcase, color: "bg-slate-100 text-slate-800", label: "Other" }
    }
    return configs[type] || configs.OTHER
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      ACTIVE: { color: "bg-green-100 text-green-800", label: "Active", icon: Play },
      PAUSED: { color: "bg-yellow-100 text-yellow-800", label: "Paused", icon: Pause },
      COMPLETED: { color: "bg-blue-100 text-blue-800", label: "Completed", icon: Eye },
      CANCELLED: { color: "bg-red-100 text-red-800", label: "Cancelled", icon: Trash2 }
    }
    return configs[status] || { color: "bg-gray-100 text-gray-800", label: status, icon: Eye }
  }

  const toggleGigStatus = (gig: Gig) => {
    const updatedGig = {
      ...gig,
      status: gig.status === "ACTIVE" ? "PAUSED" : "ACTIVE",
      isActive: gig.status === "PAUSED"
    }
    onGigUpdate(updatedGig)
  }

  const getPriorityStars = (priority: number) => {
    return Array.from({ length: priority }, (_, i) => (
      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
    ))
  }

  if (gigs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Gigs Yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Create your first gig to start attracting opportunities
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {gigs.map((gig) => {
        const typeConfig = getGigTypeConfig(gig.type)
        const statusConfig = getStatusConfig(gig.status)
        const TypeIcon = typeConfig.icon
        const StatusIcon = statusConfig.icon

        return (
          <Card key={gig.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <TypeIcon className="w-4 h-4" />
                    <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
                    <Badge className={statusConfig.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{gig.title}</CardTitle>
                  <CardDescription>{gig.description}</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  {getPriorityStars(gig.priority)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {gig.budget && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>{gig.budget}</span>
                  </div>
                )}
                {gig.duration && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{gig.duration}</span>
                  </div>
                )}
                {gig.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{gig.location}</span>
                  </div>
                )}
                {gig.experience && (
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <span>{gig.experience}</span>
                  </div>
                )}
              </div>
              
              {gig.skills && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {gig.skills.split(',').map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedGig(gig)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <TypeIcon className="w-5 h-5" />
                          {gig.title}
                        </DialogTitle>
                        <DialogDescription>
                          {typeConfig.label} • {statusConfig.label}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground">{gig.description}</p>
                        </div>
                        
                        {gig.requirements && (
                          <div>
                            <h4 className="font-medium mb-2">Requirements</h4>
                            <p className="text-sm text-muted-foreground">{gig.requirements}</p>
                          </div>
                        )}
                        
                        {gig.deliverables && (
                          <div>
                            <h4 className="font-medium mb-2">Deliverables</h4>
                            <p className="text-sm text-muted-foreground">{gig.deliverables}</p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Details</h4>
                            <div className="space-y-1 text-sm">
                              {gig.budget && (
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-3 h-3" />
                                  <span>{gig.budget}</span>
                                </div>
                              )}
                              {gig.duration && (
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3" />
                                  <span>{gig.duration}</span>
                                </div>
                              )}
                              {gig.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-3 h-3" />
                                  <span>{gig.location}</span>
                                </div>
                              )}
                              {gig.experience && (
                                <div className="flex items-center gap-2">
                                  <Star className="w-3 h-3" />
                                  <span>{gig.experience}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {gig.skills?.split(',').map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleGigStatus(gig)}
                  >
                    {gig.status === "ACTIVE" ? (
                      <>
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Created {new Date(gig.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}