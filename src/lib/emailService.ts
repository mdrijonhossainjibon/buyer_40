import nodemailer from 'nodemailer'

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

interface OTPEmailData {
  to: string
  username: string
  otp: string
}

interface LoginSuccessEmailData {
  to: string
  username: string
  loginTime: Date
  ipAddress?: string
  userAgent?: string
}

// Create transporter with email configuration
const createTransporter = () => {
  const config: EmailConfig = {
    host: process.env.EMAIL_HOST || 'mail.mdrijonhossajibon.shop',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || 'noreply@mdrijonhossajibon.shop',
      pass: process.env.EMAIL_PASS || 'noreply@mdrijonhossajibon.shop'
    }
  }

  return nodemailer.createTransport(config)
}

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP email
export const sendOTPEmail = async (data: OTPEmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `noreply@mdrijonhossajibon.shop`,
      to: data.to,
      subject: 'Login OTP Verification - EarnFromAds BD',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">EarnFromAds BD</h1>
              <p style="color: #666; margin: 5px 0;">Admin Login Verification</p>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #333; margin-bottom: 15px;">Hello ${data.username}!</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                You are attempting to log in to your admin account. Please use the OTP below to complete your login:
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; display: inline-block;">
                <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code:</p>
                <h1 style="margin: 10px 0; color: #2563eb; font-size: 36px; letter-spacing: 5px; font-weight: bold;">
                  ${data.otp}
                </h1>
              </div>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="color: #ef4444; font-size: 14px; margin: 0;">
                ⚠️ This OTP will expire in 10 minutes
              </p>
              <p style="color: #666; font-size: 14px; margin: 10px 0;">
                If you didn't request this login, please ignore this email.
              </p>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} EarnFromAds BD. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        EarnFromAds BD - Admin Login Verification
        
        Hello ${data.username}!
        
        You are attempting to log in to your admin account.
        Your OTP Code: ${data.otp}
        
        This OTP will expire in 10 minutes.
        If you didn't request this login, please ignore this email.
        
        © ${new Date().getFullYear()} EarnFromAds BD. All rights reserved.
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('OTP email sent successfully:', result.messageId)
    return true
  } catch (error) {

    console.error('Failed to send OTP email:', error)
    return false
  }
}

// Send login success notification email
export const sendLoginSuccessEmail = async (data: LoginSuccessEmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter()
    
    const loginTimeFormatted = data.loginTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })

    const mailOptions = {
      from: `noreply@mdrijonhossajibon.shop`,
      to: data.to,
      subject: 'Successful Login Notification - EarnFromAds BD',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">EarnFromAds BD</h1>
              <p style="color: #666; margin: 5px 0;">Login Notification</p>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background-color: #dcfce7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #16a34a; margin: 0; font-size: 24px;">✅ Login Successful</h2>
              </div>
              <h3 style="color: #333; margin-bottom: 15px;">Hello ${data.username}!</h3>
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                You have successfully logged in to your EarnFromAds BD admin account.
              </p>
            </div>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #374151; margin: 0 0 15px 0;">Login Details:</h4>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Time:</td>
                  <td style="padding: 8px 0; color: #374151;">${loginTimeFormatted}</td>
                </tr>
                ${data.ipAddress ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">IP Address:</td>
                  <td style="padding: 8px 0; color: #374151;">${data.ipAddress}</td>
                </tr>
                ` : ''}
                ${data.userAgent ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Device:</td>
                  <td style="padding: 8px 0; color: #374151;">${data.userAgent}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="color: #ef4444; font-size: 14px; margin: 0;">
                🔒 If this wasn't you, please contact support immediately
              </p>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} EarnFromAds BD. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        EarnFromAds BD - Login Notification
        
        Hello ${data.username}!
        
        You have successfully logged in to your EarnFromAds BD admin account.
        
        Login Details:
        Time: ${loginTimeFormatted}
        ${data.ipAddress ? `IP Address: ${data.ipAddress}` : ''}
        ${data.userAgent ? `Device: ${data.userAgent}` : ''}
        
        If this wasn't you, please contact support immediately.
        
        © ${new Date().getFullYear()} EarnFromAds BD. All rights reserved.
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Login success email sent successfully:', result.messageId)
    return true
  } catch (error) {
    console.error('Failed to send login success email:', error)
    return false
  }
}

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('Email configuration verified successfully')
    return true
  } catch (error) {
    console.error('Email configuration verification failed:', error)
    return false
  }
}
