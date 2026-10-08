/**
 * Brainfield School - Fees & Accounts Module
 * Student fee invoices, payment recording, receipts printing, and school expense tracking.
 */

window.renderFees = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const user = window.Auth.getCurrentUser();
  const invoices = db.getFeeInvoices();
  const expenses = db.getExpenses();

  let activeTab = 'invoices';

  function renderView() {
    const totalCollected = invoices.reduce((s, i) => s + (i.paidAmount || 0), 0);
    const totalDue = invoices.reduce((s, i) => s + (i.netPayable - (i.paidAmount || 0)), 0);
    const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>💰 ${t('navFees')}</h1>
          <p class="view-subtitle">Fee billing, student invoices, receipt vouchers, and rural school operating expenses.</p>
        </div>
        <div class="view-actions-group">
          <button class="btn btn-outline" onclick="window.openRecordPaymentModal()">
            💳 Record Fee Payment
          </button>
          <button class="btn btn-primary" onclick="window.openAddExpenseModal()">
            ➕ Log Expense
          </button>
        </div>
      </div>

      <!-- Financial KPI Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: rgba(5, 150, 105, 0.12); color: #059669;">💵</div>
          <div class="stat-info">
            <div class="stat-value">$${totalCollected}.00</div>
            <div class="stat-label">Collected This Month</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: rgba(217, 119, 6, 0.12); color: #D97706;">⏳</div>
          <div class="stat-info">
            <div class="stat-value">$${totalDue}.00</div>
            <div class="stat-label">Pending / Unpaid Dues</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: rgba(225, 29, 72, 0.12); color: #E11D48;">🧾</div>
          <div class="stat-info">
            <div class="stat-value">$${totalExpenses}.00</div>
            <div class="stat-label">Operational Expenses</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: rgba(37, 99, 235, 0.12); color: #2563EB;">⚖️</div>
          <div class="stat-info">
            <div class="stat-value">$${totalCollected - totalExpenses}.00</div>
            <div class="stat-label">Net Operating Reserve</div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        <button class="btn ${activeTab === 'invoices' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchFeeTab('invoices')">
          📄 Student Invoices (${invoices.length})
        </button>
        <button class="btn ${activeTab === 'receipts' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchFeeTab('receipts')">
          🧾 Receipts Issued (${db.getFeeReceipts().length})
        </button>
        <button class="btn ${activeTab === 'expenses' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchFeeTab('expenses')">
          💼 School Expenses (${expenses.length})
        </button>
      </div>

      <!-- Tab Content Cards -->
      <div class="content-card">
        <div class="card-body">
          ${activeTab === 'invoices' ? `
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Month</th>
                    <th>Fee Payable</th>
                    <th>Paid</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoices.map(inv => {
                    let badgeClass = 'badge-danger';
                    if (inv.status === 'Paid') badgeClass = 'badge-success';
                    if (inv.status === 'Partial') badgeClass = 'badge-warning';

                    return `
                      <tr>
                        <td><strong>${inv.invoiceNo}</strong></td>
                        <td>${inv.studentName}</td>
                        <td>${inv.grade}</td>
                        <td>${inv.month}</td>
                        <td><strong>$${inv.netPayable}</strong></td>
                        <td>$${inv.paidAmount || 0}</td>
                        <td><span class="badge ${badgeClass}">${inv.status}</span></td>
                        <td>
                          <div style="display: flex; gap: 6px;">
                            ${inv.status !== 'Paid' ? `
                              <button class="btn btn-primary btn-sm" onclick="window.quickPayInvoice('${inv.id}')">
                                💳 Pay Now
                              </button>
                            ` : `
                              <button class="btn btn-outline btn-sm" onclick="window.viewReceiptModal('${inv.receiptNo}')">
                                🧾 Receipt
                              </button>
                            `}
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          ` : (activeTab === 'receipts' ? `
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Receipt #</th>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Amount Paid</th>
                    <th>Payment Method</th>
                    <th>Collected By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${db.getFeeReceipts().map(rec => `
                    <tr>
                      <td><strong>${rec.receiptNo}</strong></td>
                      <td>${rec.date}</td>
                      <td>${rec.studentName}</td>
                      <td>${rec.grade}</td>
                      <td><strong style="color: #059669;">$${rec.amountPaid}.00</strong></td>
                      <td><span class="badge badge-info">${rec.paymentMethod}</span></td>
                      <td>${rec.receivedBy}</td>
                      <td>
                        <button class="btn btn-outline btn-sm" onclick="window.viewReceiptModal('${rec.receiptNo}')">
                          🖨️ Print Receipt
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Title & Item</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Approved By</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${expenses.map(exp => `
                    <tr>
                      <td><strong>${exp.title}</strong></td>
                      <td><span class="badge badge-neutral">${exp.category}</span></td>
                      <td>${exp.date}</td>
                      <td><strong style="color: #E11D48;">$${exp.amount}.00</strong></td>
                      <td>${exp.approvedBy}</td>
                      <td><span class="badge badge-success">${exp.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  window.switchFeeTab = function(tab) {
    activeTab = tab;
    renderView();
  };

  renderView();
};

window.quickPayInvoice = function(invId) {
  const inv = window.DB.getFeeInvoices().find(i => i.id === invId);
  if (!inv) return;

  const due = inv.netPayable - (inv.paidAmount || 0);
  const rec = window.DB.recordPayment(invId, due, 'JazzCash Mobile Money', 'Muhammad Shakeel (Accountant)');
  if (rec) {
    window.showToast(`Paid $${due}.00! Receipt #${rec.receiptNo} issued.`, "success");
    window.Router.refreshCurrentView();
    window.viewReceiptModal(rec.receiptNo);
  }
};

window.viewReceiptModal = function(receiptNo) {
  const rec = window.DB.getFeeReceipts().find(r => r.receiptNo === receiptNo) || window.DB.getFeeReceipts()[0];
  if (!rec) return;

  const info = window.DB.data.schoolInfo;

  const modalHTML = `
    <div class="modal-backdrop open" id="receipt-modal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">Official Fee Payment Receipt</h3>
          <button class="modal-close-btn" onclick="document.getElementById('receipt-modal').remove()">×</button>
        </div>
        <div class="modal-body" id="printable-receipt-area">
          <div class="official-document" style="border: 2px dashed #1E3A8A; padding: 20px;">
            <div class="official-header" style="border-bottom: 2px dashed #1E3A8A; padding-bottom: 12px;">
              <img src="assets/logo.jpg" alt="Logo" class="official-logo" style="width: 55px; height: 55px;" />
              <h2 style="font-size: 1.25rem; font-weight: 800; color: #1E3A8A;">${info.name}</h2>
              <div style="font-size: 0.78rem; color: #64748B;">${info.address} &bull; Phone: ${info.phone}</div>
              <div style="margin-top: 8px; font-weight: 700; color: #059669; font-size: 0.9rem;">
                STUDENT FEE VOUCHER &bull; RECEIPT #${rec.receiptNo}
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.84rem; margin: 14px 0;">
              <div>Date Issued: <strong>${rec.date}</strong></div>
              <div>Invoice Reference: <strong>${rec.invoiceNo}</strong></div>
              <div>Student: <strong>${rec.studentName}</strong></div>
              <div>Grade / Class: <strong>${rec.grade}</strong></div>
              <div>Guardian: <strong>${rec.guardianName}</strong></div>
              <div>Payment Channel: <strong>${rec.paymentMethod}</strong></div>
            </div>

            <table class="official-table">
              <thead>
                <tr>
                  <th>Particulars</th>
                  <th style="text-align: right;">Amount ($)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly Tuition & Lab Support</td>
                  <td style="text-align: right; font-weight: 700;">$${rec.amountPaid}.00</td>
                </tr>
              </tbody>
              <tfoot>
                <tr style="background: #F1F5F9; font-weight: 800;">
                  <td>NET TOTAL RECEIVED (PAID IN FULL)</td>
                  <td style="text-align: right; color: #059669; font-size: 1.1rem;">$${rec.amountPaid}.00</td>
                </tr>
              </tfoot>
            </table>

            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; font-size: 0.8rem;">
              <div>
                <div>Transaction Ref: <code>${rec.transactionRef || 'TXN-98214'}</code></div>
                <div style="color: #64748B;">Generated electronically &bull; No physical signature needed</div>
              </div>
              <div style="text-align: center; border-top: 1px solid #334155; padding-top: 4px; width: 160px;">
                <strong>${rec.receivedBy}</strong>
                <div style="font-size: 0.7rem; color: #64748B;">Authorized Cashier</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('receipt-modal').remove()">Close</button>
          <button class="btn btn-primary" onclick="window.print()">🖨️ Print Receipt</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.openRecordPaymentModal = function() {
  const unpaidInvs = window.DB.getFeeInvoices().filter(i => i.status !== 'Paid');

  const modalHTML = `
    <div class="modal-backdrop open" id="record-pay-modal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">💳 Record Student Fee Payment</h3>
          <button class="modal-close-btn" onclick="document.getElementById('record-pay-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Select Student Invoice *</label>
            <select class="form-select" id="pay-inv-id" style="width: 100%;">
              ${unpaidInvs.map(i => `
                <option value="${i.id}">${i.studentName} (${i.grade}) - ${i.invoiceNo} (Due: $${i.netPayable - (i.paidAmount || 0)})</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Amount Paid ($) *</label>
            <input type="number" class="form-input" id="pay-amount" value="25" style="width: 100%;" />
          </div>
          <div class="form-group">
            <label class="form-label">Payment Method *</label>
            <select class="form-select" id="pay-method" style="width: 100%;">
              <option value="Mobile Money (JazzCash / EasyPaisa)">Mobile Money (JazzCash / EasyPaisa)</option>
              <option value="Cash at School Desk">Cash at School Desk</option>
              <option value="Bank Wire / Online Transfer">Bank Wire / Online Transfer</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('record-pay-modal').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="window.submitRecordPay()">Confirm & Issue Receipt</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.submitRecordPay = function() {
  const invId = document.getElementById('pay-inv-id')?.value;
  const amount = document.getElementById('pay-amount')?.value;
  const method = document.getElementById('pay-method')?.value;

  if (!invId || !amount) {
    window.showToast("Please enter payment details", "warning");
    return;
  }

  const rec = window.DB.recordPayment(invId, amount, method, window.Auth.getCurrentUser().name || 'Accountant');
  document.getElementById('record-pay-modal')?.remove();
  window.showToast(`Recorded payment of $${amount}! Receipt #${rec?.receiptNo} created.`, "success");
  window.Router.refreshCurrentView();
  if (rec) window.viewReceiptModal(rec.receiptNo);
};

window.openAddExpenseModal = function() {
  const modalHTML = `
    <div class="modal-backdrop open" id="add-exp-modal">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">➕ Log School Expense</h3>
          <button class="modal-close-btn" onclick="document.getElementById('add-exp-modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Expense Description *</label>
            <input type="text" class="form-input" id="exp-title" placeholder="e.g. Science Lab Chemical Reagents" style="width: 100%;" />
          </div>
          <div class="form-group">
            <label class="form-label">Category *</label>
            <select class="form-select" id="exp-cat" style="width: 100%;">
              <option value="Utilities & Solar Power">Utilities & Solar Power</option>
              <option value="Internet & Telecommunication">Internet & Telecommunication</option>
              <option value="Academic Supplies">Academic Supplies</option>
              <option value="Equipment Maintenance">Equipment Maintenance</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Amount ($) *</label>
            <input type="number" class="form-input" id="exp-amount" placeholder="45" style="width: 100%;" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="document.getElementById('add-exp-modal').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="window.submitAddExpense()">Save Expense</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.submitAddExpense = function() {
  const title = document.getElementById('exp-title')?.value;
  const category = document.getElementById('exp-cat')?.value;
  const amount = document.getElementById('exp-amount')?.value;

  if (!title || !amount) {
    window.showToast("Please provide expense details", "warning");
    return;
  }

  window.DB.addExpense({
    title,
    category,
    amount: Number(amount),
    approvedBy: window.Auth.getCurrentUser().name || 'Dr. Tariq Mahmood'
  });

  document.getElementById('add-exp-modal')?.remove();
  window.showToast(`Logged expense of $${amount}.00`, "success");
  window.Router.refreshCurrentView();
};

window.Router.register('fees', window.renderFees);
