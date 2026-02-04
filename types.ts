
export type Gender = 'Male' | 'Female' | 'Other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';
export type StaffRole = 'Principal' | 'Coordinator' | 'Teacher' | 'Non-Teaching Staff' | 'Accountant' | 'Librarian' | 'Director' | 'Admin';
export type Category = 'General' | 'OBC' | 'SC' | 'ST' | 'Others';
export type Religion = 'Hindu' | 'Islam' | 'Sikh' | 'Christian' | 'Jain' | 'Jews' | 'Buddhism' | 'Zorastians' | 'Other';

export interface PlannerEvent {
  id: string;
  type: 'Holiday' | 'Examination' | 'Event' | 'Result' | 'PTM' | 'Regular';
  title: string;
}

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
  password?: string;
  
  // Demographics
  caste?: string;
  category?: Category;
  religion?: Religion;
  otherReligion?: string;
  
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
  transportRouteId?: string;
  hostelId?: string;
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
  assignedGrade?: string;
  assignedSection?: string;
  isClassTeacher?: boolean;
}

// ASSET MANAGEMENT TYPES
export type AssetCategory = 'Electronics' | 'Furniture' | 'Stationery' | 'Sports' | 'Lab Equipment' | 'Vehicles' | 'Other';
export type AssetStatus = 'Operational' | 'Distributed' | 'Maintenance' | 'Damaged' | 'Disposed';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  purchaseDate: string;
  cost: number;
  serialNumber?: string;
  location: string;
  status: AssetStatus;
  description: string;
}

export interface AssetAssignment {
  id: string;
  assetId: string;
  assetName: string;
  assignedToId: string; // Staff or Student ID
  assignedToName: string;
  assignedDate: string;
  returnDate?: string;
  conditionOnIssue: string;
}

export interface AssetVerificationResult {
  id: string;
  verificationDate: string;
  verifiedBy: string;
  assetsTotal: number;
  assetsFound: number;
  assetsMissing: number;
  remarks: string;
}

// ACCOUNTING TYPES
export type TransactionType = 'Income' | 'Expense';
export type PaymentMethod = 'Cash' | 'Bank' | 'Cheque' | 'UPI';

export interface FinancialTransaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string; // e.g., 'Fees', 'Salary', 'Maintenance', 'Purchase'
  amount: number;
  method: PaymentMethod;
  description: string;
  referenceId?: string; // ID of the fee receipt or payroll record
}

export interface FeeType {
  id: string;
  name: string;
  description: string;
}

export interface FeeGroup {
  id: string;
  name: string;
  description: string;
}

export interface FeeMaster {
  id: string;
  feeTypeId: string;
  feeGroupId: string;
  amount: number;
  dueDate: string;
  grade: string; // Applicable to
}

export interface FeeHead {
  id: string;
  name: string;
  amount: number;
  grade: string; // 'All' or specific grade
}

export interface FeeReceipt {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  amountPaid: number;
  discount: number;
  discountReason?: string;
  penalty: number;
  penaltyReason?: string;
  paymentDate: string;
  paymentMethod: 'Cash' | 'Online' | 'Cheque' | 'UPI';
  session: string;
  description: string;
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

export type NavItem = 'dashboard' | 'notices' | 'students' | 'staff' | 'academic' | 'attendance' | 'examination' | 'fees' | 'payroll' | 'assets' | 'accounts' | 'library' | 'labs' | 'activities' | 'transport' | 'hostel' | 'donations' | 'alumni' | 'certificates' | 'credentials' | 'settings' | 'teacher_profile' | 'teacher_students' | 'teacher_attendance' | 'teacher_academics' | 'teacher_messages' | 'teacher_self_service' | 'teacher_homework' | 'parent_portal' | 'financial_report';

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

export interface AppSettings {
  schoolName: string;
  branchName: string;
}

export interface TransportRoute {
  id: string;
  name: string;
  stops: string[];
  distanceKm: number;
  ratePerKm: number;
}

export interface LessonPlan {
  id: string;
  grade: string;
  subject: string;
  chapterNo: string;
  chapterTitle: string;
  lessonsCount: number;
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
  status: 'Available' | 'Issued';
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
  serialNumber?: string;
  status: 'Functional' | 'Damaged' | 'Maintenance';
}

export interface DamageReport {
  id: string;
  itemId: string;
  itemName: string;
  labType: string;
  reason: string;
  reportedBy: string;
  reportedDate: string;
}

export interface ProcurementOrder {
  id: string;
  itemName: string;
  labType: string;
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
  condition: 'Excellent' | 'Good' | 'Fair' | 'Damaged';
  lastMaintenanceDate: string;
}

export interface TransportVehicle {
  id: string;
  busNumber: string;
  capacity: number;
  status: 'Active' | 'Maintenance' | 'Inactive';
}

export interface TransportPersonnel {
  id: string;
  name: string;
  phone: string;
  bloodGroup: BloodGroup;
  role: 'Driver' | 'Conductor';
  licenseNumber?: string;
}

export interface TransportAssignment {
  id: string;
  vehicleId: string;
  routeId: string;
  driverId: string;
  conductorId: string;
  status: 'In Transit' | 'Parked';
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
  status: 'Active' | 'Completed' | 'Paused';
  startDate: string;
}

export interface StudentAttendance {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  grade: string;
  section: string;
  subject?: string;
}

export interface StaffAttendance {
  id: string;
  staffId: string;
  date: string;
  status: AttendanceStatus;
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
  feeStatus: 'Paid' | 'Pending' | 'Partial';
}

export interface HostelLeave {
  id: string;
  studentId: string;
  departureDate: string;
  expectedReturn: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Returned';
}

export type FeeCategory = 'Tuition' | 'Transport' | 'Hostel' | 'Library' | 'Lab' | 'Activity' | 'Other';
export type AcademicWing = 'Foundation' | 'Primary' | 'Middle' | 'Senior';

export interface FeeStructure {
  id: string;
  wing: AcademicWing;
  grade: string;
  category: FeeCategory;
  amount: number;
  period: 'Monthly' | 'Quarterly' | 'Annual';
}

export interface SalaryStructure {
  id: string;
  role: StaffRole;
  basePay: number;
  hra: number;
  da: number;
  specialAllowance: number;
  paidLeaveLimit: number;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: 'Sick' | 'Casual' | 'Annual' | 'Personal';
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  month: string;
  basePay: number;
  allowances: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  generatedDate: string;
  status: 'Paid' | 'Pending';
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  grade: string;
  promotionStatus: 'Promoted' | 'Detained' | 'Pending';
  isPublished: boolean;
  englishComm?: string;
  hindiComm?: string;
  viva?: number;
  sports?: string;
  library?: string;
  handwritingEng?: string;
  handwritingHindi?: string;
  activities?: string;
  teacherRemarks?: string;
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
  status: 'Pending' | 'Checked';
  marks?: number;
  feedback?: string;
  fileUrl?: string;
}

export interface StudentLeaveRequest {
  id: string;
  studentId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}
