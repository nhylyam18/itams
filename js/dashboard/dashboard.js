const dashboardData = {
  metrics: [
    { label: 'Total Assets', value: '1,248', change: '+8.2%', detail: 'vs last month', accent: 'red' },
    { label: 'Assigned', value: '846', change: '+4.5%', detail: 'active assignments', accent: 'slate' },
    { label: 'Maintenance', value: '94', change: '-2.1%', detail: 'in progress', accent: 'amber' },
    { label: 'Pending Repairs', value: '18', change: '+3', detail: 'needs review', accent: 'green' }
  ],
  status: [
    { label: 'Working', value: 72, color: 'var(--itams-red)' },
    { label: 'In Repair', value: 16, color: '#f39c12' },
    { label: 'Reserved', value: 9, color: '#2f6f8b' },
    { label: 'Disposed', value: 3, color: '#4d4d4d' }
  ],
  alerts: [
    { title: 'Warranty expiration', detail: '7 devices due within 30 days', tag: 'Action' },
    { title: 'Low stock', detail: 'USB-C hubs are below minimum threshold', tag: 'Review' },
    { title: 'Maintenance reminder', detail: '12 laptops require inspection before Friday', tag: 'Check' }
  ],
  activity: [
    { title: 'Laptop assigned', user: 'M. Dela Cruz', time: '2 hours ago', badge: 'Assigned' },
    { title: 'Printer repaired', user: 'IT Support', time: 'Today, 9:30 AM', badge: 'Updated' },
    { title: 'Asset tagged', user: 'A. Rivera', time: 'Yesterday', badge: 'Logged' },
    { title: 'Inventory review', user: 'E. Santos', time: '2 days ago', badge: 'Reviewed' }
  ],
  quickActions: [
    'Add asset',
    'Schedule maintenance',
    'Generate report',
    'Review requests'
  ]
};

const metricGrid = document.getElementById('metricsGrid');
const assetBreakdown = document.getElementById('assetBreakdown');
const alertList = document.getElementById('alertList');
const activityList = document.getElementById('activityList');
const quickActions = document.getElementById('quickActions');

function renderMetrics() {
  if (!metricGrid) return;

  metricGrid.innerHTML = dashboardData.metrics.map((metric) => `
    <article class="metric-card ${metric.accent}">
      <div class="metric-header">
        <p>${metric.label}</p>
        <span class="metric-badge">${metric.change}</span>
      </div>
      <h3>${metric.value}</h3>
      <small>${metric.detail}</small>
    </article>
  `).join('');
}

function renderStatus() {
  if (!assetBreakdown) return;

  assetBreakdown.innerHTML = dashboardData.status.map((item) => `
    <div class="status-row">
      <div class="status-meta">
        <span class="status-dot" style="background:${item.color};"></span>
        <span>${item.label}</span>
      </div>
      <div class="status-track">
        <span style="width:${item.value}%; background:${item.color};"></span>
      </div>
      <strong>${item.value}%</strong>
    </div>
  `).join('');
}

function renderAlerts() {
  if (!alertList) return;

  alertList.innerHTML = dashboardData.alerts.map((item) => `
    <li>
      <div>
        <strong>${item.title}</strong>
        <small>${item.detail}</small>
      </div>
      <span class="tag">${item.tag}</span>
    </li>
  `).join('');
}

function renderActivity() {
  if (!activityList) return;

  activityList.innerHTML = dashboardData.activity.map((item) => `
    <li>
      <div>
        <strong>${item.title}</strong>
        <small>${item.user} • ${item.time}</small>
      </div>
      <span class="activity-pill">${item.badge}</span>
    </li>
  `).join('');
}

function renderQuickActions() {
  if (!quickActions) return;

  quickActions.innerHTML = dashboardData.quickActions.map((action) => `
    <button type="button" class="action-chip">${action}</button>
  `).join('');
}

renderMetrics();
renderStatus();
renderAlerts();
renderActivity();
renderQuickActions();
