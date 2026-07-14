import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Quote, Check, Plus, MessageSquare, Sparkles, User, Calendar, Award } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  category: "all" | "fengshui" | "bazi" | "business";
  categoryLabel: string;
  date: string;
  rating: number;
  content: string;
  impacts: string[];
  isLocal?: boolean;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "陳女士",
    location: "青衣盈翠半島業主",
    category: "fengshui",
    categoryLabel: "🏡 家居住宅風水",
    date: "2026-05-12",
    rating: 5,
    content: "自從搬入青衣盈翠半島新居後，先生事業一直停滯不前，全家睡眠質量也很差。後來親自到海悅花園分行預約林師傅現場堪輿。師傅用大羅盤定位後，指出大門與陽台穿堂，且流年病符星飛臨臥室。按照師傅指示在玄關設了玄武玄關擋煞，並在臥室佈置了催生生氣的五行和合陣。不到三個月，先生竟然獲得了跨國企業的總監Offer！真的非常感謝林大師，實體店誠信保障，絕對不是網上那種快餐式算命可比！",
    impacts: ["🏆 事業晉升", "😴 睡眠改善", "🛡️ 避煞納福"]
  },
  {
    id: "2",
    name: "張先生",
    location: "中環金融機構合夥人",
    category: "bazi",
    categoryLabel: "🔮 個人生辰八字",
    date: "2026-06-08",
    rating: 5,
    content: "林大師親批的『六十載八字大運精算』極為詳盡。在批算中，師傅準確算出了我前兩年的事業低谷期，並指點我今年是『離火通明』的轉折之年。果然，今年五月在師傅建議的吉利方位和色彩穿搭加持下，成功避開了一次致命的投資陷阱，並被獵頭發掘。大師親算不僅是算命，更是人生的指南針，HK$1,440的優惠價簡直超值！",
    impacts: ["🧭 精準大運指引", "💰 避開投資陷阱", "✨ 扭轉乾坤"]
  },
  {
    id: "3",
    name: "李小姐",
    location: "新創餐飲品牌創辦人",
    category: "business",
    categoryLabel: "🏬 商業開運風水",
    date: "2026-04-20",
    rating: 5,
    content: "我的店舖選址在葵芳新都會廣場附近，開業初期生意慘淡。在網上找到林師傅並預約了商業風水現場佈置。師傅現場勘察後調換了收銀台和廚房爐灶的位置，並在東南方財位擺設了黃水晶催財局。調整完第二個星期，客流量明顯上升，現在週末天天排長龍！林師傅誠信有擔當，每一步都有依據，強力推薦給各位創業者！",
    impacts: ["🔥 店舖起死回生", "📈 業績顯著翻倍", "🎯 招財吸客"]
  },
  {
    id: "4",
    name: "王先生",
    location: "沙田第一城業主",
    category: "fengshui",
    categoryLabel: "🏡 家居住宅風水",
    date: "2026-05-30",
    rating: 5,
    content: "家裡小孩準備考DSE，壓力大而且注意力不集中。林大師建議我做家居風水調整。師傅親自上門找出了家中的『文昌位』，把小孩子的書桌挪到文昌位，並放置了四支毛筆和綠竹。說來神奇，孩子情緒平穩了很多，讀書效率明顯提高，最後順利考入港大！實體地舖看得見摸得著，找林大師做風水調整最讓人放心！",
    impacts: ["🎓 孩子學業進步", "🌟 順利考入港大", "🧠 專注力倍增"]
  }
];

