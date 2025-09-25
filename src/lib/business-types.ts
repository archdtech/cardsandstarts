// Business categories and types for the enhanced startup dashboard

export const BUSINESS_CATEGORIES = [
  "People",
  "Product", 
  "GTM",
  "Tech",
  "Strategy",
  "Operations",
  "Finance",
  "Hiring",
  "Management"
] as const;

export type BusinessCategory = typeof BUSINESS_CATEGORIES[number];

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: BusinessCategory | "Backlog";
  priority: "low" | "medium" | "high" | "critical";
  status: "todo" | "in_progress" | "done" | "blocked";
  assignee?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GoalPreset {
  id: string;
  name: string;
  description: string;
  category: BusinessCategory;
  tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'>[];
  focusWeights: Record<BusinessCategory, number>;
}

export const GOAL_PRESETS: GoalPreset[] = [
  {
    id: "grow_users",
    name: "Grow Users",
    description: "Acquisition and activation sprint",
    category: "GTM",
    tasks: [
      {
        title: "Launch landing A-B test",
        description: "Create and run A/B tests on the main landing page",
        category: "GTM",
        priority: "high",
      },
      {
        title: "SEO quick wins list",
        description: "Identify and implement immediate SEO improvements",
        category: "GTM", 
        priority: "medium",
      },
      {
        title: "Community kickoff post",
        description: "Launch community engagement initiative",
        category: "GTM",
        priority: "medium",
      },
      {
        title: "Measure funnel in analytics",
        description: "Set up comprehensive funnel analytics",
        category: "Product",
        priority: "high",
      },
      {
        title: "Fix signup frictions",
        description: "Identify and resolve user signup bottlenecks",
        category: "Tech",
        priority: "high",
      },
      {
        title: "Referral offer draft",
        description: "Design referral program incentives",
        category: "Product",
        priority: "medium",
      },
    ],
    focusWeights: {
      People: 10,
      Product: 25,
      GTM: 35,
      Tech: 20,
      Strategy: 5,
      Operations: 5,
      Finance: 0,
      Hiring: 0,
      Management: 0,
    },
  },
  {
    id: "investor_ready",
    name: "Investor Ready",
    description: "Story, numbers, and momentum",
    category: "Finance",
    tasks: [
      {
        title: "Budget runway model",
        description: "Create detailed financial runway projections",
        category: "Finance",
        priority: "high",
      },
      {
        title: "1 page product narrative",
        description: "Craft compelling product story and vision",
        category: "Strategy",
        priority: "high",
      },
      {
        title: "Roadmap 2 quarters",
        description: "Develop detailed product roadmap",
        category: "Product",
        priority: "high",
      },
      {
        title: "Stability and error metrics",
        description: "Improve system stability and monitoring",
        category: "Tech",
        priority: "high",
      },
      {
        title: "Logo case study social thread",
        description: "Create and promote customer success stories",
        category: "GTM",
        priority: "medium",
      },
    ],
    focusWeights: {
      People: 5,
      Product: 20,
      GTM: 15,
      Tech: 25,
      Strategy: 20,
      Operations: 5,
      Finance: 10,
      Hiring: 0,
      Management: 0,
    },
  },
  {
    id: "monetize",
    name: "Monetize",
    description: "Revenue experiments",
    category: "Finance",
    tasks: [
      {
        title: "Define pricing tiers",
        description: "Research and define pricing strategy",
        category: "Finance",
        priority: "high",
      },
      {
        title: "Paywall MVP",
        description: "Build minimum viable paywall system",
        category: "Tech",
        priority: "high",
      },
      {
        title: "Checkout flow",
        description: "Design and implement checkout process",
        category: "Tech",
        priority: "high",
      },
      {
        title: "Email to paying segment",
        description: "Target email campaign for conversion",
        category: "GTM",
        priority: "medium",
      },
      {
        title: "Partnership outreach list",
        description: "Identify potential strategic partners",
        category: "Strategy",
        priority: "medium",
      },
    ],
    focusWeights: {
      People: 5,
      Product: 20,
      GTM: 25,
      Tech: 30,
      Strategy: 10,
      Operations: 5,
      Finance: 5,
      Hiring: 0,
      Management: 0,
    },
  },
  {
    id: "improve_retention",
    name: "Improve Retention",
    description: "Product stickiness",
    category: "Product",
    tasks: [
      {
        title: "User interviews x5",
        description: "Conduct in-depth user interviews",
        category: "Product",
        priority: "high",
      },
      {
        title: "Usage cohort dashboard",
        description: "Build cohort analysis dashboard",
        category: "Tech",
        priority: "high",
      },
      {
        title: "Habit loop nudge",
        description: "Implement user engagement features",
        category: "Product",
        priority: "medium",
      },
      {
        title: "Winback email",
        description: "Create customer re-engagement campaign",
        category: "GTM",
        priority: "medium",
      },
      {
        title: "Pricing for annual plan",
        description: "Design annual subscription pricing",
        category: "Finance",
        priority: "medium",
      },
    ],
    focusWeights: {
      People: 10,
      Product: 35,
      GTM: 15,
      Tech: 25,
      Strategy: 5,
      Operations: 5,
      Finance: 5,
      Hiring: 0,
      Management: 0,
    },
  },
  {
    id: "scale_team",
    name: "Scale Team",
    description: "Build the organization",
    category: "Hiring",
    tasks: [
      {
        title: "Hiring plan for Q3",
        description: "Create comprehensive hiring roadmap",
        category: "Hiring",
        priority: "high",
      },
      {
        title: "Interview process design",
        description: "Standardize hiring and interview流程",
        category: "Hiring",
        priority: "high",
      },
      {
        title: "Onboarding system",
        description: "Build employee onboarding program",
        category: "People",
        priority: "medium",
      },
      {
        title: "Team structure doc",
        description: "Document organizational structure",
        category: "Management",
        priority: "medium",
      },
      {
        title: "Compensation framework",
        description: "Design salary and equity structure",
        category: "Finance",
        priority: "medium",
      },
    ],
    focusWeights: {
      People: 20,
      Product: 10,
      GTM: 5,
      Tech: 15,
      Strategy: 10,
      Operations: 15,
      Finance: 10,
      Hiring: 15,
      Management: 0,
    },
  },
];

export const CATEGORY_COLORS: Record<BusinessCategory, string> = {
  People: "#8B5CF6",      // Purple
  Product: "#3B82F6",     // Blue
  GTM: "#10B981",        // Green
  Tech: "#F59E0B",        // Amber
  Strategy: "#EF4444",    // Red
  Operations: "#6B7280",  // Gray
  Finance: "#84CC16",     // Lime
  Hiring: "#06B6D4",      // Cyan
  Management: "#EC4899",  // Pink
};

export const CATEGORY_ICONS: Record<BusinessCategory, string> = {
  People: "👥",
  Product: "🚀",
  GTM: "📈",
  Tech: "⚙️",
  Strategy: "🎯",
  Operations: "⚡",
  Finance: "💰",
  Hiring: "🎯",
  Management: "👔",
};