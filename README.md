# Lens Platform - Corporate Side Documentation

## 📋 Overview

The Lens platform now includes a comprehensive corporate side designed specifically for startups to showcase their services, manage gigs, and receive offers from potential clients and partners. This documentation covers the complete functionality, architecture, and usage of the corporate side features.

## 🎯 Key Features

### 1. **Startup Dashboard**
- **Centralized Hub**: Single dashboard for managing all startup activities
- **Real-time Analytics**: Track performance metrics and engagement
- **Multi-tab Interface**: Organized sections for overview, gigs, offers, and analytics
- **Responsive Design**: Works seamlessly across all devices

### 2. **Startup Profile Management**
- **Comprehensive Company Information**: Industry, stage, funding, team size, tech stack
- **Business Details**: Business model, target market, location, founding year
- **Professional Validation**: Required fields with proper error handling
- **Easy Updates**: Modal-based editing interface

### 3. **Gig/Service Creation & Management**
- **9 Service Types**: Development, Consulting, Design, Marketing, Sales, Research, Support, Training, Other
- **Detailed Specifications**: Budget, duration, requirements, deliverables, skills, experience level
- **Status Management**: Active, Paused, Completed, Cancelled states
- **Priority System**: 1-5 star rating for importance
- **Live Preview**: See how gigs appear to potential clients

### 4. **Offer Management System**
- **6 Offer Types**: Projects, Partnerships, Investments, Acquisitions, Collaboration, Mentorship
- **Status Workflow**: Pending → Interested → In Progress → Accepted/Declined
- **Smart Actions**: Context-aware buttons based on offer status
- **Detailed Tracking**: Company info, contact details, budget, timeline, terms

### 5. **Data Layer & API**
- **RESTful API**: Complete CRUD operations for all entities
- **Real-time Updates**: Instant reflection of changes across the interface
- **Error Handling**: Comprehensive error management with user feedback
- **Type Safety**: Full TypeScript integration

## 🏗️ Technical Architecture

### Database Schema

#### **Startup Model**
```sql
- id: String (Primary Key)
- userId: String (Foreign Key to User)
- name: String (Required)
- description: String (Optional)
- industry: String (Optional)
- stage: String (Optional)
- teamSize: Int (Optional)
- website: String (Optional)
- location: String (Optional)
- foundedYear: Int (Optional)
- funding: String (Optional)
- techStack: String (Optional)
- businessModel: String (Optional)
- targetMarket: String (Optional)
- isActive: Boolean (Default: true)
- createdAt: DateTime
- updatedAt: DateTime
```

#### **Gig Model**
```sql
- id: String (Primary Key)
- startupId: String (Foreign Key to Startup)
- title: String (Required)
- description: String (Required)
- type: Enum (DEVELOPMENT, CONSULTING, DESIGN, etc.)
- status: Enum (ACTIVE, PAUSED, COMPLETED, CANCELLED)
- budget: String (Optional)
- duration: String (Optional)
- requirements: String (Optional)
- deliverables: String (Optional)
- skills: String (Optional)
- experience: String (Optional)
- location: String (Optional)
- priority: Int (Default: 1)
- isActive: Boolean (Default: true)
- createdAt: DateTime
- updatedAt: DateTime
```

#### **Offer Model**
```sql
- id: String (Primary Key)
- startupId: String (Foreign Key to Startup)
- gigId: String (Optional Foreign Key to Gig)
- type: Enum (PROJECT, PARTNERSHIP, INVESTMENT, etc.)
- status: Enum (PENDING, INTERESTED, IN_PROGRESS, ACCEPTED, DECLINED, EXPIRED)
- title: String (Required)
- description: String (Required)
- company: String (Optional)
- contact: String (Optional)
- budget: String (Optional)
- timeline: String (Optional)
- terms: String (Optional)
- priority: Int (Default: 1)
- isActive: Boolean (Default: true)
- createdAt: DateTime
- updatedAt: DateTime
```

### API Endpoints

#### **Startup APIs**
- `GET /api/startups` - Get all startups or startup by userId
- `POST /api/startups` - Create new startup
- `PUT /api/startups/[id]` - Update startup
- `DELETE /api/startups/[id]` - Delete startup

#### **Gig APIs**
- `GET /api/gigs` - Get all gigs or gigs by startupId
- `POST /api/gigs` - Create new gig
- `PUT /api/gigs/[id]` - Update gig
- `DELETE /api/gigs/[id]` - Delete gig

#### **Offer APIs**
- `GET /api/offers` - Get all offers or offers by startupId
- `POST /api/offers` - Create new offer
- `PUT /api/offers/[id]` - Update offer
- `DELETE /api/offers/[id]` - Delete offer

#### **Sample Data API**
- `POST /api/sample-data` - Create sample data for testing

### Frontend Components

