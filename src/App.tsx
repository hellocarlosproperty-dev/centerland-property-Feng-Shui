import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { 
  Compass, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Check, 
  Home, 
  Flame, 
  Trees, 
  Droplets, 
  ShieldAlert, 
  Gem, 
  CircleDot,
  ChevronDown,
  BookOpen,
  ExternalLink,
  Info,
  Share2,
  Copy,
  Download,
  Image as ImageIcon,
  FileText,
  Loader2
} from "lucide-react";
import { BrandLogo } from "./components/BrandLogo";
import { ContactWidget } from "./components/ContactWidget";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { FengShuiNavigator } from "./components/FengShuiNavigator";
import { BaziDetailedIntro, FengShuiDetailedIntro } from "./components/ProductIntros";
import { AuspiciousCalendar } from "./components/AuspiciousCalendar";
import { PaymentAndSubscription } from "./components/PaymentAndSubscription";
import { PremiumBottomBar } from "./components/PremiumBottomBar";
import { PaymentStatusMonitor } from "./components/PaymentStatusMonitor";

// Function to handle bold text like **text**
function renderBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-gold-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function MarkdownRenderer({ text }: { text: string }) {
  if (!text) return null;
  
  const lines = text.split("\n");
  
  return (
    <div className="space-y-4">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        
        // Headers: ### or ## or # or - ### or - ##
        if (trimmed.startsWith("###") || trimmed.startsWith("##") || trimmed.startsWith("#") || trimmed.startsWith("- ###") || trimmed.startsWith("- ##")) {
          const headerText = trimmed.replace(/^(-\s*)?#{1,3}\s*/, "");
          return (
            <h5 key={idx} className="text-base font-bold text-gold-800 mt-6 mb-2 border-l-4 border-gold-500 pl-2.5 flex items-center gap-2">
              {headerText}
            </h5>
          );
        }
        
        // Bullet list item: - or *
        if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          const content = trimmed.replace(/^[-*]\s*/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 text-sm text-ink-900 leading-relaxed font-light">
              <span className="text-gold-600 mt-1.5 select-none">•</span>
              <span className="flex-1">
                {renderBoldText(content)}
              </span>
            </div>
          );
        }
        
        // Normal paragraph
        return (
          <p key={idx} className="text-sm text-ink-900 leading-relaxed font-light text-justify">
            {renderBoldText(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Helper to determine the elemental classification of a cure suggestion
const getCureElementInfo = (cureText: string, starElement: string) => {
  const text = cureText.toLowerCase();
  
  // 1. Fire / 火
  if (
    text.includes("紅") || 
    text.includes("紫") || 
    text.includes("燈") || 
    text.includes("火") || 
    text.includes("蠟燭") || 
    text.includes("粉色") || 
    text.includes("對聯")
  ) {
    return {
      name: "火",
      color: "text-rose-600 bg-rose-50/80 border-rose-200",
      icon: Flame,
      label: "火 (Fire)",
    };
  }
  // 2. Metal / 金
  if (
    text.includes("銅") || 
    text.includes("金屬") || 
    text.includes("金") || 
    text.includes("銀") || 
    text.includes("六帝") || 
    text.includes("風鈴") || 
    text.includes("麒麟") || 
    text.includes("奔馬") || 
    text.includes("錢") || 
    text.includes("金屬製") || 
    text.includes("純銅") ||
    text.includes("金氣")
  ) {
    return {
      name: "金",
      color: "text-amber-700 bg-amber-50 border-amber-200",
      icon: CircleDot,
      label: "金 (Metal)",
    };
  }
  // 3. Water / 水
  if (
    text.includes("水") || 
    text.includes("魚缸") || 
    text.includes("藍") || 
    text.includes("黑") || 
    text.includes("安忍水") || 
    text.includes("清水")
  ) {
    return {
      name: "水",
      color: "text-blue-600 bg-blue-50 border-blue-200",
      icon: Droplets,
      label: "水 (Water)",
    };
  }
  // 4. Wood / 木
  if (
    text.includes("綠") || 
    text.includes("植物") || 
    text.includes("盆栽") || 
    text.includes("木") || 
    text.includes("花瓶")
  ) {
    return {
      name: "木",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      icon: Trees,
      label: "木 (Wood)",
    };
  }
  // 5. Earth / 土
  if (
    text.includes("黃") || 
    text.includes("陶瓷") || 
    text.includes("石") || 
    text.includes("土") || 
    text.includes("聚寶盆") || 
    text.includes("鹽") || 
    text.includes("玉石")
  ) {
    return {
      name: "土",
      color: "text-amber-800 bg-amber-100/40 border-amber-300",
      icon: Gem,
      label: "土 (Earth)",
    };
  }

  // Fallback based on star's element
  if (starElement.includes("木")) {
    return {
      name: "木",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      icon: Trees,
      label: "木 (Wood)",
    };
  } else if (starElement.includes("火")) {
    return {
      name: "火",
      color: "text-rose-600 bg-rose-50/80 border-rose-200",
      icon: Flame,
      label: "火 (Fire)",
    };
  } else if (starElement.includes("金")) {
    return {
      name: "金",
      color: "text-amber-700 bg-amber-50 border-amber-200",
      icon: CircleDot,
      label: "金 (Metal)",
    };
  } else if (starElement.includes("水")) {
    return {
      name: "水",
      color: "text-blue-600 bg-blue-50 border-blue-200",
      icon: Droplets,
      label: "水 (Water)",
    };
  } else {
    return {
      name: "土",
      color: "text-amber-800 bg-amber-100/40 border-amber-300",
      icon: Gem,
      label: "土 (Earth)",
    };
  }
};

// Types
interface FormState {
  name: string;
  gender: string;
  identity: string; // 業主 / 租客
  phone: string;
  address: string;
  birthDate: string;
  birthTime: string; // Traditional Chinese Dual Hour value (e.g. "23:00")
  birthHour: string; // "00" to "23"
  birthMinute: string; // "00" to "59"
  birthSecond: string; // "00" to "59"
  email: string;
  services: string[]; // ["八字分析", "八字董公烏兔擇日", "八字起名", "家居風水", "風水陣"]
}

interface ResultData {
  dominantElement: "金" | "木" | "水" | "火" | "土";
  elementScores: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  destinyReading: string;
  spaceAdvice: string;
  addressAura: string;
  auspiciousColors: string[];
  tips: string[];
  yuanfenju?: any;
}

interface SubscriptionState {
  planId: string;
  planName: string;
  status: "active" | "cancelled" | null;
  subscribedAt: string;
  nextBillingAt: string;
}

const PLANS_DATA = [
  {
    id: "basic",
    name: "基礎運勢 Plan",
    price: "99",
    tagline: "適合：日常自主命理開運",
    desc: "每月精算八字運勢詳解簡報，直接發送至電郵。掌握流月、流日之生氣走勢，提供專屬命盤狀態庫。",
    stripeLink: "https://buy.stripe.com/plink_1Tq2WfEM8cyuVpLZB6AImBLd",
    productId: "prod_UphkxOHq2KNzem",
    paymentLinkId: "plink_1Tq2WfEM8cyuVpLZB6AImBLd",
    bullets: [
      "每月精算八字運勢簡報",
      "流月、流日磁場吉凶分析",
      "開運五行穿搭/行事指南",
      "同步綁定電郵/資料加密保護"
    ],
    bgGradient: "from-amber-50/50 to-amber-100/20",
    borderColors: "border-amber-200",
    buttonColors: "bg-amber-600 hover:bg-amber-700 text-white border-amber-700/20",
    badge: "入門吉選"
  },
  {
    id: "pro",
    name: "專業流月 Plan",
    price: "380",
    tagline: "適合：追求精准時機之人士",
    desc: "基礎內容 + 每月八字流月運程 PDF 報告。融入大師特別微調，以及董公烏兔吉日吉時精算。",
    stripeLink: "https://buy.stripe.com/plink_1Tq2XgEM8cyuVpLZruvQKc8P",
    productId: "prod_UphgaeXHNDL5Ev",
    paymentLinkId: "plink_1Tq2XgEM8cyuVpLZruvQKc8P",
    bullets: [
      "包含「基礎運勢 Plan」全部內容",
      "每月精裝「流月運程解碼」PDF",
      "董公烏兔吉凶擇日（嫁娶/動土/開市）",
      "個人元神生旺微調方案"
    ],
    bgGradient: "from-rose-50/40 to-rose-100/20",
    borderColors: "border-rose-200",
    buttonColors: "bg-gradient-to-r from-[#590612] to-[#800c1e] text-white border-[#590612]/20 hover:scale-[1.02]",
    badge: "人氣推介"
  },
  {
    id: "premium",
    name: "尊貴風水 Plan",
    price: "1,288",
    tagline: "適合：改善家宅氣場、安居旺業",
    desc: "專業內容 + 家居風水流年套餐（專人一對一全程跟進）。針對戶型進行九宮飛星佈局調整。",
    stripeLink: "https://buy.stripe.com/plink_1Tq2YNEM8cyuVpLZrIcOkXgb",
    productId: "prod_UphhBgU8BUUxPz",
    paymentLinkId: "plink_1Tq2YNEM8cyuVpLZrIcOkXgb",
    bullets: [
      "包含「專業流月 Plan」全部內容",
      "家居風水流年佈局套餐（專人跟進）",
      "居所九宮飛星旺財/化煞精准定位",
      "每月一次林大師熱線一對一對話諮詢"
    ],
    bgGradient: "from-amber-50 to-amber-100/40",
    borderColors: "border-[#bfa15f]/40",
    buttonColors: "bg-gradient-to-r from-[#bfa15f] to-[#8a713b] text-white border-[#bfa15f]/40 hover:scale-[1.02]",
    badge: "大師主推"
  },
  {
    id: "enterprise",
    name: "小企業風水顧問 Plan",
    price: "3,888",
    tagline: "適合：中小企業、辦公室風水催旺",
    desc: "企業辦公室風水佈局、全盤八字合婚/合夥分析、年度流年大報告。含全年四次大師親自上門服務。",
    stripeLink: "https://buy.stripe.com/plink_1Tq2ZCEM8cyuVpLZA06Bi86e",
    productId: "prod_UphkxOHq2KNzem",
    paymentLinkId: "plink_1Tq2ZCEM8cyuVpLZA06Bi86e",
    bullets: [
      "辦公室財位風水催旺佈局",
      "核心股東/合夥人八字契合天算",
      "全年年度流年預測與煞位化解",
      "包含全年四次大師親自上門勘察"
    ],
    bgGradient: "from-purple-50/50 to-purple-100/20",
    borderColors: "border-purple-200",
    buttonColors: "bg-purple-800 hover:bg-purple-900 text-white border-purple-900/20",
    badge: "企業首選"
  }
];

// Traditional Chinese Dual Hours (時辰)
const SHICHEN_LIST = [
  { label: "子時 (23:00 - 01:00) — 天開於子，水之生源", value: "23:00" },
  { label: "丑時 (01:00 - 03:00) — 地闢於丑，金之墓庫", value: "01:00" },
  { label: "寅時 (03:00 - 05:00) — 人生於寅，木之祿地", value: "03:00" },
  { label: "卯時 (05:00 - 07:00) — 日出扶桑，春木正旺", value: "05:00" },
  { label: "辰時 (07:00 - 09:00) — 潛龍騰淵，濕土孕育", value: "07:00" },
  { label: "巳時 (09:00 - 11:00) — 旭日臨空，炎火臨官", value: "09:00" },
  { label: "午時 (11:00 - 13:00) — 日正當中，極盛之火", value: "11:00" },
  { label: "未時 (13:00 - 15:00) — 日過中天，燥土藏金", value: "13:00" },
  { label: "申時 (15:00 - 17:00) — 夕陽返照，秋金旺盛", value: "15:00" },
  { label: "酉時 (17:00 - 19:00) — 金烏西墜，純金肅殺", value: "17:00" },
  { label: "戌時 (19:00 - 21:00) — 暮色乾坤, 火之歸墓", value: "19:00" },
  { label: "亥時 (21:00 - 23:00) — 天地歸靜，純水歸原", value: "21:00" },
];

const METAPHYSICAL_HELP_DATA: Record<string, { title: string; content: string }> = {
  wuxing: {
    title: "📊 五行能量分佈 (The Five Elements Ratio)",
    content: "五行（金、木、水、火、土）是宇宙間構成萬物運行的五種基本氣場。每個人誕生時的年月日時天干地支，都對應著不同的五行屬性與比例。柱狀圖顯示的分數即是您的先天五行比例，某種元素過高（太過）或過低（不及）均會影響整體磁場平衡，大師推演正是為您尋求「損有餘而補不足」的完美調候方案。"
  },
  dominant: {
    title: "👑 本命元神 (Your Dominant Element / Daymaster)",
    content: "在八字命理學（子平八字）中，「日柱天干」代表命主本人，簡稱「日元」或「元神」。您的元神屬性是整個命盤推演的主軸。例如：\n\n【木命】之人通常慈悲、具生長力與仁愛心；\n【火命】之人熱情開朗、講求禮儀與表現；\n【土命】之人沉穩厚實、誠信守分；\n【金命】之人剛毅果決、講求義氣與變革；\n【水命】之人聰明靈活、具適應力與智慧。\n\n所有的流年喜忌和空間佈局皆以此為基準進行生助克洩。"
  },
  luoshu: {
    title: "🧭 九宮洛書與流年飛星 (Luo Shu Nine-Grid & Flying Stars)",
    content: "風水學（堪輿學）依據洛書九宮軌跡，將住宅空間劃分為九個方位。流年飛星是指一白至九紫共九顆天體星辰，每年按特定軌跡（飛星軌跡）輪流飛入九個宮位，決定該方位的吉凶磁場。南面在中國堪輿學中習慣置於圖紙上方（即朱雀位），北面置於下方（即玄武位）。配合命主元神喜忌在相應方位佈局，即能「得位引吉、逢凶化洩」。"
  },
  star_1: {
    title: "紫氣桃花 · 一白貪狼星 (Water / Romance & Intelligence)",
    content: "一白星屬水，在下元九運中為吉星，亦稱「貪狼星」。主掌人緣、桃花、智慧、名氣與出行運勢。若家宅此方位佈置妥當，能大招人際貴人、促進未婚者之姻緣、並有助於腦力創作者及公關業務之發展。"
  },
  star_2: {
    title: "病符隱憂 · 二黑巨門星 (Earth / Illness & Stress)",
    content: "二黑星屬土，稱為「巨門病符星」。在下元九運中為退氣凶星，主掌疾病、慢性病、身體損傷與負面壓抑磁場。流年二黑所到方位忌諱陰暗潮濕與大面積動土，亦不宜放置紅色物品。宜在此位擺放銅葫蘆或金屬物件，以「金洩土氣」達到消災祛病之效。"
  },
  star_3: {
    title: "口舌小人 · 三碧祿存星 (Wood / Arguments & Lawsuits)",
    content: "三碧星屬木，稱為「祿存星」。主爭鬥、口舌、官非訴訟、小人作祟與神經緊張。若此方位氣場失衡，容易導致家庭成員間頻生摩擦、或在職場上招惹流言。宜用火洩木（如放置紅地毯、暖光燈等紅色裝飾）化解其戾氣。"
  },
  star_4: {
    title: "文昌功名 · 四綠文曲星 (Wood / Academic & Promotion)",
    content: "四綠星屬木，稱為「文曲星」。主管學業、考試、文書合約、升遷、藝術天賦與功名仕途。極其適宜在此方位設立書桌、懸掛文昌筆，或擺放四支水養富貴竹（綠色植物屬木，水能生木），能大幅提振家中學子與職場晉升者的智慧考運。"
  },
  star_5: {
    title: "最大煞星 · 五黃廉貞星 (Earth / Misfortune & Obstacles)",
    content: "五黃星屬土，稱為「廉貞煞星」。它是九星中破壞力最強的流年大凶星，主掌意外、災厄、重病與家運不順。五黃方位絕對不可動土拆卸、不可擺放盆栽（木克土易激發土煞）或紅黃色物。最穩妥的化解之道是保持該位完全靜止，並擺放「安忍水」（鹽水配銅錢）或重金屬擺件吸納土煞。"
  },
  star_6: {
    title: "武職偏財 · 六白武曲星 (Metal / Career & Indirect Wealth)",
    content: "六白星屬金，稱為「武曲星」。主偏財、橫財、貴人提攜、遠行機會（驛馬）以及武職（軍警、金融、技術人員）的晉升。催旺此方位（可擺放玉石或金屬製品）有利於自主創業、出差公幹、或期望有意外財源之人士。"
  },
  star_7: {
    title: "盜賊破軍 · 七赤破軍星 (Metal / Conflict & Loss)",
    content: "七赤星屬金，稱為「破軍星」。在當前元運中為煞氣，主口舌爭執、失物被盜、刀兵之災以及呼吸系統疾病。此方位不宜有過度尖銳的金屬器具，宜引入靜止之清水（土生金、金生水，水能泄金氣）來化解此金屬之煞。"
  },
  star_8: {
    title: "穩健正財 · 八白左輔星 (Earth / Steady Wealth)",
    content: "八白星屬土，稱為「左輔正財星」。主管正職工作收入、置業田產與穩健財源。雖然進入九運後其當旺氣勢有所收斂，但依然是不可多得的吉利星宿，在此處保持整潔、明亮，或擺放陶瓷聚寶盆、黃水晶，均能起到守財蓄財的良效。"
  },
  star_9: {
    title: "九運第一吉星 · 九紫右弼星 (Fire / Extreme Prosperity)",
    content: "九紫星屬火，稱為「右弼星」。它是當前「下元九運」（2024-2043年）的當令帝星，也是當前最旺、力量最強的第一大吉星！主掌喜慶臨門、添丁結婚、創業大吉、名望高升與萬事亨通。極宜在此方位擺放紅色裝飾、綠色植物（木生火）或長明燈，能引動紫氣東來，迅速提升全家運勢！"
  },
  fortune: {
    title: "📈 十二流月氣數 (Twelve-Month Fortune Flow)",
    content: "流月運勢圖反映了您先天本命五行（天干地支），在特定農曆月份（如寅月、卯月、巳月等）與天時氣候交感時產生的起伏軌跡。得分較高（強旺）的月份，元神得令得生，事業與決策能得心應手，利於喬遷安居或資產投資；得分較低（收斂）的月份則宜靜不宜動，適宜養精蓄銳、優化室室氣場防患於未然。"
  },
  iching: {
    title: "☯ 易經卦氣與董公擇日 (I Ching Hexagram & Auspicious Dates)",
    content: "【易經本命卦】是指將屋主生辰姓名之數，化作周易六十四卦之一，解讀一生本源磁場與安身立命之智慧；\n\n【董公擇日】則是清代董德彰大師集天星擇日學大成之秘本，專門通過計算「太陽、太陰、烏兔」等天體吉曜流轉，過濾流年與本命凶煞，選出在時空維度上最契合命主、最利於動土、進宅安擺的黃道良辰。時空和合，事半功倍。"
  },
  certificate: {
    title: "📜 先天本命法印證書 (Aura Stamp Certificate)",
    content: "這是中聯家居天星閣（青衣閣）特為尊貴客戶簽發的「天命空間開運簡笈證書」。\n\n它凝結了大師對您本命元神的精算結果、居住空間的和合密咒、以及大吉契合色調。法印印章代表青衣閣歷代傳承之正宗氣場加持，代表您的住宅佈局已正式與宇宙天星正氣相接，可作為個人居家開運之永久凭證。"
  }
};

export default function App() {
  const [step, setStep] = useState<"intro" | "gate1" | "gate2" | "loading" | "result">("intro");
  const [form, setForm] = useState<FormState>({
    name: "",
    gender: "",
    identity: "業主", // 業主 / 租客
    phone: "",
    address: "",
    birthDate: "",
    birthTime: "",
    birthHour: "12",
    birthMinute: "30",
    birthSecond: "00",
    email: "",
    services: ["家居風水", "八字分析"], // defaults
  });

  const [loadingMsg, setLoadingMsg] = useState("正在凝神聚氣，推演乾坤命理...");
  const [result, setResult] = useState<ResultData | null>(null);
  const [webhookStatus, setWebhookStatus] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [activeTermIndex, setActiveTermIndex] = useState<number | null>(null);
  const [selectedElementNode, setSelectedElementNode] = useState<string | null>(null);
  const [reportTab, setReportTab] = useState<"stars" | "fortune" | "iching" | "certificate">("stars");
  const [activeHelp, setActiveHelp] = useState<{ title: string; content: string } | null>(null);
  const [selectedStar, setSelectedStar] = useState<{
    pos: string;
    star: string;
    aura: string;
    detail: string;
    color: string;
    element: string;
    period9Impact: string;
    cures: string[];
    mantra: string;
  } | null>(null);
  const activeElement = selectedElementNode || (result ? result.dominantElement : "木");

  // --- 🔮 運勢分享與全址加載功能 States & Helpers ---
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  // --- 📄 PDF 報告預覽與生成 States & Refs ---
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Unicode-safe Base64 serialization helpers
  const serializeReport = (f: FormState, r: ResultData) => {
    try {
      const payload = JSON.stringify({ form: f, result: r });
      const bytes = new TextEncoder().encode(payload);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    } catch (e) {
      console.error("分享連結序列化失敗:", e);
      return "";
    }
  };

  // Check URL query parameters for a shared report on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedReport = params.get("shared_report");
    if (sharedReport) {
      try {
        const binary = atob(sharedReport);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const decoded = new TextDecoder().decode(bytes);
        const data = JSON.parse(decoded);
        if (data && data.form && data.result) {
          setForm(data.form);
          setResult(data.result);
          setStep("result");
          setTimeout(() => {
            triggerBlessing(`🔮 已成功載入來自「${data.form.name}」閣下的天命風水精批簡報！`);
          }, 800);
        }
      } catch (e) {
        console.error("載入分享報告失敗:", e);
      }
    }
  }, []);
  // --------------------------------------------------

  const [showBlessing, setShowBlessing] = useState(false);
  const [blessingMessage, setBlessingMessage] = useState("");

  const triggerBlessing = (customMsg?: string) => {
    const defaultBlessings = [
      "乾坤調和 · 五行得位 · 家宅昌盛 · 丁財兩旺",
      "紫氣東來 · 八字生旺 · 事業亨通 · 貴人相助",
      "三才並濟 · 離火通明 · 招財進寶 · 大吉大利",
      "山水和合 · 避邪納吉 · 富貴綿長 · 宅人合一",
      "元神生旺 · 天星拱照 · 福祿臨門 · 萬事亨通"
    ];
    const selectedMsg = customMsg || defaultBlessings[Math.floor(Math.random() * defaultBlessings.length)];
    setBlessingMessage(selectedMsg);
    setShowBlessing(true);
  };

  const getWuXingRelation = (element: string, dominant: string) => {
    if (element === dominant) {
      return {
        relation: "本命元神",
        desc: "同氣和合，同心共振",
        explanation: `${element}為您的本命元神。此方位宜保持整潔、明亮、開闊，多配置此五行之擺飾軟裝，能直接增強個人元神之旺氣，提振精神信念與自信。`
      };
    }
    
    // Generational cycle: Wood -> Fire -> Earth -> Metal -> Water -> Wood
    const elements = ["木", "火", "土", "金", "水"];
    const elemIdx = elements.indexOf(element);
    const domIdx = elements.indexOf(dominant);
    
    if (elemIdx === -1 || domIdx === -1) {
      return { relation: "五行流轉", desc: "和氣流長", explanation: "五行生生不息。" };
    }
    
    // index diff
    const diff = (elemIdx - domIdx + 5) % 5;
    if (diff === 4) {
      // element generates dominant: 生我者為印星
      return {
        relation: "相生 · 印星",
        desc: "生我者為母，庇護與靠山",
        explanation: `「${element}生${dominant}」：此元素是您的印星（守護力量）。代表學業、名望、貴人相助、長輩關懷與智慧源泉。在住宅的對應方位配置此屬性之物，能有效引導貴人運勢入宅。`
      };
    } else if (diff === 1) {
      // dominant generates element: 我生者為食傷
      return {
        relation: "相生 · 食傷",
        desc: "我生者為子，才華與福澤",
        explanation: `「${dominant}生${element}」：此元素是您的食傷星（才華流露）。象徵表達力、智慧發揮、財源點子與子嗣福分。在空間中適度引流此屬性之物，可激發靈感，促進才華與財富轉化。`
      };
    } else if (diff === 2) {
      // dominant restricts element: 我剋者為財星
      return {
        relation: "相剋 · 財星",
        desc: "我剋者為財，掌控與機遇",
        explanation: `「${dominant}剋${element}」：此元素是您的財富契機。在五行中，我剋者為妻財，象徵您可以掌控的資源與財富機會。在對應方位精心佈置此屬性之開運器物，能引動偏財神機，催旺財路。`
      };
    } else if (diff === 3) {
      // element restricts dominant: 剋我者為官殺
      return {
        relation: "相剋 · 官殺",
        desc: "剋我者為官，挑戰與磨礪",
        explanation: `「${element}剋${dominant}」：此元素是您的官殺星（紀律與考驗）。象徵職場壓力、自我克制、權位與名聲。若近期常感緊繃，可在對應方位引入「通關」五行（如：木剋土，用火通關；土剋水，用金通關；水剋火，用木通關；火剋金，用土通關；金剋木，用水通關），化解磁場衝突。`
      };
    }
    
    return { relation: "五行流轉", desc: "生克化和", explanation: "乾坤推演，天人合一。" };
  };

  const { pathNodes, pathType } = (() => {
    const dominant = result ? result.dominantElement : "木";
    const selected = activeElement;
    const rel = getWuXingRelation(selected, dominant);
    
    if (selected === dominant) {
      return { pathNodes: [dominant], pathType: "none" };
    }
    
    if (rel.relation.includes("相剋")) {
      const ctrlCycle = ["木", "土", "水", "火", "金"];
      const dIdx = ctrlCycle.indexOf(dominant);
      const sIdx = ctrlCycle.indexOf(selected);
      const nodes: string[] = [];
      if (dIdx !== -1 && sIdx !== -1) {
        let curr = dIdx;
        nodes.push(ctrlCycle[curr]);
        while (ctrlCycle[curr] !== selected) {
          curr = (curr + 1) % 5;
          nodes.push(ctrlCycle[curr]);
        }
      }
      return { pathNodes: nodes, pathType: "control" };
    } else {
      const genCycle = ["木", "火", "土", "金", "水"];
      const dIdx = genCycle.indexOf(dominant);
      const sIdx = genCycle.indexOf(selected);
      const nodes: string[] = [];
      if (dIdx !== -1 && sIdx !== -1) {
        let curr = dIdx;
        nodes.push(genCycle[curr]);
        while (genCycle[curr] !== selected) {
          curr = (curr + 1) % 5;
          nodes.push(genCycle[curr]);
        }
      }
      return { pathNodes: nodes, pathType: "generation" };
    }
  })();

  const getWuXingDetails = (element: string) => {
    switch (element) {
      case "木":
        return {
          title: "天元震巽 · 東木蒼翠",
          color: "#10b981",
          direction: "正東、東南方",
          attributes: "生命力、蓬勃生長、文昌學業、慈悲健康",
          advice: "客廳東面宜擺放開張大葉植物（如巴西鐵樹、發財樹）或水培文昌竹四支，以應『四綠文曲』之數。家具宜選用天然橡木、胡桃木等溫潤材質，窗簾可採草綠、玄青之棉麻布藝，最能凝聚東方震木生氣。"
        };
      case "火":
        return {
          title: "天元離卦 · 南火朱明",
          color: "#ef4444",
          direction: "正南方",
          attributes: "社交名望、前途光明、禮儀熱情、權威名聲",
          advice: "住宅正南方宜保持充足日照與高度整潔。可在客廳南部配置一盞暖黃色高腳落地燈（常開長明），或懸掛『旭日東昇』山水壁畫。軟裝可大膽局部點綴硃砂紅、絳紫或明黃色，以引發朱雀翔舞之名望磁場。"
        };
      case "土":
        return {
          title: "天元坤艮 · 中土黃厚",
          color: "#f5980b",
          direction: "西南、東北及中央",
          attributes: "載物厚德、房產財富、穩重誠信、家庭基石",
          advice: "客廳中央（中宮）或西南、東北方，宜擺設圓潤的陶瓷器皿、天然黃水晶球、或原礦奇石以作鎮宅。牆面塗料宜採米白、燕麥、暖駝色等大地色調，能穩固全宅之氣場，防止流動財氣四散逸失。"
        };
      case "金":
        return {
          title: "天元乾兌 · 西金白藏",
          color: "#64748b",
          direction: "正西、西北方",
          attributes: "剛毅果決、正義秩序、決策魄力、官祿事業",
          advice: "西北方（乾宮，主男主人及事業後盾）宜擺放精美黃銅器（如銅葫蘆、黃銅貔貅）或金屬框圓鐘，每日定時報時，以金屬清脆聲激發金氣。西方可置辦白色或金屬質感的邊几與燈飾，助長貴人運與殺伐決斷之勢。"
        };
      case "水":
        return {
          title: "天元坎卦 · 北水玄墨",
          color: "#06b6d4",
          direction: "正北方",
          attributes: "智慧流轉、人際桃花、財源廣進、商業靈感",
          advice: "住宅正北方主坎水事業。宜設置精緻的活水景觀盆（流水生財），或採用深藍、玄黑配色的花瓶進行水培植物供養。若配以適當的白色金屬配飾，更得『金生水』源源不竭之妙，利於思維敏捷與人脈桃花相生。"
        };
      default:
        return {
          title: "五行相生 · 乾坤流轉",
          color: "#bfa15f",
          direction: "五方和合",
          attributes: "生生不息",
          advice: "五行之道，貴在平衡。點擊圖中不同五行節點，即可啟動玄妙推演。"
        };
    }
  };

  // Load subscription from local storage
  const [subscription, setSubscription] = useState<SubscriptionState | null>(() => {
    const saved = localStorage.getItem("mymasterlam_sub");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Controls whether the persistent premium bottom bar is expanded
  const [isPremiumBarExpanded, setIsPremiumBarExpanded] = useState(false);

  // Query parameter success handler for Stripe redirect simulation
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const paySuccess = params.get("payment_success");
    const planId = params.get("plan");

    if (paySuccess === "true" && planId) {
      if (planId === "bazi") {
        setTimeout(() => {
          triggerBlessing("🔮 感謝您的付款！您的『🔮 個人生辰八字命盤深度精批』大師親算名額已成功鎖定。林大師將於 24 小時內親自與您對接，為您親批六十載大運走勢！祝您五行圓滿、大開鴻運！");
        }, 100);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (planId === "fengshui") {
        setTimeout(() => {
          triggerBlessing("🏠 感謝您的付款！您的『🏠 家居風水現場佈局實測』到府勘輿名額已成功鎖定。林大師攜專業勘測團隊將於 24 小時內與您聯絡，安排登門實勘檔期！祝您家宅安泰、丁財兩旺！");
        }, 100);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        const selectedPlan = PLANS_DATA.find(p => p.id === planId);
        if (selectedPlan) {
          const now = new Date();
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);

          const newSub: SubscriptionState = {
            planId: selectedPlan.id,
            planName: selectedPlan.name,
            status: "active",
            subscribedAt: now.toLocaleDateString("zh-HK", { year: 'numeric', month: 'long', day: 'numeric' }),
            nextBillingAt: nextMonth.toLocaleDateString("zh-HK", { year: 'numeric', month: 'long', day: 'numeric' })
          };
          localStorage.setItem("mymasterlam_sub", JSON.stringify(newSub));
          // We'll update the state directly
          setTimeout(() => {
            setSubscription(newSub);
            triggerBlessing(`🎉 感謝您付款！您的『${selectedPlan.name}』服務已成功啟用。林大師已為您親自做法，賜予專屬福澤！`);
          }, 100);

          // Clean query parameters so they don't loop
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  });

  const handleSimulateSubscription = (planId: string) => {
    const selectedPlan = PLANS_DATA.find(p => p.id === planId);
    if (selectedPlan) {
      const now = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const newSub: SubscriptionState = {
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        status: "active",
        subscribedAt: now.toLocaleDateString("zh-HK", { year: 'numeric', month: 'long', day: 'numeric' }),
        nextBillingAt: nextMonth.toLocaleDateString("zh-HK", { year: 'numeric', month: 'long', day: 'numeric' })
      };
      setSubscription(newSub);
      localStorage.setItem("mymasterlam_sub", JSON.stringify(newSub));
      triggerBlessing(`🎉 模擬支付成功！您訂閱的『${selectedPlan.name}』服務已成功啟用。林大師特別加持：乾坤得助、吉星高照！`);
    }
  };

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<{ message: string; planName: string; planId: string } | null>(null);

  const handleCheckout = async (type: string, planName: string) => {
    if (isProcessingPayment) return;
    setIsProcessingPayment(true);
    setPaymentError(null);
    triggerBlessing(`🔮 大師賜福：正在為您對接 Stripe 專屬安全付款通道。福至心靈，起運在即！`);
    
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });
      
      const data = await response.json();
      if (data.url) {
        setPaymentError(null);
        // Safe redirect to Stripe payment checkout
        window.location.href = data.url;
      } else {
        const errorMsg = data.error || "Stripe 金流伺服器未響應";
        setPaymentError({
          message: errorMsg,
          planName,
          planId: type
        });
        alert("無法啟動付款，請稍後再試或使用 WhatsApp 預約：" + errorMsg);
        setIsProcessingPayment(false);
      }
    } catch (err: any) {
      console.error("Stripe payment request failed:", err);
      const errorMsg = err?.message || "伺服器或網路連線異常";
      setPaymentError({
        message: errorMsg,
        planName,
        planId: type
      });
      alert("網路連線異常，請稍後再試，或使用 WhatsApp 聯絡大師秘書。");
      setIsProcessingPayment(false);
    }
  };

  const handleCancelSubscription = () => {
    if (subscription) {
      const updated: SubscriptionState = {
        ...subscription,
        status: "cancelled"
      };
      setSubscription(updated);
      localStorage.setItem("mymasterlam_sub", JSON.stringify(updated));
    }
  };

  const handleRemoveSubscription = () => {
    setSubscription(null);
    localStorage.removeItem("mymasterlam_sub");
  };

  const [copied, setCopied] = useState(false);

  const handleShareReport = () => {
    if (!result) return;
    setGeneratedImage(null);
    setShowShareModal(true);
  };

  const getShareText = () => {
    if (!result) return "";
    return `☯ 【中聯天星易理 · 尊貴天命簡報】 ☯

尊敬的 ${form.name} 閣下（${form.gender}），大師已為您精準推演乾坤命盤：

🔮 降生時空：${form.birthDate} ${form.birthTime || ""}
⚜️ 本命五行：${result.dominantElement}命 (${result.auspiciousColors.join("、")}等契合色彩)
🏡 空間身份：空間${form.identity}

✨ 【天命本源 · 五行天機】
${result.destinyReading}

🏡 【山水和合 · 空間佈局指南】
${result.spaceAdvice}

📍 【地靈氣場 · 居所能量點評】
🏠 居所地址：${form.address}
${result.addressAura}

💡 大師開運日常修持：
${result.tips.map((tip, idx) => `${idx + 1}. ${tip}`).join("\n")}

---
🌌 「氣乘風則散，界水則止。」
中聯家居風水命理專門店，助您解鎖居所與八字的天命契合。
立即前往測算您的天命風水：${window.location.origin}
`;
  };

  const getShareUrl = () => {
    if (!result) return window.location.href;
    const serialized = serializeReport(form, result);
    return `${window.location.origin}${window.location.pathname}?shared_report=${serialized}`;
  };

  const handleWhatsAppShare = () => {
    if (!result) return;
    const url = getShareUrl();
    const text = `☯ 【中聯天星易理 · 尊貴天命報告】 ☯\n\n大師已為我精準推演乾坤命盤！我是極其富貴的「${result.dominantElement}命」，幸運色是「${result.auspiciousColors.join("、")}」！\n\n點擊下方連結，立即查看大師為我親批的完整版專屬風水及八字報告：\n${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleGenerateImage = async () => {
    if (!posterRef.current) return;
    setGeneratingImage(true);
    setGeneratedImage(null);
    try {
      // Allow DOM repaint
      await new Promise((resolve) => setTimeout(resolve, 250));
      
      const canvas = await html2canvas(posterRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2, // 2x high resolution
        backgroundColor: "#590612",
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      setGeneratedImage(dataUrl);
    } catch (error) {
      console.error("生成海報出錯:", error);
      triggerBlessing("❌ 海報繪製失敗，建議您點擊複製全址連結或文字進行分享！");
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!pdfContainerRef.current) return;
    setGeneratingPdf(true);
    try {
      // Allow DOM repaint
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // A4 dimensions in pt: 595.28 x 841.89
      const pageWidth = 595.28;
      const pageHeight = 841.89;

      // Select all elements matching [data-pdf-page] inside pdfContainerRef
      const pages = pdfContainerRef.current.querySelectorAll("[data-pdf-page]");
      
      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i] as HTMLElement;
        
        const canvas = await html2canvas(pageEl, {
          useCORS: true,
          allowTaint: true,
          scale: 2, // high resolution 2x
          logging: false,
          backgroundColor: "#fdfbf7",
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        
        if (i > 0) {
          pdf.addPage();
        }

        // Add the image to fill the A4 page perfectly
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
      }

      pdf.save(`中聯家居風水命理專門店_完整命運氣運報告_${form.name}.pdf`);
      triggerBlessing("✨ 恭喜！完整版 A4 住宅開運 PDF 報告已成功匯出！");
    } catch (error) {
      console.error("PDF生成出錯:", error);
      triggerBlessing("❌ PDF 生成失敗，建議您使用網址分享或純文字報告複製功能。");
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Loading messages sequence
  const startLoadingAnimation = () => {
    const messages = [
      "中聯大師正在凝神聚氣，推演天干地支...",
      "撥動青衣分行專屬羅盤，探尋居住空間之能量場...",
      "正在與 Make.com 萬物相連之鎖對接...",
      "解構命理主五行，謀劃趨吉避凶美學建議...",
      "天命流轉，乾坤合德，報告即將呈現..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length - 1) {
        i++;
        setLoadingMsg(messages[i]);
      } else {
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  };

  // Form validations for each gate
  const validateGate1 = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = "請留下大名，以感應天地氣場。";
    if (!form.gender) newErrors.gender = "請選擇性別以定乾坤陰陽。";
    if (!form.phone.trim() || !/^\+?[0-9\s-]{6,20}$/.test(form.phone)) {
      newErrors.phone = "請輸入正確的手提電話，供後續發送吉兆。";
    }
    if (!form.address.trim()) newErrors.address = "請填寫地址，以定地靈與氣場方位。";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "請提供合適的電子郵件，供大師寄送完整報告。";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateGate2 = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.birthDate) newErrors.birthDate = "出生日期是命格之根，請填寫。";
    if (!form.birthTime) newErrors.birthTime = "時辰決定命盤細節，請選擇。";
    if (!form.birthHour) newErrors.birthHour = "請選擇精準出生小時。";
    if (!form.birthMinute) newErrors.birthMinute = "請選擇精準出生分鐘。";
    if (!form.birthSecond) newErrors.birthSecond = "請選擇精準出生秒數。";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextGate = () => {
    if (step === "gate1" && validateGate1()) {
      setStep("gate2");
    }
  };

  const handleSubmit = async () => {
    if (validateGate2()) {
      setStep("loading");
      const stopLoading = startLoadingAnimation();

      try {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        const resData = await response.json();
        
        if (response.ok && resData.success) {
          setResult(resData.data);
          setWebhookStatus(resData.webhookSuccess);
          setTimeout(() => {
            setStep("result");
            stopLoading();
          }, 3500); // Give enough time for immersive loading
        } else {
          throw new Error(resData.error || "Submission failed");
        }
      } catch (err) {
        console.error("Submission Error:", err);
        // On error, let's gracefully load with fallback static data computed locally
        setTimeout(() => {
          setWebhookStatus(false);
          // Set deterministic fallback values so the user still gets an exquisite outcome
          setResult({
            dominantElement: "木",
            elementScores: { wood: 45, fire: 15, earth: 10, metal: 10, water: 20 },
            destinyReading: `乾坤初判，五行流轉。尊貴的 ${form.name} 閣下，經推算您的精確出生時間為 ${form.birthDate} ${form.birthHour}時${form.birthMinute}分${form.birthSecond}秒（時辰歸屬為 ${form.birthTime}）。您的本命主五行屬性為「木」，生生不息，命格溫潤平和，遇事沉著，處世有容乃大。在近期歲月逢金水相生，利於大展拳腳。在中聯家居風水大師團隊的專業佈局引導下，必能順應天時，開啟無限機遇。`,
            spaceAdvice: `針對您的「${form.identity}」身份，木屬性的空間佈局應注重氣流的和諧與明亮。建議在玄關或窗台處，引入符合您命理之軟裝。${form.identity === "租客" ? "作為租客，您可以選用活動式的小型盆栽、精緻的銅製擺設或棉麻質地的布藝窗簾來調和氣場，無需大動土木" : "作為業主，您可以大膽運用溫潤的木質地板、天然石材電視牆或暖色調燈光進行空間重組"}，能更深層次地匯聚福澤。`,
            addressAura: `您所居住之處「${form.address}」，地靈人傑。字裡行間透出土木相生之意，利於安居樂業。大門方位引納生氣，若能保持玄關整潔明亮、無雜物堆積，則藏風聚氣、家宅平安之兆。`,
            auspiciousColors: ["黛綠", "玄青", "淺木色"],
            tips: [
              "每日清晨開啟南向窗戶十分鐘，引納正陽之氣，增旺室內朝氣。",
              "在客廳或玄關顯眼處擺放一尊素雅的陶瓷器皿，象徵穩重安寧，可沉澱浮躁之氣。",
              "睡床枕頭選用與幸運顏色契合的色調，利於夜間氣場修復與心靈祥和。"
            ]
          });
          setStep("result");
          stopLoading();
        }, 3500);
      }
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      gender: "",
      identity: "業主",
      phone: "",
      address: "",
      birthDate: "",
      birthTime: "",
      birthHour: "12",
      birthMinute: "30",
      birthSecond: "00",
      email: "",
      services: ["家居風水", "八字分析"],
    });
    setResult(null);
    setWebhookStatus(null);
    setErrors({});
    setSelectedElementNode(null);
    setStep("intro");
  };

  // UI Helpers
  const getElementColorClass = (element: "金" | "木" | "水" | "火" | "土") => {
    switch (element) {
      case "木": return { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: Trees, label: "天元震木 · 萬物滋生" };
      case "火": return { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", icon: Flame, label: "天元離火 · 炳煥乾坤" };
      case "土": return { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: CircleDot, label: "天元坤土 · 載物厚德" };
      case "金": return { text: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200", icon: Gem, label: "天元兌金 · 剛健清肅" };
      case "水": return { text: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-200", icon: Droplets, label: "天元坎水 · 潤下無疆" };
    }
  };

  return (
    <div id="aesthetic_app_container" className="min-h-screen font-serif flex flex-col justify-between selection:bg-gold-200 selection:text-ink-900 bg-[#fbfaf7] text-ink-800 relative overflow-hidden">
      {/* Background Decorative Atmosphere */}
      <div className="absolute inset-0 canvas-glow pointer-events-none" />
      <div className="absolute top-10 left-10 w-64 h-64 border border-gold-100/30 rounded-full pointer-events-none flex items-center justify-center">
        <div className="w-48 h-48 border border-gold-100/20 rounded-full" />
      </div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 border border-gold-100/20 rounded-full pointer-events-none" />

      {/* Header */}
      <header id="app_header" className="border-b-2 border-[#bfa15f]/30 backdrop-blur-md bg-[#fbfaf7]/90 sticky top-0 z-40 transition-all duration-300 shadow-sm">
        {/* Under-nine fortune promotion banner */}
        <div className="bg-gradient-to-r from-[#3b020a] via-[#590612] to-[#3b020a] border-b border-[#bfa15f]/30 text-white py-1.5 px-4 text-center text-[10px] sm:text-xs font-serif tracking-wider font-bold flex flex-wrap items-center justify-center gap-1.5 shadow-sm">
          <span>🧧</span>
          <span>下元九運大吉：林大師「八字全盤精批」與「家居風水現場羅盤佈局」限時特惠 3 折！每日親算名額僅限 3 位。</span>
          <button 
            type="button"
            onClick={() => {
              const panel = document.getElementById("master_conversion_panel");
              if (panel) {
                panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
              } else {
                setIsPremiumBarExpanded(true);
                setTimeout(() => {
                  document.getElementById("contact_widget_container")?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 100);
              }
            }}
            className="underline text-yellow-300 hover:text-yellow-100 transition-colors ml-1 font-bold cursor-pointer"
          >
            立即預約搶占先機 ➔
          </button>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <BrandLogo className="h-10 sm:h-12" />
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs font-serif font-bold text-[#8a713b] bg-[#f4efdf]/40 border border-[#bfa15f]/20 px-2 py-0.5 rounded shadow-2xs">
                青衣海悅花園分行 ☯ 實體地舖
              </span>
              <span className="text-xs font-sans text-gold-700 bg-white border border-[#e8debe] px-2 py-0.5 rounded font-bold shadow-2xs">
                下元九運 · 離火當令 ☯
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 self-end md:self-auto">
            <div className="flex items-center space-x-1.5 bg-[#590612]/5 border border-[#590612]/15 px-3 py-1.5 rounded-lg shadow-xs">
              <Phone className="w-3.5 h-3.5 text-[#590612]" />
              <a href="tel:91884964" className="text-xs font-bold text-[#590612] font-mono hover:underline">
                熱線: 91884964
              </a>
            </div>
            <a 
              href="https://www.mymasterlam.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 bg-gradient-to-r from-[#590612] to-[#800c1e] hover:from-[#800c1e] hover:to-[#590612] px-3.5 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-sm border border-[#bfa15f]/40 hover:scale-[1.02]"
            >
              <span>🌐 預約林大師官網</span>
            </a>
          </div>
        </div>

        {/* Integrated Address & Scope Bar */}
        <div className="bg-[#f4efdf]/30 border-t border-[#bfa15f]/20 px-4 py-2">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] sm:text-xs text-ink-900 font-serif gap-2">
            <div className="flex items-center gap-1.5">
              <span>📍</span>
              <span className="font-semibold text-gold-900">實體店址：</span>
              <span className="text-ink-800">青衣海悅花園 32 號地舖</span>
            </div>
            <div className="hidden md:block text-gold-300">|</div>
            <div className="flex items-center gap-1.5">
              <span>🔮</span>
              <span className="font-semibold text-gold-900">經營範疇：</span>
              <span className="text-ink-800 font-medium">家居風水勘察 · 八字命理大運 · 烏兔擇日 · 開運風水大陣</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main id="app_main" className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 relative z-10">
        
        {/* Dynamic Grid Layout (Interactive module + sidebar contact widget) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Stage (Takes 8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-center min-h-[450px]">
            <AnimatePresence mode="wait">
              
              {/* INTRO LANDING */}
              {step === "intro" && (
                <motion.div 
                  key="intro"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6 }}
                  className="text-center space-y-8 max-w-2xl mx-auto py-6"
                  id="view_intro"
                >
                  <div className="relative inline-block">
                    {/* Rotating energy rings */}
                    <div className="absolute inset-[-12px] border border-dashed border-[#bfa15f]/20 rounded-full animate-[spin_60s_linear_infinite]" />
                    <div className="absolute inset-[-6px] border border-double border-[#590612]/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                    <div className="absolute inset-0 bg-[#bfa15f]/5 rounded-full blur-xl opacity-40 animate-pulse" />
                    <img 
                      src="/src/assets/images/fengshui_luopan_1783843400904.jpg" 
                      alt="中聯專屬風水大羅盤" 
                      referrerPolicy="no-referrer"
                      className="w-36 h-36 object-cover rounded-full mx-auto border-2 border-[#bfa15f] p-1 bg-[#fbfaf7] animate-slow-spin shadow-xl"
                    />
                    <Compass className="absolute inset-0 m-auto w-10 h-10 text-[#590612] bg-[#fbfaf7] p-2 rounded-full border border-[#bfa15f] shadow-md" />
                  </div>

                  <div className="space-y-4">
                    <span className="text-xs uppercase font-sans text-gold-700 tracking-[0.35em] font-extrabold block">
                      ⚜️ 中聯專屬 · 傳統五行天星與家居氣運勘察 ⚜️
                    </span>
                    <h1 className="text-3.5xl sm:text-4xl font-black tracking-widest text-[#590612] title-gilded py-1 font-serif">
                      「氣乘風則散，界水則止」
                    </h1>
                    <p className="text-ink-400 text-sm max-w-lg mx-auto leading-relaxed font-serif text-justify sm:text-center">
                      中聯家居風水命理專門店，秉承古法堪輿學，為您推演居所與生辰八字的天命契合。只需透過兩重精準的探問，即可即時啟動大師級命盤演算法，獲取專屬的本命五行、空間佈局與地靈氣場吉凶點評。
                    </p>
                  </div>

                  <div className="bg-[#fbfaf7] border-2 border-[#bfa15f]/30 rounded-2xl p-6 max-w-md mx-auto text-left space-y-3 relative shadow-inner">
                    <div className="absolute right-3 top-3 text-[#590612]/5 text-2xl font-black">☯</div>
                    <h3 className="text-xs font-bold text-gold-700 tracking-wider flex items-center gap-1.5 font-sans uppercase">
                      <Sparkles className="w-3.5 h-3.5 text-[#590612]" /> 乾坤兩重探問法門：
                    </h3>
                    <ol className="text-xs text-ink-900 list-decimal pl-4 space-y-2 leading-relaxed font-serif">
                      <li><strong>第一問：塵世因緣</strong> <span className="text-ink-400">（契合您的身份、物業地靈與聯繫吉兆）</span></li>
                      <li><strong>第二問：天命時空</strong> <span className="text-ink-400">（精準推演您降生之時的宇宙干支與五行元神）</span></li>
                    </ol>
                  </div>

                  <div>
                    <button 
                      id="btn_start"
                      onClick={() => setStep("gate1")}
                      className="px-10 py-4 bg-gradient-to-r from-[#590612] to-[#800c1e] hover:from-[#800c1e] hover:to-[#590612] text-white rounded-xl text-sm tracking-[0.2em] font-sans font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto border-2 border-[#bfa15f]/60 hover:scale-[1.03] active:scale-[0.98]"
                    >
                      <span>啟動乾坤命理推演</span>
                      <ChevronRight className="w-4 h-4 text-gold-200" />
                    </button>
                  </div>

                  {/* 🧧 Master Direct Consultation Special Promo */}
                  <div className="mt-8 border-t border-[#bfa15f]/20 pt-8 space-y-6">
                    <div className="text-center space-y-2">
                      <span className="text-[10px] tracking-widest font-sans font-extrabold text-white bg-[#590612] px-3 py-1 rounded-full uppercase shadow-xs">
                        🧧 實體地舖 · 誠信保證 · 改變運勢就在今天
                      </span>
                      <h2 className="text-2xl font-black text-[#590612] font-serif tracking-wide mt-2">
                        中聯家居風水命理 · 專屬大師親算預約特惠
                      </h2>
                      <p className="text-xs text-ink-900 font-serif max-w-lg mx-auto leading-relaxed">
                        天命不可違，但氣運可以調和。系統推演僅為基本推斷，大師親算方能點撥乾坤妙境。由林大師親自把脈您的居所風水大陣與六十載大運，助您財源廣進、家宅安泰。
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto text-left">
                      {/* Bazi Card */}
                      <div className="bg-gradient-to-br from-amber-50/50 to-amber-100/15 border-2 border-[#bfa15f]/40 rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition-all relative overflow-hidden group">
                        <div className="absolute right-3 top-3 text-[#590612]/5 text-4xl font-black">🔮</div>
                        <div className="space-y-3">
                          <span className="text-[9px] bg-amber-600 text-white font-sans px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                            精準八字大運
                          </span>
                          <h4 className="text-base font-black text-[#590612] font-serif">林大師親批：個人八字全盤精批</h4>
                          <p className="text-xs text-ink-900 font-serif leading-relaxed">
                            <strong>剖析您整整 60 年的起伏大運。</strong>深入探查元神衰旺、喜用五行，針對您的事業瓶頸、姻緣關口、財庫漏財進行點對點開運解惑，掌握未來主動權！
                          </p>
                          <BaziDetailedIntro />
                        </div>
                        <div className="pt-4 border-t border-gold-200/50 mt-4">
                          <div className="flex items-baseline justify-between mb-3">
                            <div>
                              <span className="text-[10px] text-ink-400 block line-through">原價 HK$4,800</span>
                              <span className="text-xs font-serif text-[#590612] font-semibold">限時特惠價 </span>
                            </div>
                            <span className="text-xl font-black text-[#590612] font-sans">HK$1,440</span>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2">
                            <button 
                              type="button"
                              onClick={() => handleCheckout("bazi", "個人八字全盤精批")}
                              disabled={isProcessingPayment}
                              className="bg-gradient-to-r from-[#590612] to-[#800c1e] hover:from-[#800c1e] hover:to-[#590612] text-white text-center font-sans font-bold text-xs py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1 hover:scale-[1.02] cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span>🌐 網上付費預約大師</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                            <a 
                              href={`https://wa.me/85291884964?text=${encodeURIComponent("您好，我想向林師傅預約『八字全盤大運精算』(優惠價HK$1440)，謝謝！")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => triggerBlessing("🔮 大師賜福：五行流轉、命格生旺！正在對接林師傅為您親批八字命格、大運大開...")}
                              className="bg-[#25d366] hover:bg-[#20ba5a] text-white text-center font-sans font-bold text-[11px] py-2 rounded-xl transition-all flex items-center justify-center gap-1"
                            >
                              <span>💬 WhatsApp 快速搶占名額</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Feng Shui Card */}
                      <div className="bg-gradient-to-br from-rose-50/50 to-rose-100/15 border-2 border-rose-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition-all relative overflow-hidden group">
                        <div className="absolute right-3 top-3 text-[#590612]/5 text-4xl font-black">🏠</div>
                        <div className="space-y-3">
                          <span className="text-[9px] bg-rose-600 text-white font-sans px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                            現場風水實勘
                          </span>
                          <h4 className="text-base font-black text-[#590612] font-serif">家居風水實地磁場大陣佈局</h4>
                          <p className="text-xs text-ink-900 font-serif leading-relaxed">
                            <strong>林師傅登門實地羅盤勘測。</strong>根據住宅 精確坐向與九宮飛星，為您的客廳、玄關、臥室擺設專屬催財/納吉/化煞大陣，化煞辟邪，引地靈生氣入室。
                          </p>
                          <FengShuiDetailedIntro />
                        </div>
                        <div className="pt-4 border-t border-rose-200/50 mt-4">
                          <div className="flex items-baseline justify-between mb-3">
                            <div>
                              <span className="text-[10px] text-ink-400 block line-through">原價 HK$9,200</span>
                              <span className="text-xs font-serif text-[#590612] font-semibold">限時特惠價 </span>
                            </div>
                            <span className="text-xl font-black text-[#590612] font-sans">HK$2,760</span>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2">
                            <button 
                              type="button"
                              onClick={() => handleCheckout("fengshui", "住宅家居風水現場佈局實測")}
                              disabled={isProcessingPayment}
                              className="bg-gradient-to-r from-[#590612] to-[#800c1e] hover:from-[#800c1e] hover:to-[#590612] text-white text-center font-sans font-bold text-xs py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1 hover:scale-[1.02] cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span>🌐 網上付費預約大師</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                            <a 
                              href={`https://wa.me/85291884964?text=${encodeURIComponent("您好，我想向林師傅預約『家居風水現場佈局實地勘察』(優惠價HK$2760)，謝謝！")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => triggerBlessing("🏠 大師賜福：宅運昌隆、避邪納福！正在對接林師傅為您實地堪輿家居、生旺福德...")}
                              className="bg-[#25d366] hover:bg-[#20ba5a] text-white text-center font-sans font-bold text-[11px] py-2 rounded-xl transition-all flex items-center justify-center gap-1"
                            >
                              <span>💬 WhatsApp 快速搶占名額</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-center text-[#590612] font-serif leading-relaxed px-4 font-bold bg-gold-50/50 py-3 rounded-xl border border-[#bfa15f]/20">
                      📣 <strong>中聯家居實體地舖誠信保證！隨時歡迎您親臨青衣海悅花園 32 號實體店面諮詢。網上或 WhatsApp 付費預約即享限時大特惠，林師傅親自為您全心全意開運佈局！</strong>
                    </p>
                  </div>
                </motion.div>
              )}

          {/* GATE 1: MUNDANE INFORMATION */}
          {step === "gate1" && (
            <motion.div 
              key="gate1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl gilded-box rounded-2xl p-6 sm:p-10 relative overflow-hidden"
              id="view_gate1"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gold-200 flex">
                <div className="w-1/2 h-full bg-gold-500 transition-all duration-500" />
              </div>

              <div className="mb-8 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-sans text-gold-600 tracking-[0.2em] uppercase block mb-1">
                    門之第一重 · Earthly Bond
                  </span>
                  <h2 className="text-2xl font-bold text-ink-900 tracking-wider flex items-center gap-2">
                    <span>第一問：塵世因緣</span>
                    <span className="text-xs font-normal font-sans text-ink-400">(個人與空間)</span>
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold bg-gold-50 text-gold-700 border border-gold-100 px-2 py-1 rounded">
                  1 / 2 門
                </span>
              </div>

              <div className="space-y-6">
                {/* complimentary gift/trust banner */}
                <div className="bg-[#590612]/3 border border-dashed border-[#bfa15f]/40 rounded-xl p-3.5 flex items-start gap-2 text-xs text-ink-900 leading-relaxed font-serif">
                  <span className="text-base">🎁</span>
                  <div>
                    <strong>免費推演禮遇：</strong>完成兩重探問後，您將立刻獲得：<strong>本命五行元神分析 ＋ 家居開運植物佈置 ＋ 住宅地靈能量點評（免費版）</strong>！
                    <span className="block mt-1 text-[11px] text-[#590612] font-semibold">
                      💡 尊榮大開運：如需林大師親批「60 年起伏大運」或「到府現場風水實勘」，可在首頁或下方尊享會員區直接付款預約，實體青衣地舖誠信保障！
                    </span>
                  </div>
                </div>

                {/* Name & Gender Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink-900 tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gold-500" /> 客戶姓名
                    </label>
                    <input 
                      id="input_name"
                      type="text" 
                      placeholder="請輸入大名"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-gold-50/30 border border-gold-200/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500 font-sans text-ink-900 transition-colors"
                    />
                    {errors.name && <p className="text-[10px] font-sans text-rose-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink-900 tracking-wider flex items-center gap-1.5">
                      <span>☯️ 性別屬性</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        id="btn_gender_乾"
                        type="button"
                        onClick={() => setForm({ ...form, gender: "乾 (男)" })}
                        className={`py-2 px-3 text-xs rounded-lg font-sans border transition-all ${form.gender === "乾 (男)" ? "bg-gold-500 border-gold-600 text-white" : "bg-gold-50/10 border-gold-200/50 text-ink-400 hover:bg-gold-50/50"}`}
                      >
                        乾 (男)
                      </button>
                      <button 
                        id="btn_gender_坤"
                        type="button"
                        onClick={() => setForm({ ...form, gender: "坤 (女)" })}
                        className={`py-2 px-3 text-xs rounded-lg font-sans border transition-all ${form.gender === "坤 (女)" ? "bg-gold-500 border-gold-600 text-white" : "bg-gold-50/10 border-gold-200/50 text-ink-400 hover:bg-gold-50/50"}`}
                      >
                        坤 (女)
                      </button>
                    </div>
                    {errors.gender && <p className="text-[10px] font-sans text-rose-500">{errors.gender}</p>}
                  </div>
                </div>

                {/* Identity Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-ink-900 tracking-wider flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-gold-500" /> 居住身份
                  </label>
                  <div className="grid grid-cols-2 gap-3 bg-gold-50/30 p-1.5 border border-gold-100 rounded-xl">
                    <button 
                      id="btn_identity_業主"
                      type="button"
                      onClick={() => setForm({ ...form, identity: "業主" })}
                      className={`py-2 px-3 rounded-lg text-xs font-sans transition-all flex items-center justify-center space-x-2 ${form.identity === "業主" ? "bg-white shadow text-gold-700 font-medium" : "text-ink-400 hover:text-ink-800"}`}
                    >
                      <span>🏠 業主 (擁有產權)</span>
                    </button>
                    <button 
                      id="btn_identity_租客"
                      type="button"
                      onClick={() => setForm({ ...form, identity: "租客" })}
                      className={`py-2 px-3 rounded-lg text-xs font-sans transition-all flex items-center justify-center space-x-2 ${form.identity === "租客" ? "bg-white shadow text-gold-700 font-medium" : "text-ink-400 hover:text-ink-800"}`}
                    >
                      <span>🔑 租客 (賃屋安身)</span>
                    </button>
                  </div>
                </div>

                {/* Address Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-ink-900 tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gold-500" /> 居住地址
                    </label>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, address: "青衣海悅花園32號地舖" })}
                      className="text-[10px] text-[#590612] hover:underline font-sans font-semibold flex items-center gap-0.5"
                    >
                      📍 快速輸入本分行地址
                    </button>
                  </div>
                  <input 
                    id="input_address"
                    type="text" 
                    placeholder="例如：青衣海悅花園32號地舖..."
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full bg-gold-50/30 border border-gold-200/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500 font-sans text-ink-900 transition-colors"
                  />
                  <p className="text-[10px] text-ink-400 leading-normal">
                    *地址為空間風水之核，我們將推演住宅地脈之氣，大師會完全保密。
                  </p>
                  {errors.address && <p className="text-[10px] font-sans text-rose-500">{errors.address}</p>}
                </div>

                {/* Phone & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink-900 tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gold-500" /> 電話號碼
                    </label>
                    <input 
                      id="input_phone"
                      type="tel" 
                      placeholder="例如：6123 4567"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-gold-50/30 border border-gold-200/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500 font-sans text-ink-900 transition-colors"
                    />
                    {errors.phone && <p className="text-[10px] font-sans text-rose-500">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink-900 tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gold-500" /> 電子郵件
                    </label>
                    <input 
                      id="input_email"
                      type="email" 
                      placeholder="例如：hello@domain.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-gold-50/30 border border-gold-200/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500 font-sans text-ink-900 transition-colors"
                    />
                    {errors.email && <p className="text-[10px] font-sans text-rose-500">{errors.email}</p>}
                  </div>
                </div>

                {/* Services Selection Section */}
                <div className="space-y-3 bg-[#590612]/5 border border-[#bfa15f]/20 rounded-xl p-4">
                  <label className="text-xs font-bold text-[#590612] tracking-wider block font-sans">
                    🔮 諮詢服務範圍 (可複選)
                  </label>
                  <p className="text-[10px] text-ink-400 font-sans leading-relaxed">
                    請選取您想了解或諮詢的項目，大師團隊將在分析您的命盤時重點剖析並提供針對性建議：
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {[
                      { label: "八字董公烏兔 擇日", desc: "依據生辰挑選嫁娶/動土/搬遷吉日" },
                      { label: "八字起名", desc: "結合先天八字五行精選旺運雅名" },
                      { label: "家居風水", desc: "住宅內部格局規劃、明堂玄關勘察" },
                      { label: "風水陣", desc: "擺設催旺桃花/化煞避凶/聚財陣法" },
                      { label: "八字分析", desc: "流年大運、事業婚姻命理深度推演" }
                    ].map((service) => {
                      const isSelected = form.services.includes(service.label);
                      return (
                        <button
                          key={service.label}
                          type="button"
                          onClick={() => {
                            const newServices = isSelected
                              ? form.services.filter(s => s !== service.label)
                              : [...form.services, service.label];
                            setForm({ ...form, services: newServices });
                          }}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            isSelected 
                              ? "bg-white border-[#590612] shadow-sm ring-1 ring-[#590612]/20" 
                              : "bg-[#fbfaf7]/60 border-gold-200/50 hover:bg-gold-50/50"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="mt-0.5 accent-[#590612] rounded"
                            />
                            <div>
                              <p className="text-xs font-bold text-ink-900 leading-none">{service.label}</p>
                              <p className="text-[9px] text-ink-400 leading-relaxed mt-0.5">{service.desc}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gold-100 flex justify-between items-center">
                <button 
                  id="btn_back_to_intro"
                  onClick={() => setStep("intro")}
                  className="px-4 py-2 border border-gold-200 text-gold-700 hover:bg-gold-50 text-xs tracking-wider rounded-lg font-sans transition-all flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>返首頁</span>
                </button>
                <button 
                  id="btn_go_to_gate2"
                  onClick={handleNextGate}
                  className="px-6 py-2.5 bg-ink-900 hover:bg-ink-800 text-gold-100 hover:text-white text-xs tracking-widest font-sans rounded-lg transition-all flex items-center space-x-1.5 font-medium shadow-md"
                >
                  <span>進第二問</span>
                  <ChevronRight className="w-4 h-4 text-gold-500" />
                </button>
              </div>
            </motion.div>
          )}

          {/* GATE 2: CELESTIAL ALIGNMENT */}
          {step === "gate2" && (
            <motion.div 
              key="gate2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl gilded-box rounded-2xl p-6 sm:p-10 relative overflow-hidden"
              id="view_gate2"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gold-200 flex">
                <div className="w-full h-full bg-gold-500 transition-all duration-500" />
              </div>

              <div className="mb-8 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-sans text-gold-600 tracking-[0.2em] uppercase block mb-1">
                    門之第二重 · Cosmic Destiny
                  </span>
                  <h2 className="text-2xl font-bold text-ink-900 tracking-wider flex items-center gap-2">
                    <span>第二問：天命時空</span>
                    <span className="text-xs font-normal font-sans text-ink-400">(八字與生辰)</span>
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold bg-gold-50 text-gold-700 border border-gold-100 px-2 py-1 rounded">
                  2 / 2 門
                </span>
              </div>

              <div className="space-y-6">
                {/* Motivation/Trust banner for gate2 */}
                <div className="bg-[#590612]/3 border border-dashed border-[#bfa15f]/40 rounded-xl p-3.5 flex items-start gap-2 text-xs text-ink-900 leading-relaxed font-serif">
                  <span className="text-base">✨</span>
                  <div>
                    <strong>只差最後一步：</strong>生辰干支時空是推演命格氣數與九宮飛星佈局最關鍵的一環！填寫後即可一鍵點撥萬象。
                    <span className="block mt-1 text-[11px] text-[#590612] font-semibold">
                      💡 限時 3 折紅包：想獲取大師親算、專人 1 對 1 吉位安床/財位催化指導？立即加購「個人八字全盤精批」，開啟九運大運！
                    </span>
                  </div>
                </div>

                {/* Birth Date Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-ink-900 tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold-500" /> 出生日期 (年 月 日)
                  </label>
                  <input 
                    id="input_birth_date"
                    type="date" 
                    value={form.birthDate}
                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                    className="w-full bg-gold-50/30 border border-gold-200/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500 font-sans text-ink-900 transition-colors"
                  />
                  <p className="text-[10px] text-ink-400 leading-normal">
                    *出生日期奠定您降世之時的天干，是五行本源之始。
                  </p>
                  {errors.birthDate && <p className="text-[10px] font-sans text-rose-500">{errors.birthDate}</p>}
                </div>

                {/* Birth Time Input - Traditional Shichen & Precise Time Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink-900 tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-500" /> 出生時辰 (傳統干支)
                    </label>
                    <select 
                      id="select_birth_time"
                      value={form.birthTime}
                      onChange={(e) => setForm({ ...form, birthTime: e.target.value })}
                      className="w-full bg-gold-50/30 border border-gold-200/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500 font-sans text-ink-900 transition-colors"
                    >
                      <option value="">-- 請選擇您的出生時辰 --</option>
                      {SHICHEN_LIST.map((shichen) => (
                        <option key={shichen.value} value={shichen.value}>
                          {shichen.label}
                        </option>
                      ))}
                    </select>
                    {errors.birthTime && <p className="text-[10px] font-sans text-rose-500">{errors.birthTime}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink-900 tracking-wider flex items-center gap-1.5">
                      ⏱️ 精確出生時間 (分秒必爭)
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-gold-50/30 p-1 border border-gold-200/60 rounded-lg">
                      {/* Hour */}
                      <div>
                        <select
                          value={form.birthHour}
                          onChange={(e) => setForm({ ...form, birthHour: e.target.value })}
                          className="w-full bg-transparent text-xs text-center border-none focus:ring-0 text-ink-900 font-mono py-1 cursor-pointer"
                        >
                          {Array.from({ length: 24 }).map((_, h) => {
                            const val = h.toString().padStart(2, "0");
                            return <option key={val} value={val}>{val} 時</option>;
                          })}
                        </select>
                      </div>
                      {/* Minute */}
                      <div>
                        <select
                          value={form.birthMinute}
                          onChange={(e) => setForm({ ...form, birthMinute: e.target.value })}
                          className="w-full bg-transparent text-xs text-center border-none focus:ring-0 text-ink-900 font-mono py-1 cursor-pointer"
                        >
                          {Array.from({ length: 60 }).map((_, m) => {
                            const val = m.toString().padStart(2, "0");
                            return <option key={val} value={val}>{val} 分</option>;
                          })}
                        </select>
                      </div>
                      {/* Second */}
                      <div>
                        <select
                          value={form.birthSecond}
                          onChange={(e) => setForm({ ...form, birthSecond: e.target.value })}
                          className="w-full bg-transparent text-xs text-center border-none focus:ring-0 text-ink-900 font-mono py-1 cursor-pointer"
                        >
                          {Array.from({ length: 60 }).map((_, s) => {
                            const val = s.toString().padStart(2, "0");
                            return <option key={val} value={val}>{val} 秒</option>;
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-between text-[9px] text-ink-400 font-sans mt-1 px-1">
                      <span>(小時 00-23)</span>
                      <span>(分鐘 00-59)</span>
                      <span>(秒數 00-59)</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-ink-400 leading-normal">
                  *時間要精準至分秒以供極其精準的八字、董公烏兔擇日、以及風水陣方位推演。
                </p>

                {/* Visual Accent */}
                <div className="bg-gold-50/40 border border-dashed border-gold-200 rounded-xl p-4 text-center">
                  <Sparkles className="w-5 h-5 text-gold-500 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs text-ink-400 max-w-sm mx-auto leading-relaxed">
                    「天有五行，人有五臟，地有五方。」兩重探問已備齊，點擊下方按鈕將對接天、地、人三才，推演乾坤奧妙。
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gold-100 flex justify-between items-center">
                <button 
                  id="btn_back_to_gate1"
                  onClick={() => setStep("gate1")}
                  className="px-4 py-2 border border-gold-200 text-gold-700 hover:bg-gold-50 text-xs tracking-wider rounded-lg font-sans transition-all flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>返上一問</span>
                </button>
                <button 
                  id="btn_submit_deduce"
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white text-xs tracking-widest font-sans rounded-lg transition-all flex items-center space-x-2 font-bold shadow-lg shadow-gold-500/20 hover:scale-[1.02]"
                >
                  <span>啟動萬象推演</span>
                  <Compass className="w-4 h-4 animate-spin" />
                </button>
              </div>
            </motion.div>
          )}

          {/* LOADING SCREEN */}
          {step === "loading" && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-6 max-w-md"
              id="view_loading"
            >
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                {/* Five concentric rings for metal, wood, water, fire, earth */}
                <div className="absolute inset-0 border border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-2 border border-rose-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-4 border border-amber-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-6 border border-slate-500/20 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
                <div className="absolute inset-8 border border-cyan-500/20 rounded-full animate-[spin_30s_linear_infinite]" />
                
                {/* Spinning Luo pan */}
                <Compass className="w-16 h-16 text-gold-500 animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-ink-900 tracking-wider">正在運算氣場神機</h3>
                <p className="text-xs text-gold-600 font-sans tracking-widest animate-pulse font-medium">DEDUCING CELESTIAL AND SPACE HARMONY...</p>
                <div className="h-4 flex items-center justify-center">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-ink-400 max-w-xs mx-auto leading-relaxed font-light"
                  >
                    {loadingMsg}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULTS DASHBOARD */}
          {step === "result" && result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full space-y-8 py-4"
              id="view_result"
            >
              {/* Seal and Header Banner */}
              <div className="gilded-box rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
                {/* Background aura gradient according to dominant element */}
                <div className={`absolute top-0 right-0 w-80 h-80 rounded-full filter blur-[80px] opacity-15 -mr-20 -mt-20 ${
                  result.dominantElement === "木" ? "bg-emerald-500" :
                  result.dominantElement === "火" ? "bg-rose-500" :
                  result.dominantElement === "土" ? "bg-amber-500" :
                  result.dominantElement === "金" ? "bg-slate-500" : "bg-cyan-500"
                }`} />

                {/* SVG Elements Radar / Wheel Chart */}
                <div className="flex-shrink-0 w-52 h-52 relative flex items-center justify-center bg-gold-50/50 p-2 rounded-full border border-gold-100">
                  <svg viewBox="0 0 120 120" className="w-full h-full rotate-[-18deg]">
                    {/* Ring background */}
                    <circle cx="60" cy="60" r="45" fill="none" stroke="#eadece" strokeWidth="0.5" />
                    <circle cx="60" cy="60" r="30" fill="none" stroke="#eadece" strokeWidth="0.5" strokeDasharray="1 2" />
                    
                    {/* Generation Ring arrows */}
                    <path d="M 60,15 A 45,45 0 0,1 102.8,45" fill="none" stroke="#bfa15f" strokeWidth="0.5" markerEnd="url(#arrow)" />
                    
                    {/* Web polygon based on scores */}
                    {(() => {
                      // Angles for each element starting from top clockwise: Wood, Fire, Earth, Metal, Water
                      const angles = [0, 72, 144, 216, 288];
                      const maxRadius = 40;
                      const scores = [
                        result.elementScores.wood,
                        result.elementScores.fire,
                        result.elementScores.earth,
                        result.elementScores.metal,
                        result.elementScores.water
                      ];
                      
                      const points = angles.map((angle, index) => {
                        const radius = 10 + (scores[index] / 100) * maxRadius;
                        const x = 60 + radius * Math.sin((angle * Math.PI) / 180);
                        const y = 60 - radius * Math.cos((angle * Math.PI) / 180);
                        return `${x},${y}`;
                      }).join(" ");

                      return (
                        <>
                          {/* Inner star lines for control cycle */}
                          <line x1="60" y1="15" x2="86.4" y2="96.4" stroke="#eadece" strokeWidth="0.5" strokeDasharray="1 1" />
                          <line x1="86.4" y1="96.4" x2="17.2" y2="46.4" stroke="#eadece" strokeWidth="0.5" strokeDasharray="1 1" />
                          <line x1="17.2" y1="46.4" x2="102.8" y2="46.4" stroke="#eadece" strokeWidth="0.5" strokeDasharray="1 1" />
                          <line x1="102.8" y1="46.4" x2="33.6" y2="96.4" stroke="#eadece" strokeWidth="0.5" strokeDasharray="1 1" />
                          <line x1="33.6" y1="96.4" x2="60" y2="15" stroke="#eadece" strokeWidth="0.5" strokeDasharray="1 1" />

                          {/* Colored energy fill */}
                          <polygon 
                            points={points} 
                            fill={
                              result.dominantElement === "木" ? "rgba(16, 185, 129, 0.25)" :
                              result.dominantElement === "火" ? "rgba(239, 68, 68, 0.25)" :
                              result.dominantElement === "土" ? "rgba(245, 158, 11, 0.25)" :
                              result.dominantElement === "金" ? "rgba(100, 116, 139, 0.25)" : "rgba(6, 182, 212, 0.25)"
                            } 
                            stroke={
                              result.dominantElement === "木" ? "#10b981" :
                              result.dominantElement === "火" ? "#ef4444" :
                              result.dominantElement === "土" ? "#f5980b" :
                              result.dominantElement === "金" ? "#64748b" : "#06b6d4"
                            } 
                            strokeWidth="1" 
                          />

                          {/* Element Nodes */}
                          {angles.map((angle, index) => {
                            const radius = 10 + (scores[index] / 100) * maxRadius;
                            const x = 60 + radius * Math.sin((angle * Math.PI) / 180);
                            const y = 60 - radius * Math.cos((angle * Math.PI) / 180);
                            const elementLabels = ["木", "火", "土", "金", "水"];
                            const elementColors = ["#10b981", "#ef4444", "#f5980b", "#64748b", "#06b6d4"];
                            
                            return (
                              <g key={index}>
                                <circle cx={x} cy={y} r="2.5" fill={elementColors[index]} />
                                <text 
                                  x={60 + 49 * Math.sin((angle * Math.PI) / 180)} 
                                  y={62 - 49 * Math.cos((angle * Math.PI) / 180)} 
                                  textAnchor="middle" 
                                  fontSize="6.5" 
                                  fontWeight="bold"
                                  fontFamily="sans-serif"
                                  fill={elementColors[index]}
                                  transform={`rotate(18, ${60 + 49 * Math.sin((angle * Math.PI) / 180)}, ${62 - 49 * Math.cos((angle * Math.PI) / 180)})`}
                                >
                                  {elementLabels[index]}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                  <div className="absolute inset-0 m-auto w-14 h-14 bg-white/90 border border-gold-200 shadow-md rounded-full flex flex-col items-center justify-center">
                    <span className="text-[9px] font-sans text-ink-400 font-medium">主命局</span>
                    <span className="text-xl font-bold text-ink-900 leading-tight">{result.dominantElement}</span>
                  </div>
                </div>

                {/* Profile Overview */}
                <div className="flex-grow space-y-4 text-center md:text-left w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-sans text-gold-600 tracking-widest block uppercase font-semibold">
                        乾坤推演完畢 · Destiny Report Created
                      </span>
                      <h2 className="text-3xl font-bold text-ink-900 tracking-wide mt-1">
                        {form.name} <span className="text-sm font-sans font-normal text-ink-400">({form.gender}) · 尊貴之命盤</span>
                      </h2>
                    </div>
                    {/* Actions: Share & PDF Buttons */}
                    <div className="flex flex-wrap justify-center sm:justify-end gap-2.5 pt-1">
                      <button
                        type="button"
                        id="btn_preview_pdf_top"
                        onClick={() => {
                          setShowPdfModal(true);
                          triggerBlessing("📖 正在翻閱天星典籍... 為您開啟完整 A4 住宅風水與天命 PDF 報告預覽！");
                        }}
                        className="px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow bg-gold-50 hover:bg-gold-100 text-gold-800 border border-gold-200 hover:scale-[1.02] cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-gold-700" />
                        <span>預覽完整 PDF 報告</span>
                      </button>

                      <button
                        type="button"
                        id="btn_share_report_top"
                        onClick={handleShareReport}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow ${
                          copied 
                            ? "bg-emerald-600 text-white shadow-emerald-600/10 hover:bg-emerald-700" 
                            : "bg-[#590612] hover:bg-[#800c1e] text-white shadow-[#590612]/10 hover:scale-[1.02]"
                        }`}
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                        <span>{copied ? "已複製命理簡報！" : "分享命理簡報"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 font-sans ${getElementColorClass(result.dominantElement)?.bg} ${getElementColorClass(result.dominantElement)?.text} ${getElementColorClass(result.dominantElement)?.border}`}>
                      {(() => {
                        const IconComponent = getElementColorClass(result.dominantElement)?.icon || Sparkles;
                        return <IconComponent className="w-3.5 h-3.5" />;
                      })()}
                      <strong>主五行：{result.dominantElement}命</strong>
                      <button 
                        type="button"
                        onClick={() => setActiveHelp(METAPHYSICAL_HELP_DATA.dominant)}
                        className="p-0.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
                        title="點擊查看本命元神說明"
                      >
                        <Info className="w-3 h-3 stroke-[2.5px]" />
                      </button>
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full border border-gold-200 bg-gold-50/50 text-gold-700 flex items-center gap-1 font-sans">
                      <Home className="w-3.5 h-3.5" />
                      <strong>氣場身份：空間{form.identity}</strong>
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full border border-ink-100 bg-ink-50 text-ink-400 flex items-center gap-1 font-sans font-mono text-[10px]">
                      <Calendar className="w-3.5 h-3.5" />
                      {form.birthDate} {form.birthTime}
                    </span>
                  </div>

                  {/* Subtext info */}
                  <p className="text-xs text-ink-400 font-sans leading-normal">
                    您的玄學風水數據已同步對接到 Make 系統，正交由大師組進行深層流年大運、九運飛星格局核對。完整客製報告將發送至電郵：<strong className="text-gold-700 underline font-medium font-sans">{form.email}</strong>。
                  </p>
                </div>
              </div>

              {/* Delivery notification feedback banner */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 flex items-start space-x-3">
                <div className="bg-emerald-500 text-white rounded-full p-1 flex-shrink-0 mt-0.5 shadow-sm">
                  <Check className="w-4 h-4 stroke-[3px]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-emerald-800 tracking-wide font-sans">
                    萬象連結成功：數據已成功傳送至 Webhook CRM 系統
                  </h4>
                  <p className="text-xs text-emerald-700/80 leading-relaxed font-light">
                    客戶檔案編號：<span className="font-mono font-bold">TX-{Math.floor(100000 + Math.random() * 900000)}</span>，我們已通知 Make webhook {webhookStatus !== false ? "（連線通暢）" : "（已排入發送隊列）"} 接收。完整的高清晰住宅美學開運風水 pdf 報告正於天星閣後台排版。
                  </p>
                </div>
              </div>

              {/* Analysis Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Destiny Card */}
                <div className="gilded-box rounded-2xl p-6 sm:p-8 space-y-6 hover:shadow-lg transition-shadow md:col-span-2">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gold-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gold-500 font-sans text-xs border border-gold-200 px-1.5 py-0.5 rounded font-bold uppercase">1</span>
                      <h3 className="text-lg font-bold text-ink-900 tracking-wider">天命本源：命理五行天機</h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-sans text-gold-600 font-semibold">
                      <span>{getElementColorClass(result.dominantElement)?.label}</span>
                      <span className="font-mono bg-gold-50 border border-gold-100 px-2 py-0.5 rounded-md text-[11px]">
                        本命契合度：{result.dominantElement === "木" ? "92" : "85"}/100
                      </span>
                    </div>
                  </div>

                  {/* Main content: SVG + Interaction Panel */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                    
                    {/* Left/Top Column: Interactive SVG Five Elements System & Energy Bar Chart */}
                    <div className="lg:col-span-7 flex flex-col xl:flex-row items-center xl:items-stretch justify-center gap-6 bg-gold-50/5 p-5 rounded-2xl border border-[#bfa15f]/15">
                      
                      {/* Left: SVG Diagram wrapper */}
                      <div className="flex flex-col items-center space-y-4 flex-shrink-0">
                      <div className="relative w-64 h-64 bg-gold-50/20 rounded-full border border-gold-100/30 p-2 flex items-center justify-center shadow-inner">
                        {/* Interactive SVG Diagram */}
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                          <defs>
                            {/* Marker definition for Generation arrow */}
                            <marker id="arrow-gen" viewBox="0 0 10 10" refX="21" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#bfa15f" />
                            </marker>
                            {/* Marker definition for Control arrow */}
                            <marker id="arrow-ctrl" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ef4444" />
                            </marker>
                            {/* Golden Needle Gradient */}
                            <linearGradient id="gold-needle" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f4efdf" />
                              <stop offset="50%" stopColor="#bfa15f" />
                              <stop offset="100%" stopColor="#8a713b" />
                            </linearGradient>
                            {/* Golden beam pointer gradient */}
                            <linearGradient id="pointer-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                              <stop offset="0%" stopColor="#bfa15f" stopOpacity="0" />
                              <stop offset="100%" stopColor="#bfa15f" stopOpacity="0.7" />
                            </linearGradient>
                          </defs>

                          {/* Central background water mark */}
                          <text x="100" y="107" textAnchor="middle" fontSize="24" fontWeight="bold" opacity="0.04" fill="#590612" className="pointer-events-none font-serif select-none">
                            ☯
                          </text>

                          {/* Dynamic Semi-transparent Golden Compass Ring (Luo Pan Style) */}
                          <g className="animate-[spin_50s_linear_infinite]" style={{ transformOrigin: "100px 100px" }}>
                            {/* Outer gold ring circles */}
                            <circle cx="100" cy="100" r="92" fill="none" stroke="#bfa15f" strokeWidth="0.75" opacity="0.25" />
                            <circle cx="100" cy="100" r="82" fill="none" stroke="#bfa15f" strokeWidth="0.5" opacity="0.15" />
                            
                            {/* Compass ticks (every 15 degrees) */}
                            {Array.from({ length: 24 }).map((_, i) => {
                              const angle = i * 15;
                              const isMajor = angle % 45 === 0;
                              const r1 = 82;
                              const r2 = isMajor ? 92 : 86;
                              const rad = (angle * Math.PI) / 180;
                              return (
                                <line
                                  key={`tick-${i}`}
                                  x1={100 + r1 * Math.sin(rad)}
                                  y1={100 - r1 * Math.cos(rad)}
                                  x2={100 + r2 * Math.sin(rad)}
                                  y2={100 - r2 * Math.cos(rad)}
                                  stroke="#bfa15f"
                                  strokeWidth={isMajor ? "0.75" : "0.4"}
                                  opacity={isMajor ? "0.35" : "0.15"}
                                />
                              );
                            })}
                            
                            {/* Metaphysical Space Orientation labels (traditional WuXing alignments relative to this layout) */}
                            {(() => {
                              const directions = [
                                { text: "東", angle: 0 },
                                { text: "巽", angle: 45 },
                                { text: "南", angle: 90 },
                                { text: "坤", angle: 135 },
                                { text: "西", angle: 180 },
                                { text: "乾", angle: 225 },
                                { text: "北", angle: 270 },
                                { text: "艮", angle: 315 }
                              ];
                              return directions.map((dir, idx) => {
                                const rad = (dir.angle * Math.PI) / 180;
                                const rText = 76;
                                const tx = 100 + rText * Math.sin(rad);
                                const ty = 101 - rText * Math.cos(rad);
                                return (
                                  <text
                                    key={`dir-${idx}`}
                                    x={tx}
                                    y={ty}
                                    textAnchor="middle"
                                    fontSize="6"
                                    fontWeight="bold"
                                    fontFamily="serif"
                                    fill="#8a713b"
                                    opacity="0.45"
                                    transform={`rotate(${dir.angle}, ${tx}, ${ty})`}
                                  >
                                    {dir.text}
                                  </text>
                                );
                              });
                            })()}
                          </g>

                          {/* Background circular guide ring for generation */}
                          <circle cx="100" cy="100" r="56" fill="none" stroke="#f4efdf" strokeWidth="1" strokeDasharray="3 3" />

                          {/* 1. OVERCOMING / CONTROLLING CYCLE LINES (Inner star) */}
                          {(() => {
                            const controlLines = [
                              { from: "木", to: "土", x1: 100, y1: 40, x2: 135, y2: 149 },
                              { from: "土", to: "水", x1: 135, y1: 149, x2: 43, y2: 81 },
                              { from: "水", to: "火", x1: 43, y1: 81, x2: 157, y2: 81 },
                              { from: "火", to: "金", x1: 157, y1: 81, x2: 65, y2: 149 },
                              { from: "金", to: "木", x1: 65, y1: 149, x2: 100, y2: 40 }
                            ];
                            return controlLines.map((line, idx) => {
                              const fromIdx = pathNodes.indexOf(line.from);
                              const toIdx = pathNodes.indexOf(line.to);
                              const isLineActive = pathType === "control" && fromIdx !== -1 && toIdx !== -1 && toIdx === fromIdx + 1;
                              const isAnySelected = selectedElementNode !== null;
                              
                              return (
                                <line
                                  key={`ctrl-${idx}`}
                                  x1={line.x1}
                                  y1={line.y1}
                                  x2={line.x2}
                                  y2={line.y2}
                                  stroke={isLineActive ? "#ef4444" : "#fca5a5"}
                                  strokeWidth={isLineActive ? "2.2" : "0.75"}
                                  strokeDasharray={isLineActive ? undefined : "3 3"}
                                  opacity={isLineActive ? 1.0 : isAnySelected ? 0.08 : 0.25}
                                  markerEnd="url(#arrow-ctrl)"
                                  className={`transition-all duration-500 ${isLineActive ? "animate-flow-dash" : ""}`}
                                />
                              );
                            });
                          })()}

                          {/* 2. GENERATING CYCLE LINES (Outer curved arcs) */}
                          {(() => {
                            const genLines = [
                              { from: "木", to: "火", d: "M 100 40 Q 135 50 157 81" },
                              { from: "火", to: "土", d: "M 157 81 Q 160 115 135 149" },
                              { from: "土", to: "金", d: "M 135 149 Q 100 165 65 149" },
                              { from: "金", to: "水", d: "M 65 149 Q 40 115 43 81" },
                              { from: "水", to: "木", d: "M 43 81 Q 65 50 100 40" }
                            ];
                            return genLines.map((line, idx) => {
                              const fromIdx = pathNodes.indexOf(line.from);
                              const toIdx = pathNodes.indexOf(line.to);
                              const isLineActive = pathType === "generation" && fromIdx !== -1 && toIdx !== -1 && toIdx === fromIdx + 1;
                              const isAnySelected = selectedElementNode !== null;
                              
                              return (
                                <path
                                  key={`gen-${idx}`}
                                  d={line.d}
                                  fill="none"
                                  stroke={isLineActive ? "#d4af37" : "#e6dfcc"}
                                  strokeWidth={isLineActive ? "2.5" : "0.75"}
                                  strokeDasharray={isLineActive ? undefined : "2 2"}
                                  opacity={isLineActive ? 1.0 : isAnySelected ? 0.08 : 0.4}
                                  markerEnd="url(#arrow-gen)"
                                  className={`transition-all duration-500 ${isLineActive ? "animate-flow-dash" : ""}`}
                                />
                              );
                            });
                          })()}

                          {/* Interactive Golden Compass Needle pointing to chosen Element */}
                          {(() => {
                            const activeAngle = 
                              activeElement === "木" ? 0 :
                              activeElement === "火" ? 72 :
                              activeElement === "土" ? 144 :
                              activeElement === "金" ? 216 :
                              activeElement === "水" ? 288 : 0;
                              
                            return (
                              <g 
                                style={{ 
                                  transform: `rotate(${activeAngle}deg)`, 
                                  transformOrigin: "100px 100px", 
                                  transition: "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
                                }}
                              >
                                {/* Active Node Highlighting Beam */}
                                <line x1="100" y1="100" x2="100" y2="40" stroke="url(#pointer-gradient)" strokeWidth="2.5" opacity="0.6" />
                                <circle cx="100" cy="40" r="14" fill="#bfa15f" opacity="0.1" className="animate-pulse" />

                                {/* Detailed Luo Pan Pointer needle (front/pointing end) */}
                                <path 
                                  d="M 100,28 L 103,48 L 101,52 L 99,52 L 97,48 Z" 
                                  fill="url(#gold-needle)" 
                                  stroke="#8a713b" 
                                  strokeWidth="0.5"
                                />
                                <circle cx="100" cy="30" r="1.5" fill="#ef4444" />
                                
                                {/* Opposing weight end of needle */}
                                <path 
                                  d="M 100,172 L 102,152 L 98,152 Z" 
                                  fill="#e6dfcc" 
                                  stroke="#bfa15f" 
                                  strokeWidth="0.4" 
                                  opacity="0.6"
                                />
                                
                                {/* Center Pivot */}
                                <circle cx="100" cy="100" r="4.5" fill="#bfa15f" stroke="#590612" strokeWidth="1" />
                                <circle cx="100" cy="100" r="1.5" fill="#ffffff" />
                              </g>
                            );
                          })()}

                          {/* 3. ELEMENT NODES (The clickable vertices) */}
                          {(() => {
                            const nodes = [
                              { name: "木", x: 100, y: 40, color: "#10b981" },
                              { name: "火", x: 157, y: 81, color: "#ef4444" },
                              { name: "土", x: 135, y: 149, color: "#f5980b" },
                              { name: "金", x: 65, y: 149, color: "#64748b" },
                              { name: "水", x: 43, y: 81, color: "#06b6d4" }
                            ];
                            return nodes.map((node, idx) => {
                              const isSelected = activeElement === node.name;
                              const isDominant = result ? result.dominantElement === node.name : false;
                              const isRelated = pathNodes.includes(node.name);
                              const nodeOpacityClass = isRelated ? "opacity-100" : "opacity-30";
                              
                              return (
                                <g 
                                  key={`node-${idx}`} 
                                  className={`cursor-pointer select-none group transition-all duration-500 ${nodeOpacityClass}`}
                                  onClick={() => setSelectedElementNode(node.name)}
                                >
                                  {/* Glow pulse for active selection */}
                                  {isSelected && (
                                    <circle
                                      cx={node.x}
                                      cy={node.y}
                                      r="19"
                                      fill={node.color}
                                      opacity="0.25"
                                      className="animate-pulse"
                                    />
                                  )}

                                  {/* Outer Ring for Dominant Element indicator */}
                                  {isDominant && (
                                    <circle
                                      cx={node.x}
                                      cy={node.y}
                                      r={isSelected ? "16" : "15"}
                                      fill="none"
                                      stroke="#bfa15f"
                                      strokeWidth="1.5"
                                      strokeDasharray="2 1"
                                      className="animate-[spin_8s_linear_infinite]"
                                    />
                                  )}

                                  {/* Node Circle */}
                                  <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="12"
                                    fill={isSelected ? node.color : "white"}
                                    stroke={node.color}
                                    strokeWidth="2"
                                    className="transition-transform duration-300 group-hover:scale-110 shadow-sm"
                                  />

                                  {/* Inner text */}
                                  <text
                                    x={node.x}
                                    y={node.y + 3.5}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="bold"
                                    fontFamily="sans-serif"
                                    fill={isSelected ? "white" : node.color}
                                    className="font-semibold pointer-events-none"
                                  >
                                    {node.name}
                                  </text>
                                </g>
                              );
                            });
                          })()}
                        </svg>
                      </div>

                      {/* Legends */}
                      <div className="flex justify-center items-center gap-4 text-[10px] sm:text-xs font-serif font-medium text-ink-600 bg-white/50 border border-gold-100/50 px-3.5 py-1.5 rounded-full">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-0.5 bg-[#bfa15f] inline-block" />
                          <span>金黃線: 相生</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-0.5 border-t border-dashed border-[#ef4444] inline-block" />
                          <span>紅線: 相剋</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full border border-dashed border-[#bfa15f] inline-block" />
                          <span>虛環: 本命</span>
                        </span>
                      </div>
                    </div>

                    {/* Right: Dynamic Five Elements Energy Bar Chart */}
                    <div className="w-full max-w-[240px] flex flex-col justify-between bg-white/60 border border-[#bfa15f]/25 rounded-2xl p-4 shadow-sm relative overflow-hidden self-stretch min-h-[220px]">
                      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#590612] via-[#bfa15f] to-[#590612]" />
                      
                      <div className="mb-3 flex items-center justify-between border-b border-gold-100/30 pb-1.5">
                        <span className="text-[11px] font-sans font-extrabold text-[#590612] tracking-wider uppercase flex items-center gap-1">
                          <span>📊 五行能量分佈</span>
                          <button
                            type="button"
                            onClick={() => setActiveHelp(METAPHYSICAL_HELP_DATA.wuxing)}
                            className="p-0.5 rounded-full hover:bg-gold-50 text-[#590612] transition-colors cursor-pointer"
                            title="什麼是五行能量分佈？"
                          >
                            <Info className="w-3 h-3 stroke-[2.5px]" />
                          </button>
                        </span>
                        <span className="text-[9px] font-mono text-gold-700 bg-gold-50/50 border border-gold-200/40 px-1.5 py-0.5 rounded">
                          總量: 100%
                        </span>
                      </div>

                      {/* Chart Area */}
                      <div className="flex items-end justify-between h-36 px-1 pt-4">
                        {(() => {
                          const elementsData = [
                            { name: "木", score: result.elementScores.wood, color: "#10b981", bg: "bg-emerald-500", hoverBg: "bg-emerald-600" },
                            { name: "火", score: result.elementScores.fire, color: "#ef4444", bg: "bg-rose-500", hoverBg: "bg-rose-600" },
                            { name: "土", score: result.elementScores.earth, color: "#f5980b", bg: "bg-amber-500", hoverBg: "bg-amber-600" },
                            { name: "金", score: result.elementScores.metal, color: "#64748b", bg: "bg-slate-500", hoverBg: "bg-slate-600" },
                            { name: "水", score: result.elementScores.water, color: "#06b6d4", bg: "bg-cyan-500", hoverBg: "bg-cyan-600" },
                          ];

                          return elementsData.map((item) => {
                            const isSelected = activeElement === item.name;
                            const isDominant = result.dominantElement === item.name;
                            
                            return (
                              <div 
                                key={`bar-${item.name}`} 
                                className="flex flex-col items-center flex-1 group cursor-pointer h-full justify-end relative"
                                onClick={() => setSelectedElementNode(item.name)}
                              >
                                {/* Score indicator above bar */}
                                <motion.span 
                                  className={`text-[10px] font-sans font-bold mb-1.5 transition-colors duration-300 ${
                                    isSelected ? "text-[#590612]" : "text-ink-500 group-hover:text-ink-800"
                                  }`}
                                  animate={{ 
                                    scale: isSelected ? 1.15 : 1,
                                    y: isSelected ? -2 : 0
                                  }}
                                >
                                  {item.score}%
                                </motion.span>

                                {/* Bar container with full height line guide */}
                                <div className="w-6 h-24 bg-gold-50/40 rounded-t-md relative flex items-end overflow-hidden border border-gold-100/10 group-hover:bg-gold-50/80 transition-colors">
                                  <motion.div
                                    className={`w-full ${item.bg} rounded-t-md relative`}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${item.score}%` }}
                                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                                  >
                                    {/* Highlighting sheen on active/hover */}
                                    <div className="absolute inset-y-0 left-0 w-[2px] bg-white/20" />
                                    {isSelected && (
                                      <div className="absolute inset-0 bg-white/10 animate-[pulse_1.5s_infinite]" />
                                    )}
                                  </motion.div>
                                </div>

                                {/* Label and attributes below */}
                                <div className="mt-2 flex flex-col items-center gap-0.5">
                                  <span 
                                    className={`text-xs font-serif font-black rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300 ${
                                      isSelected 
                                        ? "text-white shadow-xs animate-pulse" 
                                        : "text-ink-800 group-hover:bg-gold-100/50"
                                    }`}
                                    style={{ 
                                      backgroundColor: isSelected ? item.color : 'transparent',
                                    }}
                                  >
                                    {item.name}
                                  </span>
                                  
                                  {isDominant ? (
                                    <span className="text-[8px] bg-[#bfa15f]/15 text-[#590612] font-sans px-1 py-0.1 rounded border border-[#bfa15f]/30 font-extrabold scale-90">
                                      元神
                                    </span>
                                  ) : (
                                    <span className="text-[8px] opacity-0 group-hover:opacity-60 transition-opacity font-sans scale-90 text-ink-500">
                                      五行
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                  </div>

                  {/* Right/Bottom Column: Interactive Explanation Panel */}
                  <div className="lg:col-span-5 space-y-4">
                      {(() => {
                        const details = getWuXingDetails(activeElement);
                        const relationInfo = getWuXingRelation(activeElement, result.dominantElement);
                        return (
                          <div className={`rounded-xl border p-5 space-y-3.5 transition-all duration-300 ${
                            activeElement === "木" ? "bg-emerald-50/40 border-emerald-200/50" :
                            activeElement === "火" ? "bg-rose-50/40 border-rose-200/50" :
                            activeElement === "土" ? "bg-amber-50/40 border-amber-200/50" :
                            activeElement === "金" ? "bg-slate-50/40 border-slate-200/50" : "bg-cyan-50/40 border-cyan-200/50"
                          }`}>
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-100/20 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-4 rounded-full" style={{ backgroundColor: details.color }} />
                                <h4 className="text-base font-bold text-ink-900 font-serif">
                                  {details.title}
                                </h4>
                              </div>
                              <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border bg-white/80 shadow-sm animate-pulse" style={{ color: details.color, borderColor: `${details.color}30` }}>
                                {relationInfo.relation} ({relationInfo.desc})
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="space-y-0.5 bg-white/40 border border-gold-100/10 rounded-lg p-2.5">
                                <p className="text-ink-400 font-sans text-[10px] uppercase font-semibold">居所對應方位</p>
                                <p className="font-bold text-ink-900">{details.direction}</p>
                              </div>
                              <div className="space-y-0.5 bg-white/40 border border-gold-100/10 rounded-lg p-2.5">
                                <p className="text-ink-400 font-sans text-[10px] uppercase font-semibold">五行天干屬性</p>
                                <p className="font-bold text-ink-900">{details.attributes}</p>
                              </div>
                            </div>

                            {selectedElementNode && pathNodes.length > 1 && (
                              <div className="bg-gold-100/30 border border-gold-200/40 rounded-lg p-3 space-y-1.5 animate-[fadeIn_0.5s_ease-out]">
                                <div className="text-[10px] uppercase font-sans tracking-wider text-gold-700 font-bold flex items-center gap-1.5">
                                  <span>🔮 乾坤推演 · 五行流轉路徑</span>
                                  <span className={`text-[9px] border px-1.5 py-0.2 rounded-full font-serif font-normal ${
                                    pathType === "control" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200"
                                  }`}>
                                    {pathType === "control" ? "相剋剋制流轉" : "相生循環流轉"}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-1 text-xs">
                                  {pathNodes.map((nodeName, nodeIdx) => {
                                    const colorsMap: Record<string, string> = {
                                      "木": "bg-emerald-500",
                                      "火": "bg-rose-500",
                                      "土": "bg-amber-500",
                                      "金": "bg-slate-500",
                                      "水": "bg-cyan-500"
                                    };
                                    return (
                                      <div key={nodeIdx} className="flex items-center gap-1">
                                        {nodeIdx > 0 && (
                                          <span className={`px-1 font-bold ${pathType === "control" ? "text-rose-500" : "text-gold-500"}`}>
                                            {pathType === "control" ? " ⤪ " : " ➔ "}
                                          </span>
                                        )}
                                        <span className={`px-2.5 py-0.5 rounded text-[11px] text-white font-serif font-bold ${colorsMap[nodeName] || "bg-gold-500"} shadow-xs`}>
                                          {nodeName}
                                          {nodeIdx === 0 && <span className="text-[9px] font-normal opacity-85 ml-0.5">(元神)</span>}
                                          {nodeIdx === pathNodes.length - 1 && <span className="text-[9px] font-normal opacity-85 ml-0.5">(選中)</span>}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="space-y-2 text-xs leading-relaxed text-ink-800 font-serif">
                              <p className="bg-white/60 border border-gold-100/20 rounded-lg p-3 shadow-xs">
                                <strong>💡 命理相配精解：</strong>
                                <span className="block mt-1 text-ink-700 font-light">{relationInfo.explanation}</span>
                              </p>
                              <p className="bg-white/60 border border-gold-100/20 rounded-lg p-3 shadow-xs">
                                <strong>🏡 空間開運美學建议：</strong>
                                <span className="block mt-1 text-ink-700 font-light">{details.advice}</span>
                              </p>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Prompt Guidance */}
                      <p className="text-[10px] text-center text-ink-400 italic bg-white/30 rounded py-1 border border-gold-100/5 font-serif">
                        💡 點擊五行圖中不同節點，即可啟動專屬您本命八字關係之開運天機與空間佈局
                      </p>
                    </div>

                  </div>

                  {result.yuanfenju && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
                      <div className="bg-gold-50/10 border border-gold-100/20 rounded-xl p-3 shadow-xs">
                        <span className="block text-[10px] text-ink-400 font-sans uppercase font-medium tracking-wider">農曆生日 · Lunar Birthday</span>
                        <span className="block mt-1 font-semibold text-ink-900">{result.yuanfenju.base_info?.nongli}</span>
                      </div>
                      <div className="bg-gold-50/10 border border-gold-100/20 rounded-xl p-3 shadow-xs">
                        <span className="block text-[10px] text-ink-400 font-sans uppercase font-medium tracking-wider">四柱八字 · Eight Characters</span>
                        <span className="block mt-1 font-semibold text-gold-700 font-mono tracking-wider">{result.yuanfenju.bazi_info?.bazi}</span>
                      </div>
                      <div className="bg-gold-50/10 border border-gold-100/20 rounded-xl p-3 shadow-xs">
                        <span className="block text-[10px] text-ink-400 font-sans uppercase font-medium tracking-wider">生肖屬相 · Zodiac Animal</span>
                        <span className="block mt-1 font-semibold text-ink-900">{result.yuanfenju.sx} ({result.yuanfenju.bazi_info?.na_yin || "納音"})</span>
                      </div>
                      <div className="bg-gold-50/10 border border-gold-100/20 rounded-xl p-3 shadow-xs">
                        <span className="block text-[10px] text-ink-400 font-sans uppercase font-medium tracking-wider">格局喜忌 · Destiny Type & Elements</span>
                        <span className="block mt-1 font-semibold text-ink-900">
                          {result.yuanfenju.base_info?.zhengge} · <span className="text-gold-600 font-medium">{result.yuanfenju.base_info?.wuxing_xiji}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Complete Destiny Reading */}
                  <div className="bg-gold-50/20 border border-gold-100/30 rounded-xl p-4 sm:p-5 mt-4 space-y-2">
                    <h4 className="text-xs font-bold text-gold-700 tracking-wider uppercase font-sans mb-3">
                      🔮 本命天命大解析 · Full Destiny Insight
                    </h4>
                    <MarkdownRenderer text={result.destinyReading} />
                  </div>
                </div>

                {/* 2. Space Advice Card */}
                <div className="gilded-box rounded-2xl p-6 sm:p-8 space-y-4 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-bold text-ink-900 border-b border-gold-100 pb-2.5 tracking-wider flex items-center gap-2">
                    <span className="text-gold-500 font-sans text-xs border border-gold-200 px-1.5 py-0.5 rounded font-bold uppercase">2</span>
                    <span>山水和合：空間佈局指南</span>
                  </h3>
                  <div className="text-xs font-sans text-gold-600 uppercase tracking-widest font-semibold">
                    空間身份特別契合建議 — 尊貴【{form.identity}】
                  </div>
                  <p className="text-sm text-ink-400 leading-relaxed font-light text-justify">
                    {result.spaceAdvice}
                  </p>
                </div>

                {/* 3. Address Aura Card */}
                <div className="gilded-box rounded-2xl p-6 sm:p-8 space-y-4 hover:shadow-lg transition-shadow md:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold-100 pb-2.5">
                    <h3 className="text-lg font-bold text-ink-900 tracking-wider flex items-center gap-2">
                      <span className="text-gold-500 font-sans text-xs border border-gold-200 px-1.5 py-0.5 rounded font-bold uppercase">3</span>
                      <span>地靈氣場：居所能量點評</span>
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gold-600 font-sans">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate max-w-xs">{form.address}</span>
                    </div>
                  </div>
                  <p className="text-sm text-ink-400 leading-relaxed font-light">
                    {result.addressAura}
                  </p>
                </div>
              </div>

              {/* 🧧 中聯天星 · 大師親批開運尊享專區 (Global Conversion Panel) */}
              <div id="master_conversion_panel" className="bg-gradient-to-br from-[#3b020a] via-[#590612] to-[#1f0104] border-2 border-[#bfa15f] p-6 sm:p-8 rounded-2xl text-white shadow-xl relative overflow-hidden my-8">
                {/* Royal decorative watermark */}
                <div className="absolute right-[-10px] top-[-10px] text-white/5 text-8xl font-black font-serif select-none pointer-events-none">
                  ☯
                </div>
                
                <div className="text-center space-y-2 border-b border-[#bfa15f]/30 pb-4 mb-6">
                  <span className="text-[10px] tracking-widest font-sans font-extrabold text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full uppercase inline-block">
                    🧧 實體地舖誠信保證 · 大師親批助您開運起航
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-yellow-100 font-serif tracking-wide mt-2">
                    中聯天星閣 · 專屬大師親算預約特惠
                  </h3>
                  <p className="text-xs text-zinc-300 font-serif max-w-lg mx-auto leading-relaxed italic">
                    「命定乾坤，運隨步轉。免費測算僅現梗概，大師親算方得圓滿。」
                  </p>
                </div>

                <div className="max-w-2xl mx-auto text-center space-y-6 pt-2 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 font-serif">
                      <span className="text-[10px] text-yellow-300 font-sans font-bold bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">大師精批八字</span>
                      <h4 className="text-sm font-bold text-yellow-100 mt-2">林大師親批：個人八字全盤深度精批</h4>
                      <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                        深入剖析整整 <strong>60 年大運與流年吉凶</strong>，針對事業、姻緣、財庫漏財進行點對點開運加持。
                      </p>
                      <div className="mt-3 text-xs text-yellow-400 font-bold font-sans">
                        限時 3 折特惠：<span className="text-lg font-black ml-1">HK$1,440</span>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 font-serif">
                      <span className="text-[10px] text-emerald-300 font-sans font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">現場風水實勘</span>
                      <h4 className="text-sm font-bold text-yellow-100 mt-2">家居風水現場羅盤磁場實勘佈局</h4>
                      <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                        大師攜羅盤親自登門！根據精確坐向與九宮飛星佈設催財旺財、安居避邪之九紫生氣大陣。
                      </p>
                      <div className="mt-3 text-xs text-yellow-400 font-bold font-sans">
                        限時 3 折特惠：<span className="text-lg font-black ml-1">HK$2,760</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("payment_and_subscription_section");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth", block: "start" });
                          triggerBlessing("🔮 已為您導航至下方大師親批與訂閱專區，請領受您的專屬法印與海報！");
                        }
                      }}
                      className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-500 text-[#590612] font-black text-xs tracking-wider rounded-xl shadow-[0_5px_25px_rgba(254,221,0,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mx-auto cursor-pointer border-2 border-yellow-300/30"
                    >
                      <span>💳 立即預約大師親批 / 訂閱開運方案</span>
                      <ChevronRight className="w-4 h-4 animate-bounce" />
                    </button>
                    <p className="text-[10px] text-zinc-400 font-serif mt-2.5">
                      🧧 青衣實體地舖承信保證，Stripe 3D 安全付款，隨時可一鍵取消訂閱。
                    </p>
                  </div>
                </div>
              </div>

              {/* 🧭 中聯天星天書 · 家居與命理開運全書 (Richer content added here) */}
              <div className="gilded-box rounded-2xl p-6 sm:p-8 space-y-6 bg-gradient-to-b from-[#fbfaf7] via-white to-[#fbfaf7] shadow-md border border-[#bfa15f]/40 relative overflow-hidden">
                <div className="absolute right-3 top-3 text-[#590612]/5 text-6xl font-black pointer-events-none select-none">📜</div>
                
                <div className="border-b border-[#bfa15f]/20 pb-4">
                  <span className="text-[10px] tracking-widest font-sans font-extrabold text-[#590612] uppercase bg-[#590612]/5 border border-[#590612]/15 px-3 py-1 rounded-full">
                    👑 尊享大師級深度解碼 · Premium Metaphysical Scroll
                  </span>
                  <h3 className="text-xl font-black text-[#590612] tracking-wider font-serif mt-2 flex items-center gap-2">
                    <span>📜 中聯天星寶鑑：天命空間深度合參報告書</span>
                  </h3>
                  <p className="text-xs text-ink-400 font-sans mt-1 leading-relaxed">
                    本篇寶鑑結合大師青衣閣秘傳，就您的本命【{result.dominantElement}】命局與居住地址，在下元九運之氣中展開四重精妙拆解。請切換下方簡笈章節閱讀：
                  </p>
                </div>

                {/* Tabs selection */}
                <div className="flex flex-wrap gap-2 border-b border-[#bfa15f]/10 pb-3">
                  {[
                    { id: "stars", label: "🔮 居室九宮飛星旺局", desc: "Space & Stars Grid" },
                    { id: "fortune", label: "📊 流月大運氣數圖", desc: "12-Month Fortune" },
                    { id: "iching", label: "☯️ 本命卦氣與董公擇日", desc: "I Ching & Auspicious" },
                    { id: "certificate", label: "📜 閣下專屬天命法印證書", desc: "Official Scroll" }
                  ].map((tab) => {
                    const isActive = reportTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setReportTab(tab.id as any);
                          triggerBlessing(`📖 翻閱寶鑑：已為您開啟『${tab.label.split(" ")[1]}』章節...`);
                        }}
                        className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-left border transition-all duration-300 ${
                          isActive
                            ? "bg-[#590612] text-white border-[#590612] shadow-md scale-[1.01]"
                            : "bg-white text-ink-900 border-gold-200/50 hover:bg-gold-50/50 hover:border-gold-300"
                        }`}
                      >
                        <p className="text-xs font-bold leading-none">{tab.label}</p>
                        <p className={`text-[9px] font-sans mt-1 ${isActive ? "text-gold-200" : "text-ink-400"}`}>{tab.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Content rendering according to tab */}
                <div className="pt-2">
                  {reportTab === "stars" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="bg-gold-50/20 border border-gold-100 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
                        <div className="space-y-1 text-center md:text-left">
                          <h4 className="text-sm font-bold text-ink-900 font-serif flex items-center gap-1.5">
                            <span>🌌 九宮氣流定乾坤 · 飛星得位指針</span>
                            <button
                              type="button"
                              onClick={() => setActiveHelp(METAPHYSICAL_HELP_DATA.luoshu)}
                              className="p-0.5 rounded-full hover:bg-gold-50 text-[#590612] transition-colors cursor-pointer"
                              title="點擊了解九宮洛書與流年飛星"
                            >
                              <Info className="w-3.5 h-3.5 stroke-[2.5px]" />
                            </button>
                          </h4>
                          <p className="text-[11px] text-ink-400 font-sans">
                            林大師根據您主命【{result.dominantElement}】局，特撰九宮吉凶方位配置與家居各房開運擺佈：
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-gold-700 border border-gold-200 bg-gold-50 px-2.5 py-1 rounded">
                          九宮洛書：南面居上，北面居下
                        </span>
                      </div>

                      {/* Interactive grid representation of Luo Shu / Nine Stars */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                        
                        {/* Left: Luo Shu 3x3 layout */}
                        <div className="md:col-span-5 flex flex-col items-center justify-center bg-gold-50/5 border border-gold-200/30 rounded-2xl p-5 relative overflow-hidden">
                          <div className="text-[10px] text-gold-700 tracking-wider font-sans mb-3 font-semibold">南 (朱雀)</div>
                          
                          <div className="grid grid-cols-3 gap-2 w-full max-w-[240px]">
                            {[
                              { 
                                pos: "巽 (東南)", 
                                star: "四綠 · 文昌", 
                                aura: "吉", 
                                detail: "利讀書考功名", 
                                color: "border-emerald-200 bg-emerald-50/30 text-emerald-800",
                                element: "木 (Wood)",
                                period9Impact: "四綠文昌木星在下元九運（2024-2043）中屬退氣之星，但其執掌文思、科甲學業、文書合約的本質不變。若佈置得宜、得水相生，仍能大幅提振家中學子與職場人士的考運與決策思維。",
                                cures: [
                                  "擺放 4 支玻璃花瓶盛水的富貴竹，大旺文昌智慧與功名運氣。",
                                  "在書桌或本方位擺放一座綠水晶或黃銅「九層文昌塔」，凝聚專注磁場。",
                                  "避免在此處放置剪刀、刀具或大件金屬製品，防止「金克木」折損運勢。",
                                  "常點一盞暖色調檯燈，以「木生火」活化思維，提升考運與文書合約順遂度。"
                                ],
                                mantra: "一四同宮，科甲聯登，文昌大開，仕途亨通"
                              },
                              { 
                                pos: "離 (正南)", 
                                star: "九紫 · 喜慶", 
                                aura: "大吉", 
                                detail: "流年當旺財位", 
                                color: "border-rose-200 bg-rose-50/30 text-rose-800",
                                element: "火 (Fire)",
                                period9Impact: "下元九運（2024-2043）正值離火運，九紫右弼星為當令「第一當帝吉星」，主管極盛財富、喜慶婚姻、創業、添丁與功名，也是力量最強的生旺財位！",
                                cures: [
                                  "此處乃九運第一大黃金財位，極宜擺放常綠闊葉盆栽（如萬年青、發財樹）以木生火。",
                                  "在此方位擺放紅色、紫色水晶球、紅色陶瓷或懸掛大紅中國結，大引紫氣東來。",
                                  "可安置暖色長明燈，或將客廳主力沙發、辦公桌安放於此，日夜吸納當旺財氣。",
                                  "切忌堆放破爛雜物或垃圾桶，以免帝星受污、反招致眼疾、心腦血管隱患。"
                                ],
                                mantra: "九紫右弼，當令帝星，紫氣東來，萬事亨通"
                              },
                              { 
                                pos: "坤 (西南)", 
                                star: "二黑 · 病符", 
                                aura: "凶", 
                                detail: "宜放銅錢化泄", 
                                color: "border-amber-200 bg-amber-50/30 text-amber-800",
                                element: "土 (Earth)",
                                period9Impact: "二黑巨門星為九運退氣病符星，專管疾病、慢性病、脾胃、腹部不適與負面沉悶磁場。西南坤宮屬土，雙土重疊，極易激發凶星病氣。",
                                cures: [
                                  "在此方位擺放或懸掛「開光天然黃銅葫蘆」或「六帝古錢」，以金洩土煞病氣。",
                                  "嚴禁放置任何紅色、粉色或紫色裝飾或地毯（火生土會瘋狂助長病符星凶焰）。",
                                  "移走此方位的高頻震動電器（如電視機、大音響、大風扇等），常保安靜。",
                                  "保持此區乾燥通風與靜止，切忌大面積裝修、打孔、動土，以防病煞爆發。"
                                ],
                                mantra: "二黑巨門，病符退避，銅葫化煞，百病不侵"
                              },
                              { 
                                pos: "震 (正東)", 
                                star: "三碧 · 爭鬥", 
                                aura: "次吉", 
                                detail: "宜用火通關化解", 
                                color: "border-teal-200 bg-teal-50/30 text-teal-800",
                                element: "木 (Wood)",
                                period9Impact: "三碧祿存星主爭鬥、口舌、是非官非、小人作祟與神經衰弱。正東震宮屬木，木木相助，使其暴戾鬥毆氣場更重，極易招惹無端爭端。",
                                cures: [
                                  "在正東方鋪設「紅色地毯」、懸掛「紅色中國結」或貼紅對聯，以火洩去暴戾木氣。",
                                  "絕對不可擺放高大綠色盆栽、魚缸或水培植物，防止「水生木」及木木相助激發煞氣。",
                                  "可在此位放置一盞暖色小夜燈常亮不熄，以光明之火化解陰沉爭鬥小人。",
                                  "避免在此方位堆放廢舊紙箱、枯萎植物或尖銳鐵器，常保整潔通風。"
                                ],
                                mantra: "三碧祿存，離火通關，口舌消散，和氣致祥"
                              },
                              { 
                                pos: "中宮 (中央)", 
                                star: "五黃 · 廉貞", 
                                aura: "大凶", 
                                detail: "避動土忌紅色", 
                                color: "border-gold-300 bg-gold-50/30 text-gold-800",
                                element: "土 (Earth)",
                                period9Impact: "五黃廉貞星乃九星中破壞力最強、怨氣最重之流年大凶星，俗稱「戊己大煞」，主凶災意外、突發重病、破財及家運敗落，入中宮主全屋磁場大動。",
                                cures: [
                                  "在房屋中央擺放一樽「安忍水」（玻璃瓶裝粗鹽、水並放六枚銅錢），以金水化五黃極土。",
                                  "或者擺放重型黃銅大麒麟或大銅鈴，利用強烈金氣洩去五黃大煞的劇烈土性。",
                                  "中宮區域絕對不宜裝修敲打、動土、鑽孔，更不可擺放盆栽（木克土易激發土煞怒氣）。",
                                  "嚴禁在中宮區域擺放紅色、黃色地毯、大紅燈籠，保持此位完全靜止、平穩。"
                                ],
                                mantra: "五黃廉貞，戊己消融，安忍化煞，家宅平安"
                              },
                              { 
                                pos: "兌 (正西)", 
                                star: "七赤 · 破軍", 
                                aura: "平", 
                                detail: "防口舌與失物", 
                                color: "border-slate-200 bg-slate-50/30 text-slate-800",
                                element: "金 (Metal)",
                                period9Impact: "七赤破軍星在九運為退氣煞星，主口舌是非、小人陷害、失物被盜、呼吸道疾病及血光刀刃之傷。正西兌宮屬金，金金比劫，易起紛爭。",
                                cures: [
                                  "在此方位擺放一盆「靜止清水」（即不可帶水泵流動的水），以水洩金氣，防盜化煞。",
                                  "移走此方位的所有尖銳金屬、剪刀、折疊刀，防止意外金刃外傷與肢體破損。",
                                  "不宜大面積擺放白色、銀色金屬裝裝，可擺放藍色陶瓷花瓶或黑曜石，使金生水、水洩金。",
                                  "日常務必鎖好正西方的門窗防範破軍星引動的盜賊劫財、金錢損失。"
                                ],
                                mantra: "七赤破軍，靜水洩金，是非消弭，財富安守"
                              },
                              { 
                                pos: "艮 (東北)", 
                                star: "六白 · 武曲", 
                                aura: "吉", 
                                detail: "利偏財與驛馬", 
                                color: "border-indigo-200 bg-indigo-50/30 text-indigo-800",
                                element: "金 (Metal)",
                                period9Impact: "六白武曲星為偏財吉星，主貴人提攜、偏財橫財、遠行驛馬、以及武職技術管理人員的升遷。東北艮宮屬土，土生金，吉氣相助、大旺偏財！",
                                cures: [
                                  "擺放「黃水晶七星陣」、「黃石聚寶盆」或玉石擺件，以艮土生六白金，催大財源。",
                                  "若求外地發展、出差公幹、移民出國，可在此位放一尊純銅金屬「奔馬」，馬頭朝外。",
                                  "可懸掛金屬風鈴、金屬製吉祥物，引動六白偏財武職神力，大得貴人垂青。",
                                  "保持東北方光線充足，避免堆放陰暗雜物及污水盆，以免貴人遠離、事業受壓。"
                                ],
                                mantra: "六白武曲，土金相生，偏財大招，貴人引路"
                              },
                              { 
                                pos: "坎 (正北)", 
                                star: "八白 · 左輔", 
                                aura: "次吉", 
                                detail: "小財星有利吉事", 
                                color: "border-cyan-200 bg-cyan-50/30 text-cyan-800",
                                element: "土 (Earth)",
                                period9Impact: "八白左輔星為正財星，主穩健工作收入、置業購屋、田產。九運雖屬退氣，但仍屬三大吉星之一，正北坎宮屬水，土水交感宜以火通關引財。",
                                cures: [
                                  "在此方位擺放「紅色或金黃色桌墊」或「陶瓷聚寶盆」，以火生土、土生財，穩固財源。",
                                  "保持正北方溫暖明亮，可安置一盞常亮暖黃色落地燈，溫暖整片北方水氣。",
                                  "避免在此位擺放流動水景或大魚缸，防止水過旺克制八白土，導致財來財去守不住。",
                                  "切忌在此處堆積陰濕污穢物，否則極易導致家人脾胃與泌尿系統小隱疾。"
                                ],
                                mantra: "八白左輔，火土相生，財庫盈滿，正財大吉"
                              },
                              { 
                                pos: "乾 (西北)", 
                                star: "一白 · 貪狼", 
                                aura: "吉", 
                                detail: "利人緣桃花", 
                                color: "border-purple-200 bg-purple-50/30 text-purple-800",
                                element: "水 (Water)",
                                period9Impact: "一白貪狼星為大吉星，主掌人緣、貴人、桃花、智慧學識與遠行運。西北乾宮五行屬金，金生水旺，生氣澎湃，是催旺姻緣與人際極佳方位。",
                                cures: [
                                  "擺放「靜止清水杯」或在白瓷碗中裝清水，配以六枚銅錢，以金生水，廣結善緣。",
                                  "單身者可在此方位擺放盛裝粉晶的粉色花瓶，內插粉色百合鮮花，大催正緣桃花。",
                                  "若有談判、公關、業務需求，可在此位擺放金屬如意、純銅麒麟，大招事業貴人。",
                                  "保持西北方極致明亮通風、一塵不染，切勿堆積鞋子或臭襪，否則桃花易變爛桃花。"
                                ],
                                mantra: "一白貪狼，金水多情，貴人輔弼，桃花喜迎"
                              }
                            ].map((grid, idx) => {
                              return (
                                <div 
                                  key={idx} 
                                  className={`border rounded-lg p-2 flex flex-col items-center justify-between text-center min-h-[68px] cursor-pointer hover:shadow-md hover:scale-[1.03] transition-all duration-300 ${grid.color} relative group`}
                                  onClick={() => {
                                    setSelectedStar(grid);
                                    triggerBlessing(`🔮 【${grid.pos}】九宮星曜：大師為您拉起下元九運專屬「化煞催旺」之羅盤詳解與佈局窗口！`);
                                  }}
                                  title="點擊查看九運化煞催旺詳解"
                                >
                                  {/* Floating tiny query icon in cell */}
                                  <span className="absolute top-1 right-1 opacity-40 group-hover:opacity-100 text-[8px] transition-opacity bg-white/95 text-ink-900 shadow-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                    🧭
                                  </span>
                                  <span className="text-[8px] font-sans opacity-70 block leading-none">{grid.pos}</span>
                                  <span className="text-[10px] font-serif font-black tracking-wide my-1 block leading-tight">{grid.star.split(" · ")[0]}</span>
                                  <span className="text-[8px] font-sans font-bold bg-white/60 px-1 py-0.2 rounded scale-90">{grid.aura}</span>
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="text-[10px] text-gold-700 tracking-wider font-sans mt-3 font-semibold">北 (玄武)</div>
                          <p className="text-[9px] text-ink-400 text-center font-sans mt-2 italic">
                            💡 提示：點選九宮格不同方位，即可獲取該流年飛星的密咒與詳細術語解析。
                          </p>
                        </div>

                        {/* Right: Detailed Room-by-Room Recommendations */}
                        <div className="md:col-span-7 space-y-3 font-serif">
                          {[
                            {
                              room: "🚪 玄關與明堂 (The Main Entrance Aura)",
                              desc: "玄關為全屋『納氣之口』。您的【" + result.dominantElement + "】局極其忌諱門口堆積雜物妨礙氣流。建議置辦一塊深咖啡色或墨綠色防滑門墊，並在玄關設置長明暖燈，可起『藏風聚氣、納引福星』之絕妙功效。"
                            },
                            {
                              room: "🛋️ 尊貴客廳財位 (The Wealth Gathering Living Room)",
                              desc: "客廳中宮與角落為『靜氣聚氣位』。在此處不宜擺放魚缸或高頻振動之電器，以免震散財氣。大師推演屋主契合擺件為：置一尊『天然黃水晶招財樹』或『青釉雙耳瓷器瓶』，能深層穩固全宅的偏財氣脈。"
                            },
                            {
                              room: "🛏️ 主臥室與靠山 (The Sanctuary Bedroom & Headboard)",
                              desc: "臥室掌管人丁健康與夫妻和睦。床頭務必『有靠』（緊貼實牆），不可朝向窗戶或懸空。枕頭套件建議常備【" + result.auspiciousColors[0] + "】或【" + (result.auspiciousColors[1] || "鵝黃") + "】色，能在睡眠之際靜心修復磁場，強固元神。"
                            },
                            {
                              room: "🍳 廚房灶位安康 (The Hearth Fire Harmony)",
                              desc: "灶位為一家衣食生源，代表女主人的健康與全家財富庫。灶台不可與水龍頭正對（水火相克），中間可用一盆小水培植物進行『木能通關』調和。灶台四周應常保一塵不染，能極大聚斂家宅財庫底氣。"
                            }
                          ].map((item, idx) => (
                            <div key={idx} className="bg-white/80 border border-gold-100 rounded-xl p-3.5 space-y-1 shadow-xs hover:border-gold-300 hover:bg-white transition-colors">
                              <h5 className="text-xs font-bold text-[#590612] flex items-center gap-1.5">
                                <span className="w-1.5 h-3 bg-[#bfa15f] inline-block rounded-full" />
                                <span>{item.room}</span>
                              </h5>
                              <p className="text-xs leading-relaxed text-ink-400 font-light">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 🧭 互動式五行家居佈局與風水陣法導航 */}
                      <div className="border-t border-[#bfa15f]/25 pt-6 mt-6">
                        <div className="bg-gradient-to-r from-[#590612]/5 via-[#bfa15f]/15 to-[#590612]/5 border border-[#bfa15f]/30 rounded-xl p-4 mb-6">
                          <h4 className="text-sm font-bold text-[#590612] font-serif flex items-center gap-1.5">
                            <span className="text-base">🧭</span>
                            <span>互動式五行家居佈局與風水陣法導航</span>
                          </h4>
                          <p className="text-[11px] text-zinc-500 font-serif mt-1">
                            林大師特別設置的互動式多空間風水佈局導航。請點選下方不同的「住宅空間分區（客廳、臥室、書房、玄關）」，並點擊圖中閃爍的黃金福位，即可為您解密該方位的九運催財旺丁、避邪化煞之空間風水奧秘與佈置陣法。
                          </p>
                        </div>
                        <FengShuiNavigator onTriggerBlessing={triggerBlessing} />
                      </div>
                    </motion.div>
                  )}

                  {reportTab === "fortune" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="bg-gold-50/20 border border-gold-100 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
                        <div className="space-y-1 text-center md:text-left">
                          <h4 className="text-sm font-bold text-ink-900 font-serif flex items-center gap-1.5">
                            <span>📈 十二流月氣數流轉圖 · 運勢吉凶起伏儀</span>
                            <button
                              type="button"
                              onClick={() => setActiveHelp(METAPHYSICAL_HELP_DATA.fortune)}
                              className="p-0.5 rounded-full hover:bg-gold-50 text-[#590612] transition-colors cursor-pointer"
                              title="點擊了解何為流月氣數"
                            >
                              <Info className="w-3.5 h-3.5 stroke-[2.5px]" />
                            </button>
                          </h4>
                          <p className="text-[11px] text-ink-400 font-sans">
                            大數據結合林大師易理推算，呈現您今明兩年流月運氣曲線：
                          </p>
                        </div>
                        <span className="text-[10px] font-sans font-bold bg-[#590612]/5 text-[#590612] px-2 py-0.5 rounded border border-[#590612]/10">
                          本命強運期：仲春、深秋
                        </span>
                      </div>

                      {/* Line Chart Visual Representation */}
                      <div className="bg-white border border-gold-200/50 rounded-2xl p-5 shadow-inner">
                        <div className="h-44 w-full flex items-end justify-between px-2 pt-6 relative border-b border-gold-100 pb-1">
                          
                          {/* Y Axis Guides */}
                          <div className="absolute left-0 right-0 top-6 border-t border-dashed border-gold-100/40 text-[8px] font-mono text-ink-300 select-none pointer-events-none">極盛 (大展拳腳)</div>
                          <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-gold-100/40 text-[8px] font-mono text-ink-300 select-none pointer-events-none">平穩 (守成安康)</div>
                          <div className="absolute left-0 right-0 bottom-6 border-t border-dashed border-gold-100/40 text-[8px] font-mono text-ink-300 select-none pointer-events-none">收斂 (宜靜忌動)</div>

                          {/* Chart Bars/Points representing months */}
                          {(() => {
                            // Monthly fortune scores based on dominant element
                            const baseScores = 
                              result.dominantElement === "木" ? [60, 85, 90, 75, 55, 45, 50, 65, 80, 75, 70, 60] :
                              result.dominantElement === "火" ? [45, 60, 75, 90, 85, 65, 50, 45, 60, 75, 70, 55] :
                              result.dominantElement === "土" ? [50, 55, 65, 75, 85, 90, 80, 60, 55, 65, 75, 60] :
                              result.dominantElement === "金" ? [70, 60, 50, 45, 55, 70, 85, 90, 75, 65, 60, 65] : [80, 75, 60, 50, 40, 55, 65, 70, 85, 90, 80, 75];

                            const months = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一", "臘月"];
                            return baseScores.map((score, idx) => {
                              const heightPercentage = `${score}%`;
                              const isPeak = score >= 85;
                              const isLow = score <= 50;

                              return (
                                <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end relative group cursor-pointer" onClick={() => triggerBlessing(`🔮 【${months[idx]}運勢】：得分 ${score}/100。${isPeak ? "當月紫氣東來，喜星拱照，最適宜投資大動、喬遷安居！" : isLow ? "當月磁場偏弱，宜守不宜攻，出行多加小心，居家可擺放水晶穩固氣場。" : "運勢平穩順遂，工作按部就班即可，家庭溫馨吉祥。"}`)}>
                                  {/* Tooltip on hover */}
                                  <div className="absolute bottom-[105%] bg-ink-900 text-white rounded px-1.5 py-0.5 text-[8px] font-sans opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-20">
                                    {score}分
                                  </div>

                                  {/* Bar line */}
                                  <div className="w-[4px] sm:w-[6px] bg-gold-100 rounded-full h-full relative flex items-end">
                                    <motion.div 
                                      className={`w-full rounded-full transition-all duration-300 ${isPeak ? "bg-[#590612]" : isLow ? "bg-amber-400" : "bg-[#bfa15f]"}`}
                                      initial={{ height: 0 }}
                                      animate={{ height: heightPercentage }}
                                    />
                                    {isPeak && (
                                      <div className="absolute top-0 left-[-3px] w-2.5 h-2.5 bg-[#590612] rounded-full ring-2 ring-white border border-[#bfa15f] animate-ping" />
                                    )}
                                  </div>

                                  <span className="text-[8px] sm:text-[9px] font-serif text-ink-400 mt-2 block leading-none">{months[idx]}</span>
                                </div>
                              );
                            });
                          })()}
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-ink-400 font-sans mt-3 px-1">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#590612] inline-block" /> 強旺之吉月</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#bfa15f] inline-block" /> 平穩守盛月</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> 閉關養精月</span>
                        </div>
                      </div>

                      {/* Textual summary */}
                      <div className="bg-gold-50/15 border border-gold-200/40 rounded-xl p-4 space-y-2.5 font-serif text-xs leading-relaxed text-ink-900">
                        <p>
                          <strong>💡 大師流月推敲要旨：</strong>
                          您的主命氣場在<strong>仲春（農曆二、三月）</strong>與<strong>深秋（農曆九、十月）</strong>受生助最深，大運逢日祿與貴人照命，凡有重要商務談判、大筆資產購置、或房屋動土裝修，大師首推於此等月份大膽執行，最能藉勢起運。
                        </p>
                        <p className="border-t border-gold-100/40 pt-2.5">
                          <strong>⚠️ 運勢微調化泄關卡：</strong>
                          在<strong>仲夏（農曆五、六月）</strong>前後，天干受離火合絆，恐有財來財去之虞。居家或工作方位在此段時間宜保持完全安靜，避免挪移大件家具；同時在書房或辦公桌置一盆乾淨的清水，能極佳調侯降燥、穩度關卡。
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {reportTab === "iching" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* I Ching Trigram calculations */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#bfa15f]/30 rounded-2xl bg-[#590612]/3 relative overflow-hidden">
                          <div className="absolute -left-4 -top-4 text-ink-100 text-6xl font-black opacity-30 select-none font-serif">☯</div>
                          
                          <span className="text-[10px] font-sans font-bold text-gold-700 uppercase tracking-widest flex items-center gap-1 mb-1 justify-center">
                            <span>易經卦氣合參</span>
                            <button
                              type="button"
                              onClick={() => setActiveHelp(METAPHYSICAL_HELP_DATA.iching)}
                              className="p-0.5 rounded-full hover:bg-gold-50 text-[#590612] transition-colors cursor-pointer"
                              title="了解易經卦氣"
                            >
                              <Info className="w-3 h-3 stroke-[2.5px]" />
                            </button>
                          </span>
                          <div className="text-sm font-serif font-black text-[#590612] tracking-wider">
                            {(() => {
                              const hash = form.name.length + form.address.length + parseInt(form.birthHour);
                              const hexagrams = [
                                { name: "地天泰卦", desc: "坤地在上，乾天在下。天地交感，萬物通泰，安居極吉之象。" },
                                { name: "風水渙卦", desc: "巽風在上，坎水在下。風行水上，渙然冰釋，消災去難之象。" },
                                { name: "山澤損卦", desc: "艮山在上，兌澤在下。損下益上，修身積德，靜待開花之象。" },
                                { name: "火地晉卦", desc: "離火在上，坤地在下。日出地上，運勢昭昭，仕途高昇之象。" },
                                { name: "水天需卦", desc: "坎水在上，乾天在下。雲行於天，密雲不雨，靜待良時之象。" }
                              ];
                              const chosen = hexagrams[hash % hexagrams.length];
                              return (
                                <>
                                  <span className="text-3xl font-black block my-1 font-serif text-[#590612]">{chosen.name}</span>
                                  <p className="text-xs text-ink-400 font-sans mt-2 leading-relaxed px-4 font-normal">{chosen.desc}</p>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        <div className="md:col-span-7 space-y-4">
                          <h4 className="text-sm font-bold text-ink-900 border-b border-gold-100 pb-2 flex items-center justify-between gap-1.5 font-serif">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-[#590612]" />
                              <span>董公烏兔擇日秘術 · 近期開運吉日</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setActiveHelp(METAPHYSICAL_HELP_DATA.iching)}
                              className="p-0.5 rounded-full hover:bg-gold-50 text-[#590612] transition-colors cursor-pointer"
                              title="點擊了解董公擇日"
                            >
                              <Info className="w-3.5 h-3.5 stroke-[2.5px]" />
                            </button>
                          </h4>
                          <p className="text-xs text-ink-400 font-sans leading-relaxed">
                            大師特別運用清代董公烏兔擇日神數，配合屋主生肖喜用，為您挑選未來 30 日內最合本命磁場之開運良辰：
                          </p>

                          <div className="space-y-2.5 font-serif">
                            {[
                              { date: "大吉 · 搬遷入宅吉日", detail: "配合太陽吉星，利於搬移大件、開光安置風水擺件、迎納祥氣入室。", time: "巳時 (09:00 - 11:00) 最佳", value: 12 },
                              { date: "次吉 · 淨宅安神吉日", detail: "天德合吉星高照，宜在當日徹底清掃玄關、廚房，點燃沉香調和全屋氣場。", time: "午時 (11:00 - 13:00) 最佳", value: 21 },
                              { date: "次吉 · 納財動土擇日", detail: "太陰福星得位，利於合夥商務簽約、開始裝修動土或購買大件開運軟裝。", time: "辰時 (07:00 - 09:00) 最佳", value: 29 }
                            ].map((item, idx) => {
                              // Generate precise offset dates
                              const targetDate = new Date();
                              targetDate.setDate(targetDate.getDate() + item.value);
                              const dateStr = targetDate.toLocaleDateString("zh-HK", { month: 'long', day: 'numeric' }) + " (星期" + ["日", "一", "二", "三", "四", "五", "六"][targetDate.getDay()] + ")";
                              
                              return (
                                <div key={idx} className="bg-gold-50/30 border border-gold-200/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] bg-[#590612] text-white font-sans px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                                        {item.date.split(" · ")[0]}
                                      </span>
                                      <span className="text-xs font-black text-ink-900">{item.date.split(" · ")[1]}</span>
                                    </div>
                                    <p className="text-[11px] text-ink-400 font-light">{item.detail}</p>
                                  </div>
                                  <div className="text-right sm:border-l border-gold-200/60 sm:pl-4 flex-shrink-0">
                                    <p className="text-xs font-bold text-[#590612]">{dateStr}</p>
                                    <p className="text-[10px] text-gold-700 font-sans mt-0.5">{item.time}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {reportTab === "certificate" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      {/* Premium Aura Certificate Card (Imperial Style) */}
                      <div className="border-4 border-double border-[#bfa15f] rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-[#fdfbf7] via-white to-[#fdfbf7] shadow-xl relative overflow-hidden text-center space-y-6 max-w-xl mx-auto" id="printable_certificate">
                        
                        {/* Decorative corner borders */}
                        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#bfa15f]/80" />
                        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#bfa15f]/80" />
                        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#bfa15f]/80" />
                        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#bfa15f]/80" />
                        
                        {/* Background water mark seal */}
                        <div className="absolute inset-0 m-auto w-48 h-48 rounded-full border border-red-500/10 flex items-center justify-center opacity-10 select-none pointer-events-none font-serif text-[120px] text-red-600 font-black">
                          印
                        </div>

                        {/* Certificate Header */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-gold-700 tracking-[0.2em] font-extrabold uppercase">CHUNG LUEN METAPHYSICAL AURA SCROLL</span>
                          <h4 className="text-xl font-black text-[#590612] tracking-widest font-serif flex items-center justify-center gap-1.5">
                            <span>👑 天星閣 · 先天本命開運靈氣簡笈</span>
                            <button
                              type="button"
                              onClick={() => setActiveHelp(METAPHYSICAL_HELP_DATA.certificate)}
                              className="p-0.5 rounded-full hover:bg-gold-50 text-[#590612] transition-colors cursor-pointer"
                              title="點擊了解證書背後寓意"
                            >
                              <Info className="w-4 h-4 stroke-[2.5px]" />
                            </button>
                          </h4>
                          <div className="w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#bfa15f] to-transparent mx-auto mt-2" />
                        </div>

                        {/* Certificate Main Text */}
                        <div className="space-y-3 font-serif text-xs leading-relaxed text-ink-900 px-2 sm:px-6">
                          <p className="text-left font-light indent-6">
                            粵稽太極肇興，兩儀運化。茲推得大會屋主 <strong className="text-sm font-black text-[#590612] border-b border-[#bfa15f] px-1">{form.name}</strong> 閣下（陰陽乾坤屬：<strong className="font-bold">{form.gender}</strong>），降生於西曆 <strong className="font-mono font-bold">{form.birthDate}</strong>，生辰得時得地。
                          </p>
                          <p className="text-left font-light indent-6">
                            經羅盤精準推測與天星合參，閣下本命元神歸於【<strong className="text-sm font-black text-[#590612]">{result.dominantElement}</strong>】。其五行得氣，命盤純粹。特此授與本吉簡，契合大吉色彩：<strong className="text-[#590612] font-black">{result.auspiciousColors.join("、")}</strong>，並於其居所【<strong className="text-[10px] font-sans font-bold border-b border-[#bfa15f]/40">{form.address}</strong>】布設山水和合大局，迎祥納福，辟邪化煞，永保昌盛。
                          </p>
                          <p className="text-right text-[10px] text-ink-400 font-sans mt-6">
                            驗證存檔 hash: <span className="font-mono font-bold">CL-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                          </p>
                        </div>

                        {/* Seals and Signatures */}
                        <div className="flex items-center justify-between pt-4 border-t border-[#bfa15f]/25 font-serif text-xs">
                          <div className="text-left">
                            <p className="text-[10px] text-ink-400">大師簽章 Verified By</p>
                            <p className="font-black text-[#590612] text-sm tracking-wide mt-1">主持 · 林大師（青衣閣）</p>
                          </div>
                          
                          {/* Royal Red Seal */}
                          <div className="w-14 h-14 bg-red-50 border-2 border-red-500 text-red-500 font-black rounded-lg flex items-center justify-center font-serif text-center leading-none text-[10px] shadow-sm transform rotate-[-4deg] select-none hover:scale-105 transition-transform">
                            中聯家居<br />天星閣印
                          </div>
                        </div>

                      </div>

                      {/* Print & Actions */}
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            triggerBlessing("🖨️ 正在為您啟動列印對話框，建議選取『儲存為 PDF』以獲得最高清晰度的法印報告書證書！");
                            setTimeout(() => {
                              window.print();
                            }, 1000);
                          }}
                          className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-xl text-xs font-bold tracking-widest transition-all shadow hover:scale-[1.02]"
                        >
                          🖨️ 點擊列印 / 存為高畫質 PDF
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Auspicious Colors & Quick Tips Swatches */}
              <div className="bg-gold-50/40 border border-gold-100 rounded-2xl p-6 sm:p-8 space-y-6">
                
                {/* Lucky Colors */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-ink-900 tracking-widest uppercase font-sans flex items-center gap-1.5">
                    🎨 大師建議：本命趨吉避凶 · 契合色彩之選
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {result.auspiciousColors.map((color, index) => {
                      // Map some cool traditional color swatches
                      let hex = "#bfa15f";
                      if (color.includes("綠") || color.includes("青")) hex = "#406e57";
                      else if (color.includes("紅") || color.includes("硃")) hex = "#a8352b";
                      else if (color.includes("黃")) hex = "#caa14b";
                      else if (color.includes("白") || color.includes("銀")) hex = "#f0f2f5";
                      else if (color.includes("藍") || color.includes("灰") || color.includes("黑")) hex = "#2b4c5e";
                      else if (color.includes("紫")) hex = "#5d3f6a";

                      return (
                        <div key={index} className="bg-white border border-gold-100 rounded-xl p-3 flex flex-col items-center space-y-2 shadow-sm text-center">
                          <div 
                            className="w-10 h-10 rounded-full border border-gold-200/50 shadow-inner"
                            style={{ backgroundColor: hex }}
                          />
                          <span className="text-xs font-bold text-ink-900">{color}</span>
                          <span className="text-[10px] font-mono text-ink-400 uppercase">{hex}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actionable Tips */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-ink-900 tracking-widest uppercase font-sans flex items-center gap-1.5">
                    ✨ 空間開運生活美學法門 (日常修持)
                  </h4>
                  <div className="space-y-2">
                    {result.tips.map((tip, index) => (
                      <div key={index} className="bg-white/80 border border-gold-100/50 rounded-xl p-3.5 flex items-start space-x-3 text-xs leading-relaxed text-ink-400">
                        <span className="w-5 h-5 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center font-mono font-bold text-gold-700 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 💬 客戶真實見證 */}
              <TestimonialsSection />

              {/* 專屬天時開運月曆 */}
              <div className="mt-8">
                <AuspiciousCalendar form={form} result={result} onTriggerBlessing={triggerBlessing} />
              </div>

              {/* Reset & Share Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-[#bfa15f]/10 mt-6">
                <button
                  type="button"
                  id="btn_preview_pdf_bottom"
                  onClick={() => {
                    setShowPdfModal(true);
                    triggerBlessing("📖 正在翻閱天星典籍... 為您開啟完整 A4 住宅風水與天命 PDF 報告預覽！");
                  }}
                  className="w-full sm:w-auto px-6 py-3 text-xs tracking-widest font-sans rounded-lg transition-all inline-flex items-center justify-center space-x-2 font-semibold bg-gold-50 hover:bg-gold-100 text-gold-800 border border-gold-200 shadow-md hover:scale-[1.02] cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-gold-700" />
                  <span>預覽完整 PDF 報告</span>
                </button>

                <button 
                  id="btn_share_report_bottom"
                  onClick={handleShareReport}
                  className={`w-full sm:w-auto px-6 py-3 text-xs tracking-widest font-sans rounded-lg transition-all inline-flex items-center justify-center space-x-2 font-semibold shadow-md ${
                    copied
                      ? "bg-emerald-600 text-white shadow-emerald-600/10 hover:bg-emerald-700"
                      : "bg-[#590612] hover:bg-[#800c1e] text-white shadow-[#590612]/10 hover:scale-[1.02]"
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? "已複製命理簡報！" : "分享命理簡報"}</span>
                </button>

                <button 
                  id="btn_reset_calculation"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 border border-gold-500 text-gold-700 hover:bg-gold-50 text-xs tracking-widest font-sans rounded-lg transition-all inline-flex items-center justify-center space-x-2 font-semibold shadow-md hover:scale-[1.02]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>重啟另一命盤推演</span>
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Sidebar Widget (Takes 4 cols) */}
      <div className="lg:col-span-4 lg:sticky lg:top-24">
        <ContactWidget onTriggerBlessing={triggerBlessing} />
      </div>

    </div>

    {/* 玄學術語小百科 */}
    <div id="encyclopedia_section" className="w-full mt-10 relative z-10">
      <div className="gilded-box rounded-2xl p-6 sm:p-8">
        <div className="flex items-center space-x-3 border-b border-[#bfa15f]/20 pb-4 mb-6">
          <div className="p-2 bg-[#590612]/5 rounded-xl border border-[#590612]/15 text-[#590612]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#590612] tracking-wider font-serif">
              📚 玄學術語小百科 (堪輿易學解密)
            </h3>
            <p className="text-[10px] sm:text-xs text-ink-400 font-sans mt-0.5">
              簡單解釋傳統八字、五行、擇日等專業術語，助您更透徹地理解天命五行與空間氣局的契合。
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              title: "🔮 八字命理 (Four Pillars of Destiny)",
              desc: "八字是由一個人的出生年、月、日、時，以天干地支（如甲子、乙丑等）各記兩個字，合共八個字所組成。它反映了您降生那一刻的宇宙星體磁場結構，藉此推算一生的元神強弱、性格稟賦及吉凶流年大運。"
            },
            {
              title: "☯ 五行元神 (The Five Elements)",
              desc: "宇宙萬物皆由「金、木、水、火、土」五種基本元素運動變化所構成，它們相互生克（相生如水生木、相克如金克木）。每個人八字中均有其主導的「五行元神」，配合家居佈局中的軟裝材質與朝向方位，能極大調和氣場，達至安居樂業。"
            },
            {
              title: "📅 董公烏兔擇日 (Dong Gong Wu Tu Date Selection)",
              desc: "源於清代堪輿名宿董公之秘傳神數，結合九星、烏兔太陽、太陰吉星軌跡及當事人八字生肖干支精算。專用於挑選動土、嫁娶、搬遷、進宅等良辰吉日，能有效趨吉避凶，催旺家宅福澤。"
            },
            {
              title: "🔥 下元九運 · 離火當令 (Period 9 / Purple Fire Luck)",
              desc: "古代三元九運堪輿學中，每二十年為一運。自 2024 年至 2043 年進入「下元九運」，由「九紫離火星」主掌乾坤。這二十年內，凡與火、能源、文化科技、心靈美學等相關事物均乘旺而起，家居佈局也需引入相應的九紫生氣。"
            },
            {
              title: "🏡 家居風水勘察 (Feng Shui Space Audits)",
              desc: "俗語云「一命二運三風水」。家居風水旨在勘察住宅「藏風聚氣」之能。大師會通過評估大門玄關、財位水法、臥床靠山等方位氣場，並結合屋主的生辰八字，布設合適的軟裝、植物或風水局，達到宅人合一之效。"
            }
          ].map((item, index) => {
            const isOpen = activeTermIndex === index;
            return (
              <div 
                key={index} 
                className="border border-[#bfa15f]/20 rounded-xl overflow-hidden transition-all duration-300"
                style={{ background: isOpen ? "rgba(89, 6, 18, 0.02)" : "rgba(251, 250, 247, 0.6)" }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTermIndex(isOpen ? null : index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#590612]/5 transition-colors font-serif group"
                >
                  <span className="text-xs sm:text-sm font-bold text-ink-900 group-hover:text-[#590612] transition-colors flex items-center gap-2">
                    {item.title}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-gold-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#590612]" : ""}`} 
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs leading-relaxed text-ink-400 font-serif border-t border-[#bfa15f]/10">
                        {item.desc}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* ☯ 中聯天星易理 · 尊貴專屬訂閱與大師親算套餐 (Unified Checkout Page Bottom) */}
    <div id="payment_and_subscription_section" className="w-full mt-10 relative z-10 scroll-mt-24">
      <PaymentAndSubscription
        subscription={subscription}
        isProcessingPayment={isProcessingPayment}
        handleCheckout={handleCheckout}
        handleCancelSubscription={handleCancelSubscription}
        handleRemoveSubscription={handleRemoveSubscription}
        handleSimulateSubscription={handleSimulateSubscription}
        triggerBlessing={triggerBlessing}
        paymentError={paymentError}
        setPaymentError={setPaymentError}
      />
    </div>
  </main>

  {/* Footer */}
  <footer id="app_footer" className="border-t border-gold-100/40 bg-white/40 pt-8 pb-20 md:pb-24 relative z-10 transition-all duration-300">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-sans text-ink-400 leading-normal">
      <div className="space-y-2 text-center md:text-left">
        <p className="font-bold text-gold-700">中聯家居風水命理專門店</p>
        <p>© 2026 中聯家居風水命理專門店. 保留所有權利.</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
        <a 
          href="https://www.mymasterlam.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#590612] hover:underline font-bold"
        >
          🌐 訪問林大師官網 (mymasterlam.com)
        </a>
        <span className="text-ink-100 hidden sm:inline">|</span>
        <a 
          href="tel:91884964" 
          className="text-[#590612] hover:underline font-bold"
        >
          📞 電話熱線: 91884964
        </a>
        <span className="text-ink-100 hidden sm:inline">|</span>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); alert("中聯家居風水命理專門店重視您的私隱與數據安全，所收集的姓名、地址及生辰數據僅用於玄學算法分析與報告遞送，並將完全進行加密保密處置。官方網站：https://www.mymasterlam.com/，聯絡電話：91884964。"); }}
          className="hover:text-gold-600 transition-colors"
        >
          隱私與安全政策
        </a>
      </div>
    </div>
  </footer>

  {/* 大師賜福 Overlay Animation */}
  <AnimatePresence>
    {showBlessing && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center overflow-hidden"
        id="blessing_overlay"
      >
        {/* Dynamic Glowing Golden Particles */}
        {(() => {
          return Array.from({ length: 35 }).map((_, i) => {
            const left = `${Math.random() * 100}%`;
            const top = `${Math.random() * 80 + 10}%`;
            const size = Math.random() * 10 + 4;
            const duration = Math.random() * 4 + 3;
            const delay = Math.random() * 1.5;
            const y = [0, -200 - Math.random() * 300];
            const opacity = [0, 0.85, 0];
            const scale = [0.4, 1.6, 0.4];
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left,
                  top,
                  width: size,
                  height: size,
                  background: `radial-gradient(circle, #fedd00 0%, rgba(191,161,95,0.4) 100%)`,
                  boxShadow: "0 0 12px #fedd00, 0 0 24px #bfa15f",
                }}
                animate={{
                  y,
                  opacity,
                  scale,
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                  ease: "easeOut",
                }}
              />
            );
          });
        })()}

        {/* Central Card with Scroll Aesthetics */}
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: -50, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="relative max-w-lg w-full bg-gradient-to-b from-[#5d0713] via-[#3d030a] to-[#240105] border-4 border-[#bfa15f] p-8 rounded-3xl shadow-[0_0_50px_rgba(191,161,95,0.6)] space-y-6"
          id="blessing_card"
        >
          {/* Traditional Decorative Corner Frames */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#bfa15f]/60 rounded-tl-md" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#bfa15f]/60 rounded-tr-md" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#bfa15f]/60 rounded-bl-md" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#bfa15f]/60 rounded-br-md" />

          {/* Central Logo with Bagua Spinning Border */}
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center bg-gradient-to-br from-[#800c1e] to-[#40040c] rounded-full border-4 border-[#bfa15f] shadow-[0_0_30px_rgba(254,221,0,0.4)]">
            <BrandLogo className="h-16 w-16 drop-shadow-[0_0_8px_rgba(254,221,0,0.6)]" />
            <div className="absolute inset-[-6px] border-2 border-dashed border-[#bfa15f]/70 rounded-full animate-[spin_25s_linear_infinite]" />
            <div className="absolute inset-[-12px] border border-double border-[#fedd00]/30 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
          </div>

          <div className="space-y-2 text-center">
            <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-yellow-300 block uppercase">
              CHUNG LUEN · CELESTIAL BLESSING
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 font-serif tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              ☯ 中聯易理 · 大師賜福 ☯
            </h2>
          </div>

          {/* Decorative Calligraphy scroll text */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1c0003] border-2 border-[#bfa15f]/50 p-6 rounded-2xl relative shadow-inner"
          >
            <div className="absolute top-2 left-2 text-[#bfa15f]/25 text-sm select-none font-serif">☯</div>
            <div className="absolute bottom-2 right-2 text-[#bfa15f]/25 text-sm select-none font-serif">☯</div>
            <p className="text-base md:text-lg font-extrabold text-yellow-100 font-serif leading-relaxed tracking-wider">
              {blessingMessage}
            </p>
          </motion.div>

          <p className="text-xs text-amber-200/80 font-sans tracking-wide leading-relaxed">
            🔮 已成功為閣下啟動五行命盤加持，調和全宅氣場，招祥納吉！<br />
            專屬秘書將在第一時間為您主動跟進，或請直接點選下方領受福澤。
          </p>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.05, shadow: "0 0 15px rgba(254,221,0,0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBlessing(false)}
              className="px-10 py-3.5 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-500 text-[#590612] font-extrabold text-xs tracking-[0.2em] rounded-xl shadow-[0_5px_25px_rgba(254,221,0,0.35)] border-2 border-amber-300/40 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <span>承蒙大師賜福 · 頂禮領受</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

  {/* 🔮 玄學術語大師解密 Popover Modal */}
  <AnimatePresence>
    {activeHelp && (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveHelp(null)}
          className="absolute inset-0 bg-[#590612]/45 backdrop-blur-md"
        />
        
        {/* Card Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white border-2 border-[#bfa15f] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden z-10"
        >
          {/* Top colored line gradient */}
          <div className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-[#590612] via-[#bfa15f] to-[#590612]" />
          
          {/* Floating background character */}
          <div className="absolute -right-6 -bottom-6 text-[#590612]/5 text-9xl font-serif select-none pointer-events-none">
            ☯
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-start justify-between gap-4 border-b border-[#bfa15f]/25 pb-3">
              <h4 className="text-xs sm:text-sm font-black text-[#590612] font-serif leading-tight">
                {activeHelp.title}
              </h4>
              <button
                type="button"
                onClick={() => setActiveHelp(null)}
                className="text-ink-300 hover:text-[#590612] transition-colors p-1 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-xs sm:text-sm text-ink-900 leading-relaxed font-serif text-justify font-light whitespace-pre-line">
              {activeHelp.content}
            </p>
            
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveHelp(null)}
                className="px-4 py-2 bg-gradient-to-r from-[#590612] to-[#800c1e] hover:from-[#800c1e] hover:to-[#590612] text-white rounded-lg text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer"
              >
                吾已閱之 (關閉)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>

  {/* 🧭 九宮飛星九運化煞催旺大師詳解 Modal */}
  <AnimatePresence>
    {selectedStar && (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedStar(null)}
          className="absolute inset-0 bg-[#590612]/50 backdrop-blur-md"
        />
        
        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="bg-white border-4 border-[#bfa15f] rounded-2xl max-w-xl w-full shadow-2xl relative overflow-hidden z-10 flex flex-col max-h-[85vh]"
        >
          {/* Top Elegant Gradient Border */}
          <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-[#590612] via-[#bfa15f] to-[#590612]" />
          
          {/* Watermark character */}
          <div className="absolute -right-8 -bottom-8 text-[#590612]/5 text-[15rem] font-serif select-none pointer-events-none">
            ☯
          </div>
          
          {/* Content container - Scrollable if too long */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-5 relative z-10">
            {/* Header / Title */}
            <div className="flex items-start justify-between gap-4 border-b border-[#bfa15f]/25 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest bg-gold-50 text-gold-800 border border-gold-200 px-2 py-0.5 rounded-md font-sans font-bold">
                  下元九運 (2024 - 2043) · 風水精算
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-black text-[#590612] flex items-center gap-2 mt-1">
                  <span>{selectedStar.pos}</span>
                  <span className="text-[#bfa15f]/40">|</span>
                  <span className="text-base font-bold text-gold-700">{selectedStar.star}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStar(null)}
                className="text-zinc-400 hover:text-[#590612] transition-colors p-1.5 rounded-full hover:bg-zinc-100 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Quick Badges row */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-gold-50 text-gold-800 border border-gold-200/60 px-3 py-1 rounded-full font-serif font-bold">
                ☯ 五行屬性: {selectedStar.element}
              </span>
              <span className={`px-3 py-1 rounded-full font-serif font-bold border ${
                selectedStar.aura.includes("大吉") ? "bg-rose-50 text-rose-800 border-rose-200" :
                selectedStar.aura.includes("吉") ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                selectedStar.aura.includes("大凶") ? "bg-red-50 text-red-800 border-red-200" :
                selectedStar.aura.includes("凶") ? "bg-amber-50 text-amber-800 border-amber-200" :
                "bg-slate-50 text-slate-800 border-slate-200"
              }`}>
                🌟 吉凶判定: {selectedStar.aura} ({selectedStar.detail})
              </span>
            </div>

            {/* Period 9 Impact Description */}
            <div className="bg-[#590612]/5 border border-[#bfa15f]/30 rounded-xl p-4 space-y-1">
              <h4 className="text-xs font-bold text-[#590612] font-serif flex items-center gap-1">
                <span>🏮</span>
                <span>離火元運 · 九星變局影響</span>
              </h4>
              <p className="text-xs leading-relaxed text-zinc-700 font-serif text-justify">
                {selectedStar.period9Impact}
              </p>
            </div>

            {/* Custom List of Cures (九運化煞與催旺建議) */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-[#590612] font-serif flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[#bfa15f] rounded-full inline-block" />
                <span>下元九運專屬『化煞與催旺擺設指針』</span>
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {selectedStar.cures.map((cure, idx) => {
                  const cureInfo = getCureElementInfo(cure, selectedStar.element);
                  const ElementIcon = cureInfo.icon;
                  return (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 bg-zinc-50 border border-zinc-100 p-3.5 rounded-xl hover:border-[#bfa15f] hover:bg-gold-50/10 transition-all group"
                    >
                      <div className="flex flex-col items-center gap-1.5 flex-shrink-0 mt-0.5">
                        <span className="w-5 h-5 rounded-full bg-[#590612]/10 text-[#590612] flex items-center justify-center text-[10px] font-bold group-hover:bg-[#590612] group-hover:text-white transition-colors">
                          {idx + 1}
                        </span>
                        <div 
                          className={`flex items-center justify-center p-1 rounded-md border text-[10px] ${cureInfo.color}`}
                          title={`五行屬性: ${cureInfo.label}`}
                        >
                          <ElementIcon className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-sans font-extrabold px-1.5 py-0.5 rounded border tracking-wider ${cureInfo.color}`}>
                            {cureInfo.label}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-700 leading-relaxed font-serif text-justify">
                          {cure}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Elegant Master Blessing Mantra Scroll */}
            <div className="border-2 border-dashed border-[#bfa15f]/45 rounded-xl p-3.5 bg-gold-50/20 text-center space-y-1 relative">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white border border-[#bfa15f]/30 text-[9px] font-bold text-[#590612] rounded-full font-serif">
                🔮 大師秘傳 · 開運真言
              </span>
              <p className="text-sm font-black font-serif tracking-[0.15em] text-[#590612] pt-1">
                「 {selectedStar.mantra} 」
              </p>
              <p className="text-[10px] text-zinc-400 font-sans">
                誠心默念此言，並依指南調整器物擺放，可速化凶解難、大開吉慶之門。
              </p>
            </div>

            {/* Close Button Footer */}
            <div className="flex justify-end pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setSelectedStar(null)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#590612] to-[#800c1e] hover:from-[#800c1e] hover:to-[#590612] text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.02] shadow-md hover:shadow-lg cursor-pointer"
              >
                收受大師指引 (關閉)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>

  {/* 📄 完整 A4 風水命理 PDF 報告預覽與生成 Modal */}
  <AnimatePresence>
    {showPdfModal && result && (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowPdfModal(false)}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="bg-[#faf8f5] border-4 border-[#bfa15f] rounded-2xl max-w-5xl w-full shadow-2xl relative overflow-hidden z-10 flex flex-col h-[92vh]"
        >
          {/* Top Decorative Border */}
          <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-[#590612] via-[#bfa15f] to-[#590612]" />

          {/* Modal Header */}
          <div className="p-4 sm:p-5 border-b border-[#bfa15f]/20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📜</span>
              <div className="text-left">
                <h3 className="text-base sm:text-lg font-serif font-black text-[#590612]">
                  中聯天星 · 完整 A4 住宅風水與天命報告預覽
                </h3>
                <p className="text-[10px] sm:text-xs text-zinc-500 font-sans">
                  大師已將您的八字與住宅氣場排版為 4 頁 A4 官方文牒，您可在此預覽排版並一鍵儲存為高畫質 PDF。
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleGeneratePDF}
                disabled={generatingPdf}
                className="flex-1 sm:flex-none py-2 px-4 bg-gradient-to-r from-[#590612] to-[#800c1e] hover:from-[#800c1e] hover:to-[#590612] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {generatingPdf ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>正在印製 PDF 報告...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>下載完整版 PDF 報告</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="p-2 text-zinc-400 hover:text-[#590612] transition-colors rounded-full hover:bg-zinc-100 cursor-pointer"
                title="關閉預覽"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Content - Mahogany Desktop Area */}
          <div className="flex-1 bg-[#1c0d02] overflow-y-auto p-4 sm:p-8 flex flex-col items-center gap-8 relative">
            {/* Ambient desk overlay shadows */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-12 max-w-full" ref={pdfContainerRef}>
              
              {/* PAGE 1: COVER PAGE */}
              <div
                data-pdf-page="1"
                className="w-[794px] h-[1123px] bg-[#fdfbf7] p-16 flex flex-col justify-between border-[12px] border-double border-[#bfa15f] rounded-lg shadow-2xl relative select-none overflow-hidden flex-shrink-0"
                style={{ fontFamily: '"Inter", "Playfair Display", "serif"' }}
              >
                {/* Traditional Corner Accents */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-[#bfa15f]" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-[#bfa15f]" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-[#bfa15f]" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-[#bfa15f]" />
                
                {/* Subtle Bagua watermarks */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                  <span className="text-[32rem]">☯</span>
                </div>

                {/* Top Logo and Header */}
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-white p-2 rounded-xl border-2 border-[#bfa15f] h-16 w-16 flex items-center justify-center shadow-md">
                      <img
                        src="/src/assets/images/centerland_fengshui_logo_1783844263098.jpg"
                        alt="Logo"
                        className="h-full aspect-square object-cover"
                      />
                    </div>
                  </div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#590612] font-bold font-serif">
                    ⚜️ 中聯家居風水命理專門店 ⚜️
                  </p>
                  <div className="w-24 h-[1px] bg-[#bfa15f] mx-auto" />
                </div>

                {/* Main Book Title block */}
                <div className="text-center space-y-6 my-auto py-8">
                  <p className="text-[#bfa15f] text-sm tracking-[0.3em] font-serif font-bold uppercase">
                    下元九運 · 乾坤易理尊享精批報告
                  </p>
                  <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-widest text-[#590612] leading-snug">
                    乾坤天命住宅氣運
                    <br />
                    <span className="text-3xl sm:text-4xl text-[#bfa15f] mt-2 block">大成寶鑑</span>
                  </h1>
                  <p className="text-zinc-500 text-xs max-w-md mx-auto leading-relaxed font-sans">
                    「氣乘風則散，界水則止。古人聚之使不散，行之使有止。」本寶鑑依據大師親傳八字命理學及九宮飛星佈局體系，專為尊貴客戶量身訂製。
                  </p>
                </div>

                {/* User Information Table Card */}
                <div className="bg-white/90 border-2 border-[#bfa15f]/30 rounded-xl p-8 max-w-lg mx-auto w-full shadow-sm space-y-4">
                  <h4 className="text-center text-xs font-bold text-[#590612] tracking-widest border-b border-[#bfa15f]/20 pb-2 uppercase font-serif">
                    📜 閣下專屬命理檔案 / Client Profile
                  </h4>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-serif text-zinc-700">
                    <div className="border-b border-zinc-100 pb-1">
                      <span className="text-[#bfa15f]">尊貴閣下：</span>
                      <span className="font-bold text-zinc-950">{form.name} ({form.gender})</span>
                    </div>
                    <div className="border-b border-zinc-100 pb-1">
                      <span className="text-[#bfa15f]">天命元神：</span>
                      <span className="font-bold text-[#590612]">{result.dominantElement}命</span>
                    </div>
                    <div className="col-span-2 border-b border-zinc-100 pb-1">
                      <span className="text-[#bfa15f]">降生時空：</span>
                      <span className="font-sans text-[11px] font-medium text-zinc-950">{form.birthDate} {form.birthTime || "12:30"}</span>
                    </div>
                    <div className="col-span-2 border-b border-zinc-100 pb-1">
                      <span className="text-[#bfa15f]">勘測全址：</span>
                      <span className="text-zinc-950 text-[11px] truncate block">{form.address}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[#bfa15f]">關聯電郵：</span>
                      <span className="font-sans text-[11px] text-zinc-950">{form.email}</span>
                    </div>
                  </div>
                </div>

                {/* Footer and Seals */}
                <div className="border-t border-[#bfa15f]/30 pt-6 flex items-center justify-between">
                  <div className="space-y-1 text-left">
                    <p className="text-[10px] text-zinc-500 font-sans font-medium">
                      中聯天星易學勘測中心 · 敬製
                    </p>
                    <p className="text-[9px] text-zinc-400 font-sans">
                      Official Document: TX-{Math.floor(100000 + Math.random() * 900000)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Chinese red seals */}
                    <div className="border-2 border-red-500 bg-red-500/5 text-red-500 text-[10px] font-serif font-black p-1 leading-none tracking-widest rounded rotate-[-2deg]">
                      中聯天星
                    </div>
                    <div className="border border-red-500 bg-red-500/5 text-red-500 text-[8px] font-serif font-bold p-1 leading-none tracking-wider rounded">
                      大師鑑定印
                    </div>
                  </div>
                </div>
              </div>


              {/* PAGE 2: FIRST VOLUME (BAZI DETAILED READING) */}
              <div
                data-pdf-page="2"
                className="w-[794px] h-[1123px] bg-[#fdfbf7] p-16 flex flex-col justify-between border-[12px] border-double border-[#bfa15f] rounded-lg shadow-2xl relative select-none overflow-hidden flex-shrink-0"
                style={{ fontFamily: '"Inter", "Playfair Display", "serif"' }}
              >
                {/* Traditional Corner Accents */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-[#bfa15f]" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-[#bfa15f]" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-[#bfa15f]" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-[#bfa15f]" />

                {/* Page header */}
                <div className="border-b border-[#bfa15f]/20 pb-4 flex justify-between items-center text-xs font-serif text-zinc-500">
                  <span>第一卷：天命本源 · 八字五行深批</span>
                  <span className="font-sans text-[10px]">Page 2 of 4</span>
                </div>

                <div className="flex-1 py-6 space-y-6 text-left">
                  <div className="flex items-center justify-between border-b border-[#bfa15f]/10 pb-3">
                    <h2 className="text-xl font-serif font-black text-[#590612] tracking-wider flex items-center gap-2">
                      <span className="text-lg">☯</span>
                      <span>本源元神與陰陽喜忌契合解密</span>
                    </h2>
                    <span className="text-xs bg-gold-50 border border-gold-200 text-[#590612] px-3 py-1 rounded-md font-bold font-serif shadow-sm">
                      本命元神：{result.dominantElement}命
                    </span>
                  </div>

                  {/* Five Elements Bar Charts */}
                  <div className="bg-white/80 p-5 rounded-xl border border-zinc-200/60 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-zinc-700 tracking-wider uppercase font-serif">
                      📈 閣下八字五行能量結構分佈
                    </h4>
                    <div className="space-y-2.5">
                      {[
                        { label: "木 (Wood)", score: result.elementScores.wood, color: "bg-emerald-500", text: "text-emerald-700" },
                        { label: "火 (Fire)", score: result.elementScores.fire, color: "bg-rose-500", text: "text-rose-700" },
                        { label: "土 (Earth)", score: result.elementScores.earth, color: "bg-amber-600", text: "text-amber-800" },
                        { label: "金 (Metal)", score: result.elementScores.metal, color: "bg-yellow-500", text: "text-yellow-700" },
                        { label: "水 (Water)", score: result.elementScores.water, color: "bg-blue-500", text: "text-blue-700" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 text-xs font-serif">
                          <span className={`w-20 font-bold ${item.text}`}>{item.label}</span>
                          <div className="flex-1 bg-zinc-100 rounded-full h-3 overflow-hidden border border-zinc-200/50">
                            <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.score}%` }} />
                          </div>
                          <span className="w-8 text-right font-mono font-bold text-zinc-700">{item.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Reading Text block */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-[#bfa15f] tracking-widest uppercase font-serif border-b border-[#bfa15f]/10 pb-1.5">
                      🔮 大師親撰 · 天機批註
                    </h3>
                    <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm text-zinc-800 text-xs font-serif leading-relaxed text-justify space-y-4 whitespace-pre-line">
                      {result.destinyReading}
                    </div>
                  </div>

                  {/* Auspicious Colors badge section */}
                  <div className="bg-gold-50/30 border border-gold-200/60 rounded-xl p-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#bfa15f] uppercase tracking-wider font-bold font-serif">契合命盤大吉色彩</span>
                      <h4 className="text-sm font-serif font-black text-[#590612]">
                        五行通關開運主色：{result.auspiciousColors.join("、")}
                      </h4>
                    </div>
                    <div className="flex gap-1">
                      {result.auspiciousColors.map((color, idx) => (
                        <span key={idx} className="w-6 h-6 rounded-full border border-white shadow-md flex items-center justify-center text-[10px]" style={{ backgroundColor: color === "紅色" ? "#ef4444" : color === "綠色" ? "#10b981" : color === "黑色" ? "#1e293b" : color === "白色" ? "#ffffff" : color === "黃色" ? "#eab308" : "#bfa15f" }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#bfa15f]/10 pt-4 text-center text-[9px] text-zinc-400 font-sans">
                  中聯家居風水命理專門店 版權所有 © 2026 Centerland Feng Shui Boutique
                </div>
              </div>


              {/* PAGE 3: SECOND VOLUME (FENG SHUI & SPACE ADVICE) */}
              <div
                data-pdf-page="3"
                className="w-[794px] h-[1123px] bg-[#fdfbf7] p-16 flex flex-col justify-between border-[12px] border-double border-[#bfa15f] rounded-lg shadow-2xl relative select-none overflow-hidden flex-shrink-0"
                style={{ fontFamily: '"Inter", "Playfair Display", "serif"' }}
              >
                {/* Corner Accents */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-[#bfa15f]" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-[#bfa15f]" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-[#bfa15f]" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-[#bfa15f]" />

                {/* Page header */}
                <div className="border-b border-[#bfa15f]/20 pb-4 flex justify-between items-center text-xs font-serif text-zinc-500">
                  <span>第二卷：山水和合 · 空間佈局與居室氣場</span>
                  <span className="font-sans text-[10px]">Page 3 of 4</span>
                </div>

                <div className="flex-1 py-6 space-y-6 text-left">
                  <h2 className="text-xl font-serif font-black text-[#590612] tracking-wider flex items-center gap-2 border-b border-[#bfa15f]/10 pb-3">
                    <span className="text-lg">🏡</span>
                    <span>居所地址氣場吉凶與家宅佈局妙計</span>
                  </h2>

                  {/* Address Aura Analysis */}
                  <div className="gilded-box bg-white p-5 rounded-xl border border-[#bfa15f]/20 space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                      <h4 className="text-xs font-bold text-zinc-800 font-serif flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#590612]" />
                        <span>地靈氣脈勘測 · 居所能量點評</span>
                      </h4>
                      <span className="text-[10px] bg-red-500 text-white font-sans font-bold px-2 py-0.5 rounded uppercase">
                        地址評級: {result.dominantElement === "木" || result.dominantElement === "水" ? "大吉 (95分)" : "迎祥 (88分)"}
                      </span>
                    </div>
                    <p className="text-zinc-600 font-mono text-[10px] leading-none bg-zinc-50 p-2 rounded border border-zinc-100">
                      🏠 勘測居所全址：{form.address}
                    </p>
                    <div className="bg-white text-zinc-700 text-xs font-serif leading-relaxed whitespace-pre-line text-justify">
                      {result.addressAura}
                    </div>
                  </div>

                  {/* Space Layout Advice */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-[#bfa15f] tracking-widest uppercase font-serif border-b border-[#bfa15f]/10 pb-1.5 flex items-center gap-1.5">
                      <span>🏡</span>
                      <span>山水相和 · 家宅佈置法要</span>
                    </h3>
                    <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm text-zinc-800 text-xs font-serif leading-relaxed text-justify whitespace-pre-line">
                      {result.spaceAdvice}
                    </div>
                  </div>

                  {/* Traditional Landscape illustration watermark/text */}
                  <div className="border-l-4 border-[#bfa15f] pl-4 italic text-[11px] text-[#8a713b] font-serif leading-relaxed">
                    「大凡陽宅，以氣流暢、光充足、水溫潤為上乘之選。水能引氣，山能聚氣。本佈局指引旨在引導居室磁場，扶助閣下元神氣勢。」
                  </div>
                </div>

                <div className="border-t border-[#bfa15f]/10 pt-4 text-center text-[9px] text-zinc-400 font-sans">
                  中聯家居風水命理專門店 版權所有 © 2026 Centerland Feng Shui Boutique
                </div>
              </div>


              {/* PAGE 4: THIRD VOLUME (DAILY TIPS & OFFICIAL CERTIFICATE SCROLL) */}
              <div
                data-pdf-page="4"
                className="w-[794px] h-[1123px] bg-[#fdfbf7] p-16 flex flex-col justify-between border-[12px] border-double border-[#bfa15f] rounded-lg shadow-2xl relative select-none overflow-hidden flex-shrink-0"
                style={{ fontFamily: '"Inter", "Playfair Display", "serif"' }}
              >
                {/* Corner Accents */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-[#bfa15f]" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-[#bfa15f]" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-[#bfa15f]" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-[#bfa15f]" />

                {/* Page header */}
                <div className="border-b border-[#bfa15f]/20 pb-4 flex justify-between items-center text-xs font-serif text-zinc-500">
                  <span>第三卷：天時地利 · 趨吉避凶日用修持</span>
                  <span className="font-sans text-[10px]">Page 4 of 4</span>
                </div>

                <div className="flex-1 py-6 space-y-6 text-left flex flex-col justify-between">
                  <div className="space-y-4">
                    <h2 className="text-xl font-serif font-black text-[#590612] tracking-wider flex items-center gap-2 border-b border-[#bfa15f]/10 pb-3">
                      <span className="text-lg">💡</span>
                      <span>大師秘傳日常開運修持法門</span>
                    </h2>

                    {/* Daily tips list */}
                    <div className="grid grid-cols-1 gap-3">
                      {result.tips.map((tip, idx) => (
                        <div key={idx} className="bg-white border border-zinc-200/60 p-4 rounded-xl flex items-start gap-3 shadow-sm text-xs text-zinc-800 font-serif leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center font-mono font-bold text-gold-700 flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p>{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Imperial Scroll Certificate Embedded inside the PDF layout! */}
                  <div className="border-2 border-double border-[#bfa15f] bg-white rounded-2xl p-6 relative overflow-hidden text-center space-y-4 shadow-sm my-4">
                    {/* Tiny certificate corners */}
                    <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-[#bfa15f]" />
                    <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-[#bfa15f]" />
                    <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-[#bfa15f]" />
                    <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-[#bfa15f]" />

                    <span className="text-[10px] text-[#bfa15f] tracking-[0.25em] font-serif font-bold uppercase block">
                      🏮 天命法印開運証書 🏮
                    </span>
                    <h3 className="text-[#590612] font-serif font-black text-lg tracking-wider">
                      中聯天星易學館認證書
                    </h3>
                    <p className="text-[11px] leading-relaxed text-zinc-600 font-serif px-4">
                      「茲證明尊貴之「<strong className="text-gold-700">{form.name}</strong>」閣下（本命屬<strong className="text-gold-700">{result.dominantElement}命</strong>），大師已為其依八字、大運、住宅方位完成乾坤風水秘法布局勘驗，法印歸位，氣場昇華，諸神護佑，出入迎祥。」
                    </p>

                    <div className="flex justify-center py-2">
                      {/* Blessing Mantra text banner */}
                      <div className="border border-dashed border-[#bfa15f]/60 bg-gold-50/25 py-2 px-6 rounded-md">
                        <span className="text-[10px] text-zinc-400 font-sans block leading-none mb-1">大師加持密咒真言</span>
                        <strong className="text-xs text-gold-800 font-serif">
                          「 乾坤正氣，五行和諧，家宅安泰，富貴吉祥 」
                        </strong>
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-[#bfa15f]/10 pt-4 text-left">
                      <div>
                        <p className="text-[10px] text-[#bfa15f] font-serif font-bold">下元九運天星大師組</p>
                        <p className="text-[8px] text-zinc-400 font-sans">勘測專用特級章印</p>
                      </div>
                      {/* Circular Red stamp seal */}
                      <div className="w-12 h-12 rounded-full border-2 border-red-500 bg-red-500/5 text-red-500 text-[8px] font-serif font-bold flex flex-col items-center justify-center leading-none tracking-widest rotate-[-5deg]">
                        <span>天星</span>
                        <span className="mt-0.5">之印</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#bfa15f]/10 pt-4 text-center text-[9px] text-zinc-400 font-sans">
                  中聯家居風水命理專門店 版權所有 © 2026 Centerland Feng Shui Boutique
                </div>
              </div>

            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[10px] sm:text-xs text-zinc-500 font-sans text-center sm:text-left flex items-center gap-1">
              <span>💡</span>
              <span><strong>小常識：</strong>本報告採用超高清渲染，在手機或電腦上印製成 A4 紙質書冊效果尤佳，適合作為家庭傳家風水寶典存檔。</span>
            </span>
            <button
              type="button"
              onClick={() => setShowPdfModal(false)}
              className="w-full sm:w-auto px-5 py-2.5 bg-zinc-300 hover:bg-zinc-400 text-zinc-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              關閉預覽 (返回報告)
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>

  {/* 🔮 運勢分享與全址保存中心 Modal */}
  <AnimatePresence>
    {showShareModal && result && (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowShareModal(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="bg-[#faf8f5] border-4 border-[#bfa15f] rounded-2xl max-w-2xl w-full shadow-2xl relative overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Top Elegant Gradient Border */}
          <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-[#590612] via-[#bfa15f] to-[#590612]" />

          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#bfa15f]/20 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏮</span>
              <div>
                <h3 className="text-base sm:text-lg font-serif font-black text-[#590612]">
                  中聯天星 · 運勢分享與保存中心
                </h3>
                <p className="text-[10px] sm:text-xs text-zinc-500 font-sans">
                  生成精美運勢海報、全址連結，一鍵分享至 WhatsApp
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              className="text-zinc-400 hover:text-[#590612] transition-colors p-1.5 rounded-full hover:bg-zinc-100 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Options grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Actions */}
              <div className="space-y-5">
                <h4 className="text-xs font-bold text-zinc-700 tracking-wider uppercase font-sans border-b border-zinc-200 pb-1.5">
                  ✨ 選擇分享形式 / Share Methods
                </h4>

                {/* Option 1: WhatsApp Image Sharing */}
                <div className="bg-white border border-zinc-200 p-4 rounded-xl space-y-3 shadow-sm hover:border-[#bfa15f] transition-all">
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-zinc-800 font-serif">
                        方式一：生成精美運勢海報
                      </h5>
                      <p className="text-[11px] text-zinc-500 leading-normal mt-0.5">
                        將您的主五行、八字得分與大師神印繪製成古典奢華海報，長按可儲存或一鍵下載，非常適合分享給 WhatsApp 朋友圈與好友。
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleGenerateImage}
                      disabled={generatingImage}
                      className="flex-1 py-2 px-3 bg-gradient-to-r from-[#590612] to-[#800c1e] hover:from-[#800c1e] hover:to-[#590612] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      {generatingImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>正在繪製中...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{generatedImage ? "重新生成海報" : "立即生成海報"}</span>
                        </>
                      )}
                    </button>

                    {generatedImage && (
                      <a
                        href={generatedImage}
                        download={`中聯天星風水命理精批_${form.name}.jpg`}
                        className="py-2 px-3 bg-gold-50 hover:bg-gold-100 text-gold-800 border border-gold-200 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="下載海報圖片到本機"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>下載海報</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Option 2: Full URL Sharing */}
                <div className="bg-white border border-zinc-200 p-4 rounded-xl space-y-3 shadow-sm hover:border-[#bfa15f] transition-all">
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-zinc-800 font-serif">
                        方式二：全址網址分享 (推薦)
                      </h5>
                      <p className="text-[11px] text-zinc-500 leading-normal mt-0.5">
                        大師已將您的命盤與家居氣場數據加密寫入專屬 URL 中。好友點擊此連結將能直接查閱與您一模一樣的奢華精批報告，實現永久傳承！
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={getShareUrl()}
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-[10px] text-zinc-600 font-mono truncate"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(getShareUrl())
                          .then(() => {
                            setUrlCopied(true);
                            triggerBlessing("✨ 成功複製分享全址連結！快去 WhatsApp 黏貼發送給好友吧！");
                            setTimeout(() => setUrlCopied(false), 2000);
                          });
                      }}
                      className="px-3 py-1.5 bg-[#bfa15f] hover:bg-[#a6894c] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {urlCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{urlCopied ? "已複製" : "複製網址"}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="w-full py-2 px-3 bg-[#25D366] hover:bg-[#20ba56] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    {/* WhatsApp Icon */}
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 2.01 14.116.99 11.516.99c-5.44 0-9.866 4.372-9.87 9.802 0 1.772.482 3.511 1.396 5.03L2.006 21.8l6.101-1.602c1.472.822 3.12 1.245 4.54 1.246z" />
                    </svg>
                    <span>分享至 WhatsApp (附帶全址連結)</span>
                  </button>
                </div>

                {/* Option 3: Plain Text */}
                <div className="bg-white border border-zinc-200 p-4 rounded-xl space-y-2.5 shadow-sm hover:border-[#bfa15f] transition-all">
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-50 text-slate-600 p-2 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-zinc-800 font-serif">
                        方式三：複製純文字簡報
                      </h5>
                      <p className="text-[11px] text-zinc-500 leading-normal mt-0.5">
                        適合直接複製大師推演的文字版簡報，包含您的出生時空、本命五行特質及開運生活指南。
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(getShareText())
                        .then(() => {
                          setShareCopied(true);
                          triggerBlessing("✨ 成功複製純文字簡報！快去發送給親友分享喜悅吧！");
                          setTimeout(() => setShareCopied(false), 2000);
                        });
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {shareCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{shareCopied ? "已成功複製純文字報告！" : "複製純文字命理報告"}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Dynamic Preview Screen */}
              <div className="flex flex-col items-center justify-start space-y-4 bg-zinc-100/60 p-4 sm:p-5 rounded-2xl border border-zinc-200">
                <h4 className="text-xs font-bold text-zinc-700 tracking-wider uppercase font-sans flex items-center gap-1">
                  <span>🖼️</span>
                  <span>{generatedImage ? "🔮 生成成功的海報圖片 (長按可儲存)" : "🏮 開運分享海報實時預覽"}</span>
                </h4>

                <div className="w-full flex justify-center max-h-[50vh] overflow-y-auto rounded-xl shadow-lg border border-[#bfa15f]/20 bg-[#590612]">
                  {generatedImage ? (
                    /* Render generated image for long-press saving */
                    <img
                      src={generatedImage}
                      alt="中聯天星風水開運海報"
                      className="w-full max-w-[340px] h-auto object-contain rounded-xl"
                    />
                  ) : (
                    /* Live HTML structure that html2canvas will render from */
                    <div
                      ref={posterRef}
                      className="w-[340px] bg-[#590612] text-white p-5 sm:p-6 border-8 border-double border-[#bfa15f] rounded-xl flex flex-col space-y-4 relative overflow-hidden flex-shrink-0 select-none"
                      style={{ fontFamily: '"Inter", "Playfair Display", "serif"' }}
                    >
                      {/* Watermark/Bagua decoration */}
                      <div className="absolute -right-16 -bottom-16 text-white/5 text-[14rem] font-serif select-none pointer-events-none rotate-12">
                        ☯
                      </div>
                      <div className="absolute -left-12 -top-12 text-white/5 text-[10rem] font-serif select-none pointer-events-none -rotate-12">
                        卍
                      </div>

                      {/* Header with Ornate Elements */}
                      <div className="text-center space-y-2 border-b border-[#bfa15f]/30 pb-3.5 relative z-10">
                        <div className="flex justify-center">
                          <div className="bg-white/95 p-1 rounded-lg border border-[#bfa15f]/80 h-10 w-10 flex items-center justify-center">
                            <img
                              src="/src/assets/images/centerland_fengshui_logo_1783844263098.jpg"
                              alt="Brand Logo"
                              className="h-full aspect-square object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.25em] text-[#bfa15f] font-serif font-bold">
                            ⚜️ 中聯家居風水命理專門店 ⚜️
                          </p>
                          <h4 className="text-lg font-serif font-black tracking-widest text-gold-300 mt-1">
                            天命神數 · 乾坤精批海報
                          </h4>
                        </div>
                      </div>

                      {/* Bazi Information Grid */}
                      <div className="grid grid-cols-2 gap-2 bg-black/20 p-2.5 rounded-lg border border-[#bfa15f]/20 text-[11px] font-serif relative z-10">
                        <div>
                          <span className="text-[#bfa15f]">尊貴閣下：</span>
                          <span className="font-bold">{form.name} ({form.gender})</span>
                        </div>
                        <div>
                          <span className="text-[#bfa15f]">空間身份：</span>
                          <span>空間{form.identity}</span>
                        </div>
                        <div className="col-span-2 border-t border-white/5 pt-1.5 mt-1">
                          <span className="text-[#bfa15f]">降生時空：</span>
                          <span className="font-sans text-[10px] text-zinc-300">{form.birthDate} {form.birthTime || "12:30"}</span>
                        </div>
                      </div>

                      {/* Large Center Element Seal */}
                      <div className="flex items-center justify-between gap-4 py-1.5 relative z-10">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gold-300/80 font-serif block">
                            下元九運 · 元神歸位
                          </span>
                          <h3 className="text-2xl font-serif font-black text-white tracking-wider flex items-center gap-1.5">
                            <span>【 {result.dominantElement}命 】</span>
                          </h3>
                          <span className="text-[10px] bg-white/10 text-gold-200 border border-[#bfa15f]/40 px-2 py-0.5 rounded-md font-serif inline-block">
                            🎨 幸運色彩: {result.auspiciousColors.slice(0, 2).join("、")}
                          </span>
                        </div>

                        {/* Traditional Seal circular graphic */}
                        <div className="w-16 h-16 rounded-full border-2 border-double border-[#bfa15f] flex flex-col items-center justify-center bg-gradient-to-br from-[#800c1e] to-[#590612] text-center shadow-lg flex-shrink-0 animate-pulse">
                          <span className="text-[8px] text-gold-300 font-sans tracking-widest">本命五行</span>
                          <span className="text-2xl font-serif font-black text-white leading-none mt-0.5">{result.dominantElement}</span>
                        </div>
                      </div>

                      {/* Bazi destiny snippet (condensed text summary) */}
                      <div className="bg-[#800c1e]/40 border border-[#bfa15f]/20 rounded-lg p-3 space-y-1 relative z-10">
                        <h5 className="text-[10px] font-bold text-gold-300 font-serif flex items-center gap-1">
                          <span>🔮</span>
                          <span>天機提要 · 大師親批神批</span>
                        </h5>
                        <p className="text-[10px] leading-relaxed text-zinc-200 font-serif text-justify line-clamp-4">
                          {result.destinyReading.slice(0, 150)}...
                        </p>
                      </div>

                      {/* Auspicious Tips snippet */}
                      <div className="space-y-1 relative z-10">
                        <h5 className="text-[10px] font-bold text-[#bfa15f] font-serif">
                          💡 大師日常趨吉避凶妙計
                        </h5>
                        <div className="text-[9px] text-zinc-300 font-serif leading-relaxed">
                          • {result.tips[0]}
                        </div>
                      </div>

                      {/* Traditional Master Stamp Seal and QR Placeholder */}
                      <div className="border-t border-[#bfa15f]/30 pt-3 flex items-center justify-between relative z-10">
                        <div className="space-y-1 text-left">
                          <p className="text-[8px] text-zinc-400 font-sans leading-none">
                            中聯天星大師組 · 敬上
                          </p>
                          {/* Red stamp */}
                          <div className="border-2 border-red-500 bg-red-500/10 text-red-500 text-[8px] font-serif font-bold py-0.5 px-1.5 tracking-wider uppercase rounded inline-block rotate-[-3deg]">
                            中聯大師印
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <div className="text-right">
                            <span className="text-[7px] text-gold-300 font-serif block">
                              長按此海報
                            </span>
                            <span className="text-[7px] text-zinc-400 font-serif block">
                              儲存並分享福報
                            </span>
                          </div>
                          {/* Mock decorative QR seal */}
                          <div className="w-10 h-10 border border-[#bfa15f] rounded bg-white flex items-center justify-center p-0.5 flex-shrink-0">
                            <div className="w-full h-full bg-zinc-900 border border-zinc-200 rounded-sm flex items-center justify-center text-[5px] text-white text-center font-mono leading-none">
                              ☯
                              <br />
                              中聯
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {generatedImage && (
                  <p className="text-[10px] text-zinc-500 text-center font-sans">
                    💡 <strong className="text-gold-700">保存秘籍：</strong>在手機上長按上方圖片，可選擇「儲存圖片」或「分享」直接發送給 WhatsApp 朋友。電腦上點擊左側「下載海報」即可存檔。
                  </p>
                )}
              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end">
            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              className="px-5 py-2.5 bg-zinc-300 hover:bg-zinc-400 text-zinc-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              關閉中心 (返回報告)
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>

  {/* 常駐尊享會員區導覽列 */}
  {step === "result" && (
    <PremiumBottomBar
      subscription={subscription}
      isProcessingPayment={isProcessingPayment}
      handleCheckout={handleCheckout}
      handleCancelSubscription={handleCancelSubscription}
      handleRemoveSubscription={handleRemoveSubscription}
      handleSimulateSubscription={handleSimulateSubscription}
      triggerBlessing={triggerBlessing}
      isExpanded={isPremiumBarExpanded}
      setIsExpanded={setIsPremiumBarExpanded}
    />
  )}

  {/* 支付狀態監控模組 (Stripe Error WhatsApp Assistance Link) */}
  <PaymentStatusMonitor
    paymentError={paymentError}
    onClose={() => setPaymentError(null)}
    userName={form.name}
  />
</div>
  );
}
