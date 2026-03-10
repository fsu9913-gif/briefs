/**
 * briefing.js — Renders the Daily Executive Brief from JSON data.
 *
 * Loads briefs/daily-brief.json and agents/hierarchy.json, then builds
 * a clean, PDB-style dashboard in the browser. No frameworks — vanilla JS
 * so the page can be opened as a static file or served from any host.
 */

/* ------------------------------------------------------------------ */
/*  Data Loading                                                       */
/* ------------------------------------------------------------------ */

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

async function loadBriefingData() {
  const [brief, hierarchy] = await Promise.all([
    loadJSON('briefs/daily-brief.json'),
    loadJSON('agents/hierarchy.json'),
  ]);
  return { brief, hierarchy };
}

/* ------------------------------------------------------------------ */
/*  Utility helpers                                                    */
/* ------------------------------------------------------------------ */

function formatTime(isoOrTime) {
  if (!isoOrTime) return '';
  if (isoOrTime.includes('T')) {
    return new Date(isoOrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  // Already "HH:MM"
  const [h, m] = isoOrTime.split(':');
  const d = new Date();
  d.setHours(+h, +m);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

function priorityClass(level) {
  const map = { critical: 'priority-critical', high: 'priority-high', medium: 'priority-medium', low: 'priority-low' };
  return map[level] || '';
}

function statusBadge(status) {
  const colors = {
    active: '#22c55e', 'in-progress': '#3b82f6', pending: '#f59e0b',
    idle: '#6b7280', blocked: '#ef4444', offline: '#374151',
    confirmed: '#22c55e', suggested: '#3b82f6', open: '#6b7280',
    'on-track': '#22c55e', 'at-risk': '#f59e0b', 'needs-attention': '#ef4444',
    healthy: '#22c55e', new: '#3b82f6',
  };
  const color = colors[status] || '#6b7280';
  return `<span class="badge" style="--badge-color:${color}">${status}</span>`;
}

function healthDot(health) {
  const colors = { green: '#22c55e', yellow: '#f59e0b', red: '#ef4444', blue: '#3b82f6' };
  return `<span class="health-dot" style="background:${colors[health] || '#6b7280'}"></span>`;
}

function progressBar(pct) {
  const color = pct >= 75 ? '#22c55e' : pct >= 40 ? '#3b82f6' : '#f59e0b';
  return `<div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${color}"></div><span class="progress-label">${pct}%</span></div>`;
}

function iconFor(name) {
  const icons = {
    calendar: '📅', mail: '✉️', project: '📊', people: '👥', alert: '🚨',
  };
  return icons[name] || '📋';
}

/* ------------------------------------------------------------------ */
/*  Section Renderers                                                  */
/* ------------------------------------------------------------------ */

function renderHeader(brief) {
  const b = brief.brief;
  return `
    <header class="brief-header">
      <div class="header-top">
        <div class="classification">${b.classification}</div>
        <div class="brief-date">${formatDate(b.briefDate)}</div>
      </div>
      <h1>${b.title}</h1>
      <div class="header-meta">
        <span>Prepared by <strong>${b.generatedBy}</strong></span>
        <span>Generated ${formatTime(b.generatedAt)}</span>
        <span>Next brief: ${formatDate(b.nextBriefing)} ${formatTime(b.nextBriefing)}</span>
      </div>
    </header>`;
}

function renderExecutiveSummary(es) {
  const priorityItems = es.priorities.map(p => `
    <div class="priority-item ${priorityClass(p.level)}">
      <div class="priority-header">
        <span class="priority-level">${p.level.toUpperCase()}</span>
        <span class="priority-title">${p.title}</span>
        ${p.actionRequired ? '<span class="action-required">ACTION REQUIRED</span>' : ''}
      </div>
      <p class="priority-summary">${p.summary}</p>
      ${p.suggestedAction ? `<p class="suggested-action">→ ${p.suggestedAction}</p>` : ''}
    </div>`).join('');

  return `
    <section class="card executive-summary">
      <h2>Executive Summary</h2>
      <p class="top-line">${es.topLine}</p>
      <div class="priority-list">${priorityItems}</div>
    </section>`;
}

function renderCalendar(section) {
  const rows = section.items.map(item => `
    <tr>
      <td class="cal-time">${formatTime(item.time)}</td>
      <td>
        <div class="cal-title">${item.title}</div>
        <div class="cal-notes">${item.notes || ''}</div>
      </td>
      <td>${statusBadge(item.status)}</td>
    </tr>`).join('');

  return `
    <section class="card" id="section-${section.id}">
      <h2>${iconFor(section.icon)} ${section.title}</h2>
      <table class="schedule-table">
        <thead><tr><th>Time</th><th>Event</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`;
}

function renderCommunications(section) {
  const stats = section.stats;
  const highlights = section.highlights.map(h => `
    <div class="comm-item ${priorityClass(h.priority)}">
      <div class="comm-meta">
        <span class="comm-type">${h.type.toUpperCase()}</span>
        <span class="comm-from">${h.from}</span>
        ${h.daysSinceReceived > 0 ? `<span class="comm-age">${h.daysSinceReceived}d ago</span>` : '<span class="comm-age">Today</span>'}
      </div>
      <div class="comm-subject">${h.subject}</div>
      <div class="comm-snippet">${h.snippet}</div>
    </div>`).join('');

  return `
    <section class="card" id="section-${section.id}">
      <h2>${iconFor(section.icon)} ${section.title}</h2>
      <div class="stats-row">
        <div class="stat"><span class="stat-value">${stats.unreadEmails}</span><span class="stat-label">Unread</span></div>
        <div class="stat"><span class="stat-value">${stats.flaggedForResponse}</span><span class="stat-label">Flagged</span></div>
        <div class="stat"><span class="stat-value">${stats.chatMentions}</span><span class="stat-label">Mentions</span></div>
        <div class="stat accent"><span class="stat-value">${stats.overdueFollowUps}</span><span class="stat-label">Overdue</span></div>
      </div>
      <div class="comm-list">${highlights}</div>
    </section>`;
}

function renderProjects(section) {
  const cards = section.projects.map(p => `
    <div class="project-card">
      <div class="project-header">
        <span class="project-name">${p.name}</span>
        ${statusBadge(p.status)}
      </div>
      ${progressBar(p.progress)}
      <div class="project-details">
        <span>Next: <strong>${p.nextMilestone}</strong> (${formatDate(p.milestoneDue)})</span>
        <span>Tasks: ${p.completedTasks}/${p.completedTasks + p.openTasks} done</span>
      </div>
    </div>`).join('');

  return `
    <section class="card" id="section-${section.id}">
      <h2>${iconFor(section.icon)} ${section.title}</h2>
      <div class="project-grid">${cards}</div>
    </section>`;
}

function renderClients(section) {
  const rows = section.clients.map(c => `
    <tr>
      <td>${healthDot(c.health)} ${c.name}</td>
      <td>${statusBadge(c.status)}</td>
      <td>${c.lastContact ? formatDate(c.lastContact) : '—'}</td>
      <td>${c.nextAction}</td>
    </tr>`).join('');

  return `
    <section class="card" id="section-${section.id}">
      <h2>${iconFor(section.icon)} ${section.title}</h2>
      <table class="client-table">
        <thead><tr><th>Client</th><th>Status</th><th>Last Contact</th><th>Next Action</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`;
}

function renderFires(section) {
  if (section.allClear) {
    return `
      <section class="card all-clear" id="section-${section.id}">
        <h2>${iconFor(section.icon)} ${section.title}</h2>
        <div class="all-clear-message">✅ ${section.message}</div>
      </section>`;
  }

  const alerts = section.activeAlerts.map(a => `
    <div class="alert-item priority-critical">
      <strong>${a.title}</strong>
      <p>${a.description}</p>
    </div>`).join('');

  return `
    <section class="card" id="section-${section.id}">
      <h2>${iconFor(section.icon)} ${section.title}</h2>
      ${alerts}
    </section>`;
}

function renderActionItems(items) {
  const rows = items.map(a => `
    <tr class="${priorityClass(a.priority)}">
      <td><span class="priority-level">${a.priority.toUpperCase()}</span></td>
      <td>${a.title}</td>
      <td>${a.dueBy ? formatTime(a.dueBy) : '—'}</td>
      <td>${statusBadge(a.status)}</td>
    </tr>`).join('');

  return `
    <section class="card" id="action-items">
      <h2>📌 Action Items</h2>
      <table class="action-table">
        <thead><tr><th>Priority</th><th>Item</th><th>Due</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`;
}

function renderAgentStatusBoard(board, hierarchy) {
  const tierGroups = {};
  for (const a of board.agents) {
    const tier = a.tier;
    if (!tierGroups[tier]) tierGroups[tier] = [];
    tierGroups[tier].push(a);
  }

  const tierNames = hierarchy?.hierarchy?.tiers || {};

  let html = '<section class="card" id="agent-board"><h2>🤖 Agent Status Board</h2>';
  for (const tier of Object.keys(tierGroups).sort()) {
    const tierInfo = tierNames[tier] || {};
    html += `<div class="tier-group">
      <h3 class="tier-header">Tier ${tier} — ${tierInfo.name || ''}</h3>
      <div class="agent-grid">`;
    for (const a of tierGroups[tier]) {
      const timeSince = a.lastReport ? formatTime(a.lastReport) : '—';
      html += `
        <div class="agent-card">
          <div class="agent-name">${a.name}</div>
          <div class="agent-meta">${statusBadge(a.status)} <span class="agent-last-report">Last: ${timeSince}</span></div>
        </div>`;
    }
    html += '</div></div>';
  }
  html += '</section>';
  return html;
}

/* ------------------------------------------------------------------ */
/*  Section Router                                                     */
/* ------------------------------------------------------------------ */

function renderSection(section) {
  switch (section.id) {
    case 'calendar': return renderCalendar(section);
    case 'communications': return renderCommunications(section);
    case 'projects': return renderProjects(section);
    case 'clients': return renderClients(section);
    case 'fires': return renderFires(section);
    default: return '';
  }
}

/* ------------------------------------------------------------------ */
/*  Main render                                                        */
/* ------------------------------------------------------------------ */

async function renderBriefing() {
  try {
    const { brief, hierarchy } = await loadBriefingData();

    const app = document.getElementById('app');

    let html = renderHeader(brief);
    html += renderExecutiveSummary(brief.executiveSummary);

    for (const section of brief.sections) {
      html += renderSection(section);
    }

    html += renderActionItems(brief.actionItems);
    html += renderAgentStatusBoard(brief.agentStatusBoard, hierarchy);

    app.innerHTML = html;
  } catch (err) {
    document.getElementById('app').innerHTML = `
      <div class="error">
        <h2>Briefing Unavailable</h2>
        <p>${err.message}</p>
        <p>Make sure to serve this page from a local server (e.g. <code>npx serve</code>) so JSON files can be loaded.</p>
      </div>`;
  }
}

document.addEventListener('DOMContentLoaded', renderBriefing);
