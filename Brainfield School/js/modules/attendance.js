/**
 * Brainfield School - Attendance Management Module
 * Interactive daily register, status buttons (P/A/L/E), batch actions and analytics.
 */

window.renderAttendance = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const isRTL = window.I18n.isRTL();

  let selectedDate = new Date().toISOString().substring(0, 10);
  let selectedClassId = 'c-g8a';

  function renderRegister() {
    const students = db.getStudents().filter(s => s.grade === 'Grade 8' && s.section === 'A');
    const existingRecords = db.getAttendance(selectedClassId, selectedDate);

    const tbody = document.getElementById('attendance-register-body');
    if (!tbody) return;

    tbody.innerHTML = students.map((s, idx) => {
      const rec = existingRecords.find(r => r.studentId === s.id) || { status: 'Present', remarks: '' };
      return `
        <tr data-student-id="${s.id}">
          <td><strong>${s.rollNo}</strong></td>
          <td>
            <div style="font-weight: 600; color: var(--text-main);">${isRTL && s.nameAr ? s.nameAr : s.name}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${s.parentName}</div>
          </td>
          <td>
            <div style="display: flex; gap: 6px;" class="attendance-options" data-student-id="${s.id}">
              <button type="button" class="btn btn-sm ${rec.status === 'Present' ? 'btn-success' : 'btn-outline'}" data-status="Present" onclick="window.setAttendanceRowStatus('${s.id}', 'Present')">
                P (Present)
              </button>
              <button type="button" class="btn btn-sm ${rec.status === 'Late' ? 'btn-primary' : 'btn-outline'}" data-status="Late" onclick="window.setAttendanceRowStatus('${s.id}', 'Late')">
                L (Late)
              </button>
              <button type="button" class="btn btn-sm ${rec.status === 'Absent' ? 'btn-danger' : 'btn-outline'}" data-status="Absent" onclick="window.setAttendanceRowStatus('${s.id}', 'Absent')">
                A (Absent)
              </button>
              <button type="button" class="btn btn-sm ${rec.status === 'Excused' ? 'btn-outline' : 'btn-outline'}" data-status="Excused" onclick="window.setAttendanceRowStatus('${s.id}', 'Excused')">
                E (Excused)
              </button>
            </div>
          </td>
          <td>
            <input type="text" class="form-input attendance-remark" data-student-id="${s.id}" value="${rec.remarks || ''}" placeholder="Note (e.g. clinic, rain delay)" style="width: 100%; font-size: 0.8rem; padding: 4px 8px;" />
          </td>
        </tr>
      `;
    }).join('');

    updateStats();
  }

  function updateStats() {
    const rows = document.querySelectorAll('#attendance-register-body tr');
    let p = 0, a = 0, l = 0, e = 0;
    rows.forEach(r => {
      const activeBtn = r.querySelector('.attendance-options .btn:not(.btn-outline)');
      const st = activeBtn ? activeBtn.getAttribute('data-status') : 'Present';
      if (st === 'Present') p++;
      else if (st === 'Absent') a++;
      else if (st === 'Late') l++;
      else if (st === 'Excused') e++;
    });

    const total = rows.length || 1;
    const statEl = document.getElementById('attendance-summary-stats');
    if (statEl) {
      statEl.innerHTML = `
        <span class="badge badge-success">Present: ${p} (${Math.round((p/total)*100)}%)</span>
        <span class="badge badge-warning">Late: ${l}</span>
        <span class="badge badge-danger">Absent: ${a}</span>
        <span class="badge badge-neutral">Excused: ${e}</span>
      `;
    }
  }

  window.setAttendanceRowStatus = function(studentId, status) {
    const group = document.querySelector(`.attendance-options[data-student-id="${studentId}"]`);
    if (!group) return;
    group.querySelectorAll('button').forEach(btn => {
      btn.className = 'btn btn-sm btn-outline';
      if (btn.getAttribute('data-status') === status) {
        if (status === 'Present') btn.className = 'btn btn-sm btn-success';
        else if (status === 'Late') btn.className = 'btn btn-sm btn-primary';
        else if (status === 'Absent') btn.className = 'btn btn-sm btn-danger';
        else btn.className = 'btn btn-sm btn-outline';
      }
    });
    updateStats();
  };

  window.markAllPresent = function() {
    document.querySelectorAll('#attendance-register-body tr').forEach(r => {
      const sid = r.getAttribute('data-student-id');
      window.setAttendanceRowStatus(sid, 'Present');
    });
    window.showToast("Marked all students as Present", "success");
  };

  window.saveAttendanceRegister = function() {
    const records = [];
    document.querySelectorAll('#attendance-register-body tr').forEach(r => {
      const studentId = r.getAttribute('data-student-id');
      const activeBtn = r.querySelector('.attendance-options .btn:not(.btn-outline)');
      const status = activeBtn ? activeBtn.getAttribute('data-status') : 'Present';
      const remarkInput = r.querySelector('.attendance-remark');
      const remarks = remarkInput ? remarkInput.value : '';

      records.push({
        date: selectedDate,
        classId: selectedClassId,
        studentId: studentId,
        status: status,
        remarks: remarks
      });
    });

    db.markAttendance(records);
    window.showToast(`Saved attendance register for ${records.length} students!`, "success");
  };

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1>📋 ${t('navAttendance')}</h1>
        <p class="view-subtitle">Mark daily classroom and virtual session attendance registers.</p>
      </div>
      <div class="view-actions-group">
        <button class="btn btn-outline" onclick="window.markAllPresent()">
          ⚡ Mark All Present
        </button>
        <button class="btn btn-primary" onclick="window.saveAttendanceRegister()">
          💾 ${t('btnSave')} Attendance
        </button>
      </div>
    </div>

    <div class="content-card">
      <div class="card-body">
        <div class="filter-bar">
          <div class="filter-group">
            <label style="font-size: 0.82rem; font-weight: 600;">Class:</label>
            <select id="att-class-select" class="form-select">
              <option value="c-g8a">Grade 8 - Section A (Smart Hall)</option>
              <option value="c-g6b">Grade 6 - Section B</option>
              <option value="c-g7">Grade 7 - Section A</option>
            </select>

            <label style="font-size: 0.82rem; font-weight: 600; margin-left: 10px;">Date:</label>
            <input type="date" id="att-date-input" class="form-input" value="${selectedDate}" />
          </div>

          <div id="attendance-summary-stats" style="display: flex; gap: 8px;"></div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student</th>
                <th>Attendance Status</th>
                <th>Remarks / Reason</th>
              </tr>
            </thead>
            <tbody id="attendance-register-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  document.getElementById('att-date-input').addEventListener('change', (e) => {
    selectedDate = e.target.value;
    renderRegister();
  });

  renderRegister();
};

window.Router.register('attendance', window.renderAttendance);
