// components/PhonePreview.tsx
import React from "react";
import type { TemplateFull } from "../../../entities/template/model/types";

interface PhonePreviewProps {
  template: TemplateFull;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({ template }) => {
  return (
    <div className="w-[320px] h-[640px] bg-black rounded-[40px] p-3 shadow-2xl">
      <div
        className="relative w-full h-full rounded-[28px] overflow-y-auto"
        style={{
          backgroundImage: `url('/mockphoto/invite_001.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="relative z-10 p-5 text-white">
          {/* ... your invitation content ... */}
        </div>
      </div>
    </div>
  );
};