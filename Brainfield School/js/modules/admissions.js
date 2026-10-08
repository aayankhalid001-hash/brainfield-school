/**
 * Brainfield School - Admissions & Online Applications Module
 * Online admission portal, applicant review pipeline, and auto-enrollment into classes.
 */

window.renderAdmissions = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const isRTL = window.I18n.isRTL();
  const user = window.Auth.getCurrentUser();
  const canApprove = user.role === 'admin' || user.role === 'principal';

  function renderTable(filterStatus = 'all') {
    let list = db.getAdmissions();
    if (filterStatus !== 'all') {
      list = list.filter(a => a.status === filterStatus);
    }

    const tbody = document.getElementById('admissions-table-body');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">No applications found for this filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(app => {
      let badgeClass = 'badge-warning';
      if (app.status === 'Approved') badgeClass = 'badge-success';
      if (app.status === 'Rejected') badgeClass = 'badge-danger';

      return `
        <tr>
          <td><strong>${app.applicationNo}</strong></td>
          <td>
            <div style="font-weight: 600; color: var(--text-main);">${isRTL && app.studentNameAr ? app.studentNameAr : app.studentName}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${app.gender} &bull; Village: ${app.village}</div>
          </td>
          <td><span class="badge badge-info">${app.appliedGrade}</span></td>
          <td>
            <div>${app.parentName}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${app.phone}</div>
          </td>
          <td>${app.appliedDate}</td>
          <td><span class="badge ${badgeClass}">${app.status}</span></td>
          <td>
            <div style="display: flex; gap: 6px;">
              ${canApprove && app.status === 'Pending' ? `
                <button class="btn btn-success btn-sm" onclick="window.approveAdmission('${app.id}')">
                  ✅ Approve
                </button>
                <button class="btn btn-danger btn-sm" onclick="window.rejectAdmission('${app.id}')">
                  ❌ Reject
                </button>
              ` : `
                <button class="btn btn-outline btn-sm" onclick="window.viewAdmissionNotes('${app.id}')">
                  📄 Details
                </button>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1>📝 ${t('navAdmissions')}</h1>
        <p class="view-subtitle">Review incoming village admission requests and process registrations.</p>
      </div>
      <div class="view-actions-group">
        <button class="btn btn-primary" onclick="window.openNewApplicationModal()">
          ➕ New Application Form
        </button>
      </div>
    </div>

    <div class="content-card">
      <div class="card-body">
        <div class="filter-bar">
          <div class="filter-group">
            <select id="admission-status-filter" class="form-select">
              <option value="all">All Application Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div style="font-size: 0.82rem; color: var(--text-muted);">
            Active Pipeline: <strong>${db.getAdmissions().length} Applications</strong>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>App #</th>
                <th>Applicant Name</th>
                <th>Target Grade</th>
                <th>Guardian / Phone</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>${t('actions')}</th>
              </tr>
            </thead>
            <tbody id="admissions-table-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const filterSelect = document.getElementById('admission-status-filter');
  filterSelect.addEventListener('change', () => {
    renderTable(filterSelect.value);
  });

  renderTable();
};

window.openNewApplicationModal = function() {
  const modalHTML = `
    <div class="modal-backdrop open" id="new-app-modal">
      <div class="modal-card modal-lg">
        <div class="modal-header">
          <h3 class="modal-title">📝 Online Student Admission Application</h3>
          <button class="modal-close-btn" onclick="document.getElementById('new-app-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <form style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Student Name *</label>
              <input type="text" class="form-input" id="adm-s-name" required placeholder="e.g. Mehmood Akhtar" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Applied Grade *</label>
              <select class="form-select" id="adm-s-grade" style="width: 100%;">
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8" selected>Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Date of Birth</label>
              <input type="date" class="form-input" id="adm-s-dob" value="2013-05-10" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Gender</label>
              <select class="form-select" id="adm-s-gender" style="width: 100%;">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Parent / Guardian Name *</label>
              <input type="text" class="form-input" id="adm-s-parent" required placeholder="e.g. Akhtar Ali" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Contact Phone *</label>
              <input type="text" class="form-input" id="adm-s-phone" required placeholder="+92 300 1234567" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Village / Neighborhood</label>
              <input type="text" class="form-input" id="adm-s-village" placeholder="e.g. West Meadow Hamlet" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Previous School Attended</label>
              <input type="text" class="form-input" id="adm-s-prev" placeholder="e.g. Village Primary Center" style="width: 100%;" />
            </div>
            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">Applicant Background & Notes</label>
              <textarea class="form-textarea" id="adm-s-notes" rows="2" style="width: 100%;" placeholder="Special interests, digital device availability at home, etc."></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('new-app-modal').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="window.submitAdmissionApplication()">Submit Application</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.submitAdmissionApplication = function() {
  const name = document.getElementById('adm-s-name')?.value;
  const grade = document.getElementById('adm-s-grade')?.value;
  const parent = document.getElementById('adm-s-parent')?.value;
  const phone = document.getElementById('adm-s-phone')?.value;
  const village = document.getElementById('adm-s-village')?.value;
  const prev = document.getElementById('adm-s-prev')?.value;
  const notes = document.getElementById('adm-s-notes')?.value;
  const gender = document.getElementById('adm-s-gender')?.value;

  if (!name || !parent || !phone) {
    window.showToast("Please provide applicant name, parent name and phone", "warning");
    return;
  }

  window.DB.addAdmission({
    studentName: name,
    appliedGrade: grade,
    parentName: parent,
    phone: phone,
    village: village || "Green Valley",
    previousSchool: prev || "None",
    notes: notes || "Submitted online via village portal",
    gender: gender || "Male"
  });

  document.getElementById('new-app-modal')?.remove();
  window.showToast("Admission application submitted successfully!", "success");
  window.Router.refreshCurrentView();
};

window.approveAdmission = function(id) {
  const app = window.DB.updateAdmissionStatus(id, 'Approved', 'Approved by Principal. Enrolled in active roster.');
  if (app) {
    // Automatically create a new student record!
    const rollNo = `${app.appliedGrade.replace('Grade ', '')}-A-${Math.floor(10 + Math.random() * 89)}`;
    window.DB.addStudent({
      rollNo: rollNo,
      name: app.studentName,
      nameAr: app.studentNameAr || app.studentName,
      grade: app.appliedGrade,
      section: 'A',
      gender: app.gender || 'Male',
      parentName: app.parentName,
      parentPhone: app.phone,
      parentEmail: `${app.studentName.toLowerCase().replace(/\s+/g, '')}@student.brainfield.edu`,
      address: app.village || 'Green Valley Village',
      status: 'Active',
      balanceFee: 0,
      avatar: app.gender === 'Female' ? '👧' : '👦',
      notes: `Enrolled via Admission Application #${app.applicationNo}`
    });

    window.showToast(`Application #${app.applicationNo} Approved! Student auto-enrolled with Roll #${rollNo}.`, "success");
    window.Router.refreshCurrentView();
  }
};

window.rejectAdmission = function(id) {
  window.DB.updateAdmissionStatus(id, 'Rejected', 'Application does not meet current term criteria.');
  window.showToast("Application marked as Rejected.", "warning");
  window.Router.refreshCurrentView();
};

window.viewAdmissionNotes = function(id) {
  const app = window.DB.getAdmissions().find(a => a.id === id);
  if (!app) return;
  alert(`Application #${app.applicationNo}\nApplicant: ${app.studentName}\nStatus: ${app.status}\nNotes: ${app.notes || 'None'}`);
};

window.Router.register('admissions', window.renderAdmissions);
