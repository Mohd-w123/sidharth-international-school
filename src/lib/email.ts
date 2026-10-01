import nodemailer from "nodemailer";

export const NOTIFICATION_EMAIL = process.env.ENQUIRY_NOTIFICATION_EMAIL || "SISNANGAL@gmail.com";

interface SendEnquiryEmailParams {
  name: string;
  phone: string;
  email?: string;
  grade?: string;
  message?: string;
  source?: string;
}

/**
 * Creates a nodemailer transporter if SMTP credentials exist in environment variables.
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Sends an enquiry notification email to SISNANGAL@gmail.com
 */
export async function sendEnquiryNotificationEmail(data: SendEnquiryEmailParams) {
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const transporter = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #680000, #8A0000); color: #ffffff; padding: 24px; border-bottom: 3px solid #D4A72C; }
        .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; }
        .header p { margin: 0; font-size: 13px; opacity: 0.9; }
        .content { padding: 24px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        .table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .table td.label { font-weight: 600; color: #64748b; width: 35%; background: #f8fafc; }
        .table td.value { font-weight: 500; color: #0f172a; }
        .cta-box { margin-top: 24px; text-align: center; padding: 16px; background: #fdf2f7; border-radius: 8px; border: 1px solid #fbcfe8; }
        .cta-btn { display: inline-block; background: #680000; color: #ffffff !important; text-decoration: none; padding: 10px 22px; border-radius: 6px; font-weight: 600; font-size: 13px; }
        .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Admission Enquiry Received</h1>
          <p>Siddharth International School, Nangal, Udaipurwati</p>
        </div>
        <div class="content">
          <p style="font-size: 14px; margin-top: 0; color: #475569;">
            A new parent/student has submitted an enquiry via the school website.
          </p>

          <table class="table">
            <tr>
              <td class="label">Parent / Student</td>
              <td class="value"><strong>${data.name}</strong></td>
            </tr>
            <tr>
              <td class="label">Mobile Number</td>
              <td class="value"><a href="tel:${data.phone}" style="color: #680000; font-weight: 600;">${data.phone}</a></td>
            </tr>
            <tr>
              <td class="label">Seeking Grade</td>
              <td class="value"><strong>${data.grade || "Not Specified"}</strong></td>
            </tr>
            <tr>
              <td class="label">Email Address</td>
              <td class="value">${data.email ? `<a href="mailto:${data.email}">${data.email}</a>` : "Not provided"}</td>
            </tr>
            <tr>
              <td class="label">Message / Query</td>
              <td class="value">${data.message ? data.message.replace(/\n/g, "<br>") : "None"}</td>
            </tr>
            <tr>
              <td class="label">Source</td>
              <td class="value">${data.source || "Website Enquiry Form"}</td>
            </tr>
            <tr>
              <td class="label">Date &amp; Time</td>
              <td class="value">${timestamp}</td>
            </tr>
          </table>

          <div class="cta-box">
            <a href="tel:${data.phone}" class="cta-btn">📞 Call Parent Directly</a>
          </div>
        </div>
        <div class="footer">
          Notification sent to official school email: ${NOTIFICATION_EMAIL}
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.warn(`[ENQUIRY EMAIL] Transporter not configured. Form details for ${NOTIFICATION_EMAIL}:`, {
      to: NOTIFICATION_EMAIL,
      subject: `New Enquiry: ${data.name} - ${data.grade || "Admission"}`,
      parent: data.name,
      phone: data.phone,
      grade: data.grade,
      email: data.email,
      message: data.message,
      time: timestamp,
    });
    return { success: false, reason: "smtp_not_configured" };
  }

  try {
    const fromAddress = process.env.SMTP_FROM || `"Siddharth School Admissions" <${process.env.SMTP_USER || NOTIFICATION_EMAIL}>`;
    const info = await transporter.sendMail({
      from: fromAddress,
      to: NOTIFICATION_EMAIL,
      replyTo: data.email || undefined,
      subject: `[New Enquiry] ${data.name} - Grade: ${data.grade || "General"} (${data.phone})`,
      html: htmlContent,
      text: `New Enquiry for Siddharth International School:\n\nName: ${data.name}\nPhone: ${data.phone}\nGrade: ${data.grade}\nEmail: ${data.email || "N/A"}\nMessage: ${data.message || "N/A"}\nTime: ${timestamp}`,
    });

    console.log(`[ENQUIRY EMAIL] Successfully dispatched to ${NOTIFICATION_EMAIL}, messageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[ENQUIRY EMAIL] Failed to send email to ${NOTIFICATION_EMAIL}:`, error);
    return { success: false, error };
  }
}
