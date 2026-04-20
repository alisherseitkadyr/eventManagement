import { useSyncExternalStore } from 'react'
import type { Block, BlockType } from '@entities/invitation'
import { createBlock, getDefaultInvitation } from '@entities/invitation'

export type DeviceMode = 'mobile' | 'desktop'
export type SaveState = 'saved' | 'saving' | 'unsaved'
export type EditorLanguage = 'ru' | 'kk' | 'ru+kk'

type EditorDraft = {
  blocks: Block[]
  palette: string
  font: string
  title: string
  language: EditorLanguage
}

type EditorDataState = EditorDraft & {
  projectId: string | null
  selectedId: string | null
  device: DeviceMode
  saveState: SaveState
}

type EditorActions = {
  loadProject: (projectId: string, seed?: Partial<EditorDraft>) => void
  selectBlock: (id: string | null) => void
  addBlock: (type: BlockType, afterId?: string) => void
  deleteBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  updateBlockProps: (id: string, patch: Partial<Block['props']>) => void
  moveBlock: (fromId: string, toId: string, position: 'before' | 'after') => void
  reorderBlocks: (orderedIds: string[]) => void
  setPalette: (key: string) => void
  setFont: (id: string) => void
  setDevice: (mode: DeviceMode) => void
  setLanguage: (lang: EditorLanguage) => void
  setSaveState: (state: SaveState) => void
  setTitle: (title: string) => void
  markDirty: () => void
}

export type EditorState = EditorDataState & EditorActions

type Listener = () => void
type Selector<T> = (state: EditorState) => T

let saveTimer: ReturnType<typeof setTimeout> | null = null

function clone<T>(value: T): T {
  return structuredClone(value)
}

function createBlockId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().slice(0, 8)
  }

  return Math.random().toString(36).slice(2, 10)
}

function getDraftSeed(seed?: Partial<EditorDraft>): EditorDraft {
  return {
    blocks: clone(seed?.blocks ?? getDefaultInvitation()),
    palette: seed?.palette ?? 'gold',
    font: seed?.font ?? 'fraunces-inter',
    title: seed?.title ?? 'Digital Invitation',
    language: seed?.language ?? 'kk',
  }
}

const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((listener) => listener())
}

const actions: EditorActions = {
  loadProject(projectId, seed) {
    if (state.projectId === projectId) {
      return
    }

    const nextDraft = getDraftSeed(seed)

    setState({
      projectId,
      ...nextDraft,
      selectedId: nextDraft.blocks[0]?.id ?? null,
      device: 'mobile',
      saveState: 'saved',
    })
  },

  selectBlock(id) {
    setState({ selectedId: id })
  },

  addBlock(type, afterId) {
    const newBlock = createBlock(type)

    setState((current) => {
      const blocks = [...current.blocks]

      if (afterId) {
        const index = blocks.findIndex((block) => block.id === afterId)

        if (index >= 0) {
          blocks.splice(index + 1, 0, newBlock)
        } else {
          blocks.push(newBlock)
        }
      } else {
        blocks.push(newBlock)
      }

      return {
        blocks,
        selectedId: newBlock.id,
      }
    })

    actions.markDirty()
  },

  deleteBlock(id) {
    setState((current) => {
      const index = current.blocks.findIndex((block) => block.id === id)
      const blocks = current.blocks.filter((block) => block.id !== id)

      // Move to the next block, then the previous; clear if none remain
      let nextSelectedId = current.selectedId
      if (current.selectedId === id) {
        nextSelectedId = blocks[index]?.id ?? blocks[index - 1]?.id ?? null
      }

      return { blocks, selectedId: nextSelectedId }
    })

    actions.markDirty()
  },

  duplicateBlock(id) {
    setState((current) => {
      const index = current.blocks.findIndex((block) => block.id === id)

      if (index === -1) {
        return {}
      }

      const duplicate = {
        ...clone(current.blocks[index]),
        id: createBlockId(),
      } as Block
      const blocks = [...current.blocks]
      blocks.splice(index + 1, 0, duplicate)

      return {
        blocks,
        selectedId: duplicate.id,
      }
    })

    actions.markDirty()
  },

  updateBlockProps(id, patch) {
    setState((current) => ({
      blocks: current.blocks.map((block) =>
        block.id === id
          ? ({
              ...block,
              props: {
                ...block.props,
                ...patch,
              },
            } as Block)
          : block,
      ),
    }))

    actions.markDirty()
  },

  moveBlock(fromId, toId, position) {
    if (fromId === toId) {
      return
    }

    setState((current) => {
      const blocks = [...current.blocks]
      const fromIndex = blocks.findIndex((block) => block.id === fromId)
      const toIndex = blocks.findIndex((block) => block.id === toId)

      if (fromIndex === -1 || toIndex === -1) {
        return {}
      }

      const [dragged] = blocks.splice(fromIndex, 1)
      const adjustedTarget = blocks.findIndex((block) => block.id === toId)
      const insertAt = position === 'before' ? adjustedTarget : adjustedTarget + 1
      blocks.splice(insertAt, 0, dragged)

      return { blocks }
    })

    actions.markDirty()
  },

  reorderBlocks(orderedIds) {
    setState((current) => {
      const blockMap = new Map(current.blocks.map((block) => [block.id, block]))
      const orderedBlocks = orderedIds
        .map((id) => blockMap.get(id))
        .filter((block): block is Block => Boolean(block))
      const remainingBlocks = current.blocks.filter(
        (block) => !orderedIds.includes(block.id),
      )

      return {
        blocks: [...orderedBlocks, ...remainingBlocks],
      }
    })

    actions.markDirty()
  },

  setPalette(key) {
    setState({ palette: key })
    actions.markDirty()
  },

  setFont(id) {
    setState({ font: id })
    actions.markDirty()
  },

  setDevice(mode) {
    setState({ device: mode })
  },

  setLanguage(lang) {
    setState({ language: lang })
    actions.markDirty()
  },

  setSaveState(saveState) {
    setState({ saveState })
  },

  setTitle(title) {
    setState({ title })
    actions.markDirty()
  },

  markDirty() {
    setState({ saveState: 'saving' })

    if (saveTimer) {
      clearTimeout(saveTimer)
    }

    // Debounced: 500ms after the last mutation, flip to 'saved'
    saveTimer = setTimeout(() => {
      setState({ saveState: 'saved' })
    }, 500)
  },
}

let state: EditorState = {
  projectId: null,
  ...getDraftSeed(),
  selectedId: 'b1',
  device: 'mobile',
  saveState: 'saved',
  ...actions,
}

function subscribe(listener: Listener) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

function setState(
  update:
    | Partial<EditorDataState>
    | ((current: EditorState) => Partial<EditorDataState> | Record<string, never>),
) {
  const next =
    typeof update === 'function'
      ? update(state)
      : update

  if (!Object.keys(next).length) {
    return
  }

  state = {
    ...state,
    ...next,
  }

  notify()
}

type UseEditorStore = {
  (): EditorState
  <T>(selector: Selector<T>): T
  getState: () => EditorState
  subscribe: (listener: Listener) => () => void
}

function useEditorStoreBase(): EditorState
function useEditorStoreBase<T>(selector: Selector<T>): T
function useEditorStoreBase<T>(selector?: Selector<T>) {
  const getSnapshot = () => (selector ? selector(state) : state)

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot) as T | EditorState
}

export const useEditorStore = Object.assign(useEditorStoreBase, {
  getState: () => state,
  subscribe,
}) as UseEditorStore
