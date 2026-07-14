import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not set. AI features will fallback to default calculations.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const ai = getGeminiClient();

// Helper to handle Gemini API generation with retries and fallback models in case of transient errors (like 503 Service Unavailable)
async function generateContentWithRetry(aiClient: any, params: any) {
  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    let delay = 1000;
    const maxRetries = model === "gemini-3.5-flash" ? 3 : 2;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Gemini] Attempt ${attempt} using model: ${model}`);
        const response = await aiClient.models.generateContent({
          ...params,
          model: model,
        });
        if (response && response.text) {
          console.log(`[Gemini] Successfully generated content with model: ${model} on attempt: ${attempt}`);
          return response;
        }
      } catch (error: any) {
        lastError = error;
        console.warn(`[Gemini] Attempt ${attempt} with model ${model} failed:`, error?.message || error);
        
        // If it is a bad request (like schema or prompt validation), do not retry the exact same request
        if (error?.status === 400 || (error?.message && error.message.includes("400"))) {
          break;
        }

        if (attempt < maxRetries) {
          console.log(`[Gemini] Waiting ${delay}ms before retrying...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }
    }
    console.warn(`[Gemini] Model ${model} was unsuccessful. Trying next available model...`);
  }

  throw lastError || new Error("Failed to generate content with any model");
}

