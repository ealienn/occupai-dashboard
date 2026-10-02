// OccupAI Dynamic Frontend Controller

let occupancyChart = null;
let currentCategoryIndex = 0; // 0: LIGHTING, 1: BLINDS, 2: AIR CONDITIONING
const categories = ['LIGHTING', 'BLINDS', 'AIR CONDITIONING'];

// Initialize Chart.js Bar Chart matching image design (black vertical bars & right y-axis scale)
function initChart() {
  const ctx = document.getElementById('occupancyChart');
  if (!ctx) return;

  occupancyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'],
      datasets: [{
        label: 'Occupancy Count',
        data: [15, 32, 29, 50, 22, 30, 42, 12, 40, 20, 30, 20, 41],
        backgroundColor: '#1E1E1E',
        borderColor: '#1E1E1E',
        borderWidth: 1,
        borderRadius: 2,
        barPercentage: 0.42,
        categoryPercentage: 0.85
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 6, bottom: 2, left: 4, right: 4 }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(125, 20, 29, 0.95)',
          titleColor: '#FFFFFF',
          bodyColor: '#FFFFFF',
          borderColor: '#88161B',
          borderWidth: 1,
          padding: 6,
          callbacks: {
            label: function (context) {
              return `Occupants: ${context.raw}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: '#1A1A1A',
            font: { size: 9, weight: '700' }
          }
        },
        y: {
          position: 'right',
          beginAtZero: true,
          max: 50,
          ticks: {
            stepSize: 15,
            color: '#88161B',
            font: { size: 9, weight: '800' }
          },
          grid: {
            color: 'rgba(125, 20, 29, 0.12)',
            drawBorder: false
          }
        }
      }
    }
  });
}

// SPA View Switching Handler for Sidebar and Mobile Nav Items
function switchSPATab(tab) {
  const appEl = document.getElementById('app');
  if (appEl) {
    appEl.classList.toggle('landing-mode', tab === 'landing');
  }

  const views = {
    landing: document.getElementById('view-landing'),
    dashboard: document.getElementById('view-dashboard'),
    controls: document.getElementById('view-controls'),
    hardware: document.getElementById('view-hardware'),
    history: document.getElementById('view-history'),
    settings: document.getElementById('view-settings')
  };

  const navBtns = {
    landing: document.getElementById('nav-btn-landing'),
    dashboard: document.getElementById('nav-btn-dashboard'),
    controls: document.getElementById('nav-btn-controls'),
    hardware: document.getElementById('nav-btn-hardware'),
    history: document.getElementById('nav-btn-history'),
    settings: document.getElementById('nav-btn-settings')
  };

  const mobNavPills = {
    dashboard: { pill: document.getElementById('mob-nav-pill-dashboard'), icon: 'fas fa-border-all' },
    controls: { pill: document.getElementById('mob-nav-pill-controls'), icon: 'fas fa-sliders' },
    hardware: { pill: document.getElementById('mob-nav-pill-hardware'), icon: 'fas fa-certificate' },
    history: { pill: document.getElementById('mob-nav-pill-history'), icon: 'fas fa-clock-rotate-left' },
    settings: { pill: document.getElementById('mob-nav-pill-settings'), icon: 'fas fa-gear' }
  };

  Object.keys(views).forEach(key => {
    if (views[key]) {
      views[key].classList.toggle('hidden', key !== tab);
    }
    // Update Desktop Nav
    if (navBtns[key]) {
      if (key === tab) {
        navBtns[key].classList.add('active');
      } else {
        navBtns[key].classList.remove('active');
      }
    }
    // Update Mobile Nav
    if (mobNavPills[key] && mobNavPills[key].pill) {
      if (key === tab) {
        mobNavPills[key].pill.className = 'nav-active-pill';
        mobNavPills[key].pill.querySelector('i').className = `${mobNavPills[key].icon} text-[#7D141D] text-xl`;
      } else {
        mobNavPills[key].pill.className = '';
        mobNavPills[key].pill.querySelector('i').className = `${mobNavPills[key].icon} text-white text-xl`;
      }
    }
  });
}

// Sub-Tab Switching Handler for Logs / History View
function switchLogSubTab(subtab) {
  const panels = {
    occupancy: document.getElementById('log-panel-occupancy'),
    actuation: document.getElementById('log-panel-actuation'),
    override: document.getElementById('log-panel-override')
  };

  const btns = {
    occupancy: document.getElementById('log-tab-btn-occupancy'),
    actuation: document.getElementById('log-tab-btn-actuation'),
    override: document.getElementById('log-tab-btn-override')
  };

  Object.keys(panels).forEach(key => {
    if (panels[key]) panels[key].classList.toggle('hidden', key !== subtab);
    if (btns[key]) btns[key].classList.toggle('active', key === subtab);
  });
}

