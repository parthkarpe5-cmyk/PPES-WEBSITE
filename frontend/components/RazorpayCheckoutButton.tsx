'use client';

import React, { useState } from 'react';

// Extend the window object to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutButtonProps {
  amount?: number; // amount in paise (default 100)
}

export default function RazorpayCheckoutButton({ amount = 100 }: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // 1. Create order on the backend
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      
      const orderData = await res.json();
      
      if (!res.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // 2. Load Razorpay script if not already loaded
      const loadScript = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const isLoaded = await loadScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // 3. Initialize Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'PPES Test Website',
        description: 'Test Transaction',
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            // 4. Verify payment on the backend
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok && verifyData.success) {
              setMessage('Payment successful and verified!');
            } else {
              setMessage('Payment verification failed.');
            }
          } catch (err) {
            console.error(err);
            setMessage('Payment verification failed.');
          }
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        setMessage(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
      
    } catch (error: any) {
      console.error(error);
      setMessage(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Processing...' : `Pay ₹${amount / 100}`}
      </button>
      {message && <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{message}</p>}
    </div>
  );
}
