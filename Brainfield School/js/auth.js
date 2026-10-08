/**
 * Brainfield School - Authentication & Role Permissions
 * Supports 6 distinct roles: Super Admin, Principal, Teacher, Student, Parent, Accountant
 */

const AUTH_STORAGE_KEY = 'BRAINFIELD_CURRENT_USER_V1';

const ROLE_PERMISSIONS = {
  admin: [
    'dashboard', 'students', 'teachers', 'admissions', 'classes', 
    'timetable', 'attendance', 'lms', 'liveclass', 'homework', 
    'exams', 'results', 'fees', 'parent', 'communication', 
    'calendar', 'reports', 'library', 'certificates', 'settings'
  ],
  principal: [
    'dashboard', 'students', 'teachers', 'admissions', 'classes', 
    'timetable', 'attendance', 'lms', 'liveclass', 'homework', 
    'exams', 'results', 'parent', 'communication', 'calendar', 
    'reports', 'library', 'certificates'
  ],
  teacher: [
    'dashboard', 'classes', 'students', 'timetable', 'attendance', 
    'lms', 'liveclass', 'homework', 'exams', 'results', 
    'communication', 'calendar'
  ],
  student: [
    'dashboard', 'classes', 'timetable', 'attendance', 'lms', 
    'liveclass', 'homework', 'exams', 'results', 'communication', 
    'calendar'
  ],
  parent: [
    'dashboard', 'parent', 'attendance', 'timetable', 'homework', 
    'results', 'fees', 'liveclass', 'communication', 'calendar'
  ],
  accountant: [
    'dashboard', 'fees', 'students', 'reports', 'communication', 'calendar'
  ]
};

class AuthService {
  constructor() {
    this.currentUser = this.loadUser();
  }

  loadUser() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Auth load error:", e);
    }
    // Default to Super Admin so all 20 modules are immediately visible and testable
    return this.getUserByRole('admin');
  }

  getUserByRole(role) {
    if (!window.DB) return null;
    const users = window.DB.data.users || [];
    return users.find(u => u.role === role) || users[0];
  }

  setCurrentUser(user) {
    this.currentUser = user;
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Auth save error:", e);
    }
    window.dispatchEvent(new CustomEvent('auth-changed', { detail: { user } }));
  }

  getCurrentUser() {
    return this.currentUser;
  }

  switchRole(role) {
    const user = this.getUserByRole(role);
    if (user) {
      this.setCurrentUser(user);
      if (window.DB) {
        window.DB.logActivity(`Switched session role to: ${user.roleTitle || user.role}`, user);
      }
      return user;
    }
    return null;
  }

  login(email, password = '') {
    const users = window.DB.data.users || [];
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      this.setCurrentUser(found);
      window.DB.logActivity(`User logged in: ${found.name}`, found);
      return { success: true, user: found };
    }
    return { success: false, error: 'No account registered with this email address.' };
  }

  logout() {
    // Switch to clean login or student/guest
    this.setCurrentUser(this.getUserByRole('student'));
    return true;
  }

  hasPermission(moduleKey) {
    if (!this.currentUser) return false;
    const allowed = ROLE_PERMISSIONS[this.currentUser.role] || [];
    return allowed.includes(moduleKey);
  }

  getAllowedModules() {
    if (!this.currentUser) return [];
    return ROLE_PERMISSIONS[this.currentUser.role] || [];
  }
}

window.Auth = new AuthService();
