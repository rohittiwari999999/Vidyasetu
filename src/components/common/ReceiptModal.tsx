import React from 'react';
import { FeeRecord } from '../../types';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  feeRecord: FeeRecord;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ feeRecord, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white text-slate-900 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-300">
        {/* Actions header */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full">
              Official School E-Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* School Header */}
          <div className="text-center border-b border-slate-200 pb-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-900 text-amber-400 flex items-center justify-center font-extrabold text-2xl shadow-md mb-2">
              VS
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-indigo-950 uppercase">
              Delhi Modern Academy
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Affiliated to CBSE, New Delhi • Affiliation No: 2130894 • School Code: 70412
            </p>
            <p className="text-[11px] text-slate-500">
              Institutional Area, Phase II, New Delhi - 110075 | Ph: 011-28084500
            </p>
            <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              FEE PAYMENT ACKNOWLEDGEMENT RECEIPT (PAID)
            </div>
          </div>

          {/* Receipt Meta & Student Info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <p className="text-slate-500">Receipt No:</p>
              <p className="font-bold font-mono text-slate-800 text-sm">{feeRecord.receiptNumber || 'DMA/REC/2026/0894'}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500">Payment Date:</p>
              <p className="font-semibold text-slate-800">{feeRecord.paymentDate || '2026-10-04'}</p>
            </div>
            <div>
              <p className="text-slate-500">Student Name:</p>
              <p className="font-bold text-slate-900 text-sm">{feeRecord.studentName}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500">Class & Section / Roll:</p>
              <p className="font-bold text-slate-800">{feeRecord.classId} (Roll No: {feeRecord.rollNo})</p>
            </div>
            <div>
              <p className="text-slate-500">Fee Term:</p>
              <p className="font-semibold text-indigo-900">{feeRecord.term}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500">Payment Mode / Txn ID:</p>
              <p className="font-medium text-slate-700">{feeRecord.mode || 'UPI / Online'} ({feeRecord.transactionId || 'TXN-9841203'})</p>
            </div>
          </div>

          {/* Fee Itemization Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Particulars / Head</th>
                  <th className="py-2.5 px-4 text-right">Amount (INR ₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="py-2 px-4 font-medium">Tuition & Academic Term Fee</td>
                  <td className="py-2 px-4 text-right font-mono">₹{feeRecord.tuitionFee.toLocaleString('en-IN')}.00</td>
                </tr>
                {feeRecord.transportFee > 0 && (
                  <tr>
                    <td className="py-2 px-4 font-medium">Air-Conditioned Transport Fee (Route B-4)</td>
                    <td className="py-2 px-4 text-right font-mono">₹{feeRecord.transportFee.toLocaleString('en-IN')}.00</td>
                  </tr>
                )}
                <tr>
                  <td className="py-2 px-4 font-medium">Science & Computer Laboratory Development</td>
                  <td className="py-2 px-4 text-right font-mono">₹{feeRecord.labFee.toLocaleString('en-IN')}.00</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium">CBSE Examination & Stationery Charges</td>
                  <td className="py-2 px-4 text-right font-mono">₹{feeRecord.examFee.toLocaleString('en-IN')}.00</td>
                </tr>
              </tbody>
              <tfoot className="bg-indigo-50 font-bold border-t-2 border-indigo-200 text-slate-900">
                <tr>
                  <td className="py-3 px-4 text-indigo-950 font-extrabold text-sm">TOTAL AMOUNT PAID</td>
                  <td className="py-3 px-4 text-right text-indigo-950 font-mono text-base font-extrabold">
                    ₹{feeRecord.paidAmount.toLocaleString('en-IN')}.00
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Verification seal and signature */}
          <div className="pt-2 flex items-center justify-between text-xs border-t border-dashed border-slate-300">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Verified Digitally by VidyaSetu Core Accounts</span>
            </div>
            <div className="text-right">
              <div className="w-24 h-8 mx-auto border-b border-slate-400 mb-1 flex items-center justify-center italic text-[11px] text-slate-500 font-serif">
                Accounts Officer
              </div>
              <p className="text-[10px] text-slate-500">Authorized Bursar Signatory</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-[11px] text-slate-500 text-center">
          Note: Fees once paid is non-refundable. This is a computer-generated digital receipt and requires no physical seal.
        </div>
      </div>
    </div>
  );
};
