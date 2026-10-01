"use server";

import { connectDB } from "@/lib/db";
import { Form } from "@/models/form.model";
import { FormSubmission } from "@/models/form-submission.model";
import { sendEnquiryNotificationEmail, NOTIFICATION_EMAIL } from "@/lib/email";
import { revalidatePath } from "next/cache";

export interface EnquiryInput {
  name: string;
  phone: string;
  email?: string;
  grade?: string;
  message?: string;
}

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface FormResult {
  success?: boolean;
  message?: string;
  error?: string;
  recipientEmail?: string;
}

export async function submitEnquiry(input: EnquiryInput): Promise<FormResult> {
  try {
    const name = input.name?.trim();
    const phone = input.phone?.trim();
    const email = input.email?.trim() || "";
    const grade = input.grade?.trim() || "";
    const message = input.message?.trim() || "";

    if (!name || name.length < 2) {
      return { error: "Please enter your name." };
    }

    if (!phone || phone.replace(/\D/g, "").length < 10) {
      return { error: "Please enter a valid 10-digit mobile number." };
    }

    await connectDB();

    // Find or create the admission enquiry form
    let form = await Form.findOne({ slug: "admission-enquiry" });
    if (!form) {
      form = await Form.create({
        title: "Admission & General Enquiry",
        slug: "admission-enquiry",
        description: "Quick enquiries submitted through the sticky Enquire Now button.",
        status: "published",
        submissionCount: 0,
        fields: [
          { label: "Parent / Student Name", name: "name", type: "text", required: true, order: 0 },
          { label: "Mobile Number", name: "phone", type: "phone", required: true, order: 1 },
          { label: "Email Address", name: "email", type: "email", required: false, order: 2 },
          { label: "Seeking Admission For Grade", name: "grade", type: "select", required: true, order: 3 },
          { label: "Message / Query", name: "message", type: "textarea", required: false, order: 4 },
        ],
      });
    }

    // Create the submission in DB
    await FormSubmission.create({
      form: form._id,
      data: {
        name,
        phone,
        email,
        grade,
        message,
        recipientEmail: NOTIFICATION_EMAIL,
        source: "Sticky Enquire Now Button",
        submittedAt: new Date().toISOString(),
      },
      isRead: false,
      isArchived: false,
    });

    // Increment submission count
    await Form.findByIdAndUpdate(form._id, { $inc: { submissionCount: 1 } });

    // Send email notification to SISNANGAL@gmail.com
    await sendEnquiryNotificationEmail({
      name,
      phone,
      email,
      grade,
      message,
      source: "Sticky Enquire Now Button",
    });

    try {
      revalidatePath("/admin/forms");
    } catch {
      // In standalone or test context, revalidatePath is a no-op
    }

    return {
      success: true,
      message: `Enquiry submitted successfully! A notification has been sent to ${NOTIFICATION_EMAIL}.`,
      recipientEmail: NOTIFICATION_EMAIL,
    };
  } catch (err: unknown) {
    console.error("Error submitting enquiry:", err);
    return {
      error: "Something went wrong while submitting your enquiry. Please call us directly at +91 7568419751.",
    };
  }
}

export async function submitContactMessage(input: ContactInput): Promise<FormResult> {
  try {
    const name = input.name?.trim();
    const email = input.email?.trim();
    const phone = input.phone?.trim() || "";
    const subject = input.subject?.trim() || "General Inquiry";
    const message = input.message?.trim();

    if (!name || !email || !message) {
      return { error: "Please fill in all required fields." };
    }

    await connectDB();

    let form = await Form.findOne({ slug: "contact-form" });
    if (!form) {
      form = await Form.create({
        title: "Contact Us Messages",
        slug: "contact-form",
        description: "Messages submitted via the Contact Us page.",
        status: "published",
        submissionCount: 0,
        fields: [
          { label: "Full Name", name: "name", type: "text", required: true, order: 0 },
          { label: "Email Address", name: "email", type: "email", required: true, order: 1 },
          { label: "Phone", name: "phone", type: "phone", required: false, order: 2 },
          { label: "Subject", name: "subject", type: "text", required: false, order: 3 },
          { label: "Message", name: "message", type: "textarea", required: true, order: 4 },
        ],
      });
    }

    await FormSubmission.create({
      form: form._id,
      data: {
        name,
        email,
        phone,
        subject,
        message,
        recipientEmail: NOTIFICATION_EMAIL,
        source: "Contact Page",
        submittedAt: new Date().toISOString(),
      },
      isRead: false,
      isArchived: false,
    });

    await Form.findByIdAndUpdate(form._id, { $inc: { submissionCount: 1 } });

    // Send email to SISNANGAL@gmail.com
    await sendEnquiryNotificationEmail({
      name,
      phone: phone || "Not provided",
      email,
      grade: subject,
      message,
      source: "Contact Page",
    });

    try {
      revalidatePath("/admin/forms");
    } catch {
      // In standalone or test context, revalidatePath is a no-op
    }

    return {
      success: true,
      message: `Your message has been sent to ${NOTIFICATION_EMAIL}.`,
      recipientEmail: NOTIFICATION_EMAIL,
    };
  } catch (err: unknown) {
    console.error("Error submitting contact form:", err);
    return {
      error: "Failed to send message. Please contact us directly at SISNANGAL@gmail.com or +91 7568419751.",
    };
  }
}
