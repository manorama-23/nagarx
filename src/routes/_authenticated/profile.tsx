import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Award, Download, ShieldCheck, Sparkles, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Header } from "@/components/civic/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { levelFor } from "@/lib/civic";
import { useLanguage, type Language } from "@/lib/language";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your civic profile — Civic Triage S36" },
      {
        name: "description",
        content: "Track your civic points, resolved reports and citizen level tier.",
      },
      { property: "og:title", content: "Your civic profile — Civic Triage S36" },
      { property: "og:description", content: "Points, resolved reports and your citizen certificate." },
    ],
  }),
  component: ProfilePage,
});

const PROFILE_TRANSLATIONS: Record<Language, {
  profileTitle: string;
  civicPoints: string;
  resolvedSubtitle: string;
  reportedSubtitle: string;
  certHeader: string;
  certTitle: string;
  certLevel: string;
  certPointsSuffix: string;
  downloadCertBtn: string;
  trackerHeader: string;
  trackerDesc: string;
  tableColCitizen: string;
  tableColRole: string;
  tableColGrievances: string;
  tableColPoints: string;
  tableColActions: string;
  certifyBtn: string;
  noCitizensMatch: string;
  dangerZoneHeader: string;
  dangerZoneDesc: string;
  areYouSureDelete: string;
  yesPermanentlyDelete: string;
  cancelBtn: string;
  deleteAccountBtn: string;
  certifiedSuccess: string;
  certifyFail: string;
  deleteSuccess: string;
  deleteFail: string;
  deletingBtn: string;
}> = {
  en: {
    profileTitle: "Profile",
    civicPoints: "civic points",
    resolvedSubtitle: "Resolved of",
    reportedSubtitle: "reported",
    certHeader: "Citizen certificate",
    certTitle: "Civic Triage / S36",
    certLevel: "Level",
    certPointsSuffix: "points",
    downloadCertBtn: "Download Certificate",
    trackerHeader: "Citizen Grievance Tracker & Leaderboard",
    trackerDesc: "Monitor active citizens with the most reports filed and grant official certifications.",
    tableColCitizen: "Citizen",
    tableColRole: "Role",
    tableColGrievances: "Grievances Filed",
    tableColPoints: "Civic Points",
    tableColActions: "Actions",
    certifyBtn: "Certify",
    noCitizensMatch: "No citizens found with reported grievances.",
    dangerZoneHeader: "Danger Zone",
    dangerZoneDesc: "Permanently delete your profile and all associated data, including filed grievances and votes.",
    areYouSureDelete: "Are you absolutely sure you want to delete your account? This action is irreversible. All of your reported grievances, votes, and user credentials will be permanently erased.",
    yesPermanentlyDelete: "Yes, permanently delete my account",
    cancelBtn: "Cancel",
    deleteAccountBtn: "Delete Account",
    certifiedSuccess: "Citizen certified! 100 civic points awarded.",
    certifyFail: "Failed to certify",
    deleteSuccess: "Account deleted successfully.",
    deleteFail: "Error deleting account",
    deletingBtn: "Deleting...",
  },
  hi: {
    profileTitle: "प्रोफ़ाइल",
    civicPoints: "नागरिक अंक",
    resolvedSubtitle: "सुलझाए गए",
    reportedSubtitle: "दर्ज की गई में से",
    certHeader: "नागरिक प्रमाण पत्र",
    certTitle: "नागरिक शिकायत / S36",
    certLevel: "स्तर",
    certPointsSuffix: "अंक",
    downloadCertBtn: "प्रमाण पत्र डाउनलोड करें",
    trackerHeader: "नागरिक शिकायत ट्रैकर और लीडरबोर्ड",
    trackerDesc: "सबसे ज्यादा शिकायतें दर्ज करने वाले सक्रिय नागरिकों की निगरानी करें और आधिकारिक प्रमाणपत्र प्रदान करें।",
    tableColCitizen: "नागरिक",
    tableColRole: "भूमिका",
    tableColGrievances: "दर्ज शिकायतें",
    tableColPoints: "नागरिक अंक",
    tableColActions: "कार्रवाई",
    certifyBtn: "प्रमाणित करें",
    noCitizensMatch: "शिकायत दर्ज कराने वाला कोई नागरिक नहीं मिला।",
    dangerZoneHeader: "खतरनाक क्षेत्र",
    dangerZoneDesc: "अपनी प्रोफ़ाइल और सभी संबंधित डेटा, जिसमें दर्ज शिकायतें और वोट शामिल हैं, को स्थायी रूप से हटा दें।",
    areYouSureDelete: "क्या आप निश्चित रूप से अपना खाता हटाना चाहते हैं? यह कार्रवाई अपरिवर्तनीय है। आपकी सभी शिकायतें, वोट और क्रेडेंशियल्स स्थायी रूप से मिटा दिए जाएंगे।",
    yesPermanentlyDelete: "हाँ, मेरा खाता स्थायी रूप से हटाएं",
    cancelBtn: "रद्द करें",
    deleteAccountBtn: "खाता हटाएं",
    certifiedSuccess: "नागरिक प्रमाणित! 100 नागरिक अंक प्रदान किए गए।",
    certifyFail: "प्रमाणित करने में विफल",
    deleteSuccess: "खाता सफलतापूर्वक हटा दिया गया।",
    deleteFail: "खाता हटाने में त्रुटि",
    deletingBtn: "हटाया जा रहा है...",
  },
  ta: {
    profileTitle: "சுயவிவரம்",
    civicPoints: "குடிமை புள்ளிகள்",
    resolvedSubtitle: "தீர்க்கப்பட்டவை",
    reportedSubtitle: "புகாரளிக்கப்பட்டவற்றில்",
    certHeader: "குடிமகன் சான்றிதழ்",
    certTitle: "குடிமை முறையீடு / S36",
    certLevel: "நிலை",
    certPointsSuffix: "புள்ளிகள்",
    downloadCertBtn: "சான்றிதழ் பதிவிறக்கம்",
    trackerHeader: "குடிமகன் முறையீடு கண்காணிப்பு மற்றும் முன்னிலை அட்டவணை",
    trackerDesc: "அதிக புகார்களை தாக்கல் செய்த குடிமக்களைக் கண்காணித்து அவர்களுக்கு அதிகாரபூர்வ சான்றிதழ்களை வழங்கவும்.",
    tableColCitizen: "குடிமகன்",
    tableColRole: "பங்கு",
    tableColGrievances: "தாக்கல் செய்யப்பட்ட புகார்கள்",
    tableColPoints: "குடிமை புள்ளிகள்",
    tableColActions: "நடவடிக்கைகள்",
    certifyBtn: "சான்றளி",
    noCitizensMatch: "புகாரளித்த குடிமக்கள் யாரும் கண்டறியப்படவில்லை.",
    dangerZoneHeader: "அபாய பகுதி",
    dangerZoneDesc: "உங்கள் சுயவிவரம் மற்றும் அதனுடன் தொடர்புடைய அனைத்து தரவையும் நிரந்தரமாக நீக்கவும்.",
    areYouSureDelete: "உங்கள் கணக்கை நீக்க விரும்புகிறீர்களா? இந்த நடவடிக்கை திரும்பப் பெற முடியாதது.",
    yesPermanentlyDelete: "ஆம், என் கணக்கை நிரந்தரமாக நீக்கு",
    cancelBtn: "ரத்து செய்",
    deleteAccountBtn: "கணக்கை நீக்கு",
    certifiedSuccess: "குடிமகன் சான்றளிக்கப்பட்டார்! 100 குடிமைப் புள்ளிகள் வழங்கப்பட்டன.",
    certifyFail: "சான்றளிக்க முடியவில்லை",
    deleteSuccess: "கணக்கு வெற்றிகரமாக நீக்கப்பட்டது.",
    deleteFail: "கணக்கை நீக்குவதில் பிழை",
    deletingBtn: "நீக்கப்படுகிறது...",
  },
  te: {
    profileTitle: "ప్రొఫైల్",
    civicPoints: "పౌర పాయింట్లు",
    resolvedSubtitle: "పరిష్కరించబడినవి",
    reportedSubtitle: "నివేదించబడిన వాటిలో",
    certHeader: "పౌరుడి ధృవీకరణ పత్రం",
    certTitle: "సివిక్ ట్రియాజ్ / S36",
    certLevel: "స్థాయి",
    certPointsSuffix: "పాయింట్లు",
    downloadCertBtn: "ధృవీకరణ పత్రం డౌన్‌లోడ్",
    trackerHeader: "పౌరుల విన్నపాల ట్రాకర్ & లీడర్‌బోర్డ్",
    trackerDesc: "ఎక్కువ విన్నపాలు దాఖలు చేసిన పౌరులను పర్యవేక్షించండి మరియు అధికారిక ధృవీకరణలను మంజూరు చేయండి.",
    tableColCitizen: "పౌరుడు",
    tableColRole: "పాత్ర",
    tableColGrievances: "దాఖలైన విన్నపాలు",
    tableColPoints: "పౌర పాయింట్లు",
    tableColActions: "చర్యలు",
    certifyBtn: "ధృవీకరించు",
    noCitizensMatch: "निवेదించబడిన విన్నపాలు ఉన్న పౌరులెవరూ కనుగొనబడలేదు.",
    dangerZoneHeader: "డేంజర్ జోన్",
    dangerZoneDesc: "మీ ప్రొఫైల్ మరియు అనుబంధిత డేటాను శాశ్వతంగా తొలగించండి.",
    areYouSureDelete: "మీరు మీ ఖాతాను తొలగించాలనుకుంటున్నారా? ఈ చర్య మార్చలేనిది.",
    yesPermanentlyDelete: "అవును, నా ఖాతాను శాశ్వతంగా తొలగించు",
    cancelBtn: "రద్దు చేయి",
    deleteAccountBtn: "ఖాతాను తొలగించు",
    certifiedSuccess: "పౌరుడు ధృవీకరించబడ్డారు! 100 పౌర పాయింట్లు లభించాయి.",
    certifyFail: "ధృవీకరించడం విఫలమైంది",
    deleteSuccess: "ఖాతా విజయవంతంగా తొలగించబడింది.",
    deleteFail: "ఖాతాను తొలగించడంలో లోపం",
    deletingBtn: "తొలగిస్తున్నాము...",
  },
  or: {
    profileTitle: "ପ୍ରୋଫାଇଲ୍",
    civicPoints: "ନାଗରିକ ପଏଣ୍ଟ",
    resolvedSubtitle: "ସମାଧାନ ହୋଇଥିବା",
    reportedSubtitle: "ଦାଖଲ ମଧ୍ୟରୁ",
    certHeader: "ନାଗରିକ ପ୍ରମାଣପତ୍ର",
    certTitle: "ନାଗରିକ ଅଭିଯୋଗ / S36",
    certLevel: "ସ୍ତର",
    certPointsSuffix: "ପଏଣ୍ଟ",
    downloadCertBtn: "ପ୍ରମାଣପତ୍ର ଡାଉନଲୋଡ୍ କରନ୍ତୁ",
    trackerHeader: "ନାଗରିକ ଅଭିଯୋଗ ଟ୍ରାକର୍ ଏବଂ ଲିଡରବୋର୍ଡ",
    trackerDesc: "ସବୁଠାରୁ ଅଧିକ ଅଭିଯୋଗ କରିଥିବା ନାଗରିକଙ୍କୁ ତଦାରଖ କରନ୍ତୁ ଏବଂ ପ୍ରମାଣପତ୍ର ଦିଅନ୍ତୁ।",
    tableColCitizen: "ନାଗରିକ",
    tableColRole: "ଭୂମିକା",
    tableColGrievances: "ଦାଖଲ ଅଭିଯୋଗ",
    tableColPoints: "ନାଗରିକ ପଏଣ୍ଟ",
    tableColActions: "କାର୍ଯ୍ୟାନୁଷ୍ଠାନ",
    certifyBtn: "ପ୍ରମାଣିତ କରନ୍ତୁ",
    noCitizensMatch: "କୌଣସି ନାଗରିକ ମିଳିଲେ ନାହିଁ।",
    dangerZoneHeader: "ବିପଦ କ୍ଷେତ୍ର",
    dangerZoneDesc: "ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ଏବଂ ସମସ୍ତ ସମ୍ପୃକ୍ତ ତଥ୍ୟକୁ ସ୍ଥାୟୀ ଭାବରେ ବିଲୋପ କରନ୍ତୁ।",
    areYouSureDelete: "ଆପଣ ନିଶ୍ଚିତ ଭାବରେ ଆପଣଙ୍କ ଖାତା ବିଲୋପ କରିବାକୁ ଚାହାଁନ୍ତି କି? ଏହା ଅପରିବର୍ତ୍ତନୀୟ।",
    yesPermanentlyDelete: "ହଁ, ମୋର ଖାତା ସ୍ଥାୟୀ ଭାବରେ ବିଲୋପ କରନ୍ତୁ",
    cancelBtn: "ବାତିଲ୍ କରନ୍ତୁ",
    deleteAccountBtn: "ଖାତା ବିଲୋପ କରନ୍ତୁ",
    certifiedSuccess: "ନାଗରିକ ପ୍ରମାଣିତ ହେଲେ! ୧୦୦ ପଏଣ୍ଟ ମିଳିଲା।",
    certifyFail: "ପ୍ରମାଣିତ କରିବାରେ ବିଫଳ",
    deleteSuccess: "ଖାତା ସଫଳତାପୂର୍ବକ ବିଲୋପ ହେଲା।",
    deleteFail: "ଖାତା ବିଲୋପରେ ବିଫଳତା",
    deletingBtn: "ବିଲୋପ ହେଉଛି...",
  },
  mr: {
    profileTitle: "प्रोफाइल",
    civicPoints: "नागरी गुण",
    resolvedSubtitle: "निवारण झालेले",
    reportedSubtitle: "नोंदवलेल्या पैकी",
    certHeader: "नागरिक प्रमाणपत्र",
    certTitle: "नागरी तक्रार / S36",
    certLevel: "स्तर",
    certPointsSuffix: "गुण",
    downloadCertBtn: "प्रमाणपत्र डाउनलोड करा",
    trackerHeader: "नागरिक तक्रार ट्रॅकर आणि लीडरबोर्ड",
    trackerDesc: "सर्वाधिक तक्रारी दाखल करणाऱ्या सक्रिय नागरिकांवर लक्ष ठेवा आणि प्रमाणपत्रे द्या.",
    tableColCitizen: "नागरिक",
    tableColRole: "भूमिका",
    tableColGrievances: "दाखल तक्रारी",
    tableColPoints: "नागरी गुण",
    tableColActions: "कृती",
    certifyBtn: "प्रमाणित करा",
    noCitizensMatch: "तक्रारी दाखल असलेला कोणताही नागरिक आढळला नाही.",
    dangerZoneHeader: "धोकादायक क्षेत्र",
    dangerZoneDesc: "तुमची प्रोफाइल आणि सर्व संबंधित डेटा कायमचा हटवा.",
    areYouSureDelete: "तुम्हाला तुमचे खाते कायमचे हटवायचे आहे का? ही कृती अपरिवर्तनीय आहे.",
    yesPermanentlyDelete: "होय, माझे खाते कायमचे हटवा",
    cancelBtn: "रद्द करा",
    deleteAccountBtn: "खाते हटवा",
    certifiedSuccess: "नागरिक प्रमाणित! १०० नागरी गुण देण्यात आले.",
    certifyFail: "प्रमाणित करण्यात अपयशी",
    deleteSuccess: "खाते यशस्वीरित्या हटवले.",
    deleteFail: "खाते हटवताना त्रुटी",
    deletingBtn: "हटवत आहे...",
  },
  bn: {
    profileTitle: "প্রোফাইল",
    civicPoints: "নাগরিক পয়েন্ট",
    resolvedSubtitle: "মীমাংসা করা হয়েছে",
    reportedSubtitle: "রিপোর্ট করা মধ্যে",
    certHeader: "নাগরিক শংসাপত্র",
    certTitle: "নাগরিক অভিযোগ / S36",
    certLevel: "স্তর",
    certPointsSuffix: "পয়েন্ট",
    downloadCertBtn: "শংসাপত্র ডাউনলোড করুন",
    trackerHeader: "নাগরিক অভিযোগ ট্র্যাকার এবং লিডারবোর্ড",
    trackerDesc: "সর্বাধিক অভিযোগ দায়েরকারী সক্রিয় নাগরিকদের পর্যবেক্ষণ করুন এবং শংসাপত্র দিন।",
    tableColCitizen: "নাগরিক",
    tableColRole: "ভূমিকা",
    tableColGrievances: "দাখিলকৃত অভিযোগ",
    tableColPoints: "নাগরিক পয়েন্ট",
    tableColActions: "পদক্ষেপ",
    certifyBtn: "সার্টিফাই করুন",
    noCitizensMatch: "অভিযোগ দায়েরকারী কোন নাগরিক পাওয়া যায়নি।",
    dangerZoneHeader: "ডেঞ্জার জোন",
    dangerZoneDesc: "আপনার প্রোফাইল এবং সম্পর্কিত সমস্ত ডেটা স্থায়ীভাবে মুছে ফেলুন।",
    areYouSureDelete: "আপনি কি নিশ্চিতভাবে আপনার অ্যাকাউন্টটি মুছতে চান? এটি পুনরুদ্ধার করা যাবে না।",
    yesPermanentlyDelete: "হ্যাঁ, আমার অ্যাকাউন্ট স্থায়ীভাবে মুছুন",
    cancelBtn: "বাতিল করুন",
    deleteAccountBtn: "অ্যাকাউন্ট মুছুন",
    certifiedSuccess: "নাগরিক শংসাপত্র প্রদান সম্পন্ন! ১০০ পয়েন্ট দেওয়া হয়েছে।",
    certifyFail: "শংসাপত্র প্রদানে ব্যর্থতা",
    deleteSuccess: "অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে।",
    deleteFail: "অ্যাকাউন্ট মুছতে ত্রুটি",
    deletingBtn: "মুছে ফেলা হচ্ছে...",
  },
  gu: {
    profileTitle: "પ્રોફાઇલ",
    civicPoints: "નાગરિક પોઇન્ટ",
    resolvedSubtitle: "ઉકેલાયેલ",
    reportedSubtitle: "નોંધાયેલ પૈકી",
    certHeader: "નાગરિક પ્રમાણપત્ર",
    certTitle: "નાગરિક ફરિયાદ / S36",
    certLevel: "સ્તર",
    certPointsSuffix: "પોઇન્ટ",
    downloadCertBtn: "પ્રમાણપત્ર ડાઉનલોડ કરો",
    trackerHeader: "નાગરિક ફરિયાદ ટ્રેકર અને લીડરબોર્ડ",
    trackerDesc: "સૌથી વધુ ફરિયાદ દાખલ કરનાર સક્રિય નાગરિકોની દેખરેખ રાખો અને પ્રમાણપત્રો આપો.",
    tableColCitizen: "નાગરિક",
    tableColRole: "ભૂમિકા",
    tableColGrievances: "દાખલ કરેલ ફરિયાદો",
    tableColPoints: "નાગરિક પોઇન્ટ",
    tableColActions: "કાર્યવાહી",
    certifyBtn: "પ્રમાણિત કરો",
    noCitizensMatch: "ફરિયાદો દાખલ કરનાર કોઈ નાગરિક મળ્યા નથી.",
    dangerZoneHeader: "ડેન્જર ઝોન",
    dangerZoneDesc: "તમારી પ્રોફાઇલ અને સંબંધિત તમામ માહિતી કાયમી માટે ડિલીટ કરો.",
    areYouSureDelete: "શું તમે ખરેખર તમારું એકાઉન્ટ ડિલીટ કરવા માંગો છો? આ નિર્ણય બદલી શકાશે નહીં.",
    yesPermanentlyDelete: "હા, મારું એકાઉન્ટ કાયમી માટે ડિલીટ કરો",
    cancelBtn: "રદ કરો",
    deleteAccountBtn: "એકાઉન્ટ ડિલીટ કરો",
    certifiedSuccess: "નાગરિક પ્રમાણિત! ૧૦૦ નાગરિક પોઇન્ટ આપવામાં આવ્યા.",
    certifyFail: "પ્રમાણિત કરવામાં નિષ્ફળ",
    deleteSuccess: "એકાઉન્ટ સફળતાપૂર્વક ડિલીટ થયું.",
    deleteFail: "એકાઉન્ટ ડિલીટ કરવામાં ભૂલ",
    deletingBtn: "ડિલીટ થઈ રહ્યું છે...",
  },
  pa: {
    profileTitle: "ਪ੍ਰੋਫਾਈਲ",
    civicPoints: "ਨਾਗਰਿਕ ਅੰਕ",
    resolvedSubtitle: "ਹੱਲ ਕੀਤੇ ਗਏ",
    reportedSubtitle: "ਦਰਜ ਕੀਤੇ ਗਏ ਵਿਚੋਂ",
    certHeader: "ਨਾਗਰਿਕ ਪ੍ਰਮਾਣ ਪੱਤਰ",
    certTitle: "ਨਾਗਰਿਕ ਸ਼ਿਕਾਇਤ / S36",
    certLevel: "ਪੱਧਰ",
    certPointsSuffix: "ਅੰਕ",
    downloadCertBtn: "ਪ੍ਰਮਾਣ ਪੱਤਰ ਡਾਊਨਲੋਡ ਕਰੋ",
    trackerHeader: "ਨਾਗਰਿਕ ਸ਼ਿਕਾਇਤ ਟ੍ਰੈਕਰ ਅਤੇ ਲੀਡਰਬੋਰਡ",
    trackerDesc: "ਸਭ ਤੋਂ ਵੱਧ ਸ਼ਿਕਾਇਤਾਂ ਦਰਜ ਕਰਨ ਵਾਲੇ ਸਰਗਰਮ ਨਾਗਰਿਕਾਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ ਅਤੇ ਪ੍ਰਮਾਣ ਪੱਤਰ ਦਿਓ।",
    tableColCitizen: "ਨਾਗਰਿਕ",
    tableColRole: "ਭੂਮਿਕਾ",
    tableColGrievances: "ਦਰਜ ਸ਼ਿਕਾਇਤਾਂ",
    tableColPoints: "ਨਾਗਰਿਕ ਅੰਕ",
    tableColActions: "ਕਾਰਵਾਈ",
    certifyBtn: "ਪ੍ਰਮਾਣਿਤ ਕਰੋ",
    noCitizensMatch: "ਸ਼ਿਕਾਇਤਾਂ ਦਰਜ ਕਰਨ ਵਾਲਾ ਕੋਈ ਨਾਗਰਿਕ ਨਹੀਂ ਲੱਭਿਆ।",
    dangerZoneHeader: "ਖਤਰਨਾਕ ਖੇਤਰ",
    dangerZoneDesc: "ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਸਾਰਾ ਸਬੰਧਤ ਡੇਟਾ ਪੱਕੇ ਤੌਰ 'ਤੇ ਮਿਟਾਓ।",
    areYouSureDelete: "ਕੀ ਤੁਸੀਂ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਆਪਣਾ ਖਾਤਾ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ? ਇਹ ਵਾਪਸ ਨਹੀਂ ਲਿਆ ਜਾ ਸਕਦਾ।",
    yesPermanentlyDelete: "ਹਾਂ, ਮੇਰਾ ਖਾਤਾ ਪੱਕੇ ਤੌਰ 'ਤੇ ਮਿਟਾਓ",
    cancelBtn: "ਰੱਦ ਕਰੋ",
    deleteAccountBtn: "ਖਾਤਾ ਮਿਟਾਓ",
    certifiedSuccess: "ਨਾਗਰਿਕ ਪ੍ਰਮਾਣਿਤ! ੧੦੦ ਨਾਗਰਿਕ ਅੰਕ ਦਿੱਤੇ ਗਏ।",
    certifyFail: "ਪ੍ਰਮਾਣਿਤ ਕਰਨ ਵਿੱਚ ਅਸਫਲ",
    deleteSuccess: "ਖਾਤਾ ਸਫਲਤਾਪੂਰਵਕ ਮਿਟਾ ਦਿੱਤਾ ਗਿਆ।",
    deleteFail: "ਖਾਤਾ ਮਿਟਾਉਣ ਵਿੱਚ ਨੁਕਸ",
    deletingBtn: "ਮਿਟਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...",
  },
};

