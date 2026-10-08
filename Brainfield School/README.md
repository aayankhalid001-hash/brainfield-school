# Brainfield School — Web-based School Management System, LMS & Parent Portal

A modern, fast, lightweight, and fully responsive **School Management System + Learning Management System (LMS) + Virtual Smart Classroom + Parent Portal** built specifically for **Brainfield School**, a rural/village-based online academy.

---

## 🌟 Key Highlights

* **All-in-One Educational Platform**: Consolidates school administration, academic curriculum, virtual learning, examination testing, fee accounting, and parent communication into a single interface.
* **Low-Bandwidth & Rural Optimized**:
  * **Zero External CDN Dependencies**: Runs completely self-contained with no external library delays on 2G/3G or intermittent village satellite connections.
  * **Audio-Only / Data Saver Mode**: Enables 90% data savings for students with limited data packs.
  * **Offline-First Resilience**: All changes persist in `localStorage` with instant database exports and imports.
* **Bilingual English & Arabic (RTL) Support**: Instant toggle with complete layout mirroring (`dir="rtl"`), Arabic fonts, and translated UI strings.
* **Modern Education UI & Dark/Light Mode**: Styled with a clean, professional palette (Navy Blue `#1E3A8A`, Wisdom Amber `#D97706`, Growth Emerald `#059669`), subtle glassmorphism, responsive cards, and clean typography.
* **High-DPI Printable Documents**: Authentic, printable **Official Student Report Cards**, **Fee Payment Receipts**, and **Certificates of Merit & Transfer**.

---

## 👥 6 User Roles & Permissions

Use the **One-Click Role Switcher** at the top right of the topbar to test any perspective instantaneously:

| Role | Demo Account | Default Credentials | Permissions Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | Al-Hajj Amin Khan | `admin@brainfield.edu` | Complete institutional control: all 20 modules, security logs, database backup/restore, settings |
| **Principal** | Dr. Tariq Mahmood | `principal@brainfield.edu` | Academics, admissions pipeline, faculty directory, student rosters, examinations, reports |
| **Teacher** | Sir Ahmed Raza | `teacher.ahmed@brainfield.edu` | Classes, attendance registers, course LMS, live classroom launcher, homework grading, quiz marks |
| **Student** | Bilal Rasheed | `student.bilal@brainfield.edu` | Class timetable, lesson videos & notes, homework submission, interactive timed quiz taking, report cards |
| **Parent** | Rasheed Ahmed | `parent.rasheed@brainfield.edu` | Multi-child switcher (Bilal & Ayesha), daily attendance, fees payment simulator, teacher messaging |
| **Accountant** | Muhammad Shakeel | `accountant@brainfield.edu` | Fee invoices, receipt voucher generation, discounts, expense tracker, financial reports |

---

## 📦 The 20 Core Modules

1. **Dashboard**: Role-customized analytics, attendance percentages, monthly fee collection, daily timetable snapshot, and urgent notices.
2. **Student Management**: Student profiles, roll numbers, guardian contacts, medical info, attendance history, and enrollment forms.
3. **Teacher Management**: Faculty directory, department leads, subject specializations, qualifications, and class workloads.
4. **Admissions**: Public/Admin online admission portal, application review pipeline (Pending/Approved/Rejected), and one-click auto-enrollment into classes.
5. **Classes & Subjects**: Classrooms (Grade 5 to Grade 10), sections A & B, homeroom teachers, and enrolled student rosters.
6. **Timetable**: Interactive weekly schedule filterable by day (Monday to Friday) and periods, linking directly to live virtual rooms.
7. **Attendance**: Daily interactive register with **P** (Present), **A** (Absent), **L** (Late), and **E** (Excused); includes a **"Mark All Present"** batch button and reason notes.
8. **Online Learning / LMS**: Course curriculum, downloadable lesson notes, embedded video lessons, and **Low-Bandwidth Audio Mode** toggle.
9. **Live Online Classes**: Scheduled and live sessions with an interactive **Smart Classroom**:
   * Interactive **HTML5 Whiteboard Canvas** with colored markers, eraser, and clear tools
   * Live Classroom Chat stream
   * **Raise Hand** feature
   * Camera and Microphone controls
   * Auto-attendance logger
