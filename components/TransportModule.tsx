
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
import { TransportVehicle, TransportPersonnel, TransportRoute, TransportAssignment, BloodGroup } from '../types';

const TransportModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fleet' | 'routes' | 'assignments' | 'calculator'>('fleet');
  
  const [vehicles, setVehicles] = useState<TransportVehicle[]>([
    { id: 'V1', busNumber: 'DL-1PB-4567', capacity: 40, status: 'Active' },
    { id: 'V2', busNumber: 'HR-26-CZ-1234', capacity: 32, status: 'Active' }
  ]);

  const [personnel, setPersonnel] = useState<TransportPersonnel[]>([
    { id: 'P1', name: 'Rajesh Yadav', phone: '9812345678', bloodGroup: 'O+', role: 'Driver', licenseNumber: 'DL-IN-2022-00987' },
    { id: 'P2', name: 'Suresh Raina', phone: '9712345670', bloodGroup: 'B+', role: 'Driver', licenseNumber: 'HR-IN-2021-00456' },
    { id: 'P3', name: 'Amitabh Sharma', phone: '9912345671', bloodGroup: 'A+', role: 'Conductor' },
    { id: 'P4', name: 'Deepak Mishra', phone: '9612345672', bloodGroup: 'AB+', role: 'Conductor' }
  ]);

  const [routes, setRoutes] = useState<TransportRoute[]>([
    { id: 'R1', name: 'Dwarka Sector 10 Loop', stops: ['Sector 10 Gate', 'Ramphal Chowk', 'Sector 6 Market'], distanceKm: 12, ratePerKm: 8 },
    { id: 'R2', name: 'Noida-Enclave Express', stops: ['Enclave Main', 'Botanical Garden', 'City Center'], distanceKm: 18, ratePerKm: 7 }
  ]);

  const [assignments, setAssignments] = useState<TransportAssignment[]>([
    { id: 'A1', vehicleId: 'V1', routeId: 'R1', driverId: 'P1', conductorId: 'P3', status: 'In Transit' }
  ]);

  // Calculator states
  const [calcDistance, setCalcDistance] = useState<number>(0);
  const [calcRate, setCalcRate] = useState<number>(0);

  const handleAddVehicle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newVehicle: TransportVehicle = {
      id: `V${vehicles.length + 1}`,
      busNumber: formData.get('busNumber') as string,
      capacity: Number(formData.get('capacity')),
      status: 'Active'
    };
    setVehicles([...vehicles, newVehicle]);
    e.currentTarget.reset();
  };

  const handleAddPersonnel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const role = formData.get('role') as 'Driver' | 'Conductor';
    const newPerson: TransportPersonnel = {
      id: `P${personnel.length + 1}`,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      bloodGroup: formData.get('bloodGroup') as BloodGroup,
      role,
      licenseNumber: role === 'Driver' ? formData.get('licenseNumber') as string : undefined
    };
    setPersonnel([...personnel, newPerson]);
    e.currentTarget.reset();
  };

  const handleAddRoute = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRoute: TransportRoute = {
      id: `R${routes.length + 1}`,
      name: formData.get('name') as string,
      stops: (formData.get('stops') as string).split(',').map(s => s.trim()),
      distanceKm: Number(formData.get('distanceKm')),
      ratePerKm: Number(formData.get('ratePerKm'))
    };
    setRoutes([...routes, newRoute]);
    e.currentTarget.reset();
  };

  const handleAddAssignment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAssignment: TransportAssignment = {
      id: `A${assignments.length + 1}`,
      vehicleId: formData.get('vehicleId') as string,
      routeId: formData.get('routeId') as string,
      driverId: formData.get('driverId') as string,
      conductorId: formData.get('conductorId') as string,
      status: 'Parked'
    };
    setAssignments([...assignments, newAssignment]);
    e.currentTarget.reset();
  };

  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => ({ value: bg, label: bg }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-500 underline-offset-8">Transportation Hub</h1>
          <p className="text-slate-500 font-medium">Fleet control, route design and Indian transport logistics.</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {[
            { id: 'fleet', label: 'Fleet & Staff' },
            { id: 'routes', label: 'Route Map' },
            { id: 'assignments', label: 'Dispatch' },
            { id: 'calculator', label: 'Fee Engine' }
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

      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <form onSubmit={handleAddVehicle}>
              <FormSection title="Vehicle Entry" description="Register institutional transport buses.">
                <Input label="Bus Number" name="busNumber" required placeholder="e.g. DL-01-AB-1234" />
                <Input label="Capacity (Seats)" name="capacity" type="number" required placeholder="40" />
                <button type="submit" className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all col-span-1 lg:col-span-3 mt-4" style={{ backgroundColor: COLORS.primary }}>
                  Add Bus
                </button>
              </FormSection>
            </form>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Active Fleet</h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{vehicles.length} Units</span>
               </div>
               <div className="p-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {vehicles.map(v => (
                     <div key={v.id} className="p-4 rounded-2xl border border-slate-100 bg-white flex items-center justify-between hover:border-indigo-200 transition-all shadow-sm group">
                        <div>
                          <p className="text-sm font-black text-slate-800 uppercase group-hover:text-indigo-600 transition-colors">{v.busNumber}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Cap: {v.capacity} Seats</p>
                        </div>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[9px] font-black uppercase">{v.status}</span>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <form onSubmit={handleAddPersonnel}>
              <FormSection title="Transport Crew Enrollment" description="Enroll drivers and conductors into system.">
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" name="name" required placeholder="e.g. Rajesh Kumar" />
                  <Input label="Phone Number" name="phone" required placeholder="10 Digit Mobile" />
                  <Select label="Blood Group" name="bloodGroup" required options={BLOOD_GROUPS} />
                  <Select label="System Role" name="role" required options={[{value:'Driver', label:'Driver'}, {value:'Conductor', label:'Conductor'}]} />
                </div>
                <div className="lg:col-span-3 mt-4">
                  <Input label="Driving License (Drivers Only)" name="licenseNumber" placeholder="DL-XX-XXXX-XXXX" />
                </div>
                <button type="submit" className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all col-span-1 lg:col-span-3 mt-6" style={{ backgroundColor: COLORS.secondary }}>
                  Enroll Crew Member
                </button>
              </FormSection>
            </form>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-100 bg-indigo-50/50">
                  <h3 className="text-lg font-black text-indigo-900 uppercase tracking-tight">Crew Directory</h3>
               </div>
               <div className="p-6">
                 <div className="space-y-3">
                   {personnel.map(p => (
                     <div key={p.id} className="p-4 rounded-2xl border border-slate-100 bg-white flex items-center justify-between hover:bg-slate-50 transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             {p.role[0]}
                           </div>
                           <div>
                             <p className="text-sm font-black text-slate-800 uppercase">{p.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">{p.role} • {p.bloodGroup} • {p.phone}</p>
                           </div>
                        </div>
                        {p.licenseNumber && (
                          <div className="text-right">
                             <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest block">Valid License</span>
                             <p className="text-[9px] font-mono font-bold text-slate-300">{p.licenseNumber}</p>
                          </div>
                        )}
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'routes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleAddRoute}>
              <FormSection title="Route Blueprint" description="Design transit geography & billing rates.">
                <div className="lg:col-span-3 space-y-4">
                  <Input label="Route Name" name="name" required placeholder="e.g. Noida-Sec-62 Loop" />
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Transit Stops (Comma separated)</label>
                    <textarea name="stops" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none text-sm h-28 resize-none transition-all focus:bg-white" placeholder="Market, Metro Station, Mall..."></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="One-way Dist. (KM)" name="distanceKm" type="number" required />
                    <Input label="Rate / KM (INR)" name="ratePerKm" type="number" required />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all" style={{ backgroundColor: COLORS.primary }}>
                    Commit Route
                  </button>
                </div>
              </FormSection>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Official Route Network</h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase">{routes.length} Active Tracks</span>
            </div>
            <div className="overflow-x-auto p-8 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {routes.map(r => (
                  <div key={r.id} className="p-8 rounded-[2.5rem] border border-slate-100 bg-white hover:border-indigo-300 hover:shadow-xl transition-all shadow-sm group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform">
                       <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    </div>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-xl font-black text-slate-800 uppercase italic tracking-tight leading-none mb-1">{r.name}</h4>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{r.distanceKm} KM • ₹{r.ratePerKm}/KM</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Route Pipeline</p>
                      <div className="flex flex-wrap gap-2">
                        {r.stops.map((stop, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-600 rounded-xl border border-slate-100">
                             <div className="w-1.5 h-1.5 rounded-full bg-indigo-300"></div>
                             {stop}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 uppercase italic mb-8 underline decoration-indigo-200 underline-offset-8">Fleet Dispatch Console</h3>
            <form onSubmit={handleAddAssignment} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 items-end">
              <Select label="Choose Bus" name="vehicleId" required options={vehicles.map(v => ({value: v.id, label: v.busNumber}))} />
              <Select label="Assign Route" name="routeId" required options={routes.map(r => ({value: r.id, label: r.name}))} />
              <Select label="Select Driver" name="driverId" required options={personnel.filter(p => p.role === 'Driver').map(p => ({value: p.id, label: p.name}))} />
              <Select label="Select Conductor" name="conductorId" required options={personnel.filter(p => p.role === 'Conductor').map(p => ({value: p.id, label: p.name}))} />
              <button type="submit" className="py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all">
                Dispatch Fleet
              </button>
            </form>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" /></svg>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Active Transit Registry</h3>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Fleet Tracking (Live)</span>
                </div>
             </div>
             <div className="overflow-x-auto p-4">
                <table className="w-full text-left">
                   <thead>
                      <tr className="border-b border-slate-100">
                         <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase">Fleet Asset</th>
                         <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase">Assigned Route</th>
                         <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase">Institutional Team</th>
                         <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase text-right">Operational Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {assignments.map(a => {
                        const bus = vehicles.find(v => v.id === a.vehicleId);
                        const route = routes.find(r => r.id === a.routeId);
                        const driver = personnel.find(p => p.id === a.driverId);
                        const conductor = personnel.find(p => p.id === a.conductorId);
                        return (
                          <tr key={a.id} className="group hover:bg-slate-50/50 transition-all">
                             <td className="px-6 py-6">
                                <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{bus?.busNumber}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Tracking ID: {a.id}</p>
                             </td>
                             <td className="px-6 py-6">
                                <p className="text-xs font-black text-indigo-600 uppercase tracking-tight">{route?.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">{route?.stops.length} Authorized Stops</p>
                             </td>
                             <td className="px-6 py-6">
                                <p className="text-xs font-bold text-slate-800 uppercase">{driver?.name} (D)</p>
                                <p className="text-xs font-bold text-slate-400 uppercase">{conductor?.name} (C)</p>
                             </td>
                             <td className="px-6 py-6 text-right">
                                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                                  a.status === 'In Transit' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {a.status}
                                </span>
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

      {activeTab === 'calculator' && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
           <div className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM11.25 10.5h1.5v-1.5h-1.5v1.5zm0 3h1.5v-1.5h-1.5v1.5zm-3-3h1.5v-1.5h-1.5v1.5zm0 3h1.5v-1.5h-1.5v1.5zm6-3h1.5v-1.5h-1.5v1.5zm0 3h1.5v-1.5h-1.5v1.5zm-6 3h1.5v-1.5h-1.5v1.5zm3 0h1.5v-1.5h-1.5v1.5zm3 0h1.5v-1.5h-1.5v1.5z"/></svg>
              </div>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic mb-2 underline decoration-indigo-500 underline-offset-8">Fare Calculation Engine</h3>
              <p className="text-slate-400 font-medium mb-12">Institutional billing tool for student transportation charges.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Est. Distance (KM)</label>
                      <input 
                        type="number" 
                        value={calcDistance || ''}
                        onChange={(e) => setCalcDistance(Number(e.target.value))}
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-2xl font-black text-slate-800 focus:ring-4 focus:ring-indigo-100 outline-none transition-all focus:bg-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Billing Rate (₹/KM)</label>
                      <input 
                        type="number" 
                        value={calcRate || ''}
                        onChange={(e) => setCalcRate(Number(e.target.value))}
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-2xl font-black text-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all focus:bg-white"
                        placeholder="0.00"
                      />
                    </div>
                 </div>

                 <div className="bg-slate-900 rounded-[2.5rem] p-12 flex flex-col justify-center items-center text-center shadow-2xl relative">
                    <div className="absolute top-4 left-4">
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Proprietary Billing</span>
                    </div>
                    <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Projected Monthly Charge</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-black text-white/50">₹</span>
                       <h2 className="text-7xl font-black text-white tracking-tighter">
                         {(calcDistance * calcRate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                       </h2>
                    </div>
                    <div className="mt-10 pt-10 border-t border-white/10 w-full text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">
                       Auto-Sync with Student Portal
                    </div>
                 </div>
              </div>
              
              <div className="mt-12 flex items-start gap-4 p-6 bg-amber-50 border border-amber-100 rounded-3xl">
                 <svg className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <div className="space-y-1">
                    <p className="text-xs font-black text-amber-900 uppercase tracking-widest">Billing Policy</p>
                    <p className="text-xs font-bold text-amber-700 leading-relaxed">Charges are calculated based on the shortest driving distance from the institutional gate to the verified residential address in our repository.</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TransportModule;
