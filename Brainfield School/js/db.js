/**
 * Brainfield School - Central Database & State Engine
 * Designed for offline-first resilience, low-bandwidth environments, and full CRUD persistence via localStorage.
 */

const STORAGE_KEY = 'BRAINFIELD_SCHOOL_DB_V1';

const INITIAL_DB = {
  schoolInfo: {
    name: "Brainfield School",
    nameAr: "مدرسة برينفيلد النموذجية",
    tagline: "Growth, Wisdom & Knowledge for Rural Minds",
    taglineAr: "النمو والحكمة والمعرفة لأجيال المستقبل",
    founded: "1998",
    registrationNo: "BFS-EDU-9821-R",
    address: "Green Valley Village, Rural District 4, Postal Code 45200",
    addressAr: "قرية الوادي الأخضر، المقاطعة الريفية 4، الرمز البريدي 45200",
    phone: "+92 300 1234567 / +92 51 9876543",
    email: "info@brainfield.edu",
    website: "www.brainfield.edu",
    principalName: "Dr. Tariq Mahmood",
    principalTitle: "Principal & Academic Director",
    academicYear: "2026-2027",
    currency: "$",
    gradingScale: [
      { grade: "A+", min: 90, max: 100, gpa: 4.0, remark: "Outstanding" },
      { grade: "A", min: 80, max: 89, gpa: 3.7, remark: "Excellent" },
      { grade: "B", min: 70, max: 79, gpa: 3.0, remark: "Very Good" },
      { grade: "C", min: 60, max: 69, gpa: 2.0, remark: "Good / Satisfactory" },
      { grade: "D", min: 50, max: 59, gpa: 1.0, remark: "Needs Improvement" },
      { grade: "F", min: 0, max: 49, gpa: 0.0, remark: "Fail" }
    ]
  },

  users: [
    {
      id: "u1",
      name: "Al-Hajj Amin Khan",
      nameAr: "الحاج أمين خان",
      email: "admin@brainfield.edu",
      role: "admin",
      roleTitle: "Super Administrator",
      avatar: "👨‍💼",
      phone: "+92 300 1111111",
      badge: "Full Control"
    },
    {
      id: "u2",
      name: "Dr. Tariq Mahmood",
      nameAr: "د. طارق محمود",
      email: "principal@brainfield.edu",
      role: "principal",
      roleTitle: "School Principal",
      avatar: "🎓",
      phone: "+92 300 2222222",
      badge: "Academics & Operations"
    },
    {
      id: "u3",
      name: "Sir Ahmed Raza",
      nameAr: "أ. أحمد رضا",
      email: "teacher.ahmed@brainfield.edu",
      role: "teacher",
      roleTitle: "Senior Mathematics Teacher",
      subject: "Mathematics",
      assignedClass: "Grade 8-A",
      avatar: "👨‍🏫",
      phone: "+92 300 3333333",
      badge: "Math & Analytics"
    },
    {
      id: "u4",
      name: "Ms. Fatima Noor",
      nameAr: "أ. فاطمة نور",
      email: "teacher.fatima@brainfield.edu",
      role: "teacher",
      roleTitle: "Science & Biology Teacher",
      subject: "General Science",
      assignedClass: "Grade 7-A",
      avatar: "👩‍🏫",
      phone: "+92 300 4444444",
      badge: "Science Dept"
    },
    {
      id: "u5",
      name: "Mr. Zahid Hussain",
      nameAr: "أ. زاهد حسين",
      email: "teacher.zahid@brainfield.edu",
      role: "teacher",
      roleTitle: "English Language Specialist",
      subject: "English Literature",
      assignedClass: "Grade 9-A",
      avatar: "👨‍🏫",
      phone: "+92 300 5555555",
      badge: "Languages"
    },
    {
      id: "u6",
      name: "Ustadh Omar Farooq",
      nameAr: "الشيخ عمر فاروق",
      email: "teacher.omar@brainfield.edu",
      role: "teacher",
      roleTitle: "Arabic & Ethics Instructor",
      subject: "Arabic & Islamic Studies",
      assignedClass: "Grade 6-B",
      avatar: "👳‍♂️",
      phone: "+92 300 6666666",
      badge: "Islamic Studies"
    },
    {
      id: "u7",
      name: "Bilal Rasheed",
      nameAr: "بلال رشيد",
      email: "student.bilal@brainfield.edu",
      role: "student",
      roleTitle: "Student (Grade 8-A)",
      studentId: "s1",
      grade: "Grade 8",
      section: "A",
      rollNo: "08-A-01",
      avatar: "👦",
      parentId: "u9",
      badge: "Honors Student"
    },
    {
      id: "u8",
      name: "Ayesha Rasheed",
      nameAr: "عائشة رشيد",
      email: "student.ayesha@brainfield.edu",
      role: "student",
      roleTitle: "Student (Grade 6-B)",
      studentId: "s2",
      grade: "Grade 6",
      section: "B",
      rollNo: "06-B-04",
      avatar: "👧",
      parentId: "u9",
      badge: "Junior Student"
    },
    {
      id: "u9",
      name: "Rasheed Ahmed",
      nameAr: "رشيد أحمد (ولي أمر)",
      email: "parent.rasheed@brainfield.edu",
      role: "parent",
      roleTitle: "Parent / Guardian",
      childrenIds: ["s1", "s2"],
      avatar: "👨‍👩‍👧",
      phone: "+92 321 7777777",
      occupation: "Agriculture & Solar Tech",
      badge: "Active PTA Member"
    },
    {
      id: "u10",
      name: "Muhammad Shakeel",
      nameAr: "محمد شكيل (المحاسب)",
      email: "accountant@brainfield.edu",
      role: "accountant",
      roleTitle: "Finance & Accounts Officer",
      avatar: "💼",
      phone: "+92 345 8888888",
      badge: "Finance Desk"
    }
  ],

  classes: [
    { id: "c-g5", name: "Grade 5", section: "A", classTeacher: "Sir Ahmed Raza", room: "Room 101", capacity: 30, enrolled: 24, shift: "Morning", subjects: ["Mathematics", "General Science", "English", "Urdu/Arabic", "Social Studies"] },
    { id: "c-g6a", name: "Grade 6", section: "A", classTeacher: "Ms. Fatima Noor", room: "Room 102", capacity: 30, enrolled: 26, shift: "Morning", subjects: ["Mathematics", "General Science", "English", "Computer Science", "Arabic Studies"] },
    { id: "c-g6b", name: "Grade 6", section: "B", classTeacher: "Ustadh Omar Farooq", room: "Room 103", capacity: 30, enrolled: 22, shift: "Morning", subjects: ["Mathematics", "General Science", "English", "Computer Science", "Arabic Studies"] },
    { id: "c-g7", name: "Grade 7", section: "A", classTeacher: "Mr. Zahid Hussain", room: "Room 201", capacity: 35, enrolled: 28, shift: "Morning", subjects: ["Mathematics", "Physics & Chemistry", "English", "Social Studies", "Computer Science"] },
    { id: "c-g8a", name: "Grade 8", section: "A", classTeacher: "Sir Ahmed Raza", room: "Room 202 (Smart Hall)", capacity: 35, enrolled: 30, shift: "Morning", subjects: ["Mathematics", "General Science", "English", "Computer Science", "Islamic Studies"] },
    { id: "c-g8b", name: "Grade 8", section: "B", classTeacher: "Ms. Fatima Noor", room: "Room 203", capacity: 35, enrolled: 25, shift: "Morning", subjects: ["Mathematics", "General Science", "English", "Computer Science", "Islamic Studies"] },
    { id: "c-g9", name: "Grade 9", section: "A", classTeacher: "Mr. Zahid Hussain", room: "Room 301", capacity: 35, enrolled: 27, shift: "Morning", subjects: ["Higher Math", "Biology/Physics", "English Literature", "Pak Studies", "Computer Science"] },
    { id: "c-g10", name: "Grade 10", section: "A", classTeacher: "Dr. Tariq Mahmood", room: "Room 302", capacity: 35, enrolled: 29, shift: "Morning", subjects: ["Higher Math", "Physics & Chemistry", "English Literature", "Islamic Studies", "Computer Science"] }
  ],

  students: [
    {
      id: "s1",
      rollNo: "08-A-01",
      name: "Bilal Rasheed",
      nameAr: "بلال رشيد",
      gender: "Male",
      grade: "Grade 8",
      section: "A",
      dob: "2012-05-14",
      admissionDate: "2020-04-01",
      bloodGroup: "B+",
      parentName: "Rasheed Ahmed",
      parentPhone: "+92 321 7777777",
      parentEmail: "parent.rasheed@brainfield.edu",
      address: "House 12, Main Bazaar, Green Valley Village",
      status: "Active",
      attendanceRate: 96,
      balanceFee: 0,
      avatar: "👦",
      notes: "Top student in Mathematics; passionate about solar electronics."
    },
    {
      id: "s2",
      rollNo: "06-B-04",
      name: "Ayesha Rasheed",
      nameAr: "عائشة رشيد",
      gender: "Female",
      grade: "Grade 6",
      section: "B",
      dob: "2014-08-22",
      admissionDate: "2022-04-01",
      bloodGroup: "O+",
      parentName: "Rasheed Ahmed",
      parentPhone: "+92 321 7777777",
      parentEmail: "parent.rasheed@brainfield.edu",
      address: "House 12, Main Bazaar, Green Valley Village",
      status: "Active",
      attendanceRate: 98,
      balanceFee: 0,
      avatar: "👧",
      notes: "Excellent creative writer; won the regional village reading medal."
    },
    {
      id: "s3",
      rollNo: "08-A-02",
      name: "Hamza Tariq",
      nameAr: "حمزة طارق",
      gender: "Male",
      grade: "Grade 8",
      section: "A",
      dob: "2012-03-10",
      admissionDate: "2020-04-01",
      bloodGroup: "A+",
      parentName: "Tariq Aziz",
      parentPhone: "+92 301 4455667",
      parentEmail: "tariq.aziz@email.com",
      address: "Farmland Road, North Village Sector",
      status: "Active",
      attendanceRate: 92,
      balanceFee: 25,
      avatar: "🧑",
      notes: "Captain of the junior school cricket team."
    },
    {
      id: "s4",
      rollNo: "08-A-03",
      name: "Zainab Bibi",
      nameAr: "زينب بي بي",
      gender: "Female",
      grade: "Grade 8",
      section: "A",
      dob: "2012-09-18",
      admissionDate: "2021-04-01",
      bloodGroup: "AB+",
      parentName: "Ghulam Murtaza",
      parentPhone: "+92 302 5566778",
      parentEmail: "ghulam.murtaza@email.com",
      address: "Near Water Well, East Hamlet",
      status: "Active",
      attendanceRate: 94,
      balanceFee: 0,
      avatar: "🧕",
      notes: "Outstanding performance in General Science experiments."
    },
    {
      id: "s5",
      rollNo: "08-A-04",
      name: "Usman Ghani",
      nameAr: "عثمان غني",
      gender: "Male",
      grade: "Grade 8",
      section: "A",
      dob: "2012-01-30",
      admissionDate: "2020-04-01",
      bloodGroup: "O-",
      parentName: "Kareem Dad",
      parentPhone: "+92 303 6677889",
      parentEmail: "kareem.dad@email.com",
      address: "South Orchard Block, Green Valley",
      status: "Active",
      attendanceRate: 88,
      balanceFee: 50,
      avatar: "👦",
      notes: "Requires occasional support in English composition."
    },
    {
      id: "s6",
      rollNo: "07-A-01",
      name: "Mariam Gul",
      nameAr: "مريم غل",
      gender: "Female",
      grade: "Grade 7",
      section: "A",
      dob: "2013-06-12",
      admissionDate: "2021-04-01",
      bloodGroup: "B-",
      parentName: "Gul Zaman",
      parentPhone: "+92 304 7788990",
      parentEmail: "gul.zaman@email.com",
      address: "Hills View Cottage, Upper Valley",
      status: "Active",
      attendanceRate: 97,
      balanceFee: 0,
      avatar: "👧",
      notes: "First position in Grade 6 annual examinations."
    },
    {
      id: "s7",
      rollNo: "07-A-02",
      name: "Saad Farooq",
      nameAr: "سعد فاروق",
      gender: "Male",
      grade: "Grade 7",
      section: "A",
      dob: "2013-11-05",
      admissionDate: "2021-04-01",
      bloodGroup: "A-",
      parentName: "Farooq Shah",
      parentPhone: "+92 305 8899001",
      parentEmail: "farooq.shah@email.com",
      address: "School Road 3, Center Village",
      status: "Active",
      attendanceRate: 91,
      balanceFee: 0,
      avatar: "🧑",
      notes: "Very active in digital computer lab sessions."
    },
    {
      id: "s8",
      rollNo: "09-A-01",
      name: "Hassan Raza",
      nameAr: "حسن رضا",
      gender: "Male",
      grade: "Grade 9",
      section: "A",
      dob: "2011-04-19",
      admissionDate: "2019-04-01",
      bloodGroup: "O+",
      parentName: "Raza Ali",
      parentPhone: "+92 306 9900112",
      parentEmail: "raza.ali@email.com",
      address: "River Bank Quarter, West Valley",
      status: "Active",
      attendanceRate: 95,
      balanceFee: 0,
      avatar: "👦",
      notes: "Aspiring software engineer; maintains school solar inverter stats."
    },
    {
      id: "s9",
      rollNo: "10-A-01",
      name: "Khadija Bibi",
      nameAr: "خديجة بي بي",
      gender: "Female",
      grade: "Grade 10",
      section: "A",
      dob: "2010-02-14",
      admissionDate: "2018-04-01",
      bloodGroup: "B+",
      parentName: "Akbar Jan",
      parentPhone: "+92 307 1010101",
      parentEmail: "akbar.jan@email.com",
      address: "Old Mosque Lane, Green Valley",
      status: "Active",
      attendanceRate: 99,
      balanceFee: 0,
      avatar: "🧕",
      notes: "Candidate for district gold medal in Secondary School Board."
    },
    {
      id: "s10",
      rollNo: "05-A-01",
      name: "Abdullah Noman",
      nameAr: "عبدالله نعمان",
      gender: "Male",
      grade: "Grade 5",
      section: "A",
      dob: "2015-10-03",
      admissionDate: "2023-04-01",
      bloodGroup: "A+",
      parentName: "Noman Bashir",
      parentPhone: "+92 308 2020202",
      parentEmail: "noman.bashir@email.com",
      address: "Village Entry Gate, House 4",
      status: "Active",
      attendanceRate: 93,
      balanceFee: 30,
      avatar: "👦",
      notes: "Very attentive student, eager in math puzzles."
    }
  ],

  teachers: [
    {
      id: "t1",
      name: "Sir Ahmed Raza",
      nameAr: "أ. أحمد رضا",
      gender: "Male",
      email: "teacher.ahmed@brainfield.edu",
      phone: "+92 300 3333333",
      qualification: "M.Sc Mathematics (Gold Medalist)",
      experience: "9 Years",
      subjects: ["Mathematics", "Computer Basics"],
      assignedClasses: ["Grade 8-A", "Grade 5-A", "Grade 7-A"],
      designation: "Head of Mathematics Department",
      salary: 550,
      status: "Active",
      avatar: "👨‍🏫"
    },
    {
      id: "t2",
      name: "Ms. Fatima Noor",
      nameAr: "أ. فاطمة نور",
      gender: "Female",
      email: "teacher.fatima@brainfield.edu",
      phone: "+92 300 4444444",
      qualification: "M.Sc General Science & Botany",
      experience: "7 Years",
      subjects: ["General Science", "Biology"],
      assignedClasses: ["Grade 6-A", "Grade 8-A", "Grade 8-B"],
      designation: "Science Laboratory Coordinator",
      salary: 520,
      status: "Active",
      avatar: "👩‍🏫"
    },
    {
      id: "t3",
      name: "Mr. Zahid Hussain",
      nameAr: "أ. زاهد حسين",
      gender: "Male",
      email: "teacher.zahid@brainfield.edu",
      phone: "+92 300 5555555",
      qualification: "M.A English Language & Literature",
      experience: "11 Years",
      subjects: ["English Language", "English Literature"],
      assignedClasses: ["Grade 7-A", "Grade 8-A", "Grade 9-A"],
      designation: "Senior English Master",
      salary: 580,
      status: "Active",
      avatar: "👨‍🏫"
    },
    {
      id: "t4",
      name: "Ustadh Omar Farooq",
      nameAr: "الشيخ عمر فاروق",
      gender: "Male",
      email: "teacher.omar@brainfield.edu",
      phone: "+92 300 6666666",
      qualification: "B.A Arabic & Islamic Jurisprudence (Al-Azhar)",
      experience: "12 Years",
      subjects: ["Arabic Language", "Islamic Studies", "Ethics"],
      assignedClasses: ["Grade 6-B", "Grade 8-A", "Grade 10-A"],
      designation: "Dean of Moral Education & Arabic",
      salary: 530,
      status: "Active",
      avatar: "👳‍♂️"
    },
    {
      id: "t5",
      name: "Engr. Salman Faris",
      nameAr: "م. سلمان فارس",
      gender: "Male",
      email: "salman.cs@brainfield.edu",
      phone: "+92 300 7777777",
      qualification: "B.S Computer Systems Engineering",
      experience: "5 Years",
      subjects: ["Computer Science", "Coding & Digital Skills"],
      assignedClasses: ["Grade 6-A", "Grade 7-A", "Grade 8-A", "Grade 9-A"],
      designation: "IT & E-Learning Specialist",
      salary: 500,
      status: "Active",
      avatar: "👨‍💻"
    }
  ],

  admissions: [
    {
      id: "adm-101",
      applicationNo: "BF-2026-081",
      studentName: "Danish Kareem",
      studentNameAr: "دانش كريم",
      gender: "Male",
      appliedGrade: "Grade 8",
      dob: "2012-07-15",
      parentName: "Kareemullah",
      phone: "+92 301 9988776",
      village: "River Ridge Village",
      previousSchool: "Govt Primary School #2",
      appliedDate: "2026-09-28",
      status: "Pending",
      notes: "Father is an electrician; keen on attending our hybrid tablet program."
    },
    {
      id: "adm-102",
      applicationNo: "BF-2026-082",
      studentName: "Sana Mir",
      studentNameAr: "ثناء مير",
      gender: "Female",
      appliedGrade: "Grade 6",
      dob: "2014-04-10",
      parentName: "Mir Afzal",
      phone: "+92 302 8877665",
      village: "Hillside Hamlet",
      previousSchool: "Valley Girls Primary",
      appliedDate: "2026-10-01",
      status: "Approved",
      notes: "Scored 92% in baseline reading and numeracy assessment."
    },
    {
      id: "adm-103",
      applicationNo: "BF-2026-083",
      studentName: "Qasim Jan",
      studentNameAr: "قاسم جان",
      gender: "Male",
      appliedGrade: "Grade 5",
      dob: "2015-11-20",
      parentName: "Jan Alam",
      phone: "+92 303 7766554",
      village: "South Meadow",
      previousSchool: "Village Community Center",
      appliedDate: "2026-10-03",
      status: "Pending",
      notes: "Interview scheduled with Academic Coordinator."
    },
    {
      id: "adm-104",
      applicationNo: "BF-2026-084",
      studentName: "Farhan Ali",
      studentNameAr: "فرحان علي",
      gender: "Male",
      appliedGrade: "Grade 7",
      dob: "2013-09-08",
      parentName: "Sher Ali",
      phone: "+92 304 6655443",
      village: "Upper Stream",
      previousSchool: "Al-Khair Academy",
      appliedDate: "2026-09-20",
      status: "Rejected",
      notes: "Outside geographic bus route; advised online self-paced module."
    }
  ],

  timetable: [
    { day: "Monday", period: "1 (08:30 - 09:15)", subject: "Mathematics", teacher: "Sir Ahmed Raza", class: "Grade 8-A", room: "Smart Hall / Room 202" },
    { day: "Monday", period: "2 (09:15 - 10:00)", subject: "General Science", teacher: "Ms. Fatima Noor", class: "Grade 8-A", room: "Science Lab" },
    { day: "Monday", period: "3 (10:15 - 11:00)", subject: "English Grammar", teacher: "Mr. Zahid Hussain", class: "Grade 8-A", room: "Room 202" },
    { day: "Monday", period: "4 (11:00 - 11:45)", subject: "Computer Literacy", teacher: "Engr. Salman Faris", class: "Grade 8-A", room: "Solar Computer Lab" },
    { day: "Monday", period: "5 (12:00 - 12:45)", subject: "Islamic Studies / Ethics", teacher: "Ustadh Omar Farooq", class: "Grade 8-A", room: "Room 202" },
    
    { day: "Tuesday", period: "1 (08:30 - 09:15)", subject: "General Science", teacher: "Ms. Fatima Noor", class: "Grade 8-A", room: "Science Lab" },
    { day: "Tuesday", period: "2 (09:15 - 10:00)", subject: "Mathematics", teacher: "Sir Ahmed Raza", class: "Grade 8-A", room: "Room 202" },
    { day: "Tuesday", period: "3 (10:15 - 11:00)", subject: "Arabic Language", teacher: "Ustadh Omar Farooq", class: "Grade 8-A", room: "Room 202" },
    { day: "Tuesday", period: "4 (11:00 - 11:45)", subject: "English Composition", teacher: "Mr. Zahid Hussain", class: "Grade 8-A", room: "Room 202" },
    { day: "Tuesday", period: "5 (12:00 - 12:45)", subject: "Practical Agriculture & Nature", teacher: "Ms. Fatima Noor", class: "Grade 8-A", room: "School Garden" },

    { day: "Wednesday", period: "1 (08:30 - 09:15)", subject: "Mathematics", teacher: "Sir Ahmed Raza", class: "Grade 8-A", room: "Room 202" },
    { day: "Wednesday", period: "2 (09:15 - 10:00)", subject: "English Literature", teacher: "Mr. Zahid Hussain", class: "Grade 8-A", room: "Room 202" },
    { day: "Wednesday", period: "3 (10:15 - 11:00)", subject: "General Science", teacher: "Ms. Fatima Noor", class: "Grade 8-A", room: "Science Lab" },
    { day: "Wednesday", period: "4 (11:00 - 11:45)", subject: "Live Online Coding", teacher: "Engr. Salman Faris", class: "Grade 8-A", room: "Virtual Room A" },
    { day: "Wednesday", period: "5 (12:00 - 12:45)", subject: "Social Studies & Geography", teacher: "Ustadh Omar Farooq", class: "Grade 8-A", room: "Room 202" },

    { day: "Thursday", period: "1 (08:30 - 09:15)", subject: "Science Experiments", teacher: "Ms. Fatima Noor", class: "Grade 8-A", room: "Science Lab" },
    { day: "Thursday", period: "2 (09:15 - 10:00)", subject: "Mathematics Geometry", teacher: "Sir Ahmed Raza", class: "Grade 8-A", room: "Room 202" },
    { day: "Thursday", period: "3 (10:15 - 11:00)", subject: "English Reading", teacher: "Mr. Zahid Hussain", class: "Grade 8-A", room: "Library" },
    { day: "Thursday", period: "4 (11:00 - 11:45)", subject: "Arabic & Tajweed", teacher: "Ustadh Omar Farooq", class: "Grade 8-A", room: "Room 202" },
    { day: "Thursday", period: "5 (12:00 - 12:45)", subject: "Physical Education / Sports", teacher: "Sir Ahmed Raza", class: "Grade 8-A", room: "Sports Ground" },

    { day: "Friday", period: "1 (08:30 - 09:15)", subject: "Weekly Quiz & Review", teacher: "Sir Ahmed Raza", class: "Grade 8-A", room: "Room 202" },
    { day: "Friday", period: "2 (09:15 - 10:00)", subject: "Moral Ethics & Community Service", teacher: "Ustadh Omar Farooq", class: "Grade 8-A", room: "Main Hall" },
    { day: "Friday", period: "3 (10:15 - 11:00)", subject: "Digital Literacy & Typing", teacher: "Engr. Salman Faris", class: "Grade 8-A", room: "Computer Lab" }
  ],

  attendance: [
    { date: "2026-10-07", classId: "c-g8a", studentId: "s1", status: "Present", remarks: "On time" },
    { date: "2026-10-07", classId: "c-g8a", studentId: "s3", status: "Present", remarks: "On time" },
    { date: "2026-10-07", classId: "c-g8a", studentId: "s4", status: "Present", remarks: "On time" },
    { date: "2026-10-07", classId: "c-g8a", studentId: "s5", status: "Late", remarks: "Transport delay (15 min)" },
    { date: "2026-10-07", classId: "c-g6b", studentId: "s2", status: "Present", remarks: "On time" },

    { date: "2026-10-06", classId: "c-g8a", studentId: "s1", status: "Present", remarks: "Active in class" },
    { date: "2026-10-06", classId: "c-g8a", studentId: "s3", status: "Present", remarks: "On time" },
    { date: "2026-10-06", classId: "c-g8a", studentId: "s4", status: "Absent", remarks: "Family farm duty" },
    { date: "2026-10-06", classId: "c-g8a", studentId: "s5", status: "Excused", remarks: "Doctor clinic appointment" },
    { date: "2026-10-06", classId: "c-g6b", studentId: "s2", status: "Present", remarks: "On time" },

    { date: "2026-10-05", classId: "c-g8a", studentId: "s1", status: "Present", remarks: "On time" },
    { date: "2026-10-05", classId: "c-g8a", studentId: "s3", status: "Present", remarks: "On time" },
    { date: "2026-10-05", classId: "c-g8a", studentId: "s4", status: "Present", remarks: "On time" },
    { date: "2026-10-05", classId: "c-g8a", studentId: "s5", status: "Present", remarks: "On time" },
    { date: "2026-10-05", classId: "c-g6b", studentId: "s2", status: "Present", remarks: "On time" }
  ],

  courses: [
    {
      id: "crs-m8",
      title: "Grade 8 Mathematics (Core & Applied)",
      titleAr: "الرياضيات للصف الثامن (الأساسية والتطبيقية)",
      grade: "Grade 8",
      subject: "Mathematics",
      teacher: "Sir Ahmed Raza",
      thumbnail: "📐",
      color: "#2563EB",
      description: "Master algebraic expressions, linear equations, ratios, geometry, and real-world calculation models.",
      totalLessons: 14,
      completedLessons: 9,
      lessons: [
        {
          id: "les-m8-1",
          title: "Unit 1: Linear Equations in One Variable",
          duration: "35 mins",
          type: "Video & PDF",
          notes: "A linear equation in one variable is an equation of the form ax + b = c where a ≠ 0. The goal is to isolate the variable using inverse operations.",
          pdfName: "Unit1_Linear_Equations_Notes.pdf",
          videoEmbed: "https://www.youtube-nocookie.com/embed/bAerID24QJ8",
          audioOnlySize: "3.2 MB (Low Data Mode)",
          isCompleted: true
        },
        {
          id: "les-m8-2",
          title: "Unit 2: Algebraic Identities & Factorization",
          duration: "40 mins",
          type: "Interactive Lesson",
          notes: "Key identities: (a + b)² = a² + 2ab + b² and (a - b)² = a² - 2ab + b², and (a + b)(a - b) = a² - b². Practical tips for splitting the middle term.",
          pdfName: "Unit2_Algebraic_Identities.pdf",
          videoEmbed: "https://www.youtube-nocookie.com/embed/9bZkp7q19f0",
          audioOnlySize: "2.8 MB (Low Data Mode)",
          isCompleted: true
        },
        {
          id: "les-m8-3",
          title: "Unit 3: Understanding Quadrilaterals & Polygons",
          duration: "30 mins",
          type: "Video & Worksheet",
          notes: "Angle sum property of quadrilateral = 360°. Types of quadrilaterals: Parallelogram, Rhombus, Rectangle, Square, and Trapezoid.",
          pdfName: "Unit3_Polygons_Geometry.pdf",
          videoEmbed: "https://www.youtube-nocookie.com/embed/kJQP7kiw5Fk",
          audioOnlySize: "2.5 MB (Low Data Mode)",
          isCompleted: false
        }
      ]
    },
    {
      id: "crs-s8",
      title: "Grade 8 General Science: Village Ecology & Solar Power",
      titleAr: "العلوم العامة للصف الثامن: البيئة الريفية والطاقة الشمسية",
      grade: "Grade 8",
      subject: "General Science",
      teacher: "Ms. Fatima Noor",
      thumbnail: "🔬",
      color: "#059669",
      description: "Hands-on understanding of village plant life, water conservation, solar energy circuits, and ecosystems.",
      totalLessons: 12,
      completedLessons: 7,
      lessons: [
        {
          id: "les-s8-1",
          title: "Lesson 1: Photosynthesis & Crop Plant Nutrition",
          duration: "28 mins",
          type: "Video & Summary",
          notes: "6CO₂ + 6H₂O + Sunlight -> C₆H₁₂O₆ + 6O₂. Chlorophyll traps light photons to split water molecules. Essential for understanding local crop yields.",
          pdfName: "Photosynthesis_Field_Guide.pdf",
          videoEmbed: "https://www.youtube-nocookie.com/embed/fJ2k_q2pWJ0",
          audioOnlySize: "2.1 MB",
          isCompleted: true
        },
        {
          id: "les-s8-2",
          title: "Lesson 2: Solar Panels & Photovoltaic Electricity",
          duration: "45 mins",
          type: "Laboratory Guide",
          notes: "Silicon solar cells convert sunlight into direct current (DC). Inverters change DC into AC for school laptops and tube lights.",
          pdfName: "Solar_Circuits_Brainfield_Lab.pdf",
          videoEmbed: "https://www.youtube-nocookie.com/embed/0elhIcPVtKE",
          audioOnlySize: "3.5 MB",
          isCompleted: true
        }
      ]
    },
    {
      id: "crs-e8",
      title: "Grade 8 English: Expressive Writing & Spoken Fluency",
      titleAr: "اللغة الإنجليزية للصف الثامن: التعبير والقراءة",
      grade: "Grade 8",
      subject: "English",
      teacher: "Mr. Zahid Hussain",
      thumbnail: "📚",
      color: "#7C3AED",
      description: "Strengthening rural students' voice through story composition, formal correspondence, and debate.",
      totalLessons: 10,
      completedLessons: 6,
      lessons: [
        {
          id: "les-e8-1",
          title: "Grammar Masterclass: Active & Passive Voice",
          duration: "30 mins",
          type: "Interactive Notes",
          notes: "Active: 'Bilal planted the tree.' Passive: 'The tree was planted by Bilal.' Use passive when the action or object is the main focus.",
          pdfName: "Active_Passive_Workbook.pdf",
          videoEmbed: "https://www.youtube-nocookie.com/embed/qg_4p_f2o90",
          audioOnlySize: "1.9 MB",
          isCompleted: true
        }
      ]
    }
  ],

  liveClasses: [
    {
      id: "live-1",
      title: "Mathematics Live: Solving Systems of Linear Equations",
      titleAr: "درس الرياضيات المباشر: حل المعادلات الخطية",
      teacher: "Sir Ahmed Raza",
      teacherAvatar: "👨‍🏫",
      grade: "Grade 8-A",
      subject: "Mathematics",
      status: "Live Now",
      startTime: "Today, 10:00 AM",
      duration: "45 mins",
      meetingId: "BF-MATH-801",
      participantsCount: 22,
      agenda: "Review homework problems, step-by-step graphical solution demo, live Q&A.",
      lowBandwidthMode: true
    },
    {
      id: "live-2",
      title: "Science Workshop: Clean Water Testing in the Village",
      titleAr: "ورشة العلوم: فحص نقاوة المياه في القرية",
      teacher: "Ms. Fatima Noor",
      teacherAvatar: "👩‍🏫",
      grade: "Grade 7-A & 8-A",
      subject: "General Science",
      status: "Scheduled",
      startTime: "Tomorrow, 11:30 AM",
      duration: "60 mins",
      meetingId: "BF-SCI-702",
      participantsCount: 0,
      agenda: "Demonstration of pH testing paper, filtration bottles, and solar UV disinfection.",
      lowBandwidthMode: true
    },
    {
      id: "live-3",
      title: "English Speaking Club: Overcoming Hesitation",
      titleAr: "نادي التحدث بالإنجليزية: تعزيز الثقة بالنفس",
      teacher: "Mr. Zahid Hussain",
      teacherAvatar: "👨‍🏫",
      grade: "Grade 8 & 9",
      subject: "English",
      status: "Recorded",
      startTime: "Recorded on Monday",
      duration: "40 mins",
      meetingId: "BF-ENG-803",
      participantsCount: 28,
      agenda: "Conversation drill with vocabulary flashcards and audio clips.",
      lowBandwidthMode: true
    }
  ],

  homework: [
    {
      id: "hw-1",
      title: "Solve Exercise 3.2 - Linear Equation Word Problems",
      titleAr: "حل تمرين 3.2 - المسائل الكلامية في المعادلات",
      subject: "Mathematics",
      grade: "Grade 8-A",
      teacher: "Sir Ahmed Raza",
      assignedDate: "2026-10-05",
      dueDate: "2026-10-09",
      maxMarks: 20,
      description: "Solve problems 1 through 8 from page 48 in your notebook. Show complete calculation steps clearly.",
      attachments: ["Math_Exercise_3_2.pdf"],
      submissions: [
        {
          studentId: "s1",
          studentName: "Bilal Rasheed",
          status: "Graded",
          submittedDate: "2026-10-06 14:30",
          textAnswer: "I have calculated all 8 problems on notebook page 24. Attached are clear snapshot photos and equations.",
          fileName: "Bilal_Math_HW_Exercise3_2.pdf",
          marksObtained: 19,
          feedback: "Brilliant step-by-step layout Bilal! Double check problem 6 sign inversion.",
          gradedBy: "Sir Ahmed Raza"
        },
        {
          studentId: "s3",
          studentName: "Hamza Tariq",
          status: "Submitted",
          submittedDate: "2026-10-07 09:15",
          textAnswer: "Done with 7 questions, struggling with question 8 ratio problem.",
          fileName: "Hamza_Math_HW.jpg",
          marksObtained: null,
          feedback: null
        },
        {
          studentId: "s4",
          studentName: "Zainab Bibi",
          status: "Pending",
          submittedDate: null,
          marksObtained: null
        }
      ]
    },
    {
      id: "hw-2",
      title: "Village Ecosystem Observation Journal",
      titleAr: "دفتر ملاحظات النظام البيئي في القرية",
      subject: "General Science",
      grade: "Grade 8-A",
      teacher: "Ms. Fatima Noor",
      assignedDate: "2026-10-04",
      dueDate: "2026-10-10",
      maxMarks: 15,
      description: "Identify 3 local crop plants and 2 beneficial insects in your surrounding fields. Write brief notes on their symbiotic role.",
      attachments: ["Ecosystem_Observation_Guide.pdf"],
      submissions: [
        {
          studentId: "s1",
          studentName: "Bilal Rasheed",
          status: "Submitted",
          submittedDate: "2026-10-06 17:00",
          textAnswer: "Observed Mustard (Brassica), Wheat saplings, and Ladybird beetles protecting against aphid pests.",
          fileName: "Bilal_Science_Journal_Village.pdf",
          marksObtained: null,
          feedback: null
        }
      ]
    },
    {
      id: "hw-3",
      title: "Essay: How Clean Energy Transforms Our Village",
      titleAr: "مقال: كيف تُغيّر الطاقة النظيفة قريتنا",
      subject: "English",
      grade: "Grade 8-A",
      teacher: "Mr. Zahid Hussain",
      assignedDate: "2026-10-02",
      dueDate: "2026-10-08",
      maxMarks: 25,
      description: "Write an inspiring 250-word essay discussing the difference solar lights and internet make to student study hours after sunset.",
      attachments: ["Essay_Writing_Rubric.pdf"],
      submissions: [
        {
          studentId: "s1",
          studentName: "Bilal Rasheed",
          status: "Graded",
          submittedDate: "2026-10-04 18:20",
          textAnswer: "Essay attached. Title: Lighting the Path: How Solar Cells Gave Our Valley Night Study Power.",
          fileName: "Bilal_English_Essay_Solar.docx",
          marksObtained: 24,
          feedback: "Superb vocabulary and poignant opening narrative!",
          gradedBy: "Mr. Zahid Hussain"
        }
      ]
    }
  ],

  exams: [
    {
      id: "ex-1",
      title: "Grade 8 Mid-Term Mathematics Online Quiz",
      titleAr: "اختبار منتصف الفصل في الرياضيات - الصف الثامن",
      subject: "Mathematics",
      grade: "Grade 8-A",
      teacher: "Sir Ahmed Raza",
      date: "2026-10-12",
      durationMinutes: 15,
      totalMarks: 20,
      passingMarks: 10,
      status: "Available",
      questions: [
        {
          id: "q1",
          type: "mcq",
          question: "What is the value of x in the linear equation: 3x + 9 = 24?",
          options: ["x = 3", "x = 5", "x = 7", "x = 9"],
          correctIndex: 1,
          explanation: "Subtract 9 from both sides: 3x = 15. Divide by 3: x = 5.",
          marks: 4
        },
        {
          id: "q2",
          type: "mcq",
          question: "Which of the following is an identity for (a + b)²?",
          options: ["a² + b²", "a² + 2ab + b²", "a² - 2ab + b²", "2a + 2b"],
          correctIndex: 1,
          explanation: "(a + b)² expands to a² + 2ab + b².",
          marks: 4
        },
        {
          id: "q3",
          type: "mcq",
          question: "The sum of interior angles in any four-sided polygon (quadrilateral) is equal to:",
          options: ["180°", "270°", "360°", "540°"],
          correctIndex: 2,
          explanation: "For an n-sided polygon, sum = (n - 2) * 180°. For n = 4: (4 - 2) * 180° = 360°.",
          marks: 4
        },
        {
          id: "q4",
          type: "mcq",
          question: "If 5 kg of wheat costs $15, what is the cost of 12 kg of wheat?",
          options: ["$30", "$36", "$40", "$45"],
          correctIndex: 1,
          explanation: "Unit rate = $15 / 5 = $3 per kg. Cost for 12 kg = 12 * $3 = $36.",
          marks: 4
        },
        {
          id: "q5",
          type: "short",
          question: "Define the term 'perimeter' of a geometrical shape in simple words.",
          sampleAnswer: "The total length of the continuous boundary surrounding the shape.",
          marks: 4
        }
      ]
    },
    {
      id: "ex-2",
      title: "General Science Term 1 Objective Assessment",
      titleAr: "التقييم الموضوعي للعلوم العامة - الفصل الأول",
      subject: "General Science",
      grade: "Grade 8-A",
      teacher: "Ms. Fatima Noor",
      date: "2026-10-15",
      durationMinutes: 20,
      totalMarks: 25,
      passingMarks: 12,
      status: "Upcoming",
      questions: [
        {
          id: "qs1",
          type: "mcq",
          question: "What gas is released into the atmosphere by plants during photosynthesis?",
          options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Methane"],
          correctIndex: 1,
          explanation: "During light-dependent photosynthesis, photolysis of water produces oxygen as a byproduct.",
          marks: 5
        },
        {
          id: "qs2",
          type: "mcq",
          question: "In a solar power system, what device converts DC battery power to AC mains voltage?",
          options: ["Transformer only", "Inverter", "Generator", "Voltmeter"],
          correctIndex: 1,
          explanation: "An inverter converts Direct Current (DC) from solar panels/batteries into Alternating Current (AC).",
          marks: 5
        }
      ]
    }
  ],

  results: [
    {
      id: "res-s1-t1",
      studentId: "s1",
      studentName: "Bilal Rasheed",
      rollNo: "08-A-01",
      grade: "Grade 8",
      section: "A",
      term: "Term 1 (Mid-Year) 2026",
      examDate: "September 2026",
      subjects: [
        { name: "Mathematics", max: 100, obtained: 96, grade: "A+", gpa: 4.0, remarks: "Top score in class; brilliant problem solver." },
        { name: "General Science", max: 100, obtained: 92, grade: "A+", gpa: 4.0, remarks: "Exceptional lab participation." },
        { name: "English Language", max: 100, obtained: 88, grade: "A", gpa: 3.7, remarks: "Great vocabulary; improve presentation." },
        { name: "Computer Studies", max: 100, obtained: 95, grade: "A+", gpa: 4.0, remarks: "Demonstrates high digital proficiency." },
        { name: "Islamic Studies & Ethics", max: 100, obtained: 94, grade: "A+", gpa: 4.0, remarks: "Exemplary moral character and knowledge." }
      ],
      totalMax: 500,
      totalObtained: 465,
      percentage: 93.0,
      overallGrade: "A+",
      cgpa: 3.94,
      classRank: "1st Position",
      attendancePercentage: 96.5,
      teacherComments: "Bilal is an exceptionally disciplined, inquisitive student who acts as an inspiring role model for peers.",
      principalSignature: "Dr. Tariq Mahmood",
      issueDate: "2026-10-01"
    },
    {
      id: "res-s2-t1",
      studentId: "s2",
      studentName: "Ayesha Rasheed",
      rollNo: "06-B-04",
      grade: "Grade 6",
      section: "B",
      term: "Term 1 (Mid-Year) 2026",
      examDate: "September 2026",
      subjects: [
        { name: "Mathematics", max: 100, obtained: 85, grade: "A", gpa: 3.7, remarks: "Consistent good calculations." },
        { name: "General Science", max: 100, obtained: 90, grade: "A+", gpa: 4.0, remarks: "Creative botanical sketches." },
        { name: "English Language", max: 100, obtained: 95, grade: "A+", gpa: 4.0, remarks: "Winner of spelling & speech award." },
        { name: "Social Studies", max: 100, obtained: 89, grade: "A", gpa: 3.7, remarks: "Very engaged in village history." },
        { name: "Arabic Studies", max: 100, obtained: 92, grade: "A+", gpa: 4.0, remarks: "Clear pronunciation and reading." }
      ],
      totalMax: 500,
      totalObtained: 451,
      percentage: 90.2,
      overallGrade: "A+",
      cgpa: 3.88,
      classRank: "2nd Position",
      attendancePercentage: 98.0,
      teacherComments: "Ayesha shows remarkable linguistic talent and polite, respectful behavior.",
      principalSignature: "Dr. Tariq Mahmood",
      issueDate: "2026-10-01"
    },
    {
      id: "res-s3-t1",
      studentId: "s3",
      studentName: "Hamza Tariq",
      rollNo: "08-A-02",
      grade: "Grade 8",
      section: "A",
      term: "Term 1 (Mid-Year) 2026",
      examDate: "September 2026",
      subjects: [
        { name: "Mathematics", max: 100, obtained: 78, grade: "B", gpa: 3.0, remarks: "Good effort; needs more algebra practice." },
        { name: "General Science", max: 100, obtained: 84, grade: "A", gpa: 3.7, remarks: "Very good understanding of machines." },
        { name: "English Language", max: 100, obtained: 76, grade: "B", gpa: 3.0, remarks: "Fair comprehension." },
        { name: "Computer Studies", max: 100, obtained: 86, grade: "A", gpa: 3.7, remarks: "Keen on hardware." },
        { name: "Islamic Studies & Ethics", max: 100, obtained: 82, grade: "A", gpa: 3.7, remarks: "Well behaved." }
      ],
      totalMax: 500,
      totalObtained: 406,
      percentage: 81.2,
      overallGrade: "A",
      cgpa: 3.42,
      classRank: "6th Position",
      attendancePercentage: 92.0,
      teacherComments: "Hamza is capable of even higher achievements with focused evening revision.",
      principalSignature: "Dr. Tariq Mahmood",
      issueDate: "2026-10-01"
    }
  ],

  fees: {
    structures: [
      { id: "fs-1", grade: "Grade 5-7", tuitionFee: 20, examFee: 5, labFee: 3, computerFee: 4, totalMonthly: 32 },
      { id: "fs-2", grade: "Grade 8-10", tuitionFee: 25, examFee: 5, labFee: 5, computerFee: 5, totalMonthly: 40 }
    ],
    invoices: [
      {
        id: "inv-2026-10-01",
        invoiceNo: "BFS-INV-1001",
        studentId: "s1",
        studentName: "Bilal Rasheed",
        grade: "Grade 8-A",
        month: "October 2026",
        dueDate: "2026-10-15",
        tuition: 25,
        labFee: 5,
        computerFee: 5,
        examFee: 5,
        scholarshipDiscount: 10,
        netPayable: 30,
        paidAmount: 30,
        status: "Paid",
        paymentDate: "2026-10-03",
        paymentMethod: "JazzCash / Mobile Money",
        receiptNo: "REC-2026-981"
      },
      {
        id: "inv-2026-10-02",
        invoiceNo: "BFS-INV-1002",
        studentId: "s2",
        studentName: "Ayesha Rasheed",
        grade: "Grade 6-B",
        month: "October 2026",
        dueDate: "2026-10-15",
        tuition: 20,
        labFee: 3,
        computerFee: 4,
        examFee: 5,
        scholarshipDiscount: 7,
        netPayable: 25,
        paidAmount: 25,
        status: "Paid",
        paymentDate: "2026-10-03",
        paymentMethod: "JazzCash / Mobile Money",
        receiptNo: "REC-2026-982"
      },
      {
        id: "inv-2026-10-03",
        invoiceNo: "BFS-INV-1003",
        studentId: "s3",
        studentName: "Hamza Tariq",
        grade: "Grade 8-A",
        month: "October 2026",
        dueDate: "2026-10-15",
        tuition: 25,
        labFee: 5,
        computerFee: 5,
        examFee: 5,
        scholarshipDiscount: 0,
        netPayable: 40,
        paidAmount: 15,
        status: "Partial",
        paymentDate: "2026-10-04",
        paymentMethod: "Cash at Desk",
        receiptNo: "REC-2026-983"
      },
      {
        id: "inv-2026-10-04",
        invoiceNo: "BFS-INV-1004",
        studentId: "s5",
        studentName: "Usman Ghani",
        grade: "Grade 8-A",
        month: "October 2026",
        dueDate: "2026-10-15",
        tuition: 25,
        labFee: 5,
        computerFee: 5,
        examFee: 5,
        scholarshipDiscount: 0,
        netPayable: 40,
        paidAmount: 0,
        status: "Unpaid",
        paymentDate: null,
        paymentMethod: null,
        receiptNo: null
      }
    ],
    receipts: [
      {
        receiptNo: "REC-2026-981",
        date: "2026-10-03",
        studentId: "s1",
        studentName: "Bilal Rasheed",
        guardianName: "Rasheed Ahmed",
        grade: "Grade 8-A",
        invoiceNo: "BFS-INV-1001",
        amountPaid: 30,
        paymentMethod: "Mobile Money (JazzCash)",
        transactionRef: "TXN-8829410",
        receivedBy: "Muhammad Shakeel (Accountant)",
        notes: "Fee cleared in full with 25% Academic Merit Scholarship applied."
      },
      {
        receiptNo: "REC-2026-982",
        date: "2026-10-03",
        studentId: "s2",
        studentName: "Ayesha Rasheed",
        guardianName: "Rasheed Ahmed",
        grade: "Grade 6-B",
        invoiceNo: "BFS-INV-1002",
        amountPaid: 25,
        paymentMethod: "Mobile Money (JazzCash)",
        transactionRef: "TXN-8829411",
        receivedBy: "Muhammad Shakeel (Accountant)",
        notes: "Sibling discount & early-bird fee incentive applied."
      },
      {
        receiptNo: "REC-2026-983",
        date: "2026-10-04",
        studentId: "s3",
        studentName: "Hamza Tariq",
        guardianName: "Tariq Aziz",
        grade: "Grade 8-A",
        invoiceNo: "BFS-INV-1003",
        amountPaid: 15,
        paymentMethod: "Cash at Desk",
        transactionRef: "CASH-DESK-04",
        receivedBy: "Muhammad Shakeel (Accountant)",
        notes: "Part payment received; remaining balance due by Oct 20."
      }
    ],
    expenses: [
      { id: "exp-1", title: "Solar Power Battery Maintenance & Water", amount: 65, category: "Utilities & Power", date: "2026-10-02", approvedBy: "Dr. Tariq Mahmood", status: "Paid" },
      { id: "exp-2", title: "High-Speed Satellite Internet Monthly Subscription", amount: 45, category: "Internet & Telecommunication", date: "2026-10-01", approvedBy: "Al-Hajj Amin Khan", status: "Paid" },
      { id: "exp-3", title: "Printing Paper, Stationery & Science Reagents", amount: 38, category: "Academic Supplies", date: "2026-09-29", approvedBy: "Muhammad Shakeel", status: "Paid" },
      { id: "exp-4", title: "Classroom Solar Inverter Dust Filter Replacement", amount: 20, category: "Equipment Maintenance", date: "2026-09-25", approvedBy: "Dr. Tariq Mahmood", status: "Paid" }
    ]
  },

  announcements: [
    {
      id: "ann-1",
      title: "Village Solar Computer Lab Upgrade Completed",
      titleAr: "اكتمال ترقية مختبر الحاسوب الشمسي بالقرية",
      date: "2026-10-06",
      category: "Facility",
      priority: "Normal",
      author: "Super Admin",
      content: "We have successfully installed 4 new energy-efficient tablets and an upgraded battery bank in our digital lab. Evening study hours are now open for Grade 8, 9 and 10 students until 6:00 PM."
    },
    {
      id: "ann-2",
      title: "Mid-Term Examination Dates & Timetable Notice",
      titleAr: "جدول امتحانات منتصف الفصل الدراسي",
      date: "2026-10-04",
      category: "Academic",
      priority: "High",
      author: "Principal",
      content: "Mid-Term Examinations for all grades will commence from October 20th, 2026. Parents are requested to review the downloadable syllabus in the LMS module."
    },
    {
      id: "ann-3",
      title: "Community Tree Plantation & Clean Water Day",
      titleAr: "يوم غرس الأشجار والمياه النظيفة للقرية",
      date: "2026-10-01",
      category: "Event",
      priority: "Normal",
      author: "Ms. Fatima Noor",
      content: "Brainfield School students and teachers will plant 100 indigenous pine & fruit saplings around the village water stream this Saturday. All parents and village elders are welcome."
    }
  ],

  messages: [
    {
      id: "msg-1",
      threadId: "th-p-rasheed-t-ahmed",
      senderId: "u9",
      senderName: "Rasheed Ahmed (Parent)",
      receiverId: "u3",
      receiverName: "Sir Ahmed Raza (Teacher)",
      timestamp: "2026-10-06 16:45",
      text: "Assalam-o-Alaikum Sir Ahmed. How is Bilal progressing in his Geometry topics? Is he prepared for the upcoming quiz?",
      read: true
    },
    {
      id: "msg-2",
      threadId: "th-p-rasheed-t-ahmed",
      senderId: "u3",
      senderName: "Sir Ahmed Raza (Teacher)",
      receiverId: "u9",
      receiverName: "Rasheed Ahmed (Parent)",
      timestamp: "2026-10-06 17:10",
      text: "Wa Alaikum Assalam respected Rasheed Sahib. Bilal is performing at an exceptional level! His problem-solving speed is highest in Grade 8-A. Please encourage him to keep it up.",
      read: true
    },
    {
      id: "msg-3",
      threadId: "th-p-rasheed-t-fatima",
      senderId: "u4",
      senderName: "Ms. Fatima Noor (Teacher)",
      receiverId: "u9",
      receiverName: "Rasheed Ahmed (Parent)",
      timestamp: "2026-10-07 11:20",
      text: "Greetings Rasheed Sahib. Ayesha has shown great artistic insight in her botany plant journal. Thank you for supporting her at home.",
      read: false
    }
  ],

  calendar: [
    { id: "cal-1", title: "Mid-Term Examinations Begin", date: "2026-10-20", type: "Exam", color: "#EF4444" },
    { id: "cal-2", title: "Village Community Greenery Drive", date: "2026-10-10", type: "Event", color: "#10B981" },
    { id: "cal-3", title: "Parent-Teacher Council (PTA Meeting)", date: "2026-10-25", type: "Meeting", color: "#3B82F6" },
    { id: "cal-4", title: "Science & Solar Innovation Exhibition", date: "2026-11-05", type: "Event", color: "#8B5CF6" },
    { id: "cal-5", title: "National Education Holiday", date: "2026-11-09", type: "Holiday", color: "#F59E0B" }
  ],

  library: [
    { id: "lib-1", isbn: "978-019-8390", title: "Essential Mathematics for Rural Academies", author: "Dr. A. K. Siddiqui", copiesTotal: 15, copiesAvailable: 11, category: "Mathematics", rack: "Rack M-1" },
    { id: "lib-2", isbn: "978-019-5561", title: "Wonders of the Plant Kingdom", author: "Dr. Elena Rostova", copiesTotal: 10, copiesAvailable: 7, category: "Science", rack: "Rack S-3" },
    { id: "lib-3", isbn: "978-019-4412", title: "Inspiring Short Stories for Young Minds", author: "Markus Aurelius & C. S.", copiesTotal: 20, copiesAvailable: 16, category: "English", rack: "Rack E-2" },
    { id: "lib-4", isbn: "978-019-9923", title: "Solar Energy: Practical Guide for Village Living", author: "Engr. Salman Faris", copiesTotal: 8, copiesAvailable: 6, category: "Technology", rack: "Rack T-1" },
    { id: "lib-5", isbn: "978-019-7711", title: "Arabic Grammar & Morphology Made Easy", author: "Ustadh Omar Farooq", copiesTotal: 12, copiesAvailable: 9, category: "Arabic", rack: "Rack A-1" }
  ],

  inventory: [
    { id: "inv-it-1", name: "High-Durability Education Tablets (10-inch)", category: "Electronics", quantity: 20, condition: "Good", location: "Solar Computer Lab", notes: "Equipped with offline LMS cache" },
    { id: "inv-it-2", name: "3kVA Pure Sine Wave Solar Inverter + Battery Bank", category: "Power & Energy", quantity: 2, condition: "Excellent", location: "Main Power Room", notes: "Powers school lights & Wi-Fi routers" },
    { id: "inv-it-3", name: "Dual-LED Smart Classroom Projector", category: "Audio/Visual", quantity: 2, condition: "Good", location: "Smart Hall (Room 202)", notes: "Used for live broadcast and science slides" },
    { id: "inv-it-4", name: "Secondary Science Compound Microscope Set", category: "Lab Equipment", quantity: 6, condition: "Good", location: "Science Laboratory", notes: "Calibrated for plant tissue studies" },
    { id: "inv-it-5", name: "Ergonomic Hardwood Student Desks & Benches", category: "Furniture", quantity: 80, condition: "Fair", location: "Classrooms 101-302", notes: "Locally crafted village timber" }
  ],

  certificates: [
    {
      id: "cert-1",
      certNo: "BFS-CERT-2026-001",
      studentId: "s1",
      studentName: "Bilal Rasheed",
      type: "Academic Excellence Award",
      title: "Certificate of Merit & Scholastic Excellence",
      date: "2026-10-01",
      reason: "Securing 1st Position in Grade 8 with 93% aggregate marks and outstanding leadership.",
      signedBy: "Dr. Tariq Mahmood, Principal"
    },
    {
      id: "cert-2",
      certNo: "BFS-CERT-2026-002",
      studentId: "s2",
      studentName: "Ayesha Rasheed",
      type: "Language & Reading Award",
      title: "Certificate of Literary Distinction",
      date: "2026-10-01",
      reason: "Exceptional mastery of English creative writing and community book club active reading.",
      signedBy: "Dr. Tariq Mahmood, Principal"
    }
  ],

  activityLogs: [
    { id: "log-1", timestamp: "2026-10-07 14:15", user: "Dr. Tariq Mahmood (Principal)", action: "Approved Online Admission #BF-2026-082 (Sana Mir)" },
    { id: "log-2", timestamp: "2026-10-07 12:30", user: "Sir Ahmed Raza (Teacher)", action: "Marked Morning Attendance for Grade 8-A (30 Students)" },
    { id: "log-3", timestamp: "2026-10-06 15:40", user: "Muhammad Shakeel (Accountant)", action: "Issued Fee Receipt #REC-2026-981 ($30.00)" },
    { id: "log-4", timestamp: "2026-10-06 11:20", user: "Al-Hajj Amin Khan (Super Admin)", action: "Added 4 new solar tablet inventory items" },
    { id: "log-5", timestamp: "2026-10-05 09:00", user: "Sir Ahmed Raza (Teacher)", action: "Created Grade 8 Mid-Term Mathematics Online Quiz" }
  ]
};

