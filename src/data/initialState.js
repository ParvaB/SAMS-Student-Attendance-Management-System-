// Realistic Initial State for Student Attendance Management System (SAMS)
// Student: Parva Bagadia, Roll No: E224, B.Tech CS Sem V, Batch B1

export const INITIAL_STUDENTS = [
  { rollNo: 'E224', name: 'Parva Bagadia', batch: 'B1', email: 'parva.bagadia@nmims.edu', guardianEmail: 'sunil.bagadia@gmail.com', guardianPhone: '+91 98201 44521' },
  { rollNo: 'E241', name: 'Jay Naik', batch: 'B1', email: 'jay.naik@nmims.edu', guardianEmail: 'hitesh.naik@gmail.com', guardianPhone: '+91 98202 33412' },
  { rollNo: 'E201', name: 'Aarav Mehta', batch: 'B1', email: 'aarav.mehta@nmims.edu', guardianEmail: 'sanjay.mehta@gmail.com', guardianPhone: '+91 98203 11223' },
  { rollNo: 'E208', name: 'Diya Shah', batch: 'B1', email: 'diya.shah@nmims.edu', guardianEmail: 'kirit.shah@gmail.com', guardianPhone: '+91 98204 55667' },
  { rollNo: 'E215', name: 'Rohan Verma', batch: 'B1', email: 'rohan.verma@nmims.edu', guardianEmail: 'anil.verma@gmail.com', guardianPhone: '+91 98205 77889' },
  { rollNo: 'E219', name: 'Ananya Iyer', batch: 'B1', email: 'ananya.iyer@nmims.edu', guardianEmail: 'ramesh.iyer@gmail.com', guardianPhone: '+91 98206 99001' },
  { rollNo: 'E230', name: 'Tanvi Joshi', batch: 'B2', email: 'tanvi.joshi@nmims.edu', guardianEmail: 'manoj.joshi@gmail.com', guardianPhone: '+91 98207 12345' },
  { rollNo: 'E235', name: 'Aditya Kulkarni', batch: 'B2', email: 'aditya.kulkarni@nmims.edu', guardianEmail: 'vikram.kulkarni@gmail.com', guardianPhone: '+91 98208 23456' },
  { rollNo: 'E248', name: 'Siddharth Rao', batch: 'B2', email: 'siddharth.rao@nmims.edu', guardianEmail: 'pradeep.rao@gmail.com', guardianPhone: '+91 98209 34567' },
  { rollNo: 'E252', name: 'Pooja Hegde', batch: 'B2', email: 'pooja.hegde@nmims.edu', guardianEmail: 'ganesh.hegde@gmail.com', guardianPhone: '+91 98210 45678' },
  { rollNo: 'E259', name: 'Nikhil Nair', batch: 'B2', email: 'nikhil.nair@nmims.edu', guardianEmail: 'sudheer.nair@gmail.com', guardianPhone: '+91 98211 56789' },
  { rollNo: 'E264', name: 'Sneha Patel', batch: 'B2', email: 'sneha.patel@nmims.edu', guardianEmail: 'bhavesh.patel@gmail.com', guardianPhone: '+91 98212 67890' },
];

export const INITIAL_SUBJECTS = [
  {
    code: 'CS301',
    name: 'Software Engineering',
    faculty: 'Prof. R. Sharma',
    credits: 4,
    type: 'THEORY',
    plannedSessions: 36,
    conducted: 28,
    attended: 24, // 85.71%
    room: 'CR-402'
  },
  {
    code: 'CS302',
    name: 'Database Management Systems',
    faculty: 'Prof. S. Nambiar',
    credits: 4,
    type: 'THEORY',
    plannedSessions: 38,
    conducted: 30,
    attended: 23, // 76.67% -> Warning
    room: 'CR-405'
  },
  {
    code: 'CS303',
    name: 'Compiler Design',
    faculty: 'Prof. M. Gupta',
    credits: 4,
    type: 'THEORY',
    plannedSessions: 32,
    conducted: 25,
    attended: 18, // 72.00% -> Defaulter
    room: 'CR-401'
  },
  {
    code: 'CS304',
    name: 'Discrete Mathematics',
    faculty: 'Prof. K. Sen',
    credits: 3,
    type: 'THEORY',
    plannedSessions: 30,
    conducted: 24,
    attended: 21, // 87.50%
    room: 'CR-303'
  },
  {
    code: 'CS305',
    name: 'Computer Networks Lab',
    faculty: 'Prof. R. Sharma',
    credits: 2,
    type: 'LAB',
    batch: 'Batch B1',
    plannedSessions: 14,
    conducted: 12,
    attended: 11, // 91.67%
    room: 'Lab 602'
  }
];

