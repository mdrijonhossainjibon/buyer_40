import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import User from '@/lib/models/User'
import Withdrawal from '@/lib/models/Withdrawal'

import Admin from '@/lib/models/Admin'
import dbConnect from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required'
      }, { status: 401 })
    }

    // Check if user is admin
    const admin = await Admin.findOne({ userId: parseInt(session.user.id) })
    if (!admin) {
      return NextResponse.json({
        success: false,
        message: 'Admin access required'
      }, { status: 403 })
    }

    const body = await request.json()
    const { action, withdrawalId, rejectionReason, transactionId, adminNotes } = body

    if (action === 'get-pending') {
      const { page = 1, limit = 20 } = body
      const skip = (page - 1) * limit

      const withdrawals =  Withdrawal.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      const total = await Withdrawal.countDocuments({ status: 'pending' })

      return NextResponse.json({
        success: true,
        data: {
          withdrawals,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      })
    }

    if (action === 'approve') {
      if (!withdrawalId) {
        return NextResponse.json({
          success: false,
          message: 'Withdrawal ID is required'
        }, { status: 400 })
      }

      const withdrawal = await Withdrawal.findOne({ withdrawalId, status: 'pending' })
      if (!withdrawal) {
        return NextResponse.json({
          success: false,
          message: 'Withdrawal request not found or already processed'
        }, { status: 404 })
      }

      // Update withdrawal status
      withdrawal.status = 'approved'
      withdrawal.processedAt = new Date()
      withdrawal.transactionId = transactionId
      if (adminNotes) {
        withdrawal.metadata = { ...withdrawal.metadata, adminNotes }
      }
      await withdrawal.save()
 
      return NextResponse.json({
        success: true,
        message: 'Withdrawal approved successfully'
      })
    }

    if (action === 'reject') {
      if (!withdrawalId || !rejectionReason) {
        return NextResponse.json({
          success: false,
          message: 'Withdrawal ID and rejection reason are required'
        }, { status: 400 })
      }

      const withdrawal = await Withdrawal.findOne({ withdrawalId, status: 'pending' })
      if (!withdrawal) {
        return NextResponse.json({
          success: false,
          message: 'Withdrawal request not found or already processed'
        }, { status: 404 })
      }

      // Update withdrawal status
      withdrawal.status = 'rejected'
      withdrawal.processedAt = new Date()
      withdrawal.rejectionReason = rejectionReason
      if (adminNotes) {
        withdrawal.metadata = { ...withdrawal.metadata, adminNotes }
      }
      await withdrawal.save()

      // Refund amount to user
      const user = await User.findOne({ userId: withdrawal.userId })
      if (user) {
        user.balanceTK += withdrawal.amount
        await user.save()
      }

    

      return NextResponse.json({
        success: true,
        message: 'Withdrawal rejected and amount refunded'
      })
    }

    if (action === 'complete') {
      if (!withdrawalId) {
        return NextResponse.json({
          success: false,
          message: 'Withdrawal ID is required'
        }, { status: 400 })
      }

      const withdrawal = await Withdrawal.findOne({ withdrawalId, status: 'approved' })
      if (!withdrawal) {
        return NextResponse.json({
          success: false,
          message: 'Approved withdrawal request not found'
        }, { status: 404 })
      }

      withdrawal.status = 'completed'
      if (adminNotes) {
        withdrawal.metadata = { ...withdrawal.metadata, adminNotes }
      }
      await withdrawal.save()

      return NextResponse.json({
        success: true,
        message: 'Withdrawal marked as completed'
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Admin withdrawal API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
