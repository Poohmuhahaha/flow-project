"use client"

import { useMemo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    label: 'One lowercase letter',
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: 'One uppercase letter',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: 'One number',
    test: (password) => /\d/.test(password),
  },
  {
    label: 'One special character',
    test: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password),
  },
];

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    const passed = requirements.filter(req => req.test(password));
    const score = (passed.length / requirements.length) * 100;
    
    return {
      score,
      level: score === 0 ? '' : 
             score < 40 ? 'weak' : 
             score < 80 ? 'medium' : 'strong',
      passed: passed.length,
      total: requirements.length,
    };
  }, [password]);

  if (!password) return null;

  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'weak': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'strong': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBarColor = (level: string) => {
    switch (level) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Strength Bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Password strength</span>
          {strength.level && (
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getStrengthColor(strength.level))}>
              {strength.level.charAt(0).toUpperCase() + strength.level.slice(1)}
            </span>
          )}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={cn('h-full transition-all duration-300 rounded-full', getBarColor(strength.level))}
            style={{ width: `${strength.score}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground mb-2">Requirements:</p>
        {requirements.map((requirement, index) => {
          const passed = requirement.test(password);
          return (
            <div key={index} className="flex items-center space-x-2 text-xs">
              {passed ? (
                <CheckCircle className="w-3 h-3 text-green-600" />
              ) : (
                <XCircle className="w-3 h-3 text-red-600" />
              )}
              <span className={cn(
                'transition-colors',
                passed ? 'text-green-700' : 'text-red-700'
              )}>
                {requirement.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Hook for password validation
export function usePasswordStrength(password: string) {
  return useMemo(() => {
    const passed = requirements.filter(req => req.test(password));
    const score = (passed.length / requirements.length) * 100;
    
    return {
      score,
      level: score === 0 ? '' : 
             score < 40 ? 'weak' : 
             score < 80 ? 'medium' : 'strong',
      isValid: passed.length === requirements.length,
      passed: passed.length,
      total: requirements.length,
      requirements: requirements.map(req => ({
        ...req,
        passed: req.test(password),
      })),
    };
  }, [password]);
}