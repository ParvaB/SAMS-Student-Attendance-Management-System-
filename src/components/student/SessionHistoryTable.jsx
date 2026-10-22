import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Briefcase, 
  Ban,
  ChevronDown
} from 'lucide-react';

export default function SessionHistoryTable() {
  const { sessionLogs } = useAttendance();

  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = sessionLogs.filter((session) => {
    if (subjectFilter !== 'ALL' && session.subjectCode !== subjectFilter) return false;
    if (statusFilter !== 'ALL' && session.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSubject = session.subjectName.toLowerCase().includes(term) || session.subjectCode.toLowerCase().includes(term);
      const matchesRemarks = session.remarks?.toLowerCase().includes(term);
      const matchesFaculty = session.faculty?.toLowerCase().includes(term);
      if (!matchesSubject && !matchesRemarks && !matchesFaculty) return false;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PRESENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            PRESENT
          </span>
        );
      case 'ABSENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            ABSENT
          </span>
        );
      case 'LATE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            LATE
          </span>
        );
      case 'ON-DUTY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Briefcase className="w-3 h-3 text-indigo-600" />
            ON-DUTY (Exempt)
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-300 line-through">
            <Ban className="w-3 h-3 text-slate-500" />
            CANCELLED (Excluded)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Session-Level Attendance Ledger (FR-9)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-backed granular log of all conducted, attended, and cancelled class sessions
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search remarks, code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Subjects</option>
            <option value="CS301">CS301: Software Eng</option>
            <option value="CS302">CS302: DBMS</option>
            <option value="CS303">CS303: Compiler Design</option>
            <option value="CS304">CS304: Discrete Maths</option>
            <option value="CS305">CS305: Networks Lab</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
            <option value="ON-DUTY">On-Duty</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Faculty</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Academic Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-800 font-mono">
                      {session.date}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {session.slot}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200">
                        {session.subjectCode}
                      </span>
                      <span>{session.subjectName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Session ID: {session.id}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {session.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                    {session.faculty}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(session.status)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs text-[11px] leading-relaxed">
                    {session.remarks || '—'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                  No session logs match the current filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
