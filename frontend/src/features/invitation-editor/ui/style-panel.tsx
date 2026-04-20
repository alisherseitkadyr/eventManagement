import { BLOCK_META, FONT_PAIRS, PALETTES } from '@entities/invitation'
import type { EditorLanguage } from '../model/editor-store'
import { useEditorStore } from '../model/editor-store'
import css from './style-panel.module.css'

const LANGUAGE_OPTIONS: { value: EditorLanguage; label: string }[] = [
  { value: 'kk', label: 'ҚАЗ' },
  { value: 'ru', label: 'РУС' },
  { value: 'ru+kk', label: 'РУС+ҚАЗ' },
]

const SAVE_STATE_LABELS = {
  saved: 'Draft saved to browser storage',
  saving: 'Saving your latest changes...',
  unsaved: 'You have unsaved changes',
} as const

type StylePanelProps = {
  embedded?: boolean
}

export function StylePanel({ embedded = false }: StylePanelProps) {
  const title = useEditorStore((state) => state.title)
  const palette = useEditorStore((state) => state.palette)
  const font = useEditorStore((state) => state.font)
  const device = useEditorStore((state) => state.device)
  const saveState = useEditorStore((state) => state.saveState)
  const blocks = useEditorStore((state) => state.blocks)
  const selectedId = useEditorStore((state) => state.selectedId)
  const language = useEditorStore((state) => state.language)
  const setTitle = useEditorStore((state) => state.setTitle)
  const setPalette = useEditorStore((state) => state.setPalette)
  const setFont = useEditorStore((state) => state.setFont)
  const setLanguage = useEditorStore((state) => state.setLanguage)

  const selectedBlock = blocks.find((block) => block.id === selectedId)
  const selectedMeta = selectedBlock
    ? BLOCK_META.find((meta) => meta.type === selectedBlock.type)
    : null

  return (
    <div className={`${css.root} ${embedded ? css.rootEmbedded : ''}`}>
      {!embedded ? (
        <div className={css.statusCard}>
          <div className={css.statusRow}>
            <div>
              <div className={css.sectionTitle}>Project</div>
              <div className={css.statusValue}>{SAVE_STATE_LABELS[saveState]}</div>
            </div>
            <div className={css.deviceBadge}>{device}</div>
          </div>

          <input
            className={css.titleInput}
            value={title}
            placeholder="Invitation title"
            onChange={(event) => setTitle(event.target.value)}
          />

          <div className={css.metricGrid}>
            <div className={css.metricCard}>
              <div className={css.metricNumber}>{blocks.length}</div>
              <div className={css.metricLabel}>Blocks</div>
            </div>
            <div className={css.metricCard}>
              <div className={css.metricNumber}>{selectedBlock ? '1' : '0'}</div>
              <div className={css.metricLabel}>Selected</div>
            </div>
            <div className={css.metricCard}>
              <div className={css.metricNumber}>{selectedMeta?.icon ?? '—'}</div>
              <div className={css.metricLabel}>{selectedMeta?.name ?? 'No block'}</div>
            </div>
          </div>
        </div>
      ) : null}

      <section className={css.section}>
        <div className={css.sectionTitle}>Palette</div>
        <div className={css.paletteGrid}>
          {Object.entries(PALETTES).map(([key, currentPalette]) => (
            <button
              key={key}
              type="button"
              className={`${css.paletteCard} ${palette === key ? css.paletteCardActive : ''}`}
              onClick={() => setPalette(key)}
            >
              <div className={css.swatches}>
                {currentPalette.swatches.map((swatch) => (
                  <span
                    key={swatch}
                    className={css.swatch}
                    style={{ background: swatch }}
                  />
                ))}
              </div>
              <div className={css.paletteName}>{currentPalette.name}</div>
            </button>
          ))}
        </div>
      </section>

      <section className={css.section}>
        <div className={css.sectionTitle}>Язык контента</div>
        <div className={css.seg}>
          {LANGUAGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${css.segBtn} ${language === opt.value ? css.segBtnActive : ''}`}
              onClick={() => setLanguage(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section className={css.section}>
        <div className={css.sectionTitle}>Typography</div>
        {FONT_PAIRS.map((pair) => (
          <button
            key={pair.id}
            type="button"
            className={`${css.fontOpt} ${font === pair.id ? css.fontOptActive : ''}`}
            onClick={() => setFont(pair.id)}
          >
            <div
              className={css.fontPreview}
              style={{ fontFamily: pair.displayFont }}
            >
              {pair.previewText}
            </div>
            <div className={css.fontMeta}>{pair.displayName}</div>
          </button>
        ))}
      </section>
    </div>
  )
}
