import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt = 'receipt_' + Date.now() } = body;

    // Validate amount >= 100 paise
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least 100 paise' },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    const options = {
      amount: Math.round(Number(amount)),
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    
    // Check if it's an authentication error
    if (error.statusCode === 401) {
      return NextResponse.json(
        { error: 'Authentication failed with Razorpay' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
