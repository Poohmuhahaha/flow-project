import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              create a new account
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
