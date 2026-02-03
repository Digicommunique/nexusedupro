
import React, { useState } from 'react';
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
  const [settings, setSettings] = useState<AppSettings>({
    schoolName: 'EduNexus Academy',
    branchName: 'Main Campus'
  });
  
  // Shared States for Cross-Module Visibility
  const [feeReceipts, setFeeReceipts] = useState<FeeReceipt[]>([
    { id: 'R1', receiptNo: 'EN-882X1', studentId: 'S1', studentName: 'Aarav Sharma', grade: 'Class 10', section: 'A', amountPaid: 5000, discount: 0, penalty: 0, paymentDate: new Date().toISOString().split('T')[0], paymentMethod: 'UPI', session: '2025-26', description: 'Term 1 Tuition' },
    { id: 'R2', receiptNo: 'EN-99K21', studentId: 'S2', studentName: 'Isha Patel', grade: 'Class 10', section: 'A', amountPaid: 5300, discount: 0, penalty: 0, paymentDate: '2025-02-15', paymentMethod: 'Cash', session: '2025-26', description: 'Annual Charges' }
  ]);

  const [assets, setAssets] = useState<Asset[]>([
    { id: 'AST1', name: 'Nexus Workstation i9', category: 'Electronics', purchaseDate: '2025-01-10', cost: 85000, serialNumber: 'NX-9982', location: 'Admin Room 1', status: 'Operational', description: 'Main admin server station' }
  ]);

  const [payrollHistory, setPayrollHistory] = useState<PayrollRecord[]>([]);

  const [feeMasters] = useState<FeeMaster[]>([
    { id: 'FM1', feeTypeId: 'FT1', feeGroupId: 'FG2', amount: 4500, dueDate: '2025-04-10', grade: 'Class 10' }
  ]);

  const [feeTypes] = useState<FeeType[]>([
    { id: 'FT1', name: 'Tuition Fee', description: 'Monthly academic charges' }
  ]);

  const [libraryIssues] = useState<IssuedBook[]>([
    { id: 'ISS1', itemId: 'I2', personId: 'S1', personName: 'Aarav Sharma', issueDate: '2025-02-10', dueDate: '2025-02-17', reissueCount: 0, lateFee: 75, damageFee: 0 }
  ]);

  const [hostelAllotments] = useState<HostelAllotment[]>([
    { id: 'A1', studentId: 'S1', studentName: 'Aarav Sharma', hostelId: 'H1', roomId: 'HR1', allotmentDate: '2025-01-01', feeStatus: 'Paid' }
  ]);

  const [notices, setNotices] = useState<Notice[]>([
    { id: 'N1', title: 'Founders Day 2025', content: 'Celebration at main auditorium.', senderRole: 'Director', senderName: 'Mr. S.P. Singhania', date: '10 Feb 2025', targetAudience: ['Teacher', 'Non-Teaching Staff', 'Parent', 'Public'], priority: 'High' }
  ]);

  const [exams] = useState<Examination[]>([
    { id: 'E1', title: 'Final Exam 2025', grade: 'Class 10', section: 'A', subject: 'Mathematics', date: '2025-03-15', totalMarks: 100, isResultDeclared: false }
  ]);

  const [feeRecords] = useState<StudentFeeRecord[]>([
    { id: 'FR1', studentId: 'S1', totalAmount: 15800, discount: 0, paidAmount: 5000, dueDate: '2025-03-05', status: 'Partial' },
    { id: 'FR2', studentId: 'S2', totalAmount: 5800, discount: 500, paidAmount: 5300, dueDate: '2025-03-05', status: 'Paid' }
  ]);

  const [students] = useState<Student[]>([
    { id: 'S1', name: 'Aarav Sharma', gender: 'Male', dob: '2010-05-12', address: '123 Tech Lane, Bangalore', bloodGroup: 'A+', studentId: 'EDU-MAIN-STU-X8Z2', grade: 'Class 10', section: 'A', fatherName: 'Rajesh Sharma', fatherOccupation: 'Engineer', fatherOccupationAddress: 'Tech Park', fatherContact: '9876543210', guardianName: 'Rajesh Sharma', guardianRelationship: 'Father', guardianAddress: '123 Tech Lane', guardianContact: '9876543210', motherName: 'Sunita Sharma', motherOccupation: 'Teacher', motherOccupationAddress: 'Sector 4', motherContact: '9876543211', transportRouteId: 'R1' },
    { id: 'S2', name: 'Isha Patel', gender: 'Female', dob: '2011-03-14', address: '456 Garden View, Bangalore', bloodGroup: 'B+', studentId: 'EDU-MAIN-STU-Y9P3', grade: 'Class 10', section: 'A', fatherName: 'Manish Patel', fatherOccupation: 'Doctor', fatherOccupationAddress: 'Apollo', fatherContact: '9988776655', guardianName: 'Manish Patel', guardianRelationship: 'Father', guardianAddress: 'Garden View', guardianContact: '9988776655', motherName: 'Kavita Patel', motherOccupation: 'Artist', motherOccupationAddress: 'Home', motherContact: '9988776656' }
  ]);

  const [staff] = useState<Staff[]>([
    { id: 'T1', name: 'Dr. Anjali Verma', gender: 'Female', dob: '1985-08-22', address: 'Mumbai', bloodGroup: 'B-', staffId: 'EDU-MAIN-STF-P9K1', role: 'Teacher', relationshipStatus: 'Married', qualification: 'PhD', bankName: 'HDFC', ifscCode: 'HDFC001', accountNumber: '123', joiningDate: '2020-01-15', assignedGrade: 'Class 10', assignedSection: 'A', isClassTeacher: true }
  ]);

  const handleLogin = (role: string) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setActiveTab(role === 'Parent' ? 'parent_portal' : 'dashboard');
  };

  const handleAddReceipt = (receipt: FeeReceipt) => setFeeReceipts([receipt, ...feeReceipts]);

  const renderContent = () => {
    if (showAddForm) return <AddPersonForm type={activeTab === 'students' ? 'student' : 'staff'} settings={settings} onCancel={() => setShowAddForm(false)} onSubmit={() => setShowAddForm(false)} />;
    
    switch (activeTab) {
      case 'dashboard': return <Dashboard notices={notices} students={students} staff={staff} transportRoutes={[]} exams={exams} donations={[]} feeRecords={feeRecords} feeReceipts={feeReceipts} userRole={userRole} />;
      case 'parent_portal': return (
        <ParentPortal 
          student={students[0]} 
          exams={exams} 
          results={[]} 
          homeworks={[]} 
          submissions={[]} 
          fees={feeRecords} 
          classTeacher={staff[0]} 
          libraryIssues={libraryIssues}
          hostelAllotments={hostelAllotments}
          feeReceipts={feeReceipts}
        />
      );
      case 'fees': return <FeesModule students={students} staff={staff} settings={settings} hostelAllotments={hostelAllotments} hostelRooms={[]} transportRoutes={[]} issuedBooks={libraryIssues} damageReports={[]} feeReceipts={feeReceipts} onAddReceipt={handleAddReceipt} />;
      case 'accounts': return <AccountsModule feeReceipts={feeReceipts} payrollHistory={payrollHistory} assets={assets} settings={settings} />;
      case 'assets': return <AssetModule students={students} staff={staff} />;
      case 'financial_report': return (
        <FinancialConsolidatedReport 
          students={students} 
          feeReceipts={feeReceipts} 
          feeMasters={feeMasters} 
          feeTypes={feeTypes} 
          hostelAllotments={hostelAllotments} 
          hostelRooms={[]} 
          transportRoutes={[]} 
          issuedBooks={libraryIssues} 
          damageReports={[]} 
        />
      );
      case 'library': return <LibraryModule students={students} staff={staff} settings={settings} />;
      case 'hostel': return <HostelModule students={students} staff={staff} />;
      case 'students': return <ListView type="students" items={students} onAdd={() => setShowAddForm(true)} />;
      case 'staff': return <ListView type="staff" items={staff} onAdd={() => setShowAddForm(true)} />;
      case 'notices': return <NoticeModule settings={settings} notices={notices} onAddNotice={(n) => setNotices([n, ...notices])} onDeleteNotice={(id) => setNotices(notices.filter(x => x.id !== id))} />;
      case 'academic': return <AcademicModule />;
      case 'attendance': return <AttendanceModule students={students} staff={staff} />;
      case 'examination': return <ExaminationModule students={students} settings={settings} />;
      case 'payroll': return <PayrollModule staff={staff} settings={settings} staffAttendance={[]} />;
      case 'labs': return <LabModule />;
      case 'activities': return <ActivityModule />;
      case 'transport': return <TransportModule />;
      case 'donations': return <DonationModule />;
      case 'alumni': return <AlumniModule />;
      case 'certificates': return <CertificateModule settings={settings} students={students} staff={staff} />;
      case 'credentials': return <CredentialRegistry students={students} staff={staff} />;
      case 'settings': return <SettingsView settings={settings} onUpdate={setSettings} />;
      default: return <Dashboard notices={notices} students={students} staff={staff} transportRoutes={[]} exams={exams} donations={[]} feeRecords={feeRecords} feeReceipts={feeReceipts} userRole={userRole} />;
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
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Secure Institutional Node</p>
                <h2 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">{userRole} Control Interface</h2>
              </div>
           </div>
           <button onClick={() => setIsAuthenticated(false)} className="px-6 py-2 bg-slate-50 text-slate-400 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">Logout</button>
        </div>
        <div className="max-w-[1400px] mx-auto p-10 print:p-0">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;
