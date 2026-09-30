/// <reference types="google.maps" />

import {
  Building2,
  Camera,
  CheckCircle2,
  CircleDot,
  Construction,
  Cross,
  Droplets,
  HeartPulse,
  LocateFixed,
  MapPin,
  Navigation,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  readReports,
  saveReport,
  type Category,
  type District,
  type Issue,
  type MapMode,
} from "@/lib/report-store";

type Language = "en" | "hi" | "mr" | "bn" | "ta";

type Props = { district: District; language: Language; districtName: string };

const centers: Record<District, { lat: number; lng: number; zoom: number }> = {
  gwalior: { lat: 26.2183, lng: 78.1828, zoom: 12 },
  bhind: { lat: 26.5587, lng: 78.7873, zoom: 12 },
  morena: { lat: 26.4947, lng: 77.994, zoom: 12 },
};

const departmentByCategory: Record<Category, string> = {
  roads: "Public Works Department",
  water: "Public Health Engineering",
  sanitation: "Municipal Sanitation Department",
  health: "Health & Family Welfare",
  electricity: "Energy Department",
  other: "District Administration",
};

const categoryIcons = {
  roads: Construction,
  water: Droplets,
  sanitation: Trash2,
  health: HeartPulse,
  electricity: Zap,
  other: CircleDot,
} as const;