export const INITIAL_TIMETABLE = [
  { day: 'Monday', slot: '09:00 - 10:00', code: 'CS301', room: 'CR-402', type: 'Lecture' },
  { day: 'Monday', slot: '10:00 - 11:00', code: 'CS302', room: 'CR-405', type: 'Lecture' },
  { day: 'Monday', slot: '11:15 - 01:15', code: 'CS305', room: 'Lab 602', type: 'Lab (B1)' },
  { day: 'Tuesday', slot: '09:00 - 10:00', code: 'CS303', room: 'CR-401', type: 'Lecture' },
  { day: 'Tuesday', slot: '10:00 - 11:00', code: 'CS304', room: 'CR-303', type: 'Lecture' },
  { day: 'Wednesday', slot: '09:00 - 10:00', code: 'CS301', room: 'CR-402', type: 'Lecture' },
  { day: 'Wednesday', slot: '11:15 - 12:15', code: 'CS303', room: 'CR-401', type: 'Lecture' },
  { day: 'Thursday', slot: '10:00 - 11:00', code: 'CS302', room: 'CR-405', type: 'Lecture' },
  { day: 'Thursday', slot: '02:00 - 04:00', code: 'CS305', room: 'Lab 602', type: 'Lab (B2)' },
  { day: 'Friday', slot: '09:00 - 10:00', code: 'CS304', room: 'CR-303', type: 'Lecture' },
  { day: 'Friday', slot: '10:00 - 11:00', code: 'CS301', room: 'CR-402', type: 'Tutorial' },
];

export const INITIAL_SESSION_LOGS = [
  {
    id: 'SESS-1092',
    date: '2026-10-21',
    subjectCode: 'CS301',
    subjectName: 'Software Engineering',
    type: 'LECTURE',
    slot: '09:00 - 10:00',
    faculty: 'Prof. R. Sharma',
    status: 'PRESENT',
    markedAt: '2026-10-21T09:55:00Z',
    hoursElapsed: 25,
    remarks: 'Covered Scrum Sprint Retrospectives & BVA'
  },
  {
    id: 'SESS-1091',
    date: '2026-10-20',
    subjectCode: 'CS305',
    subjectName: 'Computer Networks Lab',
    type: 'LAB',
    slot: '11:15 - 01:15',
    faculty: 'Prof. R. Sharma',
    status: 'PRESENT',
    markedAt: '2026-10-20T13:10:00Z',
    hoursElapsed: 47,
    remarks: 'Wireshark Packet Analysis Lab Experiment 4'
  },
  {
    id: 'SESS-1088',
    date: '2026-10-19',
    subjectCode: 'CS303',
    subjectName: 'Compiler Design',
    type: 'LECTURE',
    slot: '09:00 - 10:00',
    faculty: 'Prof. M. Gupta',
    status: 'ABSENT',
    markedAt: '2026-10-19T09:58:00Z',
    hoursElapsed: 72,
    remarks: 'LR(1) Parsing Table Construction'
  },
  {
    id: 'SESS-1085',
    date: '2026-10-18',
    subjectCode: 'CS302',
    subjectName: 'Database Management Systems',
    type: 'LECTURE',
    slot: '10:00 - 11:00',
    faculty: 'Prof. S. Nambiar',
    status: 'PRESENT',
    markedAt: '2026-10-18T10:50:00Z',
    hoursElapsed: 96,
    remarks: 'B+ Tree Indexing & Concurrency Control'
  },
  {
    id: 'SESS-1081',
    date: '2026-10-16',
    subjectCode: 'CS304',
    subjectName: 'Discrete Mathematics',
    type: 'LECTURE',
    slot: '09:00 - 10:00',
    faculty: 'Prof. K. Sen',
    status: 'ON-DUTY',
    markedAt: '2026-10-16T09:45:00Z',
    hoursElapsed: 144,
    remarks: 'Approved Hackathon Participation (OD #OD-2026-081)'
  },
  {
    id: 'SESS-1077',
    date: '2026-10-15',
    subjectCode: 'CS301',
    subjectName: 'Software Engineering',
    type: 'LECTURE',
    slot: '09:00 - 10:00',
    faculty: 'Prof. R. Sharma',
    status: 'CANCELLED',
    markedAt: '2026-10-15T09:00:00Z',
    hoursElapsed: 168,
    remarks: 'Cancelled due to Department Technical Symposium (Excluded from Attendance %)'
  },
  {
    id: 'SESS-1072',
    date: '2026-10-14',
    subjectCode: 'CS303',
    subjectName: 'Compiler Design',
    type: 'LECTURE',
    slot: '11:15 - 12:15',
    faculty: 'Prof. M. Gupta',
    status: 'LATE',
    markedAt: '2026-10-14T11:28:00Z',
    hoursElapsed: 192,
    remarks: 'Entered 15 mins late due to transit delay'
  }
];

