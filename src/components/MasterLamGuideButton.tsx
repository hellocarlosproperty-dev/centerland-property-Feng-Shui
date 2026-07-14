import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, MessageSquare, MapPin, Sparkles, X, ChevronRight, Compass, Shield, Award } from "lucide-react";

export function MasterLamGuideButton({ onTriggerBlessing }: { onTriggerBlessing?: (msg: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "91884964";
  const whatsappUrl = `https://wa.me/852${phoneNumber}?text=${encodeURIComponent(
    "您好，林師傅！我正在瀏覽中聯家居網頁，想與您預約一對一深度分析，協助我避凶趨吉、調理家居氣運，謝謝！"
  )}`;

  const handleWhatsAppClick = () => {
    onTriggerBlessing?.("🔮 大師賜福：五行流轉、迎福消災！正在連線林師傅，為您特別安排一對一深度排期分析...");
    setIsOpen(false);
    setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }, 1200);
  };

  const handlePhoneClick = () => {
    onTriggerBlessing?.("📞 正在撥打林師傅預約專線：91884964...");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Badge on the Bottom-Right */}
      <div className="fixed bottom-24 right-4 z-40" id="floating_master_lam_badge">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2 bg-gradient-to-r from-[#590612] via-[#800c1e] to-[#590612] text-white px-4 py-3 rounded-full shadow-[0_4px_20px_rgba(89,6,18,0.4)] border border-[#bfa15f]/80 hover:border-[#bfa15f] hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
          animate={{
            boxShadow: [
              "0 4px 20px rgba(89,6,18,0.4)",
              "0 4px 25px rgba(254,221,0,0.5)",
              "0 4px 20px rgba(89,6,18,0.4)"
            ]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Pulsing Dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500"></span>
          </span>

          <Compass className="w-4 h-4 text-yellow-300 animate-[spin_12s_linear_infinite]" />
          
          <span className="text-xs font-black tracking-widest font-serif text-yellow-100 group-hover:text-white transition-colors">
            趨吉避凶 ➔ 預約林師傅親算
          </span>
        </motion.button>
      </div>

      {/* Modal/Dialog Guide Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="master_guide_modal_container">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-[#fbfaf7] border-2 border-[#bfa15f] w-full max-w-lg rounded-2xl shadow-[0_15px_50px_rgba(89,6,18,0.3)] overflow-hidden relative z-10"
            >
              {/* Decorative Header Banner */}
              <div className="bg-gradient-to-r from-[#3b020a] via-[#590612] to-[#3b020a] p-4 text-center border-b-2 border-[#bfa15f]/80 relative">
                {/* Traditional Chinese motif seals */}
                <div className="absolute left-3 top-3 text-white/5 text-4xl select-none pointer-events-none font-serif">☯</div>
                <div className="absolute right-3 top-3 text-white/5 text-4xl select-none pointer-events-none font-serif">☯</div>
                
                <h3 className="text-yellow-100 font-serif font-black text-base tracking-widest">
                  ☯ 中聯專屬 · 趨吉避凶極致法門 ☯
                </h3>
                <p className="text-[10px] text-zinc-300 font-serif mt-1">
                  一對一深度生辰合參與實地磁場勘測 · 助您全家大開鴻運
                </p>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-3 top-3 p-1 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 sm:p-6 space-y-4">
                
                {/* Master Core Message Accent Block */}
                <div className="bg-[#590612]/5 border border-[#590612]/15 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#590612]" />
                    <h4 className="text-sm font-black text-[#590612] font-serif">
                      為什麼全域導向「林師傅一對一親算」最重要？
                    </h4>
                  </div>
                  <p className="text-xs text-ink-900 font-serif leading-relaxed text-justify">
                    系統演算法是大數據的科學初判，能夠為您推算基本的先天五行比例與流年大概。但真正的<strong>空間風水奧秘，唯有一對一「因人、因地、因時」點石成金。</strong>
                  </p>
                  <p className="text-xs text-ink-900 font-serif leading-relaxed text-justify">
                    電腦程序無法知道您房屋的實地層數、窗外路沖天斬煞、室內家具五行沖剋及動線。<strong>林師傅親自分析</strong>能將您的生辰八字與家居九宮飛星完美合參，為您制定最詳細的調候與佈局，真正助您<strong>趨吉避凶（空）</strong>。
                  </p>
                </div>

                {/* Scope of Analysis */}
                <div className="space-y-2">
                  <span className="text-[10px] text-gold-700 tracking-wider font-extrabold uppercase block">
                    🌟 林師傅親算 · 深度分析項目範疇
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-serif">
                    <div className="bg-white border border-[#bfa15f]/20 rounded-lg p-2.5 flex items-center gap-2 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>六十載大運深度親批</span>
                    </div>
                    <div className="bg-white border border-[#bfa15f]/20 rounded-lg p-2.5 flex items-center gap-2 shadow-2xs">
                      <Compass className="w-3.5 h-3.5 text-rose-700 flex-shrink-0" />
                      <span>實地羅盤坐向精確勘測</span>
                    </div>
                    <div className="bg-white border border-[#bfa15f]/20 rounded-lg p-2.5 flex items-center gap-2 shadow-2xs">
                      <Shield className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>九運煞氣避邪化煞佈局</span>
                    </div>
                    <div className="bg-white border border-[#bfa15f]/20 rounded-lg p-2.5 flex items-center gap-2 shadow-2xs">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span>住宅/商舖催財法水安設</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Contacts */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[10px] text-gold-700 tracking-wider font-extrabold uppercase block">
                    💬 立即與大師取得聯繫
                  </span>

                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full py-3 bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-black tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>一鍵 WhatsApp 諮詢林師傅 (鎖定3折)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={`tel:${phoneNumber}`}
                      onClick={handlePhoneClick}
                      className="py-2.5 bg-white border-2 border-[#590612] text-[#590612] hover:bg-[#590612]/5 text-center rounded-xl text-xs font-extrabold tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>直撥大師專線</span>
                    </a>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        const bottomBar = document.getElementById("payment_and_subscription_section");
                        if (bottomBar) {
                          bottomBar.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                      className="py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-500 text-[#590612] text-center rounded-xl text-xs font-extrabold tracking-wider transition-all flex items-center justify-center gap-1"
                    >
                      <span>💳 網上預約親批</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Location reminder */}
                <div className="border-t border-[#bfa15f]/15 pt-3.5 flex items-start gap-2 text-[10px] text-ink-400 font-serif leading-relaxed">
                  <MapPin className="w-3.5 h-3.5 text-[#590612] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>青衣海悅花園 32 號實體地舖：</strong>隨時歡迎親臨諮詢！實體地舖誠信保障，大師親算更有保障，助您全家安康、福澤延綿。
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
