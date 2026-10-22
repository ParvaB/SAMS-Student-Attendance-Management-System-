import React from 'react';
import QuickMarkingGrid from './QuickMarkingGrid';
import CorrectionWindowSimulator from './CorrectionWindowSimulator';

export default function FacultyWorkspace() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 3-Tap Quick Marking & Offline Drop Simulator */}
      <QuickMarkingGrid />

      {/* 48-Hour Correction Window & BVA Simulator */}
      <CorrectionWindowSimulator />
    </div>
  );
}
