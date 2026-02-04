
import React, { useState } from 'react';
import { FormSection, Input, Select, FileUpload } from './FormLayout';
import { AppSettings, Staff } from '../types';
import { COLORS } from '../constants';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
  staff: Staff[];
  onUpdateStaff: (staffId: string, updates: Partial<Staff>) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate, staff, onUpdateStaff }) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'credentials'>('branding');
  const [previews, setPreviews] = useState<Record<string, string>>({
    logo: settings.logo || '',
    principal: settings.principalSignature || '',
    director: settings.directorSignature || '',
    vicePrincipal: settings.vicePrincipalSignature || '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [key]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated: AppSettings = {
      schoolName: formData.get('schoolName') as string,
      branchName: formData.get('branchName') as string,
      address: formData.get('address') as string,
      logo: previews.logo,
      principalSignature: previews.principal,
      directorSignature: previews.director,
      vicePrincipalSignature: previews.vicePrincipal,
    };
    onUpdate(updated);
    alert('Institutional Branding Protocols Updated.');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic inline-block border-b-8 border-indigo-500 pb-2">Institutional Configuration</h1>
          <p className="text-slate-500 font-bold text-sm mt-3 uppercase tracking-widest italic">Branding, Address & Staff Authorization Hub</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {[
            { id: 'branding', label: 'Identity & Signatures' },
            { id: 'credentials', label: 'Staff Access Matrix' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === t.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             {/* Left: General & Signatures */}
             <div className="lg:col-span-8 space-y-10">
                <FormSection title="Official Identifiers" description="Official names realized on all institutional documents.">
                   <Input label="Institutional Name" name="schoolName" required defaultValue={settings.schoolName} />
                   <Input label="Branch / Campus ID" name="branchName" required defaultValue={settings.branchName} />
                   <div className="lg:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Institutional Registered Address</label>
                      <textarea 
                        name="address" 
                        required 
                        defaultValue={settings.address}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm h-32 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                        placeholder="Complete physical address for bills and certificates..."
                      ></textarea>
                   </div>
                </FormSection>

                <FormSection title="Authorized Signatures" description="Encrypted digital signatures for report cards and receipts.">
                   <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        { id: 'principal', label: 'Principal' },
                        { id: 'director', label: 'Director' },
                        { id: 'vicePrincipal', label: 'Vice Principal' }
                      ].map(sig => (
                        <div key={sig.id} className="space-y-4">
                           <div className="aspect-[3/1] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden group hover:border-indigo-400 transition-all">
                              {previews[sig.id] ? (
                                <img src={previews[sig.id]} className="h-full object-contain p-4" alt="" />
                              ) : (
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">No Signature</span>
                              )}
                              <input type="file" onChange={(e) => handleFileChange(e, sig.id)} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                           </div>
                           <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-widest">{sig.label}</p>
                        </div>
                      ))}
                   </div>
                </FormSection>
             </div>

             {/* Right: Logo & Commit */}
             <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
                   <h3 className="text-xl font-black text-slate-900 uppercase italic mb-10">Institutional Logo</h3>
                   <div className="relative group">
                      <div className="w-52 h-52 rounded-[3.5rem] bg-slate-50 border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden transition-transform group-hover:rotate-3">
                         {previews.logo ? (
                           <img src={previews.logo} className="w-full h-full object-cover" alt="" />
                         ) : (
                           <svg className="w-16 h-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                         )}
                         <input type="file" onChange={(e) => handleFileChange(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                   </div>
                   <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] max-w-xs">Upload primary logo for centralized branding.</p>
                </div>

                <div className="p-10 bg-slate-900 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                   </div>
                   <h4 className="text-xl font-black uppercase italic tracking-tight mb-4 relative z-10">Commit Branding</h4>
                   <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-10 relative z-10 leading-relaxed italic">Realize identity changes across all system-generated financial and academic documents.</p>
                   <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10">Save Protocols</button>
                </div>
             </div>
          </div>
        </form>
      )}

      {activeTab === 'credentials' && (
        <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-8">
           <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-xl overflow-hidden">
              <div className="flex justify-between items-center mb-12">
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Access Matrix Console</h3>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mt-3">Staff Authorization Ledger</p>
                 </div>
                 <div className="px-5 py-2 bg-rose-50 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-100">Audit Active</div>
              </div>

              <div className="overflow-x-auto rounded-[3rem] border border-slate-100 shadow-inner">
                 <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white">
                       <tr className="text-[9px] font-black uppercase tracking-[0.2em]">
                          <th className="px-10 py-6">Staff Profile</th>
                          <th className="px-10 py-6">System ID</th>
                          <th className="px-10 py-6">Secure Access Key</th>
                          <th className="px-10 py-6 text-right">Ledger Sync</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {staff.map(s => (
                         <tr key={s.id} className="hover:bg-indigo-50/20 transition-all group">
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-6">
                                  <img src={s.photo || `https://picsum.photos/seed/${s.id}/80`} className="w-16 h-16 rounded-2xl object-cover shadow-sm border-2 border-white" alt="" />
                                  <div>
                                     <p className="text-sm font-black text-slate-800 uppercase tracking-tighter leading-none mb-1.5">{s.name}</p>
                                     <span className="px-2 py-0.5 bg-indigo-50 text-[8px] font-black text-indigo-500 uppercase rounded">{s.role}</span>
                                  </div>
                               </div>
                            </td>
                            <td className="px-10 py-6 font-mono text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600">{s.staffId}</td>
                            <td className="px-10 py-6">
                               <div className="max-w-[200px] relative">
                                  <input 
                                    type="password" 
                                    defaultValue={s.password || 'admin'} 
                                    onBlur={(e) => onUpdateStaff(s.id, { password: e.target.value })}
                                    className="w-full px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black tracking-[0.3em] outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                                  />
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500"></div>
                               </div>
                            </td>
                            <td className="px-10 py-6 text-right">
                               <button 
                                 onClick={() => {
                                   const newP = prompt(`Reset Password for ${s.name}:`, s.password || 'admin');
                                   if (newP) onUpdateStaff(s.id, { password: newP });
                                 }}
                                 className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-600 transition-all"
                               >
                                  Update Key
                               </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           <div className="p-12 bg-indigo-50 border border-indigo-100 rounded-[4rem] flex flex-col md:flex-row items-center gap-10">
              <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shrink-0">
                 <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div className="flex-1">
                 <h4 className="text-xl font-black text-indigo-900 uppercase italic mb-2 tracking-tight">Security Protocol 09</h4>
                 <p className="text-sm font-medium text-indigo-700/60 leading-relaxed italic">Institutional passwords are encrypted in the local repository. The system administrator must verify staff identity before performing bulk credential resets.</p>
              </div>
              <button className="px-10 py-4 bg-white text-indigo-600 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all">Clear Authorization Log</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
