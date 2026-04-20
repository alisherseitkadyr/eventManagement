import { FONT_PAIRS, PALETTES } from '@entities/invitation'
import { useEditorStore } from '@features/invitation-editor'
import { InvitationRenderer } from '@widgets/invitation-preview'
import css from './invitation-canvas.module.css'

export function InvitationCanvas() {
  const blocks = useEditorStore((s) => s.blocks)
  const paletteKey = useEditorStore((s) => s.palette)
  const font = useEditorStore((s) => s.font)
  const device = useEditorStore((s) => s.device)
  const selectedId = useEditorStore((s) => s.selectedId)
  const selectBlock = useEditorStore((s) => s.selectBlock)

  const palette = PALETTES[paletteKey] ?? PALETTES.gold
  const fontPair = FONT_PAIRS.find((f) => f.id === font) ?? FONT_PAIRS[0]

  const renderer = (
    <InvitationRenderer
      blocks={blocks}
      palette={palette}
      fontPair={fontPair}
      selectedId={selectedId}
      onSelect={selectBlock}
    />
  )

  return (
    <div className={css.wrap}>
      {device === 'mobile' ? (
        <div className={css.phone}>
          <div className={css.phoneNotch}>
            <div className={css.phoneCamera} />
            <div className={css.phoneSpeaker} />
          </div>
          <div className={css.phoneScreen} style={{ background: palette.bg }}>
            {renderer}
          </div>
          <div className={css.phoneHomeBar} />
        </div>
      ) : (
        <div className={css.desktop}>
          <div className={css.desktopChrome}>
            <div className={css.desktopDots}>
              <span className={css.dot} style={{ background: '#ff5f57' }} />
              <span className={css.dot} style={{ background: '#ffbd2e' }} />
              <span className={css.dot} style={{ background: '#28c840' }} />
            </div>
            <div className={css.desktopAddressBar} />
          </div>
          <div className={css.desktopScreen} style={{ background: palette.bg }}>
            {renderer}
          </div>
        </div>
      )}
    </div>
  )
}
