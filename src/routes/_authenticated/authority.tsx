import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ImageUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GrievanceCard, type GrievanceRow } from "@/components/civic/GrievanceCard";
import { Header } from "@/components/civic/Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { statusClass, statusLabel, type Status } from "@/lib/civic";
import { cn } from "@/lib/utils";
import { useLanguage, type Language } from "@/lib/language";

export const Route = createFileRoute("/_authenticated/authority")({
  head: () => ({
    meta: [
      { title: "Authority resolution dashboard — Civic Triage S36" },
      {
        name: "description",
        content: "Triage assigned grievances and close them with mandatory photo proof.",
      },
      { property: "og:title", content: "Authority dashboard — Civic Triage S36" },
      { property: "og:description", content: "Resolve reports with verifiable evidence." },
    ],
  }),
  component: AuthorityPage,
});

const AUTHORITY_TRANSLATIONS: Record<Language, {
  accessDeniedTitle: string;
  accessDeniedDesc: string;
  resolutionDashboard: string;
  assignedReportsCampus: string;
  assignedReportsCivic: string;
  loadingQueue: string;
  emptyQueue: string;
  startWorkBtn: string;
  markResolvedBtn: string;
  publishCampusUpdate: string;
  publishCivicUpdate: string;
  lblTitle: string;
  placeholderTitle: string;
  lblCategory: string;
  lblMessage: string;
  placeholderMessage: string;
  publishUpdateBtn: string;
  resolveWithProofTitle: string;
  resolveWithProofDesc: string;
  lblResolutionPhoto: string;
  evidencePlaceholder: string;
  confirmResolutionBtn: string;
  toastUploadProof: string;
  toastResolvedSuccess: string;
  toastAnnounceFill: string;
  toastAnnounceSuccess: string;
}> = {
  en: {
    accessDeniedTitle: "Authority access only",
    accessDeniedDesc: "This dashboard is limited to institute and municipality authorities.",
    resolutionDashboard: "Resolution dashboard",
    assignedReportsCampus: "Campus reports assigned to your office, ranked by community support.",
    assignedReportsCivic: "Civic reports assigned to your office, ranked by community support.",
    loadingQueue: "Loading queue…",
    emptyQueue: "Nothing in your queue.",
    startWorkBtn: "Start work",
    markResolvedBtn: "Mark Resolved",
    publishCampusUpdate: "Publish Campus Update",
    publishCivicUpdate: "Publish Civic Update",
    lblTitle: "Title",
    placeholderTitle: "e.g., Scheduled Road Repairs",
    lblCategory: "Category",
    lblMessage: "Message / Notice",
    placeholderMessage: "Provide all relevant details about this update...",
    publishUpdateBtn: "Publish Update",
    resolveWithProofTitle: "Resolve with proof",
    resolveWithProofDesc: "Evidence is mandatory — it is published beside the original report.",
    lblResolutionPhoto: "Resolution photo",
    evidencePlaceholder: "Choose evidence image",
    confirmResolutionBtn: "Confirm resolution",
    toastUploadProof: "Upload a proof image first.",
    toastResolvedSuccess: "Marked resolved. Reporter points awarded.",
    toastAnnounceFill: "Please fill in all announcement fields.",
    toastAnnounceSuccess: "Announcement published successfully.",
  },
  hi: {
    accessDeniedTitle: "केवल आधिकारिक पहुंच",
    accessDeniedDesc: "यह डैशबोर्ड संस्थान और नगरपालिका अधिकारियों तक सीमित है।",
    resolutionDashboard: "समाधान डैशबोर्ड",
    assignedReportsCampus: "आपके कार्यालय को सौंपे गए परिसर की रिपोर्ट, कुरुक्षेत्र समर्थन के आधार पर क्रमबद्ध।",
    assignedReportsCivic: "आपके कार्यालय को सौंपे गए नागरिक रिपोर्ट, कुरुक्षेत्र समर्थन के आधार पर क्रमबद्ध।",
    loadingQueue: "कतार लोड हो रही है…",
    emptyQueue: "आपकी कतार में कुछ भी नहीं है।",
    startWorkBtn: "कार्य शुरू करें",
    markResolvedBtn: "समाधान चिह्नित करें",
    publishCampusUpdate: "परिसर अपडेट प्रकाशित करें",
    publishCivicUpdate: "नागरिक अपडेट प्रकाशित करें",
    lblTitle: "शीर्षक",
    placeholderTitle: "जैसे, निर्धारित सड़क मरम्मत",
    lblCategory: "श्रेणी",
    lblMessage: "संदेश / सूचना",
    placeholderMessage: "इस अपडेट के बारे में सभी प्रासंगिक विवरण प्रदान करें...",
    publishUpdateBtn: "अपडेट प्रकाशित करें",
    resolveWithProofTitle: "प्रमाण के साथ हल करें",
    resolveWithProofDesc: "साक्ष्य अनिवार्य है — इसे मूल रिपोर्ट के पास प्रकाशित किया जाता है।",
    lblResolutionPhoto: "समाधान फोटो",
    evidencePlaceholder: "साक्ष्य छवि चुनें",
    confirmResolutionBtn: "समाधान की पुष्टि करें",
    toastUploadProof: "पहले एक प्रमाण छवि अपलोड करें।",
    toastResolvedSuccess: "समाधान चिह्नित किया गया। रिपोर्टर अंक प्रदान किए गए।",
    toastAnnounceFill: "कृपया सभी घोषणा फ़ील्ड भरें।",
    toastAnnounceSuccess: "घोषणा सफलतापूर्वक प्रकाशित हुई।",
  },
  ta: {
    accessDeniedTitle: "அதிகாரிகளுக்கு மட்டும்",
    accessDeniedDesc: "இந்த டாஷ்போர்டு நிறுவனம் மற்றும் நகராட்சி அதிகாரிகளுக்கு மட்டுமே வரையறுக்கப்பட்டுள்ளது.",
    resolutionDashboard: "தீர்வு டாஷ்போர்டு",
    assignedReportsCampus: "வளாக அறிக்கைகள் உங்கள் அலுவலகத்திற்கு பரிந்துரைக்கப்பட்டுள்ளன, சமூக ஆதரவு அடிப்படையில்.",
    assignedReportsCivic: "குடிமை அறிக்கைகள் உங்கள் அலுவலகத்திற்கு பரிந்துரைக்கப்பட்டுள்ளன, சமூக ஆதரவு அடிப்படையில்.",
    loadingQueue: "பட்டியல் ஏற்றப்படுகிறது…",
    emptyQueue: "உங்களது பட்டியலில் எதுவும் இல்லை.",
    startWorkBtn: "வேலையைத் தொடங்கு",
    markResolvedBtn: "தீர்க்கப்பட்டதாகக் குறி",
    publishCampusUpdate: "வளாக அறிவிப்பை வெளியிடு",
    publishCivicUpdate: "குடிமை அறிவிப்பை வெளியிடு",
    lblTitle: "தலைப்பு",
    placeholderTitle: "உதாரணமாக, திட்டமிடப்பட்ட சாலை பழுதுபார்ப்பு",
    lblCategory: "வகை",
    lblMessage: "செய்தி / அறிவிப்பு",
    placeholderMessage: "இந்த அறிவிப்பைப் பற்றிய முழு விவரங்களையும் வழங்கவும்...",
    publishUpdateBtn: "அறிவிப்பை வெளியिடு",
    resolveWithProofTitle: "ஆதாரத்துடன் தீர்க்கவும்",
    resolveWithProofDesc: "சான்று கட்டாயமாகும் — இது அசல் புகாருடன் வெளியிடப்படும்.",
    lblResolutionPhoto: "தீர்வு புகைப்படம்",
    evidencePlaceholder: "சான்று படத்தை தேர்ந்தெடுக்கவும்",
    confirmResolutionBtn: "தீர்வை உறுதிப்படுத்து",
    toastUploadProof: "ஆதாரப் படத்தை முதலில் பதிवेற்ற வேண்டும்.",
    toastResolvedSuccess: "தீர்க்கப்பட்டது எனக் குறிக்கப்பட்டது. நிருபருக்கு புள்ளிகள் வழங்கப்பட்டன.",
    toastAnnounceFill: "அறிவிப்பின் அனைத்து விவரங்களையும் பூர்த்தி செய்யவும்.",
    toastAnnounceSuccess: "அறிவிப்பு வெற்றிகரமாக வெளியிடப்பட்டது.",
  },
  te: {
    accessDeniedTitle: "అధికారిక ప్రాప్యత మాత్రమే",
    accessDeniedDesc: "ఈ డాష్‌బోర్డ్ ఇన్స్టిట్యూట్ మరియు మునిసిపాలిటీ అధికారులకు పరిమితం చేయబడింది.",
    resolutionDashboard: "పరిష్కార డాష్‌బోర్డ్",
    assignedReportsCampus: "క్యాంపస్ నివేదికలు మీ కార్యాలయానికి కేటాయించబడ్డాయి, కమ్యూనిటీ మద్దతు ఆధారంగా.",
    assignedReportsCivic: "పౌర నివేదికలు మీ కార్యాలయానికి కేటాయించబడ్డాయి, కమ్యూనిటీ మద్దతు ఆధారంగా.",
    loadingQueue: "లోడ్ అవుతోంది…",
    emptyQueue: "మీ క్యూలో ఏమీ లేదు.",
    startWorkBtn: "పని ప్రారంభించు",
    markResolvedBtn: "పరిష్కారం గుర్తు చేయి",
    publishCampusUpdate: "క్యాంపస్ నవీకరణను ప్రచురించు",
    publishCivicUpdate: "పౌర నవీకరణను ప్రచురించు",
    lblTitle: "శీర్షిక",
    placeholderTitle: "ఉదా, రహదారి మరమ్మతులు",
    lblCategory: "వర్గం",
    lblMessage: "సందేశం / నోటీసు",
    placeholderMessage: "ఈ నవీకరణ గురించి అన్ని వివరాలను అందించండి...",
    publishUpdateBtn: "నవీకరణను ప్రచురించు",
    resolveWithProofTitle: "ఆధారంతో పరిష్కరించు",
    resolveWithProofDesc: "సాక్ష్యం తప్పనిసరి — ఇది అసలు నివేదిక పక్కన ప్రచురించబడుతుంది.",
    lblResolutionPhoto: "పరిష్కార ఫోటో",
    evidencePlaceholder: "సాక్ష్యం చిత్రాన్ని ఎంచుకోండి",
    confirmResolutionBtn: "పరిష్కారం నిర్ధారించు",
    toastUploadProof: "మొదట ఆధార చిత్రాన్ని అప్‌లోడ్ చేయండి.",
    toastResolvedSuccess: "పరిష్కరించబడింది. రిపోర్టర్ పాయింట్లు లభించాయి.",
    toastAnnounceFill: "దయచేసి అన్ని నవీకరణ ఫీల్డ్‌లను పూరించండి.",
    toastAnnounceSuccess: "నవీకరణ విజయవంతంగా ప్రచురించబడింది.",
  },
  or: {
    accessDeniedTitle: "କେବଳ ଅଧିକାରୀଙ୍କ ପାଇଁ",
    accessDeniedDesc: "ଏହି ଡ୍ୟାସବୋର୍ଡ କେବଳ ସଂସ୍ଥା ଏବଂ ପୌରପାଳିକା ଅଧିକାରୀଙ୍କ ପାଇଁ ସୀମିତ।",
    resolutionDashboard: "ସମାଧାନ ଡ୍ୟାସବୋର୍ଡ",
    assignedReportsCampus: "କ୍ୟାମ୍ପସ ଅଭିଯୋଗ ଆପଣଙ୍କୁ ଆବଣ୍ଟିତ ହୋଇଛି, ସମର୍ଥନ ଆଧାରରେ।",
    assignedReportsCivic: "ନାଗରିକ ଅଭିଯୋଗ ଆପଣଙ୍କୁ ଆବଣ୍ଟିତ ହୋଇଛି, ସମର୍ଥନ ଆଧାରରେ।",
    loadingQueue: "ଲୋଡ୍ ହେଉଛି…",
    emptyQueue: "ଆପଣଙ୍କର କୌଣସି ଅଭିଯୋଗ ନାହିଁ।",
    startWorkBtn: "କାମ ଆରମ୍ଭ କରନ୍ତୁ",
    markResolvedBtn: "ସମାଧାନ ଚିହ୍նଟ କରନ୍ତୁ",
    publishCampusUpdate: "କ୍ୟାମ୍ପସ ଅପଡେଟ୍ ପ୍ରକାଶ କରନ୍ତୁ",
    publishCivicUpdate: "ପୌର ଅପଡେଟ୍ ପ୍ରକାଶ କରନ୍ତୁ",
    lblTitle: "ଶୀର୍ଷକ",
    placeholderTitle: "ଯେପରିକି, ସଡ଼କ ମରାମତି",
    lblCategory: "ବର୍ଗ",
    lblMessage: "ସନ୍ଦେଶ / ବିବରଣୀ",
    placeholderMessage: "ଏହି ଅପଡેଟ୍ ବିଷୟରେ ସବୁ ତଥ୍ୟ ଦିଅନ୍ତୁ...",
    publishUpdateBtn: "ଅପଡେଟ୍ ପ୍ରକାଶ କରନ୍ତୁ",
    resolveWithProofTitle: "ପ୍ରମାଣ ସହ ସମାଧାନ କରନ୍ତୁ",
    resolveWithProofDesc: "ସାକ୍ଷ୍ୟ ବାଧ୍ୟତାମୂଳକ — ଏହା ମୂଳ ଅଭିଯୋଗ ପାଖରେ ପ୍ରକାଶିତ ହେବ।",
    lblResolutionPhoto: "ସମାଧାନ ଫଟୋ",
    evidencePlaceholder: "ପ୍ରମାଣ ଛବି ଚୟନ କରନ୍ତୁ",
    confirmResolutionBtn: "ସମାଧାନ ନିଶ୍ਚିତ କରନ୍ତୁ",
    toastUploadProof: "ପ୍ରଥମେ ପ୍ରମାଣ ଛବି ଅପଲୋଡ୍ କରନ୍ତୁ। +",
    toastResolvedSuccess: "ସମାଧାନ ଚିହ୍ନଟ ହେଲା। ରିପୋର୍ଟରଙ୍କୁ ପଏଣ୍ଟ ମିଳିଲା।",
    toastAnnounceFill: "ଦୟାକରି ସବୁ ଘୋଷଣା କ୍ଷେତ୍ର ପୂରଣ କରନ୍ତୁ।",
    toastAnnounceSuccess: "ଘୋଷଣା ସଫଳତାର ସହ ପ୍ରକାଶିତ ହେଲା।",
  },
  mr: {
    accessDeniedTitle: "केवळ प्राधिकृत प्रवेश",
    accessDeniedDesc: "हा डॅशबोर्ड संस्था आणि पालिका अधिकाऱ्यांपुरता मर्यादित आहे.",
    resolutionDashboard: "निवारण डॅशबोर्ड",
    assignedReportsCampus: "आपल्या कार्यालयाकडे सोपवलेले कॅम्पस अहवाल, लोकसमर्थनानुसार क्रमवारीत.",
    assignedReportsCivic: "आपल्या कार्यालयाकडे सोपवलेले नागरी अहवाल, लोकसमर्थनानुसार क्रमवारीत.",
    loadingQueue: "रांग लोड होत आहे…",
    emptyQueue: "आपल्या रांगेत काहीही नाही.",
    startWorkBtn: "काम सुरू करा",
    markResolvedBtn: "निवारण म्हणून चिन्हांकित करा",
    publishCampusUpdate: "कॅम्पस अपडेट प्रसिद्ध करा",
    publishCivicUpdate: "नागरी अपडेट प्रसिद्ध करा",
    lblTitle: "शीर्षक",
    placeholderTitle: "उदा. रस्ते दुरुस्ती योजना",
    lblCategory: "वर्ग",
    lblMessage: "संदेश / नोटीस",
    placeholderMessage: "या अपडेटबद्दल सर्व माहिती द्या...",
    publishUpdateBtn: "अपडेट प्रसिद्ध करा",
    resolveWithProofTitle: "पुराव्यासह निवारण करा",
    resolveWithProofDesc: "पुरावा अनिवार्य आहे — तो मूळ तक्रारीसोबत प्रसिद्ध केला जाईल.",
    lblResolutionPhoto: "निवारणाचा फोटो",
    evidencePlaceholder: "पुरावा फोटो निवडा",
    confirmResolutionBtn: "निवारणाची खात्री करा",
    toastUploadProof: "प्रथम पुरावा प्रतिमा अपलोड करा.",
    toastResolvedSuccess: "निवारण नोंदवले. तक्रारदाराला गुण दिले.",
    toastAnnounceFill: "कृपया सर्व घोषणा फील्ड भरा.",
    toastAnnounceSuccess: "घोषणा यशस्वीरित्या प्रसिद्ध झाली.",
  },
  bn: {
    accessDeniedTitle: "केवलমাত্র আধিকারিক প্রবেশাধিকার",
    accessDeniedDesc: "এই ড্যাশবোর্ডটি শিক্ষাপ্রতিষ্ঠান ও পৌর আধিকারিকদের মধ্যে সীমাবদ্ধ।",
    resolutionDashboard: "সমাধান ড্যাশবোর্ড",
    assignedReportsCampus: "আপনার অফিসে নির্ধারিত ক্যাম্পাসের রিপোর্ট, জনসমর্থনের ভিত্তিতে ক্রমানুযায়ী।",
    assignedReportsCivic: "আপনার অফিসে নির্ধারিত নাগরিক রিপোর্ট, জনসমর্থনের ভিত্তিতে ক্রমানুযায়ী।",
    loadingQueue: "তালিকা লোড হচ্ছে…",
    emptyQueue: "আপনার তালিকায় কিছু নেই।",
    startWorkBtn: "কাজ শুরু করুন",
    markResolvedBtn: "মীমাংসিত হিসেবে চিহ্নিত করুন",
    publishCampusUpdate: "ক্যাম্পাস আপডেট প্রকাশ করুন",
    publishCivicUpdate: "নাগরিক আপডেট প্রকাশ করুন",
    lblTitle: "শিরোনাম",
    placeholderTitle: "যেমন, রাস্তা মেরামত",
    lblCategory: "বিভাগ",
    lblMessage: "বার্তা / নোটিশ",
    placeholderMessage: "এই আপডেটের সমস্ত বিবরণ প্রদান করুন...",
    publishUpdateBtn: "আপডেট প্রকাশ করুন",
    resolveWithProofTitle: "প্রমাণ সহ সমাধান করুন",
    resolveWithProofDesc: "প্রমাণ বাধ্যতামূলক — এটি মূল রিপোর্টের পাশে প্রকাশিত হবে।",
    lblResolutionPhoto: "সমাধানের ছবি",
    evidencePlaceholder: "প্রমাণ চিত্র চয়ন করুন",
    confirmResolutionBtn: "সমাধান নিশ্চিত করুন",
    toastUploadProof: "প্রথমে একটি প্রমাণ চিত্র আপলোড করুন।",
    toastResolvedSuccess: "মীমাংসা সম্পূর্ণ। রিপোর্টার পয়েন্ট পেয়েছেন।",
    toastAnnounceFill: "অনুগ্রহ করে সব তথ্য পূরণ করুন।",
    toastAnnounceSuccess: "ঘোষণা সফলভাবে প্রকাশ করা হয়েছে।",
  },
  gu: {
    accessDeniedTitle: "માત્ર અધિકારીઓ માટે પ્રવેશ",
    accessDeniedDesc: "આ ડેશબોર્ડ શૈક્ષણિક સંસ્થા અને નગરપાલિકાના અધિકારીઓ પૂરતું મર્યાદિત છે.",
    resolutionDashboard: "નિવારણ ડેશબોર્ડ",
    assignedReportsCampus: "તમારી ઓફિસને સોંપવામાં આવેલા કેમ્પસ અહેવાલો, સમર્થનના આધારે ક્રમાંકિત.",
    assignedReportsCivic: "તમારી ઓફિસને સોંપવામાં આવેલા નાગરિક અહેવાલો, સમર્થનના આધારે ક્રમાંકિત.",
    loadingQueue: "યાદી લોડ થઈ રહી છે…",
    emptyQueue: "તમારી યાદી ખાલી છે.",
    startWorkBtn: "કામ શરૂ કરો",
    markResolvedBtn: "નિવારણ તરીકે માર્ક કરો",
    publishCampusUpdate: "કેમ્પસ અપડેટ પ્રકાશિત કરો",
    publishCivicUpdate: "નાગરિક અપડેટ પ્રકાશિત કરો",
    lblTitle: "શીર્ષક",
    placeholderTitle: "દા.ત., રોડ સમારકામ યોજના",
    lblCategory: "શ્રેણી",
    lblMessage: "સંદેશ / નોટિસ",
    placeholderMessage: "આ અપડેટ અંગેની તમામ વિગતો લખો...",
    publishUpdateBtn: "અપડેટ પ્રકાશિત કરો",
    resolveWithProofTitle: "પુરાવા સાથે નિવારણ કરો",
    resolveWithProofDesc: "પુરાવો આપવો ફરજિયાત છે — તે મૂળ ફરિયાદ સાથે દર્શાવવામાં આવશે.",
    lblResolutionPhoto: "નિવારણનો ફોટો",
    evidencePlaceholder: "પુરાવો ફોટો પસંદ કરો",
    confirmResolutionBtn: "નિવારણની ખાતरी કરો",
    toastUploadProof: "કૃપા કરીને પહેલા પુરાવાનો ફોટો અપલોડ કરો.",
    toastResolvedSuccess: "નિવારણ થઈ ગયું. રિપોર્ટરને પોઇન્ટ મળ્યા.",
    toastAnnounceFill: "મહેરબાની કરીને બધી માહિતી ભરો.",
    toastAnnounceSuccess: "જાહેરાત સફળતાપૂર્વક પ્રકાશિત થઈ.",
  },
  pa: {
    accessDeniedTitle: "ਸਿਰਫ਼ ਅਧਿਕਾਰੀਆਂ ਲਈ",
    accessDeniedDesc: "ਇਹ ਡੈਸ਼ਬੋਰਡ ਸੰਸਥਾ ਅਤੇ ਨਗਰ ਪਾਲਿਕਾ ਅਧਿਕਾਰੀਆਂ ਤੱਕ ਸੀਮਿਤ ਹੈ।",
    resolutionDashboard: "ਹੱਲ ਡੈਸ਼ਬੋਰਡ",
    assignedReportsCampus: "ਤੁਹਾਡੇ ਦਫ਼ਤਰ ਨੂੰ ਸੌਂਪੀਆਂ ਗਈਆਂ ਕੈਂਪਸ ਰਿਪੋਰਟਾਂ, ਲੋਕ ਸਮਰਥਨ ਅਨੁਸਾਰ।",
    assignedReportsCivic: "ਤੁਹਾਡੇ ਦਫ਼ਤਰ ਨੂੰ ਸੌਂਪੀਆਂ ਗਈਆਂ ਨਾਗਰਿਕ ਰਿਪੋਰਟਾਂ, ਲੋਕ ਸਮਰਥਨ ਅਨੁਸਾਰ।",
    loadingQueue: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…",
    emptyQueue: "ਤੁਹਾਡੀ ਸੂਚੀ ਖਾਲੀ ਹੈ।",
    startWorkBtn: "ਕੰਮ ਸ਼ੁਰੂ ਕਰੋ",
    markResolvedBtn: "ਹੱਲ ਵਜੋਂ ਚਿੰਨ੍ਹਿਤ ਕਰੋ",
    publishCampusUpdate: "ਕੈਂਪਸ ਅਪਡੇਟ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ",
    publishCivicUpdate: "ਨਾਗਰਿਕ ਅਪਡੇਟ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ",
    lblTitle: "ਸਿਰਲੇਖ",
    placeholderTitle: "ਜਿਵੇਂ, ਯੋਜਨਾਬੱਧ ਸੜਕ ਮੁਰੰਮਤ",
    lblCategory: "ਸ਼੍ਰੇਣੀ",
    lblMessage: "ਸੁਨੇਹਾ / ਨੋਟਿਸ",
    placeholderMessage: "ਇਸ ਅਪਡੇਟ ਬਾਰੇ ਪੂਰੀ ਜਾਣਕਾਰੀ ਦਿਓ...",
    publishUpdateBtn: "ਅਪਡੇਟ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ",
    resolveWithProofTitle: "ਸਬੂਤ ਦੇ ਨਾਲ ਹੱਲ ਕਰੋ",
    resolveWithProofDesc: "ਸਬੂਤ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ — ਇਹ ਅਸਲ ਰਿਪੋਰਟ ਦੇ ਨਾਲ ਪ੍ਰਕਾਸ਼ਿਤ ਕੀਤਾ ਜਾਵੇਗਾ।",
    lblResolutionPhoto: "ਹੱਲ ਦੀ ਫੋਟੋ",
    evidencePlaceholder: "ਸਬੂਤ ਤਸਵੀਰ ਚੁਣੋ",
    confirmResolutionBtn: "ਹੱਲ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
    toastUploadProof: "ਪਹਿਲਾਂ ਸਬੂਤ ਦੀ ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ।",
    toastResolvedSuccess: "ਹੱਲ ਹੋ ਗਿਆ। ਰਿਪੋਰਟਰ ਨੂੰ ਅੰਕ ਦਿੱਤੇ ਗਏ।",
    toastAnnounceFill: "ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਖੇਤਰ ਭਰੋ।",
    toastAnnounceSuccess: "ਘੋਸ਼ਣਾ ਸਫਲਤਾਪੂਰਵਕ ਪ੍ਰਕਾਸ਼ਿਤ ਕੀਤੀ ਗਈ।",
  },
};