#### **StartupDashboard** (`/startup`)
- Main dashboard component with tabbed interface
- Handles data fetching, state management, and API calls
- Integrates all sub-components

#### **StartupProfile**
- Modal component for editing startup information
- Form validation and error handling
- Real-time updates to parent component

#### **CreateGig**
- Modal component for creating new gigs
- Comprehensive form with all gig specifications
- Preview functionality

#### **GigList**
- Component for displaying and managing gigs
- Status toggle functionality
- Detailed view modals

#### **OfferList**
- Component for displaying and managing offers
- Status workflow management
- Overview dashboard by status

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Next.js 15 with TypeScript
- Prisma ORM with SQLite
- shadcn/ui component library

### Setup Instructions

1. **Database Setup**
   ```bash
   # Push database schema
   npm run db:push
   ```

2. **Create Sample Data** (Optional)
   ```bash
   # Create sample startup, gigs, and offers
   curl -X POST http://localhost:3000/api/sample-data \
     -H "Content-Type: application/json"
   ```

3. **Access the Platform**
   - Main platform: `http://localhost:3000`
   - Startup dashboard: `http://localhost:3000/startup`

### User Flow

1. **Initial Access**
   - Navigate to `/startup`
   - System automatically creates a default startup profile
   - Dashboard loads with sample data (if created)

2. **Profile Management**
   - Click "Edit Profile" in header
   - Update company information
   - Save changes

3. **Gig Management**
   - Navigate to "Gigs & Services" tab
   - Click "Create Gig" to add new service
   - Fill in gig details with preview
   - Manage existing gigs (activate/pause)

4. **Offer Management**
   - Navigate to "Offers & Opportunities" tab
   - Review incoming offers by status
   - Take actions: Interested, Start Progress, Accept, Decline
   - Track offer lifecycle

## 🎨 UI/UX Design

### Design Principles
- **Professional Aesthetics**: Business-appropriate design language
- **Color-Coded System**: Visual indicators for different types and statuses
- **Responsive Layout**: Mobile-first design with desktop optimization
- **Intuitive Navigation**: Clear information architecture

### Color Scheme
- **Primary**: Blue (#3B82F6) for main branding
- **Success**: Green (#10B981) for positive actions
- **Warning**: Yellow (#F59E0B) for pending states
- **Danger**: Red (#EF4444) for negative actions
- **Neutral**: Gray variants for backgrounds and text

### Icon System
- **Lucide Icons**: Consistent icon library throughout
- **Semantic Icons**: Icons that clearly communicate meaning
- **Visual Hierarchy**: Size and color variations for importance

## 📊 Business Value

### For Startups
- **Centralized Management**: Single platform for all service offerings
- **Increased Visibility**: Better discovery by potential clients
- **Professional Presence**: Showcase capabilities and expertise
- **Opportunity Tracking**: Manage leads and partnerships effectively

### For Clients
- **Easy Discovery**: Find startups that match specific needs
- **Detailed Information**: Comprehensive service descriptions and requirements
- **Direct Communication**: Clear contact information and next steps

### For Platform
- **Expanded User Base**: Attract startup users in addition to experts
- **Increased Engagement**: More active users and interactions
- **Revenue Potential**: Premium features for startups
- **Network Effects**: Better connection between service providers and seekers

## 🔧 Development & Testing

### Development Commands
```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Push database changes
npm run db:push
```

### Testing Scenarios

1. **Startup Creation**
   - Verify automatic startup profile creation
   - Test profile updates and validation
   - Check data persistence

2. **Gig Management**
   - Create new gigs with all fields
   - Test status changes (active/paused)
   - Verify gig details display

3. **Offer Management**
   - Test offer status workflow
   - Verify action buttons work correctly
   - Check offer lifecycle tracking

4. **Error Handling**
   - Test API failure scenarios
   - Verify user-friendly error messages
   - Check recovery mechanisms

## 🚀 Future Enhancements

### Phase 1.5 (Near-term)
- **Real-time Notifications**: WebSocket integration for instant updates
- **Advanced Search**: Filter gigs and offers by multiple criteria
- **File Attachments**: Allow documents with gigs and offers
- **Rating System**: Client and startup ratings

### Phase 2 (Mid-term)
- **Payment Integration**: Stripe integration for transactions
- **Calendar Integration**: Schedule meetings and deadlines
- **Analytics Dashboard**: Advanced metrics and insights
- **Team Management**: Multiple user access per startup

### Phase 3 (Long-term)
- **AI Matching**: Intelligent gig-offer matching
- **Marketplace Features**: Public discovery platform
- **Mobile App**: Native iOS and Android applications
- **API Ecosystem**: Third-party integrations

## 📞 Support

For technical issues, feature requests, or questions:
- **GitHub Issues**: Create issues for bugs and enhancements
- **Documentation**: Check this documentation first
- **Community**: Join our developer community

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Framework**: Next.js 15 + TypeScript + Prisma + shadcn/ui