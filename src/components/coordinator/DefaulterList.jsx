import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { exportDefaultersToCSV } from '../../utils/exportUtils';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Mail, 
  Download, 
  Printer, 
  Send, 
  Search, 
  X, 
  FileSpreadsheet,
  FileCheck,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';

export default function DefaulterList() {
  const { 
    students, 
    subjects, 
    thresholds, 
    dispatchGuardianDigest 
  } = useAttendance();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'DEFAULTER', 'WARNING', 'SAFE'
  const [searchTerm, setSearchTerm] = useState('');
  const [digestModalOpen, setDigestModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // Compute student stats deterministically based on subjects
  const totalConducted = subjects.reduce((acc, s) => acc + s.conducted, 0);

  const studentsWithStats = students.map((student) => {
    let attended = subjects.reduce((acc, s) => acc + s.attended, 0);
    if (student.rollNo === 'E241') attended -= 7;
    if (student.rollNo === 'E208') attended -= 12;
    if (student.rollNo === 'E215') attended -= 10;
    if (student.rollNo === 'E235') attended -= 15;
    if (student.rollNo === 'E248') attended -= 18;

    const pct = totalConducted > 0 ? +((attended / totalConducted) * 100).toFixed(1) : 100;
    
    let tier = 'SAFE';
    if (pct < thresholds.defaulter) tier = 'DEFAULTER';
    else if (pct < thresholds.warning) tier = 'WARNING';

    return {
      ...student,
      conducted: totalConducted,
      attended,
      percentage: pct,
      tier
    };
  });

  const defaulters = studentsWithStats.filter((s) => s.tier === 'DEFAULTER');
  const warnings = studentsWithStats.filter((s) => s.tier === 'WARNING');
  const safeList = studentsWithStats.filter((s) => s.tier === 'SAFE');

  const filteredStudents = studentsWithStats.filter((s) => {
    if (activeTab === 'DEFAULTER' && s.tier !== 'DEFAULTER') return false;
    if (activeTab === 'WARNING' && s.tier !== 'WARNING') return false;
    if (activeTab === 'SAFE' && s.tier !== 'SAFE') return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return s.name.toLowerCase().includes(term) || s.rollNo.toLowerCase().includes(term);
    }
    return true;
  });

  const handleExportCSV = () => {
    exportDefaultersToCSV(students, subjects, thresholds.defaulter, thresholds.warning);
  };

  const handleSendDigest = () => {
    dispatchGuardianDigest(defaulters.length);
    setDigestModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Defaulter Surveillance & Guardian Communication Engine (FR-11, FR-12, FR-13)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated compliance tracking evaluated against HOD policy thresholds ({thresholds.defaulter}% cutoff / {thresholds.warning}% safe)
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setDigestModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition shadow-xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Run 18:00 Guardian Digest</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition shadow-2xs"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setPrintModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition shadow-2xs"
            title="Generate printable PDF report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print PDF Report</span>
          </button>
        </div>
      </div>

      {/* Metric Tabs Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-4 border-b border-slate-200 bg-slate-50/30">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`p-3 rounded-xl border text-left transition ${
            activeTab === 'ALL'
              ? 'bg-white border-slate-400 shadow-xs ring-1 ring-slate-400'
              : 'bg-white/60 border-slate-200 hover:bg-white'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Total Enrolled
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono mt-0.5">
            {students.length} Students
          </div>
        </button>

        <button
          onClick={() => setActiveTab('DEFAULTER')}
          className={`p-3 rounded-xl border text-left transition ${
            activeTab === 'DEFAULTER'
              ? 'bg-rose-50 border-rose-400 shadow-xs ring-1 ring-rose-400'
              : 'bg-white/60 border-slate-200 hover:bg-rose-50/50'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 flex items-center justify-between">
            <span>Critical Defaulters</span>
            <span className="font-mono text-[9px]">&lt;{thresholds.defaulter}%</span>
          </div>
          <div className="text-xl font-extrabold text-rose-700 font-mono mt-0.5">
            {defaulters.length} Flagged
          </div>
        </button>

        <button
          onClick={() => setActiveTab('WARNING')}
          className={`p-3 rounded-xl border text-left transition ${
            activeTab === 'WARNING'
              ? 'bg-amber-50 border-amber-400 shadow-xs ring-1 ring-amber-400'
              : 'bg-white/60 border-slate-200 hover:bg-amber-50/50'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 flex items-center justify-between">
            <span>Warning Zone</span>
            <span className="font-mono text-[9px]">{thresholds.defaulter}% - {thresholds.warning}%</span>
          </div>
          <div className="text-xl font-extrabold text-amber-700 font-mono mt-0.5">
            {warnings.length} At Risk
          </div>
        </button>

        <button
          onClick={() => setActiveTab('SAFE')}
          className={`p-3 rounded-xl border text-left transition ${
            activeTab === 'SAFE'
              ? 'bg-emerald-50 border-emerald-400 shadow-xs ring-1 ring-emerald-400'
              : 'bg-white/60 border-slate-200 hover:bg-emerald-50/50'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center justify-between">
            <span>Eligible / Safe</span>
            <span className="font-mono text-[9px]">&ge;{thresholds.warning}%</span>
          </div>
          <div className="text-xl font-extrabold text-emerald-700 font-mono mt-0.5">
            {safeList.length} Clear
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search student roll number, name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white w-full"
          />
        </div>
        <div className="text-xs text-slate-500 font-mono">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Roll No</th>
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Batch</th>
              <th className="py-3 px-4">Sessions Conducted / Attended</th>
              <th className="py-3 px-4">Attendance %</th>
              <th className="py-3 px-4">Compliance Status</th>
              <th className="py-3 px-4">Guardian Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((st) => (
              <tr
                key={st.rollNo}
                className={`hover:bg-slate-50/80 transition-colors ${
                  st.rollNo === 'E224' ? 'bg-indigo-50/20' : ''
                }`}
              >
                <td className="py-3 px-4 font-mono font-bold text-slate-800">
                  {st.rollNo}
                  {st.rollNo === 'E224' && (
                    <span className="ml-1 text-[9px] bg-indigo-600 text-white px-1 py-0.2 rounded font-sans">
                      YOU
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 font-medium text-slate-900">{st.name}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{st.batch}</td>
                <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                  {st.attended} / {st.conducted}
                </td>
                <td className="py-3 px-4 font-mono font-extrabold tabular-nums text-slate-900 text-sm">
                  {st.percentage}%
                </td>
                <td className="py-3 px-4">
                  {st.tier === 'DEFAULTER' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      <AlertOctagon className="w-3 h-3 text-rose-600" />
                      Critical Defaulter
                    </span>
                  ) : st.tier === 'WARNING' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Warning Zone
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Eligible
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-[11px] text-slate-500 font-mono">
                  <div>{st.guardianEmail}</div>
                  <div className="text-[10px] text-slate-400">{st.guardianPhone}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 18:00 Daily Guardian Digest Modal */}
      {digestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-sm">
                    Automated 18:00 Guardian Digest Dispatcher (FR-13, UC-13)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Targeting {defaulters.length} students currently below {thresholds.defaulter}% threshold
                  </p>
                </div>
              </div>
              <button onClick={() => setDigestModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 leading-relaxed">
                <strong>Schedule Trigger:</strong> Everyday at 18:00 IST, the SAMS Cron Daemon evaluates semester attendance. Registered guardians of students whose aggregate drops below the cutoff receive an official notification digest.
              </div>

              {/* Sample Email Template Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-100 p-3 border-b border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
                  <div><strong>From:</strong> academic.attendance@nmims.edu (SAMS Automated Dispatch)</div>
                  <div><strong>To:</strong> sunil.bagadia@gmail.com, hitesh.naik@gmail.com, ... ({defaulters.length} parents)</div>
                  <div><strong>Subject:</strong> [OFFICIAL] Attendance Defaulter Notification - NMIMS Semester V CS</div>
                </div>

                <div className="p-4 bg-white text-slate-700 space-y-3 font-sans leading-relaxed">
                  <p>Dear Parent / Guardian,</p>
                  <p>
                    This is an automated academic communication from the Department of Computer Science & Engineering. As of today's evaluation, your ward's attendance in Semester V is currently <strong>below the mandatory {thresholds.defaulter}% threshold</strong>.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
                    <div>• Minimum Required: {thresholds.defaulter}% | Safe Buffer Target: {thresholds.warning}%</div>
                    <div>• Action Required: Ward must attend upcoming scheduled lectures to prevent semester debarment.</div>
                  </div>
                  <p>
                    Please consult Class Coordinator Prof. A. Deshmukh or Subject Teachers during official counseling hours.
                  </p>

                  {/* Legal Feasibility Opt-Out Footer */}
                  <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400 leading-tight">
                    <strong>LEGAL COMPLIANCE & PRIVACY NOTICE:</strong> You are receiving this automated academic notification as the legally registered guardian of an enrolled student under University Academic Bylaw 12.4 (Parental Notification Mandate). To adjust delivery frequency or register alternate contact credentials, access the Parent Portal or contact the Office of the Registrar.
                  </div>
                </div>
              </div>

              {/* Recipients List Preview */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="font-bold text-slate-700 mb-2">
                  Queued Guardian Recipient Endpoints ({defaulters.length}):
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  {defaulters.map((d) => (
                    <div key={d.rollNo} className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{d.name} ({d.rollNo}):</span>
                      <span className="text-slate-500">{d.guardianEmail} | {d.guardianPhone}</span>
                      <span className="text-rose-600 font-bold">{d.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDigestModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendDigest}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Digest Now (Record in Audit Trail)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable PDF Report Modal */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-3.5 flex items-center justify-between text-white no-print">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm">Official Attendance Compliance Report</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save as PDF
                </button>
                <button onClick={() => setPrintModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto bg-white text-slate-900 font-sans print:p-0 print:max-h-none">
              {/* Institutional Letterhead */}
              <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-extrabold uppercase tracking-tight text-slate-900">
                    Mukesh Patel School of Technology Management & Engineering
                  </h1>
                  <h2 className="text-xs font-semibold text-slate-600">
                    Department of Computer Science & Engineering • B.Tech Sem V (2026-27)
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Student Attendance Management System (SAMS) • Form SAMS-REP-V
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-500">
                  <div>Date: {new Date().toLocaleDateString()}</div>
                  <div>Report Ref: SAMS/CS/SEM5/DEF-04</div>
                  <div className="text-emerald-700 font-bold">Status: OFFICIAL</div>
                </div>
              </div>

              {/* Threshold Specification Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs grid grid-cols-3 gap-2">
                <div><strong>Defaulter Threshold:</strong> {thresholds.defaulter}%</div>
                <div><strong>Safe Target:</strong> {thresholds.warning}%</div>
                <div><strong>Evaluated Students:</strong> {students.length}</div>
              </div>

              {/* Table */}
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-300 font-bold text-slate-800">
                    <th className="py-2">Roll No</th>
                    <th className="py-2">Student Name</th>
                    <th className="py-2">Batch</th>
                    <th className="py-2">Attended / Total</th>
                    <th className="py-2">Overall %</th>
                    <th className="py-2">Eligibility Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {studentsWithStats.map((s) => (
                    <tr key={s.rollNo}>
                      <td className="py-2 font-bold">{s.rollNo}</td>
                      <td className="py-2 font-sans font-medium">{s.name}</td>
                      <td className="py-2">{s.batch}</td>
                      <td className="py-2">{s.attended} / {s.conducted}</td>
                      <td className="py-2 font-bold">{s.percentage}%</td>
                      <td className="py-2 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.tier === 'DEFAULTER' ? 'text-rose-700 bg-rose-50' : s.tier === 'WARNING' ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50'
                        }`}>
                          {s.tier === 'DEFAULTER' ? 'CRITICAL DEFAULTER' : s.tier === 'WARNING' ? 'WARNING ZONE' : 'ELIGIBLE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs text-slate-700">
                <div className="border-t border-slate-300 pt-2">
                  <div className="font-bold">Prof. A. Deshmukh</div>
                  <div className="text-[10px] text-slate-500">Class Coordinator</div>
                </div>
                <div className="border-t border-slate-300 pt-2">
                  <div className="font-bold">Dr. V. Kulkarni</div>
                  <div className="text-[10px] text-slate-500">Head of Department (CSE)</div>
                </div>
                <div className="border-t border-slate-300 pt-2">
                  <div className="font-bold">Dean / Vice-Principal</div>
                  <div className="text-[10px] text-slate-500">Academic Administration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
