'use client'

import Image from 'next/image'
import RecentVideos from '@/components/RecentVideos'
import FanArtCarousel from '@/components/FanArtCarousel'
import PromoNotification from '@/components/PromoNotification'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [showSpin, setShowSpin] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpin(true)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center bg-[#111111]">
      <div className="w-full flex flex-col items-center justify-center min-h-[95vh] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#111111] z-0 opacity-0 animate-hero-fade-in" style={{ animationDelay: '100ms' }}></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-[200px] h-[200px] relative animate-delayed-spin">
            <div className="absolute -inset-10 w-[300px] h-[300px] rounded-full bg-[#00ff66]/10 blur-[50px] opacity-0 animate-hero-fade-in" style={{ animationDelay: '300ms' }}></div>
            <Image
              src="/slashestpfp.jpg"
              alt="slashest"
              fill
              className={`rounded-full border-4 border-[#00ff66] shadow-lg shadow-[#00ff66]/20 object-cover relative z-10 ${showSpin ? 'animate-spin-slow' : ''}`}
              priority
            />
          </div>
          
          <h1 className="mt-10 text-5xl font-bold text-white opacity-0 animate-hero-fade-in" style={{ animationDelay: '800ms' }}>
            slash<span className="text-[#00ff66]">est</span>
          </h1>
          <p className="mt-4 text-gray-400 text-lg opacity-0 animate-hero-fade-in" style={{ animationDelay: '1000ms' }}>Content Creator on Discord</p>
          
          <div className="flex gap-4 mt-8 opacity-0 animate-hero-fade-in" style={{ animationDelay: '1200ms' }}>
            <Link href="https://discord.gg/slashest" className="px-6 py-2 bg-[#00ff66] text-black font-medium rounded-full hover:bg-[#00ff66]/80 transition-all transform hover:scale-105 flex items-center gap-2" target="_blank" rel="noopener noreferrer">
              Join Discord
            </Link>
            <Link href="https://www.youtube.com/@Slashestt" className="px-6 py-2 bg-transparent border border-[#00ff66] text-[#00ff66] font-medium rounded-full hover:bg-[#00ff66]/10 transition-all transform hover:scale-105" target="_blank" rel="noopener noreferrer">
              YouTube
            </Link>
          </div>
        </div>
      </div>

      <RecentVideos />
      <FanArtCarousel />
      <PromoNotification />
    </main>
  )
} 