function ProfilePage() {
  const { profile, session, signOut, isAuthority } = useAuth();
  const { language } = useLanguage();
  const t = PROFILE_TRANSLATIONS[language];
  const queryClient = useQueryClient();
  const points = profile?.points ?? 0;
  const tier = levelFor(points);

  const [certifying, setCertifying] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Leaderboard statistics for authorities
  const { data: leaderboard, refetch: refetchLeaderboard } = useQuery({
    queryKey: ["citizens-leaderboard"],
    enabled: !!session && isAuthority,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grievances")
        .select(`
          user_id,
          profiles:user_id (id, full_name, email, points, role)
        `);

      if (error) throw error;

      const citizenMap: Record<string, {
        id: string;
        full_name: string;
        email: string;
        points: number;
        role: string;
        count: number;
      }> = {};

      data?.forEach((g: any) => {
        if (!g.profiles) return;
        if (g.profiles.role === "municipality_admin" || g.profiles.role === "institute_admin") return;

        const uid = g.profiles.id;
        if (!citizenMap[uid]) {
          citizenMap[uid] = {
            id: g.profiles.id,
            full_name: g.profiles.full_name,
            email: g.profiles.email,
            points: g.profiles.points ?? 0,
            role: g.profiles.role,
            count: 0,
          };
        }
        citizenMap[uid].count += 1;
      });

      return Object.values(citizenMap).sort((a, b) => b.count - a.count);
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["profile-stats", session?.user.id],
    enabled: !!session && !isAuthority,
    queryFn: async () => {
      const [reported, resolved] = await Promise.all([
        supabase
          .from("grievances")
          .select("id", { count: "exact", head: true })
          .eq("user_id", session!.user.id),
        supabase
          .from("grievances")
          .select("id", { count: "exact", head: true })
          .eq("user_id", session!.user.id)
          .eq("status", "resolved"),
      ]);
      return { reported: reported.count ?? 0, resolved: resolved.count ?? 0 };
    },
  });

  const handleCertify = async (citizenId: string, currentPoints: number) => {
    setCertifying(citizenId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ points: currentPoints + 100 } as any)
        .eq("id", citizenId);

      if (error) throw error;

      toast.success(t.certifiedSuccess);
      await refetchLeaderboard();
    } catch (err: any) {
      toast.error(`${t.certifyFail}: ${err.message}`);
    } finally {
      setCertifying(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!session?.user.id) return;
    setDeleting(true);
    try {
      const userId = session.user.id;

      // 1. Nullify handler links
      await supabase
        .from("grievances")
        .update({ resolved_by: null } as any)
        .eq("resolved_by", userId);

      // 2. Clear votes
      await supabase
        .from("votes")
        .delete()
        .eq("user_id", userId);

      // 3. Clear budget decisions
      await supabase
        .from("budget_votes")
        .delete()
        .eq("user_id", userId);

      // 4. Clear updates
      await supabase
        .from("authority_updates")
        .delete()
        .eq("user_id", userId);

      // 5. Clear grievances
      await supabase
        .from("grievances")
        .delete()
        .eq("user_id", userId);

      // 6. Delete profile row
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      toast.success(t.deleteSuccess);
      await signOut();
      window.location.href = "/";
    } catch (err: any) {
      toast.error(`${t.deleteFail}: ${err.message}`);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  function downloadCertificate() {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Citizen Certificate</title>
<style>body{font-family:Inter,system-ui,sans-serif;margin:0;padding:64px;color:#0f172a}
.card{border:1px solid #e2e8f0;border-radius:12px;padding:56px;text-align:center}
h1{letter-spacing:.2em;text-transform:uppercase;font-size:14px;color:#64748b}
h2{font-size:34px;margin:16px 0 8px}p{color:#475569}</style></head>
<body><div class="card"><h1>${t.certTitle}</h1><h2>${profile?.full_name ?? "Citizen"}</h2>
<p>Recognised as <strong>${t.certLevel} ${tier.level}: ${tier.title}</strong></p>
<p>${points} ${t.certPointsSuffix} · ${stats?.resolved ?? 0} resolved reports</p>
<p>${new Date().toLocaleDateString()}</p></div></body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "civic-triage-certificate.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">{profile?.full_name ?? t.profileTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile?.email} · {profile?.role?.replace("_", " ")}
          {profile?.institution_name ? ` · ${profile.institution_name}` : ""}
        </p>

        {!isAuthority ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="surface p-5">
                <Sparkles className="size-4 text-muted-foreground" />
                <p className="mt-3 text-3xl font-semibold tracking-tight">{points}</p>
                <p className="text-xs text-muted-foreground">{t.civicPoints}</p>
              </div>
              <div className="surface p-5">
                <ShieldCheck className="size-4 text-muted-foreground" />
                <p className="mt-3 text-3xl font-semibold tracking-tight">{stats?.resolved ?? 0}</p>
                <p className="text-xs text-muted-foreground">
                  {t.resolvedSubtitle} {stats?.reported ?? 0} {t.reportedSubtitle}
                </p>
              </div>
              <div className="surface p-5">
                <Award className="size-4 text-muted-foreground" />
                <p className="mt-3 text-sm font-semibold">{t.certLevel} {tier.level}</p>
                <p className="text-xs text-muted-foreground">{tier.title}</p>
              </div>
            </div>

            <section className="surface mt-6 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {t.certHeader}
              </h2>
              <div className="mt-4 rounded-md border border-dashed border-border p-8 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t.certTitle}
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-tight">
                  {profile?.full_name ?? "Citizen"}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t.certLevel} {tier.level}: {tier.title} · {points} {t.certPointsSuffix}
                </p>
              </div>
              <Button className="mt-4 gap-1.5" onClick={downloadCertificate}>
                <Download className="size-4" /> {t.downloadCertBtn}
              </Button>
            </section>
          </>
        ) : (
          <section className="surface mt-6 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {t.trackerHeader}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {t.trackerDesc}
            </p>

            <div className="mt-4 overflow-hidden rounded-md border border-border bg-card">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/40 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">{t.tableColCitizen}</th>
                    <th className="px-4 py-3">{t.tableColRole}</th>
                    <th className="px-4 py-3 text-center">{t.tableColGrievances}</th>
                    <th className="px-4 py-3 text-center">{t.tableColPoints}</th>
                    <th className="px-4 py-3 text-right">{t.tableColActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {!leaderboard || leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-xs text-muted-foreground">
                        {t.noCitizensMatch}
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((citizen) => (
                      <tr key={citizen.id} className="hover:bg-secondary/15 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold">{citizen.full_name}</div>
                          <div className="text-xs text-muted-foreground">{citizen.email}</div>
                        </td>
                        <td className="px-4 py-3 capitalize text-xs">{citizen.role}</td>
                        <td className="px-4 py-3 text-center font-bold text-primary">{citizen.count}</td>
                        <td className="px-4 py-3 text-center font-medium">{citizen.points}</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1.5"
                            onClick={() => handleCertify(citizen.id, citizen.points)}
                            disabled={certifying === citizen.id}
                          >
                            {certifying === citizen.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <Award className="size-3.5" />
                            )}
                            {t.certifyBtn}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Danger Zone */}
        <section className="mt-8 rounded-lg border border-red-200 bg-red-50/50 p-6 dark:border-red-900/30 dark:bg-red-950/10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
            {t.dangerZoneHeader}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground text-red-700/80 dark:text-red-300/80">
            {t.dangerZoneDesc}
          </p>

          {confirmDelete ? (
            <div className="mt-4 rounded-md border border-red-200 bg-destructive/10 p-4 dark:border-red-900/50">
              <p className="text-xs text-red-600 dark:text-red-400 font-semibold mb-3">
                {t.areYouSureDelete}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="gap-1.5"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> {t.deletingBtn}
                    </>
                  ) : (
                    t.yesPermanentlyDelete
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                >
                  {t.cancelBtn}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="destructive"
              className="mt-4 gap-1.5"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="size-4" /> {t.deleteAccountBtn}
            </Button>
          )}
        </section>
      </main>
    </div>
  );
}
