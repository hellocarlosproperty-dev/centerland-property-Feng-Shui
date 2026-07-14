import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Check, ChevronRight, HelpCircle, ShieldAlert, Heart, Flame, Compass, HelpCircle as HelpIcon } from "lucide-react";

interface ElementData {
  key: "wood" | "fire" | "earth" | "metal" | "water";
  name: string;
  char: string;
  pinyin: string;
  colorClass: string;
  bgGrad: string;
  borderClass: string;
  textClass: string;
  direction: string;
  fortune: string;
  icon: string;
  checklist: string[];
  arrays: {
    name: string;
    description: string;
    items: string;
    setup: string;
    whatsappText: string;
  }[];
}

const WU_XING_DATA: ElementData[] = [
  {
    key: "wood",
    name: "木 (Wood)",
    char: "木",
    pinyin: "mù",
    colorClass: "bg-emerald-600",
    bgGrad: "from-emerald-50/70 to-emerald-100/20",
    borderClass: "border-emerald-200 hover:border-emerald-500",
    textClass: "text-emerald-700",
    direction: "東方 & 東南方 (East & Southeast)",
    fortune: "健康平安、學業考試、家庭和睦、長輩貴人",
    icon: "🌿",
    checklist: [
      "擺放高聳、葉片圓潤的常綠盆栽（如萬年青、發財樹），源源不斷注入生機活力。",
      "將小孩的書桌移至房間的東南角（文昌位），配備四支毛筆與綠色文具以集中精神。",
      "在客廳東牆掛置綠意盎然的山水畫或林木圖，藉由木行氣場生旺家庭成員的元氣。",
      "保持正東方窗戶明亮通風，每日清晨迎接第一縷陽光，極有助於煥發家人精神面貌。"
    ],
    arrays: [
      {
        name: "☯ 文昌星斗拱照陣",
        description: "專為學子、國考、考研或公務員晉升設計。旨在激發九宮飛星中的四綠文昌木星，澄澈思維，大幅提升專注力與悟性。",
        items: "四支純銅/桃木大毛筆、青花瓷筆筒、水養四支富貴竹",
        setup: "將筆筒安放於書桌東南方，筆頭朝上插好。右側置富貴竹，每日清晨更換清水，心中默念志向，引文昌星光入腦。",
        whatsappText: "您好，我想向林師傅請教關於『文昌星斗拱照陣』的書桌佈置與文昌位開運細節，謝謝！"
      },
      {
        name: "☯ 生生不息延壽陣",
        description: "主攻家庭成員健康、消災祛病。木代表生長與元氣，能化解流年病符星（二黑、五黃煞）對家宅健康氣場的侵蝕。",
        items: "開光純銅葫蘆一個、常綠富貴竹四支",
        setup: "將銅葫蘆掛在正東方臥室門口，下方安放水養富貴竹。此陣能以木洩水，以銅吸納病氣，使全家少生病、睡眠香甜。",
        whatsappText: "您好，我想向林師傅諮詢如何在家中正東方佈署『生生不息延壽陣』以調理家人健康，謝謝！"
      }
    ]
  },
  {
    key: "fire",
    name: "火 (Fire)",
    char: "火",
    pinyin: "huǒ",
    colorClass: "bg-rose-600",
    bgGrad: "from-rose-50/70 to-rose-100/20",
    borderClass: "border-rose-200 hover:border-rose-500",
    textClass: "text-rose-700",
    direction: "南方 (South)",
    fortune: "名氣聲望、社交人緣、桃花姻緣、事業曝光度",
    icon: "🔥",
    checklist: [
      "在客廳正南方安裝一盞暖光長明燈，保持24小時微亮，意喻家聲赫赫、前途一片光明。",
      "擺放紅色或紫色的抱枕、地毯、精緻中國結等暖色調飾物，為人際社交、桃花運加碼。",
      "絕對避免在正南方擺放大型魚缸或堆放陰濕雜物（水火相沖，極易招致口舌是非、漏財官非）。",
      "若客廳正南方有尖角沖射，應在此處懸掛一尊開光木質八卦鏡，或放置紅色高身陶瓷花瓶化煞。"
    ],
    arrays: [
      {
        name: "☯ 九紫離火大旺人緣大陣",
        description: "迎接當運九紫火星吉兆！此陣能極大激發個人的社交人際關係、商業桃花與群眾名望。對業務員、主播、創業者效果最顯著。",
        items: "喜慶紅梅報春圖一幅、天然粉水晶球一尊、九盞紅蓮長明暖燈",
        setup: "將紅梅圖懸掛於正南牆面，下方几案安放粉水晶。九盞紅蓮燈圍繞水晶呈環狀，每日傍晚開啟，匯聚天地喜慶元氣。",
        whatsappText: "您好，我想請教林師傅關於客廳正南方『九紫離火大旺人緣大陣』的燈具規格與桃花方位，謝謝！"
      },
      {
        name: "☯ 明燈引路避小人陣",
        description: "適合職場常遇小人、被流言蜚語中傷的緣主。利用離火之明，照破世間陰暗，使小人退避、貴人露頭。",
        items: "紅色防滑玄關地墊、五帝錢一套、紫砂瑞獸麒麟一對",
        setup: "在正南玄關處鋪設紅色地墊，下方安放五帝錢。麒麟面向大門，麒麟五行屬土，火生土、土生金，化煞為權，邪氣難入。",
        whatsappText: "您好，我想預約林師傅為我批算辦公室的『明燈引路避小人陣』以化解職場口舌是非，謝謝！"
      }
    ]
  },
  {
    key: "earth",
    name: "土 (Earth)",
    char: "土",
    pinyin: "tǔ",
    colorClass: "bg-amber-700",
    bgGrad: "from-amber-50/70 to-amber-100/20",
    borderClass: "border-amber-200 hover:border-amber-500",
    textClass: "text-amber-800",
    direction: "東北方、西南方 & 中央 (Northeast, Southwest & Center)",
    fortune: "房產置業、偏財儲蓄、婚姻穩定、家宅氣場穩固",
    icon: "🪨",
    checklist: [
      "東北方（艮宮，代表少男與靠山）宜放置圓潤沈穩的泰山石，能穩固家宅靠山運，防止被動破財。",
      "西南方（坤宮，代表女主人與婚姻）擺放陶瓷雙花瓶，內盛乾淨黃土，能大幅增進夫妻默契與感情。",
      "客廳中央（中宮）代表家宅心臟，必須保持開闊、明亮與整潔，避免堆放垃圾桶，以免土氣受污。",
      "客廳一角可多擺放精美陶器、天然礦石、黃水晶簇等物品，加強土行重實、包容與聚財的磁場。"
    ],
    arrays: [
      {
        name: "☯ 泰山石來運轉大陣",
        description: "針對房屋東北缺角、西南缺角，或背後無靠（客廳沙發背靠窗戶/走廊）的格局。以土之沈穩填補空間漏洞，穩固基業。",
        items: "開光天然泰山墨玉石一尊（底座刻有八卦符號）",
        setup: "擇吉日吉時（土旺之時），將泰山石安放於客廳東北角或西南缺角處，石面有字一面朝向屋內，以作鎮宅避凶、四平八穩之功。",
        whatsappText: "您好，我家房子有缺角問題，想向林大師請教如何擺放『泰山石來運轉大陣』來補角鎮宅，謝謝！"
      },
      {
        name: "☯ 黃金聚寶土中藏陣",
        description: "主攻家庭偏財運、資產增值與家庭儲蓄力。土能生金、金能藏風聚氣，使流動資金轉為實體財富，留住賺來的每一分錢。",
        items: "黃色紫砂聚寶盆一個、天然黃水晶碎石、銅製古錢十二枚",
        setup: "在客廳西南角擺放聚寶盆，盆底鋪黃水晶碎石，再將十二枚古錢按時針排列安放，象徵一年十二月月月盈餘、財氣入庫。",
        whatsappText: "您好，我想請教林師傅關於西南方『黃金聚寶土中藏陣』的招財聚財步驟與水晶擺放位置，謝謝！"
      }
    ]
  },
  {
    key: "metal",
    name: "金 (Metal)",
    char: "金",
    pinyin: "jīn",
    colorClass: "bg-yellow-500",
    bgGrad: "from-yellow-50/70 to-yellow-100/20",
    borderClass: "border-yellow-200 hover:border-yellow-500",
    textClass: "text-amber-600",
    direction: "西方 & 西北方 (West & Northwest)",
    fortune: "貴人扶持、正財薪資、子孫後代、決策力與管理權力",
    icon: "🪙",
    checklist: [
      "西北方（乾宮，代表男主人與貴人）放置圓形金屬掛鐘，指針走動與金屬滴答聲能持續激活貴人星曜。",
      "正西方（兌宮，代表子孫、口才與少女）擺放一尊精美銅質聚寶盆或三腳金蟾，能有效收斂漏財漏洞。",
      "全屋採用金屬框畫作、白色或高檔皮質沙發，或亮金色裝飾燈具，強化金行剛毅、開拓之氣。",
      "廚房（五行屬火）若位於西北方（此為「火燒天門」極凶之局），應在廚房內擺放黃色陶土器皿以洩火生金。"
    ],
    arrays: [
      {
        name: "☯ 六帝乾坤護祿大陣",
        description: "威名赫赫的避邪化煞生財陣。能強烈壓制九宮飛星中的五黃二黑病魔星，極大調和西北方乾宮的剛健氣場，大旺貴人事業運。",
        items: "純黃銅製六帝古錢一串、白水晶球一顆",
        setup: "將六帝錢懸掛於西北方牆面或橫樑下，下方几案擺放白水晶。金生水、水潤金，能吸納四方貴人磁場，使事業常得高人指點。",
        whatsappText: "您好，我想預約林師傅為我規劃家中的『六帝乾坤護祿大陣』，希望調和西北方火燒天門與生旺事業貴人運，謝謝！"
      },
      {
        name: "☯ 靈蟾銜財鎮宅大局",
        description: "專門針對商業經營、自營公司、自由職業者。利用乾金肅殺、收斂的本性，將屋外的飄散財氣牢牢吸納回屋，鎖死財庫。",
        items: "開光純銅三腳金蟾一尊（口中銜銅錢）",
        setup: "安放於進門對角線之明財位，或正西方兌宮。白天金蟾頭朝向大門（吐寶），晚上將金蟾轉向朝向屋內（吸財），切記不可讓外人隨意觸摸。",
        whatsappText: "您好，我想向林師傅請教關於自營店面正西方『靈蟾銜財鎮宅大局』的擺放時辰與開光細節，謝謝！"
      }
    ]
  },
  {
    key: "water",
    name: "水 (Water)",
    char: "水",
    pinyin: "shuǐ",
    colorClass: "bg-blue-600",
    bgGrad: "from-blue-50/70 to-blue-100/20",
    borderClass: "border-blue-200 hover:border-blue-500",
    textClass: "text-blue-700",
    direction: "北方 (North)",
    fortune: "財源流動、智慧謀略、商業貿易、人脈溝通、適應能力",
    icon: "💧",
    checklist: [
      "在客廳正北方擺放圓形玻璃魚缸，飼養六條黑魚與一條紅魚，水流循環不息，催動流動之財。",
      "安放流水噴泉盆景，或黑曜石神像，有助於活躍大腦思路、生發靈智、擴大朋友圈層。",
      "若正北方恰為洗手間，應保持乾燥、安裝排氣扇，並在馬桶旁放置一盆富貴竹，以木洩水淨化污穢之氣。",
      "客廳正北方牆壁可懸掛九魚戲水圖或江河旭日東升圖，激發坎水與事業生氣，助仕途與經商順遂。"
    ],
    arrays: [
      {
        name: "☯ 五行川流生財大陣",
        description: "水主財，川流不息。此陣融合金生水、水生財之理，最利於金融投資、貿易出口、電商平台及有大額資金流動的商家緣主。",
        items: "高腳金屬循環流水盆、黑曜石八卦化煞盤",
        setup: "安放於客廳正北方（坎宮）。將流水噴泉開啟，調整水流方向使其朝向屋內緩緩流下。將黑曜石盤置於流水旁以穩固氣流，財源必滾滾而來。",
        whatsappText: "您好，我想向林師傅請教關於客廳正北方擺放『五行川流生財大陣』的流水方向與黑曜石擺設禁忌，謝謝！"
      },
      {
        name: "☯ 智水避險乾坤大局",
        description: "若房屋大門、窗戶正對室外天斬煞、路沖、電線桿或醫院，容易導致家人脾氣暴躁、決策失誤。利用坎水化萬物，柔能克剛。",
        items: "黑曜石太極八卦盤、天然藍水晶球",
        setup: "將黑曜石八卦盤正對路沖或煞氣方位安放，前方置藍水晶球。水行能折射、化解生硬的直線沖煞，保佑闔家出行平安、決策澄澈。",
        whatsappText: "您好，我的房子大門正對路沖，想向林師傅諮詢如何擺放『智水避險乾坤大局』來化煞保平安，謝謝！"
      }
    ]
  }
];

