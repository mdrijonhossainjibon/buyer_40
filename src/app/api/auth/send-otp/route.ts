import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import Admin from '@/lib/models/Admin'
import mongoose from 'mongoose'
import { generateOTP, sendPasswordResetOTPEmail } from '@/lib/emailService'

 
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { purpose } = await request.json()
    
    if (purpose !== 'password_reset') {
      return NextResponse.json(
        { error: 'Invalid purpose' },
        { status: 400 }
      )
    }

    const email = session.user.email
    
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!)
    }

    // Find admin by email to get username
    const admin = await Admin.findOne({
      email: email,
      status: 'active'
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found or inactive' },
        { status: 404 }
      )
    }

    // Check rate limiting (max 3 attempts per 15 minutes)
    const now = Date.now()
   
    
    // Check if OTP was recently sent (rate limiting)
    if (admin.otpExpiry && admin.otpExpiry > new Date(now - 2 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'OTP was recently sent. Please wait before requesting a new one.' },
        { status: 429 }
      )
    }

    // Generate new OTP using existing service
    const otpCode = generateOTP()
    const expiresAt = now + 10 * 60 * 1000 // 10 minutes
 
    admin.otp = otpCode
    admin.otpExpiry = new Date(expiresAt)
    await admin.save()

    // Send password reset OTP email using dedicated email service
    const emailSent = await sendPasswordResetOTPEmail({
      to: email,
      username: admin.username,
      otp: otpCode
    })

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      )
    }

    console.log(`🔐 Password reset OTP sent to ${email}: ${otpCode} (expires in 10 minutes)`)

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your email',
      expiresAt
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
