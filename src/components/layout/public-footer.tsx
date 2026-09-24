import { menuService } from "@/services/menu.service";
import { siteSettingService } from "@/services/settings.service";
import { Container } from "@/components/layout/container";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import type { IMenuItem } from "@/models/menu.model";

function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (trimmed.length < 3) return false;
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  );
}

export async function PublicFooter() {
  const footerMenu = await menuService.findByLocation("footer");
  const secondaryMenu = await menuService.findByLocation("secondary");
  const footerItems =
    footerMenu?.items?.filter(
      (i) =>
        i.isEnabled &&
        !i.label?.toLowerCase().includes("transfer certificate") &&
        !i.label?.toLowerCase().includes("tc") &&
        !i.url?.toLowerCase().includes("tc-tracker")
    ) || [];
  const secondaryItems =
    secondaryMenu?.items?.filter(
      (i) =>
        i.isEnabled &&
        !i.label?.toLowerCase().includes("transfer certificate") &&
        !i.label?.toLowerCase().includes("tc") &&
        !i.url?.toLowerCase().includes("tc-tracker")
    ) || [];
  const settings = await siteSettingService.getPublicSettings();

  const siteName =
    (settings.site_name as string) || "Siddharth International School";
  const headerSubtitle =
    (settings.header_subtitle as string) ||
    "Co-Educational English Medium School (CBSE)";
  const address =
    (settings.address as string) ||
    (settings.contact_address as string) ||
    "Sikar Road, Tehsil Nangal, Udaipurwati, Dist. Jhunjhunu, Rajasthan 333307";
  const phone =
    (settings.phone as string) ||
    (settings.topbar_phone as string) ||
    (settings.contact_phone as string) ||
    "+91 7568419751";
  const phone2 = "+91 7568419752";
  const email =
    (settings.email as string) ||
    (settings.topbar_email as string) ||
    (settings.contact_email as string) ||
    "siddharthinternationalschool15@gmail.com";
  const facebook =
    (settings.facebook as string) ||
    "https://www.facebook.com/people/Siddharth-International-School/100078106855197/";
  const twitter = (settings.twitter as string) || "";
  const instagram = (settings.instagram as string) || "";
  const youtube = (settings.youtube as string) || "";
  const copyrightText =
    (settings.copyright_text as string) ||
    `© ${new Date().getFullYear()} ${siteName}, Nangal, Udaipurwati. All rights reserved.`;

  const rawLogo =
    (settings.footer_logo as string) ||
    (settings.header_logo as string) ||
    (settings.logo as string) ||
    "";
  const logo = isValidImageUrl(rawLogo) ? rawLogo.trim() : "";

  return (
    <footer className="mt-auto flex flex-col">
      {/* 
        MODI WORLD SCHOOL-STYLE PRE-FOOTER CTA RIBBON
        High-converting callout with admissions banner & quick contact
      */}
      <div className="bg-gradient-to-r from-[#8A0000] via-[#A30000] to-[#8A0000] text-white py-10 sm:py-12 border-b border-white/10 relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

        <Container className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#D4A72C] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Admissions Open for Session 2026–27</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Begin Your Child’s Journey of Excellence Today
            </h2>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed">
              Providing holistic CBSE education, smart digital learning, sports facilities, and strong moral values in Nangal, Udaipurwati.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/admissions"
              className="px-7 py-3.5 rounded-md bg-[#D4A72C] hover:bg-[#b88f20] text-[#1A1A1A] font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Apply Online Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`tel:${phone}`}
              className="px-6 py-3.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm transition-all hover:border-white flex items-center gap-2"
            >
              <Phone className="h-4 w-4 text-[#D4A72C]" />
              <span>Call: {phone}</span>
            </a>
          </div>
        </Container>
      </div>

      {/* 
        MODI WORLD SCHOOL-STYLE MAIN FOOTER BODY
        Dark Red #680000 background, 4 structured columns with gold headings
      */}
      <div className="bg-[#680000] text-white py-14 sm:py-16 border-b border-white/10">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: School Identity & Leadership */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                {logo ? (
                  <div className="relative h-14 w-14 rounded-full overflow-hidden bg-white/10 p-1 border border-white/20 shrink-0 flex items-center justify-center">
                    <Image
                      src={logo}
                      alt={siteName}
                      width={56}
                      height={56}
                      className="h-full w-full object-contain"
                      unoptimized={logo.endsWith(".svg")}
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-[#D4A72C] flex items-center justify-center text-[#680000] font-bold text-xl shrink-0">
                    {siteName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-lg leading-tight tracking-tight">
                    {siteName}
                  </h3>
                  <p className="text-xs text-[#D4A72C] font-semibold uppercase tracking-wider mt-0.5">
                    {headerSubtitle}
                  </p>
                </div>
              </div>

              <p className="text-sm text-white/80 leading-relaxed">
                A Premier CBSE Affiliated Co-Educational English Medium Institution in Nangal, Udaipurwati, dedicated to academic brilliance, moral integrity, and all-round leadership.
              </p>

              {/* Leadership Box */}
              <div className="pt-2 border-t border-white/10 text-xs text-white/75 space-y-1">
                <p>
                  <span className="text-[#D4A72C] font-semibold">Chairman:</span>{" "}
                  Mr. Ajeet Singh Shekhawat
                </p>
                <p>
                  <span className="text-[#D4A72C] font-semibold">Director:</span>{" "}
                  Mr. Pradhuman Singh Shekhawat
                </p>
                <p>
                  <span className="text-[#D4A72C] font-semibold">Principal:</span>{" "}
                  Mrs. Sunita Rathore
                </p>
              </div>

              {/* Social Media Links */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4A72C] hover:text-[#680000] transition-all"
                    title="Facebook"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4A72C] hover:text-[#680000] transition-all"
                    title="Instagram"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
                {twitter && (
                  <a
                    href={twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4A72C] hover:text-[#680000] transition-all"
                    title="Twitter"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {youtube && (
                  <a
                    href={youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4A72C] hover:text-[#680000] transition-all"
                    title="YouTube"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-[#D4A72C] text-sm uppercase tracking-wider flex items-center gap-2">
                <span>Quick Navigation</span>
              </h4>
              <ul className="space-y-2.5">
                {footerItems.length > 0 ? (
                  footerItems.slice(0, 7).map((item: IMenuItem, i: number) => (
                    <li key={i}>
                      <Link
                        href={item.url || "#"}
                        target={item.target}
                        className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group"
                      >
                        <ArrowRight className="h-3.5 w-3.5 text-[#D4A72C] opacity-70 group-hover:opacity-100 transition-opacity" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <Link href="/about" className="text-sm text-white/80 hover:text-white inline-flex items-center gap-2">
                        <ArrowRight className="h-3.5 w-3.5 text-[#D4A72C]" />
                        <span>About School</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/academics" className="text-sm text-white/80 hover:text-white inline-flex items-center gap-2">
                        <ArrowRight className="h-3.5 w-3.5 text-[#D4A72C]" />
                        <span>Academic Curriculum</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/admissions" className="text-sm text-white/80 hover:text-white inline-flex items-center gap-2">
                        <ArrowRight className="h-3.5 w-3.5 text-[#D4A72C]" />
                        <span>Admissions 2026–27</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/gallery" className="text-sm text-white/80 hover:text-white inline-flex items-center gap-2">
                        <ArrowRight className="h-3.5 w-3.5 text-[#D4A72C]" />
                        <span>Campus Gallery</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/news" className="text-sm text-white/80 hover:text-white inline-flex items-center gap-2">
                        <ArrowRight className="h-3.5 w-3.5 text-[#D4A72C]" />
                        <span>Latest Events & News</span>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Column 3: CBSE Mandatory Disclosures & Documents */}
            <div>
              <h4 className="font-bold mb-4 text-[#D4A72C] text-sm uppercase tracking-wider flex items-center gap-2">
                <span>CBSE & Compliance</span>
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/mandatory-disclosure"
                    className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-[#D4A72C] opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span>Mandatory Public Disclosure</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mandatory-disclosure"
                    className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-[#D4A72C] opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span>School Management Committee</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fee-structure"
                    className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-[#D4A72C] opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span>Fee Structure (2026-27)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mandatory-disclosure"
                    className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-[#D4A72C] opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span>Academic Calendar & Holidays</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mandatory-disclosure"
                    className="text-sm text-white/80 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-[#D4A72C] opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span>Building & Fire Safety</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Campus Visit */}
            <div>
              <h4 className="font-bold mb-4 text-[#D4A72C] text-sm uppercase tracking-wider flex items-center gap-2">
                <span>Campus & Contact</span>
              </h4>
              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 mt-0.5 text-[#D4A72C] shrink-0" />
                  <p className="text-white/80 leading-relaxed">{address}</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-[#D4A72C] shrink-0" />
                  <div className="text-white/80">
                    <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                      {phone}
                    </a>
                    {" / "}
                    <a href={`tel:${phone2}`} className="hover:text-white transition-colors">
                      {phone2}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-[#D4A72C] shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="text-white/80 hover:text-white transition-colors truncate max-w-[220px]"
                  >
                    {email}
                  </a>
                </div>

                <div className="flex items-start gap-2.5 pt-1 text-xs text-white/70">
                  <Clock className="h-4 w-4 text-[#D4A72C] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white/90">Visiting Hours:</p>
                    <p>Mon – Sat: 8:00 AM – 2:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 
        MODI WORLD SCHOOL-STYLE BOTTOM COPYRIGHT BAR
        Deep dark red #520000 background with affiliation verification
      */}
      <div className="py-4 bg-[#520000] text-white/75 text-xs border-t border-white/5">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>{copyrightText}</p>
          <div className="flex items-center gap-3 text-white/60">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#D4A72C]" />
              <span>CBSE Affiliated Senior Secondary</span>
            </span>
            <span>•</span>
            <Link href="/mandatory-disclosure" className="hover:text-white transition-colors">
              Mandatory Disclosures
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
