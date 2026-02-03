
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
import { DonationCampaign, Donation } from '../types';

const DonationModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'accept' | 'records' | 'analytics'>('campaigns');
  
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>([
    { 
      id: 'C1', 
      title: 'Winter Clothes Drive 2025', 
      description: 'Collecting warm clothes for underprivileged children in rural sectors.', 
      type: 'Items', 
      targetItems: [{ type: 'Clothes', quantity: 500 }],
      currentItems: [{ type: 'Clothes', quantity: 342 }],
      currentAmount: 0,
      status: 'Active',
      startDate: '2025-01-01'
    },
    { 
      id: 'C2', 
      title: 'EduKit: Stationery Support', 
      description: 'Backpack and stationery sets for the upcoming academic session.', 
      type: 'Mixed', 
      targetAmount: 50000,
      currentAmount: 28500,
      targetItems: [{ type: 'Stationery Set', quantity: 200 }],
      currentItems: [{ type: 'Stationery Set', quantity: 156 }],
      status: 'Active',
      startDate: '2025-02-15'
    }
  ]);

  const [donations, setDonations] = useState<Donation[]>([
    { 
      id: 'D1', 
      campaignId: 'C1', 
      donorName: 'Amitabh Sharma', 
      donorAddress: 'C-42, Vasant Kunj, New Delhi',
      donorPhone: '9810234567',
      donorEmail: 'amit.sharma@gmail.com',
      purpose: 'Helping community',
      items: [{ type: 'Clothes', quantity: 15 }],
      date: '2025-02-10'
    }
  ]);

  const handleCreateCampaign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const type = formData.get('type') as 'Monetary' | 'Items' | 'Mixed';
    
    const newCampaign: DonationCampaign = {
      id: `C${campaigns.length + 1}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type,
      targetAmount: type !== 'Items' ? Number(formData.get('targetAmount')) : undefined,
      currentAmount: 0,
      targetItems: type !== 'Monetary' ? [{ type: formData.get('itemType') as string, quantity: Number(formData.get('targetQuantity')) }] : [],
      currentItems: type !== 'Monetary' ? [{ type: formData.get('itemType') as string, quantity: 0 }] : [],
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0]
    };

    setCampaigns([...campaigns, newCampaign]);
    e.currentTarget.reset();
  };

  const handleAcceptDonation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const campaignId = formData.get('campaignId') as string;
    const amount = formData.get('amount') ? Number(formData.get('amount')) : undefined;
    const itemQty = formData.get('itemQuantity') ? Number(formData.get('itemQuantity')) : undefined;
    
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    const newDonation: Donation = {
      id: `D${donations.length + 1}`,
      campaignId,
      donorName: formData.get('donorName') as string,
      donorAddress: formData.get('donorAddress') as string,
      donorPhone: formData.get('donorPhone') as string,
      donorEmail: formData.get('donorEmail') as string,
      purpose: formData.get('purpose') as string,
      amount,
      items: itemQty ? [{ type: campaign.targetItems?.[0]?.type || 'Item', quantity: itemQty }] : undefined,
      date: new Date().toISOString().split('T')[0]
    };

    setDonations([...donations, newDonation]);
    
    // Update campaign progress
    setCampaigns(campaigns.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          currentAmount: c.currentAmount + (amount || 0),
          currentItems: c.currentItems.map(it => ({
            ...it,
            quantity: it.quantity + (itemQty || 0)
          }))
        };
      }
      return c;
    }));

    e.currentTarget.reset();
    setActiveTab('records');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-500 underline-offset-8">Donation Central</h1>
          <p className="text-slate-500 font-medium">Empowering communities through institutional philanthropy.</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {[
            { id: 'campaigns', label: 'Drives & Campaigns' },
            { id: 'accept', label: 'Accept Donation' },
            { id: 'records', label: 'Donor History' },
            { id: 'analytics', label: 'Impact Analytics' }
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

      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleCreateCampaign}>
              <FormSection title="Drive Architect" description="Initiate a new donation campaign.">
                <div className="lg:col-span-3 space-y-4">
                  <Input label="Campaign Title" name="title" required placeholder="e.g. Stationery Drive" />
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Description & Goals</label>
                    <textarea name="description" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none text-sm h-24 resize-none" placeholder="Target audience, items needed..."></textarea>
                  </div>
                  <Select label="Type of Drive" name="type" required options={[{value:'Monetary', label:'Funds Only'}, {value:'Items', label:'Items Only'}, {value:'Mixed', label:'Funds & Items'}]} />
                  <div className="grid grid-cols-1 gap-4 pt-2 border-t border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Metrics</p>
                    <Input label="Target Funds (₹)" name="targetAmount" type="number" placeholder="Optional" />
                    <Input label="Item Category" name="itemType" placeholder="Clothes, Stationery, etc." />
                    <Input label="Target Quantity" name="targetQuantity" type="number" placeholder="0" />
                  </div>
                  <button type="submit" className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all" style={{ backgroundColor: COLORS.primary }}>
                    Launch Campaign
                  </button>
                </div>
              </FormSection>
            </form>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.map(c => {
                const progressMoney = c.targetAmount ? (c.currentAmount / c.targetAmount) * 100 : 0;
                const item = c.targetItems?.[0];
                const currentItem = c.currentItems?.[0];
                const progressItems = item?.quantity ? (currentItem?.quantity || 0) / item.quantity * 100 : 0;
                
                return (
                  <div key={c.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:border-indigo-300 transition-all flex flex-col group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                         {c.status}
                       </span>
                       <span className="text-[10px] font-black text-slate-300 uppercase">Started: {c.startDate}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-2 leading-none">{c.title}</h3>
                    <p className="text-xs font-medium text-slate-500 mb-8 line-clamp-2 leading-relaxed">{c.description}</p>
                    
                    <div className="space-y-6 mt-auto">
                      {c.type !== 'Items' && (
                        <div className="space-y-2">
                           <div className="flex justify-between items-end">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fund Progress</span>
                              <span className="text-xs font-black text-slate-800 italic">₹{c.currentAmount.toLocaleString('en-IN')} / ₹{c.targetAmount?.toLocaleString('en-IN')}</span>
                           </div>
                           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${Math.min(100, progressMoney)}%` }}></div>
                           </div>
                        </div>
                      )}
                      {c.type !== 'Monetary' && (
                        <div className="space-y-2">
                           <div className="flex justify-between items-end">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item?.type} Achieved</span>
                              <span className="text-xs font-black text-slate-800 italic">{currentItem?.quantity} / {item?.quantity} Units</span>
                           </div>
                           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${Math.min(100, progressItems)}%` }}></div>
                           </div>
                        </div>
                      )}
                    </div>
                    
                    {(progressMoney >= 100 || progressItems >= 100) && (
                      <div className="absolute top-0 right-0 p-4">
                         <div className="w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-lg animate-bounce">
                           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                         </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'accept' && (
        <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
           <div className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight mb-8 underline decoration-rose-200 underline-offset-8 decoration-8">Donation Intake Terminal</h3>
              
              <form onSubmit={handleAcceptDonation}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 space-y-6">
                     <Select label="Active Campaign" name="campaignId" required options={campaigns.map(c => ({value: c.id, label: c.title}))} />
                     <Input label="Donor Full Name" name="donorName" required placeholder="e.g. Ramesh Kumar" />
                     <Input label="Donor Phone" name="donorPhone" required placeholder="10 Digit Mobile" />
                     <Input label="Donor Email ID" name="donorEmail" type="email" required placeholder="email@example.com" />
                  </div>
                  
                  <div className="lg:col-span-2 space-y-6">
                     <Input label="Residential / Office Address" name="donorAddress" required placeholder="Complete physical address" />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Purpose of Donation" name="purpose" required placeholder="e.g. CSR Initiative, Personal" />
                        <div className="grid grid-cols-2 gap-4">
                           <Input label="Contribution (₹)" name="amount" type="number" placeholder="0.00" />
                           <Input label="Item Qty (Units)" name="itemQuantity" type="number" placeholder="0" />
                        </div>
                     </div>
                     <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Official Disclaimer</p>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed italic">By submitting this form, the donor agrees to institutional terms of usage for the contributed assets. All monetary donations are eligible for a system-generated acknowledgement receipt.</p>
                        <button type="submit" className="mt-8 w-full py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:brightness-110 active:scale-95 transition-all">
                          Finalize Contribution
                        </button>
                     </div>
                  </div>
                </div>
              </form>
           </div>
        </div>
      )}

      {activeTab === 'records' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
            <h3 className="text-xl font-black uppercase tracking-tight">Donor Ledger</h3>
            <span className="px-3 py-1 bg-white/10 text-white rounded-full text-[9px] font-black uppercase tracking-widest">{donations.length} Contributions Indexed</span>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase">Donor Profile</th>
                  <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase">Contact / Email</th>
                  <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase">Contribution</th>
                  <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase">Target Drive</th>
                  <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {donations.map(d => {
                  const campaign = campaigns.find(c => c.id === d.campaignId);
                  return (
                    <tr key={d.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-6 py-6">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">{d.donorName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{d.donorAddress}</p>
                      </td>
                      <td className="px-6 py-6 text-xs font-bold text-slate-600">
                         <div className="flex flex-col">
                            <span>{d.donorPhone}</span>
                            <span className="opacity-40">{d.donorEmail}</span>
                         </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                           {d.amount && <span className="text-xs font-black text-indigo-600 uppercase tracking-tight">₹{d.amount.toLocaleString('en-IN')}</span>}
                           {d.items && d.items.map((it, idx) => (
                             <span key={idx} className="text-[10px] font-black text-emerald-600 uppercase italic">{it.quantity} {it.type}</span>
                           ))}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-xs font-bold text-slate-800 uppercase truncate max-w-[150px]">{campaign?.title}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase italic leading-none mt-1">Ref: {d.id}</p>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <span className="text-[10px] font-black text-slate-400 uppercase">{d.date}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">124</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Active Philanthropists</p>
           </div>
           
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">₹4.2L</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Impact Funds Disbursed</p>
           </div>
           
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">850+</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Lives Directly Empowered</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default DonationModule;
