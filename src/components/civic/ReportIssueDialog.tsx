import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ImageUp, Loader2, LocateFixed, Plus, Mic, MicOff, Languages } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { MapPreview } from "@/components/civic/MapPreview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { distanceMeters, geocodeAddress, getPosition, type Scope } from "@/lib/civic";
import { computeBrowserImageHash, getHammingDistance } from "@/lib/imageHash";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language";

// Explicit type to eliminate any TypeScript property errors
interface IssueItem {
  id: string;
  title: string;
  lat: number | null;
  lng: number | null;
  status: string;
  scope: string;
  image_hash?: string | null;
}

const schema = z.object({
  title: z.string().trim().min(6, "Give the issue a clear title").max(120),
  description: z.string().trim().min(15, "Add a little more detail").max(1000),
});

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "or", name: "ଓଡ଼ିଆ (Odia)" },
  { code: "mr", name: "मराठी (Marathi)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "gu", name: "ગુજરાતી (Gujarati)" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
] as const;

type LangCode = typeof LANGUAGES[number]["code"];

const TRANSLATIONS: Record<LangCode, {
  title: string;
  desc: string;
  fieldTitle: string;
  placeholderTitle: string;
  fieldCategory: string;
  fieldDescription: string;
  placeholderDescription: string;
  fieldPhoto: string;
  placeholderPhoto: string;
  fieldLocation: string;
  btnDetect: string;
  placeholderLocation: string;
  fieldAnonymous: string;
  descAnonymous: string;
  btnSubmit: string;
  btnSubmitting: string;
  similarityAlert: string;
  categories: Record<string, string>;
}> = {
  en: {
    title: "Report an issue",
    desc: "Reports are public and routed to the responsible authority.",
    fieldTitle: "Title",
    placeholderTitle: "Broken streetlight near Gate 3",
    fieldCategory: "Category",
    fieldDescription: "Description",
    placeholderDescription: "What is wrong, since when, and who is affected?",
    fieldPhoto: "Photo",
    placeholderPhoto: "Drop or choose an image",
    fieldLocation: "Location",
    btnDetect: "Detect",
    placeholderLocation: "Enter an address, area, or landmark",
    fieldAnonymous: "Post anonymously",
    descAnonymous: "Your name stays hidden publicly.",
    btnSubmit: "Submit report",
    btnSubmitting: "Submitting...",
    similarityAlert: "A similar issue was recently reported nearby. You can upvote the existing report to boost its priority.",
    categories: {
      "Public Works": "Public Works",
      "Sanitation": "Sanitation",
      "Electrical": "Electrical",
      "Water Utility": "Water Utility",
      "Parks": "Parks",
      "Others": "Others"
    }
  },
  hi: {
    title: "एक समस्या रिपोर्ट करें",
    desc: "रिपोर्ट सार्वजनिक हैं और जिम्मेदार प्राधिकारी को भेजी जाती हैं।",
    fieldTitle: "शीर्षक",
    placeholderTitle: "गेट 3 के पास टूटी हुई स्ट्रीटलाइट",
    fieldCategory: "श्रेणी",
    fieldDescription: "विवरण",
    placeholderDescription: "क्या गलत है, कब से है, और कौन प्रभावित है?",
    fieldPhoto: "फोटो",
    placeholderPhoto: "छवि चुनें या खींचें",
    fieldLocation: "स्थान",
    btnDetect: "खोजें",
    placeholderLocation: "एक पता, क्षेत्र या मील का पत्थर दर्ज करें",
    fieldAnonymous: "अनाम पोस्ट करें",
    descAnonymous: "आपका नाम सार्वजनिक रूप से छिपा रहेगा।",
    btnSubmit: "रिपोर्ट सबमिट करें",
    btnSubmitting: "सबमिट हो रहा है...",
    similarityAlert: "हाल ही में पास में एक समान समस्या की रिपोर्ट की गई थी। इसके महत्व को बढ़ाने के लिए आप इसे अपवोट कर सकते हैं।",
    categories: {
      "Public Works": "लोक निर्माण",
      "Sanitation": "स्वच्छता",
      "Electrical": "बिजली",
      "Water Utility": "जल उपयोगिता",
      "Parks": "पार्क",
      "Others": "अन्य"
    }
  },
  ta: {
    title: "ஒரு சிக்கலைப் புகாரளிக்கவும்",
    desc: "விவரங்கள் பொதுவானவை மற்றும் பொறுப்பான அதிகாரிக்கு அனுப்பப்படுகின்றன.",
    fieldTitle: "தலைப்பு",
    placeholderTitle: "கேட் 3 அருகில் உடைந்த தெருவிளக்கு",
    fieldCategory: "வகை",
    fieldDescription: "விளக்கம்",
    placeholderDescription: "என்ன தவறு, எப்போது முதல், யார் பாதிக்கப்பட்டுள்ளனர்?",
    fieldPhoto: "புகைப்படம்",
    placeholderPhoto: "படம் தேர்ந்தெடுக்கவும் அல்லது இழுக்கவும்",
    fieldLocation: "இடம்",
    btnDetect: "கண்டறி",
    placeholderLocation: "முகவரி, பகுதி அல்லது அடையாளத்தை உள்ளிடவும்",
    fieldAnonymous: "அநாமதேயமாக பகிரவும்",
    descAnonymous: "உங்கள் பெயர் பகிரங்கமாக மறைக்கப்படும்.",
    btnSubmit: "புகாரைச் சமர்ப்பி",
    btnSubmitting: "சமர்ப்பிக்கிறது...",
    similarityAlert: "அண்மையில் அருகிலேயே இதேபோன்ற சிக்கல் ஒன்று புகாரளிக்கப்பட்டுள்ளது. அதன் முன்னுரிமையை அதிகரிக்க நீங்கள் அதை அப்வோட் செய்யலாம்.",
    categories: {
      "Public Works": "பொதுப்பணி",
      "Sanitation": "சுகாதாரம்",
      "Electrical": "மின்சாரம்",
      "Water Utility": "நீர் பயன்பாடு",
      "Parks": "பூங்காக்கள்",
      "Others": "இதர"
    }
  },
  te: {
    title: "సమస్యను నివేదించండి",
    desc: "నివేదికలు పబ్లిక్ మరియు బాధ్యతాయుతమైన అధికారికి పంపబడతాయి.",
    fieldTitle: "శీర్షిక",
    placeholderTitle: "గేట్ 3 దగ్గర విరిగిపోయిన వీధి దీపం",
    fieldCategory: "వర్గం",
    fieldDescription: "వివరణ",
    placeholderDescription: "ఏమి తప్పు జరిగింది, ఎప్పటి నుండి, ఎవరు ప్రభావితమయ్యారు?",
    fieldPhoto: "ఫోటో",
    placeholderPhoto: "చిత్రాన్ని ఎంచుకోండి లేదా లాగండి",
    fieldLocation: "స్థానం",
    btnDetect: "గుర్తించండి",
    placeholderLocation: "చిరునామా, ప్రాంతం లేదా మైలురాయిని నమోదు చేయండి",
    fieldAnonymous: "అనామకంగా పోస్ట్ చేయండి",
    descAnonymous: "మీ పేరు పబ్లిక్‌గా దాచబడుతుంది.",
    btnSubmit: "నివేదికను సమర్పించండి",
    btnSubmitting: "సమర్పిస్తోంది...",
    similarityAlert: "ఇటేవల ఈ సమీపంలో ఇటువంటి సమస్య నివేదించబడింది. దాని ప్రాధాన్యతను పెంచడానికి మీరు దాన్ని అప్వోట్ చేయవచ్చు.",
    categories: {
      "Public Works": "పబ్లిక్ వర్క్స్",
      "Sanitation": "సానిటేషన్",
      "Electrical": "ఎలక్ట్రికల్",
      "Water Utility": "వాటర్ యుటిలిటీ",
      "Parks": "పార్కులు",
      "Others": "ఇతరాలు"
    }
  },
  or: {
    title: "ସମସ୍ୟା ରିପୋର୍ଟ କରନ୍ତୁ",
    desc: "ରିପୋର୍ଟଗୁଡିକ ସାର୍ବଜନୀନ ଏବଂ ଦାୟିତ୍ୱପୂର୍ଣ୍ଣ କର୍ତ୍ତୃପକ୍ଷଙ୍କ ନିକଟକୁ ପଠାଯାଇଥାଏ |",
    fieldTitle: "ଶୀର୍ଷକ",
    placeholderTitle: "ଗେଟ୍ ୩ ନିକଟରେ ଭାଙ୍ଗିଯାଇଥିବା ଷ୍ଟ୍ରିଟ୍‌ଲାଇଟ୍‌",
    fieldCategory: "ବର୍ଗ",
    fieldDescription: "ବର୍ଣ୍ଣନା",
    placeholderDescription: "କଣ ଭୁଲ୍ ଅଛି, କେବେଠାରୁ ଏବଂ କିଏ ପ୍ରଭାବିତ ହୋଇଛନ୍ତି?",
    fieldPhoto: "ଫଟୋ",
    placeholderPhoto: "ଫଟୋ ବାଛନ୍ତୁ କିମ୍ବା ଡ୍ରପ୍ କରନ୍ତୁ",
    fieldLocation: "ସ୍ଥାନ",
    btnDetect: "ଖୋଜନ୍ତୁ",
    placeholderLocation: "ଠିକଣା, ଅଞ୍ଚଳ କିମ୍ବା ସ୍ଥାନ ଚିହ୍ନଟ ପ୍ରବେଶ କରନ୍ତୁ",
    fieldAnonymous: "ଅଜ୍ଞାତ ଭାବରେ ପୋଷ୍ଟ କରନ୍ତୁ",
    descAnonymous: "ଆପଣଙ୍କର ନାମ ସାର୍ବଜନୀନ ଭାବରେ ଲୁଚି ରହିବ |",
    btnSubmit: "ରିପୋର୍ଟ ଦାଖଲ କରନ୍ତୁ",
    btnSubmitting: "ଦାଖଲ ହେଉଛି...",
    similarityAlert: "ନିକଟରେ ଏକ ସମାନ ସମସ୍ୟା ରିପୋର୍ଟ କରାଯାଇଛି। ଆପଣ ଏହି ରିପୋର୍ଟକୁ ଅପଭୋଟ୍ କରିପାରିବେ।",
    categories: {
      "Public Works": "ଲୋକସେବା କାର୍ଯ୍ୟ",
      "Sanitation": "ସଫେଇ",
      "Electrical": "ବିଦ୍ୟୁତ",
      "Water Utility": "ଜଳ ଯୋଗାଣ",
      "Parks": "ପାର୍କ",
      "Others": "ଅନ୍ୟାନ୍ୟ"
    }
  },
  mr: {
    title: "समस्या नोंदवा",
    desc: "तक्रारी सार्वजनिक आहेत आणि संबंधित प्राधिकरणाकडे पाठविल्या जातात.",
    fieldTitle: "शीर्षक",
    placeholderTitle: "गेट ३ जवळ बंद असलेला पथदिवा",
    fieldCategory: "वर्ग / श्रेणी",
    fieldDescription: "वर्णन",
    placeholderDescription: "काय अडचण आहे, कधीपासून आहे आणि कोणावर परिणाम झाला आहे?",
    fieldPhoto: "फोटो",
    placeholderPhoto: "फोटो अपलोड करा किंवा ड्रॅग करा",
    fieldLocation: "ठिकाण",
    btnDetect: "शोधून काढा",
    placeholderLocation: "पत्ता किंवा खुणेची जागा प्रविष्ट करा",
    fieldAnonymous: "अनामिकपणे पोस्ट करा",
    descAnonymous: "तुमचे नाव सार्वजनिकरित्या लपवले जाईल.",
    btnSubmit: "तक्रार सबमिट करा",
    btnSubmitting: "सबमिट होत आहे...",
    similarityAlert: "नुकतीच जवळच अशाच प्रकारच्या समस्येची नोंद झाली आहे. प्राधान्य वाढवण्यासाठी आपण त्याला अपव्होट करू शकता.",
    categories: {
      "Public Works": "सार्वजनिक बांधकाम",
      "Sanitation": "स्वच्छता",
      "Electrical": "विद्युत",
      "Water Utility": "पाणी पुरवठा",
      "Parks": "उद्याने / मार्ग",
      "Others": "इतर"
    }
  },
  bn: {
    title: "একটি সমস্যা প্রতিবেদন করুন",
    desc: "প্রতিবেদনগুলি সর্বজনীন এবং দায়িত্বপ্রাপ্ত কর্তৃপক্ষের কাছে পাঠানো হয়।",
    fieldTitle: "শিরোনাম",
    placeholderTitle: "ゲート ৩ এর কাছে ভাঙা স্ট্রিটলাইট",
    fieldCategory: "বিভাগ",
    fieldDescription: "বর্ণনা",
    placeholderDescription: "কী ভুল আছে, কখন থেকে এবং কে প্রভাবিত?",
    fieldPhoto: "ছবি",
    placeholderPhoto: "ছবি নির্বাচন করুন বা টেনে আনুন",
    fieldLocation: "অবস্থান",
    btnDetect: "সনাক্ত করুন",
    placeholderLocation: "একটি ঠিকানা, এলাকা বা ল্যান্ডমার্ক লিখুন",
    fieldAnonymous: "বেনামে পোস্ট করুন",
    descAnonymous: "আপনার নাম সর্বজনীনভাবে গোপন থাকবে।",
    btnSubmit: "প্রতিবেদন জমা দিন",
    btnSubmitting: "জমা দেওয়া হচ্ছে...",
    similarityAlert: "সম্প্রতি কাছাকাছি একই ধরণের সমস্যা প্রতিবেদন করা হয়েছে। আপনি এর গুরুত্ব বাড়াতে পূর্বের প্রতিবেদনটিতে ভোট দিতে পারেন।",
    categories: {
      "Public Works": "গণপূর্ত",
      "Sanitation": "স্বচ্ছতা",
      "Electrical": "বৈদ্যুতিক",
      "Water Utility": "জল সরবরাহ",
      "Parks": "পার্ক",
      "Others": "অন্যান্য"
    }
  },
  gu: {
    title: "સમસ્યાની જાણ કરો",
    desc: "અહેવાલો સાર્વજનિક છે અને સંબંધિત સત્તાધિકારીને મોકલવામાં આવે છે.",
    fieldTitle: "શીર્ષક",
    placeholderTitle: "ગેટ 3 પાસે તૂટેલી સ્ટ્રીટલાઇટ",
    fieldCategory: "શ્રેણી",
    fieldDescription: "વર્ણન",
    placeholderDescription: "શું ખોટું છે, ક્યારથી છે, અને કોણ પ્રભાવિત છે?",
    fieldPhoto: "ફોટો",
    placeholderPhoto: "છબી બતાવો અથવા ખેંચો",
    fieldLocation: "સ્થาน",
    btnDetect: "શોધો",
    placeholderLocation: "સરનામું, વિસ્તાર કે સીમાચિહ્ન દાખલ કરો",
    fieldAnonymous: "અનામી રીતે પોસ્ટ કરો",
    descAnonymous: "તમારું નામ જાહેર પ્લેટફોર્મ પર છુપાયેલું રહેશે.",
    btnSubmit: "અહેવાલ સબમિટ કરો",
    btnSubmitting: "સમસ્યા સબમિટ થઈ રહી છે...",
    similarityAlert: "તાજેતરમાં નજીકમાં આવી જ એક સમસ્યાની જાણ કરવામાં આવી હતી. અગ્રતા વધારવા માટે તમે તે અહેવાલ પર મત આપી શકો છો.",
    categories: {
      "Public Works": "જાહેર કામો",
      "Sanitation": "સ્વચ્છતા",
      "Electrical": "વીજળી",
      "Water Utility": "પાણી પુરવઠો",
      "Parks": "પાર્ક",
      "Others": "અન્ય"
    }
  },
  pa: {
    title: "ਇੱਕ ਸਮੱਸਿਆ ਦੀ ਰਿਪੋਰਟ ਕਰੋ",
    desc: "ਰਿਪੋਰਟਾਂ ਜਨਤਕ ਹੁੰਦੀਆਂ ਹਨ ਅਤੇ ਜ਼ਿੰਮੇਵਾਰ ਅਥਾਰਟੀ ਨੂੰ ਭੇਜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।",
    fieldTitle: "ਸਿਰਲੇਖ",
    placeholderTitle: "ਗੇਟ 3 ਦੇ ਕੋਲ ਟੁੱਟੀ ਹੋਈ ਸਟ੍ਰੀਟਲਾਈਟ",
    fieldCategory: "ਸ਼੍ਰੇਣੀ",
    fieldDescription: "ਵੇਰਵਾ",
    placeholderDescription: "ਕੀ ਗਲਤ ਹੈ, ਕਦੋਂ ਤੋਂ ਹੈ, ਅਤੇ ਕੌਣ ਪ੍ਰਭਾਵਿਤ ਹੈ?",
    fieldPhoto: "ਫੋਟੋ",
    placeholderPhoto: "ਤਸਵੀਰ ਚੁਣੋ ਜਾਂ ਡਰੈਗ ਕਰੋ",
    fieldLocation: "ਸਥਾਨ",
    btnDetect: "ਲੱਭੋ",
    placeholderLocation: "ਪਤਾ, ਇਲਾਕਾ ਜਾਂ ਲੈਂਡਮਾਰਕ ਦਰਜ ਕਰੋ",
    fieldAnonymous: "ਗੁਮਨਾਮ ਰਿਪੋਰਟ ਕਰੋ",
    descAnonymous: "ਤੁਹਾਡਾ ਨਾਮ ਜਨਤਕ ਤੌਰ 'ਤੇ ਗੁਪਤ ਰਹੇਗਾ।",
    btnSubmit: "ਰਿਪੋਰਟ ਦਰਜ ਕਰੋ",
    btnSubmitting: "ਦਰਜ ਹੋ ਰਿਹਾ ਹੈ...",
    similarityAlert: "ਹਾਲ ਹੀ ਵਿੱਚ ਨੇੜੇ ਹੀ ਇੱਕ ਸਮਾਨ ਸਮੱਸਿਆ ਦੀ ਰਿਪੋਰਟ ਕੀਤੀ ਗਈ ਸੀ। ਤੁਸੀਂ ਇਸ ਨੂੰ ਹੋਰ ਮਹੱਤਵ ਦੇਣ ਲਈ ਵੋਟ ਕਰ ਸਕਦੇ ਹੋ।",
    categories: {
      "Public Works": "ਲੋਕ ਨਿਰਮਾਣ",
      "Sanitation": "ਸਫਾਈ",
      "Electrical": "ਬਿਜਲੀ",
      "Water Utility": "ਪਾਣੀ ਦੀ ਸਹੂਲਤ",
      "Parks": "ਪਾਰਕ",
      "Others": "ਹੋਰ"
    }
  }
};