export const INITIAL_LEAVE_REQUESTS = [
  {
    id: 'LV-2026-042',
    studentRollNo: 'E224',
    studentName: 'Parva Bagadia',
    batch: 'B1',
    type: 'ON_DUTY',
    reason: 'Smart India Hackathon 2026 Regional Round at IIT Bombay',
    startDate: '2026-11-04',
    endDate: '2026-11-06',
    daysCount: 3,
    documentName: 'SIH2026_Selection_Letter.pdf',
    documentSize: '1.8 MB',
    status: 'APPROVED',
    appliedAt: '2026-10-15T14:20:00Z',
    reviewedBy: 'Prof. A. Deshmukh',
    reviewedAt: '2026-10-16T11:05:00Z',
    reviewNotes: 'Verified with CSE Student Activity Committee. Granted 3 days OD credit.'
  },
  {
    id: 'LV-2026-051',
    studentRollNo: 'E224',
    studentName: 'Parva Bagadia',
    batch: 'B1',
    type: 'MEDICAL',
    reason: 'Acute Gastroenteritis with medical certificate from Lilavati Hospital',
    startDate: '2026-10-28',
    endDate: '2026-10-29',
    daysCount: 2,
    documentName: 'Medical_Certificate_Lilavati.pdf',
    documentSize: '2.4 MB',
    status: 'SUBMITTED',
    appliedAt: '2026-10-21T18:40:00Z',
    reviewedBy: null,
    reviewedAt: null,
    reviewNotes: null
  },
  {
    id: 'LV-2026-039',
    studentRollNo: 'E241',
    studentName: 'Jay Naik',
    batch: 'B1',
    type: 'ON_DUTY',
    reason: 'IEEE TechFest Robotics Competition Lead',
    startDate: '2026-11-10',
    endDate: '2026-11-12',
    daysCount: 3,
    documentName: 'IEEE_Team_Credentials.pdf',
    documentSize: '3.1 MB',
    status: 'SUBMITTED',
    appliedAt: '2026-10-21T20:15:00Z',
    reviewedBy: null,
    reviewedAt: null,
    reviewNotes: null
  },
  {
    id: 'LV-2026-033',
    studentRollNo: 'E208',
    studentName: 'Diya Shah',
    batch: 'B1',
    type: 'PERSONAL',
    reason: 'Immediate Family Wedding in Ahmedabad',
    startDate: '2026-10-12',
    endDate: '2026-10-13',
    daysCount: 2,
    documentName: 'Leave_Application_Signed.pdf',
    documentSize: '850 KB',
    status: 'REJECTED',
    appliedAt: '2026-10-10T09:12:00Z',
    reviewedBy: 'Prof. A. Deshmukh',
    reviewedAt: '2026-10-11T16:00:00Z',
    reviewNotes: 'Attendance in Compiler Design already below threshold (71%). Cannot grant personal leave.'
  }
];

