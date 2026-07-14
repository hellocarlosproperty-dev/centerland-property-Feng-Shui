import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X, MessageSquare, PhoneCall } from "lucide-react";

interface PaymentError {
  message: string;
  planName: string;
  planId: string;
}

interface PaymentStatusMonitorProps {
  paymentError: PaymentError | null;
  onClose: () => void;
  userName?: string;
}

export function PaymentStatusMonitor({
  paymentError,
  onClose,
  userName = ""
}: PaymentStatusMonitorProps) {
  if (!paymentError) return null;

  // Prefilled WhatsApp text with specific error and product details to maximize conversion
  const whatsappNumber = "85291884964";
  const buyerName = userName ? `（客戶：${userName}）` : "";
  const messageText = `您好，我剛剛嘗試在網站上辦理『${paymentError.planName}』時，遇到 Stripe 支付通道連線異常 ${buyerName}。

⚠️ 系統錯誤訊息：${paymentError.message}
🎯 目標服務：${paymentError.planName} (代碼: ${paymentError.planId})

請大師秘書協助我進行人工登記與安排收款，謝謝！`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-[420px] bg-white border-2 border-red-200 rounded-2xl shadow-2xl p-5 z-50 overflow-hidden font-serif"
        id="payment-status-monitor-card"
      >
        {/* Decorative background aura */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full blur-2xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-50 rounded-full blur-xl -z-10 pointer-events-none" />

        <div className="flex items-start gap-3.5">
          <div className="bg-red-50 p-2.5 rounded-xl border border-red-100 flex-shrink-0 text-red-600 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-zinc-900 tracking-wide flex items-center gap-1.5">
                <span>⚠️ 支付安全通道提示</span>
                <span className="text-[10px] bg-red-100 text-red-800 font-sans px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                  連結受阻
                </span>
              </h4>
              <button
                type="button"
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                aria-label="關閉提示"
                id="close-monitor-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              很抱歉，安全支付通道載入超時或遭遇攔截。為避免您的開運大氣受阻，我們的專屬大師秘書正線上為您提供人工綠色通道：
            </p>

            {/* Error specifics container */}
            <div className="my-3 p-3 bg-zinc-50 border border-zinc-100 rounded-xl space-y-1.5 text-xs font-sans">
              <div className="flex justify-between items-center text-zinc-600">
                <span className="text-zinc-400 font-serif">擬購服務</span>
                <span className="font-bold text-zinc-800 font-serif">{paymentError.planName}</span>
              </div>
              <div className="flex justify-between items-start text-zinc-600">
                <span className="text-zinc-400 font-serif flex-shrink-0">異常代碼</span>
                <span className="text-right text-red-600 break-all pl-4 font-mono font-medium text-[11px]">
                  {paymentError.message}
                </span>
              </div>
            </div>

            {/* Reassuring note */}
            <p className="text-[11px] text-amber-700 bg-amber-50/70 border border-amber-100/50 p-2 rounded-lg leading-relaxed mb-4">
              💡 <strong>大師秘書溫馨提示：</strong>秘書收到通知後將立即協助為您安排「PayMe / 轉數快 / 微信支付 / 實體店刷卡」等人工特快渠道，優惠折扣與贈送大氣權益完全保留。
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all hover:shadow-lg flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer shadow-md shadow-emerald-600/10"
                id="contact-whatsapp-secretary-btn"
              >
                <MessageSquare className="w-4 h-4" />
                <span>💬 聯絡秘書人工協助</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-800 rounded-xl text-xs font-medium transition-colors font-sans cursor-pointer"
                id="dismiss-monitor-btn"
              >
                返回
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
