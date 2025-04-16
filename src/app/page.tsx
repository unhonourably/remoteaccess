'use client'

import { useState } from 'react'
import Image from 'next/image'
import SchoolModal from '@/components/SchoolModal'

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="flex flex-col min-h-screen pt-8 animate-fade-in bg-white">
      {/* Hero Section */}
      <header className="relative px-4 md:px-8 pt-24 pb-32 md:pt-32 md:pb-40 bg-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="animate-fade-slide-up opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
              <Image
                src="/parkway.png"
                alt="Parkway Schools"
                width={200}
                height={200}
                className="mx-auto mb-8"
                priority
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight animate-fade-slide-up opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]">
              You are not alone
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto animate-fade-slide-up opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]">
              A safe space for Parkway students to find support, resources, and help with cyberbullying, mental health, and other challenges.
            </p>
            
            {/* CTA Button */}
            <div className="flex justify-center pt-4 animate-fade-slide-up opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-red-600 rounded-full font-medium text-white transition-all duration-300 hover:bg-red-700 shadow-lg hover:shadow-xl"
              >
                Get Help Now
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Support Categories */}
      <section className="py-20 px-4 md:px-8 bg-white border-t border-gray-100 animate-fade-slide-up opacity-0 [animation-delay:1000ms] [animation-fill-mode:forwards]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How We Can Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category cards with staggered animations */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-red-200 transition-all duration-300 animate-fade-slide-up opacity-0 [animation-delay:1200ms] [animation-fill-mode:forwards]">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cyberbullying Support</h3>
              <p className="text-gray-600">Get help with online harassment, bullying, and steps to stay safe on social media.</p>
      </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-red-200 transition-all duration-300 animate-fade-slide-up opacity-0 [animation-delay:1400ms] [animation-fill-mode:forwards]">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mental Health</h3>
              <p className="text-gray-600">Access resources for anxiety, depression, and other mental health concerns.</p>
      </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-red-200 transition-all duration-300 animate-fade-slide-up opacity-0 [animation-delay:1600ms] [animation-fill-mode:forwards]">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Connect with counselors and get immediate help when you need it most.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Support Section */}
      <section className="py-16 px-4 md:px-8 bg-white border-t border-gray-100 animate-fade-slide-up opacity-0 [animation-delay:1800ms] [animation-fill-mode:forwards]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Need Immediate Help?</h2>
          <div className="inline-flex items-center bg-gray-50 px-6 py-3 rounded-full shadow-lg border border-gray-100">
            <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-lg font-semibold text-gray-900">Crisis Helpline: </span>
            <a href="tel:988" className="text-red-600 font-bold ml-2 hover:text-red-700 transition-colors">988</a>
          </div>
          <p className="mt-4 text-gray-600">
            Available 24/7 - All calls are confidential
          </p>
        </div>
      </section>

      {/* School Selection Modal */}
      <SchoolModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  )
} 