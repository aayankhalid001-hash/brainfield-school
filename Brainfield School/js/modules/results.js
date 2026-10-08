/**
 * Brainfield School - Results & Report Cards Module
 * Academic marksheets, CGPA calculation, class ranking, and printable official transcripts.
 */

window.renderResults = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const isRTL = window.I18n.isRTL();
  const results = db.getResults();

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1>🏅 ${t('navResults')}</h1>
        <p class="view-subtitle">Term examinations, subject-wise grading, performance transcripts and official report cards.</p>
      </div>
      <div class="view-actions-group">
        <button class="btn btn-primary" onclick="window.generateReportCardModal('s1')">
          🖨️ ${t('officialTranscript')}
        </button>
      </div>
    </div>

    <div class="content-card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student</th>
                <th>Grade</th>
                <th>Examination Term</th>
                <th>Marks Obtained</th>
                <th>Percentage</th>
                <th>Grade & CGPA</th>
                <th>Class Rank</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${results.map(res => `
                <tr>
                  <td><strong>${res.rollNo}</strong></td>
                  <td>
                    <div style="font-weight: 600; color: var(--text-main);">${res.studentName}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${res.grade} - ${res.section}</div>
                  </td>
                  <td><span class="badge badge-info">${res.grade}</span></td>
                  <td>${res.term}</td>
                  <td><strong>${res.totalObtained}</strong> / ${res.totalMax}</td>
                  <td><strong>${res.percentage}%</strong></td>
                  <td>
                    <span class="badge badge-success">${res.overallGrade} (GPA: ${res.cgpa})</span>
                  </td>
                  <td><span class="badge badge-warning">${res.classRank}</span></td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="window.generateReportCardModal('${res.studentId}')">
                      📄 View Report Card
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

window.generateReportCardModal = function(studentId) {
  const res = window.DB.getResultByStudent(studentId) || window.DB.getResults()[0];
  const info = window.DB.data.schoolInfo;

  const modalHTML = `
    <div class="modal-backdrop open" id="report-card-modal">
      <div class="modal-card modal-lg">
        <div class="modal-header">
          <h3 class="modal-title">Official Student Transcript</h3>
          <button class="modal-close-btn" onclick="document.getElementById('report-card-modal').remove()">×</button>
        </div>
        <div class="modal-body" id="printable-report-card-area">
          <div class="official-document">
            <!-- Letterhead -->
            <div class="official-header">
              <img src="assets/logo.jpg" alt="Brainfield Crest" class="official-logo" />
              <h1 class="official-title">${info.name}</h1>
              <div class="official-subtitle">${info.tagline}</div>
              <div style="font-size: 0.78rem; color: #64748B; margin-top: 2px;">
                ${info.address} &bull; Reg: ${info.registrationNo}
              </div>
              <div style="font-size: 1rem; font-weight: 700; color: #1E3A8A; margin-top: 10px; letter-spacing: 0.05em;">
                OFFICIAL ACADEMIC PROGRESS REPORT &bull; ${res.term.toUpperCase()}
              </div>
            </div>

            <!-- Student Metadata Grid -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 14px; margin-bottom: 18px; font-size: 0.88rem; background: #F8FAFC; padding: 12px; border-radius: 6px;">
              <div>
                <div>Student Name: <strong>${res.studentName}</strong></div>
                <div>Class & Section: <strong>${res.grade} - Section ${res.section}</strong></div>
                <div>Roll Number: <strong>${res.rollNo}</strong></div>
              </div>
              <div>
                <div>Academic Session: <strong>${info.academicYear}</strong></div>
                <div>Attendance Rate: <strong>${res.attendancePercentage}%</strong></div>
                <div>Class Standing: <strong style="color: #059669;">${res.classRank}</strong></div>
              </div>
            </div>

            <!-- Subject Scores Table -->
            <table class="official-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th style="text-align: center;">Maximum Marks</th>
                  <th style="text-align: center;">Marks Obtained</th>
                  <th style="text-align: center;">Grade</th>
                  <th style="text-align: center;">Grade Points (GPA)</th>
                  <th>Faculty Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${res.subjects.map(s => `
                  <tr>
                    <td><strong>${s.name}</strong></td>
                    <td style="text-align: center;">${s.max}</td>
                    <td style="text-align: center; font-weight: 700;">${s.obtained}</td>
                    <td style="text-align: center;"><span class="badge badge-success">${s.grade}</span></td>
                    <td style="text-align: center;">${s.gpa.toFixed(1)}</td>
                    <td style="font-size: 0.8rem; color: #475569;">${s.remarks}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr style="background: #F1F5F9; font-weight: 700;">
                  <td>AGGREGATE TOTAL</td>
                  <td style="text-align: center;">${res.totalMax}</td>
                  <td style="text-align: center; color: #1E3A8A; font-size: 1rem;">${res.totalObtained}</td>
                  <td style="text-align: center;">${res.overallGrade}</td>
                  <td style="text-align: center;">${res.cgpa.toFixed(2)}</td>
                  <td>Percentage: <strong>${res.percentage}%</strong></td>
                </tr>
              </tfoot>
            </table>

            <!-- Comments & Signatures -->
            <div style="margin-top: 18px; padding: 10px; background: #F8FAFC; border-left: 3px solid #1E3A8A; font-size: 0.85rem;">
              <strong>Principal & Homeroom Assessment:</strong>
              <div style="margin-top: 4px; color: #334155;">"${res.teacherComments}"</div>
            </div>

            <div class="signature-row">
              <div class="signature-box">
                <div>Sir Ahmed Raza</div>
                <div style="font-size: 0.72rem; color: #64748B;">Class Teacher Incharge</div>
              </div>
              <div class="signature-box">
                <div style="color: #059669; font-weight: 800;">[ OFFICIAL SEAL ]</div>
                <div style="font-size: 0.72rem; color: #64748B;">Verified Registrar</div>
              </div>
              <div class="signature-box">
                <div>${res.principalSignature}</div>
                <div style="font-size: 0.72rem; color: #64748B;">Principal & Director</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('report-card-modal').remove()">Close</button>
          <button class="btn btn-primary" onclick="window.printReportCardArea()">🖨️ Print / Save PDF</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.printReportCardArea = function() {
  window.print();
};

window.Router.register('results', window.renderResults);
