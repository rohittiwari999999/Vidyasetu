import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { FeeRecord } from '../../types';
import { INDIAN_CLASSES } from '../../data/mockData';
import { ReceiptModal } from '../common/ReceiptModal';
import {
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Search,
  IndianRupee,
  Download,
} from 'lucide-react';

export const FeeManagementView: React.FC = () => {
  const { feeRecords, payFee } = useSchool();
  const [filterClass, setFilterClass] = useState('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'paid' | 'pending'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<FeeRecord | null>(null);

  const totalCollected = feeRecords
    .filter((f) => f.paymentStatus === 'paid')
    .reduce((acc, curr) => acc + curr.paidAmount, 0);

  const totalPending = feeRecords
    .filter((f) => f.paymentStatus === 'pending')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const filtered = feeRecords.filter((rec) => {
    if (filterClass !== 'All' && rec.classId !== filterClass) return false;
    if (filterStatus !== 'All' && rec.paymentStatus !== filterStatus) return false;
    if (
      searchQuery &&
      !rec.studentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !rec.rollNo.includes(searchQuery)
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Collected (Q3)</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Realtime UPI / NetBanking / Cash
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-400">Pending Dues</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-amber-400/90 mt-1">
            Due date: 15th October 2026
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-400">Collection Velocity</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {Math.round((totalCollected / (totalCollected + totalPending || 1)) * 100)}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Automated WhatsApp reminders sent to parents
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or roll..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="All">All Grades (PG to 12th)</option>
              {INDIAN_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="All">All Payment Status</option>
              <option value="paid">Paid Only</option>
              <option value="pending">Pending Only</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Student & Class</th>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Quarter / Term</th>
                <th className="py-3 px-4 text-right">Tuition</th>
                <th className="py-3 px-4 text-right">Transport</th>
                <th className="py-3 px-4 text-right">Total (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-medium text-white">
                    <div>{rec.studentName}</div>
                    <div className="text-[10px] text-slate-400">{rec.classId}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-300">
                    #{rec.rollNo}
                  </td>
                  <td className="py-3 px-4 text-slate-300">{rec.term}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300">
                    ₹{rec.tuitionFee.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300">
                    ₹{rec.transportFee.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">
                    ₹{rec.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                        rec.paymentStatus === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {rec.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {rec.paymentStatus === 'paid' ? (
                      <button
                        onClick={() => setSelectedReceipt(rec)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-[11px] flex items-center gap-1 ml-auto transition"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Receipt</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => payFee(rec.id, 'Cash')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow transition ml-auto"
                      >
                        Collect Cash
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReceipt && (
        <ReceiptModal feeRecord={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
};
