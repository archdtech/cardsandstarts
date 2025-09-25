"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Briefcase, 
  Handshake, 
  Building2, 
  Eye, 
  Check, 
  X, 
  DollarSign, 
  Clock, 
  Mail,
  Users,
  Star,
  TrendingUp,
  AlertCircle
} from "lucide-react"

interface Offer {
  id: string
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

interface OfferListProps {
  offers: Offer[]
  onOfferUpdate: (offer: Offer) => void
}

export function OfferList({ offers, onOfferUpdate }: OfferListProps) {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)

  const getOfferTypeConfig = (type: string) => {
    const configs = {
      PROJECT: { icon: Briefcase, color: "bg-blue-100 text-blue-800", label: "Project" },
      PARTNERSHIP: { icon: Handshake, color: "bg-purple-100 text-purple-800", label: "Partnership" },
      INVESTMENT: { icon: DollarSign, color: "bg-green-100 text-green-800", label: "Investment" },
      ACQUISITION: { icon: Building2, color: "bg-red-100 text-red-800", label: "Acquisition" },
      COLLABORATION: { icon: Users, color: "bg-yellow-100 text-yellow-800", label: "Collaboration" },
      MENTORSHIP: { icon: Star, color: "bg-indigo-100 text-indigo-800", label: "Mentorship" },
      OTHER: { icon: Briefcase, color: "bg-slate-100 text-slate-800", label: "Other" }
    }
    return configs[type] || configs.OTHER
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: { 
        color: "bg-yellow-100 text-yellow-800", 
        label: "Pending", 
        icon: AlertCircle,
        actionLabel: "Review"
      },
      INTERESTED: { 
        color: "bg-blue-100 text-blue-800", 
        label: "Interested", 
        icon: Eye,
        actionLabel: "Follow Up"
      },
      IN_PROGRESS: { 
        color: "bg-purple-100 text-purple-800", 
        label: "In Progress", 
        icon: TrendingUp,
        actionLabel: "Update"
      },
      ACCEPTED: { 
        color: "bg-green-100 text-green-800", 
        label: "Accepted", 
        icon: Check,
        actionLabel: "View"
      },
      DECLINED: { 
        color: "bg-red-100 text-red-800", 
        label: "Declined", 
        icon: X,
        actionLabel: "View"
      },
      EXPIRED: { 
        color: "bg-gray-100 text-gray-800", 
        label: "Expired", 
        icon: Clock,
        actionLabel: "Archive"
      }
    }
    return configs[status] || { color: "bg-gray-100 text-gray-800", label: status, icon: Eye, actionLabel: "View" }
  }

  const updateOfferStatus = (offer: Offer, newStatus: string) => {
    const updatedOffer = {
      ...offer,
      status: newStatus,
      updatedAt: new Date().toISOString()
    }
    onOfferUpdate(updatedOffer)
  }

  const getPriorityStars = (priority: number) => {
    return Array.from({ length: priority }, (_, i) => (
      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
    ))
  }

  const getOffersByStatus = () => {
    return {
      pending: offers.filter(o => o.status === "PENDING"),
      interested: offers.filter(o => o.status === "INTERESTED"),
      inProgress: offers.filter(o => o.status === "IN_PROGRESS"),
      accepted: offers.filter(o => o.status === "ACCEPTED"),
      declined: offers.filter(o => o.status === "DECLINED"),
      expired: offers.filter(o => o.status === "EXPIRED")
    }
  }

  const offersByStatus = getOffersByStatus()

  if (offers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Handshake className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Offers Yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Create gigs to start receiving offers and opportunities
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(offersByStatus).map(([status, statusOffers]) => {
          const statusConfig = getStatusConfig(status.toUpperCase())
          const StatusIcon = statusConfig.icon
          
          return (
            <Card key={status} className="text-center">
              <CardContent className="pt-4">
                <div className="flex items-center justify-center mb-2">
                  <StatusIcon className="w-4 h-4 mr-1" />
                  <Badge className={statusConfig.color}>
                    {statusOffers.length}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{statusConfig.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Offers by Status */}
      {Object.entries(offersByStatus).map(([status, statusOffers]) => {
        if (statusOffers.length === 0) return null
        
        const statusConfig = getStatusConfig(status.toUpperCase())
        const StatusIcon = statusConfig.icon
        
        return (
          <div key={status}>
            <div className="flex items-center gap-2 mb-4">
              <StatusIcon className="w-5 h-5" />
              <h3 className="text-lg font-semibold">{statusConfig.label} Offers</h3>
              <Badge className={statusConfig.color}>{statusOffers.length}</Badge>
            </div>
            
            <div className="space-y-4">
              {statusOffers.map((offer) => {
                const typeConfig = getOfferTypeConfig(offer.type)
                const TypeIcon = typeConfig.icon
                
                return (
                  <Card key={offer.id} className="hover:shadow-md transition-shadow">
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
                          <CardTitle className="text-lg">{offer.title}</CardTitle>
                          <CardDescription>{offer.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          {getPriorityStars(offer.priority)}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {offer.company && (
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span>{offer.company}</span>
                          </div>
                        )}
                        {offer.budget && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span>{offer.budget}</span>
                          </div>
                        )}
                        {offer.timeline && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{offer.timeline}</span>
                          </div>
                        )}
                        {offer.contact && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="truncate">{offer.contact}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedOffer(offer)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <TypeIcon className="w-5 h-5" />
                                  {offer.title}
                                </DialogTitle>
                                <DialogDescription>
                                  {typeConfig.label} • {statusConfig.label}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Description</h4>
                                  <p className="text-sm text-muted-foreground">{offer.description}</p>
                                </div>
                                
                                {offer.terms && (
                                  <div>
                                    <h4 className="font-medium mb-2">Terms & Conditions</h4>
                                    <p className="text-sm text-muted-foreground">{offer.terms}</p>
                                  </div>
                                )}
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Offer Details</h4>
                                    <div className="space-y-1 text-sm">
                                      {offer.company && (
                                        <div className="flex items-center gap-2">
                                          <Building2 className="w-3 h-3" />
                                          <span>{offer.company}</span>
                                        </div>
                                      )}
                                      {offer.budget && (
                                        <div className="flex items-center gap-2">
                                          <DollarSign className="w-3 h-3" />
                                          <span>{offer.budget}</span>
                                        </div>
                                      )}
                                      {offer.timeline && (
                                        <div className="flex items-center gap-2">
                                          <Clock className="w-3 h-3" />
                                          <span>{offer.timeline}</span>
                                        </div>
                                      )}
                                      {offer.contact && (
                                        <div className="flex items-center gap-2">
                                          <Mail className="w-3 h-3" />
                                          <span>{offer.contact}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">Actions</h4>
                                    <div className="space-y-2">
                                      {offer.status === "PENDING" && (
                                        <>
                                          <Button 
                                            size="sm" 
                                            className="w-full justify-start"
                                            onClick={() => updateOfferStatus(offer, "INTERESTED")}
                                          >
                                            <Check className="w-3 h-3 mr-1" />
                                            Mark as Interested
                                          </Button>
                                          <Button 
                                            size="sm" 
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => updateOfferStatus(offer, "DECLINED")}
                                          >
                                            <X className="w-3 h-3 mr-1" />
                                            Decline
                                          </Button>
                                        </>
                                      )}
                                      
                                      {offer.status === "INTERESTED" && (
                                        <>
                                          <Button 
                                            size="sm" 
                                            className="w-full justify-start"
                                            onClick={() => updateOfferStatus(offer, "IN_PROGRESS")}
                                          >
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                            Start Progress
                                          </Button>
                                          <Button 
                                            size="sm" 
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => updateOfferStatus(offer, "DECLINED")}
                                          >
                                            <X className="w-3 h-3 mr-1" />
                                            Decline
                                          </Button>
                                        </>
                                      )}
                                      
                                      {offer.status === "IN_PROGRESS" && (
                                        <>
                                          <Button 
                                            size="sm" 
                                            className="w-full justify-start"
                                            onClick={() => updateOfferStatus(offer, "ACCEPTED")}
                                          >
                                            <Check className="w-3 h-3 mr-1" />
                                            Accept Offer
                                          </Button>
                                          <Button 
                                            size="sm" 
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => updateOfferStatus(offer, "DECLINED")}
                                          >
                                            <X className="w-3 h-3 mr-1" />
                                            Decline
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {offer.status === "PENDING" && (
                            <>
                              <Button 
                                size="sm"
                                onClick={() => updateOfferStatus(offer, "INTERESTED")}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Interested
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateOfferStatus(offer, "DECLINED")}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Decline
                              </Button>
                            </>
                          )}
                          
                          {offer.status === "INTERESTED" && (
                            <Button 
                              size="sm"
                              onClick={() => updateOfferStatus(offer, "IN_PROGRESS")}
                            >
                              <TrendingUp className="w-4 h-4 mr-1" />
                              Start Progress
                            </Button>
                          )}
                          
                          {offer.status === "IN_PROGRESS" && (
                            <Button 
                              size="sm"
                              onClick={() => updateOfferStatus(offer, "ACCEPTED")}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Received {new Date(offer.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}