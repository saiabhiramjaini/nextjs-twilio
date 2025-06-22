import { NextResponse } from 'next/server';
import { twilioClient, verifyServiceSid } from '@/lib/twilio';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Log environment variables (without sensitive data)
    console.log('Service SID exists:', !!verifyServiceSid);
    console.log('Twilio client exists:', !!twilioClient);
    console.log('Phone number received:', phone);

    const verification = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: phone, channel: 'sms' });

    return NextResponse.json({
      verificationSid: verification.sid,
      message: 'OTP sent successfully'
    });
  } catch (error: any) {
    console.error('Detailed error:', {
      message: error.message,
      code: error.code,
      status: error.status
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to send OTP',
        details: error.message,
        code: error.code
      },
      { status: error.status || 500 }
    );
  }
} 