import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Globe2,
  Landmark,
  Menu,
  Phone,
  ShieldCheck,
  UserRoundCheck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import bhindChambal from "@/assets/citizen-bhind-chambal.jpg";
import bhindCivic from "@/assets/citizen-bhind-civic.jpg";
import gwaliorDevelopment from "@/assets/citizen-gwalior-development.jpg";
import gwaliorFort from "@/assets/citizen-gwalior-fort.jpg";
import morenaBateshwar from "@/assets/citizen-morena-bateshwar.jpg";
import morenaDevelopment from "@/assets/citizen-morena-development.jpg";
import bhindCollector from "@/assets/bhind-collector.jpeg";
import gwaliorCollector from "@/assets/gwalior-collector.jpeg";
import morenaCollector from "@/assets/morena-collector.jpeg";
import vikasSetuLogo from "@/assets/vikassetu-logo.png";
import { OfficialReportConsole } from "@/components/official-report-console";
import { Button } from "@/components/ui/button";
import type { District } from "@/lib/report-store";

type Language = "en" | "hi" | "mr" | "bn" | "ta";
const districtNames: Record<Language, Record<District, string>> = {
  en: { gwalior: "Gwalior", bhind: "Bhind", morena: "Morena" },
  hi: { gwalior: "ग्वालियर", bhind: "भिंड", morena: "मुरैना" },
  mr: { gwalior: "ग्वाल्हेर", bhind: "भिंड", morena: "मुरैना" },
  bn: { gwalior: "গোয়ালিয়র", bhind: "ভিন্ড", morena: "মুরেনা" },
  ta: { gwalior: "குவாலியர்", bhind: "பிண்ட்", morena: "முரைனா" },
};
const languageNames: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  mr: "मराठी",
  bn: "বাংলা",
  ta: "தமிழ்",
};
const districtData = {
  gwalior: {
    slides: [
      { image: gwaliorFort, title: "Gwalior Fort", detail: "Heritage overlooking the city" },
      {
        image: gwaliorDevelopment,
        title: "A city moving forward",
        detail: "Public spaces and connected roads",
      },
    ],
    description:
      "Gwalior district is the administrative centre of the Gwalior revenue division in northern Madhya Pradesh, known for its enduring heritage and growing urban communities.",
    facts: {
      Area: "4,560 km²",
      Population: "2,032,036",
      "Urban population": "1,273,792",
      "Rural population": "758,244",
      Villages: "618",
      Language: "Hindi",
    },
    portal: "https://gwalior.nic.in/en/",
    notices: "https://gwalior.nic.in/en/notice/",
    collector: {
      name: "Smt Ruchika Chauhan",
      title: "IAS · Collector, Gwalior",
      phone: "0751-2446200",
      profile: "https://gwalior.nic.in/en/dm-profile/smt-ruchika-chauhan/",
      portrait: gwaliorCollector,
    },
  },
  bhind: {
    slides: [
      {
        image: bhindChambal,
        title: "Chambal landscape",
        detail: "River, ravines and farming communities",
      },
      { image: bhindCivic, title: "Civic Bhind", detail: "Public services close to the community" },
    ],
    description:
      "Bhind is shaped by the Chambal landscape, fertile plains and historic ravines. The district takes its name from the revered sage Bhindi Rishi.",
    facts: {
      Area: "4,459 km²",
      Population: "1,703,562",
      "Urban population": "432,800",
      "Rural population": "1,270,762",
      Villages: "325",
      Language: "Hindi",
    },
    portal: "https://bhind.nic.in/en/",
    notices: "https://bhind.nic.in/en/notices/",
    collector: {
      name: "Shri Kirodi Lal Meena",
      title: "IAS · Collector & District Magistrate, Bhind",
      phone: "07534-231200",
      profile: "https://bhind.nic.in/en/dm-profile/shri-kirodi-lal-meena/",
      portrait: bhindCollector,
    },
  },
  morena: {
    slides: [
      {
        image: morenaBateshwar,
        title: "Bateshwar temples",
        detail: "Morena’s remarkable living heritage",
      },
      {
        image: morenaDevelopment,
        title: "Rural connections",
        detail: "Roads supporting farms and villages",
      },
    ],
    description:
      "Morena brings together heritage, agriculture and the Chambal region. Its name reflects the peacocks historically found across its landscape.",
    facts: {
      Area: "4,998.78 km²",
      Population: "1,965,970",
      "Urban population": "470,462",
      "Rural population": "1,495,508",
      Villages: "799",
      Language: "Hindi",
    },
    portal: "https://morena.nic.in/en/",
    notices: "https://morena.nic.in/en/notice/",
    collector: {
      name: "Shri Lokesh Kumar Jangid",
      title: "IAS · District Magistrate & Collector, Morena",
      phone: "07532-223500",
      profile: "https://morena.nic.in/en/dm-profile/shri-lokesh-kumar-jangid-2/shri_lokesh_sir/",
      portrait: morenaCollector,
    },
  },
} satisfies Record<
  District,
  {
    slides: { image: string; title: string; detail: string }[];
    description: string;
    facts: Record<string, string>;
    portal: string;
    notices: string;
    collector: { name: string; title: string; phone: string; profile: string; portrait: string };
  }
