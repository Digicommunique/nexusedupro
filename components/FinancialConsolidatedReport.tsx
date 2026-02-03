
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Student, FeeReceipt, FeeMaster, FeeType, HostelAllotment, 
  HostelRoom, TransportRoute, IssuedBook, DamageReport 
} from '../types';

interface FinancialConsolidatedReportProps {
  students: Student[];
  feeReceipts: FeeReceipt[];
  feeMasters: FeeMaster[];
  feeTypes: FeeType[];
  hostelAllotments: HostelAllotment[];
  hostelRooms: HostelRoom[];
  transportRoutes: TransportRoute[];
  issuedBooks: IssuedBook[];
  damageReports: DamageReport[];
}

const GRADES = ['Pre-Nursery', 'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E'];
const SESSIONS = ['2023-24', '2024-25', '2025-26'];

const FinancialConsolidatedReport: React.FC<FinancialConsolidatedReportProps> = ({
  students, feeReceipts, feeMasters, feeTypes, hostelAllotments, 
  hostelRooms, transportRoutes, issuedBooks, damageReports
}) => {
  // Filter States
  const [fGrade, setFGrade] = useState('');
  const [fSection, setFSection] = useState('');
  const [fSession, setFSession] = useState('2025-26');
  const [fDateStart, setFDateStart] = useState('');
  const [fDateEnd, setFDateEnd] = useState('');

  // Helper: Calculate full liability for a student (Institutional + Fetched)
  const calculateStudentLiability = (student: Student) => {
    const applicableMasters = feeMasters.filter(m => m.grade === student.grade || m.grade === 'All');
    const institutionalTotal = applicableMasters.reduce((acc, m) => acc + m.amount, 0);

    let transportFee = 0;
    if (student.transportRouteId) {
      const route = transportRoutes.find(r => r.id === student.transportRouteId);
      transportFee = route ? 1500 : 0; 
    }

    let hostelFee = 0;
    const allotment = hostelAllotments.find(a => a.studentId === student.id);
    if (allotment) {
      const room = hostelRooms.find(r => r.id === allotment.roomId);
      hostelFee = room ? room.monthlyFee : 0;
    }

    const libraryFines = issuedBooks
      .filter(ib => ib.personId === student.id)
      .reduce((acc, curr) => acc + curr.lateFee + curr.damageFee, 0);

    const otherDamages = damageReports
      .filter(dr => dr.reportedBy.includes(student.name) || dr.itemName.includes(student.id))
      .length * 500;

    return institutionalTotal + transportFee + hostelFee + libraryFines + otherDamages;
  };

  // Process data for the matrix
  const consolidatedData = useMemo(() => {
    return students
      .filter(s => (!fGrade || s.grade === fGrade) && (!fSection || s.section === fSection))
      .map(s => {
        const studentReceipts = feeReceipts.filter(r => 
          r.studentId === s.id && 
          (!fSession || r.session === fSession) &&
          (!fDateStart || r.paymentDate >= fDateStart) &&
          (!fDateEnd || r.paymentDate <= fDateEnd)
        );
        
        const paid = studentReceipts.reduce((acc, curr) => acc + curr.amountPaid, 0);
        const liability = calculateStudentLiability(s);
        const due = Math.max(0, liability - paid);

        return {
          id: s.id,
          name: s.name,
          grade: s.grade,
          section: s.section,
          totalLiability: liability,
          totalPaid: paid,
          totalDue: due,
          receipts: studentReceipts
        };
      });
  }, [students, feeReceipts, feeMasters, hostelAllotments, hostelRooms, transportRoutes, issuedBooks, damageReports, fGrade, fSection, fSession, fDateStart, fDateEnd]);

  // Aggregate Metrics
  const aggregates = useMemo(() => {
    const collected = consolidatedData.reduce((acc, curr) => acc + curr.totalPaid, 0);
    const due = consolidatedData.reduce((acc, curr) => acc + curr.totalDue, 0);
    const total = collected + due;
    return { collected, due, total, efficiency: total > 0 ? (collected / total) * 100 : 0 };
  }, [consolidatedData]);

  // Chart Data: Grade-wise distribution
  const chartGradeData = useMemo(() => {
    return GRADES.map(g => {
      const classStudents = consolidatedData.filter(s => s.grade === g);
      const coll = classStudents.reduce((acc, curr) => acc + curr.totalPaid, 0);
      const d = classStudents.reduce((acc, curr) => acc + curr.totalDue, 0);
      return { name: g, collected: coll, due: d };
    }).filter(d => d.collected > 0 || d.due > 0);
  }, [consolidatedData]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* 360 View Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <svg className="w-72 h-72" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter border-b-8 border-indigo-500 pb-2 inline-block">Fiscal Intelligence</h1>
          <p className="text-indigo-400 font-bold uppercase text-xs tracking-[0.4em] mt-6 italic">Consolidated Institutional Flow Matrix</p>
        </div>
        <div className="flex flex-wrap gap-4 relative z-10">
           <div className="px-10 py-6 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 flex flex-col items-center">
              <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">Gross Realized</span>
              <span className="text-3xl font-black italic">₹{(aggregates.collected/1000).toFixed(1)}k</span>
           </div>
           <div className="px-10 py-6 bg-rose-500 text-white rounded-[2.5rem] shadow-2xl flex flex-col items-center">
              <span className="text-[9px] font-black text-rose-100 uppercase tracking-widest mb-1">Total Arrears</span>
              <span className="text-3xl font-black italic">₹{(aggregates.due/1000).toFixed(1)}k</span>
           </div>
           <div className="px-10 py-6 bg-emerald-500 text-white rounded-[2.5rem] shadow-2xl flex flex-col items-center">
              <span className="text-[9px] font-black text-emerald-100 uppercase tracking-widest mb-1">Efficiency</span>
              <span className="text-3xl font-black italic">{aggregates.efficiency.toFixed(0)}%</span>
           </div>
        </div>
      </div>

      {/* Advanced Control Panel */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-2xl font-black uppercase italic tracking-tight text-slate-800 underline decoration-indigo-200 underline-offset-8">Report Filter Matrix</h3>
           <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <div className="w-3 h-3 rounded-full bg-rose-400"></div>
              <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
           </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-end">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Session</label>
              <select value={fSession} onChange={e=>setFSession(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase outline-none focus:ring-4 focus:ring-indigo-100 transition-all">
                 {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grade Target</label>
              <select value={fGrade} onChange={e=>setFGrade(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase outline-none focus:ring-4 focus:ring-indigo-100 transition-all">
                 <option value="">All Institutional Grades</option>
                 {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Section</label>
              <select value={fSection} onChange={e=>setFSection(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase outline-none focus:ring-4 focus:ring-indigo-100 transition-all">
                 <option value="">Consolidated</option>
                 {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period Start</label>
              <input type="date" value={fDateStart} onChange={e=>setFDateStart(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black outline-none focus:ring-4 focus:ring-indigo-100 transition-all" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period End</label>
              <input type="date" value={fDateEnd} onChange={e=>setFDateEnd(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black outline-none focus:ring-4 focus:ring-indigo-100 transition-all" />
           </div>
        </div>
      </div>

      {/* Visual Analytics Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden h-[500px]">
            <h3 className="text-2xl font-black uppercase italic tracking-tight mb-10 text-slate-800">Collected vs Arrears (Grade Wise)</h3>
            <div className="h-full">
               <ResponsiveContainer width="100%" height="80%">
                  <BarChart data={chartGradeData} margin={{top: 0, right: 30, left: 30, bottom: 20}}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="900" axisLine={false} tickLine={false} />
                     <YAxis stroke="#94a3b8" fontSize={9} fontWeight="900" axisLine={false} tickLine={false} />
                     <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}} />
                     <Legend iconType="circle" />
                     <Bar dataKey="collected" name="Realized Capital" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={30} />
                     <Bar dataKey="due" name="Active Arrears" fill="#f43f5e" radius={[8, 8, 0, 0]} barSize={30} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="lg:col-span-4 bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
            <h3 className="text-xl font-black uppercase italic tracking-tight mb-8 text-slate-800">Gross Distribution</h3>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie data={[{name: 'Realized', value: aggregates.collected}, {name: 'Arrears', value: aggregates.due}]} innerRadius={70} outerRadius={100} paddingAngle={10} dataKey="value">
                        <Cell fill="#6366f1" />
                        <Cell fill="#f43f5e" />
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-8 space-y-4 w-full">
               <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-indigo-600">
                  <span>Audit Realized</span>
                  <span>{((aggregates.collected/aggregates.total)*100).toFixed(1)}%</span>
               </div>
               <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{width: `${(aggregates.collected/aggregates.total)*100}%`}}></div>
               </div>
            </div>
         </div>
      </div>

      {/* Granular Master Ledger */}
      <div className="bg-white rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
         <div className="p-10 border-b border-slate-100 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
               <h3 className="text-3xl font-black uppercase italic tracking-tight leading-none">Consolidated Ledger Matrix</h3>
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mt-3">Full Audit of Enrolled Residents</p>
            </div>
            <div className="flex gap-4">
               <button onClick={() => window.print()} className="px-10 py-4 bg-white text-slate-900 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  Generate PDF Audit
               </button>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                     <th className="px-10 py-8">Resident Profile</th>
                     <th className="px-10 py-8 text-center">Class / SEC</th>
                     <th className="px-10 py-8 text-right">Gross Liability</th>
                     <th className="px-10 py-8 text-right">Realized Credit</th>
                     <th className="px-10 py-8 text-right">Active Arrears</th>
                     <th className="px-10 py-8 text-right">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {consolidatedData.map(row => (
                    <tr key={row.id} className="hover:bg-indigo-50/20 transition-all group">
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all italic">
                                {row.name[0]}
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{row.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">UID: {row.id}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-6 text-center">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{row.grade} • {row.section}</span>
                       </td>
                       <td className="px-10 py-6 text-right font-black text-slate-500 text-sm italic">₹{row.totalLiability.toLocaleString()}</td>
                       <td className="px-10 py-6 text-right font-black text-indigo-600 text-lg">₹{row.totalPaid.toLocaleString()}</td>
                       <td className="px-10 py-6 text-right">
                          <span className={`text-lg font-black italic tracking-tighter ${row.totalDue > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                             ₹{row.totalDue.toLocaleString()}
                          </span>
                       </td>
                       <td className="px-10 py-6 text-right">
                          <div className={`px-4 py-1.5 rounded-full inline-block text-[9px] font-black uppercase tracking-widest ${row.totalDue === 0 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : row.totalPaid > 0 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-100' : 'bg-rose-500 text-white shadow-lg shadow-rose-100'}`}>
                             {row.totalDue === 0 ? 'Fully Cleared' : row.totalPaid > 0 ? 'Partial Settlement' : 'Arrears Active'}
                          </div>
                       </td>
                    </tr>
                  ))}
                  {consolidatedData.length === 0 && (
                    <tr>
                       <td colSpan={6} className="py-40 text-center">
                          <div className="flex flex-col items-center gap-6 opacity-20">
                             <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                             <p className="text-lg font-black uppercase tracking-[0.5em]">No fiscal records found for current filter selection</p>
                          </div>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default FinancialConsolidatedReport;
