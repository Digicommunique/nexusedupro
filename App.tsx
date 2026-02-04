
import React, { useState, useEffect } from 'react';
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
import CredentialRegistry from './components/CredentialRegistry';
import TeacherProfile from './components/TeacherProfile';
import TeacherSelfService from './components/TeacherSelfService';
import TeacherMessages from './components/TeacherMessages';
import HomeworkModule from './components/HomeworkModule';
import ParentPortal from './components/ParentPortal';
import { COLORS } from './constants';
import { supabase } from './supabaseClient';
import { 
  NavItem, Student, Staff, AppSettings, HostelRoom, HostelAllotment, Asset,
  TransportRoute, TransportAssignment, IssuedBook, DamageReport, StaffAttendance, Notice, Examination,
  Homework, HomeworkSubmission, ExamResult, StudentFeeRecord, Donation, FeeReceipt, FeeMaster, FeeType, PayrollRecord
} from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');
  const [activeTab, setActiveTab] = useState<NavItem>('dashboard');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Settings State
  const [settings, setSettings] = useState<AppSettings>({
    schoolName: 'EduNexus Academy',
    branchName: 'Main Campus',
    address: '123 Academic Plaza, Education Hub, India',
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200',
  });
  
  // Entities State
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [feeReceipts, setFeeReceipts] = useState<FeeReceipt[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  // Static/Partial states for remaining modules (simulated for now)
  const [assets, setAssets] = useState<Asset[]>([]);
  const [hostelAllotments] = useState<HostelAllotment[]>([]);
  const [exams] = useState<Examination[]>([]);
  const [feeRecords] = useState<StudentFeeRecord[]>([]);

  // 1. DATA SYNC & REALTIME SUBSCRIPTIONS
  useEffect(() => {
    const syncInstitutionalData = async () => {
      setIsLoading(true);
      try {
        const [sets, stus, stf, recs, nts] = await Promise.all([
          supabase.from('app_settings').select('*').maybeSingle(),
          supabase.from('students').select('*').order('created_at', { ascending: false }),
          supabase.from('staff').select('*').order('created_at', { ascending: false }),
          supabase.from('fee_receipts').select('*').order('created_at', { ascending: false }),
          supabase.from('notices').select('*').order('created_at', { ascending: false }),
        ]);

        if (sets.data) setSettings(sets.data);
        if (stus.data) setStudents(stus.data as any);
        if (stf.data) setStaff(stf.data as any);
        if (recs.data) setFeeReceipts(recs.data as any);
        if (nts.data) setNotices(nts.data as any);
      } catch (error) {
        console.error("Critical Sync Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    syncInstitutionalData();

    // SETUP REALTIME CHANNELS
    const studentChannel = supabase.channel('realtime_students').on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, (payload) => {
        if (payload.eventType === 'INSERT') setStudents(prev => [payload.new as any, ...prev]);
        if (payload.eventType === 'UPDATE') setStudents(prev => prev.map(s => s.id === payload.new.id ? { ...s, ...payload.new } : s));
        if (payload.eventType === 'DELETE') setStudents(prev => prev.filter(s => s.id !== payload.old.id));
    }).subscribe();

    const staffChannel = supabase.channel('realtime_staff').on('postgres_changes', { event: '*', schema: 'public', table: 'staff' }, (payload) => {
        if (payload.eventType === 'INSERT') setStaff(prev => [payload.new as any, ...prev]);
        if (payload.eventType === 'UPDATE') setStaff(prev => prev.map(s => s.id === payload.new.id ? { ...s, ...payload.new } : s));
        if (payload.eventType === 'DELETE') setStaff(prev => prev.filter(s => s.id !== payload.old.id));
    }).subscribe();

    const noticeChannel = supabase.channel('realtime_notices').on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, (payload) => {
        if (payload.eventType === 'INSERT') setNotices(prev => [payload.new as any, ...prev]);
        if (payload.eventType === 'UPDATE') setNotices(prev => prev.map(n => n.id === payload.new.id ? { ...n, ...payload.new } : n));
        if (payload.eventType === 'DELETE') setNotices(prev => prev.filter(n => n.id !== payload.old.id));
    }).subscribe();

    const settingsChannel = supabase.channel('realtime_settings').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'app_settings' }, (payload) => {
        setSettings(payload.new as AppSettings);
    }).subscribe();

    const feesChannel = supabase.channel('realtime_fees').on('postgres_changes', { event: '*', schema: 'public', table: 'fee_receipts' }, (payload) => {
        if (payload.eventType === 'INSERT') setFeeReceipts(prev => [payload.new as any, ...prev]);
        if (payload.eventType === 'DELETE') setFeeReceipts(prev => prev.filter(r => r.id !== payload.old.id));
    }).subscribe();

    return () => {
      supabase.removeChannel(studentChannel);
      supabase.removeChannel(staffChannel);
      supabase.removeChannel(noticeChannel);
      supabase.removeChannel(settingsChannel);
      supabase.removeChannel(feesChannel);
    };
  }, []);

  const handleLogin = (role: string) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setActiveTab(role === 'Parent' ? 'parent_portal' : 'dashboard');
  };

  const handleSaveSettings = async (newSettings: AppSettings) => {
    const { error } = await supabase
      .from('app_settings')
      .update(newSettings)
      .eq('id', (settings as any).id);
    
    if (error) alert("Settings Update Failed: " + error.message);
    // State update happens via Realtime Subscription
  };

  const handleSavePerson = async (data: any) => {
    const isStudent = activeTab === 'students';
    const table = isStudent ? 'students' : 'staff';

    if (editingItemId) {
      const { error } = await supabase.from(table).update(data).eq('id', editingItemId);
      if (error) alert("Update failed: " + error.message);
    } else {
      const { error } = await supabase.from(table).insert([data]);
      if (error) alert("Creation failed: " + error.message);
    }
    // State updates happen via Realtime Subscription automatically
    setShowAddForm(false);
    setEditingItemId(null);
  };

  const handleDeletePerson = async (id: string) => {
    const table = activeTab === 'students' ? 'students' : 'staff';
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) alert("Delete failed: " + error.message);
  };

  const handleAddReceipt = async (receipt: FeeReceipt) => {
    const { error } = await supabase.from('fee_receipts').insert([receipt]);
    if (error) alert("Receipt sync failed: " + error.message);
  };

  const handleAddNotice = async (notice: Notice) => {
    const { error } = await supabase.from('notices').insert([notice]);
    if (error) alert("Notice sync failed: " + error.message);
  };

  const handleDeleteNotice = async (id: string) => {
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) alert("Notice delete failed: " + error.message);
  };

  const handleUpdateStaffCredentials = async (staffId: string, updates: Partial<Staff>) => {
    const { error } = await supabase.from('staff').update(updates).eq('id', staffId);
    if (error) alert("Credential sync failed: " + error.message);
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
                  {isLoading ? 'Synchronizing Institutional Cloud...' : 'Secure Institutional Node'}
                </p>
                <h2 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">{userRole} Control Interface</h2>
              </div>
           </div>
           <button onClick={() => setIsAuthenticated(false)} className="px-6 py-2 bg-slate-50 text-slate-400 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">Logout</button>
        </div>
        
        <div className="max-w-[1400px] mx-auto p-10 print:p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
               <div className="w-16 h-16 border-8 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Establishing Secure Sync...</p>
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
                  case 'dashboard': return <Dashboard notices={notices} students={students} staff={staff} transportRoutes={[]} exams={exams} donations={[]} feeRecords={feeRecords} feeReceipts={feeReceipts} userRole={userRole} />;
                  case 'fees': return <FeesModule students={students} staff={staff} settings={settings} hostelAllotments={hostelAllotments} hostelRooms={[]} transportRoutes={[]} issuedBooks={[]} damageReports={[]} feeReceipts={feeReceipts} onAddReceipt={handleAddReceipt} />;
                  case 'students': return <ListView type="students" items={students} onAdd={() => { setEditingItemId(null); setShowAddForm(true); }} onDelete={handleDeletePerson} onEdit={(id) => { setEditingItemId(id); setShowAddForm(true); }} />;
                  case 'staff': return <ListView type="staff" items={staff} onAdd={() => { setEditingItemId(null); setShowAddForm(true); }} onDelete={handleDeletePerson} onEdit={(id) => { setEditingItemId(id); setShowAddForm(true); }} />;
                  case 'notices': return <NoticeModule settings={settings} notices={notices} onAddNotice={handleAddNotice} onDeleteNotice={handleDeleteNotice} />;
                  case 'settings': return <SettingsView settings={settings} onUpdate={handleSaveSettings} staff={staff} onUpdateStaff={handleUpdateStaffCredentials} />;
                  case 'academic': return <AcademicModule staff={staff} />;
                  case 'attendance': return <AttendanceModule students={students} staff={staff} />;
                  case 'examination': return <ExaminationModule students={students} settings={settings} />;
                  case 'teacher_homework': return <HomeworkModule teacher={staff[0]} students={students} />;
                  case 'teacher_messages': return <TeacherMessages teacher={staff[0]} students={students} />;
                  case 'payroll': return <PayrollModule staff={staff} settings={settings} staffAttendance={[]} />;
                  case 'labs': return <LabModule />;
                  case 'activities': return <ActivityModule />;
                  case 'transport': return <TransportModule />;
                  case 'donations': return <DonationModule />;
                  case 'alumni': return <AlumniModule />;
                  case 'certificates': return <CertificateModule settings={settings} students={students} staff={staff} />;
                  case 'credentials': return <CredentialRegistry students={students} staff={staff} />;
                  case 'accounts': return <AccountsModule feeReceipts={feeReceipts} payrollHistory={[]} assets={assets} settings={settings} />;
                  default: return <div className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">Module Initializing...</div>;
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
