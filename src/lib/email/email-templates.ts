interface EmailTemplateProps {
  appName: string;
  appUrl: string;
}

interface VerificationEmailProps extends EmailTemplateProps {
  verificationUrl: string;
}

interface PasswordResetEmailProps extends EmailTemplateProps {
  resetUrl: string;
}

interface WelcomeEmailProps extends EmailTemplateProps {
  firstName: string;
  loginUrl: string;
}

const baseStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    text-align: center;
    border-radius: 8px 8px 0 0;
  }
  .content {
    background: white;
    padding: 40px;
    border: 1px solid #e1e5e9;
    border-top: none;
  }
  .button {
    display: inline-block;
    background: #667eea;
    color: white;
    padding: 12px 30px;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    margin: 20px 0;
  }
  .footer {
    background: #f8f9fa;
    padding: 20px;
    text-align: center;
    font-size: 14px;
    color: #6c757d;
    border-radius: 0 0 8px 8px;
  }
  .divider {
    border: none;
    height: 1px;
    background: #e1e5e9;
    margin: 30px 0;
  }
`;

export const emailTemplates = {
  verification: ({ appName, verificationUrl, appUrl }: VerificationEmailProps) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Verify your ${appName} account</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="header">
        <h1>${appName}</h1>
        <p>Welcome! Please verify your email address</p>
      </div>
      
      <div class="content">
        <h2>Verify your email address</h2>
        
        <p>Thanks for signing up for ${appName}! To complete your registration, please click the button below to verify your email address:</p>
        
        <center>
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
        </center>
        
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
        
        <hr class="divider">
        
        <p><strong>Important:</strong> This verification link will expire in 24 hours for security reasons.</p>
        
        <p>If you didn't create an account with ${appName}, you can safely ignore this email.</p>
      </div>
      
      <div class="footer">
        <p>This email was sent by ${appName}</p>
        <p><a href="${appUrl}" style="color: #667eea;">Visit our website</a></p>
      </div>
    </body>
    </html>
  `,

  passwordReset: ({ appName, resetUrl, appUrl }: PasswordResetEmailProps) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Reset your ${appName} password</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="header">
        <h1>${appName}</h1>
        <p>Password Reset Request</p>
      </div>
      
      <div class="content">
        <h2>Reset your password</h2>
        
        <p>We received a request to reset the password for your ${appName} account. Click the button below to create a new password:</p>
        
        <center>
          <a href="${resetUrl}" class="button">Reset Password</a>
        </center>
        
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
        
        <hr class="divider">
        
        <p><strong>Important:</strong> This password reset link will expire in 1 hour for security reasons.</p>
        
        <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        
        <p><strong>Security tip:</strong> For your account's security, make sure you're the only one with access to this email.</p>
      </div>
      
      <div class="footer">
        <p>This email was sent by ${appName}</p>
        <p><a href="${appUrl}" style="color: #667eea;">Visit our website</a></p>
      </div>
    </body>
    </html>
  `,

  welcome: ({ appName, firstName, loginUrl, appUrl }: WelcomeEmailProps) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Welcome to ${appName}!</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to ${appName}!</h1>
        <p>Your account has been successfully created</p>
      </div>
      
      <div class="content">
        <h2>Hello ${firstName}! 👋</h2>
        
        <p>Welcome to ${appName}! We're excited to have you on board. Your account has been successfully created and verified.</p>
        
        <p>Here's what you can do next:</p>
        <ul>
          <li>🔑 Create your first API key</li>
          <li>📊 Explore our logistics data APIs</li>
          <li>💳 Purchase credits to get started</li>
          <li>📚 Check out our documentation</li>
        </ul>
        
        <center>
          <a href="${loginUrl}" class="button">Sign In to Your Account</a>
        </center>
        
        <hr class="divider">
        
        <h3>Quick Start Guide</h3>
        <p>To get started with ${appName}:</p>
        <ol>
          <li>Sign in to your dashboard</li>
          <li>Generate your first API key</li>
          <li>Purchase some credits</li>
          <li>Start making API calls!</li>
        </ol>
        
        <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>
      </div>
      
      <div class="footer">
        <p>Thanks for joining ${appName}!</p>
        <p><a href="${appUrl}" style="color: #667eea;">Visit Dashboard</a></p>
      </div>
    </body>
    </html>
  `,
};