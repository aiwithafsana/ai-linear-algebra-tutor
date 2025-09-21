import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as AppleStrategy } from 'passport-apple';
import { generateToken } from '../middleware/auth';

const router = express.Router();

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = {
      id: profile.id,
      email: profile.emails?.[0]?.value || '',
      name: profile.displayName || '',
      provider: 'google' as const
    };
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Configure Apple Sign-In Strategy
passport.use(new AppleStrategy({
  clientID: process.env.APPLE_CLIENT_ID!,
  teamID: process.env.APPLE_TEAM_ID!,
  keyID: process.env.APPLE_KEY_ID!,
  privateKeyString: process.env.APPLE_PRIVATE_KEY!,
  callbackURL: process.env.APPLE_CALLBACK_URL || '/api/auth/apple/callback'
}, async (accessToken, refreshToken, idToken, profile, done) => {
  try {
    const user = {
      id: profile.id,
      email: profile.email || '',
      name: profile.name || '',
      provider: 'apple' as const
    };
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user as any);
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

// Apple Sign-In routes
router.get('/apple', passport.authenticate('apple'));

router.get('/apple/callback',
  passport.authenticate('apple', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user as any);
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

// Logout route
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
