import React, { useState } from "react";
import { Phone, Check, Copy, MessageSquare, Calendar, Globe, ExternalLink } from "lucide-react";

export function ContactWidget({ onTriggerBlessing }: { onTriggerBlessing?: (customMsg?: string) => void }) {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const phoneNumber = "91884964";
  const masterUrl = "https://www.mymasterlam.com/";
  const whatsappUrl = `https://wa.me/852${phoneNumber}?text=${encodeURIComponent(
    "您好！我正在瀏覽中聯家居風水命理專門店網頁，想諮詢家居風水佈局 / 八字命理服務，謝謝！"
  )}`;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(masterUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div 
      className="gilded-box rounded-2xl p-5 space-y-4 relative overflow-hidden"
      id="contact_widget_container"
    >
      {/* Visual background seal accent */}
      <div className="absolute right-[-15px] bottom-[-15px] text-[#590612]/5 pointer-events-none text-7xl font-bold select-none">
        中聯
      </div>

      <div className="border-b border-[#bfa15f]/20 pb-3">
        <span className="text-[10px] font-sans text-[#bfa15f] tracking-widest uppercase font-extrabold block">
          🔮 改變命運 · 從這一刻開始 | SECURE YOUR LUCK
        </span>
        <h3 className="text-base font-black text-[#590612] tracking-wider mt-1">
          中聯家居 · 林大師開運熱線
        </h3>
        <p className="text-[10px] text-ink-400 mt-1 font-serif leading-relaxed">
          實體店面誠信保障，林師傅親自接案。每日親算名額僅限 3 位，立即預約搶占先機！
        </p>
      </div>

      <div className="space-y-3">
        {/* Phone Card */}
        <div className="bg-[#fbfaf7] border border-[#bfa15f]/30 rounded-xl p-3 flex items-center justify-between shadow-xs hover:border-[#590612]/40 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="bg-[#590612] text-white p-2.5 rounded-xl shadow-sm">
              <Phone className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] text-[#590612] font-bold block font-sans">
                📞 24小時預約及專線直撥
              </span>
              <a 
                href={`tel:${phoneNumber}`} 
                className="text-lg font-black text-[#1f1b19] font-mono hover:text-[#590612] transition-colors"
              >
                {phoneNumber}
              </a>
            </div>
          </div>
          <button
            onClick={handleCopyPhone}
            className="p-1.5 hover:bg-gold-50 text-gold-700 rounded-lg transition-colors"
            title="複製電話號碼"
          >
            {copiedPhone ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Website Card */}
        <div className="bg-[#fbfaf7] border border-[#bfa15f]/30 rounded-xl p-3 flex items-center justify-between shadow-xs hover:border-[#590612]/40 transition-colors">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="bg-gold-500 text-white p-2.5 rounded-xl shadow-sm">
              <Globe className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[9px] text-[#8a713b] font-bold block font-sans">
                🌐 網上預約與信用卡安全付款
              </span>
              <a 
                href={masterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#590612] hover:underline flex items-center gap-1 truncate"
              >
                <span>進入林大師官方網站</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0 text-[#bfa15f]" />
              </a>
            </div>
          </div>
          <button
            onClick={handleCopyUrl}
            className="p-1.5 hover:bg-gold-50 text-gold-700 rounded-lg transition-colors flex-shrink-0"
            title="複製網址"
          >
            {copiedUrl ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* WhatsApp Card */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onTriggerBlessing?.("大師賜福：五行和合，家宅昌隆！專屬秘書與林大師即將與您優先排期對接...")}
          className="flex items-center justify-center space-x-2 w-full py-3 bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-extrabold tracking-widest transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:scale-[1.03] active:scale-[0.98]"
        >
          {/* Custom SVG WhatsApp Logo */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.432 5.435.1 12.007.1c3.184.001 6.182 1.242 8.438 3.499 2.256 2.257 3.493 5.257 3.493 8.44 0 6.57-5.432 11.901-12.005 11.901-2.005-.001-3.975-.506-5.714-1.468L0 24zm6.59-4.846c1.6.95 3.498 1.452 5.411 1.453 5.434 0 9.853-4.385 9.856-9.774.001-2.611-1.015-5.066-2.862-6.914C17.207 2.071 14.733.957 12.01.957 6.625.957 2.206 5.34 2.203 10.73c0 1.912.499 3.778 1.447 5.39L2.664 20.87l4.783-1.254-.799-.462zM17.84 14.5c-.32-.16-1.89-.93-2.18-1.04-.3-.1-.51-.16-.72.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.18.21-.31.32-.51.11-.21.05-.39-.03-.55-.08-.17-.72-1.73-.99-2.38-.26-.63-.52-.54-.72-.55-.18 0-.39-.01-.6-.01s-.55.08-.84.4c-.29.32-1.11 1.09-1.11 2.66s1.14 3.1 1.3 3.3c.16.2 2.24 3.42 5.43 4.8 1.9.82 2.61.88 3.54.74.56-.08 1.89-.77 2.15-1.52.27-.75.27-1.4.19-1.52-.08-.12-.3-.19-.62-.35z" />
          </svg>
          <span>💬 一鍵 WhatsApp 鎖定優惠預約</span>
        </a>

        {/* Offline branch helper */}
        <div className="bg-[#590612]/5 border border-[#590612]/15 rounded-xl p-3.5 space-y-2 text-xs text-gray-700 shadow-2xs">
          <p className="font-extrabold text-[#590612] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#590612]" />
            <span>青衣分行 · 實體地舖指引：</span>
          </p>
          <ul className="space-y-1.5 pl-1 text-[11px] leading-relaxed text-ink-900 font-serif">
            <li>📍 <strong>店面地址：</strong>青衣海悅花園 32 號地舖（地鐵站出口步行即達）</li>
            <li>🕒 <strong>營業時間：</strong>10:00 - 20:00（敬請提早網上或致電預約）</li>
            <li>💼 <strong>當店主持：</strong>林師傅親算（榮獲無數好評，深受信賴）</li>
            <li>🔥 <strong>熱門預約：</strong>家居風水精裝現場佈局（HK$2,760起，助您事業財運雙飛）、個人八字 60 年大運精批（HK$1,440起，指點迷津）</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
