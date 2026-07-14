import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, ChevronRight, Gem, ExternalLink, Info, Sparkles, Image as ImageIcon, LayoutGrid, Copy, QrCode, Coins, MessageSquare, CheckCircle2 } from "lucide-react";
import { BaziDetailedIntro, FengShuiDetailedIntro } from "./ProductIntros";
import { TraditionalPoster } from "./TraditionalPoster";
import { QRCodeSVG } from "qrcode.react";

const FPS_SERVICES = [
  { id: "bazi", name: "🔮 個人生辰八字命盤深度精批 (限時優惠)", price: 1440, type: "one-time" },
  { id: "fengshui", name: "🏠 住宅家居風水現場佈局實測 (限時優惠)", price: 2760, type: "one-time" },
  { id: "basic", name: "💎 基礎運勢訂閱 Plan", price: 99, type: "monthly" },
  { id: "pro", name: "💎 專業流月訂閱 Plan", price: 380, type: "monthly" },
  { id: "premium", name: "💎 尊貴風水訂閱 Plan", price: 1288, type: "monthly" },
  { id: "enterprise", name: "💎 小企業風水顧問訂閱 Plan", price: 3888, type: "monthly" },
  { id: "custom", name: "✍️ 自訂開運功德金額", price: 100, type: "custom" }
];

const generateFpsQrCodeString = (phone: string, amount: number, reference: string = "CNTSPAY") => {
  try {
    const pfi = "000201";
    const poi = "010211"; // Static payload is standard for simple open or fixed transfers
    
    // Merchant Account Info (Tag 26)
    const appId = "0015HK.COM.HKICL.FPS";
    const formattedPhone = phone.startsWith("+852") ? phone : `+852-${phone}`;
    const phoneSubtag = `02${formattedPhone.length.toString().padStart(2, '0')}${formattedPhone}`;
    const accountInfoValue = `${appId}${phoneSubtag}`;
    const accountInfo = `26${accountInfoValue.length.toString().padStart(2, '0')}${accountInfoValue}`;
    
    const mcc = "52040000";
    const currency = "5303344"; // 344 is HKD
    
    let amountTag = "";
    if (amount > 0) {
      const amountStr = amount.toFixed(2);
      amountTag = `54${amountStr.length.toString().padStart(2, '0')}${amountStr}`;
    }
    
    const countryCode = "5802HK";
    const merchantName = "Lam Hok Kan";
    const nameTag = `59${merchantName.length.toString().padStart(2, '0')}${merchantName}`;
    const cityTag = "6002HK";
    
    // Reference Template (Tag 62)
    const cleanRef = reference.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 25);
    const refLabel = `05${cleanRef.length.toString().padStart(2, '0')}${cleanRef}`;
    const refTag = `62${refLabel.length.toString().padStart(2, '0')}${refLabel}`;
    
    const payloadBeforeCRC = `${pfi}${poi}${accountInfo}${mcc}${currency}${amountTag}${countryCode}${nameTag}${cityTag}${refTag}6304`;
    
    // CRC16 CCITT
    let crc = 0xFFFF;
    for (let i = 0; i < payloadBeforeCRC.length; i++) {
      crc ^= payloadBeforeCRC.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
        } else {
          crc = (crc << 1) & 0xFFFF;
        }
      }
    }
    const crcHex = crc.toString(16).toUpperCase().padStart(4, '0');
    return `${payloadBeforeCRC}${crcHex}`;
  } catch (err) {
    console.error("Error generating FPS string", err);
    return `FPS:60798753?amount=${amount}`;
  }
};

