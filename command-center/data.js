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
            description: "Processes incoming emails, drafts responses, and manages follow-ups. Active: Make.com email outreach for 22 Hayward/SL leads",
            tier: "operations",
            tasksCompleted: 235,
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
            status: "busy",
            description: "Manages NorCal Carb Mobile operations, orders, and logistics. Active: Hayward/SL cold call outreach (22 leads)",
            tier: "business",
            tasksCompleted: 79,
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
            id: "task-012",
            title: "Cold Call Campaign: Hayward/San Leandro Fleet Outreach",
            description: "22 leads (7 HOT, 15 WARM). SMS + email drafts ready. Scheduled send tomorrow 10:30 AM. ⚠️ Verify against Master CRM before calling. See Cold Calls panel for full lead list.",
            agent: "norcal-ops",
            agentName: "NorCal Operations",
            status: "pending",
            priority: "high",
            dueDate: "Tomorrow, 10:30 AM",
            progress: 5
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
        },
        {
            id: "task-013",
            title: "🔄 Monthly Retest Retention Check — June 2026",
            description: "Retest engine ran on the A+ Leads & Jobs Calendar export (77 customers, last tested Oct 14 – Dec 8 2025). All 77 are >90 days from next due so nothing is actionable this cycle. Outreach spike starts Aug 2026 (39 customers in window), peaks Oct 2026 (77 in window). Pipeline + report: docs/retest-retention-2026-06.md. ⚠️ Earlier cohort missing — export the full Master CRM (not just last 8 weeks) to surface real URGENT/HOT this month.",
            agent: "client-agent",
            agentName: "Client Relations",
            status: "active",
            priority: "medium",
            dueDate: "This Week",
            progress: 100
        },
        {
            id: "task-014",
            title: "Add Hayward/SL Leads to Gumption Cold Calls",
            description: "Upload 22 leads to gumption.manus.space under Cold Calls for tracking. CSV: leads/hayward-san-leandro-2026-05-22.csv",
            agent: "client-agent",
            agentName: "Client Relations",
            status: "pending",
            priority: "high",
            dueDate: "Today",
            progress: 0
        },
        {
            id: "task-015",
            title: "Dedupe Hayward Leads Against Master CRM",
            description: "Cross-reference 22 new leads against Master CRM sheet (1TdNnf7eLaPNN3anaBGpNdjo_unK04zWwZJ859ZDvIO4) to identify existing customers before outreach.",
            agent: "client-agent",
            agentName: "Client Relations",
            status: "pending",
            priority: "critical",
            dueDate: "Today, Before Email Send",
            progress: 0
        },
        {
            id: "task-016",
            title: "Make.com Email Scenario — Configure & Run",
            description: "Import blueprint (leads/make-com-email-blueprint.json), connect SMTP for bryan@norcalcarbmobile.com, link Google Sheet with email outreach data, test 1 row, then send all. ~88 ops / 10,000 credits available.",
            agent: "email-agent",
            agentName: "Email Agent",
            status: "active",
            priority: "high",
            dueDate: "Today",
            progress: 25
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
            id: "mail-008",
            from: "NorCal Ops Agent — Action Required",
            email: "bryan@norcalcarbmobile.com",
            subject: "📱 SMS + EMAIL DRAFTS READY: 22 Fleet Leads — Hayward/San Leandro (Send Tomorrow 10:30 AM)",
            preview: "7 HOT + 15 WARM fleet leads loaded into Cold Calls tracker. SMS & email drafts ready. ⚠️ Verify against Master CRM before sending. Scheduled: tomorrow 10:30 AM. See Cold Calls panel below.",
            time: "Just now",
            unread: true,
            priority: "high",
            category: "action-required"
        },
        {
            id: "mail-009",
            from: "Retest Retention Engine",
            email: "agent@silverback.ai",
            subject: "🔄 Monthly Retest Check (June 2026): 0 actionable — earlier cohort missing",
            preview: "Engine ran on the A+ Leads & Jobs Calendar export (Oct 14 – Dec 8 2025, 77 customers). All 77 are >90 days from next-due, so no URGENT/HOT/WARM/EARLY rows this cycle. The outreach spike is Aug 2026 (39 due) → Oct 2026 (77 due). To surface real URGENT/HOT this month, export customers tested before Oct 2025 (full Master CRM, not just last 8 weeks). Pipeline + full report: docs/retest-retention-2026-06.md.",
            time: "Just now",
            unread: true,
            priority: "high",
            category: "action-required"
        },
        {
            id: "mail-007",
            from: "Bryan (Draft — Action Required)",
            email: "[YOUR_BUSINESS_EMAIL@norcalcarbmobile.com]",
            subject: "📧 DRAFT: CARB Testing Outreach — Fill Emails & Send via Squarespace",
            preview: "Draft ready: 'Is Your Carburetor CARB-Compliant? We Come to You.' — Fill in recipient emails from Notion DB, then load into Squarespace Email Campaigns. See briefs/carb-testing-email-draft.json for full draft + instructions.",
            time: "1 hour ago",
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
            id: "act-015",
            type: "task_complete",
            icon: "check",
            text: "<strong>Email Agent</strong> Make.com email blueprint ready — 22 personalized emails queued. Upload CSV to Sheets, fill emails, run scenario (~88 ops / 10k credits).",
            time: "Just now"
        },
        {
            id: "act-014",
            type: "task_complete",
            icon: "check",
            text: "<strong>NorCal Operations</strong> Bryan handling SMS directly — knows most contacts personally. Email automation via Make.com.",
            time: "1 min ago"
        },
        {
            id: "act-012",
            type: "task_complete",
            icon: "check",
            text: "<strong>NorCal Operations</strong> prepared 22 cold call leads (Hayward/San Leandro) — SMS drafts ready, tap-to-call HTML live",
            time: "2 min ago"
        },
        {
            id: "act-011",
            type: "alert",
            icon: "alert",
            text: "<strong>Client Relations</strong> WARNING: Hayward leads NOT deduped against Master CRM — verify before emailing",
            time: "3 min ago"
        },
        {
            id: "act-010",
            type: "email",
            icon: "mail",
            text: "<strong>Email Agent</strong> drafted personalized emails for 7 HOT + 15 WARM leads — Make.com blueprint + Google Sheets CSV ready",
            time: "5 min ago"
        },
        {
            id: "act-001",
            type: "task_complete",
            icon: "check",
            text: "<strong>Calendar Agent</strong> completed daily schedule optimization",
            time: "5 min ago"
        },
        {
            id: "act-retest",
            type: "agent",
            icon: "target",
            text: "<strong>Retest Retention Engine</strong> ran monthly check on real A+ calendar export — 77 customers, 0 actionable (peak hits Oct 2026)",
            time: "Just now"
        },
        {
            id: "act-000",
            type: "email",
            icon: "mail",
            text: "<strong>Email Agent</strong> prepared CARB Testing email draft — action required: fill contacts &amp; send via Squarespace",
            time: "10 min ago"
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
    },

    // Retest Retention — Monthly check, June 2026
    // Generated by leads/retest_retention_check.py from leads/retest-customers.csv
    // (which was built by leads/import_aplus_jobs_calendar.py from the uploaded
    // A+ Leads & Jobs Calendar export). All 77 customers are >90 days from next-due
    // because the source only covers Oct 14 – Dec 8 2025; outreach pipeline peaks Oct 2026.
    retestRetention: {
        name: "Monthly Retest Retention Check",
        asOf: "2026-06-30",
        cadence: "Monthly on the 23rd",
        triggerPhrase: "Run monthly retest check",
        source: "leads/retest-customers.csv",
        sourceUpstream: "leads/aplus-jobs-calendar-2025-10-14_2025-12-08.csv",
        report: "docs/retest-retention-2026-06.md",
        spec: "briefs/retest-retention-check.json",
        snapshot: "briefs/retest-retention-2026-06.json",
        isDemoData: false,
        coverage: {
            lastTestDateMin: "2025-10-14",
            lastTestDateMax: "2025-12-08",
            nextDueDateMin: "2026-10-14",
            nextDueDateMax: "2026-12-08",
            note: "Source covers only an 8-week slice; earlier cohort missing → 0 actionable this cycle."
        },
        stats: {
            totalCustomers: 77,
            urgent: 0,
            hot: 0,
            warm: 0,
            early: 0,
            outOfWindow: 77,
            actionable: 0,
            retentionTarget: 0.9
        },
        buckets: [
            { id: "urgent", label: "🔴 URGENT", window: "≤ 7 days", action: "Call immediately", count: 0 },
            { id: "hot", label: "🟠 HOT", window: "8–30 days", action: "Call this week", count: 0 },
            { id: "warm", label: "🟡 WARM", window: "31–60 days", action: "Email + follow-up call", count: 0 },
            { id: "early", label: "🟢 EARLY", window: "61–90 days", action: "Email reminder only", count: 0 },
            { id: "out_of_window", label: "⚪ OUT", window: "> 90 days", action: "Re-check next month", count: 77 }
        ],
        pipeline12Mo: [
            { month: "2026-06", dueWithin90d: 0 },
            { month: "2026-07", dueWithin90d: 0 },
            { month: "2026-08", dueWithin90d: 39 },
            { month: "2026-09", dueWithin90d: 73 },
            { month: "2026-10", dueWithin90d: 77 },
            { month: "2026-11", dueWithin90d: 36 },
            { month: "2026-12", dueWithin90d: 4 },
            { month: "2027-01", dueWithin90d: 0 },
            { month: "2027-02", dueWithin90d: 0 },
            { month: "2027-03", dueWithin90d: 0 },
            { month: "2027-04", dueWithin90d: 0 },
            { month: "2027-05", dueWithin90d: 0 }
        ]
    },

    // Cold Calls — Hayward / San Leandro Fleet Outreach 2026-05-22
    // ⚠️ NOT yet deduped against Master CRM — verify before calling
    coldCallCampaign: {
        name: "Hayward / San Leandro Fleet Outreach",
        date: "2026-05-22",
        scheduledSendTime: "2026-05-23T10:30:00",
        voicemailHook: "Hey [Name], Bryan with NorCal CARB Mobile. I'll be in [City] tomorrow doing Clean Truck Checks for fleets right by you. If you've got diesels over 14,000 lbs I can knock yours out same trip — mobile OBD and OVI smoke opacity, 24/7, 363 days a year. Call me before the State calls you. [Your number].",
        smsDraft: "Hey [Name], Bryan @ NorCal CARB Mobile. In [City] tomorrow doing Clean Truck Checks — if you've got diesels 14k+ lbs I can knock out your CARB compliance same trip. Mobile OBD + smoke opacity, 24/7. Call me before the State calls you. 📲 [Your number]",
        emailSubject: "Free Clean Truck Check — [City] Tomorrow | NorCal CARB Mobile",
        emailBody: "Hi [Name],\n\nBryan here with NorCal CARB Mobile. We're running Clean Truck Checks in [City] tomorrow and wanted to reach out directly.\n\nIf your fleet has diesel vehicles over 14,000 lbs GVWR, we can knock out your CARB compliance check on the same trip — mobile OBD scan + OVI smoke opacity test, no appointment needed.\n\nWe're available 24/7, 363 days a year, and we come to you.\n\nDon't wait for the State to show up. Reply here or call me direct.\n\nBryan\nNorCal CARB Mobile\n(your number)",
        stats: { hot: 7, warm: 15, cool: 0, total: 22, called: 0, connected: 0, scheduled: 0 },
        leads: [
            // ═══ HOT — Call First ═══
            {
                id: "lead-001", tier: "hot", score: 85,
                name: "ArborTech Inc.",
                phone: "510-871-8788",
                type: "Tree Service",
                city: "Hayward",
                reviews: 135, stars: 5.0, hours: "24/7",
                address: "1310 Ruus Ln, Hayward 94544",
                status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-002", tier: "hot", score: 80,
                name: "Saunders Tree Service Inc",
                phone: "925-200-9057",
                type: "Tree Service",
                city: "Hayward",
                reviews: 78, stars: 4.9, hours: "24/7",
                address: "22844 Alice St, Hayward 94541",
                status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-003", tier: "hot", score: 80,
                name: "Castillo Tree Service Inc",
                phone: "510-792-6590",
                type: "Tree Service",
                city: "Hayward",
                reviews: 51, stars: 4.8, hours: "24/7",
                address: "25798 Franklin Ave, Hayward 94544",
                status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-004", tier: "hot", score: 80,
                name: "Graham Tree Services Inc",
                phone: "510-383-9585",
                type: "Tree Service",
                city: "San Leandro",
                reviews: 49, stars: 4.7, hours: "24/7",
                address: "520 Doolittle Dr, San Leandro 94577",
                status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-005", tier: "hot", score: 75,
                name: "Boyett Concrete Inc",
                phone: "510-264-9100",
                type: "Concrete",
                city: "Hayward",
                reviews: 16, stars: 4.9, hours: "24/7",
                address: "2404 Tripaldi Way, Hayward 94545",
                status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-006", tier: "hot", score: 75,
                name: "LS Trucking, Inc.",
                phone: "510-266-5213",
                type: "Trucking",
                city: "Hayward",
                reviews: 15, stars: 4.3, hours: "24/7",
                address: "1774 W Winton Ave, Hayward 94545",
                status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-007", tier: "hot", score: 70,
                name: "Daylight Transport",
                phone: "800-468-9999",
                type: "Trucking/LTL",
                city: "Hayward",
                reviews: 98, stars: 3.6, hours: "Business",
                address: "2340 Industrial Pkwy W, Hayward 94545",
                status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            // ═══ WARM ═══
            {
                id: "lead-008", tier: "warm", score: 68,
                name: "Baystar Trans Inc",
                phone: "510-586-9300",
                type: "Trucking",
                city: "Hayward",
                reviews: null, stars: null, hours: null,
                address: "", status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-009", tier: "warm", score: 65,
                name: "Rangel Concrete",
                phone: "510-292-6207",
                type: "Concrete",
                city: "San Lorenzo",
                reviews: null, stars: null, hours: null,
                address: "", status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-010", tier: "warm", score: 65,
                name: "Mag Trucking",
                phone: "510-782-8801",
                type: "Trucking",
                city: "Hayward",
                reviews: null, stars: null, hours: null,
                address: "", status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-011", tier: "warm", score: 65,
                name: "Cato's Paving",
                phone: "510-397-2677",
                type: "Asphalt/Paving",
                city: "Hayward",
                reviews: null, stars: null, hours: null,
                address: "", status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-012", tier: "warm", score: 65,
                name: "Estes Express Lines",
                phone: "510-635-0165",
                type: "LTL Freight",
                city: "San Leandro",
                reviews: null, stars: null, hours: null,
                address: "", status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-013", tier: "warm", score: 65,
                name: "Saia LTL Freight",
                phone: "510-347-6890",
                type: "LTL Freight",
                city: "San Leandro",
                reviews: null, stars: null, hours: null,
                address: "", status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-014", tier: "warm", score: 65,
                name: "DHE Dependable Highway Express",
                phone: "510-357-2223",
                type: "LTL Freight",
                city: "San Leandro",
                reviews: null, stars: null, hours: null,
                address: "", status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-015", tier: "warm", score: 65,
                name: "Maguire Tree Care",
                phone: "650-844-2046",
                type: "Tree Service",
                city: "San Carlos",
                reviews: null, stars: null, hours: null,
                address: "", status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-016", tier: "warm", score: 63,
                name: "10-4 Tow Of San Leandro",
                phone: "510-633-2727",
                type: "HD Towing",
                city: "San Leandro",
                reviews: null, stars: null, hours: null,
                address: "", status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-017", tier: "warm", score: 60,
                name: "Roadstar Trucking Inc",
                phone: "510-487-2404",
                type: "Trucking",
                city: "Hayward",
                reviews: null, stars: null, hours: null,
                address: "", status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-018", tier: "warm", score: 60,
                name: "Munoz Transport Service",
                phone: "510-385-9206",
                type: "Trucking",
                city: "Hayward",
                reviews: null, stars: null, hours: null,
                address: "", status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-019", tier: "warm", score: 60,
                name: "American Asphalt R&R",
                phone: "510-723-0280",
                type: "Asphalt",
                city: "Hayward",
                reviews: null, stars: null, hours: null,
                address: "", status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-020", tier: "warm", score: 60,
                name: "Rose Paving",
                phone: "510-770-1150",
                type: "Asphalt",
                city: "Hayward",
                reviews: null, stars: null, hours: null,
                address: "", status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-021", tier: "warm", score: 60,
                name: "Malcolm Drilling",
                phone: "510-780-9181",
                type: "Drilling/Excavation",
                city: "Hayward",
                reviews: null, stars: null, hours: null,
                address: "", status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            },
            {
                id: "lead-022", tier: "warm", score: 60,
                name: "GreenWaste Hayward Transfer",
                phone: "510-606-1548",
                type: "Waste/Hauling",
                city: "Hayward",
                reviews: null, stars: null, hours: null,
                address: "", status: "not_called",
                smsSent: false, emailSent: false, notes: ""
            }
        ]
    }
};

// Export for use in dashboard.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommandCenterData;
}
