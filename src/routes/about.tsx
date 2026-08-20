import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/civic/Header";
import { Info, ShieldCheck, Zap, HeartHandshake, Eye, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLanguage, type Language } from "@/lib/language";

export const Route = createFileRoute("/about")({
    component: AboutPage,
});

const ABOUT_TRANSLATIONS: Record<Language, {
    heroTitle1: string;
    heroTitle2: string;
    heroDesc: string;
    exploreBtn: string;
    ourMissionTitle: string;
    ourMissionDesc1: string;
    ourMissionDesc2: string;
    ourMissionHighlight: string;
    corePrinciplesTitle: string;
    corePrinciplesDesc: string;
    t1: string;
    d1: string;
    t2: string;
    d2: string;
    t3: string;
    d3: string;
    t4: string;
    d4: string;
    footerRights: string;
    footerSlogan: string;
}> = {
    en: {
        heroTitle1: "Empowering Citizens,",
        heroTitle2: "Transforming Cities",
        heroDesc: "NagarX is a next-generation civic triage platform designed to bridge the gap between citizens and municipal authorities. We believe in transparent, accountable, and highly responsive local governance.",
        exploreBtn: "Explore Dashboard",
        ourMissionTitle: "Our Mission",
        ourMissionDesc1: "Cities grow rapidly, and managing civic infrastructure demands an immense amount of coordination. Traditional reporting methods often leave citizens in the dark and authorities overwhelmed by unstructured data.",
        ourMissionDesc2: "NagarX sets out to solve this by providing a transparent and crowdsourced problem tracking system. By utilizing community voting, live heatmaps, and streamlined authority workflows, we ensure that critical issues are prioritized and resolved rapidly.",
        ourMissionHighlight: "transparent and crowdsourced problem tracking system",
        corePrinciplesTitle: "Core Principles",
        corePrinciplesDesc: "Built from the ground up to ensure efficiency, transparency, and accountability at every stage of the civic pipeline.",
        t1: "Absolute Transparency",
        d1: "Track grievances from when they are reported to their final resolution, with public updates and timelines.",
        t2: "Verified Resolutions",
        d2: "Authorities must upload photographic proof of the completed work to close any civic issue.",
        t3: "Participatory Budgeting",
        d3: "Citizens have a direct say in how municipal or campus funds are allocated for new infrastructure.",
        t4: "Rapid Action",
        d4: "Intelligent filtering and upvoting guarantees that the most urgent community needs are prioritised instantly.",
        footerRights: "NagarX Civic Solutions. All rights reserved.",
        footerSlogan: "Your Voice • Our Responsibility",
    },
    hi: {
        heroTitle1: "नागरिकों को सशक्त बनाना,",
        heroTitle2: "शहरों को बदलना",
        heroDesc: "NagarX एक अगली पीढ़ी का नागरिक शिकायत समाधान मंच है जिसे नागरिकों और नगर पालिका अधिकारियों के बीच की दूरी को पाटने के लिए डिज़ाइन किया गया है। हम पारदर्शी, जवाबदेह और अत्यधिक संवेदनशील शासन में विश्वास करते हैं।",
        exploreBtn: "डैशबोर्ड देखें",
        ourMissionTitle: "हमारा मिशन",
        ourMissionDesc1: "शहर तेजी से बढ़ते हैं, और नागरिक बुनियादी ढांचे के प्रबंधन के लिए भारी मात्रा में समन्वय की आवश्यकता होती है। पारंपरिक रिपोर्टिंग विधियां अक्सर नागरिकों को अंधेरे में छोड़ देती हैं और अधिकारी अव्यवस्थित डेटा से परेशान हो जाते हैं।",
        ourMissionDesc2: "NagarX एक पारदर्शी और क्राउडसोर्स समस्या ट्रैकिंग प्रणाली प्रदान करके इसे हल करने के लिए तैयार है। सामुदायिक मतदान, लाइव हीटमैप और सुव्यवस्थित प्राधिकरण वर्कफ़्लो का उपयोग करके, हम सुनिश्चित करते हैं कि महत्वपूर्ण मुद्दों को प्राथमिकता दी जाए और तेज़ी से हल किया जाए।",
        ourMissionHighlight: "पारदर्शी और क्राउडसोर्स समस्या ट्रैकिंग प्रणाली",
        corePrinciplesTitle: "मुख्य सिद्धांत",
        corePrinciplesDesc: "नागरिक पाइपलाइन के हर चरण में दक्षता, पारदर्शिता और जवाबदेही सुनिश्चित करने के लिए नए सिरे से तैयार किया गया है।",
        t1: "पूर्ण पारदर्शिता",
        d1: "शिकायतों की रिपोर्ट होने से लेकर उनके अंतिम समाधान तक, सार्वजनिक अपडेट और समयसीमा के साथ नज़र रखें।",
        t2: "सत्यापित समाधान",
        d2: "किसी भी नागरिक मुद्दे को बंद करने के लिए अधिकारियों को पूर्ण कार्य का फोटोग्राफिक प्रमाण अपलोड करना आवश्यक है।",
        t3: "भागीदारी बजट",
        d3: "नए बुनियादी ढांचे के लिए नगर पालिका या परिसर के फंड का आवंटन कैसे किया जाता है, इसमें नागरिकों का सीधा योगदान होता है।",
        t4: "त्वरित कार्रवाई",
        d4: "बुद्धिमान फ़िल्टरिंग और मतदान गारंटी देता है कि सबसे जरूरी सामुदायिक जरूरतों को तुरंत प्राथमिकता दी जाए।",
        footerRights: "NagarX नागरिक समाधान। सर्वाधिकार सुरक्षित।",
        footerSlogan: "आपकी आवाज़ • हमारी ज़िम्मेदारी",
    },
    ta: {
        heroTitle1: "குடிமக்களை மேம்படுத்துதல்,",
        heroTitle2: "நகரங்களை மாற்றுதல்",
        heroDesc: "NagarX என்பது குடிமக்களுக்கும் நகராட்சி அதிகாரிகளுக்கும் இடையே உள்ள இடைவெளியைக் குறைக்க வடிவமைக்கப்பட்ட ஒரு அடுத்த தலைமுறை குடிமை முறையீட்டு மையமாகும். வெளிப்படையான, பொறுப்பான மற்றும் விரைந்து பதிலளிக்கும் உள்ளூர் ஆட்சியை நாங்கள் நம்புகிறோம்.",
        exploreBtn: "டாஷ்போர்டை ஆராய்க",
        ourMissionTitle: "எங்கள் நோக்கம்",
        ourMissionDesc1: "நகரங்கள் வேகமாக வளர்கின்றன, மேலும் குடிமை உள்கட்டமைப்பை நிர்வகிப்பதற்கு மகத்தான ஒருங்கிணைப்பு தேவைப்படுகிறது. பாரம்பரிய புகாரளிப்பு முறைகள் பெரும்பாலும் குடிமக்களை விவரம் தெரியாமல் வைக்கின்றன மற்றும் அதிகாரிகள் ஒழுங்கமைக்கப்படாத தரவினால் திணறுகின்றனர்.",
        ourMissionDesc2: "NagarX ஒரு வெளிப்படையான மற்றும் கூட்டு ஆதாரப் பிரச்சனை கண்காணிப்பு முறையை வழங்குவதன் மூலம் இதைத் தீர்க்க முயல்கிறது. சமூக வாக்குப்பதிவு, நேரலை வரைபடங்கள் மற்றும் நெறிப்படுத்தப்பட்ட பணிப்பாய்வுகளைப் பயன்படுத்துவதன் மூலம், முக்கியமான சிக்கல்களுக்கு முன்னுரிமை அளிக்கப்பட்டு விரைவாக தீர்க்கப்படுவதை நாங்கள் உறுதி செய்கிறோம்.",
        ourMissionHighlight: "வெளிப்படையான மற்றும் கூட்டு ஆதாரப் பிரச்சனை கண்காணிப்பு முறை",
        corePrinciplesTitle: "முக்கிய கொள்கைகள்",
        corePrinciplesDesc: "குடிமை செயல்முறையின் ஒவ்வொரு கட்டத்திலும் செயல்திறன், வெளிப்படைத்தன்மை மற்றும் பொறுப்புணர்வை உறுதிப்படுத்தும் வகையில் புதிதாக உருவாக்கப்பட்டது.",
        t1: "முழுமையான வெளிப்படைத்தன்மை",
        d1: "புகார்கள் தாக்கல் செய்யப்பட்டது முதல் இறுதி தீர்வு வரை, பொதுவான அறிவிப்புகள் மற்றும் காலவரிசைகளுடன் கண்காணிக்கவும்.",
        t2: "சரிபார்க்கப்பட்ட தீர்வுகள்",
        d2: "எந்தவொரு குடிமைச் சிக்கலையும் தீர்க்க அதிகாரிகள் முடிக்கப்பட்ட வேலை புகைப்பட ஆதாரத்தைப் பதிவேற்ற வேண்டும்.",
        t3: "பங்குபெறும் பட்ஜெட்",
        d3: "புதிய உள்கட்டமைப்புகளுக்காக நகராட்சி அல்லது வளாக நிதிகள் எவ்வாறு ஒதுக்கப்படுகின்றன என்பதில் குடிமக்களுக்கு நேரடி பங்கு உண்டு.",
        t4: "விரைவான நடவடிக்கை",
        d4: "புத்திசாலித்தனமான வடிகட்டுதல் மற்றும் வாக்களிப்பு மிகவும் அவசரமான சமூகத் தேவைகளுக்கு உடனடியாக முன்னுரிமை வழங்குவதை உறுதி செய்கிறது.",
        footerRights: "NagarX குடிமை தீர்வுகள். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
        footerSlogan: "உங்கள் குரல் • எங்கள் கடமை",
    },
    te: {
        heroTitle1: "పౌరుల సాధికారత,",
        heroTitle2: "నగరాల రూపాంతరం",
        heroDesc: "NagarX అనేది పౌరులకు మరియు మున్సిపల్ అధికారులు మధ్య దూరాన్ని తగ్గించడానికి రూపొందించబడిన తదుపరి తరం ప్రజా విన్నపాల పరిష్కార వేదిక. మేము పారదర్శకమైన, బాధ్యతాయుతమైన మరియు అత్యంత ప్రతిస్పందించే స్థానిక పాలనను నమ్ముతాము.",
        exploreBtn: "డాష్‌బోర్డ్ అన్వేషించండి",
        ourMissionTitle: "మా లక్ష్యం",
        ourMissionDesc1: "నగరాలు వేగంగా విస్తరిస్తున్నాయి మరియు పౌర మౌలిక సదుపాయాల నిర్వహణకు విపరీతమైన సమన్వయం అవసరం. సంప్రదాయ నివేదిక పద్ధతులు తరచుగా పౌరులను అయోమయంలో నెడుతుంటాయి మరియు అధికారులు అశాస్త్రీయ డేటాతో ఉక్కిరిబిక్కిరి అవుతారు.",
        ourMissionDesc2: "NagarX పారదర్శకమైన మరియు క్రౌడ్‌సోర్స్ ఆధారిత విన్నపాల ట్రాకింగ్ వ్యవస్థను అందించడం ద్వారా దీనిని పరిష్కరిస్తుంది. కమ్యూనిటీ ఓటింగ్, లైవ్ హీట్‌మ్యాప్‌లు మరియు క్రమబద్ధీకరించిన అధికార వర్క్‌ఫ్లోల సహాయంతో, మేము క్లిష్టమైన సమస్యలను త్వరగా పరిష్కరించేలా చూస్తాము.",
        ourMissionHighlight: "పారదర్శకమైన మరియు క్రౌడ్‌సోర్స్ ఆధారిత విన్నపాల ట్రాకింగ్ వ్యవస్థ",
        corePrinciplesTitle: "ప్రధాన సూత్రాలు",
        corePrinciplesDesc: "పౌర వ్యవహారాల ప్రతి దశలో సామర్థ్యం, పారదర్శకత మరియు బాధ్యతాయుత ప్రవృత్తిని నిర్ధారించేలా మొదటి నుండి నిర్మించబడింది.",
        t1: "సంపూర్ణ పారదర్శకత",
        d1: "విన్నపాలు దాఖలు చేసినప్పటి నుండి వాటి తుది పరిష్కారం వరకు, బహిరంగ అప్‌డేట్‌లు మరియు కాలక్రమాలతో ట్రాక్ చేయండి.",
        t2: "ధృవీకరించబడిన పరిష్కారాలు",
        d2: "ఏదైనా పౌర సమస్యను ముగించడానికి అధికారులు పూర్తి చేసిన పని యొక్క ఫోటో ఆధారాలను అప్‌లోడ్ చేయాల్సి ఉంటుంది.",
        t3: "భాగస్వామ్య బడ్జెట్",
        d3: "కొత్త మೌలిక సదుపాయాల కోసం మున్సిపల్ లేదా క్యాంపస్ నిధులను ఎలా కేటాయించాలో నిర్ణయించడంలో పౌరులకు ప్రత్యక్ష భాగస్వామ్యం ఉంటుంది.",
        t4: "త్వరిత చర్య",
        d4: "తెలివైన ఫిల్టరింగ్ మరియు ఓటింగ్ విధానం అత్యంత అత్యవసర కమ్యూనిటీ అవసరాలకు వెంటనే ప్రాధాన్యతనిచ్చేలా హామీ ఇస్తుంది.",
        footerRights: "NagarX సివిక్ సొల్యూషన్స్. అన్ని హక్కులూ ప్రత్యేకించబడినవి.",
        footerSlogan: "మీ குரలు • మా బాధ్యత",
    },
    or: {
        heroTitle1: "ନାଗରିକ ସଶକ୍ତିକରଣ,",
        heroTitle2: "ସହରର ରୂପାନ୍ତରଣ",
        heroDesc: "NagarX ହେଉଛି ଏକ ପରବର୍ତ୍ତୀ ପିଢିର ନାଗରିକ ଅଭିଯୋଗ ସମାଧାନ ପ୍ଲାଟଫର୍ମ ଯାହା ନାଗରିକ ଏବଂ ପୌରପାଳିକା କର୍ତ୍ତୃପକ୍ଷଙ୍କ ମଧ୍ୟରେ ସମନ୍ୱୟ ରକ୍ଷା କରିବା ପାଇଁ ଡିଜାଇନ୍ କରାଯାଇଛି। ଆମେ ସ୍ୱଚ୍ଛ, ଦାୟିତ୍ୱବାନ ଏବଂ ପ୍ରଭାବଶାଳୀ ଶାସନ ଉପରେ ବିଶ୍ୱାସ କରୁ।",
        exploreBtn: "ଡ୍ୟାସବୋର୍ଡ ଦେଖନ୍ତୁ",
        ourMissionTitle: "ଆମର ଲକ୍ଷ୍ୟ",
        ourMissionDesc1: "ସହରଗୁଡ଼ିକ ଦ୍ରୁତ ଗତିରେ ବୃଦ୍ଧି ପାଉଛନ୍ତି ଏବଂ ନାଗରିକ ଭିତ୍ତିଭୂମିର ପରିଚାଳନା ପାଇଁ ବହୁତ ସମନ୍ୱୟ ଆବଶ୍ୟକ। ପାରମ୍ପରିକ ଅଭିଯୋଗ ଶୈଳୀ ପ୍ରାୟତଃ ନାଗରିକଙ୍କୁ ଅନ୍ଧକାରରେ ରଖିଥାଏ ଏବଂ କର୍ତ୍ତୃପକ୍ଷ ତଥ୍ୟର ବିଶୃଙ୍ଖଳା ଯୋଗୁଁ ଅସୁବିଧାର ସମ୍ମୁଖୀନ ହୁଅନ୍ତି।",
        ourMissionDesc2: "NagarX ଏକ ସ୍ୱଚ୍ଛ ଏବଂ ଜନସାଧାରଣଙ୍କ ସହାୟତାରେ ସମସ୍ୟା ଟ୍ରାକିଂ ବ୍ୟବସ୍ଥା ପ୍ରଦାନ କରି ଏହାର ସମାଧାନ କରିଥାଏ। ଗୋଷ୍ଠୀ ସମର୍ଥନ, ମାନଚିତ୍ର ଏବଂ ସରଳ କାର୍ଯ୍ୟଧାରା ମାଧ୍ୟମରେ ଆମେ ଗୁରୁତ୍ଵପୂର୍ଣ୍ଣ ସମସ୍ୟାଗୁଡିକୁ ପ୍ରାଥମିକତା ଦେଇ ଶୀଘ୍ର ସମାଧାନ କରିଥାଉ।",
        ourMissionHighlight: "ସ୍ୱଚ୍ଛ ଏବଂ ଜନସାଧାରଣଙ୍କ ସହାୟତାରେ ସମସ୍ୟା ଟ୍ରାକିଂ ବ୍ୟବସ୍ଥା",
        corePrinciplesTitle: "ମୁଖ୍ୟ ନୀତି",
        corePrinciplesDesc: "ପ୍ରତ୍ୟେକ ସ୍ତରରେ ଦକ୍ଷତା, ସ୍ୱଚ୍ଛତା ଏବଂ ଜବାବଦେହିତା ସୁନିଶ୍ચିତ କରିବାକୁ ପ୍ରସ୍ତୁତ କରାଯାଇଛି।",
        t1: "ସମ୍ପୂର୍ଣ୍ଣ ସ୍ୱଚ୍ଛତା",
        d1: "ଅଭିଯୋଗ ଦାଖଲ ଠାରୁ ଶେଷ ସମାଧାନ ପର୍ଯ୍ୟନ୍ତ, ସାଧାରଣ ଅପଡେଟ୍ ସହିତ ସମୟସୀମା ଟ୍ରାକ୍ କରନ୍ତୁ।",
        t2: "ଯାଞ୍ଚ ହୋଇଥିବା ସମାଧାନ",
        d2: "କୌଣସି ସମସ୍ୟାର ସମାଧାନ ବନ୍ଦ କରିବା ପାଇଁ କର୍ତ୍ତୃପକ୍ଷଙ୍କୁ କାର୍ଯ୍ୟ ସମାପ୍ତିର ଫଟୋ ଅପ୍ଲୋଡ୍ କରିବାକୁ ହେବ।",
        t3: "ସହଭାଗୀ ବଜେଟ୍",
        d3: "ନୂତନ ଭିତ୍ତିଭୂମି ପାଇଁ ମ୍ୟୁନିସିପାଲିଟି କିମ୍ବା କ୍ୟାମ୍ପସ ପାଣ୍ଠି କିପରି ଆବଣ୍ଟନ କରାଯିବ ସେଥିରେ ନାଗରିକଙ୍କ ସିଧାସଳଖ ଯୋਗଦାନ ଥାଏ।",
        t4: "ଦ୍ରୁତ କାର୍ଯ୍ୟାନុଷ୍ଠାନ",
        d4: "ଜରୁରୀ ସାମାଜିକ ଆବଶ୍ୟକତାଗୁଡିକୁ ତୁରନ୍ତ ପ୍ରାଥମିକତା ଦେବାକୁ ନିଶ୍ચିତ କରିବା।",
        footerRights: "NagarX ନାଗରିକ ସମାଧାନ। ସର୍ବାଧିକାର ସୁରକ୍ଷିତ।",
        footerSlogan: "ଆପଣଙ୍କ ସ୍ୱର • ଆମ ଦାୟିତ୍ୱ",
    },
    mr: {
        heroTitle1: "नागरिकांचे सक्षमीकरण,",
        heroTitle2: "शहरांचे परिवर्तन",
        heroDesc: "NagarX हे नागरिक आणि महापालिका अधिकारी यांच्यातील दरी सांधण्यासाठी डिझाइन केलेले नवीन पिढीचे तक्रार निवारण व्यासपीठ आहे. आमचा पारदर्शक, उत्तरदायी आणि अत्यंत कार्यक्षम स्थानिक प्रशासनावर विश्वास आहे.",
        exploreBtn: "डॅशबोर्ड एक्सप्लोर करा",
        ourMissionTitle: "आमचे ध्येय",
        ourMissionDesc1: "शहरे झपाट्याने वाढत आहेत आणि नागरी पायाभूत सुविधांचे व्यवस्थापन करण्यासाठी मोठ्या प्रमाणावर समन्वयाची गरज आहे. पारंपारिक तक्रार पद्धतींमुळे नागरिकांना प्रगती समजून येत नाही आणि अधिकारी विस्कळीत माहितीमुळे गोंधळून जातात.",
        ourMissionDesc2: "NagarX एक पारदर्शक आणि लोकसहभागावर आधारित समस्या ट्रॅकिंग प्रणाली प्रदान करून हे सोडवते. लोकसहभागाचे मतदान, थेट नकाशे आणि सुव्यवस्थित कार्यप्रणालीच्या साहाय्याने आम्ही महत्त्वाच्या समस्यांना प्राधान्य देऊन वेगाने सोडवतो.",
        ourMissionHighlight: "पारदर्शक आणि लोकसहभागावर आधारित समस्या ट्रॅकिंग प्रणाली",
        corePrinciplesTitle: "मुख्य तत्त्वे",
        corePrinciplesDesc: "नागरी प्रक्रियेच्या प्रत्येक टप्प्यावर कार्यक्षमता, पारदर्शकता आणि उत्तरदायित्व सुनिश्चित करण्यासाठी तयार केले गेले आहे.",
        t1: "सखोल पारदर्शकता",
        d1: "तक्रार नोंदवण्यापासून ते अंतिम निवारणापर्यंत, सार्वजनिक सुधारणा आणि कालमर्यादेसह मागोवा घ्या.",
        t2: "सत्यापित निवारण",
        d2: "कोणतीही नागरी समस्या बंद करण्यासाठी अधिकार्‍यांनी पूर्ण केलेल्या कामाचे छायाचित्र पुरावे अपलोड करणे बंधनकारक आहे.",
        t3: "सहभागी अर्थसंकल्प",
        d3: "नवीन पायाभूत सुविधांसाठी निधी कसा दिला जावा यामध्ये नागरिकांचे थेट योगदान असते.",
        t4: "त्वरित कारवाई",
        d4: "बुद्धीमान गाळणी आणि मतदान यामुळे सर्वात तातडीच्या नागरी गरजांना तत्काळ प्राधान्य दिले जाते.",
        footerRights: "NagarX नागरी उपाय. सर्व हक्क सुरक्षित.",
        footerSlogan: "तुमचा आवाज • आमची जबाबदारी",
    },
    bn: {
        heroTitle1: "নাগরিক ক্ষমতায়ন,",
        heroTitle2: "শহরের রূপান্তর",
        heroDesc: "NagarX হল একটি পরবর্তী প্রজন্মের নাগরিক অভিযোগ সমাধান প্ল্যাটফর্ম যা নাগরিক এবং পৌর কর্তৃপক্ষের মধ্যে দূরত্ব কমাতে ডিজাইন করা হয়েছে। আমরা স্বচ্ছ, দায়বদ্ধ এবং অত্যন্ত প্রতিক্রিয়াশীল স্থানীয় প্রশাসনে বিশ্বাস করি।",
        exploreBtn: "ড্যাশবোর্ড অন্বেষণ করুন",
        ourMissionTitle: "আমাদের লক্ষ্য",
        ourMissionDesc1: "শহরগুলি দ্রুত বৃদ্ধি পাচ্ছে এবং নাগরিক অবকাঠামো পরিচালনা করার জন্য বিপুল পরিমাণ সমন্বয় প্রয়োজন। ঐতিহ্যগত রিপোর্টিং পদ্ধতিগুলি প্রায়শই নাগরিকদের অন্ধকারে রাখে এবং কর্তৃপক্ষ অসংগঠিত তথ্যের কারণে জর্জরিত হয়।",
        ourMissionDesc2: "NagarX একটি স্বচ্ছ এবং ক্রাউড সোর্সড সমস্যা ট্র্যাকিং সিস্টেম প্রদান করে এটি সমাধান করার উদ্যোগ নিয়েছে। সম্প্রদায়গত ভোটিং, লাইভ হিটম্যাপ এবং সুবিন্যস্ত কর্তৃপক্ষের ওয়ার্কফ্লো ব্যবহারের মাধ্যমে আমরা নিশ্চিত করি যে জরুরি সমস্যাগুলি দ্রুত সমাধান করা হবে।",
        ourMissionHighlight: "স্বচ্ছ এবং ক্রাউড সোর্সড সমস্যা ট্র্যাকিং সিস্টেম",
        corePrinciplesTitle: "মূল নীতিসমূহ",
        corePrinciplesDesc: "নাগরিক পাইপলাইনের প্রতিটি স্তরে দক্ষতা, স্বচ্ছতা und জবাবদিহিতা নিশ্চিত করার জন্য প্রথম থেকে তৈরি করা হয়েছে।",
        t1: "সম্পূর্ণ স্বচ্ছতা",
        d1: "অভিযোগ দায়ের থেকে শুরু করে চূড়ান্ত সমাধান পর্যন্ত সমস্ত কিছু টাইমলাইন সহ ট্র্যাক করুন।",
        t2: "যাচাইকৃত সমাধান",
        d2: "যে কোনো অভিযোগ বন্ধ করার জন্য কর্তৃপক্ষের কাজ সম্পন্ন করার ছবির প্রমাণ আপলোড করা বাধ্যতামূলক।",
        t3: "অংশগ্রহণমূলক বাজেট",
        d3: "পৌরসভা বা ক্যাম্পাসের তহবিল কীভাবে বরাদ্দ করা হবে সে বিষয়ে নাগরিকদের সরাসরি মতামত দেওয়ার সুযোগ রয়েছে।",
        t4: "দ্রুত পদক্ষেপ",
        d4: "বুদ্ধিমান ফিল্টারিং এবং আপভোটিংয়ের মাধ্যমে নিশ্চিত করা হয় যে সর্বাধিক জরুরি চাহিদাগুলি অবিলম্বে অগ্রাধিকার পায়।",
        footerRights: "NagarX সিভিক সলিউশনস। সর্বস্বত্ব সংরক্ষিত।",
        footerSlogan: "আপনার কণ্ঠস্বর • আমাদের দায়িত্ব",
    },
    gu: {
        heroTitle1: "નાગરિકોનું સશક્તિકરણ,",
        heroTitle2: "શહેરોનું પરિવર્તન",
        heroDesc: "NagarX એ નાગરિકો અને પાલિકા સત્તાધિકારીઓ વચ્ચેના અંતરને પૂરવા માટે ડિઝાઇન કરવામાં આવેલ આગલી પેઢીનું પ્લેટફોર્મ છે. અમે પારદર્શક, જવાબદાર અને સક્રિય સ્થાનિક શાસનમાં માનીએ છીએ.",
        exploreBtn: "ડેશબોર્ડ જુઓ",
        ourMissionTitle: "અમારો હેતુ",
        ourMissionDesc1: "શહેરો ઝડપથી વધી રહ્યા છે, અને નાગરિક માળખાકીય સુવિધાઓનું સંચાલન કરવા માટે ખૂબ જ મોટું સમન્વય જરૂરી છે. પરંપરાગત વાંધા અરજી પદ્ધતિઓ નાગરિકોને માહિતી વિના રાખે છે અને સત્તાધીશો પણ મૂંઝાઈ જાય છે.",
        ourMissionDesc2: "NagarX એક પારદર્શક અને લોકભાગીદારી આધારિત સમસ્યા ટ્રેકિંગ સિસ્ટમ પ્રદાન કરી આનું નિરાકરણ લાવે છે. સમુદાય વોટિંગ અને લાઇવ નકશા વડે મહત્વના પ્રશ્નોને અગ્રીમતા આપી ઉકેલવામાં આવે છે.",
        ourMissionHighlight: "પારદર્શક અને લોકભાગીદારી આધારિત સમસ્યા ટ્રેકિંગ સિસ્ટમ",
        corePrinciplesTitle: "મુખ્ય સિદ્ધાંતો",
        corePrinciplesDesc: "નાગરિક સેવાની કાર્યક્ષમતા અને જવાબદારી સુનિશ્ચित કરવા માટે ખાસ તૈયાર કરવામાં આવેલ છે.",
        t1: "સંપૂર્ણ પારદર્શિતા",
        d1: "સમસ્યા નિવારણના અંત સુધી, સાર્વજનિક સુધારાઓ અને સમયરેખા સાથે ટ્રેક કરો.",
        t2: "ચકાસાયેલ નિરાકરણ",
        d2: "કોઈપણ નાગરિક સમસ્યા બંધ કરવા માટે સત્તાધિકારીઓએ કામ પૂર્ણ થયાના ફોટોગ્રાફિક પુરાવા અપલોડ કરવા પડશે.",
        t3: "ભાગીદારી બજેટિંગ",
        d3: "નવા ઇન્ફ્રાસ્ટ્રક્ચર માટે પાલિકા કે કેમ્પસના ભંડોળની ફાળવણી કેવી રીતે કરવી તે નાગરિકો પોતે નક્કી કરી શકે છે.",
        t4: "ત્વરิท ઉકેલ",
        d4: "બુદ્ધિશાળી ફિલ્ટરિંગ અને અપવોટિંગ સૌથી ગંભીર સમસ્યાઓને તાત્કાલિક ઉકેલની ખાતરી આપે છે.",
        footerRights: "NagarX સિવિક સોલ્યુશન્સ. સર્વાધિકાર સુરક્ષિત.",
        footerSlogan: "તમારો અવાજ • અમારી જવાબદારી",
    },
    pa: {
        heroTitle1: "ਨਾਗਰਿਕਾਂ ਦਾ ਸਸ਼ਕਤੀਕਰਨ,",
        heroTitle2: "ਸ਼ਹਿਰਾਂ ਦਾ ਰੂਪਾਂਤਰਨ",
        heroDesc: "NagarX ਅਗਲੀ ਪੀੜ੍ਹੀ ਦਾ ਨਾਗਰਿਕ ਸ਼ਿਕਾਇਤ ਨਿਵਾਰਣ ਪਲੇਟਫਾਰਮ ਹੈ ਜੋ ਨਾਗਰਿਕਾਂ ਅਤੇ ਮਿਉਂਸਪਲ ਅਥਾਰਟੀਆਂ ਵਿਚਕਾਰ ਪਾੜੇ ਨੂੰ ਪੂਰਨ ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹੈ। ਅਸੀਂ ਪਾਰਦਰਸ਼ੀ, ਜ਼ਿੰਮੇਵਾਰ ਅਤੇ ਬਹੁਤ ਸਰਗਰਮ ਸਥਾਨਕ ਪ੍ਰਸ਼ਾਸਨ ਵਿੱਚ ਵਿਸ਼ਵਾਸ ਰੱਖਦੇ ਹਾਂ।",
        exploreBtn: "ਡੈਸ਼ਬੋਰਡ ਵੇਖੋ",
        ourMissionTitle: "ਸਾਡਾ ਮਿਸ਼ਨ",
        ourMissionDesc1: "ਸਾਂਝੀਆਂ ਸਮੱਸਿਆਵਾਂ ਤੇਜ਼ੀ ਨਾਲ ਵਧ ਰਹੀਆਂ ਹਨ, ਅਤੇ ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰਨ ਲਈ ਬਹੁਤ ਜ਼ਿਆਦਾ ਤਾਲਮੇਲ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ। ਪੁਰਾਣੇ ਸ਼ਿਕਾਇਤ ਤਰੀਕੇ ਅਕਸਰ ਨਾਗਰਿਕਾਂ ਨੂੰ ਹਨੇਰੇ ਵਿੱਚ ਰੱਖਦੇ ਹਨ ਅਤੇ ਅਥਾਰਟੀ ਗੜਬੜੀ ਵਾਲੇ ਡੇਟਾ ਤੋਂ ਪਰੇਸ਼ਾਨ ਰਹਿੰਦੀ ਹੈ।",
        ourMissionDesc2: "NagarX ਇੱਕ ਪਾਰਦਰਸ਼ੀ ਅਤੇ ਸਾਂਝੇ ਯਤਨਾਂ ਵਾਲਾ ਸਮੱਸਿਆ ਟਰੈਕਿੰਗ ਸਿਸਟਮ ਪ੍ਰਦਾਨ ਕਰਕੇ ਇਸ ਦਾ ਹੱਲ ਕਰਦਾ ਹੈ। ਭਾਈਚਾਰਕ ਵੋਟਿੰਗ, ਲਾਈਵ ਨਕਸ਼ੇ ਅਤੇ ਪ੍ਰਣਾਲੀਗਤ ਵਰਕਫਲੋ ਦੀ ਵਰਤੋਂ ਨਾਲ ਅਸੀਂ ਮਹੱਤਵਪੂਰਨ ਮੁੱਦਿਆਂ ਨੂੰ ਜਲਦੀ ਹੱਲ ਕਰਦੇ ਹਾਂ।",
        ourMissionHighlight: "ਪਾਰਦਰਸ਼ੀ ਅਤੇ ਸਾਂਝੇ ਯਤਨਾਂ ਵਾਲਾ ਸਮੱਸਿਆ ਟਰੈਕਿੰਗ ਸਿਸਟਮ",
        corePrinciplesTitle: "ਮੁੱਖ ਸਿਧਾਂਤ",
        corePrinciplesDesc: "ਨਾਗਰਿਕ ਸੇਵਾ ਦੇ ਹਰ ਪੜਾਅ 'ਤੇ ਕੁਸ਼ਲਤਾ, ਪਾਰਦਰਸ਼ਤਾ ਅਤੇ ਜ਼ਿੰਮੇਵารੀ ਨੂੰ ਯਕੀਨੀ ਬਣਾਉਣ ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹੈ।",
        t1: "ਪੂਰੀ ਪਾਰਦਰਸ਼ਤਾ",
        d1: "ਸ਼ਿਕਾਇਤਾਂ ਦੇ ਦਰਜ ਹੋਣ ਤੋਂ ਲੈ ਕੇ ਉਨ੍ਹਾਂ ਦੇ ਆਖਰੀ ਹੱਲ ਤੱਕ, ਜਨਤਕ ਅਪਡੇਟਾਂ ਅਤੇ ਸਮਾਂ-ਸੀਮਾ ਨਾਲ ਟ੍ਰੈਕ ਕਰੋ।",
        t2: "ਪ੍ਰਮਾणਿਤ ਹੱਲ",
        d2: "ਕਿਸੇ ਵੀ ਨਾਗਰਿਕ ਸਮੱਸਿਆ ਨੂੰ ਬੰਦ ਕਰਨ ਲਈ ਅਥਾਰਟੀ ਨੂੰ ਪੂਰੇ ਕੰਮ ਦੇ ਫੋਟੋਗ੍ਰਾਫਿਕ ਸਬੂਤ ਅਪਲੋડ ਕਰਨੇ ਪੈਣਗੇ।",
        t3: "ਭਾਗੀਦਾਰੀ ਬਜਟ",
        d3: "ਨਵੇਂ ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਲਈ ਮਿਉਂਸਪਲ ਜਾਂ ਕੈਂਪਸ ਦੇ ਫੰਡਾਂ ਦੀ ਵੰਡ ਕਿਵੇਂ ਕੀਤੀ ਜਾਣੀ ਹੈ ਇਸ ਵਿੱਚ ਨਾਗਰਿਕਾਂ ਦੀ ਸਿੱਧੀ ਭੂਮਿਕਾ ਹੁੰਦੀ ਹੈ।",
        t4: "ਤਤਕਾਲ ਕਾਰਵਾਈ",
        d4: "ਸੂਝਵਾਨ ਫਿਲਟਰਿੰਗ ਅਤੇ ਵੋਟਿੰਗ ਸਭ ਤੋਂ ਜ਼ਰੂਰੀ ਭਾਈਚਾਰਕ ਲੋੜਾਂ ਨੂੰ ਤੁਰੰਤ ਪਹਿਲ ਦੇਣ ਦੀ ਗਰੰਟੀ ਦਿੰਦੀ ਹੈ।",
        footerRights: "NagarX ਸਿਵਿਕ ਸਲਿਊਸ਼ਨਜ਼। ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।",
        footerSlogan: "ਤੁਹਾਡੀ ਆਵਾਜ਼ • ਸਾਡੀ ਜ਼ਿੰਮੇਵารੀ",
    },
};

