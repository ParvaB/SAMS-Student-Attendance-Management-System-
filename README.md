# SAMS: Student Attendance Management System

**Academic Course Project — Software Engineering (B.Tech Computer Science & Engineering)**  
**Student Details:**  
- **Name:** Parva Bagadia  
- **Roll No:** E224  
- **Program & Year:** B.Tech CSE, 3rd Year / Semester V  
- **Batch:** B1  
- **Institution:** Mukesh Patel School of Technology Management & Engineering (MPSTME)

---

## 🚀 Overview & Architectural Highlights

**SAMS (Student Attendance Management System)** is a modern, production-grade, responsive academic SaaS front-end web application engineered strictly according to software engineering principles (IEEE 830 SRS specifications, OWASP ASVS security guidelines, and ISO/IEC 25010 product quality standards).

### 🛠️ Tech Stack
- **Framework:** React 19 (Functional Components, Custom Hooks, Context-based reactive state)
- **Styling & Design System:** Tailwind CSS v4 + `@tailwindcss/vite`
- **Iconography:** Lucide React Icons
- **Design Aesthetic:** High-craft Academic SaaS (Linear / Vercel style), slate/zinc surfaces, crisp 1px borders (`border-slate-200`), subtle glassmorphism (`backdrop-blur-md`), and tabular numbers (`tabular-nums`) for percentages, timestamps, and roll numbers.
- **Accessibility & Responsiveness:** Verified from 360px mobile to 1440px desktop viewports, WCAG 2.1 AA contrast ratio, full keyboard focus rings, and zero page reloads.

---

## 🎨 Semantic Attendance Color Tokens
- **Safe / Eligible ($\ge 80.0\%$)**: Emerald (`text-emerald-700`, `bg-emerald-50`, `border-emerald-200`)
- **Warning Zone ($75.0\% - 79.9\%$)**: Amber (`text-amber-700`, `bg-amber-50`, `border-amber-200`)
- **Critical Defaulter ($< 75.0\%$)**: Rose (`text-rose-700`, `bg-rose-50`, `border-rose-200`)
- **On-Duty (OD) / Approved Exemption**: Violet/Indigo (`text-indigo-700`, `bg-indigo-50`, `border-indigo-200`)

---

## 👥 Multi-Role Architecture & Functional Specifications

The system features an **Interactive Role Switcher Pill** in the sticky top navigation bar to test and demonstrate all 5 roles with live reactive shared state:

### 1. 🎓 Student Module (`Parva Bagadia • Roll No: E224 • Batch B1`)
- **Role Enforcement:** Strictly Read-Only access for attendance records.
- **TC03 Security Test:** Includes a **"Test Unauthorized Write API (TC03)"** button that simulates an unauthorized `POST /api/v1/attendance/mark` mutation, triggering a realistic **HTTP 403 Forbidden** security modal and recording the incident in the immutable audit log.
- **KPI Overview Strip:**
  - Cumulative Attendance % calculated dynamically across all subjects.
  - Automatically excludes `CANCELLED` sessions from both numerator and denominator (FR-9).
  - Approved On-Duty (OD) session counter (counted as Present with OD flag per FR-8).
  - Dynamic Alert Banners: Safe ($\ge 80\%$), Warning ($75.0\% - 79.9\%$), and Defaulter ($< 75.0\%$) per FR-12.
- **Subject-Wise Attendance & Shortfall Recovery Calculator (FR-9, FR-10):**
  - Pre-populated with realistic B.Tech CS subjects:
    - `CS301: Software Engineering` ($24/28 \rightarrow 85.7\%$)
    - `CS302: Database Management Systems` ($23/30 \rightarrow 76.7\%$ - Warning)
    - `CS303: Compiler Design` ($18/25 \rightarrow 72.0\%$ - Critical Defaulter)
    - `CS304: Discrete Mathematics` ($21/24 \rightarrow 87.5\%$)
    - `CS305: Computer Networks Lab (Batch B1)` ($11/12 \rightarrow 91.7\%$)
  - **Exact Shortfall Recovery Formula:**
    $$\lceil \frac{(T \cdot C) - A}{1 - T} \rceil$$
    For `CS303 Compiler Design` ($18/25 = 72\%$ at $T=0.75$):
    $$\lceil \frac{(0.75 \times 25) - 18}{1 - 0.75} \rceil = \lceil \frac{18.75 - 18}{0.25} \rceil = \lceil 3.0 \rceil = 3 \text{ consecutive lectures}$$
    Displays badge: *"Attend next 3 consecutive lectures to reach 75.0%"*.
  - **Safe Miss Buffer Formula (when $\ge T$):**
    $$\lfloor \frac{A}{T} - C \rfloor$$
  - **Interactive What-If Simulator:** Click `+1 Attend` or `+1 Miss` per subject to project future attendance impact.
- **Session-Level History Log:** Filterable audit-backed table showing Date, Slot, Subject, Session Type (`LECTURE`, `LAB`, `TUTORIAL`), and Status.
- **Online Leave & On-Duty (OD) Application Workflow (FR-8, UC-03, TC12, TC13):**
  - Application form with document upload simulator.
  - **TC12 Validation:** Blocks files $> 5\text{MB}$ with a security error.
  - **TC13 Validation:** Blocks overlapping date ranges with active requests.
  - Full status lifecycle: `SUBMITTED` $\rightarrow$ `APPROVED` / `REJECTED` / `WITHDRAWN`.

