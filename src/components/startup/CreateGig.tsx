"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, X, Save, Plus } from "lucide-react"

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

interface CreateGigProps {
  onClose: () => void
  onSave: (gig: Gig) => void
}

export function CreateGig({ onClose, onSave }: CreateGigProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    budget: "",
    duration: "",
    requirements: "",
    deliverables: "",
    skills: "",
    experience: "",
    location: "",
    priority: "3"
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Gig title is required"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Gig description is required"
    }
    
    if (!formData.type) {
      newErrors.type = "Gig type is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const newGig: Gig = {
      id: Date.now().toString(),
      startupId: "1", // This would come from the current user's startup
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      status: "ACTIVE",
      budget: formData.budget.trim() || undefined,
      duration: formData.duration.trim() || undefined,
      requirements: formData.requirements.trim() || undefined,
      deliverables: formData.deliverables.trim() || undefined,
      skills: formData.skills.trim() || undefined,
      experience: formData.experience.trim() || undefined,
      location: formData.location.trim() || undefined,
      priority: parseInt(formData.priority),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onSave(newGig)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const gigTypes = [
    { value: "DEVELOPMENT", label: "Development", icon: "💻" },
    { value: "CONSULTING", label: "Consulting", icon: "👔" },
    { value: "DESIGN", label: "Design", icon: "🎨" },
    { value: "MARKETING", label: "Marketing", icon: "📈" },
    { value: "SALES", label: "Sales", icon: "💰" },
    { value: "RESEARCH", label: "Research", icon: "🔬" },
    { value: "SUPPORT", label: "Support", icon: "🛟" },
    { value: "TRAINING", label: "Training", icon: "🎓" },
    { value: "OTHER", label: "Other", icon: "📋" }
  ]

  const locations = [
    { value: "Remote", label: "Remote" },
    { value: "On-site", label: "On-site" },
    { value: "Hybrid", label: "Hybrid" }
  ]

  const experienceLevels = [
    { value: "Entry Level", label: "Entry Level (0-2 years)" },
    { value: "Mid Level", label: "Mid Level (2-5 years)" },
    { value: "Senior Level", label: "Senior Level (5+ years)" },
    { value: "Expert Level", label: "Expert Level (10+ years)" }
  ]

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Create New Gig
          </DialogTitle>
          <DialogDescription>
            Create a new gig or service offering to attract opportunities
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about your gig</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Gig Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={errors.title ? "border-red-500" : ""}
                  placeholder="e.g., Frontend Development for Dashboard"
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className={errors.description ? "border-red-500" : ""}
                  placeholder="Describe what you need help with..."
                  rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Gig Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select gig type" />
                    </SelectTrigger>
                    <SelectContent>
                      {gigTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="mr-2">{type.icon}</span>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Low (1)</SelectItem>
                      <SelectItem value="2">Medium-Low (2)</SelectItem>
                      <SelectItem value="3">Medium (3)</SelectItem>
                      <SelectItem value="4">Medium-High (4)</SelectItem>
                      <SelectItem value="5">High (5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements & Details */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements & Details</CardTitle>
              <CardDescription>Specify what you're looking for and what you'll provide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    placeholder="e.g., $3000-5000 or hourly $50-100"
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="e.g., 2-3 weeks, 1-3 months"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange("requirements", e.target.value)}
                  placeholder="Detailed requirements for this gig..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="deliverables">Deliverables</Label>
                <Textarea
                  id="deliverables"
                  value={formData.deliverables}
                  onChange={(e) => handleInputChange("deliverables", e.target.value)}
                  placeholder="What do you expect to be delivered?"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="skills">Required Skills</Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  placeholder="List required skills (e.g., React, TypeScript, Node.js)"
                  rows={2}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Separate skills with commas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>How your gig will appear to others</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{formData.title || "Gig Title"}</h3>
                  {formData.type && (
                    <Badge className="bg-blue-100 text-blue-800">
                      {gigTypes.find(t => t.value === formData.type)?.label}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {formData.description || "Gig description will appear here..."}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {formData.budget && (
                    <Badge variant="outline">💰 {formData.budget}</Badge>
                  )}
                  {formData.duration && (
                    <Badge variant="outline">⏰ {formData.duration}</Badge>
                  )}
                  {formData.location && (
                    <Badge variant="outline">📍 {formData.location}</Badge>
                  )}
                  {formData.experience && (
                    <Badge variant="outline">🎯 {formData.experience}</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Create Gig
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}