// Sub-Tab Switching Handler for Settings View
function switchSettingsSubTab(subtab) {
  const panels = {
    general: document.getElementById('set-panel-general'),
    users: document.getElementById('set-panel-users'),
    system: document.getElementById('set-panel-system')
  };

  const btns = {
    general: document.getElementById('set-tab-btn-general'),
    users: document.getElementById('set-tab-btn-users'),
    system: document.getElementById('set-tab-btn-system')
  };

  const titles = {
    general: 'GENERAL SETTINGS',
    users: 'USER ACCOUNTS',
    system: 'SYSTEM INFO'
  };

  Object.keys(panels).forEach(key => {
    if (panels[key]) panels[key].classList.toggle('hidden', key !== subtab);
    if (btns[key]) btns[key].classList.toggle('active', key === subtab);
  });

  const sectionTitleEl = document.getElementById('settings-section-title');
  if (sectionTitleEl && titles[subtab]) {
    sectionTitleEl.textContent = titles[subtab];
  }
}

// Carousel Category Switching Handler
function updateCategoryDisplay() {
  const currentCat = categories[currentCategoryIndex];
  const labelEl = document.getElementById('current-category-label');
  if (labelEl) labelEl.textContent = currentCat;

  const catLighting = document.getElementById('cat-lighting');
  const catBlinds = document.getElementById('cat-blinds');
  const catAC = document.getElementById('cat-air-conditioning');

  if (catLighting) catLighting.classList.toggle('hidden', currentCat !== 'LIGHTING');
  if (catBlinds) catBlinds.classList.toggle('hidden', currentCat !== 'BLINDS');
  if (catAC) catAC.classList.toggle('hidden', currentCat !== 'AIR CONDITIONING');
}

// Trend Range Dropdown Handler
let currentTrendRange = 'Today';

function toggleTrendDropdown(event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById('trend-dropdown-menu');
  const arrow = document.getElementById('trend-dropdown-arrow');
  if (!menu) return;

  const isHidden = menu.classList.contains('hidden');
  menu.classList.toggle('hidden', !isHidden);
  if (arrow) arrow.textContent = isHidden ? '▲' : '▼';
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const wrapper = document.getElementById('trend-dropdown-wrapper');
  const menu = document.getElementById('trend-dropdown-menu');
  const arrow = document.getElementById('trend-dropdown-arrow');
  if (wrapper && !wrapper.contains(e.target) && menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
    if (arrow) arrow.textContent = '▼';
  }
});

async function selectTrendRange(range) {
  currentTrendRange = range;
  const btn = document.getElementById('trend-dropdown-btn');
  if (btn) {
    btn.innerHTML = `${range.toUpperCase()} <span id="trend-dropdown-arrow">▼</span>`;
  }
  const titleEl = document.getElementById('trend-card-title');
  if (titleEl) {
    titleEl.textContent = `OCCUPANCY TREND - ${range.toUpperCase()}`;
  }

  const menu = document.getElementById('trend-dropdown-menu');
  if (menu) menu.classList.add('hidden');

  fetchTrendData(range);
}

async function selectTrendCustomDate(dateVal) {
  if (!dateVal) return;
  const parts = dateVal.split('-');
  const formatted = parts.length === 3 ? `${parts[1]}/${parts[2]}/${parts[0]}` : dateVal;

  currentTrendRange = formatted;
  const btn = document.getElementById('trend-dropdown-btn');
  if (btn) {
    btn.innerHTML = `${formatted} <span id="trend-dropdown-arrow">▼</span>`;
  }
  const titleEl = document.getElementById('trend-card-title');
  if (titleEl) {
    titleEl.textContent = `OCCUPANCY TREND - ${formatted}`;
  }

  const menu = document.getElementById('trend-dropdown-menu');
  if (menu) menu.classList.add('hidden');

  fetchTrendData(formatted);
}

async function fetchTrendData(range) {
  try {
    const res = await fetch(`/api/hourly-trend?range=${encodeURIComponent(range)}`);
    if (res.ok) {
      const data = await res.json();
      if (occupancyChart && data.labels && data.data) {
        occupancyChart.data.labels = data.labels;
        occupancyChart.data.datasets[0].data = data.data;
        occupancyChart.update();
      }
    }
  } catch (err) {
    console.error('Failed to fetch trend data for range:', range, err);
  }
}

// Log Filter Dropdown Handlers
function toggleLogFilter(filterType) {
  const menu = document.getElementById(`log-${filterType}-menu`);
  const arrow = document.getElementById(`log-${filterType}-arrow`);
  if (!menu) return;

  const isHidden = menu.classList.contains('hidden');

  // Close all log filter dropdowns first
  ['date', 'from', 'to', 'event'].forEach(type => {
    const m = document.getElementById(`log-${type}-menu`);
    const a = document.getElementById(`log-${type}-arrow`);
    if (m) m.classList.add('hidden');
    if (a) a.textContent = '▼';
  });

  if (isHidden) {
    menu.classList.remove('hidden');
    if (arrow) arrow.textContent = '▲';
  }
}