function AuthorityPage() {
  const { profile, session, isAuthority } = useAuth();
  const { language } = useLanguage();
  const t = AUTHORITY_TRANSLATIONS[language];
  const queryClient = useQueryClient();
  const [target, setTarget] = useState<GrievanceRow | null>(null);
  const [proof, setProof] = useState<File | null>(null);

  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementCategory, setAnnouncementCategory] = useState("Public Works");
  const [announcementContent, setAnnouncementContent] = useState("");

  const scope = profile?.role === "institute_admin" ? "institute" : "civic";

  const { data: queue = [], isLoading } = useQuery({
    queryKey: ["grievances", "authority", scope],
    enabled: isAuthority,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grievances")
        .select("*, author:profiles!grievances_user_id_fkey(full_name)")
        .eq("scope", scope)
        .order("upvotes_count", { ascending: false });
      if (error) throw error;
      return data as unknown as GrievanceRow[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("grievances").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["grievances"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const resolve = useMutation({
    mutationFn: async () => {
      if (!target || !proof || !session) throw new Error(t.toastUploadProof);
      const path = `${session.user.id}/${crypto.randomUUID()}-${proof.name.replace(/[^\w.-]/g, "_")}`;
      const { error: upErr } = await supabase.storage
        .from("resolution-proofs")
        .upload(path, proof);
      if (upErr) throw upErr;
      const url = supabase.storage.from("resolution-proofs").getPublicUrl(path).data.publicUrl;
      const { error } = await supabase
        .from("grievances")
        .update({
          status: "resolved",
          resolution_proof_url: url,
          resolved_by: session.user.id,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", target.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t.toastResolvedSuccess);
      queryClient.invalidateQueries({ queryKey: ["grievances"] });
      setTarget(null);
      setProof(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const publishAnnouncement = useMutation({
    mutationFn: async () => {
      if (!announcementTitle.trim() || !announcementContent.trim() || !session) {
        throw new Error(t.toastAnnounceFill);
      }
      const { error } = await supabase.from("authority_updates").insert({
        title: announcementTitle.trim(),
        content: announcementContent.trim(),
        category: announcementCategory,
        user_id: session.user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t.toastAnnounceSuccess);
      setAnnouncementTitle("");
      setAnnouncementContent("");
      queryClient.invalidateQueries({ queryKey: ["recent-authority-updates"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!isAuthority) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="text-xl font-semibold tracking-tight">{t.accessDeniedTitle}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.accessDeniedDesc}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto px-4 py-10 sm:px-6 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-semibold tracking-tight">{t.resolutionDashboard}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {scope === "institute" ? t.assignedReportsCampus : t.assignedReportsCivic}
          </p>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column: Resolution Queue */}
            <div className="lg:col-span-2 space-y-4">
              {isLoading ? (
                <p className="surface p-10 text-center text-sm text-muted-foreground">{t.loadingQueue}</p>
              ) : queue.length === 0 ? (
                <p className="surface p-10 text-center text-sm text-muted-foreground">
                  {t.emptyQueue}
                </p>
              ) : (
                queue.map((g) => (
                  <GrievanceCard
                    key={g.id}
                    grievance={g}
                    votedIds={new Set()}
                    action={
                      g.status === "resolved" ? (
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[11px] font-medium",
                            statusClass.resolved,
                          )}
                        >
                          {statusLabel.resolved}
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          {g.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setStatus.mutate({ id: g.id, status: "in_progress" })
                              }
                            >
                              {t.startWorkBtn}
                            </Button>
                          )}
                          <Button size="sm" onClick={() => setTarget(g)}>
                            {t.markResolvedBtn}
                          </Button>
                        </div>
                      )
                    }
                  />
                ))
              )}
            </div>

            {/* Right Column: Publish Announcement Form */}
            <div className="lg:col-span-1 bg-white dark:bg-[#0F1A2E] rounded-[18px] border border-[#E2E8F0] dark:border-[#1B2B48] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] p-5">
              <h2 className="text-[15px] font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                {scope === "institute" ? t.publishCampusUpdate : t.publishCivicUpdate}
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  publishAnnouncement.mutate();
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="announcement-title" className="text-[12px] font-bold text-slate-700 dark:text-slate-300">{t.lblTitle}</Label>
                  <Input
                    id="announcement-title"
                    placeholder={t.placeholderTitle}
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    className="bg-transparent border-[#E2E8F0] dark:border-[#1B2B48] focus:border-[#38BDF8]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="announcement-category" className="text-[12px] font-bold text-slate-700 dark:text-slate-300">{t.lblCategory}</Label>
                  <select
                    id="announcement-category"
                    className="flex h-10 w-full rounded-md border border-[#E2E8F0] dark:border-[#1B2B48] bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 dark:text-white"
                    value={announcementCategory}
                    onChange={(e) => setAnnouncementCategory(e.target.value)}
                  >
                    <option value="Public Works">Public Works</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Water Utility">Water Utility</option>
                    <option value="Parks">Parks</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="announcement-content" className="text-[12px] font-bold text-slate-700 dark:text-slate-300">{t.lblMessage}</Label>
                  <Textarea
                    id="announcement-content"
                    placeholder={t.placeholderMessage}
                    rows={4}
                    value={announcementContent}
                    onChange={(e) => setAnnouncementContent(e.target.value)}
                    className="bg-transparent border-[#E2E8F0] dark:border-[#1B2B48] focus:border-[#38BDF8]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={publishAnnouncement.isPending || !announcementTitle.trim() || !announcementContent.trim()}
                >
                  {publishAnnouncement.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t.publishUpdateBtn}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Dialog
        open={!!target}
        onOpenChange={(o) => {
          if (!o) {
            setTarget(null);
            setProof(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.resolveWithProofTitle}</DialogTitle>
            <DialogDescription>
              {t.resolveWithProofDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm font-medium">{target?.title}</p>
            <div className="space-y-1.5">
              <Label htmlFor="proof">{t.lblResolutionPhoto}</Label>
              <label
                htmlFor="proof"
                className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-4 text-sm text-muted-foreground transition-colors hover:bg-accent"
              >
                <ImageUp className="size-4" />
                {proof ? proof.name : t.evidencePlaceholder}
              </label>
              <input
                id="proof"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProof(e.target.files?.[0] ?? null)}
              />
            </div>
            <Button
              className="w-full"
              disabled={!proof || resolve.isPending}
              onClick={() => resolve.mutate()}
            >
              {resolve.isPending && <Loader2 className="size-4 animate-spin" />} {t.confirmResolutionBtn}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
