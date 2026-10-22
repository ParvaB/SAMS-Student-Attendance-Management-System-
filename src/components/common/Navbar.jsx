import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  Users, 
  Award, 
  Settings, 
  Wifi, 
  WifiOff, 
  ShieldAlert,
  KeyRound,
  ExternalLink
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentRole, 
    switchRole, 
    currentUser, 
    triggerUnauthorizedWrite, 
    setSecurityModalOpen,
    isOffline,
    toggleOffline,
    offlineQueue
  } = useAttendance();

  const roleOptions = [
    {
      key: 'STUDENT',
      label: 'Student',
      sublabel: 'Parva Bagadia (E224)',
      icon: GraduationCap,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      key: 'FACULTY',
      label: 'Faculty',
      sublabel: 'Prof. R. Sharma',
      icon: UserCheck,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      key: 'COORDINATOR',
      label: 'Coordinator',
      sublabel: 'Prof. A. Deshmukh',
      icon: Users,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      key: 'HOD',
      label: 'HOD',
      sublabel: 'Dr. V. Kulkarni',
      icon: Award,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      key: 'ADMIN',
      label: 'SysAdmin',
      sublabel: 'Audit & Master Data',
      icon: Settings,
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300'
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Academic Sub-strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-white tracking-wide">
            SAMS • B.Tech Computer Science & Engineering • Sem V • Batch B1
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            Course Project: Software Engineering
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-slate-300 flex items-center gap-1.5 font-medium">
            <span className="text-slate-400">Student:</span>
            <span className="text-indigo-300 font-semibold">Parva Bagadia</span>
            <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-mono">
              Roll No: E224
            </span>
          </div>

          {/* Offline simulator status pill */}
          <button
            onClick={toggleOffline}
            title="Toggle Offline Network Drop Simulator (TC05)"
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono transition border ${
              isOffline
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3 h-3 text-rose-400" />
                <span>OFFLINE ({offlineQueue.length} queued)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>ONLINE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Portal Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 font-bold text-base tracking-wider">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-none">
                  SAMS Academic Portal
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200">
                  v3.4.1
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-none">
                Student Attendance Management System
              </p>
            </div>
          </div>

          {/* Quick Security Simulator Launcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSecurityModalOpen(true)}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200 shadow-2xs"
              title="Open Auth & Security Simulator (NFR-3, TC01, TC02)"
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Auth & Security</span>
            </button>

            {currentRole === 'STUDENT' && (
              <button
                onClick={triggerUnauthorizedWrite}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-rose-200 shadow-2xs"
                title="Test Unauthorized Write API Security Filter (TC03)"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Test Write API (TC03)</span>
                <span className="sm:hidden font-mono">TC03</span>
              </button>
            )}
          </div>
        </div>

        {/* 5-Role Switcher Pill (FR-1, FR-2) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 min-w-max w-full justify-between">
            {roleOptions.map((role) => {
              const Icon = role.icon;
              const isActive = currentRole === role.key;

              return (
                <button
                  key={role.key}
                  onClick={() => switchRole(role.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <span className="block leading-none">{role.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
