import nodemailer from 'nodemailer';
import { emailTemplates } from './email-templates';

const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@yourapp.com';
const APP_NAME = process.env.APP_NAME || 'FLO(W)';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

// Create transporter
const transporter = nodemailer.createTransporter(SMTP_CONFIG);

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('Email transporter is ready');
  }
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${APP_URL}/api/auth/verify-email?token=${token}`;
  
  const mailOptions = {
    from: {
      name: APP_NAME,
      address: FROM_EMAIL,
    },
    to: email,
    subject: `Verify your ${APP_NAME} account`,
    html: emailTemplates.verification({
      appName: APP_NAME,
      verificationUrl,
      appUrl: APP_URL,
    }),
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: {
      name: APP_NAME,
      address: FROM_EMAIL,
    },
    to: email,
    subject: `Reset your ${APP_NAME} password`,
    html: emailTemplates.passwordReset({
      appName: APP_NAME,
      resetUrl,
      appUrl: APP_URL,
    }),
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

export async function sendWelcomeEmail(email: string, firstName: string) {
  const loginUrl = `${APP_URL}/login`;
  
  const mailOptions = {
    from: {
      name: APP_NAME,
      address: FROM_EMAIL,
    },
    to: email,
    subject: `Welcome to ${APP_NAME}!`,
    html: emailTemplates.welcome({
      appName: APP_NAME,
      firstName,
      loginUrl,
      appUrl: APP_URL,
    }),
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw error for welcome emails - they're not critical
    return { success: false, error };
  }
}

// Test email configuration
export async function testEmailConnection() {
  try {
    await transporter.verify();
    return { success: true, message: 'Email connection successful' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}