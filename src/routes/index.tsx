import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronDown,
  EyeOff,
  FileText,
  Languages,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import backgroundImage from "@/assets/vikas-setu-login-background.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Mode = "signup" | "login";
type Role = "citizen" | "official";
type Language = "en" | "hi" | "mr" | "bn" | "ta";

const languages: { code: Language; native: string; english: string }[] = [
  { code: "en", native: "English", english: "English" },
  { code: "hi", native: "हिंदी", english: "Hindi" },
  { code: "mr", native: "मराठी", english: "Marathi" },
  { code: "bn", native: "বাংলা", english: "Bengali" },
  { code: "ta", native: "தமிழ்", english: "Tamil" },
];

const copy = {
  en: {
    alreadyAccount: "Already have an account?",
    newTo: "New to VikasSetu?",
    logIn: "Log In",
    signUp: "Sign Up",
    titleSignup: "Create your account",
    titleLogin: "Welcome back",
    subSignup:
      "Join VikasSetu to share development needs, explore insights, and be part of a stronger, more developed India.",
    subLogin: "Log in to continue sharing needs and tracking development in your area.",
    citizen: "Citizen",
    citizenDesc: "Share needs from your area",
    official: "Government Official",
    officialDesc: "Access planning & analytics",
    fullName: "Full Name",
    fullNamePh: "Enter your full name",
    mobile: "Mobile Number",
    mobilePh: "Enter your mobile number",
    sendOtp: "Send OTP",
    resendOtp: "Resend OTP",
    otpSentMsg: "Demo OTP sent. Use 123456.",
    otp: "OTP",
    otpPh: "Enter 6-digit OTP",
    email: "Email Address",
    emailPh: "Enter your email address",
    aadhaar: "Aadhaar Number",
    optional: "(Optional)",
    aadhaarPh: "Enter 12-digit Aadhaar number",
    state: "State",
    statePh: "Select State",
    district: "District",
    districtPh: "Select District",
    mp: "Madhya Pradesh",
    rj: "Rajasthan",
    up: "Uttar Pradesh",
    gwalior: "Gwalior",
    bhind: "Bhind",
    morena: "Morena",
    demoDistrict: "Demo District",
    infoNotice:
      "Your information is secure and will be used only for development-related purposes. We follow government data protection guidelines.",
    createAccount: "Create Account",
    orContinue: "or continue with",
    google: "Continue with Google",
    digilocker: "Continue with DigiLocker",
    googleMsg: "Google sign-in is available in the production version.",
    digilockerMsg: "DigiLocker sign-in is available in the production version.",
    termsPre: "By creating an account, you agree to our",
    terms: "Terms of Service",
    and: "and",
    privacy: "Privacy Policy",
    termsMsg: "Terms of Service preview opened.",
    privacyMsg: "Privacy Policy preview opened.",
    successSignup: "Your VikasSetu profile is ready to preview.",
    successLogin: "Welcome back to VikasSetu.",
    errorFields: "Please complete the required fields.",
    langHeading: "Choose your language",
    accountType: "Account type",
  },
  hi: {
    alreadyAccount: "पहले से खाता है?",
    newTo: "VikasSetu पर नए हैं?",
    logIn: "लॉग इन",
    signUp: "साइन अप",
    titleSignup: "अपना खाता बनाएं",
    titleLogin: "फिर से स्वागत है",
    subSignup:
      "विकास की ज़रूरतें साझा करने, जानकारी पाने और मज़बूत, विकसित भारत का हिस्सा बनने के लिए VikasSetu से जुड़ें।",
    subLogin:
      "अपने क्षेत्र की ज़रूरतें साझा करना और विकास की निगरानी जारी रखने के लिए लॉग इन करें।",
    citizen: "नागरिक",
    citizenDesc: "अपने क्षेत्र की ज़रूरतें साझा करें",
    official: "सरकारी अधिकारी",
    officialDesc: "योजना और विश्लेषण देखें",
    fullName: "पूरा नाम",
    fullNamePh: "अपना पूरा नाम लिखें",
    mobile: "मोबाइल नंबर",
    mobilePh: "अपना मोबाइल नंबर लिखें",
    sendOtp: "OTP भेजें",
    resendOtp: "OTP फिर भेजें",
    otpSentMsg: "डेमो OTP भेजा गया। 123456 का उपयोग करें।",
    otp: "OTP",
    otpPh: "6 अंकों का OTP लिखें",
    email: "ईमेल पता",
    emailPh: "अपना ईमेल पता लिखें",
    aadhaar: "आधार नंबर",
    optional: "(वैकल्पिक)",
    aadhaarPh: "12 अंकों का आधार नंबर लिखें",
    state: "राज्य",
    statePh: "राज्य चुनें",
    district: "ज़िला",
    districtPh: "ज़िला चुनें",
    mp: "मध्य प्रदेश",
    rj: "राजस्थान",
    up: "उत्तर प्रदेश",
    gwalior: "ग्वालियर",
    bhind: "भिंड",
    morena: "मुरैना",
    demoDistrict: "डेमो ज़िला",
    infoNotice:
      "आपकी जानकारी सुरक्षित है और इसका उपयोग केवल विकास संबंधी उद्देश्यों के लिए किया जाएगा। हम सरकारी डेटा सुरक्षा दिशानिर्देशों का पालन करते हैं।",
    createAccount: "खाता बनाएं",
    orContinue: "या इसके साथ जारी रखें",
    google: "Google से जारी रखें",
    digilocker: "DigiLocker से जारी रखें",
    googleMsg: "Google साइन-इन प्रोडक्शन संस्करण में उपलब्ध है।",
    digilockerMsg: "DigiLocker साइन-इन प्रोडक्शन संस्करण में उपलब्ध है।",
    termsPre: "खाता बनाकर, आप हमारी",
    terms: "सेवा की शर्तें",
    and: "और",
    privacy: "गोपनीयता नीति",
    termsMsg: "सेवा की शर्तों का प्रीव्यू खुला।",
    privacyMsg: "गोपनीयता नीति का प्रीव्यू खुला।",
    successSignup: "आपकी VikasSetu प्रोफ़ाइल प्रीव्यू के लिए तैयार है।",
    successLogin: "VikasSetu में फिर से स्वागत है।",
    errorFields: "कृपया आवश्यक फ़ील्ड पूरे करें।",
    langHeading: "अपनी भाषा चुनें",
    accountType: "खाता प्रकार",
  },
  mr: {
    alreadyAccount: "आधीच खाते आहे?",
    newTo: "VikasSetu वर नवीन?",
    logIn: "लॉग इन",
    signUp: "साइन अप",
    titleSignup: "तुमचे खाते तयार करा",
    titleLogin: "पुन्हा स्वागत आहे",
    subSignup:
      "विकासाच्या गरजा शेअर करण्यासाठी, माहिती मिळवण्यासाठी आणि बलवान, विकसित भारताचा भाग बनण्यासाठी VikasSetu मध्ये सामील व्हा.",
    subLogin:
      "तुमच्या भागातील गरजा शेअर करणे आणि विकासाचा मागोवा घेणे सुरू ठेवण्यासाठी लॉग इन करा.",
    citizen: "नागरिक",
    citizenDesc: "तुमच्या भागातील गरजा शेअर करा",
    official: "सरकारी अधिकारी",
    officialDesc: "नियोजन आणि विश्लेषण पाहा",
    fullName: "पूर्ण नाव",
    fullNamePh: "तुमचे पूर्ण नाव लिहा",
    mobile: "मोबाइल नंबर",
    mobilePh: "तुमचा मोबाइल नंबर लिहा",
    sendOtp: "OTP पाठवा",
    resendOtp: "OTP पुन्हा पाठवा",
    otpSentMsg: "डेमो OTP पाठवला. 123456 वापरा.",
    otp: "OTP",
    otpPh: "6 अंकी OTP लिहा",
    email: "ईमेल पत्ता",
    emailPh: "तुमचा ईमेल पत्ता लिहा",
    aadhaar: "आधार क्रमांक",
    optional: "(ऐच्छिक)",
    aadhaarPh: "12 अंकी आधार क्रमांक लिहा",
    state: "राज्य",
    statePh: "राज्य निवडा",
    district: "जिल्हा",
    districtPh: "जिल्हा निवडा",
    mp: "मध्य प्रदेश",
    rj: "राजस्थान",
    up: "उत्तर प्रदेश",
    gwalior: "ग्वाल्हेर",
    bhind: "भिंड",
    morena: "मुरैना",
    demoDistrict: "डेमो जिल्हा",
    infoNotice:
      "तुमची माहिती सुरक्षित आहे आणि केवळ विकासाशी संबंधित कारणांसाठीच वापरली जाईल. आम्ही सरकारी डेटा संरक्षण मार्गदर्शक तत्त्वांचे पालन करतो.",
    createAccount: "खाते तयार करा",
    orContinue: "किंवा यासह सुरू ठेवा",
    google: "Google सह सुरू ठेवा",
    digilocker: "DigiLocker सह सुरू ठेवा",
    googleMsg: "Google साइन-इन प्रोडक्शन आवृत्तीत उपलब्ध आहे.",
    digilockerMsg: "DigiLocker साइन-इन प्रोडक्शन आवृत्तीत उपलब्ध आहे.",
    termsPre: "खाते तयार करून, तुम्ही आमच्या",
    terms: "सेवा अटी",
    and: "आणि",
    privacy: "गोपनीयता धोरण",
    termsMsg: "सेवा अटींचा पूर्वावलोकन उघडला.",
    privacyMsg: "गोपनीयता धोरणाचा पूर्वावलोकन उघडला.",
    successSignup: "तुमची VikasSetu प्रोफाइल पूर्वावलोकनासाठी तयार आहे.",
    successLogin: "VikasSetu मध्ये पुन्हा स्वागत आहे.",
    errorFields: "कृपया आवश्यक फील्ड भरा.",
    langHeading: "तुमची भाषा निवडा",
    accountType: "खाते प्रकार",
  },
  bn: {
    alreadyAccount: "আগে থেকে অ্যাকাউন্ট আছে?",
    newTo: "VikasSetu-তে নতুন?",
    logIn: "লগ ইন",
    signUp: "সাইন আপ",
    titleSignup: "আপনার অ্যাকাউন্ট তৈরি করুন",
    titleLogin: "আবার স্বাগতম",
    subSignup:
      "উন্নয়নের প্রয়োজন শেয়ার করতে, তথ্য জানতে এবং শক্তিশালী, উন্নত ভারতের অংশ হতে VikasSetu-তে যোগ দিন।",
    subLogin: "আপনার এলাকার প্রয়োজন শেয়ার করা এবং উন্নয়ন ট্র্যাক করা চালিয়ে যেতে লগ ইন করুন।",
    citizen: "নাগরিক",
    citizenDesc: "আপনার এলাকার প্রয়োজন শেয়ার করুন",
    official: "সরকারি কর্মকর্তা",
    officialDesc: "পরিকল্পনা ও বিশ্লেষণ দেখুন",
    fullName: "পুরো নাম",
    fullNamePh: "আপনার পুরো নাম লিখুন",
    mobile: "মোবাইল নম্বর",
    mobilePh: "আপনার মোবাইল নম্বর লিখুন",
    sendOtp: "OTP পাঠান",
    resendOtp: "OTP আবার পাঠান",
    otpSentMsg: "ডেমো OTP পাঠানো হয়েছে। 123456 ব্যবহার করুন।",
    otp: "OTP",
    otpPh: "6 সংখ্যার OTP লিখুন",
    email: "ইমেল ঠিকানা",
    emailPh: "আপনার ইমেল ঠিকানা লিখুন",
    aadhaar: "আধার নম্বর",
    optional: "(ঐচ্ছিক)",
    aadhaarPh: "12 সংখ্যার আধার নম্বর লিখুন",
    state: "রাজ্য",
    statePh: "রাজ্য নির্বাচন করুন",
    district: "জেলা",
    districtPh: "জেলা নির্বাচন করুন",
    mp: "মধ্য প্রদেশ",
    rj: "রাজস্থান",
    up: "উত্তর প্রদেশ",
    gwalior: "গোয়ালিয়র",
    bhind: "ভিন্ড",
    morena: "মুরেনা",
    demoDistrict: "ডেমো জেলা",
    infoNotice:
      "আপনার তথ্য নিরাপদ এবং শুধুমাত্র উন্নয়ন সংক্রান্ত উদ্দেশ্যে ব্যবহৃত হবে। আমরা সরকারি ডেটা সুরক্ষা নির্দেশিকা অনুসরণ করি।",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    orContinue: "অথবা এটির সাথে চালিয়ে যান",
    google: "Google দিয়ে চালিয়ে যান",
    digilocker: "DigiLocker দিয়ে চালিয়ে যান",
    googleMsg: "Google সাইন-ইন প্রোডাকশন সংস্করণে উপলব্ধ।",
    digilockerMsg: "DigiLocker সাইন-ইন প্রোডাকশন সংস্করণে উপলব্ধ।",
    termsPre: "অ্যাকাউন্ট তৈরি করে, আপনি আমাদের",
    terms: "সেবার শর্তাবলী",
    and: "এবং",
    privacy: "গোপনীয়তা নীতি",
    termsMsg: "সেবার শর্তাবলীর প্রিভিউ খোলা হয়েছে।",
    privacyMsg: "গোপনীয়তা নীতির প্রিভিউ খোলা হয়েছে।",
    successSignup: "আপনার VikasSetu প্রোফাইল প্রিভিউর জন্য প্রস্তুত।",
    successLogin: "VikasSetu-তে আবার স্বাগতম।",
    errorFields: "অনুগ্রহ করে প্রয়োজনীয় ঘরগুলি পূরণ করুন।",
    langHeading: "আপনার ভাষা বেছে নিন",
    accountType: "অ্যাকাউন্টের ধরন",
  },
  ta: {
    alreadyAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    newTo: "VikasSetu-இல் புதியவரா?",
    logIn: "உள்நுழை",
    signUp: "பதிவு செய்",
    titleSignup: "உங்கள் கணக்கை உருவாக்குங்கள்",
    titleLogin: "மீண்டும் வருக",
    subSignup:
      "மேம்பாட்டுத் தேவைகளைப் பகிர, நுண்ணறிவுகளை ஆராய, வலுவான, வளர்ந்த இந்தியாவின் ஒரு பகுதியாக இருக்க VikasSetu-இல் சேருங்கள்.",
    subLogin:
      "உங்கள் பகுதியின் தேவைகளைப் பகிர்வதையும் மேம்பாட்டைக் கண்காணிப்பதையும் தொடர உள்நுழையவும்.",
    citizen: "குடிமகன்",
    citizenDesc: "உங்கள் பகுதியின் தேவைகளைப் பகிருங்கள்",
    official: "அரசு அதிகாரி",
    officialDesc: "திட்டமிடல் & பகுப்பாய்வை அணுகுங்கள்",
    fullName: "முழு பெயர்",
    fullNamePh: "உங்கள் முழு பெயரை உள்ளிடுங்கள்",
    mobile: "மொபைல் எண்",
    mobilePh: "உங்கள் மொபைல் எண்ணை உள்ளிடுங்கள்",
    sendOtp: "OTP அனுப்பு",
    resendOtp: "OTP மீண்டும் அனுப்பு",
    otpSentMsg: "டெமோ OTP அனுப்பப்பட்டது. 123456 பயன்படுத்தவும்.",
    otp: "OTP",
    otpPh: "6 இலக்க OTP ஐ உள்ளிடுங்கள்",
    email: "மின்னஞ்சல் முகவரி",
    emailPh: "உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடுங்கள்",
    aadhaar: "ஆதார் எண்",
    optional: "(விருப்பம்)",
    aadhaarPh: "12 இலக்க ஆதார் எண்ணை உள்ளிடுங்கள்",
    state: "மாநிலம்",
    statePh: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    district: "மாவட்டம்",
    districtPh: "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
    mp: "மத்திய பிரதேசம்",
    rj: "ராஜஸ்தான்",
    up: "உத்தர பிரதேசம்",
    gwalior: "குவாலியர்",
    bhind: "பிண்ட்",
    morena: "முரைனா",
    demoDistrict: "டெமோ மாவட்டம்",
    infoNotice:
      "உங்கள் தகவல் பாதுகாப்பானது மற்றும் மேம்பாடு தொடர்பான நோக்கங்களுக்காக மட்டுமே பயன்படுத்தப்படும். நாங்கள் அரசு தரவு பாதுகாப்பு வழிகாட்டுதல்களைப் பின்பற்றுகிறோம்.",
    createAccount: "கணக்கை உருவாக்கு",
    orContinue: "அல்லது இதனுடன் தொடரவும்",
    google: "Google உடன் தொடரவும்",
    digilocker: "DigiLocker உடன் தொடரவும்",
    googleMsg: "Google உள்நுழைவு தயாரிப்பு பதிப்பில் கிடைக்கும்.",
    digilockerMsg: "DigiLocker உள்நுழைவு தயாரிப்பு பதிப்பில் கிடைக்கும்.",
    termsPre: "கணக்கை உருவாக்குவதன் மூலம், எங்கள்",
    terms: "சேவை விதிமுறைகள்",
    and: "மற்றும்",
    privacy: "தனியுரிமைக் கொள்கை",
    termsMsg: "சேவை விதிமுறைகளின் மாதிரிக்காட்சி திறக்கப்பட்டது.",
    privacyMsg: "தனியுரிமைக் கொள்கையின் மாதிரிக்காட்சி திறக்கப்பட்டது.",
    successSignup: "உங்கள் VikasSetu சுயவிவரம் மாதிரிக்காட்சிக்குத் தயாராக உள்ளது.",
    successLogin: "VikasSetu-க்கு மீண்டும் வருக.",
    errorFields: "தேவையான புலங்களை நிரப்பவும்.",
    langHeading: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    accountType: "கணக்கு வகை",
  },
} satisfies Record<Language, Record<string, string>>;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VikasSetu — Create your account" },
      {
        name: "description",
        content:
          "Join VikasSetu to share development needs, explore insights, and help build a stronger India.",
      },
      { property: "og:title", content: "VikasSetu — People’s Voice. Better Development." },
      {
        property: "og:description",
        content:
          "Create your VikasSetu account to share local needs and explore development insights.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Field({
  label,
  optional,
  icon: Icon,
  error,
  trailing,
  inputClassName,
  ...props
}: {
  label: string;
  optional?: string;
  icon: typeof UserRound;
  error?: boolean;
  trailing?: React.ReactNode;
  inputClassName?: string;
} & React.ComponentProps<typeof Input>) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 flex h-[17px] items-baseline gap-1.5 overflow-hidden whitespace-nowrap text-[11px] font-semibold text-foreground">
        <span className="min-w-0 truncate">{label}</span>
        {optional && <span className="shrink-0 font-normal text-muted-foreground">{optional}</span>}
      </span>
      <span className="relative block">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          className={`h-10 rounded-md bg-card pl-10 text-xs shadow-none ${error ? "border-destructive ring-1 ring-destructive/20" : ""} ${inputClassName ?? ""}`}
          {...props}
        />
        {trailing}
      </span>
    </label>
  );
}

