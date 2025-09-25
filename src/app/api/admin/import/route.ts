import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Parse CSV content
function parseCSV(csvContent: string) {
  const lines = csvContent.split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      rows.push(row)
    }
  }
  
  return { headers, rows }
}

// Process project data
async function processProjectData(rows: any[]) {
  const projects = []
  
  for (const row of rows) {
    if (row.Project_Name && row.Description) {
      const project = await db.card.create({
        data: {
          type: 'PROJECT',
          title: row.Project_Name,
          description: row.Description,
          content: row.Description,
          reason: `Project opportunity: ${row.Project_Name}`,
          keywords: row.Keywords || row.Project_Name,
          source: 'csv_import',
          sourceId: row.Project_Name,
          priority: parseInt(row.Priority) || 3,
          isActive: true
        }
      })
      projects.push(project)
    }
  }
  
  return projects
}

// Process research data
async function processResearchData(rows: any[]) {
  const research = []
  
  for (const row of rows) {
    if (row.Title && row.Summary) {
      const insight = await db.card.create({
        data: {
          type: 'INSIGHT',
          title: row.Title,
          description: row.Summary,
          content: row.Summary,
          reason: `Research insight: ${row.Title}`,
          keywords: row.Tags || row.Title,
          source: 'csv_import',
          sourceId: row.Research_Link || row.Title,
          priority: parseInt(row.Priority) || 2,
          isActive: true
        }
      })
      research.push(insight)
    }
  }
  
  return research
}

// Process people data
async function processPeopleData(rows: any[]) {
  const people = []
  
  for (const row of rows) {
    if (row.Name && row.Expertise_Keywords) {
      // Create user if doesn't exist
      const user = await db.user.upsert({
        where: { email: row.Email || `${row.Name.toLowerCase().replace(' ', '.')}@company.com` },
        update: {
          name: row.Name,
          expertiseKeywords: row.Expertise_Keywords,
          interestKeywords: row.Interest_Keywords || row.Expertise_Keywords,
          connectionPreference: row.Preference || 'deep_focus'
        },
        create: {
          email: row.Email || `${row.Name.toLowerCase().replace(' ', '.')}@company.com`,
          name: row.Name,
          expertiseKeywords: row.Expertise_Keywords,
          interestKeywords: row.Interest_Keywords || row.Expertise_Keywords,
          connectionPreference: row.Preference || 'deep_focus'
        }
      })
      
      // Create profile
      if (row.Title || row.Team) {
        await db.profile.upsert({
          where: { userId: user.id },
          update: {
            title: row.Title,
            team: row.Team,
            bio: row.Bio
          },
          create: {
            userId: user.id,
            title: row.Title,
            team: row.Team,
            bio: row.Bio
          }
        })
      }
      
      people.push(user)
    }
  }
  
  return people
}

// Process topics data
async function processTopicsData(rows: any[]) {
  const topics = []
  
  for (const row of rows) {
    if (row.name) {
      const topic = await db.topic.upsert({
        where: { name: row.name },
        update: {
          description: row.description,
          category: row.category,
          isActive: row.isActive !== 'false'
        },
        create: {
          name: row.name,
          description: row.description,
          category: row.category,
          isActive: row.isActive !== 'false'
        }
      })
      topics.push(topic)
    }
  }
  
  return topics
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const dataType = formData.get('type') as string // 'projects', 'research', 'people', 'topics'
    
    if (!file || !dataType) {
      return NextResponse.json({ error: 'File and data type required' }, { status: 400 })
    }
    
    // Read file content
    const csvContent = await file.text()
    const { headers, rows } = parseCSV(csvContent)
    
    let results = []
    
    switch (dataType) {
      case 'projects':
        results = await processProjectData(rows)
        break
      case 'research':
        results = await processResearchData(rows)
        break
      case 'people':
        results = await processPeopleData(rows)
        break
      case 'topics':
        results = await processTopicsData(rows)
        break
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully imported ${results.length} ${dataType}`,
      results 
    })
  } catch (error) {
    console.error('Error importing data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Sample CSV templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    let csvContent = ''
    
    switch (type) {
      case 'projects':
        csvContent = `Project_Name,Description,Keywords,Priority,Project_Lead
Project Phoenix API Architecture,New microservices architecture design,distributed systems,api,microservices,4,John Doe
Mobile Performance Optimization,Improve app performance by 40%,performance,mobile,optimization,3,Jane Smith
Database Migration Project,Migrate from MySQL to PostgreSQL,database,migration,sql,5,Mike Johnson`
        break
      case 'research':
        csvContent = `Research_Link,Title,Summary,Tags,Priority
https://arxiv.org/abs/1234,New Database Indexing Techniques,Breakthrough paper on novel indexing approach,database,indexing,performance,3
https://example.com/paper2,ML Model Optimization,New techniques for reducing model size,machine learning,optimization,2
https://example.com/paper3,Security Best Practices 2024,Updated security guidelines for modern apps,security,best practices,4`
        break
      case 'people':
        csvContent = `Name,Email,Title,Team,Expertise_Keywords,Interest_Keywords,Preference,Bio
John Doe,john.doe@company.com,Senior Engineer,Platform,distributed systems,api,microservices,database,performance,deep_focus,Expert in distributed systems and API design
Jane Smith,jane.smith@company.com,Mobile Lead,Mobile,mobile,performance,optimization,ui,collaboration,Mobile performance specialist
Mike Johnson,mike.johnson@company.com,Data Engineer,Data,database,sql,migration,analytics,ad_hoc_advisory,Database migration expert`
        break
      case 'topics':
        csvContent = `name,description,category,isActive
distributed systems,Scalable system design and architecture,technology,true
performance optimization,Application and system performance tuning,technology,true
API design,REST and GraphQL API best practices,technology,true
machine learning,ML model development and deployment,technology,true
security,Application security and best practices,technology,true
Project Phoenix,New microservices initiative,project,true
Mobile App Redesign,UI/UX overhaul for mobile app,project,true
Database Migration,MySQL to PostgreSQL migration,project,true`
        break
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${type}_template.csv"`
      }
    })
  } catch (error) {
    console.error('Error generating template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}