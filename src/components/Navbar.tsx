'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])

  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-4 z-50">
      <div className={`
        ${scrolled 
          ? 'bg-[#2B2D31]/95 shadow-lg' 
          : 'bg-[#2B2D31]/90'
        }
        flex items-center gap-3 px-4 h-12 rounded-lg transition-all duration-300 ease-in-out backdrop-blur-sm
      `}>
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/bigparkway.png"
            alt="Parkway Schools"
            width={120}
            height={32}
            className="transition-all duration-300"
          />
        </Link>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-600/50"></div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-3">
          <NavLink href="/get-help">Get Help</NavLink>
          <NavLink href="/resources">Resources</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <NavLink href="/profile">Profile</NavLink>
              <div className="h-6 w-px bg-gray-600/50"></div>
            </>
          ) : (
            <>
              <NavLink href="/login">Login</NavLink>
              <div className="h-6 w-px bg-gray-600/50"></div>
            </>
          )}
          <Link 
            href="/emergency" 
            className="px-3 py-1.5 bg-red-500/10 text-red-500 text-sm rounded-md font-medium hover:bg-red-500/20 transition-colors"
          >
            Emergency
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-gray-300/90 hover:text-white text-sm font-medium transition-colors"
    >
      {children}
    </Link>
  )
} 