import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, CheckCircle, HelpCircle, Shield, Award, Sparkles, AlertCircle } from "lucide-react";

export function BaziDetailedIntro() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#bfa15f]/25 rounded-xl bg-amber-50/20 overflow-hidden text-xs mt-3">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between bg-gradient-to-r from-amber-100/30 to-amber-50/10 hover:from-amber-100/50 text-[#590612] font-black tracking-wider transition-all"
      >
        <span className="flex items-center gap-1.5 font-serif text-[11px]">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-600" />
          <span>查看「八字深度精批」詳盡全案大綱</span>
        </span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-[#bfa15f]/15"
          >
            <div className="p-4 space-y-4 text-ink-900 font-serif leading-relaxed bg-white">
              <div className="p-2.5 bg-amber-50/50 border border-amber-200/50 rounded-lg text-[11px] text-justify">
                💡 <strong>這不只是「排八字」</strong>，而是涵蓋終身大運軌跡的系統性命理顧問服務。原價 <strong>HK$4,800</strong>，現以三折特惠提供。重點內容包括：
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <h5 className="font-extrabold text-[#590612] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#590612] rounded-full" />
                    1. 命局核心解碼
                  </h5>
                  <p className="text-ink-400 pl-3 text-[11px] text-justify">
                    精確排出四柱八字（年、月、日、時），分析日主旺衰、五行強弱、十神配置。揭示先天「用神」與「忌神」，點出您天生最有利的五行方向（如喜火忌水），作為日後所有決策（事業、顏色、方位）的根本依據。
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-extrabold text-[#590612] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#590612] rounded-full" />
                    2. 60年大運詳批（每十年一運）
                  </h5>
                  <p className="text-ink-400 pl-3 text-[11px] text-justify">
                    從起運歲數開始，逐運分析「大運干支」對命局的影響，標出人生六大黃金期（財運高峰、事業突破點）與六大低潮期（需保守、避險之年）。特別標注「換運交界年」的注意事項（如轉職、搬遷、投資時機）。
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-extrabold text-[#590612] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#590612] rounded-full" />
                    3. 流年逐歲吉凶提醒（重點年份）
                  </h5>
                  <p className="text-ink-400 pl-3 text-[11px] text-justify">
                    不僅看大運，更聚焦未來10年內每個流年的關鍵影響（如犯太歲、沖合夫妻宮、財星受剋），給出具體行動建議（如哪年宜結婚、哪年忌合夥、哪年利置業）。
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-extrabold text-[#590612] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#590612] rounded-full" />
                    4. 專屬改運策略
                  </h5>
                  <p className="text-ink-400 pl-3 text-[11px] text-justify">
                    結合命理，推薦個人幸運數字、顏色、行業類別、貴人屬相。提供簡易「居家或辦公方位」調整建議（如書桌宜向某方位），讓八字與風水初步呼應。
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-extrabold text-[#590612] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#590612] rounded-full" />
                    5. 書面報告 + 語音解說
                  </h5>
                  <p className="text-ink-400 pl-3 text-[11px] text-justify">
                    交付一份詳盡的書面報告（約10-15頁），並附贈一次30分鐘線上語音解說，由林師傅親自拆解重點，確保您完全理解。
                  </p>
                </div>
              </div>

              <div className="bg-[#590612]/5 border border-[#590612]/15 p-3 rounded-lg flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#590612] flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-[#590612] font-semibold leading-relaxed">
                  💡 <strong>優惠價值點：</strong>此價涵蓋終身大運，等同每年只需 <strong>HK$24</strong> 即可掌握命運藍圖，遠低於市場同類服務（一般單年流年批算已索價 HK$800-1,200）。
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FengShuiDetailedIntro() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-rose-200 rounded-xl bg-rose-50/20 overflow-hidden text-xs mt-3">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between bg-gradient-to-r from-rose-100/30 to-rose-50/10 hover:from-rose-100/50 text-[#590612] font-black tracking-wider transition-all"
      >
        <span className="flex items-center gap-1.5 font-serif text-[11px]">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-rose-600" />
          <span>查看「家居風水實測」全套服務內容</span>
        </span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-rose-200"
          >
            <div className="p-4 space-y-4 text-ink-900 font-serif leading-relaxed bg-white">
              <div className="p-2.5 bg-rose-50/50 border border-rose-200/50 rounded-lg text-[11px] text-justify">
                💡 <strong>此服務為「到府實勘」的全案規劃</strong>，原價 <strong>HK$9,200</strong>，現以三折超值提供。內容遠超一般「擺陣」，而是空間能量系統性改造：
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <h5 className="font-extrabold text-[#590612] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#590612] rounded-full" />
                    1. 現場精準測量（約2-3小時）
                  </h5>
                  <p className="text-ink-400 pl-3 text-[11px] text-justify">
                    林師傅親赴府上，使用羅盤定坐向，測量門、窗、灶、廁、床的絕對方位，並記錄室內外氣流、光線、動線及周邊環境（路沖、天斬煞、反弓水等）。
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-extrabold text-[#590612] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#590612] rounded-full" />
                    2. 外局「巒頭」與內局「理氣」雙軌分析
                  </h5>
                  <p className="text-ink-400 pl-3 text-[11px] text-justify mb-1">
                    <strong>外局：</strong>評估大廈周邊形勢（前後左右建築物高低、道路走向），判斷是否「藏風聚氣」，或有哪些隱形煞氣影響全家健康與事業。
                  </p>
                  <p className="text-ink-400 pl-3 text-[11px] text-justify">
                    <strong>內局：</strong>細分「門、主、灶」三要，計算「財位、文昌位、桃花位、病符位」等八宅吉凶方，並針對每個家庭成員的八字用神，規劃專屬房間或床位的最佳方位。
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-extrabold text-[#590612] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#590612] rounded-full" />
                    3. 實用化煞與催旺方案（附圖解）
                  </h5>
                  <p className="text-ink-400 pl-3 text-[11px] text-justify mb-1">
                    針對橫樑壓頂、廁所居中、入門見灶等常見難題，提供不裝修、不拆牆的輕量化解法（如屏風材質、燈光色溫、植物品種、鏡子擺放角度）。
                  </p>
                  <p className="text-ink-400 pl-3 text-[11px] text-justify">
                    同時設計財位加強陣（結合流年飛星與宅運），建議擺放何種吉祥物（如水晶、聚寶盆）及其確切位置與朝向。
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-extrabold text-[#590612] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#590612] rounded-full" />
                    4. 結合命理個人化佈局
                  </h5>
                  <p className="text-ink-400 pl-3 text-[11px] text-justify">
                    將戶主或家人的八字命盤融入風水設計，讓「人宅合一」效果最大化（例如：命主喜木，則在東方多用綠色與木質元素）。
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-extrabold text-[#590612] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#590612] rounded-full" />
                    5. 清晰書面報告 + 一個月後續跟進
                  </h5>
                  <p className="text-ink-400 pl-3 text-[11px] text-justify">
                    交付圖文並茂的風水報告，內含所有測量數據、調整前後對比、具體執行步驟。服務後30天內可免費遠端諮詢一次，解決執行時的疑問或微調。
                  </p>
                </div>
              </div>

              <div className="bg-[#590612]/5 border border-[#590612]/15 p-3 rounded-lg flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#590612] flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-[#590612] font-semibold leading-relaxed">
                  💡 <strong>優惠價值點：</strong>市場上單次到府風水勘察動輒 <strong>HK$5,000</strong> 起，此優惠價不僅含勘察、報告，還附帶命理結合與後續跟進，等同一次服務滿足兩大需求。
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
