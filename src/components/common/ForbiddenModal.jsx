import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { ShieldAlert, X, Terminal, Lock, AlertOctagon } from 'lucide-react';

export default function ForbiddenModal() {
  const { forbiddenModalOpen, setForbiddenModalOpen } = useAttendance();

  if (!forbiddenModalOpen) return null;

  const mockPayload = {
    status: 403,
    error: "FORBIDDEN",
    errorCode: "SEC_ROLE_INSUFFICIENT_PRIVILEGE",
    message: "Access Denied: Principal [STU-E224: Parva Bagadia] possesses role [ROLE_STUDENT]. Required authority [ATTENDANCE_WRITE, ATTENDANCE_MUTATE] is strictly restricted to [FACULTY, COORDINATOR, HOD].",
    path: "/api/v1/attendance/mark",
    method: "POST",
    clientIp: "10.20.14.88",
    timestamp: new Date().toISOString(),
    auditReference: "LOG-2026-SEC-403"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-rose-200 overflow-hidden">
        {/* Top Warning Strip */}
        <div className="bg-rose-500 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
                HTTP 403 Forbidden (Test Case TC03)
                <span className="text-[10px] font-mono uppercase bg-rose-600 px-2 py-0.5 rounded-full border border-rose-400">
                  Security Block
                </span>
              </h3>
              <p className="text-xs text-rose-100">
                Role-Based Access Control (RBAC) Hard Enforcement Test
              </p>
            </div>
          </div>
          <button
            onClick={() => setForbiddenModalOpen(false)}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 leading-relaxed">
              <span className="font-bold block text-rose-950 mb-0.5">
                Unauthorized Write Attempt Successfully Intercepted
              </span>
              As per <strong>NFR-3 & FR-1</strong>, student accounts operate under a strict Read-Only permission sandbox. Even if a student bypasses the client UI and invokes the write endpoint via cURL, Postman, or script, the server-side security filter intercepts and immutably logs the violation.
            </div>
          </div>

          {/* JSON API Response Simulation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                Raw Backend Interceptor Response (JSON)
              </span>
              <span className="font-mono text-[11px] text-rose-600 font-semibold">
                Status: 403 Forbidden
              </span>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-56">
              <code>{JSON.stringify(mockPayload, null, 2)}</code>
            </pre>
          </div>

          {/* Security Spec Points */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
              <span className="font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" /> WORM Audit Log Entry
              </span>
              <p className="text-slate-500 text-[11px]">
                A security alert entry has been committed to the immutable audit trail with client IP <span className="font-mono">10.20.14.88</span>.
              </p>
            </div>
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
              <span className="font-semibold text-slate-700 block mb-1">
                Zero Mutation Guarantee
              </span>
              <p className="text-slate-500 text-[11px]">
                No database rows were modified. Transaction was aborted before execution.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setForbiddenModalOpen(false)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
