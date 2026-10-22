import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

export default function DepartmentAnalytics() {
  const { subjects, students, thresholds } = useAttendance();

  // Subject performance stats
  const subjectStats = subjects.map((sub) => {
    const pct = sub.conducted > 0 ? +((sub.attended / sub.conducted) * 100).toFixed(1) : 100;
    return {
      ...sub,
      percentage: pct,
      adherenceRate: 96.5 // Timeliness adherence %
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Department-Wide Subject & Batch Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Macro metrics across curriculum modules, batch distributions, and faculty submission adherence
          </p>
        </div>

        <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full font-semibold">
          Department: Computer Science & Engineering
        </span>
      </div>

      <div className="p-5 space-y-6">
        {/* Subject-Wise Comparative Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            Subject Attendance Averages & Faculty Timeliness
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjectStats.map((sub) => (
              <div
                key={sub.code}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 text-slate-700">
                      {sub.code}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">{sub.name}</h4>
                    <span className="text-[11px] text-slate-500 block">{sub.faculty}</span>
                  </div>

                  <span
                    className={`font-mono text-base font-extrabold px-2 py-0.5 rounded-lg border ${
                      sub.percentage >= thresholds.warning
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : sub.percentage >= thresholds.defaulter
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      sub.percentage >= thresholds.warning
                        ? 'bg-emerald-500'
                        : sub.percentage >= thresholds.defaulter
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${sub.percentage}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                  <span>Conducted: {sub.conducted} sessions</span>
                  <span className="text-emerald-700 font-semibold">96% on-time &le;24h</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Batch Comparative Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Batch B1 Performance */}
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Lab Batch B1 (Roll E201 - E224)
                </h4>
              </div>
              <span className="font-mono text-xs font-bold text-indigo-700">
                83.4% Avg
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enrolled: 6 students (includes Parva Bagadia, Jay Naik, Diya Shah). Lab session attendance in CS305 currently at 91.7%. Zero student under academic debarment risk in practical components.
            </p>
          </div>

          {/* Batch B2 Performance */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                  Lab Batch B2 (Roll E230 - E264)
                </h4>
              </div>
              <span className="font-mono text-xs font-bold text-purple-700">
                79.1% Avg
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enrolled: 6 students (includes Tanvi Joshi, Aditya Kulkarni, Siddharth Rao). 2 students flagged in Compiler Design laboratory sessions. Remedial slot allocated on Friday 14:00.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
