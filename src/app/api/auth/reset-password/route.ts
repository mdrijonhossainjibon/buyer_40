import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import Admin from '@/lib/models/Admin'
import mongoose from 'mongoose'
import { sendPasswordChangeEmail } from '@/lib/emailService'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { currentPassword, newPassword } = await request.json()

    // Validate input
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
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

    // Verify current password against database
    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required' },
        { status: 400 }
      )
    }

    if (admin.password !== currentPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Update password in database
    // In production, you should hash the password properly
    admin.password = newPassword
    await admin.save()

    console.log(`🔐 Password updated for ${email} (${admin.username})`)
    console.log(`🔐 Password change method: OTP Reset`)

     
    // Send password change confirmation email
    try {
      await sendPasswordChangeEmail({
        to: email,
        username: admin.username,
        changeTime: new Date(),
        method: 'OTP Reset'
      })
      console.log(`📧 Password change confirmation email sent to ${email}`)
    } catch (emailError) {
      console.error('Failed to send password change confirmation email:', emailError)
      // Don't fail the password change if email sending fails
    }
 

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully. Confirmation email sent.'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
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
