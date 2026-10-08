/**
 * Brainfield School - Exams & Quizzes Module
 * Interactive online quiz taking engine with countdown timer, auto-grading and answer review.
 */

window.renderExams = function(container) {
  const db = window.DB;
  const t = (k) => window.I18n.t(k);
  const isRTL = window.I18n.isRTL();
  const exams = db.getExams();

  let activeExam = null;
  let timerInterval = null;
  let secondsRemaining = 0;
  let userAnswers = {};

  function renderListView() {
    if (timerInterval) clearInterval(timerInterval);

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>📑 ${t('navExams')}</h1>
          <p class="view-subtitle">Online quizzes, term examinations, automated objective grading and questions bank.</p>
        </div>
        <div class="view-actions-group">
          <span class="bandwidth-indicator">
            <span class="pulse-dot"></span>
            <span>Offline-Ready Assessment Engine</span>
          </span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px;">
        ${exams.map(ex => `
          <div class="content-card">
            <div class="card-header">
              <span class="badge ${ex.status === 'Available' ? 'badge-success' : 'badge-neutral'}">${ex.status}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">⏱️ ${ex.durationMinutes} Minutes</span>
            </div>
            <div class="card-body">
              <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px;">
                ${isRTL && ex.titleAr ? ex.titleAr : ex.title}
              </h3>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">
                Subject: <strong>${ex.subject}</strong> &bull; ${ex.grade}
              </div>

              <div style="background: var(--bg-surface-alt); padding: 10px; border-radius: var(--radius-md); font-size: 0.8rem; margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span>Total Questions: <strong>${ex.questions.length} Questions</strong></span>
                  <span>Total Marks: <strong>${ex.totalMarks}</strong></span>
                </div>
                <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                  <span>Passing Score: <strong>${ex.passingMarks}</strong></span>
                  <span>Date: <strong>${ex.date}</strong></span>
                </div>
              </div>

              <div style="display: flex; gap: 8px;">
                <button class="btn btn-primary" style="flex: 1;" onclick="window.startOnlineQuiz('${ex.id}')">
                  🚀 ${t('startQuiz')}
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderQuizInterface(exam) {
    activeExam = exam;
    secondsRemaining = exam.durationMinutes * 60;
    userAnswers = {};

    container.innerHTML = `
      <div class="quiz-box">
        <div class="quiz-timer-bar">
          <div>
            <span>📝 ${exam.title}</span>
            <div style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">${exam.grade} &bull; Total Marks: ${exam.totalMarks}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 1.1rem;">
            <span>⏳</span>
            <span id="quiz-timer-clock">15:00</span>
          </div>
        </div>

        <form id="online-quiz-form" onsubmit="event.preventDefault(); window.submitQuizAnswers();">
          ${exam.questions.map((q, idx) => `
            <div class="question-block">
              <div class="question-text">
                <span style="color: var(--primary-600); font-weight: 700;">Q${idx + 1}.</span> ${q.question}
                <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal; margin-left: 6px;">(${q.marks} Marks)</span>
              </div>

              ${q.type === 'mcq' ? `
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  ${q.options.map((opt, oIdx) => `
                    <label class="option-item" for="q-${q.id}-opt-${oIdx}">
                      <input type="radio" id="q-${q.id}-opt-${oIdx}" name="q-${q.id}" value="${oIdx}" onchange="window.saveQuizOption('${q.id}', ${oIdx})" />
                      <span>${opt}</span>
                    </label>
                  `).join('')}
                </div>
              ` : `
                <div style="margin-top: 8px;">
                  <textarea class="form-textarea" rows="3" style="width: 100%;" placeholder="Write your short answer explanation here..." oninput="window.saveQuizOption('${q.id}', this.value)"></textarea>
                </div>
              `}
            </div>
          `).join('')}

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
            <button type="button" class="btn btn-outline" onclick="window.cancelQuizConfirm()">
              Cancel
            </button>
            <button type="button" class="btn btn-success" onclick="window.submitQuizAnswers()">
              ✅ Submit & Grade Exam
            </button>
          </div>
        </form>
      </div>
    `;

    // Start timer countdown
    startTimerCountdown();
  }

  function startTimerCountdown() {
    const clockEl = document.getElementById('quiz-timer-clock');
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      secondsRemaining--;
      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        window.showToast("Time expired! Submitting your answers automatically.", "warning");
        window.submitQuizAnswers();
        return;
      }

      const mins = Math.floor(secondsRemaining / 60);
      const secs = secondsRemaining % 60;
      if (clockEl) {
        clockEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (secondsRemaining < 120) clockEl.style.color = '#EF4444';
      }
    }, 1000);
  }

  window.saveQuizOption = function(qId, val) {
    userAnswers[qId] = val;
  };

  window.submitQuizAnswers = function() {
    if (timerInterval) clearInterval(timerInterval);

    let totalEarned = 0;
    const reviewDetails = [];

    activeExam.questions.forEach((q, idx) => {
      const userVal = userAnswers[q.id];
      let isCorrect = false;
      let earned = 0;

      if (q.type === 'mcq') {
        if (Number(userVal) === q.correctIndex) {
          isCorrect = true;
          earned = q.marks;
          totalEarned += earned;
        }
      } else {
        // Short question auto-credit if provided with length > 5
        if (userVal && typeof userVal === 'string' && userVal.trim().length > 5) {
          isCorrect = true;
          earned = q.marks;
          totalEarned += earned;
        }
      }

      reviewDetails.push({
        q,
        idx,
        userVal,
        isCorrect,
        earned
      });
    });

    const percent = Math.round((totalEarned / activeExam.totalMarks) * 100);
    const passed = totalEarned >= activeExam.passingMarks;

    // Render Instant Score Report
    container.innerHTML = `
      <div class="quiz-box">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid var(--border-color); margin-bottom: 20px;">
          <div style="font-size: 3.5rem; margin-bottom: 8px;">${passed ? '🎉' : '📚'}</div>
          <h2>${passed ? 'Congratulations!' : 'Exam Submitted'}</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${activeExam.title}</p>
          <div style="margin: 14px 0;">
            <span style="font-size: 2.2rem; font-weight: 800; color: ${passed ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
              ${totalEarned} / ${activeExam.totalMarks}
            </span>
            <div style="font-size: 1rem; font-weight: 600; color: var(--text-muted);">${percent}% &bull; ${passed ? 'PASSED (Grade A)' : 'NEEDS REVISION'}</div>
          </div>
        </div>

        <h3 style="font-size: 1rem; margin-bottom: 14px;">Review Question Answers:</h3>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${reviewDetails.map(item => `
            <div style="padding: 12px; border-radius: var(--radius-md); border: 1px solid ${item.isCorrect ? '#A7F3D0' : '#FECDD3'}; background: ${item.isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'};">
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 600; margin-bottom: 6px;">
                <span>Q${item.idx + 1}. ${item.q.question}</span>
                <span class="badge ${item.isCorrect ? 'badge-success' : 'badge-danger'}">
                  ${item.isCorrect ? `+${item.earned} Marks` : '0 Marks'}
                </span>
              </div>

              ${item.q.type === 'mcq' ? `
                <div style="font-size: 0.8rem; color: var(--text-muted);">
                  Your Answer: <strong>${item.userVal !== undefined ? item.q.options[item.userVal] : 'No answer selected'}</strong>
                  ${!item.isCorrect ? `<div style="color: var(--accent-emerald); font-weight: 600; margin-top: 2px;">Correct Answer: ${item.q.options[item.q.correctIndex]}</div>` : ''}
                </div>
              ` : `
                <div style="font-size: 0.8rem; color: var(--text-muted);">
                  Your Submission: "${item.userVal || 'Blank'}"
                  <div style="color: var(--primary-600); margin-top: 2px;">Key Concept: ${item.q.sampleAnswer}</div>
                </div>
              `}

              ${item.q.explanation ? `
                <div style="font-size: 0.75rem; color: #475569; margin-top: 6px; background: rgba(0,0,0,0.03); padding: 6px; border-radius: 4px;">
                  💡 <em>${item.q.explanation}</em>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 24px;">
          <button class="btn btn-outline" onclick="window.startOnlineQuiz('${activeExam.id}')">
            🔄 Retake Quiz
          </button>
          <button class="btn btn-primary" onclick="window.Router.navigateTo('results')">
            🏅 View Report Card
          </button>
        </div>
      </div>
    `;

    window.DB.logActivity(`Student scored ${totalEarned}/${activeExam.totalMarks} (${percent}%) on ${activeExam.title}`);
  };

  window.cancelQuizConfirm = function() {
    if (confirm("Are you sure you want to exit the quiz? Unsaved answers will be lost.")) {
      renderListView();
    }
  };

  window.startOnlineQuiz = function(examId) {
    const ex = exams.find(e => e.id === examId) || exams[0];
    renderQuizInterface(ex);
  };

  renderListView();
};

window.Router.register('exams', window.renderExams);