function selectLogFilter(filterType, val) {
  const btn = document.getElementById(`log-${filterType}-btn`);
  const menu = document.getElementById(`log-${filterType}-menu`);

  if (btn) {
    const displayVal = val.length > 10 ? val.substring(0, 10) + '...' : val;
    let icon = '';
    let label = '';
    if (filterType === 'date') {
      icon = '<i class="far fa-calendar-alt text-[#7D141D]/70 text-xs"></i>';
      label = 'Date:';
    } else if (filterType === 'from') {
      icon = '<i class="far fa-clock text-[#7D141D]/70 text-xs"></i>';
      label = 'From:';
    } else if (filterType === 'to') {
      icon = '<i class="far fa-clock text-[#7D141D]/70 text-xs"></i>';
      label = 'To:';
    } else if (filterType === 'event') {
      icon = '<i class="fas fa-filter text-[#7D141D]/70 text-xs"></i>';
      label = 'Event:';
    }

    btn.innerHTML = `<span class="truncate flex items-center gap-1 text-[11px]">${icon}<span class="font-bold text-[#7D141D]/70 mr-0.5">${label}</span>${displayVal}</span> <span id="log-${filterType}-arrow" class="text-[10px] text-[#7D141D]">▼</span>`;
  }
  if (menu) menu.classList.add('hidden');

  filterLogRows(document.getElementById('log-search-input')?.value || '');
}

function filterLogRows(query) {
  const q = (query || '').toLowerCase();
  const rows = document.querySelectorAll('#occupancy-logs-tbody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(q) ? '' : 'none';
  });
}

function prevCategory() {
  currentCategoryIndex = (currentCategoryIndex - 1 + categories.length) % categories.length;
  updateCategoryDisplay();
}

function nextCategory() {
  currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
  updateCategoryDisplay();
}

// Fetch Telemetry Data from Flask Backend
async function fetchDashboardData() {
  try {
    const response = await fetch('/api/dashboard-data');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    updateUI(data);
  } catch (error) {
    console.error('Failed to fetch OccupAI telemetry:', error);
  }
}