10. **Homework & Assignments**: Teachers create assignments with due dates; students submit answers and photos of their notebooks; teachers grade and provide constructive feedback.
11. **Exams & Quizzes**: Interactive online quiz engine with:
    * Live countdown timer
    * Objective MCQs & short-answer questions
    * Instant automatic grading and score report with step-by-step explanations
12. **Results & Report Cards**: Term exam marksheets, GPA, class ranking, and a **Printable Official Report Card** with school crest and principal signature.
13. **Fees & Payments**: Invoices, payment recording (Cash, Mobile Money JazzCash/EasyPaisa, Bank Wire), and printable **Official Fee Receipts**.
14. **Parent Portal**: Dedicated view for parents with multi-child switching, fee clearance, child attendance, and direct teacher messaging.
15. **Communication**: School notice board for announcements + two-way encrypted direct chat between parents, teachers, and admins.
16. **School Calendar**: Academic year calendar with color-coded exam dates, holidays, events, and PTA meetings.
17. **Reports**: Printable and exportable summaries for academic performance, attendance, and financial statements.
18. **Library & Inventory**: Library catalog with issue/return book tracker + school physical asset inventory (tablets, solar batteries, lab equipment).
19. **Certificates**: Generator for Merit Awards, Character Certificates, and Transfer Certificates (TC) with decorative borders and gold seals.
20. **Settings & Logs**: School profile customization, grading criteria, database JSON backup/restore, factory reset, and real-time audit logs.

---

## 🚀 How to Run Locally

### Option 1: Direct File Launch (No server needed)
Double-click `index.html` or open it directly in any modern browser:
```
file:///d:/Brainfield School/index.html
```

### Option 2: Lightweight PowerShell Server
Run the included PowerShell script to host the app locally on port 5500:
```powershell
powershell -ExecutionPolicy Bypass -File .\start-server.ps1
```
Then navigate to:
```
http://localhost:5500/
```

---

## 📁 Project Structure

```
d:/Brainfield School/
├── assets/
│   ├── logo.jpg               # Official Brainfield School crest & emblem
│   └── campus.jpg             # High-resolution rural academy campus banner
├── css/
│   ├── variables.css          # Design system tokens, color palettes & dark mode
│   ├── style.css              # Main application stylesheet & layout rules
│   ├── rtl.css                # Right-to-Left styling for Arabic language mode
│   └── print.css              # Print stylesheet for report cards & certificates
├── js/
│   ├── db.js                  # Central database, mock data, and localStorage engine
│   ├── auth.js                # Authentication service & 6-role permission matrix
│   ├── i18n.js                # Localization dictionary (English & Arabic RTL)
│   ├── router.js              # SPA router and dynamic view manager
│   ├── app.js                 # App initialization, theme, search & global toasts
│   └── modules/               # The 20 specialized application modules
│       ├── dashboard.js
│       ├── students.js
│       ├── teachers.js
│       ├── admissions.js
│       ├── classes.js
│       ├── timetable.js
│       ├── attendance.js
│       ├── lms.js
│       ├── liveclass.js
│       ├── homework.js
│       ├── exams.js
│       ├── results.js
│       ├── fees.js
│       ├── parent.js
│       ├── communication.js
│       ├── calendar.js
│       ├── reports.js
│       ├── library.js
│       ├── certificates.js
│       └── settings.js
├── index.html                 # Main application shell
├── start-server.ps1           # Zero-dependency local web server
└── README.md                  # System documentation
```

---

*© 1998–2026 Brainfield School. Growth, Wisdom & Knowledge for Rural Minds.*
