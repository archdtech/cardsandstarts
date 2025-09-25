"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, Check } from "lucide-react"

const CONNECTION_PREFERENCES = [
  { value: "deep_focus", label: "Deep Focus (Architecture/Research)" },
  { value: "collaboration", label: "Collaboration (Pairing/Reviews)" },
  { value: "ad_hoc_advisory", label: "Ad-hoc Advisory (Quick calls)" }
]

const HIGH_VALUE_TOPICS = [
  // Technology & Architecture
  "distributed systems",
  "microservices architecture",
  "API design",
  "cloud infrastructure",
  "devops & ci/cd",
  "containerization (docker/kubernetes)",
  "serverless computing",
  "edge computing",
  
  // Data & Databases
  "database optimization",
  "data engineering",
  "big data analytics",
  "real-time data processing",
  "data warehousing",
  "machine learning engineering",
  "mlops",
  
  // Security & Performance
  "application security",
  "performance optimization",
  "scalability engineering",
  "reliability & fault tolerance",
  "monitoring & observability",
  "incident management",
  
  // AI & Machine Learning
  "LLM fine-tuning",
  "generative AI",
  "natural language processing",
  "computer vision",
  "recommendation systems",
  "AI ethics & governance",
  
  // Product & User Experience
  "user onboarding UX",
  "product strategy",
  "user research",
  "design systems",
  "accessibility",
  "mobile app development",
  
  // Business & Strategy
  "B2B pricing strategy",
  "market analysis",
  "competitive intelligence",
  "product launch strategy",
  "customer success",
  "partnership development",
  
  // Emerging Technologies
  "web3 & blockchain",
  "quantum computing",
  "AR/VR development",
  "iot platforms",
  "robotics automation",
  
  // Management & Leadership
  "technical leadership",
  "team building",
  "mentorship",
  "project management",
  "strategic planning"
]

