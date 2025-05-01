'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import Link from 'next/link'

const CHANNELS = [
  { 
    id: 1, 
    img: '/slashestpfp.jpg', 
    name: 'Slashest', 
    description: 'Main Channel', 
    url: 'https://www.youtube.com/@Slashestt' 
  },
  { 
    id: 2, 
    img: '/channels/slashesttv.jpg', 
    name: 'SlashestTV', 
    description: 'Extra Content', 
    url: 'https://www.youtube.com/@SlashestTV' 
  },
  { 
    id: 3, 
    img: '/channels/slashestmusic.jpg', 
    name: 'Slashest Music', 
    description: 'Music Projects', 
    url: 'https://www.youtube.com/@SlashestMusic' 
  },
  { 
    id: 4, 
    img: '/channels/slashestclips.jpg', 
    name: 'Slashest Clips', 
    description: 'Clips Content', 
    url: 'https://www.youtube.com/@SlashestClips' 
  },
  { 
    id: 5, 
    img: '/channels/slashestediting.jpg', 
    name: 'Slashest Editing', 
    description: 'Editing Projects', 
    url: 'https://www.youtube.com/@SlashestEditing' 
  }
]

export default function MusicCarousel() {
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
          My <span className="text-[#00ff66]">Channels</span>
        </h2>
        
        <div className="relative">
          <div className="overflow-hidden" ref={viewportRef}>
            <div className="flex py-8">
              {CHANNELS.map((channel, index) => (
                <div
                  key={channel.id}
                  className="relative flex-[0_0_80%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] pl-8"
                >
                  <Link href={channel.url} target="_blank" rel="noopener noreferrer">
                    <div 
                      className={`relative transform transition-all duration-500 ${
                        index === selectedIndex 
                          ? 'scale-[1.05] -translate-y-2 z-20' 
                          : 'scale-[0.9] opacity-70 z-10'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="h-52 w-52 rounded-full overflow-hidden relative">
                          <Image
                            src={channel.img}
                            alt={`${channel.name} YouTube Channel`}
                            fill
                            className="object-cover"
                          />
                          <div 
                            className={`absolute inset-0 rounded-full border-4 ${
                              index === selectedIndex 
                                ? 'border-[#00ff66] shadow-lg shadow-[#00ff66]/30' 
                                : 'border-white/50'
                            }`}
                          ></div>
                        </div>
                        
                        <div className="mt-6 text-center">
                          <h3 className="text-white text-xl font-semibold">{channel.name}</h3>
                          <p className="text-gray-400 mt-1">{channel.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8 gap-2">
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
      </div>
    </section>
  )
} 