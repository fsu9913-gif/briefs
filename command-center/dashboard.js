/**
 * Bryan's Command Center - Dashboard Module
 * Silverback AI • NorCal Carb Mobile
 * 
 * This module handles all dashboard interactivity, data rendering,
 * and real-time updates.
 */

// Dashboard Controller
const Dashboard = {
    // State
    currentFilter: 'all',
    refreshInterval: null,
    
    // Cold calls filter state
    currentCCFilter: 'all',

    // Initialize dashboard
    init() {
        this.updateDateTime();
        this.renderAgents();
        this.renderTasks();
        this.renderMail();
        this.renderGoals();
        this.renderIntegrations();
        this.renderActivityFeed();
        this.renderColdCalls();
        this.setupFilters();
        this.setupColdCallFilters();
        this.startAutoRefresh();
        
        // Update datetime every second
        setInterval(() => this.updateDateTime(), 1000);
        
        console.log('🚀 Bryan\'s Command Center initialized');
    },
    
    // Update datetime display
    updateDateTime() {
        const now = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const formatted = now.toLocaleString('en-US', options);
        document.getElementById('datetime').textContent = formatted.toUpperCase();
    },
    
    // Render Agents Panel
    renderAgents() {
        const container = document.getElementById('agents-list');
        const agents = CommandCenterData.agents;
        const activeCount = agents.filter(a => a.status === 'active' || a.status === 'busy').length;
        
        document.getElementById('agents-count').textContent = `${activeCount} Active`;
        
        container.innerHTML = agents.map(agent => `
            <div class="agent-card" data-agent-id="${agent.id}">
                <div class="agent-avatar" style="${this.getAvatarStyle(agent.tier)}">
                    ${agent.avatar}
                </div>
                <div class="agent-info">
                    <div class="agent-name">${agent.name}</div>
                    <div class="agent-role">${agent.role}</div>
                </div>
                <div class="agent-status ${agent.status}">
                    ${this.formatStatus(agent.status)}
                </div>
            </div>
        `).join('');
    },
    
    // Get avatar gradient based on tier
    getAvatarStyle(tier) {
        const gradients = {
            executive: 'background: linear-gradient(135deg, #9c27b0, #7b1fa2)',
            operations: 'background: linear-gradient(135deg, #00d4ff, #00a3cc)',
            business: 'background: linear-gradient(135deg, #4caf50, #388e3c)',
            intelligence: 'background: linear-gradient(135deg, #ff9800, #f57c00)'
        };
        return gradients[tier] || gradients.operations;
    },
    
    // Format status text
    formatStatus(status) {
        const labels = {
            active: 'Active',
            busy: 'Busy',
            idle: 'Standby'
        };
        return labels[status] || status;
    },
    
    // Render Tasks Panel
    renderTasks() {
        const container = document.getElementById('tasks-list');
        let tasks = CommandCenterData.tasks;
        
        // Apply filter
        if (this.currentFilter !== 'all') {
            tasks = tasks.filter(task => {
                if (this.currentFilter === 'urgent') return task.status === 'urgent' || task.priority === 'critical';
                return task.status === this.currentFilter;
            });
        }
        
        container.innerHTML = tasks.map(task => `
            <div class="task-item ${task.status === 'urgent' ? 'urgent' : ''} ${task.status === 'pending' ? 'pending' : ''}">
                <div class="task-header">
                    <span class="task-title">${task.title}</span>
                    <span class="task-priority ${this.getPriorityClass(task.priority)}">${task.priority}</span>
                </div>
                <div class="task-meta">
                    <span class="task-agent">${task.agentName}</span>
                    <span>Due: ${task.dueDate}</span>
                    <span>${task.progress}%</span>
                </div>
            </div>
        `).join('');
    },
    
    // Get priority class
    getPriorityClass(priority) {
        const classes = {
            critical: 'high',
            high: 'high',
            medium: 'medium',
            low: 'low'
        };
        return classes[priority] || 'medium';
    },
    
    // Render Mail Panel
    renderMail() {
        const container = document.getElementById('mail-list');
        const mail = CommandCenterData.mail;
        const unreadCount = mail.filter(m => m.unread).length;
        
        document.getElementById('unread-count').textContent = `${unreadCount} Unread`;
        
        container.innerHTML = mail.map(item => `
            <div class="mail-item ${item.unread ? 'unread' : ''}" data-mail-id="${item.id}">
                <div class="mail-header">
                    <span class="mail-from">${item.from}</span>
                    <span class="mail-time">${item.time}</span>
                </div>
                <div class="mail-subject">${item.subject}</div>
                <div class="mail-preview">${item.preview}</div>
            </div>
        `).join('');
    },
    
    // Render Goals Panel
    renderGoals() {
        const container = document.getElementById('goals-list');
        const goals = CommandCenterData.goals;
        
        // Calculate overall progress
        const overallProgress = Math.round(
            goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
        );
        document.getElementById('goals-progress').textContent = `${overallProgress}%`;
        
        container.innerHTML = goals.map(goal => `
            <div class="goal-item" data-goal-id="${goal.id}">
                <div class="goal-header">
                    <span class="goal-title">${goal.title}</span>
                    <span class="goal-percentage">${goal.progress}%</span>
                </div>
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill" style="width: ${goal.progress}%"></div>
                </div>
                <div class="goal-meta">
                    <span>${goal.current} / ${goal.target}</span>
                    <span>${goal.deadline}</span>
                </div>
            </div>
        `).join('');
    },
    
    // Render Integrations Panel
    renderIntegrations() {
        const { norcalCarbMobile, silverbackAI } = CommandCenterData.integrations;
        
        // NorCal Carb Mobile metrics
        document.getElementById('norcalcarb-orders').textContent = norcalCarbMobile.metrics.ordersToday;
        document.getElementById('norcalcarb-revenue').textContent = norcalCarbMobile.metrics.revenueToday;
        
        // Silverback AI metrics
        document.getElementById('silverback-agents').textContent = silverbackAI.metrics.activeAgents;
        document.getElementById('silverback-tasks').textContent = silverbackAI.metrics.tasksPerHour;
    },
    
    // Render Activity Feed
    renderActivityFeed() {
        const container = document.getElementById('activity-feed');
        const activities = CommandCenterData.activities;
        
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    ${this.getActivityIcon(activity.type)}
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    },
    
    // Get activity icon SVG
    getActivityIcon(type) {
        const icons = {
            task_complete: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>`,
            email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
            </svg>`,
            integration: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>`,
            agent: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>`,
            alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>`,
            goal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
            </svg>`
        };
        return icons[type] || icons.task_complete;
    },
    
    // Setup task filters
    setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderTasks();
            });
        });
    },
    
    // Start auto-refresh for real-time updates
    startAutoRefresh() {
        this.refreshInterval = setInterval(() => {
            this.simulateDataUpdate();
        }, 30000); // Every 30 seconds
    },
    
    // Simulate data updates (in production, this would fetch from API)
    simulateDataUpdate() {
        // Update system metrics with small variations
        const metrics = CommandCenterData.metrics;
        metrics.systemLoad = Math.min(100, Math.max(20, metrics.systemLoad + (Math.random() - 0.5) * 10));
        metrics.agentEfficiency = Math.min(100, Math.max(85, metrics.agentEfficiency + (Math.random() - 0.5) * 3));
        
        // Update UI
        document.getElementById('system-load').style.width = `${metrics.systemLoad}%`;
        document.getElementById('agent-efficiency').style.width = `${metrics.agentEfficiency}%`;
        
        // Add new activity
        this.addActivity({
            id: `act-${Date.now()}`,
            type: 'task_complete',
            text: '<strong>System</strong> performed routine health check',
            time: 'Just now'
        });
        
        console.log('📊 Dashboard data refreshed');
    },
    
    // Add new activity to feed
    addActivity(activity) {
        CommandCenterData.activities.unshift(activity);
        if (CommandCenterData.activities.length > 10) {
            CommandCenterData.activities.pop();
        }
        this.renderActivityFeed();
    },

    // ─── Cold Calls ──────────────────────────────────────────────────────────

    renderColdCalls() {
        const campaign = CommandCenterData.coldCallCampaign;
        const leads = campaign.leads;

        // Stats bar
        const statsEl = document.getElementById('cold-calls-stats');
        const hot = leads.filter(l => l.tier === 'hot').length;
        const warm = leads.filter(l => l.tier === 'warm').length;
        const called = leads.filter(l => l.status !== 'not_called').length;
        const connected = leads.filter(l => l.status === 'connected' || l.status === 'interested').length;
        const smsSent = leads.filter(l => l.smsSent).length;

        const sendDt = new Date(campaign.scheduledSendTime);
        const sendLabel = sendDt.toLocaleString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true
        });

        statsEl.innerHTML = `
            <div class="cc-stat hot"><span class="cc-stat-val">${hot}</span><span class="cc-stat-lbl">🔥 HOT</span></div>
            <div class="cc-stat warm"><span class="cc-stat-val">${warm}</span><span class="cc-stat-lbl">🟡 WARM</span></div>
            <div class="cc-stat"><span class="cc-stat-val">${leads.length}</span><span class="cc-stat-lbl">Total</span></div>
            <div class="cc-stat"><span class="cc-stat-val">${called}</span><span class="cc-stat-lbl">Called</span></div>
            <div class="cc-stat success"><span class="cc-stat-val">${connected}</span><span class="cc-stat-lbl">Connected</span></div>
            <div class="cc-stat"><span class="cc-stat-val">${smsSent}</span><span class="cc-stat-lbl">SMS Sent</span></div>
            <div class="cc-stat schedule"><span class="cc-stat-val sched-time">📅 ${sendLabel}</span><span class="cc-stat-lbl">Scheduled Send</span></div>
        `;

        // Lead list
        const container = document.getElementById('cold-calls-list');
        let filtered = leads;
        if (this.currentCCFilter !== 'all') {
            if (this.currentCCFilter === 'hot' || this.currentCCFilter === 'warm') {
                filtered = leads.filter(l => l.tier === this.currentCCFilter);
            } else if (this.currentCCFilter === 'not_called') {
                filtered = leads.filter(l => l.status === 'not_called');
            } else if (this.currentCCFilter === 'called') {
                filtered = leads.filter(l => l.status !== 'not_called');
            }
        }

        container.innerHTML = `<div class="cold-calls-grid">${filtered.map(lead => this.renderLeadCard(lead)).join('')}</div>`;

        // Bind status change buttons
        container.querySelectorAll('.cc-status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('[data-lead-id]').dataset.leadId;
                const newStatus = e.target.dataset.status;
                this.updateLeadStatus(id, newStatus);
            });
        });

        // Bind SMS/email toggles
        container.querySelectorAll('.cc-toggle-sms').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('[data-lead-id]').dataset.leadId;
                this.toggleLeadField(id, 'smsSent');
            });
        });
        container.querySelectorAll('.cc-toggle-email').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('[data-lead-id]').dataset.leadId;
                this.toggleLeadField(id, 'emailSent');
            });
        });
    },

    renderLeadCard(lead) {
        const tierClass = lead.tier === 'hot' ? 'lead-hot' : lead.tier === 'warm' ? 'lead-warm' : 'lead-cool';
        const tierBadge = lead.tier === 'hot' ? '🔥 HOT' : lead.tier === 'warm' ? '🟡 WARM' : '❄️ COOL';
        const statusLabel = {
            not_called: 'Not Called',
            called: 'Called',
            voicemail: 'Voicemail',
            connected: 'Connected',
            interested: 'Interested',
            not_interested: 'Not Interested',
            scheduled: 'Scheduled'
        }[lead.status] || lead.status;

        const statusClass = {
            not_called: '',
            called: 'status-called',
            voicemail: 'status-voicemail',
            connected: 'status-connected',
            interested: 'status-interested',
            not_interested: 'status-not-interested',
            scheduled: 'status-scheduled'
        }[lead.status] || '';

        const stars = lead.stars ? `⭐ ${lead.stars} (${lead.reviews})` : '';
        const addr = lead.address ? `<div class="lead-address">${lead.address}</div>` : '';

        return `
        <div class="lead-card ${tierClass}" data-lead-id="${lead.id}">
            <div class="lead-card-top">
                <div class="lead-score-badge ${tierClass}">[${lead.score}] ${tierBadge}</div>
                <div class="lead-status ${statusClass}">${statusLabel}</div>
            </div>
            <div class="lead-name">${lead.name}</div>
            <div class="lead-meta">
                <span class="lead-type">${lead.type}</span>
                <span class="lead-city">📍 ${lead.city}</span>
                ${stars ? `<span class="lead-stars">${stars}</span>` : ''}
            </div>
            ${addr}
            <div class="lead-phone">
                <a href="tel:${lead.phone.replace(/-/g, '')}" class="phone-link">📞 ${lead.phone}</a>
            </div>
            <div class="lead-actions">
                <div class="lead-sent-badges">
                    <button class="cc-toggle-sms sent-badge ${lead.smsSent ? 'sent' : ''}" title="Toggle SMS sent">
                        ${lead.smsSent ? '✅ SMS' : '📱 SMS'}
                    </button>
                    <button class="cc-toggle-email sent-badge ${lead.emailSent ? 'sent' : ''}" title="Toggle email sent">
                        ${lead.emailSent ? '✅ Email' : '📧 Email'}
                    </button>
                </div>
                <div class="lead-status-btns">
                    <button class="cc-status-btn" data-status="voicemail" title="Left voicemail">VM</button>
                    <button class="cc-status-btn" data-status="connected" title="Connected">CON</button>
                    <button class="cc-status-btn" data-status="interested" title="Interested">INT</button>
                    <button class="cc-status-btn" data-status="not_interested" title="Not interested">✗</button>
                </div>
            </div>
        </div>`;
    },

    updateLeadStatus(id, newStatus) {
        const lead = CommandCenterData.coldCallCampaign.leads.find(l => l.id === id);
        if (lead) {
            lead.status = newStatus;
            if (newStatus !== 'not_called') lead.called = true;
            this.renderColdCalls();
            this.addActivity({
                id: `act-${Date.now()}`,
                type: 'agent',
                text: `<strong>Cold Call</strong> ${lead.name} marked as <em>${newStatus}</em>`,
                time: 'Just now'
            });
        }
    },

    toggleLeadField(id, field) {
        const lead = CommandCenterData.coldCallCampaign.leads.find(l => l.id === id);
        if (lead) {
            lead[field] = !lead[field];
            this.renderColdCalls();
        }
    },

    setupColdCallFilters() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-cc-filter]');
            if (!btn) return;
            document.querySelectorAll('[data-cc-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.currentCCFilter = btn.dataset.ccFilter;
            this.renderColdCalls();
        });
    }
};

// Global Functions for onclick handlers
function refreshData(event) {
    Dashboard.renderAgents();
    Dashboard.renderTasks();
    Dashboard.renderMail();
    Dashboard.renderGoals();
    Dashboard.renderIntegrations();
    Dashboard.renderActivityFeed();
    Dashboard.renderColdCalls();
    
    // Add refresh activity
    Dashboard.addActivity({
        id: `act-${Date.now()}`,
        type: 'task_complete',
        text: '<strong>Bryan</strong> manually refreshed dashboard data',
        time: 'Just now'
    });
    
    // Visual feedback
    if (event && event.target) {
        const btn = event.target.closest('.action-btn');
        if (btn) {
            btn.style.transform = 'rotate(360deg)';
            setTimeout(() => btn.style.transform = '', 500);
        }
    }
    
    console.log('🔄 Data refreshed');
}

function openBriefing() {
    // Navigate to briefing or show modal
    const briefingUrl = '../briefs/bryan-calendar-quick-questions.json';
    
    // For demo, we'll show an alert - in production this would open a modal or navigate
    alert('Opening Daily Briefing...\n\nThis would display the quick questions from:\n' + briefingUrl);
    
    console.log('📋 Opening briefing:', briefingUrl);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}
