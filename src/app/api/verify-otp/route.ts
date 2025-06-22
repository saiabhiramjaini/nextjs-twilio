import { NextResponse } from 'next/server';
import { twilioClient, verifyServiceSid } from '@/lib/twilio';

export async function POST(request: Request) {
  try {
    const { verificationSid, otp } = await request.json();

    if (!verificationSid || !otp) {
      return NextResponse.json(
        { error: 'Verification SID and OTP are required' },
        { status: 400 }
      );
    }

    const verificationCheck = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ code: otp, verificationSid });

    return NextResponse.json({
      valid: verificationCheck.status === 'approved',
      message: verificationCheck.status === 'approved' 
        ? 'OTP verified successfully' 
        : 'Invalid OTP'
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
} 