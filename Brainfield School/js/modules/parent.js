/**
 * Brainfield School - Parent Portal Module
 * Multi-child switcher, daily attendance tracking, homework check, fee payment and teacher chat.
 */

window.renderParent = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const isRTL = window.I18n.isRTL();

  // Children under parent Rasheed
  const children = [
    db.getStudentById('s1'), // Bilal
    db.getStudentById('s2')  // Ayesha
  ].filter(Boolean);

  let activeChild = children[0];

  function renderPortal() {
    const res = db.getResultByStudent(activeChild.id);
    const invoice = db.getFeeInvoices().find(i => i.studentId === activeChild.id);

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>👨‍👩‍👧 ${t('navParent')}</h1>
          <p class="view-subtitle">Monitor your child's academic progress, daily attendance, fees, and contact teachers.</p>
        </div>
        <div class="view-actions-group">
          <button class="btn btn-outline" onclick="window.Router.navigateTo('communication')">
            💬 Message Class Teacher
          </button>
        </div>
      </div>

      <!-- Child Selector Pills -->
      <div style="background: var(--bg-surface); padding: 14px 20px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">Switch Child:</span>
          ${children.map(ch => `
            <button class="btn ${ch.id === activeChild.id ? 'btn-primary' : 'btn-outline'}" onclick="window.switchActiveChild('${ch.id}')">
              ${ch.avatar} ${isRTL && ch.nameAr ? ch.nameAr : ch.name} (${ch.grade})
            </button>
          `).join('')}
        </div>

        <div style="font-size: 0.8rem; color: var(--text-muted);">
          Guardian: <strong>Rasheed Ahmed</strong> &bull; PTA Member
        </div>
      </div>

      <!-- Child Dashboard Overview Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: rgba(5, 150, 105, 0.12); color: #059669;">📈</div>
          <div class="stat-info">
            <div class="stat-value">${activeChild.attendanceRate}%</div>
            <div class="stat-label">Daily Attendance Record</div>
            <div class="stat-trend trend-up">Present Today (On time)</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: rgba(37, 99, 235, 0.12); color: #2563EB;">🏅</div>
          <div class="stat-info">
            <div class="stat-value">${res ? res.overallGrade : 'A+'} (${res ? res.cgpa : '3.94'})</div>
            <div class="stat-label">Term Grade Point Average</div>
            <div class="stat-trend trend-up">${res ? res.classRank : 'Top Rank'}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: rgba(217, 119, 6, 0.12); color: #D97706;">💳</div>
          <div class="stat-info">
            <div class="stat-value">${invoice ? invoice.status : 'Paid'}</div>
            <div class="stat-label">October School Fee ($30)</div>
            <div class="stat-trend trend-up">Paid via Mobile Money</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: rgba(124, 58, 237, 0.12); color: #7C3AED;">📝</div>
          <div class="stat-info">
            <div class="stat-value">1 Task</div>
            <div class="stat-label">Science Journal HW</div>
            <div class="stat-trend trend-up">Due on Oct 10</div>
          </div>
        </div>
      </div>

      <!-- Detail Widgets -->
      <div class="dashboard-sections-grid">
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">🏅 Academic Performance & Marks Breakdown</h3>
            <button class="btn btn-primary btn-sm" onclick="window.generateReportCardModal('${activeChild.id}')">
              📄 View Official Report Card
            </button>
          </div>
          <div class="card-body" style="padding: 0;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Maximum</th>
                  <th>Obtained</th>
                  <th>Grade</th>
                  <th>Teacher Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${res ? res.subjects.map(s => `
                  <tr>
                    <td><strong>${s.name}</strong></td>
                    <td>${s.max}</td>
                    <td><strong style="color: #1E3A8A;">${s.obtained}</strong></td>
                    <td><span class="badge badge-success">${s.grade}</span></td>
                    <td style="font-size: 0.8rem; color: var(--text-muted);">${s.remarks}</td>
                  </tr>
                `).join('') : `
                  <tr><td colspan="5" style="text-align: center; padding: 20px;">No examination marks recorded yet.</td></tr>
                `}
              </tbody>
            </table>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 18px;">
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">💳 Fee Clearance & Receipts</h3>
            </div>
            <div class="card-body">
              <div style="margin-bottom: 12px; font-size: 0.85rem;">
                <div>Invoice Number: <strong>${invoice ? invoice.invoiceNo : 'BFS-INV-1001'}</strong></div>
                <div>Status: <span class="badge badge-success">${invoice ? invoice.status : 'Paid'}</span></div>
                <div>Receipt: <strong>${invoice ? invoice.receiptNo : 'REC-2026-981'}</strong></div>
              </div>
              <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="window.viewReceiptModal('${invoice?.receiptNo || 'REC-2026-981'}')">
                🧾 Download Payment Voucher
              </button>
            </div>
          </div>

          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">👨‍🏫 Class Teacher Incharge</h3>
            </div>
            <div class="card-body">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <div style="font-size: 2rem;">👨‍🏫</div>
                <div>
                  <div style="font-weight: 700;">Sir Ahmed Raza</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Head of Mathematics & Homeroom</div>
                </div>
              </div>
              <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="window.Router.navigateTo('communication')">
                💬 Send Direct Message
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  window.switchActiveChild = function(childId) {
    activeChild = children.find(c => c.id === childId) || children[0];
    renderPortal();
    window.showToast(`Switched view to ${activeChild.name}`, "info");
  };

  renderPortal();
};

window.Router.register('parent', window.renderParent);
