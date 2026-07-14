import React from "react";

export function BrandLogo({ className = "h-14" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`} id="brand_logo_container">
      {/* Brand Icon: Newly generated high-end corporate Feng Shui logo */}
      <img
        src="/src/assets/images/centerland_fengshui_logo_1783844263098.jpg"
        alt="中聯家居風水命理專門店 LOGO"
        referrerPolicy="no-referrer"
        className="h-full aspect-square object-cover rounded-xl border-2 border-[#bfa15f]/60 bg-[#fbfaf7] shadow-md hover:scale-105 transition-transform duration-300"
        id="img_brand_logo"
      />

      {/* Brand Text */}
      <div className="flex flex-col ml-3 select-none" id="brand_logo_text_block">
        <div className="flex items-baseline">
          <span className="font-sans font-extrabold text-[#590612] text-xl sm:text-2xl tracking-tight leading-none">
            中聯家居風水命理
          </span>
          <span className="font-sans font-bold text-[#590612] text-xs sm:text-sm px-1.5 py-0.5 ml-1 border border-[#590612] rounded leading-none">
            專門店
          </span>
        </div>
        <div className="flex items-center space-x-1.5 mt-0.5">
          <span className="h-2.5 w-0.5 bg-gray-400"></span>
          <span className="text-[10px] sm:text-xs font-sans text-gray-500 font-medium tracking-wider">
            中聯地產物業有限公司旗下品牌
          </span>
        </div>
      </div>
    </div>
  );
}
