import { siteSettingService } from "@/services/settings.service";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Globe, Send } from "lucide-react";
import type { Metadata } from "next";
import { ContactFormClient } from "@/features/contact/components/contact-form-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our school. Find our address, phone numbers, email, and office hours.",
};

export default async function ContactPage() {
  const settings = await siteSettingService.getPublicSettings();

  const siteName = (settings.site_name as string) || "St. Lawrence School";
  const address = (settings.address as string) || "123 School Road, City, State - 100001";
  const phone = (settings.phone as string) || "+91 1234567890";
  const email = (settings.email as string) || "info@school.edu";
  const website = (settings.website as string) || "";
  const mapUrl = (settings.google_map_embed as string) || "";
  const officeHours = (settings.office_hours as string) || "Mon–Fri: 8:00 AM – 3:30 PM | Sat: 8:00 AM – 12:00 PM";

  return (
    <main>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#003d78] to-[#002a54] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffb300] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffb300] rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <Container className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            We&apos;d love to hear from you. Reach out with any questions about admissions, academics, or general inquiries.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">{siteName}</h2>
              <p className="text-muted-foreground text-sm">Get in touch with us</p>
            </div>

            <div className="space-y-4">
              <ContactInfoItem icon={<MapPin className="h-5 w-5" />} label="Address" value={address} />
              <ContactInfoItem icon={<Phone className="h-5 w-5" />} label="Phone" value={phone} href={`tel:${phone}`} />
              <ContactInfoItem icon={<Mail className="h-5 w-5" />} label="Email" value={email} href={`mailto:${email}`} />
              {website && <ContactInfoItem icon={<Globe className="h-5 w-5" />} label="Website" value={website} href={website} />}
              <ContactInfoItem icon={<Clock className="h-5 w-5" />} label="Office Hours" value={officeHours} />
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <a href={`tel:${phone}`} className="group">
                <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-[#003d78]">
                  <CardContent className="p-4 text-center">
                    <Phone className="h-6 w-6 mx-auto mb-2 text-[#003d78] group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium">Call Us</p>
                  </CardContent>
                </Card>
              </a>
              <a href={`mailto:${email}`} className="group">
                <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-[#ffb300]">
                  <CardContent className="p-4 text-center">
                    <Mail className="h-6 w-6 mx-auto mb-2 text-[#ffb300] group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium">Email Us</p>
                  </CardContent>
                </Card>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-t-4 border-t-[#003d78]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-[#003d78]" /> Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContactFormClient />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map */}
        {mapUrl && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#ffb300] rounded-full" /> Find Us on the Map
            </h2>
            <div className="rounded-xl overflow-hidden shadow-lg border">
              <iframe
                src={mapUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location"
              />
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}

function ContactInfoItem({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  return (
    <div className="flex items-start gap-3 group">
      <div className="h-10 w-10 rounded-lg bg-[#003d78]/10 flex items-center justify-center text-[#003d78] shrink-0 group-hover:bg-[#003d78] group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase font-semibold">{label}</p>
        {href ? (
          <a href={href} className="text-sm font-medium hover:text-[#003d78] transition-colors">{value}</a>
        ) : (
          <p className="text-sm font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}
