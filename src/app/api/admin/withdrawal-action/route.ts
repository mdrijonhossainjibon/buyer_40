import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Withdrawal from '@/lib/models/Withdrawal'
import User from '@/lib/models/User'
import Notification from '@/lib/models/Notification'
 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { withdrawalId, action, adminNote, signature, timestamp, nonce } = body
 

    // Validate required fields
    if (!withdrawalId || !action) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 })
    }

    // Validate action type
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid action. Must be "approve" or "reject"'
      }, { status: 400 })
    }

    // Connect to database
    await dbConnect()

    // Find the withdrawal
    const withdrawal = await Withdrawal.findOne({ 
      withdrawalId, 
      status: 'pending' 
    })

    if (!withdrawal) {
      return NextResponse.json({
        success: false,
        message: 'Withdrawal not found or already processed'
      }, { status: 404 })
    }

    // Update withdrawal status
    const newStatus = action === 'approve' ? 'approved' : 'rejected'
    withdrawal.status = newStatus
    withdrawal.processedAt = new Date()
    if (adminNote) {
      withdrawal.metadata = {
        ...withdrawal.metadata,
        adminNotes: adminNote
      }
    }
    if (action === 'reject') {
      withdrawal.rejectionReason = adminNote || 'No reason provided'
    }
    await withdrawal.save()

    // If rejected, refund the amount to user balance
    if (action === 'reject') {
      await User.findOneAndUpdate(
        { userId: withdrawal.userId },
        { 
          $inc: { 
            balanceTK: withdrawal.amount,
            withdrawnAmount: -withdrawal.amount
          }
        }
      )
    }

    // Send notification to user
    await Notification.create({
      userId: withdrawal.userId,
      title: action === 'approve' ? '✅ উইথড্র অনুমোদিত' : '❌ উইথড্র প্রত্যাখ্যাত',
      message: action === 'approve' 
        ? `আপনার ${withdrawal.amount} টাকার উইথড্র অনুরোধ অনুমোদিত হয়েছে। ${withdrawal.method} (${withdrawal.accountDetails.accountNumber}) এ পাঠানো হবে।`
        : `আপনার ${withdrawal.amount} টাকার উইথড্র অনুরোধ প্রত্যাখ্যান করা হয়েছে। ${adminNote ? 'কারণ: ' + adminNote : ''} টাকা আপনার অ্যাকাউন্টে ফেরত দেওয়া হয়েছে।`,
      type: action === 'approve' ? 'success' : 'warning',
      priority: 'high',
      isRead: false,
      metadata: {
        withdrawalId,
        action,
        amount: withdrawal.amount,
        method: withdrawal.method,
        adminNote: adminNote || null,
        processedAt: new Date().toISOString()
      }
    })
    return NextResponse.json({
      success: true,
      data: {
        withdrawalId,
        action,
        status: action === 'approve' ? 'approved' : 'rejected',
        processedAt: new Date().toISOString(),
        adminNote: adminNote || null
      },
      message: action === 'approve' 
        ? 'Withdrawal has been successfully approved' 
        : 'Withdrawal has been successfully rejected'
    })

  } catch (error) {
    console.error('Withdrawal action API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
