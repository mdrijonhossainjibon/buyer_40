import { AuthOptions } from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import Admin from '@/lib/models/Admin'
import mongoose from 'mongoose'
import { generateOTP, sendOTPEmail, sendLoginSuccessEmail } from '@/lib/emailService'

// Extend NextAuth types
declare module 'next-auth' {
    interface User {
      token?: string
      role?: string
      adminId?: string
    }
    
    interface Session {
      accessToken?: string
      user: {
        id?: string
        name?: string | null
        email?: string | null
        image?: string | null
        role?: string
        adminId?: string
      }
    }
  }
  
export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      GoogleProvider({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      CredentialsProvider({
        name: 'credentials',
        credentials: {
          username: { label: 'Username', type: 'text' },
          password: { label: 'Password', type: 'password' },
          otp: { label: 'OTP', type: 'text', optional: true }
        },
        async authorize(credentials) {
          if (!credentials?.username || !credentials?.password) {
            throw new Error('Username and password are required')
          }
  
          try {
            // Connect to MongoDB if not already connected
            if (mongoose.connection.readyState !== 1) {
              await mongoose.connect(process.env.MONGODB_URI!)
            }
  
            // Find admin by username or email
            const admin = await Admin.findOne({
              $or: [
                { username: credentials.username },
                { email: credentials.username }
              ],
              status: 'active'
            })
   
            if (!admin) {
              throw new Error('Invalid credentials: User not found or inactive')
            }
  
            // Validate password
            if (admin.password !== credentials.password) {
              throw new Error('Invalid credentials: Incorrect password')
            }
  
            // For super_admin, generate and send OTP if not provided
            if (admin.role === 'super_admin' && !credentials.otp) {
              const otp = generateOTP()
              const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
              
              // Save OTP to admin record
              admin.otp = otp
              admin.otpExpiry = otpExpiry
              await admin.save()
              
              // Send OTP email
              const emailSent = await sendOTPEmail({
                to: admin.email,
                username: admin.username,
                otp: otp
              })
              
              if (!emailSent) {
                throw new Error('Failed to send OTP email. Please try again.')
              }
              
              throw new Error('OTP_REQUIRED')
            }
       
            // Check if OTP is required and validate it
            if (credentials.otp) {
              if (!admin.otp || admin.otp !== credentials.otp) {
                throw new Error('Invalid OTP: OTP is incorrect or not set')
              }
              if (admin.otpExpiry && new Date() > admin.otpExpiry) {
                throw new Error('Invalid OTP: OTP has expired')
              }
              // Clear OTP after successful validation
              admin.otp = undefined
              admin.otpExpiry = undefined
            }
  
            // Update last login
            admin.lastLogin = new Date()
            await admin.save()
  
            // Send login success email notification
            try {
              await sendLoginSuccessEmail({
                to: admin.email,
                username: admin.username,
                loginTime: new Date()
              })
            } catch (emailError) {
              console.error('Failed to send login success email:', emailError)
              // Don't fail the login if email sending fails
            }
  
            // Return user object for successful authentication
            return {
              id: admin._id.toString(),
              name: admin.username,
              email: admin.email,
              role: admin.role,
              adminId: admin._id.toString(),
              token: admin._id.toString() // You might want to generate a proper JWT token here
            }
          } catch (error) {
            throw error
          }
        }
      })
    ],
    callbacks: {
      async jwt({ token, user, account }: any) {
        if (user) {
          token.accessToken = user.token
          token.role = user.role
          token.adminId = user.adminId
        }
        if (account?.provider === 'google') {
          // Handle Google OAuth - check if admin exists with this email
          try {
            // Connect to MongoDB if not already connected
            if (mongoose.connection.readyState !== 1) {
              await mongoose.connect(process.env.MONGODB_URI!)
            }
  
            const admin = await Admin.findOne({
              email: user.email,
              status: 'active'
            })
  
            if (admin) {
              // Update last login for Google OAuth
              admin.lastLogin = new Date()
              await admin.save()
   
            }
          } catch (error) {
            console.error('Google auth error:', error)
          }
        }
        return token
      },
      async session({ session, token }: any) {
        session.accessToken = token.accessToken as string
        if (session.user) {
          session.user.role = token.role as string
          session.user.adminId = token.adminId as string
        }
        return session
      }
    },
    pages: {
      signIn: '/login',
    },
    session: {
      strategy: 'jwt' as const,
    },
  }