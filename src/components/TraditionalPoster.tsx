import React from "react";
import { Check, Shield, MapPin, Compass, Award, Calendar, TrendingUp, Sparkles, BookOpen, User, Home, ArrowRight } from "lucide-react";

export interface TraditionalPosterProps {
  id: "basic" | "pro" | "premium" | "enterprise" | "bazi" | "fengshui";
  onCheckout?: (id: string, name: string) => void;
  isProcessingPayment?: boolean;
}

export function TraditionalPoster({ id, onCheckout, isProcessingPayment = false }: TraditionalPosterProps) {
  // Configured data for each of the 6 flyers matching the exact graphics provided by the user
  const posterConfig = {
    basic: {
      title: "基礎運勢 Plan",
      price: "99",
      period: "/月",
      stripeId: "basic",
      stripeName: "基礎運勢 Plan",
      bgColor: "bg-[#fcfbf9]",
      accentColor: "#590612",
      badgeText: "日常運勢查詢",
      badge2Text: "基礎八字分析",
      slogan: "把握每日運勢變化 · 趨吉避凶 · 提升運程",
      bullets: [
        { title: "日常運勢查詢", desc: "掌握每日氣場吉凶" },
        { title: "基礎八字分析", desc: "解析先天本命屬性" }
      ],
      footerNote: "🏠 青衣海悅花園32號地舖 · 誠信保障"
    },
    pro: {
      title: "專業流月 Plan",
      price: "380",
      period: "/月",
      stripeId: "pro",
      stripeName: "專業流月 Plan",
      bgColor: "bg-[#fcfbf9]",
      accentColor: "#590612",
      badgeText: "流年預測",
      slogan: "把握每月運勢變化 · 趨吉避凶 · 提升運程",
      bullets: [
        { title: "每月運勢分析", desc: "流月磁場強弱起伏", icon: "📅" },
        { title: "流年預測", desc: "掌握年度大運關口", icon: "📈" },
        { title: "專業命理建議", desc: "林師傅專屬開運指南", icon: "🧭" }
      ],
      footerNote: "⛩️ 中聯家居風水命理專門店"
    },
    premium: {
      title: "尊貴風水 Plan",
      price: "1,288",
      period: "/月",
      stripeId: "premium",
      stripeName: "尊貴風水 Plan",
      bgColor: "bg-[#fcfbf9]",
      accentColor: "#590612",
      badges: ["🏠 家居風水佈局", "👤 專業風水顧問"],
      slogan: "專業分析 · 量身佈局 · 改善運勢",
      footerNote: "📍 青衣海悅花園32號地舖"
    },
    enterprise: {
      title: "小企業風水顧問 Plan",
      price: "3,888",
      period: "/月",
      stripeId: "enterprise",
      stripeName: "小企業風水顧問 Plan",
      bgColor: "bg-[#fcfbf9]",
      accentColor: "#590612",
      badgeText: "適合：商業風水佈局、企業風水顧問",
      slogan: "催旺企業磁場 · 商機亨通 · 基業長青",
      bullets: [
        { title: "專業分析", desc: "量身定制方案", icon: <Shield className="w-4 h-4 text-amber-500" /> },
        { title: "風水佈局", desc: "提升財運事業", icon: <Compass className="w-4 h-4 text-amber-500" /> },
        { title: "改善環境", desc: "增強企業運勢", icon: <TrendingUp className="w-4 h-4 text-amber-500" /> },
        { title: "持續支援", desc: "專業跟進建議", icon: <Award className="w-4 h-4 text-amber-500" /> }
      ],
      footerNote: "💼 實體地鋪誠信保證 · 助您開運起航"
    },
    bazi: {
      title: "八字60年大運深度精批",
      price: "1,440",
      originalPrice: "4,800",
      discount: "三折優惠",
      period: "",
      stripeId: "bazi",
      stripeName: "個人八字全盤精批",
      bgColor: "bg-[#fcfbf9]",
      accentColor: "#590612",
      slogan: "終身大運 · 掌握命運藍圖",
      bullets: [
        { num: "📅", title: "命局核心解碼", desc: "深度剖析八字格局，揭示先天優勢與挑戰" },
        { num: "📊", title: "60年大運詳批", desc: "每十年一運，把握人生關鍵轉機" },
        { num: "🔔", title: "流年逐歲吉凶提醒", desc: "精準預測每年運勢，趨吉避凶 · 防患未然" },
        { num: "🧭", title: "專屬改運策略", desc: "針對命局提供實用改運建議，提升運勢 · 改善人生" },
        { num: "📝", title: "書面報告+語音解說", desc: "詳細書面分析報告，專業語音解說更易懂" }
      ],
      footerNote: "☯ 林師傅全神親批 · 每日僅限 3 位"
    },
    fengshui: {
      title: "家居風水現場佈局實測",
      price: "2,760",
      originalPrice: "9,200",
      discount: "三折優惠",
      period: "",
      stripeId: "fengshui",
      stripeName: "住宅家居風水現場佈局實測",
      bgColor: "bg-[#fcfbf9]",
      slogan: "到府實勘 · 全案規劃 · 人宅合一",
      steps: [
        { step: "1", title: "現場精準測量", desc: "攜帶專業羅盤實地勘測（約 2-3 小時）" },
        { step: "2", title: "外局巒頭與內局理氣分析", desc: "雙軌大磁場綜合排盤，找準聚氣位" },
        { step: "3", title: "實用化煞與催旺方案", desc: "結合戶型圖提供催財/旺丁佈局（附圖解）" },
        { step: "4", title: "結合命理個人化佈局", desc: "融入宅主八字，實現人宅相合相生" },
        { step: "5", title: "清晰書面報告與後續跟進", desc: "提供精裝風水報告並提供一個月追蹤服務" }
      ],
      footerNote: "🛡️ 專業團隊 | 經驗豐富 | 口碑信賴 | 安心服務"
    }
  }[id];

  const handleAction = () => {
    if (onCheckout) {
      onCheckout(posterConfig.stripeId, posterConfig.stripeName);
    }
  };

  return (
    <div className={`relative border-4 border-[#590612] ${posterConfig.bgColor} rounded-2xl p-4 sm:p-6 shadow-2xl transition-all duration-300 hover:shadow-gold flex flex-col justify-between overflow-hidden max-w-md mx-auto`} id={`poster_${id}`}>
      {/* Royal decorative line on inner edge */}
      <div className="absolute inset-1 border-2 border-[#bfa15f]/60 rounded-xl pointer-events-none select-none z-10" />

      {/* Traditional Corner Ornaments */}
      <div className="absolute top-2 left-2 text-[#bfa15f]/80 text-lg z-20 font-serif">卍</div>
      <div className="absolute top-2 right-2 text-[#bfa15f]/80 text-lg z-20 font-serif">卍</div>
      <div className="absolute bottom-2 left-2 text-[#bfa15f]/80 text-lg z-20 font-serif">卍</div>
      <div className="absolute bottom-2 right-2 text-[#bfa15f]/80 text-lg z-20 font-serif">卍</div>

      {/* Poster Body */}
      <div className="space-y-4 relative z-20">
        
        {/* Flyer Header (Branding & Tags) */}
        <div className="flex items-center justify-between border-b border-[#bfa15f]/30 pb-3">
          {/* Brand Logo Watermark */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#590612] font-black text-xs font-serif tracking-tighter">中聯家居風水命理</span>
            <span className="text-[8px] border border-[#590612] text-[#590612] px-1 py-0.2 rounded font-bold scale-90">專門店</span>
          </div>
          {/* Badges */}
          <div className="flex gap-1">
            <span className="text-[7px] bg-[#590612] text-white px-1.5 py-0.5 rounded font-serif font-black">家居風水</span>
            <span className="text-[7px] border border-[#590612] text-[#590612] px-1.5 py-0.5 rounded font-serif font-black">八字命理/擇日</span>
          </div>
        </div>

        {/* Divider dot line */}
        <div className="flex items-center justify-center gap-1.5 text-[#bfa15f] text-[8px]">
          <span>••</span>
          <span className="border border-[#bfa15f] rounded-full p-0.5 text-[6px]">☯</span>
          <span>••</span>
        </div>

        {/* Poster Main Title */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-black text-[#590612] font-serif tracking-tight leading-tight px-1 drop-shadow-sm">
            {posterConfig.title}
          </h3>
        </div>

        {/* Divider line */}
        <div className="flex items-center justify-center gap-1.5 text-[#bfa15f] text-[8px]">
          <span className="w-12 h-[1px] bg-[#bfa15f]/40" />
          <span className="border border-[#bfa15f] rounded-full p-0.5 text-[6px]">☯</span>
          <span className="w-12 h-[1px] bg-[#bfa15f]/40" />
        </div>

        {/* Poster Pricing - Striking Gold Glow Style */}
        <div className="text-center py-2 flex flex-col items-center justify-center">
          {id === "premium" ? (
            /* Premium Plan specific pill price box */
            <div className="bg-[#590612] border-2 border-[#bfa15f] rounded-xl px-5 py-2 text-white shadow-md relative overflow-hidden group w-full max-w-[260px]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="text-center flex items-baseline justify-center gap-1.5">
                <span className="text-xs font-serif font-black text-yellow-300">HK$</span>
                <span className="text-3xl font-black text-yellow-400 font-sans tracking-tight drop-shadow-md">
                  1,288
                </span>
                <span className="text-xs font-serif text-yellow-200">/月</span>
              </div>
            </div>
          ) : posterConfig.originalPrice ? (
            /* Single-time pre-pay services (Bazi & Feng Shui) with discount */
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] bg-[#590612] text-white px-2 py-0.5 rounded-md font-serif font-bold">優惠價</span>
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-md font-sans font-black animate-pulse">{posterConfig.discount}</span>
              </div>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-xs font-serif font-black text-[#590612]">HK$</span>
                <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-600 to-amber-900 font-sans tracking-tight drop-shadow-sm">
                  {posterConfig.price}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 line-through font-mono font-bold">原價 HK${posterConfig.originalPrice}</p>
            </div>
          ) : (
            /* Standard Monthly Pricing */
            <div className="flex items-baseline justify-center gap-1.5">
              {id === "enterprise" && <span className="text-xs font-bold text-[#590612] bg-[#590612]/10 border border-[#590612]/20 px-1 py-0.2 rounded mr-1">月費</span>}
              <span className="text-xs font-serif font-black text-[#590612]">HK$</span>
              <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-600 to-amber-900 font-sans tracking-tight drop-shadow-sm">
                {posterConfig.price}
              </span>
              <span className="text-xs text-zinc-500 font-serif font-medium">{posterConfig.period}</span>
            </div>
          )}
        </div>

        {/* Poster Middle Badges */}
        {id === "premium" && (
          <div className="flex justify-center gap-2 py-1">
            {posterConfig.badges?.map((badge, idx) => (
              <span key={idx} className="bg-[#590612]/10 border border-[#bfa15f] text-[#590612] text-[10px] sm:text-xs px-3 py-1 rounded-full font-serif font-black flex items-center gap-1">
                <span>{idx === 0 ? "🏠" : "👤"}</span>
                <span>{badge}</span>
              </span>
            ))}
          </div>
        )}

        {id === "enterprise" && (
          <div className="bg-[#590612] text-white text-center rounded-lg py-1.5 px-3 text-[10px] font-bold font-serif max-w-[260px] mx-auto shadow border border-[#bfa15f]/50">
            🏢 適合：商業風水佈局、企業風水顧問
          </div>
        )}

        {/* Poster Feature list based on ID */}
        <div className="py-2">
          {/* Bullet/Content Section */}
          {id === "basic" && (
            <div className="space-y-2 bg-amber-500/5 border border-dashed border-[#bfa15f]/30 rounded-xl p-3 text-center">
              <div className="inline-block bg-[#590612] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full mb-1">
                日常運勢分析 ＋ 基礎八字
              </div>
              <p className="text-xs text-zinc-700 font-serif leading-relaxed px-2">
                每日運勢查詢、流日磁場吉凶分析，助您在日常行事中巧妙契合五行、開運避邪。
              </p>
            </div>
          )}

          {id === "pro" && (
            <div className="grid grid-cols-3 gap-2.5">
              {posterConfig.bullets?.map((bullet, idx) => (
                <div key={idx} className="bg-white border border-[#bfa15f]/30 rounded-lg p-2 text-center flex flex-col justify-between hover:border-[#590612]/40 transition-colors">
                  <span className="text-base mb-1">{bullet.icon}</span>
                  <p className="text-[10px] font-bold text-[#590612] font-serif leading-tight">{bullet.title}</p>
                </div>
              ))}
            </div>
          )}

          {id === "premium" && (
            <div className="bg-[#590612]/3 border border-dashed border-[#bfa15f]/40 rounded-xl p-3.5 space-y-1.5 text-center">
              <p className="text-[10px] text-zinc-500 font-mono">SERVICE FLOW</p>
              <p className="text-xs text-zinc-800 font-serif leading-relaxed font-bold">
                專業分析 • 量身佈局 • 改善運勢
              </p>
              <p className="text-[10px] text-[#590612] font-serif">
                結合九宮飛星佈置住宅財位、病位，每月尊享大師 1 對 1 私人熱線跟進。
              </p>
            </div>
          )}

          {id === "enterprise" && (
            <div className="grid grid-cols-2 gap-2">
              {posterConfig.bullets?.map((bullet, idx) => (
                <div key={idx} className="border border-zinc-200 bg-white p-2 rounded-lg flex items-center gap-1.5 shadow-xs">
                  <div className="p-1 bg-amber-50 rounded-md">{bullet.icon}</div>
                  <div>
                    <h5 className="text-[10px] font-black text-[#590612] font-serif">{bullet.title}</h5>
                    <p className="text-[8px] text-zinc-500">{bullet.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {id === "bazi" && (
            <div className="space-y-2.5 bg-white border border-zinc-100 rounded-xl p-3 shadow-inner">
              {posterConfig.bullets?.map((b, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[10px] text-zinc-700 leading-normal">
                  <span className="text-xs bg-[#590612]/10 p-0.5 rounded">{b.num}</span>
                  <div className="font-serif">
                    <strong className="text-[#590612]">{b.title}：</strong>{b.desc}
                  </div>
                </div>
              ))}
            </div>
          )}

          {id === "fengshui" && (
            <div className="space-y-2.5 bg-white border border-zinc-100 rounded-xl p-3 shadow-inner">
              {posterConfig.steps?.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[10px] text-zinc-700 leading-normal">
                  <span className="w-4 h-4 rounded-full bg-[#590612] text-white flex items-center justify-center text-[9px] font-black font-mono flex-shrink-0 mt-0.5">{s.step}</span>
                  <div className="font-serif">
                    <strong className="text-[#590612]">{s.title}：</strong>{s.desc}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider dot line */}
        <div className="flex items-center justify-center gap-1 bg-[#590612]/5 py-1.5 rounded-lg border border-[#bfa15f]/20">
          <span className="text-[10px] text-[#590612] font-serif font-black tracking-widest">{posterConfig.slogan}</span>
        </div>

        {/* Footer info banner */}
        <div className="text-center pt-2 text-[9px] text-zinc-500 font-serif border-t border-[#bfa15f]/20">
          {posterConfig.footerNote}
        </div>
      </div>

      {/* Buy Button inside Poster */}
      <div className="mt-4 pt-3 border-t border-zinc-100 z-20">
        <button
          type="button"
          onClick={handleAction}
          disabled={isProcessingPayment}
          className="w-full py-2.5 bg-gradient-to-r from-[#590612] to-[#8c1124] hover:from-[#8c1124] hover:to-[#590612] text-white font-serif font-black text-xs rounded-xl shadow-md hover:shadow-gold transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <span>{id === "bazi" || id === "fengshui" ? "🧧 立即付費預約大師" : "💳 立即付費開通 (Stripe)"}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
