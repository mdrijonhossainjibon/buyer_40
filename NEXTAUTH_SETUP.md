# NextAuth.js Integration Guide

## Overview
Your login system has been successfully migrated to use NextAuth.js for better authentication handling, security, and provider management.

## Installation Required
```bash
npm install next-auth
```

## Environment Variables
Add these variables to your `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Your existing auth configuration
NEXT_PUBLIC_SECRET_KEY=your-existing-secret-key
```

## Key Changes Made

### 1. NextAuth API Route
- Created `/src/app/api/auth/[...nextauth]/route.ts`
- Configured Google OAuth and Credentials providers
- Integrated with your existing backend authentication

### 2. Updated Login Page
- Replaced custom authentication with NextAuth `signIn()` function
- Added session management with `useSession()` hook
- Maintained OTP verification workflow
- Simplified Google OAuth integration

### 3. Session Provider
- Added `AuthSessionProvider` wrapper in layout
- Enables session management across the app

### 4. TypeScript Support
- Created type definitions for NextAuth extensions
- Added proper typing for custom session properties

## Benefits
- ✅ Standardized authentication flow
- ✅ Built-in CSRF protection
- ✅ Secure JWT handling
- ✅ Multiple provider support
- ✅ Session management
- ✅ TypeScript support

## Usage Examples

### Check Authentication Status
```tsx
import { useSession } from 'next-auth/react'

function Component() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <p>Loading...</p>
  if (status === 'unauthenticated') return <p>Not logged in</p>
  
  return <p>Welcome {session?.user?.email}</p>
}
```

### Sign Out
```tsx
import { signOut } from 'next-auth/react'

function SignOutButton() {
  return <button onClick={() => signOut()}>Sign Out</button>
}
```

### Protect Pages
```tsx
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function ProtectedPage() {
  const { status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])
  
  if (status === 'loading') return <div>Loading...</div>
  
  return <div>Protected content</div>
}
```

## Next Steps
1. Install NextAuth.js: `npm install next-auth`
2. Configure environment variables
3. Test the authentication flow
4. Update other pages to use NextAuth session management