// Update DOM Elements
function updateUI(data) {
  // 0. Landing Page Metrics Updates
  const landingCount = document.getElementById('landing-occupancy-count');
  const landingTier = document.getElementById('landing-tier-badge');
  const landingTemp = document.getElementById('landing-val-temp');
  const landingTempStatus = document.getElementById('landing-val-temp-status');
  const landingLux = document.getElementById('landing-val-lux');
  const landingLuxStatus = document.getElementById('landing-val-lux-status');
  const landingAc = document.getElementById('landing-ac-pill');
  const landingLights = document.getElementById('landing-lights-pill');
  const landingBlinds = document.getElementById('landing-blinds-pill');
  const landingSys = document.getElementById('landing-sys-pill');

  if (landingCount) landingCount.textContent = data.occupancy_count;
  if (landingTier) landingTier.textContent = data.tier;
  if (landingTemp) landingTemp.textContent = `${data.temperature.toFixed(1)}°C`;
  if (landingTempStatus) landingTempStatus.textContent = data.temperature > 24 ? 'Cooling active' : 'Ventilation normal';
  if (landingLux) landingLux.textContent = `${data.outdoor_lux} lx`;
  if (landingLuxStatus) landingLuxStatus.textContent = data.outdoor_lux > 800 ? 'Bright — blinds partially closed' : 'Dim — blinds open';
  
  if (landingAc && data.air_conditioning) {
    const acOn = data.air_conditioning.some(a => a.state);
    landingAc.textContent = acOn ? 'ON' : 'OFF';
  }
  if (landingLights && data.lighting) {
    const activeLights = data.lighting.filter(l => l.state);
    const avgBright = activeLights.length > 0 ? Math.round(activeLights.reduce((sum, l) => sum + l.brightness, 0) / activeLights.length) : 0;
    landingLights.textContent = `${avgBright}%`;
  }
  if (landingBlinds && data.blinds && data.blinds.length > 0) {
    landingBlinds.textContent = data.blinds[0].position;
  }
  if (landingSys) landingSys.textContent = 'NORMAL';

  // 1. Dashboard Main Hero Card
  const countEl = document.getElementById('occupancy-count');
  const roomEl = document.getElementById('occupancy-room');
  const tierEl = document.getElementById('tier-badge');

  if (countEl) countEl.textContent = data.occupancy_count;
  if (roomEl) roomEl.textContent = data.room;
  if (tierEl) tierEl.textContent = data.tier;

  // 2. Dual Environmental Metrics
  const tempEl = document.getElementById('val-temperature');
  const indoorLuxEl = document.getElementById('val-indoor-lux');
  const outdoorLuxEl = document.getElementById('val-outdoor-lux');

  if (tempEl) tempEl.textContent = `${data.temperature.toFixed(1)}°C`;
  if (indoorLuxEl) indoorLuxEl.textContent = `${data.indoor_lux} lx`;
  if (outdoorLuxEl) outdoorLuxEl.textContent = `${data.outdoor_lux} lx`;

  // 3. Occupancy Trend Chart
  if (occupancyChart && data.hourly_trend) {
    occupancyChart.data.labels = data.hourly_trend.labels;
    occupancyChart.data.datasets[0].data = data.hourly_trend.data;
    occupancyChart.update('none');
  }

  // 4. Hardware Summary Box
  const hwSummaryTitle = document.getElementById('hw-summary-title');
  const hwListEl = document.getElementById('hw-nodes-list');

  if (hwSummaryTitle && data.hardware_summary) {
    hwSummaryTitle.innerHTML = `<span class="text-2xl lg:text-3xl font-black text-white">${data.hardware_summary.online_count} / ${data.hardware_summary.total_count}</span> <span class="text-sm lg:text-base font-extrabold text-amber-100/90 ml-0.5">Online</span>`;
  }

  if (hwListEl && data.hardware_summary && data.hardware_summary.nodes) {
    hwListEl.innerHTML = data.hardware_summary.nodes.map(node => `
      <div class="flex items-center justify-between text-base font-extrabold text-white/95 py-1 border-b border-white/10 last:border-b-0">
        <span class="truncate pr-2">${node.name}</span>
        <span class="flex items-center gap-1.5 font-black text-sm sm:text-base shrink-0 ${node.status === 'Online' ? 'text-emerald-400' : 'text-red-400'}">
          <span class="inline-block w-2.5 h-2.5 rounded-full ${node.status === 'Online' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]'}"></span>
          ${node.status}
        </span>
      </div>
    `).join('');
  }

  // Populate Full Hardware Nodes Grid for View 3
  const hwFullGrid = document.getElementById('hw-full-nodes-grid');
  if (hwFullGrid && data.hardware_summary && data.hardware_summary.nodes) {
    hwFullGrid.innerHTML = data.hardware_summary.nodes.map(node => `
      <div class="p-3.5 rounded-xl bg-white/10 border border-white/20 flex items-center justify-between">
        <div>
          <div class="font-extrabold text-white text-base sm:text-lg">${node.name}</div>
          <div class="text-sm text-white/80 font-semibold">${node.type} (${node.id})</div>
        </div>
        <span class="px-3 py-1 rounded-full text-xs sm:text-sm font-black ${node.status === 'Online' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'}">
          ${node.status}
        </span>
      </div>
    `).join('');
  }

  // 5. Utility Status Main Dashboard Table
  const utilityTableBody = document.getElementById('utility-status-table-body');
  if (utilityTableBody) {
    let rowsHTML = '';

    // Lighting Rows
    if (data.lighting) {
      data.lighting.forEach(item => {
        rowsHTML += `
          <tr class="border-b border-gray-200/60">
            <td class="py-3 px-3 font-extrabold text-base text-[#7D141D]">${item.name}</td>
            <td class="py-3 px-3 font-black text-base ${item.state ? 'text-emerald-600' : 'text-gray-400'}">${item.state ? 'ON' : 'OFF'}</td>
            <td class="py-3 px-3 font-bold text-base text-gray-700">Dim ${item.brightness}%</td>
            <td class="py-3 px-3 text-right">
              <label class="toggle-switch-ui">
                <input type="checkbox" ${item.state ? 'checked' : ''} onchange="controlDevice('lighting', '${item.id}', this.checked, null)">
                <span class="toggle-slider"></span>
              </label>
            </td>
          </tr>
        `;
      });
    }

    // Blinds Rows
    if (data.blinds) {
      data.blinds.forEach(item => {
        rowsHTML += `
          <tr class="border-b border-gray-200/60">
            <td class="py-3 px-3 font-extrabold text-base text-[#7D141D]">${item.name}</td>
            <td class="py-3 px-3 font-black text-base ${item.position === 'OPEN' ? 'text-emerald-600' : (item.position === 'PARTIAL' ? 'text-amber-600' : 'text-gray-400')}">${item.position}</td>
            <td class="py-3 px-3 font-bold text-base text-gray-700">--</td>
            <td class="py-3 px-3 text-right">
              <label class="toggle-switch-ui">
                <input type="checkbox" ${item.position !== 'CLOSED' ? 'checked' : ''} onchange="controlDevice('blinds', '${item.id}', null, this.checked ? 'OPEN' : 'CLOSED')">
                <span class="toggle-slider"></span>
              </label>
            </td>
          </tr>
        `;
      });
    }

    // AC Rows
    if (data.air_conditioning) {
      data.air_conditioning.forEach(item => {
        rowsHTML += `
          <tr class="border-b border-gray-200/60">
            <td class="py-3 px-3 font-extrabold text-base text-[#7D141D]">${item.name}</td>
            <td class="py-3 px-3 font-black text-base ${item.state ? 'text-emerald-600' : 'text-gray-400'}">${item.state ? 'ON' : 'OFF'}</td>
            <td class="py-3 px-3 font-bold text-base text-gray-700">${item.temperature}°C</td>
            <td class="py-3 px-3 text-right">
              <label class="toggle-switch-ui">
                <input type="checkbox" ${item.state ? 'checked' : ''} onchange="controlDevice('air_conditioning', '${item.id}', this.checked, null)">
                <span class="toggle-slider"></span>
              </label>
            </td>
          </tr>
        `;
      });
    }

    utilityTableBody.innerHTML = rowsHTML;
  }

  // 6. Control Mode Header
  const modeTitle = document.getElementById('control-mode-title');
  const revertBtn = document.getElementById('revert-mode-btn');
  const lastAdjText = document.getElementById('last-auto-adj-text');

  if (modeTitle) modeTitle.textContent = data.control_mode;
  if (revertBtn) {
    revertBtn.textContent = data.control_mode === 'Automated Control' ? 'Revert to Manual' : 'Switch to Auto';
  }
  if (lastAdjText && data.last_auto_adjustment) {
    lastAdjText.textContent = `Last auto-adjustment: ${data.last_auto_adjustment}.`;
  }

  // 7. Utility Control 3 Columns Rendering
  const utilLightingContainer = document.getElementById('utility-lighting-container');
  if (utilLightingContainer && data.lighting) {
    utilLightingContainer.innerHTML = data.lighting.map(item => {
      const activeSegments = Math.round((item.brightness || 0) / 10);
      const segmentsHTML = Array.from({ length: 10 }, (_, i) => {
        let colorClass = '';
        if (i < activeSegments) {
          if (i < 3) colorClass = 'active-red';
          else if (i < 6) colorClass = 'active-orange';
          else if (i < 8) colorClass = 'active-amber';
          else colorClass = 'active-green';
        }
        return `<span class="bar-segment ${colorClass}"></span>`;
      }).join('');

      return `
        <div class="device-item-card space-y-2">
          <div class="flex items-center justify-between">
            <span class="device-title">${item.name}</span>
            <label class="toggle-switch-ui">
              <input type="checkbox" ${item.state ? 'checked' : ''} onchange="controlDevice('lighting', '${item.id}', this.checked, null)">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="flex items-center justify-between gap-2 my-1">
            <div class="flex items-center gap-2">
              <div class="segmented-bar">${segmentsHTML}</div>
              <span class="text-xs sm:text-sm font-extrabold text-gray-800">Brightness: ${item.brightness}%</span>
            </div>
            <span class="${item.state ? 'status-badge-green' : 'status-badge-off'}">${item.state ? 'ON' : 'OFF'}</span>
          </div>
          <div class="text-sm sm:text-base text-gray-600 font-bold">Last changed: ${item.last_changed}</div>
        </div>
      `;
    }).join('');
  }

  const utilBlindsContainer = document.getElementById('utility-blinds-container');
  if (utilBlindsContainer && data.blinds) {
    utilBlindsContainer.innerHTML = data.blinds.map(item => {
      const pos = (item.position || '').toUpperCase();
      const isPartial = pos === 'PARTIAL';
      const isOpen = pos === 'OPEN';
      const isClosed = pos === 'CLOSED';

      return `
        <div class="device-item-card space-y-2">
          <div class="flex items-center justify-between">
            <span class="device-title">${item.name}</span>
            <span class="${isOpen ? 'status-badge-green' : (isPartial ? 'status-badge-orange' : 'status-badge-off')}">${pos}</span>
          </div>
          <div class="flex items-center gap-2 my-1">
            <button onclick="controlDevice('blinds', '${item.id}', null, 'OPEN')" class="blind-btn ${isOpen ? 'active-open' : ''}">Open</button>
            <button onclick="controlDevice('blinds', '${item.id}', null, 'PARTIAL')" class="blind-btn ${isPartial ? 'active-partial' : ''}">Partial</button>
            <button onclick="controlDevice('blinds', '${item.id}', null, 'CLOSED')" class="blind-btn ${isClosed ? 'active-closed' : ''}">Closed</button>
          </div>
          <div class="text-sm sm:text-base text-gray-600 font-bold">Last changed: ${item.last_changed}</div>
        </div>
      `;
    }).join('');
  }

  const utilACContainer = document.getElementById('utility-ac-container');
  if (utilACContainer && data.air_conditioning) {
    utilACContainer.innerHTML = data.air_conditioning.map(item => `
      <div class="device-item-card space-y-2">
        <div class="flex items-center justify-between">
          <div>
            <div class="device-title">${item.name}</div>
            <div class="text-sm sm:text-base font-black text-gray-900 mt-1">Temperature: ${item.temperature}°C</div>
          </div>
          <div class="flex flex-col items-end gap-1.5">
            <label class="toggle-switch-ui">
              <input type="checkbox" ${item.state ? 'checked' : ''} onchange="controlDevice('air_conditioning', '${item.id}', this.checked, null)">
              <span class="toggle-slider"></span>
            </label>
            <span class="${item.state ? 'status-badge-green' : 'status-badge-off'}">${item.state ? 'ON' : 'OFF'}</span>
          </div>
        </div>
        <div class="text-sm sm:text-base text-gray-600 font-bold">Last changed: ${item.last_changed}</div>
      </div>
    `).join('');
  }

  // 10. Recent Override Activity Table
  const actRowsEl = document.getElementById('override-activity-rows');
  if (actRowsEl && data.override_activity) {
    actRowsEl.innerHTML = data.override_activity.map(row => `
      <tr class="border-b border-gray-200 hover:bg-gray-50/80 transition-colors">
        <td class="py-3 px-3 font-mono text-xs sm:text-sm font-bold text-gray-600">${row.time}</td>
        <td class="py-3 px-3 font-extrabold text-sm sm:text-base text-[#7D141D]">${row.device}</td>
        <td class="py-3 px-3 font-bold text-xs sm:text-sm text-gray-800">${row.action}</td>
        <td class="py-3 px-3 ${row.status === 'Success' ? 'text-emerald-600 font-black' : 'text-red-600 font-black'}">${row.status}</td>
        <td class="py-3 px-3 text-right text-gray-700 font-bold">${row.by}</td>
      </tr>
    `).join('');
  }

  // 11. Occupancy-Linked Automation Reference Table
  const rulesRowsEl = document.getElementById('automation-rules-rows');
  if (rulesRowsEl && data.automation_rules) {
    rulesRowsEl.innerHTML = data.automation_rules.map(rule => {
      const isCurrentTier = data.tier.toLowerCase().includes(rule.state.toLowerCase());
      return `
        <tr class="border-b border-gray-200 text-xs sm:text-sm ${isCurrentTier ? 'bg-amber-100/60 font-black text-[#7D141D]' : ''}">
          <td class="py-3 px-3 font-extrabold">${rule.state}</td>
          <td class="py-3 px-3 text-center font-bold">${rule.threshold}</td>
          <td class="py-3 px-3 text-center font-bold">${rule.lighting}</td>
          <td class="py-3 px-3 text-right font-bold">${rule.ac}</td>
        </tr>
      `;
    }).join('');
  }

  // Update Tier expectation text
  const tierExpectation = document.getElementById('current-tier-expectation-text');
  if (tierExpectation && data.tier) {
    tierExpectation.textContent = `Current Tier: ${data.tier.replace('TIER: ', '')} - system expects 70% lighting, AC is ON`;
  }

  // 12. Occupancy Logs Table (5 Columns: Timestamp, Event, Count, Tier, Source)
  const occLogTbody = document.getElementById('occupancy-logs-tbody');
  if (occLogTbody && data.occupancy_logs) {
    occLogTbody.innerHTML = data.occupancy_logs.map(log => `
      <tr class="border-b border-gray-200 hover:bg-gray-50/80 transition-colors">
        <td class="py-3.5 px-3 font-mono text-xs sm:text-sm font-bold text-gray-600">${log.time}</td>
        <td class="py-3.5 px-3 font-extrabold text-sm sm:text-base text-[#7D141D]">${log.event}</td>
        <td class="py-3.5 px-3 text-center font-black text-sm sm:text-base text-gray-900">${log.count}</td>
        <td class="py-3.5 px-3 text-center">
          <span class="px-3 py-1 rounded-full border border-[#7D141D]/40 font-black text-xs sm:text-sm bg-white text-[#7D141D] shadow-xs">${log.tier}</span>
        </td>
        <td class="py-3.5 px-3 text-right font-bold text-xs sm:text-sm text-gray-700">${log.source || 'System'}</td>
      </tr>
    `).join('');
  }

  // 13. Actuation Events Table
  const actLogTbody = document.getElementById('actuation-events-tbody');
  if (actLogTbody && data.actuation_events) {
    actLogTbody.innerHTML = data.actuation_events.map(ev => `
      <tr class="border-b border-gray-200 hover:bg-gray-50/80 transition-colors">
        <td class="py-3.5 px-3 font-mono text-xs sm:text-sm font-bold text-gray-600">${ev.time}</td>
        <td class="py-3.5 px-3 font-extrabold text-sm sm:text-base text-[#7D141D]">${ev.device}</td>
        <td class="py-3.5 px-3 font-bold text-xs sm:text-sm text-gray-800">${ev.action}</td>
        <td class="py-3.5 px-3 text-right">
          <span class="px-3 py-1 rounded-md border text-xs sm:text-sm font-black ${ev.result === 'Success' ? 'border-emerald-600 text-emerald-700 bg-emerald-50' : 'border-red-600 text-red-700 bg-red-50'}">${ev.result}</span>
        </td>
      </tr>
    `).join('');
  }

  // 14. Override Events Table & Stats
  const ovrLogTbody = document.getElementById('override-events-tbody');
  if (ovrLogTbody && data.override_events) {
    ovrLogTbody.innerHTML = data.override_events.map(ev => {
      const isFailed = ev.result === 'Failed';
      return `
        <tr class="border-b border-gray-200 hover:bg-gray-50/80 transition-colors text-sm">
          <td class="py-3.5 px-3 font-mono text-xs sm:text-sm font-bold text-gray-600">${ev.time}</td>
          <td class="py-3.5 px-3 font-extrabold text-sm sm:text-base text-[#7D141D]">${ev.device}</td>
          <td class="py-3.5 px-3 font-bold text-xs sm:text-sm text-gray-800">${ev.action}</td>
          <td class="py-3.5 px-3 text-center font-bold text-xs sm:text-sm text-gray-700">${ev.by}</td>
          <td class="py-3.5 px-3 text-center font-mono text-xs sm:text-sm font-bold text-gray-600">${ev.latency || '—'}</td>
          <td class="py-3.5 px-3 text-right">
            <span class="px-3 py-1 rounded-full border text-xs sm:text-sm font-black ${isFailed ? 'border-red-500 text-red-700 bg-red-50' : 'border-gray-300 text-gray-700 bg-white shadow-2xs'}">${ev.result || 'Success'}</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (data.override_stats) {
    const rateEl = document.getElementById('override-stat-rate');
    const totalEl = document.getElementById('override-stat-total');
    const failedEl = document.getElementById('override-stat-failed');
    const latencyEl = document.getElementById('override-stat-latency');

    if (rateEl) rateEl.textContent = data.override_stats.success_rate;
    if (totalEl) totalEl.textContent = data.override_stats.total_overrides;
    if (failedEl) failedEl.textContent = data.override_stats.failed_commands;
    if (latencyEl) latencyEl.textContent = data.override_stats.avg_latency;
  }

  // 15. Settings Data (Authorized Users Table)
  if (data.settings_data && data.settings_data.authorized_users) {
    const usersTbody = document.getElementById('authorized-users-tbody');
    if (usersTbody) {
      usersTbody.innerHTML = data.settings_data.authorized_users.map(u => {
        const isAdmin = u.role === 'Administrator';
        return `
          <tr class="border-b border-gray-200 hover:bg-gray-50/80 transition-colors text-sm">
            <td class="py-3.5 px-3 font-extrabold text-sm sm:text-base text-[#7D141D]">${u.name}</td>
            <td class="py-3.5 px-3 font-mono text-xs sm:text-sm font-bold text-gray-600">${u.email}</td>
            <td class="py-3.5 px-3 text-center">
              <span class="px-3 py-1 rounded-full border border-gray-300 font-extrabold text-xs bg-white text-gray-700">${u.role}</span>
            </td>
            <td class="py-3.5 px-3 text-center font-black text-xs sm:text-sm ${u.status === 'Active' ? 'text-emerald-600' : 'text-gray-400'}">• ${u.status}</td>
            <td class="py-3.5 px-3 text-center font-mono text-xs sm:text-sm font-bold text-gray-600">${u.last_login || 'Today'}</td>
            <td class="py-3.5 px-3 text-right space-x-1.5">
              <button class="px-3 py-1 rounded-full text-xs font-black ${isAdmin ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#7D141D] text-white hover:bg-[#9B1C28]'}">Edit</button>
              <button class="px-3 py-1 rounded-full bg-[#7D141D] text-white text-xs font-black hover:bg-[#9B1C28]">Remove</button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }
}

// Action Handlers
async function toggleControlMode() {
  try {
    const res = await fetch('/api/toggle-control-mode', { method: 'POST' });
    if (res.ok) fetchDashboardData();
  } catch (err) {
    console.error('Failed to toggle control mode:', err);
  }
}

async function controlDevice(category, deviceId, state, value) {
  try {
    const res = await fetch('/api/device-control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, device_id: deviceId, state, value })
    });
    if (res.ok) fetchDashboardData();
  } catch (err) {
    console.error('Failed to update device:', err);
  }
}

// Global Refresh Action
function manualRefresh() {
  const icon = document.getElementById('refresh-btn');
  if (icon) icon.classList.add('opacity-75');
  fetchDashboardData().finally(() => {
    setTimeout(() => {
      if (icon) icon.classList.remove('opacity-75');
    }, 400);
  });
}

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  switchSPATab('landing');
  initChart();
  fetchDashboardData();
  fetchCurrentUserState();
  setInterval(fetchDashboardData, 2000);

  // Close user dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('user-dropdown-menu');
    const menuBtn = e.target.closest('.user-menu-btn');
    if (dropdown && !dropdown.classList.contains('hidden') && !menuBtn && !e.target.closest('.user-dropdown-menu')) {
      dropdown.classList.add('hidden');
    }
  });
});

