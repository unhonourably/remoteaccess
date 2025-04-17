import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full py-6 px-4 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>© {new Date().getFullYear()} Parkway Schools</span>
          <span className="hidden md:inline">•</span>
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">
            Privacy Policy
          </Link>
          <span className="hidden md:inline">•</span>
          <Link href="/terms" className="hover:text-gray-900 transition-colors">
            Terms of Use
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="https://www.parkwayschools.net" className="hover:text-gray-900 transition-colors" target="_blank" rel="noopener noreferrer">
            District Website
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-gray-900 transition-colors">
            Contact
          </Link>
          <span>•</span>
          <Link 
            href="/counselor-portal" 
            className="text-red-600 hover:text-red-700 transition-colors font-medium"
          >
            Counselor Portal
          </Link>
          <span>•</span>
          <Link 
            href="/admin" 
            className="text-red-600 hover:text-red-700 transition-colors font-medium"
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  )
} 