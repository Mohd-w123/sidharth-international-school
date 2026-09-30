import { menuService } from "@/services/menu.service";
import { siteSettingService } from "@/services/settings.service";
import { Container } from "@/components/layout/container";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Menu,
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

export async function PublicHeader() {
  const menu = await menuService.findByLocation("header");
  const items =
    menu?.items
      ?.filter((i) => i.isEnabled)
      .map((item) => ({
        ...item,
        children: item.children?.filter((c: IMenuItem) => c.isEnabled) || [],
      })) || [];
  const settings = await siteSettingService.getPublicSettings();

  const siteName =
    (settings.site_name as string) || "Siddharth International School";
  const headerSubtitle =
    (settings.header_subtitle as string) ||
    "Co-Educational English Medium School (CBSE Affiliated)";
  const phone =
    (settings.topbar_phone as string) ||
    (settings.phone as string) ||
    "+91 7568419751";
  const phone2 = "+91 7568419752";
  const email =
    (settings.topbar_email as string) ||
    (settings.email as string) ||
    "siddharthinternationalschool15@gmail.com";
  const rawLogo =
    (settings.header_logo as string) || (settings.logo as string) || "";
  const logo = isValidImageUrl(rawLogo) ? rawLogo.trim() : "";

  const showTopbar =
    settings.topbar_show !== false && settings.topbar_show !== "false";
  const showCta =
    settings.topbar_cta_show !== false && settings.topbar_cta_show !== "false";
  const ctaText = (settings.topbar_cta_text as string) || "Apply Now";
  const ctaLink = (settings.topbar_cta_link as string) || "/admissions";

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* 
        MODI WORLD SCHOOL-STYLE TOP BAR
        Dark Red #680000 background with gold icons and essential school helpline
      */}
      {showTopbar && (
        <div className="bg-[#A22965] text-white text-xs py-2 hidden md:block border-b border-white/10">
          <Container className="flex items-center justify-between">
            {/* Left Contact Information */}
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-1.5 text-white/90">
                <MapPin className="h-3.5 w-3.5 text-[#D4A72C] shrink-0" />
                <span>Nangal, Udaipurwati (Jhunjhunu)</span>
              </div>

              {phone && (
                <div className="flex items-center gap-1.5 text-white/90">
                  <Phone className="h-3.5 w-3.5 text-[#D4A72C] shrink-0" />
                  <a
                    href={`tel:${phone}`}
                    className="hover:text-[#D4A72C] transition-colors"
                  >
                    {phone}
                  </a>
                  <span className="text-white/40">/</span>
                  <a
                    href={`tel:${phone2}`}
                    className="hover:text-[#D4A72C] transition-colors"
                  >
                    {phone2}
                  </a>
                </div>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-1.5 text-white/90 hover:text-[#D4A72C] transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-[#D4A72C] shrink-0" />
                  <span className="truncate max-w-[240px]">{email}</span>
                </a>
              )}
            </div>

            {/* Right Affiliation & Fast Links */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-white/80 bg-black/20 px-2.5 py-0.5 rounded-full border border-white/10">
                <ShieldCheck className="h-3.5 w-3.5 text-[#D4A72C]" />
                <span className="text-[11px] font-medium tracking-wide">
                  CBSE Affiliated Senior Secondary
                </span>
              </div>

              <Link
                href="/mandatory-disclosure"
                className="flex items-center gap-1.5 bg-[#D4A72C] hover:bg-[#b88f20] text-[#680000] px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs hover:scale-105"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#680000] animate-pulse" />
                <span>CBSE Disclosure</span>
              </Link>
            </div>
          </Container>
        </div>
      )}

      {/* 
        MODI WORLD SCHOOL-STYLE MAIN NAVBAR
        Crisp pure white background, dark text #1A1A1A, dark red hover #8A0000,
        and high-converting right side "Apply Now" button
      */}
      <nav className="bg-white/98 backdrop-blur-md border-b border-slate-200">
        <Container className="flex items-center justify-between h-20">
          {/* Logo & School Name */}
          <Link href="/" className="flex items-center gap-3.5 py-1 group">
            {logo ? (
              <div className="relative h-13 w-13 rounded-full overflow-hidden bg-white p-0.5 border-2 border-[#A22965]/20 shadow-xs shrink-0 flex items-center justify-center group-hover:border-[#A22965] transition-colors">
                <Image
                  src={logo}
                  alt={siteName}
                  width={52}
                  height={52}
                  className="h-full w-full object-contain"
                  unoptimized={logo.endsWith(".svg")}
                  priority
                />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#A22965] to-[#851e51] flex items-center justify-center text-white font-extrabold text-xl shadow-md shrink-0">
                {siteName.charAt(0)}
              </div>
            )}
            <div>
              <div className="font-extrabold text-lg md:text-xl lg:text-[21px] text-[#A22965] tracking-tight leading-tight group-hover:text-[#851e51] transition-colors">
                {siteName}
              </div>
              <div className="text-[10px] md:text-[11px] text-[#1A1A1A]/70 font-bold uppercase tracking-wider mt-0.5">
                {headerSubtitle}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {items.map((item: IMenuItem, i: number) => {
              const enabledChildren =
                item.children?.filter((c: IMenuItem) => c.isEnabled) || [];
              const hasChildren = enabledChildren.length > 0;
              const isMandatoryDisclosure =
                item.label?.toLowerCase().includes("disclosure") ||
                item.url?.toLowerCase().includes("mandatory-disclosure");

              return (
                <div key={i} className="relative group">
                  <Link
                    href={item.url || "#"}
                    target={item.target}
                    className={
                      isMandatoryDisclosure
                        ? "flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#851e51] bg-[#D4A72C]/20 hover:bg-[#D4A72C] hover:text-[#591036] border-2 border-[#D4A72C] rounded-full shadow-xs hover:shadow-md transition-all hover:scale-105 active:scale-95 mx-0.5"
                        : "flex items-center gap-1 px-3 py-2 text-sm font-semibold text-[#1A1A1A] hover:text-[#A22965] hover:bg-slate-50 rounded-md transition-colors"
                    }
                  >
                    {isMandatoryDisclosure && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A72C] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A22965]"></span>
                      </span>
                    )}
                    <span>{item.label}</span>
                    {hasChildren && (
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180 ${
                          isMandatoryDisclosure
                            ? "text-[#851e51]"
                            : "text-slate-400 group-hover:text-[#A22965]"
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {hasChildren && (
                    <div className="absolute top-full left-0 pt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 min-w-[220px] py-2 overflow-hidden border-t-2 border-t-[#A22965]">
                        {enabledChildren.map((child: IMenuItem, ci: number) => (
                          <Link
                            key={ci}
                            href={child.url || "#"}
                            target={child.target}
                            className="block px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#A22965]/8 hover:text-[#A22965] font-medium transition-colors border-l-2 border-transparent hover:border-[#A22965]"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Action: Apply Now CTA & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {showCta && (
              <Link
                href={ctaLink}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#A22965] hover:bg-[#851e51] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <span>{ctaText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <MobileMenuToggle items={items} ctaText={ctaText} ctaLink={ctaLink} phone={phone} />
          </div>
        </Container>
      </nav>
    </header>
  );
}

function MobileMenuToggle({
  items,
  ctaText,
  ctaLink,
  phone,
}: {
  items: IMenuItem[];
  ctaText: string;
  ctaLink: string;
  phone: string;
}) {
  return (
    <div className="lg:hidden">
      <details className="group">
        <summary className="list-none cursor-pointer p-2 text-[#1A1A1A] hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
          <Menu className="h-6 w-6" />
        </summary>
        <div className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-slate-200 z-50 max-h-[85vh] overflow-y-auto">
          <Container className="py-5 space-y-4">
            <div className="space-y-1">
              {items.map((item: IMenuItem, i: number) => {
                const isMandatoryDisclosure =
                  item.label?.toLowerCase().includes("disclosure") ||
                  item.url?.toLowerCase().includes("mandatory-disclosure");
                return (
                  <div key={i} className="border-b border-slate-100 pb-1">
                    <Link
                      href={item.url || "#"}
                      target={item.target}
                      className={
                        isMandatoryDisclosure
                          ? "flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-[#851e51] bg-[#D4A72C]/20 border border-[#D4A72C] rounded-lg transition-colors my-1"
                          : "block px-3 py-2.5 text-sm font-bold text-[#1A1A1A] hover:text-[#A22965] hover:bg-slate-50 rounded-md transition-colors"
                      }
                    >
                      <div className="flex items-center gap-2">
                        {isMandatoryDisclosure && (
                          <span className="h-2 w-2 rounded-full bg-[#A22965]" />
                        )}
                        <span>{item.label}</span>
                      </div>
                      {isMandatoryDisclosure && (
                        <span className="text-[10px] font-bold bg-[#A22965] text-white px-2 py-0.5 rounded">
                          CBSE
                        </span>
                      )}
                    </Link>
                  {item.children
                    ?.filter((c: IMenuItem) => c.isEnabled)
                    .map((child: IMenuItem, ci: number) => (
                      <Link
                        key={ci}
                        href={child.url || "#"}
                        target={child.target}
                        className="block px-6 py-2 text-xs font-medium text-slate-600 hover:text-[#A22965] hover:bg-slate-50 rounded-md transition-colors"
                      >
                        • {child.label}
                      </Link>
                    ))}
                </div>
              );
            })}
            </div>

            <div className="pt-2 space-y-2.5">
              <Link
                href={ctaLink}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#A22965] text-white font-bold text-sm shadow-md"
              >
                <span>{ctaText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-slate-300 text-[#1A1A1A] font-semibold text-xs bg-slate-50"
                >
                  <Phone className="h-3.5 w-3.5 text-[#A22965]" />
                  <span>Call Helpline: {phone}</span>
                </a>
              )}
            </div>
          </Container>
        </div>
      </details>
    </div>
  );
}
