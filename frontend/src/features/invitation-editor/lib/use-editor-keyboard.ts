import { useEffect, useCallback } from 'react';
import { useEditorStore } from '../model/editor-store';

export function useEditorKeyboard() {
  const { selectedId, deleteBlock, selectBlock, markDirty } = useEditorStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // ⌘S / Ctrl+S — save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        markDirty(); // triggers the save flow in the store
        return;
      }

      // Escape — deselect
      if (e.key === 'Escape') {
        selectBlock(null);
        return;
      }

      // Delete / Backspace — remove selected block (unless focus is in an input)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const active = document.activeElement as HTMLElement | null;
        const isEditing =
          active &&
          (active.tagName === 'INPUT' ||
            active.tagName === 'TEXTAREA' ||
            active.isContentEditable);

        if (!isEditing && selectedId) {
          e.preventDefault();
          deleteBlock(selectedId);
        }
      }
    },
    [selectedId, deleteBlock, selectBlock, markDirty],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}