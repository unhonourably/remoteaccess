'use client'

import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'

export default function ProjectsShowcase() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-100px 0px'
  })

  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  return (
    <section 
      className="py-16 bg-[#111111] w-full"
      ref={ref}
    >
      <div 
        className={`max-w-7xl mx-auto px-4 transform transition-all duration-1000 ${
          inView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          Featured <span className="text-[#00ff66]">Projects</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <div className={`absolute inset-0 bg-gradient-to-br from-[#00ff66]/30 to-transparent z-10 opacity-70 ${isVideoLoaded ? 'animate-pulse-slow' : ''}`}></div>
            <div className="absolute inset-0 bg-black/50 z-0"></div>
            <iframe 
              src="https://www.youtube.com/embed/TzPD_23Kk4E?si=DDAmJpx7Uq72-g9c" 
              title="YouTube video player" 
              className="absolute inset-0 w-full h-full z-20"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
              onLoad={() => setIsVideoLoaded(true)}
            ></iframe>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#00ff66]">
              <span className="w-6 h-6 rounded-full bg-[#00ff66] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-4 h-4">
                  <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
                </svg>
              </span>
              <span className="text-md font-medium">Video</span>
            </div>
            
            <h3 className="text-3xl font-bold text-white">Discord Diss Battles</h3>
            
            <div className="flex items-center gap-4 border-y border-gray-800 py-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400">
                  <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                  <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-400 text-sm">Uploaded on Feb 13, 2024</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-2">
              <div className="flex -space-x-2">
                <Link href="https://www.youtube.com/@Yukidomari69" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#111111] relative block transform transition-transform hover:scale-110 hover:z-10">
                  <Image src="/featuring/buko.jpg" alt="Buko" fill className="object-cover" />
                </Link>
                <Link href="https://www.youtube.com/@packgod." target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#111111] relative block transform transition-transform hover:scale-110 hover:z-10">
                  <Image src="/featuring/packgod.jpg" alt="Packgod" fill className="object-cover" />
                </Link>
                <Link href="https://www.youtube.com/@Dr_Yunk" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#111111] relative block transform transition-transform hover:scale-110 hover:z-10">
                  <Image src="/featuring/yunk.jpg" alt="Yunk" fill className="object-cover" />
                </Link>
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-400 border-2 border-[#111111]">
                  +5
                </div>
              </div>
              <span className="text-gray-400 text-sm">Featuring</span>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4 pt-3">
              <Link 
                href="https://www.youtube.com/watch?v=TzPD_23Kk4E" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#00ff66] text-black font-medium rounded-full hover:bg-[#00ff66]/80 transition-all transform hover:scale-105"
              >
                Watch Video on YouTube
              </Link>
              
              <button 
                className="px-6 py-3 bg-transparent text-white font-medium rounded-full hover:bg-white/5 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <span>Next Project</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 