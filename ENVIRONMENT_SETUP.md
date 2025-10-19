# Environment Setup Guide

## Fixing NextAuth Warnings

You're seeing these warnings because NextAuth requires specific environment variables to be configured:

### Warning 1: `NEXTAUTH_URL`
This warning appears because NextAuth needs to know the base URL of your application.

### Warning 2: `NO_SECRET`
This warning appears because NextAuth requires a secret key for encrypting JWT tokens and session data.

## Quick Fix

### Step 1: Create `.env.local` file
Create a new file named `.env.local` in the root directory of your project (same level as `package.json`).

### Step 2: Add Required Variables
Copy and paste the following into your `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-to-a-random-string

# MongoDB Configuration
MONGODB_URI=your-mongodb-connection-string

# Your existing auth configuration
NEXT_PUBLIC_SECRET_KEY=your-existing-secret-key
```

### Step 3: Generate a Secure Secret
For `NEXTAUTH_SECRET`, you should generate a random string. You can use one of these methods:

**Option 1: Using OpenSSL (Recommended)**
```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online Generator**
Visit: https://generate-secret.vercel.app/32

Replace `your-nextauth-secret-key-change-this-to-a-random-string` with the generated value.

### Step 4: Update NEXTAUTH_URL for Production
When deploying to production, update `NEXTAUTH_URL` to your production domain:
```env
NEXTAUTH_URL=https://yourdomain.com
```

## Example `.env.local` File

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dGhpc2lzYXJhbmRvbXNlY3JldGtleWZvcm5leHRhdXRo

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/your-database

# Your existing auth configuration
NEXT_PUBLIC_SECRET_KEY=your-app-secret-key

# Google OAuth (Optional - only if using Google login)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Service (Optional - only if using email OTP)
EMAIL_SERVICE_API_KEY=your-email-service-api-key
EMAIL_FROM=noreply@yourdomain.com
```

## Restart Development Server

After creating the `.env.local` file, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
# or
yarn dev
```

## Verify Setup

The warnings should disappear after:
1. Creating `.env.local` with proper values
2. Restarting the development server

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to version control (it's already in `.gitignore`)
- Use different secrets for development and production
- Keep your `NEXTAUTH_SECRET` secure and never share it publicly
- Rotate secrets periodically for better security

## Troubleshooting

If warnings persist:
1. Ensure `.env.local` is in the project root directory
2. Check that variable names are spelled correctly
3. Restart your development server completely
4. Clear Next.js cache: `rm -rf .next` then restart

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/configuration/options)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)
