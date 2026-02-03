
import React from 'react';
import { Student, Staff } from '../types';
import { COLORS } from '../constants';

interface CredentialRegistryProps {
  students: Student[];
  staff: Staff[];
}

const CredentialRegistry: React.FC<CredentialRegistryProps> = ({ students, staff }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-500 underline-offset-8">Credential Vault</h1>
          <p className="text-slate-500 font-medium mt-2 italic">Institutional Master Registry for User Passwords & Access Keys.</p>
        </div>
        <div className="px-6 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
          Master Access Only
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Staff Credentials */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
            <h3 className="text-xl font-black uppercase tracking-tight italic">Staff Directory</h3>
            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{staff.length} Authorized Entities</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Profile</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">System ID</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Access Password</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {staff.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <img src={s.photo || `https://picsum.photos/seed/${s.id}/40`} className="w-10 h-10 rounded-xl object-cover" alt="" />
                        <div>
                          <p className="text-sm font-black text-slate-800 uppercase">{s.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{s.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-xs font-black text-slate-400 font-mono">{s.staffId}</td>
                    <td className="px-8 py-4 text-right">
                      <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black tracking-widest font-mono border border-indigo-100">
                        {s.password || 'nexus@2025'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Credentials */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 bg-indigo-600 text-white flex justify-between items-center">
            <h3 className="text-xl font-black uppercase tracking-tight italic">Student Directory</h3>
            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{students.length} Enrolled Entities</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Resident</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Enrolment ID</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Access Password</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <img src={s.photo || `https://picsum.photos/seed/${s.id}/40`} className="w-10 h-10 rounded-xl object-cover" alt="" />
                        <div>
                          <p className="text-sm font-black text-slate-800 uppercase">{s.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{s.grade} • SEC {s.section}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-xs font-black text-slate-400 font-mono">{s.studentId}</td>
                    <td className="px-8 py-4 text-right">
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black tracking-widest font-mono border border-emerald-100">
                        {s.password || 'EDU-KEY-2025'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="p-10 bg-slate-900 rounded-[3rem] text-white flex justify-between items-center relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-8 opacity-5">
           <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
         </div>
         <div>
            <h3 className="text-2xl font-black italic uppercase tracking-tight mb-2">Security Directive</h3>
            <p className="text-sm font-medium text-white/60 max-w-xl">Super Administrators are authorized to view all institutional access keys. Please maintain strict confidentiality when accessing this registry.</p>
         </div>
         <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Download Encrypted Backup</button>
      </div>
    </div>
  );
};

export default CredentialRegistry;