function Index() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signup");
  const [role, setRole] = useState<Role>("citizen");
  const [language, setLanguage] = useState<Language>("en");
  const [langOpen, setLangOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const statusTimer = useRef<number | null>(null);

  const t = copy[language];

  const notify = (message: string) => {
    if (statusTimer.current !== null) window.clearTimeout(statusTimer.current);
    setStatus(message);
    statusTimer.current = window.setTimeout(() => setStatus(null), 4200);
  };

  useEffect(
    () => () => {
      if (statusTimer.current !== null) window.clearTimeout(statusTimer.current);
    },
    [],
  );

  // Prototype: prefill from account details saved in this browser.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("vikassetu-account");
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        role?: Role;
        name?: string;
        mobile?: string;
        state?: string;
        district?: string;
        language?: Language;
      };
      if (saved.role === "citizen" || saved.role === "official") setRole(saved.role);
      if (typeof saved.name === "string") setName(saved.name);
      if (typeof saved.mobile === "string") setMobile(saved.mobile);
      if (typeof saved.state === "string") setState(saved.state);
      if (typeof saved.district === "string") setDistrict(saved.district);
      if (saved.language && languages.some((item) => item.code === saved.language))
        setLanguage(saved.language);
    } catch {
      // ignore corrupt or unavailable storage
    }
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const valid =
      mode === "login"
        ? mobile.length === 10 && otp.length === 6
        : name.trim().length > 1 && mobile.length === 10 && state && district;
    setSubmitted(true);
    if (valid) {
      // Prototype: keep the account details in this browser only.
      try {
        window.localStorage.setItem(
          "vikassetu-account",
          JSON.stringify({
            mode,
            role,
            name: name.trim(),
            mobile,
            state,
            district,
            language,
            savedAt: new Date().toISOString(),
          }),
        );
      } catch {
        // storage unavailable — prototype continues without saving
      }
      if (role === "citizen") {
        void navigate({ to: "/citizen" });
        return;
      }
      void navigate({ to: "/official" });
      return;
    }
    notify(valid ? (mode === "login" ? t.successLogin : t.successSignup) : t.errorFields);
  };

  const switchMode = () => {
    setMode((current) => (current === "signup" ? "login" : "signup"));
    setSubmitted(false);
    setStatus(null);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background font-sans min-[800px]:h-screen min-[800px]:min-h-[620px] min-[800px]:overflow-hidden">
      <img
        src={backgroundImage}
        alt="VikasSetu development landscape with community planning highlights"
        className="h-auto w-full min-[800px]:absolute min-[800px]:inset-0 min-[800px]:size-full min-[800px]:object-fill"
      />

      <section
        className="relative ml-auto flex min-h-screen w-full flex-col bg-surface px-5 py-5 sm:px-10 min-[800px]:h-screen min-[800px]:min-h-0 min-[800px]:w-[38.25%] min-[800px]:overflow-y-auto min-[800px]:bg-transparent min-[800px]:px-[clamp(1.25rem,2.5vw,3rem)] min-[800px]:py-5"
        aria-labelledby="account-title"
      >
        <header className="flex min-h-10 items-center justify-end gap-4">
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {mode === "signup" ? t.alreadyAccount : t.newTo}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={switchMode}
            className="h-9 min-w-24 border-primary text-primary shadow-none hover:bg-primary hover:text-primary-foreground"
          >
            {mode === "signup" ? t.logIn : t.signUp}
          </Button>
        </header>

        <div className="mx-auto flex w-full max-w-[640px] flex-1 flex-col justify-center py-6 min-[800px]:py-3">
          <div className="mb-3 rounded-md border border-border bg-card">
            <Button
              type="button"
              variant="ghost"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((open) => !open)}
              className="h-10 w-full justify-between gap-2 rounded-md px-3 shadow-none hover:bg-account-selected"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Languages className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="truncate text-[11px] font-semibold text-foreground">
                  {t.langHeading}
                </span>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {languages.find((item) => item.code === language)?.native}
                </span>
              </span>
              <ChevronDown
                className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </Button>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-out ${langOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-1.5 px-2 pb-2">
                  {languages.map((item) => {
                    const selected = language === item.code;
                    return (
                      <Button
                        key={item.code}
                        type="button"
                        variant="outline"
                        aria-pressed={selected}
                        onClick={() => {
                          setLanguage(item.code);
                          setLangOpen(false);
                        }}
                        className={`h-auto w-full justify-between gap-2 rounded-md px-3 py-2 shadow-none ${selected ? "border-primary bg-account-selected hover:bg-account-selected" : "bg-card"}`}
                      >
                        <span className="flex min-w-0 items-baseline gap-2">
                          <span className="text-xs font-semibold text-foreground">
                            {item.native}
                          </span>
                          {item.code !== "en" && (
                            <span className="text-[10px] text-muted-foreground">
                              {item.english}
                            </span>
                          )}
                        </span>
                        {selected && (
                          <Check className="size-4! shrink-0 text-primary" aria-hidden="true" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h1
              id="account-title"
              className="text-[clamp(1.8rem,2.35vw,2.7rem)] font-bold leading-tight text-foreground"
            >
              {mode === "signup" ? t.titleSignup : t.titleLogin}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-5 text-muted-foreground">
              {mode === "signup" ? t.subSignup : t.subLogin}
            </p>
          </div>

          {mode === "signup" && (
            <div
              className="mb-3 grid grid-cols-2 gap-2.5 min-[1100px]:gap-3"
              aria-label={t.accountType}
            >
              {(["citizen", "official"] as const).map((item) => {
                const selected = role === item;
                const Icon = item === "citizen" ? UserRound : Building2;
                return (
                  <Button
                    key={item}
                    type="button"
                    variant="outline"
                    aria-pressed={selected}
                    onClick={() => setRole(item)}
                    className={`relative h-auto w-full flex-col items-center gap-1.5 overflow-hidden whitespace-normal rounded-md px-2 py-3.5 text-center shadow-none min-[1100px]:px-3 ${selected ? "border-primary bg-account-selected hover:bg-account-selected" : "bg-card"}`}
                  >
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-md min-[1100px]:size-10 ${selected ? "bg-account-icon text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      <Icon
                        className="size-5! stroke-[1.75] min-[1100px]:size-6!"
                        aria-hidden="true"
                      />
                    </span>
                    <strong className="block w-full text-[11px] font-bold leading-tight text-foreground min-[1100px]:text-xs">
                      {item === "citizen" ? t.citizen : t.official}
                    </strong>
                    <span className="block min-h-8 w-full text-[10px] font-normal leading-4 text-muted-foreground">
                      {item === "citizen" ? t.citizenDesc : t.officialDesc}
                    </span>
                    {selected && (
                      <BadgeCheck
                        className="size-4! shrink-0 fill-primary text-primary-foreground absolute right-2 top-2 min-[1100px]:right-3 min-[1100px]:top-3"
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                );
              })}
            </div>
          )}

          <form onSubmit={submit} noValidate>
            <div className="grid gap-2.5 xl:grid-cols-2">
              {mode === "signup" && (
                <div className="xl:col-span-2">
                  <Field
                    label={t.fullName}
                    icon={UserRound}
                    placeholder={t.fullNamePh}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    error={submitted && name.trim().length < 2}
                  />
                </div>
              )}

              <div className="xl:col-span-2">
                <span className="mb-1 flex h-[17px] items-baseline text-[11px] font-semibold text-foreground">
                  {t.mobile}
                </span>
                <div className="flex gap-3">
                  <span className="relative min-w-0 flex-1">
                    <Phone
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      aria-label={t.mobile}
                      inputMode="numeric"
                      maxLength={10}
                      placeholder={t.mobilePh}
                      value={mobile}
                      onChange={(event) => setMobile(event.target.value.replace(/\D/g, ""))}
                      className={`h-10 bg-card pl-10 text-xs shadow-none ${submitted && mobile.length !== 10 ? "border-destructive ring-1 ring-destructive/20" : ""}`}
                    />
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOtpSent(true);
                      notify(t.otpSentMsg);
                    }}
                    className="h-10 shrink-0 whitespace-normal border-primary px-5 text-xs font-semibold text-primary shadow-none"
                  >
                    {otpSent ? t.resendOtp : t.sendOtp}
                  </Button>
                </div>
              </div>

              {otpSent && (
                <div className="xl:col-span-2">
                  <Field
                    label={t.otp}
                    icon={ShieldCheck}
                    inputMode="numeric"
                    maxLength={6}
                    placeholder={t.otpPh}
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                    error={submitted && mode === "login" && otp.length !== 6}
                  />
                </div>
              )}

              {mode === "signup" && (
                <>
                  <Field
                    label={t.email}
                    optional={t.optional}
                    icon={Mail}
                    type="email"
                    placeholder={t.emailPh}
                  />
                  <Field
                    label={t.aadhaar}
                    optional={t.optional}
                    icon={BadgeCheck}
                    inputMode="numeric"
                    maxLength={12}
                    placeholder={t.aadhaarPh}
                    inputClassName="pr-9"
                    trailing={
                      <EyeOff
                        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                      />
                    }
                  />
                  <label className="block min-w-0">
                    <span className="mb-1 flex h-[17px] items-baseline text-[11px] font-semibold text-foreground">
                      {t.state}
                    </span>
                    <Select
                      value={state}
                      onValueChange={(value) => {
                        setState(value);
                        setDistrict("");
                      }}
                    >
                      <SelectTrigger
                        className={`h-10 bg-card text-xs shadow-none ${submitted && !state ? "border-destructive ring-1 ring-destructive/20" : ""}`}
                      >
                        <MapPin className="size-4 text-muted-foreground" />
                        <SelectValue placeholder={t.statePh} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp">{t.mp}</SelectItem>
                        <SelectItem value="rj">{t.rj}</SelectItem>
                        <SelectItem value="up">{t.up}</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="block min-w-0">
                    <span className="mb-1 flex h-[17px] items-baseline text-[11px] font-semibold text-foreground">
                      {t.district}
                    </span>
                    <Select value={district} onValueChange={setDistrict} disabled={!state}>
                      <SelectTrigger
                        className={`h-10 bg-card text-xs shadow-none ${submitted && !district ? "border-destructive ring-1 ring-destructive/20" : ""}`}
                      >
                        <MapPin className="size-4 text-muted-foreground" />
                        <SelectValue placeholder={t.districtPh} />
                      </SelectTrigger>
                      <SelectContent>
                        {state === "mp" ? (
                          <>
                            <SelectItem value="gwalior">{t.gwalior}</SelectItem>
                            <SelectItem value="bhind">{t.bhind}</SelectItem>
                            <SelectItem value="morena">{t.morena}</SelectItem>
                          </>
                        ) : (
                          <SelectItem value="demo">{t.demoDistrict}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </label>
                </>
              )}
            </div>

            {mode === "signup" && (
              <div className="mt-3 flex gap-3 rounded-md bg-info px-4 py-3 text-[10px] leading-4 text-info-foreground">
                <ShieldCheck
                  className="mt-0.5 size-5 shrink-0 fill-primary text-primary-foreground"
                  aria-hidden="true"
                />
                <p>{t.infoNotice}</p>
              </div>
            )}

            <Button
              type="submit"
              className="mt-3 h-11 w-full gap-2 whitespace-normal rounded-md bg-submit text-xs font-bold text-primary-foreground shadow-none hover:bg-submit-hover"
            >
              {mode === "signup" ? t.createAccount : t.logIn}
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Button>
          </form>

          <div className="my-3 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            {t.orContinue}
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-2 gap-2 min-[1100px]:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => notify(t.googleMsg)}
              className="h-10 min-w-0 gap-1 overflow-hidden bg-card px-2 text-[8px] font-semibold shadow-none min-[1100px]:gap-2 min-[1100px]:px-4 min-[1100px]:text-[10px]"
            >
              <span className="shrink-0 text-xs font-bold text-google min-[1100px]:text-sm">G</span>
              <span className="truncate">{t.google}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => notify(t.digilockerMsg)}
              className="h-10 min-w-0 gap-1 overflow-hidden bg-card px-2 text-[8px] font-semibold shadow-none min-[1100px]:gap-2 min-[1100px]:px-4 min-[1100px]:text-[10px]"
            >
              <FileText className="size-3.5 shrink-0 text-digilocker min-[1100px]:size-4" />
              <span className="truncate">{t.digilocker}</span>
            </Button>
          </div>
          <p className="mt-4 text-center text-[9px] text-muted-foreground">
            {t.termsPre}{" "}
            <Button
              type="button"
              variant="link"
              onClick={() => notify(t.termsMsg)}
              className="h-auto p-0 text-[9px] text-primary"
            >
              {t.terms}
            </Button>{" "}
            {t.and}{" "}
            <Button
              type="button"
              variant="link"
              onClick={() => notify(t.privacyMsg)}
              className="h-auto p-0 text-[9px] text-primary"
            >
              {t.privacy}
            </Button>
            .
          </p>
        </div>
      </section>

      {status && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-md border border-toast-border bg-toast px-4 py-3 text-sm text-toast-foreground shadow-xl"
        >
          <Check className="size-4 shrink-0" />
          <span className="flex-1">{status}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 text-toast-foreground hover:bg-toast-hover hover:text-toast-foreground"
            onClick={() => setStatus(null)}
            aria-label="Dismiss message"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
    </main>
  );
}