export const INITIAL_POST_CORRECTIONS = [
  {
    id: 'CORR-2026-014',
    sessionId: 'SESS-1088',
    subjectCode: 'CS303',
    subjectName: 'Compiler Design',
    studentRollNo: 'E224',
    studentName: 'Parva Bagadia',
    sessionDate: '2026-10-19',
    hoursElapsed: 72,
    currentStatus: 'ABSENT',
    requestedStatus: 'PRESENT',
    facultyName: 'Prof. M. Gupta',
    reason: 'Student was present at front desk demonstrating parser code; attendance app auto-marked absent while taking roll at back benches. Verified via lab notes.',
    status: 'PENDING_HOD',
    submittedAt: '2026-10-22T08:30:00Z'
  },
  {
    id: 'CORR-2026-011',
    sessionId: 'SESS-1055',
    subjectCode: 'CS302',
    subjectName: 'Database Management Systems',
    studentRollNo: 'E215',
    studentName: 'Rohan Verma',
    sessionDate: '2026-10-14',
    hoursElapsed: 192,
    currentStatus: 'ABSENT',
    requestedStatus: 'PRESENT',
    facultyName: 'Prof. S. Nambiar',
    reason: 'Biometric card scanner malfunction at Room 405. Physical attendance log shows student signature.',
    status: 'APPROVED',
    submittedAt: '2026-10-17T11:00:00Z',
    reviewedBy: 'Dr. V. Kulkarni (HOD)',
    reviewedAt: '2026-10-18T10:30:00Z'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    logId: 'LOG-2026-9041',
    timestamp: '2026-10-22T09:15:22Z',
    userId: 'FAC-SHARMA-01',
    userName: 'Prof. R. Sharma',
    role: 'FACULTY',
    ipAddress: '192.168.10.45',
    action: 'ATTENDANCE_MARKED',
    details: 'Submitted attendance for CS301 (Software Engineering) - 26 Present, 2 Absent, 0 Late',
    hash: '8f7a3b4c1e2d9a0f6b5c4d3e2a1b0c9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b',
    prevHash: '7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d'
  },
  {
    logId: 'LOG-2026-9040',
    timestamp: '2026-10-22T08:30:00Z',
    userId: 'FAC-GUPTA-03',
    userName: 'Prof. M. Gupta',
    role: 'FACULTY',
    ipAddress: '192.168.10.52',
    action: 'POST_48H_CORRECTION_ESCALATED',
    details: 'Raised correction request CORR-2026-014 for Parva Bagadia (E224) in CS303 (Elapsed: 72h)',
    hash: '7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d',
    prevHash: '6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c'
  },
  {
    logId: 'LOG-2026-9038',
    timestamp: '2026-10-21T18:40:00Z',
    userId: 'STU-E224',
    userName: 'Parva Bagadia',
    role: 'STUDENT',
    ipAddress: '10.20.14.88',
    action: 'LEAVE_APPLICATION_SUBMITTED',
    details: 'Submitted Medical Leave application LV-2026-051 (2 days, 2026-10-28 to 2026-10-29)',
    hash: '6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c',
    prevHash: '5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b'
  },
  {
    logId: 'LOG-2026-9035',
    timestamp: '2026-10-21T16:15:10Z',
    userId: 'COORD-DESHMUKH-02',
    userName: 'Prof. A. Deshmukh',
    role: 'COORDINATOR',
    ipAddress: '192.168.10.12',
    action: 'GUARDIAN_DIGEST_DISPATCHED',
    details: 'Dispatched 18:00 Daily Defaulter Guardian Digest to 3 recipients (<75% threshold)',
    hash: '5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b',
    prevHash: '4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a'
  },
  {
    logId: 'LOG-2026-9030',
    timestamp: '2026-10-20T14:10:00Z',
    userId: 'HOD-KULKARNI-01',
    userName: 'Dr. V. Kulkarni',
    role: 'HOD',
    ipAddress: '192.168.10.02',
    action: 'POLICY_THRESHOLD_VERIFIED',
    details: 'Academic Council Semester V Attendance Threshold locked at Defaulter: 75.0%, Warning: 80.0%',
    hash: '4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a',
    prevHash: '3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f'
  },
  {
    logId: 'LOG-2026-9024',
    timestamp: '2026-10-18T10:30:00Z',
    userId: 'HOD-KULKARNI-01',
    userName: 'Dr. V. Kulkarni',
    role: 'HOD',
    ipAddress: '192.168.10.02',
    action: 'POST_48H_CORRECTION_APPROVED',
    details: 'Approved correction CORR-2026-011 for Rohan Verma (E215) in CS302 (Status: ABSENT -> PRESENT)',
    hash: '3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f',
    prevHash: '2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e'
  },
  {
    logId: 'LOG-2026-9018',
    timestamp: '2026-10-16T11:05:00Z',
    userId: 'COORD-DESHMUKH-02',
    userName: 'Prof. A. Deshmukh',
    role: 'COORDINATOR',
    ipAddress: '192.168.10.12',
    action: 'LEAVE_APPLICATION_APPROVED',
    details: 'Approved On-Duty request LV-2026-042 for Parva Bagadia (E224). 3 days credited as OD.',
    hash: '2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e',
    prevHash: '1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d'
  },
  {
    logId: 'LOG-2026-9001',
    timestamp: '2026-10-15T08:00:00Z',
    userId: 'SYSADMIN-ROOT',
    userName: 'SysAdmin',
    role: 'ADMIN',
    ipAddress: '127.0.0.1',
    action: 'SYSTEM_BOOTSTRAP',
    details: 'SAMS Academic Portal v3.4.1 initialized. Audit chain anchored with Genesis block.',
    hash: '1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d',
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000'
  }
];

