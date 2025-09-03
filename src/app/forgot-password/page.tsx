import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive reset instructions
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
