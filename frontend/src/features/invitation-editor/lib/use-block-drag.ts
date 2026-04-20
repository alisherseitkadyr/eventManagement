import { useMemo, useRef, type DragEvent } from 'react'
import { useEditorStore } from '../model/editor-store'

type DropPosition = 'before' | 'after'

let activeDragId: string | null = null

function clearDropIndicator(element: HTMLDivElement | null) {
  if (!element) {
    return
  }

  delete element.dataset.dropPosition
}

function getDropPosition(
  event: DragEvent<HTMLDivElement>,
  element: HTMLDivElement | null,
): DropPosition {
  if (!element) {
    return 'after'
  }

  const { top, height } = element.getBoundingClientRect()
  return event.clientY < top + height / 2 ? 'before' : 'after'
}

export function useBlockDrag(blockId: string) {
  const itemRef = useRef<HTMLDivElement | null>(null)
  const moveBlock = useEditorStore((state) => state.moveBlock)
  const selectBlock = useEditorStore((state) => state.selectBlock)

  const draggableProps = useMemo(
    () => ({
      draggable: true,
      onDragStart(event: DragEvent<HTMLDivElement>) {
        activeDragId = blockId
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', blockId)
      },
      onDragOver(event: DragEvent<HTMLDivElement>) {
        if (!activeDragId || activeDragId === blockId) {
          return
        }

        event.preventDefault()
        if (itemRef.current) {
          itemRef.current.dataset.dropPosition = getDropPosition(event, itemRef.current)
        }
      },
      onDragLeave() {
        clearDropIndicator(itemRef.current)
      },
      onDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault()

        if (!activeDragId || activeDragId === blockId) {
          clearDropIndicator(itemRef.current)
          activeDragId = null
          return
        }

        const position = getDropPosition(event, itemRef.current)
        moveBlock(activeDragId, blockId, position)
        selectBlock(activeDragId)
        clearDropIndicator(itemRef.current)
        activeDragId = null
      },
      onDragEnd() {
        clearDropIndicator(itemRef.current)
        activeDragId = null
      },
    }),
    [blockId, moveBlock, selectBlock],
  )

  return {
    itemRef,
    draggableProps,
  }
}
