
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { getDashboardInsight } from '../geminiService';
import { COLORS } from '../constants';
import { Notice, Student, Staff, TransportRoute, Examination } from '../types';

interface DashboardProps {
  notices: Notice[];
  students: Student[];
  staff: Staff[];
  transportRoutes: TransportRoute[];
  exams: Examination[];
}

const Dashboard: React.FC<DashboardProps> = ({ notices, students, staff, transportRoutes, exams }) => {
  const [insight, setInsight] = useState<string>('Aggregating institutional telemetry...');
  
  // 360° Data Aggregators
  const studentDistribution = useMemo(() => {
    const grades: Record<string, number> = {};
    students.forEach(s => {
      grades[s.grade] = (grades[s.grade] || 0) + 1;
    });
    return Object.entries(grades).map(([name, value]) => ({ name, value }));
  }, [students]);

  const transportStats = useMemo(() => {
    return transportRoutes.map(r => ({
      name: r.name.split(' ')[0],
      capacity: 40, // Default for viz
      occupied: students.filter(s => s.transportRouteId === r.id).length
    }));
  }, [transportRoutes, students]);

  const feeMetrics = {
    target: 1200000,
    collected: 840000,
    outstanding: 360000
  };

  const attendanceRate = 94.2;

  useEffect(() => {
    getDashboardInsight({
      totalStudents: students.length,
      totalStaff: staff.length,
      attendance: attendanceRate,
      genderRatio: '52:48'
    }).then(setInsight);
  }, [students, staff]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 360° Matrix Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none border-b-8 border-indigo-500 pb-2 inline-block">360° ADMIN COCKPIT</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-4">Omni-Channel Institutional Command</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center min-w-[120px]">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee Realization</span>
              <span className="text-lg font-black text-emerald-600 italic">70%</span>
           </div>
           <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-xl flex flex-col items-center min-w-[120px]">
              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Active Exams</span>
              <span className="text-lg font-black italic">{exams.length}</span>
           </div>
        </div>
      </div>

      {/* Primary Intelligence Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
           <div 
             className="rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden h-full flex items-center"
             style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)` }}
           >
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
               <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45l8.15 14.1H3.85L12 5.45z"/></svg>
             </div>
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
               <div className="w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-3xl flex items-center justify-center shrink-0 border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)] animate-pulse">
                 <svg className="w-12 h-12 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <div>
                 <div className="flex items-center gap-3 mb-4">
                   <span className="bg-emerald-400 text-slate-900 px-6 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-lg">Predictive Intelligence</span>
                   <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Session Cycle 2025</span>
                 </div>
                 <h3 className="text-3xl font-black leading-tight italic tracking-tight text-white/95">
                   "{insight}"
                 </h3>
               </div>
             </div>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center group hover:border-indigo-400 transition-all">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Daily Presence</p>
           <div className="relative mb-6">
              <svg className="w-32 h-32 transform -rotate-90">
                 <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                 <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-indigo-600 transition-all duration-1000" strokeDasharray={364} strokeDashoffset={364 - (364 * attendanceRate) / 100} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-2xl font-black text-slate-800">{attendanceRate}%</span>
              </div>
           </div>
           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Optimized Wing Efficiency</p>
        </div>
      </div>

      {/* 360° Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Class Distribution (Pie) */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-800 uppercase italic">Class Pulse</h3>
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
           </div>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={studentDistribution} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                       {studentDistribution.map((_, i) => <Cell key={i} fill={[COLORS.primary, COLORS.secondary, COLORS.accent][i % 3]} />)}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-8 grid grid-cols-2 gap-3">
              {studentDistribution.map((item, i) => (
                <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                   <span className="text-xs font-black text-slate-800">{item.value}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Bus Routes Hub */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-800 uppercase italic">Transit Flow</h3>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Live Logistics</span>
           </div>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={transportStats} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="occupied" fill={COLORS.primary} radius={[0, 10, 10, 0]} barSize={20} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-3 mt-8">
              {transportRoutes.map(r => (
                <div key={r.id} className="flex justify-between items-center p-3 rounded-2xl border border-slate-50 bg-slate-50/50">
                   <span className="text-[10px] font-black text-slate-800 uppercase italic">{r.name}</span>
                   <span className="px-3 py-1 bg-white text-[9px] font-black text-indigo-600 rounded-lg shadow-sm">Active</span>
                </div>
              ))}
           </div>
        </div>

        {/* Fee Realization (Area Chart) */}
        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden flex flex-col">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <h3 className="text-xl font-black uppercase italic tracking-tight mb-8 text-indigo-400">Financial Liquidity</h3>
           <div className="flex-1 flex flex-col justify-center">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-2">Realized Collection</p>
              <h2 className="text-5xl font-black italic tracking-tighter mb-8">₹8.40L</h2>
              <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 p-1">
                 <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)]" style={{ width: '70%' }}></div>
              </div>
              <div className="flex justify-between mt-4">
                 <span className="text-[9px] font-black text-white/30 uppercase">Goal: ₹12L</span>
                 <span className="text-[9px] font-black text-emerald-400 uppercase">30% To Target</span>
              </div>
           </div>
        </div>
      </div>

      {/* Secondary Intelligence Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Notices (Unified Feed) */}
         <div className="lg:col-span-4 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
               <h3 className="text-xl font-black uppercase italic tracking-tight">Bulletin Feed</h3>
               <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
               </div>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto max-h-[500px] custom-scrollbar">
               {notices.map(n => (
                 <div key={n.id} className="p-6 rounded-[2rem] border border-slate-50 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all cursor-pointer group border-l-8 border-l-indigo-500">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">{n.date}</span>
                       <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase ${n.priority === 'Urgent' ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{n.priority}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 uppercase group-hover:text-indigo-600 transition-colors leading-tight">{n.title}</h4>
                 </div>
               ))}
            </div>
         </div>

         {/* Examinations & Results Board */}
         <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black text-slate-800 uppercase italic">Assessment Radar</h3>
                  <button className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">Live Entry Mode</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exams.map(e => (
                    <div key={e.id} className="p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/30 flex justify-between items-center group hover:bg-white hover:shadow-xl transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-white flex flex-col items-center justify-center shadow-lg group-hover:bg-slate-900 group-hover:text-white transition-all">
                             <span className="text-[9px] font-black uppercase opacity-40">MAR</span>
                             <span className="text-xl font-black">{e.date.split('-')[2]}</span>
                          </div>
                          <div>
                             <h4 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">{e.title}</h4>
                             <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{e.grade} • {e.subject}</p>
                          </div>
                       </div>
                       <svg className="w-6 h-6 text-slate-200 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-emerald-500 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex items-center justify-between group">
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-1 opacity-60">Result Yield</p>
                     <h4 className="text-3xl font-black italic uppercase tracking-tighter">98.4% Pass Rate</h4>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
               </div>
               
               <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-rose-400 transition-all">
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">Risk Indicator</p>
                     <h4 className="text-3xl font-black italic uppercase tracking-tighter text-rose-600">12 Defaulters</h4>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Operational Footer Context */}
      <div className="bg-slate-50 p-12 rounded-[4rem] flex flex-col md:flex-row justify-between items-center gap-10 border border-slate-200">
         <div className="max-w-xl">
            <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight mb-4">Strategic Capacity Observation</h4>
            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">The institutional matrix shows optimal synchronization across academic and transport verticals. Current <span className="text-indigo-600 font-black">liquidity health stands at 70%</span>, suggesting focused outreach for fee realization in Senior Wings for the upcoming fiscal reset.</p>
         </div>
         <div className="flex gap-4">
            <button className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all">Global Health Audit</button>
            <button className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-sm hover:bg-slate-50 transition-all">Export Cockpit PDF</button>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
