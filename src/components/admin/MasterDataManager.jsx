import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  Database, 
  Plus, 
  Calendar, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  BookOpen, 
  Users,
  Clock,
  Layers
} from 'lucide-react';

export default function MasterDataManager() {
  const { subjects, timetable, addSubject, addToast } = useAttendance();

  // Add subject modal state
  const [addSubjectModalOpen, setAddSubjectModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newFaculty, setNewFaculty] = useState('Prof. S. Gupta');
  const [newCredits, setNewCredits] = useState(4);
  const [newType, setNewType] = useState('THEORY');
  const [newRoom, setNewRoom] = useState('CR-406');

  // CSV Bulk Import Simulator State
  const [importReport, setImportReport] = useState(null);
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);

  const handleAddSubjectSubmit = (e) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    addSubject({
      code: newCode.toUpperCase(),
      name: newName,
      faculty: newFaculty,
      credits: Number(newCredits),
      type: newType,
      plannedSessions: 32,
      conducted: 0,
      attended: 0,
      room: newRoom
    });

    setAddSubjectModalOpen(false);
    setNewCode('');
    setNewName('');
  };

  // Simulate CSV bulk import with row-level validation (UC-16)
  const handleSimulateCsvImport = () => {
    setIsProcessingCsv(true);
    setTimeout(() => {
      setIsProcessingCsv(false);
      setImportReport({
        fileName: 'Batch_Sem5_CS_Enrollment_Roster_v2.csv',
        totalRows: 12,
        validRows: 10,
        errors: [
          { row: 4, rollNo: 'E999_INV', reason: 'Invalid Roll Number format pattern [E[0-9]{3}]' },
          { row: 9, rollNo: 'E241', reason: 'Duplicate email registration conflict: jay.naik@nmims.edu' }
        ]
      });
      addToast('CSV Import processed: 10 valid records staged, 2 validation conflicts flagged', 'info', 4000);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Master Curriculum, Timetable & CSV Roster Import (FR-3, FR-4, UC-16)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            System administration master records, laboratory batch allocation & automated CSV parser
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddSubjectModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Subject</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Active Curriculum Modules Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              Active Course Master Registry
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Total: {subjects.length} Subjects Registered
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Credits</th>
                  <th className="py-2.5 px-3">Assigned Faculty</th>
                  <th className="py-2.5 px-3">Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((sub) => (
                  <tr key={sub.code} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {sub.code}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{sub.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {sub.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">{sub.credits}</td>
                    <td className="py-2.5 px-3 text-slate-700">{sub.faculty}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{sub.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly Timetable Schedule Matrix */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            Semester V Weekly Timetable Allocation Schedule
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
              const daySlots = timetable.filter((t) => t.day === day);
              return (
                <div key={day} className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                  <div className="font-bold text-xs text-slate-900 border-b border-slate-200 pb-1">
                    {day}
                  </div>
                  <div className="space-y-1.5">
                    {daySlots.map((slot, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] shadow-2xs space-y-0.5"
                      >
                        <div className="font-mono text-[10px] font-semibold text-slate-400">
                          {slot.slot}
                        </div>
                        <div className="font-bold text-slate-800 flex items-center justify-between">
                          <span>{slot.code}</span>
                          <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1 rounded">
                            {slot.type}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">{slot.room}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CSV Bulk Student Import Section */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                CSV Bulk Student Enrollment Parser (UC-16)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Stage semester rosters with automated column schema & duplicate validation checks
              </p>
            </div>

            <button
              onClick={handleSimulateCsvImport}
              disabled={isProcessingCsv}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition disabled:opacity-50 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isProcessingCsv ? 'Parsing...' : 'Simulate CSV File Import'}</span>
            </button>
          </div>

          {/* Validation Report Card */}
          {importReport && (
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  File: {importReport.fileName}
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {importReport.validRows} Valid Rows Staged
                </span>
              </div>

              {importReport.errors.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-rose-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Row-Level Validation Exceptions ({importReport.errors.length}):
                  </div>
                  <div className="space-y-1">
                    {importReport.errors.map((err, i) => (
                      <div
                        key={i}
                        className="p-2 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-900 font-mono flex items-center justify-between"
                      >
                        <span>Line #{err.row} [Roll: {err.rollNo}]:</span>
                        <span>{err.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Subject Modal */}
      {addSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
              <h3 className="font-bold text-sm">Register New Curriculum Subject</h3>
              <button
                onClick={() => setAddSubjectModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubjectSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., CS306"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cloud Computing & DevOps"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  >
                    <option value="THEORY">Theory</option>
                    <option value="LAB">Lab Practical</option>
                    <option value="TUTORIAL">Tutorial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newCredits}
                    onChange={(e) => setNewCredits(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Faculty</label>
                  <input
                    type="text"
                    value={newFaculty}
                    onChange={(e) => setNewFaculty(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Classroom / Lab</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddSubjectModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
