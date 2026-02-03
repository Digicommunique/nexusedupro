
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  LineChart, Line, Legend
} from 'recharts';
import { getDashboardInsight } from '../geminiService';
import { COLORS } from '../constants';
import { Notice, Student, Staff, TransportRoute, Examination, Donation, StudentFeeRecord, FeeReceipt } from '../types';

interface DashboardProps {
  notices: Notice[];
  students: Student[];
  staff: Staff[];
  transportRoutes: TransportRoute[];
  exams: Examination[];
  donations: Donation[];
  feeRecords: StudentFeeRecord[];
  feeReceipts: FeeReceipt[];
  userRole?: string;
}

const GRADES = ['Pre-Nursery', 'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

const Dashboard: React.FC<DashboardProps> = ({ 
  notices, students, staff, transportRoutes, exams, donations, feeRecords, feeReceipts, userRole
}) => {
  const [insight, setInsight] = useState<string>('Calibrating institutional intelligence...');
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  
  // 360 View Filters
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');

  // Granular Filter Logic
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchGrade = !selectedGrade || s.grade === selectedGrade;
      const matchSection = !selectedSection || s.section === selectedSection;
      return matchGrade && matchSection;
    });
  }, [students, selectedGrade, selectedSection]);

  const filteredFeeReceipts = useMemo(() => {
    if (!selectedGrade && !selectedSection) return feeReceipts;
    const studentIds = new Set(filteredStudents.map(s => s.id));
    return feeReceipts.filter(r => studentIds.has(r.studentId));
  }, [feeReceipts, filteredStudents, selectedGrade, selectedSection]);

  // Data Aggregators for 360 View
  const gradeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredStudents.forEach(s => counts[s.grade] = (counts[s.grade] || 0) + 1);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredStudents]);

  const religionStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredStudents.forEach(s => {
      const rel = s.religion || 'Unknown';
      counts[rel] = (counts[rel] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredStudents]);

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredStudents.forEach(s => {
      const cat = s.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredStudents]);

  const feeStats = useMemo(() => {
    const totalDue = feeRecords
      .filter(fr => filteredStudents.some(s => s.id === fr.studentId))
      .reduce((acc, curr) => acc + (curr.totalAmount - curr.discount), 0);
    const totalPaid = filteredFeeReceipts.reduce((acc, curr) => acc + curr.amountPaid, 0);
    const outstanding = totalDue - totalPaid;
    return { totalDue, totalPaid, outstanding, percent: totalDue > 0 ? (totalPaid / totalDue) * 100 : 0 };
  }, [feeRecords, filteredFeeReceipts, filteredStudents]);

  useEffect(() => {
    getDashboardInsight({
      totalStudents: filteredStudents.length,
      totalStaff: staff.length,
      attendance: 94.2,
      genderRatio: '52:48',
      segment: selectedGrade ? `${selectedGrade} ${selectedSection}` : 'Global'
    }).then(setInsight);
  }, [filteredStudents, staff, selectedGrade, selectedSection]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 360° Filter Matrix */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col md:flex-row items-center gap-8 sticky top-4 z-[45] backdrop-blur-md bg-white/90">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            </div>
            <div>
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">360° View Filters</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Granular Segment Analytics</p>
            </div>
         </div>
         
         <div className="flex-1 flex flex-wrap gap-4">
            <div className="space-y-1 flex-1 min-w-[150px]">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Grade Analysis</label>
               <select 
                 value={selectedGrade} 
                 onChange={e => setSelectedGrade(e.target.value)}
                 className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black uppercase outline-none focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer"
               >
                 <option value="">Global Institution</option>
                 {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
               </select>
            </div>
            <div className="space-y-1 flex-1 min-w-[120px]">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Section View</label>
               <select 
                 value={selectedSection} 
                 onChange={e => setSelectedSection(e.target.value)}
                 className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black uppercase outline-none focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer"
               >
                 <option value="">All Sections</option>
                 {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
               </select>
            </div>
            <div className="flex items-end">
               <button 
                onClick={() => { setSelectedGrade(''); setSelectedSection(''); }}
                className="px-6 py-3 bg-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all"
               >
                 Reset View
               </button>
            </div>
         </div>
      </div>

      {/* 360° Matrix Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none border-b-[12px] border-indigo-500 pb-2 inline-block">360° ADMIN COCKPIT</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.4em] mt-6 flex items-center gap-3">
             <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
             {selectedGrade ? `Viewing Segment: ${selectedGrade} ${selectedSection}` : 'Global Institutional Hub'}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 relative z-10">
           <div className="px-8 py-5 bg-slate-900 text-white rounded-[2rem] shadow-xl flex flex-col items-center">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Segment Count</span>
              <span className="text-2xl font-black italic">{filteredStudents.length}</span>
           </div>
           <div className="px-8 py-5 bg-indigo-600 text-white rounded-[2rem] shadow-xl flex flex-col items-center">
              <span className="text-[9px] font-black text-indigo-200 uppercase tracking-widest mb-1">Fiscal Collection</span>
              <span className="text-2xl font-black italic">₹{(filteredFeeReceipts.reduce((a,c)=>a+c.amountPaid, 0)/1000).toFixed(1)}k</span>
           </div>
           <div className="px-8 py-5 bg-emerald-500 text-white rounded-[2rem] shadow-xl flex flex-col items-center">
              <span className="text-[9px] font-black text-emerald-100 uppercase tracking-widest mb-1">Efficiency</span>
              <span className="text-2xl font-black italic">{feeStats.percent.toFixed(0)}%</span>
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
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 mb-10">
               <div className="w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-3xl flex items-center justify-center shrink-0 border border-white/20">
                 <svg className="w-12 h-12 text-indigo-200 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <div>
                 <div className="flex items-center gap-3 mb-4">
                   <span className="bg-emerald-400 text-slate-900 px-6 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">AI Segment Insight</span>
                 </div>
                 <h3 className="text-4xl font-black leading-tight italic tracking-tight">"{insight}"</h3>
               </div>
             </div>
             <div className="mt-auto h-48 w-full bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 shadow-inner">
                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.4em] mb-4 text-center">Institutional Growth Projection (5YR)</p>
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={[
                      { year: '2021', actual: 450 }, { year: '2022', actual: 520 }, { year: '2023', actual: 610 }, 
                      { year: '2024', actual: 780 }, { year: '2025', actual: 850, projection: 850 }, 
                      { year: '2026', projection: 1100 }, { year: '2027', projection: 1450 }
                   ]}>
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

        <div className="space-y-8 flex flex-col">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center group hover:border-indigo-400 transition-all flex-1">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Attendance Pulse</p>
              <div className="relative mb-6">
                 <svg className="w-36 h-36 transform -rotate-90">
                    <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-50" />
                    <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-indigo-600 transition-all duration-1000" strokeDasharray={402} strokeDashoffset={402 - (402 * 94.2) / 100} strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black text-slate-800">94%</span>
                 </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Segment Efficiency</p>
           </div>
           
           <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-xl flex items-center justify-between text-white group cursor-pointer hover:bg-indigo-700 transition-all">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Active Events</p>
                <h4 className="text-3xl font-black italic tracking-tighter">12 Live</h4>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
           </div>
        </div>
      </div>

      {/* Diversity & Demographics Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col h-[450px]">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800 uppercase italic">Segment Composition</h3>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
           </div>
           <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={categoryStats} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                       {categoryStats.map((_, i) => <Cell key={i} fill={[COLORS.primary, '#ec4899', '#f59e0b', '#06b6d4', '#10b981'][i % 5]} />)}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}} />
                 </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-6 flex flex-wrap gap-2">
              {categoryStats.map((cat, i) => (
                <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-500">
                  {cat.name}: {cat.value}
                </span>
              ))}
           </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col h-[450px]">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800 uppercase italic">Faith Representation</h3>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c4.478 0 8.268-2.943 9.542-7H2.458A10.033 10.033 0 0112 4c2.623 0 4.987 1.006 6.747 2.639" /></svg>
              </div>
           </div>
           <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={religionStats} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                       {religionStats.map((_, i) => <Cell key={i} fill={['#6366f1', '#ec4899', '#f59e0b', '#06b6d4', '#10b981', '#8b5cf6', '#ef4444', '#14b8a6', '#475569'][i % 9]} />)}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}} />
                 </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-6 flex flex-wrap gap-2">
              {religionStats.map((rel, i) => (
                <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-500">
                  {rel.name}: {rel.value}
                </span>
              ))}
           </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl flex flex-col justify-between relative overflow-hidden h-[450px]">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <div className="relative z-10">
              <h3 className="text-2xl font-black text-indigo-400 uppercase italic tracking-tight mb-2 leading-none">Fiscal Health</h3>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Selected Segment Realization</p>
           </div>
           
           <div className="space-y-6 relative z-10">
              <div>
                 <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Current Arrears</p>
                 <h2 className="text-5xl font-black text-rose-400 italic tracking-tighter">₹{(feeStats.outstanding/1000).toFixed(1)}k</h2>
              </div>
              <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                 <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-[2s]" style={{ width: `${feeStats.percent}%` }}></div>
              </div>
              <button 
                onClick={() => setShowFinanceModal(true)}
                className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Audit Transaction Ledger
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