>;

const nav = [
  { label: "Overview", target: "home" },
  { label: "District", target: "district" },
  { label: "Notices", target: "notices" },
  { label: "Citizen reports", target: "reports" },
  { label: "Map", target: "map" },
  { label: "Feedback", target: "feedback" },
];

export const Route = createFileRoute("/official")({
  head: () => ({
    meta: [
      { title: "Government Official Platform — VikasSetu" },
      {
        name: "description",
        content:
          "Review district information and respond to citizen reports through the VikasSetu prototype.",
      },
      { property: "og:title", content: "Government Official Platform — VikasSetu" },
      {
        property: "og:description",
        content: "A district workspace for reviewing and responding to citizen reports.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OfficialPage,
});

function OfficialPage() {
  const [district, setDistrict] = useState<District>("gwalior");
  const [language, setLanguage] = useState<Language>("en");
  const [name, setName] = useState("District Official");
  const [slide, setSlide] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("vikassetu-account");
      if (!raw) return;
      const saved = JSON.parse(raw) as { district?: string; language?: string; name?: string };
      if (["gwalior", "bhind", "morena"].includes(saved.district ?? ""))
        setDistrict(saved.district as District);
      if (["en", "hi", "mr", "bn", "ta"].includes(saved.language ?? ""))
        setLanguage(saved.language as Language);
      if (saved.name?.trim()) setName(saved.name.trim());
    } catch {
      /* use safe defaults */
    }
  }, []);
  const data = districtData[district];
  const current = data.slides[slide % data.slides.length];
  const districtName = districtNames[language][district];
  const initials = useMemo(
    () =>
      name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "GO",
    [name],
  );
  const goTo = (target: string) => {
    setMobileOpen(false);
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  if (!current) return null;
  return (
    <main className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-civic-nav text-civic-nav-foreground shadow-sm">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:h-[72px]">
          <Link to="/official" aria-label={`${districtName} official home`} className="shrink-0">
            <img
              src={vikasSetuLogo}
              alt="VikasSetu — People’s Voice. Better Development."
              className="h-9 w-auto max-w-40 object-contain sm:h-10 sm:max-w-48"
            />
          </Link>
          <nav className="ml-auto hidden items-center lg:flex" aria-label="Official navigation">
            {nav.map((item) => (
              <Button
                key={item.target}
                type="button"
                variant="ghost"
                onClick={() => goTo(item.target)}
                className="h-[72px] rounded-none px-3 text-xs text-civic-nav-foreground hover:bg-account-selected"
              >
                {item.label}
              </Button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <div className="relative hidden sm:block">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setLanguageOpen((open) => !open)}
                aria-expanded={languageOpen}
                className="text-civic-nav-foreground"
              >
                <Globe2 className="size-4!" />
                {languageNames[language]}
              </Button>
              {languageOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 rounded-md border border-border bg-popover p-1 shadow-lg">
                  {(Object.keys(languageNames) as Language[]).map((code) => (
                    <Button
                      key={code}
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setLanguage(code);
                        setLanguageOpen(false);
                      }}
                      className="h-8 w-full justify-start text-xs"
                    >
                      {languageNames[code]}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Official notifications"
              className="relative text-civic-nav-foreground"
            >
              <Bell className="size-5!" />
              <span className="absolute right-1 top-1 size-2 rounded-full bg-destructive" />
            </Button>
            <details className="relative hidden sm:block">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="rounded-full bg-secondary text-secondary-foreground"
              >
                <summary aria-label="Open profile menu" className="list-none cursor-pointer">
                  <span className="text-[11px] font-bold">{initials}</span>
                </summary>
              </Button>
              <div className="absolute right-0 top-full mt-2 w-52 rounded-md border border-border bg-popover p-3 text-popover-foreground shadow-lg">
                <p className="truncate text-sm font-semibold">{name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {districtName} government official
                </p>
                <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                  <Link to="/">Back to access page</Link>
                </Button>
              </div>
            </details>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setMobileOpen((open) => !open);
                setLanguageOpen(false);
              }}
              aria-label="Toggle navigation"
              className="text-civic-nav-foreground lg:hidden"
            >
              {mobileOpen ? <X className="size-5!" /> : <Menu className="size-5!" />}
            </Button>
          </div>
        </div>
        {mobileOpen && (
          <nav
            className="grid border-t border-border bg-popover p-3 lg:hidden"
            aria-label="Mobile official navigation"
          >
            {nav.map((item) => (
              <Button
                key={item.target}
                type="button"
                variant="ghost"
                onClick={() => goTo(item.target)}
                className="justify-start"
              >
                {item.label}
              </Button>
            ))}
            <Button asChild variant="outline" className="mt-2">
              <Link to="/">Back to access page</Link>
            </Button>
          </nav>
        )}
      </header>

      <section
        id="home"
        className="relative min-h-[340px] scroll-mt-20 overflow-hidden bg-muted sm:min-h-[430px] lg:min-h-[520px]"
        aria-label={`${districtName} district highlights`}
      >
        <img
          key={`${district}-${slide}`}
          src={current.image}
          alt={`${current.title} in ${districtName} district`}
          className="absolute inset-0 size-full object-cover"
        />
        <div
          className="absolute inset-0 bg-civic-overlay [mask-image:linear-gradient(to_top,black,transparent_68%)]"
          aria-hidden="true"
        />
        <Button
          type="button"
          size="icon"
          onClick={() => setSlide((slide - 1 + data.slides.length) % data.slides.length)}
          aria-label="Previous district image"
          className="absolute left-4 top-1/2 size-11! -translate-y-1/2 rounded-full bg-civic-control"
        >
          <ChevronLeft className="size-6!" />
        </Button>
        <Button
          type="button"
          size="icon"
          onClick={() => setSlide((slide + 1) % data.slides.length)}
          aria-label="Next district image"
          className="absolute right-4 top-1/2 size-11! -translate-y-1/2 rounded-full bg-civic-control"
        >
          <ChevronRight className="size-6!" />
        </Button>
        <div className="absolute inset-x-0 bottom-0 px-5 pb-8 text-primary-foreground sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1320px]">
            <p className="text-xs font-bold uppercase">
              {districtName} District · Official workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{current.title}</h1>
            <p className="mt-2 text-sm sm:text-base">{current.detail}</p>
          </div>
        </div>
      </section>

      <section id="district" className="scroll-mt-20 bg-surface">
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_0.72fr] lg:gap-12">
            <div>
              <p className="text-xs font-bold uppercase text-primary">{districtName}</p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">About the district</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                {data.description}
              </p>
              <Button asChild variant="link" className="mt-2 h-auto px-0">
                <a href={data.portal} target="_blank" rel="noreferrer">
                  Read official profile
                  <ExternalLink className="size-4!" />
                </a>
              </Button>
              <div className="mt-8 flex items-end justify-between border-b border-border pb-3">
                <h3 className="text-xl font-bold">District snapshot</h3>
                <span className="text-xs text-muted-foreground">Census 2011</span>
              </div>
              <dl className="grid sm:grid-cols-2">
                {Object.entries(data.facts).map(([label, value], index) => (
                  <div
                    key={label}
                    className={`border-b border-border py-3 sm:px-3 ${index % 2 === 0 ? "sm:border-r" : ""}`}
                  >
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="mt-1 font-bold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div id="notices" className="scroll-mt-20 lg:border-l lg:border-border lg:pl-10">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-xl font-bold">Official notice boards</h3>
                <CalendarCheck className="size-5 text-primary" aria-hidden="true" />
              </div>
              <div className="divide-y divide-border">
                {[
                  {
                    title: "Recruitment notices",
                    department: "District Establishment",
                    icon: UserRoundCheck,
                  },
                  {
                    title: "Tenders and procurement",
                    department: "Procurement Department",
                    icon: FileText,
                  },
                  {
                    title: "Public announcements",
                    department: "District Administration",
                    icon: Bell,
                  },
                ].map(({ title, department, icon: Icon }) => (
                  <Button
                    key={title}
                    asChild
                    variant="ghost"
                    className="h-auto min-h-24 w-full justify-start gap-4 rounded-none px-0 py-4 text-left"
                  >
                    <a
                      href={data.notices}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${title}, ${department}, source checked 26 September 2026`}
                    >
                      <span
                        role="img"
                        aria-label={`${title} icon`}
                        className="grid size-11 shrink-0 place-items-center rounded-full border border-info-border bg-info text-primary"
                      >
                        <Icon className="size-5!" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1 whitespace-normal">
                        <strong className="block text-sm">{title}</strong>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          Department: {department}
                        </span>
                        <span className="mt-1 block text-[11px] text-primary">
                          Source checked: 26 September 2026
                        </span>
                      </span>
                      <ExternalLink className="size-4! text-muted-foreground" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
            <aside
              className="border-t border-border pt-8 text-center lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
              aria-label="District Collector"
            >
              <div className="relative mx-auto size-44">
                <span className="absolute inset-0 rounded-full border border-info-border" />
                <span className="absolute inset-2 rounded-full border border-border" />
                <img
                  src={data.collector.portrait}
                  alt={`${data.collector.name}, ${data.collector.title}`}
                  className="absolute inset-3 size-[calc(100%-1.5rem)] rounded-full object-cover"
                />
              </div>
              <p className="mt-5 text-xs font-bold uppercase text-primary">District Collector</p>
              <h3 className="mt-2 text-lg font-bold">{data.collector.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{data.collector.title}</p>
              <p className="mt-3 text-[11px] text-muted-foreground">Verified September 2026</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href={data.collector.profile} target="_blank" rel="noreferrer">
                    <ShieldCheck className="size-4!" />
                    Profile
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={`tel:${data.collector.phone.replace(/-/g, "")}`}>
                    <Phone className="size-4!" />
                    Call
                  </a>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <OfficialReportConsole district={district} districtName={districtName} officialName={name} />
    </main>
  );
}
