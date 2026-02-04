
import React, { useState, useMemo } from 'react';
import { Student, Staff } from '../types';
import { COLORS } from '../constants';
import { Select } from './FormLayout';

interface ListViewProps {
  type: 'students' | 'staff';
  items: (Student | Staff)[];
  onAdd: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const GRADES = [
  'Pre-Nursery', 'Nursery', 'KG', 
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

const ListView: React.FC<ListViewProps> = ({ type, items, onAdd, onEdit, onDelete }) => {
  const [filterGrade, setFilterGrade] = useState<string>('');
  const [filterSection, setFilterSection] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (type === 'students') {
        const s = item as Student;
        const matchGrade = !filterGrade || s.grade === filterGrade;
        const matchSection = !filterSection || s.section === filterSection;
        return matchSearch && matchGrade && matchSection;
      }
      
      return matchSearch;
    });
  }, [items, type, filterGrade, filterSection, searchTerm]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the record for ${name}? This action cannot be undone.`)) {
      onDelete?.(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 capitalize tracking-tight uppercase italic underline decoration-indigo-500 underline-offset-8">{type} Repository</h1>
          <p className="text-slate-500 font-medium italic mt-2">Viewing active academic and staff cycles</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-8 py-4 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl hover:brightness-110 active:scale-95"
          style={{ backgroundColor: COLORS.primary, boxShadow: `0 15px 30px -5px ${COLORS.primary}40` }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Enroll New {type === 'students' ? 'Student' : 'Staff'}
        </button>
      </div>

      {/* Filter Matrix */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 sticky top-4 z-40 backdrop-blur-md bg-white/95">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            </div>
            <div className="hidden lg:block">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Matrix Filter</p>
               <h3 className="text-sm font-black text-slate-900 uppercase">Search Hub</h3>
            </div>
         </div>
         
         <div className="flex-1 flex flex-wrap gap-4 w-full">
            <div className="flex-1 min-w-[200px] relative">
               <input 
                 type="text" 
                 placeholder={`Search by name or ${type === 'students' ? 'Enrollment ID' : 'Staff ID'}...`}
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full px-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-tight outline-none focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
               />
               <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            {type === 'students' && (
              <>
                <div className="w-44">
                   <select 
                     value={filterGrade} 
                     onChange={(e) => setFilterGrade(e.target.value)}
                     className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer"
                   >
                     <option value="">All Classes</option>
                     {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                   </select>
                </div>
                <div className="w-36">
                   <select 
                     value={filterSection} 
                     onChange={(e) => setFilterSection(e.target.value)}
                     className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer"
                   >
                     <option value="">All Sect.</option>
                     {SECTIONS.map(s => <option key={s} value={s}>Sec {s}</option>)}
                   </select>
                </div>
              </>
            )}
            
            <button 
              onClick={() => { setFilterGrade(''); setFilterSection(''); setSearchTerm(''); }}
              className="px-6 py-3.5 bg-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all"
            >
              Clear
            </button>
         </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
           <div>
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Repository Ledger</h3>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">
                {type === 'students' ? 'Student Enrollment Data' : 'Staff Employment Data'}
              </p>
           </div>
           <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
             {filteredItems.length} Entities Indexed
           </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-100">
              <tr className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Identity Profile</th>
                <th className="px-10 py-6">Institutional ID</th>
                <th className="px-10 py-6">{type === 'students' ? 'Class & Sec' : 'Designation'}</th>
                <th className="px-10 py-6">Emergency Contact</th>
                <th className="px-10 py-6 text-center">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-40 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                       <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 shadow-inner">
                         <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                       </div>
                       <p className="text-sm font-black uppercase tracking-[0.4em]">No Entity Records Found in this Segment</p>
                       <button onClick={onAdd} className="text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4" style={{ color: COLORS.primary }}>Initialize New Registration</button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-indigo-50/20 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                           <img 
                             src={item.photo || `https://picsum.photos/seed/${item.id}/60`} 
                             className="w-16 h-16 rounded-[1.5rem] object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform" 
                             alt={item.name} 
                           />
                           <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-lg shadow-sm"></div>
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-1.5">{item.name}</p>
                          <div className="flex items-center gap-3">
                             <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{item.gender}</span>
                             <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.bloodGroup} Group</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <p className="text-xs font-black text-slate-400 font-mono group-hover:text-indigo-600 transition-colors uppercase tracking-widest">
                          {type === 'students' ? (item as Student).studentId : (item as Staff).staffId}
                       </p>
                       <p className="text-[8px] font-black text-slate-300 uppercase mt-1 italic tracking-widest">Master Key: #{item.id}</p>
                    </td>
                    <td className="px-10 py-6">
                      {type === 'students' ? (
                        <div className="space-y-1">
                           <p className="text-sm font-black text-slate-800 uppercase italic">{(item as Student).grade}</p>
                           <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Section {(item as Student).section}</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                           <p className="text-sm font-black text-slate-800 uppercase italic">{(item as Staff).role}</p>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Faculty Core</p>
                        </div>
                      )}
                    </td>
                    <td className="px-10 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-700 tracking-tight">
                          <svg className="w-3.5 h-3.5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                          {item.guardianContact || item.fatherContact}
                        </div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-5">Verified Direct Line</p>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm">Active</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit?.(item.id)}
                          className="p-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-100 transition-all active:scale-90 shadow-sm"
                          title="Edit Profile"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-100 transition-all active:scale-90 shadow-sm"
                          title="Delete Record"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Bulk Action Footer */}
        {filteredItems.length > 0 && (
           <div className="p-8 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 italic">System Ready for Bulk Dispatch</span>
              </div>
              <div className="flex gap-4">
                 <button className="px-8 py-3 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">Bulk SMS Notification</button>
                 <button className="px-10 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Export Segment PDF</button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default ListView;
