import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full py-4 border-t border-[#333333] bg-[#111111]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-4">
          <span>© {new Date().getFullYear()} slash<span className="text-[#00ff66]">est</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="https://discord.gg/slashest" className="hover:text-[#00ff66] transition-colors" target="_blank" rel="noopener noreferrer">
            Discord
          </Link>
          <span>•</span>
          <Link href="https://www.youtube.com/@Slashestt" className="hover:text-[#00ff66] transition-colors" target="_blank" rel="noopener noreferrer">
            YouTube
          </Link>
          <span>•</span>
          <Link href="https://x.com/Slashestt" className="hover:text-[#00ff66] transition-colors" target="_blank" rel="noopener noreferrer">
            Twitter
          </Link>
          <span>•</span>
          <Link href="https://gamersupps.gg/?ref=slashest" className="hover:text-[#00ff66] transition-colors" target="_blank" rel="noopener noreferrer">
            GamerSupps
          </Link>
        </div>
      </div>
    </footer>
  )
}
