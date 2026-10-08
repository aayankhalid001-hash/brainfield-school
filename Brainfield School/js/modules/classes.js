/**
 * Brainfield School - Classes & Subjects Module
 * Grade levels, section divisions, assigned class teachers, and student rosters.
 */

window.renderClasses = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const classes = db.getClasses();

  let html = `
    <div class="view-header">
      <div class="view-title-group">
        <h1>🏫 ${t('navClasses')}</h1>
        <p class="view-subtitle">Classroom sections, homeroom teachers, enrolled rosters and subject curriculums.</p>
      </div>
      <div class="view-actions-group">
        <button class="btn btn-outline" onclick="window.Router.navigateTo('timetable')">
          📅 View Timetable
        </button>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px;">
      ${classes.map(cls => `
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">${cls.name} &bull; Section ${cls.section}</h3>
            <span class="badge badge-info">${cls.room}</span>
          </div>
          <div class="card-body">
            <div style="margin-bottom: 12px; font-size: 0.85rem;">
              <div style="color: var(--text-muted); margin-bottom: 2px;">Class Incharge / Homeroom:</div>
              <strong style="color: var(--text-main); font-size: 0.95rem;">${cls.classTeacher}</strong>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; background: var(--bg-surface-alt); padding: 8px 12px; border-radius: var(--radius-md); margin-bottom: 14px;">
              <span>Enrolled: <strong>${cls.enrolled}</strong> / ${cls.capacity}</span>
              <span>Shift: <strong>${cls.shift}</strong></span>
            </div>

            <div style="margin-bottom: 14px;">
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">Subjects Taught:</div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                ${cls.subjects.map(s => `<span class="badge badge-neutral" style="font-size: 0.7rem;">${s}</span>`).join('')}
              </div>
            </div>

            <div style="display: flex; gap: 8px; border-top: 1px solid var(--border-color); padding-top: 12px;">
              <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="window.viewClassRoster('${cls.name}', '${cls.section}')">
                👥 View Roster
              </button>
              <button class="btn btn-primary btn-sm" onclick="window.Router.navigateTo('attendance')">
                📋 Attendance
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = html;
};

window.viewClassRoster = function(gradeName, section) {
  const students = window.DB.getStudents().filter(
    s => s.grade === gradeName && (!section || s.section === section)
  );

  const modalHTML = `
    <div class="modal-backdrop open" id="class-roster-modal">
      <div class="modal-card modal-lg">
        <div class="modal-header">
          <h3 class="modal-title">👥 Enrolled Roster: ${gradeName} - Section ${section}</h3>
          <button class="modal-close-btn" onclick="document.getElementById('class-roster-modal').remove()">×</button>
        </div>
        <div class="modal-body" style="padding: 0;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student</th>
                <th>Guardian</th>
                <th>Phone</th>
                <th>Attendance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${students.length > 0 ? students.map(s => `
                <tr>
                  <td><strong>${s.rollNo}</strong></td>
                  <td>${s.name}</td>
                  <td>${s.parentName}</td>
                  <td>${s.parentPhone}</td>
                  <td><span class="badge badge-success">${s.attendanceRate}%</span></td>
                  <td><span class="badge badge-success">${s.status}</span></td>
                </tr>
              `).join('') : `
                <tr><td colspan="6" style="text-align: center; padding: 20px;">No students currently enrolled in this specific section.</td></tr>
              `}
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('class-roster-modal').remove()">Close</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.Router.register('classes', window.renderClasses);
