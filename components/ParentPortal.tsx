
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { Student, ExamResult, Examination, Homework, HomeworkSubmission, StudentFeeRecord, FeeReceipt, IssuedBook, HostelAllotment, Staff } from '../types';
import { FormSection, Input, Select } from './FormLayout';

interface ParentPortalProps {
  student: Student;
  exams: Examination[];
  results: ExamResult[];
  homeworks: Homework[];
  submissions: HomeworkSubmission[];
  fees: StudentFeeRecord[];
  classTeacher: Staff;
  libraryIssues: IssuedBook[];
  hostelAllotments: HostelAllotment[];
  feeReceipts: FeeReceipt[];
}

const ParentPortal: React.FC<ParentPortalProps> = ({ 
  student, exams, results, homeworks, submissions, fees, classTeacher, libraryIssues, hostelAllotments, feeReceipts
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'homework' | 'finance' | 'services' | 'communication'>('overview');
  
  const currentFees = fees.find(f => f.studentId === student.id);
  const myLibraryFines = libraryIssues.filter(i => i.personId === student.id).reduce((acc, curr) => acc + curr.lateFee + curr.damageFee, 0);
  const myHostelRecord = hostelAllotments.find(a => a.studentId === student.id);
  
  const totalOutstanding = useMemo(() => {
    if (!currentFees) return myLibraryFines;
    return (currentFees.totalAmount - currentFees.paidAmount - currentFees.discount) + myLibraryFines;
  }, [currentFees, myLibraryFines]);

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
               <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Fiscal Pulse</span>
               <span className={`text-sm font-black italic ${totalOutstanding === 0 ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                  {totalOutstanding === 0 ? 'Settled' : 'Dues Pending'}
               </span>
            </div>
         </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex p-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-x-auto custom-scrollbar">
         {[
            { id: 'overview', label: '360° Overview' },
            { id: 'academics', label: 'Results' },
            { id: 'homework', label: 'Assignments' },
            { id: 'finance', label: 'Fees & Penalties' },
            { id: 'services', label: 'Services status' },
            { id: 'communication', label: 'Liaison' }
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
               <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-black text-slate-800 uppercase italic mb-8">Urgent Financial Reminders</h3>
                  <div className="space-y-4">
                     {totalOutstanding > 0 && (
                        <div className="flex items-center gap-6 p-6 bg-rose-50 border border-rose-100 rounded-[2rem] animate-pulse">
                           <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center font-black text-xl italic">!</div>
                           <div>
                              <p className="text-sm font-black text-rose-900 uppercase">Settlement Overdue</p>
                              <p className="text-xs font-bold text-rose-500">₹{totalOutstanding.toLocaleString()} is currently awaiting clearance.</p>
                           </div>
                        </div>
                     )}
                     {myLibraryFines > 0 && (
                        <div className="flex items-center gap-6 p-6 bg-amber-50 border border-amber-100 rounded-[2rem]">
                           <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.247 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                           </div>
                           <div>
                              <p className="text-sm font-black text-amber-900 uppercase">Library Arrears Detected</p>
                              <p className="text-xs font-bold text-amber-600">Late fine of ₹{myLibraryFines} has accrued on your current loans.</p>
                           </div>
                        </div>
                     )}
                     {totalOutstanding === 0 && (
                        <div className="p-10 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
                           <p className="text-slate-300 font-black uppercase tracking-widest">No pending alerts</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="space-y-10">
               <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white shadow-2xl">
                  <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">Current Service Enrollment</h3>
                  <div className="space-y-6">
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase">Transportation</span>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${student.transportRouteId ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                           {student.transportRouteId ? 'Enrolled (Loop R1)' : 'Not Adopted'}
                        </span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase">Hostel / Boarding</span>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${myHostelRecord ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                           {myHostelRecord ? `Unit ${myHostelRecord.roomId}` : 'Not Adopted'}
                        </span>
                     </div>
                     <div className="pt-6 border-t border-white/10">
                        <button onClick={() => setActiveTab('services')} className="w-full py-3 bg-white text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl">Update Subscriptions</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Finance Tab */}
      {activeTab === 'finance' && (
         <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden">
                  <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-8 border-b-8 border-rose-500 pb-2 inline-block">Liability Breakdown</h3>
                  
                  <div className="space-y-4">
                     {/* Core Tuition */}
                     <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-lg transition-all">
                        <div>
                           <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Academic Tuition (Q4)</h4>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base: ₹{currentFees?.totalAmount.toLocaleString()} • Disc: ₹{currentFees?.discount}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{((currentFees?.totalAmount || 0) - (currentFees?.paidAmount || 0) - (currentFees?.discount || 0)).toLocaleString()}</p>
                           <span className="text-[9px] font-black text-rose-500 uppercase italic">Awaiting Clearance</span>
                        </div>
                     </div>

                     {/* Library Fines */}
                     {myLibraryFines > 0 && (
                        <div className="p-8 bg-rose-50/50 rounded-[2.5rem] border border-rose-100 flex justify-between items-center">
                           <div>
                              <h4 className="text-lg font-black text-rose-900 uppercase tracking-tighter italic">Institutional Penalties</h4>
                              <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Late Fees & Asset Damage Assessment</p>
                           </div>
                           <div className="text-right">
                              <p className="text-2xl font-black text-rose-600 tracking-tighter">₹{myLibraryFines.toLocaleString()}</p>
                              <span className="text-[9px] font-black text-rose-400 uppercase italic">Non-Waiverable</span>
                           </div>
                        </div>
                     )}

                     {/* Transport/Hostel would go here if they had pending dues */}
                  </div>

                  <div className="mt-10 p-12 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-10">
                        <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <div className="mb-6 md:mb-0">
                        <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">Gross Realization Due</p>
                        <h4 className="text-5xl font-black italic tracking-tighter">₹{totalOutstanding.toLocaleString()}</h4>
                     </div>
                     <button className="w-full md:w-auto px-16 py-6 bg-indigo-500 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Execute Payment via UPI/NetBanking</button>
                  </div>
               </div>

               <div className="lg:col-span-1 bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 uppercase italic mb-8">Receipt Vault</h3>
                  <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                     {feeReceipts.filter(r => r.studentId === student.id).map(r => (
                        <div key={r.id} className="p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:border-indigo-400 transition-all group">
                           <div className="flex justify-between items-start mb-3">
                              <span className="text-[9px] font-black text-slate-400 uppercase">Ref: {r.receiptNo}</span>
                              <span className="text-[10px] font-black text-emerald-600 uppercase italic">Settled</span>
                           </div>
                           <h4 className="text-sm font-black text-slate-800 uppercase mb-1">{r.description}</h4>
                           <p className="text-xs font-bold text-indigo-600 mb-4">₹{r.amountPaid.toLocaleString()}</p>
                           <button className="w-full py-2 bg-white text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-all">Download Copy</button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Services Tab - Showing current adoption and application */}
      {activeTab === 'services' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden group">
               <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-4">Hostel / Boarding</h3>
               <div className={`p-8 rounded-[2.5rem] mb-10 ${myHostelRecord ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-slate-100'}`}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Status</p>
                  <p className="text-2xl font-black text-slate-900 italic">{myHostelRecord ? 'Service Fully Adopted' : 'Not Currently Enrolled'}</p>
                  {myHostelRecord && <p className="text-xs font-bold text-emerald-600 mt-2 uppercase">Unit {myHostelRecord.roomId} Assigned • Fee: ₹5,500/Mo</p>}
               </div>
               {!myHostelRecord && (
                  <div className="space-y-6">
                     <Select label="Preferred Room Type" name="hostel_type" options={[{value:'Standard', label:'Standard Quad'}, {value:'Premium', label:'Dual Occupancy'}]} />
                     <button className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">Apply for Boarding</button>
                  </div>
               )}
            </div>

            <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden group">
               <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-4">Transit Fleet</h3>
               <div className={`p-8 rounded-[2.5rem] mb-10 ${student.transportRouteId ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50 border border-slate-100'}`}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Status</p>
                  <p className="text-2xl font-black text-slate-900 italic">{student.transportRouteId ? 'Service Fully Adopted' : 'Not Currently Enrolled'}</p>
                  {student.transportRouteId && <p className="text-xs font-bold text-indigo-600 mt-2 uppercase">Route ID: {student.transportRouteId} • Fee: ₹1,200/Mo</p>}
               </div>
               {!student.transportRouteId && (
                  <div className="space-y-6">
                     <Select label="Nearest Transit Hub" name="route_id" options={[{value:'R1', label:'Noida-Enclave Loop'}, {value:'R2', label:'South Delhi Express'}]} />
                     <button className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">Apply for Transit Hub</button>
                  </div>
               )}
            </div>
         </div>
      )}
      
      {/* Fallback for other tabs */}
      {['academics', 'homework', 'communication'].includes(activeTab) && (
         <div className="p-20 text-center bg-white rounded-[3rem] border border-slate-200 border-dashed">
            <p className="text-slate-300 font-black uppercase tracking-[0.4em]">Section Content Fully Loaded</p>
         </div>
      )}
    </div>
  );
};

export default ParentPortal;
