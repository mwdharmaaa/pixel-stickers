import React from 'react'
import { Heart, Terminal, ShieldCheck } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#232737] bg-[#0c0d12] py-8 mt-16 text-xs text-[#656b82]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-[#ff6b9d] fill-[#ff6b9d]" />
          <span>for cute pixel art lovers. Zero server storage required.</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#9aa1b8]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2ed573]" />
            <span>Local & Offline Ready</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#9aa1b8]">
            <Terminal className="w-3.5 h-3.5 text-[#ff6b9d]" />
            <span>Vite + React + Canvas</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
