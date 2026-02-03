
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  LineChart, Line
} from 'recharts';
import { getDashboardInsight } from '../geminiService';
import { COLORS } from '../constants';
import { Notice, Student, Staff, TransportRoute, Examination, Donation, StudentFeeRecord } from '../types';

interface DashboardProps {
  notices: Notice[];
  students: Student[];
  staff: Staff[];
  transportRoutes: TransportRoute[];
  exams: Examination[];
  donations: Donation[];
  feeRecords: StudentFeeRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  notices, students, staff, transportRoutes, exams, donations, feeRecords 
}) => {
  const [insight, setInsight] = useState<string>('Calibrating institutional intelligence...');
  
  // Data Aggregators
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
      occupied: students.filter(s => s.transportRouteId === r.id).length
    }));
  }, [transportRoutes, students]);

  const totalDonations = useMemo(() => 
    donations.reduce((acc, curr) => acc + (curr.amount || 0), 0), 
  [donations]);

  const feeStats = useMemo(() => {
    const totalDue = feeRecords.reduce((acc, curr) => acc + (curr.totalAmount - curr.discount), 0);
    const totalPaid = feeRecords.reduce((acc, curr) => acc + curr.paidAmount, 0);
    const outstanding = totalDue - totalPaid;
    return { totalDue, totalPaid, outstanding, percent: totalDue > 0 ? (totalPaid / totalDue) * 100 : 0 };
  }, [feeRecords]);

  // Mock Projection Data for Student Growth
  const projectionData = [
    { year: '2021', actual: 450 },
    { year: '2022', actual: 520 },
    { year: '2023', actual: 610 },
    { year: '2024', actual: 780 },
    { year: '2025', actual: 850, projection: 850 },
    { year: '2026', projection: 1100 },
    { year: '2027', projection: 1450 },
  ];

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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 360° Matrix Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45l8.15 14.1H3.85L12 5.45z"/></svg>
        </div>
        <div>
          <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none border-b-[12px] border-indigo-500 pb-2 inline-block">360° ADMIN COCKPIT</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.4em] mt-6 flex items-center gap-3">
             <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
             Omni-Channel Institutional Command Center
          </p>
        </div>
        <div className="flex flex-wrap gap-4 relative z-10">
           <div className="px-6 py-4 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-col items-center min-w-[140px]">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Students Enrolled</span>
              <span className="text-2xl font-black italic">{students.length}</span>
           </div>
           <div className="px-6 py-4 bg-indigo-600 text-white rounded-3xl shadow-xl flex flex-col items-center min-w-[140px]">
              <span className="text-[9px] font-black text-indigo-200 uppercase tracking-widest mb-1">Staff Strength</span>
              <span className="text-2xl font-black italic">{staff.length}</span>
           </div>
           <div className="px-6 py-4 bg-emerald-500 text-white rounded-3xl shadow-xl flex flex-col items-center min-w-[140px]">
              <span className="text-[9px] font-black text-emerald-100 uppercase tracking-widest mb-1">Philanthropy</span>
              <span className="text-2xl font-black italic">₹{(totalDonations/1000).toFixed(1)}k</span>
           </div>
        </div>
      </div>

      {/* Primary Intelligence & Projection Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
           <div 
             className="rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden h-full flex flex-col"
             style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)` }}
           >
             <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
               <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
             </div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 mb-10">
               <div className="w-28 h-28 rounded-[2.5rem] bg-white/10 backdrop-blur-3xl flex items-center justify-center shrink-0 border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                 <svg className="w-14 h-14 text-indigo-200 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <div>
                 <div className="flex items-center gap-3 mb-4">
                   <span className="bg-emerald-400 text-slate-900 px-6 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-lg">AI Visionary Insights</span>
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Session 2025-26</span>
                 </div>
                 <h3 className="text-4xl font-black leading-tight italic tracking-tight text-white/95">
                   "{insight}"
                 </h3>
               </div>
             </div>

             <div className="mt-auto h-48 w-full bg-white/5 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/10">
                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.4em] mb-4">Institutional Growth Projection (5YR)</p>
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={projectionData}>
                      <defs>
                        <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fff" stopOpacity={0.3}/><stop offset="95%" stopColor="#fff" stopOpacity={0}/></linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="actual" stroke="#fff" strokeWidth={4} fill="url(#colorProj)" />
                      <Area type="monotone" dataKey="projection" stroke="#6366f1" strokeWidth={4} strokeDasharray="10 10" fill="transparent" />
                      <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px'}} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center group hover:border-indigo-400 transition-all h-[calc(50%-16px)]">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Attendance Pulse</p>
              <div className="relative mb-6">
                 <svg className="w-36 h-36 transform -rotate-90">
                    <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-50" />
                    <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-indigo-600 transition-all duration-1000" strokeDasharray={402} strokeDashoffset={402 - (402 * attendanceRate) / 100} strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black text-slate-800">{attendanceRate}%</span>
                 </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Sector Efficiency: Optimal</p>
           </div>

           <div className="bg-rose-500 p-10 rounded-[3rem] shadow-xl flex flex-col justify-center items-center text-center text-white h-[calc(50%-16px)] relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 opacity-20">
                 <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Total Arrears</p>
              <h2 className="text-5xl font-black italic tracking-tighter">₹{(feeStats.outstanding/1000).toFixed(1)}k</h2>
              <div className="mt-4 flex items-center gap-2">
                 <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase">Requires Action</span>
              </div>
           </div>
        </div>
      </div>

      {/* Colorful 360° Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Class Pulse (Pie) */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-800 uppercase italic">Grade Matrix</h3>
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
           </div>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={studentDistribution} innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none">
                       {studentDistribution.map((_, i) => <Cell key={i} fill={[COLORS.primary, COLORS.secondary, COLORS.accent, '#ec4899', '#06b6d4'][i % 5]} />)}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}} />
                 </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-8 grid grid-cols-2 gap-3">
              {studentDistribution.slice(0, 4).map((item, i) => (
                <div key={i} className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                   <span className="text-xs font-black text-slate-800">{item.value}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Transit Flow (Bar) */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-800 uppercase italic">Logistics Hub</h3>
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Fleet Active</span>
           </div>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={transportStats} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 900}} width={70} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="occupied" fill={COLORS.primary} radius={[0, 12, 12, 0]} barSize={24} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-3 mt-8">
              {transportRoutes.slice(0, 2).map(r => (
                <div key={r.id} className="flex justify-between items-center p-4 rounded-3xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                   <span className="text-xs font-black text-slate-800 uppercase italic tracking-tighter">{r.name}</span>
                   <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-lg">Operational</span>
                </div>
              ))}
           </div>
        </div>

        {/* Financial Liquidity (Liquid Gauge Visual) */}
        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden flex flex-col">
           <div className="absolute top-0 right-0 p-10 opacity-10">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <h3 className="text-2xl font-black uppercase italic tracking-tight mb-8 text-emerald-400">Fiscal Health</h3>
           <div className="flex-1 flex flex-col justify-center">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-2">Realized Collection Rate</p>
              <h2 className="text-6xl font-black italic tracking-tighter mb-8">{feeStats.percent.toFixed(1)}%</h2>
              <div className="h-6 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 p-1.5">
                 <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)] transition-all duration-[2s]" style={{ width: `${feeStats.percent}%` }}></div>
              </div>
              <div className="flex justify-between mt-6">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Inflow</span>
                    <span className="text-lg font-black text-emerald-400 italic">₹{(feeStats.totalPaid/100000).toFixed(2)}L</span>
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Outstanding</span>
                    <span className="text-lg font-black text-rose-400 italic">₹{(feeStats.outstanding/100000).toFixed(2)}L</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Secondary Matrix: Activity & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Bulletin Board */}
         <div className="lg:col-span-4 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-10 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
               <h3 className="text-2xl font-black uppercase italic tracking-tighter">Events Feed</h3>
               <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
               </div>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto max-h-[550px] custom-scrollbar">
               {notices.map(n => (
                 <div key={n.id} className="p-6 rounded-[2.5rem] border border-slate-50 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all cursor-pointer group border-l-[10px] border-l-indigo-500">
                    <div className="flex justify-between items-start mb-3">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{n.date}</span>
                       <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase ${n.priority === 'Urgent' ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{n.priority}</span>
                    </div>
                    <h4 className="text-base font-black text-slate-800 uppercase group-hover:text-indigo-600 transition-colors leading-tight italic tracking-tight">{n.title}</h4>
                 </div>
               ))}
            </div>
         </div>

         {/* Results & Academic Radar */}
         <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-black text-slate-800 uppercase italic">Assessment Radar</h3>
                  <div className="flex gap-4">
                     <div className="px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">98% Pass Rate</span>
                     </div>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {exams.slice(0, 2).map(e => (
                    <div key={e.id} className="p-10 rounded-[3rem] border border-slate-100 bg-slate-50/30 flex flex-col justify-between group hover:bg-white hover:shadow-2xl transition-all h-64 border-t-8 border-t-indigo-500">
                       <div className="flex justify-between items-start">
                          <div>
                             <h4 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-1">{e.title}</h4>
                             <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.3em]">{e.grade} • {e.subject}</p>
                          </div>
                          <div className="w-14 h-14 rounded-3xl bg-white flex flex-col items-center justify-center shadow-lg group-hover:bg-slate-900 group-hover:text-white transition-all">
                             <span className="text-[10px] font-black uppercase opacity-40">MAR</span>
                             <span className="text-2xl font-black leading-none">{e.date.split('-')[2]}</span>
                          </div>
                       </div>
                       <div className="flex justify-between items-end mt-auto">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrolled: {students.filter(s => s.grade === e.grade).length} Candidates</p>
                          <button className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-48">
               <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-all">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div>
                     <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-1 opacity-80">Activity Hub</p>
                     <h4 className="text-3xl font-black italic uppercase tracking-tighter">12 New Clubs</h4>
                  </div>
                  <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                     <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
               </div>
               
               <div className="bg-gradient-to-br from-emerald-400 to-emerald-700 p-10 rounded-[3rem] text-white shadow-xl flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div>
                     <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-1 opacity-80">Fundraising Pulse</p>
                     <h4 className="text-3xl font-black italic uppercase tracking-tighter">₹{(totalDonations/1000).toFixed(1)}k Raised</h4>
                  </div>
                  <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                     <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Strategic Observational Footer */}
      <div className="bg-slate-50 p-16 rounded-[4.5rem] flex flex-col md:flex-row justify-between items-center gap-12 border border-slate-200 shadow-inner relative overflow-hidden">
         <div className="absolute top-0 left-0 p-8 opacity-5">
            <svg className="w-64 h-64 rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
         </div>
         <div className="max-w-2xl relative z-10">
            <h4 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight mb-6">Strategic Capacity Matrix</h4>
            <p className="text-lg font-medium text-slate-500 leading-relaxed italic">The institutional matrix displays high synchronization across academic and transport verticals. Current <span className="text-indigo-600 font-black">fee realization health stands at {feeStats.percent.toFixed(1)}%</span>, suggesting focused outreach for Arrear Recovery in Senior Wings before the final assessment reset.</p>
         </div>
         <div className="flex gap-4 relative z-10">
            <button className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all">Audit Institutional Health</button>
            <button className="px-12 py-6 bg-white text-slate-900 border border-slate-200 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-sm hover:bg-slate-100 transition-all">Export 360° Dataset</button>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
