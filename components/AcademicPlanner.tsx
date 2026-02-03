
import React, { useState } from 'react';
import { COLORS, EVENT_COLORS } from '../constants';
import { PlannerEvent } from '../types';

const MONTHS = [
  'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 
  'OCTOBER', 'NOVEMBER', 'DECEMBER', 'JANUARY', 'FEBRUARY', 'MARCH'
];

const AcademicPlanner: React.FC = () => {
  const [events, setEvents] = useState<Record<string, PlannerEvent>>({});
  const [activeModal, setActiveModal] = useState<{ day: number, mIdx: number } | null>(null);
  const [inputTitle, setInputTitle] = useState('');
  const [inputType, setInputType] = useState<keyof typeof EVENT_COLORS>('Regular');

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Consistent Sunday logic for institutional calendar visualization
  const isSunday = (day: number, monthIdx: number) => {
    return (day + monthIdx + 1) % 7 === 0;
  };

  const handleCellClick = (day: number, mIdx: number) => {
    setActiveModal({ day, mIdx });
    const key = `${MONTHS[mIdx]}-${day}`;
    if (events[key]) {
      setInputTitle(events[key].title);
      setInputType(events[key].type);
    } else {
      setInputTitle('');
      setInputType('Regular');
    }
  };

  const saveEvent = () => {
    if (!activeModal) return;
    const key = `${MONTHS[activeModal.mIdx]}-${activeModal.day}`;
    
    if (!inputTitle && inputType === 'Regular') {
      const newEvents = { ...events };
      delete newEvents[key];
      setEvents(newEvents);
    } else {
      setEvents({
        ...events,
        [key]: {
          id: key,
          type: inputType,
          title: inputTitle || 'Academic Note'
        }
      });
    }
    setActiveModal(null);
  };

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden relative">
      {/* Event Add Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
             <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight mb-2 underline decoration-indigo-500 underline-offset-8">Configure Milestone</h3>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Scheduling: {MONTHS[activeModal.mIdx]} {activeModal.day}, 2025</p>
             
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Subject</label>
                   <input 
                     value={inputTitle}
                     onChange={(e) => setInputTitle(e.target.value)}
                     placeholder="e.g. Physics Final Exam"
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold"
                   />
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification</label>
                   <div className="grid grid-cols-2 gap-3">
                      {Object.keys(EVENT_COLORS).map((type) => (
                        <button
                          key={type}
                          onClick={() => setInputType(type as any)}
                          className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                            inputType === type ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: EVENT_COLORS[type as keyof typeof EVENT_COLORS] }}></div>
                             {type}
                          </div>
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="mt-10 flex gap-4">
                <button onClick={() => setActiveModal(null)} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Discard</button>
                <button onClick={saveEvent} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Publish</button>
             </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="p-10 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-8 bg-slate-50/50">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl" style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)` }}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Institutional Roadmap</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">Active Planner Console • Session 2025-26</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
          {Object.entries(EVENT_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: color }} />
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-8 bg-[#0f172a] text-white text-2xl font-black border-r border-b border-slate-800 italic tracking-tighter">D / M</th>
              {MONTHS.map((month) => (
                <th key={month} className="p-0 border-r border-b border-slate-200 min-w-[150px]">
                  <div className="py-8 px-6 text-white font-black tracking-[0.2em] text-sm relative overflow-hidden flex items-center justify-center h-full" style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)` }}>
                    <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                    <span className="relative z-10">{month}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day} className="group">
                <td className="p-8 text-center font-black text-3xl text-white bg-[#0f172a] group-hover:bg-[#1e293b] transition-all border-r border-b border-slate-800 italic">
                  {day}
                </td>
                {MONTHS.map((_, mIdx) => {
                  const sunday = isSunday(day, mIdx);
                  const key = `${MONTHS[mIdx]}-${day}`;
                  const event = events[key];
                  
                  return (
                    <td 
                      key={mIdx} 
                      onClick={() => handleCellClick(day, mIdx)}
                      className={`p-4 border-r border-b border-slate-100 min-h-[80px] relative transition-all cursor-pointer group/cell ${sunday ? 'bg-rose-50/20' : 'hover:bg-indigo-50/40'}`}
                    >
                      <div className="flex flex-col h-full min-h-[60px] justify-between">
                         <div className="flex justify-between items-start">
                            <span className={`text-[10px] font-black tracking-widest ${sunday ? 'text-rose-500 border-b-2 border-rose-200 pb-0.5' : 'text-slate-200 group-hover/cell:text-indigo-300'}`}>
                               {sunday ? 'SUN' : ['MON','TUE','WED','THU','FRI','SAT'][(day+mIdx+1)%6]}
                            </span>
                            <div className="opacity-0 group-hover/cell:opacity-100 transition-opacity">
                               <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                            </div>
                         </div>
                         
                         {event && (
                           <div 
                             className="mt-2 p-2 rounded-xl text-white shadow-lg animate-in fade-in slide-in-from-top-1" 
                             style={{ backgroundColor: EVENT_COLORS[event.type] }}
                           >
                              <p className="text-[8px] font-black uppercase tracking-tighter leading-none mb-1 opacity-70">{event.type}</p>
                              <p className="text-[10px] font-black uppercase truncate leading-tight">{event.title}</p>
                           </div>
                         )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-8 bg-slate-900 text-white flex justify-between items-center rounded-b-[3rem]">
         <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">System Ready for Bulk Export</span>
         </div>
         <div className="flex gap-4">
            <button className="px-8 py-3 bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">Clear All Marks</button>
            <button className="px-10 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
               Generate Session Master PDF
            </button>
         </div>
      </div>
    </div>
  );
};

export default AcademicPlanner;