const copy = {
  en: {
    eyebrow: "Citizen action",
    heading: "Report a local issue",
    intro:
      "Add a photo and mark the exact location. Your report will appear on the district hotspot map.",
    prototype: "Prototype privacy",
    privacy: "Reports and photos stay in this browser and are not sent to a government department.",
    category: "Issue category",
    title: "Short title",
    titlePh: "Example: Large pothole near school",
    titleError: "Enter a title between 5 and 80 characters.",
    details: "Describe the issue",
    detailsPh: "What happened, how long it has been present, and who it affects…",
    detailsError: "Enter a description between 10 and 500 characters.",
    department: "Responsible department",
    photos: "Photo evidence",
    addPhoto: "Choose photo",
    photoHelp: "JPG, PNG or WebP · maximum 2 MB",
    location: "Issue location",
    locationError: "Choose a location using your device or by clicking the map.",
    useLocation: "Use my location",
    mapHint: "Or click the map to place the issue marker.",
    submit: "Submit report",
    required: "Complete the required fields and choose a location.",
    saveError: "This report could not be saved. Please try again.",
    photoError: "Choose a JPG, PNG or WebP image under 2 MB.",
    success: "Report saved on this device",
    needs: "Reported needs",
    works: "Known works",
    facilities: "Facilities",
    sample: "Sample data",
    all: "All sectors",
    roads: "Roads",
    water: "Water",
    sanitation: "Sanitation",
    health: "Health",
    electricity: "Electricity",
    other: "Other",
    reports: "visible reports",
    empty: "No reports match this filter.",
    selected: "Selected location",
    remove: "Remove photo",
    map: "Interactive district issue map",
    locateError: "Location was unavailable. Click the map to place the marker.",
    viewIssue: "Issue details",
    close: "Close issue details",
    status: "Status",
    filed: "Reported",
    dept: "Department",
  },
  hi: {
    eyebrow: "नागरिक कार्रवाई",
    heading: "स्थानीय समस्या दर्ज करें",
    intro:
      "फोटो जोड़ें और सही स्थान चिन्हित करें। आपकी रिपोर्ट जिला हॉटस्पॉट मानचित्र पर दिखाई देगी।",
    prototype: "प्रोटोटाइप गोपनीयता",
    privacy:
      "रिपोर्ट और फोटो केवल इस ब्राउज़र में रहते हैं और किसी सरकारी विभाग को नहीं भेजे जाते।",
    category: "समस्या श्रेणी",
    title: "संक्षिप्त शीर्षक",
    titlePh: "उदाहरण: स्कूल के पास बड़ा गड्ढा",
    titleError: "शीर्षक 5 से 80 अक्षरों के बीच लिखें।",
    details: "समस्या का विवरण",
    detailsPh: "क्या हुआ, कब से है और किसे प्रभावित करता है…",
    detailsError: "विवरण 10 से 500 अक्षरों के बीच लिखें।",
    department: "जिम्मेदार विभाग",
    photos: "फोटो प्रमाण",
    addPhoto: "फोटो चुनें",
    photoHelp: "JPG, PNG या WebP · अधिकतम 2 MB",
    location: "समस्या का स्थान",
    locationError: "अपने डिवाइस या मानचित्र पर क्लिक करके स्थान चुनें।",
    useLocation: "मेरा स्थान उपयोग करें",
    mapHint: "या समस्या मार्कर लगाने के लिए मानचित्र पर क्लिक करें।",
    submit: "रिपोर्ट दर्ज करें",
    required: "आवश्यक जानकारी भरें और स्थान चुनें।",
    saveError: "रिपोर्ट सहेजी नहीं जा सकी। कृपया फिर प्रयास करें।",
    photoError: "2 MB से कम JPG, PNG या WebP चुनें।",
    success: "रिपोर्ट इस डिवाइस पर सहेजी गई",
    needs: "दर्ज समस्याएँ",
    works: "चल रहे कार्य",
    facilities: "सुविधाएँ",
    sample: "नमूना डेटा",
    all: "सभी क्षेत्र",
    roads: "सड़कें",
    water: "पानी",
    sanitation: "स्वच्छता",
    health: "स्वास्थ्य",
    electricity: "बिजली",
    other: "अन्य",
    reports: "दिखाई गई रिपोर्ट",
    empty: "इस फ़िल्टर से कोई रिपोर्ट नहीं मिली।",
    selected: "चुना हुआ स्थान",
    remove: "फोटो हटाएँ",
    map: "जिला समस्या का इंटरैक्टिव मानचित्र",
    locateError: "स्थान उपलब्ध नहीं हुआ। मार्कर लगाने के लिए मानचित्र पर क्लिक करें।",
    viewIssue: "समस्या विवरण",
    close: "समस्या विवरण बंद करें",
    status: "स्थिति",
    filed: "दर्ज",
    dept: "विभाग",
  },
  mr: {
    eyebrow: "नागरिक कृती",
    heading: "स्थानिक समस्या नोंदवा",
    intro: "फोटो जोडा आणि अचूक ठिकाण चिन्हांकित करा. तुमचा अहवाल जिल्हा हॉटस्पॉट नकाशावर दिसेल.",
    prototype: "प्रोटोटाइप गोपनीयता",
    privacy: "अहवाल आणि फोटो या ब्राउझरमध्येच राहतात; ते सरकारी विभागाला पाठवले जात नाहीत.",
    category: "समस्या प्रकार",
    title: "लहान शीर्षक",
    titlePh: "उदा.: शाळेजवळ मोठा खड्डा",
    titleError: "शीर्षक 5 ते 80 अक्षरांमध्ये लिहा.",
    details: "समस्येचे वर्णन",
    detailsPh: "काय झाले, किती दिवसांपासून आहे आणि कोणावर परिणाम होतो…",
    detailsError: "वर्णन 10 ते 500 अक्षरांमध्ये लिहा.",
    department: "जबाबदार विभाग",
    photos: "फोटो पुरावा",
    addPhoto: "फोटो निवडा",
    photoHelp: "JPG, PNG किंवा WebP · कमाल 2 MB",
    location: "समस्येचे ठिकाण",
    locationError: "तुमचे उपकरण वापरून किंवा नकाशावर क्लिक करून ठिकाण निवडा.",
    useLocation: "माझे स्थान वापरा",
    mapHint: "किंवा मार्कर ठेवण्यासाठी नकाशावर क्लिक करा.",
    submit: "अहवाल नोंदवा",
    required: "आवश्यक माहिती भरा आणि ठिकाण निवडा.",
    saveError: "अहवाल जतन झाला नाही. कृपया पुन्हा प्रयत्न करा.",
    photoError: "2 MB पेक्षा कमी JPG, PNG किंवा WebP निवडा.",
    success: "अहवाल या उपकरणावर जतन झाला",
    needs: "नोंदवलेल्या गरजा",
    works: "ज्ञात कामे",
    facilities: "सुविधा",
    sample: "नमुना डेटा",
    all: "सर्व विभाग",
    roads: "रस्ते",
    water: "पाणी",
    sanitation: "स्वच्छता",
    health: "आरोग्य",
    electricity: "वीज",
    other: "इतर",
    reports: "दिसणारे अहवाल",
    empty: "या फिल्टरमध्ये अहवाल नाहीत.",
    selected: "निवडलेले ठिकाण",
    remove: "फोटो काढा",
    map: "जिल्हा समस्या परस्परसंवादी नकाशा",
    locateError: "स्थान मिळाले नाही. मार्कर ठेवण्यासाठी नकाशावर क्लिक करा.",
    viewIssue: "समस्या तपशील",
    close: "तपशील बंद करा",
    status: "स्थिती",
    filed: "नोंदवले",
    dept: "विभाग",
  },
  bn: {
    eyebrow: "নাগরিক উদ্যোগ",
    heading: "স্থানীয় সমস্যা জানান",
    intro: "ছবি যোগ করে সঠিক স্থান চিহ্নিত করুন। আপনার রিপোর্ট জেলা হটস্পট ম্যাপে দেখা যাবে।",
    prototype: "প্রোটোটাইপ গোপনীয়তা",
    privacy: "রিপোর্ট ও ছবি শুধু এই ব্রাউজারে থাকে; সরকারি দপ্তরে পাঠানো হয় না।",
    category: "সমস্যার ধরন",
    title: "সংক্ষিপ্ত শিরোনাম",
    titlePh: "উদাহরণ: স্কুলের কাছে বড় গর্ত",
    titleError: "৫ থেকে ৮০ অক্ষরের মধ্যে শিরোনাম লিখুন।",
    details: "সমস্যার বিবরণ",
    detailsPh: "কী ঘটেছে, কতদিন ধরে এবং কারা প্রভাবিত…",
    detailsError: "১০ থেকে ৫০০ অক্ষরের মধ্যে বিবরণ লিখুন।",
    department: "দায়িত্বপ্রাপ্ত দপ্তর",
    photos: "ছবির প্রমাণ",
    addPhoto: "ছবি বাছুন",
    photoHelp: "JPG, PNG বা WebP · সর্বোচ্চ 2 MB",
    location: "সমস্যার স্থান",
    locationError: "আপনার ডিভাইস ব্যবহার করে বা ম্যাপে ক্লিক করে স্থান বাছুন।",
    useLocation: "আমার স্থান ব্যবহার করুন",
    mapHint: "অথবা মার্কার বসাতে ম্যাপে ক্লিক করুন।",
    submit: "রিপোর্ট জমা দিন",
    required: "প্রয়োজনীয় তথ্য পূরণ করে স্থান বাছুন।",
    saveError: "রিপোর্ট সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।",
    photoError: "2 MB-এর কম JPG, PNG বা WebP বাছুন।",
    success: "রিপোর্ট এই ডিভাইসে সংরক্ষিত",
    needs: "জানানো সমস্যা",
    works: "চলমান কাজ",
    facilities: "সুবিধা",
    sample: "নমুনা তথ্য",
    all: "সব ক্ষেত্র",
    roads: "রাস্তা",
    water: "পানি",
    sanitation: "পরিচ্ছন্নতা",
    health: "স্বাস্থ্য",
    electricity: "বিদ্যুৎ",
    other: "অন্যান্য",
    reports: "দৃশ্যমান রিপোর্ট",
    empty: "এই ফিল্টারে কোনো রিপোর্ট নেই।",
    selected: "নির্বাচিত স্থান",
    remove: "ছবি সরান",
    map: "জেলার সমস্যা ইন্টার‌্যাক্টিভ ম্যাপ",
    locateError: "স্থান পাওয়া যায়নি। মার্কার বসাতে ম্যাপে ক্লিক করুন।",
    viewIssue: "সমস্যার বিবরণ",
    close: "বিবরণ বন্ধ করুন",
    status: "অবস্থা",
    filed: "জানানো হয়েছে",
    dept: "দপ্তর",
  },
  ta: {
    eyebrow: "குடிமக்கள் நடவடிக்கை",
    heading: "உள்ளூர் பிரச்சினையைப் பதிவு செய்க",
    intro:
      "புகைப்படத்தைச் சேர்த்து சரியான இடத்தைக் குறிக்கவும். மாவட்ட ஹாட்ஸ்பாட் வரைபடத்தில் அறிக்கை தோன்றும்.",
    prototype: "மாதிரி தனியுரிமை",
    privacy:
      "அறிக்கைகளும் படங்களும் இந்த உலாவியில் மட்டுமே இருக்கும்; அரசு துறைக்கு அனுப்பப்படாது.",
    category: "பிரச்சினை வகை",
    title: "சுருக்கமான தலைப்பு",
    titlePh: "உதாரணம்: பள்ளி அருகே பெரிய பள்ளம்",
    titleError: "5 முதல் 80 எழுத்துகளுக்குள் தலைப்பை உள்ளிடவும்.",
    details: "பிரச்சினையை விவரிக்கவும்",
    detailsPh: "என்ன நடந்தது, எவ்வளவு காலமாக உள்ளது, யாரை பாதிக்கிறது…",
    detailsError: "10 முதல் 500 எழுத்துகளுக்குள் விளக்கத்தை உள்ளிடவும்.",
    department: "பொறுப்பான துறை",
    photos: "புகைப்பட ஆதாரம்",
    addPhoto: "புகைப்படம் தேர்வு",
    photoHelp: "JPG, PNG அல்லது WebP · அதிகபட்சம் 2 MB",
    location: "பிரச்சினை இடம்",
    locationError:
      "உங்கள் சாதனத்தைப் பயன்படுத்தி அல்லது வரைபடத்தில் சொடுக்கி இடத்தைத் தேர்ந்தெடுக்கவும்.",
    useLocation: "என் இடத்தைப் பயன்படுத்து",
    mapHint: "அல்லது குறியீட்டை வைக்க வரைபடத்தில் சொடுக்கவும்.",
    submit: "அறிக்கை சமர்ப்பி",
    required: "தேவையான விவரங்களை நிரப்பி இடத்தைத் தேர்ந்தெடுக்கவும்.",
    saveError: "அறிக்கையைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    photoError: "2 MB-க்கு குறைவான JPG, PNG அல்லது WebP தேர்வு செய்யவும்.",
    success: "அறிக்கை இந்தச் சாதனத்தில் சேமிக்கப்பட்டது",
    needs: "பதிவான தேவைகள்",
    works: "அறியப்பட்ட பணிகள்",
    facilities: "வசதிகள்",
    sample: "மாதிரி தரவு",
    all: "அனைத்து துறைகள்",
    roads: "சாலைகள்",
    water: "தண்ணீர்",
    sanitation: "சுகாதாரம்",
    health: "மருத்துவம்",
    electricity: "மின்சாரம்",
    other: "மற்றவை",
    reports: "தெரியும் அறிக்கைகள்",
    empty: "இந்த வடிகட்டிக்கு அறிக்கைகள் இல்லை.",
    selected: "தேர்ந்தெடுத்த இடம்",
    remove: "படத்தை அகற்று",
    map: "மாவட்ட பிரச்சினை ஊடாடும் வரைபடம்",
    locateError: "இடம் கிடைக்கவில்லை. குறியீட்டை வைக்க வரைபடத்தில் சொடுக்கவும்.",
    viewIssue: "பிரச்சினை விவரங்கள்",
    close: "விவரங்களை மூடு",
    status: "நிலை",
    filed: "பதிவு",
    dept: "துறை",
  },
} satisfies Record<Language, Record<string, string>>;

