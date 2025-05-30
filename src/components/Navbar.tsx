'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20
          if (isScrolled !== scrolled) {
            setScrolled(isScrolled)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])

  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-4 z-50 w-full max-w-3xl px-4 flex justify-center pointer-events-none">
      <div className="flex items-center gap-2 h-full justify-center pointer-events-auto">
        <div className="flex justify-center items-center flex-shrink-0 h-full">
          <div 
            className={`
              relative drop-shadow-lg
              ${scrolled ? 'scale-110' : 'scale-100'}
            `}
            style={{
              width: '36px',
              height: '36px',
              transition: 'transform 700ms ease-out',
              willChange: 'transform'
            }}
          >
          </div>
        </div>
        <span 
          className={`
            text-lg font-medium overflow-hidden whitespace-nowrap transition-all duration-700 ease-out drop-shadow-lg
            ${scrolled ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-1'}
          `}
          style={{
            transitionProperty: 'max-width, opacity, margin',
            willChange: 'max-width, opacity, margin-left'
          }}
        >
        </span>
      </div>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-gray-400 hover:text-[#00ff66] text-sm font-medium transition-colors"
    >
      {children}
    </Link>
  )
} 