
import React from 'react';
import { COLORS, EVENT_COLORS } from '../constants';

const MONTHS = [
  'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 
  'OCTOBER', 'NOVEMBER', 'DECEMBER', 'JANUARY', 'FEBRUARY', 'MARCH'
];

const AcademicPlanner: React.FC = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Mock function to determine if a day is Sunday (visual representation)
  const isSunday = (day: number, monthIdx: number) => {
    // Arbitrary pattern for mock UI
    return (day + monthIdx) % 7 === 0;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header Section */}
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: COLORS.primary }}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Annual Academic Planner</h1>
            <p className="text-slate-400 font-medium">Visualizing institutional milestones for Session 2025-26 (Current)</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          {Object.entries(EVENT_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-100 shadow-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{type}</span>
            </div>
          ))}
          <button className="ml-4 px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Export HQ PDF
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-6 bg-slate-900 text-white text-lg font-black border-r border-b border-slate-800">D / M</th>
              {MONTHS.map((month) => (
                <th key={month} className="p-0 border-r border-b border-slate-200 min-w-[120px]">
                  <div className="py-6 px-4 text-white font-black tracking-widest text-sm relative overflow-hidden flex items-center justify-center h-full" style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)` }}>
                    <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                    <span className="relative z-10">{month}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day} className="group">
                <td className="p-6 text-center font-black text-slate-900 bg-slate-900/5 group-hover:bg-slate-900 group-hover:text-white transition-all border-r border-b border-slate-200">
                  {day}
                </td>
                {MONTHS.map((_, mIdx) => {
                  const sunday = isSunday(day, mIdx);
                  return (
                    <td 
                      key={mIdx} 
                      className={`p-4 border-r border-b border-slate-100 min-h-[60px] relative transition-all ${sunday ? 'bg-rose-50/50' : 'hover:bg-indigo-50/30'}`}
                    >
                      {sunday && (
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-rose-500 uppercase">SUN</span>
                          <div className="mt-auto h-1 w-full bg-rose-200 rounded-full" />
                        </div>
                      )}
                      {!sunday && (
                         <div className="h-full flex flex-col justify-between">
                            <span className="text-[9px] font-bold text-slate-300 uppercase">{['MON','TUE','WED','THU','FRI','SAT'][(day+mIdx)%6]}</span>
                         </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AcademicPlanner;
