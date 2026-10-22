/**
 * Shortfall and Safe Buffer Recovery Calculator
 * Requirements: FR-9, FR-10
 *
 * Mathematical Foundations:
 * Let A = Attended sessions, C = Conducted sessions, T = Target threshold (e.g., 0.75 for 75%)
 *
 * Case 1: Shortfall (A / C < T)
 * Minimum consecutive classes 'n' required to reach or exceed T:
 * (A + n) / (C + n) >= T
 * A + n >= T * C + T * n
 * n * (1 - T) >= T * C - A
 * n = Math.ceil((T * C - A) / (1 - T))
 *
 * Case 2: Safe Buffer (A / C >= T)
 * Maximum classes 'm' student can safely miss without dropping below T:
 * A / (C + m) >= T
 * C + m <= A / T
 * m = Math.floor((A / T) - C)
 */

export function calculateShortfallRecovery(attended, conducted, thresholdPercent = 75) {
  if (conducted === 0) {
    return {
      percentage: 100,
      isDefaulter: false,
      isWarning: false,
      isEligible: true,
      recoveryLectures: 0,
      safeBuffer: 0,
      formattedText: 'No sessions conducted yet'
    };
  }

  const currentRatio = attended / conducted;
  const currentPercentage = +(currentRatio * 100).toFixed(1);
  const targetRatio = thresholdPercent / 100;

  if (currentRatio < targetRatio) {
    // Need recovery
    const rawN = (targetRatio * conducted - attended) / (1 - targetRatio);
    const recoveryLectures = Math.max(1, Math.ceil(rawN));
    return {
      percentage: currentPercentage,
      isDefaulter: currentPercentage < thresholdPercent,
      isWarning: currentPercentage >= thresholdPercent && currentPercentage < (thresholdPercent + 5),
      isEligible: false,
      recoveryLectures,
      safeBuffer: 0,
      formattedText: `Attend next ${recoveryLectures} consecutive lecture${recoveryLectures > 1 ? 's' : ''} to reach ${thresholdPercent.toFixed(1)}%`
    };
  } else {
    // Above or equal to threshold - compute safe buffer
    const rawM = (attended / targetRatio) - conducted;
    const safeBuffer = Math.max(0, Math.floor(rawM));
    return {
      percentage: currentPercentage,
      isDefaulter: false,
      isWarning: currentPercentage < (thresholdPercent + 5), // within warning range
      isEligible: true,
      recoveryLectures: 0,
      safeBuffer,
      formattedText: safeBuffer > 0 
        ? `Safe buffer: You can miss up to ${safeBuffer} class${safeBuffer > 1 ? 'es' : ''} safely` 
        : `On the edge: Missing the next lecture will breach eligibility`
    };
  }
}

/**
 * Calculates cumulative attendance across all subjects,
 * strictly excluding CANCELLED sessions from numerator and denominator as per FR-9.
 */
export function calculateCumulativeAttendance(subjects, sessionLogs = []) {
  let totalConducted = 0;
  let totalAttended = 0;

  subjects.forEach(sub => {
    totalConducted += sub.conducted;
    totalAttended += sub.attended;
  });

  const percentage = totalConducted > 0 
    ? +((totalAttended / totalConducted) * 100).toFixed(1) 
    : 100;

  // Count approved OD sessions
  const odCount = sessionLogs.filter(s => s.status === 'ON-DUTY').length;

  return {
    totalConducted,
    totalAttended,
    percentage,
    odCount
  };
}

/**
 * Returns the semantic CSS classes based on percentage and live thresholds
 */
export function getAttendanceStatusBadge(percentage, defaulterThreshold = 75, warningThreshold = 80) {
  if (percentage >= warningThreshold) {
    return {
      label: 'Eligible',
      tone: 'safe',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20',
      dotColor: 'bg-emerald-500'
    };
  } else if (percentage >= defaulterThreshold) {
    return {
      label: 'Warning Zone',
      tone: 'warning',
      className: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20',
      dotColor: 'bg-amber-500'
    };
  } else {
    return {
      label: 'Critical Defaulter',
      tone: 'critical',
      className: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20',
      dotColor: 'bg-rose-500'
    };
  }
}
