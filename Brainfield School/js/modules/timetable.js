/**
 * Brainfield School - Timetable Module
 * Interactive weekly schedule for classes, teachers, periods and online classroom links.
 */

window.renderTimetable = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const timetable = db.data.timetable || [];

  let selectedDay = 'Monday';

  function renderDaySchedule(day) {
    selectedDay = day;
    // Update active tab button
    document.querySelectorAll('.day-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-day') === day) {
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-outline');
      } else {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
      }
    });

    const daySlots = timetable.filter(slot => slot.day === day);
    const tbody = document.getElementById('timetable-body');
    if (!tbody) return;

    if (daySlots.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--text-muted);">No classes scheduled for ${day}.</td></tr>`;
      return;
    }

    tbody.innerHTML = daySlots.map(slot => `
      <tr>
        <td><strong>${slot.period}</strong></td>
        <td>
          <div style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">${slot.subject}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${slot.class}</div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span>👨‍🏫</span>
            <span>${slot.teacher}</span>
          </div>
        </td>
        <td>
          <span class="badge ${slot.room.includes('Virtual') ? 'badge-warning' : 'badge-info'}">
            ${slot.room}
          </span>
        </td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="window.Router.navigateTo('liveclass')">
            🎥 Live Room
          </button>
        </td>
      </tr>
    `).join('');
  }

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1>🗓️ ${t('navTimetable')}</h1>
        <p class="view-subtitle">Weekly period schedule for Grade 8-A and general academic timetable.</p>
      </div>
      <div class="view-actions-group">
        <button class="btn btn-outline" onclick="window.print()">
          🖨️ ${t('btnPrint')}
        </button>
      </div>
    </div>

    <div class="content-card">
      <div class="card-body">
        <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
          <button class="btn btn-primary day-tab-btn" data-day="Monday" onclick="window.selectTimetableDay('Monday')">Monday</button>
          <button class="btn btn-outline day-tab-btn" data-day="Tuesday" onclick="window.selectTimetableDay('Tuesday')">Tuesday</button>
          <button class="btn btn-outline day-tab-btn" data-day="Wednesday" onclick="window.selectTimetableDay('Wednesday')">Wednesday</button>
          <button class="btn btn-outline day-tab-btn" data-day="Thursday" onclick="window.selectTimetableDay('Thursday')">Thursday</button>
          <button class="btn btn-outline day-tab-btn" data-day="Friday" onclick="window.selectTimetableDay('Friday')">Friday</button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Period & Timing</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Classroom / Location</th>
                <th>Online Action</th>
              </tr>
            </thead>
            <tbody id="timetable-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  window.selectTimetableDay = function(day) {
    renderDaySchedule(day);
  };

  renderDaySchedule('Monday');
};

window.Router.register('timetable', window.renderTimetable);