export function FengShuiNavigator({ onTriggerBlessing }: { onTriggerBlessing?: (customMsg?: string) => void }) {
  const [selectedElement, setSelectedElement] = useState<ElementData>(WU_XING_DATA[0]);

  const handleInquire = (arrayName: string, whatsappText: string) => {
    // 1. Trigger the immersive blessing popup first
    onTriggerBlessing?.(`🔮 大師賜福：五行和合，生生不息！林大師已收到您的【${arrayName}】陣法諮詢，特此特許加持。專屬秘書已為您特別排班，正在與林大師連線，為您親自剖析此陣在家中的精準落地機宜...`);
    
    // 2. Open WhatsApp in a new tab after a brief delay so they see the blessing first
    const whatsappUrl = `https://wa.me/85291884964?text=${encodeURIComponent(whatsappText)}`;
    setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }, 1500);
  };

  return (
    <div className="bg-white border-2 border-[#bfa15f]/40 rounded-2xl p-5 sm:p-7 shadow-lg space-y-6 relative overflow-hidden" id="fengshui_knowledge_navigator">
      {/* Background traditional pattern */}
      <div className="absolute right-[-30px] bottom-[-30px] text-[#590612]/3 text-[140px] font-black pointer-events-none select-none font-serif">☯</div>
      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#bfa15f]/30 rounded-tl-sm" />
      <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#bfa15f]/30 rounded-tr-sm" />
      <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#bfa15f]/30 rounded-bl-sm" />
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#bfa15f]/30 rounded-br-sm" />

      {/* Header */}
      <div className="text-center space-y-1.5 pb-2 border-b border-[#bfa15f]/20">
        <span className="text-[10px] tracking-[0.2em] font-sans font-bold text-amber-600 block uppercase">Interactive Feng Shui Space Navigator</span>
        <h4 className="text-lg sm:text-xl font-black text-[#590612] font-serif tracking-widest">
          ☯ 互動式五行家居佈局與風水陣法導航 ☯
        </h4>
        <p className="text-xs text-ink-900 font-serif leading-relaxed max-w-xl mx-auto">
          房屋的氣場與人命五行緊密相連。請點選下方<strong>五行屬性</strong>，即時解鎖各空間方位對應的家居佈局避坑清單，與林大師祖傳的開運陣法祕笈。
        </p>
      </div>

      {/* Wu Xing Selectors (Interactive 5 Elements buttons) */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3" id="navigator_element_selectors">
        {WU_XING_DATA.map((elem) => {
          const isActive = selectedElement.key === elem.key;
          return (
            <button
              key={elem.key}
              onClick={() => setSelectedElement(elem)}
              className={`relative flex flex-col items-center justify-center py-2.5 sm:py-3.5 px-1 rounded-xl transition-all duration-300 border-2 ${
                isActive 
                  ? `${elem.colorClass} border-[#bfa15f] text-white shadow-md scale-105 z-10` 
                  : "bg-[#fbfaf7] border-gray-200 text-ink-900 hover:border-[#bfa15f]/50 hover:bg-white"
              }`}
            >
              {/* Yin Yang spinning background only for active */}
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-center opacity-10 overflow-hidden pointer-events-none">
                  <div className="w-14 h-14 border border-dashed border-white rounded-full animate-[spin_10s_linear_infinite]" />
                </div>
              )}

              <span className="text-base sm:text-2xl mb-1 filter drop-shadow-xs">{elem.icon}</span>
              <span className="text-xs sm:text-sm font-black tracking-widest font-serif">{elem.char}</span>
              <span className={`text-[8px] sm:text-[10px] uppercase tracking-wider font-mono ${isActive ? "text-yellow-200" : "text-ink-400"}`}>
                {elem.pinyin}
              </span>

              {/* Glowing active notch */}
              {isActive && (
                <div className="absolute bottom-[-6px] w-2 h-2 rotate-45 bg-[#bfa15f]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Display Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedElement.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`rounded-2xl border-2 border-[#bfa15f]/30 p-4 sm:p-5 bg-gradient-to-br ${selectedElement.bgGrad} space-y-5`}
          id={`navigator_panel_${selectedElement.key}`}
        >
          {/* Properties Meta Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3.5 border-b border-[#bfa15f]/20">
            <div>
              <span className="text-[10px] text-ink-400 uppercase tracking-widest font-sans font-bold block">
                空間方位 · Position Orientations
              </span>
              <span className="text-sm font-extrabold text-[#590612] font-serif flex items-center gap-1.5 mt-0.5">
                <Compass className="w-4 h-4 text-amber-600 animate-spin" />
                <span>{selectedElement.direction}</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-ink-400 uppercase tracking-widest font-sans font-bold block">
                主掌命理運勢 · Core Blessings
              </span>
              <span className="text-xs font-bold text-ink-900 font-serif block mt-1 leading-relaxed">
                🎯 {selectedElement.fortune}
              </span>
            </div>
          </div>

          {/* Grid Layout inside element details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Checklist Column (Takes 5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <h5 className="text-xs font-black text-[#590612] font-serif tracking-widest flex items-center gap-1.5 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>📋 家居佈局避坑清單：</span>
              </h5>
              <div className="space-y-2.5">
                {selectedElement.checklist.map((item, idx) => (
                  <div key={idx} className="bg-white/80 border border-[#bfa15f]/15 rounded-xl p-3 flex items-start gap-2.5 shadow-xs">
                    <span className="w-4 h-4 rounded bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-mono font-bold text-[9px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-ink-900 leading-relaxed font-serif text-justify">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrays Column (Takes 7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <h5 className="text-xs font-black text-[#590612] font-serif tracking-widest flex items-center gap-1.5 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-rose-700" />
                <span>🔮 祖傳秘製開運陣法推薦：</span>
              </h5>
              <div className="space-y-3.5">
                {selectedElement.arrays.map((arr, idx) => (
                  <div key={idx} className="bg-[#fbfaf7] border-2 border-[#bfa15f]/40 rounded-xl p-4 space-y-3 relative overflow-hidden group hover:border-[#590612]/40 transition-colors shadow-sm">
                    <div className="absolute right-[-10px] top-[-10px] text-[#590612]/3 text-4xl font-bold select-none pointer-events-none">☯</div>
                    
                    <div className="flex justify-between items-start gap-2">
                      <h6 className="text-xs sm:text-sm font-black text-[#590612] font-serif tracking-wide">
                        {arr.name}
                      </h6>
                      <span className="text-[8px] bg-[#590612]/5 text-[#590612] font-bold font-sans px-2 py-0.5 rounded border border-[#590612]/10 uppercase tracking-wider">
                        大師秘傳
                      </span>
                    </div>

                    <p className="text-xs text-ink-400 font-serif leading-relaxed text-justify">
                      {arr.description}
                    </p>

                    <div className="bg-white/85 rounded-lg p-2.5 border border-[#bfa15f]/20 space-y-1.5 text-[11px] font-serif leading-relaxed">
                      <div>
                        <strong className="text-amber-800">🛠️ 必備法器物資：</strong>
                        <span className="text-ink-900">{arr.items}</span>
                      </div>
                      <div>
                        <strong className="text-[#590612]">📐 佈陣安放法門：</strong>
                        <span className="text-ink-400">{arr.setup}</span>
                      </div>
                    </div>

                    {/* WhatsApp Inquire button */}
                    <button
                      onClick={() => handleInquire(arr.name, arr.whatsappText)}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#590612] rounded-lg text-[10px] sm:text-xs font-black tracking-wider transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1 hover:scale-[1.01]"
                    >
                      <span>💬 請教林大師協助開光佈置此陣法</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Trust reassurance notice */}
      <div className="bg-amber-50/50 border border-[#bfa15f]/30 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center space-x-2">
          <HelpIcon className="w-4 h-4 text-[#590612] animate-bounce flex-shrink-0" />
          <p className="text-[11px] text-[#590612] font-serif leading-relaxed">
            💡 <strong>佈陣小常識：</strong>風水陣法必需經過高僧或大師親自開光開光硃砂點睛，並配比您與全家人的生辰八字擇吉日佈設方能引動地靈生氣。若有疑問請即點選上方按鈕諮詢大師，或親臨青衣海悅花園分行。
          </p>
        </div>
      </div>
    </div>
  );
}
