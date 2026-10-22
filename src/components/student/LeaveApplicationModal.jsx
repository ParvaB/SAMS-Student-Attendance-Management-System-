import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  FileText, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  X, 
  Briefcase, 
  HeartPulse, 
  User, 
  FileCheck,
  Calendar,
  AlertTriangle,
  Trash2
} from 'lucide-react';

export default function LeaveApplicationModal() {
  const { leaveRequests, submitLeaveRequest, withdrawLeaveRequest, addToast } = useAttendance();

  const [isOpen, setIsOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('ON_DUTY');
  const [startDate, setStartDate] = useState('2026-11-15');
  const [endDate, setEndDate] = useState('2026-11-17');
  const [reason, setReason] = useState('Representing NMIMS at National Robotics Championship');
  const [selectedFile, setSelectedFile] = useState({ name: 'Robotics_Invitation_Letter.pdf', size: 2.2 * 1024 * 1024 });
  const [simulateOversized, setSimulateOversized] = useState(false);

  // Filter only student E224's requests
  const myRequests = leaveRequests.filter((r) => r.studentRollNo === 'E224');

  const handleSubmit = (e) => {
    e.preventDefault();

    let fileToSubmit = selectedFile;
    if (simulateOversized) {
      // Create a mock 6.5 MB file to demonstrate TC12
      fileToSubmit = {
        name: 'HighRes_Scanned_Document_Oversized.pdf',
        size: 6.5 * 1024 * 1024
      };
    }

    const res = submitLeaveRequest({
      type: leaveType,
      reason,
      startDate,
      endDate,
      file: fileToSubmit
    });

    if (res.success) {
      setIsOpen(false);
      setSimulateOversized(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            APPROVED
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            PENDING COORDINATOR
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <X className="w-3 h-3 text-rose-600" />
            REJECTED
          </span>
        );
      case 'WITHDRAWN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
            WITHDRAWN
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Leave & On-Duty (OD) Application Workflow (FR-8, UC-03)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit duty exemptions and medical leaves with strict file-size (TC12) and date-overlap (TC13) verification
          </p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition shadow-xs"
        >
          <FileText className="w-3.5 h-3.5" />
          Apply New Leave / OD
        </button>
      </div>

      {/* Existing Applications Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Application ID</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Dates & Duration</th>
              <th className="py-3 px-4">Reason & Document</th>
              <th className="py-3 px-4">Status & Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {myRequests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                  {req.id}
                  <div className="text-[10px] text-slate-400 font-sans font-normal">
                    {new Date(req.appliedAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-semibold text-[11px] px-2 py-0.5 rounded ${
                      req.type === 'ON_DUTY'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : req.type === 'MEDICAL'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {req.type === 'ON_DUTY' ? 'ON-DUTY (OD)' : req.type}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono">
                  <div className="font-semibold text-slate-800 text-[11px]">
                    {req.startDate} to {req.endDate}
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans">
                    {req.daysCount} working day{req.daysCount > 1 ? 's' : ''}
                  </div>
                </td>
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="text-slate-800 font-medium text-[11px] leading-snug">
                    {req.reason}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 mt-1 font-mono">
                    <FileCheck className="w-3 h-3 text-indigo-500" />
                    <span>{req.documentName}</span>
                    <span className="text-slate-400">({req.documentSize})</span>
                  </div>
                  {req.reviewNotes && (
                    <div className="mt-1 text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-200">
                      <strong>Coordinator note:</strong> {req.reviewNotes}
                    </div>
                  )}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(req.status)}
                    {req.status === 'SUBMITTED' && (
                      <button
                        onClick={() => withdrawLeaveRequest(req.id)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-0.5 ml-2 font-medium"
                        title="Withdraw pending request"
                      >
                        <Trash2 className="w-3 h-3" />
                        Withdraw
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Application Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    Submit Academic Leave / On-Duty (OD)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    FR-8 Exemption Management • Student: Parva Bagadia (E224)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Application Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLeaveType('ON_DUTY')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      leaveType === 'ON_DUTY'
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-900 ring-1 ring-indigo-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-indigo-600 mb-1" />
                    <div className="text-xs font-bold">On-Duty (OD)</div>
                    <div className="text-[10px] text-slate-500">Credited as Present</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLeaveType('MEDICAL')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      leaveType === 'MEDICAL'
                        ? 'bg-rose-50 border-rose-400 text-rose-900 ring-1 ring-rose-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <HeartPulse className="w-4 h-4 text-rose-600 mb-1" />
                    <div className="text-xs font-bold">Medical Leave</div>
                    <div className="text-[10px] text-slate-500">Hospital Cert Required</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLeaveType('PERSONAL')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      leaveType === 'PERSONAL'
                        ? 'bg-slate-100 border-slate-400 text-slate-900 ring-1 ring-slate-400'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <User className="w-4 h-4 text-slate-600 mb-1" />
                    <div className="text-xs font-bold">Personal Leave</div>
                    <div className="text-[10px] text-slate-500">Family Emergency</div>
                  </button>
                </div>
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Reason & Academic Justification
                </label>
                <textarea
                  required
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Detail the event name, location, or medical diagnosis..."
                />
              </div>

              {/* Document Upload Simulator & TC12 Oversize Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Supporting Proof Document (PDF, max 5MB)
                  </label>
                  <button
                    type="button"
                    onClick={() => setSimulateOversized(!simulateOversized)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border transition ${
                      simulateOversized
                        ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    Simulate &gt;5MB File (TC12 Test)
                  </button>
                </div>

                <div className={`p-3.5 border-2 border-dashed rounded-xl flex items-center justify-between gap-3 ${
                  simulateOversized 
                    ? 'border-rose-300 bg-rose-50/50' 
                    : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <FileCheck className={`w-5 h-5 ${simulateOversized ? 'text-rose-500' : 'text-indigo-600'}`} />
                    <div>
                      <div className="text-xs font-bold text-slate-800 font-mono">
                        {simulateOversized ? 'National_Robotics_Oversized_6.5MB.pdf' : selectedFile.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Size: {simulateOversized ? '6.5 MB (Exceeds 5MB Threshold)' : '2.2 MB (Valid)'}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    simulateOversized ? 'bg-rose-200 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {simulateOversized ? 'TC12 FAIL TRAP' : 'VALID'}
                  </span>
                </div>
              </div>

              {/* Test Suite Hints */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-indigo-600" />
                  Validation Rules Enforced (TC12, TC13)
                </div>
                <p>• <strong>TC12</strong>: Submissions with documents &gt; 5MB will be rejected with an immediate security alert.</p>
                <p>• <strong>TC13</strong>: Submitting dates that overlap with an existing application will trigger a date conflict block.</p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
