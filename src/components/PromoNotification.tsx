'use client';

import { useState, useEffect, useRef } from 'react';

export default function PromoNotification() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setIsVisible(false);
      
      // Set timer to bring back the notification after 10 minutes
      timerRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 10 * 60 * 1000); // 10 minutes in milliseconds
    }, 300);
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={handleClick}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#00ff66] rounded-full flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-[#00ff66]/20 hover:scale-110 transition-transform duration-300"
          style={{ 
            animation: 'attention 2s ease-in-out infinite',
          }}
        >
          !
        </button>
      )}

      {isOpen && (
        <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}`}>
          <div className={`bg-[#111111] border-2 border-[#00ff66] rounded-xl p-6 max-w-md w-full mx-4 ${isClosing ? 'animate-modal-content-out' : 'animate-modal-content-in'} shadow-xl shadow-[#00ff66]/10`}>
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold text-white mb-3">EXCLUSIVE OFFER!</h3>
              <p className="text-gray-300 text-center mb-4">
                Use code <span className="text-[#00ff66] font-bold text-xl">SLASHEST</span> at <a href="https://gamersupps.gg/?ref=slashest" target="_blank" rel="noopener noreferrer" className="text-[#00ff66] font-bold hover:underline">GamerSupps</a> for <span className="text-[#00ff66] font-bold">10% OFF</span> your purchase!
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-[#00ff66] text-black font-medium rounded-full hover:bg-[#00ff66]/80 transition-all transform hover:scale-105"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes attention {
          0% { transform: scale(1) rotate(0deg); }
          10% { transform: scale(1.1) rotate(5deg); }
          20% { transform: scale(1.1) rotate(-5deg); }
          30% { transform: scale(1.1) rotate(5deg); }
          40% { transform: scale(1) rotate(0deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </>
  );
} 