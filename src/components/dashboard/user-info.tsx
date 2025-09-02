"use client"

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'

export function UserInfo() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return <div className="animate-pulse">Loading...</div>
  }

  if (!user) {
    return <div>Please log in</div>
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
      <User className="w-8 h-8 text-blue-500" />
      <div className="flex-1">
        <h3 className="font-semibold">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-sm text-gray-600">{user.email}</p>
        {user.company && (
          <p className="text-sm text-gray-500">{user.company}</p>
        )}
        <p className="text-sm font-medium text-green-600">
          Credits: {user.credits}
        </p>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={logout}
        className="flex items-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </Button>
    </div>
  )
}