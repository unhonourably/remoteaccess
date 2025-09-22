'use client'

import { useState, useEffect } from 'react'

interface RichPresenceData {
  image: string
  imageAltText: string
  smallImage: string
  smallImageAltText: string
  title: string
  line1: string
  line2: string
  button1Text: string
  button1Url: string
  button2Text: string
  button2Url: string
}

interface RichPresenceControlProps {
  onLogout: () => void
}

export default function RichPresenceControl({ onLogout }: RichPresenceControlProps) {
  const [presenceData, setPresenceData] = useState<RichPresenceData>({
    image: '',
    imageAltText: '',
    smallImage: '',
    smallImageAltText: '',
    title: '',
    line1: '',
    line2: '',
    button1Text: '',
    button1Url: '',
    button2Text: '',
    button2Url: ''
  })
  const [isConnected, setIsConnected] = useState(false)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const updatePresence = async () => {
    setLoading(true)
    setStatus('Updating presence...')
    
    try {
      const response = await fetch('/api/rpc/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(presenceData)
      })

      const data = await response.json()

      if (response.ok) {
        setStatus(`Rich Presence updated! (${data.clientsNotified}/${data.totalClients} clients notified)`)
        setIsConnected(data.totalClients > 0)
      } else {
        setStatus('Failed to update Rich Presence')
      }
    } catch (error) {
      setStatus('Error updating Rich Presence')
      setIsConnected(false)
    }
    
    setLoading(false)
    setTimeout(() => setStatus(''), 5000)
  }

  const clearPresence = async () => {
    setLoading(true)
    setStatus('Clearing presence...')
    
    try {
      const response = await fetch('/api/rpc/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (response.ok) {
        setStatus(`Rich Presence cleared! (${data.clientsNotified}/${data.totalClients} clients notified)`)
        setPresenceData({ 
          image: '', 
          imageAltText: '',
          smallImage: '',
          smallImageAltText: '',
          title: '', 
          line1: '', 
          line2: '',
          button1Text: '',
          button1Url: '',
          button2Text: '',
          button2Url: ''
        })
      } else {
        setStatus('Failed to clear Rich Presence')
      }
    } catch (error) {
      setStatus('Error clearing Rich Presence')
    }
    
    setLoading(false)
    setTimeout(() => setStatus(''), 5000)
  }

  const testConnection = async () => {
    setLoading(true)
    setStatus('Testing connection...')
    
    try {
      const [statusResponse, clientsResponse] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/rpc/register')
      ])
      
      if (statusResponse.ok && clientsResponse.ok) {
        const clientsData = await clientsResponse.json()
        setStatus(`Server online! ${clientsData.connectedClients} PC clients connected`)
        setIsConnected(clientsData.connectedClients > 0)
      } else {
        setStatus('Unable to connect to server')
        setIsConnected(false)
      }
    } catch (error) {
      setStatus('Error connecting to server')
      setIsConnected(false)
    }
    
    setLoading(false)
    setTimeout(() => setStatus(''), 5000)
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Discord Rich Presence Control</h1>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-gray-300 text-sm">
                    {isConnected ? 'PC client connected' : 'No PC clients connected'}
                  </span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Rich Presence Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Large Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/large-image.png"
                      value={presenceData.image}
                      onChange={(e) => setPresenceData({...presenceData, image: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Large Image Alt Text
                    </label>
                    <input
                      type="text"
                      placeholder="Alt text for large image"
                      value={presenceData.imageAltText}
                      onChange={(e) => setPresenceData({...presenceData, imageAltText: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Small Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/small-image.png"
                      value={presenceData.smallImage}
                      onChange={(e) => setPresenceData({...presenceData, smallImage: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Small Image Alt Text
                    </label>
                    <input
                      type="text"
                      placeholder="Alt text for small image"
                      value={presenceData.smallImageAltText}
                      onChange={(e) => setPresenceData({...presenceData, smallImageAltText: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Your activity title"
                      value={presenceData.title}
                      onChange={(e) => setPresenceData({...presenceData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Line 1
                    </label>
                    <input
                      type="text"
                      placeholder="First detail line"
                      value={presenceData.line1}
                      onChange={(e) => setPresenceData({...presenceData, line1: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Line 2
                    </label>
                    <input
                      type="text"
                      placeholder="Second detail line"
                      value={presenceData.line2}
                      onChange={(e) => setPresenceData({...presenceData, line2: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="border-t border-white/20 pt-4 mt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Buttons (Optional)</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Button 1 Text
                        </label>
                        <input
                          type="text"
                          placeholder="Visit Website"
                          value={presenceData.button1Text}
                          onChange={(e) => setPresenceData({...presenceData, button1Text: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Button 1 URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://example.com"
                          value={presenceData.button1Url}
                          onChange={(e) => setPresenceData({...presenceData, button1Url: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Button 2 Text
                        </label>
                        <input
                          type="text"
                          placeholder="Join Discord"
                          value={presenceData.button2Text}
                          onChange={(e) => setPresenceData({...presenceData, button2Text: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Button 2 URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://discord.gg/invite"
                          value={presenceData.button2Url}
                          onChange={(e) => setPresenceData({...presenceData, button2Url: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={updatePresence}
                    disabled={loading}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {loading ? 'Updating...' : 'Update Presence'}
                  </button>
                  
                  <button
                    onClick={clearPresence}
                    disabled={loading}
                    className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    {loading ? 'Clearing...' : 'Clear Presence'}
                  </button>
                </div>

                <button
                  onClick={testConnection}
                  disabled={loading}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-sm rounded-lg transition-colors"
                >
                  Test Connection
                </button>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Preview</h2>
                
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-start gap-4">
                    {presenceData.image && (
                      <div className="relative w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={presenceData.image} 
                          alt={presenceData.imageAltText || "Rich Presence"} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        {presenceData.smallImage && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-600 rounded-full overflow-hidden border-2 border-gray-800">
                            <img 
                              src={presenceData.smallImage} 
                              alt={presenceData.smallImageAltText || "Status"} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      {presenceData.title && (
                        <h3 className="text-white font-semibold text-lg truncate mb-1">
                          {presenceData.title}
                        </h3>
                      )}
                      
                      {presenceData.line1 && (
                        <p className="text-gray-300 text-sm truncate mb-1">
                          {presenceData.line1}
                        </p>
                      )}
                      
                      {presenceData.line2 && (
                        <p className="text-gray-400 text-sm truncate mb-3">
                          {presenceData.line2}
                        </p>
                      )}
                      
                      {(presenceData.button1Text || presenceData.button2Text) && (
                        <div className="flex gap-2 mt-3">
                          {presenceData.button1Text && (
                            <div className="px-3 py-1 bg-blue-600 text-white text-xs rounded cursor-pointer hover:bg-blue-700 transition-colors">
                              {presenceData.button1Text}
                            </div>
                          )}
                          {presenceData.button2Text && (
                            <div className="px-3 py-1 bg-gray-600 text-white text-xs rounded cursor-pointer hover:bg-gray-700 transition-colors">
                              {presenceData.button2Text}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {!presenceData.title && !presenceData.line1 && !presenceData.line2 && (
                        <p className="text-gray-500 text-sm italic">
                          Fill out the form to see a preview
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {status && (
                  <div className={`p-4 rounded-lg text-sm ${
                    status.includes('successfully') || status.includes('Connected') 
                      ? 'bg-green-600/20 text-green-300 border border-green-600/30' 
                      : status.includes('Error') || status.includes('Failed')
                      ? 'bg-red-600/20 text-red-300 border border-red-600/30'
                      : 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                  }`}>
                    {status}
                  </div>
                )}

                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Instructions</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• <strong>Large Image:</strong> Main icon with optional alt text</li>
                    <li>• <strong>Small Image:</strong> Status overlay icon (bottom-right)</li>
                    <li>• <strong>Title:</strong> Main activity title</li>
                    <li>• <strong>Lines:</strong> Two detail lines for status info</li>
                    <li>• <strong>Buttons:</strong> Up to 2 clickable buttons with URLs</li>
                    <li>• Click "Update Presence" to apply all changes</li>
                    <li>• Use "Clear Presence" to remove the status</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
