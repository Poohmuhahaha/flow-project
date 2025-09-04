// Email Service - Stub for production use
// This is a placeholder implementation for email functionality

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  try {
    // In production, this would integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Resend
    // - Postmark
    
    console.log(`📧 [EMAIL STUB] Password reset email would be sent to: ${email}`);
    console.log(`🔑 [EMAIL STUB] Reset token: ${resetToken}`);
    console.log(`🔗 [EMAIL STUB] Reset link: ${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      message: 'Password reset email sent successfully',
      messageId: `stub-${Date.now()}`
    };
    
  } catch (error) {
    console.error('Email service error:', error);
    return {
      success: false,
      message: 'Failed to send password reset email',
      error: error.message
    };
  }
}

export async function sendVerificationEmail(email: string, verificationToken: string) {
  try {
    console.log(`📧 [EMAIL STUB] Verification email would be sent to: ${email}`);
    console.log(`🔑 [EMAIL STUB] Verification token: ${verificationToken}`);
    console.log(`🔗 [EMAIL STUB] Verification link: ${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${verificationToken}`);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      message: 'Verification email sent successfully',
      messageId: `stub-${Date.now()}`
    };
    
  } catch (error) {
    console.error('Email service error:', error);
    return {
      success: false,
      message: 'Failed to send verification email',
      error: error.message
    };
  }
}

export async function sendWelcomeEmail(email: string, firstName: string) {
  try {
    console.log(`📧 [EMAIL STUB] Welcome email would be sent to: ${email}`);
    console.log(`👋 [EMAIL STUB] Welcome ${firstName} to FLO(W)!`);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      message: 'Welcome email sent successfully',
      messageId: `stub-${Date.now()}`
    };
    
  } catch (error) {
    console.error('Email service error:', error);
    return {
      success: false,
      message: 'Failed to send welcome email',
      error: error.message
    };
  }
}

// Configuration for production email service
export const emailConfig = {
  // Add your email service configuration here
  provider: 'stub', // Change to 'sendgrid', 'ses', 'resend', etc.
  apiKey: process.env.EMAIL_API_KEY,
  fromEmail: process.env.FROM_EMAIL || 'noreply@flow-project.com',
  fromName: process.env.FROM_NAME || 'FLO(W) Team',
};

// Email templates (could be moved to separate files)
export const emailTemplates = {
  passwordReset: {
    subject: 'Reset Your Password - FLO(W)',
    text: (resetLink: string) => `Reset your password: ${resetLink}`,
    html: (resetLink: string) => `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
      </div>
    `
  },
  verification: {
    subject: 'Verify Your Email - FLO(W)',
    text: (verifyLink: string) => `Verify your email: ${verifyLink}`,
    html: (verifyLink: string) => `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1>Verify Your Email</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verifyLink}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
          Verify Email
        </a>
      </div>
    `
  },
  welcome: {
    subject: 'Welcome to FLO(W)!',
    text: (firstName: string) => `Welcome ${firstName}! Thanks for joining FLO(W).`,
    html: (firstName: string) => `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1>Welcome to FLO(W)!</h1>
        <p>Hi ${firstName},</p>
        <p>Thanks for joining FLO(W). We're excited to help you with your logistics data needs.</p>
        <p>Get started by exploring our dashboard and API documentation.</p>
        <p>Best regards,<br>The FLO(W) Team</p>
      </div>
    `
  }
};
