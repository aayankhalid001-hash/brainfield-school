/**
 * Brainfield School - Homework & Assignments Module
 * Create assignments, student submission portal, teacher grading and feedback workflow.
 */

window.renderHomework = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const isRTL = window.I18n.isRTL();
  const user = window.Auth.getCurrentUser();
  const isTeacherOrAdmin = user.role === 'teacher' || user.role === 'admin' || user.role === 'principal';
  const hwList = db.getHomework();

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1>📝 ${t('navHomework')}</h1>
        <p class="view-subtitle">Course assignments, student submissions, evaluation scores and teacher feedback.</p>
      </div>
      <div class="view-actions-group">
        ${isTeacherOrAdmin ? `
          <button class="btn btn-primary" onclick="window.openCreateHomeworkModal()">
            ➕ Create Homework
          </button>
        ` : ''}
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 18px;">
      ${hwList.map(hw => {
        // Check student's submission status if student or parent
        const mySub = hw.submissions?.find(s => s.studentId === 's1');
        let statusBadge = '<span class="badge badge-warning">Pending Submission</span>';
        if (mySub) {
          if (mySub.status === 'Graded') {
            statusBadge = `<span class="badge badge-success">Graded: ${mySub.marksObtained}/${hw.maxMarks}</span>`;
          } else {
            statusBadge = '<span class="badge badge-info">Submitted & Awaiting Grading</span>';
          }
        }

        return `
          <div class="content-card">
            <div class="card-header">
              <div>
                <span class="badge badge-info" style="margin-bottom: 4px;">${hw.subject} &bull; ${hw.grade}</span>
                <h3 class="card-title">${isRTL && hw.titleAr ? hw.titleAr : hw.title}</h3>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 0.75rem; color: var(--text-muted);">Due Date: <strong>${hw.dueDate}</strong></div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Max Marks: <strong>${hw.maxMarks}</strong></div>
              </div>
            </div>
            <div class="card-body">
              <p style="font-size: 0.88rem; color: var(--text-main); margin-bottom: 14px; line-height: 1.5;">
                ${hw.description}
              </p>

              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 12px; flex-wrap: gap: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 0.78rem; color: var(--text-muted);">Teacher: <strong>${hw.teacher}</strong></span>
                  ${statusBadge}
                </div>

                <div style="display: flex; gap: 8px;">
                  ${isTeacherOrAdmin ? `
                    <button class="btn btn-primary btn-sm" onclick="window.openTeacherGradingModal('${hw.id}')">
                      📋 Review & Grade Submissions (${hw.submissions?.length || 0})
                    </button>
                  ` : `
                    <button class="btn btn-primary btn-sm" onclick="window.openStudentSubmitHWModal('${hw.id}')">
                      📤 ${mySub ? 'Resubmit Assignment' : 'Submit Assignment'}
                    </button>
                  `}
                </div>
              </div>

              ${mySub && mySub.feedback ? `
                <div style="margin-top: 12px; padding: 10px 14px; background: rgba(5, 150, 105, 0.08); border-left: 3px solid var(--accent-emerald); border-radius: var(--radius-sm); font-size: 0.82rem;">
                  <strong>Teacher Feedback (${mySub.gradedBy || hw.teacher}):</strong>
                  <div style="margin-top: 2px; color: var(--text-main);">${mySub.feedback}</div>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
};

window.openStudentSubmitHWModal = function(hwId) {
  const hw = window.DB.getHomework().find(h => h.id === hwId);
  if (!hw) return;

  const modalHTML = `
    <div class="modal-backdrop open" id="submit-hw-modal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">📤 Submit Homework: ${hw.title}</h3>
          <button class="modal-close-btn" onclick="document.getElementById('submit-hw-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Written Answer / Solution Notes *</label>
            <textarea class="form-textarea" id="sub-hw-text" rows="4" style="width: 100%;" placeholder="Write your calculations, summary, or response here..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Attach File / Photo of Notebook (Simulated)</label>
            <input type="text" class="form-input" id="sub-hw-file" value="Notebook_Solution_Photo.jpg" style="width: 100%;" />
            <span style="font-size: 0.72rem; color: var(--text-muted);">Compatible with compressed low-bandwidth image uploads.</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('submit-hw-modal').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="window.submitStudentHW('${hw.id}')">Submit Solution</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.submitStudentHW = function(hwId) {
  const text = document.getElementById('sub-hw-text')?.value;
  const fileName = document.getElementById('sub-hw-file')?.value;

  if (!text) {
    window.showToast("Please provide solution notes or calculations", "warning");
    return;
  }

  const currentUser = window.Auth.getCurrentUser();
  window.DB.submitHomework(hwId, {
    studentId: currentUser.studentId || 's1',
    studentName: currentUser.name || 'Bilal Rasheed',
    textAnswer: text,
    fileName: fileName || 'homework_solution.pdf'
  });

  document.getElementById('submit-hw-modal')?.remove();
  window.showToast("Homework submitted successfully!", "success");
  window.Router.refreshCurrentView();
};

window.openTeacherGradingModal = function(hwId) {
  const hw = window.DB.getHomework().find(h => h.id === hwId);
  if (!hw) return;

  const subs = hw.submissions || [];

  const modalHTML = `
    <div class="modal-backdrop open" id="grading-modal">
      <div class="modal-card modal-lg">
        <div class="modal-header">
          <h3 class="modal-title">📋 Grade Submissions: ${hw.title} (Max: ${hw.maxMarks})</h3>
          <button class="modal-close-btn" onclick="document.getElementById('grading-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          ${subs.length === 0 ? '<p style="text-align: center; color: var(--text-muted); padding: 20px;">No submissions received yet for this assignment.</p>' : `
            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${subs.map(s => `
                <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; background: var(--bg-surface-alt);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div>
                      <strong style="font-size: 0.95rem;">${s.studentName}</strong>
                      <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 8px;">Submitted: ${s.submittedDate}</span>
                    </div>
                    <span class="badge ${s.status === 'Graded' ? 'badge-success' : 'badge-warning'}">${s.status}</span>
                  </div>

                  <div style="background: var(--bg-surface); padding: 10px; border-radius: var(--radius-sm); font-size: 0.85rem; margin-bottom: 10px;">
                    <strong>Student Response:</strong>
                    <p style="margin-top: 4px; color: var(--text-main);">${s.textAnswer}</p>
                    <div style="font-size: 0.75rem; color: var(--primary-600); margin-top: 4px;">📎 Attachment: ${s.fileName || 'file.pdf'}</div>
                  </div>

                  <div style="display: grid; grid-template-columns: 140px 1fr 100px; gap: 10px; align-items: center;">
                    <div>
                      <label style="font-size: 0.75rem; font-weight: 600;">Marks (Max ${hw.maxMarks}):</label>
                      <input type="number" id="marks-${s.studentId}" class="form-input" style="width: 100%;" max="${hw.maxMarks}" min="0" value="${s.marksObtained !== null ? s.marksObtained : ''}" />
                    </div>
                    <div>
                      <label style="font-size: 0.75rem; font-weight: 600;">Feedback / Comments:</label>
                      <input type="text" id="feedback-${s.studentId}" class="form-input" style="width: 100%;" value="${s.feedback || ''}" placeholder="e.g. Well done! Check step 3." />
                    </div>
                    <div style="padding-top: 18px;">
                      <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="window.saveGradeItem('${hw.id}', '${s.studentId}')">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('grading-modal').remove()">Done</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.saveGradeItem = function(hwId, studentId) {
  const marks = document.getElementById(`marks-${studentId}`)?.value;
  const feedback = document.getElementById(`feedback-${studentId}`)?.value;
  const teacher = window.Auth.getCurrentUser().name || 'Teacher';

  if (marks === '') {
    window.showToast("Please enter marks", "warning");
    return;
  }

  window.DB.gradeHomework(hwId, studentId, Number(marks), feedback || 'Well completed', teacher);
  window.showToast("Grade and feedback saved!", "success");
  window.Router.refreshCurrentView();
};

window.openCreateHomeworkModal = function() {
  const modalHTML = `
    <div class="modal-backdrop open" id="create-hw-modal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">➕ Create Homework Assignment</h3>
          <button class="modal-close-btn" onclick="document.getElementById('create-hw-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input type="text" class="form-input" id="new-hw-title" required placeholder="e.g. Geometry Angles Exercise 4.1" style="width: 100%;" />
          </div>
          <div class="form-group">
            <label class="form-label">Subject *</label>
            <select class="form-select" id="new-hw-subject" style="width: 100%;">
              <option value="Mathematics">Mathematics</option>
              <option value="General Science">General Science</option>
              <option value="English">English</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Islamic Studies">Islamic Studies</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Grade / Class *</label>
            <select class="form-select" id="new-hw-grade" style="width: 100%;">
              <option value="Grade 8-A">Grade 8-A</option>
              <option value="Grade 6-B">Grade 6-B</option>
              <option value="Grade 7-A">Grade 7-A</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Due Date *</label>
            <input type="date" class="form-input" id="new-hw-date" value="2026-10-18" style="width: 100%;" />
          </div>
          <div class="form-group">
            <label class="form-label">Maximum Marks</label>
            <input type="number" class="form-input" id="new-hw-max" value="20" style="width: 100%;" />
          </div>
          <div class="form-group">
            <label class="form-label">Instructions & Details *</label>
            <textarea class="form-textarea" id="new-hw-desc" rows="3" style="width: 100%;" placeholder="State problems to solve or reading chapters."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('create-hw-modal').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="window.submitCreateHW()">Assign Homework</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.submitCreateHW = function() {
  const title = document.getElementById('new-hw-title')?.value;
  const subject = document.getElementById('new-hw-subject')?.value;
  const grade = document.getElementById('new-hw-grade')?.value;
  const dueDate = document.getElementById('new-hw-date')?.value;
  const maxMarks = document.getElementById('new-hw-max')?.value;
  const desc = document.getElementById('new-hw-desc')?.value;

  if (!title || !desc) {
    window.showToast("Please provide title and instructions", "warning");
    return;
  }

  window.DB.addHomework({
    title,
    subject,
    grade,
    dueDate,
    maxMarks: Number(maxMarks) || 20,
    description: desc,
    teacher: window.Auth.getCurrentUser().name || 'Sir Ahmed Raza'
  });

  document.getElementById('create-hw-modal')?.remove();
  window.showToast("Homework assigned to class!", "success");
  window.Router.refreshCurrentView();
};

window.Router.register('homework', window.renderHomework);