const sampleOffsets: Record<District, [number, number][]> = {
  gwalior: [
    [0.017, -0.021],
    [0.002, 0.008],
    [-0.014, -0.029],
    [0.028, 0.017],
    [-0.006, 0.025],
  ],
  bhind: [
    [0.014, -0.017],
    [-0.01, 0.011],
    [0.004, 0.025],
    [-0.022, -0.006],
    [0.025, 0.002],
  ],
  morena: [
    [0.012, -0.02],
    [-0.015, 0.014],
    [0.004, 0.022],
    [0.026, 0.008],
    [-0.023, -0.012],
  ],
};

function sampleIssues(district: District): Issue[] {
  const center = centers[district];
  const cats: Category[] = ["roads", "water", "sanitation", "health", "electricity"];
  return sampleOffsets[district].map(([lat, lng], index) => ({
    id: `sample-${district}-${index}`,
    district,
    mode: index === 3 ? "facilities" : index === 4 ? "works" : "needs",
    category: cats[index] ?? "other",
    title:
      [
        "Damaged road surface",
        "Irregular water supply",
        "Waste collection point",
        "Community health centre",
        "Streetlight repair work",
      ][index] ?? "Local issue",
    description: "Demonstration entry showing how a local report appears on the map.",
    department: departmentByCategory[cats[index] ?? "other"],
    date: "2026-09-26",
    status: index === 4 ? "Work scheduled" : "Reported",
    lat: center.lat + lat,
    lng: center.lng + lng,
    location: `${district} sample location`,
    sample: true,
  }));
}

