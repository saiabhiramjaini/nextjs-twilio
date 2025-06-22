import twilio from 'twilio';

if (!process.env.TWILIO_ACCOUNT_SID) {
  throw new Error('TWILIO_ACCOUNT_SID is not defined');
}

if (!process.env.TWILIO_AUTH_TOKEN) {
  throw new Error('TWILIO_AUTH_TOKEN is not defined');
}

if (!process.env.TWILIO_VERIFY_SERVICE_SID) {
  throw new Error('TWILIO_VERIFY_SERVICE_SID is not defined');
}

// Validate Verify Service SID format
if (!process.env.TWILIO_VERIFY_SERVICE_SID.startsWith('VA')) {
  throw new Error('Invalid TWILIO_VERIFY_SERVICE_SID format. It should start with "VA"');
}

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID; 