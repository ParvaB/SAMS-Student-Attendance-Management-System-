import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { calculateShortfallRecovery, getAttendanceStatusBadge } from '../../utils/shortfallMath';
import { 
  Sparkles, 
  RotateCcw, 
  Plus, 
  Minus, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Calculator,
  User,
  GraduationCap
} from 'lucide-react';

export default function SubjectAttendanceList() {
  const { subjects, thresholds } = useAttendance();

  // Local state for What-If simulator offsets per subject code: { [code]: { attendDelta: 0, missDelta: 0 } }
  const [simulations, setSimulations] = useState({});

  const handleSimulate = (code, type) => {
    setSimulations((prev) => {
      const current = prev[code] || { attendDelta: 0, missDelta: 0 };
      if (type === 'ATTEND') {
        return {
          ...prev,
          [code]: { ...current, attendDelta: current.attendDelta + 1 }
        };
      } else if (type === 'MISS') {
        return {
          ...prev,
          [code]: { ...current, missDelta: current.missDelta + 1 }
        };
      }
      return prev;
    });
  };

  const handleResetSubjectSim = (code) => {
    setSimulations((prev) => {
      const copy = { ...prev };
      delete copy[code];
      return copy;
    });
  };

  const handleResetAllSims = () => {
    setSimulations({});
  };

  const hasAnySimulation = Object.keys(simulations).length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Subject-Wise Attendance & Shortfall Recovery Engine
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time shortfall recovery math (FR-10) with interactive What-If scenario projection
          </p>
        </div>

        {hasAnySimulation && (
          <button
            onClick={handleResetAllSims}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All What-If Scenarios
          </button>
        )}
      </div>

      {/* List of Subjects */}
      <div className="divide-y divide-slate-200">
        {subjects.map((subject) => {
          const sim = simulations[subject.code] || { attendDelta: 0, missDelta: 0 };
          const isSimulated = sim.attendDelta > 0 || sim.missDelta > 0;

          // Actual values
          const actualRecovery = calculateShortfallRecovery(subject.attended, subject.conducted, thresholds.defaulter);
          const actualBadge = getAttendanceStatusBadge(actualRecovery.percentage, thresholds.defaulter, thresholds.warning);

          // Simulated values
          const simAttended = subject.attended + sim.attendDelta;
          const simConducted = subject.conducted + sim.attendDelta + sim.missDelta;
          const simRecovery = calculateShortfallRecovery(simAttended, simConducted, thresholds.defaulter);
          const simBadge = getAttendanceStatusBadge(simRecovery.percentage, thresholds.defaulter, thresholds.warning);

          return (
            <div
              key={subject.code}
              className={`p-5 transition-colors ${
                isSimulated ? 'bg-indigo-50/30' : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Subject Details */}
                <div className="space-y-1.5 min-w-[280px]">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200">
                      {subject.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{subject.name}</h3>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {subject.type}
                    </span>
                    {subject.batch && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        {subject.batch}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {subject.faculty}
                    </span>
                    <span>•</span>
                    <span>Credits: {subject.credits}</span>
                    <span>•</span>
                    <span>Room: {subject.room}</span>
                  </div>
                </div>

                {/* Attendance Stats & Progress Bar */}
                <div className="flex-1 max-w-md space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold tabular-nums text-slate-900">
                        {isSimulated ? simRecovery.percentage : actualRecovery.percentage}%
                      </span>
                      {isSimulated && (
                        <span className="text-[11px] font-mono text-slate-400 line-through">
                          {actualRecovery.percentage}%
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isSimulated ? simBadge.className : actualBadge.className
                        }`}
                      >
                        {isSimulated ? simBadge.label : actualBadge.label}
                      </span>
                    </div>

                    <div className="font-mono text-xs text-slate-500 tabular-nums">
                      {isSimulated ? (
                        <>
                          <span className="font-bold text-indigo-700">{simAttended}</span> /{' '}
                          <span className="font-bold text-indigo-700">{simConducted}</span>
                          <span className="text-[10px] text-slate-400 ml-1">
                            (was {subject.attended}/{subject.conducted})
                          </span>
                        </>
                      ) : (
                        `${subject.attended} / ${subject.conducted} sessions`
                      )}
                    </div>
                  </div>

                  {/* Visual Progress Bar with Threshold Markers */}
                  <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        (isSimulated ? simRecovery.percentage : actualRecovery.percentage) >= thresholds.warning
                          ? 'bg-emerald-500'
                          : (isSimulated ? simRecovery.percentage : actualRecovery.percentage) >= thresholds.defaulter
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          isSimulated ? simRecovery.percentage : actualRecovery.percentage
                        )}%`
                      }}
                    ></div>
                    {/* Defaulter Threshold Pin at 75% */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-400/80"
                      style={{ left: `${thresholds.defaulter}%` }}
                      title={`Defaulter Threshold: ${thresholds.defaulter}%`}
                    ></div>
                  </div>

                  {/* Mathematical Recovery / Buffer Indicator (FR-10) */}
                  <div className="text-[11px] leading-relaxed">
                    {(isSimulated ? simRecovery : actualRecovery).isDefaulter ? (
                      <span className="inline-flex items-center gap-1.5 font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <strong>Shortfall Recovery:</strong>{' '}
                        {(isSimulated ? simRecovery : actualRecovery).formattedText}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {(isSimulated ? simRecovery : actualRecovery).formattedText}
                      </span>
                    )}
                  </div>
                </div>

                {/* What-If Interactive Controls */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    What-If Projection
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button
                      onClick={() => handleSimulate(subject.code, 'ATTEND')}
                      className="px-2 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 transition shadow-2xs border border-slate-200"
                      title="Simulate attending 1 additional lecture"
                    >
                      <Plus className="w-3 h-3 text-emerald-600" />
                      Attend
                      {sim.attendDelta > 0 && (
                        <span className="ml-0.5 font-mono text-[10px] text-emerald-700 font-bold">
                          +{sim.attendDelta}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleSimulate(subject.code, 'MISS')}
                      className="px-2 py-1 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 transition shadow-2xs border border-slate-200"
                      title="Simulate missing 1 additional lecture"
                    >
                      <Minus className="w-3 h-3 text-rose-600" />
                      Miss
                      {sim.missDelta > 0 && (
                        <span className="ml-0.5 font-mono text-[10px] text-rose-700 font-bold">
                          +{sim.missDelta}
                        </span>
                      )}
                    </button>

                    {isSimulated && (
                      <button
                        onClick={() => handleResetSubjectSim(subject.code)}
                        className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded transition"
                        title="Reset simulation for this subject"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
