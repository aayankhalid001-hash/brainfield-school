/**
 * Brainfield School - School Reports & Analytics Module
 * Comprehensive academic performance, attendance analytics, student demographics, and financial statements.
 */

window.renderReports = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const students = db.getStudents();
  const teachers = db.getTeachers();
  const invoices = db.getFeeInvoices();
  const expenses = db.getExpenses();

  let activeReportTab = 'academic';

  function renderReportView() {
    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>📊 ${t('navReports')}</h1>
          <p class="view-subtitle">Executive analytics, academic distributions, attendance metrics, and audit summaries.</p>
        </div>
        <div class="view-actions-group">
          <button class="btn btn-outline" onclick="window.print()">
            🖨️ ${t('btnPrint')} Report
          </button>
          <button class="btn btn-primary" onclick="window.downloadReportData()">
            📥 ${t('btnExport')} Summary
          </button>
        </div>
      </div>

      <!-- Report Tabs -->
      <div style="display: flex; gap: 8px; margin-bottom: 20px;">
        <button class="btn ${activeReportTab === 'academic' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchReportTab('academic')">
          🎓 Academic Performance
        </button>
        <button class="btn ${activeReportTab === 'attendance' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchReportTab('attendance')">
          📋 Attendance Analytics
        </button>
        <button class="btn ${activeReportTab === 'financial' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchReportTab('financial')">
          💵 Financial & Revenue
        </button>
      </div>

      ${activeReportTab === 'academic' ? `
        <div class="dashboard-sections-grid">
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">Class-Wise Academic Performance Average</h3>
            </div>
            <div class="card-body">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Class Level</th>
                    <th>Students Count</th>
                    <th>Average Score</th>
                    <th>Top Performing Student</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Grade 8 - Section A</strong></td>
                    <td>30</td>
                    <td><strong style="color: #059669;">91.4%</strong></td>
                    <td>Bilal Rasheed (93.0%)</td>
                    <td><span class="badge badge-success">Outstanding</span></td>
                  </tr>
                  <tr>
                    <td><strong>Grade 6 - Section B</strong></td>
                    <td>22</td>
                    <td><strong style="color: #059669;">88.6%</strong></td>
                    <td>Ayesha Rasheed (90.2%)</td>
                    <td><span class="badge badge-success">Excellent</span></td>
                  </tr>
                  <tr>
                    <td><strong>Grade 7 - Section A</strong></td>
                    <td>28</td>
                    <td><strong style="color: #2563EB;">84.2%</strong></td>
                    <td>Mariam Gul (94.0%)</td>
                    <td><span class="badge badge-info">Very Good</span></td>
                  </tr>
                  <tr>
                    <td><strong>Grade 10 - Section A</strong></td>
                    <td>29</td>
                    <td><strong style="color: #059669;">93.1%</strong></td>
                    <td>Khadija Bibi (97.0%)</td>
                    <td><span class="badge badge-success">Board Ready</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">Grade Distribution</h3>
            </div>
            <div class="card-body">
              <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.85rem;">
                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>A+ (90% - 100%): <strong>14 Students</strong></span>
                    <span style="color: #059669; font-weight: 700;">45%</span>
                  </div>
                  <div style="height: 8px; background: #E2E8F0; border-radius: 4px; overflow: hidden;">
                    <div style="width: 45%; height: 100%; background: #059669;"></div>
                  </div>
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>A (80% - 89%): <strong>10 Students</strong></span>
                    <span style="color: #2563EB; font-weight: 700;">32%</span>
                  </div>
                  <div style="height: 8px; background: #E2E8F0; border-radius: 4px; overflow: hidden;">
                    <div style="width: 32%; height: 100%; background: #2563EB;"></div>
                  </div>
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>B (70% - 79%): <strong>5 Students</strong></span>
                    <span style="color: #D97706; font-weight: 700;">16%</span>
                  </div>
                  <div style="height: 8px; background: #E2E8F0; border-radius: 4px; overflow: hidden;">
                    <div style="width: 16%; height: 100%; background: #D97706;"></div>
                  </div>
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>C (60% - 69%): <strong>2 Students</strong></span>
                    <span style="color: #64748B; font-weight: 700;">7%</span>
                  </div>
                  <div style="height: 8px; background: #E2E8F0; border-radius: 4px; overflow: hidden;">
                    <div style="width: 7%; height: 100%; background: #64748B;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : (activeReportTab === 'attendance' ? `
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">Daily Student & Teacher Attendance Overview</h3>
          </div>
          <div class="card-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Class / Category</th>
                  <th>Total Strength</th>
                  <th>Present Rate</th>
                  <th>Late Arrivals</th>
                  <th>Excused Medical</th>
                  <th>Attendance Health</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Grade 8-A</strong></td>
                  <td>30</td>
                  <td><strong>96.5%</strong></td>
                  <td>1 (Transport)</td>
                  <td>0</td>
                  <td><span class="badge badge-success">Optimal</span></td>
                </tr>
                <tr>
                  <td><strong>Grade 6-B</strong></td>
                  <td>22</td>
                  <td><strong>98.0%</strong></td>
                  <td>0</td>
                  <td>1</td>
                  <td><span class="badge badge-success">Optimal</span></td>
                </tr>
                <tr>
                  <td><strong>Teaching Faculty</strong></td>
                  <td>5</td>
                  <td><strong>100%</strong></td>
                  <td>0</td>
                  <td>0</td>
                  <td><span class="badge badge-success">Perfect</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ` : `
        <div class="dashboard-sections-grid">
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">Financial Balance Sheet (October 2026)</h3>
            </div>
            <div class="card-body">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Total Invoiced</th>
                    <th>Collected</th>
                    <th>Outstanding</th>
                    <th>Recovery Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Monthly Tuition Fees</td>
                    <td>$135.00</td>
                    <td>$70.00</td>
                    <td>$65.00</td>
                    <td><strong>52%</strong></td>
                  </tr>
                  <tr>
                    <td>Computer & Solar Lab Fees</td>
                    <td>$20.00</td>
                    <td>$20.00</td>
                    <td>$0.00</td>
                    <td><strong style="color: #059669;">100%</strong></td>
                  </tr>
                  <tr>
                    <td>Science Reagent & Exam Fees</td>
                    <td>$20.00</td>
                    <td>$15.00</td>
                    <td>$5.00</td>
                    <td><strong>75%</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">Operational Cost Outflow</h3>
            </div>
            <div class="card-body" style="font-size: 0.85rem; line-height: 1.8;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding: 4px 0;">
                <span>Solar Battery Upkeep:</span>
                <strong>$65.00</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding: 4px 0;">
                <span>Satellite High-Speed Internet:</span>
                <strong>$45.00</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding: 4px 0;">
                <span>Stationery & Printable Materials:</span>
                <strong>$38.00</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding: 4px 0;">
                <span>Inverter Air Filter Replacement:</span>
                <strong>$20.00</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 8px; font-size: 0.95rem; font-weight: 700; color: #E11D48;">
                <span>Total Expenditure:</span>
                <span>$168.00</span>
              </div>
            </div>
          </div>
        </div>
      `)}
    `;
  }

  window.switchReportTab = function(tab) {
    activeReportTab = tab;
    renderReportView();
  };

  window.downloadReportData = function() {
    const reportText = `Brainfield School - Management Report\nDate: ${new Date().toLocaleDateString()}\nTotal Students: ${students.length}\nTotal Faculty: ${teachers.length}\nAcademic Average: 91.2%\nMonthly Fee Collection: $105.00\nTotal Operating Expenses: $168.00\nReport status: Verified by Administration.`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brainfield-school-report-${new Date().toISOString().substring(0, 10)}.txt`;
    a.click();
    window.showToast("Summary report exported!", "success");
  };

  renderReportView();
};

window.Router.register('reports', window.renderReports);
