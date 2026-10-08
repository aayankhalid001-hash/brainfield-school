/**
 * Brainfield School - Settings & Audit Activity Logs Module
 * School configuration, branding, data backup/restore, and administrative audit trails.
 */

window.renderSettings = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const info = db.data.schoolInfo;
  const logs = db.data.activityLogs || [];

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1>⚙️ ${t('navSettings')}</h1>
        <p class="view-subtitle">Institution identity, grading criteria, administrative activity logs, and JSON data backups.</p>
      </div>
      <div class="view-actions-group">
        <button class="btn btn-outline" onclick="window.exportSystemJSONBackup()">
          💾 Export JSON Backup
        </button>
        <button class="btn btn-danger btn-sm" onclick="window.resetSystemDataConfirm()">
          ⚠️ Reset to Demo State
        </button>
      </div>
    </div>

    <div class="dashboard-sections-grid">
      <!-- Left: School Profile Form -->
      <div class="content-card">
        <div class="card-header">
          <h3 class="card-title">🏫 Institutional Profile & Session</h3>
        </div>
        <div class="card-body">
          <form onsubmit="event.preventDefault(); window.saveSchoolSettings();" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">School Name (English)</label>
              <input type="text" class="form-input" id="set-name" value="${info.name}" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">School Name (Arabic)</label>
              <input type="text" class="form-input" id="set-name-ar" value="${info.nameAr || ''}" style="width: 100%;" />
            </div>
            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">Motto / Tagline</label>
              <input type="text" class="form-input" id="set-tagline" value="${info.tagline}" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Academic Year / Session</label>
              <input type="text" class="form-input" id="set-year" value="${info.academicYear}" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Currency Symbol</label>
              <input type="text" class="form-input" id="set-curr" value="${info.currency || '$'}" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Official Contact Phone</label>
              <input type="text" class="form-input" id="set-phone" value="${info.phone}" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Official Email</label>
              <input type="text" class="form-input" id="set-email" value="${info.email}" style="width: 100%;" />
            </div>
            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">Physical Campus Address</label>
              <input type="text" class="form-input" id="set-address" value="${info.address}" style="width: 100%;" />
            </div>

            <div style="grid-column: span 2; display: flex; justify-content: flex-end; margin-top: 10px;">
              <button type="submit" class="btn btn-primary">
                💾 Save Institutional Settings
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Right: Database Backup & Activity Logs -->
      <div style="display: flex; flex-direction: column; gap: 18px;">
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">📦 Database Backup & Restore</h3>
          </div>
          <div class="card-body" style="font-size: 0.85rem;">
            <p style="color: var(--text-muted); margin-bottom: 12px; line-height: 1.4;">
              Export the entire school database (all 20 modules) to a single JSON backup file, or restore from a previous backup.
            </p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button class="btn btn-outline" style="width: 100%;" onclick="window.exportSystemJSONBackup()">
                📥 Download Full Database Backup (.json)
              </button>
              <label class="btn btn-outline" style="width: 100%; cursor: pointer; text-align: center;">
                📤 Upload & Restore Backup (.json)
                <input type="file" id="restore-json-input" accept=".json" style="display: none;" onchange="window.handleRestoreJSON(event)" />
              </label>
            </div>
          </div>
        </div>

        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">🛡️ Admin Activity & Audit Logs</h3>
            <span class="badge badge-neutral">${logs.length} Events</span>
          </div>
          <div class="card-body" style="max-height: 300px; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px;">
            ${logs.map(lg => `
              <div style="border-left: 3px solid var(--primary-600); padding-left: 8px; font-size: 0.78rem;">
                <div style="font-weight: 600; color: var(--text-main);">${lg.action}</div>
                <div style="color: var(--text-muted); margin-top: 1px;">
                  ${lg.user} &bull; ${lg.timestamp}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
};

window.saveSchoolSettings = function() {
  const name = document.getElementById('set-name')?.value;
  const nameAr = document.getElementById('set-name-ar')?.value;
  const tagline = document.getElementById('set-tagline')?.value;
  const year = document.getElementById('set-year')?.value;
  const curr = document.getElementById('set-curr')?.value;
  const phone = document.getElementById('set-phone')?.value;
  const email = document.getElementById('set-email')?.value;
  const address = document.getElementById('set-address')?.value;

  window.DB.updateSchoolInfo({
    name,
    nameAr,
    tagline,
    academicYear: year,
    currency: curr,
    phone,
    email,
    address
  });

  window.showToast("School profile settings updated successfully!", "success");
  window.Router.refreshCurrentView();
};

window.exportSystemJSONBackup = function() {
  const json = window.DB.exportJSON();
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `brainfield-school-backup-${new Date().toISOString().substring(0, 10)}.json`;
  a.click();
  window.showToast("Database backup downloaded successfully!", "success");
};

window.handleRestoreJSON = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const res = window.DB.importJSON(e.target.result);
    if (res.success) {
      window.showToast("Database restored successfully!", "success");
      window.Router.refreshCurrentView();
    } else {
      window.showToast("Failed to restore: " + res.error, "danger");
    }
  };
  reader.readAsText(file);
};

window.resetSystemDataConfirm = function() {
  if (confirm("Are you sure you want to reset all data back to original Brainfield School sample state?")) {
    window.DB.reset();
    window.showToast("Database reset to factory sample data.", "info");
    window.Router.refreshCurrentView();
  }
};

window.Router.register('settings', window.renderSettings);