export interface SubscriptionState {
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
    stripeLink: "https://buy.stripe.com/4gMeVd2iS7tUbZX48GbbG03",
    productId: "prod_UphkxOHq2KNzem",
    paymentLinkId: "4gMeVd2iS7tUbZX48GbbG03",
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
    stripeLink: "https://buy.stripe.com/4gMbJ19Lk15w6FD9t0bbG01",
    productId: "prod_UphgaeXHNDL5Ev",
    paymentLinkId: "4gMbJ19Lk15w6FD9t0bbG01",
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
    stripeLink: "https://buy.stripe.com/fZu9ATcXw4hI0hf34CbbG00",
    productId: "prod_UphhBgU8BUUxPz",
    paymentLinkId: "fZu9ATcXw4hI0hf34CbbG00",
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
    stripeLink: "https://buy.stripe.com/eVq8wP0aK7tUbZX20ybbG02",
    productId: "prod_UphkxOHq2KNzem",
    paymentLinkId: "eVq8wP0aK7tUbZX20ybbG02",
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

interface PaymentAndSubscriptionProps {
  subscription: SubscriptionState | null;
  isProcessingPayment: boolean;
  handleCheckout: (type: string, planName: string) => void;
  handleCancelSubscription: () => void;
  handleRemoveSubscription: () => void;
  handleSimulateSubscription: (planId: string) => void;
  triggerBlessing: (msg: string) => void;
  paymentError?: { message: string; planName: string; planId: string } | null;
  setPaymentError?: (err: { message: string; planName: string; planId: string } | null) => void;
  form?: any;
}

// 🟢 Dynamically generate personalized WhatsApp booking messages based on form parameters
const getWhatsAppUrlForCard = (type: "bazi" | "fengshui", form?: any) => {
  const name = form?.name ? `${form.name} 閣下` : "有緣人";
  const gender = form?.gender ? `（性別：${form.gender}）` : "";
  const phone = form?.phone ? `（聯絡電話：${form.phone}）` : "";
  const identity = form?.identity ? `（身份：${form.identity}）` : "";
  
  let text = "";
  if (type === "bazi") {
    const birthDateStr = form?.birthDate ? `\n- 出生日期：${form.birthDate}` : "";
    const birthTimeStr = (form?.birthTime || form?.birthHour) ? `\n- 出生時辰：${form.birthTime || (form.birthHour + ":" + form.birthMinute)}` : "";
    text = `【中聯家居風水命理 · 預約林師傅八字深度精批】
您好，林師傅！我是${name}${gender}，我想跟您預約一對一『🔮 個人生辰八字命盤深度精批』限時特惠套裝（特惠價 HK$1,440）。
希望能為我深度剖析未來 60 年之大運吉凶起伏、元神喜用五行佈局。${birthDateStr}${birthTimeStr}
謝謝林師傅，期待與您聯繫預約排期分析，幫我趨吉避凶！`;
  } else {
    const addressStr = form?.address ? `\n- 住宅地址：${form.address}` : "";
    text = `【中聯家居風水命理 · 預約林師傅實地勘察】
您好，林師傅！我是${name}${identity}，我想跟您預約親自上門的『🏠 住宅家居風水現場佈局實測』限時特惠服務（特惠價 HK$2,760）。
希望能安排林師傅親自帶羅盤登門勘測氣場格局，為我布設九宮飛星旺財催丁大局、迎福消災！${addressStr}${phone}
謝謝林師傅，期待與您連線諮詢！`;
  }
  
  return `https://wa.me/85291884964?text=${encodeURIComponent(text)}`;
};

export function PaymentAndSubscription({
  subscription,
  isProcessingPayment,
  handleCheckout,
  handleCancelSubscription,
  handleRemoveSubscription,
  handleSimulateSubscription,
  triggerBlessing,
  paymentError,
  setPaymentError,
  form
}: PaymentAndSubscriptionProps) {
  const [showPosters, setShowPosters] = useState(true);

  // FPS States
  const [fpsSelectedService, setFpsSelectedService] = useState("bazi");
  const [fpsPayerName, setFpsPayerName] = useState("");
  const [fpsPayerContact, setFpsPayerContact] = useState("");
  const [fpsCustomAmount, setFpsCustomAmount] = useState("100");
  const [fpsCopiedPhone, setFpsCopiedPhone] = useState(false);
  const [fpsCopiedAmount, setFpsCopiedAmount] = useState(false);
  const [fpsReportedSuccess, setFpsReportedSuccess] = useState(false);

  const selectedFpsItem = FPS_SERVICES.find(s => s.id === fpsSelectedService) || FPS_SERVICES[0];
  const fpsPrice = selectedFpsItem.id === "custom" 
    ? (parseFloat(fpsCustomAmount) || 0) 
    : selectedFpsItem.price;

  return (
    <div className="space-y-12 mt-12 pt-8 border-t-2 border-[#bfa15f]/25">
      {/* 🎨 宣傳海報與詳情切換 Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#590612]/5 via-[#bfa15f]/15 to-[#590612]/5 p-4 rounded-xl border border-[#bfa15f]/40 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎨</span>
          <div>
            <h4 className="text-sm font-black text-[#590612] font-serif">中聯天星 · 官方海報與詳情切換</h4>
            <p className="text-[11px] text-zinc-500 font-serif">您可切換觀看「官方紅包宣傳海報（與青衣實體地舖完全同步）」或「詳細權益清單」</p>
          </div>
        </div>
        <div className="flex bg-[#590612]/10 p-1 rounded-lg border border-[#590612]/20 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              setShowPosters(true);
              triggerBlessing("🎨 已為您切換至【官方紅包宣傳海報】模式！這與青衣實體店舖張貼的付款開運海報完全一致。");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-serif font-black transition-all cursor-pointer ${showPosters ? "bg-[#590612] text-white shadow-sm" : "text-[#590612] hover:bg-[#590612]/5"}`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>🎨 官方紅包海報</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowPosters(false);
              triggerBlessing("📋 已為您切換至【詳細權益清單】模式！您可以逐條閱讀最詳細的服務項目與合約細則。");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-serif font-black transition-all cursor-pointer ${!showPosters ? "bg-[#590612] text-white shadow-sm" : "text-[#590612] hover:bg-[#590612]/5"}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>📋 詳細權益清單</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* ⚠️ 支付狀態監控警告欄 */}
      {paymentError && (
        <div className="bg-rose-50/90 border-2 border-rose-200 rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden" id="inline-payment-error-banner">
          <div className="absolute right-3 top-3 text-rose-500/10 text-5xl font-black select-none pointer-events-none">⚠️</div>
          <div className="flex items-start gap-3.5">
            <div className="bg-rose-100 p-2.5 rounded-xl text-rose-600 font-bold flex-shrink-0 animate-pulse">
              ⚠️
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="text-sm font-black text-rose-900 font-serif tracking-wide">
                安全金流通道提示：暫時無法連接 Stripe 伺服器
              </h4>
              <p className="text-xs text-rose-700 leading-relaxed font-serif">
                我們偵測到您剛才嘗試辦理<strong>『{paymentError.planName}』</strong>付款時遭遇連線中斷或系統安全驗證攔截（錯誤代碼：<span className="font-mono text-[11px] bg-rose-100 px-1.5 py-0.5 rounded text-rose-800">{paymentError.message}</span>）。
              </p>
              <p className="text-xs text-zinc-600 leading-relaxed font-serif">
                不用擔心！為確保您的風水命理大氣不受任何延誤，我們的<strong>青衣分行特派秘書正線上待命</strong>，隨時提供人工綠色快速登記服務。您可直接點擊下方按鈕或聯繫我們的人工秘書，透過「轉數快 (FPS)」等本地方式輕鬆辦理。
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={`https://wa.me/85291884964?text=${encodeURIComponent(`您好，我剛才在網站上嘗試辦理『${paymentError.planName}』，但付款通道連線異常（訊息：${paymentError.message}）。請秘書人工協助我完成登記付款，謝謝！`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <span>💬 聯繫青衣秘書人工付費登記 (轉數快/預約)</span>
            </a>
            <button
              onClick={() => setPaymentError?.(null)}
              className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 rounded-xl text-xs font-bold text-center transition-colors"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      {showPosters ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-2">
            <div className="relative group">
              <TraditionalPoster id="bazi" onCheckout={handleCheckout} isProcessingPayment={isProcessingPayment} />
              
              {/* 🟢 WhatsApp 懸浮球 (Floating Bubble) */}
              <motion.a
                href={getWhatsAppUrlForCard("bazi", form)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerBlessing("🔮 大師賜福：元神凝聚、福星拱照！正在為您連線林大師以對接精批六十載大運走勢...")}
                className="absolute bottom-24 -right-4 z-30 bg-[#25d366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.6)] border-2 border-white hover:scale-110 active:scale-95 transition-all duration-300 group/wa cursor-pointer flex items-center justify-center animate-[bounce_3s_infinite_ease-in-out]"
                title="💬 一鍵 WhatsApp 預約諮詢林師傅"
              >
                <MessageSquare className="w-6 h-6 fill-current text-white" />
                <span className="absolute right-14 bg-zinc-900 text-white text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover/wa:opacity-100 transition-opacity pointer-events-none shadow-md font-serif border border-[#bfa15f]/40">
                  💬 WhatsApp 一鍵預約林大師親算 (精批八字)
                </span>
                
                {/* Ping decoration indicator */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </motion.a>
            </div>

            <div className="relative group">
              <TraditionalPoster id="fengshui" onCheckout={handleCheckout} isProcessingPayment={isProcessingPayment} />
              
              {/* 🟢 WhatsApp 懸浮球 (Floating Bubble) */}
              <motion.a
                href={getWhatsAppUrlForCard("fengshui", form)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerBlessing("🏠 大師賜福：生旺宅運、辟邪辟凶！正在為您對接林師傅登門為住宅實地布設羅盤大局...")}
                className="absolute bottom-24 -right-4 z-30 bg-[#25d366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.6)] border-2 border-white hover:scale-110 active:scale-95 transition-all duration-300 group/wa cursor-pointer flex items-center justify-center animate-[bounce_3s_infinite_ease-in-out]"
                title="💬 一鍵 WhatsApp 預約諮詢林師傅"
              >
                <MessageSquare className="w-6 h-6 fill-current text-white" />
                <span className="absolute right-14 bg-zinc-900 text-white text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover/wa:opacity-100 transition-opacity pointer-events-none shadow-md font-serif border border-[#bfa15f]/40">
                  💬 WhatsApp 一鍵預約林大師現場實勘 (住宅風水)
                </span>
                
                {/* Ping decoration indicator */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </motion.a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bazi 60 Year Grand Fortune Card */}
            <div className="relative group">
              <div className="bg-white/90 border-2 border-[#bfa15f]/40 rounded-2xl p-6 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full">
                <div className="absolute right-3 top-3 text-[#590612]/5 text-4xl font-black">🔮</div>
                <div className="space-y-3">
                  <span className="text-[10px] bg-amber-600 text-white font-sans px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                    大師八字全盤親算
                  </span>
                  <h4 className="text-lg font-black text-[#590612] font-serif tracking-wide">
                    🔮 個人生辰八字命盤深度精批
                  </h4>
                  <p className="text-xs text-ink-900 font-serif leading-relaxed">
                    <strong>林大師全神專注推算，深度剖析您整整 60 年之大運吉凶走勢！</strong>全面解密您的一生元神衰旺、喜用神配置，精準推導事業財富機遇、姻緣婚姻走勢、流年健康關卡，助您在人生的風浪中占盡先機、趨吉避凶。
                  </p>
                  <ul className="space-y-2 text-xs text-ink-900 font-serif pt-1">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>詳盡 60 年大運起伏與流年神批：</strong>每十年大運吉凶轉折精批。</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>本命五行元神喜忌開運指導：</strong>穿搭、方位、事業方向全面建議。</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>面對面/視訊一對一解盤：</strong>林師傅親自為您詳細解惑。</span>
                    </li>
                  </ul>
                  <BaziDetailedIntro />
                </div>

                <div className="pt-4 border-t border-[#bfa15f]/25 mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-ink-400 line-through block">原價 HK$4,800</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-[#590612]">限時優惠價 </span>
                      <span className="text-xl font-black text-[#590612] font-sans">HK$1,440</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:w-auto w-full">
                    <button 
                      type="button"
                      onClick={() => handleCheckout("bazi", "個人八字全盤精批")}
                      disabled={isProcessingPayment}
                      className="px-5 py-3 bg-gradient-to-r from-[#590612] to-[#800c1e] hover:from-[#800c1e] hover:to-[#590612] text-white text-center font-sans font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1 hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>🌐 立即線上付費預約</span>
                      <ChevronRight className="w-4 h-4 text-gold-200" />
                    </button>
                    <a 
                      href={getWhatsAppUrlForCard("bazi", form)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => triggerBlessing("🔮 大師賜福：元神凝聚、福星拱照！正在為您連線林大師以對接精批六十載大運走勢...")}
                      className="px-5 py-2 bg-[#25d366] hover:bg-[#20ba5a] text-white text-center font-sans font-extrabold text-[11px] rounded-xl shadow-xs transition-all flex items-center justify-center gap-1"
                    >
                      <span>💬 WhatsApp 快速鎖定名額</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 🟢 WhatsApp 懸浮球 (Floating Bubble) */}
              <motion.a
                href={getWhatsAppUrlForCard("bazi", form)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerBlessing("🔮 大師賜福：元神凝聚、福星拱照！正在為您連線林大師以對接精批六十載大運走勢...")}
                className="absolute bottom-24 -right-4 z-30 bg-[#25d366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.6)] border-2 border-white hover:scale-110 active:scale-95 transition-all duration-300 group/wa cursor-pointer flex items-center justify-center animate-[bounce_3.4s_infinite_ease-in-out]"
                title="💬 一鍵 WhatsApp 預約諮詢林師傅"
              >
                <MessageSquare className="w-6 h-6 fill-current text-white" />
                <span className="absolute right-14 bg-zinc-900 text-white text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover/wa:opacity-100 transition-opacity pointer-events-none shadow-md font-serif border border-[#bfa15f]/40">
                  💬 WhatsApp 一鍵預約林大師親算 (精批八字)
                </span>
                
                {/* Ping decoration indicator */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </motion.a>
            </div>

            {/* Feng Shui Real Survey Card */}
            <div className="relative group">
              <div className="bg-white/90 border-2 border-rose-200 rounded-2xl p-6 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full">
                <div className="absolute right-3 top-3 text-[#590612]/5 text-4xl font-black">🏠</div>
                <div className="space-y-3">
                  <span className="text-[10px] bg-rose-600 text-white font-sans px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                    大師現場風水勘察
                  </span>
                  <h4 className="text-lg font-black text-[#590612] font-serif tracking-wide">
                    🏠 住宅家居風水現場佈局實測
                  </h4>
                  <p className="text-xs text-ink-900 font-serif leading-relaxed">
                    <strong>實體地舖誠信保證！林師傅親自登門堪輿。</strong>結合您生辰八字與房屋的精準坐向、周邊磁場，為您的居所量身規劃九宮飛星旺財大陣、催文昌升職大局與避邪化煞神位。納福避凶，助您運勢起飛。
                  </p>
                  <ul className="space-y-2 text-xs text-ink-900 font-serif pt-1">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>林大師攜羅盤親上府邸：</strong>精準測量坐向與周邊磁場格局。</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>九宮飛星旺財催丁大陣：</strong>布設招財、防小人、催旺姻緣陣法。</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>專屬空間風水調整平面報告：</strong>贈送精美排版、永久珍藏的風水指南。</span>
                    </li>
                  </ul>
                  <FengShuiDetailedIntro />
                </div>

                <div className="pt-4 border-t border-[#bfa15f]/25 mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-ink-400 line-through block">原價 HK$9,200</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-[#590612]">限時優惠價 </span>
                      <span className="text-xl font-black text-[#590612] font-sans">HK$2,760</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:w-auto w-full">
                    <button 
                      type="button"
                      onClick={() => handleCheckout("fengshui", "住宅家居風水現場佈局實測")}
                      disabled={isProcessingPayment}
                      className="px-5 py-3 bg-gradient-to-r from-[#590612] to-[#800c1e] hover:from-[#800c1e] hover:to-[#590612] text-white text-center font-sans font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1 hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>🌐 立即線上付費預約</span>
                      <ChevronRight className="w-4 h-4 text-gold-200" />
                    </button>
                    <a 
                      href={getWhatsAppUrlForCard("fengshui", form)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => triggerBlessing("🏠 大師賜福：生旺宅運、辟邪辟凶！正在為您對接林師傅登門為住宅實地布設羅盤大局...")}
                      className="px-5 py-2 bg-[#25d366] hover:bg-[#20ba5a] text-white text-center font-sans font-extrabold text-[11px] rounded-xl shadow-xs transition-all flex items-center justify-center gap-1"
                    >
                      <span>💬 WhatsApp 快捷鎖定名額</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 🟢 WhatsApp 懸浮球 (Floating Bubble) */}
              <motion.a
                href={getWhatsAppUrlForCard("fengshui", form)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerBlessing("🏠 大師賜福：生旺宅運、辟邪辟凶！正在為您對接林師傅登門為住宅實地布設羅盤大局...")}
                className="absolute bottom-24 -right-4 z-30 bg-[#25d366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.6)] border-2 border-white hover:scale-110 active:scale-95 transition-all duration-300 group/wa cursor-pointer flex items-center justify-center animate-[bounce_3.4s_infinite_ease-in-out]"
                title="💬 一鍵 WhatsApp 預約諮詢林師傅"
              >
                <MessageSquare className="w-6 h-6 fill-current text-white" />
                <span className="absolute right-14 bg-zinc-900 text-white text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover/wa:opacity-100 transition-opacity pointer-events-none shadow-md font-serif border border-[#bfa15f]/40">
                  💬 WhatsApp 一鍵預約林大師現場實勘 (住宅風水)
                </span>
                
                {/* Ping decoration indicator */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </motion.a>
            </div>
          </div>
        )}

        <div className="text-center text-xs font-serif text-[#590612] font-semibold bg-[#590612]/5 rounded-xl py-3 border border-[#bfa15f]/20">
          📣 客人可在網上立即完成安全付費預約！林大師與秘書將在第一時間主動聯絡您，或撥打大師直撥專線 / 親臨青衣海悅花園 32 號實體地舖，開啟您一生的好運軌跡。
        </div>
      </div>

      {/* ⚡ 轉數快 (FPS) 零手續費免扣卡特快通道 */}
      <div id="fps_payment_section" className="bg-gradient-to-r from-[#590612]/5 via-amber-50/30 to-[#590612]/5 border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-lg">
        <div className="absolute right-[-10px] bottom-[-10px] text-amber-500/5 text-9xl font-black pointer-events-none select-none">⚡</div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#bfa15f]/20 pb-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full uppercase font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              ⚡ 本地免手續費通道 FPS FASTPAY
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#590612] tracking-wider font-serif flex items-center gap-2 mt-1">
              <span>轉數快 (FPS) 免卡付款 · 享福澤安康</span>
            </h3>
            <p className="text-xs text-ink-900 font-serif leading-relaxed">
              為減輕信用卡之第三方中介手續費，並將全數功德福報回饋施主，我們特設<strong>「轉數快 (FPS)」人工綠色管道</strong>。林師傅將親自開壇，為使用此管道付款的善信額外加持祈福！
            </p>
          </div>
          <div className="flex-shrink-0 bg-white border border-amber-200 rounded-xl p-3 shadow-xs flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-orange-600 flex flex-col items-center justify-center text-white text-[10px] font-extrabold shadow-sm select-none">
              <span className="leading-none text-xs">FPS</span>
              <span className="text-[7px] font-sans tracking-tighter scale-90 mt-0.5">轉數快</span>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-sans uppercase">Payee Account</p>
              <p className="text-xs font-black text-zinc-800 font-mono">6079 8753</p>
              <p className="text-[9px] text-amber-700 font-serif font-semibold">收款人: Lam Hok Kan (林學勤)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 左欄：付款設定資訊 */}
          <div className="lg:col-span-7 space-y-5 bg-white/75 backdrop-blur-xs p-5 rounded-xl border border-amber-200/40 shadow-sm">
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-[#590612] font-serif">
                1. 選擇要付款/預約的服務方案：
              </label>
              <select
                value={fpsSelectedService}
                onChange={(e) => {
                  setFpsSelectedService(e.target.value);
                  setFpsReportedSuccess(false);
                  triggerBlessing(`⚡ 已切換轉數快預算方案為【${FPS_SERVICES.find(s => s.id === e.target.value)?.name}】`);
                }}
                className="w-full bg-stone-50 border-2 border-stone-200 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-stone-800 font-serif font-black focus:outline-hidden transition-all"
              >
                {FPS_SERVICES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} {item.id !== "custom" && `(HK$${item.price})`}
                  </option>
                ))}
              </select>
            </div>

            {fpsSelectedService === "custom" && (
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-[#590612] font-serif">
                  ✍️ 輸入自訂開運/功德金額 (HKD)：
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-500">HK$</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="請輸入金額"
                    value={fpsCustomAmount}
                    onChange={(e) => {
                      setFpsCustomAmount(e.target.value);
                      setFpsReportedSuccess(false);
                    }}
                    className="w-full bg-stone-50 border-2 border-stone-200 focus:border-amber-500 rounded-xl pl-12 pr-3 py-2 text-xs text-stone-800 font-mono font-bold focus:outline-hidden transition-all"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 font-serif">
                  ※ 此處款項將直接入賬林大師開壇法器之購置與善緣積累。
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-stone-700 font-serif">
                  2. 付款人真實姓名 (用於系統核對)：
                </label>
                <input
                  type="text"
                  placeholder="例：陳大文"
                  value={fpsPayerName}
                  onChange={(e) => setFpsPayerName(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-stone-200 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-stone-800 font-serif font-bold focus:outline-hidden transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-stone-700 font-serif">
                  3. 聯絡電話 / WhatsApp (發送開運報告)：
                </label>
                <input
                  type="text"
                  placeholder="例：91234567"
                  value={fpsPayerContact}
                  onChange={(e) => setFpsPayerContact(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-stone-200 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-stone-800 font-mono font-bold focus:outline-hidden transition-all"
                />
              </div>
            </div>

            <div className="border-t border-amber-200/30 pt-4 space-y-3">
              <div className="text-xs font-serif text-stone-800 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 space-y-1.5">
                <span className="font-black text-[#590612] text-[11px] block flex items-center gap-1">
                  💡 電子銀行轉賬小提示 (如果您在手機上操作)：
                </span>
                <p className="text-[11px] text-stone-600">
                  如果您目前正使用本站的手機端，難以直接掃描右側二維碼，請直接複製下方資訊至您的銀行網上 App 辦理轉數快轉賬：
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-zinc-500 font-sans">FPS 收款人電話號碼</p>
                    <p className="font-mono font-extrabold text-stone-800 text-sm">6079 8753</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("60798753");
                      setFpsCopiedPhone(true);
                      triggerBlessing("📋 已為您複製轉數快號碼：60798753！請在銀行 App 貼上完成付費。");
                      setTimeout(() => setFpsCopiedPhone(false), 3000);
                    }}
                    className="mt-2 w-full py-1.5 bg-stone-200 hover:bg-stone-300 rounded-lg text-[10px] font-bold text-stone-700 transition-colors cursor-pointer flex items-center justify-center gap-1 animate-none"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{fpsCopiedPhone ? "已複製 ✓" : "複製電話號碼"}</span>
                  </button>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-zinc-500 font-sans">應付金額 (HKD)</p>
                    <p className="font-mono font-extrabold text-[#590612] text-sm">HK$ {fpsPrice.toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(fpsPrice.toString());
                      setFpsCopiedAmount(true);
                      triggerBlessing(`📋 已為您複製應付金額：${fpsPrice}元！請在銀行 App 中核對。`);
                      setTimeout(() => setFpsCopiedAmount(false), 3000);
                    }}
                    className="mt-2 w-full py-1.5 bg-stone-200 hover:bg-stone-300 rounded-lg text-[10px] font-bold text-stone-700 transition-colors cursor-pointer flex items-center justify-center gap-1 animate-none"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{fpsCopiedAmount ? "已複製 ✓" : "複製金額"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右欄：FPS 動態 QR CODE 與核對 */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full bg-gradient-to-b from-[#590612] to-[#800c1e] text-white p-5 rounded-2xl shadow-md border-2 border-[#bfa15f] space-y-4 relative overflow-hidden text-center max-w-xs mx-auto">
              {/* Phone Frame decoration */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black/40 rounded-full" />
              
              <div className="pt-2 text-[10px] tracking-widest font-sans font-black text-amber-300 uppercase">
                掃碼特快入賬 · 免卡手續費
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-inner inline-block relative border-2 border-amber-300">
                <QRCodeSVG
                  value={generateFpsQrCodeString("60798753", fpsPrice, `CNTS${fpsSelectedService.toUpperCase().substring(0,6)}`)}
                  size={180}
                  level="H"
                  includeMargin={false}
                />
                
                {/* Micro logo in QR Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-md border border-stone-200 shadow-sm">
                  <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center text-white font-extrabold text-[7px] leading-tight select-none">
                    FPS
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-center font-serif text-stone-100">
                <p className="text-xs font-black text-amber-200 flex items-center justify-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-amber-300" />
                  <span>打開網上銀行 / 八達通 / PayMe 掃描</span>
                </p>
                <p className="text-[10px] text-stone-200 leading-relaxed px-2">
                  支持 恆生、滙豐、中銀、渣打等所有香港主流銀行，自動識別收款人及預填金額。
                </p>
              </div>

              <div className="bg-white/10 border border-white/10 rounded-xl p-2.5 space-y-1 text-left font-serif text-[10px]">
                <div className="flex justify-between text-stone-200">
                  <span>收款機構:</span>
                  <span className="font-mono font-bold text-white">轉數快 (FPS)</span>
                </div>
                <div className="flex justify-between text-stone-200">
                  <span>收款帳戶:</span>
                  <span className="font-mono font-bold text-white">6079 8753</span>
                </div>
                <div className="flex justify-between text-stone-200">
                  <span>收款戶名:</span>
                  <span className="font-bold text-amber-200">Lam Hok Kan (林學勤)</span>
                </div>
                <div className="flex justify-between text-stone-200">
                  <span>付款備註 (Ref):</span>
                  <span className="font-mono font-bold text-white">CNTS{fpsSelectedService.toUpperCase()}</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/85291884964?text=${encodeURIComponent(
                    `您好，我已使用轉數快 (FPS) 付款支援林大師開運服務！\n\n【付款明細】\n服務方案：${selectedFpsItem.name}\n應付金額：HK$${fpsPrice}\n付款人姓名：${fpsPayerName || "未提供"}\n聯絡電話：${fpsPayerContact || "未提供"}\n付款備註碼：CNTS${fpsSelectedService.toUpperCase()}\n\n這是我剛轉賬成功的截圖，請秘書人工為我核實並開啟尊貴法會權益，謝謝！`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setFpsReportedSuccess(true);
                    triggerBlessing(`⚡ 功德無量！正在為您導向至 WhatsApp 與秘書人工核對『${selectedFpsItem.name}』的轉數快款項...`);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-serif font-black transition-all flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>💬 傳送付款截圖至 WhatsApp</span>
                </a>
              </div>
            </div>

            {/* 模擬登記成功與系統自主核實按鈕 */}
            <div className="mt-4 w-full max-w-xs space-y-2">
              <button
                type="button"
                onClick={() => {
                  setFpsReportedSuccess(true);
                  triggerBlessing(`🔮 福緣已結，喜氣洋洋！本命系統已即時為 ${fpsPayerName || "您"} 登記「轉數快免卡預約意向」。大師已將您的八字命盤載入青衣分行實體功德薄。林師傅及秘書將在一個工作天內主動聯絡您確認！`);
                }}
                className="w-full py-2 border border-dashed border-[#bfa15f]/40 hover:bg-[#bfa15f]/10 text-gold-700 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>🧪 模擬付款已完成 (免審核即時登記)</span>
              </button>

              {fpsReportedSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-[10px] text-emerald-800 font-serif leading-relaxed animate-fade-in">
                  🎉 <strong>登記成功！</strong>系統已成功建立您的 FPS 專屬善信核對工單。請儘快將轉賬截圖透過 WhatsApp 發送給特派秘書核實，以便即時啟用服務。
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 大師命理風水尊貴訂閱計劃 */}
      <div id="subscription_plans_section" className="space-y-8 pt-8 border-t-2 border-dashed border-[#bfa15f]/30">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 bg-[#590612]/5 border border-[#590612]/15 px-3 py-1 rounded-full">
            <Gem className="w-3.5 h-3.5 text-[#590612]" />
            <span className="text-[10px] sm:text-xs font-bold text-[#590612] tracking-wider uppercase font-sans">Premium Membership Plans</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#590612] tracking-widest font-serif">
            ☯ 中聯天星易理 · 尊貴專屬訂閱法門
          </h3>
          <p className="text-xs sm:text-sm text-ink-400 max-w-2xl mx-auto leading-relaxed font-serif">
            藉由古法乾坤推演，為您的居所磁場、生辰八字與企業商務注流引氣。每月自動扣款，隨時可自主取消。
          </p>
        </div>

        {subscription ? (
          /* 已訂閱狀態：大師會員中心 */
          <div className="bg-gradient-to-r from-[#590612]/5 to-[#bfa15f]/10 border-2 border-[#bfa15f]/60 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-lg">
            <div className="absolute -right-10 -bottom-10 text-[#590612]/5 text-[120px] font-black pointer-events-none select-none">☯</div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#bfa15f]/20 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-300/30 px-2.5 py-1 rounded-full font-sans inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  已啟用 Active
                </span>
                <h4 className="text-lg font-black text-ink-900 font-serif flex items-center gap-2 mt-1">
                  <span>尊貴會員服務：{subscription.planName}</span>
                </h4>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink-400 font-sans">會員檔案編號</p>
                <p className="text-sm font-mono font-bold text-[#590612]">SUB-{subscription.planId.toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-serif text-ink-900 bg-white/40 border border-[#bfa15f]/10 rounded-xl p-4">
              <div className="space-y-1">
                <p className="text-ink-400 font-sans">訂閱日期</p>
                <p className="font-bold text-sm text-ink-900">{subscription.subscribedAt}</p>
              </div>
              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-[#bfa15f]/15 pt-3 sm:pt-0 sm:pl-6">
                <p className="text-ink-400 font-sans">下次自動扣款日期</p>
                <p className="font-bold text-sm text-emerald-700">{subscription.nextBillingAt}</p>
              </div>
              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-[#bfa15f]/15 pt-3 sm:pt-0 sm:pl-6">
                <p className="text-ink-400 font-sans">扣款週期</p>
                <p className="font-bold text-sm text-[#590612]">每 1 個月 (按月自動循環)</p>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-bold text-[#590612] tracking-wider uppercase flex items-center gap-1.5 font-sans">
                <Info className="w-3.5 h-3.5" /> 方案權益簡介及退訂說明：
              </h5>
              <div className="text-xs leading-relaxed text-ink-400 space-y-2 font-serif bg-white/50 border border-gold-100 rounded-xl p-4">
                <p>
                  <strong>💎 方案權益：</strong>
                  {subscription.planId === "basic" && "每月定期為您推演精算八字運勢簡報、流月/流日吉凶走勢以及大師特調的開運色彩建議。報告將於每月 1 號自動發送至您登記的電郵中。"}
                  {subscription.planId === "pro" && "基礎內容全包，外加每月大師級別的「八字流月運程解碼」精裝 PDF 報告。同時附贈董公烏兔吉凶擇日吉時，助您在嫁娶、入宅或動土時獲得最佳氣場加持。"}
                  {subscription.planId === "premium" && "高級精算內容全包，更獲得由中聯大師親自全程跟進的「家居風水流年佈局套餐」。大師將根據您的住宅平面圖提供精准的九宮飛星催財/化煞佈局指引，每月可享受 1 次大師一對一熱線諮詢。"}
                  {subscription.planId === "enterprise" && "極致商業全包服務，專為中小企業/店鋪度身打造。包含企業辦公室風水與財神位催旺、合夥人八字契合天算、年度流年大報告以及全年 4 次大師親自上門勘察指導。"}
                </p>
                <p className="border-t border-gold-100 pt-2 text-ink-400">
                  <strong>⚠️ 取消訂閱說明：</strong>
                  本計劃採每月自動扣款。如需取消，您可隨時前往 Stripe Billing Portal 客戶門戶網站自主取消；亦可直接點擊下方「取消訂閱」按鈕，由本系統即時為您登記退訂。或撥打大師熱線 WhatsApp 9188 4964 聯絡秘書進行手動退訂。取消後，在當前已付款的週期結束前，您的全部權益依然有效。
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold tracking-wider transition-colors shadow"
              >
                隨時自主取消訂閱 (Stripe 門戶)
              </button>
              <button
                type="button"
                onClick={handleRemoveSubscription}
                className="px-4 py-2 border border-[#bfa15f]/40 hover:bg-[#bfa15f]/10 text-gold-700 rounded-lg text-xs font-bold tracking-wider transition-colors"
              >
                重置/返回選擇其他方案
              </button>
            </div>
          </div>
        ) : (
          /* 訂閱方案選擇網格 */
          <>
            {showPosters ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <TraditionalPoster id="basic" onCheckout={handleCheckout} isProcessingPayment={isProcessingPayment} />
                <TraditionalPoster id="pro" onCheckout={handleCheckout} isProcessingPayment={isProcessingPayment} />
                <TraditionalPoster id="premium" onCheckout={handleCheckout} isProcessingPayment={isProcessingPayment} />
                <TraditionalPoster id="enterprise" onCheckout={handleCheckout} isProcessingPayment={isProcessingPayment} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {PLANS_DATA.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`bg-gradient-to-b ${plan.bgGradient} border-2 ${plan.borderColors} rounded-2xl p-6 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
                  >
                    {/* Top Highlight Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="text-[9px] uppercase font-bold tracking-widest bg-[#590612]/10 text-[#590612] px-2 py-0.5 rounded-md font-sans">
                        {plan.badge}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-base font-black text-[#590612] font-serif tracking-wide">{plan.name}</h4>
                        <p className="text-[10px] text-ink-400 font-sans mt-0.5">{plan.tagline}</p>
                      </div>

                      <div className="py-2 border-y border-[#bfa15f]/10">
                        <span className="text-xs font-serif text-[#590612] font-black">HK$</span>
                        <span className="text-3xl font-black text-[#590612] font-sans tracking-tight ml-1">{plan.price}</span>
                        <span className="text-xs text-ink-400 font-serif"> / 月</span>
                      </div>

                      <p className="text-xs text-ink-900 leading-relaxed font-serif min-h-[48px]">
                        {plan.desc}
                      </p>

                      <ul className="space-y-2 pt-2 text-xs font-serif text-ink-900">
                        {plan.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#590612] flex-shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2.5 pt-6 mt-6 border-t border-[#bfa15f]/10">
                      {/* Stripe Real Subscription Button */}
                      <button 
                        type="button"
                        onClick={() => handleCheckout(plan.id, plan.name)}
                        disabled={isProcessingPayment}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 shadow transition-all duration-300 cursor-pointer ${plan.buttonColors} ${isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <span>💳 Stripe 立即訂閱</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      {/* Simulation Button for evaluation and zero-spend testing */}
                      <button
                        type="button"
                        onClick={() => handleSimulateSubscription(plan.id)}
                        className="w-full py-1.5 border border-dashed border-[#bfa15f]/40 hover:bg-[#bfa15f]/5 text-[10px] text-gold-700 rounded-lg transition-colors font-sans font-medium flex items-center justify-center gap-1"
                      >
                        <span>🧪 模擬支付成功 (測試功能)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 大公司風水顧問 Full Width Card */}
            <div className="bg-[#fbfaf7] border-2 border-dashed border-[#bfa15f]/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden mt-6">
              <div className="absolute right-3 top-3 text-[#590612]/5 text-3xl font-black select-none pointer-events-none">🏢</div>
              <div className="space-y-3 text-center md:text-left max-w-2xl">
                <div className="inline-flex items-center space-x-1.5 bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase">
                  企業定制 Enterprise
                </div>
                <h4 className="text-lg font-black text-ink-900 font-serif tracking-wide">
                  🏢 大公司風水顧問 計劃
                </h4>
                <p className="text-xs text-ink-400 font-serif leading-relaxed">
                  適合公司規模超過 50 人，或多於三間分行之大企業、上市集團。我們提供由中聯大師親自率領堪輿專家團隊，進行一對一深度空間氣場佈置、年度大運流年精算、總辦公室選址與開工擇日。
                </p>
                <p className="text-[10px] text-[#590612] font-semibold bg-[#590612]/5 px-3 py-1.5 rounded-lg border border-[#590612]/10 inline-block">
                  💡 備註：企業級計劃可按季或按年預付，歡迎撥打大師專線 <strong>WhatsApp 9188 4964</strong> 查詢客製化尊貴服務。
                </p>
              </div>
              <div className="flex-shrink-0 w-full md:w-auto">
                <a 
                  href="https://wa.me/85291884964?text=您好，我想諮詢中聯家居的大公司風水顧問服務（超過50人或3間分行）"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-6 py-3.5 bg-indigo-900 hover:bg-indigo-950 text-white border border-indigo-950 rounded-xl text-xs font-bold tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 shadow hover:scale-[1.02]"
                >
                  <span>💬 聯絡我們 WhatsApp 諮詢</span>
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-200" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
