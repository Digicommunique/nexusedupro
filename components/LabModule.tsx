
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
import { LabItem, LabType, LabItemCategory, DamageReport, ProcurementOrder } from '../types';

const LAB_TYPES: LabType[] = ['Computer', 'Physics', 'Chemistry', 'Biology', 'General Science'];
const CATEGORIES: LabItemCategory[] = ['Equipment', 'Chemical', 'Computer System', 'Consumable'];

const LabModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'maintenance' | 'procurement'>('inventory');
  const [selectedLab, setSelectedLab] = useState<LabType>('Chemistry');
  
  const [items, setItems] = useState<LabItem[]>([
    { id: 'L1', labType: 'Chemistry', category: 'Chemical', name: 'Hydrochloric Acid (1M)', vendor: 'Sigma-Aldrich', quantity: 5, unit: 'Liters', expiryDate: '2026-05-20', status: 'Functional' },
    { id: 'L2', labType: 'Computer', category: 'Computer System', name: 'Nexus Desktop i7', vendor: 'Dell Enterprise', quantity: 30, unit: 'Units', status: 'Functional', serialNumber: 'DX-12345' },
    { id: 'L3', labType: 'Physics', category: 'Equipment', name: 'Concave Mirror', vendor: 'Optics Lab Co', quantity: 15, unit: 'Units', status: 'Maintenance' },
  ]);

  const [damageReports, setDamageReports] = useState<DamageReport[]>([]);
  const [procurementOrders, setProcurementOrders] = useState<ProcurementOrder[]>([]);

  const filteredItems = useMemo(() => items.filter(i => i.labType === selectedLab), [items, selectedLab]);

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: LabItem = {
      id: `L${items.length + 1}`,
      labType: formData.get('labType') as LabType,
      category: formData.get('category') as LabItemCategory,
      name: formData.get('name') as string,
      vendor: formData.get('vendor') as string,
      quantity: Number(formData.get('quantity')),
      unit: formData.get('unit') as string,
      expiryDate: formData.get('expiryDate') as string || undefined,
      serialNumber: formData.get('serialNumber') as string || undefined,
      status: 'Functional'
    };
    setItems([...items, newItem]);
    e.currentTarget.reset();
  };

  const handleReportDamage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const itemId = formData.get('itemId') as string;
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const newReport: DamageReport = {
      id: `DR${damageReports.length + 1}`,
      itemId,
      itemName: item.name,
      labType: item.labType,
      reason: formData.get('reason') as string,
      reportedBy: 'System Admin',
      reportedDate: new Date().toISOString().split('T')[0]
    };
    setDamageReports([...damageReports, newReport]);
    setItems(items.map(i => i.id === itemId ? { ...i, status: 'Damaged' } : i));
    e.currentTarget.reset();
  };

  const handleCreateOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOrder: ProcurementOrder = {
      id: `PO${procurementOrders.length + 1}`,
      itemName: formData.get('itemName') as string,
      labType: formData.get('labType') as LabType,
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-500 underline-offset-8">Laboratory Hub</h1>
          <p className="text-slate-500 font-medium">Science, Computer & Medical lab resource management.</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {[
            { id: 'inventory', label: 'Inventory' },
            { id: 'maintenance', label: 'Damage/Maintenance' },
            { id: 'procurement', label: 'Procurement' }
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

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleAddItem}>
              <FormSection title="Resource Registration" description="Add new equipment or chemicals.">
                <div className="lg:col-span-3 space-y-4">
                  <Select label="Laboratory" name="labType" required options={LAB_TYPES.map(l => ({value: l, label: l + ' Lab'}))} />
                  <Select label="Category" name="category" required options={CATEGORIES.map(c => ({value: c, label: c}))} />
                  <Input label="Item Name" name="name" required placeholder="e.g. Microscope X-1" />
                  <Input label="Vendor Name" name="vendor" required placeholder="Supplier Details" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Quantity" name="quantity" type="number" required placeholder="0" />
                    <Input label="Unit" name="unit" required placeholder="Pcs, Ltr..." />
                  </div>
                  <Input label="Expiry (if chemical)" name="expiryDate" type="date" />
                  <Input label="Serial #" name="serialNumber" placeholder="For electronics" />
                  <button type="submit" className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all" style={{ backgroundColor: COLORS.primary }}>
                    Index Resource
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
                  value={selectedLab} 
                  onChange={(e) => setSelectedLab(e.target.value as LabType)}
                  className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {LAB_TYPES.map(l => <option key={l} value={l}>{l} Lab</option>)}
                </select>
              </div>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase">{filteredItems.length} Registered</span>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Category</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Item Name</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Vendor</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Stock</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Details</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-[8px] font-black text-slate-500 rounded uppercase">{item.category}</span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{item.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">ID: {item.id}</p>
                      </td>
                      <td className="px-4 py-4 text-xs font-bold text-slate-600">{item.vendor}</td>
                      <td className="px-4 py-4">
                        <p className="text-xs font-black text-indigo-600">{item.quantity} {item.unit}</p>
                      </td>
                      <td className="px-4 py-4">
                        {item.expiryDate && (
                          <p className="text-[9px] font-black text-rose-400 uppercase">EXP: {item.expiryDate}</p>
                        )}
                        {item.serialNumber && (
                          <p className="text-[9px] font-black text-slate-400 uppercase">S/N: {item.serialNumber}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                          item.status === 'Functional' ? 'bg-emerald-100 text-emerald-700' : 
                          item.status === 'Damaged' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
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

      {activeTab === 'maintenance' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleReportDamage}>
              <FormSection title="Damage Reporting" description="Log equipment issues for repair.">
                <div className="lg:col-span-3 space-y-4">
                  <Select label="Select Item" name="itemId" required options={items.map(i => ({value: i.id, label: `${i.name} (${i.labType})`}))} />
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Reason for Damage</label>
                    <textarea 
                      name="reason" 
                      required 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none transition-all text-sm h-32 resize-none"
                      placeholder="Describe how the damage occurred..."
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all" style={{ backgroundColor: COLORS.danger }}>
                    Log Damage Report
                  </button>
                </div>
              </FormSection>
            </form>
          </div>

          <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-8 border-b border-slate-100 bg-rose-50/30">
              <h3 className="text-xl font-black text-rose-900 uppercase">Maintenance Logs</h3>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">ID / Item</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Lab</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Damage Reason</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Reported By</th>
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {damageReports.map(report => (
                    <tr key={report.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-4">
                        <p className="text-sm font-black text-slate-800 uppercase">{report.itemName}</p>
                        <p className="text-[10px] font-bold text-slate-400">Log: {report.id}</p>
                      </td>
                      <td className="px-4 py-4 text-xs font-bold text-slate-600">{report.labType}</td>
                      <td className="px-4 py-4 text-xs font-medium text-slate-500 italic">"{report.reason}"</td>
                      <td className="px-4 py-4 text-xs font-bold text-slate-700">{report.reportedBy}</td>
                      <td className="px-4 py-4 text-right text-[10px] font-black text-slate-400">{report.reportedDate}</td>
                    </tr>
                  ))}
                  {damageReports.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">No Active Maintenance Logs</td>
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
              <FormSection title="Requisition Terminal" description="Order new materials & equipments.">
                <div className="lg:col-span-3 space-y-4">
                  <Input label="Item Name" name="itemName" required placeholder="e.g. Bunsen Burners" />
                  <Select label="Laboratory" name="labType" required options={LAB_TYPES.map(l => ({value: l, label: l}))} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Quantity" name="quantity" type="number" required />
                    <Input label="Unit" name="unit" required placeholder="Pcs" />
                  </div>
                  <Input label="Preferred Vendor" name="vendorName" required placeholder="Supplier Name" />
                  <Input label="Estimated Budget" name="cost" type="number" required placeholder="0.00" />
                  <button type="submit" className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all" style={{ backgroundColor: COLORS.success }}>
                    Submit Requisition
                  </button>
                </div>
              </FormSection>
            </form>
          </div>

          <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-8 border-b border-slate-100 bg-emerald-50/30">
              <h3 className="text-xl font-black text-emerald-900 uppercase tracking-tight">Supply Procurement Pipeline</h3>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase">Order Details</th>
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
                      <td colSpan={5} className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">No Pending Procurement Requests</td>
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

export default LabModule;