// API endpoint to handle submission and generate metaphysical reading
app.post("/api/submit", async (req, res) => {
  const { 
    name, 
    gender, 
    identity, 
    phone, 
    address, 
    birthDate, 
    birthTime, 
    birthHour, 
    birthMinute, 
    birthSecond, 
    email, 
    services 
  } = req.body;

  // Validate required inputs
  if (!name || !gender || !identity || !phone || !address || !birthDate || !birthTime || !email) {
    return res.status(400).json({ error: "請填寫所有欄位 / All fields are required." });
  }

  const payload = {
    name,
    gender,
    identity, // 業主 / 租客
    phone,
    address,
    birthDate, // YYYY-MM-DD
    birthTime, // HH:MM (時辰對應)
    birthHour, // 時 (00-23)
    birthMinute, // 分 (00-59)
    birthSecond, // 秒 (00-59)
    email,
    services: services || [],
    submittedAt: new Date().toISOString()
  };

  // 1. Send data to Make.com Webhook
  let webhookSuccess = false;
  try {
    const webhookUrl = "https://hook.eu2.make.com/p17gq5xl4vy79os7tz6qc5aue5y1trg8";
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      webhookSuccess = true;
      console.log("Successfully sent data to Make.com webhook.");
    } else {
      console.error(`Make.com webhook returned status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to forward data to Make.com webhook:", error);
  }

  // 2. Query Yuanfenju API first to get authentic Bazi calculations
  let yuanfenjuData = null;
  const yfApiKey = process.env.YUANFENJU_API_KEY || "nxIPCx7RKIwf0lhSTpMUkLXpj";
  
  if (yfApiKey && birthDate) {
    try {
      const [year, month, day] = birthDate.split("-");
      // sex: 0 for乾造(male), 1 for坤造(female)
      const sexVal = (gender === "男" || String(gender).toLowerCase().includes("male") || gender === "乾造") ? "0" : "1";
      
      const formData = new URLSearchParams();
      formData.append("api_key", yfApiKey);
      formData.append("name", name);
      formData.append("sex", sexVal);
      formData.append("type", "1"); // 1 = solar/公曆
      formData.append("year", year);
      formData.append("month", month);
      formData.append("day", day);
      formData.append("hours", birthHour || "12");
      formData.append("minute", birthMinute || "00");

      console.log(`Querying Yuanfenju API for: ${name}, sex: ${sexVal} (${gender}), date: ${birthDate} ${birthHour}:${birthMinute}`);
      const yfResponse = await fetch("https://api.yuanfenju.com/index.php/v1/bazi/cesuan", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
      });

      if (yfResponse.ok) {
        const yfJson = await yfResponse.json() as any;
        if (yfJson.errcode === 0 && yfJson.data) {
          yuanfenjuData = yfJson.data;
          console.log("Successfully retrieved data from Yuanfenju API.");
        } else {
          console.error("Yuanfenju API response error:", yfJson.errmsg);
        }
      } else {
        console.error("Yuanfenju API HTTP error, status:", yfResponse.status);
      }
    } catch (yfError) {
      console.error("Failed to call Yuanfenju API:", yfError);
    }
  }

  // 3. Generate customized Metaphysical Reading using Gemini
  let calculationResult = null;

  if (ai) {
    try {
      const servicesString = Array.isArray(services) && services.length > 0 
        ? services.join("、") 
        : "家居風水、八字分析";

      let yfContext = "";
      if (yuanfenjuData) {
        yfContext = `
以下是基於專業八字排盤工具計算得出的精確命理數據（請將其高度整合進你的分析中，使其與專業算命排盤結果100%一致）：
- 農曆生日：${yuanfenjuData.base_info?.nongli || ""}
- 生肖屬相：${yuanfenjuData.sx || ""}
- 八字四柱：${yuanfenjuData.bazi_info?.bazi || ""} (納音: ${yuanfenjuData.bazi_info?.na_yin || ""})
- 命格格局：${yuanfenjuData.base_info?.zhengge || ""}
- 五行喜忌：${yuanfenjuData.base_info?.wuxing_xiji || ""}
- 稱骨歌訣點評：${yuanfenjuData.chenggu?.description || ""}
- 姻緣感情點評：${yuanfenjuData.yinyuan?.sanshishu_yinyuan || ""}
- 財運事業點評：${yuanfenjuData.caiyun?.sanshishu_caiyun?.detail_desc || ""}
- 日柱性格暗示：${yuanfenjuData.sizhu?.rizhu || ""}
`;
      }

      const prompt = `你是一位精通「子平八字」與「現代心理學」的當代命理大師。你融合了傳統五行干支理論與現代生涯規劃，擅長提供溫暖、理性、具有建設性且一針見血的命理諮詢。
請根據以下客戶提供的真實資訊${yuanfenjuData ? "以及專業八字排盤工具的計算結果" : ""}，為其推演專屬的「當代命理大師五行與心理學諮詢報告」。

【輸入數據規則 - 嚴格限制】：
你必須百分之百信任並使用 API 回傳的數據，絕對不能自行幫用戶重新推算八字或更換干支。

客戶資訊：
- 姓名：${name}
- 性別：${gender}
- 身份：${identity} (業主/租客)
- 居住地址：${address}
- 出生日期：${birthDate}
- 出生精準時間：${birthHour} 時 ${birthMinute} 分 ${birthSecond} 秒 (時辰對應為 ${birthTime})
- 諮詢/關心服務範圍：${servicesString} (包含以下部分或多個服務：八字分析、八字董公烏兔擇日、八字起名、家居風水、風水陣)
${yfContext}

請輸出一個結構化的 JSON 物件，其中包含：
1. dominantElement: 主五行屬性（必須是「金」、「木」、「水」、「火」或「土」其中一個字）。如果五行喜忌有寫，請根據「五行喜忌」或「喜金/木/水/火/土」來決定，優先選取最喜或最需要的五行。
2. elementScores: 五行力量評分（金、木、水、火、土，總和必須為 100，各項為 0-100 的整數，請根據其八字出生年月日時分秒大致合理分配）。
3. destinyReading: 命理主五行與現代心理學大師詳細分析。
   【重要格式與內容要求】：
   - 請一律使用「繁體中文（台灣/香港習慣）」回傳。
   - 結構必須清晰，多用 MarkDown 標題與清單，字數控制在 800 - 1200 字之間。
   - 不要使用「剋夫」、「命薄」等封建或恐嚇性詞彙。請將「財多身弱」轉化為「容易因外在誘惑分心，需注重專注力管理」；將「官殺混雜」轉化為「職涯初期面臨多元選擇與壓力，需建立核心護城河」，以現代心理學和溫暖建設性的語調進行轉化。
   - 請嚴格且必須包含以下 Markdown 四大結構：
     ### 🌟 本命核心（日主、喜用、核心性格）
     [在此詳細剖析其日主、喜用神，以及融合理性心理學的核心性格，指出盲點，約 250 - 300 字]

     ### 💼 事業與財運格局（潛力與適合方向）
     [在此分析其八字事業格局，結合現代生涯規劃，提供具體、可落地的發展方向、潛力，特別針對關心服務項目：${servicesString} 進行融入，約 250 - 300 字]

     ### 🔮 流年運勢精批（當前大運與今年流年的吉凶與應對策略）
     [在此結合當前大運與流年，給出具體、可操作的「流年事業/財運/感情」具體建議（例如：何時適合保守、何時適合進攻），特別融入下元九運離火運的機遇，約 250 - 300 字]

     ### 🧭 大師開運建議（一兩句具體的日常調整建議）
     [在此給出一兩句極其具體、容易操作的日常心理學與五行開運微小動作調整建議，約 100 字]

4. spaceAdvice: 專屬家居風水與佈局大師建議（約 450 字，結合其「${identity}」身份和主五行，為其居家空間提供具體、可落地的方位佈置。請按玄關、客廳、臥室、廚房等區域進行詳盡的室內佈局或軟裝指南，如果客戶選擇了風水陣或家居風水，請加入相關秘傳佈置法門）。
5. addressAura: 居住地址氣場與地靈點評（約 250 字，從字面、地理方位、山水巒頭或數理格局深層解構其地址氣場，給予強烈且具體的吉利暗示，並提供相應的微調避煞或納氣建議）。
6. auspiciousColors: 3 個最契合的幸運顏色（以中文命名，例如「黛綠」、「玄青」、「硃砂紅」、「秋香黃」、「潤白」）。
7. tips: 3 個簡單實用的「趨吉避凶」與生活美學開運法門（特別針對客戶所選服務：${servicesString} 給予實用建議）。

請嚴格以 JSON 格式回覆，不要包含 markdown 標籤或 \`\`\`json 之外的雜言。確保 JSON 格式完全正確。`;

      const response = await generateContentWithRetry(ai, {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              dominantElement: { type: Type.STRING, description: "主五行屬性 (金/木/水/火/土)" },
              elementScores: {
                type: Type.OBJECT,
                properties: {
                  metal: { type: Type.INTEGER, description: "金的百分比" },
                  wood: { type: Type.INTEGER, description: "木的百分比" },
                  water: { type: Type.INTEGER, description: "水的百分比" },
                  fire: { type: Type.INTEGER, description: "火的百分比" },
                  earth: { type: Type.INTEGER, description: "土的百分比" }
                },
                required: ["metal", "wood", "water", "fire", "earth"]
              },
              destinyReading: { type: Type.STRING, description: "命理分析" },
              spaceAdvice: { type: Type.STRING, description: "風水建議" },
              addressAura: { type: Type.STRING, description: "地址氣場評語" },
              auspiciousColors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3個幸運顏色" },
              tips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3個生活建議" }
            },
            required: ["dominantElement", "elementScores", "destinyReading", "spaceAdvice", "addressAura", "auspiciousColors", "tips"]
          }
        }
      });

      if (response.text) {
        calculationResult = JSON.parse(response.text.trim());
      }
    } catch (error) {
      console.error("Gemini analysis error, falling back to static generation:", error);
    }
  }

  // 4. Fallback calculation if Gemini API fails or is not configured
  if (!calculationResult) {
    let dominant: "金" | "木" | "水" | "火" | "土" = "土";
    let scores = { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };

    if (yuanfenjuData) {
      const xiji = yuanfenjuData.base_info?.wuxing_xiji || "";
      if (xiji.includes("喜金") || xiji.includes("用金") || xiji.includes("金旺")) {
        dominant = "金";
        scores = { wood: 10, fire: 10, earth: 15, metal: 45, water: 20 };
      } else if (xiji.includes("喜木") || xiji.includes("用木") || xiji.includes("木旺")) {
        dominant = "木";
        scores = { wood: 45, fire: 15, earth: 10, metal: 10, water: 20 };
      } else if (xiji.includes("喜水") || xiji.includes("用水") || xiji.includes("水旺")) {
        dominant = "水";
        scores = { wood: 15, fire: 10, earth: 10, metal: 20, water: 45 };
      } else if (xiji.includes("喜火") || xiji.includes("用火") || xiji.includes("火旺")) {
        dominant = "火";
        scores = { wood: 15, fire: 45, earth: 15, metal: 10, water: 15 };
      } else if (xiji.includes("喜土") || xiji.includes("用土") || xiji.includes("土旺")) {
        dominant = "土";
        scores = { wood: 10, fire: 15, earth: 45, metal: 15, water: 15 };
      } else {
        const baziStr = yuanfenjuData.bazi_info?.bazi || "";
        if (baziStr.includes("金")) dominant = "金";
        else if (baziStr.includes("木")) dominant = "木";
        else if (baziStr.includes("水")) dominant = "水";
        else if (baziStr.includes("火")) dominant = "火";
        else dominant = "土";
      }
    } else {
      // Basic deterministic calculations based on birth date hash for consistent UX
      const sum = birthDate.split("-").reduce((acc, val) => acc + parseInt(val || "0", 10), 0) + 
                  birthTime.split(":").reduce((acc, val) => acc + parseInt(val || "0", 10), 0) +
                  parseInt(birthHour || "12") + parseInt(birthMinute || "30") + parseInt(birthSecond || "00");
      
      const elements: ("金" | "木" | "水" | "火" | "土")[] = ["木", "火", "土", "金", "水"];
      dominant = elements[sum % elements.length];
    }

    if (dominant === "木") scores = { wood: 45, fire: 15, earth: 10, metal: 10, water: 20 };
    else if (dominant === "火") scores = { wood: 15, fire: 45, earth: 15, metal: 10, water: 15 };
    else if (dominant === "土") scores = { wood: 10, fire: 15, earth: 45, metal: 15, water: 15 };
    else if (dominant === "金") scores = { wood: 10, fire: 10, earth: 15, metal: 45, water: 20 };
    else scores = { wood: 15, fire: 10, earth: 10, metal: 20, water: 45 };

    const servicesString = Array.isArray(services) && services.length > 0 
      ? services.join("、") 
      : "家居風水、八字分析";

    let destinyReadingText = "";
    if (yuanfenjuData) {
      destinyReadingText = `### 🌟 本命核心（日主、喜用、核心性格）
根據專業八字排盤計算，您的日主為「${yuanfenjuData.bazi_info?.bazi?.split(" ")[2]?.charAt(0) || "命格日主"}」，本命屬「${dominant}」。在現代心理學看來，這代表您具備極強的自我認知潛力，生肖屬「${yuanfenjuData.sx || "吉"}」，納音為「${yuanfenjuData.bazi_info?.na_yin || "五行"}」。您的五行喜忌提示為「${yuanfenjuData.base_info?.wuxing_xiji || "五行調和"}」。根據日柱暗示：「${yuanfenjuData.sizhu?.rizhu || "性格和諧"}」。您擁有卓越的洞察力與堅韌心態，但有時內心容易產生過度思慮或自我懷疑，這是您在成長中需要去覺察與調適的盲點。

### 💼 事業與財運格局（潛力與適合方向）
您的命盤格局為【${yuanfenjuData.base_info?.zhengge || "正格"}】。從現代生涯規劃角度分析，這意味著您在特定專業領域具有極強的深度專研與發揮潛能。稱骨歌訣點評：「${yuanfenjuData.chenggu?.description || "衣食無憂，晚景欣然。"}」這指出您天生帶有豐富的心理與物質能量資產。財運與事業走向：「${yuanfenjuData.caiyun?.sanshishu_caiyun?.simple_desc || "所得與付出成正比，穩步上升。"}」。結合您關心的服務：${servicesString}，適合通過系統性的中長程規劃，建立起核心「職涯護城河」，以理性態度管理財富流動。

### 🔮 流年運勢精批（當前大運與今年流年的吉凶與應對策略）
今年逢流年歲月交替，大運正處於承前啟後的關鍵期。此時期的核心策略是「專注耕耘，蓄勢待發」。在感情或人際交往層面，姻緣點評指出「${yuanfenjuData.yinyuan?.sanshishu_yinyuan || "相敬如賓，關係穩固"}」，需多進行深度的情感對話。在當前下元九運離火大勢下，多接觸科技、美學與心靈成長領域，將能極大增強您的運勢。建議在諮詢服務的輔助下，於適當的時機大膽出擊，而在波折期保持冷靜沈澱。

### 🧭 大師開運建議（一兩句具體的日常調整建議）
建議您每日清晨起床後花三分鐘進行靜心冥想，理清思緒；並在辦公桌或玄關的幸運方位放置一件溫潤、契合您五行的天然擺飾，以調和環境氣場與內在能量。`;
    } else {
      destinyReadingText = `### 🌟 本命核心（日主、喜用、核心性格）
您的本命主屬性為「${dominant}」。融合現代心理學分析，您具備「${dominant === "木" ? "生機蓬勃、富有仁愛與不斷突破的成長思維" : dominant === "火" ? "熱情奔放、極具表達力、能溫暖身邊的人" : dominant === "土" ? "厚德載物、踏實穩重、是團隊與家庭的支柱" : dominant === "金" ? "剛毅果決、極具洞察力、講求原則與秩序" : "潤物無聲、思維敏捷、具有極高的適應力與彈性"}」的核心特質。然而，您有時可能因為追求完美或過於敏感，而給自己帶來不必要的精神壓力，這是您需要學會釋放的性格盲點。

### 💼 事業與財運格局（潛力與適合方向）
您的五行能量流轉有序。從現代生涯規劃來看，您適合在需要策略思考、深度創意或溝通協調的領域中大顯身手。特別是針對您所諮詢的服務項目：${servicesString}，這將幫助您撥雲見日。建議您把精力聚焦於核心競爭力的建立上，不因外在誘惑分心，方能聚財聚氣。

### 🔮 流年運勢精批（當前大運與今年流年的吉凶與應對策略）
今年大運與流年呈現相生之局，運勢穩步上揚。在事業與財富方面，這是一個適合「穩紮穩打、局部突破」的年份，在九運離火運的交接點上，多提升個人專業或探索新興賽道將有驚喜。感情方面則需要建立彼此的信任基礎，保持和諧互動。

### 🧭 大師開運建議（一兩句具體的日常調整建議）
每日在固定時間給自己留出十分鐘的數位排毒時間，喝一杯溫水，讓思緒澄明；並在經常活動的空間內引入您的幸運色軟裝，主動改善氣場調度。`;
    }

    calculationResult = {
      dominantElement: dominant,
      elementScores: scores,
      destinyReading: destinyReadingText,
      spaceAdvice: `針對您的「${identity}」身份，${dominant}屬性的空間佈局應注重氣流的和諧與明亮。建議在玄關或窗台處，引入符合您命理之軟裝。${identity === "租客" ? "作為租客，您可以選用活動式的小型盆栽、精緻的銅製擺設或棉麻質地的布藝窗簾來調和氣場，無需大動土木" : "作為業主，您可以大膽運用溫潤的木質地板、天然石材電視牆或暖色調燈光進行空間重組"}，能更深層次地匯聚福澤。`,
      addressAura: `您所居住之處「${address}」，地靈人傑。字裡行間透出土木相生之意，利於安居樂業。大門方位引納生氣，若能保持玄關整潔明亮、無雜物堆積，則藏風聚氣、家宅平安之兆。`,
      auspiciousColors: dominant === "木" ? ["黛綠", "玄青", "淺木色"] : 
                        dominant === "火" ? ["硃砂紅", "絳紫", "暖金"] :
                        dominant === "土" ? ["秋香黃", "駝色", "赭石"] :
                        dominant === "金" ? ["潤白", "明銀", "鵝黃"] : ["玄青", "碧藍", "墨灰"],
      tips: [
        "每日清晨開啟南向窗戶十分鐘，引納正陽之氣，增旺室內朝氣。",
        "在客廳或玄關顯眼處擺放一尊素雅的陶瓷器皿，象徵穩重安寧，可沉澱浮躁之氣。",
        "睡床枕頭選用與幸運顏色契合的色調，利於夜間氣場修復與心靈祥和。"
      ]
    };
  }

  // Add yuanfenju raw data to calculationResult so frontend can use it if desired
  if (yuanfenjuData) {
    (calculationResult as any).yuanfenju = yuanfenjuData;
  }

  res.json({
    success: true,
    webhookSuccess,
    data: calculationResult
  });
});

