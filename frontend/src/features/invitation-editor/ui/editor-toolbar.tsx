import { PALETTES } from '@entities/invitation'
import type { DeviceMode, SaveState } from '../model/editor-store'
import { useEditorStore } from '../model/editor-store'
import css from './editor-toolbar.module.css'

const PALETTE_DOT_BG: Record<string, string> = {
  gold: 'linear-gradient(135deg, #1A1714 50%, #C6930A 50%)',
  olive: 'linear-gradient(135deg, #1B4332 50%, #D4A843 50%)',
  blush: 'linear-gradient(135deg, #4A1942 50%, #C77DBA 50%)',
  mono: 'linear-gradient(135deg, #0D0D0D 50%, #8A8A8A 50%)',
}

const DEVICE_SIZE: Record<DeviceMode, string> = {
  mobile: '390 x 720',
  desktop: '960 x 680',
}

const SAVE_STATE_LABELS: Record<SaveState, string> = {
  saved: 'Saved locally',
  saving: 'Saving draft...',
  unsaved: 'Unsaved changes',
}

export function EditorToolbar() {
  const device = useEditorStore((state) => state.device)
  const palette = useEditorStore((state) => state.palette)
  const saveState = useEditorStore((state) => state.saveState)
  const blocksCount = useEditorStore((state) => state.blocks.length)
  const setDevice = useEditorStore((state) => state.setDevice)
  const setPalette = useEditorStore((state) => state.setPalette)

  return (
    <div className={css.toolbar}>
      <div className={css.group}>
        <div className={css.deviceSwitcher}>
          <button
            type="button"
            className={`${css.deviceBtn} ${device === 'mobile' ? css.deviceBtnActive : ''}`}
            onClick={() => setDevice('mobile')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="7" y="2" width="10" height="20" rx="2" />
            </svg>
            Mobile
          </button>
          <button
            type="button"
            className={`${css.deviceBtn} ${device === 'desktop' ? css.deviceBtnActive : ''}`}
            onClick={() => setDevice('desktop')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
            </svg>
            Desktop
          </button>
        </div>

        <span className={css.meta}>
          {DEVICE_SIZE[device]} · {blocksCount} blocks
        </span>
      </div>

      <div className={css.group}>
        <span className={css.status}>{SAVE_STATE_LABELS[saveState]}</span>

        <div className={css.paletteSwitcher}>
          <span className={css.paletteLabel}>PALETTE</span>
          {Object.keys(PALETTES).map((key) => (
            <button
              key={key}
              type="button"
              className={`${css.dot} ${palette === key ? css.dotActive : ''}`}
              style={{ background: PALETTE_DOT_BG[key] }}
              title={PALETTES[key].name}
              onClick={() => setPalette(key)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