export const INITIAL_USER_ROLES = {
  STUDENT: {
    id: 'STU-E224',
    name: 'Parva Bagadia',
    rollNo: 'E224',
    roleTitle: 'Student (B.Tech CS Sem V)',
    department: 'Computer Science & Engineering',
    batch: 'Batch B1',
    canWriteAttendance: false,
    email: 'parva.bagadia@nmims.edu'
  },
  FACULTY: {
    id: 'FAC-SHARMA-01',
    name: 'Prof. R. Sharma',
    roleTitle: 'Subject Teacher',
    department: 'Computer Science & Engineering',
    assignedSubjects: ['CS301 (Software Eng)', 'CS305 (Networks Lab)'],
    canWriteAttendance: true,
    email: 'r.sharma@nmims.edu'
  },
  COORDINATOR: {
    id: 'COORD-DESHMUKH-02',
    name: 'Prof. A. Deshmukh',
    roleTitle: 'Class Coordinator (3rd Year)',
    department: 'Computer Science & Engineering',
    batchResponsibility: 'Class 3-CS (Batches B1 & B2)',
    canWriteAttendance: true,
    email: 'a.deshmukh@nmims.edu'
  },
  HOD: {
    id: 'HOD-KULKARNI-01',
    name: 'Dr. V. Kulkarni',
    roleTitle: 'Head of Department',
    department: 'Computer Science & Engineering',
    governanceScope: 'Department-Wide',
    canWriteAttendance: true,
    email: 'v.kulkarni@nmims.edu'
  },
  ADMIN: {
    id: 'SYSADMIN-ROOT',
    name: 'SysAdmin',
    roleTitle: 'Infrastructure & Security Admin',
    department: 'University IT Services',
    scope: 'System-Wide',
    canWriteAttendance: true,
    email: 'sysadmin@nmims.edu'
  }
};
