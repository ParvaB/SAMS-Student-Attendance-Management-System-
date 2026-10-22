import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Eye, 
  X, 
  User, 
  Calendar, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function LeaveApprovalQueue() {
  const { leaveRequests, approveLeaveRequest, rejectLeaveRequest } = useAttendance();

  // Selected request for document inspection preview modal
  const [inspectDoc, setInspectDoc] = useState(null);
  const [reviewNote, setReviewNote] = useState('');

  const pendingRequests = leaveRequests.filter((r) => r.status === 'SUBMITTED');
  const pastRequests = leaveRequests.filter((r) => r.status !== 'SUBMITTED');

  const handleApprove = (id) => {
    approveLeaveRequest(id, reviewNote || 'Approved by Class Coordinator after verification.');
    setReviewNote('');
    setInspectDoc(null);
  };

  const handleReject = (id) => {
    rejectLeaveRequest(id, reviewNote || 'Attendance in core subjects currently below eligibility threshold.');
    setReviewNote('');
    setInspectDoc(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Leave & On-Duty Approval Queue (FR-8, UC-09, TC14)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinator verification queue: approving On-Duty (OD) applications automatically credits session attendance
          </p>
        </div>

        <span className="font-mono text-xs font-bold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
          {pendingRequests.length} Pending Review
        </span>
      </div>

      {/* Pending Queue */}
      <div className="p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Awaiting Action
        </h3>

        {pendingRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-300 transition shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800">{req.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          req.type === 'ON_DUTY'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {req.type === 'ON_DUTY' ? 'ON-DUTY (OD)' : req.type}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-1">
                      {req.studentName} ({req.studentRollNo}) • {req.batch}
                    </div>
                  </div>

                  <button
                    onClick={() => setInspectDoc(req)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition border border-indigo-200 text-xs font-medium flex items-center gap-1"
                    title="Inspect supporting proof document"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Proof</span>
                  </button>
                </div>

                <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="font-semibold text-slate-700 mb-0.5">Application Reason:</div>
                  {req.reason}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>
                    {req.startDate} &rarr; {req.endDate}
                  </span>
                  <span>({req.daysCount} days)</span>
                </div>

                {/* Approve / Reject Actions */}
                <div className="pt-1 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    onClick={() => handleReject(req.id)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>

                  <button
                    onClick={() => handleApprove(req.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 text-xs border border-dashed rounded-xl bg-slate-50">
            No pending leave or OD applications in the coordinator review queue.
          </div>
        )}

        {/* Historical Decisions Summary */}
        <div className="pt-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Recently Processed Requests
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Req ID</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Coordinator Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pastRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono text-[11px] font-bold text-slate-700">
                      {req.id}
                    </td>
                    <td className="py-2 px-3 text-slate-800">
                      {req.studentName} ({req.studentRollNo})
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-[10px] font-semibold">{req.type}</span>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-500 text-[11px]">
                      {req.reviewNotes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Document Proof Inspector Modal */}
      {inspectDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">
                  Document Proof Preview: {inspectDoc.documentName}
                </h3>
              </div>
              <button onClick={() => setInspectDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Document Mock View */}
              <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-sm text-slate-900 font-mono">
                  {inspectDoc.documentName}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Document Size: {inspectDoc.documentSize} • SHA-256 Verified
                </div>
                <div className="p-3 bg-white border rounded text-left text-slate-600 font-serif text-[11px] leading-relaxed max-h-36 overflow-y-auto">
                  <div className="font-bold text-center border-b pb-1 mb-1">
                    CERTIFICATE OF PARTICIPATION & NOMINATION
                  </div>
                  This certifies that student <strong>{inspectDoc.studentName}</strong> (Roll No: {inspectDoc.studentRollNo}, Batch {inspectDoc.batch}) has been officially nominated for <strong>{inspectDoc.reason}</strong>. The university attendance exemption of {inspectDoc.daysCount} days is respectfully solicited under Academic By-law 14.
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Coordinator Review Notes
                </label>
                <input
                  type="text"
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Enter optional verification comments before recording..."
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleReject(inspectDoc.id)}
                  className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-semibold hover:bg-rose-100"
                >
                  Reject Application
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(inspectDoc.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Approve & Credit OD Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
