import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Lock, 
  Database, 
  Fingerprint, 
  ShieldX, 
  KeyRound, 
  Terminal,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function AuditLogViewer() {
  const { auditLogs, triggerTamperAttempt } = useAttendance();

  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectLog, setInspectLog] = useState(null);

  const filteredLogs = auditLogs.filter((log) => {
    if (roleFilter !== 'ALL' && log.role !== roleFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesAction = log.action.toLowerCase().includes(term);
      const matchesDetails = log.details.toLowerCase().includes(term);
      const matchesUser = log.userName.toLowerCase().includes(term) || log.userId.toLowerCase().includes(term);
      const matchesId = log.logId.toLowerCase().includes(term);
      if (!matchesAction && !matchesDetails && !matchesUser && !matchesId) return false;
    }
    return true;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'STUDENT':
        return <span className="bg-indigo-50 text-indigo-700 border-indigo-200 border px-1.5 py-0.2 rounded font-mono text-[10px]">STUDENT</span>;
      case 'FACULTY':
        return <span className="bg-emerald-50 text-emerald-700 border-emerald-200 border px-1.5 py-0.2 rounded font-mono text-[10px]">FACULTY</span>;
      case 'COORDINATOR':
        return <span className="bg-blue-50 text-blue-700 border-blue-200 border px-1.5 py-0.2 rounded font-mono text-[10px]">COORDINATOR</span>;
      case 'HOD':
        return <span className="bg-purple-50 text-purple-700 border-purple-200 border px-1.5 py-0.2 rounded font-mono text-[10px]">HOD</span>;
      case 'ADMIN':
        return <span className="bg-slate-900 text-white px-1.5 py-0.2 rounded font-mono text-[10px]">SYSADMIN</span>;
      default:
        return <span>{role}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Append-Only Immutable Audit Log (FR-14, NFR-7, TC16, TC17)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically linked tamper-evident ledger with WORM write constraints
          </p>
        </div>

        {/* TC17 Admin Tamper Attack Simulation Trigger */}
        <button
          onClick={triggerTamperAttempt}
          className="flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          title="Simulate Admin attempting to delete or alter audit records (TC17)"
        >
          <ShieldX className="w-4 h-4 text-white" />
          <span>Simulate Admin Edit/Delete Attempt (TC17)</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/30">
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search action, details, user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
            <option value="COORDINATOR">Coordinator</option>
            <option value="HOD">HOD</option>
            <option value="ADMIN">SysAdmin</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Fingerprint className="w-3.5 h-3.5 text-indigo-600" />
          <span>SHA-256 Chained Blocks: {auditLogs.length} Records</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Log Reference</th>
              <th className="py-3 px-4">Timestamp (UTC)</th>
              <th className="py-3 px-4">Principal Identity</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4">Action Details & IP</th>
              <th className="py-3 px-4">Block Hash (SHA-256)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {filteredLogs.map((log) => {
              const isSecurityViolation = 
                log.action.includes('UNAUTHORIZED') || 
                log.action.includes('VIOLATION') || 
                log.action.includes('TAMPER');

              return (
                <tr
                  key={log.logId}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isSecurityViolation ? 'bg-rose-50/40 text-rose-950' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                    {log.logId}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap text-[10px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-sans whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{log.userName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.userId}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getRoleBadge(log.role)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isSecurityViolation
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700 max-w-sm text-xs leading-relaxed">
                    <div>{log.details}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Client IP: {log.ipAddress}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-indigo-700 whitespace-nowrap select-all">
                    <span title={`Current: ${log.hash}\nPrevious: ${log.prevHash}`}>
                      {log.hash.slice(0, 10)}...{log.hash.slice(-6)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
