import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  Building,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Globe2,
  GraduationCap,
  House,
  Landmark,
  Languages,
  MapPinned,
  Menu,
  Phone,
  Ruler,
  ScrollText,
  ShieldCheck,
  UserRound,
  UserRoundCheck,
  Users,
  UsersRound,
  Vote,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import gwaliorFort from "@/assets/citizen-gwalior-fort.jpg";
import gwaliorDevelopment from "@/assets/citizen-gwalior-development.jpg";
import bhindChambal from "@/assets/citizen-bhind-chambal.jpg";
import bhindCivic from "@/assets/citizen-bhind-civic.jpg";
import morenaBateshwar from "@/assets/citizen-morena-bateshwar.jpg";
import morenaDevelopment from "@/assets/citizen-morena-development.jpg";
import gwaliorCollector from "@/assets/gwalior-collector.jpeg";
import bhindCollector from "@/assets/bhind-collector.jpeg";
import morenaCollector from "@/assets/morena-collector.jpeg";
import vikasSetuLogo from "@/assets/vikassetu-logo.png";
import { Button } from "@/components/ui/button";
import { CitizenIssueMap } from "@/components/citizen-issue-map";
import { readReports, type Issue } from "@/lib/report-store";

type District = "gwalior" | "bhind" | "morena";
type Language = "en" | "hi" | "mr" | "bn" | "ta";

