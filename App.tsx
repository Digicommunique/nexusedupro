
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ListView from './components/ListView';
import AddPersonForm from './components/AddPersonForm';
import SettingsView from './components/SettingsView';
import AcademicModule from './components/AcademicModule';
import CertificateModule from './components/CertificateModule';
import ExaminationModule from './components/ExaminationModule';
import LibraryModule from './components/LibraryModule';
import LabModule from './components/LabModule';
import ActivityModule from './components/ActivityModule';
import TransportModule from './components/TransportModule';
import DonationModule from './components/DonationModule';
import AttendanceModule from './components/AttendanceModule';
import AlumniModule from './components/AlumniModule';
import HostelModule from './components/HostelModule';
import FeesModule from './components/FeesModule';
import AssetModule from './components/AssetModule';
import AccountsModule from './components/AccountsModule';
import FinancialConsolidatedReport from './components/FinancialConsolidatedReport';
import PayrollModule from './components/PayrollModule';
import NoticeModule from './components/NoticeModule';
import AuthModule from './components/AuthModule';
import { COLORS } from './constants';
import { supabase } from './supabaseClient';
import { 
  NavItem, Student, Staff, AppSettings, Notice, FeeReceipt
} from './types';

// Robust utility to convert DB snake_case to App camelCase
const toCamel = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toCamel);
  
  const newObj: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));
    newObj[camelKey] = toCamel(obj[key]);
  }
  return newObj;
};

