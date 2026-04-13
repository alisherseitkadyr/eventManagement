"use client";

import type { Language, TemplateStyle } from "@/shared/types/common";
import { templateStyles, constructorLanguages, accentPalette } from "@/features/constructor/store";

interface StyleSettingsProps {
  activeStyle: TemplateStyle;
  activeLanguage: Language | "both";
  accentColor: string;
  onStyleChange: (style: TemplateStyle) => void;
  onLanguageChange: (lang: Language | "both") => void;
  onColorChange: (color: string) => void;
}

export function StyleSettings({
  activeStyle,
  activeLanguage,
  accentColor,
  onStyleChange,
  onLanguageChange,
  onColorChange,
}: StyleSettingsProps) {
  return (
    <div
      style={{
        background: "var(--white)",
        borderRadius: 16,
        border: "1px solid var(--sand)",
        padding: "1.25rem",
        marginTop: 16,
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 20,
          fontWeight: 500,
          marginBottom: 16,
        }}
      >
        Стиль
      </h3>

      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--charcoal-soft)",
            marginBottom: 8,
          }}
        >
          Шаблон
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {templateStyles.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onStyleChange(s.value)}
              style={{
                flex: 1,
                padding: "0.7rem",
                borderRadius: 12,
                border:
                  activeStyle === s.value
                    ? "1.5px solid var(--burgundy)"
                    : "1.5px solid var(--sand)",
                background: activeStyle === s.value ? "var(--gold-faint)" : "transparent",
                color:
                  activeStyle === s.value ? "var(--burgundy)" : "var(--charcoal-soft)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--charcoal-soft)",
            marginBottom: 8,
          }}
        >
          Язык
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {constructorLanguages.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onLanguageChange(option.value)}
              style={{
                flex: 1,
                padding: "0.6rem",
                borderRadius: 10,
                border:
                  activeLanguage === option.value
                    ? "1.5px solid var(--burgundy)"
                    : "1.5px solid var(--sand)",
                background:
                  activeLanguage === option.value ? "var(--burgundy)" : "transparent",
                color:
                  activeLanguage === option.value ? "var(--white)" : "var(--charcoal-soft)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--charcoal-soft)",
            marginBottom: 8,
          }}
        >
          Акцентный цвет
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {accentPalette.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onColorChange(color)}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: color,
                border:
                  accentColor === color
                    ? "2px solid var(--charcoal)"
                    : "2px solid transparent",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