export function ReportIssueDialog({
  open: openProp,
  onOpenChange,
  trigger = true,
}: {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  trigger?: boolean;
}) {
  const { session, profile } = useAuth();
  const queryClient = useQueryClient();
  const [openInternal, setOpenInternal] = useState(false);
  const open = openProp ?? openInternal;
  const setOpen = (v: boolean) => {
    setOpenInternal(v);
    onOpenChange?.(v);
  };
  const { language: lang, setLanguage: setLang } = useLanguage();
  const [listening, setListening] = useState(false);
  const t = TRANSLATIONS[lang];

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const toggleListening = () => {
    if (!SpeechRecognition) {
      toast.error("Voice-to-text is not supported by your browser. Try using Google Chrome.");
      return;
    }

    if (listening) {
      const activeRec = (window as any).activeSpeechRecognition;
      if (activeRec) {
        activeRec.stop();
      }
      setListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang =
          lang === "hi"
            ? "hi-IN"
            : lang === "ta"
              ? "ta-IN"
              : lang === "te"
                ? "te-IN"
                : lang === "or"
                  ? "or-IN"
                  : lang === "mr"
                    ? "mr-IN"
                    : lang === "bn"
                      ? "bn-IN"
                      : lang === "gu"
                        ? "gu-IN"
                        : lang === "pa"
                          ? "pa-IN"
                          : "en-US";

        recognition.onstart = () => {
          setListening(true);
          toast("Listening... Speak into your microphone.");
        };

        recognition.onresult = (event: any) => {
          const speechToText = event.results[0]?.[0]?.transcript;
          if (speechToText) {
            setDescription((prev) => (prev ? prev + " " + speechToText : speechToText));
            toast.success("Voice input added!");
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          if (event.error !== "no-speech") {
            toast.error(`Voice error: ${event.error}`);
          }
          setListening(false);
        };

        recognition.onend = () => {
          setListening(false);
          (window as any).activeSpeechRecognition = null;
        };

        (window as any).activeSpeechRecognition = recognition;
        recognition.start();
      } catch (err: any) {
        toast.error(`Could not start speech recognition: ${err.message}`);
        setListening(false);
      }
    }
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Public Works");
  const [file, setFile] = useState<File | null>(null);
  const [anonymous, setAnonymous] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    profile?.lat != null && profile?.lng != null
      ? { lat: profile.lat, lng: profile.lng }
      : null,
  );
  const [addressInput, setAddressInput] = useState("");
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const canChooseScope = profile?.role === "student" || profile?.role === "institute_admin";
  const [scope, setScope] = useState<Scope>(canChooseScope ? "institute" : "civic");

  const { data: openIssues } = useQuery<IssueItem[]>({
    queryKey: ["open-grievances-dedupe"],
    enabled: open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grievances")
        .select("id,title,lat,lng,status,scope,image_hash")
        .neq("status", "resolved")
        .limit(500);
      if (error) throw error;
      return (data ?? []) as unknown as IssueItem[];
    },
  });

  const nearby = useMemo(() => {
    if (!coords || !openIssues) return null;
    return (
      openIssues.find(
        (g) =>
          g.scope === scope &&
          g.lat != null &&
          g.lng != null &&
          distanceMeters(coords, { lat: g.lat, lng: g.lng }) <= 150,
      ) ?? null
    );
  }, [coords, openIssues, scope]);

  const CATEGORIES = ["Public Works", "Sanitation", "Electrical", "Water Utility", "Parks", "Others"] as const;

  const reset = () => {
    setTitle("");
    setDescription("");
    setCategory("Public Works");
    setFile(null);
    setAnonymous(false);
    setAddressInput("");
    setResolvedAddress(null);
  };

  const submit = useMutation({
    mutationFn: async () => {
      if (!session) throw new Error("Sign in to report an issue.");
      const parsed = schema.safeParse({ title, description });
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Check your input");
      const point = coords ?? (await getPosition());

      let imageUrl: string | null = null;
      let computedHash: string | null = null;

      // 1. Calculate Perceptual Hash and Check for Duplicate Image
      if (file) {
        computedHash = await computeBrowserImageHash(file);

        if (openIssues && openIssues.length > 0) {
          const duplicate = openIssues.find((issue: IssueItem) => {
            const hashDiff = getHammingDistance(computedHash, issue.image_hash ?? null);
            const dist =
              issue.lat != null && issue.lng != null
                ? distanceMeters(point, { lat: issue.lat, lng: issue.lng })
                : 999999;

            // Block if visually identical image (hashDiff <= 10) or nearby duplicate
            return hashDiff <= 10 || (dist <= 150 && hashDiff <= 16);
          });

          if (duplicate) {
            throw new Error(
              `Duplicate detected! This issue has already been reported as "${duplicate.title}". Please upvote the existing report.`
            );
          }
        }

        const path = `${session.user.id}/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
        const { error: upErr } = await supabase.storage
          .from("grievance-images")
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        imageUrl = supabase.storage.from("grievance-images").getPublicUrl(path).data.publicUrl;
      }

      // 2. Insert into Supabase with the image_hash
      const { error } = await supabase.from("grievances").insert({
        user_id: session.user.id,
        scope,
        institution_name: scope === "institute" ? (profile?.institution_name ?? null) : null,
        title: parsed.data.title,
        description: parsed.data.description,
        category,
        image_url: imageUrl,
        image_hash: computedHash,
        lat: point.lat,
        lng: point.lng,
        is_anonymous: anonymous,
      } as any);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Issue reported. Thanks for flagging it.");
      queryClient.invalidateQueries({ queryKey: ["grievances"] });
      queryClient.invalidateQueries({ queryKey: ["open-grievances-dedupe"] });
      reset();
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" /> Report Issue
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>
              {t.desc}
            </DialogDescription>
          </div>
          <div className="flex items-center gap-1.5 border border-border rounded-lg px-2.5 py-1 bg-secondary/35 text-xs text-muted-foreground mr-6 shrink-0">
            <Languages className="size-3.5" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LangCode)}
              className="bg-transparent border-0 outline-none text-xs font-semibold cursor-pointer text-foreground pr-1"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {canChooseScope && (
            <div className="inline-flex rounded-md border border-border p-0.5">
              {(["institute", "civic"] as Scope[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScope(s)}
                  className={cn(
                    "rounded-[5px] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors",
                    scope === s && "bg-secondary text-foreground",
                  )}
                >
                  {s === "institute" ? "Campus Issue" : "City / Civic Issue"}
                </button>
              ))}
            </div>
          )}

          {nearby && (
            <div className="flex gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>
                {t.similarityAlert} (&ldquo;{nearby.title}&rdquo;)
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="title">{t.fieldTitle}</Label>
            <Input
              id="title"
              value={title}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.placeholderTitle}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.fieldCategory}</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                    category === cat
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {t.categories[cat] || cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">{t.fieldDescription}</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 gap-1 px-2 text-xs rounded-full border border-dashed transition-all",
                  listening
                    ? "bg-red-50 text-red-600 border-red-200 animate-pulse hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50"
                    : "text-muted-foreground hover:bg-accent border-border"
                )}
                onClick={toggleListening}
              >
                {listening ? (
                  <>
                    <MicOff className="size-3.5 animate-bounce" /> Stop (Listening...)
                  </>
                ) : (
                  <>
                    <Mic className="size-3.5" /> Voice Input
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="description"
              rows={4}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.placeholderDescription}
              className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="photo">{t.fieldPhoto}</Label>
            <label
              htmlFor="photo"
              className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-4 text-sm text-muted-foreground transition-colors hover:bg-accent"
            >
              <ImageUp className="size-4" />
              {file ? file.name : t.placeholderPhoto}
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>{t.fieldLocation}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={async () => {
                  try {
                    const pos = await getPosition();
                    setCoords(pos);
                    setResolvedAddress(null);
                    setAddressInput("");
                  } catch (err) {
                    toast.error((err as Error).message);
                  }
                }}
              >
                <LocateFixed className="size-3.5" /> {t.btnDetect}
              </Button>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder={t.placeholderLocation}
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (!addressInput.trim()) return;
                      setGeocoding(true);
                      try {
                        const result = await geocodeAddress(addressInput);
                        if (result) {
                          setCoords({ lat: result.lat, lng: result.lng });
                          setResolvedAddress(result.displayName);
                        } else {
                          toast.error("Could not find that location. Try a different description.");
                        }
                      } finally {
                        setGeocoding(false);
                      }
                    }
                  }}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  if (!addressInput.trim()) return;
                  setGeocoding(true);
                  try {
                    const result = await geocodeAddress(addressInput);
                    if (result) {
                      setCoords({ lat: result.lat, lng: result.lng });
                      setResolvedAddress(result.displayName);
                    } else {
                      toast.error("Could not find that location. Try a different description.");
                    }
                  } finally {
                    setGeocoding(false);
                  }
                }}
                disabled={geocoding || !addressInput.trim()}
                className="shrink-0"
              >
                {geocoding ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
              </Button>
            </div>
            <MapPreview
              lat={coords?.lat ?? null}
              lng={coords?.lng ?? null}
              address={resolvedAddress ?? (addressInput.trim() ? addressInput.trim() : null)}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
            <div>
              <p className="text-sm font-medium">{t.fieldAnonymous}</p>
              <p className="text-xs text-muted-foreground">{t.descAnonymous}</p>
            </div>
            <Switch checked={anonymous} onCheckedChange={setAnonymous} />
          </div>

          <Button
            className="w-full"
            disabled={submit.isPending}
            onClick={() => submit.mutate()}
          >
            {submit.isPending && <Loader2 className="size-4 animate-spin" />}
            {submit.isPending ? t.btnSubmitting : t.btnSubmit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}