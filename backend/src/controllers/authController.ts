import { Request, Response } from 'express';
import axios from 'axios';
import twilio from 'twilio';
import crypto from 'crypto';

const FYNO_URL = 'https://api.fyno.io/v1';

const getTwilioClient = () => {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return null;
};

/** Generate a unique session token per verification */
const generateToken = (phone: string): string => {
  const payload = {
    sub: phone,
    iat: Date.now(),
    jti: crypto.randomUUID(),
  };
  // Base64-encode the payload as a lightweight token
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
};

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.length !== 10) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    const fynoKey = process.env.FYNO_API_KEY;
    const fynoWs = process.env.FYNO_WORKSPACE_ID;
    const fynoTpl = process.env.FYNO_TEMPLATE_ID;

    if (fynoKey && fynoWs && fynoTpl) {
      try {
        await axios.post(
          `${FYNO_URL}/${fynoWs}/v2/otp`,
          { to: `+91${phone}`, template: fynoTpl, channel: ['sms'] },
          { headers: { Authorization: `Bearer ${fynoKey}`, 'Content-Type': 'application/json' } }
        );
        return res.status(200).json({ success: true, provider: 'fyno' });
      } catch (fynoError: any) {
        console.error('[Fyno Send] Failed:', fynoError?.response?.data || fynoError?.message);
      }
    }

    const twilioClient = getTwilioClient();
    const twilioService = process.env.TWILIO_VERIFY_SERVICE_SID;

    if (twilioClient && twilioService) {
      try {
        await twilioClient.verify.v2.services(twilioService).verifications.create({
          to: `+91${phone}`,
          channel: 'sms'
        });
        return res.status(200).json({ success: true, provider: 'twilio' });
      } catch (twilioError: any) {
        console.error('[Twilio Send] Failed:', twilioError?.message);
        return res.status(500).json({ success: false, message: twilioError?.message || 'Twilio SMS failed' });
      }
    }

    console.error('[Auth] No providers configured.');
    return res.status(500).json({ success: false, message: 'All authentication providers failed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;

    if (!otp || otp.length !== 6) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    const fynoKey = process.env.FYNO_API_KEY;
    const fynoWs = process.env.FYNO_WORKSPACE_ID;

    if (fynoKey && fynoWs) {
      try {
        const fynoRes = await axios.post(
          `${FYNO_URL}/${fynoWs}/v2/otp/verify`,
          { to: `+91${phone}`, otp: otp },
          { headers: { Authorization: `Bearer ${fynoKey}`, 'Content-Type': 'application/json' } }
        );
        
        if (fynoRes.data && fynoRes.data.status === 'verified') {
          return res.status(200).json({ success: true, token: generateToken(phone) });
        }
      } catch (fynoError: any) {
        console.error('[Fyno Verify] Failed:', fynoError?.response?.data || fynoError?.message);
      }
    }

    const twilioClient = getTwilioClient();
    const twilioService = process.env.TWILIO_VERIFY_SERVICE_SID;

    if (twilioClient && twilioService) {
      try {
        const twilioRes = await twilioClient.verify.v2.services(twilioService).verificationChecks.create({
          to: `+91${phone}`,
          code: otp
        });

        if (twilioRes.status === 'approved') {
          return res.status(200).json({ success: true, token: generateToken(phone) });
        }
      } catch (twilioError: any) {
        console.error('[Twilio Verify] Failed:', twilioError?.message);
      }
    }

    return res.status(400).json({ success: false, message: 'Invalid or expired code' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Verification process failed' });
  }
};