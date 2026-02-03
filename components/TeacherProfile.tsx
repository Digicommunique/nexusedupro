
import React from 'react';
import { Staff } from '../types';
import { COLORS } from '../constants';

interface TeacherProfileProps {
  teacher: Staff;
}

const TeacherProfile: React.FC<TeacherProfileProps> = ({ teacher }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
         <div className="h-48 relative bg-slate-900" style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)` }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
         </div>
         <div className="px-12 pb-12">
            <div className="flex flex-col md:flex-row items-end gap-8 -mt-20 relative z-10">
               <img src={teacher.photo || `https://picsum.photos/seed/${teacher.id}/200`} className="w-40 h-40 rounded-[3rem] border-8 border-white shadow-2xl object-cover" alt="" />
               <div className="pb-4 flex-1">
                  <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{teacher.name}</h1>
                  <p className="text-lg font-black text-indigo-500 uppercase tracking-widest mt-2">{teacher.role} • {teacher.staffId}</p>
               </div>
               <button className="mb-4 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all">Edit Credentials</button>
            </div>

            <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="space-y-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Contact Matrix</p>
                     <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase">Primary Phone</p>
                           <p className="text-sm font-bold text-slate-800">{teacher.guardianContact}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase">Residential Address</p>
                           <p className="text-sm font-bold text-slate-800 leading-relaxed">{teacher.address}</p>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Bio-Metric Info</p>
                     <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 grid grid-cols-2 gap-4">
                        <div><p className="text-[8px] font-black text-slate-400 uppercase">Gender</p><p className="text-sm font-bold text-slate-800">{teacher.gender}</p></div>
                        <div><p className="text-[8px] font-black text-slate-400 uppercase">Blood Gr.</p><p className="text-sm font-bold text-slate-800">{teacher.bloodGroup}</p></div>
                        <div><p className="text-[8px] font-black text-slate-400 uppercase">DOB</p><p className="text-sm font-bold text-slate-800">{teacher.dob}</p></div>
                        <div><p className="text-[8px] font-black text-slate-400 uppercase">Status</p><p className="text-sm font-bold text-slate-800">{teacher.relationshipStatus}</p></div>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-2 space-y-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Professional Background</p>
                     <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Highest Qualification</p>
                           <p className="text-lg font-black text-slate-900 italic uppercase underline decoration-indigo-200 underline-offset-4">{teacher.qualification}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Institution Tenure</p>
                           <p className="text-lg font-black text-slate-900 uppercase">Joined {teacher.joiningDate}</p>
                        </div>
                        <div className="md:col-span-2">
                           <p className="text-[9px] font-black text-slate-400 uppercase mb-4">Uploaded Documents</p>
                           <div className="flex flex-wrap gap-3">
                              {['Degree Certificate', 'Marksheet Archive', 'Highest Specialization'].map(doc => (
                                <div key={doc} className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3 group hover:bg-indigo-600 transition-all cursor-pointer">
                                   <svg className="w-4 h-4 text-indigo-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                   <span className="text-[9px] font-black text-indigo-700 group-hover:text-white uppercase tracking-widest">{doc}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Emergency Reach</p>
                     <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div><p className="text-[8px] font-black text-slate-400 uppercase">Guardian</p><p className="text-sm font-bold text-slate-800">{teacher.guardianName}</p></div>
                        <div><p className="text-[8px] font-black text-slate-400 uppercase">Relation</p><p className="text-sm font-bold text-slate-800">{teacher.guardianRelationship}</p></div>
                        <div><p className="text-[8px] font-black text-slate-400 uppercase">Address</p><p className="text-sm font-bold text-slate-800 truncate">{teacher.guardianAddress}</p></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