---

### 2. 👨‍🏫 Faculty Workspace (`Prof. R. Sharma • Subject Teacher`)
- **3-Tap Quick Marking (FR-5, FR-6, NFR-5, UC-04, UC-05):**
  - **Step 1:** Select Subject, Date, Slot, and Session Type (`All Class Lecture`, `Lab Batch B1`, `Lab Batch B2`, `Tutorial`), or toggle `Mark Session as CANCELLED` (FR-4).
  - **Step 2:** Interactive roster of 12 students defaulted to `PRESENT`. Single tap cycles `PRESENT` $\rightarrow$ `ABSENT` $\rightarrow$ `LATE`.
  - Batch Filter (`All`, `Batch B1`, `Batch B2`), search by roll number or name, and bulk actions (`Mark All Present`, `Mark All Absent`).
  - **Step 3:** Atomic submission with $<1\text{s}$ transaction toast.
  - **TC06 Idempotency Guard:** Detects and blocks duplicate submissions for the same subject, date, and slot.
  - **TC05 Offline Network Drop Simulator:** When offline mode is active, submissions queue in a local sync queue without partial writes; flushing occurs automatically when toggled back online.
- **48-Hour Correction Window & Boundary Value Analysis (FR-7, UC-07, UC-08, BVA B1–B4):**
  - Interactive selector for Hours Elapsed: `0h`, `24h`, `47h`, `48h`, `49h`, `72h`.
  - **$\le 48\text{h}$ (Test Cases B1, B2, B3):** Direct editing unlocked; writes directly to database and audit log.
  - **$> 48\text{h}$ (Test Cases B4: 49h, 72h):** Direct editing is locked with a policy banner; opens a modal to *"Raise Post-Window Correction Request to HOD"*, which routes into the HOD queue.

---

### 3. 📋 Class Coordinator Workspace (`Prof. A. Deshmukh • Class Coordinator`)
- **Leave & On-Duty Approval Queue (FR-8, UC-09, TC14):**
  - Review student leave applications and inspect attached document proofs.
  - **OD Credit Logic:** Approving an `ON-DUTY` request automatically credits the student's attendance records with an `OD` flag and logs an audit record.
- **Defaulter Surveillance & Guardian Communication Engine (FR-11, FR-12, FR-13, UC-12, UC-13, UC-14):**
  - Real-time filtered view of all 12 students categorized into Critical Defaulter ($<75\%$), Warning Zone ($75\%-80\%$), and Eligible ($\ge 80\%$).
  - **Run 18:00 Daily Guardian Digest:** Dispatches templated email notifications to registered parent contacts with a legally compliant opt-out footer.
  - **Export CSV:** Downloads an official formatted `.csv` compliance report.
  - **Printable PDF Report:** Formatted official report with MPSTME institutional header, signature lines, and print styling (`window.print()`).

---

### 4. 🏛️ Head of Department (HOD) Workspace (`Dr. V. Kulkarni • HOD CS`)
- **Post-48h Correction Request Approval Queue (FR-7, UC-10):**
  - Review faculty correction requests raised beyond the 48-hour limit.
  - Approving instantly mutates student attendance records and logs the decision.
- **Live Threshold Configuration Engine (FR-11, UC-11, TC20):**
  - Sliders to adjust Defaulter Threshold ($60\% - 85\%$) and Warning Threshold ($70\% - 90\%$).
  - Live cohort impact simulator displays real-time before/after student counts with zero code rebuild.
- **Department-Wide Subject & Batch Analytics:**
  - Macro analytics comparing subject averages, batch performance (B1 vs B2), and faculty adherence to 24-hour marking guidelines.

---

### 5. 🛡️ System Administrator Workspace (`SysAdmin • Infrastructure & Audit`)
- **Master Data & Timetable Manager (FR-3, FR-4, UC-16):**
  - Register new subjects, configure credit weighting, lecture halls, and lab batches.
  - Semester timetable matrix viewer (Monday to Friday, 9:00 AM to 5:00 PM).
  - **CSV Bulk Student Enrollment Simulator:** Staging with row-level validation (format pattern matching, duplicate detection).
- **Append-Only Immutable Audit Log (FR-14, NFR-7, TC16, TC17):**
  - Chronological tamper-evident audit ledger with SHA-256 block hash chaining (`PrevHash` $\rightarrow$ `CurrentHash`).
  - **TC17 Admin Tamper Attack Simulation:** A button to simulate an administrative edit/deletion attempt, triggering an `IMMUTABLE_LOG_VIOLATION` security alert proving Write-Once-Read-Many (WORM) policy enforcement.

---

## 🔒 Authentication & Security Simulator Modal (NFR-3, TC01, TC02)
Accessible via the **Auth & Security** button in the header:
- **TC01:** Bcrypt password hashing display with 12 rounds cost factor and pseudorandom salt.
- **NFR-3:** 15-Minute session inactivity countdown timer with session token renewal.
- **TC02:** 5-Attempt rate-limiting lockout simulator with failed attempts counter and 15-minute lock upon 5 failed attempts.

---

## 💻 Running the Application Locally

```bash
# 1. Install dependencies
npm install

# 2. Launch Vite Development Server
npm run dev

# 3. Build for Production
npm run build

# 4. Preview Production Build
npm run preview
```