/* ==========================================================================
   AUTHENTICATION SYSTEM CONTROLLER
   ========================================================================== */

let currentUserSession = null;

async function fetchCurrentUserState() {
  try {
    const res = await fetch('/api/auth/current-user');
    if (res.ok) {
      const data = await res.json();
      if (data.logged_in && data.user) {
        updateUserUI(data.user);
      } else {
        openAuthModal('login');
      }
      if (data.pending_invite) {
        updateInviteUI(data.pending_invite);
      }
    }
  } catch (err) {
    console.error('Failed to fetch user state:', err);
  }
}

function updateUserUI(user) {
  currentUserSession = user;
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  const initialsEl = document.getElementById('sidebar-user-initials');
  if (initialsEl) initialsEl.textContent = initials;

  const nameEl = document.getElementById('sidebar-user-name');
  if (nameEl) nameEl.textContent = user.name;

  const roleEl = document.getElementById('sidebar-user-role');
  if (roleEl) roleEl.textContent = user.role;
}

function updateInviteUI(invite) {
  const byName = document.getElementById('invite-by-name');
  if (byName) byName.textContent = invite.inviter_name;

  const byRole = document.getElementById('invite-by-role');
  if (byRole) byRole.textContent = invite.inviter_role;

  const assignedRole = document.getElementById('invite-assigned-role');
  if (assignedRole) assignedRole.textContent = invite.assigned_role;

  const setupEmail = document.getElementById('setup-email');
  if (setupEmail) setupEmail.value = invite.email;
}

