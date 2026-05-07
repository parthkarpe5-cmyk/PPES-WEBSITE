'use client';

import React, { useState } from 'react';
import RazorpayCheckoutButton from '@/components/RazorpayCheckoutButton';

export default function TestPaymentPage() {
  const [amount, setAmount] = useState<number>(1); // Default amount in INR

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Dynamic Razorpay Payment
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center text-sm">
          Enter an amount below. This will generate a dynamic payment, and you can also pay via QR code (UPI) in the checkout window.
        </p>

        <div className="mb-6">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount (INR)
          </label>
          <input
            type="number"
            id="amount"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter amount"
          />
        </div>

        <div className="flex justify-center">
          {/* We multiply by 100 because Razorpay expects amount in paise */}
          <RazorpayCheckoutButton amount={amount * 100} />
        </div>
      </div>
    </div>
  );
}
