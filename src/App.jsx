import React from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import Navbar from './components/common/Navbar';
import ToastContainer from './components/common/Toast';
import ForbiddenModal from './components/common/ForbiddenModal';
import SecurityModal from './components/common/SecurityModal';
import TamperViolationModal from './components/common/TamperViolationModal';

// Role Modules
import StudentDashboard from './components/student/StudentDashboard';
import FacultyWorkspace from './components/faculty/FacultyWorkspace';
import CoordinatorWorkspace from './components/coordinator/CoordinatorWorkspace';
import HodWorkspace from './components/hod/HodWorkspace';
import AdminWorkspace from './components/admin/AdminWorkspace';

import { 
  ShieldCheck, 
  Code2, 
  GraduationCap, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

function MainAppContent() {
  const { currentRole, currentUser } = useAttendance();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sticky Top Navigation with Instant Role Switcher */}
      <Navbar />

      {/* Role Banner Ribbon */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-extrabold text-indigo-600 text-sm">
              {currentUser.id.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{currentUser.name}</span>
                <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.2 rounded border border-slate-200">
                  {currentUser.id}
                </span>
                {currentUser.batch && (
                  <span className="text-[10px] font-mono bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded border border-purple-200">
                    {currentUser.batch}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{currentUser.roleTitle}</span>
                <span>•</span>
                <span>{currentUser.department}</span>
              </div>
            </div>
          </div>

          {/* Quick Test Cases Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200" title="Password Masking & Bcrypt Salt">
              TC01: Bcrypt-12
            </span>
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200" title="5-Attempt Rate-Limiting Lockout">
              TC02: 5-Attempt Lock
            </span>
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200" title="Role-based 403 Forbidden">
              TC03: 403 Read-Only
            </span>
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200" title="Offline Drop Sync Queue">
              TC05: Offline Queue
            </span>
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200" title="Idempotent Duplicate Guard">
              TC06: Idempotent
            </span>
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200" title="48h Boundary Value Analysis">
              BVA: 0h-72h Window
            </span>
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200" title="Immutable WORM Audit Ledger">
              TC17: WORM Ledger
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentRole === 'STUDENT' && <StudentDashboard />}
        {currentRole === 'FACULTY' && <FacultyWorkspace />}
        {currentRole === 'COORDINATOR' && <CoordinatorWorkspace />}
        {currentRole === 'HOD' && <HodWorkspace />}
        {currentRole === 'ADMIN' && <AdminWorkspace />}
      </main>

      {/* Institutional Academic Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              S
            </div>
            <div>
              <span className="font-bold text-slate-800">SAMS</span> • Student Attendance Management System
              <div className="text-[11px] text-slate-400">
                Software Engineering Project • Academic Year 2026–2027
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-slate-600">
            <span>Student: <strong className="text-slate-800">Parva Bagadia</strong> (Roll: E224)</span>
            <span>•</span>
            <span>B.Tech CSE Sem V • Batch B1</span>
            <span>•</span>
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              OWASP Secure RBAC
            </span>
          </div>
        </div>
      </footer>

      {/* Modals & Notification Overlays */}
      <ForbiddenModal />
      <SecurityModal />
      <TamperViolationModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AttendanceProvider>
      <MainAppContent />
    </AttendanceProvider>
  );
}
