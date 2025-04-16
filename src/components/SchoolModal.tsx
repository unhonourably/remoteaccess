import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface SchoolModalProps {
  isOpen: boolean
  onClose: () => void
}

const schools = [
  {
    name: 'Parkway North',
    logo: '/north.png'
  },
  {
    name: 'Parkway South',
    logo: '/south.jpg'
  },
  {
    name: 'Parkway West',
    logo: '/west.png'
  },
  {
    name: 'Parkway Central',
    logo: '/central.png'
  }
]

export default function SchoolModal({ isOpen, onClose }: SchoolModalProps) {
  const router = useRouter()
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setIsClosing(false)
    } else if (!isClosing) {
      handleClose()
    }
  }, [isOpen])

  const handleClose = () => {
    if (!isClosing && isVisible) {
      setIsClosing(true)
      setTimeout(() => {
        setIsVisible(false)
        setIsClosing(false)
        onClose()
      }, 300)
    }
  }

  const handleSchoolSelect = (schoolName: string) => {
    setSelectedSchool(schoolName)
    handleClose()
    setTimeout(() => {
      router.push(`/get-help?school=${encodeURIComponent(schoolName)}`)
    }, 300)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isVisible) return null

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        ${!isClosing ? 'animate-fade-in' : ''}
      `}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className={`
        absolute inset-0 bg-black/50 backdrop-blur-sm
        transition-opacity duration-300
        ${isClosing ? 'opacity-0' : 'opacity-100'}
      `} />

      {/* Modal Content */}
      <div 
        className={`
          relative bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl
          transition-all duration-300
          ${!isClosing ? 'animate-fade-slide-up opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Your School</h2>
        <p className="text-gray-600 mb-6">Please select your Parkway High School to continue:</p>
        
        <div className="grid gap-3">
          {schools.map((school) => (
            <button
              key={school.name}
              onClick={() => handleSchoolSelect(school.name)}
              className={`
                w-full px-4 py-3 rounded-lg text-left font-medium transition-all duration-200
                flex items-center gap-3
                ${selectedSchool === school.name 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden bg-white">
                <Image
                  src={school.logo}
                  alt={`${school.name} logo`}
                  fill
                  className="object-contain p-1"
                />
              </div>
              {school.name}
            </button>
          ))}
        </div>

        <button
          onClick={handleClose}
          className="mt-6 w-full px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
} 