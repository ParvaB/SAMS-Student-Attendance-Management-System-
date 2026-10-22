import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Calendar, 
  FileCheck2,
  AlertTriangle,
  History
} from 'lucide-react';

export default function PostCorrectionQueue() {
  const { postCorrections, approvePostCorrection, rejectPostCorrection } = useAttendance();

  const [rejectReason, setRejectReason] = useState('');
  const [activeRejectId, setActiveRejectId] = useState(null);

  const pendingRequests = postCorrections.filter((c) => c.status === 'PENDING_HOD');
  const processedRequests = postCorrections.filter((c) => c.status !== 'PENDING_HOD');

  const handleApprove = (id) => {
    approvePostCorrection(id);
  };

  const handleReject = (id) => {
    rejectPostCorrection(id, rejectReason || 'Insufficient justification for post-window alteration.');
    setActiveRejectId(null);
    setRejectReason('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Post-48h Correction Request Approval Queue (FR-7, UC-10)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Head of Department sovereign governance: review escalated boundary alterations beyond the 48-hour faculty window
          </p>
        </div>

        <span className="font-mono text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
          {pendingRequests.length} Escalations Pending
        </span>
      </div>

      {/* Pending Escalations */}
      <div className="p-5 space-y-4">
        {pendingRequests.length > 0 ? (
          <div className="space-y-3">
            {pendingRequests.map((corr) => (
              <div
                key={corr.id}
                className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 hover:bg-purple-50/50 transition shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-900">{corr.id}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                      Elapsed: {corr.hoursElapsed}h (&gt; 48h Hard Window)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Submitted: {new Date(corr.submittedAt).toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Subject & Session
                    </span>
                    <span className="font-bold text-slate-800">{corr.subjectName}</span>
                    <span className="text-slate-500 block font-mono text-[11px]">
                      {corr.subjectCode} • Date: {corr.sessionDate}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Student & Status Mutation
                    </span>
                    <span className="font-bold text-slate-800">{corr.studentName} ({corr.studentRollNo})</span>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] mt-0.5">
                      <span className="text-rose-700 font-bold bg-white px-1.5 rounded border border-rose-200">
                        {corr.currentStatus}
                      </span>
                      <span>&rarr;</span>
                      <span className="text-emerald-700 font-bold bg-white px-1.5 rounded border border-emerald-200">
                        {corr.requestedStatus}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Escalating Faculty
                    </span>
                    <span className="font-bold text-slate-800">{corr.facultyName}</span>
                    <span className="text-slate-500 block text-[11px]">Subject Teacher</span>
                  </div>
                </div>

                {/* Faculty Reason */}
                <div className="p-3 bg-white border border-purple-200 rounded-lg text-xs text-slate-700">
                  <span className="font-semibold text-purple-900 block mb-0.5">
                    Faculty Justification:
                  </span>
                  {corr.reason}
                </div>

                {/* Reject Input Field if active */}
                {activeRejectId === corr.id && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-2 animate-in fade-in">
                    <label className="block text-xs font-semibold text-rose-800">
                      HOD Rejection Justification
                    </label>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Specify reasons for turning down post-window alteration..."
                      className="w-full text-xs p-2 rounded-lg border border-rose-300 bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveRejectId(null)}
                        className="px-3 py-1 bg-white border rounded text-xs text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(corr.id)}
                        className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-bold"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {activeRejectId !== corr.id && (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setActiveRejectId(corr.id)}
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject Escalation
                    </button>

                    <button
                      onClick={() => handleApprove(corr.id)}
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve & Commit Ledger
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 text-xs border border-dashed rounded-xl bg-slate-50">
            No pending post-48h correction escalations in the HOD queue.
          </div>
        )}

        {/* Audit Log of Previous HOD Decisions */}
        {processedRequests.length > 0 && (
          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Previous HOD Adjudications
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Escalation ID</th>
                    <th className="py-2.5 px-3">Subject & Student</th>
                    <th className="py-2.5 px-3">Status Mutation</th>
                    <th className="py-2.5 px-3">HOD Decision</th>
                    <th className="py-2.5 px-3">Adjudicator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {processedRequests.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-700">{c.id}</td>
                      <td className="py-2 px-3 font-sans">
                        <span className="font-bold text-slate-800">{c.subjectCode}</span> - {c.studentName} ({c.studentRollNo})
                      </td>
                      <td className="py-2 px-3">
                        {c.currentStatus} &rarr; {c.requestedStatus}
                      </td>
                      <td className="py-2 px-3 font-sans">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-sans text-slate-500 text-[11px]">
                        {c.reviewedBy || 'Dr. V. Kulkarni (HOD)'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
