"use client"

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired' | 'invalid'>('loading');
  const [message, setMessage] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const token = searchParams.get('token');

    if (success) {
      setStatus('success');
      setMessage('Your email has been verified successfully!');
    } else if (error) {
      switch (error) {
        case 'expired-token':
          setStatus('expired');
          setMessage('Your verification link has expired.');
          setCanResend(true);
          break;
        case 'invalid-token':
          setStatus('invalid');
          setMessage('Invalid verification link.');
          setCanResend(true);
          break;
        case 'missing-token':
          setStatus('error');
          setMessage('Missing verification token.');
          break;
        default:
          setStatus('error');
          setMessage('Something went wrong during verification.');
          setCanResend(true);
      }
    } else if (token) {
      // Auto-verify if token is in URL
      verifyToken(token);
    } else {
      setStatus('error');
      setMessage('No verification token provided.');
    }
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
      } else {
        setStatus('error');
        setMessage(data.error || 'Verification failed');
        setCanResend(true);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error occurred');
      setCanResend(true);
    }
  };

  const resendVerification = async () => {
    const email = prompt('Enter your email address to resend verification:');
    if (!email) return;

    setIsResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Verification email sent! Check your inbox.');
      } else {
        alert(data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      alert('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'error':
      case 'expired':
      case 'invalid':
        return <XCircle className="w-12 h-12 text-red-600" />;
      default:
        return <Mail className="w-12 h-12 text-blue-600" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Verifying Email...';
      case 'success':
        return 'Email Verified!';
      case 'expired':
        return 'Link Expired';
      case 'invalid':
        return 'Invalid Link';
      default:
        return 'Verification Failed';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted-choice py-12 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getIcon()}
            </div>
            <CardTitle className="text-2xl">{getTitle()}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === 'success' && (
              <Button asChild className="w-full">
                <Link href="/login">Sign In to Your Account</Link>
              </Button>
            )}

            {canResend && (
              <div className="space-y-3">
                <Button 
                  onClick={resendVerification}
                  disabled={isResending}
                  variant="outline"
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </div>
            )}

            <div className="text-center">
              <Link 
                href="/login" 
                className="text-sm text-muted-foreground hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}