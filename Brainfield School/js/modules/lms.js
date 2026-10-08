/**
 * Brainfield School - Online LMS & Study Materials Module
 * Low-bandwidth video lessons, audio-only data saver, downloadable notes, and syllabus progress.
 */

window.renderLMS = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const isRTL = window.I18n.isRTL();
  const courses = db.getCourses();

  let activeCourse = courses[0];
  let activeLesson = activeCourse?.lessons[0];

  function renderCourseView() {
    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>📚 ${t('navLms')}</h1>
          <p class="view-subtitle">Interactive courses, downloadable lesson notes, and low-data learning media.</p>
        </div>
        <div class="view-actions-group">
          <span class="bandwidth-indicator">
            <span class="pulse-dot"></span>
            <span>Audio Mode Available (90% Data Savings)</span>
          </span>
        </div>
      </div>

      <!-- Course Selection Pills -->
      <div style="display: flex; gap: 10px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 4px;">
        ${courses.map(crs => `
          <button class="btn ${crs.id === activeCourse.id ? 'btn-primary' : 'btn-outline'}" onclick="window.selectLMSCourse('${crs.id}')">
            ${crs.thumbnail} ${isRTL && crs.titleAr ? crs.titleAr : crs.title}
          </button>
        `).join('')}
      </div>

      <!-- Lesson Viewer Layout -->
      <div class="dashboard-sections-grid" style="grid-template-columns: 2fr 1fr;">
        <!-- Left: Active Lesson Content & Video -->
        <div class="content-card">
          <div class="card-header">
            <div>
              <span class="badge badge-info" style="margin-bottom: 4px;">${activeCourse.subject} &bull; ${activeCourse.grade}</span>
              <h2 class="card-title">${activeLesson.title}</h2>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-outline btn-sm" id="btn-toggle-audio-mode" onclick="window.toggleAudioOnlyMode()">
                📻 Audio-Only Mode
              </button>
            </div>
          </div>
          <div class="card-body">
            <!-- Video Stage / Audio Player Container -->
            <div id="lms-media-container" style="background: #000; border-radius: var(--radius-md); overflow: hidden; position: relative; margin-bottom: 20px;">
              <div style="position: relative; padding-bottom: 56.25%; height: 0;" id="lms-video-box">
                <iframe 
                  src="${activeLesson.videoEmbed}" 
                  title="${activeLesson.title}" 
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>
                </iframe>
              </div>
              <div id="lms-audio-box" style="display: none; padding: 40px 20px; text-align: center; background: linear-gradient(135deg, #1E293B, #0F172A); color: white;">
                <div style="font-size: 3rem; margin-bottom: 10px;">📻</div>
                <h3>Low-Bandwidth Audio Mode Active</h3>
                <p style="font-size: 0.85rem; color: #94A3B8; margin-bottom: 16px;">Estimated data consumption: ~${activeLesson.audioOnlySize || '2.5 MB'}</p>
                <audio controls style="width: 100%; max-width: 400px;">
                  <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
                  Your browser does not support audio element.
                </audio>
              </div>
            </div>

            <!-- Lesson Notes & Study Guide -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="font-size: 1.05rem; font-weight: 700;">📖 Lesson Summary & Study Notes</h3>
                <button class="btn btn-outline btn-sm" onclick="window.downloadLessonPDF('${activeLesson.pdfName}')">
                  📥 Download ${activeLesson.pdfName}
                </button>
              </div>
              <div style="background: var(--bg-surface-alt); padding: 16px; border-radius: var(--radius-md); font-size: 0.9rem; line-height: 1.6;">
                ${activeLesson.notes}
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 18px;">
              <button class="btn btn-success" onclick="window.markLessonDone('${activeLesson.id}')">
                ✅ Mark as Completed
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Course Playlist & Lessons List -->
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">📑 Course Syllabus (${activeCourse.lessons.length} Lessons)</h3>
          </div>
          <div class="card-body" style="padding: 10px; display: flex; flex-direction: column; gap: 8px;">
            ${activeCourse.lessons.map((les, idx) => `
              <div 
                style="padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: ${les.id === activeLesson.id ? 'var(--primary-50)' : 'var(--bg-surface)'}; cursor: pointer; transition: all var(--transition-fast);"
                onclick="window.selectLMSLesson('${les.id}')"
              >
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary-600);">Lesson ${idx + 1}</span>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">⏱️ ${les.duration}</span>
                </div>
                <div style="font-size: 0.86rem; font-weight: 600; color: var(--text-main);">
                  ${les.title}
                </div>
                <div style="display: flex; align-items: center; gap: 6px; margin-top: 6px; font-size: 0.72rem; color: var(--text-muted);">
                  <span>📄 ${les.type}</span>
                  ${les.isCompleted ? '<span style="color: var(--accent-emerald); font-weight: 700; margin-left: auto;">✔ Completed</span>' : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  window.selectLMSCourse = function(courseId) {
    activeCourse = courses.find(c => c.id === courseId) || courses[0];
    activeLesson = activeCourse.lessons[0];
    renderCourseView();
  };

  window.selectLMSLesson = function(lessonId) {
    activeLesson = activeCourse.lessons.find(l => l.id === lessonId) || activeCourse.lessons[0];
    renderCourseView();
  };

  let isAudioOnly = false;
  window.toggleAudioOnlyMode = function() {
    isAudioOnly = !isAudioOnly;
    const vBox = document.getElementById('lms-video-box');
    const aBox = document.getElementById('lms-audio-box');
    const btn = document.getElementById('btn-toggle-audio-mode');
    if (isAudioOnly) {
      if (vBox) vBox.style.display = 'none';
      if (aBox) aBox.style.display = 'block';
      if (btn) btn.innerHTML = '🎥 Video Mode';
      window.showToast("Switched to Low-Data Audio Mode (Saves 90% bandwidth)", "info");
    } else {
      if (vBox) vBox.style.display = 'block';
      if (aBox) aBox.style.display = 'none';
      if (btn) btn.innerHTML = '📻 Audio-Only Mode';
      window.showToast("Switched to HD Video Mode", "info");
    }
  };

  window.downloadLessonPDF = function(pdfName) {
    // Generate text/blob file download simulation
    const content = `Brainfield School - Study Guide: ${pdfName}\n\nSubject: ${activeCourse.subject}\nGrade: ${activeCourse.grade}\nTeacher: ${activeCourse.teacher}\n\nSummary:\n${activeLesson.notes}\n\nGenerated for offline village learning on ${new Date().toLocaleDateString()}.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfName.replace('.pdf', '.txt');
    a.click();
    window.showToast(`Downloaded ${pdfName} for offline study!`, "success");
  };

  window.markLessonDone = function(lessonId) {
    activeLesson.isCompleted = true;
    window.showToast("Lesson completed! Progress updated.", "success");
    renderCourseView();
  };

  renderCourseView();
};

window.Router.register('lms', window.renderLMS);
