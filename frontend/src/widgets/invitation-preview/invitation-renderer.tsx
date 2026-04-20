import type { Block, ColorKey, FontPair, OrnamentPattern, Palette } from '@entities/invitation'
import css from './invitation-renderer.module.css'

type Props = {
  blocks: Block[]
  palette: Palette
  fontPair: FontPair
  selectedId?: string | null
  onSelect?: (id: string | null) => void
}

function resolveColor(key: ColorKey, palette: Palette): string {
  if (key === 'accent') return palette.accent
  if (key === 'text') return palette.text
  if (key === 'muted') return palette.muted
  return palette.bg
}

function resolveFont(family: 'sans' | 'serif', fontPair: FontPair): string {
  return family === 'serif' ? fontPair.displayFont : fontPair.bodyFont
}

type OrnamentSvgProps = { patternId: OrnamentPattern; width: number; color: string }

function OrnamentSvg({ patternId, width, color }: OrnamentSvgProps) {
  switch (patternId) {
    case 'wave':
      return (
        <svg width={width} height={20} viewBox="0 0 100 20" fill="none">
          <path d="M0 10 Q12.5 2 25 10 Q37.5 18 50 10 Q62.5 2 75 10 Q87.5 18 100 10" stroke={color} strokeWidth="1.5" />
        </svg>
      )
    case 'diamond':
      return (
        <svg width={width} height={14} viewBox="0 0 80 14" fill={color}>
          <polygon points="14,7 19,2 24,7 19,12" />
          <polygon points="35,7 40,2 45,7 40,12" />
          <polygon points="56,7 61,2 66,7 61,12" />
        </svg>
      )
    case 'laurel':
      return (
        <svg width={width} height={22} viewBox="0 0 100 22" fill="none" stroke={color} strokeWidth="1.2">
          <path d="M50 12 Q43 7 36 9 Q29 11 27 17" />
          <path d="M50 12 Q43 4 34 5" />
          <path d="M50 12 Q57 7 64 9 Q71 11 73 17" />
          <path d="M50 12 Q57 4 66 5" />
          <circle cx="50" cy="12" r="2.5" fill={color} stroke="none" />
        </svg>
      )
    default:
      return (
        <svg width={width} height={10} viewBox="0 0 100 10" fill="none">
          <line x1="0" y1="5" x2="42" y2="5" stroke={color} strokeWidth="1" />
          <circle cx="50" cy="5" r="3" fill={color} />
          <line x1="58" y1="5" x2="100" y2="5" stroke={color} strokeWidth="1" />
        </svg>
      )
  }
}

