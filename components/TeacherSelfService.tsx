
import React, { useState } from 'react';
import { Staff, StaffAttendance, AppSettings } from '../types';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';

interface TeacherSelfServiceProps {
  teacher: Staff;
  attendance: StaffAttendance[];
  settings: AppSettings;
}

const TeacherSelfService: React.FC<TeacherSelfServiceProps> = ({ teacher, attendance, settings }) => {
  const [activeSubTab, setActiveSubTab] = useState<'attendance' | 'leave' | 'payroll'>('attendance');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Self Service Terminal</h2>
        <div className="flex p-1 bg-slate-50 rounded-xl">
           {['attendance', 'leave', 'payroll'].map(t => (
             <button 
               key={t} 
               onClick={() => setActiveSubTab(t as any)} 
               className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      {activeSubTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-32 h-32 relative mb-8">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-indigo-600" strokeDasharray={364} strokeDashoffset={364 - (364 * 0.94)} strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-slate-800">94%</span>
                 </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase italic mb-2">Service Regularity</h3>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Active Academic Cycle</p>
           </div>
           
           <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <h4 className="text-lg font-black uppercase tracking-tight italic">Bio-Metric Log Archive</h4>
                 <button className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100">Export CSV</button>
              </div>
              <div className="overflow-y-auto max-h-[400px]">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 sticky top-0">
                       <tr className="border-b border-slate-100">
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase">Date</th>
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase text-center">In Time</th>
                          <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {attendance.map(a => (
                         <tr key={a.id} className="hover:bg-slate-50/50 transition-all">
                            <td className="px-8 py-4 text-sm font-bold text-slate-600">{a.date}</td>
                            <td className="px-8 py-4 text-sm font-black text-slate-400 text-center font-mono">08:45 AM</td>
                            <td className="px-8 py-4 text-right">
                               <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${a.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                 {a.status}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'leave' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <form onSubmit={(e) => { e.preventDefault(); alert('Leave Requisition Sent to Principal'); }}>
              <FormSection title="Leave Requisition" description="Submit a formal request for institutional leave.">
                 <div className="lg:col-span-3 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <Input label="Departure" name="start" type="date" required />
                       <Input label="Expected Return" name="end" type="date" required />
                    </div>
                    <Select label="Nature of Leave" name="type" required options={[{value:'Sick', label:'Medical'}, {value:'Casual', label:'Personal'}, {value:'Annual', label:'Vacation'}]} />
                    <textarea className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm h-32 resize-none" placeholder="Provide a professional justification for HR archival..."></textarea>
                    <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all">Submit to Directorate</button>
                 </div>
              </FormSection>
           </form>

           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 bg-indigo-50/20">
                 <h4 className="text-lg font-black uppercase tracking-tight italic">Requisition Status</h4>
              </div>
              <div className="p-8 space-y-6">
                 {[1, 2].map(i => (
                   <div key={i} className="p-6 rounded-3xl border border-slate-100 bg-white shadow-sm flex items-center justify-between">
                      <div>
                         <p className="text-sm font-black text-slate-800 uppercase italic">Casual Leave Request</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">12 Mar → 14 Mar • ID: REQ-0{i}A</p>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-widest">Awaiting Principal</span>
                   </div>
                 ))}
                 <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total Monthly Allowance: 2 Days Paid</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'payroll' && (
        <div className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { month: 'March 2025', status: 'Generated', amount: '₹48,500' },
                { month: 'February 2025', status: 'Settled', amount: '₹47,200' },
                { month: 'January 2025', status: 'Settled', amount: '₹47,200' }
              ].map((p, idx) => (
                <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:border-indigo-400 transition-all group flex flex-col justify-between h-72">
                   <div>
                      <div className="flex justify-between items-start mb-6">
                         <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${p.status === 'Generated' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>{p.status}</span>
                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner italic font-serif">₹</div>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-1">{p.month}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Realized: {p.amount}</p>
                   </div>
                   <button className="w-full py-3.5 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-105 transition-all">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Download Pay Slip
                   </button>
                </div>
              ))}
           </div>
           
           <div className="p-12 bg-slate-900 rounded-[4rem] text-white flex flex-col md:flex-row justify-between items-center gap-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                 <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              </div>
              <div className="max-w-xl">
                 <h4 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Financial Support Hub</h4>
                 <p className="text-lg font-medium text-white/60 leading-relaxed italic">For any discrepancy in calculated allowances or unpaid leaves, please contact the institutional accountant via the internal ticketing system.</p>
              </div>
              <button className="px-10 py-5 bg-white text-slate-900 rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all">Discrepancy Ticket</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSelfService;