const issueSchema = z.object({
  title: z.string().trim().min(5).max(80),
  description: z.string().trim().min(10).max(500),
  category: z.enum(["roads", "water", "sanitation", "health", "electricity", "other"]),
  lat: z.number(),
  lng: z.number(),
});

let mapsPromise: Promise<typeof google> | null = null;
function loadMaps() {
  if (typeof google !== "undefined" && google.maps) return Promise.resolve(google);
  if (mapsPromise) return mapsPromise;
  mapsPromise = new Promise((resolve, reject) => {
    const key =
      import.meta.env["VITE_GOOGLE_MAPS_BROWSER_KEY"] ||
      import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
    const channel =
      import.meta.env["VITE_GOOGLE_MAPS_TRACKING_ID"] ||
      import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"];
    if (!key) {
      reject(new Error("Map key unavailable"));
      return;
    }
    // Google fires gm_authFailure when the key blocks this domain (e.g. after
    // exporting to new hosting) — surface the friendly fallback instead of a broken map.
    (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = () =>
      reject(new Error("Map key not allowed on this domain"));
    const callback = `initVikasSetuMap${Date.now()}`;
    window[callback as keyof Window] = (() => {
      resolve(google);
      delete window[callback as keyof Window];
    }) as never;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&loading=async&callback=${callback}&channel=${encodeURIComponent(channel ?? "vikassetu")}`;
    script.async = true;
    script.onerror = () => reject(new Error("Map failed to load"));
    document.head.appendChild(script);
  });
  return mapsPromise;
}

export function CitizenIssueMap({ district, language, districtName }: Props) {
  const t = copy[language];
  const mapNode = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const draftMarkerRef = useRef<google.maps.Marker | null>(null);
  const [reports, setReports] = useState<Issue[]>([]);
  const [mode, setMode] = useState<MapMode>("needs");
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [category, setCategory] = useState<Category>("roads");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string>();
  const [location, setLocation] = useState<{ lat: number; lng: number }>();
  const [selected, setSelected] = useState<Issue>();
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [invalidField, setInvalidField] = useState<"title" | "description" | "location" | null>(
    null,
  );

  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    readReports()
      .then(setReports)
      .catch(() => setReports([]));
  }, []);

  const visible = useMemo(
    () =>
      [...sampleIssues(district), ...reports.filter((item) => item.district === district)].filter(
        (item) => item.mode === mode && (filter === "all" || item.category === filter),
      ),
    [district, reports, mode, filter],
  );

  useEffect(() => {
    let cancelled = false;
    setMapReady(false);
    setLocation(undefined);
    loadMaps()
      .then((maps) => {
        if (cancelled || !mapNode.current) return;
        const map = new maps.maps.Map(mapNode.current, {
          center: centers[district],
          zoom: centers[district].zoom,
          clickableIcons: false,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
        });
        mapRef.current = map;
        markersRef.current = [];
        draftMarkerRef.current = null;
        map.addListener("click", (event: google.maps.MapMouseEvent) => {
          const point = event.latLng;
          if (!point) return;
          setLocation({ lat: point.lat(), lng: point.lng() });
          setError("");
          setInvalidField(null);
        });
        setMapReady(true);
      })
      .catch(() => setError("Interactive map is temporarily unavailable."));
    return () => {
      cancelled = true;
    };
  }, [district]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    markersRef.current.forEach((marker) => marker.setMap(null));
    const counts = new Map<string, number>();
    const keyOf = (issue: Issue) => `${issue.lat.toFixed(3)},${issue.lng.toFixed(3)}`;
    visible.forEach((issue) => counts.set(keyOf(issue), (counts.get(keyOf(issue)) ?? 0) + 1));
    markersRef.current = visible.map((issue) => {
      const count = counts.get(keyOf(issue)) ?? 1;
      const marker = new google.maps.Marker({
        map,
        position: { lat: issue.lat, lng: issue.lng },
        title: `${issue.title} — ${issue.department}`,
        label: { text: String(count), color: "#ffffff", fontWeight: "700" },
      });
      marker.addListener("click", () => setSelected(issue));
      return marker;
    });
  }, [visible, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    draftMarkerRef.current?.setMap(null);
    draftMarkerRef.current = null;
    if (!location) return;
    draftMarkerRef.current = new google.maps.Marker({
      map,
      position: location,
      title: t.selected,
      animation: google.maps.Animation.DROP,
      zIndex: 999,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 11,
        fillColor: "#dc2626",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
    });
    map.panTo(location);
    map.setZoom(15);
  }, [location, t.selected, mapReady]);

  useEffect(() => {
    const onFocus = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      const issue = reports.find((item) => item.id === id);
      if (!issue) return;
      setMode(issue.mode);
      setFilter("all");
      setSelected(issue);
      mapRef.current?.panTo({ lat: issue.lat, lng: issue.lng });
      mapRef.current?.setZoom(15);
    };
    window.addEventListener("vikassetu:focus-issue", onFocus);
    return () => window.removeEventListener("vikassetu:focus-issue", onFocus);
  }, [reports]);

  const far = location
    ? Math.abs(location.lat - centers[district].lat) > 0.6 ||
      Math.abs(location.lng - centers[district].lng) > 0.6
    : false;

  const pickPhoto = (file?: File) => {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      setError(t.photoError);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
    setError("");
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setError(t.locateError);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ lat: coords.latitude, lng: coords.longitude });
        setError("");
        setInvalidField(null);
      },
      () => setError(t.locateError),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const submit = async () => {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    if (cleanTitle.length < 5 || cleanTitle.length > 80) {
      setInvalidField("title");
      setError(t.titleError);
      document.getElementById("issue-title")?.focus();
      return;
    }
    if (cleanDescription.length < 10 || cleanDescription.length > 500) {
      setInvalidField("description");
      setError(t.detailsError);
      document.getElementById("issue-details")?.focus();
      return;
    }
    if (!location) {
      setInvalidField("location");
      setError(t.locationError);
      document.getElementById("issue-location")?.focus();
      return;
    }
    const parsed = issueSchema.safeParse({
      title: cleanTitle,
      description: cleanDescription,
      category,
      lat: location.lat,
      lng: location.lng,
    });
    if (!parsed.success) {
      setError(t.required);
      return;
    }
    const id = `VS-${Date.now().toString(36).toUpperCase()}`;
    const issue: Issue = {
      id,
      district,
      mode: "needs",
      category,
      title: parsed.data.title,
      description: parsed.data.description,
      department: departmentByCategory[category],
      date: new Date().toISOString().slice(0, 10),
      status: "Reported",
      lat: location.lat,
      lng: location.lng,
      location: `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`,
      ...(photo ? { photo } : {}),
    };
    try {
      await saveReport(issue);
    } catch {
      setError(t.saveError);
      setInvalidField(null);
      return;
    }
    setReports((items) => [...items, issue]);
    setMode("needs");
    setFilter("all");
    setSelected(issue);
    setTitle("");
    setDescription("");
    setPhoto(undefined);
    setLocation(undefined);
    setError("");
    setInvalidField(null);
    setConfirmation(`${t.success} · ${id}`);
    window.dispatchEvent(new Event("vikassetu:reports-changed"));
  };

  const modes: { key: MapMode; label: string }[] = [
    { key: "needs", label: t.needs },
    { key: "works", label: t.works },
    { key: "facilities", label: t.facilities },
  ];
  const categories: ("all" | Category)[] = [
    "all",
    "roads",
    "water",
    "sanitation",
    "health",
    "electricity",
    "other",
  ];

  return (
    <section
      id="report-issue"
      className="scroll-mt-20 border-t border-border bg-background"
      aria-labelledby="report-issue-heading"
    >
      <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-bold uppercase text-primary">{t.eyebrow}</p>
          <h2
            id="report-issue-heading"
            className="mt-2 text-2xl font-bold text-foreground sm:text-3xl"
          >
            {t.heading}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">{t.intro}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="rounded-md border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex gap-3 rounded-md border border-info-border bg-info p-3 text-info-foreground">
              <Sparkles className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <p className="text-xs leading-5">
                <strong className="block">{t.prototype}</strong>
                {t.privacy}
              </p>
            </div>
            <div className="grid gap-5">
              <div>
                <Label htmlFor="issue-category">{t.category}</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                  <SelectTrigger id="issue-category" className="mt-2 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((item) => (
                      <SelectItem key={item} value={item}>
                        {t[item]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="issue-title">{t.title}</Label>
                <Input
                  id="issue-title"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    if (invalidField === "title") {
                      setInvalidField(null);
                      setError("");
                    }
                  }}
                  maxLength={80}
                  placeholder={t.titlePh}
                  aria-invalid={invalidField === "title"}
                  aria-describedby={invalidField === "title" ? "issue-error" : undefined}
                  className="mt-2 h-11"
                />
              </div>
              <div>
                <Label htmlFor="issue-details">{t.details}</Label>
                <Textarea
                  id="issue-details"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    if (invalidField === "description") {
                      setInvalidField(null);
                      setError("");
                    }
                  }}
                  maxLength={500}
                  placeholder={t.detailsPh}
                  aria-invalid={invalidField === "description"}
                  aria-describedby={invalidField === "description" ? "issue-error" : undefined}
                  className="mt-2 min-h-28 resize-y"
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {description.length}/500
                </p>
              </div>
              <div>
                <Label>{t.department}</Label>
                <div className="mt-2 flex min-h-11 items-center gap-2 rounded-md border border-border bg-muted px-3 text-sm text-foreground">
                  <Building2 className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  {departmentByCategory[category]}
                </div>
              </div>
              <div>
                <Label htmlFor="issue-photo">{t.photos}</Label>
                {photo ? (
                  <div className="mt-2 grid grid-cols-[5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border p-2">
                    <img
                      src={photo}
                      alt={`${title || t.photos} preview`}
                      className="h-16 w-20 rounded-sm object-cover"
                    />
                    <span className="text-xs text-muted-foreground">{t.photoHelp}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setPhoto(undefined)}
                      aria-label={t.remove}
                      className="min-h-11 min-w-11"
                    >
                      <X className="size-4!" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="issue-photo"
                    className="mt-2 flex min-h-20 cursor-pointer items-center justify-center gap-3 rounded-md border border-dashed border-input bg-muted px-4 text-sm font-medium text-foreground focus-within:ring-2 focus-within:ring-ring"
                  >
                    <Upload className="size-5 text-primary" aria-hidden="true" />
                    <span>
                      {t.addPhoto}
                      <small className="mt-1 block font-normal text-muted-foreground">
                        {t.photoHelp}
                      </small>
                    </span>
                    <input
                      id="issue-photo"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(event) => pickPhoto(event.target.files?.[0])}
                    />
                  </label>
                )}
              </div>
              <div
                id="issue-location"
                tabIndex={-1}
                aria-invalid={invalidField === "location"}
                aria-describedby={invalidField === "location" ? "issue-error" : undefined}
                className={
                  invalidField === "location"
                    ? "rounded-md ring-2 ring-destructive ring-offset-2 ring-offset-background"
                    : undefined
                }
              >
                <Label>{t.location}</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={locate}
                  className="mt-2 w-full justify-start"
                >
                  <LocateFixed className="size-4!" />
                  {t.useLocation}
                </Button>
                {location && (
                  <p className="mt-2 flex items-center gap-2 text-xs font-medium text-primary">
                    <MapPin className="size-4" aria-hidden="true" />
                    {t.selected}: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                  </p>
                )}
                {far && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    This point is outside {districtName}. Tap the map to move it closer.
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">{t.mapHint}</p>
              </div>
              {error && (
                <p id="issue-error" role="alert" className="text-sm font-medium text-destructive">
                  {error}
                </p>
              )}
              <Button type="button" onClick={submit} className="h-11 w-full">
                <Plus className="size-5!" />
                {t.submit}
              </Button>
              {confirmation && (
                <p
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-2 text-sm font-semibold text-secondary-foreground"
                >
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                  {confirmation}
                </p>
              )}
            </div>
          </div>

          <div
            id="issue-map"
            className="min-w-0 scroll-mt-20 overflow-hidden rounded-md border border-border bg-card shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.map}>
                {modes.map((item) => (
                  <Button
                    key={item.key}
                    type="button"
                    variant={mode === item.key ? "default" : "outline"}
                    onClick={() => {
                      setMode(item.key);
                      setSelected(undefined);
                    }}
                    role="tab"
                    aria-selected={mode === item.key}
                    className="min-h-11"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
              <span className="rounded-sm bg-secondary px-2 py-1 text-[10px] font-bold uppercase text-secondary-foreground">
                {t.sample}
              </span>
            </div>
            <div
              className="flex gap-1 overflow-x-auto border-b border-border px-3 py-3"
              aria-label="Issue category filters"
            >
              {categories.map((item) => {
                const Icon = item === "all" ? Building2 : categoryIcons[item];
                return (
                  <Button
                    key={item}
                    type="button"
                    variant={filter === item ? "default" : "ghost"}
                    onClick={() => setFilter(item)}
                    aria-pressed={filter === item}
                    className="min-h-11 shrink-0"
                  >
                    <Icon className="size-4!" />
                    {t[item]}
                  </Button>
                );
              })}
            </div>
            <div className="relative">
              <div
                ref={mapNode}
                role="application"
                aria-label={`${districtName}: ${t.map}`}
                className="h-[460px] w-full bg-muted lg:h-[610px]"
              />
              <div className="pointer-events-none absolute left-3 top-3 rounded-md border border-border bg-card/95 px-3 py-2 text-xs font-semibold text-foreground shadow-sm">
                <Navigation className="mr-1.5 inline size-4 text-primary" aria-hidden="true" />
                {visible.length} {t.reports}
              </div>
              {selected && (
                <article
                  className="absolute inset-x-3 bottom-3 max-w-sm rounded-md border border-border bg-card p-4 shadow-xl"
                  aria-label={t.viewIssue}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelected(undefined)}
                    aria-label={t.close}
                    className="absolute right-2 top-2 min-h-11 min-w-11"
                  >
                    <X className="size-4!" />
                  </Button>
                  <div className="pr-10">
                    <p className="text-[10px] font-bold uppercase text-primary">
                      {selected.sample ? t.sample : selected.id}
                    </p>
                    <h3 className="mt-1 text-base font-bold text-foreground">{selected.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {selected.description}
                    </p>
                    {selected.photo && (
                      <img
                        src={selected.photo}
                        alt={`Evidence for ${selected.title}`}
                        className="mt-3 h-28 w-full rounded-sm object-cover"
                      />
                    )}
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <dt className="text-muted-foreground">{t.dept}</dt>
                        <dd className="font-semibold text-foreground">{selected.department}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">{t.status}</dt>
                        <dd className="font-semibold text-foreground">{selected.status}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">{t.filed}</dt>
                        <dd className="font-semibold text-foreground">{selected.date}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">{t.location}</dt>
                        <dd className="truncate font-semibold text-foreground">
                          {selected.location}
                        </dd>
                      </div>
                    </dl>
                    {selected.feedback?.length ? (
                      <div className="mt-3 border-t border-border pt-3">
                        <p className="text-xs font-bold text-foreground">Official feedback</p>
                        {selected.feedback.map((item) => (
                          <p
                            key={`${item.date}-${item.message}`}
                            className="mt-1 text-xs leading-5 text-muted-foreground"
                          >
                            <span className="font-semibold text-primary">
                              {item.author} · {item.date}
                            </span>
                            <br />
                            {item.message}
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              )}
            </div>
            {!visible.length && (
              <p className="border-t border-border p-4 text-sm text-muted-foreground">{t.empty}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