function renderBlock(block: Block, palette: Palette, fontPair: FontPair) {
  switch (block.type) {
    case 'text': {
      const p = block.props
      return (
        <p
          className={css.text}
          style={{
            fontSize: p.fontSize,
            letterSpacing: p.letterSpacing,
            fontFamily: resolveFont(p.family, fontPair),
            color: resolveColor(p.color, palette),
            textAlign: p.align,
            opacity: p.opacity,
            fontWeight: p.weight,
            lineHeight: p.lineHeight,
            fontStyle: p.style,
          }}
        >
          {p.content}
        </p>
      )
    }

    case 'names': {
      const p = block.props
      return (
        <div
          className={css.names}
          style={{
            fontSize: p.fontSize,
            fontFamily: resolveFont(p.family, fontPair),
            color: resolveColor(p.color, palette),
          }}
        >
          {p.content}
        </div>
      )
    }

    case 'datetime': {
      const p = block.props
      return (
        <div
          className={css.datetime}
          style={{
            borderTop: p.showBorder ? `1px solid ${palette.line}` : undefined,
            borderBottom: p.showBorder ? `1px solid ${palette.line}` : undefined,
            background: p.showBackground ? palette.accentSoft : undefined,
            borderRadius: p.showBackground ? 12 : undefined,
            padding: p.showBorder || p.showBackground ? '16px 24px' : '4px 0',
          }}
        >
          <div className={css.datetimeDate} style={{ fontFamily: fontPair.bodyFont, color: palette.text }}>
            {p.dateText}
          </div>
          <div className={css.datetimeTime} style={{ fontFamily: fontPair.bodyFont, color: palette.muted }}>
            {p.timeText}
          </div>
        </div>
      )
    }

    case 'venue': {
      const p = block.props
      return (
        <div className={css.venue}>
          {p.showIcon && (
            <div className={css.venueIcon} style={{ color: palette.accent }}>◎</div>
          )}
          <div className={css.venueName} style={{ fontFamily: fontPair.bodyFont, color: palette.text }}>
            {p.venueName}
          </div>
          <div className={css.venueAddress} style={{ fontFamily: fontPair.bodyFont, color: palette.muted }}>
            {p.address}
          </div>
          {p.mapUrl && (
            <a href={p.mapUrl} target="_blank" rel="noreferrer" className={css.venueLink} style={{ color: palette.accent }}>
              Открыть карту →
            </a>
          )}
        </div>
      )
    }

    case 'divider': {
      const p = block.props
      if (p.style === 'dots') {
        return (
          <div className={css.divider} style={{ opacity: p.opacity }}>
            <span style={{ color: palette.muted, fontSize: 16, letterSpacing: 8 }}>• • •</span>
          </div>
        )
      }
      if (p.style === 'ornament') {
        return (
          <div className={css.divider} style={{ opacity: p.opacity }}>
            <span style={{ color: palette.accent, fontSize: 14, letterSpacing: 8 }}>✦ ✦ ✦</span>
          </div>
        )
      }
      return (
        <div className={css.divider}>
          <div
            className={css.dividerLine}
            style={{ width: `${p.width}%`, borderTopColor: palette.line, opacity: p.opacity }}
          />
        </div>
      )
    }

    case 'ornament': {
      const p = block.props
      return (
        <div className={css.ornament} style={{ opacity: p.opacity }}>
          <OrnamentSvg patternId={p.patternId} width={p.width} color={palette.accent} />
        </div>
      )
    }

    case 'image': {
      const p = block.props
      return (
        <div className={css.image}>
          {p.url ? (
            <img
              src={p.url}
              alt=""
              style={{
                width: p.width,
                height: p.height,
                objectFit: 'cover',
                borderRadius: `${p.borderRadius}%`,
                display: 'block',
              }}
            />
          ) : (
            <div
              className={css.imagePlaceholder}
              style={{
                width: p.width,
                height: p.height,
                borderRadius: `${p.borderRadius}%`,
                background: palette.accentSoft,
                color: palette.muted,
                borderColor: palette.accentBorder,
              }}
            >
              ▣
            </div>
          )}
        </div>
      )
    }

    case 'button': {
      const p = block.props
      return (
        <div className={css.buttons}>
          {p.buttons.map((btn) => (
            <button
              key={btn.id}
              type="button"
              className={css.button}
              style={{
                background: palette.accentSoft,
                color: palette.text,
                borderColor: palette.accentBorder,
                fontFamily: fontPair.bodyFont,
              }}
            >
              <span className={css.buttonIcon}>{btn.icon}</span>
              {btn.label}
            </button>
          ))}
        </div>
      )
    }

    case 'spacer':
      return <div style={{ height: block.props.height }} />

    case 'qr': {
      const p = block.props
      return (
        <div className={css.qr}>
          <div className={css.qrBox} style={{ borderColor: palette.line, color: palette.muted }}>▦</div>
          <div className={css.qrLabel} style={{ fontFamily: fontPair.bodyFont, color: palette.muted }}>
            {p.label}
          </div>
        </div>
      )
    }

    case 'custom': {
      const p = block.props
      return (
        <div className={css.custom}>
          <div className={css.customLabel} style={{ fontFamily: fontPair.bodyFont, color: palette.muted }}>
            {p.label.toUpperCase()}
          </div>
          <div className={css.customValue} style={{ fontFamily: fontPair.bodyFont, color: palette.text }}>
            {p.value}
          </div>
        </div>
      )
    }
  }
}

export function InvitationRenderer({ blocks, palette, fontPair, selectedId, onSelect }: Props) {
  return (
    <div className={css.root} style={{ background: palette.bg }}>
      {blocks.map((block) => (
        <div
          key={block.id}
          className={`${css.item} ${selectedId === block.id ? css.itemSelected : ''}`}
          style={selectedId === block.id ? { outlineColor: palette.accent } : undefined}
          role="button"
          tabIndex={0}
          onClick={() => onSelect?.(block.id)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSelect?.(block.id) }}
        >
          {renderBlock(block, palette, fontPair)}
        </div>
      ))}
    </div>
  )
}