function toggleUserDropdown(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('user-dropdown-menu');
  if (dropdown) dropdown.classList.toggle('hidden');
}

function openAuthModal(screenName = 'login') {
  const dropdown = document.getElementById('user-dropdown-menu');
  if (dropdown) dropdown.classList.add('hidden');

  switchAuthScreen(screenName);
  const overlay = document.getElementById('auth-modal-overlay');
  if (overlay) overlay.classList.remove('hidden');
}

function closeAuthModal() {
  const overlay = document.getElementById('auth-modal-overlay');
  if (overlay) overlay.classList.add('hidden');
}

function switchAuthScreen(screenName) {
  const screens = {
    'setup': document.getElementById('auth-screen-setup'),
    'login': document.getElementById('auth-screen-login'),
    'forgot-step1': document.getElementById('auth-screen-forgot-step1'),
    'forgot-step2': document.getElementById('auth-screen-forgot-step2')
  };

  Object.values(screens).forEach(screen => {
    if (screen) screen.classList.add('hidden');
  });

  if (screens[screenName]) {
    screens[screenName].classList.remove('hidden');
  }

  // Clear error messages
  ['setup-error-msg', 'login-error-msg', 'verify-error-msg', 'reset-error-msg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}

function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!input || !icon) return;

  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorMsg = document.getElementById('login-error-msg');

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok && data.status === 'success') {
      updateUserUI(data.user);
      if (errorMsg) errorMsg.classList.add('hidden');
      closeAuthModal();
    } else {
      if (errorMsg) {
        errorMsg.textContent = data.message || '* Invalid email or password';
        errorMsg.classList.remove('hidden');
      }
    }
  } catch (err) {
    if (errorMsg) {
      errorMsg.textContent = '* Connection error. Please try again.';
      errorMsg.classList.remove('hidden');
    }
  }
}

