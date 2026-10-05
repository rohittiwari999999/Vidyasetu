export type UserRole = 'manager' | 'principal' | 'teacher' | 'student' | 'parent';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface StudentDetails {
  studentId: string;
  admissionNumber: string; // e.g., "DPS-2026/842"
  rollNumber?: string;
  grade: string; // e.g., "Class 10-A", "Playgroup", "UKG"
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  bloodGroup?: string;
  dob?: string;
  address?: string;
  section?: string;
}

export interface TeacherDetails {
  employeeId: string;
  designation: string;
  assignedClass?: string; // Class Teacher of "Class 10-A"
  subjects: string[];
  qualifications: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  schoolId: string;
  schoolName: string;
  avatar?: string;
  status: ApprovalStatus;
  rejectionReason?: string;
  studentDetails?: StudentDetails;
  teacherDetails?: TeacherDetails;
  createdAt: string;
  deviceTokens?: string[]; // for FCM
}

export interface HomeworkAttachment {
  name: string;
  url: string;
  size: string;
  type: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  classId: string; // e.g. "Class 10-A"
  subject: string;
  teacherId: string;
  teacherName: string;
  dueDate: string;
  createdAt: string;
  attachments?: HomeworkAttachment[];
  maxMarks: number;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  submittedAt: string;
  notes: string;
  files: { name: string; size: string }[];
  status: 'submitted' | 'graded' | 'resubmit_required';
  marksObtained?: number;
  feedback?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  remarks?: string;
}

export interface BroadcastMessage {
  id: string;
  title: string;
  message: string;
  category: 'urgent' | 'holiday' | 'event' | 'circular' | 'exam';
  targetAudience: 'all' | 'students' | 'parents' | 'teachers' | 'class';
  targetClass?: string;
  senderName: string;
  senderRole: string;
  timestamp: string;
  priority: 'high' | 'normal' | 'emergency';
  readByCount?: number;
}

export interface LiveClassSession {
  id: string;
  title: string;
  subject: string;
  classId: string;
  teacherName: string;
  startTime: string;
  durationMinutes: number;
  status: 'scheduled' | 'live' | 'ended';
  roomCode: string;
  platform: 'Jitsi Meet' | 'WebRTC Direct';
  participantsCount: number;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  rollNo: string;
  term: string; // e.g., "Quarter 1 (Apr - Jun 2026)"
  tuitionFee: number;
  transportFee: number;
  examFee: number;
  labFee: number;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  paymentStatus: 'paid' | 'partial' | 'pending' | 'overdue';
  transactionId?: string;
  paymentDate?: string;
  receiptNumber?: string;
  mode?: 'UPI' | 'NetBanking' | 'Cash' | 'Cheque';
}

export interface ExamSubjectMark {
  name: string;
  maxMarks: number;
  marksObtained: number;
  grade: string;
}

export interface ExamReport {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  classId: string;
  examName: string;
  academicYear: string;
  subjects: ExamSubjectMark[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  overallGrade: string;
  rankInClass: number;
  teacherRemarks: string;
  attendancePercentage: number;
}

export interface TimetableSlot {
  period: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}
