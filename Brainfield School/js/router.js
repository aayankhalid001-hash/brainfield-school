/**
 * Brainfield School - SPA Router and Navigation Manager
 * Handles URL hash routing, role permission checks, and module rendering.
 */

class Router {
  constructor() {
    this.currentRoute = 'dashboard';
    this.routes = {};
    window.addEventListener('hashchange', () => this.handleHashChange());
    window.addEventListener('auth-changed', () => this.handleAuthChanged());
    window.addEventListener('lang-changed', () => this.refreshCurrentView());
  }

  register(routeName, renderFn) {
    this.routes[routeName] = renderFn;
  }

  init() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    this.navigateTo(hash);
  }

  handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    this.navigateTo(hash);
  }

  handleAuthChanged() {
    this.updateNavigationUI();
    // Verify if current route is allowed for the new role; if not, go to dashboard
    const allowed = window.Auth.getAllowedModules();
    if (!allowed.includes(this.currentRoute)) {
      this.navigateTo('dashboard');
    } else {
      this.refreshCurrentView();
    }
  }

  navigateTo(routeName) {
    const allowed = window.Auth.getAllowedModules();
    if (!allowed.includes(routeName)) {
      routeName = 'dashboard';
    }

    this.currentRoute = routeName;
    window.location.hash = '#' + routeName;
    this.updateActiveNavLink(routeName);
    this.renderModule(routeName);
  }

  refreshCurrentView() {
    this.updateNavigationUI();
    this.renderModule(this.currentRoute);
  }

  updateActiveNavLink(routeName) {
    document.querySelectorAll('.nav-item').forEach(el => {
      if (el.getAttribute('data-route') === routeName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    document.querySelectorAll('.mobile-nav-link').forEach(el => {
      if (el.getAttribute('data-route') === routeName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  updateNavigationUI() {
    const currentUser = window.Auth.getCurrentUser();
    const allowed = window.Auth.getAllowedModules();

    // Show/hide desktop sidebar nav items according to role permissions
    document.querySelectorAll('.nav-item[data-route]').forEach(el => {
      const route = el.getAttribute('data-route');
      if (allowed.includes(route)) {
        el.style.display = 'flex';
      } else {
        el.style.display = 'none';
      }
    });

    // Update user profile card in sidebar footer
    const avatarEl = document.getElementById('sidebar-user-avatar');
    const nameEl = document.getElementById('sidebar-user-name');
    const roleEl = document.getElementById('sidebar-user-role');
    if (avatarEl && currentUser) avatarEl.textContent = currentUser.avatar || '👤';
    if (nameEl && currentUser) {
      nameEl.textContent = window.I18n.isRTL() && currentUser.nameAr ? currentUser.nameAr : currentUser.name;
    }
    if (roleEl && currentUser) {
      const roleKey = 'role' + currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
      roleEl.textContent = window.I18n.t(roleKey) || currentUser.roleTitle;
    }

    // Update active role pill in top bar
    document.querySelectorAll('.role-pill-btn').forEach(btn => {
      if (btn.getAttribute('data-role') === currentUser?.role) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  renderModule(routeName) {
    const container = document.getElementById('app-view-container');
    if (!container) return;

    // Loading transition
    container.style.opacity = '0.7';

    setTimeout(() => {
      if (this.routes[routeName]) {
        container.innerHTML = '';
        this.routes[routeName](container);
      } else {
        container.innerHTML = `<div class="content-card"><div class="card-body"><h3>Module under development: ${routeName}</h3></div></div>`;
      }
      container.style.opacity = '1';
      window.scrollTo(0, 0);
    }, 50);
  }
}

window.Router = new Router();
