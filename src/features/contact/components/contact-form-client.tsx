"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

export function ContactFormClient() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields");
      return;
    }
    startTransition(async () => {
      // In a real implementation, this would call a server action to save the contact form
      // For now, we simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      toast.success("Message sent successfully!");
    });
  };

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold">Thank You!</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Your message has been sent successfully. We&apos;ll get back to you within 24–48 hours.
        </p>
        <Button variant="outline" onClick={() => { setSubmitted(false); setName(""); setEmail(""); setPhone(""); setMessage(""); }}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name <span className="text-red-500">*</span></Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
        </div>
        <div className="space-y-2">
          <Label>Email Address <span className="text-red-500">*</span></Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" />
        </div>
        <div className="space-y-2">
          <Label>Subject</Label>
          <Select value={subject} onValueChange={(v) => setSubject(v || "general")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Inquiry</SelectItem>
              <SelectItem value="admissions">Admissions</SelectItem>
              <SelectItem value="academics">Academics</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="fees">Fees & Payments</SelectItem>
              <SelectItem value="complaints">Complaints</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Message <span className="text-red-500">*</span></Label>
        <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message here..." rows={5} required />
      </div>
      <Button type="submit" disabled={isPending} className="w-full bg-[#003d78] hover:bg-[#002a54] text-white h-11">
        {isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</> : <><Send className="h-4 w-4 mr-2" /> Send Message</>}
      </Button>
    </form>
  );
}
