import { menuService } from "@/services/menu.service";
import { siteSettingService } from "@/services/settings.service";
import { Container } from "@/components/layout/container";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowRight, Globe } from "lucide-react";
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

  const siteName = (settings.site_name as string) || "Saint Lawrence Public School";
  const headerSubtitle = (settings.header_subtitle as string) || "CBSE Affiliated";
  const tagline = (settings.footer_text as string) || (settings.tagline as string) || "Nurturing Minds, Building Futures";
  const address =
    (settings.address as string) ||
    (settings.contact_address as string) ||
    "Goner Road, Near Ring Road Flyover, Jaipur, Rajasthan 303905";
  const phone =
    (settings.phone as string) ||
    (settings.topbar_phone as string) ||
    (settings.contact_phone as string) ||
    "+91 9216079411, 9216079412";
  const email =
    (settings.email as string) ||
    (settings.topbar_email as string) ||
    (settings.contact_email as string) ||
    "stlawrencegnr@gmail.com";
  const facebook = (settings.facebook as string) || "";
  const twitter = (settings.twitter as string) || "";
  const instagram = (settings.instagram as string) || "";
  const youtube = (settings.youtube as string) || "";
  const linkedin = (settings.linkedin as string) || "";
  const copyrightText = (settings.copyright_text as string) || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;

  const rawLogo = (settings.footer_logo as string) || (settings.header_logo as string) || (settings.logo as string) || "";
  const logo = isValidImageUrl(rawLogo) ? rawLogo.trim() : "";

  return (
    <footer className="bg-[#002a54] text-white mt-auto border-t border-white/10">
      {/* Main Footer */}
      <div className="border-b border-white/10">
        <Container className="py-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: School Info & Logo */}
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
                  <div className="h-12 w-12 rounded-full bg-[#ffb300] flex items-center justify-center text-[#002a54] font-bold text-xl shrink-0">
                    {siteName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg leading-tight">{siteName}</h3>
                  <p className="text-xs text-[#ffb300] uppercase tracking-wider mt-0.5">{headerSubtitle}</p>
                </div>
              </div>
              <p className="text-sm text-white/75 leading-relaxed">{tagline}</p>
              
              {/* Social Media Links */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ffb300] hover:text-[#002a54] transition-all"
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
                    className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ffb300] hover:text-[#002a54] transition-all"
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
                    className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ffb300] hover:text-[#002a54] transition-all"
                    title="Twitter / X"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {youtube && (
                  <a
                    href={youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ffb300] hover:text-[#002a54] transition-all"
                    title="YouTube"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ffb300] hover:text-[#002a54] transition-all"
                    title="LinkedIn"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-[#ffb300] text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2.5">
                {footerItems.slice(0, 8).map((item: IMenuItem, i: number) => (
                  <li key={i}>
                    <Link
                      href={item.url || "#"}
                      target={item.target}
                      className="text-sm text-white/75 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5 group"
                    >
                      <ArrowRight className="h-3 w-3 text-[#ffb300] opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
                {footerItems.length === 0 && (
                  <>
                    <li><Link href="/about" className="text-sm text-white/75 hover:text-white">About School</Link></li>
                    <li><Link href="/academics" className="text-sm text-white/75 hover:text-white">Academic Programs</Link></li>
                    <li><Link href="/admissions" className="text-sm text-white/75 hover:text-white">Admissions 2026-27</Link></li>
                    <li><Link href="/faculty" className="text-sm text-white/75 hover:text-white">Faculty & Staff</Link></li>
                  </>
                )}
              </ul>
            </div>

            {/* Column 3: Important Links */}
            <div>
              <h4 className="font-semibold mb-4 text-[#ffb300] text-sm uppercase tracking-wider">CBSE & Compliance</h4>
              <ul className="space-y-2.5">
                {secondaryItems.slice(0, 8).map((item: IMenuItem, i: number) => (
                  <li key={i}>
                    <Link
                      href={item.url || "#"}
                      target={item.target}
                      className="text-sm text-white/75 hover:text-white hover:translate-x-1 transition-all"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {secondaryItems.length === 0 && (
                  <>
                    <li><Link href="/mandatory-disclosure" className="text-sm text-white/75 hover:text-white">Mandatory Public Disclosure</Link></li>
                    <li><Link href="/admission-guidelines" className="text-sm text-white/75 hover:text-white">Admission Guidelines</Link></li>
                    <li><Link href="/fee-structure" className="text-sm text-white/75 hover:text-white">Fee Structure</Link></li>
                    <li><Link href="/gallery" className="text-sm text-white/75 hover:text-white">Campus Gallery</Link></li>
                  </>
                )}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-[#ffb300] text-sm uppercase tracking-wider">Contact Us</h4>
              <div className="space-y-3.5">
                {address && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 mt-0.5 text-[#ffb300] shrink-0" />
                    <p className="text-sm text-white/75 leading-relaxed">{address}</p>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-[#ffb300] shrink-0" />
                    <a href={`tel:${phone}`} className="text-sm text-white/75 hover:text-white transition-colors">{phone}</a>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-[#ffb300] shrink-0" />
                    <a href={`mailto:${email}`} className="text-sm text-white/75 hover:text-white transition-colors">{email}</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Copyright Bar */}
      <div className="py-4 bg-[#002244]">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-xs text-white/60">{copyrightText}</p>
          <p className="text-xs text-white/40">
            CBSE Affiliated Senior Secondary School
          </p>
        </Container>
      </div>
    </footer>
  );
}
