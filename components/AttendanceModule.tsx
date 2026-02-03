
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { Student, Staff, AttendanceStatus, StudentAttendance, StaffAttendance } from '../types';

interface AttendanceModuleProps {
  students: Student[];
  staff: Staff[];
}

const GRADES = ['Pre-Nursery', 'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E'];
const SUBJECTS = ['Mathematics', 'English', 'Hindi', 'Science', 'Social Science', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];

const AttendanceModule: React.FC<AttendanceModuleProps> = ({ students, staff }) => {
  const [activeTab, setActiveTab] = useState<'student_daily' | 'student_subject' | 'staff' | 'reports'>('student_daily');
  
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedGrade, setSelectedGrade] = useState<string>('Class 10');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');

  const [studentDaily, setStudentDaily] = useState<StudentAttendance[]>([]);
  const [studentSubject, setStudentSubject] = useState<StudentAttendance[]>([]);
  const [staffDaily, setStaffDaily] = useState<StaffAttendance[]>([]);

  const filteredStudents = useMemo(() => 
    students.filter(s => s.grade === selectedGrade && s.section === selectedSection),
  [students, selectedGrade, selectedSection]);

  const markStudentDaily = (studentId: string, status: AttendanceStatus) => {
    setStudentDaily(prev => {
      const existing = prev.find(a => a.studentId === studentId && a.date === selectedDate);
      if (existing) return prev.map(a => (a.studentId === studentId && a.date === selectedDate) ? { ...a, status } : a);
      return [...prev, { id: `SD-${Date.now()}-${studentId}`, studentId, date: selectedDate, status, grade: selectedGrade, section: selectedSection }];
    });
  };

  const markStaff = (staffId: string, status: AttendanceStatus) => {
    setStaffDaily(prev => {
      const existing = prev.find(a => a.staffId === staffId && a.date === selectedDate);
      if (existing) return prev.map(a => (a.staffId === staffId && a.date === selectedDate) ? { ...a, status } : a);
      return [...prev, { id: `ST-${Date.now()}-${staffId}`, staffId, date: selectedDate, status }];
    });
  };

  const handleMarkAll = (type: 'daily' | 'staff', status: AttendanceStatus) => {
    if (type === 'daily') filteredStudents.forEach(s => markStudentDaily(s.id, status));
    else staff.forEach(s => markStaff(s.id, status));
  };

  const renderStatusButton = (current: AttendanceStatus | undefined, target: AttendanceStatus, onClick: () => void) => {
    const isSelected = current === target;
    const colors = { 'Present': 'bg-emerald-500 text-white', 'Absent': 'bg-rose-500 text-white', 'Late': 'bg-amber-500 text-white', 'Leave': 'bg-indigo-500 text-white' };
    return <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${isSelected ? colors[target] : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}>{target}</button>;
  };

  // Dummy Analytics Data
  const gradeWiseStats = GRADES.slice(3, 8).map(g => ({ name: g, presence: 80 + Math.random() * 20 }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-500 underline-offset-8">Attendance Central</h1>
          <p className="text-slate-500 font-medium">Tracking institutional presence across classrooms and staffrooms.</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {['student_daily', 'student_subject', 'staff', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{tab.replace('_', ' ')}</button>
          ))}
        </div>
      </div>

      {(activeTab === 'student_daily' || activeTab === 'staff') && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase" />
              {activeTab === 'student_daily' && (
                <>
                  <select value={selectedGrade} onChange={e=>setSelectedGrade(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase">
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <select value={selectedSection} onChange={e=>setSelectedSection(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase">
                    {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleMarkAll(activeTab === 'staff' ? 'staff' : 'daily', 'Present')} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">Bulk Present</button>
              <button onClick={() => handleMarkAll(activeTab === 'staff' ? 'staff' : 'daily', 'Absent')} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100">Bulk Absent</button>
            </div>
          </div>
          <div className="p-8">
            <table className="w-full text-left">
              <thead><tr className="border-b border-slate-100"><th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Profile & ID</th><th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status Assignment</th></tr></thead>
              <tbody className="divide-y divide-slate-50">
                {(activeTab === 'staff' ? staff : filteredStudents).map(p => {
                  const att = activeTab === 'staff' ? staffDaily.find(a => a.staffId === p.id && a.date === selectedDate) : studentDaily.find(a => a.studentId === p.id && a.date === selectedDate);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-all"><td className="px-4 py-5"><div className="flex items-center gap-4"><img src={p.photo || `https://picsum.photos/seed/${p.id}/50`} className="w-10 h-10 rounded-xl object-cover" alt="" /><div><p className="text-sm font-black text-slate-800 uppercase leading-none mb-1">{p.name}</p><p className="text-[9px] font-bold text-slate-400 uppercase">ID: {p.id}</p></div></div></td><td className="px-4 py-5 text-right"><div className="flex justify-center gap-2">{(['Present', 'Absent', 'Late', 'Leave'] as AttendanceStatus[]).map(s => renderStatusButton(att?.status, s, () => activeTab === 'staff' ? markStaff(p.id, s) : markStudentDaily(p.id, s)))}</div></td></tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-8 bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-black uppercase italic tracking-tight mb-10">Institutional Presence Hub</h3>
              <div className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeWiseStats}>
                       <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="900" />
                       <YAxis stroke="#94a3b8" fontSize={10} fontWeight="900" />
                       <Tooltip />
                       <Bar dataKey="presence" fill="#6366f1" radius={[10, 10, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
           <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[3.5rem] text-white flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Today's Presence Rate</p>
              <h2 className="text-7xl font-black italic tracking-tighter">94.2%</h2>
              <div className="mt-8 pt-8 border-t border-white/10 w-full">
                 <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">3.2% Increase from Last Month</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceModule;
