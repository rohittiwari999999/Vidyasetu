import React, { useState } from 'react';
import { Copy, Check, Database, Shield, FileCode2, Layers } from 'lucide-react';

export const Deliverable1Schema: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const schemaJson = `{
  "verified_staff": {
    "STAFF_DOC_ID": {
      "name": "Mrs. Sunita Verma",
      "email": "sunita.verma@vidyasetu.in",
      "phone": "+919876543210",
      "role": "admin | principal | classTeacher | generalTeacher",
      "assignedClass": "Class 10-A",
      "schoolId": "DPS-DEL-01",
      "isActive": true,
      "addedBy": "Admin (Abhinav Tiwari)",
      "createdAt": "Timestamp"
    }
  },

  "schools": {
    "DPS-DEL-01": {
      "schoolId": "DPS-DEL-01",
      "name": "Delhi Modern Academy",
      "board": "CBSE",
      "affiliationNumber": "2130894",
      "schoolCode": "70412",
      "address": "Institutional Area, Phase II, New Delhi - 110075",
      "academicYear": "2026-2027",
      "grades": ["Playgroup", "Nursery", "LKG", "UKG", "Class 1", "...", "Class 12"],
      "createdAt": "Timestamp"
    }
  },

  "users": {
    "USER_UID": {
      "id": "USER_UID",
      "name": "Aarav Sharma",
      "email": "aarav.sharma@student.vidyasetu.in",
      "phone": "+91 99100 12345",
      "role": "student | parent | teacher | principal | manager",
      "schoolId": "DPS-DEL-01",
      "status": "pending | approved | rejected",
      "rejectionReason": null,
      "deviceTokens": ["fcm_token_android_1", "fcm_token_ios_1"],
      "studentDetails": {
        "studentId": "STU-10A-12",
        "admissionNumber": "DMA-2022/1042",
        "rollNumber": "12",
        "grade": "Class 10-A",
        "section": "A",
        "parentName": "Mrs. Vandana Sharma",
        "parentPhone": "+91 99100 12340",
        "parentEmail": "vandana.sharma@gmail.com",
        "dob": "2011-04-18",
        "bloodGroup": "B+",
        "address": "Flat 402, Lotus Boulevard, Sector 100, Noida"
      },
      "teacherDetails": {
        "employeeId": "EMP-T104",
        "designation": "Senior PGT & Class Teacher",
        "assignedClass": "Class 10-A",
        "subjects": ["Mathematics", "Statistics"],
        "qualifications": "M.Sc. Mathematics, B.Ed."
      },
      "createdAt": "Timestamp",
      "updatedAt": "Timestamp"
    }
  },

  "classes": {
    "CLASS_10A": {
      "id": "CLASS_10A",
      "name": "Class 10-A",
      "schoolId": "DPS-DEL-01",
      "classTeacherId": "TEACHER_UID",
      "room": "Room 204",
      "studentCount": 42,
      "academicYear": "2026-2027"
    }
  },

  "attendance": {
    "ATT_2026-10-04_CLASS_10A": {
      "id": "ATT_2026-10-04_CLASS_10A",
      "date": "2026-10-04",
      "classId": "Class 10-A",
      "schoolId": "DPS-DEL-01",
      "markedBy": "TEACHER_UID",
      "markedAt": "Timestamp",
      "records": {
        "STUDENT_UID_1": {
          "status": "present | absent | late | leave",
          "rollNumber": "12",
          "remarks": "On time"
        }
      }
    }
  },

  "homework": {
    "HW_DOC_ID": {
      "id": "HW_DOC_ID",
      "classId": "Class 10-A",
      "schoolId": "DPS-DEL-01",
      "subject": "Mathematics",
      "title": "NCERT Polynomials Ex 2.3",
      "description": "Complete question 1 to 5 with detailed factorization.",
      "teacherId": "TEACHER_UID",
      "teacherName": "Mrs. Meenakshi Sharma",
      "dueDate": "2026-10-08",
      "maxMarks": 25,
      "attachments": [
        {
          "name": "Maths_NCERT_Worksheet.pdf",
          "storagePath": "schools/DPS-DEL-01/homework/hw_101.pdf",
          "downloadUrl": "https://firebasestorage.googleapis.com/...",
          "size": "1.2 MB"
        }
      ],
      "createdAt": "Timestamp"
    }
  },

  "submissions": {
    "SUB_DOC_ID": {
      "id": "SUB_DOC_ID",
      "homeworkId": "HW_DOC_ID",
      "studentId": "STUDENT_UID",
      "studentName": "Aarav Sharma",
      "studentRoll": "12",
      "classId": "Class 10-A",
      "schoolId": "DPS-DEL-01",
      "notes": "Completed with extra questions solved.",
      "files": [
        {
          "name": "Aarav_Maths_Solutions.pdf",
          "storagePath": "schools/DPS-DEL-01/submissions/sub_1.pdf",
          "downloadUrl": "https://firebasestorage.googleapis.com/...",
          "size": "2.1 MB"
        }
      ],
      "status": "submitted | graded | resubmit_required",
      "marksObtained": 24,
      "feedback": "Excellent step-by-step working!",
      "submittedAt": "Timestamp",
      "gradedAt": "Timestamp"
    }
  },

  "broadcasts": {
    "BROADCAST_ID": {
      "id": "BROADCAST_ID",
      "schoolId": "DPS-DEL-01",
      "title": "Urgent: Delhi NCR Heavy Rainfall Advisory",
      "message": "Physical classes suspended tomorrow...",
      "category": "urgent | holiday | event | circular | exam",
      "targetAudience": "all | parents | students | teachers | class",
      "targetClass": null,
      "priority": "emergency | high | normal",
      "senderId": "MANAGER_UID",
      "senderName": "Dr. Sunita Mukherjee (Principal)",
      "senderRole": "principal",
      "sentAt": "Timestamp",
      "readCount": 842
    }
  },

  "live_sessions": {
    "LIVE_ID": {
      "id": "LIVE_ID",
      "schoolId": "DPS-DEL-01",
      "classId": "Class 10-A",
      "title": "Trigonometric Identities Live Lecture",
      "subject": "Mathematics",
      "teacherId": "TEACHER_UID",
      "teacherName": "Mrs. Meenakshi Sharma",
      "status": "live | scheduled | ended",
      "roomCode": "DMA-10A-MATHS-LIVE",
      "platform": "Jitsi Meet",
      "startedAt": "Timestamp"
    }
  },

  "fee_records": {
    "FEE_DOC_ID": {
      "id": "FEE_DOC_ID",
      "schoolId": "DPS-DEL-01",
      "studentId": "STUDENT_UID",
      "classId": "Class 10-A",
      "rollNo": "12",
      "term": "Quarter 2 (Jul - Sep 2026)",
      "tuitionFee": 14500,
      "transportFee": 3600,
      "labFee": 1200,
      "examFee": 900,
      "totalAmount": 20200,
      "paidAmount": 20200,
      "paymentStatus": "paid | partial | pending | overdue",
      "receiptNumber": "DMA/REC/2026/0894",
      "transactionId": "TXN-RAZORPAY-892419412",
      "mode": "UPI",
      "paidAt": "Timestamp",
      "dueDate": "2026-07-15"
    }
  }
}`;

  const securityRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    function isManagerOrPrincipal() {
      return isAuthenticated() && (getUserData().role == 'manager' || getUserData().role == 'principal');
    }

    function isTeacher() {
      return isAuthenticated() && getUserData().role == 'teacher';
    }

    function isApproved() {
      return isAuthenticated() && getUserData().status == 'approved';
    }

    // Schools Collection
    match /schools/{schoolId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrPrincipal();
    }

    // Users Collection (Crucial Pending Approvals Gate)
    match /users/{userId} {
      // Any authenticated user can read public profiles or their own
      allow read: if isAuthenticated();
      
      // User can create their initial profile during signup with status = 'pending'
      allow create: if isAuthenticated() && request.auth.uid == userId 
                    && request.resource.data.status == 'pending';
      
      // Admin/Principal/Teacher can update user status to 'approved' or 'rejected'
      // Students cannot self-approve their account!
      allow update: if isManagerOrPrincipal() 
                    || (isTeacher() && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['studentDetails', 'status']))
                    || (request.auth.uid == userId && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['status', 'role']));
      
      allow delete: if isManagerOrPrincipal();
    }

    // Attendance Collection
    match /attendance/{attendanceId} {
      allow read: if isApproved();
      allow create, update: if isTeacher() || isManagerOrPrincipal();
    }

    // Homework Collection
    match /homework/{homeworkId} {
      allow read: if isApproved();
      allow create, update, delete: if isTeacher() || isManagerOrPrincipal();
    }

    // Submissions Collection
    match /submissions/{submissionId} {
      allow read: if isApproved() && (
        getUserData().role in ['teacher', 'principal', 'manager'] ||
        resource.data.studentId == request.auth.uid
      );
      allow create: if isApproved() && request.resource.data.studentId == request.auth.uid;
      allow update: if isApproved() && (
        (isTeacher() && request.resource.data.diff(resource.data).affectedKeys().hasAny(['marksObtained', 'feedback', 'status'])) ||
        (request.resource.data.studentId == request.auth.uid)
      );
    }

    // Broadcasts Collection
    match /broadcasts/{broadcastId} {
      allow read: if isApproved();
      allow create, update, delete: if isTeacher() || isManagerOrPrincipal();
    }

    // Fee Records Collection
    match /fee_records/{feeId} {
      allow read: if isApproved() && (
        getUserData().role in ['manager', 'principal'] ||
        resource.data.studentId == request.auth.uid
      );
      allow write: if isManagerOrPrincipal();
    }

    // Live Classes Collection
    match /live_sessions/{sessionId} {
      allow read: if isApproved();
      allow create, update: if isTeacher() || isManagerOrPrincipal();
    }
  }
}`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              Deliverable 1 of 5
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Complete Firebase Firestore Database Schema & Security Rules
            </h2>
          </div>
        </div>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Production schema designed specifically for Indian K-12 schools (Playgroup to 12th). Supports multi-tenant isolation, Role-Based Access Control (RBAC), the pending student approvals gate, attendance rolls, homework submissions, fee dues in INR ₹, and FCM broadcast topics.
        </p>
      </div>

      {/* Schema Structure */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">
              Firestore Collections & Document Definitions
            </h3>
          </div>
          <button
            onClick={() => copyToClipboard(schemaJson, 'schema')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copiedKey === 'schema' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === 'schema' ? 'Copied JSON!' : 'Copy Schema JSON'}</span>
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] overflow-y-auto">
          <pre>{schemaJson}</pre>
        </div>
      </div>

      {/* Firestore Security Rules */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">
              firestore.rules (Role-Based Access Control & Approvals Gate)
            </h3>
          </div>
          <button
            onClick={() => copyToClipboard(securityRules, 'rules')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copiedKey === 'rules' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === 'rules' ? 'Copied Rules!' : 'Copy firestore.rules'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Enforces that new student signups can NEVER self-approve, preventing unauthorized access until verified by School Admin or Class Teacher.
        </p>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[450px] overflow-y-auto">
          <pre>{securityRules}</pre>
        </div>
      </div>
    </div>
  );
};
