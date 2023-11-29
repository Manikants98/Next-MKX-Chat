import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#222e35]">
      <div className="loader whitespace-nowrap">
        <span>Desi Chat</span>
        <span>Desi Chat</span>
      </div>
      <p className="absolute text-xs text-white bottom-10">Powered by MKX™</p>
    </div>
  );
}