async function handleStudentLogin() {
  try {
    const res = await fetch('/api/auth/student-login', { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.status === 'success') {
      updateUserUI(data.user);
      closeAuthModal();
    }
  } catch (err) {
    console.error('Failed student login:', err);
  }
}

async function handleInviteAccountSetup(e) {
  e.preventDefault();
  const name = document.getElementById('setup-fullname').value;
  const email = document.getElementById('setup-email').value;
  const password = document.getElementById('setup-password').value;
  const confirmPassword = document.getElementById('setup-confirm-password').value;
  const errorMsg = document.getElementById('setup-error-msg');

  if (password !== confirmPassword) {
    if (errorMsg) {
      errorMsg.textContent = '* Passwords must match';
      errorMsg.classList.remove('hidden');
    }
    return;
  }

  try {
    const res = await fetch('/api/auth/register-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, confirm_password: confirmPassword })
    });

    const data = await res.json();
    if (res.ok && data.status === 'success') {
      updateUserUI(data.user);
      if (errorMsg) errorMsg.classList.add('hidden');
      closeAuthModal();
    } else {
      if (errorMsg) {
        errorMsg.textContent = data.message || '* Error creating account';
        errorMsg.classList.remove('hidden');
      }
    }
  } catch (err) {
    if (errorMsg) {
      errorMsg.textContent = '* Connection error. Please try again.';
      errorMsg.classList.remove('hidden');
    }
  }
}

