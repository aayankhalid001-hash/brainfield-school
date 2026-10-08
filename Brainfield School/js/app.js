/**
 * Brainfield School - Main Application Controller
 * Handles global theme, language, toast alerts, role switcher and UI events.
 */

// Toast notification helper
window.showToast = function(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-msg toast-${type}`;
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'danger') icon = '❌';
  if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span><span style="flex: 1;">${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Theme toggle
window.initTheme = function() {
  const saved = localStorage.getItem('BRAINFIELD_THEME_V1') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
};

window.toggleTheme = function() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('BRAINFIELD_THEME_V1', next);
  updateThemeIcon(next);
  window.showToast(`Switched to ${next} mode`, 'info');
};

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
}

// Language toggle
window.toggleLanguage = function() {
  window.I18n.toggleLanguage();
  const currentLang = window.I18n.currentLang;
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.innerHTML = currentLang === 'ar' ? 'English (LTR)' : 'العربية (RTL)';
  }
  window.showToast(currentLang === 'ar' ? 'تم تحويل الواجهة إلى العربية' : 'Switched interface to English', 'success');
};

// Quick role switcher
window.switchUserRole = function(role) {
  const newUser = window.Auth.switchRole(role);
  if (newUser) {
    window.showToast(`Switched view to ${newUser.roleTitle || role}!`, 'success');
  }
};

// Mobile sidebar toggle
window.toggleSidebar = function() {
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
};

// Global App Initialization
document.addEventListener('DOMContentLoaded', () => {
  window.initTheme();

  // Language button label
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.innerHTML = window.I18n.currentLang === 'ar' ? 'English (LTR)' : 'العربية (RTL)';
  }

  // Setup Role Pill Buttons
  document.querySelectorAll('.role-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-role');
      window.switchUserRole(role);
    });
  });

  // Setup Sidebar Nav Links
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = link.getAttribute('data-route');
      if (route) {
        window.Router.navigateTo(route);
        // Close sidebar on mobile
        document.getElementById('app-sidebar')?.classList.remove('open');
      }
    });
  });

  // Setup Mobile Nav Links
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = link.getAttribute('data-route');
      if (route) window.Router.navigateTo(route);
    });
  });

  // Setup Global Header Search Box
  const globalSearch = document.getElementById('global-search-input');
  if (globalSearch) {
    globalSearch.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = globalSearch.value.trim().toLowerCase();
        if (!query) return;

        // Smart route redirect based on search query
        if (query.includes('math') || query.includes('sci') || query.includes('course') || query.includes('lesson')) {
          window.Router.navigateTo('lms');
        } else if (query.includes('fee') || query.includes('pay') || query.includes('receipt') || query.includes('invoice')) {
          window.Router.navigateTo('fees');
        } else if (query.includes('teach') || query.includes('ahmed') || query.includes('fatima') || query.includes('zahid')) {
          window.Router.navigateTo('teachers');
        } else if (query.includes('book') || query.includes('lib') || query.includes('tablet')) {
          window.Router.navigateTo('library');
        } else if (query.includes('exam') || query.includes('quiz') || query.includes('test')) {
          window.Router.navigateTo('exams');
        } else {
          window.Router.navigateTo('students');
        }
        window.showToast(`Showing results for "${query}"`, 'info');
      }
    });
  }

  // Start Router
  window.Router.init();
});
