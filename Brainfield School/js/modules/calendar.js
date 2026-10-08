/**
 * Brainfield School - School Calendar Module
 * Academic events, exam seasons, national holidays, and parent-teacher meetings.
 */

window.renderCalendar = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const events = db.data.calendar || [];

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1>📅 ${t('navCalendar')}</h1>
        <p class="view-subtitle">Academic term schedules, examination blocks, holidays and community festivals.</p>
      </div>
      <div class="view-actions-group">
        <button class="btn btn-primary" onclick="window.openAddEventModal()">
          ➕ Add Calendar Event
        </button>
      </div>
    </div>

    <div class="dashboard-sections-grid">
      <!-- Calendar Events List -->
      <div class="content-card">
        <div class="card-header">
          <h3 class="card-title">🗓️ Academic Year 2026-2027 Schedule</h3>
          <span class="badge badge-info">Term 1</span>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${events.map(ev => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px; border-radius: var(--radius-md); border-left: 4px solid ${ev.color}; background: var(--bg-surface-alt);">
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">${ev.title}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
                    Date: <strong>${ev.date}</strong> &bull; Category: <span class="badge badge-neutral">${ev.type}</span>
                  </div>
                </div>
                <div style="font-size: 1.5rem;">
                  ${ev.type === 'Exam' ? '📑' : (ev.type === 'Holiday' ? '🏖️' : (ev.type === 'Meeting' ? '🤝' : '🌱'))}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Quick Summary Card -->
      <div style="display: flex; flex-direction: column; gap: 18px;">
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">📌 Key Academic Dates</h3>
          </div>
          <div class="card-body" style="font-size: 0.85rem; line-height: 1.6;">
            <div style="margin-bottom: 8px;">
              <strong>Term 1 Mid-Year Exams:</strong>
              <div style="color: var(--text-muted);">October 20 - October 28, 2026</div>
            </div>
            <div style="margin-bottom: 8px;">
              <strong>Result Card Distribution:</strong>
              <div style="color: var(--text-muted);">November 2, 2026</div>
            </div>
            <div style="margin-bottom: 8px;">
              <strong>Annual Science & Solar Fair:</strong>
              <div style="color: var(--text-muted);">November 5, 2026</div>
            </div>
            <div>
              <strong>Winter Vacation:</strong>
              <div style="color: var(--text-muted);">December 22 - January 4, 2027</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.openAddEventModal = function() {
  const modalHTML = `
    <div class="modal-backdrop open" id="add-cal-modal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">➕ Add Calendar Event</h3>
          <button class="modal-close-btn" onclick="document.getElementById('add-cal-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Event Name *</label>
            <input type="text" class="form-input" id="cal-title" placeholder="e.g. Village Reading Olympiad" style="width: 100%;" />
          </div>
          <div class="form-group">
            <label class="form-label">Event Date *</label>
            <input type="date" class="form-input" id="cal-date" value="2026-11-15" style="width: 100%;" />
          </div>
          <div class="form-group">
            <label class="form-label">Event Type</label>
            <select class="form-select" id="cal-type" style="width: 100%;">
              <option value="Event">School Event</option>
              <option value="Exam">Examination</option>
              <option value="Meeting">PTA Meeting</option>
              <option value="Holiday">School Holiday</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('add-cal-modal').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="window.submitAddEvent()">Add Event</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.submitAddEvent = function() {
  const title = document.getElementById('cal-title')?.value;
  const date = document.getElementById('cal-date')?.value;
  const type = document.getElementById('cal-type')?.value;

  if (!title || !date) {
    window.showToast("Please enter title and date", "warning");
    return;
  }

  let color = '#3B82F6';
  if (type === 'Exam') color = '#EF4444';
  if (type === 'Holiday') color = '#F59E0B';
  if (type === 'Event') color = '#10B981';

  window.DB.data.calendar.push({
    id: 'cal-' + Date.now(),
    title,
    date,
    type,
    color
  });
  window.DB.save();

  document.getElementById('add-cal-modal')?.remove();
  window.showToast("Event added to school calendar!", "success");
  window.Router.refreshCurrentView();
};

window.Router.register('calendar', window.renderCalendar);
