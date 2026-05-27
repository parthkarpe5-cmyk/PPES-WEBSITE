'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, Download, Search, CheckCircle2, XCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getAuthHeaders } from '@/lib/api';

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/v1';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`${BACKEND_URL}/payments`, {
        headers: headers as any
      });
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = (payment: any) => {
    const doc = new jsPDF();
    const studentName = payment.studentDetails?.name || 'Student';
    const courseName = payment.courseId?.course_name || 'Premium Course';
    const amt = payment.amount * 100; // stored as INR

    doc.setFontSize(22);
    doc.setTextColor(47, 168, 204);
    doc.text("PPES Classroom", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Official Course Invoice (Copy)", 14, 30);
    doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 14, 36);
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Billed To:", 14, 50);
    doc.setFontSize(10);
    doc.text(`Student: ${studentName}`, 14, 56);
    doc.text(`USN/ID: ${payment.studentDetails?.usn || payment.studentId}`, 14, 62);
    
    doc.setFontSize(12);
    doc.text("Payment Details:", 120, 50);
    doc.setFontSize(10);
    doc.text(`Transaction ID: ${payment.razorpay_payment_id}`, 120, 56);
    doc.text(`Order ID: ${payment.razorpay_order_id}`, 120, 62);
    doc.text(`Status: Paid`, 120, 68);

    autoTable(doc, {
      startY: 80,
      head: [['Description', 'Amount (INR)']],
      body: [
        [`Enrollment: ${courseName}`, `Rs. ${(amt / 100).toFixed(2)}`]
      ],
      headStyles: { fillColor: [47, 168, 204] },
      theme: 'striped'
    });

    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Paid: Rs. ${(amt / 100).toFixed(2)}`, 140, finalY + 15);

    doc.save(`invoice_copy_${payment.razorpay_payment_id}.pdf`);
  };

  const filteredPayments = payments.filter(p => 
    p.razorpay_payment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.studentDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.courseId?.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 font-display">
            <CreditCard className="text-[#2FA8CC] h-8 w-8" />
            Payments Hub
          </h1>
          <p className="text-slate-400 text-sm mt-1">Monitor course transactions and generate invoice copies.</p>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by student, course, or transaction ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2FA8CC]/50 focus:bg-white/10 transition-all"
          />
        </div>
        <div className="bg-[#2FA8CC]/10 border border-[#2FA8CC]/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
                <p className="text-[#2FA8CC] text-[10px] font-bold uppercase tracking-widest">Total Revenue</p>
                <h3 className="text-2xl font-black text-white mt-1">
                    ₹{payments.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}
                </h3>
            </div>
            <div className="h-10 w-10 bg-[#2FA8CC]/20 rounded-full flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-[#2FA8CC]" />
            </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl relative">
        <div className="overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2FA8CC]"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-16">
              <CreditCard className="h-12 w-12 text-slate-600 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400 font-bold text-lg">No transactions found</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-black/20 border-b border-white/5">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Date</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Student</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Course</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Amount</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPayments.map((p) => (
                  <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-300 block">{new Date(p.createdAt).toLocaleDateString()}</span>
                      <span className="text-[10px] text-slate-500">{new Date(p.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-white block">{p.studentDetails?.name || 'Unknown'}</span>
                      <span className="text-[10px] text-[#2FA8CC] uppercase tracking-wider font-bold">{p.studentDetails?.usn || p.studentId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300 block">{p.courseId?.course_name || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-white">₹{p.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      {p.status === 'success' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest uppercase border border-emerald-500/20">
                              <CheckCircle2 className="h-3 w-3" /> Paid
                          </span>
                      ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 text-red-400 text-[10px] font-bold tracking-widest uppercase border border-red-500/20">
                              <XCircle className="h-3 w-3" /> Failed
                          </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => downloadInvoice(p)}
                        className="h-8 px-3 rounded-lg bg-white/5 hover:bg-[#2FA8CC]/20 text-slate-300 hover:text-[#2FA8CC] border border-white/10 hover:border-[#2FA8CC]/50 transition-all flex items-center gap-2 text-xs font-bold ml-auto"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
