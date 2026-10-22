import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_TIMETABLE,
  INITIAL_SESSION_LOGS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_POST_CORRECTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_USER_ROLES
} from '../data/initialState';

const AttendanceContext = createContext(null);

export function AttendanceProvider({ children }) {
  // Current active role
  const [currentRole, setCurrentRole] = useState('STUDENT');
  
  // Core state
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [timetable, setTimetable] = useState(INITIAL_TIMETABLE);
  const [sessionLogs, setSessionLogs] = useState(INITIAL_SESSION_LOGS);
  const [leaveRequests, setLeaveRequests] = useState(INITIAL_LEAVE_REQUESTS);
  const [postCorrections, setPostCorrections] = useState(INITIAL_POST_CORRECTIONS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Live Policy Thresholds (Configurable by HOD)
  const [thresholds, setThresholds] = useState({
    defaulter: 75.0,
    warning: 80.0
  });

  // Offline network drop simulation (TC05)
  const [isOffline, setIsOffline] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState([]);

  // Modals & UI states
  const [forbiddenModalOpen, setForbiddenModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [tamperViolationModalOpen, setTamperViolationModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast notification system
  const addToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to append to immutable audit log with cryptographic chaining simulation
  const appendAuditLog = (action, details, role = currentRole, customUser = null) => {
    const lastLog = auditLogs[0] || { hash: '0000000000000000000000000000000000000000000000000000000000000000' };
    const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const hash = `${randomHex}${Date.now().toString(16)}8f4b2c1e`.padEnd(64, '0');
    
    const userObj = customUser || INITIAL_USER_ROLES[role];

    const newEntry = {
      logId: `LOG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      userId: userObj.id,
      userName: userObj.name,
      role: role,
      ipAddress: role === 'ADMIN' ? '127.0.0.1' : (role === 'STUDENT' ? '10.20.14.88' : '192.168.10.45'),
      action,
      details,
      hash,
      prevHash: lastLog.hash
    };

    setAuditLogs((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  // Switch Role
  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    const user = INITIAL_USER_ROLES[newRole];
    appendAuditLog('ROLE_SWITCH', `Switched active session view to ${user.roleTitle} (${user.name})`, newRole);
    addToast(`Switched view to ${user.name} (${user.roleTitle})`, 'info', 2500);
  };

  // TC03: Student attempts unauthorized write API
  const triggerUnauthorizedWrite = () => {
    appendAuditLog(
      'UNAUTHORIZED_ACCESS_BLOCKED',
      'HTTP 403 FORBIDDEN: Student attempted unauthorized attendance mutation on /api/v1/attendance/mark',
      'STUDENT'
    );
    setForbiddenModalOpen(true);
  };

  // TC17: Admin attempts to alter/delete audit log
  const triggerTamperAttempt = () => {
    appendAuditLog(
      'IMMUTABLE_LOG_VIOLATION_TRIGGERED',
      'SECURITY CRITICAL: Unauthorized deletion/alteration query intercepted on immutable audit table. WORM policy enforced.',
      'ADMIN'
    );
    setTamperViolationModalOpen(true);
  };

  // Faculty: Mark Attendance (FR-5, FR-6, TC05, TC06)
  const markAttendance = (submission) => {
    const { subjectCode, date, slot, sessionType, studentStatuses, isCancelled, cancellationReason } = submission;

    // TC06 Idempotency Check: Guard against duplicate submission for same subject, date, slot
    const isDuplicate = sessionLogs.some(
      (s) => s.subjectCode === subjectCode && s.date === date && s.slot === slot && !s.isPendingSync
    );

    if (isDuplicate) {
      addToast(`Conflict: Attendance for ${subjectCode} on ${date} (${slot}) has already been recorded! (TC06 Idempotent Guard)`, 'error', 4500);
      return { success: false, duplicate: true };
    }

    // TC05 Offline Network Drop Simulator
    if (isOffline) {
      const offlineEntry = {
        ...submission,
        id: `OFFLINE-${Date.now()}`,
        queuedAt: new Date().toISOString()
      };
      setOfflineQueue((prev) => [...prev, offlineEntry]);
      addToast(`Offline Mode (TC05): Submission queued locally (${offlineQueue.length + 1} pending). Zero partial writes.`, 'warning', 4000);
      return { success: true, offline: true };
    }

    // Process submission atomically
    const newSessionId = `SESS-${Math.floor(2000 + Math.random() * 8000)}`;
    const studentStatus = studentStatuses['E224'] || 'PRESENT';

    // If cancelled, it is marked cancelled (excluded from calculations per FR-9)
    const finalStatus = isCancelled ? 'CANCELLED' : studentStatus;

    const newSession = {
      id: newSessionId,
      date,
      subjectCode,
      subjectName: subjects.find((s) => s.code === subjectCode)?.name || subjectCode,
      type: sessionType.toUpperCase(),
      slot,
      faculty: INITIAL_USER_ROLES.FACULTY.name,
      status: finalStatus,
      markedAt: new Date().toISOString(),
      hoursElapsed: 0,
      remarks: isCancelled ? `Cancelled: ${cancellationReason || 'Faculty Emergency'}` : `Regular Session Attendance recorded by Faculty`
    };

    setSessionLogs((prev) => [newSession, ...prev]);

    // Update subject counters if not cancelled
    if (!isCancelled) {
      setSubjects((prev) =>
        prev.map((sub) => {
          if (sub.code === subjectCode) {
            const isAttended = finalStatus === 'PRESENT' || finalStatus === 'ON-DUTY' || finalStatus === 'LATE';
            return {
              ...sub,
              conducted: sub.conducted + 1,
              attended: isAttended ? sub.attended + 1 : sub.attended
            };
          }
          return sub;
        })
      );
    }

    appendAuditLog(
      'ATTENDANCE_RECORDED',
      `Marked attendance for ${subjectCode} (${sessionType}) on ${date} [${finalStatus}] - Atomic write committed`,
      'FACULTY'
    );

    addToast(`Attendance submitted successfully for ${subjectCode} (${isCancelled ? 'CANCELLED' : 'Marked'})`, 'success');
    return { success: true };
  };

  // Sync offline queue when back online (TC05)
  const syncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    const count = offlineQueue.length;
    offlineQueue.forEach((submission) => {
      // Process each
      const newSessionId = `SESS-SYNC-${Math.floor(2000 + Math.random() * 8000)}`;
      const studentStatus = submission.studentStatuses['E224'] || 'PRESENT';
      const finalStatus = submission.isCancelled ? 'CANCELLED' : studentStatus;

      const newSession = {
        id: newSessionId,
        date: submission.date,
        subjectCode: submission.subjectCode,
        subjectName: subjects.find((s) => s.code === submission.subjectCode)?.name || submission.subjectCode,
        type: submission.sessionType.toUpperCase(),
        slot: submission.slot,
        faculty: INITIAL_USER_ROLES.FACULTY.name,
        status: finalStatus,
        markedAt: new Date().toISOString(),
        hoursElapsed: 0,
        remarks: `Flushed from offline sync queue after network restored`
      };

      setSessionLogs((prev) => [newSession, ...prev]);

      if (!submission.isCancelled) {
        setSubjects((prev) =>
          prev.map((sub) => {
            if (sub.code === submission.subjectCode) {
              const isAttended = finalStatus === 'PRESENT' || finalStatus === 'ON-DUTY' || finalStatus === 'LATE';
              return {
                ...sub,
                conducted: sub.conducted + 1,
                attended: isAttended ? sub.attended + 1 : sub.attended
              };
            }
            return sub;
          })
        );
      }
    });

    appendAuditLog(
      'OFFLINE_QUEUE_SYNCED',
      `Network restored: Atomic batch flush of ${count} queued attendance records completed successfully`,
      'FACULTY'
    );

    setOfflineQueue([]);
    addToast(`Online sync complete: ${count} offline attendance records committed to ledger!`, 'success', 4500);
  };

  // Handle toggling offline mode
  const toggleOffline = () => {
    if (isOffline) {
      setIsOffline(false);
      syncOfflineQueue();
    } else {
      setIsOffline(true);
      addToast('Offline Network Drop Simulator Active (TC05): No internet connection. Submissions will be queued safely.', 'warning', 4500);
    }
  };

  // Faculty direct edit within <=48h (FR-7, BVA B1, B2, B3)
  const directUpdateSession = (sessionId, newStatus, reason) => {
    const session = sessionLogs.find((s) => s.id === sessionId);
    if (!session) return;

    if (session.hoursElapsed > 48) {
      addToast('Policy Error: Correction window expired (>48 hours). Must raise request to HOD.', 'error');
      return;
    }

    const oldStatus = session.status;
    const wasAttended = oldStatus === 'PRESENT' || oldStatus === 'ON-DUTY' || oldStatus === 'LATE';
    const isNowAttended = newStatus === 'PRESENT' || newStatus === 'ON-DUTY' || newStatus === 'LATE';

    // Update session
    setSessionLogs((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: newStatus, remarks: `Direct edit: ${reason}` } : s))
    );

    // Update subject counters if attended state changed
    if (wasAttended !== isNowAttended) {
      setSubjects((prev) =>
        prev.map((sub) => {
          if (sub.code === session.subjectCode) {
            return {
              ...sub,
              attended: isNowAttended ? sub.attended + 1 : Math.max(0, sub.attended - 1)
            };
          }
          return sub;
        })
      );
    }

    appendAuditLog(
      'ATTENDANCE_CORRECTION_DIRECT',
      `Faculty updated session ${sessionId} (${session.subjectCode}) for Parva Bagadia from ${oldStatus} -> ${newStatus}. Reason: ${reason} (Within 48h window)`,
      'FACULTY'
    );

    addToast(`Session updated directly to ${newStatus} (Within 48-hour window)`, 'success');
  };

  // Faculty post-48h correction escalation to HOD (FR-7, BVA B4)
  const escalateCorrectionToHod = (correctionData) => {
    const newCorr = {
      id: `CORR-2026-${Math.floor(100 + Math.random() * 900)}`,
      sessionId: correctionData.sessionId,
      subjectCode: correctionData.subjectCode,
      subjectName: subjects.find((s) => s.code === correctionData.subjectCode)?.name || correctionData.subjectCode,
      studentRollNo: correctionData.studentRollNo || 'E224',
      studentName: correctionData.studentName || 'Parva Bagadia',
      sessionDate: correctionData.sessionDate,
      hoursElapsed: correctionData.hoursElapsed,
      currentStatus: correctionData.currentStatus,
      requestedStatus: correctionData.requestedStatus,
      facultyName: INITIAL_USER_ROLES.FACULTY.name,
      reason: correctionData.reason,
      status: 'PENDING_HOD',
      submittedAt: new Date().toISOString()
    };

    setPostCorrections((prev) => [newCorr, ...prev]);

    appendAuditLog(
      'POST_48H_CORRECTION_ESCALATED',
      `Raised correction request ${newCorr.id} for ${newCorr.studentName} (${newCorr.studentRollNo}) in ${newCorr.subjectCode}. Hours elapsed: ${newCorr.hoursElapsed}h`,
      'FACULTY'
    );

    addToast(`Post-48h correction request sent to HOD queue (${newCorr.id})`, 'info', 4000);
  };

  // Student applies for leave or OD (FR-8, TC12, TC13)
  const submitLeaveRequest = (formData) => {
    const { type, reason, startDate, endDate, file } = formData;

    // TC12: Enforce file size <= 5MB
    if (file && file.size > 5 * 1024 * 1024) {
      addToast('Validation Error (TC12): Supporting document exceeds maximum 5MB threshold. Upload blocked.', 'error', 5000);
      return { success: false, error: 'FILE_TOO_LARGE' };
    }

    // TC13: Block overlapping date ranges with active requests
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (start > end) {
      addToast('Validation Error: Start Date cannot be later than End Date.', 'error');
      return { success: false, error: 'INVALID_DATES' };
    }

    const hasOverlap = leaveRequests.some((lr) => {
      if (lr.studentRollNo !== 'E224') return false;
      if (lr.status === 'REJECTED' || lr.status === 'WITHDRAWN') return false;
      const existingStart = new Date(lr.startDate).getTime();
      const existingEnd = new Date(lr.endDate).getTime();
      return (start <= existingEnd && end >= existingStart);
    });

    if (hasOverlap) {
      addToast('Validation Error (TC13): An overlapping Leave or OD request already exists for these dates!', 'error', 5500);
      return { success: false, error: 'DATE_OVERLAP' };
    }

    const daysCount = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);

    const newRequest = {
      id: `LV-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentRollNo: 'E224',
      studentName: 'Parva Bagadia',
      batch: 'B1',
      type,
      reason,
      startDate,
      endDate,
      daysCount,
      documentName: file ? file.name : 'Supporting_Proof.pdf',
      documentSize: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '1.4 MB',
      status: 'SUBMITTED',
      appliedAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null,
      reviewNotes: null
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);

    appendAuditLog(
      'LEAVE_APPLICATION_SUBMITTED',
      `Submitted ${type} application ${newRequest.id} (${startDate} to ${endDate}, ${daysCount} days)`,
      'STUDENT'
    );

    addToast(`Leave request ${newRequest.id} submitted for Class Coordinator approval`, 'success');
    return { success: true };
  };

  // Student withdraws pending leave
  const withdrawLeaveRequest = (id) => {
    setLeaveRequests((prev) =>
      prev.map((lr) => (lr.id === id ? { ...lr, status: 'WITHDRAWN' } : lr))
    );

    appendAuditLog('LEAVE_WITHDRAWN', `Student withdrew pending leave application ${id}`, 'STUDENT');
    addToast(`Request ${id} withdrawn`, 'info');
  };

  // Class Coordinator: Approve Leave / OD Request (FR-8, UC-09, TC14)
  const approveLeaveRequest = (id, reviewNotes) => {
    const req = leaveRequests.find((r) => r.id === id);
    if (!req) return;

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'APPROVED',
              reviewedBy: INITIAL_USER_ROLES.COORDINATOR.name,
              reviewedAt: new Date().toISOString(),
              reviewNotes: reviewNotes || 'Approved by Class Coordinator after verification.'
            }
          : r
      )
    );

    // If ON_DUTY, credit attendance records with OD flag (FR-8)
    if (req.type === 'ON_DUTY') {
      // Add an OD session log
      const odSession = {
        id: `SESS-OD-${Math.floor(2000 + Math.random() * 8000)}`,
        date: req.startDate,
        subjectCode: 'CS301', // General subject allocation or representative
        subjectName: 'Software Engineering (OD Credit)',
        type: 'LECTURE',
        slot: '09:00 - 10:00',
        faculty: 'Prof. A. Deshmukh (Approved)',
        status: 'ON-DUTY',
        markedAt: new Date().toISOString(),
        hoursElapsed: 0,
        remarks: `Approved On-Duty Exemption (${req.id}): ${req.reason}`
      };

      setSessionLogs((prev) => [odSession, ...prev]);

      // Credit attended count in CS301
      setSubjects((prev) =>
        prev.map((s) => {
          if (s.code === 'CS301') {
            return {
              ...s,
              conducted: s.conducted + 1,
              attended: s.attended + 1
            };
          }
          return s;
        })
      );
    }

    appendAuditLog(
      'LEAVE_APPLICATION_APPROVED',
      `Coordinator approved ${req.type} request ${id} for ${req.studentName} (${req.studentRollNo}). Credit applied.`,
      'COORDINATOR'
    );

    addToast(`Approved request ${id}. ${req.type === 'ON_DUTY' ? 'OD Attendance credit applied!' : ''}`, 'success');
  };

  // Class Coordinator: Reject Leave
  const rejectLeaveRequest = (id, reviewNotes) => {
    const req = leaveRequests.find((r) => r.id === id);
    if (!req) return;

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'REJECTED',
              reviewedBy: INITIAL_USER_ROLES.COORDINATOR.name,
              reviewedAt: new Date().toISOString(),
              reviewNotes: reviewNotes || 'Rejected: Academic attendance requirements not met.'
            }
          : r
      )
    );

    appendAuditLog(
      'LEAVE_APPLICATION_REJECTED',
      `Coordinator rejected leave request ${id} for ${req.studentName}. Reason: ${reviewNotes}`,
      'COORDINATOR'
    );

    addToast(`Request ${id} rejected`, 'warning');
  };

  // HOD: Approve Post-48h Correction (FR-7, UC-10)
  const approvePostCorrection = (id) => {
    const corr = postCorrections.find((c) => c.id === id);
    if (!corr) return;

    setPostCorrections((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'APPROVED',
              reviewedBy: INITIAL_USER_ROLES.HOD.name,
              reviewedAt: new Date().toISOString()
            }
          : c
      )
    );

    // Update the session in sessionLogs
    setSessionLogs((prev) =>
      prev.map((s) =>
        s.id === corr.sessionId
          ? {
              ...s,
              status: corr.requestedStatus,
              remarks: `HOD Approved Post-48h Correction (${corr.id}): ${corr.reason}`
            }
          : s
      )
    );

    // Update subject counters
    const wasAttended = corr.currentStatus === 'PRESENT' || corr.currentStatus === 'ON-DUTY';
    const isNowAttended = corr.requestedStatus === 'PRESENT' || corr.requestedStatus === 'ON-DUTY';

    if (wasAttended !== isNowAttended) {
      setSubjects((prev) =>
        prev.map((sub) => {
          if (sub.code === corr.subjectCode) {
            return {
              ...sub,
              attended: isNowAttended ? sub.attended + 1 : Math.max(0, sub.attended - 1)
            };
          }
          return sub;
        })
      );
    }

    appendAuditLog(
      'POST_48H_CORRECTION_APPROVED',
      `HOD approved post-48h correction ${id} for ${corr.studentName} in ${corr.subjectCode} (${corr.currentStatus} -> ${corr.requestedStatus})`,
      'HOD'
    );

    addToast(`HOD approved correction ${id}. Student records updated.`, 'success');
  };

  // HOD: Reject Post-48h Correction
  const rejectPostCorrection = (id, reason) => {
    setPostCorrections((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'REJECTED',
              reviewedBy: INITIAL_USER_ROLES.HOD.name,
              reviewedAt: new Date().toISOString(),
              reviewNotes: reason || 'Insufficient justification for post-window alteration.'
            }
          : c
      )
    );

    appendAuditLog(
      'POST_48H_CORRECTION_REJECTED',
      `HOD rejected post-48h correction request ${id}`,
      'HOD'
    );

    addToast(`Correction request ${id} rejected by HOD`, 'warning');
  };

  // HOD: Live Threshold Configuration Engine (FR-11, UC-11, TC20)
  const updateThresholds = (newDefaulter, newWarning) => {
    setThresholds({
      defaulter: Number(newDefaulter),
      warning: Number(newWarning)
    });

    appendAuditLog(
      'POLICY_THRESHOLD_UPDATE',
      `HOD adjusted live department thresholds: Defaulter=${newDefaulter}%, Warning=${newWarning}%. Zero code rebuild required.`,
      'HOD'
    );

    addToast(`Policy Thresholds updated to Defaulter: ${newDefaulter}% | Warning: ${newWarning}%`, 'success');
  };

  // Coordinator: Trigger 18:00 Guardian Digest
  const dispatchGuardianDigest = (recipientsCount = 3) => {
    appendAuditLog(
      'GUARDIAN_DIGEST_DISPATCHED',
      `Dispatched 18:00 Automated Defaulter Digest to ${recipientsCount} guardians (<${thresholds.defaulter}% threshold) with legally compliant opt-out footer.`,
      'COORDINATOR'
    );
    addToast(`Daily Guardian Defaulter Digest dispatched to ${recipientsCount} parent contacts!`, 'success');
  };

  // Admin: Add new subject
  const addSubject = (newSub) => {
    setSubjects((prev) => [...prev, newSub]);
    appendAuditLog('SUBJECT_CREATED', `Admin registered new curriculum subject ${newSub.code}: ${newSub.name}`, 'ADMIN');
    addToast(`Subject ${newSub.code} added to master registry`, 'success');
  };

  return (
    <AttendanceContext.Provider
      value={{
        currentRole,
        switchRole,
        students,
        subjects,
        timetable,
        sessionLogs,
        leaveRequests,
        postCorrections,
        auditLogs,
        thresholds,
        updateThresholds,
        isOffline,
        toggleOffline,
        offlineQueue,
        markAttendance,
        directUpdateSession,
        escalateCorrectionToHod,
        submitLeaveRequest,
        withdrawLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        approvePostCorrection,
        rejectPostCorrection,
        dispatchGuardianDigest,
        addSubject,
        triggerUnauthorizedWrite,
        triggerTamperAttempt,
        forbiddenModalOpen,
        setForbiddenModalOpen,
        securityModalOpen,
        setSecurityModalOpen,
        tamperViolationModalOpen,
        setTamperViolationModalOpen,
        toasts,
        addToast,
        removeToast,
        currentUser: INITIAL_USER_ROLES[currentRole]
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}
