
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
import { ActivityRoomType, ActivityAsset, DamageReport, ProcurementOrder } from '../types';

const ACTIVITY_ROOMS: ActivityRoomType[] = ['Dance', 'Music', 'Sports', 'Theatre', 'Equipment Room', 'Swimming Pool', 'Gym'];

const ActivityModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'inventory' | 'maintenance' | 'procurement'>('rooms');
  const [selectedRoom, setSelectedRoom] = useState<ActivityRoomType>('Sports');

  const [assets, setAssets] = useState<ActivityAsset[]>([
    { id: 'AA1', roomType: 'Music', name: 'Grand Piano', vendor: 'Yamaha Music', quantity: 1, unit: 'Units', condition: 'Excellent', lastMaintenanceDate: '2025-01-15' },
    { id: 'AA2', roomType: 'Gym', name: 'Treadmill X-500', vendor: 'Fitness Pro', quantity: 4, unit: 'Units', condition: 'Good', lastMaintenanceDate: '2025-02-01' },
    { id: 'AA3', roomType: 'Sports', name: 'Basketballs (Spalding)', vendor: 'Sports Hub', quantity: 20, unit: 'Units', condition: 'Good', lastMaintenanceDate: '2025-02-10' },
  ]);

  const [damageReports, setDamageReports] = useState<DamageReport[]>([]);
  const [procurementOrders, setProcurementOrders] = useState<ProcurementOrder[]>([]);

  const filteredAssets = useMemo(() => assets.filter(a => a.roomType === selectedRoom), [assets, selectedRoom]);

  const handleAddAsset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAsset: ActivityAsset = {
      id: `AA${assets.length + 1}`,
      roomType: formData.get('roomType') as ActivityRoomType,
      name: formData.get('name') as string,
      vendor: formData.get('vendor') as string,
      quantity: Number(formData.get('quantity')),
      unit: formData.get('unit') as string,
      condition: 'Excellent',
      lastMaintenanceDate: new Date().toISOString().split('T')[0]
    };
    setAssets([...assets, newAsset]);
    e.currentTarget.reset();
  };

  const handleReportDamage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const assetId = formData.get('assetId') as string;
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    const newReport: DamageReport = {
      id: `ADR${damageReports.length + 1}`,
      itemId: assetId,
      itemName: asset.name,
      labType: asset.roomType,
      reason: formData.get('reason') as string,
      reportedBy: 'Facility Manager',
      reportedDate: new Date().toISOString().split('T')[0]
    };
    setDamageReports([...damageReports, newReport]);
    setAssets(assets.map(a => a.id === assetId ? { ...a, condition: 'Damaged' } : a));
    e.currentTarget.reset();
  };

  const handleCreateOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOrder: ProcurementOrder = {
      id: `APO${procurementOrders.length + 1}`,
      itemName: formData.get('itemName') as string,
      labType: formData.get('roomType') as ActivityRoomType,
      quantity: Number(formData.get('quantity')),
      unit: formData.get('unit') as string,
      vendorName: formData.get('vendorName') as string,
      estimatedCost: Number(formData.get('cost')),
      status: 'Pending',
      orderDate: new Date().toISOString().split('T')[0]
    };
    setProcurementOrders([...procurementOrders, newOrder]);
    e.currentTarget.reset();
  };

  const getRoomColor = (type: ActivityRoomType) => {
    switch (type) {
      case 'Dance': return '#ec4899';
      case 'Music': return '#8b5cf6';
      case 'Sports': return '#f59e0b';
      case 'Theatre': return '#ef4444';
      case 'Equipment Room': return '#64748b';
      case 'Swimming Pool': return '#0ea5e9';
      case 'Gym': return '#10b981';
      default: return COLORS.primary;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-500 underline-offset-8">Activity Hub</h1>
          <p className="text-slate-500 font-medium">Fine Arts, Sports & Wellness Facility Management.</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {[
            { id: 'rooms', label: 'Facilities' },
            { id: 'inventory', label: 'Equipment' },
            { id: 'maintenance', label: 'Maintenance' },
            { id: 'procurement', label: 'Requisitions' }
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

      {activeTab === 'rooms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ACTIVITY_ROOMS.map(room => {
            const roomAssets = assets.filter(a => a.roomType === room);
            const color = getRoomColor(room);
            return (
              <div 
                key={room}
                onClick={() => {setSelectedRoom(room); setActiveTab('inventory');}}
                className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: color }}>
                   {room === 'Dance' && <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                   {room === 'Music' && <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>}
                   {room === 'Sports' && <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                   {(room === 'Theatre' || room === 'Equipment Room' || room === 'Swimming Pool' || room === 'Gym') && <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{room} Room</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Facility</p>
                <div className="mt-8 flex items-center justify-between">
                   <span className="text-sm font-black text-slate-900">{roomAssets.length} Assets</span>
                   <button className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">Manage Hub →</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleAddAsset}>
              <FormSection title="Asset Entry" description="Register equipment, instruments, or kits.">
                <div className="lg:col-span-3 space-y-4">
                  <Select label="Assign to Facility" name="roomType" required options={ACTIVITY_ROOMS.map(r => ({value: r, label: r}))} />
                  <Input label="Asset Name" name="name" required placeholder="e.g. Electric Guitar" />
                  <Input label="Vendor / Brand" name="vendor" required placeholder="Manufacturer" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Quantity" name="quantity" type="number" required />
                    <Input label="Unit" name="unit" required placeholder="Units" />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all" style={{ backgroundColor: COLORS.primary }}>
                    Index Asset
                  </button>
                </div>
              </FormSection>
            </form>
          </div>
          
          <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Active Inventory</h3>
                <select 
                  value={selectedRoom} 
                  onChange={(e) => setSelectedRoom(e.target.value as ActivityRoomType)}
                  className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {ACTIVITY_ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase">{filteredAssets.length} Registered</span>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Asset Name</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Vendor</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Stock</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Condition</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase text-right">Maintenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredAssets.map(asset => (
                    <tr key={asset.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-4 py-4">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{asset.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">UID: {asset.id}</p>
                      </td>
                      <td className="px-4 py-4 text-xs font-bold text-slate-600">{asset.vendor}</td>
                      <td className="px-4 py-4">
                        <p className="text-xs font-black text-indigo-600">{asset.quantity} {asset.unit}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${
                          asset.condition === 'Excellent' ? 'bg-emerald-100 text-emerald-700' : 
                          asset.condition === 'Damaged' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {asset.condition}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase">Last: {asset.lastMaintenanceDate}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleReportDamage}>
              <FormSection title="Facility Support" description="Log equipment damage or room maintenance.">
                <div className="lg:col-span-3 space-y-4">
                  <Select label="Select Target Asset" name="assetId" required options={assets.map(a => ({value: a.id, label: `${a.name} (${a.roomType})`}))} />
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Detailed Issue</label>
                    <textarea 
                      name="reason" 
                      required 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none transition-all text-sm h-32 resize-none"
                      placeholder="e.g. Broken strings on tennis rackets..."
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all" style={{ backgroundColor: COLORS.danger }}>
                    Dispatch Service Request
                  </button>
                </div>
              </FormSection>
            </form>
          </div>

          <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-8 border-b border-slate-100 bg-rose-50/30">
              <h3 className="text-xl font-black text-rose-900 uppercase">Service Logs</h3>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Asset / Facility</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Reported Issue</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Reported By</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {damageReports.map(report => (
                    <tr key={report.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-4 py-4">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{report.itemName}</p>
                        <p className="text-[10px] font-bold text-slate-400">{report.labType} Hub</p>
                      </td>
                      <td className="px-4 py-4 text-xs font-medium text-slate-500 italic leading-relaxed">"{report.reason}"</td>
                      <td className="px-4 py-4 text-xs font-bold text-slate-700">{report.reportedBy}</td>
                      <td className="px-4 py-4 text-right text-[10px] font-black text-slate-400">{report.reportedDate}</td>
                    </tr>
                  ))}
                  {damageReports.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-32 text-center text-slate-200 font-black uppercase tracking-[0.2em] text-sm">No Active Maintenance Tickets</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'procurement' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleCreateOrder}>
              <FormSection title="New Requisition" description="Procure new activity materials.">
                <div className="lg:col-span-3 space-y-4">
                  <Input label="Item Required" name="itemName" required placeholder="e.g. Dance Costumes Set" />
                  <Select label="Target Facility" name="roomType" required options={ACTIVITY_ROOMS.map(r => ({value: r, label: r}))} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Quantity" name="quantity" type="number" required />
                    <Input label="Unit" name="unit" required placeholder="Sets" />
                  </div>
                  <Input label="Vendor Preferred" name="vendorName" required placeholder="Supplier Name" />
                  <Input label="Projected Budget" name="cost" type="number" required placeholder="0.00" />
                  <button type="submit" className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all" style={{ backgroundColor: COLORS.success }}>
                    Request Procurement
                  </button>
                </div>
              </FormSection>
            </form>
          </div>

          <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-8 border-b border-slate-100 bg-emerald-50/30">
              <h3 className="text-xl font-black text-emerald-900 uppercase">Acquisition Pipeline</h3>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Item Details</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Vendor</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Budget</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase text-center">Date</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {procurementOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-4">
                        <p className="text-sm font-black text-slate-800 uppercase">{order.itemName}</p>
                        <p className="text-[10px] font-bold text-slate-400">{order.quantity} {order.unit} • {order.labType}</p>
                      </td>
                      <td className="px-4 py-4 text-xs font-bold text-slate-600">{order.vendorName}</td>
                      <td className="px-4 py-4 text-xs font-black text-emerald-600">${order.estimatedCost}</td>
                      <td className="px-4 py-4 text-center text-[10px] font-black text-slate-400">{order.orderDate}</td>
                      <td className="px-4 py-4 text-right">
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[9px] font-black uppercase tracking-widest">{order.status}</span>
                      </td>
                    </tr>
                  ))}
                  {procurementOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-24 text-center text-slate-200 font-black uppercase tracking-widest text-sm">No Pending Acquisition Requests</td>
                    </tr>
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

export default ActivityModule;
