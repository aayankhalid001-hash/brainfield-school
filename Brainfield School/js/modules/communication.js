/**
 * Brainfield School - Communication & Messaging Module
 * Broadcast announcements notice board and real-time parent-teacher chat threads.
 */

window.renderCommunication = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const isRTL = window.I18n.isRTL();
  const user = window.Auth.getCurrentUser();
  const announcements = db.getAnnouncements();

  let activeTab = 'messages';
  let activeRecipient = { id: 'u3', name: 'Sir Ahmed Raza (Math Teacher)' };

  function renderView() {
    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>💬 ${t('navCommunication')}</h1>
          <p class="view-subtitle">Official school announcements notice board and direct parent-teacher messaging.</p>
        </div>
        <div class="view-actions-group">
          <button class="btn ${activeTab === 'messages' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchCommTab('messages')">
            💬 Direct Messages
          </button>
          <button class="btn ${activeTab === 'announcements' ? 'btn-primary' : 'btn-outline'}" onclick="window.switchCommTab('announcements')">
            📢 Announcements (${announcements.length})
          </button>
          ${activeTab === 'announcements' && (user.role === 'admin' || user.role === 'principal') ? `
            <button class="btn btn-primary" onclick="window.openAddAnnouncementModal()">
              ➕ Post Announcement
            </button>
          ` : ''}
        </div>
      </div>

      ${activeTab === 'announcements' ? `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${announcements.map(ann => {
            let catBadge = 'badge-info';
            if (ann.priority === 'High') catBadge = 'badge-danger';
            if (ann.category === 'Facility') catBadge = 'badge-success';

            return `
              <div class="content-card">
                <div class="card-header">
                  <div>
                    <span class="badge ${catBadge}" style="margin-bottom: 4px;">${ann.category} &bull; ${ann.priority} Priority</span>
                    <h3 class="card-title">${isRTL && ann.titleAr ? ann.titleAr : ann.title}</h3>
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-align: right;">
                    <div>📅 ${ann.date}</div>
                    <div>By: <strong>${ann.author}</strong></div>
                  </div>
                </div>
                <div class="card-body">
                  <p style="font-size: 0.88rem; color: var(--text-main); line-height: 1.6;">
                    ${ann.content}
                  </p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <!-- Two-column Direct Chat Interface -->
        <div class="classroom-container" style="height: 580px;">
          <!-- Left: Contacts / Threads -->
          <div class="content-card" style="display: flex; flex-direction: column;">
            <div class="card-header">
              <h3 class="card-title">👥 Faculty & Staff Contacts</h3>
            </div>
            <div style="flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 6px;">
              <div 
                style="padding: 12px; border-radius: var(--radius-md); background: ${activeRecipient.id === 'u3' ? 'var(--primary-50)' : 'var(--bg-surface)'}; border: 1px solid var(--border-color); cursor: pointer;"
                onclick="window.selectChatContact('u3', 'Sir Ahmed Raza (Math Teacher)')"
              >
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 1.4rem;">👨‍🏫</span>
                  <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 600; font-size: 0.85rem;">Sir Ahmed Raza</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Math Teacher &bull; Online</div>
                  </div>
                </div>
              </div>

              <div 
                style="padding: 12px; border-radius: var(--radius-md); background: ${activeRecipient.id === 'u4' ? 'var(--primary-50)' : 'var(--bg-surface)'}; border: 1px solid var(--border-color); cursor: pointer;"
                onclick="window.selectChatContact('u4', 'Ms. Fatima Noor (Science Teacher)')"
              >
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 1.4rem;">👩‍🏫</span>
                  <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 600; font-size: 0.85rem;">Ms. Fatima Noor</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Science Lab &bull; Available</div>
                  </div>
                </div>
              </div>

              <div 
                style="padding: 12px; border-radius: var(--radius-md); background: ${activeRecipient.id === 'u2' ? 'var(--primary-50)' : 'var(--bg-surface)'}; border: 1px solid var(--border-color); cursor: pointer;"
                onclick="window.selectChatContact('u2', 'Dr. Tariq Mahmood (Principal)')"
              >
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 1.4rem;">🎓</span>
                  <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 600; font-size: 0.85rem;">Dr. Tariq Mahmood</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Principal Office &bull; In Session</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Active Chat View -->
          <div class="content-card" style="display: flex; flex-direction: column;">
            <div class="card-header">
              <h3 class="card-title">💬 Chat with ${activeRecipient.name}</h3>
              <span class="badge badge-success">Encrypted</span>
            </div>
            <div id="direct-chat-feed" style="flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
              ${db.getMessages().map(m => {
                const isMe = m.senderId === user.id || m.senderName.includes(user.name);
                return `
                  <div style="align-self: ${isMe ? 'flex-end' : 'flex-start'}; max-width: 80%;">
                    <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 2px; text-align: ${isMe ? 'right' : 'left'};">
                      ${m.senderName} &bull; ${m.timestamp}
                    </div>
                    <div style="background: ${isMe ? 'var(--primary-700)' : 'var(--bg-surface-alt)'}; color: ${isMe ? '#FFFFFF' : 'var(--text-main)'}; padding: 10px 14px; border-radius: var(--radius-md); font-size: 0.85rem; line-height: 1.4;">
                      ${m.text}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            <div style="padding: 12px; border-top: 1px solid var(--border-color); display: flex; gap: 8px;">
              <input type="text" id="direct-msg-input" class="form-input" placeholder="Type a message to teacher..." style="flex: 1;" />
              <button class="btn btn-primary" onclick="window.sendDirectMessage()">Send</button>
            </div>
          </div>
        </div>
      `}
    `;

    const inp = document.getElementById('direct-msg-input');
    if (inp) {
      inp.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') window.sendDirectMessage();
      });
    }
  }

  window.switchCommTab = function(tab) {
    activeTab = tab;
    renderView();
  };

  window.selectChatContact = function(id, name) {
    activeRecipient = { id, name };
    renderView();
  };

  window.sendDirectMessage = function() {
    const inp = document.getElementById('direct-msg-input');
    if (!inp || !inp.value.trim()) return;

    const text = inp.value.trim();
    inp.value = '';

    const sender = window.Auth.getCurrentUser();
    db.sendMessage(sender.id, sender.name, activeRecipient.id, activeRecipient.name, text);
    renderView();

    const feed = document.getElementById('direct-chat-feed');
    if (feed) feed.scrollTop = feed.scrollHeight;
  };

  window.openAddAnnouncementModal = function() {
    const modalHTML = `
      <div class="modal-backdrop open" id="add-ann-modal">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">📢 Post New School Announcement</h3>
            <button class="modal-close-btn" onclick="document.getElementById('add-ann-modal').remove()">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Announcement Title *</label>
              <input type="text" class="form-input" id="ann-title" placeholder="e.g. Winter Break Schedule" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-select" id="ann-cat" style="width: 100%;">
                <option value="Academic">Academic Notice</option>
                <option value="Event">School Event</option>
                <option value="Facility">Facility & Campus</option>
                <option value="General">General Notice</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Notice Content *</label>
              <textarea class="form-textarea" id="ann-body" rows="4" style="width: 100%;" placeholder="Enter broadcast text for parents and students..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="document.getElementById('add-ann-modal').remove()">Cancel</button>
            <button class="btn btn-primary" onclick="window.submitAddAnnouncement()">Broadcast Notice</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  };

  window.submitAddAnnouncement = function() {
    const title = document.getElementById('ann-title')?.value;
    const cat = document.getElementById('ann-cat')?.value;
    const body = document.getElementById('ann-body')?.value;

    if (!title || !body) {
      window.showToast("Please provide title and content", "warning");
      return;
    }

    db.addAnnouncement({
      title,
      category: cat,
      priority: "Normal",
      author: window.Auth.getCurrentUser().name || "School Office",
      content: body
    });

    document.getElementById('add-ann-modal')?.remove();
    window.showToast("Announcement published to all portals!", "success");
    renderView();
  };

  renderView();
};

window.Router.register('communication', window.renderCommunication);
