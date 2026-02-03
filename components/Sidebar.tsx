
import React from 'react';
import { NavItem } from '../types';
import { Icons, COLORS } from '../constants';

interface SidebarProps {
  active: NavItem;
  onSelect: (item: NavItem) => void;
  userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ active, onSelect, userRole }) => {
  const isLibrarian = userRole === 'Librarian';
  const isTeacher = userRole === 'Teacher';
  const isAccountant = userRole === 'Accountant';
  const isReceptionist = userRole === 'Receptionist';
  const isParent = userRole === 'Parent';

  const adminItems: { id: NavItem; label: string; icon: React.ComponentType; adminOnly?: boolean }[] = [
    { id: 'dashboard', label: '360° Dashboard', icon: Icons.Dashboard },
    { id: 'notices', label: 'Notice Board', icon: Icons.Certificate },
    { id: 'students', label: 'Students', icon: Icons.Users },
    { id: 'staff', label: 'Staff & Teachers', icon: Icons.Briefcase },
    { id: 'academic', label: 'Academic Module', icon: Icons.Academic },
    { id: 'attendance', label: 'Attendance Hub', icon: Icons.Attendance },
    { id: 'examination', label: 'Examination Control', icon: Icons.Examination },
    { id: 'teacher_homework', label: 'Homework Hub', icon: Icons.Academic },
    { id: 'teacher_messages', label: 'Liaison Hub', icon: Icons.Activity },
    { id: 'fees', label: 'Fees & Accounts', icon: Icons.Fees },
    { id: 'accounts', label: 'Accounts Ledger', icon: Icons.Plus },
    { id: 'assets', label: 'Asset Management', icon: Icons.Labs },
    { id: 'financial_report', label: 'Financial Matrix', icon: Icons.Plus },
    { id: 'payroll', label: 'Payroll & HR', icon: Icons.Briefcase },
    { id: 'library', label: 'Library Module', icon: Icons.Library },
    { id: 'labs', label: 'Laboratory Hub', icon: Icons.Labs },
    { id: 'activities', label: 'Activity & Sports', icon: Icons.Activity },
    { id: 'transport', label: 'Transportation Hub', icon: Icons.Transport },
    { id: 'hostel', label: 'Hostel Terminal', icon: Icons.Hostel },
    { id: 'donations', label: 'Donation Central', icon: Icons.Donation },
    { id: 'alumni', label: 'Alumni Network', icon: Icons.Alumni },
    { id: 'certificates', label: 'ID & Certificates', icon: Icons.Certificate },
    { id: 'credentials', label: 'Credential Registry', icon: Icons.Plus, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Icons.Settings },
  ];

  const teacherItems: { id: NavItem; label: string; icon: React.ComponentType }[] = [
    { id: 'dashboard', label: 'My Dashboard', icon: Icons.Dashboard },
    { id: 'teacher_profile', label: 'My Profile', icon: Icons.Users },
    { id: 'teacher_students', label: 'My Students', icon: Icons.Users },
    { id: 'attendance', label: 'Mark Attendance', icon: Icons.Attendance },
    { id: 'examination', label: 'Exams & Grading', icon: Icons.Examination },
    { id: 'teacher_homework', label: 'Homework Control', icon: Icons.Academic },
    { id: 'teacher_messages', label: 'Messages', icon: Icons.Activity },
    { id: 'teacher_self_service', label: 'Self Service', icon: Icons.Fees },
  ];

  const librarianItems: { id: NavItem; label: string; icon: React.ComponentType }[] = [
    { id: 'library', label: 'Library Module', icon: Icons.Library },
  ];

  const accountantItems: { id: NavItem; label: string; icon: React.ComponentType }[] = [
    { id: 'fees', label: 'Fees & Accounts', icon: Icons.Fees },
    { id: 'accounts', label: 'Institutional Ledger', icon: Icons.Plus },
    { id: 'financial_report', label: 'Fiscal Analytics', icon: Icons.Plus },
  ];

  const receptionistItems: { id: NavItem; label: string; icon: React.ComponentType }[] = [
    { id: 'notices', label: 'Notice Board', icon: Icons.Certificate },
    { id: 'hostel', label: 'Hostel Terminal', icon: Icons.Hostel },
    { id: 'transport', label: 'Transportation Hub', icon: Icons.Transport },
  ];

  const parentItems: { id: NavItem; label: string; icon: React.ComponentType }[] = [
    { id: 'parent_portal', label: 'Parent Terminal', icon: Icons.Dashboard },
    { id: 'notices', label: 'Notice Feed', icon: Icons.Certificate },
  ];

  const getMenuItems = () => {
    if (isLibrarian) return librarianItems;
    if (isAccountant) return accountantItems;
    if (isReceptionist) return receptionistItems;
    if (isTeacher) return teacherItems;
    if (isParent) return parentItems;
    return adminItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-200 flex flex-col sticky top-0 shrink-0 z-50">
      <div className="p-8 flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200"
          style={{ backgroundColor: COLORS.primary }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-slate-800 tracking-tighter leading-none uppercase">EduNexus</span>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">
            {userRole} Portal
          </span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 mt-2 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          if ('adminOnly' in item && item.adminOnly && userRole !== 'Super Admin') return null;
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group`}
              style={{
                backgroundColor: isActive ? `${COLORS.primary}10` : 'transparent',
                color: isActive ? COLORS.primary : '#64748b'
              }}
            >
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                <Icon />
              </div>
              <span className={`text-sm font-bold tracking-tight ${isActive ? 'text-slate-900' : 'group-hover:text-slate-700'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.primary }} />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={`https://picsum.photos/seed/${userRole?.toLowerCase() || 'admin'}/100`} className="w-11 h-11 rounded-xl border-2 border-white shadow-md" alt="User" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-slate-800 truncate">{userRole || 'Administrator'}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
              Institutional User
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
