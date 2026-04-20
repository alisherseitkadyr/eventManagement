import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { BLOCK_META } from '@entities/invitation';
import type { Block, BlockType } from '@entities/invitation';
import { useEditorStore } from '../model/editor-store';
import { useBlockDrag } from '../lib/use-block-drag';
import css from './block-list-panel.module.css';

// ─── Helper: preview text per block type ─────────────────
function getPreviewText(b: Block): string {
  switch (b.type) {
    case 'text':
    case 'names':
      return (b.props.content ?? '').split('\n')[0].slice(0, 40);
    case 'datetime':
      return `${b.props.dateText} · ${b.props.timeText}`;
    case 'venue':
      return b.props.venueName;
    case 'divider':
      return `${b.props.style} · ${b.props.width}px`;
    case 'ornament':
      return `${b.props.patternId} · ${Math.round(b.props.opacity * 100)}%`;
    case 'spacer':
      return `${b.props.height}px`;
    case 'button':
      return `${b.props.buttons.length} button(s)`;
    case 'qr':
      return b.props.label;
    case 'custom':
      return `${b.props.label}: ${b.props.value}`;
    case 'image':
      return `${b.props.width}×${b.props.height}`;
    default:
      return '';
  }
}

// ─── Single draggable block row ───────────────────────────
interface BlockRowProps {
  block: Block;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const BlockRow = memo(function BlockRow({ block, isSelected, onSelect, onDuplicate, onDelete }: BlockRowProps) {
  const meta = BLOCK_META.find((m) => m.type === block.type);
  const { itemRef, draggableProps } = useBlockDrag(block.id);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      ref={itemRef}
      className={[css.item, isSelected ? css.selected : '', isDragging ? css.dragging : ''].join(' ')}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest(`.${css.miniBtn}`)) return;
        onSelect(block.id);
      }}
      {...draggableProps}
      onDragStart={(e) => { setIsDragging(true); draggableProps.onDragStart(e); }}
      onDragEnd={() => { setIsDragging(false); draggableProps.onDragEnd(); }}
    >
      <span className={css.dragHandle}>⋮⋮</span>
      <div className={css.icon}>{meta?.icon ?? '?'}</div>
      <div className={css.info}>
        <div className={css.typeName}>
          {meta?.name ?? block.type}
          {block.linkOnly && <span className={css.linkBadge}>·link</span>}
        </div>
        <div className={css.preview}>{getPreviewText(block)}</div>
      </div>
      <div className={css.actions}>
        <button
          className={css.miniBtn}
          title="Duplicate"
          onClick={(e) => { e.stopPropagation(); onDuplicate(block.id); }}
        >
          ⎘
        </button>
        <button
          className={`${css.miniBtn} ${css.miniBtnDanger}`}
          title="Delete"
          onClick={(e) => { e.stopPropagation(); onDelete(block.id); }}
        >
          ✕
        </button>
      </div>
    </div>
  );
})

// ─── Add block menu ───────────────────────────────────────
interface AddMenuProps {
  onAdd: (type: BlockType) => void;
}

function AddMenu({ onAdd }: AddMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={css.addContainer} ref={containerRef}>
      <button className={css.addBtn} onClick={() => setOpen((o) => !o)}>
        + Добавить блок
      </button>
      <div className={`${css.menu} ${open ? css.open : ''}`}>
        {BLOCK_META.map((m) => (
          <div
            key={m.type}
            className={css.menuItem}
            onClick={() => { onAdd(m.type); setOpen(false); }}
          >
            <div className={css.menuIcon}>{m.icon}</div>
            <div className={css.menuText}>
              <div className={css.menuItemTitle}>{m.name}</div>
              <div className={css.menuItemDesc}>{m.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BlockListPanel ───────────────────────────────────────
export function BlockListPanel() {
  const blocks = useEditorStore((s) => s.blocks);
  const selectedId = useEditorStore((s) => s.selectedId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const addBlock = useEditorStore((s) => s.addBlock);
  const deleteBlock = useEditorStore((s) => s.deleteBlock);
  const duplicateBlock = useEditorStore((s) => s.duplicateBlock);

  const handleAdd = useCallback(
    (type: BlockType) => addBlock(type, selectedId ?? undefined),
    [addBlock, selectedId],
  );

  return (
    <div className={css.root}>
      <div className={css.header}>
        <span className={css.title}>Структура</span>
        <span className={css.count}>{blocks.length} блоков</span>
      </div>

      <div className={css.list}>
        {blocks.map((block) => (
          <BlockRow
            key={block.id}
            block={block}
            isSelected={selectedId === block.id}
            onSelect={selectBlock}
            onDuplicate={duplicateBlock}
            onDelete={deleteBlock}
          />
        ))}
      </div>

      <AddMenu onAdd={handleAdd} />
    </div>
  );
}