// Database Singleton Engine
class BrainfieldDB {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Storage load error, initializing fresh DB:", e);
    }
    this.save(INITIAL_DB);
    return JSON.parse(JSON.stringify(INITIAL_DB));
  }

  save(data = this.data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.data = data;
      return true;
    } catch (e) {
      console.error("Storage save error:", e);
      return false;
    }
  }

  logActivity(action, user = null) {
    const currentUser = user || (window.Auth ? window.Auth.getCurrentUser() : null);
    const userName = currentUser ? `${currentUser.name} (${currentUser.roleTitle || currentUser.role})` : 'System';
    const now = new Date();
    const formatted = now.toISOString().replace('T', ' ').substring(0, 16);
    
    const newLog = {
      id: 'log-' + Date.now(),
      timestamp: formatted,
      user: userName,
      action: action
    };

    if (!this.data.activityLogs) this.data.activityLogs = [];
    this.data.activityLogs.unshift(newLog);
    if (this.data.activityLogs.length > 50) this.data.activityLogs.pop();
    this.save();
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DB));
    this.save();
    this.logActivity("Reset database to initial Brainfield School sample state");
    return this.data;
  }

  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.schoolInfo && parsed.users && parsed.students) {
        this.data = parsed;
        this.save();
        this.logActivity("Restored database from external JSON backup");
        return { success: true };
      }
      return { success: false, error: "Invalid backup schema." };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // --- CRUD helpers ---
  // Students
  getStudents() { return this.data.students || []; }
  getStudentById(id) { return this.getStudents().find(s => s.id === id); }
  addStudent(student) {
    student.id = 's' + (Date.now());
    if (!student.status) student.status = 'Active';
    if (!student.balanceFee) student.balanceFee = 0;
    if (!student.attendanceRate) student.attendanceRate = 100;
    this.data.students.unshift(student);
    this.logActivity(`Enrolled new student: ${student.name} (${student.grade})`);
    this.save();
    return student;
  }
  updateStudent(id, updates) {
    const idx = this.data.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.students[idx] = { ...this.data.students[idx], ...updates };
      this.logActivity(`Updated profile of student: ${this.data.students[idx].name}`);
      this.save();
      return this.data.students[idx];
    }
    return null;
  }
  deleteStudent(id) {
    const student = this.getStudentById(id);
    if (student) {
      this.data.students = this.data.students.filter(s => s.id !== id);
      this.logActivity(`Deleted student record: ${student.name}`);
      this.save();
      return true;
    }
    return false;
  }

  // Teachers
  getTeachers() { return this.data.teachers || []; }
  addTeacher(teacher) {
    teacher.id = 't' + (Date.now());
    this.data.teachers.unshift(teacher);
    this.logActivity(`Added faculty member: ${teacher.name}`);
    this.save();
    return teacher;
  }
  updateTeacher(id, updates) {
    const idx = this.data.teachers.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.data.teachers[idx] = { ...this.data.teachers[idx], ...updates };
      this.logActivity(`Updated teacher details: ${this.data.teachers[idx].name}`);
      this.save();
      return this.data.teachers[idx];
    }
    return null;
  }

  // Admissions
  getAdmissions() { return this.data.admissions || []; }
  addAdmission(application) {
    application.id = 'adm-' + Date.now();
    application.applicationNo = 'BF-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);
    application.appliedDate = new Date().toISOString().substring(0, 10);
    application.status = 'Pending';
    this.data.admissions.unshift(application);
    this.logActivity(`Submitted new admission application #${application.applicationNo} for ${application.studentName}`);
    this.save();
    return application;
  }
  updateAdmissionStatus(id, newStatus, notes) {
    const app = this.data.admissions.find(a => a.id === id);
    if (app) {
      app.status = newStatus;
      if (notes) app.notes = notes;
      this.logActivity(`Updated admission #${app.applicationNo} (${app.studentName}) status to ${newStatus}`);
      this.save();
      return app;
    }
    return null;
  }

  // Classes
  getClasses() { return this.data.classes || []; }
  addClass(cls) {
    cls.id = 'c-' + Date.now();
    this.data.classes.push(cls);
    this.logActivity(`Created class ${cls.name}-${cls.section}`);
    this.save();
    return cls;
  }

  // Attendance
  getAttendance(classId, date) {
    let records = this.data.attendance || [];
    if (classId) records = records.filter(r => r.classId === classId);
    if (date) records = records.filter(r => r.date === date);
    return records;
  }
  markAttendance(records) {
    // records is array of { date, classId, studentId, status, remarks }
    records.forEach(rec => {
      const existingIdx = this.data.attendance.findIndex(
        r => r.date === rec.date && r.classId === rec.classId && r.studentId === rec.studentId
      );
      if (existingIdx !== -1) {
        this.data.attendance[existingIdx] = rec;
      } else {
        this.data.attendance.push(rec);
      }
    });
    this.logActivity(`Marked attendance for ${records.length} students on ${records[0]?.date}`);
    this.save();
  }

  // LMS Courses & Lessons
  getCourses() { return this.data.courses || []; }
  addCourse(course) {
    course.id = 'crs-' + Date.now();
    this.data.courses.unshift(course);
    this.logActivity(`Published new course: ${course.title}`);
    this.save();
    return course;
  }
  addLessonToCourse(courseId, lesson) {
    const course = this.data.courses.find(c => c.id === courseId);
    if (course) {
      lesson.id = 'les-' + Date.now();
      if (!course.lessons) course.lessons = [];
      course.lessons.push(lesson);
      course.totalLessons = course.lessons.length;
      this.logActivity(`Added lesson "${lesson.title}" to ${course.title}`);
      this.save();
      return lesson;
    }
    return null;
  }

  // Homework
  getHomework() { return this.data.homework || []; }
  addHomework(hw) {
    hw.id = 'hw-' + Date.now();
    hw.assignedDate = new Date().toISOString().substring(0, 10);
    hw.submissions = [];
    this.data.homework.unshift(hw);
    this.logActivity(`Created homework assignment: "${hw.title}" for ${hw.grade}`);
    this.save();
    return hw;
  }
  submitHomework(hwId, submission) {
    const hw = this.data.homework.find(h => h.id === hwId);
    if (hw) {
      const existing = hw.submissions.find(s => s.studentId === submission.studentId);
      submission.submittedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);
      submission.status = 'Submitted';
      if (existing) {
        Object.assign(existing, submission);
      } else {
        hw.submissions.push(submission);
      }
      this.logActivity(`Student submitted homework: "${hw.title}"`);
      this.save();
      return true;
    }
    return false;
  }
  gradeHomework(hwId, studentId, marksObtained, feedback, gradedBy) {
    const hw = this.data.homework.find(h => h.id === hwId);
    if (hw) {
      const sub = hw.submissions.find(s => s.studentId === studentId);
      if (sub) {
        sub.marksObtained = marksObtained;
        sub.feedback = feedback;
        sub.gradedBy = gradedBy;
        sub.status = 'Graded';
        this.logActivity(`Graded homework "${hw.title}" for student (Score: ${marksObtained}/${hw.maxMarks})`);
        this.save();
        return sub;
      }
    }
    return null;
  }

  // Exams & Quizzes
  getExams() { return this.data.exams || []; }
  addExam(exam) {
    exam.id = 'ex-' + Date.now();
    this.data.exams.unshift(exam);
    this.logActivity(`Created online exam: ${exam.title}`);
    this.save();
    return exam;
  }

  // Results & Report Cards
  getResults() { return this.data.results || []; }
  getResultByStudent(studentId) {
    return this.data.results.find(r => r.studentId === studentId);
  }
  saveResult(result) {
    const idx = this.data.results.findIndex(r => r.studentId === result.studentId && r.term === result.term);
    if (idx !== -1) {
      this.data.results[idx] = result;
    } else {
      result.id = 'res-' + Date.now();
      this.data.results.unshift(result);
    }
    this.logActivity(`Generated term result record for ${result.studentName}`);
    this.save();
    return result;
  }

  // Fees & Receipts
  getFeeInvoices() { return this.data.fees.invoices || []; }
  getFeeReceipts() { return this.data.fees.receipts || []; }
  getExpenses() { return this.data.fees.expenses || []; }
  recordPayment(invoiceId, amount, method, collector) {
    const inv = this.data.fees.invoices.find(i => i.id === invoiceId);
    if (inv) {
      inv.paidAmount = (inv.paidAmount || 0) + Number(amount);
      if (inv.paidAmount >= inv.netPayable) {
        inv.status = 'Paid';
      } else {
        inv.status = 'Partial';
      }
      inv.paymentDate = new Date().toISOString().substring(0, 10);
      inv.paymentMethod = method;
      const receiptNo = 'REC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      inv.receiptNo = receiptNo;

      const receipt = {
        receiptNo: receiptNo,
        date: inv.paymentDate,
        studentId: inv.studentId,
        studentName: inv.studentName,
        guardianName: inv.studentName + " (Guardian)",
        grade: inv.grade,
        invoiceNo: inv.invoiceNo,
        amountPaid: Number(amount),
        paymentMethod: method,
        transactionRef: 'TXN-' + Math.floor(1000000 + Math.random() * 9000000),
        receivedBy: collector || 'Finance Desk',
        notes: `Fee payment received for ${inv.month}`
      };

      this.data.fees.receipts.unshift(receipt);
      
      // Update student balance
      const student = this.getStudentById(inv.studentId);
      if (student && student.balanceFee > 0) {
        student.balanceFee = Math.max(0, student.balanceFee - Number(amount));
      }

      this.logActivity(`Recorded fee payment: ${receiptNo} of $${amount} for ${inv.studentName}`);
      this.save();
      return receipt;
    }
    return null;
  }
  addExpense(expense) {
    expense.id = 'exp-' + Date.now();
    expense.date = new Date().toISOString().substring(0, 10);
    expense.status = 'Paid';
    this.data.fees.expenses.unshift(expense);
    this.logActivity(`Logged school expense: ${expense.title} ($${expense.amount})`);
    this.save();
    return expense;
  }

  // Communication & Messages
  getMessages() { return this.data.messages || []; }
  sendMessage(senderId, senderName, receiverId, receiverName, text) {
    const threadId = [senderId, receiverId].sort().join('-thread-');
    const msg = {
      id: 'msg-' + Date.now(),
      threadId: threadId,
      senderId: senderId,
      senderName: senderName,
      receiverId: receiverId,
      receiverName: receiverName,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      text: text,
      read: false
    };
    this.data.messages.push(msg);
    this.save();
    return msg;
  }

  // Announcements
  getAnnouncements() { return this.data.announcements || []; }
  addAnnouncement(ann) {
    ann.id = 'ann-' + Date.now();
    ann.date = new Date().toISOString().substring(0, 10);
    this.data.announcements.unshift(ann);
    this.logActivity(`Published announcement: "${ann.title}"`);
    this.save();
    return ann;
  }

  // Library & Inventory
  getLibrary() { return this.data.library || []; }
  getInventory() { return this.data.inventory || []; }
  addLibraryBook(book) {
    book.id = 'lib-' + Date.now();
    this.data.library.unshift(book);
    this.logActivity(`Added library book: "${book.title}"`);
    this.save();
    return book;
  }
  addInventoryItem(item) {
    item.id = 'inv-it-' + Date.now();
    this.data.inventory.unshift(item);
    this.logActivity(`Added inventory item: "${item.name}"`);
    this.save();
    return item;
  }

  // Certificates
  getCertificates() { return this.data.certificates || []; }
  issueCertificate(cert) {
    cert.id = 'cert-' + Date.now();
    cert.certNo = 'BFS-CERT-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);
    cert.date = new Date().toISOString().substring(0, 10);
    this.data.certificates.unshift(cert);
    this.logActivity(`Generated ${cert.type} for ${cert.studentName} (#${cert.certNo})`);
    this.save();
    return cert;
  }

  // Settings
  updateSchoolInfo(info) {
    this.data.schoolInfo = { ...this.data.schoolInfo, ...info };
    this.logActivity(`Updated Brainfield School profile settings`);
    this.save();
    return this.data.schoolInfo;
  }
}

// Global DB instance
window.DB = new BrainfieldDB();
