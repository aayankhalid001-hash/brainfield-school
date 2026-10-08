/**
 * Brainfield School - Student Management Module
 * Comprehensive student profiles, admission records, academic history, and CRUD modals.
 */

window.renderStudents = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const isRTL = window.I18n.isRTL();
  const user = window.Auth.getCurrentUser();
  const canEdit = user.role === 'admin' || user.role === 'principal';

  function renderList(gradeFilter = 'all', searchQuery = '') {
    let students = db.getStudents();

    if (gradeFilter !== 'all') {
      students = students.filter(s => s.grade.toLowerCase().includes(gradeFilter.toLowerCase()));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      students = students.filter(s => 
        s.name.toLowerCase().includes(q) || 
        (s.nameAr && s.nameAr.includes(q)) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.parentName.toLowerCase().includes(q)
      );
    }

    const tbody = document.getElementById('students-table-body');
    if (!tbody) return;

    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">No student records found matching the filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = students.map(s => `
      <tr>
        <td><strong>${s.rollNo}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.2rem;">${s.avatar || '👦'}</span>
            <div>
              <div style="font-weight: 600; color: var(--text-main);">${isRTL && s.nameAr ? s.nameAr : s.name}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${s.gender} &bull; Blood: ${s.bloodGroup || 'N/A'}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-info">${s.grade} - ${s.section}</span></td>
        <td>
          <div>${s.parentName}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${s.parentPhone}</div>
        </td>
        <td>
          <span class="badge ${s.attendanceRate >= 90 ? 'badge-success' : 'badge-warning'}">
            ${s.attendanceRate || 95}%
          </span>
        </td>
        <td>
          <span class="badge ${s.balanceFee > 0 ? 'badge-danger' : 'badge-success'}">
            ${s.balanceFee > 0 ? `$${s.balanceFee} Due` : 'Cleared'}
          </span>
        </td>
        <td>
          <span class="badge badge-success">${s.status}</span>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-outline btn-sm" onclick="window.viewStudentProfile('${s.id}')">
              👁️ View
            </button>
            ${canEdit ? `
              <button class="btn btn-outline btn-sm" onclick="window.editStudentModal('${s.id}')">
                ✏️
              </button>
              <button class="btn btn-outline btn-sm" style="color: var(--accent-rose);" onclick="window.deleteStudentAction('${s.id}')">
                🗑️
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  }

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1>👨‍🎓 ${t('navStudents')}</h1>
        <p class="view-subtitle">Manage student enrollment, profiles, attendance records and academic standing.</p>
      </div>
      <div class="view-actions-group">
        <button class="btn btn-outline" onclick="window.exportStudentsCSV()">
          📥 ${t('btnExport')}
        </button>
        ${canEdit ? `
          <button class="btn btn-primary" onclick="window.openAddStudentModal()">
            ➕ ${t('btnAdd')} Student
          </button>
        ` : ''}
      </div>
    </div>

    <div class="content-card">
      <div class="card-body">
        <div class="filter-bar">
          <div class="filter-group">
            <input type="text" id="student-search-input" class="form-input" placeholder="${t('searchPlaceholder')}" style="min-width: 260px;" />
            <select id="student-grade-filter" class="form-select">
              <option value="all">All Grades</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
            </select>
          </div>
          <div style="font-size: 0.82rem; color: var(--text-muted);" id="students-count-text">
            Total Enrolled: <strong>${db.getStudents().length} Students</strong>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>${t('student')}</th>
                <th>Class</th>
                <th>Guardian / Phone</th>
                <th>Attendance</th>
                <th>Fees Status</th>
                <th>Status</th>
                <th>${t('actions')}</th>
              </tr>
            </thead>
            <tbody id="students-table-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Attach search and filter events
  const searchInput = document.getElementById('student-search-input');
  const gradeSelect = document.getElementById('student-grade-filter');

  searchInput.addEventListener('input', () => {
    renderList(gradeSelect.value, searchInput.value);
  });

  gradeSelect.addEventListener('change', () => {
    renderList(gradeSelect.value, searchInput.value);
  });

  // Initial render
  renderList();
};

// Global helper modals for Student Management
window.openAddStudentModal = function() {
  const modalHTML = `
    <div class="modal-backdrop open" id="add-student-modal">
      <div class="modal-card modal-lg">
        <div class="modal-header">
          <h3 class="modal-title">➕ Enroll New Student</h3>
          <button class="modal-close-btn" onclick="document.getElementById('add-student-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <form id="add-student-form" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Full Name (English) *</label>
              <input type="text" class="form-input" id="new-s-name" required placeholder="e.g. Tariq Khan" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Name (Arabic / Urdu)</label>
              <input type="text" class="form-input" id="new-s-name-ar" placeholder="e.g. طارق خان" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Roll Number *</label>
              <input type="text" class="form-input" id="new-s-roll" required placeholder="e.g. 08-A-05" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Grade & Class *</label>
              <select class="form-select" id="new-s-grade" style="width: 100%;">
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8" selected>Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Section</label>
              <select class="form-select" id="new-s-section" style="width: 100%;">
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Gender</label>
              <select class="form-select" id="new-s-gender" style="width: 100%;">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Guardian / Father Name *</label>
              <input type="text" class="form-input" id="new-s-parent" required placeholder="e.g. Rasheed Ahmed" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Guardian Mobile Phone *</label>
              <input type="text" class="form-input" id="new-s-phone" required placeholder="+92 300 0000000" style="width: 100%;" />
            </div>
            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">Village Address</label>
              <input type="text" class="form-input" id="new-s-address" placeholder="e.g. Village Sector 3, Green Valley" style="width: 100%;" />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('add-student-modal').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="window.submitAddStudent()">Save & Enroll</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.submitAddStudent = function() {
  const name = document.getElementById('new-s-name')?.value;
  const nameAr = document.getElementById('new-s-name-ar')?.value;
  const rollNo = document.getElementById('new-s-roll')?.value;
  const grade = document.getElementById('new-s-grade')?.value;
  const section = document.getElementById('new-s-section')?.value;
  const gender = document.getElementById('new-s-gender')?.value;
  const parentName = document.getElementById('new-s-parent')?.value;
  const parentPhone = document.getElementById('new-s-phone')?.value;
  const address = document.getElementById('new-s-address')?.value;

  if (!name || !rollNo || !parentName || !parentPhone) {
    window.showToast("Please complete all required fields (*)", "warning");
    return;
  }

  window.DB.addStudent({
    rollNo,
    name,
    nameAr: nameAr || name,
    grade,
    section,
    gender,
    parentName,
    parentPhone,
    parentEmail: `${name.toLowerCase().replace(/\s+/g, '')}@student.brainfield.edu`,
    address: address || "Green Valley Village",
    dob: "2012-06-15",
    bloodGroup: "B+",
    attendanceRate: 100,
    balanceFee: 0,
    avatar: gender === 'Female' ? '👧' : '👦',
    status: 'Active'
  });

  document.getElementById('add-student-modal')?.remove();
  window.showToast("Student enrolled successfully!", "success");
  window.Router.refreshCurrentView();
};

window.viewStudentProfile = function(id) {
  const s = window.DB.getStudentById(id);
  if (!s) return;

  const modalHTML = `
    <div class="modal-backdrop open" id="view-student-modal">
      <div class="modal-card modal-lg">
        <div class="modal-header">
          <h3 class="modal-title">Student Profile: ${s.name}</h3>
          <button class="modal-close-btn" onclick="document.getElementById('view-student-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div style="display: flex; gap: 20px; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 18px;">
            <div style="font-size: 3.5rem; background: var(--primary-50); width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
              ${s.avatar || '👦'}
            </div>
            <div>
              <h2 style="font-size: 1.3rem;">${s.name} ${s.nameAr ? `(${s.nameAr})` : ''}</h2>
              <p style="color: var(--text-muted); font-size: 0.85rem;">Roll: <strong>${s.rollNo}</strong> &bull; ${s.grade} - ${s.section}</p>
              <div style="display: flex; gap: 8px; margin-top: 6px;">
                <span class="badge badge-success">Status: ${s.status}</span>
                <span class="badge badge-info">Attendance: ${s.attendanceRate}%</span>
                <span class="badge ${s.balanceFee > 0 ? 'badge-danger' : 'badge-success'}">Fee: ${s.balanceFee > 0 ? `$${s.balanceFee} Due` : 'Paid'}</span>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 0.85rem;">
            <div><strong>Father/Guardian:</strong> ${s.parentName}</div>
            <div><strong>Guardian Contact:</strong> ${s.parentPhone}</div>
            <div><strong>Date of Birth:</strong> ${s.dob || '2012-05-14'}</div>
            <div><strong>Blood Group:</strong> ${s.bloodGroup || 'O+'}</div>
            <div><strong>Village Location:</strong> ${s.address}</div>
            <div><strong>Admission Date:</strong> ${s.admissionDate || '2021-04-01'}</div>
          </div>

          <div style="margin-top: 18px; padding: 12px; background: var(--bg-surface-alt); border-radius: var(--radius-md);">
            <div style="font-weight: 700; margin-bottom: 4px; font-size: 0.85rem;">Faculty Remarks:</div>
            <p style="font-size: 0.82rem; color: var(--text-muted);">${s.notes || 'Diligent student participating in village digital learning program.'}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="document.getElementById('view-student-modal').remove(); window.Router.navigateTo('results');">
            🏅 View Report Card
          </button>
          <button class="btn btn-outline" onclick="document.getElementById('view-student-modal').remove()">Close</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.deleteStudentAction = function(id) {
  if (confirm(window.I18n.t('confirmDelete'))) {
    window.DB.deleteStudent(id);
    window.showToast("Student deleted from records.", "warning");
    window.Router.refreshCurrentView();
  }
};

window.exportStudentsCSV = function() {
  const students = window.DB.getStudents();
  let csv = "RollNo,Name,Grade,Section,Gender,ParentName,ParentPhone,AttendanceRate,FeeDue\n";
  students.forEach(s => {
    csv += `"${s.rollNo}","${s.name}","${s.grade}","${s.section}","${s.gender}","${s.parentName}","${s.parentPhone}","${s.attendanceRate}%","${s.balanceFee}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `brainfield-students-${new Date().toISOString().substring(0, 10)}.csv`;
  a.click();
  window.showToast("Exported students to CSV file", "success");
};

window.Router.register('students', window.renderStudents);