// Robust utility to convert App camelCase to DB snake_case
const toSnake = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toSnake);

  const newObj: any = {};
  for (const key in obj) {
    let snakeKey;
    if (key === 'studentId') snakeKey = 'student_id';
    else if (key === 'staffId') snakeKey = 'staff_id';
    else if (key === 'fatherIdDoc') snakeKey = 'father_id_doc';
    else if (key === 'motherIdDoc') snakeKey = 'mother_id_doc';
    else if (key === 'parentSignature') snakeKey = 'parent_signature';
    else snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    
    newObj[snakeKey] = toSnake(obj[key]);
  }
  return newObj;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');
  const [activeTab, setActiveTab] = useState<NavItem>('dashboard');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [settings, setSettings] = useState<AppSettings>({
    schoolName: 'EduNexus Academy',
    branchName: 'Main Campus',
    address: '123 Academic Plaza, Education Hub, India',
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200',
  });
  
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [feeReceipts, setFeeReceipts] = useState<FeeReceipt[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  const syncInstitutionalData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sets, stus, stf, recs, nts] = await Promise.all([
        supabase.from('app_settings').select('*').limit(1).maybeSingle(),
        supabase.from('students').select('*').order('created_at', { ascending: false }),
        supabase.from('staff').select('*').order('created_at', { ascending: false }),
        supabase.from('fee_receipts').select('*').order('created_at', { ascending: false }),
        supabase.from('notices').select('*').order('created_at', { ascending: false }),
      ]);

      if (sets.data) setSettings(toCamel(sets.data));
      if (stus.data) setStudents(stus.data.map(toCamel));
      if (stf.data) setStaff(stf.data.map(toCamel));
      if (recs.data) setFeeReceipts(recs.data.map(toCamel));
      if (nts.data) setNotices(nts.data.map(toCamel));
    } catch (error) {
      console.error("Critical Sync Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      syncInstitutionalData();

      const studentChannel = supabase.channel('realtime_students').on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, (payload) => {
          if (payload.eventType === 'INSERT') setStudents(prev => [toCamel(payload.new), ...prev]);
          if (payload.eventType === 'UPDATE') setStudents(prev => prev.map(s => s.id === payload.new.id ? toCamel(payload.new) : s));
          if (payload.eventType === 'DELETE') setStudents(prev => prev.filter(s => s.id !== payload.old.id));
      }).subscribe();

      const staffChannel = supabase.channel('realtime_staff').on('postgres_changes', { event: '*', schema: 'public', table: 'staff' }, (payload) => {
          if (payload.eventType === 'INSERT') setStaff(prev => [toCamel(payload.new), ...prev]);
          if (payload.eventType === 'UPDATE') setStaff(prev => prev.map(s => s.id === payload.new.id ? toCamel(payload.new) : s));
          if (payload.eventType === 'DELETE') setStaff(prev => prev.filter(s => s.id !== payload.old.id));
      }).subscribe();

      return () => {
        supabase.removeChannel(studentChannel);
        supabase.removeChannel(staffChannel);
      };
    }
  }, [isAuthenticated, syncInstitutionalData]);

  const handleLogin = (role: string) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setActiveTab(role === 'Parent' ? 'parent_portal' : 'dashboard');
  };

  const handleSavePerson = async (data: any) => {
    const isStudent = activeTab === 'students';
    const table = isStudent ? 'students' : 'staff';
    
    // EXPLICIT SCRUBBING: Remove fields that cause schema errors in specific tables
    const scrubbed = { ...data };
    if (!isStudent) {
      // Staff table does not have these columns in standard setup
      delete scrubbed.caste; 
      delete scrubbed.grade;
      delete scrubbed.section;
      delete scrubbed.studentId;
      delete scrubbed.parentSignature;
    } else {
      // Student table does not have these
      delete scrubbed.role;
      delete scrubbed.staffId;
      delete scrubbed.joiningDate;
    }

    const payload = toSnake(scrubbed);
    if (!editingItemId) delete payload.id;
    
    try {
      let response;
      if (editingItemId) {
        response = await supabase.from(table).update(payload).eq('id', editingItemId);
      } else {
        response = await supabase.from(table).insert([payload]);
      }
      
      if (response.error) throw response.error;
      
      alert(`${isStudent ? 'Student' : 'Staff'} record for ${data.name} successfully committed to ledger.`);
      
      setShowAddForm(false);
      setEditingItemId(null);
      await syncInstitutionalData();
    } catch (error: any) {
      console.error("Supabase Transaction Error:", error);
      alert(`Ledger Entry Failed: ${error.message || 'Check database schema compatibility'}`);
    }
  };

  const handleUpdateStaffCredentials = async (staffId: string, updates: Partial<Staff>) => {
    try {
      const { error } = await supabase.from('staff').update(toSnake(updates)).eq('id', staffId);
      if (error) throw error;
      await syncInstitutionalData();
    } catch (error: any) {
      alert(`Credential Sync Failed: ${error.message}`);
    }
  };

  const handleAddReceipt = async (receipt: FeeReceipt) => {
    try {
      const { error } = await supabase.from('fee_receipts').insert([toSnake(receipt)]);
      if (error) throw error;
      await syncInstitutionalData();
    } catch (error: any) {
      alert(`Fiscal Realization Failed: ${error.message}`);
    }
  };

  if (!isAuthenticated) return <AuthModule onLogin={handleLogin} />;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar active={activeTab} onSelect={setActiveTab} userRole={userRole} />
      <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
        <div className="p-8 flex justify-between items-center border-b border-slate-100 bg-white sticky top-0 z-[40]">
           <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: COLORS.primary }}></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  {isLoading ? 'Calibrating...' : 'Cloud Registry Active'}
                </p>
                <h2 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">{userRole} Control Hub</h2>
              </div>
           </div>
           <div className="flex items-center gap-4">
             <button onClick={() => syncInstitutionalData()} className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm group" title="Force Ledger Sync">
               <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             </button>
             <button onClick={() => setIsAuthenticated(false)} className="px-8 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">Logout</button>
           </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto p-10">
          {isLoading && !showAddForm ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
               <div className="w-20 h-20 border-8 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-[0.6em]">Synchronizing Master Registry...</p>
            </div>
          ) : (
            showAddForm ? (
              <AddPersonForm 
                type={activeTab === 'students' ? 'student' : 'staff'} 
                settings={settings} 
                initialData={editingItemId ? [...students, ...staff].find(i => i.id === editingItemId) : undefined}
                onCancel={() => { setShowAddForm(false); setEditingItemId(null); }} 
                onSubmit={handleSavePerson} 
              />
            ) : (
              (() => {
                switch (activeTab) {
                  case 'dashboard': return <Dashboard notices={notices} students={students} staff={staff} transportRoutes={[]} exams={[]} donations={[]} feeRecords={[]} feeReceipts={feeReceipts} userRole={userRole} />;
                  case 'students': return <ListView type="students" items={students} onAdd={() => { setEditingItemId(null); setShowAddForm(true); }} onDelete={(id) => supabase.from('students').delete().eq('id', id).then(() => syncInstitutionalData())} onEdit={(id) => { setEditingItemId(id); setShowAddForm(true); }} />;
                  case 'staff': return <ListView type="staff" items={staff} onAdd={() => { setEditingItemId(null); setShowAddForm(true); }} onDelete={(id) => supabase.from('staff').delete().eq('id', id).then(() => syncInstitutionalData())} onEdit={(id) => { setEditingItemId(id); setShowAddForm(true); }} />;
                  case 'settings': return <SettingsView settings={settings} onUpdate={(s) => supabase.from('app_settings').update(toSnake(s)).eq('id', (settings as any).id).then(() => syncInstitutionalData())} staff={staff} onUpdateStaff={handleUpdateStaffCredentials} />;
                  case 'fees': return <FeesModule students={students} staff={staff} settings={settings} hostelAllotments={[]} hostelRooms={[]} transportRoutes={[]} issuedBooks={[]} damageReports={[]} feeReceipts={feeReceipts} onAddReceipt={handleAddReceipt} />;
                  case 'attendance': return <AttendanceModule students={students} staff={staff} />;
                  case 'examination': return <ExaminationModule students={students} settings={settings} />;
                  case 'notices': return <NoticeModule settings={settings} notices={notices} onAddNotice={(n) => supabase.from('notices').insert([toSnake(n)]).then(() => syncInstitutionalData())} onDeleteNotice={(id) => supabase.from('notices').delete().eq('id', id).then(() => syncInstitutionalData())} />;
                  default: return <div className="p-20 text-center text-slate-300 font-black uppercase tracking-widest border-4 border-dashed border-slate-100 rounded-[3rem]">Select Module from Navigator</div>;
                }
              })()
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
