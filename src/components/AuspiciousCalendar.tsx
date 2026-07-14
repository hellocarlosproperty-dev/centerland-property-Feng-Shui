import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, Info, Sparkles, MapPin, ExternalLink, CalendarDays } from "lucide-react";

interface FormState {
  name: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthHour: string;
  birthMinute: string;
  birthSecond: string;
  services: string[];
  address: string;
  identity: string;
}

interface ResultData {
  dominantElement: string;
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
}

interface AuspiciousCalendarProps {
  form: FormState;
  result: ResultData;
  onTriggerBlessing: (msg: string) => void;
}

export function AuspiciousCalendar({ form, result, onTriggerBlessing }: AuspiciousCalendarProps) {
  const today = new Date();
  
  // Selected month states: current month (0) or next month (1) relative to today
  const [selectedMonthOffset, setSelectedMonthOffset] = useState<0 | 1>(0);

  // Define auspicious items
  const auspiciousItems = [
    {
      offset: 12,
      title: "大吉 · 搬遷入宅吉日",
      time: "巳時 (09:00 - 11:00) 最佳",
      description: "配合太陽吉星，利於搬移大件、開光安置風水擺件、迎納祥氣入室。此時空維度下元神契合最深，能得天地扶持，全宅丁財兩旺。",
      hours: { start: "09", end: "11" },
      color: "bg-[#590612] text-white border-[#bfa15f]",
      badge: "大吉"
    },
    {
      offset: 21,
      title: "次吉 · 淨宅安神吉日",
      time: "午時 (11:00 - 13:00) 最佳",
      description: "天德合吉星高照，宜在當日徹底清掃玄關、客廳、廚房，點燃沉香調和全屋氣場。淨化舊磁場，注入新鮮開運正能。",
      hours: { start: "11", end: "13" },
      color: "bg-[#bfa15f] text-white border-[#590612]/30",
      badge: "次吉"
    },
    {
      offset: 29,
      title: "次吉 · 納財動土擇日",
      time: "辰時 (07:00 - 09:00) 最佳",
      description: "太陰福星得位，利於合夥商務簽約、開始裝修動土或購買安置大件開運軟裝。土金相生，財源亨通，開工即引動財源進寶。",
      hours: { start: "07", end: "09" },
      color: "bg-amber-600 text-white border-amber-800/20",
      badge: "次吉"
    }
  ];

  // Calculate precise dates for auspicious events
  const calculatedEvents = auspiciousItems.map(item => {
    const eventDate = new Date();
    eventDate.setDate(today.getDate() + item.offset);
    return {
      ...item,
      date: eventDate,
      dateKey: `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`,
      dateString: eventDate.toLocaleDateString("zh-HK", { month: "long", day: "numeric" }) + " (星期" + ["日", "一", "二", "三", "四", "五", "六"][eventDate.getDay()] + ")"
    };
  });

  // Selected date state (defaults to first calculated event)
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);

  // Month rendering config
  const targetMonthDate = new Date();
  targetMonthDate.setMonth(today.getMonth() + selectedMonthOffset);
  const year = targetMonthDate.getFullYear();
  const month = targetMonthDate.getMonth(); // 0-indexed

  const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

  // Calendar math
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Create grid cells
  const cells: { day: number | null; isToday: boolean; event: typeof calculatedEvents[0] | null; dateObj: Date | null }[] = [];
  
  // Fill preceding blanks
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push({ day: null, isToday: false, event: null, dateObj: null });
  }

  // Fill actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const checkDate = new Date(year, month, d);
    const isDayToday = 
      checkDate.getDate() === today.getDate() && 
      checkDate.getMonth() === today.getMonth() && 
      checkDate.getFullYear() === today.getFullYear();

    const key = `${year}-${month}-${d}`;
    const foundEvent = calculatedEvents.find(e => e.dateKey === key) || null;

    cells.push({
      day: d,
      isToday: isDayToday,
      event: foundEvent,
      dateObj: checkDate
    });
  }

  // Monthly fortune score (aligned with Recharts baseScores logic)
  const baseScores = 
    result.dominantElement === "木" ? [60, 85, 90, 75, 55, 45, 50, 65, 80, 75, 70, 60] :
    result.dominantElement === "火" ? [45, 60, 75, 90, 85, 65, 50, 45, 60, 75, 70, 55] :
    result.dominantElement === "土" ? [50, 55, 65, 75, 85, 90, 80, 60, 55, 65, 75, 60] :
    result.dominantElement === "金" ? [70, 60, 50, 45, 55, 70, 85, 90, 75, 65, 60, 65] : [80, 75, 60, 50, 40, 55, 65, 70, 85, 90, 80, 75];

  const monthFortuneScore = baseScores[month];
  let fortuneLevel = "平穩順遂";
  let fortuneDesc = "運氣平穩舒泰，適合按部就班修復室內氣場，宜靜不宜急躁。";
  if (monthFortuneScore >= 80) {
    fortuneLevel = "紫氣東來 · 大吉";
    fortuneDesc = "當月磁場能量極盛，五行相生，最適宜搬遷入宅、動土置業或大宗家裝安置！";
  } else if (monthFortuneScore <= 50) {
    fortuneLevel = "磁場收斂 · 宜守";
    fortuneDesc = "當前干支克洩偏多，運勢宜靜不宜動，此時在家中擺放水晶、多點沉香能有效調和氣場。";
  }

  // Google calendar link helper
  const getGoogleCalendarUrl = (event: typeof calculatedEvents[0]) => {
    const d = event.date;
    const yearStr = d.getFullYear().toString();
    const monthStr = (d.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = d.getDate().toString().padStart(2, '0');
    
    const startIso = `${yearStr}${monthStr}${dayStr}T${event.hours.start}0000`;
    const endIso = `${yearStr}${monthStr}${dayStr}T${event.hours.end}0000`;
    
    const detailsText = `${event.description}\n\n🔮 屋主本命元神：${result.dominantElement}命\n🏮 契合開運色：${result.auspiciousColors.join("、")}\n🏠 安置居所：${form.address || "您的住宅"}\n\n---\n中聯家居風水命理專門店 誠心敬奉`;
    
    const details = encodeURIComponent(detailsText);
    const location = encodeURIComponent(form.address || "您的居所宮位");
    const text = encodeURIComponent(`【中聯家居 · 董公擇日】${event.title}`);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  const handleAddToCalendar = (event: typeof calculatedEvents[0]) => {
    const url = getGoogleCalendarUrl(event);
    onTriggerBlessing(`📅 正在引導您前往 Google Calendar 視窗。已自動為您將『${event.title}』排入黃道良辰中，助您開光大吉、丁財兩旺！`);
    window.open(url, "_blank");
  };

  return (
    <div className="bg-[#fcfaf6] border-2 border-[#bfa15f]/55 rounded-2xl p-5 sm:p-7 space-y-6 relative overflow-hidden shadow-md" id="auspicious_calendar_section">
      {/* Decorative background mark */}
      <div className="absolute right-[-20px] top-[-20px] text-[#590612]/3 text-8xl font-serif pointer-events-none select-none">
        暦
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold-200/40 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1 bg-[#590612]/5 border border-[#590612]/15 px-2 py-0.5 rounded-full">
            <CalendarIcon className="w-3.5 h-3.5 text-[#590612]" />
            <span className="text-[10px] sm:text-xs font-bold text-[#590612] tracking-wider uppercase font-sans">Auspicious Metaphysical Calendar</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#590612] tracking-widest font-serif flex items-center gap-2">
            <span>📅 專屬天時開運月曆</span>
          </h3>
          <p className="text-xs text-ink-400 font-serif leading-relaxed">
            林大師特別將【董公擇日】之吉日與您的【十二流月元神氣數】進行維度整合，呈現天人合一之黃道吉日曆法。
          </p>
        </div>

        {/* Month Selector Toggles */}
        <div className="flex items-center space-x-1.5 self-start md:self-center font-sans">
          <button
            type="button"
            onClick={() => setSelectedMonthOffset(0)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${
              selectedMonthOffset === 0
                ? "bg-[#590612] text-white border-[#590612] shadow-sm"
                : "bg-white text-ink-900 border-gold-200/50 hover:bg-gold-50"
            }`}
          >
            本月 ({today.getMonth() + 1}月)
          </button>
          <button
            type="button"
            onClick={() => setSelectedMonthOffset(1)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${
              selectedMonthOffset === 1
                ? "bg-[#590612] text-white border-[#590612] shadow-sm"
                : "bg-white text-ink-900 border-gold-200/50 hover:bg-gold-50"
            }`}
          >
            次月 ({((today.getMonth() + 1) % 12) + 1}月)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Grid - Takes 7 Cols */}
        <div className="lg:col-span-7 bg-white border border-gold-100 rounded-2xl p-4 shadow-sm space-y-4">
          {/* Calendar Month Title & Lunar Status */}
          <div className="flex items-center justify-between border-b border-gold-50 pb-2 px-1">
            <span className="font-serif font-black text-[#590612] text-sm flex items-center gap-1">
              <CalendarDays className="w-4 h-4 text-[#590612]" />
              {year} 年 {monthNames[month]}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-gold-50 text-gold-800 border border-gold-200/60 px-2 py-0.5 rounded font-sans font-medium">
                月亮氣數：{monthFortuneScore}分
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-sans font-extrabold ${
                monthFortuneScore >= 80 ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                monthFortuneScore <= 50 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}>
                {fortuneLevel}
              </span>
            </div>
          </div>

          {/* Grid Layout */}
          <div>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center font-sans text-[10px] sm:text-xs font-extrabold text-[#590612] mb-1.5">
              {weekdays.map((day, idx) => (
                <div key={idx} className={idx === 0 || idx === 6 ? "text-amber-600" : ""}>
                  {day}
                </div>
              ))}
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell, idx) => {
                if (!cell.day) {
                  return <div key={idx} className="aspect-square bg-gray-50/40 rounded-lg border border-transparent" />;
                }

                const hasEvent = cell.event !== null;
                const isSelected = hasEvent && calculatedEvents[selectedEventIndex].dateKey === `${year}-${month}-${cell.day}`;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (hasEvent) {
                        const evtIdx = calculatedEvents.findIndex(e => e.dateKey === `${year}-${month}-${cell.day}`);
                        if (evtIdx !== -1) {
                          setSelectedEventIndex(evtIdx);
                          onTriggerBlessing(`🔮 您選取了【${calculatedEvents[evtIdx].title}】，以下為您展示大師開運備註與擇吉指引。`);
                        }
                      } else {
                        onTriggerBlessing(`☯ ${month + 1}月${cell.day}日磁場平穩，五行氣息流通。若欲在此日安床或修整，可參照本月元神開運色調佈置。`);
                      }
                    }}
                    className={`aspect-square rounded-lg border flex flex-col items-center justify-between p-1 transition-all duration-300 relative cursor-pointer ${
                      cell.isToday 
                        ? "border-[#590612] bg-rose-50/30" 
                        : isSelected 
                        ? "border-[#bfa15f] bg-[#590612]/5 ring-2 ring-[#bfa15f]/40 scale-105" 
                        : hasEvent 
                        ? "border-[#bfa15f] bg-gold-50/20 hover:scale-[1.03] hover:shadow-xs" 
                        : "border-gray-100 bg-white hover:bg-gold-50/20"
                    }`}
                  >
                    {/* Tiny Event Badge Dot or Star */}
                    {hasEvent && (
                      <span className={`absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full ${
                        cell.event?.badge === "大吉" ? "bg-[#590612]" : "bg-amber-500"
                      }`} />
                    )}

                    {/* Day Number */}
                    <span className={`text-[11px] sm:text-xs font-mono font-bold self-end pr-1 ${
                      cell.isToday ? "text-[#590612] font-black" : hasEvent ? "text-gold-800 font-extrabold" : "text-ink-900"
                    }`}>
                      {cell.day}
                    </span>

                    {/* Cell Mini Caption */}
                    {hasEvent ? (
                      <span className={`text-[7px] font-serif font-extrabold px-1 rounded-sm border scale-90 sm:scale-100 ${
                        cell.event?.badge === "大吉" ? "bg-[#590612] text-white border-[#590612]" : "bg-amber-500 text-white border-amber-500"
                      }`}>
                        {cell.event?.badge}
                      </span>
                    ) : cell.isToday ? (
                      <span className="text-[7px] font-sans font-bold text-[#590612] scale-90">
                        今日
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lunar/Monthly Explanation */}
          <div className="bg-gold-50/30 border border-gold-100/50 rounded-xl p-3 text-[11px] leading-relaxed text-ink-400 font-serif space-y-1">
            <span className="font-extrabold text-[#590612] block">🌟 當月氣數總評：</span>
            <p>{fortuneDesc}</p>
          </div>
        </div>

        {/* Selected Day Details Panel - Takes 5 Cols */}
        <div className="lg:col-span-5 flex flex-col h-full justify-between space-y-4">
          <div className="bg-white border-2 border-[#bfa15f]/40 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 relative overflow-hidden flex-1">
            {/* Background seal water mark */}
            <div className="absolute right-[-10px] bottom-[-10px] text-red-500/5 text-7xl font-serif select-none pointer-events-none">
              吉
            </div>

            <div className="border-b border-gold-100 pb-2.5">
              <span className="text-[9px] font-mono text-gold-700 tracking-wider font-extrabold uppercase">AUSPICIOUS DATE PROFILE</span>
              <h4 className="text-sm sm:text-base font-black text-[#590612] font-serif mt-1 leading-tight flex items-center gap-1">
                <span>🏮 {calculatedEvents[selectedEventIndex].title}</span>
              </h4>
              <p className="text-xs font-bold text-amber-800 font-sans mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{calculatedEvents[selectedEventIndex].dateString}</span>
              </p>
            </div>

            <div className="space-y-3 font-serif">
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-semibold text-ink-400 block uppercase tracking-wider">🌟 最佳進宅開光時辰</span>
                <p className="text-xs font-black text-[#590612] bg-[#590612]/5 border border-[#590612]/15 rounded-lg px-2.5 py-1.5 inline-flex items-center gap-1.5 font-mono">
                  {calculatedEvents[selectedEventIndex].time}
                </p>
              </div>

              <div className="space-y-1 leading-relaxed">
                <span className="text-[10px] font-sans font-semibold text-ink-400 block uppercase tracking-wider">📜 董公大師擇吉微言</span>
                <p className="text-xs text-ink-900 font-light text-justify">
                  {calculatedEvents[selectedEventIndex].description}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-sans font-semibold text-ink-400 block uppercase tracking-wider">🎨 先天元神契合軟裝色調</span>
                <div className="flex gap-1.5 pt-1">
                  {result.auspiciousColors.map((color, cIdx) => (
                    <span key={cIdx} className="text-[9px] font-bold border border-gold-200 bg-gold-50/50 text-[#590612] px-2 py-0.5 rounded">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Add to Calendar Button Section */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleAddToCalendar(calculatedEvents[selectedEventIndex])}
              className="w-full py-3 bg-gradient-to-r from-[#590612] to-[#800c1e] hover:from-[#800c1e] hover:to-[#590612] text-white text-center font-sans font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-gold-200 stroke-[2.5px]" />
              <span>一鍵排入我的 Google Calendar 日曆</span>
            </button>
            <p className="text-[9px] text-ink-300 font-sans text-center leading-normal">
              💡 提示：點擊按鈕將開啟 Google 官方日曆頁面，為您自動填入林大師批算的吉日、吉時及空間佈局註解。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
