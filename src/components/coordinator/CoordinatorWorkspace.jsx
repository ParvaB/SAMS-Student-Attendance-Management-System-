import React from 'react';
import LeaveApprovalQueue from './LeaveApprovalQueue';
import DefaulterList from './DefaulterList';

export default function CoordinatorWorkspace() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Leave & On-Duty Approval Queue with Document Preview & OD Credit */}
      <LeaveApprovalQueue />

      {/* Real-time Defaulter Surveillance, 18:00 Digest & Export */}
      <DefaulterList />
    </div>
  );
}
