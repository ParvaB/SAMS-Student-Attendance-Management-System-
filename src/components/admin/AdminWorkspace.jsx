import React from 'react';
import MasterDataManager from './MasterDataManager';
import AuditLogViewer from './AuditLogViewer';

export default function AdminWorkspace() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Master Data, Semester Timetable & CSV Roster Import */}
      <MasterDataManager />

      {/* Append-Only Immutable Audit Log with TC17 Tamper Simulator */}
      <AuditLogViewer />
    </div>
  );
}
