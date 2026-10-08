/**
 * Brainfield School - Bilingual Localization Engine (English & Arabic RTL)
 * Automatically adapts text directions, layout orientation, and UI strings.
 */

const LANG_STORAGE_KEY = 'BRAINFIELD_LANG_V1';

const TRANSLATIONS = {
  en: {
    // School Branding
    schoolName: "Brainfield School",
    schoolMotto: "Growth, Wisdom & Knowledge for Rural Minds",
    villageTag: "Community Online Academy",
    
    // Roles
    roleAdmin: "Super Admin",
    rolePrincipal: "Principal",
    roleTeacher: "Teacher",
    roleStudent: "Student",
    roleParent: "Parent",
    roleAccountant: "Accountant",

    // Modules
    navDashboard: "Dashboard",
    navStudents: "Students",
    navTeachers: "Teachers",
    navAdmissions: "Admissions",
    navClasses: "Classes & Subjects",
    navTimetable: "Timetable",
    navAttendance: "Attendance",
    navLms: "Online LMS",
    navLiveClass: "Live Classes",
    navHomework: "Homework",
    navExams: "Exams & Quizzes",
    navResults: "Results & Reports",
    navFees: "Fees & Accounts",
    navParent: "Parent Portal",
    navCommunication: "Communication",
    navCalendar: "Calendar",
    navReports: "School Reports",
    navLibrary: "Library & Inventory",
    navCertificates: "Certificates",
    navSettings: "Settings & Logs",

    // Common UI
    searchPlaceholder: "Search records, students, subjects...",
    quickRoleSwitch: "Quick Role Switcher:",
    activeUser: "Logged In As",
    logout: "Log Out",
    welcome: "Welcome back",
    lowBandwidthBadge: "Low-Bandwidth Optimized",
    statusActive: "Active",
    statusPending: "Pending",
    statusApproved: "Approved",
    statusRejected: "Rejected",
    statusPaid: "Paid",
    statusUnpaid: "Unpaid",
    statusPartial: "Partial",
    statusPresent: "Present",
    statusAbsent: "Absent",
    statusLate: "Late",
    statusExcused: "Excused",
    btnSave: "Save Changes",
    btnCancel: "Cancel",
    btnAdd: "Add New",
    btnEdit: "Edit",
    btnDelete: "Delete",
    btnPrint: "Print / Save PDF",
    btnExport: "Export CSV",
    btnSubmit: "Submit",
    btnFilter: "Filter",
    btnReset: "Reset",
    btnJoin: "Join Session",
    btnStart: "Start Class",
    btnPay: "Pay Fee",
    btnDetails: "View Details",
    actions: "Actions",
    date: "Date",
    grade: "Grade",
    section: "Section",
    student: "Student",
    teacher: "Teacher",
    subject: "Subject",
    amount: "Amount",
    status: "Status",
    phone: "Phone",
    email: "Email",
    address: "Address",
    all: "All",

    // Dashboard
    statsTotalStudents: "Total Enrolled Students",
    statsTotalTeachers: "Active Faculty",
    statsAvgAttendance: "Today's Attendance",
    statsFeeCollection: "Monthly Fee Collected",
    statsLiveClasses: "Active Live Classes",
    statsPendingAdmissions: "Pending Admissions",
    quickActions: "Quick Workflows",
    upcomingSchedule: "Today's Timetable",
    recentAnnouncements: "School Announcements",

    // LMS / Classroom
    courseOutline: "Course Outline & Notes",
    lowBandwidthAudio: "Low-Data Audio Only",
    startQuiz: "Start Quiz",
    timeLeft: "Time Left",
    submitQuiz: "Submit Answers",
    quizCompleted: "Quiz Submitted Successfully",
    score: "Score",

    // Printouts
    officialTranscript: "OFFICIAL ACADEMIC REPORT CARD",
    officialReceipt: "OFFICIAL FEE PAYMENT RECEIPT",
    officialCert: "CERTIFICATE OF MERIT",

    // Alerts
    confirmDelete: "Are you sure you want to delete this record?",
    savedSuccess: "Changes saved successfully!",
    submittedSuccess: "Submitted successfully!"
  },

  ar: {
    // School Branding
    schoolName: "مدرسة برينفيلد النموذجية",
    schoolMotto: "النمو والحكمة والمعرفة لأجيال المستقبل",
    villageTag: "أكاديمية التعليم الرقمي الريفي",

    // Roles
    roleAdmin: "المشرف العام",
    rolePrincipal: "مدير المدرسة",
    roleTeacher: "معلم",
    roleStudent: "طالب",
    roleParent: "ولي أمر",
    roleAccountant: "المحاسب المالي",

    // Modules
    navDashboard: "لوحة التحكم",
    navStudents: "إدارة الطلاب",
    navTeachers: "هيئة التدريس",
    navAdmissions: "طلبات القبول",
    navClasses: "الفصول والمواد",
    navTimetable: "الجدول الأسبوعي",
    navAttendance: "سجل الحضور",
    navLms: "التعليم الإلكتروني",
    navLiveClass: "الفصول المباشرة",
    navHomework: "الواجبات المدرسية",
    navExams: "الاختبارات والامتحانات",
    navResults: "النتائج والشهادات",
    navFees: "الرسوم والمالية",
    navParent: "بوابة أولياء الأمور",
    navCommunication: "التواصل والرسائل",
    navCalendar: "التقويم المدرسي",
    navReports: "التقارير والإحصائيات",
    navLibrary: "المكتبة والمستودع",
    navCertificates: "إصدار الشهادات",
    navSettings: "الإعدادات والسجلات",

    // Common UI
    searchPlaceholder: "البحث في السجلات، الطلاب، المواد...",
    quickRoleSwitch: "التبديل السريع للأدوار:",
    activeUser: "مُسجل باسم",
    logout: "تسجيل الخروج",
    welcome: "مرحباً بك مجدداً",
    lowBandwidthBadge: "مُحسّن للإنترنت الضعيف",
    statusActive: "نشط",
    statusPending: "قيد الانتظار",
    statusApproved: "مقبول",
    statusRejected: "مرفوض",
    statusPaid: "مدفوع بالكامل",
    statusUnpaid: "غير مدفوع",
    statusPartial: "مدفوع جزئياً",
    statusPresent: "حاضر",
    statusAbsent: "غائب",
    statusLate: "متأخر",
    statusExcused: "معذور",
    btnSave: "حفظ التغييرات",
    btnCancel: "إلغاء",
    btnAdd: "إضافة جديد",
    btnEdit: "تعديل",
    btnDelete: "حذف",
    btnPrint: "طباعة / حفظ PDF",
    btnExport: "تصدير CSV",
    btnSubmit: "إرسال",
    btnFilter: "تصفية",
    btnReset: "إعادة تعيين",
    btnJoin: "انضمام للدرس",
    btnStart: "بدء الحصة",
    btnPay: "دفع الرسوم",
    btnDetails: "عرض التفاصيل",
    actions: "الإجراءات",
    date: "التاريخ",
    grade: "الصف الدراسي",
    section: "الشعبة",
    student: "الطالب",
    teacher: "المعلم",
    subject: "المادة الدراسية",
    amount: "المبلغ",
    status: "الحالة",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    address: "العنوان",
    all: "الكل",

    // Dashboard
    statsTotalStudents: "إجمالي الطلاب المسجلين",
    statsTotalTeachers: "المعلمين النشطين",
    statsAvgAttendance: "نسبة الحضور اليوم",
    statsFeeCollection: "المحصل من الرسوم الشهرية",
    statsLiveClasses: "الحصص المباشرة النشطة",
    statsPendingAdmissions: "طلبات القبول الجديدة",
    quickActions: "المهام السريعة",
    upcomingSchedule: "جدول اليوم الدراسي",
    recentAnnouncements: "الإعلانات المدرسية",

    // LMS / Classroom
    courseOutline: "محتوى الدرس والملاحظات",
    lowBandwidthAudio: "صوت فقط (توفير البيانات)",
    startQuiz: "بدء الاختبار",
    timeLeft: "الوقت المتبقي",
    submitQuiz: "تسليم الإجابات",
    quizCompleted: "تم إرسال الاختبار بنجاح",
    score: "الدرجة المستحقة",

    // Printouts
    officialTranscript: "الشهادة الأكاديمية الرسمية",
    officialReceipt: "إيصال سداد الرسوم المدرسية",
    officialCert: "شهادة تميز وتقدير",

    // Alerts
    confirmDelete: "هل أنت متأكد من رغبتك في حذف هذا السجل؟",
    savedSuccess: "تم حفظ التغييرات بنجاح!",
    submittedSuccess: "تم الإرسال بنجاح!"
  }
};

class I18nService {
  constructor() {
    this.currentLang = this.loadLang();
    this.applyLanguage(this.currentLang);
  }

  loadLang() {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === 'ar' || stored === 'en') return stored;
    } catch (e) {}
    return 'en';
  }

  setLanguage(lang) {
    if (lang !== 'en' && lang !== 'ar') return;
    this.currentLang = lang;
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {}
    this.applyLanguage(lang);
    window.dispatchEvent(new CustomEvent('lang-changed', { detail: { lang } }));
  }

  toggleLanguage() {
    this.setLanguage(this.currentLang === 'en' ? 'ar' : 'en');
  }

  applyLanguage(lang) {
    const isRtl = lang === 'ar';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    if (document.body) {
      if (isRtl) {
        document.body.classList.add('rtl-mode');
      } else {
        document.body.classList.remove('rtl-mode');
      }
    }
  }

  t(key) {
    return TRANSLATIONS[this.currentLang][key] || TRANSLATIONS['en'][key] || key;
  }

  isRTL() {
    return this.currentLang === 'ar';
  }
}

window.I18n = new I18nService();
