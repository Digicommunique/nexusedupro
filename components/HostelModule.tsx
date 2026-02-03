
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
import { Hostel, HostelRoom, HostelAllotment, HostelLeave, Student, Staff } from '../types';

interface HostelModuleProps {
  students: Student[];
  staff: Staff[];
}

const HostelModule: React.FC<HostelModuleProps> = ({ students, staff }) => {
  const [activeTab, setActiveTab] = useState<'infrastructure' | 'allotment' | 'leave' | 'finance'>('infrastructure');
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<Student | null>(null);
  
  // State for Hostel Data
  const [hostels, setHostels] = useState<Hostel[]>([
    { id: 'H1', name: 'Vivekananda Wing', type: 'Boys', capacity: 150, wardenId: 'T1' },
    { id: 'H2', name: 'Sarojini Enclave', type: 'Girls', capacity: 120, wardenId: 'T1' }
  ]);
  
  const [rooms, setRooms] = useState<HostelRoom[]>([
    { id: 'HR1', hostelId: 'H1', roomNo: '101', capacity: 3, occupied: 1, monthlyFee: 4500 },
    { id: 'HR2', hostelId: 'H2', roomNo: '201', capacity: 2, occupied: 0, monthlyFee: 5500 }
  ]);

  const [allotments, setAllotments] = useState<HostelAllotment[]>([
    { id: 'A1', studentId: 'S1', studentName: 'Aarav Sharma', hostelId: 'H1', roomId: 'HR1', allotmentDate: '2025-01-01', feeStatus: 'Paid' }
  ]);

  const [leaves, setLeaves] = useState<HostelLeave[]>([
    { id: 'L1', studentId: 'S1', departureDate: '2025-02-15', expectedReturn: '2025-02-20', reason: 'Family Function', status: 'Approved' }
  ]);

  // Logic to check if student is currently on leave
  const isStudentOnLeave = (studentId: string) => {
    return leaves.some(l => l.studentId === studentId && l.status === 'Approved');
  };

  const handleAddHostel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newHostel: Hostel = {
      id: `H${hostels.length + 1}`,
      name: formData.get('name') as string,
      type: formData.get('type') as any,
      capacity: Number(formData.get('capacity')),
      wardenId: formData.get('wardenId') as string
    };
    setHostels([...hostels, newHostel]);
    e.currentTarget.reset();
  };

  const handleAddRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRoom: HostelRoom = {
      id: `HR${rooms.length + 1}`,
      hostelId: formData.get('hostelId') as string,
      roomNo: formData.get('roomNo') as string,
      capacity: Number(formData.get('capacity')),
      occupied: 0,
      monthlyFee: Number(formData.get('fee'))
    };
    setRooms([...rooms, newRoom]);
    e.currentTarget.reset();
  };

  const handleAllotRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const studentId = formData.get('studentId') as string;
    const roomId = formData.get('roomId') as string;
    
    // Fetch actual student record
    const student = students.find(s => s.id === studentId);
    const room = rooms.find(r => r.id === roomId);

    if (student && room && room.occupied < room.capacity) {
      const newAllotment: HostelAllotment = {
        id: `A${allotments.length + 1}`,
        studentId,
        studentName: student.name,
        hostelId: room.hostelId,
        roomId,
        allotmentDate: new Date().toISOString().split('T')[0],
        feeStatus: 'Pending'
      };
      setAllotments([...allotments, newAllotment]);
      setRooms(rooms.map(r => r.id === roomId ? { ...r, occupied: r.occupied + 1 } : r));
      e.currentTarget.reset();
    }
  };

  const handleLogLeave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLeave: HostelLeave = {
      id: `L${leaves.length + 1}`,
      studentId: formData.get('studentId') as string,
      departureDate: formData.get('departureDate') as string,
      expectedReturn: formData.get('returnDate') as string,
      reason: formData.get('reason') as string,
      status: 'Approved'
    };
    setLeaves([...leaves, newLeave]);
    e.currentTarget.reset();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Detail Modal */}
      {selectedStudentProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 flex flex-col items-center text-center">
               <button onClick={() => setSelectedStudentProfile(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
               <img src={selectedStudentProfile.photo || `https://picsum.photos/seed/${selectedStudentProfile.id}/200`} className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-slate-50 shadow-xl mb-6" alt="" />
               <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">{selectedStudentProfile.name}</h2>
               <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-8">{selectedStudentProfile.grade} • Section {selectedStudentProfile.section}</p>
               
               <div className="grid grid-cols-2 gap-8 w-full text-left bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Father's Name</p>
                    <p className="text-sm font-bold text-slate-700">{selectedStudentProfile.fatherName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Primary Contact</p>
                    <p className="text-sm font-bold text-slate-700">{selectedStudentProfile.guardianContact}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Medical Notes</p>
                    <p className="text-sm font-bold text-rose-500">{selectedStudentProfile.allergy || 'None Reported'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Blood Group</p>
                    <p className="text-sm font-bold text-slate-700">{selectedStudentProfile.bloodGroup}</p>
                  </div>
               </div>
               <button onClick={() => setSelectedStudentProfile(null)} className="mt-8 px-12 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Close Resident Profile</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-500 underline-offset-8">Hostel Terminal</h1>
          <p className="text-slate-500 font-medium">Residential infrastructure, room allotment and student profile tracking.</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {[
            { id: 'infrastructure', label: 'Wards & Rooms' },
            { id: 'allotment', label: 'Resident Registry' },
            { id: 'leave', label: 'Leave & Attendance' },
            { id: 'finance', label: 'Accounts' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
              style={activeTab === tab.id ? { backgroundColor: COLORS.primary } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'infrastructure' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <form onSubmit={handleAddHostel}>
              <FormSection title="Hostel Ward Architect" description="Define institutional residential wings.">
                <Input label="Ward Name" name="name" required placeholder="e.g. Newton House" />
                <Select label="Gender Segment" name="type" required options={[{value:'Boys', label:'Boys Wing'}, {value:'Girls', label:'Girls Wing'}, {value:'Mixed', label:'Mixed'}]} />
                <Input label="Total Beds" name="capacity" type="number" required placeholder="100" />
                <Select label="Assign Warden" name="wardenId" required options={staff.map(s => ({value: s.id, label: `${s.name} (${s.role})`}))} />
                <button type="submit" className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all col-span-1 lg:col-span-3 mt-4" style={{ backgroundColor: COLORS.primary }}>
                  Add Residential Wing
                </button>
              </FormSection>
            </form>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
               <h3 className="text-xl font-black text-slate-900 uppercase italic mb-6">Active Wings</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {hostels.map(h => {
                    const warden = staff.find(s => s.id === h.wardenId);
                    return (
                      <div key={h.id} className="p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-indigo-300 transition-all shadow-sm group">
                         <div className="flex justify-between items-start mb-4">
                            <div className={`px-2 py-1 rounded text-[8px] font-black uppercase ${h.type === 'Boys' ? 'bg-blue-100 text-blue-700' : h.type === 'Girls' ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-700'}`}>
                              {h.type}
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-inner">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                         </div>
                         <h4 className="text-lg font-black text-slate-800 uppercase italic leading-none mb-1">{h.name}</h4>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cap: {h.capacity} Beds</p>
                         <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-3">
                            <img src={`https://picsum.photos/seed/${warden?.id}/30`} className="w-8 h-8 rounded-lg object-cover" alt="" />
                            <div className="overflow-hidden">
                               <p className="text-[10px] font-black text-slate-600 uppercase truncate leading-none mb-0.5">{warden?.name}</p>
                               <p className="text-[8px] font-bold text-slate-400 uppercase truncate">Head Warden</p>
                            </div>
                         </div>
                      </div>
                    );
                 })}
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <form onSubmit={handleAddRoom}>
              <FormSection title="Room Configuration" description="Manage specific unit inventory and pricing.">
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select label="Select Wing" name="hostelId" required options={hostels.map(h => ({value: h.id, label: h.name}))} />
                  <Input label="Room Identifer" name="roomNo" required placeholder="e.g. 101-A" />
                  <Input label="Bed Capacity" name="capacity" type="number" required placeholder="2" />
                  <Input label="Monthly Rate (INR)" name="fee" type="number" required placeholder="5000" />
                </div>
                <button type="submit" className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all col-span-1 lg:col-span-3 mt-6" style={{ backgroundColor: COLORS.secondary }}>
                  Index New Room
                </button>
              </FormSection>
            </form>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
               <div className="p-8 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase tracking-tight italic">Unit Repository</h3>
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{rooms.length} Units Ready</span>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50 border-b border-slate-100">
                     <tr>
                       <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase">Unit #</th>
                       <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase text-center">Occupancy</th>
                       <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase text-center">Charge</th>
                       <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase text-right">Wing</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {rooms.map(r => (
                       <tr key={r.id} className="hover:bg-indigo-50/20 transition-all">
                         <td className="px-6 py-4">
                           <p className="text-sm font-black text-slate-800 uppercase">Unit {r.roomNo}</p>
                         </td>
                         <td className="px-6 py-4">
                           <div className="flex flex-col items-center">
                              <span className="text-[10px] font-black text-slate-600">{r.occupied} / {r.capacity} Beds Filled</span>
                              <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${(r.occupied / r.capacity) * 100}%` }}></div>
                              </div>
                           </div>
                         </td>
                         <td className="px-6 py-4 text-center">
                           <span className="text-xs font-black text-emerald-600">₹{r.monthlyFee}</span>
                         </td>
                         <td className="px-6 py-4 text-right">
                           <span className="text-[10px] font-bold text-slate-400 uppercase">{hostels.find(h => h.id === r.hostelId)?.name}</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'allotment' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleAllotRoom}>
              <FormSection title="Room Dispatch" description="Assign students to available beds.">
                <div className="lg:col-span-3 space-y-4">
                  <Select label="Target Student" name="studentId" required options={students.map(s => ({value: s.id, label: `${s.name} (${s.studentId})`}))} />
                  <Select label="Vacant Room" name="roomId" required options={rooms.filter(r => r.occupied < r.capacity).map(r => ({value: r.id, label: `Unit ${r.roomNo} (${hostels.find(h => h.id === r.hostelId)?.name})`}))} />
                  <button type="submit" className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all" style={{ backgroundColor: COLORS.primary }}>
                    Process Allotment
                  </button>
                </div>
              </FormSection>
            </form>
          </div>

          <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-50/30">
              <h3 className="text-xl font-black text-slate-900 uppercase italic">Resident Directory</h3>
              <div className="flex gap-4">
                 <input type="text" placeholder="Search residents..." className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-64" />
              </div>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Resident Detail</th>
                    <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Location & Status</th>
                    <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Emergency Contact</th>
                    <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allotments.map(a => {
                    const studentRecord = students.find(s => s.id === a.studentId);
                    const room = rooms.find(r => r.id === a.roomId);
                    const hostel = hostels.find(h => h.id === a.hostelId);
                    const onLeave = isStudentOnLeave(a.studentId);

                    return (
                      <tr key={a.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-4">
                             <img src={studentRecord?.photo || `https://picsum.photos/seed/${a.studentId}/50`} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm" alt="" />
                             <div>
                               <p className="text-sm font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">{studentRecord?.name}</p>
                               <p className="text-[10px] font-bold text-slate-400">ID: {studentRecord?.studentId} • {studentRecord?.grade}</p>
                             </div>
                           </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                           <div className="flex flex-col items-center gap-1">
                              <p className="text-xs font-black text-indigo-600 uppercase">Unit {room?.roomNo} • {hostel?.name}</p>
                              {onLeave && (
                                <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[8px] font-black uppercase rounded animate-pulse">Out on Leave</span>
                              )}
                           </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                           <p className="text-[10px] font-black text-slate-500 uppercase">{studentRecord?.guardianContact}</p>
                           <p className="text-[9px] font-bold text-slate-300 uppercase italic">Contact: {studentRecord?.guardianRelationship}</p>
                        </td>
                        <td className="px-6 py-6 text-right">
                           <button 
                             onClick={() => setSelectedStudentProfile(studentRecord || null)}
                             className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                           >
                             View Profile
                           </button>
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

      {activeTab === 'leave' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleLogLeave}>
              <FormSection title="Leave Authorization" description="Track departures from premises.">
                <div className="lg:col-span-3 space-y-4">
                  <Select label="Resident Name" name="studentId" required options={allotments.map(a => ({value: a.studentId, label: a.studentName}))} />
                  <Input label="Departure Date" name="departureDate" type="date" required />
                  <Input label="Exp. Return Date" name="returnDate" type="date" required />
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Stated Reason</label>
                    <textarea name="reason" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none text-sm h-32 resize-none transition-all focus:bg-white" placeholder="Medical, Family visit, etc..."></textarea>
                  </div>
                  <button type="submit" className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all" style={{ backgroundColor: COLORS.warning }}>
                    Approve Outing
                  </button>
                </div>
              </FormSection>
            </form>
          </div>

          <div className="lg:col-span-3 space-y-8 flex flex-col h-full">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex-1">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-rose-50/30">
                  <h3 className="text-xl font-black text-rose-900 uppercase italic">Absence Management Console</h3>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                     <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">{leaves.length} Active Records</span>
                  </div>
               </div>
               <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {leaves.map(l => {
                      const s = students.find(student => student.id === l.studentId);
                      return (
                        <div key={l.id} className="p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-rose-300 hover:shadow-xl transition-all shadow-sm flex flex-col justify-between">
                           <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-4">
                                <img src={s?.photo || `https://picsum.photos/seed/${l.studentId}/40`} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                <div>
                                   <h4 className="text-lg font-black text-slate-800 uppercase italic tracking-tight leading-none mb-1">{s?.name}</h4>
                                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Wing: {allotments.find(a => a.studentId === l.studentId)?.studentName ? hostels.find(h => h.id === allotments.find(a => a.studentId === l.studentId)?.hostelId)?.name : 'N/A'}</p>
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${l.status === 'Approved' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{l.status}</span>
                           </div>
                           <div className="p-4 bg-slate-50 rounded-2xl mb-6">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authorization Details</p>
                              <p className="text-xs font-medium text-slate-600 leading-relaxed italic">"{l.reason}"</p>
                              <p className="text-[9px] font-black text-indigo-500 uppercase mt-2">Expected Back: {l.expectedReturn}</p>
                           </div>
                           <button className="w-full py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">Record Physical Return</button>
                        </div>
                      );
                    })}
                    {leaves.length === 0 && <p className="text-center py-20 text-slate-300 font-black uppercase tracking-widest col-span-2">No active outstation records</p>}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
           <div className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                 <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M11.5 6c-2.48 0-4.5 2.02-4.5 4.5S9.02 15 11.5 15s4.5-2.02 4.5-4.5S13.98 6 11.5 6zM20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H9v-2h6v2zm4-5H5V8h14v5z"/></svg>
              </div>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic mb-2 underline decoration-emerald-500 underline-offset-8">Residential Fee Engine</h3>
              <p className="text-slate-400 font-medium mb-12">Consolidated student billing fetched from master profiles.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <Select label="Select Resident" name="fee_studentId" options={allotments.map(a => ({value: a.studentId, label: a.studentName}))} />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Grace Period Days Overdue</label>
                      <input 
                        type="number" 
                        defaultValue={0}
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-2xl font-black text-slate-800 focus:ring-4 focus:ring-rose-100 outline-none transition-all focus:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Institutional Fine Rate (₹/Day)</label>
                      <input 
                        type="number" 
                        defaultValue={50}
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-2xl font-black text-rose-600 focus:ring-4 focus:ring-rose-100 outline-none transition-all focus:bg-white"
                      />
                    </div>
                 </div>

                 <div className="bg-slate-900 rounded-[2.5rem] p-12 flex flex-col justify-center items-center text-center shadow-2xl relative">
                    <div className="absolute top-4 left-4">
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Audit Validated</span>
                    </div>
                    <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Total Outstanding Payable</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-black text-white/50">₹</span>
                       <h2 className="text-7xl font-black text-white tracking-tighter">7,250</h2>
                    </div>
                    <div className="mt-10 pt-10 border-t border-white/10 w-full text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">
                       Includes Maintenance, Lodging & Late Fines
                    </div>
                    <button className="mt-8 px-8 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Clear & Transact Payment</button>
                 </div>
              </div>
              
              <div className="mt-12 flex items-start gap-4 p-8 bg-indigo-50 border border-indigo-100 rounded-[2.5rem]">
                 <svg className="w-8 h-8 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <div className="space-y-1">
                    <p className="text-xs font-black text-indigo-900 uppercase tracking-widest">Financial Policy Note</p>
                    <p className="text-xs font-bold text-indigo-700 leading-relaxed italic opacity-80">Payment cycle resets on the 1st of every calendar month. Late fines accrue daily after the 7th of each month unless a deferral is authorized by the Registrar. All transactions are recorded in the central ledger.</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default HostelModule;
