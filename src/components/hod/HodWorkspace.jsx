import React from 'react';
import PostCorrectionQueue from './PostCorrectionQueue';
import ThresholdConfigEngine from './ThresholdConfigEngine';
import DepartmentAnalytics from './DepartmentAnalytics';

export default function HodWorkspace() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Live Policy Threshold Configuration Engine (FR-11, UC-11, TC20) */}
      <ThresholdConfigEngine />

      {/* Post-48h Faculty Correction Escalations (FR-7, UC-10) */}
      <PostCorrectionQueue />

      {/* Department-Wide Comparative Subject & Batch Analytics */}
      <DepartmentAnalytics />
    </div>
  );
}
