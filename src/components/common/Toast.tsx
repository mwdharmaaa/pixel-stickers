import React, { useEffect } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  text: string
}

interface ToastProps {
  message: ToastMessage | null
  onDismiss: () => void
}

export const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      onDismiss()
    }, 2800)
    return () => clearTimeout(timer)
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 bg-[#161822]/95 border-[#2f3448] text-[#f3f4f8]">
      {message.type === 'success' ? (
        <CheckCircle2 className="w-4 h-4 text-[#2ed573] shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 text-[#ff4757] shrink-0" />
      )}
      <span className="text-sm font-medium">{message.text}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="p-1 rounded text-[#9aa1b8] hover:text-[#f3f4f8] hover:bg-[#252a3b] transition-colors ml-1"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
