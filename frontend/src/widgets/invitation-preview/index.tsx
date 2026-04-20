import { useEditorStore } from '@features/invitation-editor'
import { PALETTES, FONT_PAIRS } from '@entities/invitation'
import { InvitationRenderer } from './invitation-renderer'

export { InvitationRenderer }

type InvitationPreviewProps = {
  embedded?: boolean
}

export function InvitationPreview({ embedded = false }: InvitationPreviewProps) {
  const blocks = useEditorStore((s) => s.blocks)
  const paletteKey = useEditorStore((s) => s.palette)
  const font = useEditorStore((s) => s.font)
  const selectedId = useEditorStore((s) => s.selectedId)
  const selectBlock = useEditorStore((s) => s.selectBlock)

  const palette = PALETTES[paletteKey] ?? PALETTES.gold
  const fontPair = FONT_PAIRS.find((f) => f.id === font) ?? FONT_PAIRS[0]

  return (
    <InvitationRenderer
      blocks={blocks}
      palette={palette}
      fontPair={fontPair}
      selectedId={embedded ? selectedId : null}
      onSelect={embedded ? selectBlock : undefined}
    />
  )
}

export default InvitationPreview
