import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { ShieldX, X, AlertOctagon, Database, Terminal, FileCode2 } from 'lucide-react';

export default function TamperViolationModal() {
  const { tamperViolationModalOpen, setTamperViolationModalOpen } = useAttendance();

  if (!tamperViolationModalOpen) return null;

  const mockSqlPayload = `/* Simulated Ledger Mutation Attempt by SYSADMIN */
Action: REMOVE_LOG_ENTRY [log_id = 'LOG-2026-9040']

Result:
SECURITY EXCEPTION: [POLICY-IMMUTABLE-RULE-42]
Append-Only Rule Violation: The audit ledger strictly disallows modification or deletion 
operations even for SUPERUSER / SYSADMIN credentials.

CRYPTOGRAPHIC CHECK:
  Previous Block Hash: 7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d
  Computed Current Hash: 8f7a3b4c1e2d9a0f6b5c4d3e2a1b0c9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b
  STATUS: TAMPER-RESISTANT MERKLE CHAIN VERIFIED (0 MUTATIONS APPLIED)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-rose-300 overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-rose-700 to-rose-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldX className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
                IMMUTABLE_LOG_VIOLATION (TC17)
                <span className="text-[10px] font-mono bg-black/30 px-2 py-0.5 rounded-full border border-white/20">
                  WORM Enforced
                </span>
              </h3>
              <p className="text-xs text-rose-100">
                Write-Once-Read-Many (WORM) Cryptographic Integrity Protection
              </p>
            </div>
          </div>
          <button
            onClick={() => setTamperViolationModalOpen(false)}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 leading-relaxed">
              <span className="font-bold block text-rose-950 mb-0.5">
                Administrative Tamper Attempt Blocked as per NFR-7 & TC17
              </span>
              The system enforces an <strong>append-only write-once-read-many (WORM)</strong> invariant on the audit trail. Even root system administrators or database superusers are cryptographically and architecturally prevented from altering, backdating, or deleting historical attendance records and audit logs.
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                Database Engine Security Interceptor Output
              </span>
              <span className="font-mono text-[11px] text-rose-600 font-semibold">
                Integrity Lock: ACTIVE
              </span>
            </div>
            <pre className="bg-slate-950 text-rose-400 p-4 rounded-xl font-mono text-[11px] overflow-x-auto border border-rose-950/40 leading-relaxed">
              <code>{mockSqlPayload}</code>
            </pre>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
              <span className="font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                Cryptographic Block Chaining
              </span>
              <p className="text-slate-500 text-[11px]">
                Every log record contains a SHA-256 hash of its payload plus the hash of the preceding block (<span className="font-mono text-[10px]">prevHash</span>).
              </p>
            </div>
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
              <span className="font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-indigo-600" />
                Audit Trail Persistence
              </span>
              <p className="text-slate-500 text-[11px]">
                The illegal modification attempt has itself been immutably recorded in the ledger as a high-severity security incident.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setTamperViolationModalOpen(false)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