const districtSlides = {
  gwalior: [
    { image: gwaliorFort, title: "Gwalior Fort", detail: "Heritage overlooking the city" },
    {
      image: gwaliorDevelopment,
      title: "A city moving forward",
      detail: "Public spaces and connected roads",
    },
  ],
  bhind: [
    {
      image: bhindChambal,
      title: "Chambal landscape",
      detail: "River, ravines and farming communities",
    },
    { image: bhindCivic, title: "Civic Bhind", detail: "Public services close to the community" },
  ],
  morena: [
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
} satisfies Record<District, { image: string; title: string; detail: string }[]>;

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

const navItems = ["Home", "My District", "Report Issue", "Track Reports", "Notices", "Schemes"];

const districtCivicData = {
  gwalior: {
    stats: [
      { value: 10, key: "tehsils" },
      { value: 7, key: "urbanBodies" },
      { value: 41, key: "policeStations" },
    ],
    portal: "https://gwalior.nic.in/en/",
    notices: "https://gwalior.nic.in/en/notice/",
    mapEmbed: "https://www.google.com/maps?q=Gwalior%20district%2C%20Madhya%20Pradesh&output=embed",
    maps: "https://www.google.com/maps/search/?api=1&query=Gwalior+district%2C+Madhya+Pradesh",
  },
  bhind: {
    stats: [
      { value: 13, key: "urbanBodies" },
      { value: 27, key: "policeStations" },
    ],
    portal: "https://bhind.nic.in/en/",
    notices: "https://bhind.nic.in/en/notices/",
    mapEmbed: "https://www.google.com/maps?q=Bhind%20district%2C%20Madhya%20Pradesh&output=embed",
    maps: "https://www.google.com/maps/search/?api=1&query=Bhind+district%2C+Madhya+Pradesh",
  },
  morena: {
    stats: [{ value: 24, key: "policeStations" }],
    portal: "https://morena.nic.in/en/",
    notices: "https://morena.nic.in/en/notice/",
    mapEmbed: "https://www.google.com/maps?q=Morena%20district%2C%20Madhya%20Pradesh&output=embed",
    maps: "https://www.google.com/maps/search/?api=1&query=Morena+district%2C+Madhya+Pradesh",
  },
} satisfies Record<
  District,
  {
    stats: { value: number; key: "tehsils" | "urbanBodies" | "policeStations" }[];
    portal: string;
    notices: string;
    mapEmbed: string;
    maps: string;
  }
>;

const civicCopy = {
  en: {
    heading: "District at a glance",
    subheading: "Official services and local information for",
    tehsils: "Tehsils",
    urbanBodies: "Urban local bodies",
    policeStations: "Police stations",
    services: "Civic services",
    information: "Public information",
    map: "District map",
    openMap: "Open in Maps",
    districtPortal: "Official district portal",
    districtNotices: "District notices",
    districtMap: "Official district map",
    election: "Election Commission of India",
    ceo: "Chief Electoral Officer, Madhya Pradesh",
    voters: "Voters’ Service Portal",
    highCourt: "Madhya Pradesh High Court",
    eOffice: "e-Office India",
    karmayogi: "iGOT Karmayogi",
  },
  hi: {
    heading: "ज़िले की एक झलक",
    subheading: "आधिकारिक सेवाएं और स्थानीय जानकारी",
    tehsils: "तहसीलें",
    urbanBodies: "नगरीय निकाय",
    policeStations: "पुलिस स्टेशन",
    services: "नागरिक सेवाएं",
    information: "सार्वजनिक सूचना",
    map: "ज़िले का नक्शा",
    openMap: "मैप में खोलें",
    districtPortal: "आधिकारिक जिला पोर्टल",
    districtNotices: "ज़िला सूचनाएं",
    districtMap: "आधिकारिक जिला नक्शा",
    election: "भारत निर्वाचन आयोग",
    ceo: "मुख्य निर्वाचन पदाधिकारी, मध्य प्रदेश",
    voters: "मतदाता सेवा पोर्टल",
    highCourt: "मध्य प्रदेश उच्च न्यायालय",
    eOffice: "ई-ऑफिस इंडिया",
    karmayogi: "iGOT कर्मयोगी",
  },
  mr: {
    heading: "जिल्ह्याची एक झलक",
    subheading: "अधिकृत सेवा आणि स्थानिक माहिती",
    tehsils: "तहसील",
    urbanBodies: "नागरी संस्था",
    policeStations: "पोलीस ठाणे",
    services: "नागरी सेवा",
    information: "सार्वजनिक माहिती",
    map: "जिल्हा नकाशा",
    openMap: "नकाशात उघडा",
    districtPortal: "अधिकृत जिल्हा पोर्टल",
    districtNotices: "जिल्हा सूचना",
    districtMap: "अधिकृत जिल्हा नकाशा",
    election: "भारत निवडणूक आयोग",
    ceo: "मुख्य निवडणूक अधिकारी, मध्य प्रदेश",
    voters: "मतदार सेवा पोर्टल",
    highCourt: "मध्य प्रदेश उच्च न्यायालय",
    eOffice: "ई-ऑफिस इंडिया",
    karmayogi: "iGOT कर्मयोगी",
  },
  bn: {
    heading: "জেলার এক নজর",
    subheading: "সরকারি পরিষেবা ও স্থানীয় তথ্য",
    tehsils: "তহসিল",
    urbanBodies: "নগর সংস্থা",
    policeStations: "থানা",
    services: "নাগরিক পরিষেবা",
    information: "জনতথ্য",
    map: "জেলার মানচিত্র",
    openMap: "ম্যাপে খুলুন",
    districtPortal: "সরকারি জেলা পোর্টাল",
    districtNotices: "জেলার বিজ্ঞপ্তি",
    districtMap: "সরকারি জেলা মানচিত্র",
    election: "ভারতের নির্বাচন কমিশন",
    ceo: "মুখ্য নির্বাচনী আধিকারিক, মধ্য প্রদেশ",
    voters: "ভোটার পরিষেবা পোর্টাল",
    highCourt: "মধ্য প্রদেশ হাইকোর্ট",
    eOffice: "ই-অফিস ইন্ডিয়া",
    karmayogi: "iGOT কর্মযোগী",
  },
  ta: {
    heading: "மாவட்டம் ஒரு பார்வை",
    subheading: "அதிகாரப்பூர்வ சேவைகள் மற்றும் உள்ளூர் தகவல்",
    tehsils: "வட்டங்கள்",
    urbanBodies: "நகர்ப்புற உள்ளாட்சி அமைப்புகள்",
    policeStations: "காவல் நிலையங்கள்",
    services: "குடிமக்கள் சேவைகள்",
    information: "பொதுத் தகவல்",
    map: "மாவட்ட வரைபடம்",
    openMap: "வரைபடத்தில் திற",
    districtPortal: "அதிகாரப்பூர்வ மாவட்ட இணையதளம்",
    districtNotices: "மாவட்ட அறிவிப்புகள்",
    districtMap: "அதிகாரப்பூர்வ மாவட்ட வரைபடம்",
    election: "இந்தியத் தேர்தல் ஆணையம்",
    ceo: "தலைமைத் தேர்தல் அதிகாரி, மத்தியப் பிரதேசம்",
    voters: "வாக்காளர் சேவை இணையதளம்",
    highCourt: "மத்தியப் பிரதேச உயர் நீதிமன்றம்",
    eOffice: "இ-ஆபீஸ் இந்தியா",
    karmayogi: "iGOT கர்மயோகி",
  },
} satisfies Record<Language, Record<string, string>>;

const sharedServices = [
  { key: "election", url: "https://www.eci.gov.in/", icon: Vote },
  { key: "ceo", url: "https://ceomadhyapradesh.nic.in/", icon: UsersRound },
  { key: "voters", url: "https://voters.eci.gov.in/", icon: Vote },
  { key: "highCourt", url: "https://mphc.gov.in/", icon: Landmark },
] as const;

const districtProfiles = {
  gwalior: {
    description: {
      en: "Gwalior district is the administrative centre of the Gwalior revenue division in northern Madhya Pradesh, known for its enduring heritage and growing urban communities.",
      hi: "ग्वालियर जिला उत्तरी मध्य प्रदेश में ग्वालियर राजस्व संभाग का प्रशासनिक केंद्र है, जो अपनी समृद्ध विरासत और बढ़ते शहरी समुदायों के लिए जाना जाता है।",
      mr: "ग्वाल्हेर जिल्हा उत्तर मध्य प्रदेशातील ग्वाल्हेर महसूल विभागाचे प्रशासकीय केंद्र असून समृद्ध वारसा आणि वाढत्या शहरी समुदायांसाठी ओळखला जातो.",
      bn: "গোয়ালিয়র জেলা উত্তর মধ্যপ্রদেশের গোয়ালিয়র রাজস্ব বিভাগের প্রশাসনিক কেন্দ্র, যা সমৃদ্ধ ঐতিহ্য ও বিকাশমান শহুরে জনপদের জন্য পরিচিত।",
      ta: "குவாலியர் மாவட்டம் வடக்கு மத்தியப் பிரதேசத்தின் குவாலியர் வருவாய் கோட்ட நிர்வாக மையமாகவும், வளமான பாரம்பரியம் மற்றும் வளர்ந்து வரும் நகர்ப்புற சமூகங்களுக்காகவும் அறியப்படுகிறது.",
    },
    facts: {
      area: "4,560 km²",
      population: "2,032,036",
      urban: "1,273,792",
      rural: "758,244",
      male: "1,090,327",
      female: "941,709",
      language: "Hindi",
      villages: "618",
    },
    collector: {
      name: "Smt Ruchika Chauhan",
      title: "IAS · Collector, Gwalior",
      phone: "0751-2446200",
      profile: "https://gwalior.nic.in/en/dm-profile/smt-ruchika-chauhan/",
      portrait: gwaliorCollector,
    },
  },
  bhind: {
    description: {
      en: "Bhind is shaped by the Chambal landscape, fertile plains and historic ravines. The district takes its name from the revered sage Bhindi Rishi.",
      hi: "भिंड की पहचान चंबल के भू-दृश्य, उपजाऊ मैदानों और ऐतिहासिक बीहड़ों से है। जिले का नाम पूज्य भिंडी ऋषि के नाम पर पड़ा है।",
      mr: "भिंडची ओळख चंबळचा भूभाग, सुपीक मैदाने आणि ऐतिहासिक बीहड यांमुळे आहे. जिल्ह्याचे नाव पूज्य भिंडी ऋषींच्या नावावरून पडले.",
      bn: "ভিন্ডের পরিচয় চম্বল ভূদৃশ্য, উর্বর সমভূমি ও ঐতিহাসিক খাদভূমির সঙ্গে জড়িত। শ্রদ্ধেয় ভিন্ডি ঋষির নামে জেলার নামকরণ।",
      ta: "பிண்ட் சம்பல் நிலப்பரப்பு, வளமான சமவெளிகள் மற்றும் வரலாற்றுச் சிறப்புமிக்க பள்ளத்தாக்குகளால் வடிவமைக்கப்பட்டுள்ளது. மதிப்பிற்குரிய பிண்டி ரிஷியின் பெயரால் மாவட்டம் அழைக்கப்படுகிறது.",
    },
    facts: {
      area: "4,459 km²",
      population: "1,703,562",
      urban: "432,800",
      rural: "1,270,762",
      male: "926,940",
      female: "776,622",
      language: "Hindi",
      villages: "325",
    },
    collector: {
      name: "Shri Kirodi Lal Meena",
      title: "IAS · Collector & District Magistrate, Bhind",
      phone: "07534-231200",
      profile: "https://bhind.nic.in/en/dm-profile/shri-kirodi-lal-meena/",
      portrait: bhindCollector,
    },
  },
  morena: {
    description: {
      en: "Morena takes its name from the words mor and raina—a place where peacocks are abundant. Its landscape brings together heritage, agriculture and the Chambal region.",
      hi: "मुरैना का नाम 'मोर' और 'रैना' से बना है—अर्थात वह स्थान जहाँ मोर बहुतायत में पाए जाते हैं। यहाँ विरासत, कृषि और चंबल का भू-दृश्य एक साथ मिलता है।",
      mr: "मुरैनाचे नाव 'मोर' आणि 'रैना' या शब्दांपासून आले—मोर विपुल असलेले स्थान. येथील भूभागात वारसा, शेती आणि चंबळ प्रदेश एकत्र येतात.",
      bn: "মুরেনা নামটি ‘মোর’ ও ‘রাইনা’ থেকে এসেছে—যেখানে প্রচুর ময়ূর দেখা যায়। এখানকার ভূদৃশ্যে ঐতিহ্য, কৃষি ও চম্বল অঞ্চল মিলিত হয়েছে।",
      ta: "முரைனா என்ற பெயர் ‘மோர்’ மற்றும் ‘ரைனா’ என்ற சொற்களிலிருந்து வந்தது—மயில்கள் மிகுதியாகக் காணப்படும் இடம். பாரம்பரியம், விவசாயம் மற்றும் சம்பல் பகுதி இங்கு ஒன்றிணைகின்றன.",
    },
    facts: {
      area: "4,998.78 km²",
      population: "1,965,970",
      urban: "470,462",
      rural: "1,495,508",
      male: "1,068,417",
      female: "897,553",
      language: "Hindi",
      villages: "799",
    },
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
    description: Record<Language, string>;
    facts: Record<
      "area" | "population" | "urban" | "rural" | "male" | "female" | "language" | "villages",
      string
    >;
    collector: { name: string; title: string; phone: string; profile: string; portrait: string };
  }
>;

const profileCopy = {
  en: {
    about: "About the district",
    readMore: "Read official profile",
    census: "District snapshot",
    censusNote: "Census 2011",
    area: "Area",
    population: "Population",
    urban: "Urban population",
    rural: "Rural population",
    male: "Male",
    female: "Female",
    language: "Language",
    villages: "Villages",
    updates: "Official notice boards",
    recruitment: "Recruitment notices",
    tenders: "Tenders and procurement",
    announcements: "Public announcements",
    collector: "District Collector",
    verified: "Verified September 2026",
    profile: "Official profile",
    call: "Call office",
    department: "Department",
    noticeDate: "Source checked",
    openNotice: "Open official notice board",
    recruitmentDepartment: "District Establishment",
    tendersDepartment: "Procurement Department",
    announcementsDepartment: "District Administration",
  },
  hi: {
    about: "जिले के बारे में",
    readMore: "आधिकारिक परिचय पढ़ें",
    census: "जिला एक नज़र में",
    censusNote: "जनगणना 2011",
    area: "क्षेत्रफल",
    population: "जनसंख्या",
    urban: "शहरी जनसंख्या",
    rural: "ग्रामीण जनसंख्या",
    male: "पुरुष",
    female: "महिला",
    language: "भाषा",
    villages: "गाँव",
    updates: "आधिकारिक सूचना बोर्ड",
    recruitment: "भर्ती सूचनाएं",
    tenders: "निविदाएँ और खरीद",
    announcements: "सार्वजनिक घोषणाएँ",
    collector: "जिलाधिकारी एवं कलेक्टर",
    verified: "सितंबर 2026 में सत्यापित",
    profile: "आधिकारिक प्रोफ़ाइल",
    call: "कार्यालय को कॉल करें",
    department: "विभाग",
    noticeDate: "स्रोत जाँच",
    openNotice: "आधिकारिक सूचना बोर्ड खोलें",
    recruitmentDepartment: "जिला स्थापना",
    tendersDepartment: "खरीद विभाग",
    announcementsDepartment: "जिला प्रशासन",
  },
  mr: {
    about: "जिल्ह्याबद्दल",
    readMore: "अधिकृत परिचय वाचा",
    census: "जिल्हा एका नजरेत",
    censusNote: "जनगणना 2011",
    area: "क्षेत्रफळ",
    population: "लोकसंख्या",
    urban: "शहरी लोकसंख्या",
    rural: "ग्रामीण लोकसंख्या",
    male: "पुरुष",
    female: "महिला",
    language: "भाषा",
    villages: "गावे",
    updates: "अधिकृत सूचना फलक",
    recruitment: "भरती सूचना",
    tenders: "निविदा आणि खरेदी",
    announcements: "सार्वजनिक घोषणा",
    collector: "जिल्हाधिकारी आणि कलेक्टर",
    verified: "सप्टेंबर 2026 मध्ये पडताळले",
    profile: "अधिकृत प्रोफाइल",
    call: "कार्यालयाला कॉल करा",
    department: "विभाग",
    noticeDate: "स्रोत तपासला",
    openNotice: "अधिकृत सूचना फलक उघडा",
    recruitmentDepartment: "जिल्हा आस्थापना",
    tendersDepartment: "खरेदी विभाग",
    announcementsDepartment: "जिल्हा प्रशासन",
  },
  bn: {
    about: "জেলা সম্পর্কে",
    readMore: "সরকারি পরিচিতি পড়ুন",
    census: "এক নজরে জেলা",
    censusNote: "জনগণনা ২০১১",
    area: "আয়তন",
    population: "জনসংখ্যা",
    urban: "শহুরে জনসংখ্যা",
    rural: "গ্রামীণ জনসংখ্যা",
    male: "পুরুষ",
    female: "মহিলা",
    language: "ভাষা",
    villages: "গ্রাম",
    updates: "সরকারি বিজ্ঞপ্তি বোর্ড",
    recruitment: "নিয়োগ বিজ্ঞপ্তি",
    tenders: "দরপত্র ও ক্রয়",
    announcements: "জনসাধারণের ঘোষণা",
    collector: "জেলা কালেক্টর",
    verified: "সেপ্টেম্বর ২০২৬-এ যাচাই করা",
    profile: "সরকারি প্রোফাইল",
    call: "দপ্তরে ফোন করুন",
    department: "দপ্তর",
    noticeDate: "উৎস যাচাই",
    openNotice: "সরকারি বিজ্ঞপ্তি বোর্ড খুলুন",
    recruitmentDepartment: "জেলা স্থাপনা",
    tendersDepartment: "ক্রয় বিভাগ",
    announcementsDepartment: "জেলা প্রশাসন",
  },
  ta: {
    about: "மாவட்டத்தைப் பற்றி",
    readMore: "அதிகாரப்பூர்வ விவரத்தைப் படிக்க",
    census: "மாவட்டம் ஒரு பார்வை",
    censusNote: "மக்கள்தொகை கணக்கெடுப்பு 2011",
    area: "பரப்பளவு",
    population: "மக்கள்தொகை",
    urban: "நகர்ப்புற மக்கள்",
    rural: "கிராமப்புற மக்கள்",
    male: "ஆண்கள்",
    female: "பெண்கள்",
    language: "மொழி",
    villages: "கிராமங்கள்",
    updates: "அதிகாரப்பூர்வ அறிவிப்பு பலகைகள்",
    recruitment: "ஆட்சேர்ப்பு அறிவிப்புகள்",
    tenders: "ஒப்பந்தங்கள் மற்றும் கொள்முதல்",
    announcements: "பொது அறிவிப்புகள்",
    collector: "மாவட்ட ஆட்சியர்",
    verified: "செப்டம்பர் 2026 இல் சரிபார்க்கப்பட்டது",
    profile: "அதிகாரப்பூர்வ சுயவிவரம்",
    call: "அலுவலகத்தை அழைக்க",
    department: "துறை",
    noticeDate: "மூலம் சரிபார்ப்பு",
    openNotice: "அதிகாரப்பூர்வ அறிவிப்புப் பலகையைத் திற",
    recruitmentDepartment: "மாவட்ட நிறுவல்",
    tendersDepartment: "கொள்முதல் துறை",
    announcementsDepartment: "மாவட்ட நிர்வாகம்",
  },
} satisfies Record<Language, Record<string, string>>;

const factIcons = {
  area: Ruler,
  population: Users,
  urban: Building,
  rural: House,
  male: UserRound,
  female: UserRoundCheck,
  language: Languages,
  villages: Landmark,
} as const;

export const Route = createFileRoute("/citizen")({
  head: () => ({
    meta: [
      { title: "Citizen Platform — VikasSetu" },
      {
        name: "description",
        content: "Explore your district and access citizen services through VikasSetu.",
      },
      { property: "og:title", content: "Citizen Platform — VikasSetu" },
      {
        property: "og:description",
        content: "Your district, its development, and citizen services in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CitizenPage,
});

function CitizenPage() {
  const [district, setDistrict] = useState<District>("gwalior");
  const [language, setLanguage] = useState<Language>("en");
  const [name, setName] = useState("Citizen");
  const [slide, setSlide] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const messageTimer = useRef<number | null>(null);
  const [panel, setPanel] = useState<"track" | "bell" | null>(null);
  const [myReports, setMyReports] = useState<Issue[]>([]);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const load = () => {
      readReports()
        .then((items) => setMyReports([...items].sort((a, b) => b.id.localeCompare(a.id))))
        .catch(() => setMyReports([]));
    };
    load();
    window.addEventListener("vikassetu:reports-changed", load);
    return () => window.removeEventListener("vikassetu:reports-changed", load);
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent | MouseEvent) => {
      if (
        event instanceof KeyboardEvent
          ? event.key === "Escape"
          : !(event.target as HTMLElement).closest("[data-menu]")
      ) {
        setPanel(null);
        setLanguageOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("keydown", close);
    document.addEventListener("mousedown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("mousedown", close);
    };
  }, []);

  useEffect(() => {
    const ids = ["home", "my-district", "schemes", "notices", "report-issue"];
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActiveSection(hit.target.id);
      },
      { rootMargin: "-80px 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("vikassetu-account");
      if (!raw) return;
      const saved = JSON.parse(raw) as { district?: string; language?: string; name?: string };
      if (saved.district === "gwalior" || saved.district === "bhind" || saved.district === "morena")
        setDistrict(saved.district);
      if (
        saved.language === "en" ||
        saved.language === "hi" ||
        saved.language === "mr" ||
        saved.language === "bn" ||
        saved.language === "ta"
      )
        setLanguage(saved.language);
      if (typeof saved.name === "string" && saved.name.trim()) setName(saved.name.trim());
    } catch {
      // Invalid browser data falls back to the Gwalior preview.
    }
  }, []);

  useEffect(
    () => () => {
      if (messageTimer.current !== null) window.clearTimeout(messageTimer.current);
    },
    [],
  );

  const slides = districtSlides[district];
  const current = slides[slide % slides.length];
  const districtName = districtNames[language][district];
  const civic = districtCivicData[district];
  const labels = civicCopy[language];
  const profile = districtProfiles[district];
  const profileLabels = profileCopy[language];
  const initials = useMemo(
    () =>
      name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "C",
    [name],
  );

  const notify = (label: string) => {
    if (messageTimer.current !== null) window.clearTimeout(messageTimer.current);
    setMessage(`${label} will be added in the next citizen-platform step.`);
    messageTimer.current = window.setTimeout(() => setMessage(null), 3200);
    setMobileOpen(false);
  };

  const sectionFor = ["home", "my-district", "report-issue", "track", "notices", "schemes"];
  const goTo = (index: number) => {
    setMobileOpen(false);
    setLanguageOpen(false);
    setProfileOpen(false);
    const target = sectionFor[index];
    if (target === "track") {
      setPanel((open) => (open === "track" ? null : "track"));
      return;
    }
    setPanel(null);
    document
      .getElementById(target ?? "home")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (target === "report-issue")
      window.setTimeout(
        () => document.getElementById("issue-title")?.focus({ preventScroll: true }),
        600,
      );
  };
  const openReport = (id: string) => {
    setPanel(null);
    document.getElementById("issue-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.dispatchEvent(new CustomEvent("vikassetu:focus-issue", { detail: id }));
  };
  const isActive = (index: number) =>
    sectionFor[index] === "track"
      ? panel === "track"
      : panel !== "track" && sectionFor[index] === activeSection;

  const changeSlide = (direction: number) => {
    setSlide((currentSlide) => (currentSlide + direction + slides.length) % slides.length);
  };

  if (!current) return null;

  return (
    <main className="min-h-screen bg-background font-sans text-foreground">
      <header className="relative z-30 border-b border-border bg-civic-nav text-civic-nav-foreground shadow-sm">
        <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 lg:flex lg:h-[72px]">
          <Link
            to="/citizen"
            className="flex min-w-0 shrink-0 items-center"
            aria-label={`VikasSetu citizen home, ${districtName}`}
          >
            <img
              src={vikasSetuLogo}
              alt="VikasSetu — People’s Voice. Better Development."
              className="h-9 w-auto max-w-40 object-contain sm:h-10 sm:max-w-48"
            />
          </Link>

          <nav
            className="ml-auto hidden min-w-0 items-center lg:flex"
            aria-label="Citizen navigation"
          >
            {navItems.map((item, index) => (
              <Button
                key={item}
                type="button"
                variant="ghost"
                data-menu
                onClick={() => goTo(index)}
                aria-current={isActive(index) ? "true" : undefined}
                className={`h-[72px] rounded-none px-3 text-xs xl:px-4 ${isActive(index) ? "border-b-2 border-primary bg-account-selected text-primary" : "text-civic-nav-foreground hover:bg-account-selected"}`}
              >
                {item}
              </Button>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            <div className="relative hidden sm:block" data-menu>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-expanded={languageOpen}
                onClick={() => {
                  setLanguageOpen((open) => !open);
                  setProfileOpen(false);
                  setPanel(null);
                }}
                className="gap-1.5 text-civic-nav-foreground"
              >
                <Globe2 className="size-4!" />
                <span className="hidden xl:inline">{languageNames[language]}</span>
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
                      className={`h-8 w-full justify-start text-xs ${language === code ? "bg-account-selected text-primary" : ""}`}
                    >
                      {languageNames[code]}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative" data-menu>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-expanded={panel === "bell"}
                onClick={() => {
                  setPanel((open) => (open === "bell" ? null : "bell"));
                  setLanguageOpen(false);
                  setProfileOpen(false);
                }}
                aria-label={`Notifications, ${myReports.length + 3} items`}
                className="relative text-civic-nav-foreground"
              >
                <Bell className="size-5!" />
                <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold leading-4 text-destructive-foreground">
                  {myReports.length + 3}
                </span>
              </Button>
              {panel === "bell" && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-lg">
                  <p className="px-2 py-1 text-xs font-bold uppercase text-muted-foreground">
                    Recent activity
                  </p>
                  {myReports.slice(0, 3).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => openReport(r.id)}
                      className="block w-full rounded-sm px-2 py-2 text-left text-xs hover:bg-account-selected"
                    >
                      <strong className="block truncate">
                        Report {r.id} · {r.status}
                      </strong>
                      <span className="text-muted-foreground">{r.title}</span>
                    </button>
                  ))}
                  {[
                    profileLabels.recruitment,
                    profileLabels.tenders,
                    profileLabels.announcements,
                  ].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setPanel(null);
                        document.getElementById("notices")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="block w-full rounded-sm px-2 py-2 text-left text-xs hover:bg-account-selected"
                    >
                      <strong className="block">{label}</strong>
                      <span className="text-muted-foreground">26 September 2026</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative hidden sm:block" data-menu>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-expanded={profileOpen}
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setLanguageOpen(false);
                  setPanel(null);
                }}
                aria-label="Open profile menu"
                className="rounded-full bg-secondary text-secondary-foreground"
              >
                <span className="text-[11px] font-bold">{initials}</span>
              </Button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-md border border-border bg-popover p-3 shadow-lg">
                  <p className="truncate text-sm font-semibold text-popover-foreground">{name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{districtName} citizen</p>
                  <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                    <Link to="/">Back to access page</Link>
                  </Button>
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              data-menu
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              className="text-civic-nav-foreground lg:hidden"
            >
              {mobileOpen ? <X className="size-5!" /> : <Menu className="size-5!" />}
            </Button>
          </div>
        </div>

        {panel === "track" && (
          <div
            data-menu
            className="absolute right-4 top-full z-40 mt-2 w-[min(24rem,calc(100%-2rem))] rounded-md border border-border bg-popover p-3 text-popover-foreground shadow-xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-bold">My reports on this device</p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setPanel(null)}
                aria-label="Close reports"
                className="size-8!"
              >
                <X className="size-4!" />
              </Button>
            </div>
            {myReports.length ? (
              <ul className="max-h-80 divide-y divide-border overflow-y-auto">
                {myReports.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => openReport(r.id)}
                      className="block w-full px-1 py-2 text-left text-xs hover:bg-account-selected"
                    >
                      <span className="flex justify-between gap-2">
                        <strong>{r.id}</strong>
                        <span className="rounded-sm bg-secondary px-1.5 text-secondary-foreground">
                          {r.status}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate">{r.title}</span>
                      <span className="text-muted-foreground">
                        {r.date} · {r.department}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-3 text-xs text-muted-foreground">
                No reports yet.{" "}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-xs"
                  onClick={() => goTo(2)}
                >
                  Report an issue
                </Button>
              </div>
            )}
          </div>
        )}
        {mobileOpen && (
          <div data-menu className="border-t border-border bg-popover p-3 lg:hidden">
            <nav className="grid gap-1" aria-label="Mobile citizen navigation">
              {navItems.map((item, index) => (
                <Button
                  key={item}
                  type="button"
                  variant="ghost"
                  onClick={() => goTo(index)}
                  className={`justify-start ${isActive(index) ? "bg-account-selected text-primary" : ""}`}
                >
                  {item}
                </Button>
              ))}
            </nav>
            <div className="mt-2 grid grid-cols-5 gap-1 border-t border-border pt-2">
              {(Object.keys(languageNames) as Language[]).map((code) => (
                <Button
                  key={code}
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setLanguage(code);
                    setMobileOpen(false);
                  }}
                  className={`min-w-0 px-1 text-[10px] ${language === code ? "bg-account-selected text-primary" : ""}`}
                >
                  {languageNames[code]}
                </Button>
              ))}
            </div>
            <Button asChild variant="outline" className="mt-2 w-full">
              <Link to="/">Back to access page</Link>
            </Button>
          </div>
        )}
      </header>

      <section
        id="home"
        className="relative isolate min-h-[340px] scroll-mt-20 overflow-hidden bg-muted sm:min-h-[430px] lg:min-h-[520px]"
        aria-roledescription="carousel"
        aria-label={`${districtName} district highlights`}
      >
        <img
          key={`${district}-${slide}`}
          src={current.image}
          alt={`${current.title} in ${districtName} district`}
          width={1536}
          height={768}
          className="absolute inset-0 size-full object-cover motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"
        />
        <div
          className="absolute inset-0 bg-civic-overlay [mask-image:linear-gradient(to_top,black,transparent_68%)]"
          aria-hidden="true"
        />

        <Button
          type="button"
          size="icon"
          onClick={() => changeSlide(-1)}
          aria-label="Previous district image"
          className="absolute left-3 top-1/2 z-10 size-11! -translate-y-1/2 rounded-full bg-civic-control text-primary-foreground shadow-lg hover:bg-civic-control-hover sm:left-6"
        >
          <ChevronLeft className="size-6!" />
        </Button>
        <Button
          type="button"
          size="icon"
          onClick={() => changeSlide(1)}
          aria-label="Next district image"
          className="absolute right-3 top-1/2 z-10 size-11! -translate-y-1/2 rounded-full bg-civic-control text-primary-foreground shadow-lg hover:bg-civic-control-hover sm:right-6"
        >
          <ChevronRight className="size-6!" />
        </Button>

        <div className="absolute inset-x-0 bottom-0 px-5 pb-6 pt-20 text-primary-foreground sm:px-10 sm:pb-9 lg:px-16">
          <div className="mx-auto max-w-[1320px]">
            <p className="mb-2 text-xs font-semibold uppercase tracking-normal text-primary-foreground/80">
              {districtName} District
            </p>
            <h1 className="max-w-2xl text-2xl font-bold leading-tight sm:text-4xl">
              {current.title}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-primary-foreground/85 sm:text-base">
              {current.detail}
            </p>
            <div className="mt-4 flex gap-2" aria-label="Choose district image">
              {slides.map((item, index) => (
                <Button
                  key={item.title}
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSlide(index)}
                  aria-label={`Show image ${index + 1}: ${item.title}`}
                  aria-pressed={index === slide}
                  className={`h-2! min-h-0 w-8! rounded-full p-0 ${index === slide ? "bg-primary-foreground hover:bg-primary-foreground" : "bg-primary-foreground/45 hover:bg-primary-foreground/70"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="schemes"
        className="scroll-mt-20 border-b border-border bg-background"
        aria-labelledby="district-services-heading"
      >
        <div className="mx-auto max-w-[1320px] px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-7">
            <h2
              id="district-services-heading"
              className="text-2xl font-bold text-foreground sm:text-3xl"
            >
              {labels.heading}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {labels.subheading} {districtName}.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.35fr_1fr_1.25fr] lg:gap-7">
            <div className="grid content-start gap-3" aria-label={`${districtName} statistics`}>
              {[
                ...civic.stats.map(({ value, key }) => ({
                  value,
                  label: labels[key],
                  icon:
                    key === "tehsils" ? Building2 : key === "urbanBodies" ? Landmark : ShieldCheck,
                })),
              ].map(({ value, label, icon: Icon }, index) => (
                <a
                  key={label}
                  href={civic.portal}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-24 items-center gap-4 rounded-md border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    className={`grid size-14 shrink-0 place-items-center rounded-md ${index === 0 ? "bg-secondary text-secondary-foreground" : index === 1 ? "bg-info text-primary" : "bg-destructive/10 text-destructive"}`}
                  >
                    <Icon className="size-7" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <strong className="block text-3xl leading-none text-foreground">{value}</strong>
                    <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                      {label}
                    </span>
                  </span>
                </a>
              ))}
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold text-foreground">{labels.services}</h3>
              <div className="overflow-hidden rounded-md border border-border bg-card">
                {sharedServices.map(({ key, url, icon: Icon }) => (
                  <Button
                    key={key}
                    asChild
                    variant="ghost"
                    className="h-auto min-h-14 w-full justify-start gap-3 rounded-none border-b border-border px-4 py-3 text-left last:border-b-0"
                  >
                    <a href={url} target="_blank" rel="noreferrer">
                      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                        <Icon className="size-4!" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1 whitespace-normal leading-snug">
                        {labels[key]}
                      </span>
                      <ExternalLink
                        className="size-4! shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold text-foreground">{labels.information}</h3>
              <div className="overflow-hidden rounded-md border border-border bg-card">
                {[
                  { label: labels.districtPortal, url: civic.portal, icon: Landmark },
                  { label: labels.districtNotices, url: civic.notices, icon: FileText },
                  { label: labels.eOffice, url: "https://eoffice.gov.in/", icon: FileText },
                  {
                    label: labels.karmayogi,
                    url: "https://igotkarmayogi.gov.in/",
                    icon: GraduationCap,
                  },
                ].map(({ label, url, icon: Icon }) => (
                  <Button
                    key={label}
                    asChild
                    variant="ghost"
                    className="h-auto min-h-12 w-full justify-start gap-3 rounded-none border-b border-border px-3 py-2.5 text-left last:border-b-0"
                  >
                    <a href={url} target="_blank" rel="noreferrer">
                      <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-info text-primary">
                        <Icon className="size-4!" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1 whitespace-normal text-xs leading-snug">
                        {label}
                      </span>
                      <ExternalLink
                        className="size-3.5! shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold text-foreground">
                {districtName} {labels.map}
              </h3>
              <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
                <iframe
                  key={district}
                  title={`${districtName} ${labels.map}`}
                  src={civic.mapEmbed}
                  className="h-64 w-full border-0 lg:h-[292px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-between rounded-none border-t border-border"
                >
                  <a href={civic.maps} target="_blank" rel="noreferrer">
                    <span className="flex items-center gap-2">
                      <MapPinned className="size-4! text-primary" aria-hidden="true" />
                      {labels.openMap}
                    </span>
                    <ExternalLink className="size-4!" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="my-district"
        className="scroll-mt-20 bg-surface"
        aria-labelledby="district-profile-heading"
      >
        <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr_0.7fr] lg:gap-12">
            <div className="min-w-0">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 shrink-0 bg-primary" aria-hidden="true" />
                <p className="text-xs font-bold uppercase text-primary">{districtName}</p>
              </div>
              <h2
                id="district-profile-heading"
                className="text-2xl font-bold text-foreground sm:text-3xl"
              >
                {profileLabels.about}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                {profile.description[language]}
              </p>
              <Button asChild variant="link" className="mt-2 h-auto px-0 text-primary">
                <a href={civic.portal} target="_blank" rel="noreferrer">
                  {profileLabels.readMore}
                  <ExternalLink className="size-4!" aria-hidden="true" />
                </a>
              </Button>

              <div className="mt-9 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-border pb-3">
                <h3 className="min-w-0 text-xl font-bold text-foreground">
                  {profileLabels.census}
                </h3>
                <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                  {profileLabels.censusNote}
                </span>
              </div>
              <dl className="grid sm:grid-cols-2">
                {(Object.entries(profile.facts) as [keyof typeof profile.facts, string][]).map(
                  ([key, value], index) => {
                    const Icon = factIcons[key];
                    return (
                      <div
                        key={key}
                        className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-border py-3.5 sm:px-3 ${index % 2 === 0 ? "sm:border-r" : ""}`}
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-account-selected text-primary">
                          <Icon className="size-[18px]" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <dt className="text-xs text-muted-foreground">{profileLabels[key]}</dt>
                          <dd className="mt-0.5 truncate text-sm font-bold text-foreground">
                            {value}
                          </dd>
                        </div>
                      </div>
                    );
                  },
                )}
              </dl>
            </div>

            <div
              id="notices"
              className="min-w-0 scroll-mt-24 lg:border-l lg:border-border lg:pl-10"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border pb-3">
                <h3 className="min-w-0 text-xl font-bold text-foreground">
                  {profileLabels.updates}
                </h3>
                <CalendarCheck className="size-5 shrink-0 text-primary" aria-hidden="true" />
              </div>
              <div className="divide-y divide-border">
                {[
                  {
                    label: profileLabels.recruitment,
                    department: profileLabels.recruitmentDepartment,
                    icon: UserRoundCheck,
                  },
                  {
                    label: profileLabels.tenders,
                    department: profileLabels.tendersDepartment,
                    icon: ScrollText,
                  },
                  {
                    label: profileLabels.announcements,
                    department: profileLabels.announcementsDepartment,
                    icon: Bell,
                  },
                ].map(({ label, department, icon: Icon }) => (
                  <Button
                    key={label}
                    asChild
                    variant="ghost"
                    className="group h-auto min-h-20 w-full justify-start gap-4 rounded-none px-0 py-4 text-left hover:bg-transparent"
                  >
                    <a
                      href={civic.notices}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${label}, ${department}, ${profileLabels.noticeDate} 26 September 2026. ${profileLabels.openNotice}`}
                    >
                      <span
                        role="img"
                        aria-label={`${label} icon`}
                        className="grid size-11 shrink-0 place-items-center rounded-full border border-info-border bg-info text-primary transition-colors group-hover:bg-account-selected"
                      >
                        <Icon className="size-5!" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1 whitespace-normal">
                        <strong className="block text-sm leading-snug text-foreground">
                          {label}
                        </strong>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {profileLabels.department}: {department}
                        </span>
                        <span className="mt-1 block text-[11px] font-medium text-primary">
                          {profileLabels.noticeDate}: 26 September 2026
                        </span>
                      </span>
                      <ExternalLink
                        className="size-4! shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            <aside
              className="min-w-0 border-t border-border pt-8 text-center lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
              aria-label={profileLabels.collector}
            >
              <div className="relative mx-auto size-44 sm:size-48">
                <span
                  className="absolute inset-0 rounded-full border border-info-border"
                  aria-hidden="true"
                />
                <span
                  className="absolute inset-2 rounded-full border border-border"
                  aria-hidden="true"
                />
                <img
                  src={profile.collector.portrait}
                  alt={`${profile.collector.name}, ${profile.collector.title}`}
                  width={340}
                  height={340}
                  className="absolute inset-3 size-[calc(100%-1.5rem)] rounded-full object-cover"
                />
              </div>
              <p className="mt-5 text-xs font-bold uppercase text-primary">
                {profileLabels.collector}
              </p>
              <h3 className="mt-2 text-lg font-bold leading-snug text-foreground">
                {profile.collector.name}
              </h3>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">
                {profile.collector.title}
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <CalendarCheck className="size-3.5 shrink-0" aria-hidden="true" />
                {profileLabels.verified}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href={profile.collector.profile} target="_blank" rel="noreferrer">
                    <UserRoundCheck className="size-4!" />
                    {profileLabels.profile}
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={`tel:${profile.collector.phone.replace(/-/g, "")}`}>
                    <Phone className="size-4!" />
                    {profileLabels.call}
                  </a>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <CitizenIssueMap district={district} language={language} districtName={districtName} />
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-md border border-toast-border bg-toast px-4 py-3 text-sm text-toast-foreground shadow-xl"
        >
          <span className="flex-1">{message}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMessage(null)}
            aria-label="Dismiss message"
            className="size-7! text-toast-foreground hover:bg-toast-hover hover:text-toast-foreground"
          >
            <X className="size-4!" />
          </Button>
        </div>
      )}
    </main>
  );
}
