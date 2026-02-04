
import React, { useState, useMemo, useEffect } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
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

const FeesModule: React.FC<FeesModuleProps> = ({ 
  students, settings, feeReceipts, onAddReceipt, hostelAllotments, hostelRooms, transportRoutes, issuedBooks, damageReports
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'master' | 'billing' | 'ledger'>('master');
  const [masterSubTab, setMasterSubTab] = useState<'deploy' | 'types' | 'groups' | 'assignment'>('deploy');
  
  // States for Fee Master Management
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([
    { id: 'FT1', name: 'Tuition Fee', description: 'Monthly academic charges' },
    { id: 'FT2', name: 'Admission Fee', description: 'One-time registration' },
    { id: 'FT3', name: 'Examination Fee', description: 'Term assessment charges' },
    { id: 'FT4', name: 'Sports & Wellness', description: 'Annual sports facility charges' }
  ]);

  const [feeGroups, setFeeGroups] = useState<FeeGroup[]>([
    { id: 'FG1', name: 'Boarder', description: 'Institutional residents' },
    { id: 'FG2', name: 'Day Scholar', description: 'Local students' },
    { id: 'FG3', name: 'RTE', description: 'Right to Education quota' }
  ]);

  const [feeMasters, setFeeMasters] = useState<FeeMaster[]>([
    { id: 'FM1', feeTypeId: 'FT1', feeGroupId: 'FG2', amount: 4500, dueDate: '2025-04-10', grade: 'Class 10' },
    { id: 'FM2', feeTypeId: 'FT3', feeGroupId: 'FG2', amount: 500, dueDate: '2025-04-15', grade: 'Class 10' },
    { id: 'FM3', feeTypeId: 'FT4', feeGroupId: 'FG2', amount: 1200, dueDate: '2025-04-20', grade: 'Class 10' }
  ]);

  const [localStudents, setLocalStudents] = useState<Student[]>(students);

  // Billing Interaction States
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState<string>('');
  const [penalty, setPenalty] = useState<number>(0);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [viewReceipt, setViewReceipt] = useState<FeeReceipt | null>(null);

  // Automation Logic: Fetch Student Arrears
  const getFullStudentLiability = (student: Student) => {
    // 1. Core Institutional Fees (Filtered by Grade & Group)
    const applicableMasters = feeMasters.filter(m => 
      (m.grade === student.grade || m.grade === 'All') && 
      (student.feeGroupId ? m.feeGroupId === student.feeGroupId : true)
    );
    const institutionalTotal = applicableMasters.reduce((acc, m) => acc + m.amount, 0);

    // 2. Transport Arrears
    let transportFee = 0;
    if (student.transportRouteId) {
      transportFee = 1500; // Consistent rate for simulation
    }

    // 3. Hostel Arrears
    let hostelFee = 0;
    const allotment = hostelAllotments.find(a => a.studentId === student.id);
    if (allotment) {
      const room = hostelRooms.find(r => r.id === allotment.roomId);
      hostelFee = room ? room.monthlyFee : 5000;
    }

    // 4. Other Penalties
    const libraryFines = issuedBooks.filter(ib => ib.personId === student.id).reduce((a,c)=>a+c.lateFee+c.damageFee, 0);
    const propertyDamages = damageReports.filter(dr => dr.reportedBy.includes(student.name)).length * 500;

    return { institutionalTotal, transportFee, hostelFee, libraryFines, propertyDamages, masters: applicableMasters };
  };

  const studentLiability = useMemo(() => {
    if (!selectedStudentId) return null;
    const student = localStudents.find(s => s.id === selectedStudentId);
    if (!student) return null;

    const info = getFullStudentLiability(student);
    
    return {
      student,
      ...info,
      grandTotal: info.institutionalTotal + info.transportFee + info.hostelFee + info.libraryFines + info.propertyDamages
    };
  }, [selectedStudentId, localStudents, feeMasters, hostelAllotments, transportRoutes, issuedBooks, damageReports]);

  const handleDeployFee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMaster: FeeMaster = {
      id: `FM${Date.now()}`,
      feeTypeId: formData.get('typeId') as string,
      feeGroupId: formData.get('groupId') as string,
      grade: formData.get('grade') as string,
      amount: Number(formData.get('amount')),
      dueDate: formData.get('dueDate') as string
    };
    setFeeMasters([...feeMasters, newMaster]);
    e.currentTarget.reset();
    alert('Targeted Fee Deployed to Registry.');
  };

  const handleShareWhatsApp = (isBill = false) => {
    if (!studentLiability) return;
    const phone = studentLiability.student.fatherContact || '';
    const text = isBill 
      ? `*INSTITUTIONAL FEE BILL*\n\nDear Parent, a new bill has been generated for ${studentLiability.student.name} (${studentLiability.student.grade}).\nTotal Amount Due: ₹${(studentLiability.grandTotal + penalty - discount).toLocaleString()}\n\nClear dues online at ${settings.schoolName} Portal.`
      : `*FEE RECEIPT ACKNOWLEDGEMENT*\n\nDear Parent, we have received payment for ${studentLiability.student.name}. Receipt No: ${viewReceipt?.receiptNo}.\nAmount: ₹${viewReceipt?.amountPaid}\n- ${settings.schoolName}`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleProcessPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const studentId = formData.get('studentId') as string;
    const student = localStudents.find(s => s.id === studentId);
    if (!student) return;

    const amount = Number(formData.get('paidAmount'));
    const appliedDiscount = Number(formData.get('discount') || 0);

    const newReceipt: FeeReceipt = {
      id: `REC-${Date.now()}`,
      receiptNo: `EN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      studentId,
      studentName: student.name,
      grade: student.grade,
      section: student.section,
      amountPaid: amount,
      discount: appliedDiscount,
      discountReason: formData.get('discountReason') as string,
      penalty: Number(formData.get('penalty') || 0),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: formData.get('method') as any,
      session: '2025-26',
      description: 'Fee Settlement Cycle March'
    };

    onAddReceipt(newReceipt);
    setViewReceipt(newReceipt);
    e.currentTarget.reset();
    setSelectedStudentId('');
    setDiscount(0);
    setDiscountReason('');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Receipt View Modal */}
      {viewReceipt && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[150] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              <div className="p-10 bg-emerald-600 text-white flex justify-between items-start">
                 <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Receipt Generated</h2>
                    <p className="text-[10px] font-black text-emerald-200 uppercase mt-2 tracking-widest">Official Fiscal Acknowledge</p>
                 </div>
                 <button onClick={() => setViewReceipt(null)} className="p-3 bg-white/10 hover:bg-rose-500 rounded-2xl transition-all">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              <div className="p-12 space-y-8">
                 <div className="flex flex-col items-center text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gross Payment Realized</p>
                    <h3 className="text-6xl font-black text-slate-900 tracking-tighter italic">₹{viewReceipt.amountPaid.toLocaleString()}</h3>
                 </div>
                 <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
                    <div className="flex justify-between border-b border-slate-200 pb-3"><span className="text-[10px] font-black text-slate-400 uppercase">Receipt No</span><span className="text-xs font-black text-indigo-600 font-mono">{viewReceipt.receiptNo}</span></div>
                    <div className="flex justify-between border-b border-slate-200 pb-3"><span className="text-[10px] font-black text-slate-400 uppercase">Resident Profile</span><span className="text-xs font-black text-slate-800 uppercase">{viewReceipt.studentName}</span></div>
                    {viewReceipt.discount > 0 && <div className="flex justify-between"><span className="text-[10px] font-black text-emerald-400 uppercase">Waiver Applied (Ref: {viewReceipt.discountReason})</span><span className="text-xs font-black text-emerald-600">-₹{viewReceipt.discount}</span></div>}
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => window.print()} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Print Physical</button>
                    <button onClick={() => handleShareWhatsApp()} className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2">
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                       Share
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Bill Preview Modal */}
      {showBillPreview && studentLiability && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[150] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              <div className="p-10 bg-slate-900 text-white flex justify-between items-start">
                 <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Digital Fee Invoice</h2>
                    <p className="text-[10px] font-black text-indigo-400 uppercase mt-2 tracking-widest">Academic Session 2025-26</p>
                 </div>
                 <button onClick={() => setShowBillPreview(false)} className="p-3 bg-white/10 hover:bg-rose-500 rounded-2xl transition-all">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              <div className="p-12 space-y-10">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Resident Details</p>
                       <h3 className="text-2xl font-black text-slate-900 uppercase italic">{studentLiability.student.name}</h3>
                       <p className="text-sm font-bold text-indigo-600">{studentLiability.student.grade} • ID {studentLiability.student.studentId}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Invoice Date</p>
                       <p className="text-sm font-black text-slate-800">{new Date().toLocaleDateString()}</p>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Institutional Arrears</p>
                    {studentLiability.masters.map(m => (
                       <div key={m.id} className="flex justify-between text-sm font-bold text-slate-700">
                          <span>{feeTypes.find(t=>t.id===m.feeTypeId)?.name}</span>
                          <span>₹{m.amount.toLocaleString()}</span>
                       </div>
                    ))}
                    {studentLiability.transportFee > 0 && <div className="flex justify-between text-sm font-bold text-slate-700"><span>Fleet Transit Charges</span><span>₹{studentLiability.transportFee}</span></div>}
                    {studentLiability.hostelFee > 0 && <div className="flex justify-between text-sm font-bold text-slate-700"><span>Boarding & Lodging</span><span>₹{studentLiability.hostelFee}</span></div>}
                    {penalty > 0 && <div className="flex justify-between text-sm font-black text-rose-500 italic"><span>Late Penalty (Override)</span><span>+₹{penalty}</span></div>}
                    {discount > 0 && <div className="flex justify-between text-sm font-black text-emerald-600 italic"><span>Scholarship / Waiver ({discountReason})</span><span>-₹{discount}</span></div>}
                 </div>

                 <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex justify-between items-center shadow-xl">
                    <span className="text-xl font-black uppercase italic tracking-widest">Total Realizable</span>
                    <h2 className="text-5xl font-black tracking-tighter">₹{(studentLiability.grandTotal + penalty - discount).toLocaleString()}</h2>
                 </div>

                 <div className="flex gap-4">
                    <button onClick={() => handleShareWhatsApp(true)} className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2">WhatsApp Bill</button>
                    <button onClick={() => alert('PDF Generated.')} className="flex-1 py-4 bg-white text-slate-900 border-2 border-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2">Download PDF</button>
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
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'master' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4">
           <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 w-fit">
              {['deploy', 'types', 'groups', 'assignment'].map(t => (
                <button key={t} onClick={() => setMasterSubTab(t as any)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${masterSubTab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
                  {t === 'deploy' ? 'Fee Deployment' : t}
                </button>
              ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Fee Deployment Logic Form */}
              <div className="lg:col-span-4">
                 {masterSubTab === 'deploy' && (
                   <form onSubmit={handleDeployFee}>
                      <FormSection title="Fee Deployment Matrix" description="Deploy targeted fees to groups & grades.">
                        <div className="lg:col-span-3 space-y-5">
                           <Select label="Fee Head" name="typeId" required options={feeTypes.map(t=>({value:t.id, label:t.name}))} />
                           <Select label="Target Category" name="groupId" required options={feeGroups.map(g=>({value:g.id, label:g.name}))} />
                           <Select label="Target Grade" name="grade" required options={[{value:'All', label:'Institutional (All)'}, ...GRADES.map(g=>({value:g, label:g}))]} />
                           <div className="grid grid-cols-2 gap-4">
                              <Input label="Amount (₹)" name="amount" type="number" required placeholder="0.00" />
                              <Input label="Due Date" name="dueDate" type="date" required />
                           </div>
                           <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                              Deploy Targeted Fee
                           </button>
                        </div>
                      </FormSection>
                   </form>
                 )}
                 {/* ... other subtabs ... */}
              </div>

              {/* Deployment Registry List */}
              <div className="lg:col-span-8 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                 <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">Financial Configuration Registry</h3>
                    <span className="px-5 py-2 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-200">Active System Audit</span>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 border-b border-slate-100">
                          <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                             <th className="px-10 py-6">Fee Particular</th>
                             <th className="px-10 py-6">Targeting</th>
                             <th className="px-10 py-6 text-right">Arrear Value</th>
                             <th className="px-10 py-6 text-right">Deadline</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {feeMasters.map(fm => {
                             const ft = feeTypes.find(t=>t.id === fm.feeTypeId);
                             const fg = feeGroups.find(g=>g.id === fm.feeGroupId);
                             return (
                               <tr key={fm.id} className="hover:bg-slate-50 transition-all">
                                  <td className="px-10 py-8">
                                     <p className="text-lg font-black text-slate-900 uppercase italic">{ft?.name}</p>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 italic opacity-60 tracking-widest">Logic: Grade x Category</p>
                                  </td>
                                  <td className="px-10 py-8">
                                     <div className="flex flex-col gap-2">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest w-fit border border-slate-200">{fm.grade}</span>
                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-[9px] font-black uppercase tracking-widest w-fit border border-indigo-200">{fg?.name}</span>
                                     </div>
                                  </td>
                                  <td className="px-10 py-8 text-right">
                                     <span className="text-2xl font-black text-indigo-600 italic tracking-tighter">₹{fm.amount.toLocaleString()}</span>
                                  </td>
                                  <td className="px-10 py-8 text-right">
                                     <span className="text-sm font-black text-rose-500 italic uppercase">{fm.dueDate}</span>
                                  </td>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4">
           <div className="lg:col-span-4 space-y-6">
              <form onSubmit={handleProcessPayment}>
                 <FormSection title="Transaction Desk" description="Automated arrears fetching for residents.">
                    <div className="lg:col-span-3 space-y-5">
                       <Select 
                         label="Identify Resident" 
                         name="studentId" 
                         required 
                         onSelect={setSelectedStudentId} 
                         options={localStudents.map(s => ({value: s.id, label: `${s.name} (${s.grade})`}))} 
                       />
                       
                       <div className="grid grid-cols-2 gap-4">
                          <Input label="Amount (₹) *" name="paidAmount" type="number" required defaultValue={studentLiability?.grandTotal} />
                          <Select label="Method *" name="method" required options={[{value:'Cash', label:'Cash'}, {value:'Online', label:'Online'}, {value:'UPI', label:'UPI'}, {value:'Cheque', label:'Cheque'}]} />
                       </div>

                       <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 space-y-5">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Waiver / Discount Management</p>
                          <div className="grid grid-cols-1 gap-4">
                             <Input 
                               label="Discount Value (₹)" 
                               name="discount" 
                               type="number" 
                               onBlur={(e: React.FocusEvent<HTMLInputElement>) => setDiscount(Number(e.target.value))} 
                             />
                             <Input 
                               label={`Discount Reason ${discount > 0 ? '*' : ''}`} 
                               name="discountReason" 
                               required={discount > 0}
                               placeholder="e.g. Merit Scholarship, RTE..." 
                               onBlur={(e: React.FocusEvent<HTMLInputElement>) => setDiscountReason(e.target.value)}
                             />
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <Input label="Manual Fine (₹)" name="penalty" type="number" defaultValue={0} onBlur={(e: React.FocusEvent<HTMLInputElement>) => setPenalty(Number(e.target.value))} />
                          <Input label="Fine Narrative" name="penaltyReason" placeholder="Late Payment" />
                       </div>

                       <div className="flex flex-col gap-4 pt-4">
                          <button type="button" onClick={() => setShowBillPreview(true)} disabled={!selectedStudentId} className="w-full py-4 bg-white text-slate-900 border-2 border-slate-900 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-slate-50 disabled:opacity-30">Generate & Share Bill</button>
                          <button type="submit" disabled={!selectedStudentId} className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-30">Confirm Record Receipt</button>
                       </div>
                    </div>
                 </FormSection>
              </form>
           </div>

           <div className="lg:col-span-8 bg-white rounded-[4rem] border border-slate-200 shadow-sm p-16 relative overflow-hidden flex flex-col justify-center h-fit">
              {!studentLiability ? (
                 <div className="py-40 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                       <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                       <p className="text-sm font-black uppercase tracking-[0.5em]">Select Resident to Fetch Automated Dues</p>
                    </div>
                 </div>
              ) : (
                <div className="space-y-12 animate-in zoom-in-95">
                   <div className="flex items-center gap-8 p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                      <img src={studentLiability.student.photo || `https://picsum.photos/seed/${studentLiability.student.id}/100`} className="w-24 h-24 rounded-[2.5rem] object-cover border-4 border-white shadow-xl" alt="" />
                      <div>
                         <h4 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2">{studentLiability.student.name}</h4>
                         <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">{studentLiability.student.grade} • SEC {studentLiability.student.section} • ID {studentLiability.student.studentId}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-50 pb-2">Institutional Multiple Fees</p>
                         <div className="space-y-3">
                            {studentLiability.masters.map(m => (
                               <div key={m.id} className="flex justify-between items-center text-sm font-bold text-slate-600">
                                  <span>{feeTypes.find(t=>t.id===m.feeTypeId)?.name}</span>
                                  <span className="text-slate-900">₹{m.amount.toLocaleString()}</span>
                               </div>
                            ))}
                            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                               <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Total</span>
                               <span className="text-xl font-black text-slate-900 italic">₹{studentLiability.institutionalTotal.toLocaleString()}</span>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-50 pb-2">External Module Fetched Dues</p>
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-600"><span>Fleet Transit Charges</span><span>₹{studentLiability.transportFee}</span></div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-600"><span>Boarding Fee Hub</span><span>₹{studentLiability.hostelFee}</span></div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-600"><span>Library & Penalties</span><span>₹{studentLiability.libraryFines + studentLiability.propertyDamages}</span></div>
                         </div>
                      </div>
                   </div>

                   <div className="p-12 bg-slate-900 rounded-[3.5rem] text-white flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                         <svg className="w-52 h-52" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div className="mb-8 md:mb-0">
                         <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-2">Net Liability Projected</p>
                         <h2 className="text-7xl font-black italic tracking-tighter">₹{(studentLiability.grandTotal + penalty - discount).toLocaleString()}</h2>
                         <div className="mt-2 flex gap-4">
                           {discount > 0 && <span className="text-[10px] font-bold text-emerald-400 uppercase italic">Waiver Applied: -₹{discount}</span>}
                         </div>
                      </div>
                      <button onClick={() => setShowBillPreview(true)} className="px-12 py-5 bg-white text-slate-900 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Preview Digital Bill</button>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default FeesModule;
