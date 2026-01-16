import { sendMail } from "./mailer";

const APP_NAME = "AIMS Portal";
const BRAND_COLOR = "#2563EB";

function getStyledHtml(heading: string, contentHtml: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background-color: ${BRAND_COLOR}; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; background-color: ${BRAND_COLOR}; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
        .otp-box { background-color: #f0fdf4; border: 1px dashed #16a34a; color: #15803d; font-size: 32px; font-weight: 800; letter-spacing: 5px; text-align: center; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${APP_NAME}</h1>
        </div>
        <div class="content">
          <h2 style="color: #111827; margin-top: 0;">${heading}</h2>
          ${contentHtml}
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendPasswordResetEmail(email: string, otp: string) {
    const content = `
    <p>Hello,</p>
    <p>We received a request to reset your password.</p>

    <p>Enter the following One-Time Password (OTP) to continue. This code is valid for <strong>5 minutes</strong>.</p>

    <div class="otp-box">${otp}</div>

    <p style="margin-top:16px;">
      If you did not request a password reset, please ignore this email.
    </p>
  `;

    return sendMail({
        to: email,
        subject: `Your ${APP_NAME} password reset code`,
        html: getStyledHtml("Reset Your Password", content),
    });
}

export async function sendLoginOTP(email: string, otp: string) {
    const content = `
    <p>Hello,</p>
    <p>Use the following One-Time Password (OTP) to log in to your account. This code is valid for <strong>5 minutes</strong>.</p>
    
    <div class="otp-box">${otp}</div>
    
    <p>Do not share this code with anyone.</p>
  `;

    return sendMail({
        to: email,
        subject: `Your Login Code - ${otp}`,
        html: getStyledHtml("Verify Your Identity", content),
    });
}

export async function sendBackupCodesEmail(email: string, codes: string[]) {
    const content = `
    <p>Hello,</p>
    <p>Two-Factor Authentication has been enabled for your account.</p>

    <p>
      Below are your <strong>one-time backup codes</strong>.  
      Use these only if you lose access to your email or authenticator app.
    </p>

    <div style="
      background:#f9fafb;
      border:1px solid #e5e7eb;
      border-radius:8px;
      padding:20px;
      font-size:16px;
      font-weight:600;
      letter-spacing:2px;
      line-height:2;
      text-align:center;
      margin:20px 0;
      color:#111827;
    ">
      ${codes.map((c) => `<div>${c}</div>`).join("")}
    </div>

    <p style="color:#dc2626; font-weight:600;">
      Each code can be used only once.  
      Save them securely — we will never show them again.
    </p>
  `;

    return sendMail({
        to: email,
        subject: `${APP_NAME} Backup Codes – Save These Now`,
        html: getStyledHtml("Your Account Backup Codes", content),
    });
}

// TODO: course opened, course approval
