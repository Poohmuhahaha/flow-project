import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
