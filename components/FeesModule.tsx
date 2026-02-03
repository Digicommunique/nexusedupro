
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FeeCategory, FeeStructure, StudentFeeRecord, Student, AppSettings, AcademicWing,
  HostelAllotment, HostelRoom, TransportRoute, TransportAssignment, IssuedBook, DamageReport, Staff
} from '../types';

interface FeesModuleProps {
  students: Student[];
  staff: Staff[];
  settings: AppSettings;
  hostelAllotments: HostelAllotment[];
  hostelRooms: HostelRoom[];
  transportRoutes: TransportRoute[];
  transportAssignments: TransportAssignment[];
  issuedBooks: IssuedBook[];
  damageReports: DamageReport[];
}

const WINGS: AcademicWing[] = ['Foundation', 'Primary', 'Middle', 'Senior'];
const GRADES = [
  'Pre-Nursery', 'Nursery', 'KG', 
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];
const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

const FEE_CATEGORIES: FeeCategory[] = [
  { id: 'FC1', name: 'Tuition Fee', type: 'Recurring', mandatory: true },
  { id: 'FC2', name: 'Examination Fee', type: 'Recurring', mandatory: true },
  { id: 'FC3', name: 'Hostel Fee', type: 'Recurring', mandatory: false },
  { id: 'FC4', name: 'Transportation Fee', type: 'Recurring', mandatory: false },
  { id: 'FC5', name: 'Laboratory Fee', type: 'Recurring', mandatory: false },
  { id: 'FC6', name: 'Computer Fee', type: 'Recurring', mandatory: false },
  { id: 'FC7', name: 'Admission Fee', type: 'One-Time', mandatory: true }
];

