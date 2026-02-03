
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, CartesianGrid } from 'recharts';
import { LibraryItem, IssuedBook, Rack, Student, Staff, AppSettings, LibraryItemType } from '../types';

interface LibraryModuleProps {
  students: Student[];
  staff: Staff[];
  settings: AppSettings;
}

const ITEM_TYPES: LibraryItemType[] = ['Book', 'Journal', 'Magazine', 'Newspaper'];
const GRADES = ['General', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

const LibraryModule: React.FC<LibraryModuleProps> = ({ students, staff, settings }) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'circulation' | 'racks' | 'reports'>('catalog');
  
  // Data States
  const [items, setItems] = useState<LibraryItem[]>([
    { id: 'I1', type: 'Book', title: 'Calculus Early Transcendentals', author: 'James Stewart', publisher: 'Cengage', subject: 'Mathematics', grade: 'Class 12', rackId: 'R1', shelfId: 'S1', barcode: '89012345', status: 'Available', registeredDate: '2025-01-10' },
    { id: 'I2', type: 'Journal', title: 'Science Today - March Ed.', author: 'Various', publisher: 'Times Group', subject: 'Science', grade: 'General', rackId: 'R2', shelfId: 'S3', barcode: '77221100', status: 'Issued', registeredDate: '2025-02-05' }
  ]);
  
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([
    { id: 'ISS1', itemId: 'I2', personId: 'S1', personName: 'Aarav Sharma', issueDate: '2025-02-10', dueDate: '2025-02-17', reissueCount: 0, lateFee: 0, damageFee: 0 }
  ]);
  
  const [racks, setRacks] = useState<Rack[]>([
    { id: 'R1', name: 'Science Wing', shelves: ['S1', 'S2', 'S3'] },
    { id: 'R2', name: 'Arts & Languages', shelves: ['L1', 'L2'] }
  ]);

  // Fee Settlement State
  const [settlingIssue, setSettlingIssue] = useState<IssuedBook | null>(null);
  const [manualLateFee, setManualLateFee] = useState<number>(0);
  const [damagePenalty, setDamagePenalty] = useState<number>(0);

  // Catalog Handlers
  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: LibraryItem = {
      id: `ITEM-${Date.now()}`,
      type: formData.get('type') as LibraryItemType,
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      publisher: formData.get('publisher') as string,
      subject: formData.get('subject') as string,
      grade: formData.get('grade') as string,
      rackId: formData.get('rackId') as string,
      shelfId: formData.get('shelfId') as string,
      barcode: formData.get('barcode') as string,
      status: 'Available',
      registeredDate: new Date().toISOString().split('T')[0]
    };
    setItems([...items, newItem]);
    e.currentTarget.reset();
  };

  // Circulation Handlers
  const handleIssueItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const itemId = formData.get('itemId') as string;
    const personId = formData.get('personId') as string;
    
    const item = items.find(i => i.id === itemId);
    const student = students.find(s => s.id === personId);
    const staffMember = staff.find(s => s.id === personId);
    
    if (item && item.status === 'Available' && (student || staffMember)) {
      const issue: IssuedBook = {
        id: `ISS-${Date.now()}`,
        itemId,
        personId,
        personName: student?.name || staffMember?.name || 'Unknown',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: formData.get('dueDate') as string,
        reissueCount: 0,
        lateFee: 0,
        damageFee: 0
      };
      setIssuedBooks([issue, ...issuedBooks]);
      setItems(items.map(i => i.id === itemId ? { ...i, status: 'Issued' } : i));
      e.currentTarget.reset();
    }
  };

  const calculateAutoLateFee = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    if (today <= due) return 0;
    const diffDays = Math.ceil((today.getTime() - due.getTime()) / (1000 * 3600 * 24));
    return diffDays * 5; // Default ₹5 per day
  };

  const openReturnModal = (issue: IssuedBook) => {
    const autoFee = calculateAutoLateFee(issue.dueDate);
    setSettlingIssue(issue);
    setManualLateFee(autoFee);
    setDamagePenalty(0);
  };

  const finalizeReturn = () => {
    if (!settlingIssue) return;
    
    setItems(items.map(i => i.id === settlingIssue.itemId ? { ...i, status: 'Available' } : i));
    setIssuedBooks(issuedBooks.filter(i => i.id !== settlingIssue.id));
    
    alert(`Settlement Processed!\nLate Fee: ₹${manualLateFee}\nDamage Penalty: ₹${damagePenalty}\nTotal: ₹${manualLateFee + damagePenalty}`);
    
    setSettlingIssue(null);
  };

  // Rack Handlers
  const handleAddRack = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRack: Rack = {
      id: `RACK-${Date.now()}`,
      name: formData.get('name') as string,
      shelves: (formData.get('shelves') as string).split(',').map(s => s.trim())
    };
    setRacks([...racks, newRack]);
    e.currentTarget.reset();
  };

  // Report Data
  const circulationData = [
    { name: 'Jan', count: 145 }, { name: 'Feb', count: 182 }, { name: 'Mar', count: 210 }
  ];

  const typeDistribution = [
    { name: 'Books', value: 75 }, { name: 'Journals', value: 15 }, { name: 'Others', value: 10 }
  ];

  const fineRealization = [
    { name: 'Week 1', collection: 450 }, { name: 'Week 2', collection: 820 }, { name: 'Week 3', collection: 1200 }, { name: 'Week 4', collection: 750 }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Settlement Modal */}
      {settlingIssue && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-slate-100 bg-rose-50/50">
                 <h2 className="text-3xl font-black text-rose-900 uppercase italic tracking-tighter">Return Settlement</h2>
                 <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-1">Institutional Penalty Reconciliation</p>
              </div>
              <div className="p-10 space-y-8">
                 <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <div className="w-16 h-16 rounded-2xl bg-white border-4 border-slate-50 flex items-center justify-center text-indigo-600 font-black text-xl">
                       {settlingIssue.personName[0]}
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 uppercase leading-none mb-1">{settlingIssue.personName}</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase">Issue ID: {settlingIssue.id}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Late Fine Arrears (₹)</label>
                       <input 
                         type="number" 
                         value={manualLateFee}
                         onChange={(e) => setManualLateFee(Number(e.target.value))}
                         className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-black text-rose-600 outline-none focus:ring-4 focus:ring-rose-100" 
                       />
                       <p className="text-[9px] font-bold text-slate-400 uppercase italic">Ref: Due on {settlingIssue.dueDate}</p>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Damage Penalty (₹)</label>
                       <input 
                         type="number" 
                         value={damagePenalty}
                         onChange={(e) => setDamagePenalty(Number(e.target.value))}
                         className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-black text-slate-800 outline-none focus:ring-4 focus:ring-rose-100" 
                       />
                       <p className="text-[9px] font-bold text-slate-400 uppercase italic">Institutional Assessment</p>
                    </div>
                 </div>

                 <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex justify-between items-center shadow-xl">
                    <div>
                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Gross Realization</p>
                       <h2 className="text-4xl font-black italic tracking-tighter">₹{manualLateFee + damagePenalty}</h2>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-white/30 uppercase">Audit Verified</p>
                       <div className="h-0.5 w-12 bg-emerald-500 ml-auto mt-2 rounded-full"></div>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button onClick={() => setSettlingIssue(null)} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Cancel Audit</button>
                    <button onClick={finalizeReturn} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Confirm Return</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic inline-block border-b-8 border-indigo-500 pb-2">LIBRARY CENTRAL</h1>
          <p className="text-slate-500 font-bold text-sm mt-3 uppercase tracking-widest italic">Institutional Resource & Knowledge Asset Management</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {['catalog', 'circulation', 'racks', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{tab}</button>
          ))}
        </div>
      </div>

      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-1">
              <form onSubmit={handleAddItem}>
                 <FormSection title="Resource Intake" description="Index new items into the library database.">
                    <div className="lg:col-span-3 space-y-4">
                       <Select label="Item Modality" name="type" required options={ITEM_TYPES.map(t => ({value: t, label: t}))} />
                       <Input label="Title / Heading" name="title" required placeholder="Full title of resource" />
                       <Input label="Author / Editor" name="author" required placeholder="Primary creator" />
                       <Input label="Publisher" name="publisher" required placeholder="Publishing house" />
                       <div className="grid grid-cols-2 gap-4">
                          <Input label="Subject Area" name="subject" required placeholder="e.g. History" />
                          <Select label="Target Grade" name="grade" required options={GRADES.map(g => ({value: g, label: g}))} />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <Select label="Assign Rack" name="rackId" required options={racks.map(r => ({value: r.id, label: r.name}))} />
                          <Input label="Shelf Code" name="shelfId" required placeholder="S1, L2..." />
                       </div>
                       <Input label="Barcode / ISBN" name="barcode" required placeholder="Unique Identifer" />
                       <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all">Enroll to Catalog</button>
                    </div>
                 </FormSection>
              </form>
           </div>
           
           <div className="lg:col-span-3 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <h3 className="text-xl font-black text-slate-800 uppercase italic">Institutional Catalog</h3>
                 <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest">{items.length} Items Live</span>
              </div>
              <div className="overflow-x-auto p-4">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-slate-100">
                          <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase">Resource Detail</th>
                          <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase">Author / Publisher</th>
                          <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase">Location</th>
                          <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {items.map(item => (
                         <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                            <td className="px-6 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                                     {item.type[0]}
                                  </div>
                                  <div>
                                     <p className="text-sm font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">{item.title}</p>
                                     <p className="text-[10px] font-bold text-slate-400">Barcode: {item.barcode}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-6">
                               <p className="text-xs font-bold text-slate-700">{item.author}</p>
                               <p className="text-[9px] font-black text-slate-400 uppercase">{item.publisher}</p>
                            </td>
                            <td className="px-6 py-6">
                               <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Rack: {racks.find(r => r.id === item.rackId)?.name}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase">Shelf: {item.shelfId}</p>
                            </td>
                            <td className="px-6 py-6 text-right">
                               <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${item.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                  {item.status}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'circulation' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-1">
              <form onSubmit={handleIssueItem}>
                 <FormSection title="Issue Terminal" description="Dispatch assets to students or staff.">
                    <div className="lg:col-span-3 space-y-4">
                       <Select label="Select Target Person" name="personId" required options={[
                         ...students.map(s => ({value: s.id, label: `(STU) ${s.name}`})),
                         ...staff.map(s => ({value: s.id, label: `(STF) ${s.name}`}))
                       ]} />
                       <Select label="Select Available Item" name="itemId" required options={items.filter(i => i.status === 'Available').map(i => ({value: i.id, label: i.title}))} />
                       <Input label="Due Date" name="dueDate" type="date" required />
                       <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Process Issue</button>
                    </div>
                 </FormSection>
              </form>
           </div>
           
           <div className="lg:col-span-3 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
                 <h3 className="text-xl font-black uppercase tracking-tight">Active Loans</h3>
                 <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{issuedBooks.length} Items Out</span>
              </div>
              <div className="overflow-x-auto p-4">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-slate-100">
                          <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase">Item Issued</th>
                          <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase">Resident Name</th>
                          <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase text-center">Due Timeline</th>
                          <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {issuedBooks.map(issue => (
                         <tr key={issue.id} className="group hover:bg-indigo-50/20 transition-all">
                            <td className="px-6 py-6">
                               <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{items.find(i => i.id === issue.itemId)?.title}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase italic">Ref: {issue.id}</p>
                            </td>
                            <td className="px-6 py-6">
                               <p className="text-xs font-bold text-slate-700">{issue.personName}</p>
                               <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">ID: {issue.personId}</p>
                            </td>
                            <td className="px-6 py-6 text-center">
                               <p className="text-[10px] font-black text-slate-400 uppercase">Due By: <span className="text-rose-500">{issue.dueDate}</span></p>
                               <p className="text-[8px] font-bold text-slate-300 uppercase mt-1">Issued: {issue.issueDate}</p>
                            </td>
                            <td className="px-6 py-6 text-right">
                               <button 
                                 onClick={() => openReturnModal(issue)}
                                 className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-md"
                               >
                                  Record Return
                               </button>
                            </td>
                         </tr>
                       ))}
                       {issuedBooks.length === 0 && (
                         <tr><td colSpan={4} className="py-20 text-center text-slate-300 font-black uppercase tracking-widest">No Active Loan Records</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'racks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1">
              <form onSubmit={handleAddRack}>
                 <FormSection title="Infrastructure Map" description="Add physical storage racks & shelving.">
                    <div className="lg:col-span-3 space-y-4">
                       <Input label="Rack Name" name="name" required placeholder="e.g. Reference Rack A" />
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Shelf Codes (Comma Sep.)</label>
                          <textarea name="shelves" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs h-24 resize-none" placeholder="S1, S2, S3..."></textarea>
                       </div>
                       <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Register Rack</button>
                    </div>
                 </FormSection>
              </form>
           </div>
           
           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {racks.map(rack => (
                <div key={rack.id} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm hover:border-indigo-400 transition-all group flex flex-col">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase italic">ID: {rack.id}</span>
                   </div>
                   <h3 className="text-xl font-black text-slate-800 uppercase italic mb-4">{rack.name}</h3>
                   <div className="flex flex-wrap gap-2 mt-auto">
                      {rack.shelves.map(s => (
                        <span key={s} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase">{s}</span>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-black uppercase italic tracking-tight mb-10">Circulation Volume</h3>
              <div className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={circulationData}>
                       <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="900" />
                       <YAxis stroke="#94a3b8" fontSize={10} fontWeight="900" />
                       <Tooltip cursor={{fill: 'transparent'}} />
                       <Bar dataKey="count" fill="#ec4899" radius={[10, 10, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
           
           <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-black uppercase italic tracking-tight mb-10 text-rose-600">Fine Realization Pulse</h3>
              <div className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fineRealization}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                       <YAxis stroke="#94a3b8" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                       <Tooltip cursor={{fill: '#f8fafc'}} />
                       <Bar dataKey="collection" fill="#f43f5e" radius={[12, 12, 0, 0]} barSize={40} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
              <div className="mt-8 flex justify-between items-end border-t border-slate-100 pt-8">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Penalties Month-to-Date</p>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">₹3,220</h2>
                 </div>
                 <span className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-rose-100">12% Growth from Feb</span>
              </div>
           </div>

           <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm lg:col-span-2">
              <h3 className="text-2xl font-black uppercase italic tracking-tight mb-10">Resource Composition</h3>
              <div className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={typeDistribution} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                          {typeDistribution.map((_, i) => <Cell key={i} fill={['#6366f1', '#ec4899', '#f59e0b'][i % 3]} />)}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-12 mt-6">
                 {typeDistribution.map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#6366f1', '#ec4899', '#f59e0b'][i % 3] }} />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{d.name}: {d.value}%</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LibraryModule;
