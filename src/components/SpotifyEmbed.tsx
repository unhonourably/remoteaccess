'use client'

import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

export default function SpotifyEmbed() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-100px 0px'
  })

  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <section 
      className="py-16 bg-[#111111] w-full"
      ref={ref}
    >
      <div 
        className={`max-w-6xl mx-auto px-4 transform transition-all duration-1000 ${
          inView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          My <span className="text-[#00ff66]">Music</span>
        </h2>
        
        <div className="relative rounded-2xl overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br from-[#00ff66]/20 to-transparent z-10 opacity-70 ${isLoaded ? 'animate-pulse-slow' : ''}`}></div>
          <div className="absolute inset-0 bg-black/30 z-0"></div>
          
          <div className="relative z-20 p-0.5">
            <iframe 
              style={{ borderRadius: '12px' }}
              src="https://open.spotify.com/embed/artist/0E3BXt4J29Gj8I7R0ZSfpP?utm_source=generator&theme=0" 
              width="100%" 
              height="650" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              className="rounded-xl"
              onLoad={() => setIsLoaded(true)}
            />
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <a 
            href="https://open.spotify.com/artist/0E3BXt4J29Gj8I7R0ZSfpP?si=vqWlDkfKQXaPLu6X6y5p7Q" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-transparent border border-[#00ff66] text-[#00ff66] font-medium rounded-full hover:bg-[#00ff66]/10 transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            <span>Follow on Spotify</span>
          </a>
        </div>
      </div>
    </section>
  )
} 