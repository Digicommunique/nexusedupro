
export type Gender = 'Male' | 'Female' | 'Other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';
export type StaffRole = 'Principal' | 'Coordinator' | 'Teacher' | 'Non-Teaching Staff' | 'Accountant' | 'Librarian' | 'Director' | 'Admin';

export interface PersonBase {
  id: string;
  photo?: string;
  name: string;
  gender: Gender;
  dob: string;
  address: string;
  bloodGroup: BloodGroup;
  allergy?: string;
  idDocument?: string;
  password?: string; // System access key
  
  fatherName: string;
  fatherOccupation: string;
  fatherOccupationAddress: string;
  fatherContact: string;
  fatherIdDoc?: string;

  motherName: string;
  motherOccupation: string;
  motherOccupationAddress: string;
  motherContact: string;
  motherIdDoc?: string;

  guardianName: string;
  guardianRelationship: string;
  guardianAddress: string;
  guardianContact: string;
}

export interface Student extends PersonBase {
  studentId: string;
  parentSignature?: string;
  grade: string;
  section: string;
  transportRouteId?: string; // Opt-in Transport
  hostelId?: string; // Opt-in Residential
  selectedActivities?: string[];
  selectedSubjects?: string[];
}

export interface Staff extends PersonBase {
  staffId: string;
  relationshipStatus: string;
  role: StaffRole;
  qualification: string;
  bankName: string;
  ifscCode: string;
  accountNumber: string;
  degreeDoc?: string;
  marksheetDoc?: string;
  highestDegreeDoc?: string;
  joiningDate: string;
  assignedGrade?: string; // For Class Teachers
  assignedSection?: string;
  isClassTeacher?: boolean;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  grade: string;
  section: string;
  subject: string;
  dueDate: string;
  fileUrl?: string;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  fileUrl?: string;
  marks?: number;
  feedback?: string;
  status: 'Pending' | 'Checked' | 'Returned';
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  senderRole: 'Principal' | 'Admin' | 'Director';
  senderName: string;
  date: string;
  targetAudience: ('Teacher' | 'Non-Teaching Staff' | 'Parent' | 'Public')[];
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  attachmentUrl?: string;
}

