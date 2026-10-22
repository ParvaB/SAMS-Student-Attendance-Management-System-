import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  ArrowRight, 
  Send, 
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Edit3
} from 'lucide-react';

export default function CorrectionWindowSimulator() {
  const { 
    sessionLogs, 
    directUpdateSession, 
    escalateCorrectionToHod, 
    addToast 
  } = useAttendance();

  // BVA Hours Selector: 0h (B1), 24h (B2), 47h (B3), 48h (B3 Boundary), 49h (B4 Boundary + 1), 72h (B4 Out of Bounds)
  const [selectedHours, setSelectedHours] = useState(24);

  // Pick a session to test correction on (default SESS-1092 or first one)
  const [selectedSessionId, setSelectedSessionId] = useState('SESS-1092');
  const [newStatus, setNewStatus] = useState('PRESENT');
  const [editReason, setEditReason] = useState('Rectified proxy miscount during roll call');

  // Modal for post-48h escalation
  const [escalationModalOpen, setEscalationModalOpen] = useState(false);
  const [escalationReason, setEscalationReason] = useState('Biometric hardware glitch verified via physical attendance register signed by student');

  const session = sessionLogs.find((s) => s.id === selectedSessionId) || sessionLogs[0];
  const isWithin48h = selectedHours <= 48;

  // Handle direct edit <=48h
  const handleDirectEdit = (e) => {
    e.preventDefault();
    if (!isWithin48h) {
      addToast('Cannot save directly: 48h hard limit exceeded (BVA TC-B4). Must escalate to HOD.', 'error');
      return;
    }
    directUpdateSession(selectedSessionId, newStatus, editReason);
  };

  // Handle post-48h escalation
  const handleEscalateSubmit = (e) => {
    e.preventDefault();
    escalateCorrectionToHod({
      sessionId: session.id,
      subjectCode: session.subjectCode,
      studentRollNo: 'E224',
      studentName: 'Parva Bagadia',
      sessionDate: session.date,
      hoursElapsed: selectedHours,
      currentStatus: session.status,
      requestedStatus: newStatus,
      reason: escalationReason
    });
    setEscalationModalOpen(false);
  };

  const bvaCases = [
    { hours: 0, label: '0 Hours (T=0)', code: 'TC-B1', status: 'Direct Edit Allowed', allowed: true },
    { hours: 24, label: '24 Hours (T+24)', code: 'TC-B2', status: 'Direct Edit Allowed', allowed: true },
    { hours: 47, label: '47 Hours (T+47)', code: 'TC-B3 (Near Limit)', status: 'Direct Edit Allowed', allowed: true },
    { hours: 48, label: '48 Hours (T+48 Exact)', code: 'TC-B3 (Boundary Max)', status: 'Direct Edit Allowed (Edge)', allowed: true },
    { hours: 49, label: '49 Hours (T+49 Boundary+1)', code: 'TC-B4 (Hard Lock)', status: 'LOCKED • Escalation Required', allowed: false },
    { hours: 72, label: '72 Hours (T+72)', code: 'TC-B4 (Expired)', status: 'LOCKED • Escalation Required', allowed: false },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              48-Hour Correction Window & Boundary Value Analysis Simulator (FR-7, UC-07, UC-08)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Test boundary value test cases B1–B4 (0h, 24h, 47h, 48h, 49h, 72h) governing automated locking policies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border bg-slate-100 text-slate-700">
            Current Test Elapsed: <strong className="text-indigo-600">{selectedHours} Hours</strong>
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* BVA Selector Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Select Simulated Hours Elapsed Since Submission:</span>
            <span className="font-mono text-[11px] text-slate-400">
              Policy Rule: Window &le; 48h &rarr; Unlocked | &gt; 48h &rarr; Locked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {bvaCases.map((tc) => {
              const isSelected = selectedHours === tc.hours;
              return (
                <button
                  key={tc.hours}
                  type="button"
                  onClick={() => setSelectedHours(tc.hours)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? tc.allowed
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {tc.hours}h Elapsed
                    </span>
                    {tc.allowed ? (
                      <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-rose-600" />
                    )}
                  </div>
                  <div className="font-mono text-[10px] text-indigo-600 font-bold">
                    {tc.code}
                  </div>
                  <div className={`text-[10px] font-medium leading-tight mt-0.5 ${
                    tc.allowed ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {tc.status}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Policy Status Banner */}
        {isWithin48h ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <span className="font-bold text-emerald-950 block mb-0.5">
                Direct Faculty Editing Unlocked ({selectedHours}h &le; 48h)
              </span>
              As verified by <strong>Test Cases B1, B2, and B3</strong>, faculty members retain autonomous correction authority within 48 hours of session timestamp. Modifications are committed directly to student records and logged into the append-only audit trail.
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 flex items-start gap-3">
            <Lock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 leading-relaxed flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold text-rose-950">
                  48-Hour Hard Limit Expired ({selectedHours}h &gt; 48h) • Test Case B4
                </span>
                <span className="text-[10px] font-mono uppercase bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-bold">
                  DIRECT WRITE BLOCKED
                </span>
              </div>
              Under Academic Regulation 4.2 and <strong>Boundary Value Test Case B4</strong>, direct database edits are strictly prohibited after 48 hours. Any modification requires an escalated formal request requiring approval from the Head of Department (HOD).
            </div>
          </div>
        )}

        {/* Session Editor Workspace */}
        {session && (
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Target Session for Correction:</span>
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="text-xs p-1.5 rounded-lg border border-slate-200 bg-white font-mono"
                >
                  {sessionLogs.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} - {s.subjectCode} ({s.date}) [{s.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-800">Parva Bagadia (E224)</span>
                <span className="text-slate-400 font-mono">Current:</span>
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-white border text-slate-800">
                  {session.status}
                </span>
              </div>
            </div>

            {/* Editing Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Proposed Corrected Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-semibold"
                >
                  <option value="PRESENT">PRESENT</option>
                  <option value="ABSENT">ABSENT</option>
                  <option value="LATE">LATE</option>
                  <option value="ON-DUTY">ON-DUTY</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Faculty Justification / Correction Reason
                </label>
                <input
                  type="text"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="State the verifiable reason for modifying this record..."
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            {/* Action Trigger based on 48h boundary */}
            <div className="pt-2 flex justify-end">
              {isWithin48h ? (
                <button
                  type="button"
                  onClick={handleDirectEdit}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-xs"
                >
                  <Edit3 className="w-4 h-4" />
                  Apply Direct Correction (Within 48h)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setEscalationModalOpen(true)}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  Raise Post-Window Correction Request to HOD
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Post-48h Escalation Modal to HOD */}
      {escalationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-amber-300 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-200" />
                <div>
                  <h3 className="font-bold text-sm">
                    Escalate Correction Request to HOD (FR-7, UC-08)
                  </h3>
                  <p className="text-[11px] text-amber-100">
                    48h Boundary Exceeded ({selectedHours}h elapsed) • Requires Dr. V. Kulkarni approval
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleEscalateSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                <div className="font-bold">Session Reference: {session.id}</div>
                <div className="text-[11px]">Subject: {session.subjectName} ({session.subjectCode})</div>
                <div className="text-[11px]">Student: Parva Bagadia (E224)</div>
                <div className="text-[11px] font-mono">
                  Current: <strong className="text-rose-700">{session.status}</strong> &rarr; Requested:{' '}
                  <strong className="text-emerald-700">{newStatus}</strong>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Detailed Justification for Head of Department
                </label>
                <textarea
                  required
                  rows={3}
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="Explain why the record was not amended within the regular 48h window..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEscalationModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Transmit Request to HOD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