function FeatureCard({
    icon: Icon,
    title,
    description,
}: {
    icon: any;
    title: string;
    description: string;
}) {
    return (
        <div className="bg-white dark:bg-[#0F1A2E] rounded-[24px] border border-[#E2E8F0] dark:border-[#1B2B48] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-[#EEF2FF] dark:bg-[#1E3A8A]/30 flex items-center justify-center mb-5">
                <Icon className="h-6 w-6 text-[#001F5C] dark:text-[#38BDF8]" strokeWidth={2.2} />
            </div>
            <h3 className="text-[17px] font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                {title}
            </h3>
            <p className="text-[14.5px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {description}
            </p>
        </div>
    );
}

function AboutPage() {
    const { language } = useLanguage();
    const t = ABOUT_TRANSLATIONS[language];

    return (
        <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#060F1E] text-slate-900 dark:text-white flex flex-col">
            <Header />

            <main className="flex-1 overflow-y-auto w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-[#0A192F] py-20 lg:py-28">
                    <div className="absolute inset-0">
                        <svg
                            className="absolute h-full w-full opacity-30"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="bg-grad-about" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#1E3A8A" />
                                    <stop offset="100%" stopColor="#0F172A" />
                                </linearGradient>
                            </defs>
                            <rect width="100" height="100" fill="url(#bg-grad-about)" />
                            <path d="M 0 100 L 100 30 L 100 100 Z" fill="#0EA5E9" opacity="0.1" />
                            <path d="M 0 100 L 100 60 L 100 100 Z" fill="#3B82F6" opacity="0.1" />
                        </svg>
                    </div>

                    <div className="relative mx-auto max-w-[1200px] px-6 lg:px-8 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 mb-8 backdrop-blur-md shadow-2xl">
                            <Info className="h-10 w-10 text-white" strokeWidth={2} />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight text-balance mb-6">
                            {t.heroTitle1}<br className="hidden sm:block" />
                            {t.heroTitle2}
                        </h1>
                        <p className="mx-auto max-w-2xl text-[17px] md:text-[19px] text-white/80 font-medium leading-relaxed mb-10">
                            {t.heroDesc}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#0A192F] hover:bg-slate-100 px-8 py-3.5 text-[15px] font-bold shadow-lg transition-all"
                            >
                                {t.exploreBtn}
                                <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.3} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-20 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight mb-6">{t.ourMissionTitle}</h2>
                            <p className="text-[16px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
                                {t.ourMissionDesc1}
                            </p>
                            <p className="text-[16px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                NagarX sets out to solve this by providing a <strong className="text-slate-900 dark:text-white">{t.ourMissionHighlight}</strong>.
                                By utilizing community voting, live heatmaps, and streamlined authority workflows, we ensure that critical issues
                                are prioritized and resolved rapidly.
                            </p>
                        </div>
                        <div className="relative rounded-[24px] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-video flex items-center justify-center">
                            <img src="/about-illustration.jpg" alt="NagarX Civic Illustration" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold tracking-tight mb-4">{t.corePrinciplesTitle}</h2>
                        <p className="text-[16px] text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                            {t.corePrinciplesDesc}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={Eye}
                            title={t.t1}
                            description={t.d1}
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title={t.t2}
                            description={t.d2}
                        />
                        <FeatureCard
                            icon={HeartHandshake}
                            title={t.t3}
                            description={t.d3}
                        />
                        <FeatureCard
                            icon={Zap}
                            title={t.t4}
                            description={t.d4}
                        />
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white dark:bg-[#0B1526] border-t border-slate-200 dark:border-slate-800 py-12 text-center">
                    <p className="text-[14px] text-slate-400 font-medium">
                        © {new Date().getFullYear()} {t.footerRights}
                    </p>
                    <p className="text-[13px] text-slate-400 font-medium mt-1">
                        {t.footerSlogan}
                    </p>
                </footer>
            </main>
        </div>
    );
}
