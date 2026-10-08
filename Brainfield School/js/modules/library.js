/**
 * Brainfield School - Library & Inventory Module
 * Book catalog management, issue/return tracker, and school physical asset inventory.
 */

window.renderLibrary = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const books = db.getLibrary();
  const inventory = db.getInventory();

  let activeTab = 'books';

  function renderView() {
    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>📖 ${t('navLibrary')}</h1>
          <p class="view-subtitle">Library books collection, lending records, and school technology equipment inventory.</p>
        </div>
        <div class="view-actions-group">
          <button class="btn ${activeTab === 'books' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchLibTab('books')">
            📚 Books Catalog (${books.length})
          </button>
          <button class="btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchLibTab('inventory')">
            🔬 Assets & Equipment (${inventory.length})
          </button>
          ${activeTab === 'books' ? `
            <button class="btn btn-primary" onclick="window.openAddBookModal()">
              ➕ Add Book
            </button>
          ` : `
            <button class="btn btn-primary" onclick="window.openAddAssetModal()">
              ➕ Add Asset
            </button>
          `}
        </div>
      </div>

      <div class="content-card">
        <div class="card-body">
          ${activeTab === 'books' ? `
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ISBN</th>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Shelf / Rack</th>
                    <th>Availability</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${books.map(b => `
                    <tr>
                      <td><code>${b.isbn}</code></td>
                      <td><strong>${b.title}</strong></td>
                      <td>${b.author}</td>
                      <td><span class="badge badge-info">${b.category}</span></td>
                      <td>${b.rack}</td>
                      <td>
                        <span class="badge ${b.copiesAvailable > 0 ? 'badge-success' : 'badge-danger'}">
                          ${b.copiesAvailable} / ${b.copiesTotal} Available
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-outline btn-sm" onclick="window.borrowBookAction('${b.id}')">
                          📖 Issue to Student
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
                    <th>Item & Model</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Condition</th>
                    <th>Campus Location</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  ${inventory.map(inv => `
                    <tr>
                      <td><strong>${inv.name}</strong></td>
                      <td><span class="badge badge-neutral">${inv.category}</span></td>
                      <td><strong>${inv.quantity} Units</strong></td>
                      <td><span class="badge badge-success">${inv.condition}</span></td>
                      <td>${inv.location}</td>
                      <td style="font-size: 0.8rem; color: var(--text-muted);">${inv.notes}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    `;
  }

  window.switchLibTab = function(tab) {
    activeTab = tab;
    renderView();
  };

  window.borrowBookAction = function(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    if (book.copiesAvailable > 0) {
      book.copiesAvailable--;
      window.DB.logActivity(`Issued book: "${book.title}" to student Bilal Rasheed`);
      window.DB.save();
      window.showToast(`Issued "${book.title}" to student! Due in 14 days.`, "success");
      renderView();
    } else {
      window.showToast("No copies currently available on shelf.", "warning");
    }
  };

  window.openAddBookModal = function() {
    const modalHTML = `
      <div class="modal-backdrop open" id="add-bk-modal">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">➕ Add Library Book</h3>
            <button class="modal-close-btn" onclick="document.getElementById('add-bk-modal').remove()">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Book Title *</label>
              <input type="text" class="form-input" id="bk-title" placeholder="e.g. Astronomy for High School" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Author *</label>
              <input type="text" class="form-input" id="bk-author" placeholder="e.g. Dr. Carl Sagan" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <input type="text" class="form-input" id="bk-cat" value="Science" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Total Copies</label>
              <input type="number" class="form-input" id="bk-qty" value="5" style="width: 100%;" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="document.getElementById('add-bk-modal').remove()">Cancel</button>
            <button class="btn btn-primary" onclick="window.submitAddBook()">Save Book</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  };

  window.submitAddBook = function() {
    const title = document.getElementById('bk-title')?.value;
    const author = document.getElementById('bk-author')?.value;
    const cat = document.getElementById('bk-cat')?.value;
    const qty = document.getElementById('bk-qty')?.value;

    if (!title || !author) {
      window.showToast("Please provide title and author", "warning");
      return;
    }

    db.addLibraryBook({
      isbn: '978-019-' + Math.floor(1000 + Math.random() * 9000),
      title,
      author,
      category: cat || 'General',
      copiesTotal: Number(qty) || 5,
      copiesAvailable: Number(qty) || 5,
      rack: 'Rack G-1'
    });

    document.getElementById('add-bk-modal')?.remove();
    window.showToast("Book added to catalog!", "success");
    renderView();
  };

  window.openAddAssetModal = function() {
    const modalHTML = `
      <div class="modal-backdrop open" id="add-ast-modal">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">➕ Add School Equipment Asset</h3>
            <button class="modal-close-btn" onclick="document.getElementById('add-ast-modal').remove()">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Asset Name *</label>
              <input type="text" class="form-input" id="ast-name" placeholder="e.g. Digital Scientific Scale" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <input type="text" class="form-input" id="ast-cat" value="Science Laboratory" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Quantity</label>
              <input type="number" class="form-input" id="ast-qty" value="2" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Campus Location</label>
              <input type="text" class="form-input" id="ast-loc" value="Science Lab Room 104" style="width: 100%;" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="document.getElementById('add-ast-modal').remove()">Cancel</button>
            <button class="btn btn-primary" onclick="window.submitAddAsset()">Save Asset</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  };

  window.submitAddAsset = function() {
    const name = document.getElementById('ast-name')?.value;
    const cat = document.getElementById('ast-cat')?.value;
    const qty = document.getElementById('ast-qty')?.value;
    const loc = document.getElementById('ast-loc')?.value;

    if (!name) {
      window.showToast("Please enter asset name", "warning");
      return;
    }

    db.addInventoryItem({
      name,
      category: cat || 'Equipment',
      quantity: Number(qty) || 1,
      condition: 'Excellent',
      location: loc || 'Campus',
      notes: 'Logged into school fixed asset registry'
    });

    document.getElementById('add-ast-modal')?.remove();
    window.showToast("Asset added to inventory!", "success");
    renderView();
  };

  renderView();
};

window.Router.register('library', window.renderLibrary);
