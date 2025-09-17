import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import Admin from '@/lib/models/Admin'
import mongoose from 'mongoose'

interface OTPStore {
  [email: string]: {
    code: string
    expires: number
    attempts: number
  }
}

// In production, use Redis or a database
// This should be the same store as in send-otp
const otpStore: OTPStore = {}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { otpCode, purpose } = await request.json()
    
    if (!otpCode || otpCode.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid OTP code format' },
        { status: 400 }
      )
    }

    if (purpose !== 'password_reset') {
      return NextResponse.json(
        { error: 'Invalid purpose' },
        { status: 400 }
      )
    }

    const email = session.user.email

    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!)
    }

    // Find admin by email
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

    // Check both memory store and database for OTP
    const storedOTP = otpStore[email]
    
    if (!storedOTP && !admin.otp) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new one.' },
        { status: 404 }
      )
    }

    // Check if OTP has expired (check both sources)
    const now = Date.now()
    const memoryExpired = storedOTP && now > storedOTP.expires
    const dbExpired = admin.otpExpiry && new Date() > admin.otpExpiry

    if (memoryExpired || dbExpired) {
      // Clean up expired OTP from both sources
      if (storedOTP) delete otpStore[email]
      if (admin.otp) {
        admin.otp = undefined
        admin.otpExpiry = undefined
        await admin.save()
      }
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 410 }
      )
    }

    // Verify OTP code (check both sources)
    const validOTP = (storedOTP && storedOTP.code === otpCode) || 
                     (admin.otp && admin.otp === otpCode)

    if (!validOTP) {
      return NextResponse.json(
        { error: 'Invalid OTP code' },
        { status: 400 }
      )
    }

    // OTP is valid, clean it up from both sources
    if (storedOTP) delete otpStore[email]
    if (admin.otp) {
      admin.otp = undefined
      admin.otpExpiry = undefined
      await admin.save()
    }

    console.log(`🔐 OTP verified successfully for ${email}`)

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      email
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
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
