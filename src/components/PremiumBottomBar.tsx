import React, { useState } from "react";
import { 
  Gem, 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  ExternalLink, 
  HelpCircle, 
  Calendar, 
  TrendingUp, 
  Compass, 
  DollarSign,
  Smartphone,
  CheckCircle2,
  Info
} from "lucide-react";

export interface SubscriptionState {
  planId: string;
  planName: string;
  status: "active" | "cancelled" | null;
  subscribedAt: string;
  nextBillingAt: string;
}

interface PremiumBottomBarProps {
  subscription: SubscriptionState | null;
  isProcessingPayment: boolean;
  handleCheckout: (type: string, planName: string) => void;
  handleCancelSubscription: () => void;
  handleRemoveSubscription: () => void;
  handleSimulateSubscription: (planId: string) => void;
  triggerBlessing: (msg: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export function PremiumBottomBar({
  subscription,
  isProcessingPayment,
  handleCheckout,
  handleCancelSubscription,
  handleRemoveSubscription,
  handleSimulateSubscription,
  triggerBlessing,
  isExpanded,
  setIsExpanded
}: PremiumBottomBarProps) {

  const directServices = [
    {
      id: "bazi",
      title: "🔮 八字命盤深度精批",
      price: "HK$1,440",
      originalPrice: "HK$4,800",
      desc: "大師親批60載大運與流年吉凶，避凶趨吉極致法門。",
      whatsappLink: "您好，我想向林師傅預約『八字全盤大運精算』(優惠價HK$1440)，我想精算60年大運，謝謝！"
    },
    {
      id: "fengshui",
      title: "🏠 住宅風水佈局實測",
      price: "HK$2,760",
      originalPrice: "HK$9,200",
      desc: "林師傅攜專業羅盤親自登門，布設九宮飛星旺財大陣。",
      whatsappLink: "您好，我想向林師傅預約『家居風水現場佈局實地勘察』(優惠價HK$2760)，謝謝！"
    }
  ];

  const plans = [
    { id: "basic", name: "基礎運勢 Plan", price: "99", desc: "每月運勢簡報、流日流月行事指南" },
    { id: "pro", name: "專業流月 Plan", price: "380", desc: "精裝流月解碼 PDF + 董公吉凶擇日" },
    { id: "premium", name: "尊貴風水 Plan", price: "1,288", desc: "風水流年套餐 + 每月大師熱線" },
    { id: "enterprise", name: "小企業顧問 Plan", price: "3,888", desc: "合夥八字合婚 + 辦公室財位催旺" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out font-sans">
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs -z-10 transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Main Container */}
      <div className="bg-gradient-to-r from-[#4a050f] via-[#240105] to-[#4a050f] border-t-2 border-[#bfa15f] shadow-[0_-8px_30px_rgba(89,6,18,0.5)] text-white overflow-hidden relative">
        {/* Traditional metaphysic watermarks */}
        <div className="absolute right-4 bottom-2 text-[#bfa15f]/5 text-8xl font-black pointer-events-none select-none font-serif">☯</div>
        <div className="absolute left-4 top-2 text-[#bfa15f]/5 text-8xl font-black pointer-events-none select-none font-serif">☯</div>

        {/* Floating golden border accents */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#bfa15f]/60 to-transparent" />

        {/* Collapsed/Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 relative z-10">
          
          {/* Logo and title */}
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 p-0.5 flex items-center justify-center shadow-[0_0_12px_rgba(254,221,0,0.4)] animate-pulse">
              <span className="text-[#590612] text-sm font-black font-serif">☯</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="bg-[#bfa15f]/20 border border-[#bfa15f]/40 text-yellow-300 text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-widest uppercase">
                  尊享會員特區
                </span>
                {subscription && (
                  <span className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wide">
                    已訂閱: {subscription.planName}
                  </span>
                )}
              </div>
              <h4 className="text-xs sm:text-sm font-black tracking-wider text-yellow-100 font-serif mt-0.5 flex items-center gap-1">
                <span>中聯家居風水命理 · 大師線上預約 & 訂閱法門</span>
              </h4>
            </div>
          </div>

          {/* Action buttons (Visible on Collapsed state for instant access) */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => handleCheckout("bazi", "個人八字全盤精批")}
              disabled={isProcessingPayment}
              className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-500 text-[#590612] font-extrabold text-[11px] rounded-lg shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              🔮 八字精批 HK$1,440
            </button>
            <button
              onClick={() => handleCheckout("fengshui", "住宅家居風水現場佈局實測")}
              disabled={isProcessingPayment}
              className="px-4 py-1.5 bg-gradient-to-r from-rose-500 to-red-700 hover:from-rose-400 hover:to-red-600 text-white font-extrabold text-[11px] rounded-lg shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              🏠 風水實測 HK$2,760
            </button>
            <div className="h-6 w-[1px] bg-white/10" />
          </div>

          {/* Scroll to Bottom Button */}
          <button
            onClick={() => {
              const el = document.getElementById("payment_and_subscription_section");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                triggerBlessing("🔮 已經為您導航至下方的「中聯天星易理 · 尊貴訂閱與大師親算」專區！");
              }
            }}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-yellow-200 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 border border-[#bfa15f]/30 transition-all cursor-pointer shadow-inner shrink-0"
          >
            <Gem className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            <span className="hidden sm:inline">
              查看大師親批 & 訂閱計劃
            </span>
            <span className="sm:hidden">
              預約訂閱
            </span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>

        {/* Interactive Expandable Bottom Section */}
        <div 
          className={`transition-all duration-500 ease-in-out ${
            isExpanded ? "max-h-[85vh] sm:max-h-[600px] opacity-100 border-t border-[#bfa15f]/30 py-6" : "max-h-0 opacity-0 pointer-events-none"
          } overflow-y-auto`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
            
            {/* Quick Header info inside expanded zone */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#bfa15f]/15 pb-4">
              <div>
                <h5 className="text-sm font-black text-yellow-400 tracking-wider font-serif flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>實體青衣店鋪誠信保證 · 每一筆付款均由 Stripe 3D 安全通道保障</span>
                </h5>
                <p className="text-[10px] text-zinc-300 font-serif mt-1">
                  隨時隨地，不論您正身處哪一個推演頁面，林大師的專業命理及家居風水全案皆對您敞開。
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-300">大師熱線:</span>
                <a 
                  href="https://wa.me/85291884964" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#25d366]/20 border border-[#25d366] text-[#25d366] font-extrabold text-[10px] rounded-lg hover:bg-[#25d366] hover:text-white transition-all flex items-center gap-1"
                >
                  WhatsApp 91884964
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Direct Master Booking Services */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center space-x-1.5 border-l-2 border-yellow-400 pl-2">
                  <span className="text-xs font-black tracking-widest text-yellow-300 font-serif">
                    大師親算預約 (一次性大特惠)
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {directServices.map((service) => (
                    <div 
                      key={service.id} 
                      className="bg-white/5 border border-[#bfa15f]/30 rounded-xl p-4 flex flex-col justify-between hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="space-y-1.5">
                        <h6 className="text-xs font-bold text-yellow-100 font-serif">{service.title}</h6>
                        <p className="text-[10px] text-zinc-300 leading-normal font-serif">
                          {service.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[9px] text-zinc-400 line-through">{service.originalPrice}</span>
                          <span className="text-xs font-black text-yellow-300">{service.price}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => handleCheckout(service.id, service.title)}
                            disabled={isProcessingPayment}
                            className="py-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-500 text-[#590612] font-extrabold text-[9px] rounded-lg tracking-wide shadow transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                          >
                            Stripe 預約
                          </button>
                          <a 
                            href={`https://wa.me/85291884964?text=${encodeURIComponent(service.whatsappLink)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => triggerBlessing(`🔮 正在連線林師傅... 特為您鎖定『${service.title}』優惠席位！`)}
                            className="py-1.5 bg-[#25d366]/90 hover:bg-[#20ba5a] text-white text-center font-extrabold text-[9px] rounded-lg tracking-wide transition-all flex items-center justify-center"
                          >
                            💬 WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Real Physical Address Trust info */}
                <div className="bg-[#590612]/40 border border-[#bfa15f]/20 rounded-xl p-3 text-[10px] font-serif leading-relaxed text-zinc-300">
                  🏠 <strong>中聯家居實體店面：</strong>青衣海悅花園 32 號實體地舖。由實體店面承保，隨時可親臨諮詢大師，網上付款或預約即可享有最高 3 折專屬優惠。
                </div>
              </div>

              {/* Right Column: Premium Subscription Plans / Active Membership Center */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center space-x-1.5 border-l-2 border-yellow-400 pl-2">
                  <span className="text-xs font-black tracking-widest text-yellow-300 font-serif">
                    {subscription ? "🔮 尊貴會員中心 · 服務管理" : "中聯天星易理 · 尊貴訂閱套餐"}
                  </span>
                </div>

                {subscription ? (
                  /* Active Member Center inside Bottom Bar */
                  <div className="bg-white/5 border border-[#bfa15f]/40 rounded-xl p-4 space-y-4 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                          已啟用 Active
                        </span>
                        <h4 className="text-sm font-black text-yellow-100 font-serif mt-1">
                          尊貴會員服務：{subscription.planName}
                        </h4>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-[9px] text-zinc-400">會員檔案編號</p>
                        <p className="text-xs font-mono font-bold text-yellow-400">SUB-{subscription.planId.toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-[10px] font-serif text-zinc-200 bg-white/5 border border-white/5 rounded-lg p-2.5">
                      <div>
                        <p className="text-zinc-400 text-[9px]">訂閱日期</p>
                        <p className="font-bold">{subscription.subscribedAt}</p>
                      </div>
                      <div className="border-l border-white/10 pl-3">
                        <p className="text-zinc-400 text-[9px]">下次扣款日期</p>
                        <p className="font-bold text-emerald-400">{subscription.nextBillingAt}</p>
                      </div>
                      <div className="border-l border-white/10 pl-3">
                        <p className="text-zinc-400 text-[9px]">扣款週期</p>
                        <p className="font-bold text-yellow-300">每1個月自動循環</p>
                      </div>
                    </div>

                    <div className="text-[10px] leading-relaxed text-zinc-300 font-serif space-y-1">
                      <p>
                        <strong>💎 尊享權益：</strong>
                        {subscription.planId === "basic" && "每月定期為您推演精算八字運勢簡報、流月/流日吉凶走勢以及大師特調的開運色彩建議。"}
                        {subscription.planId === "pro" && "基礎內容全包，外加每月大師級「八字流月運程解碼」PDF 報告及董公烏兔吉凶擇日吉時加持。"}
                        {subscription.planId === "premium" && "高級內容全包，獲得由大師親自全程跟進的「家居風水流年佈局套餐」，每月可享 1 次大師一對一諮詢。"}
                        {subscription.planId === "enterprise" && "極致商業全包服務，包含企業辦公室風水催旺、合夥人八字契合天算、年度流年大報告及全年 4 次大師上門勘察。"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-1.5 border-t border-white/5">
                      <button
                        type="button"
                        onClick={handleCancelSubscription}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer shadow-md"
                      >
                        隨時自主取消訂閱 (Stripe)
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveSubscription}
                        className="px-3 py-1.5 border border-[#bfa15f]/40 hover:bg-white/5 text-yellow-200 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        重置狀態 / 更換方案
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Plans grid when not subscribed */
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                      {plans.map((plan) => (
                        <div 
                          key={plan.id}
                          className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between hover:border-[#bfa15f]/40 hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-yellow-100 font-serif">{plan.name}</span>
                            </div>
                            <div className="text-xs font-extrabold text-yellow-400 font-mono">
                              HK${plan.price}<span className="text-[9px] font-normal text-zinc-400">/月</span>
                            </div>
                            <p className="text-[9px] text-zinc-300 font-serif leading-normal">
                              {plan.desc}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-white/5 space-y-1.5">
                            <button
                              onClick={() => handleCheckout(plan.id, plan.name)}
                              disabled={isProcessingPayment}
                              className="w-full py-1.5 bg-yellow-500 hover:bg-yellow-400 text-[#590612] font-black text-[9px] rounded-lg transition-all text-center cursor-pointer disabled:opacity-50"
                            >
                              💳 Stripe 訂閱
                            </button>
                            <button
                              onClick={() => handleSimulateSubscription(plan.id)}
                              className="w-full py-1 border border-dashed border-[#bfa15f]/30 text-[8px] text-yellow-200/70 hover:bg-[#bfa15f]/10 rounded transition-all text-center"
                            >
                              🧪 模擬啟用
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Subscriptions detail card/cancellation disclaimer */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-start gap-2 text-[10px] text-zinc-400 font-serif leading-relaxed">
                      <div className="p-1 bg-yellow-500/10 text-yellow-400 rounded-lg">
                        <Gem className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong>退訂聲明：</strong>所有訂閱計劃均採用每月自動扣款。您可以隨時前往 Stripe Portal 或在本系統中一鍵取消。取消後權益直到當期結束前完全有效，讓您毫無後顧之憂。
                      </div>
                    </div>
                  </>
                )}

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
