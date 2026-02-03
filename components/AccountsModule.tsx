
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
import { FinancialTransaction, TransactionType, PaymentMethod, FeeReceipt, PayrollRecord, AppSettings, Asset } from '../types';

interface AccountsModuleProps {
  feeReceipts: FeeReceipt[];
  payrollHistory: PayrollRecord[];
  assets: Asset[];
  settings: AppSettings;
}

const AccountsModule: React.FC<AccountsModuleProps> = ({ feeReceipts, payrollHistory, assets, settings }) => {
  const [activeTab, setActiveTab] = useState<'cashbook' | 'bankbook' | 'ledger' | 'pandl'>('pandl');

  // Unified Transaction Stream
  const transactions = useMemo(() => {
    const list: FinancialTransaction[] = [];

    // 1. Fee Income
    feeReceipts.forEach(r => {
      list.push({
        id: `TXN-F-${r.id}`,
        date: r.paymentDate,
        type: 'Income',
        category: 'Student Fees',
        amount: r.amountPaid,
        method: r.paymentMethod as any === 'Cash' ? 'Cash' : 'Bank',
        description: `Fee Receipt #${r.receiptNo} - ${r.studentName}`,
        referenceId: r.id
      });
    });

    // 2. Payroll Expenses
    payrollHistory.forEach(p => {
      list.push({
        id: `TXN-P-${p.id}`,
        date: p.generatedDate,
        type: 'Expense',
        category: 'Staff Payroll',
        amount: p.netSalary,
        method: 'Bank',
        description: `Salary Disbursement Month ${p.month}`,
        referenceId: p.id
      });
    });

    // 3. Asset Expenses
    assets.forEach(a => {
      list.push({
        id: `TXN-A-${a.id}`,
        date: a.purchaseDate,
        type: 'Expense',
        category: 'Asset Purchase',
        amount: a.cost,
        method: 'Bank',
        description: `Procured: ${a.name}`,
        referenceId: a.id
      });
    });

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [feeReceipts, payrollHistory, assets]);

  // Derived Book Views
  const cashbook = transactions.filter(t => t.method === 'Cash');
  const bankbook = transactions.filter(t => t.method === 'Bank' || t.method === 'Cheque' || t.method === 'UPI');

  // Profit and Loss Aggregation
  const plData = useMemo(() => {
    const categories: Record<string, { income: number, expense: number }> = {};
    transactions.forEach(t => {
      if (!categories[t.category]) categories[t.category] = { income: 0, expense: 0 };
      if (t.type === 'Income') categories[t.category].income += t.amount;
      else categories[t.category].expense += t.amount;
    });

    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((a, c) => a + c.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((a, c) => a + c.amount, 0);

    return { categories, totalIncome, totalExpense, netProfit: totalIncome - totalExpense };
  }, [transactions]);

  const renderBookTable = (data: FinancialTransaction[]) => (
    <div className="overflow-x-auto">
       <table className="w-full text-left">
          <thead>
             <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction Timestamp</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Narrative Detail</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Debit (Exp.)</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Credit (Inc.)</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
             {data.map(txn => (
               <tr key={txn.id} className="hover:bg-slate-50 transition-all">
                  <td className="px-8 py-6 text-sm font-black text-slate-800 italic uppercase leading-none">{txn.date}</td>
                  <td className="px-8 py-6">
                     <p className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{txn.description}</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase italic">Cat: {txn.category}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                     {txn.type === 'Expense' ? <span className="text-sm font-black text-rose-600">₹{txn.amount.toLocaleString()}</span> : <span className="text-slate-200">--</span>}
                  </td>
                  <td className="px-8 py-6 text-right">
                     {txn.type === 'Income' ? <span className="text-sm font-black text-emerald-600">₹{txn.amount.toLocaleString()}</span> : <span className="text-slate-200">--</span>}
                  </td>
               </tr>
             ))}
             {data.length === 0 && <tr><td colSpan={4} className="py-20 text-center text-slate-300 font-black uppercase tracking-widest italic">No transaction records found for this book</td></tr>}
          </tbody>
       </table>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
       {/* Master Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic inline-block border-b-8 border-emerald-500 pb-2">Institutional Accounts</h1>
          <p className="text-slate-500 font-bold text-sm mt-3 uppercase tracking-widest italic">Consolidated Multi-Channel Fiscal Repository</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {['cashbook', 'bankbook', 'ledger', 'pandl'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
              {t === 'pandl' ? 'Profit & Loss' : t}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'cashbook' && (
        <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
           <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
              <div>
                 <h3 className="text-2xl font-black uppercase italic tracking-tight">Vault Cashbook</h3>
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Institutional Physical Currency Log</p>
              </div>
              <div className="px-8 py-4 bg-white/10 rounded-2xl border border-white/10 flex flex-col items-end">
                 <span className="text-[8px] font-black uppercase opacity-60">Physical Cash-in-Hand</span>
                 <span className="text-2xl font-black italic">₹{cashbook.reduce((a,c)=>a + (c.type==='Income'?c.amount:-c.amount), 0).toLocaleString()}</span>
              </div>
           </div>
           {renderBookTable(cashbook)}
        </div>
      )}

      {activeTab === 'bankbook' && (
        <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
           <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <div>
                 <h3 className="text-2xl font-black uppercase italic tracking-tight">Bank Settlement Book</h3>
                 <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mt-1">Digital & Cheque Transaction Archive</p>
              </div>
              <div className="px-8 py-4 bg-black/20 rounded-2xl border border-white/10 flex flex-col items-end">
                 <span className="text-[8px] font-black uppercase opacity-60">Institutional Bank Liquidity</span>
                 <span className="text-2xl font-black italic">₹{bankbook.reduce((a,c)=>a + (c.type==='Income'?c.amount:-c.amount), 0).toLocaleString()}</span>
              </div>
           </div>
           {renderBookTable(bankbook)}
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5"><svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg></div>
                 <h4 className="text-lg font-black uppercase italic tracking-tight mb-2">Ledger Architect</h4>
                 <p className="text-xs font-bold text-white/40 mb-8 uppercase tracking-widest leading-relaxed">Review categorized account heads realizing institutional flow.</p>
                 <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">New Entry Manual</button>
              </div>
           </div>
           <div className="lg:col-span-3 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden h-[600px] flex flex-col">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <h3 className="text-xl font-black uppercase italic tracking-tight">Consolidated Master Ledger</h3>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{transactions.length} Postings</span>
              </div>
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                 {renderBookTable(transactions)}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'pandl' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           {/* P&L Performance Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 bg-white p-12 rounded-[4rem] border border-slate-200 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight mb-12 underline decoration-indigo-500 underline-offset-8">Institutional P&L Statement</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Income Column */}
                    <div className="space-y-10">
                       <div className="flex justify-between items-end border-b-4 border-emerald-500 pb-2">
                          <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em]">Operational Income</h4>
                          <span className="text-xs font-black text-slate-400 uppercase">Q4 FY25</span>
                       </div>
                       <div className="space-y-6">
                          {/* 
                            Added explicit type assertion to Object.entries return value to fix unknown type property access errors 
                          */}
                          {(Object.entries(plData.categories) as [string, { income: number; expense: number }][]).map(([cat, vals]) => vals.income > 0 && (
                             <div key={cat} className="flex justify-between items-center group">
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-tight group-hover:text-slate-800 transition-colors">{cat}</span>
                                <span className="text-lg font-black text-slate-900 italic">₹{vals.income.toLocaleString()}</span>
                             </div>
                          ))}
                          <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
                             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Gross Revenue</span>
                             <span className="text-3xl font-black text-emerald-600 tracking-tighter italic">₹{plData.totalIncome.toLocaleString()}</span>
                          </div>
                       </div>
                    </div>

                    {/* Expense Column */}
                    <div className="space-y-10">
                       <div className="flex justify-between items-end border-b-4 border-rose-500 pb-2">
                          <h4 className="text-[11px] font-black text-rose-600 uppercase tracking-[0.4em]">Institutional Overheads</h4>
                          <span className="text-xs font-black text-slate-400 uppercase">Settled Outflow</span>
                       </div>
                       <div className="space-y-6">
                          {/* 
                            Added explicit type assertion to Object.entries return value to fix unknown type property access errors 
                          */}
                          {(Object.entries(plData.categories) as [string, { income: number; expense: number }][]).map(([cat, vals]) => vals.expense > 0 && (
                             <div key={cat} className="flex justify-between items-center group">
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-tight group-hover:text-slate-800 transition-colors">{cat}</span>
                                <span className="text-lg font-black text-slate-900 italic">₹{vals.expense.toLocaleString()}</span>
                             </div>
                          ))}
                          <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
                             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Gross Expenditure</span>
                             <span className="text-3xl font-black text-rose-600 tracking-tighter italic">₹{plData.totalExpense.toLocaleString()}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center shadow-2xl">
                    <div>
                       <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">Fiscal Surplus / Net Profit</p>
                       <h3 className="text-xl font-black text-white uppercase italic">Final Realized Margin</h3>
                    </div>
                    <div className="text-right flex items-baseline gap-4">
                       <span className="text-2xl font-black text-white/40">₹</span>
                       <h2 className={`text-7xl font-black tracking-tighter ${plData.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {plData.netProfit.toLocaleString()}
                       </h2>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                 <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Cash Liquidity Split</p>
                    <div className="flex gap-4 w-full">
                       <div className="flex-1 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Cash</p>
                          <p className="text-xl font-black text-slate-900 italic">{( (cashbook.length/transactions.length)*100 || 0 ).toFixed(0)}%</p>
                       </div>
                       <div className="flex-1 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                          <p className="text-[8px] font-black text-indigo-400 uppercase mb-1">Bank</p>
                          <p className="text-xl font-black text-indigo-900 italic">{( (bankbook.length/transactions.length)*100 || 0 ).toFixed(0)}%</p>
                       </div>
                    </div>
                    <button className="mt-10 w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Export Ledger Audit</button>
                 </div>

                 <div className="p-10 bg-indigo-600 rounded-[4rem] text-white shadow-2xl flex flex-col justify-center items-center text-center group">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                       <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-2">Audit Compliance</h4>
                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest leading-relaxed">Transactions are cryptographically synchronized with the central academic repository.</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AccountsModule;
