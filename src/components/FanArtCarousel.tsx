'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import Link from 'next/link'

const FANART = [
  { id: 1, img: '/fanart/fanart1.png', artist: '@silly_man.85 on discord' },
  { id: 2, img: '/fanart/fanart2.png', artist: '@silly_man.85 on discord' },
  { id: 3, img: '/fanart/fanart3.png', artist: '@aciere on discord' },
  { id: 4, img: '/fanart/fanart4.png', artist: '@bravewarlord on discord' },
  { id: 5, img: '/fanart/fanart5.png', artist: '@sleepyberk on discord' }
]

export default function FanArtCarousel() {
  const [viewportRef, embla] = useEmblaCarousel({
    loop: true,
    skipSnaps: false,
    dragFree: true
  })
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-150px 0px'
  })
  
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollTo = useCallback(
    (index: number) => embla && embla.scrollTo(index),
    [embla]
  )

  const onSelect = useCallback(() => {
    if (!embla) return
    setSelectedIndex(embla.selectedScrollSnap())
  }, [embla])

  useEffect(() => {
    if (!embla) return
    
    onSelect()
    setScrollSnaps(embla.scrollSnapList())
    embla.on('select', onSelect)
    
    return () => {
      embla.off('select', onSelect)
    }
  }, [embla, onSelect])

  useEffect(() => {
    if (!embla) return
    
    const autoplay = setInterval(() => {
      if (!embla.canScrollNext()) {
        embla.scrollTo(0)
      } else {
        embla.scrollNext()
      }
    }, 4000)
    
    return () => clearInterval(autoplay)
  }, [embla])

  return (
    <section 
      className="py-12 bg-[#111111] w-full mt-[-2vh]"
      ref={ref}
    >
      <div 
        className={`max-w-6xl mx-auto px-4 transform transition-all duration-1000 ${
          inView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-3xl font-bold text-white mb-8">
          Community <span className="text-[#00ff66]">Creations</span>
        </h2>
        
        <div className="relative">
          <div className="overflow-hidden" ref={viewportRef}>
            <div className="flex py-8">
              {FANART.map((art, index) => (
                <div
                  key={art.id}
                  className="relative flex-[0_0_80%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] pl-8"
                >
                  <div 
                    className={`relative h-80 transform transition-all duration-500 ${
                      index === selectedIndex 
                        ? 'scale-[1.02] -translate-y-2 z-20' 
                        : 'scale-[0.9] opacity-70 z-10'
                    }`}
                  >
                    <div className="h-full w-full overflow-hidden rounded-xl relative">
                      <Image
                        src={art.img}
                        alt={`Fan art by ${art.artist}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-white text-sm opacity-70">by {art.artist}</p>
                      </div>
                    </div>
                    <div 
                      className={`absolute inset-0 rounded-xl shadow-xl ${
                        index === selectedIndex 
                          ? 'shadow-[#00ff66]/20' 
                          : 'shadow-black/50'
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Dots */}
        <div className="flex justify-center mt-6 gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'bg-[#00ff66] w-4'
                  : 'bg-gray-500'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="https://discord.gg/slashest" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-2 bg-transparent border border-[#00ff66] text-[#00ff66] font-medium rounded-full hover:bg-[#00ff66]/10 transition-all transform hover:scale-105"
          >
            Join the Community
          </Link>
        </div>
      </div>
    </section>
  )
} 