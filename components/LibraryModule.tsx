
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
import { LibraryItem, IssuedBook, Rack, Student, Staff, AppSettings, LibraryItemType } from '../types';

interface LibraryModuleProps {
  students: Student[];
  staff: Staff[];
  settings: AppSettings;
}

const ITEM_TYPES: LibraryItemType[] = ['Book', 'Journal', 'Magazine', 'Newspaper'];
const SUBJECTS = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology', 'Literature', 'Hindi', 'Current Affairs', 'General Knowledge'];
const GRADES = ['General', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

const LibraryModule: React.FC<LibraryModuleProps> = ({ students, staff, settings }) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'circulation' | 'racks' | 'reports'>('catalog');
  const [items, setItems] = useState<LibraryItem[]>([
    { id: 'I1', type: 'Book', title: 'Calculus Early Transcendentals', author: 'James Stewart', publisher: 'Cengage', subject: 'Mathematics', grade: 'Class 12', rackId: 'R1', shelfId: 'S1', barcode: '89012345', status: 'Available', registeredDate: '2025-01-10' },
    { id: 'I2', type: 'Journal', title: 'Science Today - Issue 42', author: 'Various', publisher: 'Nexus Publications', subject: 'Science', grade: 'General', rackId: 'R1', shelfId: 'S2', barcode: '89012346', status: 'Available', registeredDate: '2025-01-12' }
  ]);
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([]);
  const [racks, setRacks] = useState<Rack[]>([
    { id: 'R1', name: 'Science Wing', shelves: ['S1', 'S2', 'S3'] },
    { id: 'R2', name: 'Arts & Humanities', shelves: ['S1', 'S2'] }
  ]);

  const [returningIssueId, setReturningIssueId] = useState<string | null>(null);
  const [damageFeeInput, setDamageFeeInput] = useState<string>('0');

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: LibraryItem = {
      id: `I${items.length + 1}`,
      type: formData.get('type') as LibraryItemType,
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      publisher: formData.get('publisher') as string,
      subject: formData.get('subject') as string,
      grade: formData.get('grade') as string,
      rackId: formData.get('rackId') as string,
      shelfId: formData.get('shelfId') as string,
      barcode: Math.random().toString().slice(2, 12),
      status: 'Available',
      registeredDate: new Date().toISOString().split('T')[0]
    };
    setItems([...items, newItem]);
    e.currentTarget.reset();
  };

  const handlePrintBarcode = (item: LibraryItem) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <body onload="window.print(); window.close();">
          <div style="font-family: sans-serif; text-align: center; border: 1px dashed #ccc; padding: 10px; width: 60mm;">
            <div style="font-size: 8px; font-weight: 900;">${settings.schoolName}</div>
            <div style="font-size: 10px; font-weight: 700; margin: 5px 0;">${item.title}</div>
            <div style="background: black; height: 10mm; width: 100%; margin: 5px 0;"></div>
            <div style="font-family: monospace; font-size: 12px;">${item.barcode}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleIssueItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const itemId = formData.get('itemId') as string;
    const personId = formData.get('personId') as string;
    
    const item = items.find(b => b.id === itemId);
    const person = [...students, ...staff].find(p => p.id === personId);

    if (item && person && item.status === 'Available') {
      const issueDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(issueDate.getDate() + 5);

      const newIssue: IssuedBook = {
        id: `IS${issuedBooks.length + 1}`,
        itemId,
        personId,
        personName: person.name,
        issueDate: issueDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        reissueCount: 0,
        lateFee: 0,
        damageFee: 0
      };

      setIssuedBooks([...issuedBooks, newIssue]);
      setItems(items.map(i => i.id === itemId ? { ...i, status: 'Issued' } : i));
      e.currentTarget.reset();
    }
  };

  const handleConfirmReturn = () => {
    if (!returningIssueId) return;
    const issue = issuedBooks.find(i => i.id === returningIssueId);
    if (!issue) return;
    setIssuedBooks(issuedBooks.map(i => i.id === returningIssueId ? { 
      ...i, 
      returnDate: new Date().toISOString().split('T')[0], 
      lateFee: 0, 
      damageFee: Number(damageFeeInput) 
    } : i));
    setItems(items.map(i => i.id === issue.itemId ? { ...i, status: 'Available' } : i));
    setReturningIssueId(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic inline-block border-b-8 border-[#5B2D8B] pb-2">
            LIBRARY CENTRAL
          </h1>
          <p className="text-slate-500 font-bold text-sm mt-3">Holistic resource management & circulation tracking.</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {['catalog', 'circulation', 'racks', 'reports'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-[#5B2D8B] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleAddItem}>
              <FormSection title="Resource Entry" description="Add books, journals, or newspapers.">
                <div className="lg:col-span-3 space-y-4">
                  <Select label="Resource Type" name="type" required options={ITEM_TYPES.map(t => ({value: t, label: t}))} />
                  <Input label="Title" name="title" required placeholder="Full Title" />
                  <Input label="Author" name="author" required placeholder="Author/Creator" />
                  <Input label="Publisher" name="publisher" required placeholder="Publisher Name" />
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Subject" name="subject" required options={SUBJECTS.map(s => ({value: s, label: s}))} />
                    <Select label="Category" name="grade" required options={GRADES.map(g => ({value: g, label: g}))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Rack" name="rackId" required options={racks.map(r => ({value: r.id, label: r.name}))} />
                    <Input label="Shelf ID" name="shelfId" required placeholder="e.g. S1" />
                  </div>
                  <button type="submit" className="w-full py-5 bg-[#5B2D8B] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-[1.02] active:scale-95">
                    Register Item
                  </button>
                </div>
              </FormSection>
            </form>
          </div>
          
          <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Resource Catalog</h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase">{items.length} Total Items</span>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Barcode</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Title & Type</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase text-center">Location</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map(item => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-5 bg-slate-900 flex items-center gap-[1px] overflow-hidden p-[1px] rounded-[2px]">
                            {[...Array(25)].map((_, i) => <div key={i} className="bg-white flex-1" style={{ height: `${20 + Math.random() * 80}%` }} />)}
                          </div>
                          <button onClick={() => handlePrintBarcode(item)} className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight mb-0.5">{item.title}</p>
                        <span className="text-[8px] font-black text-slate-400 uppercase">{item.type} • {item.subject}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <p className="text-[10px] font-black text-slate-800">Rack {item.rackId}</p>
                        <p className="text-[10px] font-bold text-slate-400">{item.shelfId}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${item.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Issue Terminal Column */}
          <div className="lg:col-span-5 bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-1.5 h-12 bg-[#5B2D8B] rounded-full"></div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">Issue Terminal</h3>
                <p className="text-sm font-medium text-slate-400 italic">Confirm member details and item ID.</p>
              </div>
            </div>
            
            <form onSubmit={handleIssueItem} className="space-y-8">
              <div className="space-y-4">
                <Select 
                  label="AVAILABLE RESOURCE *" 
                  name="itemId" 
                  required 
                  options={items.filter(i => i.status === 'Available').map(i => ({value: i.id, label: `${i.title} (${i.type})`}))} 
                />
                <Select 
                  label="ASSIGN TO *" 
                  name="personId" 
                  required 
                  options={[
                    ...students.map(s => ({value: s.id, label: `${s.name} (${s.grade}-${s.section})`})),
                    ...staff.map(s => ({value: s.id, label: `${s.name} (${s.role})`}))
                  ]} 
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-5 bg-[#5B2D8B] text-white rounded-3xl font-black uppercase tracking-[0.1em] text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                PROCESS LOAN
              </button>
            </form>
          </div>

          {/* Circulation Control Column */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-10">
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase mb-2">CIRCULATION CONTROL</h3>
              <div className="w-full h-0.5 bg-slate-50 mt-6"></div>
            </div>
            
            <div className="overflow-x-auto px-10 pb-10">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="pb-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">RESOURCE & MEMBER</th>
                    <th className="pb-6 text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">CLASS/DEPT</th>
                    <th className="pb-6 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {issuedBooks.map(issue => {
                    const item = items.find(i => i.id === issue.itemId);
                    const person = [...students, ...staff].find(p => p.id === issue.personId);
                    const isStudent = students.some(s => s.id === issue.personId);

                    return (
                      <tr key={issue.id} className="group transition-all">
                        <td className="py-6">
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{item?.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">{issue.personName}</p>
                        </td>
                        <td className="py-6 text-center">
                          {isStudent ? (
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[9px] font-black uppercase">
                              {(person as Student)?.grade}-{(person as Student)?.section}
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase">
                              {(person as Staff)?.role}
                            </span>
                          )}
                        </td>
                        <td className="py-6 text-right">
                          {!issue.returnDate ? (
                            <button 
                              onClick={() => setReturningIssueId(issue.id)}
                              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md"
                            >
                              RETURN
                            </button>
                          ) : (
                            <span className="text-[9px] font-black text-emerald-500 uppercase">RETURNED</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {issuedBooks.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-20 text-center opacity-20">
                        <p className="text-sm font-black uppercase tracking-[0.2em]">Awaiting digital logs</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'racks' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {racks.map(rack => (
            <div key={rack.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:border-indigo-300 transition-all group flex flex-col h-[400px]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase italic leading-none">{rack.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">ID: {rack.id}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {rack.shelves.map(shelf => (
                  <div key={shelf} className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <span className="text-xs font-black text-slate-800 uppercase">Shelf {shelf}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">READY</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryModule;