// Stripe Checkout Session and Payment Link Routing Endpoint
app.post("/api/create-checkout-session", async (req, res) => {
  const { type } = req.body;
  
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  
  if (!stripeSecretKey) {
    console.warn("STRIPE_SECRET_KEY is not set. Simulating a successful Stripe payment redirect...");
    // Fallback to simulated payment success redirect for easy previewing
    return res.json({
      url: `${appUrl}/?payment_success=true&plan=${type}`,
      isMock: true
    });
  }

  // Exact live Stripe Payment Links created by the user for direct secure routing
  const PRODUCTS_MAP: Record<string, { name: string; url: string }> = {
    basic: {
      name: "基礎運勢 Plan",
      url: "https://buy.stripe.com/4gMeVd2iS7tUbZX48GbbG03"
    },
    pro: {
      name: "專業流月 Plan",
      url: "https://buy.stripe.com/4gMbJ19Lk15w6FD9t0bbG01"
    },
    premium: {
      name: "尊貴風水 Plan月費",
      url: "https://buy.stripe.com/fZu9ATcXw4hI0hf34CbbG00"
    },
    enterprise: {
      name: "小企業風水顧問 Plan月費",
      url: "https://buy.stripe.com/eVq8wP0aK7tUbZX20ybbG02"
    },
    bazi: {
      name: "八字60年大運深度精批",
      url: "https://buy.stripe.com/9B67sLbTs8xY6FDax4bbG04"
    },
    fengshui: {
      name: "家居風水現場佈局實測",
      url: "https://buy.stripe.com/dRmeVd4r0cOe7JH7kSbbG05"
    }
  };

  const item = PRODUCTS_MAP[type];
  if (!item) {
    return res.status(400).json({ error: `無效的品項類型: ${type}` });
  }

  console.log(`[Stripe] Routing customer to live payment page for ${item.name} (${type}): ${item.url}`);
  return res.json({ url: item.url });
});

// Setup Vite Dev server or Production static folder serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static files from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
