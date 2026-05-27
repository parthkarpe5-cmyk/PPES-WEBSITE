'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RazorpayCheckoutButton from '@/components/RazorpayCheckoutButton';

function PaymentContent() {
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState<number>(1); // Default amount in INR

  useEffect(() => {
    const amt = searchParams.get('amount');
    if (amt) {
      setAmount(Number(amt));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050B14] p-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2FA8CC]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF6B00]/5 blur-[120px] rounded-full" />

      <div className="max-w-md w-full glass-card bg-card backdrop-blur-xl border border-border rounded-[2rem] shadow-2xl p-8 relative z-10">
        <h1 className="text-3xl font-black text-center mb-6 text-foreground tracking-tight font-display">
          Course <span className="text-[#2FA8CC]">Enrollment</span>
        </h1>
        
        <div className="bg-black/20 border border-border rounded-2xl p-6 mb-8 text-center space-y-2">
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Total Amount Due</p>
          <div className="text-4xl font-black text-foreground flex items-center justify-center gap-1">
             <span className="text-[#2FA8CC] text-2xl">₹</span>{amount}
          </div>
          <p className="text-slate-500 text-[10px] mt-2 italic">Secure transaction via Razorpay</p>
        </div>

        <div className="flex justify-center">
          {/* We multiply by 100 because Razorpay expects amount in paise */}
          <RazorpayCheckoutButton amount={amount * 100} courseId={searchParams.get('courseId')} />
        </div>
      </div>
    </div>
  );
}

export default function TestPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500">Loading payment gateway...</p>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
