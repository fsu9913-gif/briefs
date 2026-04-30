/**
 * Bryan's Command Center - Data Module
 * Silverback AI • NorCal Carb Mobile
 * 
 * This module contains all the data structures for the command center,
 * including agents, tasks, mail, goals, and integration metrics.
 */

const CommandCenterData = {
    // System Information
    system: {
        name: "Bryan's Command Center",
        version: "1.0.0",
        owner: "Bryan",
        organizations: ["Silverback AI", "NorCal Carb Mobile"],
        lastUpdated: new Date().toISOString(),
        systemStatus: "operational"
    },

    // Agent Fleet - All AI agents working for Bryan
    agents: [
        {
            id: "silverback-prime",
            name: "Silverback Prime",
            role: "Chief AI Orchestrator",
            avatar: "SP",
            status: "active",
            description: "Main AI coordinator overseeing all operations and agent activities",
            tier: "executive",
            tasksCompleted: 156,
            efficiency: 98
        },
        {
            id: "calendar-agent",
            name: "Calendar Agent",
            role: "Schedule Management",
            avatar: "CA",
            status: "active",
            description: "Manages all calendar entries, scheduling, and time optimization",
            tier: "operations",
            tasksCompleted: 89,
            efficiency: 95
        },
        {
            id: "email-agent",
            name: "Email Agent",
            role: "Communications Handler",
            avatar: "EA",
            status: "busy",
            description: "Processes incoming emails, drafts responses, and manages follow-ups",
            tier: "operations",
            tasksCompleted: 234,
            efficiency: 92
        },
        {
            id: "project-agent",
            name: "Project Tracker",
            role: "Project Management",
            avatar: "PT",
            status: "active",
            description: "Monitors project milestones, deadlines, and deliverables",
            tier: "operations",
            tasksCompleted: 67,
            efficiency: 94
        },
        {
            id: "client-agent",
            name: "Client Relations",
            role: "Customer Success",
            avatar: "CR",
            status: "active",
            description: "Handles client onboarding, follow-ups, and satisfaction tracking",
            tier: "operations",
            tasksCompleted: 112,
            efficiency: 96
        },
        {
            id: "norcal-ops",
            name: "NorCal Operations",
            role: "Business Operations",
            avatar: "NC",
            status: "active",
            description: "Manages NorCal Carb Mobile operations, orders, and logistics",
            tier: "business",
            tasksCompleted: 78,
            efficiency: 91
        },
        {
            id: "research-agent",
            name: "Research Agent",
            role: "Market Intelligence",
            avatar: "RA",
            status: "idle",
            description: "Conducts market research, competitive analysis, and trend monitoring",
            tier: "intelligence",
            tasksCompleted: 45,
            efficiency: 88
        },
        {
            id: "fire-response",
            name: "Fire Response",
            role: "Urgent Issues Handler",
            avatar: "FR",
            status: "idle",
            description: "Monitors for critical issues and coordinates emergency responses",
            tier: "operations",
            tasksCompleted: 23,
            efficiency: 99
        }
    ],

    // Active Tasks across all agents
    tasks: [
        {
            id: "task-001",
            title: "Prepare daily briefing for tomorrow",
            description: "Compile all relevant updates, meetings, and action items for the next day",
            agent: "calendar-agent",
            agentName: "Calendar Agent",
            status: "active",
            priority: "high",
            dueDate: "Today, 8:00 PM",
            progress: 75
        },
        {
            id: "task-002",
            title: "Process client follow-up emails",
            description: "Review and respond to pending client communications",
            agent: "email-agent",
            agentName: "Email Agent",
            status: "active",
            priority: "high",
            dueDate: "Today, 5:00 PM",
            progress: 40
        },
        {
            id: "task-003",
            title: "Review NorCal Carb Mobile weekly metrics",
            description: "Analyze sales, orders, and customer satisfaction data",
            agent: "norcal-ops",
            agentName: "NorCal Operations",
            status: "active",
            priority: "medium",
            dueDate: "Today, 6:00 PM",
            progress: 60
        },
        {
            id: "task-004",
            title: "Client onboarding: Acme Corp",
            description: "Complete onboarding steps for new enterprise client",
            agent: "client-agent",
            agentName: "Client Relations",
            status: "pending",
            priority: "high",
            dueDate: "Tomorrow, 10:00 AM",
            progress: 25
        },
        {
            id: "task-005",
            title: "Project milestone review: Website Redesign",
            description: "Check status of current phase and update timeline",
            agent: "project-agent",
            agentName: "Project Tracker",
            status: "active",
            priority: "medium",
            dueDate: "Today, 4:00 PM",
            progress: 80
        },
        {
            id: "task-006",
            title: "URGENT: Payment processing issue",
            description: "Investigate and resolve payment gateway timeout errors",
            agent: "fire-response",
            agentName: "Fire Response",
            status: "urgent",
            priority: "critical",
            dueDate: "ASAP",
            progress: 15
        },
        {
            id: "task-007",
            title: "Coordinate agent morning sync",
            description: "Prepare agenda and collect status updates from all agents",
            agent: "silverback-prime",
            agentName: "Silverback Prime",
            status: "pending",
            priority: "medium",
            dueDate: "Tomorrow, 7:00 AM",
            progress: 0
        },
        {
            id: "task-008",
            title: "Market analysis: Competitor pricing",
            description: "Research current market rates and competitive positioning",
            agent: "research-agent",
            agentName: "Research Agent",
            status: "pending",
            priority: "low",
            dueDate: "This Week",
            progress: 10
        },
        {
            id: "task-009",
            title: "Schedule client check-in calls",
            description: "Identify clients due for check-ins and prepare scheduling options",
            agent: "client-agent",
            agentName: "Client Relations",
            status: "active",
            priority: "medium",
            dueDate: "Today, 3:00 PM",
            progress: 55
        },
        {
            id: "task-010",
            title: "Optimize delivery routes for NorCal",
            description: "Analyze and improve delivery logistics for efficiency",
            agent: "norcal-ops",
            agentName: "NorCal Operations",
            status: "active",
            priority: "medium",
            dueDate: "Today, 7:00 PM",
            progress: 30
        },
        {
            id: "task-011",
            title: "CARB Testing Email Campaign — Fill Contacts & Send",
            description: "Fill in recipient emails from Notion database, load draft into Squarespace Email Campaigns, test-send, and schedule for deployment. Draft brief: briefs/carb-testing-email-draft.json",
            agent: "email-agent",
            agentName: "Email Agent",
            status: "pending",
            priority: "high",
            dueDate: "This Week",
            progress: 10
        }
    ],

    // Mail / Communications
    mail: [
        {
            id: "mail-001",
            from: "Sarah Johnson",
            email: "sarah.j@acmecorp.com",
            subject: "RE: Partnership Proposal",
            preview: "Hi Bryan, I reviewed the proposal and would love to schedule a call to discuss...",
            time: "10 min ago",
            unread: true,
            priority: "high",
            category: "client"
        },
        {
            id: "mail-002",
            from: "NorCal Carb Mobile",
            email: "system@norcalcarbmobile.com",
            subject: "Daily Sales Report - Record Day!",
            preview: "Today's sales exceeded targets by 23%. Breakdown: Mobile orders +45%, Catering +12%...",
            time: "1 hour ago",
            unread: true,
            priority: "medium",
            category: "business"
        },
        {
            id: "mail-003",
            from: "Michael Chen",
            email: "m.chen@techpartners.io",
            subject: "Website Redesign - Phase 2 Update",
            preview: "The design mockups for phase 2 are ready for your review. Key changes include...",
            time: "2 hours ago",
            unread: true,
            priority: "medium",
            category: "project"
        },
        {
            id: "mail-004",
            from: "Silverback AI Team",
            email: "team@silverback.ai",
            subject: "New Agent Capabilities Released",
            preview: "We've deployed enhanced reasoning and task prioritization features to your agents...",
            time: "3 hours ago",
            unread: false,
            priority: "low",
            category: "system"
        },
        {
            id: "mail-005",
            from: "Lisa Martinez",
            email: "lisa.m@clientco.com",
            subject: "Schedule Change Request",
            preview: "Would it be possible to move our Thursday meeting to Friday morning? We have...",
            time: "4 hours ago",
            unread: true,
            priority: "medium",
            category: "calendar"
        },
        {
            id: "mail-006",
            from: "Payment Gateway",
            email: "alerts@paygateway.com",
            subject: "⚠️ Transaction Alert: Multiple Failures",
            preview: "We detected 5 failed transactions in the last hour. Please review your gateway settings...",
            time: "5 hours ago",
            unread: false,
            priority: "high",
            category: "alert"
        },
        {
            id: "mail-007",
            from: "Bryan (Draft — Action Required)",
            email: "[YOUR_BUSINESS_EMAIL@norcalcarbmobile.com]",
            subject: "📧 DRAFT: CARB Testing Outreach — Fill Emails & Send via Squarespace",
            preview: "Draft ready: 'Is Your Carburetor CARB-Compliant? We Come to You.' — Fill in recipient emails from Notion DB, then load into Squarespace Email Campaigns. See briefs/carb-testing-email-draft.json for full draft + instructions.",
            time: "Just now",
            unread: true,
            priority: "high",
            category: "action-required"
        }
    ],

    // Mission Objectives / Goals
    goals: [
        {
            id: "goal-001",
            title: "Q1 Revenue Target",
            description: "Achieve $500K in combined revenue across all business units",
            progress: 78,
            target: "$500,000",
            current: "$390,000",
            deadline: "End of Q1",
            category: "revenue",
            milestones: [
                { name: "Month 1 Target", completed: true },
                { name: "Month 2 Target", completed: true },
                { name: "Month 3 Target", completed: false }
            ]
        },
        {
            id: "goal-002",
            title: "Client Expansion",
            description: "Onboard 15 new enterprise clients",
            progress: 67,
            target: "15 clients",
            current: "10 clients",
            deadline: "End of Quarter",
            category: "growth",
            milestones: [
                { name: "5 Clients", completed: true },
                { name: "10 Clients", completed: true },
                { name: "15 Clients", completed: false }
            ]
        },
        {
            id: "goal-003",
            title: "NorCal Mobile Delivery Network",
            description: "Expand delivery coverage to 3 new cities",
            progress: 100,
            target: "3 cities",
            current: "3 cities",
            deadline: "Completed",
            category: "expansion",
            milestones: [
                { name: "Sacramento", completed: true },
                { name: "Stockton", completed: true },
                { name: "Modesto", completed: true }
            ]
        },
        {
            id: "goal-004",
            title: "Agent Fleet Efficiency",
            description: "Maintain 90%+ efficiency across all AI agents",
            progress: 92,
            target: "90%",
            current: "92%",
            deadline: "Ongoing",
            category: "operations",
            milestones: [
                { name: "Baseline Established", completed: true },
                { name: "Optimization Phase 1", completed: true },
                { name: "Optimization Phase 2", completed: false }
            ]
        },
        {
            id: "goal-005",
            title: "Customer Satisfaction Score",
            description: "Achieve and maintain 4.8+ star rating",
            progress: 95,
            target: "4.8 stars",
            current: "4.76 stars",
            deadline: "Ongoing",
            category: "quality",
            milestones: [
                { name: "4.5 Star Baseline", completed: true },
                { name: "4.7 Star Target", completed: true },
                { name: "4.8 Star Target", completed: false }
            ]
        }
    ],

    // Integration Metrics
    integrations: {
        norcalCarbMobile: {
            name: "NorCal Carb Mobile",
            status: "connected",
            lastSync: new Date().toISOString(),
            metrics: {
                ordersToday: 47,
                revenueToday: "$8,234",
                activeDeliveries: 12,
                avgDeliveryTime: "28 min",
                customerRating: 4.8,
                inventoryStatus: "optimal"
            },
            alerts: []
        },
        silverbackAI: {
            name: "Silverback AI",
            status: "active",
            lastSync: new Date().toISOString(),
            metrics: {
                activeAgents: 8,
                tasksPerHour: 23,
                avgResponseTime: "1.2s",
                modelVersion: "v2.4.1",
                contextUtilization: "87%",
                uptime: "99.97%"
            },
            alerts: []
        }
    },

    // Activity Feed
    activities: [
        {
            id: "act-001",
            type: "task_complete",
            icon: "check",
            text: "<strong>Calendar Agent</strong> completed daily schedule optimization",
            time: "2 min ago"
        },
        {
            id: "act-000",
            type: "email",
            icon: "mail",
            text: "<strong>Email Agent</strong> prepared CARB Testing email draft — action required: fill contacts &amp; send via Squarespace",
            time: "Just now"
        },
        {
            id: "act-002",
            type: "email",
            icon: "mail",
            text: "<strong>Email Agent</strong> processed 12 new messages, 3 flagged for review",
            time: "5 min ago"
        },
        {
            id: "act-003",
            type: "integration",
            icon: "link",
            text: "<strong>NorCal Carb Mobile</strong> synced: 5 new orders received",
            time: "8 min ago"
        },
        {
            id: "act-004",
            type: "agent",
            icon: "user",
            text: "<strong>Client Relations</strong> initiated follow-up sequence for 3 clients",
            time: "15 min ago"
        },
        {
            id: "act-005",
            type: "alert",
            icon: "alert",
            text: "<strong>Fire Response</strong> investigating payment gateway timeout",
            time: "22 min ago"
        },
        {
            id: "act-006",
            type: "task_complete",
            icon: "check",
            text: "<strong>Project Tracker</strong> updated Website Redesign milestone status",
            time: "30 min ago"
        },
        {
            id: "act-007",
            type: "integration",
            icon: "link",
            text: "<strong>Silverback AI</strong> deployed agent optimization update",
            time: "45 min ago"
        },
        {
            id: "act-008",
            type: "goal",
            icon: "target",
            text: "<strong>Goal Update</strong>: NorCal Mobile Delivery Network - 100% Complete!",
            time: "1 hour ago"
        }
    ],

    // System Metrics
    metrics: {
        systemLoad: 45,
        agentEfficiency: 92,
        tasksCompletedToday: 47,
        nextBriefing: "7:00 AM",
        uptime: "99.97%",
        activeConnections: 8
    }
};

// Export for use in dashboard.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommandCenterData;
}
