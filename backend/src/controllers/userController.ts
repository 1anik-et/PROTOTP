import { Request, Response } from 'express';

export const saveProfile = (req: Request, res: Response) => {
  const { role, onboardingData } = req.body;

  if (!role || !onboardingData) {
    return res.status(400).json({ success: false, message: 'Missing profile data' });
  }

  // In a real app, save to database here.
  console.log(`[PROFILE SAVED] Role: ${role}`, onboardingData);

  res.status(200).json({ success: true, message: 'Profile saved successfully' });
};