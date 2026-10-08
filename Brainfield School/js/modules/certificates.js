/**
 * Brainfield School - Certificates Module
 * Generate and print official Academic Merit, Character, and Transfer Certificates.
 */

window.renderCertificates = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const certs = db.getCertificates();
  const students = db.getStudents();

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-group">
        <h1>📜 ${t('navCertificates')}</h1>
        <p class="view-subtitle">Generate official printable certificates with school insignia and verification seals.</p>
      </div>
      <div class="view-actions-group">
        <button class="btn btn-primary" onclick="window.openCreateCertModal()">
          ➕ Issue New Certificate
        </button>
      </div>
    </div>

    <div class="content-card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Certificate #</th>
                <th>Recipient Student</th>
                <th>Certificate Type</th>
                <th>Date Issued</th>
                <th>Signatory</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${certs.map(c => `
                <tr>
                  <td><strong>${c.certNo}</strong></td>
                  <td><strong>${c.studentName}</strong></td>
                  <td><span class="badge badge-success">${c.type}</span></td>
                  <td>${c.date}</td>
                  <td>${c.signedBy}</td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="window.previewCertificateModal('${c.id}')">
                      🖨️ View & Print
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

window.previewCertificateModal = function(certId) {
  const c = window.DB.getCertificates().find(item => item.id === certId) || window.DB.getCertificates()[0];
  const info = window.DB.data.schoolInfo;

  const modalHTML = `
    <div class="modal-backdrop open" id="cert-view-modal">
      <div class="modal-card modal-lg">
        <div class="modal-header">
          <h3 class="modal-title">Official Certificate Preview</h3>
          <button class="modal-close-btn" onclick="document.getElementById('cert-view-modal').remove()">×</button>
        </div>
        <div class="modal-body" id="printable-certificate-area">
          <div style="border: 8px double #1E3A8A; padding: 36px; background: #FFFFFF; text-align: center; position: relative; border-radius: 4px;">
            <div style="border: 1px solid #D97706; padding: 24px;">
              <img src="assets/logo.jpg" alt="Logo" style="width: 75px; height: 75px; margin: 0 auto 10px; display: block;" />
              
              <h2 style="font-size: 1.8rem; font-weight: 800; color: #1E3A8A; letter-spacing: 0.05em; text-transform: uppercase;">
                ${info.name}
              </h2>
              <div style="font-size: 0.88rem; color: #D97706; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
                ${info.tagline}
              </div>
              <div style="font-size: 0.75rem; color: #64748B; margin-bottom: 24px;">
                ${info.address} &bull; Reg: ${info.registrationNo}
              </div>

              <div style="font-size: 1.4rem; font-weight: 700; color: #0F172A; text-decoration: underline; margin-bottom: 20px;">
                ${c.title || c.type}
              </div>

              <p style="font-size: 1rem; color: #334155; margin-bottom: 12px; font-style: italic;">
                This document is officially conferred upon
              </p>

              <h1 style="font-size: 2.2rem; font-weight: 800; color: #1E3A8A; margin-bottom: 14px; letter-spacing: 0.02em;">
                ${c.studentName}
              </h1>

              <p style="font-size: 0.95rem; color: #334155; max-width: 600px; margin: 0 auto 30px; line-height: 1.6;">
                ${c.reason}
              </p>

              <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding: 0 30px;">
                <div style="text-align: center; width: 180px;">
                  <div style="font-size: 0.85rem; font-weight: 600;">${c.date}</div>
                  <div style="border-top: 1px solid #64748B; padding-top: 4px; font-size: 0.72rem; color: #64748B;">Date of Conformance</div>
                </div>

                <div style="width: 80px; height: 80px; border: 3px double #D97706; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 800; color: #D97706; transform: rotate(-10deg);">
                  GOLD SEAL<br/>BFS VERIFIED
                </div>

                <div style="text-align: center; width: 180px;">
                  <div style="font-size: 0.85rem; font-weight: 600;">Dr. Tariq Mahmood</div>
                  <div style="border-top: 1px solid #64748B; padding-top: 4px; font-size: 0.72rem; color: #64748B;">Principal & Academic Director</div>
                </div>
              </div>

              <div style="font-size: 0.7rem; color: #94A3B8; margin-top: 24px;">
                Certificate Number: <code>${c.certNo}</code> &bull; Verified Online via Brainfield School System
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('cert-view-modal').remove()">Close</button>
          <button class="btn btn-primary" onclick="window.print()">🖨️ Print Certificate</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.openCreateCertModal = function() {
  const students = window.DB.getStudents();

  const modalHTML = `
    <div class="modal-backdrop open" id="create-cert-modal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">📜 Issue Official Student Certificate</h3>
          <button class="modal-close-btn" onclick="document.getElementById('create-cert-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Select Student *</label>
            <select class="form-select" id="cert-student" style="width: 100%;">
              ${students.map(s => `<option value="${s.name}">${s.name} (${s.grade} - ${s.rollNo})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Certificate Type *</label>
            <select class="form-select" id="cert-type" style="width: 100%;">
              <option value="Academic Excellence Award">Certificate of Academic Excellence</option>
              <option value="Character Certificate">Certificate of Character & Good Conduct</option>
              <option value="School Leaving Certificate">School Leaving & Transfer Certificate (TC)</option>
              <option value="Special Distinction Award">Distinction in Science & Community Leadership</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Citation / Commendation *</label>
            <textarea class="form-textarea" id="cert-reason" rows="3" style="width: 100%;" placeholder="State reason, position, or achievement..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('create-cert-modal').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="window.submitCreateCert()">Generate Certificate</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.submitCreateCert = function() {
  const student = document.getElementById('cert-student')?.value;
  const type = document.getElementById('cert-type')?.value;
  const reason = document.getElementById('cert-reason')?.value;

  if (!student || !reason) {
    window.showToast("Please provide student and reason citation", "warning");
    return;
  }

  const cert = window.DB.issueCertificate({
    studentName: student,
    type: type,
    title: type,
    reason: reason,
    signedBy: "Dr. Tariq Mahmood, Principal"
  });

  document.getElementById('create-cert-modal')?.remove();
  window.showToast(`Certificate #${cert.certNo} issued!`, "success");
  window.Router.refreshCurrentView();
  window.previewCertificateModal(cert.id);
};

window.Router.register('certificates', window.renderCertificates);
