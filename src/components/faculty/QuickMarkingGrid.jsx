import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  Send, 
  Ban, 
  Search, 
  Filter, 
  Wifi, 
  WifiOff, 
  Sparkles,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function QuickMarkingGrid() {
  const { 
    students, 
    subjects, 
    markAttendance, 
    isOffline, 
    toggleOffline, 
    offlineQueue 
  } = useAttendance();

  // Step 1: Session Parameters
  const [subjectCode, setSubjectCode] = useState('CS301');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slot, setSlot] = useState('09:00 - 10:00');
  const [sessionType, setSessionType] = useState('All Class Lecture');
  const [isCancelled, setIsCancelled] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  // Step 2: Student roster state (default all to PRESENT)
  const [studentStatuses, setStudentStatuses] = useState(() => {
    const initial = {};
    students.forEach((s) => {
      initial[s.rollNo] = 'PRESENT';
    });
    return initial;
  });

  const [batchFilter, setBatchFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Single-tap cycling: PRESENT -> ABSENT -> LATE -> PRESENT
  const cycleStatus = (rollNo) => {
    setStudentStatuses((prev) => {
      const current = prev[rollNo] || 'PRESENT';
      let next = 'PRESENT';
      if (current === 'PRESENT') next = 'ABSENT';
      else if (current === 'ABSENT') next = 'LATE';
      else if (current === 'LATE') next = 'PRESENT';
      return { ...prev, [rollNo]: next };
    });
  };

  // Bulk actions
  const markAll = (status) => {
    setStudentStatuses((prev) => {
      const updated = { ...prev };
      students.forEach((s) => {
        if (batchFilter === 'ALL' || s.batch === batchFilter) {
          updated[s.rollNo] = status;
        }
      });
      return updated;
    });
  };

  // Step 3: Atomic Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    markAttendance({
      subjectCode,
      date,
      slot,
      sessionType,
      studentStatuses,
      isCancelled,
      cancellationReason
    });
  };

  // Filter roster by batch and search
  const visibleStudents = students.filter((s) => {
    if (batchFilter !== 'ALL' && s.batch !== batchFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!s.name.toLowerCase().includes(term) && !s.rollNo.toLowerCase().includes(term)) {
        return false;
      }
    }
    return true;
  });

  // Calculate live roster counts
  const presentCount = visibleStudents.filter((s) => (studentStatuses[s.rollNo] || 'PRESENT') === 'PRESENT').length;
  const absentCount = visibleStudents.filter((s) => studentStatuses[s.rollNo] === 'ABSENT').length;
  const lateCount = visibleStudents.filter((s) => studentStatuses[s.rollNo] === 'LATE').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              3-Tap Attendance Marking Workspace (FR-5, FR-6)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ultra-fast roster marking with idempotent guard (TC06) & offline drop sync (TC05)
          </p>
        </div>

        {/* Offline simulator status pill */}
        <button
          onClick={toggleOffline}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
            isOffline
              ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-400/20'
              : 'bg-emerald-50 text-emerald-700 border-emerald-300'
          }`}
          title="Toggle Network Offline Simulator (TC05)"
        >
          {isOffline ? (
            <>
              <WifiOff className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Offline Simulator Active (TC05)</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 text-emerald-600" />
              <span>Online Mode (Live Socket)</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        {/* Step 1: Configuration Bar */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Step 1: Session Metadata & Slot
            </span>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={isCancelled}
                onChange={(e) => setIsCancelled(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
              />
              <span className={isCancelled ? 'text-rose-700 font-bold' : ''}>
                Mark Session as CANCELLED (FR-4)
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Subject</label>
              <select
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-medium"
              >
                {subjects.map((sub) => (
                  <option key={sub.code} value={sub.code}>
                    {sub.code}: {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Time Slot</label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-mono"
              >
                <option value="09:00 - 10:00">09:00 - 10:00 AM</option>
                <option value="10:00 - 11:00">10:00 - 11:00 AM</option>
                <option value="11:15 - 12:15">11:15 - 12:15 PM</option>
                <option value="11:15 - 01:15">11:15 - 01:15 PM (Lab)</option>
                <option value="02:00 - 04:00">02:00 - 04:00 PM (Lab)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Session Type</label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-medium"
              >
                <option value="All Class Lecture">All Class Lecture</option>
                <option value="Lab Batch B1">Lab Batch B1</option>
                <option value="Lab Batch B2">Lab Batch B2</option>
                <option value="Tutorial">Tutorial</option>
              </select>
            </div>
          </div>

          {isCancelled && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg animate-in fade-in">
              <label className="block text-xs font-semibold text-rose-800 mb-1">
                Official Cancellation Justification (FR-4)
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Department Tech Symposium / National Holiday / Faculty Emergency"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-rose-300 bg-white text-rose-950 focus:ring-rose-500"
              />
              <p className="text-[10px] text-rose-600 mt-1">
                Notice: Cancelled sessions are automatically excluded from both numerator & denominator for attendance % (FR-9).
              </p>
            </div>
          )}
        </div>

        {/* Step 2: Interactive Class Roster */}
        {!isCancelled && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Step 2: Tap to Cycle Status
                </span>
                <span className="text-[11px] text-slate-400">
                  (Single tap toggles <strong className="text-emerald-700">Present</strong> &rarr;{' '}
                  <strong className="text-rose-700">Absent</strong> &rarr;{' '}
                  <strong className="text-amber-700">Late</strong>)
                </span>
              </div>

              {/* Quick Roster Counts */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  {presentCount} Present
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                  {absentCount} Absent
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                  {lateCount} Late
                </span>
              </div>
            </div>

            {/* Filter and Bulk Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search roll no, name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>

                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setBatchFilter('ALL')}
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      batchFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    All Batches
                  </button>
                  <button
                    type="button"
                    onClick={() => setBatchFilter('B1')}
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      batchFilter === 'B1' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    Batch B1
                  </button>
                  <button
                    type="button"
                    onClick={() => setBatchFilter('B2')}
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      batchFilter === 'B2' ? 'bg-purple-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    Batch B2
                  </button>
                </div>
              </div>

              {/* Bulk Mark buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => markAll('PRESENT')}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200"
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  onClick={() => markAll('ABSENT')}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-semibold border border-rose-200"
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            {/* Student Roster Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {visibleStudents.map((student) => {
                const status = studentStatuses[student.rollNo] || 'PRESENT';

                let bgClass = 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100/80';
                let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;

                if (status === 'ABSENT') {
                  bgClass = 'bg-rose-50 border-rose-300 text-rose-950 hover:bg-rose-100/80';
                  icon = <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
                } else if (status === 'LATE') {
                  bgClass = 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100/80';
                  icon = <Clock className="w-4 h-4 text-amber-600 shrink-0" />;
                }

                return (
                  <button
                    type="button"
                    key={student.rollNo}
                    onClick={() => cycleStatus(student.rollNo)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between gap-2 transition select-none shadow-2xs ${bgClass} ${
                      student.rollNo === 'E224' ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold">{student.rollNo}</span>
                        <span className="text-[10px] font-mono px-1 py-0.2 bg-white/60 rounded border border-black/5">
                          {student.batch}
                        </span>
                        {student.rollNo === 'E224' && (
                          <span className="text-[9px] font-bold uppercase bg-indigo-600 text-white px-1 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-800 truncate max-w-[130px]">
                        {student.name}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {icon}
                      <span className="font-mono text-[11px] font-extrabold">{status}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Submission Action & Guarantees */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500 space-y-0.5">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              NFR-5 Compliance & TC06 Idempotency Guard
            </div>
            <p className="text-[11px]">
              Submissions are atomic (&lt;1s latency) and duplicate-guarded. Offline entries queue safely without loss.
            </p>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
          >
            <Send className="w-4 h-4" />
            <span>Submit Session Attendance</span>
          </button>
        </div>
      </form>
    </div>
  );
}