async function handleSendCodeSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('forgot-email').value;
  const btn = document.getElementById('send-code-btn');

  try {
    if (btn) btn.textContent = 'Sending...';
    const res = await fetch('/api/auth/forgot-password/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (res.ok && data.status === 'success') {
      if (btn) btn.textContent = 'Code Sent ✓';
      setTimeout(() => { if (btn) btn.textContent = 'Send Code'; }, 3000);
    }
  } catch (err) {
    if (btn) btn.textContent = 'Send Code';
  }
}

function handleResendCode() {
  const btn = document.getElementById('send-code-btn');
  if (btn) {
    btn.textContent = 'Resending...';
    setTimeout(() => { btn.textContent = 'Code Sent ✓'; }, 800);
    setTimeout(() => { btn.textContent = 'Send Code'; }, 3500);
  }
}

async function handleVerifyCodeSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('forgot-email').value;
  const code = document.getElementById('forgot-code').value;
  const errorMsg = document.getElementById('verify-error-msg');

  try {
    const res = await fetch('/api/auth/forgot-password/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });

    const data = await res.json();
    if (res.ok && data.status === 'success') {
      if (errorMsg) errorMsg.classList.add('hidden');
      switchAuthScreen('forgot-step2');
    } else {
      if (errorMsg) {
        errorMsg.textContent = data.message || '* Incorrect code';
        errorMsg.classList.remove('hidden');
      }
    }
  } catch (err) {
    if (errorMsg) {
      errorMsg.textContent = '* Error verifying code';
      errorMsg.classList.remove('hidden');
    }
  }
}

async function handleChangePasswordSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('forgot-email').value;
  const newPassword = document.getElementById('reset-new-password').value;
  const confirmPassword = document.getElementById('reset-confirm-password').value;
  const errorMsg = document.getElementById('reset-error-msg');

  if (newPassword !== confirmPassword) {
    if (errorMsg) {
      errorMsg.textContent = '* Passwords must match';
      errorMsg.classList.remove('hidden');
    }
    return;
  }

  try {
    const res = await fetch('/api/auth/forgot-password/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: newPassword, confirm_password: confirmPassword })
    });

    const data = await res.json();
    if (res.ok && data.status === 'success') {
      if (errorMsg) errorMsg.classList.add('hidden');
      const loginEmail = document.getElementById('login-email');
      if (loginEmail) loginEmail.value = email;
      switchAuthScreen('login');
    } else {
      if (errorMsg) {
        errorMsg.textContent = data.message || '* Passwords must match';
        errorMsg.classList.remove('hidden');
      }
    }
  } catch (err) {
    if (errorMsg) {
      errorMsg.textContent = '* Connection error';
      errorMsg.classList.remove('hidden');
    }
  }
}

async function handleLogout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    updateUserUI({ name: 'Guest User', role: 'Logged Out', email: '' });
    openAuthModal('login');
  } catch (err) {
    console.error('Logout error:', err);
  }
}

