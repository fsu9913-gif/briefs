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
    
    // Initialize dashboard
    init() {
        this.updateDateTime();
        this.renderAgents();
        this.renderTasks();
        this.renderMail();
        this.renderGoals();
        this.renderIntegrations();
        this.renderActivityFeed();
        this.setupFilters();
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
    }
};

// Global Functions for onclick handlers
function refreshData() {
    Dashboard.renderAgents();
    Dashboard.renderTasks();
    Dashboard.renderMail();
    Dashboard.renderGoals();
    Dashboard.renderIntegrations();
    Dashboard.renderActivityFeed();
    
    // Add refresh activity
    Dashboard.addActivity({
        id: `act-${Date.now()}`,
        type: 'task_complete',
        text: '<strong>Bryan</strong> manually refreshed dashboard data',
        time: 'Just now'
    });
    
    // Visual feedback
    const btn = event.target.closest('.action-btn');
    btn.style.transform = 'rotate(360deg)';
    setTimeout(() => btn.style.transform = '', 500);
    
    console.log('🔄 Data refreshed');
}

function openBriefing() {
    // Navigate to briefing or show modal
    const briefingUrl = '../briefs/brian-calendar-quick-questions.json';
    
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
