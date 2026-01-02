'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Command, Plane, Hotel, MapPin, Cloud, DollarSign, Utensils, Car, Compass, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const travelCommands = [
  { icon: Plane, text: 'Search for flights to Tokyo', category: 'flights' },
  { icon: Hotel, text: 'Find hotels in Paris', category: 'accommodation' },
  { icon: MapPin, text: 'Plan activities in Bali', category: 'activities' },
  { icon: Cloud, text: 'Check weather forecast', category: 'weather' },
  { icon: DollarSign, text: 'Optimize travel budget', category: 'budget' },
  { icon: Utensils, text: 'Discover local restaurants', category: 'dining' },
  { icon: Car, text: 'Book airport transfer', category: 'transport' },
  { icon: Compass, text: 'Get travel recommendations', category: 'explore' },
]

interface AnimatedTravelChatProps {
  onSendMessage?: (message: string) => void
}

export function AnimatedTravelChat({ onSendMessage }: AnimatedTravelChatProps) {
  const [currentCommand, setCurrentCommand] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [userInput, setUserInput] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const command = travelCommands[currentCommand]
    let currentIndex = 0

    if (isTyping) {
      if (currentIndex < command.text.length) {
        const timer = setTimeout(() => {
          setDisplayText(command.text.slice(0, currentIndex + 1))
          currentIndex++
          if (currentIndex === command.text.length) {
            setTimeout(() => setIsTyping(false), 2000)
          }
        }, 50)
        return () => clearTimeout(timer)
      }
    } else {
      const timer = setTimeout(() => {
        setDisplayText('')
        setIsTyping(true)
        setCurrentCommand((prev) => (prev + 1) % travelCommands.length)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentCommand, displayText, isTyping])

  const handleSend = () => {
    if (userInput.trim() && onSendMessage) {
      onSendMessage(userInput)
      setUserInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickAction = (text: string) => {
    if (onSendMessage) {
      onSendMessage(text)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Command Palette Style */}
        <div className="bg-background/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-muted/30">
            <Command className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              AI Travel Assistant
            </span>
          </div>

          {/* Input Area */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCommand}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  {(() => {
                    const Icon = travelCommands[currentCommand].icon
                    return (
                      <div className="w-12 h-12 rounded-xl bg-zinc-700 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-zinc-300" />
                      </div>
                    )
                  })()}
                </motion.div>
              </AnimatePresence>

              <div className="flex-1">
                <div className="text-2xl font-semibold min-h-[2rem] flex items-center">
                  {displayText}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-1 text-primary"
                  >
                    |
                  </motion.span>
                </div>
              </div>
            </div>

            {/* Suggested Commands */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                Quick Actions
              </p>
              <div className="grid grid-cols-2 gap-2">
                {travelCommands.slice(0, 4).map((cmd, idx) => {
                  const Icon = cmd.icon
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickAction(cmd.text)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-primary/30 transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-medium">{cmd.text.split(' ').slice(0, 2).join(' ')}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Real Input Area */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your dream trip..."
                  className="flex-1 resize-none rounded-xl border border-border bg-background/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px] max-h-[120px]"
                  rows={2}
                />
                <Button
                  onClick={handleSend}
                  disabled={!userInput.trim()}
                  className="h-[60px] px-6 rounded-xl bg-zinc-700 hover:bg-zinc-600 shadow-lg shadow-black/20"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Footer hint */}
          <div className="px-6 py-3 border-t border-border/50 bg-muted/20">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 rounded bg-background border border-border">⌘</kbd>
                  <kbd className="px-2 py-1 rounded bg-background border border-border">K</kbd>
                  to open
                </span>
              </div>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse" />
                AI Ready
              </span>
            </div>
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 bg-zinc-800/30 blur-3xl opacity-50" />
      </motion.div>
    </div>
  )
}
