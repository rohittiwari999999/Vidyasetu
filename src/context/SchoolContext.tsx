import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Homework,
  HomeworkSubmission,
  BroadcastMessage,
  LiveClassSession,
  FeeRecord,
  ExamReport,
  UserRole,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_HOMEWORK,
  INITIAL_SUBMISSIONS,
  INITIAL_BROADCASTS,
  INITIAL_LIVE_CLASSES,
  INITIAL_FEE_RECORDS,
  INITIAL_EXAM_REPORTS,
  SAMPLE_STUDENTS_CLASS_10A,
} from '../data/mockData';
import confetti from 'canvas-confetti';

export type AppViewMode = 'dual' | 'management' | 'student' | 'flutter-hub';

export interface PushNotificationEvent {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  category: 'broadcast' | 'homework' | 'approval' | 'fee' | 'live_class';
  targetRole?: UserRole | 'all';
}

interface SchoolContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  
  // Approvals
  pendingStudents: UserProfile[];
  approveStudent: (userId: string, rollNumber: string, admissionNumber: string, section?: string) => void;
  rejectStudent: (userId: string, reason: string) => void;
  registerNewStudent: (data: {
    name: string;
    email: string;
    phone: string;
    grade: string;
    parentName: string;
    parentPhone: string;
    address: string;
    dob?: string;
  }) => UserProfile;

  // Homework
  homeworkList: Homework[];
  submissions: HomeworkSubmission[];
  addHomework: (hw: Omit<Homework, 'id' | 'createdAt'>) => void;
  submitHomework: (sub: Omit<HomeworkSubmission, 'id' | 'submittedAt'>) => void;
  gradeSubmission: (submissionId: string, marks: number, feedback: string) => void;

  // Broadcasts
  broadcasts: BroadcastMessage[];
  addBroadcast: (bc: Omit<BroadcastMessage, 'id' | 'timestamp' | 'readByCount'>) => void;

  // Attendance
  attendanceMap: Record<string, 'present' | 'absent' | 'late' | 'leave'>;
  updateAttendance: (studentId: string, status: 'present' | 'absent' | 'late' | 'leave') => void;
  saveBulkAttendance: () => void;

  // Fees
  feeRecords: FeeRecord[];
  payFee: (feeId: string, mode: 'UPI' | 'NetBanking' | 'Cash' | 'Cheque') => void;

  // Live Class
  liveClasses: LiveClassSession[];
  activeLiveClassModal: LiveClassSession | null;
  setActiveLiveClassModal: (session: LiveClassSession | null) => void;
  startLiveClass: (title: string, subject: string, classId: string) => void;

  // Exam Reports
  examReports: ExamReport[];

  // Push Notifications simulation
  activePushNotification: PushNotificationEvent | null;
  clearPushNotification: () => void;
  showSimulatedPush: (title: string, body: string, category: PushNotificationEvent['category']) => void;

  // Quick switch role
  switchRole: (role: UserRole, specificUserId?: string) => void;
  resetToDefaults: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'vidyasetu_v1_';

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    // Default to Teacher Mrs. Meenakshi Sharma to showcase class teacher view immediately
    return users.find((u) => u.id === 'user-teacher-1') || users[0];
  });

  const [viewMode, setViewMode] = useState<AppViewMode>('dual');

  const [homeworkList, setHomeworkList] = useState<Homework[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'homework');
    return saved ? JSON.parse(saved) : INITIAL_HOMEWORK;
  });

  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'broadcasts');
    return saved ? JSON.parse(saved) : INITIAL_BROADCASTS;
  });

  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'fees');
    return saved ? JSON.parse(saved) : INITIAL_FEE_RECORDS;
  });

  const [liveClasses, setLiveClasses] = useState<LiveClassSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'live_classes');
    return saved ? JSON.parse(saved) : INITIAL_LIVE_CLASSES;
  });

  const [examReports] = useState<ExamReport[]>(INITIAL_EXAM_REPORTS);

  // Daily attendance state for Class 10-A
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'late' | 'leave'>>(() => {
    const initial: Record<string, 'present' | 'absent' | 'late' | 'leave'> = {};
    SAMPLE_STUDENTS_CLASS_10A.forEach((s) => {
      initial[s.id] = s.status;
    });
    return initial;
  });

  const [activeLiveClassModal, setActiveLiveClassModal] = useState<LiveClassSession | null>(null);
  const [activePushNotification, setActivePushNotification] = useState<PushNotificationEvent | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'homework', JSON.stringify(homeworkList));
  }, [homeworkList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'broadcasts', JSON.stringify(broadcasts));
  }, [broadcasts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'fees', JSON.stringify(feeRecords));
  }, [feeRecords]);

  // Keep currentUser synced if user list changes
  useEffect(() => {
    const found = users.find((u) => u.id === currentUser.id);
    if (found) {
      setCurrentUser(found);
    }
  }, [users]);

  const showSimulatedPush = (title: string, body: string, category: PushNotificationEvent['category']) => {
    const notif: PushNotificationEvent = {
      id: 'notif-' + Date.now(),
      title,
      body,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category,
    };
    setActivePushNotification(notif);
    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setActivePushNotification((prev) => (prev?.id === notif.id ? null : prev));
    }, 6000);
  };

  const clearPushNotification = () => {
    setActivePushNotification(null);
  };

  // Pending students list
  const pendingStudents = users.filter((u) => u.role === 'student' && u.status === 'pending');

  const approveStudent = (userId: string, rollNumber: string, admissionNumber: string, section: string = 'A') => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated: UserProfile = {
            ...u,
            status: 'approved',
            studentDetails: {
              ...(u.studentDetails || {
                studentId: 'STU-' + Math.floor(1000 + Math.random() * 9000),
                grade: 'Class 10-A',
                parentName: 'Guardian',
                parentPhone: '+91 98000 00000',
              }),
              studentId: u.studentDetails?.studentId || 'STU-' + Math.floor(1000 + Math.random() * 9000),
              rollNumber,
              admissionNumber,
              section,
            },
          };
          return updated;
        }
        return u;
      })
    );

    const approvedUser = users.find((u) => u.id === userId);
    showSimulatedPush(
      'Admission Approved! 🎉',
      `${approvedUser?.name || 'Student'} has been verified for ${approvedUser?.studentDetails?.grade || 'Class'} with Roll No. ${rollNumber}. Access granted to Student App!`,
      'approval'
    );

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  const rejectStudent = (userId: string, reason: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'rejected', rejectionReason: reason } : u))
    );
    showSimulatedPush(
      'Application Update',
      `Student registration rejected. Reason: "${reason}". Notification sent to parent.`,
      'approval'
    );
  };

  const registerNewStudent = (data: {
    name: string;
    email: string;
    phone: string;
    grade: string;
    parentName: string;
    parentPhone: string;
    address: string;
    dob?: string;
  }) => {
    const newId = 'user-student-' + Date.now();
    const newUser: UserProfile = {
      id: newId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'student',
      schoolId: 'DPS-DEL-01',
      schoolName: 'Delhi Modern Academy, New Delhi',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150&auto=format&fit=crop&q=80`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      studentDetails: {
        studentId: '',
        admissionNumber: 'PENDING_APPROVAL',
        grade: data.grade,
        parentName: data.parentName,
        parentPhone: data.parentPhone,
        address: data.address,
        dob: data.dob,
      },
    };

    setUsers((prev) => [newUser, ...prev]);

    showSimulatedPush(
      'New Student Registration 📝',
      `${data.name} signed up for ${data.grade}. Awaiting verification in Management App Pending Approvals.`,
      'approval'
    );

    return newUser;
  };

  const addHomework = (hw: Omit<Homework, 'id' | 'createdAt'>) => {
    const newHw: Homework = {
      ...hw,
      id: 'hw-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setHomeworkList((prev) => [newHw, ...prev]);
    showSimulatedPush(
      `New Homework: ${hw.subject} 📚`,
      `${hw.title} assigned to ${hw.classId} by ${hw.teacherName}. Due: ${hw.dueDate}`,
      'homework'
    );
  };

  const submitHomework = (sub: Omit<HomeworkSubmission, 'id' | 'submittedAt'>) => {
    const newSub: HomeworkSubmission = {
      ...sub,
      id: 'sub-' + Date.now(),
      submittedAt: new Date().toISOString(),
    };
    setSubmissions((prev) => {
      // replace if existing submission for same student and homework
      const filtered = prev.filter((s) => !(s.homeworkId === sub.homeworkId && s.studentId === sub.studentId));
      return [newSub, ...filtered];
    });

    showSimulatedPush(
      'Homework Submitted 🚀',
      `${sub.studentName} (Roll ${sub.studentRoll}) uploaded assignment solution for review.`,
      'homework'
    );

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // safe fallback
    }
  };

  const gradeSubmission = (submissionId: string, marks: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, marksObtained: marks, feedback, status: 'graded' } : s))
    );
    showSimulatedPush(
      'Assignment Graded ✍️',
      `Feedback and ${marks} marks awarded to submission.`,
      'homework'
    );
  };

  const addBroadcast = (bc: Omit<BroadcastMessage, 'id' | 'timestamp' | 'readByCount'>) => {
    const newBc: BroadcastMessage = {
      ...bc,
      id: 'bc-' + Date.now(),
      timestamp: new Date().toISOString(),
      readByCount: 1,
    };
    setBroadcasts((prev) => [newBc, ...prev]);
    showSimulatedPush(
      `📢 ${bc.category.toUpperCase()}: ${bc.title}`,
      bc.message.length > 80 ? bc.message.slice(0, 80) + '...' : bc.message,
      'broadcast'
    );
  };

  const updateAttendance = (studentId: string, status: 'present' | 'absent' | 'late' | 'leave') => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const saveBulkAttendance = () => {
    const total = Object.keys(attendanceMap).length;
    const presentCount = Object.values(attendanceMap).filter((s) => s === 'present').length;
    showSimulatedPush(
      'Attendance Submitted 📋',
      `Class 10-A daily roll call locked. ${presentCount}/${total} students present (${Math.round((presentCount / total) * 100)}%). SMS alerts queued for absentees.`,
      'approval'
    );
  };

  const payFee = (feeId: string, mode: 'UPI' | 'NetBanking' | 'Cash' | 'Cheque') => {
    const receiptNum = 'DMA/REC/2026/' + Math.floor(1000 + Math.random() * 9000);
    const txnId = 'TXN-' + mode + '-' + Math.floor(10000000 + Math.random() * 90000000);
    setFeeRecords((prev) =>
      prev.map((f) => {
        if (f.id === feeId) {
          return {
            ...f,
            paymentStatus: 'paid',
            paidAmount: f.totalAmount,
            mode,
            receiptNumber: receiptNum,
            transactionId: txnId,
            paymentDate: new Date().toISOString().split('T')[0],
          };
        }
        return f;
      })
    );

    showSimulatedPush(
      'Fee Payment Successful 🧾',
      `Payment received. Receipt #${receiptNum} generated. Sent to registered parent WhatsApp & Email.`,
      'fee'
    );

    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {
      // safe fallback
    }
  };

  const startLiveClass = (title: string, subject: string, classId: string) => {
    const roomCode = `DMA-${classId.replace(/\s+/g, '').toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const newSession: LiveClassSession = {
      id: 'live-' + Date.now(),
      title,
      subject,
      classId,
      teacherName: currentUser.name,
      startTime: 'Just Started (Live Now)',
      durationMinutes: 45,
      status: 'live',
      roomCode,
      platform: 'Jitsi Meet',
      participantsCount: 1,
    };

    setLiveClasses((prev) => [newSession, ...prev]);
    setActiveLiveClassModal(newSession);

    showSimulatedPush(
      `Live Class Started! 🎥`,
      `${currentUser.name} started live class "${title}". Students of ${classId} can join now.`,
      'live_class'
    );
  };

  const switchRole = (role: UserRole, specificUserId?: string) => {
    if (specificUserId) {
      const match = users.find((u) => u.id === specificUserId);
      if (match) {
        setCurrentUser(match);
        return;
      }
    }
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
    }
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'users');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'homework');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'submissions');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'broadcasts');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'fees');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'live_classes');
    setUsers(INITIAL_USERS);
    setHomeworkList(INITIAL_HOMEWORK);
    setSubmissions(INITIAL_SUBMISSIONS);
    setBroadcasts(INITIAL_BROADCASTS);
    setFeeRecords(INITIAL_FEE_RECORDS);
    setLiveClasses(INITIAL_LIVE_CLASSES);
    setCurrentUser(INITIAL_USERS[2]); // Mrs. Meenakshi Sharma
    showSimulatedPush('System Reset', 'All demo data restored to initial Indian school state.', 'approval');
  };

  return (
    <SchoolContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        viewMode,
        setViewMode,
        pendingStudents,
        approveStudent,
        rejectStudent,
        registerNewStudent,
        homeworkList,
        submissions,
        addHomework,
        submitHomework,
        gradeSubmission,
        broadcasts,
        addBroadcast,
        attendanceMap,
        updateAttendance,
        saveBulkAttendance,
        feeRecords,
        payFee,
        liveClasses,
        activeLiveClassModal,
        setActiveLiveClassModal,
        startLiveClass,
        examReports,
        activePushNotification,
        clearPushNotification,
        showSimulatedPush,
        switchRole,
        resetToDefaults,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
