
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { Student, ExamResult, Examination, Homework, HomeworkSubmission, StudentFeeRecord, StudentLeaveRequest, Staff, DonationCampaign } from '../types';
import { FormSection, Input, Select, FileUpload } from './FormLayout';

interface ParentPortalProps {
  student: Student;
  exams: Examination[];
  results: ExamResult[];
  homeworks: Homework[];
  submissions: HomeworkSubmission[];
  fees: StudentFeeRecord[];
  classTeacher: Staff;
}

const ACTIVITIES = ['Music Club', 'Debate Society', 'Football Academy', 'Chess Pro', 'Art & Design', 'STEM Hub'];
const ELECTIVE_SUBJECTS = ['Computer Science', 'Fine Arts', 'Physical Education', 'Home Science', 'Sanskrit'];

const ParentPortal: React.FC<ParentPortalProps> = ({ 
  student, exams, results, homeworks, submissions, fees, classTeacher 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'homework' | 'finance' | 'services' | 'communication'>('overview');
  
  const currentFees = fees.find(f => f.studentId === student.id);
  const studentResults = results.filter(r => r.studentId === student.id);
  const pendingHomework = homeworks.filter(h => h.grade === student.grade && !submissions.find(s => s.homeworkId === h.id && s.studentId === student.id));

  // Added calculation for missing grossTotal variable used in the finance tab
  const grossTotal = useMemo(() => {
    if (!currentFees) return 0;
    return Math.max(0, currentFees.totalAmount - currentFees.paidAmount - currentFees.discount);
  }, [currentFees]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
         </div>
         <div className="flex items-center gap-8 relative z-10">
            <div className="relative">
               <img src={student.photo || `https://picsum.photos/seed/${student.id}/200`} className="w-24 h-24 rounded-[2rem] object-cover border-4 border-slate-50 shadow-xl" alt="" />
               <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-white rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
               </div>
            </div>
            <div>
               <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{student.name}</h1>
               <p className="text-lg font-black text-indigo-500 uppercase tracking-widest mt-2">Class {student.grade} • SEC {student.section}</p>
               <p className="text-xs font-bold text-slate-400 mt-1 uppercase">Institutional ID: {student.studentId}</p>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="px-8 py-4 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-col items-center">
               <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Fee Status</span>
               <span className={`text-sm font-black italic ${currentFees?.status === 'Paid' ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>{currentFees?.status || 'Awaiting Sync'}</span>
            </div>
            <div className="px-8 py-4 bg-indigo-50 text-indigo-600 rounded-3xl border border-indigo-100 flex flex-col items-center">
               <span className="text-[8px] font-black uppercase tracking-widest mb-1">Attendance</span>
               <span className="text-sm font-black italic">94.2%</span>
            </div>
         </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex p-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-x-auto custom-scrollbar">
         {[
            { id: 'overview', label: '360° Overview' },
            { id: 'academics', label: 'Results & Subjects' },
            { id: 'homework', label: 'Assignments' },
            { id: 'finance', label: 'Fees & Donation' },
            { id: 'services', label: 'Institutional Services' },
            { id: 'communication', label: 'Faculty Liaison' }
         ].map(tab => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`px-8 py-4 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
               }`}
            >
               {tab.label}
            </button>
         ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
               <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                  <h3 className="text-xl font-black text-slate-800 uppercase italic mb-8">Performance Trajectory</h3>
                  <div className="h-64 flex items-end gap-4">
                     {[85, 92, 78, 95, 88].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4">
                           <div className="w-full bg-slate-50 rounded-2xl relative overflow-hidden h-48">
                              <div className="absolute bottom-0 w-full bg-indigo-500 rounded-2xl transition-all duration-1000" style={{ height: `${h}%` }}></div>
                           </div>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Test {i+1}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between h-64 group hover:border-indigo-400 transition-all">
                     <div>
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Pending Assignments</h4>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">{pendingHomework.length}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Required for Grade Sync</p>
                     </div>
                     <button onClick={() => setActiveTab('homework')} className="w-fit text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 group-hover:translate-x-2 transition-transform">Submit Now →</button>
                  </div>
                  <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl flex flex-col justify-between h-64 text-white">
                     <div>
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Next Payment Cycle</h4>
                        <h2 className="text-4xl font-black italic tracking-tighter">₹5,800</h2>
                        <p className="text-[10px] font-bold text-white/40 uppercase mt-2">Due by 05 Mar 2025</p>
                     </div>
                     <button onClick={() => setActiveTab('finance')} className="w-full py-3 bg-indigo-500 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all">Settle Payment</button>
                  </div>
               </div>
            </div>

            <div className="space-y-10">
               <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                     <img src={classTeacher.photo || `https://picsum.photos/seed/${classTeacher.id}/60`} className="w-16 h-16 rounded-2xl object-cover border-4 border-slate-50 shadow-md" alt="" />
                     <div>
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Class Teacher</h4>
                        <p className="text-lg font-black text-slate-900 italic leading-none">{classTeacher.name}</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Latest Observation</p>
                        <p className="text-xs font-serif italic text-slate-600 leading-relaxed">"The student is showing great aptitude in mathematics but should participate more in class discussions."</p>
                     </div>
                     <button onClick={() => setActiveTab('communication')} className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm hover:bg-indigo-600 hover:text-white transition-all">Direct Message</button>
                  </div>
               </div>

               <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Service Overview</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                        <span className="text-xs font-bold text-slate-600 uppercase">Transport</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[8px] font-black uppercase">Active: Loop R1</span>
                     </div>
                     <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl opacity-50">
                        <span className="text-xs font-bold text-slate-600 uppercase">Hostel</span>
                        <span className="px-3 py-1 bg-slate-200 text-slate-500 rounded-lg text-[8px] font-black uppercase">Not Availed</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Academics Tab */}
      {activeTab === 'academics' && (
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
               <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
                     <h3 className="text-xl font-black uppercase italic tracking-tight">Academic Grade Registry</h3>
                     <button className="px-6 py-2 bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">Download Transcript</button>
                  </div>
                  <div className="p-8 overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="border-b-2 border-slate-900">
                              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase">Examination Cycle</th>
                              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Score</th>
                              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Qualitative</th>
                              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Ledger</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {exams.filter(e => e.grade === student.grade).map(e => {
                              const res = results.find(r => r.examId === e.id && r.studentId === student.id);
                              return (
                                 <tr key={e.id} className="hover:bg-slate-50 transition-all">
                                    <td className="px-4 py-6">
                                       <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{e.title}</p>
                                       <p className="text-[9px] font-bold text-slate-400 uppercase">{e.subject} • {e.date}</p>
                                    </td>
                                    <td className="px-4 py-6 text-center">
                                       <p className="text-lg font-black text-indigo-600 tracking-tighter">{res?.marksObtained || '--'} <span className="text-xs text-slate-300">/ {e.totalMarks}</span></p>
                                    </td>
                                    <td className="px-4 py-6 text-center">
                                       <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black uppercase">{res?.grade || 'Awaiting'}</span>
                                    </td>
                                    <td className="px-4 py-6 text-right">
                                       <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all shadow-inner"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                                    </td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-10">
               <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 uppercase italic mb-8 border-l-4 border-indigo-500 pl-4">Elective Selection</h3>
                  <div className="space-y-3">
                     {ELECTIVE_SUBJECTS.map(sub => {
                        const isSelected = student.selectedSubjects?.includes(sub);
                        return (
                           <button key={sub} className={`w-full p-5 rounded-3xl border flex justify-between items-center transition-all ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'}`}>
                              <span className="text-xs font-black uppercase tracking-widest">{sub}</span>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-white border-white text-indigo-600' : 'border-slate-300'}`}>
                                 {isSelected && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                              </div>
                           </button>
                        );
                     })}
                  </div>
                  <button className="mt-8 w-full py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">Confirm Electives</button>
               </div>
            </div>
         </div>
      )}

      {/* Homework Tab */}
      {activeTab === 'homework' && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 uppercase italic mb-8">Active Assignments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {homeworks.filter(h => h.grade === student.grade).map(hw => {
                        const sub = submissions.find(s => s.homeworkId === hw.id && s.studentId === student.id);
                        return (
                           <div key={hw.id} className="p-8 rounded-[2.5rem] border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col justify-between">
                              <div>
                                 <div className="flex justify-between items-start mb-6">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[8px] font-black uppercase tracking-widest">{hw.subject}</span>
                                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${sub ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700 animate-pulse'}`}>
                                       {sub ? 'Submitted' : 'Pending'}
                                    </span>
                                 </div>
                                 <h4 className="text-lg font-black text-slate-800 uppercase italic leading-none mb-3">{hw.title}</h4>
                                 <p className="text-xs font-medium text-slate-500 leading-relaxed italic mb-6">"{hw.description}"</p>
                                 <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-8">Deadline: {hw.dueDate}</p>
                              </div>
                              <div className="flex gap-2">
                                 <button className="flex-1 py-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100">Download Material</button>
                                 {!sub && <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">Upload Work</button>}
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                     <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 uppercase italic mb-8">Submission History</h3>
                  <div className="space-y-6">
                     {submissions.filter(s => s.studentId === student.id).map(s => {
                        const hw = homeworks.find(h => h.id === s.homeworkId);
                        return (
                           <div key={s.id} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                 <span className="text-[10px] font-black text-slate-800 uppercase italic">{hw?.title}</span>
                                 {s.marks !== undefined && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black">Score: {s.marks}</span>}
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">Checked on: {s.submissionDate}</p>
                              {s.feedback && (
                                 <p className="text-[10px] font-serif italic text-slate-500 leading-relaxed border-l-2 border-indigo-200 pl-3">"{s.feedback}"</p>
                              )}
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Finance Tab */}
      {activeTab === 'finance' && (
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
               <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                  <h3 className="text-xl font-black text-slate-900 uppercase italic mb-8">Consolidated Fee Terminal</h3>
                  <div className="space-y-4">
                     {[
                        { label: 'Tuition Fee (Q4)', amount: 5000, source: 'Academic' },
                        { label: 'Laboratory Service', amount: 800, source: 'Facilities' },
                        { label: 'Library Arrears', amount: 0, source: 'Arrears' }
                     ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                           <div>
                              <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{item.label}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.source}</p>
                           </div>
                           <p className="text-xl font-black text-slate-900 tracking-tighter">₹{item.amount.toLocaleString()}</p>
                        </div>
                     ))}
                  </div>
                  <div className="mt-10 p-10 bg-slate-900 rounded-[3rem] text-white flex justify-between items-center shadow-2xl">
                     <div>
                        <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">Total Outstanding</p>
                        <h4 className="text-4xl font-black italic tracking-tighter">₹{grossTotal.toLocaleString()}</h4>
                     </div>
                     <button className="px-12 py-5 bg-indigo-500 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Execute Payment</button>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-10">
               <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col relative group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                     <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 uppercase italic mb-8">Support Institutional Growth</h3>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed italic mb-8">Your contribution empowers our scholarship fund and laboratory infrastructure. Support the next generation of leaders.</p>
                  <form className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Donation Amount (₹)</label>
                        <input type="number" placeholder="Enter amount..." className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-black" />
                     </div>
                     <button type="button" className="w-full py-5 bg-emerald-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:brightness-110 active:scale-95 transition-all">Secure Donation</button>
                  </form>
               </div>
            </div>
         </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                  <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45l8.15 14.1H3.85L12 5.45z"/></svg>
               </div>
               <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-4">Hostel Application</h3>
               <p className="text-sm font-medium text-slate-400 leading-relaxed italic mb-10">Request institutional boarding facility with curated amenities and 24/7 safety protocol.</p>
               <div className="space-y-6">
                  <Select label="Preferred Ward Type" name="hostel_type" options={[{value:'Standard', label:'Standard Quad'}, {value:'Premium', label:'Dual Occupancy'}]} />
                  <button className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">Apply for Residential Services</button>
               </div>
            </div>

            <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:-scale-110 transition-transform duration-1000">
                  <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
               </div>
               <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-4">Transport Logistics</h3>
               <p className="text-sm font-medium text-slate-400 leading-relaxed italic mb-10">Apply for our official GPS-tracked fleet services for secure daily commute between residence and campus.</p>
               <div className="space-y-6">
                  <Select label="Nearest Landmark / Route" name="route_id" options={[{value:'R1', label:'Noida-Enclave Loop'}, {value:'R2', label:'South Delhi Express'}]} />
                  <button className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">Apply for Transit Services</button>
               </div>
            </div>

            <div className="lg:col-span-2 bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm">
               <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-10 text-center">Co-Curricular Activity Selection</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {ACTIVITIES.map(act => {
                     const isSelected = student.selectedActivities?.includes(act);
                     return (
                        <button key={act} className={`flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border transition-all ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl scale-105' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-indigo-300'}`}>
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isSelected ? 'bg-white/20' : 'bg-white shadow-inner'}`}>{act[0]}</div>
                           <span className="text-[9px] font-black uppercase tracking-widest text-center">{act}</span>
                        </button>
                     );
                  })}
               </div>
               <button className="mt-12 w-full py-5 bg-emerald-500 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl">Deploy Co-Curricular Enrollment</button>
            </div>
         </div>
      )}

      {/* Communication Tab */}
      {activeTab === 'communication' && (
         <div className="max-w-5xl mx-auto bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[700px] animate-in slide-in-from-bottom-8 duration-700">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-4">
                  <img src={classTeacher.photo || `https://picsum.photos/seed/${classTeacher.id}/60`} className="w-16 h-16 rounded-[1.5rem] object-cover border-4 border-white shadow-md" alt="" />
                  <div>
                     <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{classTeacher.name}</h4>
                     <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Faculty Advisor • Class {student.grade}</p>
                  </div>
               </div>
               <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
               </div>
            </div>

            <div className="flex-1 p-10 overflow-y-auto space-y-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
               <div className="flex flex-col items-end">
                  <div className="bg-indigo-600 text-white p-6 rounded-[2rem] rounded-tr-none max-w-md shadow-xl">
                     <p className="text-sm font-medium leading-relaxed uppercase tracking-tight italic">"Greetings Professor. I would like to schedule a virtual PTM regarding my child's progress in the upcoming Olympiads."</p>
                  </div>
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-2 mr-2">You (Guardian) • 09:15 AM</span>
               </div>

               <div className="flex flex-col items-start">
                  <div className="bg-slate-100 text-slate-700 p-6 rounded-[2rem] rounded-tl-none max-w-md shadow-sm border border-slate-200">
                     <p className="text-sm font-medium leading-relaxed italic">"Welcome. I have noted your request. I am available this Friday at 4:30 PM. I'll share the calendar link shortly. Your child is performing exceptionally in analytical reasoning."</p>
                  </div>
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-2 ml-2">Faculty Advisor • 10:45 AM</span>
               </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-white">
               <form className="flex gap-4">
                  <input placeholder="Communicate with institutional faculty..." className="flex-1 px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2.5rem] text-sm font-black outline-none focus:ring-4 focus:ring-indigo-100 transition-all focus:bg-white" />
                  <button type="submit" className="px-12 py-5 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all">Dispatch</button>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default ParentPortal;
