
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { COLORS } from '../constants';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { Student, Staff, AttendanceStatus, StudentAttendance, StaffAttendance, AppSettings } from '../types';
import QRScanner from './QRScanner';

interface AttendanceModuleProps {
  students: Student[];
  staff: Staff[];
  settings: AppSettings;
  userRole?: string;
}

const GRADES = ['Pre-Nursery', 'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E'];
const SUBJECTS = ['Mathematics', 'English', 'Hindi', 'Science', 'Social Science', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];

const AttendanceModule: React.FC<AttendanceModuleProps> = ({ students, staff, settings, userRole }) => {
  const [activeTab, setActiveTab] = useState<'student_daily' | 'student_subject' | 'staff' | 'qr_scan' | 'reports'>(userRole === 'Parent' ? 'reports' : 'student_daily');
  
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedGrade, setSelectedGrade] = useState<string>('Class 10');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');

  const [reportTimeframe, setReportTimeframe] = useState<'daily' | 'monthly' | 'yearly' | 'term'>('daily');
  const [selectedTerm, setSelectedTerm] = useState<string>('Term 1');

  const [studentDaily, setStudentDaily] = useState<StudentAttendance[]>([]);
  const [studentSubject, setStudentSubject] = useState<StudentAttendance[]>([]);
  const [staffDaily, setStaffDaily] = useState<StaffAttendance[]>([]);

  const [scanLog, setScanLog] = useState<{name: string, time: string, status: string, type: 'Student' | 'Staff'}[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const filteredStudents = useMemo(() => 
    students.filter(s => s.grade === selectedGrade && s.section === selectedSection),
  [students, selectedGrade, selectedSection]);

  const calculateStatus = (time: string): AttendanceStatus => {
    const [hours, minutes] = time.split(':').map(Number);
    const [startHours, startMinutes] = settings.schoolStartTime.split(':').map(Number);
    
    const scanTotalMinutes = hours * 60 + minutes;
    const startTotalMinutes = startHours * 60 + startMinutes;

    if (scanTotalMinutes > startTotalMinutes + 15) { // 15 mins grace period
      return 'Late';
    }
    return 'Present';
  };

  const handleQRScan = useCallback((decodedText: string) => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    // Try to find student
    const student = students.find(s => s.studentId === decodedText);
    if (student) {
      const status = calculateStatus(currentTime);
      markStudentDaily(student.id, status, currentTime);
      setScanLog(prev => [{ name: student.name, time: currentTime, status, type: 'Student' as const }, ...prev].slice(0, 10));
      return;
    }

    // Try to find staff
    const staffMember = staff.find(s => s.staffId === decodedText);
    if (staffMember) {
      const status = calculateStatus(currentTime);
      markStaff(staffMember.id, status, currentTime);
      setScanLog(prev => [{ name: staffMember.name, time: currentTime, status, type: 'Staff' as const }, ...prev].slice(0, 10));
      return;
    }
  }, [students, staff, settings.schoolStartTime]);

  const markStudentDaily = (studentId: string, status: AttendanceStatus, time?: string) => {
    setStudentDaily(prev => {
      const existing = prev.find(a => a.studentId === studentId && a.date === selectedDate);
      if (existing) return prev.map(a => (a.studentId === studentId && a.date === selectedDate) ? { ...a, status, checkInTime: time || a.checkInTime } : a);
      
      const student = students.find(s => s.id === studentId);
      return [...prev, { 
        id: `SD-${Date.now()}-${studentId}`, 
        studentId, 
        date: selectedDate, 
        status, 
        grade: student?.grade || '', 
        section: student?.section || '',
        checkInTime: time 
      }];
    });
  };

  const markStaff = (staffId: string, status: AttendanceStatus, time?: string) => {
    setStaffDaily(prev => {
      const existing = prev.find(a => a.staffId === staffId && a.date === selectedDate);
      if (existing) return prev.map(a => (a.staffId === staffId && a.date === selectedDate) ? { ...a, status, checkInTime: time || a.checkInTime } : a);
      return [...prev, { id: `ST-${Date.now()}-${staffId}`, staffId, date: selectedDate, status, checkInTime: time }];
    });
  };

  const handleMarkAll = (type: 'daily' | 'staff', status: AttendanceStatus) => {
    if (type === 'daily') filteredStudents.forEach(s => markStudentDaily(s.id, status));
    else staff.forEach(s => markStaff(s.id, status));
  };

  const renderStatusButton = (current: AttendanceStatus | undefined, target: AttendanceStatus, onClick: () => void, key: string) => {
    const isSelected = current === target;
    const colors = { 'Present': 'bg-emerald-500 text-white', 'Absent': 'bg-rose-500 text-white', 'Late': 'bg-amber-500 text-white', 'Leave': 'bg-indigo-500 text-white' };
    return <button key={key} onClick={onClick} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${isSelected ? colors[target] : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}>{target}</button>;
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
          {['student_daily', 'student_subject', 'staff', 'qr_scan', 'reports']
            .filter(tab => userRole === 'Parent' ? tab === 'reports' : true)
            .map(tab => (
              <button key={tab} onClick={() => {
                setActiveTab(tab as any);
                setIsScanning(tab === 'qr_scan');
              }} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{tab.replace('_', ' ')}</button>
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
                    <tr key={p.id} className="hover:bg-slate-50 transition-all"><td className="px-4 py-5"><div className="flex items-center gap-4"><img src={p.photo || `https://picsum.photos/seed/${p.id}/50`} className="w-10 h-10 rounded-xl object-cover" alt="" /><div><p className="text-sm font-black text-slate-800 uppercase leading-none mb-1">{p.name}</p><p className="text-[9px] font-bold text-slate-400 uppercase">ID: {p.id}</p></div></div></td><td className="px-4 py-5 text-right"><div className="flex justify-center gap-2">{(['Present', 'Absent', 'Late', 'Leave'] as AttendanceStatus[]).map(s => renderStatusButton(att?.status, s, () => activeTab === 'staff' ? markStaff(p.id, s) : markStudentDaily(p.id, s), s))}</div></td></tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'qr_scan' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in zoom-in-95 duration-500">
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-black uppercase italic tracking-tight">QR Attendance Scanner</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Position ID Card QR code in front of camera</p>
            </div>
            <QRScanner onScan={handleQRScan} isScanning={isScanning} />
            <div className="mt-8 flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-black uppercase text-slate-400">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-[10px] font-black uppercase text-slate-400">Late</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl">
            <h3 className="text-xl font-black uppercase italic tracking-tight mb-8 text-indigo-400">Recent Scans</h3>
            <div className="space-y-4">
              {scanLog.length === 0 ? (
                <div className="py-20 text-center opacity-30">
                  <p className="text-xs font-black uppercase tracking-[0.3em]">Waiting for scans...</p>
                </div>
              ) : (
                scanLog.map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${log.status === 'Present' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {log.status[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight">{log.name}</p>
                        <p className="text-[9px] font-bold text-white/40 uppercase">{log.type} • {log.time}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${log.status === 'Present' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                      {log.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-10">
          {/* Report Controls */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-wrap items-center gap-6">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              {(['daily', 'monthly', 'yearly', 'term'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setReportTimeframe(tf)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reportTimeframe === tf ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {reportTimeframe === 'term' && (
              <select 
                value={selectedTerm}
                onChange={e => setSelectedTerm(e.target.value)}
                className="px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase outline-none focus:ring-4 focus:ring-indigo-100"
              >
                {['Term 1', 'Term 2', 'Term 3'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            )}

            <div className="flex-1"></div>
            
            <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Export PDF
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">Presence Analytics</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                    {reportTimeframe} View • {selectedGrade} {selectedSection}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="text-[9px] font-black uppercase text-slate-400">Presence %</span>
                  </div>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportTimeframe === 'daily' ? gradeWiseStats : [
                    { name: 'Jan', presence: 92 }, { name: 'Feb', presence: 94 }, { name: 'Mar', presence: 88 },
                    { name: 'Apr', presence: 95 }, { name: 'May', presence: 91 }, { name: 'Jun', presence: 89 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="presence" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Average Presence Rate</p>
                <h2 className="text-7xl font-black italic tracking-tighter">94.2%</h2>
                <div className="mt-8 pt-8 border-t border-white/10 w-full">
                  <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Target Met: 90% Benchmark</p>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm">
                <h4 className="text-sm font-black uppercase italic mb-6">Key Insights</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Highest Presence', value: 'Class 10-A', color: 'text-emerald-500' },
                    { label: 'Lowest Presence', value: 'Class 4-B', color: 'text-rose-500' },
                    { label: 'Staff Presence', value: '98.5%', color: 'text-indigo-500' }
                  ].map((insight, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                      <span className="text-[10px] font-black uppercase text-slate-400">{insight.label}</span>
                      <span className={`text-xs font-black uppercase ${insight.color}`}>{insight.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Table for Admin/Teacher */}
          {(userRole === 'Admin' || userRole === 'Teacher') && (
            <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-black uppercase italic tracking-tight">Detailed Attendance Ledger</h3>
                <div className="flex gap-4">
                  <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase">Total Records: {filteredStudents.length}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Profile</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Grade/Sec</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Days Present</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Days Absent</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Percentage</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <img src={s.photo || `https://picsum.photos/seed/${s.id}/50`} className="w-10 h-10 rounded-xl object-cover" alt="" />
                            <div>
                              <p className="text-sm font-black text-slate-800 uppercase leading-none mb-1">{s.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">ID: {s.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-xs font-black text-slate-600 uppercase">{s.grade} - {s.section}</td>
                        <td className="px-8 py-6 text-xs font-black text-emerald-600">22</td>
                        <td className="px-8 py-6 text-xs font-black text-rose-600">2</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                            <span className="text-[10px] font-black text-slate-800">92%</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="text-indigo-600 hover:text-indigo-800 text-[10px] font-black uppercase tracking-widest">View History</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Parent View - Specific Student Report */}
          {userRole === 'Parent' && (
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-8 border-slate-100 shadow-xl">
                  <img src={students[0].photo || `https://picsum.photos/seed/${students[0].id}/200`} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-black uppercase italic tracking-tight mb-2">{students[0].name}</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">{students[0].grade} • Section {students[0].section} • ID: {students[0].studentId}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Days', value: '180' },
                      { label: 'Present', value: '168', color: 'text-emerald-500' },
                      { label: 'Absent', value: '8', color: 'text-rose-500' },
                      { label: 'Late', value: '4', color: 'text-amber-500' }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-2xl font-black italic ${stat.color || 'text-slate-800'}`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceModule;
