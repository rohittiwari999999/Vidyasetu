import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { FeeRecord } from '../../types';
import { ReceiptModal } from '../common/ReceiptModal';
import {
  CreditCard,
  CheckCircle,
  Clock,
  ShieldCheck,
  FileText,
  IndianRupee,
  Smartphone,
  Building,
} from 'lucide-react';

export const StudentFeeLedger: React.FC = () => {
  const { feeRecords, payFee, currentUser } = useSchool();
  const [selectedReceipt, setSelectedReceipt] = useState<FeeRecord | null>(null);
  const [payingFee, setPayingFee] = useState<FeeRecord | null>(null);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'NetBanking'>('UPI');

  // Filter fees for current student
  const studentFees = feeRecords.filter((f) => f.studentId === currentUser.id);

  const handleConfirmPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingFee) return;
    payFee(payingFee.id, paymentMode);
    setPayingFee(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <CreditCard className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              School Fee Ledger & Digital Receipts
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Student: <strong>{currentUser.name}</strong> • {currentUser.studentDetails?.grade} (Roll #{currentUser.studentDetails?.rollNumber || '12'})
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>RBI Approved Payment Gateway</span>
        </div>
      </div>

      {/* Fee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {studentFees.map((fee) => (
          <div
            key={fee.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700">
                  {fee.term}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                    fee.paymentStatus === 'paid'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {fee.paymentStatus}
                </span>
              </div>

              <div className="text-2xl font-bold font-mono text-white mb-3">
                ₹{fee.totalAmount.toLocaleString('en-IN')}.00
              </div>

              {/* Fee Breakdown */}
              <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1.5 text-slate-300 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tuition & Academic:</span>
                  <span className="font-mono">₹{fee.tuitionFee.toLocaleString('en-IN')}</span>
                </div>
                {fee.transportFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">School Bus Transport:</span>
                    <span className="font-mono">₹{fee.transportFee.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Science & Computer Lab:</span>
                  <span className="font-mono">₹{fee.labFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Examination & Activities:</span>
                  <span className="font-mono">₹{fee.examFee.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              {fee.paymentStatus === 'paid' ? (
                <>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Paid on {fee.paymentDate}
                  </span>
                  <button
                    onClick={() => setSelectedReceipt(fee)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Download Receipt</span>
                  </button>
                </>
              ) : (
                <>
                  <span className="text-[11px] text-amber-400 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Due by {fee.dueDate}
                  </span>
                  <button
                    onClick={() => setPayingFee(fee)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay Online Now</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pay Modal */}
      {payingFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-1">
              Complete Online Fee Payment
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {payingFee.term} • Amount: <strong className="text-emerald-400 font-mono">₹{payingFee.totalAmount.toLocaleString('en-IN')}.00</strong>
            </p>

            <form onSubmit={handleConfirmPay} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label
                  onClick={() => setPaymentMode('UPI')}
                  className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                    paymentMode === 'UPI'
                      ? 'bg-purple-950/40 border-purple-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-purple-400" />
                  <div className="flex-1">
                    <div className="font-bold">Instant UPI (GPay / PhonePe / Paytm / BHIM)</div>
                    <div className="text-[11px] text-slate-400">Zero surcharge • Instant receipt generation</div>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMode('NetBanking')}
                  className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                    paymentMode === 'NetBanking'
                      ? 'bg-purple-950/40 border-purple-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <Building className="w-5 h-5 text-indigo-400" />
                  <div className="flex-1">
                    <div className="font-bold">NetBanking / Credit / Debit Card</div>
                    <div className="text-[11px] text-slate-400">SBI, HDFC, ICICI, Axis, PNB & All Major Banks</div>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPayingFee(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg transition"
                >
                  Confirm Payment (₹{payingFee.totalAmount.toLocaleString('en-IN')})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedReceipt && (
        <ReceiptModal feeRecord={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
};
