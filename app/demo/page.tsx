"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  Trash2,
  Volume2,
  MessageSquarePlus,
  ArrowLeft,
  Settings,
  RefreshCw
} from "lucide-react"

export default function GazeKeyboard() {
  // State variables
  const [webcamActive, setWebcamActive] = useState(false)
  const [trackingActive, setTrackingActive] = useState(false)
  const [eyePosition, setEyePosition] = useState<{x: number, y: number} | null>(null)
  const [eyeDirection, setEyeDirection] = useState("Center")
  const [blinking, setBlinking] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [suggestions, setSuggestions] = useState(["", "", ""])
  const [letterIndex, setLetterIndex] = useState(0)
  const [suggestionMode, setSuggestionMode] = useState(false)
  const [forceSuggestMode, setForceSuggestMode] = useState(false)
  const [earValue, setEarValue] = useState(0)
  const [keyboardLayout, setKeyboardLayout] = useState<string[]>([])
  const [gazeSensitivity, setGazeSensitivity] = useState(0.7)
  const [showSettings, setShowSettings] = useState(false)
  const [processing, setProcessing] = useState(false)
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const processFrameTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Setup keyboard layout
  useEffect(() => {
    fetchKeyboardLayout()
  }, [])
  
  const fetchKeyboardLayout = () => {
    fetch('http://localhost:5000/api/keyboard-layout')
      .then(res => res.json())
      .then(data => {
        setKeyboardLayout(data.keys)
      })
      .catch(err => {
        console.error("Error fetching keyboard layout:", err)
        // Fallback keyboard layout
        setKeyboardLayout([
          "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
          "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
          "A", "S", "D", "F", "G", "H", "J", "K", "L", "_",
          "Z", "X", "C", "V", "B", "N", "M", "←", "💬", "🔊"
        ])
      })
    
    // Initialize sensitivity on backend
    updateSensitivity(gazeSensitivity)
  }
  
  // Initialize webcam
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480, facingMode: "user" } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setWebcamActive(true)
        }
      })
      .catch((err) => console.error("Webcam error", err))

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
      if (processFrameTimeoutRef.current) {
        clearTimeout(processFrameTimeoutRef.current)
      }
    }
  }, [])
  
  // Process frame function
  const processFrame = async () => {
    if (!trackingActive || !webcamActive || !videoRef.current || !canvasRef.current || processing) {
      return
    }
    
    setProcessing(true)
    
    try {
      const video = videoRef.current
      const canvas = canvasRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = canvas.toDataURL("image/jpeg", 0.7)
        
        const response = await fetch('http://localhost:5000/api/process-frame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageData })
        })
        
        const data = await response.json()
        
        if (data.error) {
          console.error("Processing error:", data.error)
        } else {
          // Update UI with tracking data
          if (data.eye_position) {
            setEyePosition({ x: data.eye_position[0], y: data.eye_position[1] })
          }
          
          setEyeDirection(data.eye_direction || eyeDirection)
          setBlinking(data.is_blinking || false)
          setEarValue(data.ear_value || 0)
          
          if (data.typed_text !== undefined) {
            setTypedText(data.typed_text)
          }
          
          if (data.letter_index !== undefined) {
            setLetterIndex(data.letter_index)
          }
          
          if (data.suggestions) {
            setSuggestions(data.suggestions)
          }
          
          if (data.suggest_active !== undefined) {
            setSuggestionMode(data.suggest_active)
          }
          
          if (data.force_suggest_mode !== undefined) {
            setForceSuggestMode(data.force_suggest_mode)
          }
          
          // Handle command
          if (data.command) {
            await handleCommand(data.command)
          }
        }
      }
    } catch (err) {
      console.error("Error processing frame:", err)
    }
    
    setProcessing(false)
    
    // Schedule next frame processing
    processFrameTimeoutRef.current = setTimeout(processFrame, 100)
  }
  
  // Handle eye tracking commands
  const handleCommand = async (command: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: command })
      })
      
      const data = await response.json()
      
      // Update state with response
      setTypedText(data.text)
      setLetterIndex(data.letter_index)
      setSuggestionMode(data.suggest_active)
      setForceSuggestMode(data.force_suggest_mode)
      setSuggestions(data.suggestions)
    } catch (err) {
      console.error("Error handling command:", err)
    }
  }
  
  // Start/stop tracking
  useEffect(() => {
    if (trackingActive) {
      // Toggle tracking on backend
      fetch('http://localhost:5000/api/toggle-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).catch(err => console.error("Error toggling tracking:", err))
      
      // Start processing frames
      processFrame()
    } else {
      // Stop processing frames
      if (processFrameTimeoutRef.current) {
        clearTimeout(processFrameTimeoutRef.current)
      }
      
      // Toggle tracking off on backend
      fetch('http://localhost:5000/api/toggle-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).catch(err => console.error("Error toggling tracking:", err))
    }
    
    return () => {
      if (processFrameTimeoutRef.current) {
        clearTimeout(processFrameTimeoutRef.current)
      }
    }
  }, [trackingActive])
  
  // Toggle tracking
  const toggleTracking = () => {
    setTrackingActive(prev => !prev)
  }
  
  // Clear text
  const handleClearText = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/clear-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await response.json()
      
      setTypedText(data.text)
      setSuggestionMode(data.suggest_active)
      setForceSuggestMode(data.force_suggest_mode)
      setLetterIndex(data.letter_index)
      setSuggestions(data.suggestions)
    } catch (err) {
      console.error("Error clearing text:", err)
    }
  }
  
  // Update sensitivity
  const updateSensitivity = (value: number) => {
    setGazeSensitivity(value)
    fetch('http://localhost:5000/api/update-sensitivity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sensitivity: value })
    })
    .catch(err => console.error("Error updating sensitivity:", err))
  }
  
  // Text-to-speech function
  const speakText = () => {
    if (typedText && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(typedText);
      window.speechSynthesis.speak(utterance);
    }
  }
  
  // Reset cursor position
  const resetCursor = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "RESET_CURSOR" })
      })
      
      const data = await response.json()
      setLetterIndex(data.letter_index)
    } catch (err) {
      console.error("Error resetting cursor:", err)
    }
  }
  
  return (
    <div className="container mx-auto py-8 flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gaze Keyboard</h1>
      
      {/* Control buttons */}
      <div className="mb-6 flex items-center gap-3 justify-center flex-wrap">
        <Button 
          variant={trackingActive ? "destructive" : "default"}
          onClick={toggleTracking}
          className="flex items-center gap-2"
        >
          {trackingActive ? <Pause size={18} /> : <Play size={18} />}
          {trackingActive ? "Stop Tracking" : "Start Tracking"}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleClearText}
          className="flex items-center gap-2"
        >
          <Trash2 size={18} />
          Clear Text
        </Button>
        
        <Button 
          variant="outline" 
          onClick={speakText}
          className="flex items-center gap-2"
        >
          <Volume2 size={18} />
          Speak Text
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2"
        >
          <Settings size={18} />
          {showSettings ? "Hide Settings" : "Settings"}
        </Button>
      </div>
      
      {/* Settings panel */}
      {showSettings && (
        <Card className="w-full max-w-3xl mb-6">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium w-32">Gaze Sensitivity:</span>
                <div className="flex-1">
                  <Slider
                    value={[gazeSensitivity]}
                    min={0.1}
                    max={1.5}
                    step={0.1}
                    onValueChange={(value) => updateSensitivity(value[0])}
                  />
                </div>
                <span className="text-sm w-10 text-right">{gazeSensitivity.toFixed(1)}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium w-32">Webcam Status:</span>
                <span className={`text-sm ${webcamActive ? 'text-green-500' : 'text-red-500'}`}>
                  {webcamActive ? '✓ Active' : '× Not available'}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium w-32">Eye Direction:</span>
                <span className="text-sm">{eyeDirection}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium w-32">EAR Value:</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-200" 
                    style={{ width: `${Math.min(earValue * 200, 100)}%` }}
                  />
                </div>
                <span className="text-sm w-10 text-right">{earValue.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium w-32">Blink Status:</span>
                <div className={`w-4 h-4 rounded-full ${blinking ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">{blinking ? 'Blinking' : 'Not blinking'}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium w-32">Tracking Status:</span>
                <span className={`text-sm ${trackingActive ? 'text-green-500' : 'text-gray-500'}`}>
                  {trackingActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <Button
                variant="outline"
                onClick={resetCursor}
                className="flex items-center gap-2"
                size="sm"
              >
                <RefreshCw size={16} />
                Reset Cursor Position
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Main layout */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl mb-6">
        {/* Left column: Webcam */}
        <div className="w-full md:w-1/3">
          <Card className="h-full">
            <CardContent className="p-4">
              <h2 className="font-semibold mb-3">Camera View</h2>
              
              <div className="relative rounded overflow-hidden bg-gray-100 aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Eye position indicator */}
                {eyePosition && (
                  <div 
                    className="absolute w-4 h-4 rounded-full border-2 border-red-500 bg-red-200 opacity-70"
                    style={{ 
                      left: `calc(${eyePosition.x}% - 8px)`, 
                      top: `calc(${eyePosition.y}% - 8px)`,
                      transition: "all 0.1s ease-out"
                    }}
                  />
                )}
                
                {/* Eye direction indicator */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {eyeDirection}
                </div>
              </div>
              
              <div className="mt-3 text-sm text-gray-500">
                Eye tracking: {trackingActive ? 'Active' : 'Inactive'}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column: Text area */}
        <div className="w-full md:w-2/3">
          <Card className="h-full">
            <CardContent className="p-4">
              <h2 className="font-semibold mb-3">Text Output</h2>
              
              <div 
                className="min-h-48 p-4 border rounded bg-gray-50 dark:bg-gray-900 mb-3 overflow-y-auto"
              >
                {typedText ? typedText : <span className="text-gray-400">Type using your eyes...</span>}
              </div>
              
              <div className="text-sm text-gray-500">
                {(suggestionMode || forceSuggestMode) ? 
                  (forceSuggestMode ? "Direct autocomplete mode active" : "Word suggestion mode active") : 
                  "Current mode: Letter selection"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Suggestions row */}
      {(suggestionMode || forceSuggestMode) && (
        <div className="flex gap-4 mb-6 w-full max-w-3xl justify-center">
          {suggestions.map((suggestion, idx) => (
            <Card 
              key={idx} 
              className={`flex-1 ${letterIndex === idx ? 'border-2 border-blue-500' : ''}`}
            >
              <CardContent className="p-3 text-center">
                {suggestion || "..."}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Keyboard layout */}
      {!suggestionMode && !forceSuggestMode && (
        <div className="w-full max-w-4xl mb-6">
          <div className="grid grid-cols-10 gap-2">
            {keyboardLayout.map((key, idx) => (
              <Card 
                key={idx} 
                className={`aspect-square flex items-center justify-center text-lg ${
                  letterIndex === idx ? 'bg-blue-100 border-2 border-blue-500' : ''
                }`}
              >
                <CardContent className="p-0 flex items-center justify-center h-full">
                  {key}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <Card className="w-full max-w-3xl mb-6">
        <CardContent className="p-4">
          <h2 className="font-semibold mb-3">How to Use</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">1</span>
              <span>Click "Start Tracking" to begin eye tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">2</span>
              <span>Look LEFT or RIGHT to move the cursor</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">3</span>
              <span>BLINK to select the highlighted letter/suggestion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">4</span>
              <span>Special keys: "_" (space), "←" (backspace), "💬" (suggest), "🔊" (speak)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      {/* Status indicator */}
      <div className={`fixed bottom-4 right-4 px-3 py-2 rounded-full text-white text-sm font-medium ${
        trackingActive ? 'bg-green-500' : 'bg-gray-500'
      }`}>
        {trackingActive ? 'Tracking Active' : 'Tracking Inactive'}
      </div>
    </div>
  )
}