export interface SalaryStructure {
  id: string;
  role: StaffRole;
  basePay: number;
  hra: number;
  da: number;
  specialAllowance: number;
  paidLeaveLimit: number; // monthly
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: 'Sick' | 'Casual' | 'Personal';
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface StudentLeaveRequest {
  id: string;
  studentId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  month: string; // e.g., "March 2025"
  basePay: number;
  allowances: number;
  bonus: number; // increment/promotion bonus
  deductions: number; // leave based or other
  netSalary: number;
  generatedDate: string;
  status: 'Draft' | 'Paid';
}

export interface Alumni extends PersonBase {
  alumniId: string;
  graduationYear: string;
  currentProfession: string;
  currentOrganization: string;
  higherEducation?: string;
  linkedInUrl?: string;
}

export interface AlumniGroup {
  id: string;
  name: string;
  description: string;
  category: 'Batch' | 'Professional' | 'Interest';
  memberCount: number;
}

export interface AlumniMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface Hostel {
  id: string;
  name: string;
  type: 'Boys' | 'Girls' | 'Mixed';
  capacity: number;
  wardenId: string;
}

export interface HostelRoom {
  id: string;
  hostelId: string;
  roomNo: string;
  capacity: number;
  occupied: number;
  monthlyFee: number;
}

export interface HostelAllotment {
  id: string;
  studentId: string;
  studentName: string;
  hostelId: string;
  roomId: string;
  allotmentDate: string;
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
}

export interface FeeCategory {
  id: string;
  name: string;
  type: 'Recurring' | 'One-Time';
  mandatory: boolean;
}

export interface FeeStructure {
  id: string;
  wing: AcademicWing;
  grade: Grade;
  categoryName: string;
  amount: number;
}

export interface StudentFeeRecord {
  id: string;
  studentId: string;
  totalAmount: number;
  discount: number;
  discountReason?: string;
  paidAmount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Partial' | 'Overdue';
}

export interface HostelLeave {
  id: string;
  studentId: string;
  departureDate: string;
  expectedReturn: string;
  reason: string;
  status: 'Approved' | 'Returned' | 'Pending';
}

export interface AppSettings {
  schoolName: string;
  branchName: string;
}

export type AcademicWing = 'Foundation' | 'Primary' | 'Middle' | 'Senior';
export type Grade = string;
export type Section = 'A' | 'B' | 'C' | 'D' | 'E';

export interface LessonPlan {
  id: string;
  grade: Grade;
  subject: string;
  chapterNo: string;
  chapterTitle: string;
  lessonsCount: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface StudentAttendance extends AttendanceRecord {
  studentId: string;
  grade: string;
  section: string;
  subject?: string;
}

export interface StaffAttendance extends AttendanceRecord {
  staffId: string;
}

export interface Examination {
  id: string;
  title: string;
  grade: string;
  section: string;
  subject: string;
  date: string;
  totalMarks: number;
  paperUrl?: string;
  isResultDeclared: boolean;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  grade: string;
  answerCopyUrl?: string;
  teacherRemarks?: string;
  englishComm?: string;
  hindiComm?: string;
  sports?: string;
  library?: string;
  viva?: number;
  handwritingEng?: string;
  handwritingHindi?: string;
  activities?: string;
  promotionStatus?: 'Promoted' | 'Detained' | 'Pending';
  isPublished?: boolean;
}

export type LibraryItemType = 'Book' | 'Journal' | 'Magazine' | 'Newspaper';

export interface LibraryItem {
  id: string;
  type: LibraryItemType;
  title: string;
  author: string;
  publisher: string;
  subject: string;
  grade: string;
  rackId: string;
  shelfId: string;
  barcode: string;
  status: 'Available' | 'Issued' | 'Lost' | 'Damaged';
  registeredDate: string;
}

export interface IssuedBook {
  id: string;
  itemId: string;
  personId: string;
  personName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  reissueCount: number;
  lateFee: number;
  damageFee: number;
}

export interface Rack {
  id: string;
  name: string;
  shelves: string[];
}

export type LabType = 'Computer' | 'Physics' | 'Chemistry' | 'Biology' | 'General Science';
export type LabItemCategory = 'Equipment' | 'Chemical' | 'Computer System' | 'Consumable';

export interface LabItem {
  id: string;
  labType: LabType;
  category: LabItemCategory;
  name: string;
  vendor: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  status: 'Functional' | 'Maintenance' | 'Damaged' | 'Expired';
  serialNumber?: string;
}

export interface DamageReport {
  id: string;
  itemId: string;
  itemName: string;
  labType: LabType | ActivityRoomType;
  reason: string;
  reportedBy: string;
  reportedDate: string;
  actionTaken?: string;
  studentId?: string; // Linked for penalty tracking
  penaltyAmount?: number;
}

export interface ProcurementOrder {
  id: string;
  itemName: string;
  labType: LabType | ActivityRoomType;
  quantity: number;
  unit: string;
  vendorName: string;
  estimatedCost: number;
  status: 'Pending' | 'Approved' | 'Ordered' | 'Received';
  orderDate: string;
}

export type ActivityRoomType = 'Dance' | 'Music' | 'Sports' | 'Theatre' | 'Equipment Room' | 'Swimming Pool' | 'Gym';

export interface ActivityAsset {
  id: string;
  roomType: ActivityRoomType;
  name: string;
  vendor: string;
  quantity: number;
  unit: string;
  condition: 'Excellent' | 'Good' | 'Needs Repair' | 'Damaged';
  lastMaintenanceDate: string;
}

export interface TransportVehicle {
  id: string;
  busNumber: string;
  capacity: number;
  status: 'Active' | 'Maintenance' | 'Retired';
}

export interface TransportPersonnel {
  id: string;
  name: string;
  phone: string;
  bloodGroup: BloodGroup;
  role: 'Driver' | 'Conductor';
  licenseNumber?: string;
}

export interface TransportRoute {
  id: string;
  name: string;
  stops: string[];
  distanceKm: number;
  ratePerKm: number;
}

export interface TransportAssignment {
  id: string;
  vehicleId: string;
  routeId: string;
  driverId: string;
  conductorId: string;
  status: 'In Transit' | 'Parked' | 'Emergency';
}

export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  type: 'Monetary' | 'Items' | 'Mixed';
  targetAmount?: number;
  currentAmount: number;
  targetItems?: { type: string; quantity: number }[];
  currentItems: { type: string; quantity: number }[];
  status: 'Active' | 'Completed';
  startDate: string;
}

export interface Donation {
  id: string;
  campaignId: string;
  donorName: string;
  donorAddress: string;
  donorPhone: string;
  donorEmail: string;
  purpose: string;
  amount?: number;
  items?: { type: string; quantity: number }[];
  date: string;
}

export type NavItem = 'dashboard' | 'notices' | 'students' | 'staff' | 'academic' | 'attendance' | 'examination' | 'fees' | 'payroll' | 'library' | 'labs' | 'activities' | 'transport' | 'hostel' | 'donations' | 'alumni' | 'certificates' | 'credentials' | 'settings' | 'teacher_profile' | 'teacher_students' | 'teacher_attendance' | 'teacher_academics' | 'teacher_messages' | 'teacher_self_service' | 'teacher_homework' | 'parent_portal';
