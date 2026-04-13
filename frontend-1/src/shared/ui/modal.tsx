import type { PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from '@shared/ui/button'

type ModalProps = PropsWithChildren<{
  isOpen: boolean
  title: string
  onClose: () => void
}>

export function Modal({ children, isOpen, onClose, title }: ModalProps) {
  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end bg-[rgba(36,26,15,0.36)] p-4 sm:items-center sm:justify-center">
      <div className="app-panel w-full max-w-lg rounded-[var(--radius-lg)] p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
          <Button aria-label="Close modal" className="size-10 rounded-full p-0" onClick={onClose} variant="ghost">
            <X className="size-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
