
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { Student, Staff, AttendanceStatus, StudentAttendance, StaffAttendance } from '../types';

interface AttendanceModuleProps {
  students: Student[];
  staff: Staff[];
}

const GRADES = [
  'Pre-Nursery', 'Nursery', 'KG', 
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

const SUBJECTS = [
  'Mathematics', 'English', 'Hindi', 'Science', 'Social Science', 
  'Physics', 'Chemistry', 'Biology', 'Computer Science'
];

const AttendanceModule: React.FC<AttendanceModuleProps> = ({ students, staff }) => {
  const [activeTab, setActiveTab] = useState<'student_daily' | 'student_subject' | 'staff' | 'reports'>('student_daily');
  
  // View states
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedGrade, setSelectedGrade] = useState<string>('Class 10');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');

  // Attendance states
  const [studentDaily, setStudentDaily] = useState<StudentAttendance[]>([]);
  const [studentSubject, setStudentSubject] = useState<StudentAttendance[]>([]);
  const [staffDaily, setStaffDaily] = useState<StaffAttendance[]>([]);

  const filteredStudents = useMemo(() => 
    students.filter(s => s.grade === selectedGrade && s.section === selectedSection),
  [students, selectedGrade, selectedSection]);

  const markStudentDaily = (studentId: string, status: AttendanceStatus) => {
    setStudentDaily(prev => {
      const existing = prev.find(a => a.studentId === studentId && a.date === selectedDate);
      if (existing) {
        return prev.map(a => (a.studentId === studentId && a.date === selectedDate) ? { ...a, status } : a);
      }
      return [...prev, { id: `SD-${Date.now()}-${studentId}`, studentId, date: selectedDate, status, grade: selectedGrade, section: selectedSection }];
    });
  };

  const markStudentSubject = (studentId: string, status: AttendanceStatus) => {
    setStudentSubject(prev => {
      const existing = prev.find(a => a.studentId === studentId && a.date === selectedDate && a.subject === selectedSubject);
      if (existing) {
        return prev.map(a => (a.studentId === studentId && a.date === selectedDate && a.subject === selectedSubject) ? { ...a, status } : a);
      }
      return [...prev, { id: `SS-${Date.now()}-${studentId}`, studentId, date: selectedDate, status, grade: selectedGrade, section: selectedSection, subject: selectedSubject }];
    });
  };

  const markStaff = (staffId: string, status: AttendanceStatus) => {
    setStaffDaily(prev => {
      const existing = prev.find(a => a.staffId === staffId && a.date === selectedDate);
      if (existing) {
        return prev.map(a => (a.staffId === staffId && a.date === selectedDate) ? { ...a, status } : a);
      }
      return [...prev, { id: `ST-${Date.now()}-${staffId}`, staffId, date: selectedDate, status }];
    });
  };

  const handleMarkAll = (type: 'daily' | 'subject' | 'staff', status: AttendanceStatus) => {
    if (type === 'daily') {
      filteredStudents.forEach(s => markStudentDaily(s.id, status));
    } else if (type === 'subject') {
      filteredStudents.forEach(s => markStudentSubject(s.id, status));
    } else if (type === 'staff') {
      staff.forEach(s => markStaff(s.id, status));
    }
  };

  const renderStatusButton = (current: AttendanceStatus | undefined, target: AttendanceStatus, onClick: () => void) => {
    const isSelected = current === target;
    const colors = {
      'Present': 'bg-emerald-500 text-white',
      'Absent': 'bg-rose-500 text-white',
      'Late': 'bg-amber-500 text-white',
      'Leave': 'bg-indigo-500 text-white'
    };

    return (
      <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${
          isSelected ? colors[target] : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
        }`}
      >
        {target}
      </button>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase underline decoration-indigo-500 underline-offset-8">Attendance Central</h1>
          <p className="text-slate-500 font-medium">Tracking institutional presence across classrooms and staffrooms.</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {[
            { id: 'student_daily', label: 'Daily Students' },
            { id: 'student_subject', label: 'Subject-wise' },
            { id: 'staff', label: 'Staff Register' },
            { id: 'reports', label: 'Analytics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
              style={activeTab === tab.id ? { backgroundColor: COLORS.primary } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
            
            {(activeTab === 'student_daily' || activeTab === 'student_subject') && (
              <>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Grade</label>
                  <select 
                    value={selectedGrade} 
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Section</label>
                  <select 
                    value={selectedSection} 
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </>
            )}

            {activeTab === 'student_subject' && (
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Period</label>
                <select 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => handleMarkAll(activeTab === 'staff' ? 'staff' : (activeTab === 'student_daily' ? 'daily' : 'subject'), 'Present')}
              className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
            >
              Bulk Present
            </button>
            <button 
              onClick={() => handleMarkAll(activeTab === 'staff' ? 'staff' : (activeTab === 'student_daily' ? 'daily' : 'subject'), 'Absent')}
              className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm"
            >
              Bulk Absent
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Profile & ID</th>
                  {(activeTab === 'student_daily' || activeTab === 'student_subject') && (
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Class Metrics</th>
                  )}
                  {activeTab === 'staff' && (
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Role / Dept</th>
                  )}
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status Assignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(activeTab === 'staff' ? staff : filteredStudents).map((person) => {
                  const isStaff = (activeTab === 'staff');
                  const attendance = isStaff 
                    ? staffDaily.find(a => a.staffId === person.id && a.date === selectedDate)
                    : (activeTab === 'student_daily' 
                        ? studentDaily.find(a => a.studentId === person.id && a.date === selectedDate)
                        : studentSubject.find(a => a.studentId === person.id && a.date === selectedDate && a.subject === selectedSubject)
                      );

                  return (
                    <tr key={person.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-slate-50 shadow-sm">
                            <img src={person.photo || `https://picsum.photos/seed/${person.id}/50`} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{person.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">ID: {isStaff ? (person as Staff).staffId : (person as Student).studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        {isStaff ? (
                          <div>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-black uppercase">{(person as Staff).role}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-800 uppercase">{(person as Student).grade}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SEC {(person as Student).section}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-5 text-right">
                        <div className="flex justify-center gap-2">
                          {(['Present', 'Absent', 'Late', 'Leave'] as AttendanceStatus[]).map(status => (
                            renderStatusButton(
                              attendance?.status, 
                              status, 
                              () => isStaff 
                                ? markStaff(person.id, status)
                                : (activeTab === 'student_daily' ? markStudentDaily(person.id, status) : markStudentSubject(person.id, status))
                            )
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {((activeTab === 'staff' ? staff : filteredStudents).length === 0) && (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">No individuals found in this selection</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
           <div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Operational Summary</span>
             <div className="flex gap-6 mt-1">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="text-xs font-black">Present: {(activeTab === 'staff' ? staffDaily : (activeTab === 'student_daily' ? studentDaily : studentSubject)).filter(a => a.date === selectedDate && a.status === 'Present').length}</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                   <span className="text-xs font-black">Absent: {(activeTab === 'staff' ? staffDaily : (activeTab === 'student_daily' ? studentDaily : studentSubject)).filter(a => a.date === selectedDate && a.status === 'Absent').length}</span>
                </div>
             </div>
           </div>
           <button className="px-10 py-4 bg-indigo-500 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all">
             Commit Records to Ledger
           </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModule;
