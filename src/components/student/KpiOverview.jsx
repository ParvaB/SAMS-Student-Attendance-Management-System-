import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { calculateCumulativeAttendance, getAttendanceStatusBadge } from '../../utils/shortfallMath';
import { 
  Percent, 
  CheckCircle, 
  AlertTriangle, 
  AlertOctagon, 
  Briefcase, 
  BookOpen, 
  Calendar,
  ShieldCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function KpiOverview() {
  const { subjects, sessionLogs, thresholds } = useAttendance();

  const { totalConducted, totalAttended, percentage, odCount } = calculateCumulativeAttendance(subjects, sessionLogs);
  const statusBadge = getAttendanceStatusBadge(percentage, thresholds.defaulter, thresholds.warning);

  const isCritical = percentage < thresholds.defaulter;
  const isWarning = percentage >= thresholds.defaulter && percentage < thresholds.warning;

  return (
    <div className="space-y-4">
      {/* Dynamic Threshold Alert Banner (FR-12) */}
      {isCritical && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 shadow-xs animate-in fade-in">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="font-bold text-rose-950 text-sm flex items-center gap-2">
              Critical Defaulter Alert: Cumulative Attendance Below {thresholds.defaulter}%
            </div>
            <p className="mt-1 text-rose-800 leading-relaxed">
              Your overall attendance is currently at <strong className="font-mono text-rose-950">{percentage}%</strong>, which is below the university mandate of <strong>{thresholds.defaulter}%</strong>. As per Academic Regulation 3.4, you are flagged on the Dean's Defaulter List and at risk of semester end-term exam debarment unless shortfall recovery is fulfilled.
            </p>
          </div>
        </div>
      )}

      {isWarning && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="font-bold text-amber-950 text-sm flex items-center gap-2">
              Cautionary Warning Zone: {percentage}% (Threshold: {thresholds.defaulter}% - {thresholds.warning}%)
            </div>
            <p className="mt-1 text-amber-800 leading-relaxed">
              Your attendance is in the warning bracket. Consecutive absences in upcoming sessions will drop your eligibility into the Critical Defaulter tier. Plan attendance recovery immediately.
            </p>
          </div>
        </div>
      )}

      {!isCritical && !isWarning && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-950">
                Examination Hall Ticket Eligible
              </span>
              <span className="text-emerald-700 ml-2">
                Overall attendance meets University Regulation standards ({percentage}% &ge; {thresholds.warning}% safe mark).
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] bg-white text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
            Status: CLEAR
          </span>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Cumulative Attendance */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overall Attendance</span>
            <span className={`w-2.5 h-2.5 rounded-full ${statusBadge.dotColor}`}></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
              {percentage}%
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge.className}`}>
              {statusBadge.label}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-mono">
            <span>{totalAttended} attended</span>
            <span>/</span>
            <span>{totalConducted} conducted</span>
          </div>
        </div>

        {/* Live Policy Mandate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Eligibility Policy</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
              {thresholds.defaulter}%
            </span>
            <span className="text-xs text-slate-400 font-medium">min cutoff</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <span>Safe Target: </span>
            <strong className="text-slate-700 font-mono font-semibold">{thresholds.warning}%</strong>
            <span className="text-[10px] text-indigo-600 font-medium">(Live HOD engine)</span>
          </div>
        </div>

        {/* Approved On-Duty (OD) Credits */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Approved OD Sessions</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono tracking-tight tabular-nums">
              {odCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">sessions</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Credited as <strong className="text-indigo-600">Present (OD)</strong> per FR-8
          </div>
        </div>

        {/* Total Academic Modules */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Registered Courses</span>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
              {subjects.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">subjects</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            4 Theory Lectures + 1 Practical Lab
          </div>
        </div>
      </div>
    </div>
  );
}
