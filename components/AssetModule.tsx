
import React, { useState } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
import { Asset, AssetCategory, AssetStatus, AssetAssignment, AssetVerificationResult, Student, Staff } from '../types';

interface AssetModuleProps {
  students: Student[];
  staff: Staff[];
}

const ASSET_CATEGORIES: AssetCategory[] = ['Electronics', 'Furniture', 'Stationery', 'Sports', 'Lab Equipment', 'Vehicles', 'Other'];

const AssetModule: React.FC<AssetModuleProps> = ({ students, staff }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'purchase' | 'distribution' | 'verification'>('inventory');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  
  const [assets, setAssets] = useState<Asset[]>([
    { id: 'AST1', name: 'Nexus Workstation i9', category: 'Electronics', purchaseDate: '2025-01-10', cost: 85000, serialNumber: 'NX-9982', location: 'Admin Room 1', status: 'Operational', description: 'Main admin server station' },
    { id: 'AST2', name: 'Oak Study Desk', category: 'Furniture', purchaseDate: '2024-11-05', cost: 4500, status: 'Distributed', location: 'Class 10A', description: 'Standard student desk' }
  ]);

  const [assignments, setAssignments] = useState<AssetAssignment[]>([
    { id: 'ASG1', assetId: 'AST2', assetName: 'Oak Study Desk', assignedToId: 'S1', assignedToName: 'Aarav Sharma', assignedDate: '2025-02-15', conditionOnIssue: 'New' }
  ]);

  const [verifications, setVerifications] = useState<AssetVerificationResult[]>([
    { id: 'V1', verificationDate: '2025-03-01', verifiedBy: 'Principal Admin', assetsTotal: 2, assetsFound: 2, assetsMissing: 0, remarks: 'Annual audit completed successfully.' }
  ]);

  const handleAddAsset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAsset: Asset = {
      id: `AST${Date.now()}`,
      name: formData.get('name') as string,
      category: formData.get('category') as AssetCategory,
      purchaseDate: formData.get('purchaseDate') as string,
      cost: Number(formData.get('cost')),
      serialNumber: formData.get('serial') as string,
      location: formData.get('location') as string,
      status: 'Operational',
      description: formData.get('description') as string
    };
    setAssets([...assets, newAsset]);
    e.currentTarget.reset();
  };

  const handleAssignAsset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const assetId = formData.get('assetId') as string;
    const assignedToId = formData.get('personId') as string;
    
    const asset = assets.find(a => a.id === assetId);
    const person = [...students, ...staff].find(p => p.id === assignedToId);

    if (asset && person) {
      const newAssignment: AssetAssignment = {
        id: `ASG${Date.now()}`,
        assetId,
        assetName: asset.name,
        assignedToId,
        assignedToName: person.name,
        assignedDate: new Date().toISOString().split('T')[0],
        conditionOnIssue: formData.get('condition') as string
      };
      setAssignments([...assignments, newAssignment]);
      setAssets(assets.map(a => a.id === assetId ? { ...a, status: 'Distributed' } : a));
      e.currentTarget.reset();
    }
  };

  const handleTriggerAudit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const auditor = formData.get('auditor') as string;
    const remarks = formData.get('remarks') as string;

    const total = assets.length;
    const found = assets.filter(a => a.status === 'Operational' || a.status === 'Distributed').length;
    const missing = total - found;

    const newAudit: AssetVerificationResult = {
      id: `V-${Date.now()}`,
      verificationDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      verifiedBy: auditor,
      assetsTotal: total,
      assetsFound: found,
      assetsMissing: missing,
      remarks: remarks || 'Standard institutional reconciliation completed.'
    };

    setVerifications([newAudit, ...verifications]);
    setIsAuditModalOpen(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Audit Modal */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 bg-emerald-500 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">New Audit Cycle</h3>
                <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mt-1">Certification Protocol</p>
              </div>
              <button onClick={() => setIsAuditModalOpen(false)} className="p-2 bg-white/20 hover:bg-white/40 rounded-xl transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleTriggerAudit} className="p-10 space-y-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Inventory Pulse</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Total Units to Verify:</span>
                  <span className="text-xl font-black text-slate-900 italic">{assets.length}</span>
                </div>
              </div>
              
              <Input label="Authorized Auditor Name" name="auditor" required placeholder="e.g. Registrar Office" />
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Audit Remarks</label>
                <textarea name="remarks" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs h-24 outline-none focus:ring-4 focus:ring-emerald-100 resize-none transition-all" placeholder="Note any discrepancies found..."></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAuditModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Abort</button>
                <button type="submit" className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Certify Audit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic inline-block border-b-8 border-indigo-500 pb-2">Asset & Inventory</h1>
          <p className="text-slate-500 font-bold text-sm mt-3 uppercase tracking-widest italic">Institutional Logistics & Resource Control</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {['inventory', 'purchase', 'distribution', 'verification'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
          ))}
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
           <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight italic">Global Inventory Ledger</h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest">{assets.length} Active Records</span>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Details</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Fiscal Value</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {assets.map(a => (
                      <tr key={a.id} className="group hover:bg-slate-50/50 transition-all">
                         <td className="px-8 py-6">
                            <p className="text-sm font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">{a.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">UID: {a.id} • S/N: {a.serialNumber || 'N/A'}</p>
                         </td>
                         <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase">{a.category}</span>
                         </td>
                         <td className="px-8 py-6 text-xs font-bold text-slate-500">{a.location}</td>
                         <td className="px-8 py-6">
                            <p className="text-sm font-black text-indigo-600 italic">₹{a.cost.toLocaleString()}</p>
                            <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">Purchased: {a.purchaseDate}</p>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                               a.status === 'Operational' ? 'bg-emerald-100 text-emerald-700' : 
                               a.status === 'Distributed' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
                            }`}>{a.status}</span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'purchase' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-1">
              <form onSubmit={handleAddAsset}>
                 <FormSection title="Procurement Intake" description="Register newly acquired institutional assets.">
                    <div className="lg:col-span-3 space-y-4">
                       <Input label="Asset Name" name="name" required placeholder="e.g. Science Lab Projector" />
                       <Select label="Asset Category" name="category" required options={ASSET_CATEGORIES.map(c => ({value: c, label: c}))} />
                       <div className="grid grid-cols-2 gap-4">
                          <Input label="Cost (₹)" name="cost" type="number" required />
                          <Input label="Purchase Date" name="purchaseDate" type="date" required />
                       </div>
                       <Input label="Serial / Model #" name="serial" placeholder="Unique OEM identifier" />
                       <Input label="Primary Location" name="location" required placeholder="Room/Lab assigned" />
                       <textarea name="description" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs h-24 resize-none" placeholder="Technical specifications..."></textarea>
                       <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all">Incorporate to Registry</button>
                    </div>
                 </FormSection>
              </form>
           </div>
           
           <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              </div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Institutional Expenditure Hub</p>
              <h2 className="text-6xl font-black italic tracking-tighter">₹{(assets.reduce((a,c)=>a+c.cost, 0)/1000).toFixed(1)}k</h2>
              <p className="text-xs font-bold text-white/40 uppercase mt-4 tracking-widest italic leading-relaxed max-w-sm">Total value of registered institutional inventory current realizing in the centralized repository.</p>
           </div>
        </div>
      )}

      {activeTab === 'distribution' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-1">
              <form onSubmit={handleAssignAsset}>
                 <FormSection title="Asset Distribution" description="Delegate resources to specific users.">
                    <div className="lg:col-span-3 space-y-4">
                       <Select label="Select Asset" name="assetId" required options={assets.filter(a=>a.status === 'Operational').map(a => ({value: a.id, label: a.name}))} />
                       <Select label="Assign to Resident" name="personId" required options={[
                         ...students.map(s => ({value: s.id, label: `(STU) ${s.name}`})),
                         ...staff.map(s => ({value: s.id, label: `(STF) ${s.name}`}))
                       ]} />
                       <Input label="Initial Condition" name="condition" required placeholder="New, Working, Minor Wear..." />
                       <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all">Finalize Assignment</button>
                    </div>
                 </FormSection>
              </form>
           </div>
           
           <div className="lg:col-span-3 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-indigo-50/20">
                 <h3 className="text-xl font-black text-slate-900 uppercase italic">Delegation Log</h3>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-slate-100">
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Name</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Custodian Profile</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Handover Date</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {assignments.map(as => (
                         <tr key={as.id} className="hover:bg-slate-50 transition-all">
                            <td className="px-8 py-6">
                               <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{as.assetName}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase italic">UID: {as.assetId}</p>
                            </td>
                            <td className="px-8 py-6">
                               <p className="text-sm font-black text-indigo-600 uppercase italic">{as.assignedToName}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase">ID: {as.assignedToId}</p>
                            </td>
                            <td className="px-8 py-6 text-center">
                               <span className="text-xs font-black text-slate-400 uppercase">{as.assignedDate}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase hover:bg-rose-600 transition-all shadow-md">Initiate Return</button>
                            </td>
                         </tr>
                       ))}
                       {assignments.length === 0 && <tr><td colSpan={4} className="py-20 text-center text-slate-300 font-black uppercase tracking-widest">No assets in circulation</td></tr>}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'verification' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
           <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight leading-none">Annual Audit Protocol</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Institutional Compliance & Asset Reconciliation</p>
                 </div>
                 <button 
                  onClick={() => setIsAuditModalOpen(true)}
                  className="px-10 py-4 bg-emerald-500 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 hover:bg-emerald-600 transition-all flex items-center gap-3"
                 >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    New Session Audit
                 </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                 <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Inventory Bulk</span>
                    <span className="text-4xl font-black text-slate-900 italic tracking-tighter">{assets.length}</span>
                 </div>
                 <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 flex flex-col items-center text-center">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Currently Verified</span>
                    <span className="text-4xl font-black text-indigo-600 italic tracking-tighter">{assets.filter(a => a.status !== 'Damaged' && a.status !== 'Disposed').length}</span>
                 </div>
                 <div className="p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100 flex flex-col items-center text-center">
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Missing/Faulty Units</span>
                    <span className="text-4xl font-black text-rose-600 italic tracking-tighter">{assets.filter(a => a.status === 'Damaged' || a.status === 'Disposed').length}</span>
                 </div>
                 <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex flex-col items-center text-center">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Audit Status</span>
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-widest mt-2">Certified ✅</span>
                 </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-slate-100">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                       <tr>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase">Audit Date</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase">Authorized Auditor</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase text-center">Coverage</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase text-right">Certification</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {verifications.map(v => (
                         <tr key={v.id}>
                            <td className="px-8 py-6 text-sm font-black text-slate-800 italic">{v.verificationDate}</td>
                            <td className="px-8 py-6 text-sm font-bold text-slate-500 uppercase">{v.verifiedBy}</td>
                            <td className="px-8 py-6 text-center">
                               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{v.assetsFound} / {v.assetsTotal} Verified</p>
                               <div className="h-1 w-24 bg-slate-100 rounded-full mx-auto mt-2 overflow-hidden">
                                  <div className="h-full bg-emerald-500" style={{ width: `${(v.assetsFound / v.assetsTotal) * 100}%` }}></div>
                               </div>
                            </td>
                            <td className="px-8 py-6 text-right font-medium text-slate-400 italic text-xs">"{v.remarks}"</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AssetModule;
