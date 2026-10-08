/**
 * Brainfield School - Dashboard Module
 * Tailors KPIs, stats, quick actions and alerts dynamically per user role.
 */

window.renderDashboard = function(container) {
  const user = window.Auth.getCurrentUser();
  const db = window.DB.data;
  const t = (k) => window.I18n.t(k);
  const isRTL = window.I18n.isRTL();

  // Basic aggregates
  const totalStudents = db.students.length;
  const totalTeachers = db.teachers.length;
  const activeClasses = db.classes.length;
  const pendingAdmissions = db.admissions.filter(a => a.status === 'Pending').length;
  
  // Calculate attendance rate
  const todayRecords = db.attendance.filter(a => a.date === '2026-10-07');
  const presentCount = todayRecords.filter(a => a.status === 'Present').length;
  const attendancePercent = todayRecords.length > 0 
    ? Math.round((presentCount / todayRecords.length) * 100) 
    : 95;

  // Calculate monthly fees
  const totalCollected = db.fees.invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalDue = db.fees.invoices.reduce((sum, inv) => sum + (inv.netPayable - (inv.paidAmount || 0)), 0);

  let html = `
    <div class="view-header">
      <div class="view-title-group">
        <h1>${t('welcome')}, ${isRTL && user.nameAr ? user.nameAr : user.name}!</h1>
        <p class="view-subtitle">${db.schoolInfo.name} &bull; ${user.roleTitle || user.role} &bull; ${t('villageTag')}</p>
      </div>
      <div class="view-actions-group">
        <span class="bandwidth-indicator">
          <span class="pulse-dot"></span>
          <span>${t('lowBandwidthBadge')}</span>
        </span>
        <button class="btn btn-outline btn-sm" onclick="window.Router.navigateTo('calendar')">
          📅 ${db.schoolInfo.academicYear}
        </button>
      </div>
    </div>
  `;

  // Render role-specific stats
  if (user.role === 'admin' || user.role === 'principal') {
    html += `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: rgba(37, 99, 235, 0.12); color: #2563EB;">👨‍🎓</div>
          <div class="stat-info">
            <div class="stat-value">${totalStudents}</div>
            <div class="stat-label">${t('statsTotalStudents')}</div>
            <div class="stat-trend trend-up">↑ 100% Village Enrollment</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: rgba(5, 150, 105, 0.12); color: #059669;">👨‍🏫</div>
          <div class="stat-info">
            <div class="stat-value">${totalTeachers}</div>
            <div class="stat-label">${t('statsTotalTeachers')}</div>
            <div class="stat-trend trend-up">All Faculty Present</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: rgba(124, 58, 237, 0.12); color: #7C3AED;">📊</div>
          <div class="stat-info">
            <div class="stat-value">${attendancePercent}%</div>
            <div class="stat-label">${t('statsAvgAttendance')}</div>
            <div class="stat-trend trend-up">↑ 2.4% vs last week</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: rgba(217, 119, 6, 0.12); color: #D97706;">💰</div>
          <div class="stat-info">
            <div class="stat-value">$${totalCollected}</div>
            <div class="stat-label">${t('statsFeeCollection')}</div>
            <div class="stat-trend trend-up">Due Balance: $${totalDue}</div>
          </div>
        </div>
      </div>
    `;
  } else if (user.role === 'teacher') {
    html += `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #EEF2FF; color: #2563EB;">🏫</div>
          <div class="stat-info">
            <div class="stat-value">3 Classes</div>
            <div class="stat-label">Assigned Grades (5, 7, 8)</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #ECFDF5; color: #059669;">📝</div>
          <div class="stat-info">
            <div class="stat-value">2 Active</div>
            <div class="stat-label">Homework to Grade</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #FEF3C7; color: #D97706;">🎥</div>
          <div class="stat-info">
            <div class="stat-value">1 Live</div>
            <div class="stat-label">Scheduled Virtual Session</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #F3E8FF; color: #7C3AED;">🏆</div>
          <div class="stat-info">
            <div class="stat-value">93.2%</div>
            <div class="stat-label">Math Class Average</div>
          </div>
        </div>
      </div>
    `;
  } else if (user.role === 'student') {
    html += `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #EEF2FF; color: #2563EB;">📈</div>
          <div class="stat-info">
            <div class="stat-value">96%</div>
            <div class="stat-label">My Overall Attendance</div>
            <div class="stat-trend trend-up">Excellent Record</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #ECFDF5; color: #059669;">🏅</div>
          <div class="stat-info">
            <div class="stat-value">A+ (3.94)</div>
            <div class="stat-label">Latest Term CGPA</div>
            <div class="stat-trend trend-up">Class 1st Position</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #FEF3C7; color: #D97706;">📚</div>
          <div class="stat-info">
            <div class="stat-value">3 Courses</div>
            <div class="stat-label">Active LMS Enrolled</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #FCE7F3; color: #DB2777;">✏️</div>
          <div class="stat-info">
            <div class="stat-value">1 Due</div>
            <div class="stat-label">Science Journal HW</div>
          </div>
        </div>
      </div>
    `;
  } else if (user.role === 'parent') {
    html += `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #EEF2FF; color: #2563EB;">👨‍👧‍👦</div>
          <div class="stat-info">
            <div class="stat-value">2 Children</div>
            <div class="stat-label">Bilal (Gr 8) & Ayesha (Gr 6)</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #ECFDF5; color: #059669;">✅</div>
          <div class="stat-info">
            <div class="stat-value">All Present</div>
            <div class="stat-label">Today's Class Attendance</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #FEF3C7; color: #D97706;">💳</div>
          <div class="stat-info">
            <div class="stat-value">$0.00 Due</div>
            <div class="stat-label">October Fees Paid in Full</div>
            <div class="stat-trend trend-up">Receipt #REC-2026-981</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #F3E8FF; color: #7C3AED;">💬</div>
          <div class="stat-info">
            <div class="stat-value">1 Unread</div>
            <div class="stat-label">Message from Ms. Fatima</div>
          </div>
        </div>
      </div>
    `;
  } else if (user.role === 'accountant') {
    html += `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #ECFDF5; color: #059669;">💵</div>
          <div class="stat-info">
            <div class="stat-value">$${totalCollected}.00</div>
            <div class="stat-label">Total Monthly Collection</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #FEF3C7; color: #D97706;">⏳</div>
          <div class="stat-info">
            <div class="stat-value">$${totalDue}.00</div>
            <div class="stat-label">Outstanding Balances</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #FEE2E2; color: #DC2626;">🧾</div>
          <div class="stat-info">
            <div class="stat-value">$168.00</div>
            <div class="stat-label">Solar & Operations Expenses</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #EEF2FF; color: #2563EB;">📄</div>
          <div class="stat-info">
            <div class="stat-value">${db.fees.receipts.length} Issued</div>
            <div class="stat-label">Total Receipts this Term</div>
          </div>
        </div>
      </div>
    `;
  }

  // Dashboard 2-column Layout
  html += `
    <div class="dashboard-sections-grid">
      <!-- Left Column: Primary Operational Widget -->
      <div class="content-card">
        <div class="card-header">
          <h2 class="card-title">📅 ${t('upcomingSchedule')} (Grade 8-A)</h2>
          <button class="btn btn-outline btn-sm" onclick="window.Router.navigateTo('timetable')">
            ${t('btnDetails')} →
          </button>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>${t('subject')}</th>
                  <th>${t('teacher')}</th>
                  <th>Room / Online Link</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Period 1</strong> (08:30)</td>
                  <td>Mathematics</td>
                  <td>Sir Ahmed Raza</td>
                  <td><span class="badge badge-info">Smart Hall / 202</span></td>
                  <td>
                    <button class="btn btn-primary btn-sm" onclick="window.Router.navigateTo('liveclass')">
                      🎥 ${t('btnJoin')}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><strong>Period 2</strong> (09:15)</td>
                  <td>General Science</td>
                  <td>Ms. Fatima Noor</td>
                  <td><span class="badge badge-success">Science Lab</span></td>
                  <td><span class="badge badge-neutral">In-person</span></td>
                </tr>
                <tr>
                  <td><strong>Period 3</strong> (10:15)</td>
                  <td>English Grammar</td>
                  <td>Mr. Zahid Hussain</td>
                  <td><span class="badge badge-info">Room 202</span></td>
                  <td><span class="badge badge-neutral">In-person</span></td>
                </tr>
                <tr>
                  <td><strong>Period 4</strong> (11:00)</td>
                  <td>Computer Literacy</td>
                  <td>Engr. Salman Faris</td>
                  <td><span class="badge badge-warning">Solar Lab</span></td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="window.Router.navigateTo('lms')">
                      💻 LMS Notes
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column: Announcements & Quick Workflows -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">📢 ${t('recentAnnouncements')}</h2>
            <button class="btn btn-outline btn-sm" onclick="window.Router.navigateTo('communication')">+</button>
          </div>
          <div class="card-body" style="display: flex; flex-direction: column; gap: 14px;">
            ${db.announcements.slice(0, 2).map(ann => `
              <div style="border-left: 3px solid var(--primary-600); padding-left: 10px;">
                <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-main);">
                  ${isRTL && ann.titleAr ? ann.titleAr : ann.title}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin: 2px 0 4px;">
                  📅 ${ann.date} &bull; ${ann.author}
                </div>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">
                  ${ann.content.substring(0, 110)}...
                </p>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">⚡ ${t('quickActions')}</h2>
          </div>
          <div class="card-body" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button class="btn btn-outline" style="font-size: 0.8rem;" onclick="window.Router.navigateTo('attendance')">
              📋 Mark Attendance
            </button>
            <button class="btn btn-outline" style="font-size: 0.8rem;" onclick="window.Router.navigateTo('liveclass')">
              🎥 Virtual Classroom
            </button>
            <button class="btn btn-outline" style="font-size: 0.8rem;" onclick="window.Router.navigateTo('homework')">
              📝 Homework
            </button>
            <button class="btn btn-outline" style="font-size: 0.8rem;" onclick="window.Router.navigateTo('results')">
              🏅 Report Cards
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
};

// Register in router
window.Router.register('dashboard', window.renderDashboard);
