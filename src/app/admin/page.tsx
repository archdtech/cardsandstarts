"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, FileText, Users, TrendingUp, Lightbulb, Tag } from "lucide-react"

const DATA_TYPES = [
  { value: "projects", label: "Projects", icon: TrendingUp, description: "Import project opportunities and initiatives" },
  { value: "research", label: "Research", icon: Lightbulb, description: "Import research papers and insights" },
  { value: "people", label: "People", icon: Users, description: "Import user profiles and expertise" },
  { value: "topics", label: "Topics", icon: Tag, description: "Import interest topics and categories" }
]

export default function AdminPage() {
  const [selectedType, setSelectedType] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      setSelectedFile(file)
    } else {
      alert('Please select a CSV file')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedType) {
      alert('Please select a file and data type')
      return
    }

    setIsUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('type', selectedType)

      const response = await fetch('/api/admin/import', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        setUploadResult(result)
      } else {
        alert(result.error || 'Upload failed')
      }
    } catch (error) {
      alert('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/import?type=${type}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}_template.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('Failed to download template')
    }
  }

  const selectedDataType = DATA_TYPES.find(dt => dt.value === selectedType)
  const Icon = selectedDataType?.icon || FileText

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Import data to populate the Lens platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Data Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Select Data Type
              </CardTitle>
              <CardDescription>
                Choose the type of data you want to import
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  {DATA_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedDataType && (
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5" />
                    <h3 className="font-medium">{selectedDataType.label}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedDataType.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload CSV File
              </CardTitle>
              <CardDescription>
                Upload a CSV file with the data to import
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file">CSV File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="mt-2"
                />
              </div>

              {selectedType && (
                <Button
                  variant="outline"
                  onClick={() => downloadTemplate(selectedType)}
                  className="w-full flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </Button>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !selectedType || isUploading}
                className="w-full"
              >
                {isUploading ? 'Uploading...' : 'Import Data'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upload Results */}
        {uploadResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Import Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Success
                  </Badge>
                  <span>{uploadResult.message}</span>
                </div>

                {uploadResult.results && uploadResult.results.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Imported Items:</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {uploadResult.results.slice(0, 10).map((item: any, index: number) => (
                        <div key={index} className="text-sm p-2 bg-slate-50 dark:bg-slate-800 rounded">
                          {item.title || item.name || `Item ${index + 1}`}
                        </div>
                      ))}
                      {uploadResult.results.length > 10 && (
                        <div className="text-sm text-slate-500">
                          ... and {uploadResult.results.length - 10} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-slate-600">Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-slate-600">Insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-slate-600">Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-slate-600">Topics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}