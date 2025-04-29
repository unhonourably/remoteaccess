'use client'

import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

const FEATURED_VIDEOS = [
  {
    id: 'M8x4-JY62ak',
    title: "BEST OF SLASHEST 2024",
    date: "Dececmber 31st, 2024"
  },
  {
    id: 'qsgbYmORc3I',
    title: "Making a MUSIC VIDEO in Discord",
    date: "December 21st, 2024"
  },
  {
    id: 'BGuPkSto3KA',
    title: "Dumbest Discord VCs",
    date: "September 1st, 2024"
  }
]

export default function RecentVideos() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-100px 0px'
  })

  return (
    <section 
      ref={ref} 
      className="py-12 bg-[#111111] w-full mt-[-5vh]"
    >
      <div 
        className={`max-w-6xl mx-auto px-4 transform transition-all duration-1000 ${
          inView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-3xl font-bold text-white mb-8">
          Featured <span className="text-[#00ff66]">Videos</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_VIDEOS.map((video, index) => (
            <div 
              key={video.id}
              className={`bg-[#1a1a1a] rounded-lg overflow-hidden shadow-lg hover:shadow-[#00ff66]/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] ${
                inView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionDelay: `${index * 200}ms`
              }}
            >
              <div className="relative aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-lg">{video.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{video.date}</p>
                <Link 
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[#00ff66] text-sm hover:underline"
                >
                  Watch on YouTube
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="https://www.youtube.com/@Slashestt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-2 bg-transparent border border-[#00ff66] text-[#00ff66] font-medium rounded-full hover:bg-[#00ff66]/10 transition-all transform hover:scale-105"
          >
            View More Videos
          </Link>
        </div>
      </div>
    </section>
  )
} 