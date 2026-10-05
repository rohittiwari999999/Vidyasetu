import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class FeeLedgerScreen extends ConsumerWidget {
  const FeeLedgerScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Fee Ledger & Receipts'),
        backgroundColor: const Color(0xFF1E293B),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Outstanding dues summary
            Card(
              color: const Color(0xFF1E293B),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: const [
                        Text(
                          'Total Outstanding',
                          style: TextStyle(color: Colors.white70, fontSize: 14),
                        ),
                        Text(
                          'Quarter 3 (Oct - Dec)',
                          style: TextStyle(color: Colors.amber, fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          '₹ 14,500',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        ElevatedButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Opening secure UPI / Payment Gateway...'),
                                backgroundColor: Colors.indigo,
                              ),
                            );
                          },
                          icon: const Icon(Icons.payment, size: 18),
                          label: const Text('Pay Now'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF6366F1),
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Payment History & Receipts',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 12),
            _buildReceiptTile(
              title: 'Quarter 2 Tuition Fee',
              date: '12 Jul 2026',
              amount: '₹ 14,500',
              receiptNo: 'REC-2026-0891',
              isPaid: true,
            ),
            _buildReceiptTile(
              title: 'Annual Lab & Activity Fee',
              date: '10 Apr 2026',
              amount: '₹ 5,200',
              receiptNo: 'REC-2026-0245',
              isPaid: true,
            ),
            _buildReceiptTile(
              title: 'Quarter 1 Tuition Fee',
              date: '08 Apr 2026',
              amount: '₹ 14,500',
              receiptNo: 'REC-2026-0112',
              isPaid: true,
            ),
          ],
        ),
      ),
    );
  }

  static Widget _buildReceiptTile({
    required String title,
    required String date,
    required String amount,
    required String receiptNo,
    required bool isPaid,
  }) {
    return Card(
      color: const Color(0xFF1E293B),
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: const CircleAvatar(
          backgroundColor: Color(0x2210B981),
          child: Icon(Icons.receipt_long, color: Color(0xFF10B981)),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.white),
        ),
        subtitle: Text(
          '$date • $receiptNo',
          style: const TextStyle(color: Colors.white70, fontSize: 12),
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              amount,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.white,
                fontSize: 15,
              ),
            ),
            const SizedBox(height: 2),
            const Text(
              'PAID',
              style: TextStyle(
                color: Color(0xFF10B981),
                fontSize: 11,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