const FeesModule: React.FC<FeesModuleProps> = ({ 
  students, staff, settings, hostelAllotments, hostelRooms, 
  transportRoutes, transportAssignments, issuedBooks, damageReports 
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'billing' | 'reminders' | 'reports' | 'accounting'>('billing');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Filter states for Reminders
  const [reminderGrade, setReminderGrade] = useState<string>('Class 10');
  const [reminderSection, setReminderSection] = useState<string>('A');

  const [feeStructures] = useState<FeeStructure[]>([
    { id: 'FS1', wing: 'Senior', grade: 'Class 10', categoryName: 'Tuition Fee', amount: 5000 },
    { id: 'FS2', wing: 'Senior', grade: 'Class 10', categoryName: 'Computer Fee', amount: 800 },
    { id: 'FS3', wing: 'Senior', grade: 'Class 10', categoryName: 'Laboratory Fee', amount: 1200 },
    { id: 'FS4', wing: 'Senior', grade: 'Class 10', categoryName: 'Examination Fee', amount: 1500 }
  ]);

  const [feeRecords, setFeeRecords] = useState<StudentFeeRecord[]>([]);

  // CORE LOGIC: Comprehensive Integrated Fee Aggregator
  const getConsolidatedDues = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { items: [], total: 0 };

    const items: { label: string; amount: number; source: string }[] = [];

    // 1. Base Academic Fees (Grade-based)
    feeStructures
      .filter(fs => fs.grade === student.grade)
      .forEach(fs => {
        items.push({ label: fs.categoryName, amount: fs.amount, source: 'Academic' });
      });

    // 2. Hostel Service (Dynamic Allotment Check)
    const activeAllotment = hostelAllotments.find(a => a.studentId === student.id);
    if (activeAllotment) {
      const room = hostelRooms.find(r => r.id === activeAllotment.roomId);
      if (room) {
        items.push({ label: `Hostel (Unit ${room.roomNo})`, amount: room.monthlyFee, source: 'Residential' });
      }
    }

    // 3. Transport Service (Dynamic Route Mapping)
    if (student.transportRouteId) {
      const route = transportRoutes.find(r => r.id === student.transportRouteId);
      if (route) {
        // Calculation: Rate per KM * Distance * 22 days (avg)
        const transportCharge = Math.ceil(route.distanceKm * route.ratePerKm * 22);
        items.push({ label: `Transport (${route.name})`, amount: transportCharge, source: 'Logistics' });
      }
    }

    // 4. Library Penalties (Aggregated Fine Registry)
    const lateFees = issuedBooks
      .filter(ib => ib.personId === student.id)
      .reduce((acc, curr) => acc + curr.lateFee + curr.damageFee, 0);
    
    if (lateFees > 0) {
      items.push({ label: 'Library Arrears', amount: lateFees, source: 'Repository' });
    }

    // 5. Lab Penalties (Aggregated Damage Registry)
    const equipmentFines = damageReports
      .filter(dr => dr.studentId === student.id)
      .reduce((acc, curr) => acc + (curr.penaltyAmount || 0), 0);
    
    if (equipmentFines > 0) {
      items.push({ label: 'Laboratory / Kit Fine', amount: equipmentFines, source: 'Infrastructure' });
    }

    return { items, total: items.reduce((acc, curr) => acc + curr.amount, 0) };
  };

  const { items: billItems, total: grossTotal } = useMemo(() => 
    selectedStudentId ? getConsolidatedDues(selectedStudentId) : { items: [], total: 0 }, 
  [selectedStudentId, students, hostelAllotments, hostelRooms, transportRoutes, issuedBooks, damageReports, feeStructures]);

  const handleUpdateRecord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const studentId = formData.get('studentId') as string;
    const paidInput = Number(formData.get('paidAmount'));
    const discount = Number(formData.get('discount'));
    const { total } = getConsolidatedDues(studentId);

    setFeeRecords(prev => {
      const existing = prev.find(r => r.studentId === studentId);
      if (existing) {
        const newPaid = existing.paidAmount + paidInput;
        return prev.map(r => r.studentId === studentId ? { ...r, paidAmount: newPaid, status: newPaid >= (total - discount) ? 'Paid' : 'Partial' } : r);
      }
      return [...prev, { id: `FR${prev.length + 1}`, studentId, totalAmount: total, discount, paidAmount: paidInput, dueDate: '2025-03-01', status: paidInput >= (total - discount) ? 'Paid' : 'Partial' }];
    });
    alert('Payment Synchronized with Institutional Ledger');
    e.currentTarget.reset();
  };

  const financialAnalytics = useMemo(() => {
    const revenue = { academic: 850000, hostel: 120000, transport: 65000, fines: 28000, donations: 150000 };
    const expenses = { payroll: staff.length * 35000, procurement: 85000, utilities: 42000, maintenance: 38000 };
    const totalRev = Object.values(revenue).reduce((a, b) => a + b, 0);
    const totalExp = Object.values(expenses).reduce((a, b) => a + b, 0);
    return { revenue, expenses, totalRev, totalExp, net: totalRev - totalExp };
  }, [staff]);

  const cashFlowData = [
    { name: 'Apr', inflow: 450000, outflow: 380000 },
    { name: 'May', inflow: 520000, outflow: 410000 },
    { name: 'Jun', inflow: 120000, outflow: 405000 },
    { name: 'Jul', inflow: 680000, outflow: 420000 },
    { name: 'Aug', inflow: 710000, outflow: 415000 },
    { name: 'Sep', inflow: 340000, outflow: 410000 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Receipt Modal */}
      {isReceiptOpen && selectedStudentId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl p-12 overflow-hidden border border-white/20">
             <div className="flex justify-between items-start mb-8 border-b-4 border-slate-900 pb-6">
                <div>
                   <h2 className="text-3xl font-black uppercase tracking-tighter italic">Official Receipt</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{settings.schoolName}</p>
                </div>
                <div className="text-right">
                   <p className="text-sm font-black text-slate-800">Date: {new Date().toLocaleDateString()}</p>
                </div>
             </div>
             <div className="space-y-4 mb-10">
               {getConsolidatedDues(selectedStudentId).items.map((item, i) => (
                 <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-3">
                   <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{item.label}</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase">{item.source}</span>
                   </div>
                   <span className="text-sm font-black">₹{item.amount.toLocaleString()}</span>
                 </div>
               ))}
             </div>
             <div className="p-8 bg-emerald-50 rounded-3xl flex justify-between items-center mb-8 border border-emerald-100">
               <span className="font-black text-emerald-800 uppercase tracking-widest text-xs">Integrated Total</span>
               <span className="text-3xl font-black text-emerald-900">₹{getConsolidatedDues(selectedStudentId).total.toLocaleString()}</span>
             </div>
             <div className="flex gap-4 print:hidden">
               <button onClick={() => window.print()} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Print HQ Copy</button>
               <button onClick={() => setIsReceiptOpen(false)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest">Close Terminal</button>
             </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-500 underline-offset-8">Financial Hub</h1>
          <p className="text-slate-500 font-medium italic">Consolidated Institutional Accounting & Billing Terminal</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {['config', 'billing', 'reminders', 'reports', 'accounting'].map(t => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t as any)} 
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Config Tab */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <form>
              <FormSection title="Structure Mapping" description="Define standard academic rates per grade.">
                <div className="lg:col-span-3 space-y-4">
                  <Select label="Campus Wing" name="wing" required options={WINGS.map(w => ({value: w, label: w}))} />
                  <Select label="Target Grade" name="grade" required options={GRADES.map(g => ({value: g, label: g}))} />
                  <Select label="Fee Category" name="categoryName" required options={FEE_CATEGORIES.map(c => ({value: c.name, label: c.name}))} />
                  <Input label="Amount (₹)" name="amount" type="number" required />
                  <button type="button" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">Commit Structure</button>
                </div>
              </FormSection>
            </form>
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             {WINGS.map(wing => (
               <div key={wing} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
                  <h4 className="text-lg font-black uppercase italic mb-6 text-slate-800">{wing} Wing</h4>
                  <div className="space-y-3">
                     {feeStructures.filter(f => f.wing === wing).map(f => (
                       <div key={f.id} className="flex justify-between border-b border-slate-50 pb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{f.categoryName} ({f.grade})</span>
                          <span className="text-xs font-black text-slate-900">₹{f.amount.toLocaleString()}</span>
                       </div>
                     ))}
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleUpdateRecord}>
              <FormSection title="Quick Receipt" description="Integrated billing engine.">
                <div className="lg:col-span-3 space-y-4">
                  <Select label="Identify Student" name="studentId" required options={students.map(s => ({value: s.id, label: s.name}))} onSelect={setSelectedStudentId} />
                  {selectedStudentId && (
                    <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in slide-in-from-top-2">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Dues Auto-Fetched</p>
                      <p className="text-2xl font-black text-indigo-900">₹{grossTotal.toLocaleString()}</p>
                      <div className="mt-3 flex gap-1">
                         {billItems.map((bi, i) => <div key={i} title={bi.label} className="w-1.5 h-1.5 rounded-full bg-indigo-300"></div>)}
                      </div>
                    </div>
                  )}
                  <Input label="Paying Amount (₹)" name="paidAmount" type="number" required />
                  <Input label="Discretionary Rebate (₹)" name="discount" type="number" defaultValue={0} />
                  <button type="submit" className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:brightness-110 active:scale-95 transition-all">Synchronize Entry</button>
                </div>
              </FormSection>
            </form>
          </div>
          <div className="lg:col-span-3 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="text-xl font-black uppercase tracking-tight italic">Consolidated Student Ledgers</h3>
               <button onClick={() => setIsReceiptOpen(true)} disabled={!selectedStudentId} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 shadow-lg">Generate Formal Receipt</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-10 py-6">Resident Profile</th>
                    <th className="px-10 py-6 text-center">Net Integrated Dues</th>
                    <th className="px-10 py-6 text-center">Payment Status</th>
                    <th className="px-10 py-6 text-right">Ledger Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map(s => {
                    const record = feeRecords.find(r => r.studentId === s.id);
                    const dues = getConsolidatedDues(s.id).total;
                    return (
                      <tr key={s.id} className="group hover:bg-slate-50 transition-all">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <img src={s.photo || `https://picsum.photos/seed/${s.id}/100`} className="w-12 h-12 rounded-xl object-cover border border-slate-200" alt="" />
                            <div><p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{s.name}</p><p className="text-[10px] font-bold text-slate-400 uppercase">{s.grade} • SEC {s.section}</p></div>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                           <p className="text-sm font-black text-slate-900">₹{(record?.totalAmount || dues).toLocaleString()}</p>
                           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">Paid: ₹{record?.paidAmount || 0}</p>
                        </td>
                        <td className="px-10 py-6 text-center">
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${record?.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'}`}>
                             {record?.status || 'Unpaid'}
                           </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm" onClick={() => { setSelectedStudentId(s.id); setActiveTab('billing'); }}>Select Profile</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reminders Tab */}
      {activeTab === 'reminders' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 uppercase italic mb-8">Defaulter Outreach Console</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class Filter</label>
                    <select value={reminderGrade} onChange={(e)=>setReminderGrade(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-black uppercase">
                       {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Section Filter</label>
                    <select value={reminderSection} onChange={(e)=>setReminderSection(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-black uppercase">
                       {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 <button className="py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    Bulk Broadcast SMS
                 </button>
                 <button className="py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">Export Overdue CSV</button>
              </div>
           </div>

           <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-rose-50/20 flex justify-between items-center">
                 <h4 className="text-lg font-black text-rose-900 uppercase italic">Class-wise Arrears Matrix</h4>
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Real-time Defaulter Tracking</span>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Resident Name</th>
                          <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Guardian Contact</th>
                          <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Overdue Amount</th>
                          <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Dispatch Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {students.filter(s => s.grade === reminderGrade && s.section === reminderSection).map(s => {
                          const { total } = getConsolidatedDues(s.id);
                          const record = feeRecords.find(r => r.studentId === s.id);
                          const overdue = total - (record?.paidAmount || 0);
                          if (overdue <= 0) return null;
                          
                          return (
                            <tr key={s.id} className="hover:bg-rose-50/10 transition-all group">
                               <td className="px-10 py-6">
                                  <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{s.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase italic">ID: {s.studentId}</p>
                               </td>
                               <td className="px-10 py-6 text-xs font-bold text-slate-600">
                                  <div className="flex items-center gap-2">
                                     <svg className="w-3.5 h-3.5 text-rose-400" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                                     {s.guardianContact}
                                  </div>
                               </td>
                               <td className="px-10 py-6 text-center">
                                  <span className="text-lg font-black text-rose-600 tracking-tighter">₹{overdue.toLocaleString()}</span>
                               </td>
                               <td className="px-10 py-6 text-right">
                                  <button className="px-6 py-2.5 bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm">Remind Now</button>
                               </td>
                            </tr>
                          );
                       })}
                       {students.filter(s => {
                          const { total } = getConsolidatedDues(s.id);
                          const record = feeRecords.find(r => r.studentId === s.id);
                          return s.grade === reminderGrade && s.section === reminderSection && (total - (record?.paidAmount || 0)) > 0;
                       }).length === 0 && (
                         <tr>
                            <td colSpan={4} className="py-24 text-center">
                               <div className="flex flex-col items-center gap-4 opacity-30">
                                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  <p className="text-xs font-black uppercase tracking-[0.3em]">No Active Arrears Found</p>
                               </div>
                            </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in zoom-in-95 duration-500">
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center text-center">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
              </div>
              <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Gross Realizations</p>
              <h2 className="text-5xl font-black italic tracking-tighter">₹12.8L</h2>
              <p className="text-[9px] font-bold text-white/40 uppercase mt-2 tracking-widest">Active Academic Session</p>
           </div>
           
           <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm flex flex-col justify-center text-center group hover:border-rose-300 transition-all">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 group-hover:text-rose-400 transition-colors">Outstanding Arrears</p>
              <h2 className="text-5xl font-black italic text-rose-600 tracking-tighter">₹4.12L</h2>
              <div className="mt-4 h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                 <div className="h-full bg-rose-500" style={{ width: '32%' }}></div>
              </div>
              <p className="text-[9px] font-black text-rose-400 uppercase mt-2 tracking-widest">32.1% Recovery Awaited</p>
           </div>

           <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm flex flex-col justify-center text-center group hover:border-indigo-300 transition-all">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 group-hover:text-indigo-400 transition-colors">Residential Revenue</p>
              <h2 className="text-5xl font-black italic text-indigo-600 tracking-tighter">₹1.20L</h2>
              <p className="text-[9px] font-black text-indigo-400 uppercase mt-2 tracking-widest">Hostel Realization</p>
           </div>

           <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm flex flex-col justify-center text-center group hover:border-emerald-300 transition-all">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 group-hover:text-emerald-400 transition-colors">Penalty Collections</p>
              <h2 className="text-5xl font-black italic text-emerald-600 tracking-tighter">₹28.4K</h2>
              <p className="text-[9px] font-black text-emerald-400 uppercase mt-2 tracking-widest">Library & Lab Fines</p>
           </div>
        </div>
      )}

      {/* Accounting Tab */}
      {activeTab === 'accounting' && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Institutional Inflow</p>
               <h2 className="text-3xl font-black text-emerald-600 tracking-tighter">₹{financialAnalytics.totalRev.toLocaleString()}</h2>
               <p className="text-[9px] font-bold text-slate-300 uppercase mt-2">Active Cycle Revenue</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Operational Outflow</p>
               <h2 className="text-3xl font-black text-rose-600 tracking-tighter">₹{financialAnalytics.totalExp.toLocaleString()}</h2>
               <p className="text-[9px] font-bold text-slate-300 uppercase mt-2">Payroll & Procurement</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Net Fiscal Margin</p>
               <h2 className="text-3xl font-black text-white tracking-tighter">₹{financialAnalytics.net.toLocaleString()}</h2>
               <p className="text-[9px] font-bold text-white/30 uppercase mt-2">Institutional Profit</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Liquidity Health</p>
               <div className="flex items-end gap-2">
                 <h2 className="text-3xl font-black text-indigo-600 tracking-tighter">{(financialAnalytics.net / financialAnalytics.totalRev * 100).toFixed(1)}%</h2>
                 <span className="text-[10px] font-black text-emerald-500 uppercase mb-1">Optimal</span>
               </div>
               <div className="mt-4 h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500" style={{ width: `${(financialAnalytics.net / financialAnalytics.totalRev * 100)}%` }}></div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
               <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-black uppercase italic tracking-tight underline decoration-indigo-500 underline-offset-8 decoration-8">Institutional Cash Flow</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div><span className="text-[10px] font-black uppercase text-slate-400">Inflow</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-400"></div><span className="text-[10px] font-black uppercase text-slate-400">Outflow</span></div>
                  </div>
               </div>
               <div className="h-[450px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={cashFlowData}>
                     <defs>
                       <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                       <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 900}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 900}} />
                     <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)'}} />
                     <Area type="monotone" dataKey="inflow" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorIn)" />
                     <Area type="monotone" dataKey="outflow" stroke="#f43f5e" strokeWidth={5} fillOpacity={1} fill="url(#colorOut)" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col">
               <h3 className="text-2xl font-black uppercase italic tracking-tight mb-10">Profit & Loss Statement</h3>
               <div className="flex-1 space-y-10">
                  <div className="space-y-4">
                     <p className="text-[12px] font-black text-indigo-500 uppercase tracking-[0.2em] border-b-2 border-indigo-50 pb-2">Revenue Streams</p>
                     {Object.entries(financialAnalytics.revenue).map(([key, val]) => (
                       <div key={key} className="flex justify-between items-center group">
                          <span className="text-sm font-bold text-slate-500 uppercase group-hover:text-slate-900 transition-colors">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-sm font-black text-slate-800">₹{val.toLocaleString()}</span>
                       </div>
                     ))}
                     <div className="pt-4 flex justify-between border-t-4 border-slate-900">
                        <span className="text-sm font-black uppercase tracking-widest">Gross Institutional Revenue</span>
                        <span className="text-sm font-black">₹{financialAnalytics.totalRev.toLocaleString()}</span>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[12px] font-black text-rose-500 uppercase tracking-[0.2em] border-b-2 border-rose-50 pb-2">Operating Expenses</p>
                     {Object.entries(financialAnalytics.expenses).map(([key, val]) => (
                       <div key={key} className="flex justify-between items-center group">
                          <span className="text-sm font-bold text-slate-500 uppercase group-hover:text-slate-900 transition-colors">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-sm font-black text-rose-600">-(₹{val.toLocaleString()})</span>
                       </div>
                     ))}
                     <div className="pt-4 flex justify-between border-t-4 border-slate-900">
                        <span className="text-sm font-black uppercase tracking-widest">Total Operating Expenditure</span>
                        <span className="text-sm font-black text-rose-600">₹{financialAnalytics.totalExp.toLocaleString()}</span>
                     </div>
                  </div>

                  <div className="mt-auto pt-10 border-t-8 border-double border-slate-200 flex justify-between items-center bg-indigo-50 -mx-12 px-12 -mb-12 rounded-b-[3.5rem] py-10 shadow-inner">
                     <div>
                        <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">Audited Net Surplus</p>
                        <h4 className="text-4xl font-black text-indigo-900 uppercase italic tracking-tighter">Net Profit</h4>
                     </div>
                     <h2 className="text-5xl font-black text-indigo-600 tracking-tighter">₹{financialAnalytics.net.toLocaleString()}</h2>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="bg-slate-900 p-16 rounded-[4.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-12 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
               <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
             </div>
             <div className="max-w-2xl">
                <h3 className="text-3xl font-black italic uppercase tracking-tight mb-6">Strategic Financial Insight</h3>
                <p className="text-lg font-medium text-white/60 leading-relaxed">Quarterly analysis suggests institutional liquidity is at an <span className="text-emerald-400 font-black">optimal 18.5% surplus</span>. We recommend diversifying procurement vendors for activity modules to reduce seasonal overhead by <span className="text-indigo-400 font-black">~₹12k/month</span>.</p>
             </div>
             <button className="px-12 py-6 bg-white text-slate-900 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:scale-105 active:scale-95 transition-all">Download Audit Archive</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesModule;
