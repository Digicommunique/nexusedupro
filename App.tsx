
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
  NavItem, Student, Staff, AppSettings, HostelRoom, HostelAllotment, 
  TransportRoute, TransportAssignment, IssuedBook, DamageReport, StaffAttendance, Notice, Examination,
  Homework, HomeworkSubmission, ExamResult, StudentFeeRecord, Donation
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
  
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 'N1',
      title: 'Annual Founders Day Celebration',
      content: 'We are pleased to announce the upcoming Founders Day celebration. All staff and students are requested to attend the main auditorium at 10 AM.',
      senderRole: 'Director',
      senderName: 'Mr. S.P. Singhania',
      date: '10 Feb 2025',
      targetAudience: ['Teacher', 'Non-Teaching Staff', 'Parent', 'Public'],
      priority: 'High'
    },
    {
      id: 'N2',
      title: 'Examination Schedule Update',
      content: 'The final examinations for Class 10 and 12 have been slightly realigned to accommodate national holidays.',
      senderRole: 'Principal',
      senderName: 'Dr. Anjali Verma',
      date: '12 Feb 2025',
      targetAudience: ['Teacher', 'Parent'],
      priority: 'Urgent'
    }
  ]);

  const [exams] = useState<Examination[]>([
    { id: 'E1', title: 'Final Examination 2025', grade: 'Class 10', section: 'A', subject: 'Mathematics', date: '2025-03-15', totalMarks: 100, isResultDeclared: false },
    { id: 'E2', title: 'Unit Test 2', grade: 'Class 9', section: 'B', subject: 'Science', date: '2025-03-18', totalMarks: 50, isResultDeclared: false }
  ]);

  const [donations] = useState<Donation[]>([
    { id: 'D1', campaignId: 'C1', donorName: 'Amitabh Sharma', donorAddress: 'Delhi', donorPhone: '9810234567', donorEmail: 'amit@gmail.com', purpose: 'Philanthropy', amount: 25000, date: '2025-02-10' },
    { id: 'D2', campaignId: 'C2', donorName: 'Ramesh Singh', donorAddress: 'Noida', donorPhone: '9810234568', donorEmail: 'ramesh@gmail.com', purpose: 'CSR', amount: 15000, date: '2025-02-12' }
  ]);

  const [homeworks] = useState<Homework[]>([
    { id: 'H1', title: 'Calculus Problems - Set 1', description: 'Solve all problems from page 42-45 of the main textbook.', grade: 'Class 10', section: 'A', subject: 'Mathematics', dueDate: '2025-03-25' }
  ]);

  const [submissions] = useState<HomeworkSubmission[]>([
    { id: 'S1', homeworkId: 'H1', studentId: 'S1', studentName: 'Aarav Sharma', submissionDate: '2025-03-24', status: 'Pending', feedback: '', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
  ]);

  const [results] = useState<ExamResult[]>([
    { id: 'R1', examId: 'E1', studentId: 'S1', marksObtained: 88, grade: 'A', isPublished: true }
  ]);

  const [feeRecords] = useState<StudentFeeRecord[]>([
    { id: 'FR1', studentId: 'S1', totalAmount: 5800, discount: 0, paidAmount: 0, dueDate: '2025-03-05', status: 'Unpaid' },
    { id: 'FR2', studentId: 'S2', totalAmount: 5800, discount: 500, paidAmount: 5300, dueDate: '2025-03-05', status: 'Paid' }
  ]);

  const handleLogin = (role: string) => {
    setUserRole(role);
    setIsAuthenticated(true);
    // Role-based landing pages
    if (role === 'Teacher') setActiveTab('dashboard');
    else if (role === 'Librarian') setActiveTab('library');
    else if (role === 'Accountant') setActiveTab('fees');
    else if (role === 'Receptionist') setActiveTab('notices');
    else if (role === 'Parent') setActiveTab('parent_portal');
    else setActiveTab('dashboard');
  };

  const handleAddNotice = (notice: Notice) => setNotices([notice, ...notices]);
  const handleDeleteNotice = (id: string) => setNotices(notices.filter(n => n.id !== id));

  const [hostelRooms] = useState<HostelRoom[]>([
    { id: 'HR1', hostelId: 'H1', roomNo: '101', capacity: 3, occupied: 1, monthlyFee: 4500 },
    { id: 'HR2', hostelId: 'H2', roomNo: '201', capacity: 2, occupied: 0, monthlyFee: 5500 }
  ]);
  const [hostelAllotments] = useState<HostelAllotment[]>([
    { id: 'A1', studentId: 'S1', studentName: 'Aarav Sharma', hostelId: 'H1', roomId: 'HR1', allotmentDate: '2025-01-01', feeStatus: 'Paid' }
  ]);
  const [transportRoutes] = useState<TransportRoute[]>([
    { id: 'R1', name: 'Dwarka Sector 10 Loop', stops: ['Stop A', 'Stop B'], distanceKm: 12, ratePerKm: 8 },
    { id: 'R2', name: 'Noida Express Route', stops: ['Sec 62', 'Sec 18'], distanceKm: 25, ratePerKm: 10 }
  ]);
  const [transportAssignments] = useState<TransportAssignment[]>([
    { id: 'A1', vehicleId: 'V1', routeId: 'R1', driverId: 'P1', conductorId: 'P3', status: 'In Transit' }
  ]);
  const [issuedBooks] = useState<IssuedBook[]>([
    { id: 'IS1', itemId: 'I1', personId: 'S1', personName: 'Aarav Sharma', issueDate: '2025-01-01', dueDate: '2025-01-10', lateFee: 250, damageFee: 0, reissueCount: 0 }
  ]);
  const [damageReports] = useState<DamageReport[]>([
    { id: 'DR1', itemId: 'L1', itemName: 'Microscope', labType: 'Biology', reason: 'Cracked lens', reportedBy: 'Admin', reportedDate: '2025-02-01', studentId: 'S1', penaltyAmount: 500 }
  ]);

  const [staffAttendance] = useState<StaffAttendance[]>([
    { id: 'SA1', staffId: 'T1', date: '2025-03-01', status: 'Present' },
    { id: 'SA2', staffId: 'T1', date: '2025-03-02', status: 'Present' },
    { id: 'SA3', staffId: 'T1', date: '2025-03-03', status: 'Present' }
  ]);

  const [students, setStudents] = useState<Student[]>([
    { 
      id: 'S1', name: 'Aarav Sharma', gender: 'Male', dob: '2010-05-12', address: '123 Tech Lane, Bangalore', 
      bloodGroup: 'A+', studentId: 'EDU-MAIN-STU-X8Z2', grade: 'Class 10', section: 'A',
      fatherName: 'Rajesh Sharma', fatherOccupation: 'Engineer', fatherOccupationAddress: 'Tech Park', fatherContact: '9876543210', 
      guardianName: 'Rajesh Sharma', guardianRelationship: 'Father', guardianAddress: '123 Tech Lane', guardianContact: '9876543210', 
      motherName: 'Sunita Sharma', motherOccupation: 'Teacher', motherOccupationAddress: 'Sector 4', motherContact: '9876543211',
      fatherIdDoc: 'f_id.jpg', motherIdDoc: 'm_id.jpg', idDocument: 's_id.jpg',
      transportRouteId: 'R1',
      password: 'student_aarav',
      selectedActivities: ['Music Club', 'Football Academy'],
      selectedSubjects: ['Mathematics', 'Computer Science', 'English']
    },
    { 
      id: 'S2', name: 'Isha Patel', gender: 'Female', dob: '2011-03-15', address: 'Sector 5, Gurgaon', 
      bloodGroup: 'O+', studentId: 'EDU-MAIN-STU-Y7T1', grade: 'Class 10', section: 'A',
      fatherName: 'Vikas Patel', fatherOccupation: 'Doctor', fatherOccupationAddress: 'Fortis', fatherContact: '9988776655', 
      guardianName: 'Vikas Patel', guardianRelationship: 'Father', guardianAddress: 'Sector 5', guardianContact: '9988776655', 
      motherName: 'Meera Patel', motherOccupation: 'Housewife', motherOccupationAddress: 'N/A', motherContact: '9988776656',
      password: 'student_isha'
    }
  ]);
  const [staff, setStaff] = useState<Staff[]>([
    { 
      id: 'T1', name: 'Dr. Anjali Verma', gender: 'Female', dob: '1985-08-22', address: '456 Scholar Ave, Mumbai', 
      bloodGroup: 'B-', staffId: 'EDU-MAIN-STF-P9K1', role: 'Teacher', relationshipStatus: 'Married', 
      qualification: 'PhD in Literature', bankName: 'HDFC Bank', ifscCode: 'HDFC001234', accountNumber: '1234567890', 
      fatherName: 'Om Prakash Verma', fatherOccupation: 'Lawyer', fatherOccupationAddress: 'High Court', fatherContact: '9123456780', 
      guardianName: 'Amit Verma', guardianRelationship: 'Spouse', guardianAddress: '456 Scholar Ave', guardianContact: '9123456781', 
      motherName: 'Lata Verma', motherOccupation: 'Retired', motherOccupationAddress: 'N/A', motherContact: '9123456782',
      joiningDate: '2020-01-15',
      password: 'staff_anjali',
      assignedGrade: 'Class 10',
      assignedSection: 'A',
      isClassTeacher: true
    }
  ]);

  const activeTeacher = staff.find(s => s.id === 'T1')!;
  const activeStudent = students.find(s => s.id === 'S1')!;

  const handleFormSubmit = (data: any) => {
    const id = Math.random().toString(36).substr(2, 6).toUpperCase();
    if (activeTab === 'students') setStudents([...students, { ...data, id } as Student]);
    else setStaff([...staff, { ...data, id } as Staff]);
    setShowAddForm(false);
  };

  const renderContent = () => {
    if (showAddForm) return <AddPersonForm type={activeTab === 'students' ? 'student' : 'staff'} settings={settings} onCancel={() => setShowAddForm(false)} onSubmit={handleFormSubmit} />;
    
    // Role access checks
    if (userRole === 'Librarian' && activeTab !== 'library') {
      return <LibraryModule students={students} staff={staff} settings={settings} />;
    }

    if (userRole === 'Accountant' && activeTab !== 'fees') {
      return <FeesModule students={students} staff={staff} settings={settings} hostelAllotments={hostelAllotments} hostelRooms={hostelRooms} transportRoutes={transportRoutes} transportAssignments={transportAssignments} issuedBooks={issuedBooks} damageReports={damageReports} />;
    }

    if (userRole === 'Receptionist' && !['notices', 'hostel', 'transport'].includes(activeTab)) {
      return <NoticeModule settings={settings} notices={notices} onAddNotice={handleAddNotice} onDeleteNotice={handleDeleteNotice} />;
    }

    if (userRole === 'Parent' && !['parent_portal', 'notices'].includes(activeTab)) {
      return <ParentPortal student={activeStudent} exams={exams} results={results} homeworks={homeworks} submissions={submissions} fees={feeRecords} classTeacher={activeTeacher} />;
    }

    switch (activeTab) {
      case 'dashboard': return (
        <Dashboard 
          notices={notices} 
          students={userRole === 'Teacher' ? students.filter(s => s.grade === activeTeacher.assignedGrade && s.section === activeTeacher.assignedSection) : students} 
          staff={staff} 
          transportRoutes={transportRoutes} 
          exams={exams}
          donations={donations}
          feeRecords={feeRecords}
        />
      );
      case 'notices': return <NoticeModule settings={settings} notices={notices} onAddNotice={handleAddNotice} onDeleteNotice={handleDeleteNotice} />;
      case 'students': return <ListView type="students" items={students} onAdd={() => setShowAddForm(true)} />;
      case 'teacher_students': return <ListView type="students" items={students.filter(s => s.grade === activeTeacher.assignedGrade && s.section === activeTeacher.assignedSection)} onAdd={() => setShowAddForm(true)} />;
      case 'staff': return <ListView type="staff" items={staff} onAdd={() => setShowAddForm(true)} />;
      case 'teacher_profile': return <TeacherProfile teacher={activeTeacher} />;
      case 'academic': return <AcademicModule />;
      case 'attendance': return <AttendanceModule students={userRole === 'Teacher' ? students.filter(s => s.grade === activeTeacher.assignedGrade && s.section === activeTeacher.assignedSection) : students} staff={staff} />;
      case 'examination': return <ExaminationModule students={userRole === 'Teacher' ? students.filter(s => s.grade === activeTeacher.assignedGrade && s.section === activeTeacher.assignedSection) : students} settings={settings} />;
      case 'teacher_homework': return <HomeworkModule teacher={activeTeacher} students={students.filter(s => s.grade === activeTeacher.assignedGrade && s.section === activeTeacher.assignedSection)} />;
      case 'fees': return <FeesModule students={students} staff={staff} settings={settings} hostelAllotments={hostelAllotments} hostelRooms={hostelRooms} transportRoutes={transportRoutes} transportAssignments={transportAssignments} issuedBooks={issuedBooks} damageReports={damageReports} />;
      case 'payroll': return <PayrollModule staff={staff} settings={settings} staffAttendance={staffAttendance} />;
      case 'teacher_self_service': return <TeacherSelfService teacher={activeTeacher} attendance={staffAttendance.filter(a => a.staffId === activeTeacher.id)} settings={settings} />;
      case 'teacher_messages': return <TeacherMessages teacher={activeTeacher} students={students.filter(s => s.grade === activeTeacher.assignedGrade && s.section === activeTeacher.assignedSection)} />;
      case 'parent_portal': return <ParentPortal student={activeStudent} exams={exams} results={results} homeworks={homeworks} submissions={submissions} fees={feeRecords} classTeacher={activeTeacher} />;
      case 'library': return <LibraryModule students={students} staff={staff} settings={settings} />;
      case 'labs': return <LabModule />;
      case 'activities': return <ActivityModule />;
      case 'transport': return <TransportModule />;
      case 'hostel': return <HostelModule students={students} staff={staff} />;
      case 'donations': return <DonationModule />;
      case 'alumni': return <AlumniModule />;
      case 'certificates': return <CertificateModule settings={settings} students={students} staff={staff} />;
      case 'credentials': return <CredentialRegistry students={students} staff={staff} />;
      case 'settings': return <SettingsView settings={settings} onUpdate={setSettings} />;
      default: return (
        <Dashboard 
          notices={notices} 
          students={students} 
          staff={staff} 
          transportRoutes={transportRoutes} 
          exams={exams} 
          donations={donations}
          feeRecords={feeRecords}
        />
      );
    }
  };

  if (!isAuthenticated) {
    return <AuthModule onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar active={activeTab} onSelect={(item) => { setActiveTab(item); setShowAddForm(false); }} userRole={userRole} />
      <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
        <div className="p-8 flex justify-between items-center border-b border-slate-100 bg-white sticky top-0 z-[40]">
           <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: COLORS.primary }}></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Authenticated Terminal</p>
                <h2 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">Active: {userRole} ({userRole === 'Teacher' ? activeTeacher.name : (userRole === 'Librarian' ? 'Lead Librarian' : (userRole === 'Accountant' ? 'Head of Accounts' : (userRole === 'Receptionist' ? 'Front Desk Exec' : (userRole === 'Parent' ? `Guardian of ${activeStudent.name}` : 'Administrator'))))})</h2>
              </div>
           </div>
           <button onClick={() => setIsAuthenticated(false)} className="px-6 py-2 bg-slate-50 text-slate-400 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">Terminate Session</button>
        </div>
        <div className="max-w-[1400px] mx-auto p-10 print:p-0">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;
