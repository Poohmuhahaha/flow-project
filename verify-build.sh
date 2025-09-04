#!/bin/bash
# Build Verification Script

echo "🔍 Pre-build verification..."
echo ""

# Check for problematic backup files
echo "1. Checking for backup files..."
if find src -name "*backup*" -o -name "*temp*" -o -name "*old*" | grep -v node_modules; then
  echo "❌ Found backup files that may cause build errors"
  exit 1
else
  echo "✅ No problematic backup files found"
fi

# Check for missing imports
echo ""
echo "2. Checking for missing function imports..."
if grep -r "createEmailVerificationToken\|sendPasswordResetEmail" src --include="*.ts" --include="*.tsx" | grep -v "email-service.ts"; then
  echo "❌ Found references to potentially missing functions"
  exit 1
else
  echo "✅ No missing function imports found"  
fi

# Check ESLint config
echo ""
echo "3. Checking ESLint configuration..."
if [[ -f ".eslintrc.json" ]] || [[ -f "eslint.config.mjs" ]]; then
  echo "✅ ESLint configuration found"
else
  echo "❌ ESLint configuration missing"
  exit 1
fi

# Check critical files exist
echo ""
echo "4. Checking critical files..."
critical_files=(
  "src/lib/db/setup.ts"
  "src/lib/email/email-service.ts"
  "src/app/api/admin/db-health/route.ts"
)

for file in "${critical_files[@]}"; do
  if [[ -f "$file" ]]; then
    echo "✅ $file exists"
  else
    echo "❌ $file missing"
    exit 1
  fi
done

# Check for TypeScript error patterns
echo ""
echo "5. Checking for TypeScript error patterns..."
if grep -r "error\.message" src --include="*.ts" | grep -v "error instanceof Error"; then
  echo "❌ Found unsafe error.message usage"
  exit 1
else
  echo "✅ No unsafe error handling found"
fi

echo ""
echo "🎉 All pre-build checks passed!"
echo "Ready for production build."