const TOPIC_CATEGORIES = {
  "Technology & Architecture": [
    "distributed systems",
    "microservices architecture", 
    "API design",
    "cloud infrastructure",
    "devops & ci/cd",
    "containerization (docker/kubernetes)",
    "serverless computing",
    "edge computing"
  ],
  "Data & AI": [
    "database optimization",
    "data engineering", 
    "big data analytics",
    "real-time data processing",
    "data warehousing",
    "machine learning engineering",
    "mlops",
    "LLM fine-tuning",
    "generative AI",
    "natural language processing",
    "computer vision",
    "recommendation systems",
    "AI ethics & governance"
  ],
  "Security & Performance": [
    "application security",
    "performance optimization",
    "scalability engineering", 
    "reliability & fault tolerance",
    "monitoring & observability",
    "incident management"
  ],
  "Product & UX": [
    "user onboarding UX",
    "product strategy",
    "user research",
    "design systems",
    "accessibility",
    "mobile app development"
  ],
  "Business & Strategy": [
    "B2B pricing strategy",
    "market analysis",
    "competitive intelligence", 
    "product launch strategy",
    "customer success",
    "partnership development"
  ],
  "Emerging Tech": [
    "web3 & blockchain",
    "quantum computing",
    "AR/VR development",
    "iot platforms",
    "robotics automation"
  ],
  "Leadership": [
    "technical leadership",
    "team building",
    "mentorship",
    "project management",
    "strategic planning"
  ]
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [expertise, setExpertise] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [connectionPreference, setConnectionPreference] = useState("")
  const [customInterest, setCustomInterest] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const handleAddInterest = (interest: string) => {
    if (!interests.includes(interest) && interest.trim()) {
      setInterests([...interests, interest.trim()])
    }
  }

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest))
  }

  const handleCustomInterestAdd = () => {
    if (customInterest.trim()) {
      handleAddInterest(customInterest.trim())
      setCustomInterest("")
    }
  }

  const filteredTopics = searchTerm 
    ? HIGH_VALUE_TOPICS.filter(topic => 
        topic.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : HIGH_VALUE_TOPICS

  const handleSubmit = async () => {
    // TODO: Save to database via API
    console.log({
      expertise,
      interests,
      connectionPreference
    })
    // Redirect to main app
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= i
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                }`}
              >
                {step > i ? <Check className="w-4 h-4" /> : i}
              </div>
              {i < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step > i ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Set your focus. Filter the noise.</CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about your core expertise"}
              {step === 2 && "What are you curious about?"}
              {step === 3 && "How do you prefer to contribute?"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="expertise" className="text-base font-medium">
                    In a few keywords, what's your core expertise?
                  </Label>
                  <Textarea
                    id="expertise"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    placeholder="e.g., distributed systems, user onboarding UX, LLM fine-tuning, B2B pricing"
                    className="mt-2 min-h-[100px]"
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Separate multiple keywords with commas. This helps us match you with the most relevant opportunities.
                  </p>
                  
                  {/* Expertise Preview */}
                  {expertise.trim() && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium mb-2 block">Your Expertise Tags</Label>
                      <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        {expertise.split(',').map((keyword, index) => {
                          const trimmed = keyword.trim()
                          return trimmed ? (
                            <Badge
                              key={index}
                              variant="default"
                              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            >
                              {trimmed}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!expertise.trim()}
                    className="flex items-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">
                    What are you curious about or want to be looped into?
                  </Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Select from 40+ high-value topics or add your own. These help us find the most relevant opportunities for you.
                  </p>
                  
                  {/* Search Input */}
                  <div className="mb-4">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search topics..."
                      className="mb-3"
                    />
                    {searchTerm && (
                      <p className="text-xs text-slate-500 mb-3">
                        Found {filteredTopics.length} topic{filteredTopics.length !== 1 ? 's' : ''} matching "{searchTerm}"
                      </p>
                    )}
                  </div>

                  {/* Selected Interests */}
                  {interests.length > 0 && (
                    <div className="mb-6">
                      <Label className="text-sm font-medium mb-2 block">Your Selected Interests ({interests.length})</Label>
                      <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        {interests.map((interest) => (
                          <Badge
                            key={interest}
                            variant="default"
                            className="flex items-center gap-1 text-sm"
                          >
                            {interest}
                            <button
                              onClick={() => handleRemoveInterest(interest)}
                              className="ml-1 hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Topics Selection */}
                  <div className="space-y-4">
                    {searchTerm ? (
                      /* Search Results */
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Search Results</Label>
                        <div className="flex flex-wrap gap-2">
                          {filteredTopics.map((topic) => (
                            <Badge
                              key={topic}
                              variant={interests.includes(topic) ? "default" : "outline"}
                              className="cursor-pointer transition-all hover:scale-105"
                              onClick={() => {
                                if (interests.includes(topic)) {
                                  handleRemoveInterest(topic)
                                } else {
                                  handleAddInterest(topic)
                                }
                              }}
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Category-based Display */
                      Object.entries(TOPIC_CATEGORIES).map(([category, topics]) => (
                        <div key={category} className="border rounded-lg p-4">
                          <button
                            onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                            className="flex items-center justify-between w-full text-left"
                          >
                            <Label className="font-medium text-base">{category}</Label>
                            <div className="text-slate-500">
                              {expandedCategory === category ? '−' : '+'}
                            </div>
                          </button>
                          
                          {(expandedCategory === category || interests.some(i => topics.includes(i))) && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {topics.map((topic) => (
                                <Badge
                                  key={topic}
                                  variant={interests.includes(topic) ? "default" : "outline"}
                                  className="cursor-pointer transition-all hover:scale-105"
                                  onClick={() => {
                                    if (interests.includes(topic)) {
                                      handleRemoveInterest(topic)
                                    } else {
                                      handleAddInterest(topic)
                                    }
                                  }}
                                >
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Custom Interest Input */}
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium mb-2 block">Add Custom Interest</Label>
                    <div className="flex gap-2">
                      <Input
                        value={customInterest}
                        onChange={(e) => setCustomInterest(e.target.value)}
                        placeholder="Type a custom interest..."
                        onKeyPress={(e) => e.key === "Enter" && handleCustomInterestAdd()}
                      />
                      <Button
                        variant="outline"
                        onClick={handleCustomInterestAdd}
                        disabled={!customInterest.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-500">
                    {interests.length} topic{interests.length !== 1 ? 's' : ''} selected
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={interests.length === 0}
                      className="flex items-center gap-2"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">
                    How do you prefer to contribute?
                  </Label>
                  <Select value={connectionPreference} onValueChange={setConnectionPreference}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select your contribution style" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONNECTION_PREFERENCES.map((pref) => (
                        <SelectItem key={pref.value} value={pref.value}>
                          {pref.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Your Profile Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Expertise:</span> {expertise || "Not specified"}
                    </div>
                    <div>
                      <span className="font-medium">Interests:</span> {interests.join(", ") || "None selected"}
                    </div>
                    <div>
                      <span className="font-medium">Contribution Style:</span>{" "}
                      {CONNECTION_PREFERENCES.find(p => p.value === connectionPreference)?.label || "Not selected"}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!connectionPreference}
                    className="flex items-center gap-2"
                  >
                    Complete Setup <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}