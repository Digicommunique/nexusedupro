
import React from 'react';
import { Student, Staff } from '../types';
import { COLORS } from '../constants';

interface ListViewProps {
  type: 'students' | 'staff';
  items: (Student | Staff)[];
  onAdd: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ type, items, onAdd, onEdit, onDelete }) => {
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the record for ${name}? This action cannot be undone.`)) {
      onDelete?.(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 capitalize tracking-tight">{type} Repository</h1>
          <p className="text-slate-500 font-medium italic">Viewing active academic and staff cycles</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-black transition-all shadow-xl hover:brightness-110 active:scale-95"
          style={{ backgroundColor: COLORS.primary, boxShadow: `0 8px 15px -3px ${COLORS.primary}40` }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Enroll {type === 'students' ? 'Student' : 'Staff'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">System ID</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metadata</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Communication</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-right px-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                         <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                       </div>
                       <p className="text-slate-400 font-bold">No active {type} records found.</p>
                       <button onClick={onAdd} className="text-sm font-black underline" style={{ color: COLORS.primary }}>Start Registration</button>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.photo || `https://picsum.photos/seed/${item.id}/40`} 
                          className="w-12 h-12 rounded-xl object-cover shadow-sm ring-2 ring-transparent group-hover:ring-indigo-100 transition-all" 
                          alt={item.name} 
                        />
                        <div>
                          <p className="text-sm font-black text-slate-800">{item.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.bloodGroup} Donor</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-slate-400 font-mono">#{item.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-700">{item.gender}</div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">{item.dob}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 opacity-40" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                        {item.guardianContact || item.fatherContact}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border" style={{ backgroundColor: `${COLORS.success}10`, color: COLORS.success, borderColor: `${COLORS.success}40` }}>Active</span>
                    </td>
                    <td className="px-6 py-4 text-right px-8">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit?.(item.id)}
                          className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 transition-all active:scale-90"
                          title="Edit Profile"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 transition-all active:scale-90"
                          title="Delete Record"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListView;