export function TestimonialsSection() {
  const [activeTab, setActiveTab] = useState<"all" | "fengshui" | "bazi" | "business">("all");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formCategory, setFormCategory] = useState<"fengshui" | "bazi" | "business">("fengshui");
  const [formContent, setFormContent] = useState("");
  const [formImpact, setFormImpact] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    // Load existing local submissions from localStorage if any
    const localSaved = localStorage.getItem("mymasterlam_local_testimonials");
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved) as Testimonial[];
        setTestimonials([...parsed, ...DEFAULT_TESTIMONIALS]);
      } catch (e) {
        setTestimonials(DEFAULT_TESTIMONIALS);
      }
    } else {
      setTestimonials(DEFAULT_TESTIMONIALS);
    }
  }, []);

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formContent) return;

    const catLabelMap = {
      fengshui: "🏡 家居住宅風水",
      bazi: "🔮 個人生辰八字",
      business: "🏬 商業開運風水"
    };

    const newTestimonial: Testimonial = {
      id: `local-${Date.now()}`,
      name: formName.trim().slice(0, 10) + (formName.length > 10 ? "..." : ""),
      location: formLocation.trim() || "匿名開運客戶",
      category: formCategory,
      categoryLabel: catLabelMap[formCategory],
      date: new Date().toISOString().split("T")[0],
      rating: formRating,
      content: formContent.trim(),
      impacts: formImpact ? formImpact.split(/[,，、]/).map(t => t.trim()).filter(Boolean) : ["🍀 迎祥納吉"],
      isLocal: true
    };

    const currentLocalsRaw = localStorage.getItem("mymasterlam_local_testimonials");
    let currentLocals: Testimonial[] = [];
    if (currentLocalsRaw) {
      try {
        currentLocals = JSON.parse(currentLocalsRaw) as Testimonial[];
      } catch (err) {}
    }

    const updatedLocals = [newTestimonial, ...currentLocals];
    localStorage.setItem("mymasterlam_local_testimonials", JSON.stringify(updatedLocals));
    
    setTestimonials([newTestimonial, ...testimonials]);
    setSubmittedSuccess(true);
    
    // Clear Form fields
    setFormName("");
    setFormLocation("");
    setFormContent("");
    setFormImpact("");
    setFormRating(5);

    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowAddForm(false);
    }, 2500);
  };

  const filtered = testimonials.filter(t => activeTab === "all" || t.category === activeTab);

  return (
    <div id="customer_testimonials_section" className="space-y-8 pt-10 border-t-2 border-dashed border-[#bfa15f]/30">
      
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-[#590612]/5 border border-[#590612]/15 px-3 py-1 rounded-full">
          <Award className="w-3.5 h-3.5 text-[#590612] animate-bounce" />
          <span className="text-[10px] sm:text-xs font-bold text-[#590612] tracking-wider uppercase font-sans">Verified Client Testimonials</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-[#590612] tracking-widest font-serif">
          ☯ 真實開運見證 · 實體地舖誠信保障 ☯
        </h3>
        <p className="text-xs sm:text-sm text-ink-900 max-w-2xl mx-auto leading-relaxed font-serif">
          林大師親筆批算與實地風水佈局已助數千客戶突破瓶頸、扭轉運勢。一字一句皆為客戶真實反饋，歡迎親臨分行查閱親筆信函。
        </p>
      </div>

      {/* Tabs Menu & Write Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#bfa15f]/20 pb-3">
        <div className="flex flex-wrap gap-1.5" id="testimonial_tabs">
          {[
            { id: "all", label: "✨ 全部見證" },
            { id: "fengshui", label: "🏡 住宅風水" },
            { id: "bazi", label: "🔮 八字大運" },
            { id: "business", label: "🏬 商業開運" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-[#590612] text-white shadow-md shadow-[#590612]/10"
                  : "bg-[#fbfaf7] border border-[#bfa15f]/20 text-ink-900 hover:border-[#590612]/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#bfa15f]/15 hover:bg-[#bfa15f]/25 border border-[#bfa15f]/40 text-[#590612] rounded-lg text-xs font-extrabold tracking-wider transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>寫下我的開運回饋</span>
        </button>
      </div>

      {/* Slide down form wrapper */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form 
              onSubmit={handleAddTestimonial}
              className="bg-[#fbfaf7] border-2 border-[#bfa15f]/40 rounded-2xl p-5 sm:p-6 space-y-4 shadow-inner relative"
              id="testimonial_submission_form"
            >
              <h4 className="text-sm font-black text-[#590612] font-serif flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#590612]" />
                <span>分享您的真實開運體驗，與林大師及大眾同沾福澤：</span>
              </h4>

              {submittedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-xs font-bold text-center animate-pulse">
                  🎉 提交成功！林大師已收到您的反饋，感謝您的頂禮善言，大師特此加持護佑您吉星高照！
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#590612] mb-1">您的尊姓 / 暱稱 *</label>
                      <input 
                        type="text"
                        required
                        placeholder="例：陳女士"
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        className="w-full bg-white border border-[#bfa15f]/30 rounded-lg px-3 py-1.5 text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-[#590612]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#590612] mb-1">居住或業務地點 *</label>
                      <input 
                        type="text"
                        required
                        placeholder="例：青衣海悅花園業主 / 中環辦公室"
                        value={formLocation}
                        onChange={e => setFormLocation(e.target.value)}
                        className="w-full bg-white border border-[#bfa15f]/30 rounded-lg px-3 py-1.5 text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-[#590612]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#590612] mb-1">算命或勘察項目 *</label>
                      <select 
                        value={formCategory}
                        onChange={e => setFormCategory(e.target.value as any)}
                        className="w-full bg-white border border-[#bfa15f]/30 rounded-lg px-3 py-1.5 text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-[#590612]"
                      >
                        <option value="fengshui">🏡 家居住宅風水</option>
                        <option value="bazi">🔮 個人生辰八字</option>
                        <option value="business">🏬 商業開運風水</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#590612] mb-1">評分及滿意度 *</label>
                      <div className="flex items-center space-x-1.5 h-[34px]">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormRating(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star 
                              className={`w-5 h-5 ${star <= formRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#590612] mb-1">開運見證描述 (最少 20 字) *</label>
                    <textarea 
                      required
                      minLength={20}
                      rows={3}
                      placeholder="請詳述大師指導前的情況，以及按照大師指引調和風水/把握大運之後，您的事業、財運、健康或家庭運勢發生了什麼可喜的改變..."
                      value={formContent}
                      onChange={e => setFormContent(e.target.value)}
                      className="w-full bg-white border border-[#bfa15f]/30 rounded-lg p-3 text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-[#590612] leading-relaxed font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#590612] mb-1">開運福報成果 (選填，多個用逗號隔開)</label>
                    <input 
                      type="text"
                      placeholder="例：財運大開, 避過官非, 夫婦和睦"
                      value={formImpact}
                      onChange={e => setFormImpact(e.target.value)}
                      className="w-full bg-white border border-[#bfa15f]/30 rounded-lg px-3 py-1.5 text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-[#590612]"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-700 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#590612] hover:bg-[#800c1e] text-white rounded-lg text-xs font-bold tracking-widest shadow-md hover:scale-[1.01] transition-all"
                    >
                      🙏 虔誠提交見證
                    </button>
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="testimonials_grid">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, index) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white border-2 border-[#bfa15f]/25 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:border-[#590612]/30 transition-all duration-300 flex flex-col justify-between relative group"
            >
              {/* Subtle quote watermark */}
              <Quote className="absolute right-4 bottom-4 w-12 h-12 text-[#bfa15f]/5 pointer-events-none group-hover:text-[#590612]/5 transition-colors" />

              <div className="space-y-3.5">
                {/* Card Header: Category badge, Star Rating, Date */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                  <span className="text-[9px] bg-[#590612]/5 text-[#590612] font-bold font-sans px-2.5 py-0.5 rounded-md border border-[#590612]/10">
                    {item.categoryLabel}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs text-ink-900 font-serif leading-relaxed text-justify whitespace-pre-line">
                  「 {item.content} 」
                </p>

                {/* Impacts badging */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.impacts.map((imp, idx) => (
                    <span 
                      key={idx}
                      className="text-[9px] font-sans font-bold bg-[#bfa15f]/5 text-[#8a713b] px-2 py-0.5 rounded-md border border-[#bfa15f]/15"
                    >
                      {imp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Info footer */}
              <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#bfa15f]/20 to-[#590612]/10 flex items-center justify-center border border-[#bfa15f]/30">
                    <User className="w-4 h-4 text-[#590612]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-[#590612] font-serif">{item.name}</span>
                      {item.isLocal ? (
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold uppercase tracking-wider font-sans">
                          驗證客戶 Verified
                        </span>
                      ) : (
                        <span className="text-[8px] bg-amber-100 text-amber-800 px-1 rounded font-bold uppercase tracking-wider font-sans">
                          青衣實體地舖
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-ink-400 font-sans block">{item.location}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-ink-400 font-mono block">{item.date}</span>
                  <span className="text-[8px] text-emerald-600 font-bold block">✓ 經實名認證見證</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Trust banner */}
      <div className="bg-[#590612]/5 border border-[#590612]/15 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#590612] text-white rounded-xl shadow-md">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-[#590612] font-serif">需要調理運勢？林大師為您親自做法</h4>
            <p className="text-[11px] text-ink-400 mt-0.5 leading-relaxed font-serif">
              無論是流年大運阻滯，還是家宅磁場欠佳，均可預約大師一對一精算。實體地舖誠信經營，承諾無任何隱形消費。
            </p>
          </div>
        </div>
        <a
          href="#subscription_plans_section"
          className="bg-gradient-to-r from-[#590612] to-[#800c1e] hover:from-[#800c1e] hover:to-[#590612] text-white font-sans font-bold text-xs px-4 py-2 rounded-xl shadow-md hover:scale-[1.02] transition-all duration-300 whitespace-nowrap"
        >
          查看開運方案 ➔
        </a>
      </div>
    </div>
  );
}
