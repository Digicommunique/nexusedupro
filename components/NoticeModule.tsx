
import React, { useState } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select, FileUpload } from './FormLayout';
import { Notice, AppSettings } from '../types';

interface NoticeModuleProps {
  settings: AppSettings;
  notices: Notice[];
  onAddNotice: (notice: Notice) => void;
  onDeleteNotice: (id: string) => void;
}

const NoticeModule: React.FC<NoticeModuleProps> = ({ settings, notices, onAddNotice, onDeleteNotice }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'board'>('board');

  const handleCreateNotice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Process checkboxes for target audience
    const targets: any[] = [];
    if (formData.get('target_teacher')) targets.push('Teacher');
    if (formData.get('target_staff')) targets.push('Non-Teaching Staff');
    if (formData.get('target_parent')) targets.push('Parent');
    if (formData.get('target_public')) targets.push('Public');

    const newNotice: Notice = {
      id: `NOT-${Date.now()}`,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      senderRole: formData.get('senderRole') as any,
      senderName: formData.get('senderName') as string,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      targetAudience: targets,
      priority: formData.get('priority') as any,
    };

    onAddNotice(newNotice);
    setActiveTab('board');
    alert('Notice published across institutional channels!');
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'Urgent': return 'bg-rose-500 text-white';
      case 'High': return 'bg-amber-500 text-white';
      case 'Medium': return 'bg-indigo-500 text-white';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-500 underline-offset-8">Official Notice Board</h1>
          <p className="text-slate-500 font-medium italic">Omni-channel communication from Principal, Admin & Directorate.</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {[
            { id: 'board', label: 'Bulletin Board' },
            { id: 'create', label: 'Compose Notice' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'create' && (
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleCreateNotice}>
            <FormSection title="Notice Architect" description="Draft official communication for institutional stakeholders.">
              <div className="lg:col-span-3 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select label="Issuing Authority" name="senderRole" required options={[{value:'Principal', label:'The Principal'}, {value:'Admin', label:'Administration'}, {value:'Director', label:'Board of Directors'}]} />
                  <Input label="Authorized Name" name="senderName" required placeholder="Authorized signatory name" />
                </div>
                
                <Input label="Notice Subject / Title" name="title" required placeholder="e.g. Annual Sports Day Postponement" />
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Body</label>
                  <textarea name="content" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm font-medium h-48 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" placeholder="Enter the official message content here..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                   <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Target Audience</p>
                      <div className="grid grid-cols-2 gap-4">
                         {[
                           {id: 'target_teacher', label: 'Teachers'},
                           {id: 'target_staff', label: 'Staff'},
                           {id: 'target_parent', label: 'Parents'},
                           {id: 'target_public', label: 'Website (Public)'}
                         ].map(t => (
                           <label key={t.id} className="flex items-center gap-3 cursor-pointer group">
                             <input type="checkbox" name={t.id} className="w-4 h-4 rounded-lg text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                             <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">{t.label}</span>
                           </label>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-6">
                      <Select label="Priority Level" name="priority" required options={[{value:'Low', label:'Regular'}, {value:'Medium', label:'Informational'}, {value:'High', label:'Important'}, {value:'Urgent', label:'Immediate Action'}]} />
                      <FileUpload label="Attach Circular / Document (PDF/JPG)" name="attachment" />
                   </div>
                </div>

                <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all">
                  Broadcast Circular
                </button>
              </div>
            </FormSection>
          </form>
        </div>
      )}

      {activeTab === 'board' && (
        <div className="grid grid-cols-1 gap-8">
           {notices.length === 0 ? (
             <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-200 border-dashed border-4">
                <div className="flex flex-col items-center gap-4 opacity-20">
                   <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 2v6h6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 13H8M16 17H8M10 9H8" /></svg>
                   <p className="text-sm font-black uppercase tracking-[0.4em]">No official notices active</p>
                </div>
                <button onClick={() => setActiveTab('create')} className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Issue First Notice</button>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {notices.map(notice => (
                  <div key={notice.id} className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col relative">
                     <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                     </div>
                     <div className="p-10 flex-1">
                        <div className="flex justify-between items-start mb-8">
                           <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getPriorityColor(notice.priority)} shadow-sm`}>
                             {notice.priority}
                           </span>
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{notice.date}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-4 leading-tight group-hover:text-indigo-600 transition-colors">{notice.title}</h3>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed line-clamp-4 italic">"{notice.content}"</p>
                        
                        <div className="mt-10 pt-6 border-t border-slate-50">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-lg">
                                {notice.senderRole[0]}
                              </div>
                              <div>
                                 <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{notice.senderName}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{notice.senderRole}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="px-10 py-5 bg-slate-50 flex justify-between items-center group-hover:bg-indigo-50 transition-colors">
                        <div className="flex gap-1">
                           {notice.targetAudience.map(t => (
                             <span key={t} title={t} className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-300"></span>
                           ))}
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => onDeleteNotice(notice.id)} className="p-2 text-rose-300 hover:text-rose-600 transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                           <button className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-md">Full Circ.</button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default NoticeModule;
