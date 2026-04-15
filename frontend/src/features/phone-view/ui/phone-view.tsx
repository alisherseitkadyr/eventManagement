// frontend-1/src/features/phone-view/ui/phone-view.tsx
import React from "react";
import type { TemplateFull } from "../../../entities/template/model/types";

interface PhonePreviewProps {
  template: TemplateFull;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({ template }) => {
  // Parse content from either direct object or JSON string

    const content = template.content || {};
  // Destructure with no defaults – all values may be undefined
  const {
    backgroundImage,
    title,
    subtitle,
    description,
    date,
    time,
    location,
    address,
    gallery = [],
    buttonText,
    footer,
  } = content;

  const hasDateTime = date || time;
  const hasLocation = location || address;
  const hasGallery = gallery.length > 0;

  return (
    <div className="w-[320px] h-[640px] bg-black rounded-[40px] p-3 shadow-2xl">
      <div
        className="relative w-full h-full rounded-[28px] overflow-y-auto"
        style={
          backgroundImage
            ? {
                backgroundImage: `url('${backgroundImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        {/* Dark overlay only if there's a background image */}
        {backgroundImage && (
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        )}

        <div className="relative z-10 p-5 text-white">
          {/* HERO – only if title or subtitle exists */}
          {(title || subtitle) && (
            <div className="relative h-[180px] flex flex-col items-center justify-center text-center mb-4">
              {subtitle && (
                <p className="text-xs uppercase tracking-widest drop-shadow-md">
                  {subtitle}
                </p>
              )}
              {title && (
                <h1 className="text-2xl font-semibold mt-2 drop-shadow-md">
                  {title}
                </h1>
              )}
            </div>
          )}

          {/* DESCRIPTION */}
          {description && (
            <p className="text-sm text-center mb-6 drop-shadow-md">
              {description}
            </p>
          )}

          {/* DATE / TIME */}
          {hasDateTime && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center mb-4 border border-white/30">
              {date && <p className="font-semibold text-lg">{date}</p>}
              {time && <p className="text-sm opacity-90">{time}</p>}
            </div>
          )}

          {/* LOCATION */}
          {hasLocation && (
            <div className="text-center mb-6">
              {location && (
                <p className="font-medium drop-shadow-md">📍 {location}</p>
              )}
              {address && (
                <p className="text-sm opacity-90 drop-shadow-md">{address}</p>
              )}
            </div>
          )}

          {/* GALLERY */}
          {hasGallery && (
            <div className="space-y-2 mb-4">
              <p className="font-medium text-sm drop-shadow-md">Moments</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {gallery.slice(0, 3).map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    className="w-20 h-20 object-cover rounded-lg border border-white/30"
                    alt=""
                  />
                ))}
              </div>
            </div>
          )}

          {/* DIVIDER – only if there's content after it */}
          {(buttonText || footer) && (
            <div className="border-t border-white/30 my-4" />
          )}

          {/* RSVP BUTTON */}
          {buttonText && (
            <div className="space-y-3">
              <button className="w-full bg-white/90 backdrop-blur-sm text-black py-3 rounded-xl font-medium shadow-lg hover:bg-white transition">
                {buttonText}
              </button>
              {/* The secondary button is static; you may want to make it configurable too */}
            </div>
          )}

          {/* FOOTER */}
          {footer && (
            <p className="text-xs text-center mt-6 opacity-80">{footer}</p>
          )}
        </div>
      </div>
    </div>
  );
};