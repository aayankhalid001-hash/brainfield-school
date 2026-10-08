/**
 * Brainfield School - Live Online Classroom Module
 * Virtual classroom simulation with interactive HTML5 Whiteboard, live video grid, chat and hand-raise.
 */

window.renderLiveClass = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const isRTL = window.I18n.isRTL();
  const classes = db.data.liveClasses || [];

  let inSession = false;
  let activeSessionData = classes[0];

  function renderListView() {
    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>🎥 ${t('navLiveClass')}</h1>
          <p class="view-subtitle">Live interactive virtual classroom optimized for village broadband & satellite links.</p>
        </div>
        <div class="view-actions-group">
          <button class="btn btn-primary" onclick="window.enterLiveSession('live-1')">
            🚀 ${t('btnStart')} / Join Live Room
          </button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px;">
        ${classes.map(c => `
          <div class="content-card">
            <div class="card-header">
              <span class="badge ${c.status === 'Live Now' ? 'badge-danger' : (c.status === 'Scheduled' ? 'badge-info' : 'badge-neutral')}">
                ${c.status === 'Live Now' ? '🔴 Live Now' : c.status}
              </span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">⏱️ ${c.duration}</span>
            </div>
            <div class="card-body">
              <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 8px;">
                ${isRTL && c.titleAr ? c.titleAr : c.title}
              </h3>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">
                ${c.agenda}
              </div>

              <div style="background: var(--bg-surface-alt); padding: 10px; border-radius: var(--radius-md); font-size: 0.8rem; margin-bottom: 14px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span>${c.teacherAvatar || '👨‍🏫'}</span>
                  <strong>${c.teacher}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                  <span>Class: <strong>${c.grade}</strong></span>
                  <span>Time: <strong>${c.startTime}</strong></span>
                </div>
              </div>

              <div style="display: flex; gap: 8px;">
                <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="window.enterLiveSession('${c.id}')">
                  ${c.status === 'Live Now' ? '🎥 Join Meeting Room' : 'Enter Classroom'}
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderClassroomStage(session) {
    container.innerHTML = `
      <div class="view-header" style="margin-bottom: 12px;">
        <div class="view-title-group">
          <h1>🎥 Virtual Smart Classroom: ${session.grade}</h1>
          <p class="view-subtitle">${session.title} &bull; Host: ${session.teacher}</p>
        </div>
        <div class="view-actions-group">
          <span class="badge badge-danger">🔴 LIVE SESSION (BF-NET-OK)</span>
          <button class="btn btn-danger btn-sm" onclick="window.leaveLiveSession()">
            🚪 Leave Classroom
          </button>
        </div>
      </div>

      <div class="classroom-container">
        <!-- Main Stage Area -->
        <div class="classroom-stage">
          <!-- Stage Switcher Tabs -->
          <div style="background: #1E293B; padding: 8px 14px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-sm btn-primary" id="btn-tab-board" onclick="window.setStageView('whiteboard')">
                🖍️ Interactive Whiteboard
              </button>
              <button class="btn btn-sm btn-outline" id="btn-tab-video" onclick="window.setStageView('video')">
                👥 Video Feeds Grid
              </button>
            </div>
            <div style="font-size: 0.75rem; color: #94A3B8;">
              Connected: <strong>24 Students</strong> &bull; Low Bandwidth Mode: On
            </div>
          </div>

          <!-- Whiteboard View -->
          <div id="classroom-whiteboard-view" style="flex: 1; display: flex; flex-direction: column;">
            <div class="whiteboard-toolbar">
              <span style="font-size: 0.8rem; font-weight: 700; color: #334155;">Tools:</span>
              <button class="btn btn-sm btn-outline" onclick="window.setWhiteboardColor('#1E3A8A')" style="background: #1E3A8A; width: 22px; height: 22px; padding: 0; border-radius: 50%;" title="Navy Blue"></button>
              <button class="btn btn-sm btn-outline" onclick="window.setWhiteboardColor('#DC2626')" style="background: #DC2626; width: 22px; height: 22px; padding: 0; border-radius: 50%;" title="Red"></button>
              <button class="btn btn-sm btn-outline" onclick="window.setWhiteboardColor('#059669')" style="background: #059669; width: 22px; height: 22px; padding: 0; border-radius: 50%;" title="Green"></button>
              <button class="btn btn-sm btn-outline" onclick="window.setWhiteboardColor('#000000')" style="background: #000000; width: 22px; height: 22px; padding: 0; border-radius: 50%;" title="Black"></button>
              
              <button class="btn btn-sm btn-outline" onclick="window.setWhiteboardTool('eraser')">
                🧹 Eraser
              </button>
              <button class="btn btn-sm btn-outline" onclick="window.clearWhiteboardCanvas()">
                🗑️ Clear
              </button>
              <span style="font-size: 0.75rem; color: #64748B; margin-left: auto;">Draw math diagrams, formulas or sketches</span>
            </div>

            <div style="flex: 1; position: relative; background: #FFFFFF;">
              <canvas id="whiteboard-canvas" style="width: 100%; height: 100%; touch-action: none;"></canvas>
            </div>
          </div>

          <!-- Video Feeds Grid View -->
          <div id="classroom-video-view" style="display: none; flex: 1;" class="video-tiles-grid">
            <div class="video-tile teacher-tile">
              <div class="tile-avatar">${session.teacherAvatar || '👨‍🏫'}</div>
              <div style="font-weight: 600;">${session.teacher} (Teacher / Screen Presenter)</div>
              <div class="tile-tag">🎤 Mic Active &bull; 1080p Stream</div>
            </div>
            <div class="video-tile">
              <div class="tile-avatar">👦</div>
              <div style="font-size: 0.85rem;">Bilal Rasheed</div>
              <div class="tile-tag">Grade 8-A</div>
            </div>
            <div class="video-tile">
              <div class="tile-avatar">👧</div>
              <div style="font-size: 0.85rem;">Ayesha Rasheed</div>
              <div class="tile-tag">Grade 6-B</div>
            </div>
          </div>

          <!-- Bottom Stage Media Controls -->
          <div style="background: #0F172A; padding: 10px 16px; display: flex; justify-content: center; gap: 12px; border-top: 1px solid #1E293B;">
            <button class="btn btn-sm btn-outline" id="btn-live-mic" onclick="window.toggleLiveMic()">
              🎤 Mute Mic
            </button>
            <button class="btn btn-sm btn-outline" id="btn-live-cam" onclick="window.toggleLiveCam()">
              📷 Stop Video
            </button>
            <button class="btn btn-sm btn-outline" onclick="window.raiseClassroomHand()">
              ✋ Raise Hand
            </button>
            <button class="btn btn-sm btn-success" onclick="window.recordLiveAttendance()">
              📋 Log Attendance
            </button>
          </div>
        </div>

        <!-- Right Side: Live Interactive Chat & Q&A -->
        <div class="classroom-sidebar">
          <div class="card-header">
            <h3 class="card-title">💬 Classroom Chat & Q&A</h3>
            <span class="badge badge-success">Online (24)</span>
          </div>
          <div id="classroom-chat-feed" style="flex: 1; padding: 14px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; font-size: 0.82rem;">
            <div>
              <strong>${session.teacher}:</strong>
              <div style="background: var(--bg-surface-alt); padding: 8px 10px; border-radius: var(--radius-md); margin-top: 2px;">
                Welcome everyone! Open page 48 for today's algebraic problem set.
              </div>
            </div>
            <div>
              <strong>Hamza Tariq:</strong>
              <div style="background: var(--bg-surface-alt); padding: 8px 10px; border-radius: var(--radius-md); margin-top: 2px;">
                Present Sir! Audio is clear on village solar tablet.
              </div>
            </div>
            <div>
              <strong>Bilal Rasheed:</strong>
              <div style="background: var(--bg-surface-alt); padding: 8px 10px; border-radius: var(--radius-md); margin-top: 2px;">
                Sir, I solved problem 4 using the cross-multiplication method!
              </div>
            </div>
          </div>
          <div style="padding: 10px; border-top: 1px solid var(--border-color); display: flex; gap: 6px;">
            <input type="text" id="live-chat-input" class="form-input" placeholder="Type a message or question..." style="flex: 1;" />
            <button class="btn btn-primary btn-sm" onclick="window.sendClassroomChatMessage()">
              Send
            </button>
          </div>
        </div>
      </div>
    `;

    // Initialize Canvas
    setTimeout(initWhiteboardCanvas, 50);

    // Chat enter key handler
    const chatInput = document.getElementById('live-chat-input');
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') window.sendClassroomChatMessage();
      });
    }
  }

  // Canvas Drawing Engine
  let currentColor = '#1E3A8A';
  let isErasing = false;
  let isDrawing = false;
  let canvas, ctx;

  function initWhiteboardCanvas() {
    canvas = document.getElementById('whiteboard-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    // Handle high DPI resize
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw initial welcome formula on whiteboard!
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.font = 'bold 20px Segoe UI, sans-serif';
    ctx.fillStyle = '#1E3A8A';
    ctx.fillText('3x + 9 = 24  ==>  3x = 15  ==>  x = 5', 30, 50);
    
    // Draw coordinate axis illustration
    ctx.beginPath();
    ctx.moveTo(30, 180);
    ctx.lineTo(250, 180);
    ctx.lineTo(240, 175);
    ctx.moveTo(250, 180);
    ctx.lineTo(240, 185);
    ctx.moveTo(50, 240);
    ctx.lineTo(50, 80);
    ctx.lineTo(45, 90);
    ctx.moveTo(50, 80);
    ctx.lineTo(55, 90);
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Event listeners
    function startDraw(e) {
      isDrawing = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    function doDraw(e) {
      if (!isDrawing) return;
      const pos = getPos(e);
      ctx.strokeStyle = isErasing ? '#FFFFFF' : currentColor;
      ctx.lineWidth = isErasing ? 20 : 3;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    function stopDraw() {
      isDrawing = false;
    }

    function getPos(e) {
      const b = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      return {
        x: clientX - b.left,
        y: clientY - b.top
      };
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', doDraw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); doDraw(e); }, { passive: false });
    canvas.addEventListener('touchend', stopDraw);
  }

  window.setWhiteboardColor = function(color) {
    currentColor = color;
    isErasing = false;
    window.showToast("Pen color changed", "info");
  };

  window.setWhiteboardTool = function(tool) {
    if (tool === 'eraser') {
      isErasing = true;
      window.showToast("Eraser tool selected", "info");
    }
  };

  window.clearWhiteboardCanvas = function() {
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      window.showToast("Whiteboard cleared", "info");
    }
  };

  window.setStageView = function(view) {
    const wView = document.getElementById('classroom-whiteboard-view');
    const vView = document.getElementById('classroom-video-view');
    const tB = document.getElementById('btn-tab-board');
    const tV = document.getElementById('btn-tab-video');

    if (view === 'whiteboard') {
      wView.style.display = 'flex';
      vView.style.display = 'none';
      tB.className = 'btn btn-sm btn-primary';
      tV.className = 'btn btn-sm btn-outline';
    } else {
      wView.style.display = 'none';
      vView.style.display = 'grid';
      tB.className = 'btn btn-sm btn-outline';
      tV.className = 'btn btn-sm btn-primary';
    }
  };

  window.enterLiveSession = function(sessionId) {
    activeSessionData = classes.find(c => c.id === sessionId) || classes[0];
    inSession = true;
    renderClassroomStage(activeSessionData);
    window.showToast("Joined virtual session: " + activeSessionData.title, "success");
  };

  window.leaveLiveSession = function() {
    inSession = false;
    renderListView();
    window.showToast("Left classroom session.", "info");
  };

  window.toggleLiveMic = function() {
    const btn = document.getElementById('btn-live-mic');
    if (btn.innerHTML.includes('Mute')) {
      btn.innerHTML = '🔇 Unmute Mic';
      btn.className = 'btn btn-sm btn-danger';
      window.showToast("Microphone muted", "info");
    } else {
      btn.innerHTML = '🎤 Mute Mic';
      btn.className = 'btn btn-sm btn-outline';
      window.showToast("Microphone unmuted", "success");
    }
  };

  window.toggleLiveCam = function() {
    const btn = document.getElementById('btn-live-cam');
    if (btn.innerHTML.includes('Stop')) {
      btn.innerHTML = '📷 Start Video';
      btn.className = 'btn btn-sm btn-danger';
      window.showToast("Camera disabled (Conserving bandwidth)", "info");
    } else {
      btn.innerHTML = '📷 Stop Video';
      btn.className = 'btn btn-sm btn-outline';
      window.showToast("Camera enabled", "success");
    }
  };

  window.raiseClassroomHand = function() {
    window.showToast("✋ You raised your hand! The teacher has been notified.", "warning");
    const feed = document.getElementById('classroom-chat-feed');
    if (feed) {
      feed.insertAdjacentHTML('beforeend', `
        <div style="background: rgba(217, 119, 6, 0.15); border: 1px solid var(--accent-amber); padding: 6px 10px; border-radius: var(--radius-sm); font-size: 0.78rem;">
          ✋ <strong>${window.Auth.getCurrentUser()?.name || 'You'}</strong> raised their hand.
        </div>
      `);
      feed.scrollTop = feed.scrollHeight;
    }
  };

  window.recordLiveAttendance = function() {
    window.showToast("✅ Auto-logged attendance for all 24 connected students!", "success");
  };

  window.sendClassroomChatMessage = function() {
    const inp = document.getElementById('live-chat-input');
    const feed = document.getElementById('classroom-chat-feed');
    if (!inp || !inp.value.trim() || !feed) return;

    const user = window.Auth.getCurrentUser();
    const msg = inp.value.trim();
    inp.value = '';

    feed.insertAdjacentHTML('beforeend', `
      <div>
        <strong>${user?.name || 'Student'}:</strong>
        <div style="background: var(--primary-50); padding: 8px 10px; border-radius: var(--radius-md); margin-top: 2px; color: var(--primary-800);">
          ${msg}
        </div>
      </div>
    `);
    feed.scrollTop = feed.scrollHeight;
  };

  renderListView();
};

window.Router.register('liveclass', window.renderLiveClass);
