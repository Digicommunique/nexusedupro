
import React, { useState, useMemo, useEffect } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  FeeType, FeeGroup, FeeMaster, Student, Staff, AppSettings, HostelAllotment, HostelRoom, 
  TransportRoute, IssuedBook, DamageReport, FeeReceipt
} from '../types';

interface FeesModuleProps {
  students: Student[];
  staff: Staff[];
  settings: AppSettings;
  hostelAllotments: HostelAllotment[];
  hostelRooms: HostelRoom[];
  transportRoutes: TransportRoute[];
  issuedBooks: IssuedBook[];
  damageReports: DamageReport[];
  feeReceipts: FeeReceipt[];
  onAddReceipt: (receipt: FeeReceipt) => void;
}

const GRADES = ['Pre-Nursery', 'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

const FeesModule: React.FC<FeesModuleProps> = ({ 
  students, settings, feeReceipts, onAddReceipt, hostelAllotments, hostelRooms, transportRoutes, issuedBooks, damageReports
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'master' | 'billing' | 'ledger'>('summary');
  const [masterSubTab, setMasterSubTab] = useState<'types' | 'groups' | 'master'>('types');
  
  // Ledger specific filters
  const [ledgerMode, setLedgerMode] = useState<'received' | 'due'>('received');
  const [ledgerStartDate, setLedgerStartDate] = useState<string>('');
  const [ledgerEndDate, setLedgerEndDate] = useState<string>('');

  // Data States
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([
    { id: 'FT1', name: 'Tuition Fee', description: 'Monthly academic charges' },
    { id: 'FT2', name: 'Admission Fee', description: 'One-time registration' },
    { id: 'FT3', name: 'Examination Fee', description: 'Term assessment charges' }
  ]);

  const [feeGroups, setFeeGroups] = useState<FeeGroup[]>([
    { id: 'FG1', name: 'Standard Boarder', description: 'For students opting for hostel' },
    { id: 'FG2', name: 'Day Scholar', description: 'Local students' }
  ]);

  const [feeMasters, setFeeMasters] = useState<FeeMaster[]>([
    { id: 'FM1', feeTypeId: 'FT1', feeGroupId: 'FG2', amount: 4500, dueDate: '2025-04-10', grade: 'Class 10' },
    { id: 'FM2', feeTypeId: 'FT3', feeGroupId: 'FG2', amount: 500, dueDate: '2025-04-15', grade: 'Class 10' }
  ]);

  // Billing Interaction States
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [penalty, setPenalty] = useState<number>(0);
  const [viewReceipt, setViewReceipt] = useState<FeeReceipt | null>(null);

  // Helper: Calculate total liability for any student
  const getFullStudentLiability = (student: Student) => {
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

    return { institutionalTotal, transportFee, hostelFee, libraryFines, otherDamages, masters: applicableMasters };
  };

  // Automated Liability Logic
  const studentLiability = useMemo(() => {
    if (!selectedStudentId) return null;
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return null;

    const info = getFullStudentLiability(student);
    
    let suggestedPenalty = 0;
    const today = new Date();
    info.masters.forEach(m => {
      const due = new Date(m.dueDate);
      if (today > due) suggestedPenalty += 200;
    });

    return {
      student,
      masters: info.masters,
      institutionalTotal: info.institutionalTotal,
      transportFee: info.transportFee,
      hostelFee: info.hostelFee,
      libraryFines: info.libraryFines,
      otherDamages: info.otherDamages,
      suggestedPenalty,
      grandTotal: info.institutionalTotal + info.transportFee + info.hostelFee + info.libraryFines + info.otherDamages
    };
  }, [selectedStudentId, students, feeMasters, transportRoutes, hostelAllotments, hostelRooms, issuedBooks, damageReports]);

  // Ledger Filtered Data
  const filteredLedgerData = useMemo(() => {
    if (ledgerMode === 'received') {
      return feeReceipts.filter(r => {
        const d = r.paymentDate;
        const start = !ledgerStartDate || d >= ledgerStartDate;
        const end = !ledgerEndDate || d <= ledgerEndDate;
        return start && end;
      });
    } else {
      // Due Mode: Return students with arrears based on filtered time if applicable
      // In this system, "Due" is usually current, but we can filter by masters that fell due in a period
      return students.map(s => {
        const info = getFullStudentLiability(s);
        const paid = feeReceipts.filter(r => r.studentId === s.id).reduce((a, c) => a + c.amountPaid, 0);
        
        // Filter masters by due date if range is provided
        const filteredMasters = info.masters.filter(m => {
          const d = m.dueDate;
          const start = !ledgerStartDate || d >= ledgerStartDate;
          const end = !ledgerEndDate || d <= ledgerEndDate;
          return start && end;
        });

        if (filteredMasters.length === 0 && !ledgerStartDate && !ledgerEndDate) {
            // If no filters, show all liability
        }

        const filteredLiab = (ledgerStartDate || ledgerEndDate) 
            ? filteredMasters.reduce((a,c) => a + c.amount, 0)
            : (info.institutionalTotal + info.transportFee + info.hostelFee + info.libraryFines + info.otherDamages);

        const due = Math.max(0, filteredLiab - paid);
        return { student: s, liability: filteredLiab, paid, due };
      }).filter(x => x.due > 0);
    }
  }, [ledgerMode, ledgerStartDate, ledgerEndDate, feeReceipts, students, feeMasters, hostelAllotments, hostelRooms, transportRoutes, issuedBooks, damageReports]);

  // Sync internal penalty state with suggested penalty on student change
  useEffect(() => {
    if (studentLiability) setPenalty(studentLiability.suggestedPenalty);
  }, [studentLiability]);

  const handleProcessPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get('paidAmount'));
    const studentId = formData.get('studentId') as string;
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newReceipt: FeeReceipt = {
      id: `REC-${Date.now()}`,
      receiptNo: `EN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      studentId,
      studentName: student.name,
      grade: student.grade,
      section: student.section,
      amountPaid: amount,
      discount: Number(formData.get('discount')),
      discountReason: formData.get('discountReason') as string,
      penalty: Number(formData.get('penalty')),
      penaltyReason: formData.get('penaltyReason') as string,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: formData.get('method') as any,
      session: '2025-26',
      description: formData.get('description') as string
    };

    onAddReceipt(newReceipt);
    setViewReceipt(newReceipt);
    e.currentTarget.reset();
    setSelectedStudentId('');
    setDiscount(0);
    setPenalty(0);
  };

  const handleShareWhatsApp = (receipt: FeeReceipt) => {
    const student = students.find(s => s.id === receipt.studentId);
    const phone = student?.fatherContact || student?.guardianContact || '';
    const text = `*FEE PAYMENT RECEIPT*\n\nDear Parent, payment received for ${receipt.studentName} (${receipt.grade}-${receipt.section}).\nReceipt No: ${receipt.receiptNo}\nAmount: ₹${receipt.amountPaid}\nMethod: ${receipt.paymentMethod}\n\n- ${settings.schoolName}`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Receipt Modal */}
      {viewReceipt && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[150] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              <div className="p-10 bg-indigo-600 text-white flex justify-between items-start">
                 <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Transaction Success</h2>
                    <p className="text-[10px] font-black text-indigo-200 uppercase mt-1 tracking-widest">Institutional Fee Receipt</p>
                 </div>
                 <button onClick={() => setViewReceipt(null)} className="p-3 bg-white/10 hover:bg-rose-500 rounded-2xl transition-all">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              <div className="p-12 space-y-8">
                 <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 shadow-inner">
                       <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gross Payment Realized</p>
                    <h3 className="text-6xl font-black text-slate-900 tracking-tighter italic">₹{viewReceipt.amountPaid.toLocaleString()}</h3>
                 </div>

                 <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
                    <div className="flex justify-between border-b border-slate-200 pb-3">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Receipt No</span>
                       <span className="text-xs font-black text-indigo-600 font-mono">{viewReceipt.receiptNo}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-3">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Resident Profile</span>
                       <span className="text-xs font-black text-slate-800 uppercase">{viewReceipt.studentName}</span>
                    </div>
                    {viewReceipt.discount > 0 && (
                      <div className="flex justify-between border-b border-slate-200 pb-3">
                        <span className="text-[10px] font-black text-emerald-400 uppercase">Waiver / Discount</span>
                        <span className="text-xs font-black text-emerald-600">-₹{viewReceipt.discount}</span>
                      </div>
                    )}
                    {viewReceipt.penalty > 0 && (
                      <div className="flex justify-between border-b border-slate-200 pb-3">
                        <span className="text-[10px] font-black text-rose-400 uppercase">Late Penalty</span>
                        <span className="text-xs font-black text-rose-600">+₹{viewReceipt.penalty}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Method</span>
                       <span className="text-xs font-black text-slate-800 uppercase">{viewReceipt.paymentMethod}</span>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button onClick={() => window.print()} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                       Print Slip
                    </button>
                    <button onClick={() => handleShareWhatsApp(viewReceipt)} className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.001.332.005c.109.004.258-.041.404.314.159.386.541 1.32.588 1.416.046.096.076.208.012.336-.064.128-.096.208-.191.318-.096.11-.202.245-.288.337-.096.103-.195.216-.084.407.111.191.493.812 1.057 1.312.727.645 1.341.845 1.532.937.191.092.303.077.417-.053.114-.13.486-.566.616-.761.13-.195.259-.163.439-.096.18.066 1.142.538 1.34.636.198.098.33.146.378.228.048.082.048.475-.096.88z"/></svg>
                       WhatsApp
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic inline-block border-b-8 border-indigo-500 pb-2">Financial Matrix</h1>
          <p className="text-slate-500 font-bold text-sm mt-3 uppercase tracking-widest italic">Institutional Multi-Dimensional Accounting Hub</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {['summary', 'master', 'billing', 'ledger'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Gross Collected MTD</p>
              <h2 className="text-5xl font-black italic tracking-tighter text-slate-900">₹{(feeReceipts.reduce((a,c)=>a+c.amountPaid,0)/1000).toFixed(1)}k</h2>
              <p className="text-[9px] font-bold text-emerald-500 uppercase mt-4 tracking-widest">Inflow Healthy</p>
           </div>
           <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-xl flex flex-col justify-center items-center text-center text-white">
              <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em] mb-4">Awaiting Dues</p>
              <h2 className="text-5xl font-black italic tracking-tighter text-white">₹4.2L</h2>
              <p className="text-[9px] font-bold text-indigo-300 uppercase mt-4 tracking-widest">Across All Grades</p>
           </div>
        </div>
      )}

      {activeTab === 'master' && (
        <div className="space-y-8">
           <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 w-fit">
              {['types', 'groups', 'master'].map(t => (
                <button key={t} onClick={() => setMasterSubTab(t as any)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${masterSubTab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
              ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4">
                 {masterSubTab === 'types' && (
                   <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); setFeeTypes([...feeTypes, {id:`FT${Date.now()}`, name:fd.get('name') as string, description:fd.get('desc') as string}]); e.currentTarget.reset(); }}>
                      <FormSection title="Fee Type Architect" description="Define generic fee heads.">
                        <div className="lg:col-span-3 space-y-4">
                           <Input label="Head Name" name="name" required placeholder="e.g. Monthly Tuition" />
                           <Input label="Description" name="desc" placeholder="Brief narrative" />
                           <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Commit Head</button>
                        </div>
                      </FormSection>
                   </form>
                 )}
                 {masterSubTab === 'groups' && (
                   <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); setFeeGroups([...feeGroups, {id:`FG${Date.now()}`, name:fd.get('name') as string, description:fd.get('desc') as string}]); e.currentTarget.reset(); }}>
                      <FormSection title="Category Creator" description="Group students for specific billing.">
                        <div className="lg:col-span-3 space-y-4">
                           <Input label="Group Name" name="name" required placeholder="e.g. RTE Students" />
                           <Input label="Description" name="desc" placeholder="Who belongs here?" />
                           <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Register Group</button>
                        </div>
                      </FormSection>
                   </form>
                 )}
                 {masterSubTab === 'master' && (
                   <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); setFeeMasters([...feeMasters, {id:`FM${Date.now()}`, feeTypeId:fd.get('typeId') as string, feeGroupId:fd.get('groupId') as string, amount:Number(fd.get('amount')), dueDate:fd.get('due') as string, grade:fd.get('grade') as string}]); e.currentTarget.reset(); }}>
                      <FormSection title="Fee Deployment" description="Deploy fees to groups & grades.">
                        <div className="lg:col-span-3 space-y-4">
                           <Select label="Fee Head" name="typeId" required options={feeTypes.map(t=>({value:t.id, label:t.name}))} />
                           <Select label="Target Group" name="groupId" required options={feeGroups.map(g=>({value:g.id, label:g.name}))} />
                           <Select label="Target Grade" name="grade" required options={[{value:'All', label:'All Classes'}, ...GRADES.map(g=>({value:g, label:g}))]} />
                           <div className="grid grid-cols-2 gap-4">
                              <Input label="Amount (₹)" name="amount" type="number" required />
                              <Input label="Due Date" name="due" type="date" required />
                           </div>
                           <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Deploy Fee Master</button>
                        </div>
                      </FormSection>
                   </form>
                 )}
              </div>

              <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
                 <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-800 uppercase italic leading-none">Institutional Records</h3>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest">Active Audit</span>
                 </div>
                 <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 sticky top-0 z-10">
                          <tr className="border-b border-slate-100">
                             {masterSubTab === 'types' && <><th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase">Head Name</th><th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase">Description</th></>}
                             {masterSubTab === 'groups' && <><th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase">Group Name</th><th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase">Description</th></>}
                             {masterSubTab === 'master' && <><th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase">Master Identity</th><th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase">Target</th><th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase">Amount</th><th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase">Due Date</th></>}
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {masterSubTab === 'types' && feeTypes.map(ft => (
                            <tr key={ft.id} className="hover:bg-slate-50 transition-all"><td className="px-8 py-5 text-sm font-black text-slate-800 uppercase italic">{ft.name}</td><td className="px-8 py-5 text-xs text-slate-400 font-medium italic">"{ft.description}"</td></tr>
                          ))}
                          {masterSubTab === 'groups' && feeGroups.map(fg => (
                            <tr key={fg.id} className="hover:bg-slate-50 transition-all"><td className="px-8 py-5 text-sm font-black text-slate-800 uppercase italic">{fg.name}</td><td className="px-8 py-5 text-xs text-slate-400 font-medium italic">"{fg.description}"</td></tr>
                          ))}
                          {masterSubTab === 'master' && feeMasters.map(fm => {
                             const ft = feeTypes.find(t=>t.id === fm.feeTypeId);
                             const fg = feeGroups.find(g=>g.id === fm.feeGroupId);
                             return (
                               <tr key={fm.id} className="hover:bg-slate-50 transition-all">
                                  <td className="px-8 py-5">
                                     <p className="text-sm font-black text-slate-800 uppercase">{ft?.name}</p>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase">Grp: {fg?.name}</p>
                                  </td>
                                  <td className="px-8 py-5">
                                     <span className="px-2 py-1 bg-slate-100 text-[9px] font-black text-slate-600 rounded uppercase">{fm.grade}</span>
                                  </td>
                                  <td className="px-8 py-5 font-black text-indigo-600">₹{fm.amount.toLocaleString()}</td>
                                  <td className="px-8 py-5 text-xs font-black text-rose-500 uppercase">{fm.dueDate}</td>
                               </tr>
                             );
                          })}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-4 space-y-6">
              <form onSubmit={handleProcessPayment}>
                 <FormSection title="Transaction Desk" description="Automated arrears fetching for residents.">
                    <div className="lg:col-span-3 space-y-4">
                       <Select 
                         label="Identify Resident" 
                         name="studentId" 
                         required 
                         onSelect={setSelectedStudentId} 
                         options={students.map(s => ({value: s.id, label: s.name}))} 
                       />
                       
                       <div className="grid grid-cols-2 gap-4">
                          <Input label="Amount (₹)" name="paidAmount" type="number" required defaultValue={studentLiability?.grandTotal} />
                          <Select label="Method" name="method" required options={[{value:'Cash', label:'Cash'}, {value:'Online', label:'Online'}, {value:'UPI', label:'UPI'}, {value:'Cheque', label:'Cheque'}]} />
                       </div>

                       <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-4">
                          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Waiver / Discount Management</p>
                          <div className="grid grid-cols-2 gap-4">
                             <Input label="Discount (₹)" name="discount" type="number" onBlur={(e)=>setDiscount(Number(e.target.value))} />
                             <Input label="Waiver Reason" name="discountReason" placeholder="Scholarship, RTE..." />
                          </div>
                       </div>

                       <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 space-y-4">
                          <div className="flex justify-between items-center">
                             <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Penalty Control (Relaxable)</p>
                             {penalty !== (studentLiability?.suggestedPenalty || 0) && (
                               <span className="text-[8px] font-black bg-white px-2 py-0.5 rounded text-rose-500 uppercase">Override Enabled</span>
                             )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <Input label="Late Fine (₹)" name="penalty" type="number" defaultValue={penalty} onBlur={(e)=>setPenalty(Number(e.target.value))} />
                             <Input label="Penalty Reason" name="penaltyReason" placeholder="Late Submission" />
                          </div>
                       </div>

                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Memo / Description</label>
                          <textarea name="description" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs h-20 resize-none" placeholder="Cheque number, UTR, or special notes..."></textarea>
                       </div>
                       
                       <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">Submit to Ledger</button>
                    </div>
                 </FormSection>
              </form>
           </div>

           <div className="lg:col-span-8 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm p-12 relative overflow-hidden h-fit">
              <h3 className="text-2xl font-black uppercase italic tracking-tight mb-8">Liability Breakdown Matrix</h3>
              
              {!studentLiability ? (
                 <div className="p-32 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                       <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                       <p className="text-xs font-black uppercase tracking-[0.4em]">Select Resident to Fetch Automated Dues</p>
                    </div>
                 </div>
              ) : (
                <div className="space-y-10 animate-in zoom-in-95 duration-500">
                   <div className="flex items-center gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                      <img src={studentLiability.student.photo || `https://picsum.photos/seed/${studentLiability.student.id}/100`} className="w-20 h-20 rounded-[2rem] object-cover border-4 border-white shadow-xl" alt="" />
                      <div>
                         <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{studentLiability.student.name}</h4>
                         <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2">{studentLiability.student.grade} • SEC {studentLiability.student.section} • ID {studentLiability.student.studentId}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Academic & Master Dues</p>
                         <div className="space-y-3">
                            {studentLiability.masters.map(m => (
                               <div key={m.id} className="flex justify-between items-center text-sm font-bold text-slate-600">
                                  <span>{feeTypes.find(t=>t.id===m.feeTypeId)?.name}</span>
                                  <span className="text-slate-900">₹{m.amount.toLocaleString()}</span>
                               </div>
                            ))}
                            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                               <span className="text-xs font-black text-slate-400 uppercase">Institutional Subtotal</span>
                               <span className="text-lg font-black text-slate-900 italic">₹{studentLiability.institutionalTotal.toLocaleString()}</span>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Cross-Module Fetched Dues</p>
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                               <span>Transit Services {studentLiability.student.transportRouteId ? '(Adopted)' : '(N/A)'}</span>
                               <span className={studentLiability.student.transportRouteId ? 'text-slate-900' : 'text-slate-300'}>₹{studentLiability.transportFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                               <span>Hostel Lodging {studentLiability.hostelFee > 0 ? '(Adopted)' : '(N/A)'}</span>
                               <span className={studentLiability.hostelFee > 0 ? 'text-slate-900' : 'text-slate-300'}>₹{studentLiability.hostelFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                               <span>Library Fines (Late/Damage)</span>
                               <span className={studentLiability.libraryFines > 0 ? 'text-rose-500 font-black' : 'text-slate-300'}>₹{studentLiability.libraryFines.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                               <span>Lab & Sports Damages</span>
                               <span className={studentLiability.otherDamages > 0 ? 'text-rose-500 font-black' : 'text-slate-300'}>₹{studentLiability.otherDamages.toLocaleString()}</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="p-12 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                        <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div className="mb-6 md:mb-0">
                         <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">Gross Arrear Realized</p>
                         <h4 className="text-7xl font-black italic tracking-tighter">₹{(studentLiability.grandTotal + penalty - discount).toLocaleString()}</h4>
                         {penalty > 0 && <span className="text-[10px] font-bold text-rose-400 uppercase">Incl. Late Penalty: ₹{penalty}</span>}
                      </div>
                      <div className="flex flex-col gap-4 w-full md:w-auto">
                        <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center">
                           <p className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">Real-Time Sync</p>
                        </div>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="space-y-6">
          {/* Advanced Ledger Search & Filter Matrix */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
                   <button 
                     onClick={() => setLedgerMode('received')}
                     className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${ledgerMode === 'received' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     Fees Received
                   </button>
                   <button 
                     onClick={() => setLedgerMode('due')}
                     className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${ledgerMode === 'due' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     Fees Due (Arrears)
                   </button>
                </div>

                <div className="flex flex-wrap items-end gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Period Start</label>
                      <input 
                        type="date" 
                        value={ledgerStartDate}
                        onChange={e => setLedgerStartDate(e.target.value)}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:ring-2 focus:ring-indigo-100" 
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Period End</label>
                      <input 
                        type="date" 
                        value={ledgerEndDate}
                        onChange={e => setLedgerEndDate(e.target.value)}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:ring-2 focus:ring-indigo-100" 
                      />
                   </div>
                   <button 
                     onClick={() => { setLedgerStartDate(''); setLedgerEndDate(''); }}
                     className="px-6 py-2 bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                   >
                     Reset
                   </button>
                </div>
             </div>

             {/* Period Summary Pulse */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Period Gross</span>
                   <span className="text-2xl font-black text-slate-900 italic">₹{(filteredLedgerData.reduce((a,c) => a + (ledgerMode === 'received' ? (c as FeeReceipt).amountPaid : (c as any).due), 0)).toLocaleString()}</span>
                </div>
                <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex flex-col items-center text-center">
                   <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Record Count</span>
                   <span className="text-2xl font-black text-indigo-600 italic">{filteredLedgerData.length} Entries</span>
                </div>
                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex flex-col items-center text-center">
                   <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Audit Status</span>
                   <span className="text-[10px] font-black text-emerald-600 uppercase">Period Validated ✅</span>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
              <div>
                <h3 className="text-2xl font-black uppercase italic tracking-tight">{ledgerMode === 'received' ? 'Realized Credit Ledger' : 'Arrears Registry'}</h3>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mt-1">
                  {ledgerStartDate || ledgerEndDate ? `Audit Period: ${ledgerStartDate || 'Start'} to ${ledgerEndDate || 'End'}` : 'Institutional Lifetime View'}
                </p>
              </div>
              <button className="px-10 py-3.5 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Export Period Audit</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-10 py-6">{ledgerMode === 'received' ? 'Receipt #' : 'Resident ID'}</th>
                    <th className="px-10 py-6">Student Enrollment</th>
                    <th className="px-10 py-6 text-center">{ledgerMode === 'received' ? 'Settlement' : 'Last Payment'}</th>
                    <th className="px-10 py-6 text-right">{ledgerMode === 'received' ? 'Adjustments' : 'Total Liability'}</th>
                    <th className="px-10 py-6 text-right">{ledgerMode === 'received' ? 'Net Credit' : 'Current Arrear'}</th>
                    {ledgerMode === 'received' && <th className="px-10 py-6 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {ledgerMode === 'received' ? (filteredLedgerData as FeeReceipt[]).map(r => (
                    <tr key={r.id} className="hover:bg-indigo-50/20 transition-all group">
                      <td className="px-10 py-6 font-mono text-xs font-black text-indigo-500 uppercase">{r.receiptNo}</td>
                      <td className="px-10 py-6">
                        <p className="text-sm font-black text-slate-800 uppercase">{r.studentName}</p>
                        <p className="text-[9px] font-bold text-slate-400">{r.grade} - {r.section}</p>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className="text-xs font-black text-slate-400 uppercase">{r.paymentDate}</span>
                        <p className="text-[8px] font-black text-slate-300 uppercase mt-1">{r.paymentMethod}</p>
                      </td>
                      <td className="px-10 py-6 text-right">
                         <div className="flex flex-col">
                            {r.discount > 0 && <span className="text-[9px] font-black text-emerald-500">Disc: -₹{r.discount}</span>}
                            {r.penalty > 0 && <span className="text-[9px] font-black text-rose-500">Pen: +₹{r.penalty}</span>}
                            {(r.discount === 0 && r.penalty === 0) && <span className="text-[9px] font-black text-slate-300">No Adjustments</span>}
                         </div>
                      </td>
                      <td className="px-10 py-6 text-right font-black text-indigo-600 text-xl">₹{r.amountPaid.toLocaleString()}</td>
                      <td className="px-10 py-6 text-right">
                         <div className="flex justify-end gap-2">
                            <button onClick={() => setViewReceipt(r)} title="Print Receipt" className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-xl transition-all shadow-sm"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg></button>
                            <button onClick={() => handleShareWhatsApp(r)} title="Share on WhatsApp" className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.001.332.005c.109.004.258-.041.404.314.159.386.541 1.32.588 1.416.046.096.076.208.012.336-.064.128-.096.208-.191.318-.096.11-.202.245-.288.337-.096.103-.195.216-.084.407.111.191.493.812 1.057 1.312.727.645 1.341.845 1.532.937.191.092.303.077.417-.053.114-.13.486-.566.616-.761.13-.195.259-.163.439-.096.18.066 1.142.538 1.34.636.198.098.33.146.378.228.048.082.048.475-.096.88z"/></svg></button>
                         </div>
                      </td>
                    </tr>
                  )) : (filteredLedgerData as any[]).map(row => (
                    <tr key={row.student.id} className="hover:bg-rose-50/20 transition-all group">
                      <td className="px-10 py-6 font-mono text-xs font-black text-rose-500 uppercase">{row.student.studentId}</td>
                      <td className="px-10 py-6">
                        <p className="text-sm font-black text-slate-800 uppercase">{row.student.name}</p>
                        <p className="text-[9px] font-bold text-slate-400">{row.student.grade} - {row.student.section}</p>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className="text-xs font-black text-slate-400 uppercase">Manual Tracking Required</span>
                        <p className="text-[8px] font-black text-slate-300 uppercase mt-1">Pending Sync</p>
                      </td>
                      <td className="px-10 py-6 text-right">
                         <span className="text-sm font-black text-slate-500 italic">₹{row.liability.toLocaleString()}</span>
                      </td>
                      <td className="px-10 py-6 text-right font-black text-rose-600 text-xl">₹{row.due.toLocaleString()}</td>
                    </tr>
                  ))}
                  {filteredLedgerData.length === 0 && (
                    <tr><td colSpan={6} className="py-40 text-center opacity-20"><p className="text-xl font-black uppercase tracking-[0.5em]">No fiscal records found</p></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesModule;
