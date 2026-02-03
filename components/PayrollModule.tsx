
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
import { Staff, StaffRole, SalaryStructure, LeaveRequest, PayrollRecord, AppSettings, StaffAttendance } from '../types';

interface PayrollModuleProps {
  staff: Staff[];
  settings: AppSettings;
  staffAttendance: StaffAttendance[];
}

const ROLES: StaffRole[] = ['Principal', 'Coordinator', 'Teacher', 'Non-Teaching Staff', 'Accountant', 'Librarian'];

const PayrollModule: React.FC<PayrollModuleProps> = ({ staff, settings, staffAttendance }) => {
  const [activeTab, setActiveTab] = useState<'structures' | 'leaves' | 'process' | 'history'>('process');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [isPaySlipOpen, setIsPaySlipOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState<SalaryStructure | null>(null);

  // Configuration for Salary Structures
  const [structures, setStructures] = useState<SalaryStructure[]>([
    { id: 'SS1', role: 'Principal', basePay: 120000, hra: 15000, da: 5000, specialAllowance: 10000, paidLeaveLimit: 3 },
    { id: 'SS2', role: 'Coordinator', basePay: 80000, hra: 8000, da: 4000, specialAllowance: 5000, paidLeaveLimit: 2 },
    { id: 'SS3', role: 'Teacher', basePay: 45000, hra: 4500, da: 2000, specialAllowance: 2000, paidLeaveLimit: 2 },
    { id: 'SS4', role: 'Non-Teaching Staff', basePay: 25000, hra: 2500, da: 1000, specialAllowance: 500, paidLeaveLimit: 1 }
  ]);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    { id: 'LR1', staffId: 'T1', staffName: 'Dr. Anjali Verma', startDate: '2025-03-10', endDate: '2025-03-12', reason: 'Fever', type: 'Sick', status: 'Approved' }
  ]);

  const [payrollHistory, setPayrollHistory] = useState<PayrollRecord[]>([]);

  // Calculation Logic
  const getStaffSalaryInfo = (staffId: string) => {
    const person = staff.find(s => s.id === staffId);
    if (!person) return null;

    const structure = structures.find(s => s.role === person.role);
    if (!structure) return null;

    // Monthly attendance logic
    const monthAtt = staffAttendance.filter(a => a.staffId === staffId);
    const absentCount = monthAtt.filter(a => a.status === 'Absent').length;
    const leaveCount = monthAtt.filter(a => a.status === 'Leave').length;

    const excessLeaves = Math.max(0, leaveCount - structure.paidLeaveLimit);
    const dailyRate = structure.basePay / 30;
    const deductions = (absentCount + excessLeaves) * dailyRate;

    const allowances = structure.hra + structure.da + structure.specialAllowance;
    const gross = structure.basePay + allowances;
    
    return {
      person,
      structure,
      allowances,
      gross,
      deductions,
      absentCount,
      excessLeaves,
      net: gross - deductions
    };
  };

  const handleUpdateStructure = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const role = formData.get('role') as StaffRole;
    const basePay = Number(formData.get('basePay'));
    const hra = Number(formData.get('hra'));
    const da = Number(formData.get('da'));
    const specialAllowance = Number(formData.get('specialAllowance'));
    const paidLeaveLimit = Number(formData.get('paidLeaveLimit'));

    setStructures(prev => {
      const existing = prev.find(s => s.role === role);
      if (existing) {
        return prev.map(s => s.role === role ? { ...s, basePay, hra, da, specialAllowance, paidLeaveLimit } : s);
      }
      return [...prev, { id: `SS${Date.now()}`, role, basePay, hra, da, specialAllowance, paidLeaveLimit }];
    });
    
    setEditingStructure(null);
    alert('Salary Structure Updated Successfully');
  };

  const handleDeleteStructure = (id: string) => {
    if (confirm('Are you sure you want to remove this salary grade?')) {
      setStructures(structures.filter(s => s.id !== id));
    }
  };

  const handleProcessSalary = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const staffId = formData.get('staffId') as string;
    const bonus = Number(formData.get('bonus') || 0);
    const info = getStaffSalaryInfo(staffId);

    if (info) {
      const newRecord: PayrollRecord = {
        id: `PAY-${Date.now()}`,
        staffId,
        month: 'March 2025',
        basePay: info.structure.basePay,
        allowances: info.allowances,
        bonus,
        deductions: info.deductions,
        netSalary: info.net + bonus,
        generatedDate: new Date().toLocaleDateString(),
        status: 'Paid'
      };
      setPayrollHistory([newRecord, ...payrollHistory]);
      alert(`Salary Processed for ${info.person.name}`);
      e.currentTarget.reset();
    }
  };

  const selectedInfo = useMemo(() => selectedStaffId ? getStaffSalaryInfo(selectedStaffId) : null, [selectedStaffId, structures, staffAttendance]);

  const renderPaySlip = () => {
    if (!selectedInfo) return null;
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden p-16 animate-in zoom-in-95 duration-300 print:shadow-none print:w-full print:p-8">
           <div className="flex justify-between items-start border-b-4 border-slate-900 pb-8 mb-10">
              <div>
                 <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{settings.schoolName}</h1>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 italic">{settings.branchName}</p>
              </div>
              <div className="text-right">
                 <div className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg inline-block mb-2">Private & Confidential</div>
                 <h2 className="text-xl font-serif italic font-black text-slate-800">Monthly Pay Slip</h2>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cycle: March 2025</p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-12 mb-12">
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Employee Information</p>
                 <div className="flex items-center gap-4">
                    <img src={selectedInfo.person.photo || `https://picsum.photos/seed/${selectedInfo.person.id}/80`} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="" />
                    <div>
                       <h3 className="text-xl font-black text-slate-900 uppercase leading-none mb-1">{selectedInfo.person.name}</h3>
                       <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{selectedInfo.person.role}</p>
                       <p className="text-[9px] font-medium text-slate-400">Staff ID: {selectedInfo.person.staffId}</p>
                    </div>
                 </div>
              </div>
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 text-right">Bank Settlement</p>
                 <div className="text-right space-y-1">
                    <p className="text-sm font-black text-slate-700">{selectedInfo.person.bankName}</p>
                    <p className="text-xs font-bold text-slate-500">AC: ****{selectedInfo.person.accountNumber.slice(-4)}</p>
                    <p className="text-[9px] font-black text-slate-300 uppercase">IFSC: {selectedInfo.person.ifscCode}</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                 <h4 className="text-[11px] font-black bg-slate-900 text-white px-4 py-1.5 inline-block uppercase tracking-[0.2em]">Earnings / Credit</h4>
                 <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                       <span className="text-xs font-bold text-slate-500 uppercase">Basic Pay</span>
                       <span className="text-sm font-black text-slate-900">₹{selectedInfo.structure.basePay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                       <span className="text-xs font-bold text-slate-500 uppercase">HRA</span>
                       <span className="text-sm font-black text-slate-900">₹{selectedInfo.structure.hra.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                       <span className="text-xs font-bold text-slate-500 uppercase">Dearness Allowance</span>
                       <span className="text-sm font-black text-slate-900">₹{selectedInfo.structure.da.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                       <span className="text-xs font-bold text-slate-500 uppercase">Special Allowance</span>
                       <span className="text-sm font-black text-slate-900">₹{selectedInfo.structure.specialAllowance.toLocaleString()}</span>
                    </div>
                 </div>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[11px] font-black bg-rose-600 text-white px-4 py-1.5 inline-block uppercase tracking-[0.2em]">Deductions / Debit</h4>
                 <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                       <span className="text-xs font-bold text-slate-500 uppercase">Unpaid Leaves ({selectedInfo.excessLeaves})</span>
                       <span className="text-sm font-black text-rose-600">₹{selectedInfo.deductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-1">
                       <span className="text-xs font-bold text-slate-500 uppercase">Statutory Taxes</span>
                       <span className="text-sm font-black text-rose-600">₹0.00</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="mt-16 p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              </div>
              <div>
                 <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">Net Monthly Liquidity</p>
                 <h3 className="text-xl font-black text-indigo-900 uppercase italic">Take Home Salary</h3>
              </div>
              <h2 className="text-5xl font-black text-indigo-600 tracking-tighter">₹{selectedInfo.net.toLocaleString()}</h2>
           </div>

           <div className="mt-16 flex justify-between items-end">
              <div className="text-center">
                 <div className="w-32 h-0.5 bg-slate-200 mb-2"></div>
                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Accounts Manager</p>
              </div>
              <div className="text-center">
                 <div className="w-32 h-0.5 bg-slate-200 mb-2"></div>
                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Employee Seal</p>
              </div>
           </div>

           <div className="mt-12 flex gap-4 print:hidden">
              <button onClick={() => window.print()} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Download PDF</button>
              <button onClick={() => setIsPaySlipOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest">Close</button>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {isPaySlipOpen && renderPaySlip()}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-500 underline-offset-8">Payroll Terminal</h1>
          <p className="text-slate-500 font-medium italic">Institutional HR liquidity, salary disbursement & leave accounting.</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {[
            { id: 'structures', label: 'Compensation Mapping' },
            { id: 'leaves', label: 'Leave Hub' },
            { id: 'process', label: 'Disbursement Console' },
            { id: 'history', label: 'Payment Ledger' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'structures' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <form key={editingStructure?.id || 'new'} onSubmit={handleUpdateStructure}>
              <FormSection title={editingStructure ? "Modify Grade" : "Role Architect"} description={editingStructure ? `Adjusting ${editingStructure.role}` : "Define pay bands & leave allowances."}>
                <div className="lg:col-span-3 space-y-4">
                  <Select label="Institutional Role" name="role" required defaultValue={editingStructure?.role} options={ROLES.map(r => ({value: r, label: r}))} />
                  <Input label="Base Pay (₹)" name="basePay" type="number" required defaultValue={editingStructure?.basePay} />
                  <div className="grid grid-cols-2 gap-4">
                     <Input label="HRA (₹)" name="hra" type="number" required defaultValue={editingStructure?.hra} />
                     <Input label="DA (₹)" name="da" type="number" required defaultValue={editingStructure?.da} />
                  </div>
                  <Input label="Special Allowance (₹)" name="specialAllowance" type="number" required defaultValue={editingStructure?.specialAllowance} />
                  <Input label="Paid Leave Limit" name="paidLeaveLimit" type="number" required defaultValue={editingStructure?.paidLeaveLimit} />
                  
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">
                      {editingStructure ? 'Update Grade' : 'Commit Grade'}
                    </button>
                    {editingStructure && (
                      <button type="button" onClick={() => setEditingStructure(null)} className="px-6 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </FormSection>
            </form>
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             {structures.map(s => (
               <div key={s.id} className={`bg-white p-8 rounded-[3rem] border shadow-sm transition-all flex flex-col group ${editingStructure?.id === s.id ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-xl scale-[1.02]' : 'border-slate-200 hover:border-indigo-300'}`}>
                  <div className="flex justify-between items-start mb-6">
                     <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest">{s.role}</span>
                     <div className="flex gap-2">
                        <button onClick={() => handleDeleteStructure(s.id)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner font-black">₹</div>
                     </div>
                  </div>
                  <div className="space-y-4 flex-1">
                     <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Fixed Basic</span>
                        <span className="text-xl font-black text-slate-900 tracking-tighter">₹{s.basePay.toLocaleString()}</span>
                     </div>
                     <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                        <div className="space-y-1">
                           <span className="text-[8px] font-black text-slate-300 uppercase">Total Allow.</span>
                           <p className="text-xs font-bold text-slate-700">₹{(s.hra + s.da + s.specialAllowance).toLocaleString()}</p>
                        </div>
                        <div className="space-y-1 text-right">
                           <span className="text-[8px] font-black text-slate-300 uppercase">Paid Leaves</span>
                           <p className="text-xs font-bold text-slate-700">{s.paidLeaveLimit} / Month</p>
                        </div>
                     </div>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingStructure(s);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`mt-8 w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${editingStructure?.id === s.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'}`}
                  >
                    Adjust Structure
                  </button>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'leaves' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-1">
              <form onSubmit={(e) => { e.preventDefault(); alert('Leave Request Submitted to Principal Dashboard'); }}>
                 <FormSection title="Leave Terminal" description="Submit digital leave requisitions.">
                    <div className="lg:col-span-3 space-y-4">
                       <Select label="Employee" name="staffId" required options={staff.map(s => ({value: s.id, label: s.name}))} />
                       <div className="grid grid-cols-2 gap-4">
                          <Input label="Start Date" name="start" type="date" required />
                          <Input label="End Date" name="end" type="date" required />
                       </div>
                       <Select label="Request Type" name="type" required options={[{value:'Sick', label:'Medical'}, {value:'Casual', label:'Casual'}, {value:'Personal', label:'Personal'}]} />
                       <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs h-24 resize-none" placeholder="Provide detailed justification..."></textarea>
                       <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Submit for Approval</button>
                    </div>
                 </FormSection>
              </form>
           </div>
           <div className="lg:col-span-3 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <h3 className="text-xl font-black uppercase tracking-tight italic">Institutional Leave Log</h3>
                 <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Active Requests</span>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Employee Profile</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Duration & Reason</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">HR Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {leaveRequests.map(lr => (
                         <tr key={lr.id} className="group hover:bg-slate-50/50 transition-all">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                  <img src={`https://picsum.photos/seed/${lr.staffId}/50`} className="w-12 h-12 rounded-xl object-cover border border-slate-200" alt="" />
                                  <div>
                                     <p className="text-sm font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">{lr.staffName}</p>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase">Ref: {lr.id}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <p className="text-xs font-black text-indigo-600 uppercase">{lr.startDate} → {lr.endDate}</p>
                               <p className="text-[10px] font-medium text-slate-400 mt-1 italic">"{lr.reason}"</p>
                            </td>
                            <td className="px-8 py-6 text-center">
                               <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${lr.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{lr.status}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex justify-end gap-2">
                                  <button className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[9px] font-black uppercase hover:bg-rose-600 hover:text-white transition-all shadow-sm">Void</button>
                                  <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase hover:bg-emerald-600 transition-all shadow-sm">Authorize</button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'process' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-1">
              <form onSubmit={handleProcessSalary}>
                 <FormSection title="Pay Cycle Console" description="Execute monthly salary disbursement.">
                    <div className="lg:col-span-3 space-y-4">
                       <Select label="Select Employee" name="staffId" required options={staff.map(s => ({value: s.id, label: s.name}))} onSelect={setSelectedStaffId} />
                       {selectedStaffId && selectedInfo && (
                         <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 animate-in zoom-in-95">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Live Liquidity Pulse</p>
                            <div className="space-y-2">
                               <div className="flex justify-between items-baseline">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">Gross Salary</span>
                                  <span className="text-xl font-black text-slate-900 tracking-tighter">₹{selectedInfo.gross.toLocaleString()}</span>
                               </div>
                               <div className="flex justify-between items-baseline pt-2 border-t border-emerald-100">
                                  <span className="text-[9px] font-black text-rose-500 uppercase">Projected Deduct.</span>
                                  <span className="text-sm font-black text-rose-600">-₹{selectedInfo.deductions.toLocaleString()}</span>
                               </div>
                               <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl mt-3">
                                  <span className="text-[8px] font-black text-indigo-600 uppercase">Est. Net</span>
                                  <span className="text-lg font-black text-indigo-900">₹{selectedInfo.net.toLocaleString()}</span>
                               </div>
                            </div>
                         </div>
                       )}
                       <Input label="Increment / Promotion Bonus (₹)" name="bonus" type="number" defaultValue={0} />
                       <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:brightness-110 active:scale-95 transition-all">Finalize Disbursement</button>
                    </div>
                 </FormSection>
              </form>
           </div>
           <div className="lg:col-span-3 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 bg-indigo-50/30 flex justify-between items-center">
                 <h3 className="text-xl font-black uppercase tracking-tight italic">Disbursement Queue</h3>
                 <div className="flex gap-4">
                    <button onClick={() => setIsPaySlipOpen(true)} disabled={!selectedStaffId} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg disabled:opacity-30">Preview Pay Slip</button>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Gross Cred.</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Deductions</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Net Liquidity</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {staff.map(s => {
                          const info = getStaffSalaryInfo(s.id);
                          return (
                            <tr key={s.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer" onClick={() => setSelectedStaffId(s.id)}>
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                     <img src={s.photo || `https://picsum.photos/seed/${s.id}/50`} className="w-12 h-12 rounded-xl object-cover border border-slate-200" alt="" />
                                     <div>
                                        <p className="text-sm font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">{s.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{s.role}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-center">
                                  <p className="text-sm font-black text-slate-900">₹{info?.gross.toLocaleString()}</p>
                               </td>
                               <td className="px-8 py-6 text-center">
                                  <p className="text-sm font-black text-rose-500">₹{info?.deductions.toLocaleString()}</p>
                                  <p className="text-[8px] font-bold text-slate-300 uppercase">Incl. {info?.excessLeaves} Unpaid Leaves</p>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <p className="text-lg font-black text-indigo-600 italic">₹{info?.net.toLocaleString()}</p>
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

      {activeTab === 'history' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight italic">Disbursement Archive</h3>
              <div className="flex items-center gap-4">
                 <input type="text" placeholder="Filter by Month/ID..." className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-xs outline-none focus:bg-white focus:text-slate-900 w-64 shadow-inner" />
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                       <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                       <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Recipient Profile</th>
                       <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Disbursement Month</th>
                       <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Net Realized</th>
                       <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Ledger Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {payrollHistory.map(ph => {
                      const person = staff.find(s => s.id === ph.staffId);
                      return (
                        <tr key={ph.id} className="group hover:bg-slate-50/50 transition-all">
                           <td className="px-10 py-6 text-xs font-black text-slate-400 font-mono">{ph.id}</td>
                           <td className="px-10 py-6">
                              <p className="text-sm font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">{person?.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{person?.role}</p>
                           </td>
                           <td className="px-10 py-6 text-center">
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest">{ph.month}</span>
                           </td>
                           <td className="px-10 py-6 text-center">
                              <p className="text-sm font-black text-emerald-600 italic">₹{ph.netSalary.toLocaleString()}</p>
                           </td>
                           <td className="px-10 py-6 text-right">
                              <div className="flex justify-end gap-2">
                                 <span className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md">Realized</span>
                                 <button onClick={() => { setSelectedStaffId(ph.staffId); setIsPaySlipOpen(true); }} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                              </div>
                           </td>
                        </tr>
                      );
                    })}
                    {payrollHistory.length === 0 && (
                      <tr>
                         <td colSpan={5} className="py-32 text-center">
                            <div className="flex flex-col items-center gap-4 opacity-20">
                               <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                               <p className="text-xs font-black uppercase tracking-[0.4em]">No historical ledger records found</p>
                            </div>
                         </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default PayrollModule;
