import React from 'react';
import KpiOverview from './KpiOverview';
import SubjectAttendanceList from './SubjectAttendanceList';
import SessionHistoryTable from './SessionHistoryTable';
import LeaveApplicationModal from './LeaveApplicationModal';

export default function StudentDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* KPI Overview Strip & Active Policy Banner */}
      <KpiOverview />

      {/* Subject-Wise Attendance & Shortfall Recovery Calculator with What-If */}
      <SubjectAttendanceList />

      {/* Online Leave & OD Application Workflow */}
      <LeaveApplicationModal />

      {/* Granular Session-Level History Ledger */}
      <SessionHistoryTable />
    </div>
  );
}
