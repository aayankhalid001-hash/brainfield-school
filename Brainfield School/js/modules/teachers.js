/**
 * Brainfield School - Teacher Management Module
 * Faculty directory, subject specializations, class assignments, and workload tracking.
 */

window.renderTeachers = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const isRTL = window.I18n.isRTL();
  const user = window.Auth.getCurrentUser();
  const canEdit = user.role === 'admin' || user.role === 'principal';

  const teachers = db.getTeachers();

  let html = `
    <div class="view-header">
      <div class="view-title-group">
        <h1>👨‍🏫 ${t('navTeachers')}</h1>
        <p class="view-subtitle">Academic faculty members, departmental leads, and class teacher allocations.</p>
      </div>
      <div class="view-actions-group">
        ${canEdit ? `
          <button class="btn btn-primary" onclick="window.openAddTeacherModal()">
            ➕ ${t('btnAdd')} Teacher
          </button>
        ` : ''}
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px;">
      ${teachers.map(tc => `
        <div class="content-card">
          <div class="card-body">
            <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 14px;">
              <div style="font-size: 2.4rem; background: var(--bg-surface-alt); width: 60px; height: 60px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color);">
                ${tc.avatar || '👨‍🏫'}
              </div>
              <div style="flex: 1; min-width: 0;">
                <h3 style="font-size: 1.05rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${isRTL && tc.nameAr ? tc.nameAr : tc.name}
                </h3>
                <div style="font-size: 0.78rem; color: var(--primary-600); font-weight: 600;">
                  ${tc.designation}
                </div>
                <div style="font-size: 0.74rem; color: var(--text-muted);">
                  ${tc.qualification}
                </div>
              </div>
            </div>

            <div style="background: var(--bg-surface-alt); padding: 10px 12px; border-radius: var(--radius-md); font-size: 0.8rem; margin-bottom: 14px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: var(--text-muted);">Subjects:</span>
                <strong>${tc.subjects.join(', ')}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: var(--text-muted);">Assigned Classes:</span>
                <strong>${tc.assignedClasses.join(', ')}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">Experience:</span>
                <strong>${tc.experience}</strong>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; border-top: 1px solid var(--border-color); padding-top: 10px;">
              <span style="color: var(--text-muted);">📞 ${tc.phone}</span>
              <button class="btn btn-outline btn-sm" onclick="window.Router.navigateTo('communication')">
                💬 Message
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = html;
};

window.openAddTeacherModal = function() {
  const modalHTML = `
    <div class="modal-backdrop open" id="add-teacher-modal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">➕ Add Faculty Member</h3>
          <button class="modal-close-btn" onclick="document.getElementById('add-teacher-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" class="form-input" id="new-t-name" required placeholder="e.g. Ms. Hira Saleem" style="width: 100%;" />
          </div>
          <div class="form-group">
            <label class="form-label">Specialization Subject *</label>
            <input type="text" class="form-input" id="new-t-subject" required placeholder="e.g. Social Studies & History" style="width: 100%;" />
          </div>
          <div class="form-group">
            <label class="form-label">Academic Qualification</label>
            <input type="text" class="form-input" id="new-t-qual" placeholder="e.g. M.A History" style="width: 100%;" />
          </div>
          <div class="form-group">
            <label class="form-label">Phone Contact *</label>
            <input type="text" class="form-input" id="new-t-phone" required placeholder="+92 300 0000000" style="width: 100%;" />
          </div>
          <div class="form-group">
            <label class="form-label">Assigned Classes</label>
            <input type="text" class="form-input" id="new-t-classes" placeholder="e.g. Grade 6-A, Grade 7-A" style="width: 100%;" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('add-teacher-modal').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="window.submitAddTeacher()">Save Faculty</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.submitAddTeacher = function() {
  const name = document.getElementById('new-t-name')?.value;
  const subject = document.getElementById('new-t-subject')?.value;
  const qual = document.getElementById('new-t-qual')?.value;
  const phone = document.getElementById('new-t-phone')?.value;
  const classes = document.getElementById('new-t-classes')?.value;

  if (!name || !subject || !phone) {
    window.showToast("Please fill all required fields", "warning");
    return;
  }

  window.DB.addTeacher({
    name,
    subjects: [subject],
    qualification: qual || "B.Sc / B.Ed",
    phone,
    experience: "3 Years",
    assignedClasses: classes ? classes.split(',').map(c => c.trim()) : ["Grade 7-A"],
    designation: "Subject Teacher",
    avatar: "👨‍🏫",
    status: "Active"
  });

  document.getElementById('add-teacher-modal')?.remove();
  window.showToast("Faculty member added successfully!", "success");
  window.Router.refreshCurrentView();
};

window.Router.register('teachers', window.renderTeachers);
