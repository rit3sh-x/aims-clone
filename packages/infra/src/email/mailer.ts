import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

function createTransporter() {
    return nodemailer.createTransport({
        host: SMTP_HOST || "smtp.gmail.com",
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });
}

interface SendMailParams {
    to: string | string[];
    subject: string;
    html: string;
}

export async function sendMail({ to, subject, html }: SendMailParams) {
    try {
        const transporter = createTransporter();
        const recipients = Array.isArray(to) ? to.join(",") : to;

        const info = await transporter.sendMail({
            from: SMTP_FROM || `"My App" <${SMTP_USER}>`,
            to: recipients,
            subject,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
