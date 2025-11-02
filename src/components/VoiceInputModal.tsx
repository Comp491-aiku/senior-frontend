'use client'

/**
 * Beautiful voice input modal with waveform animation
 */
import { useEffect } from 'react'
import { useVoiceInput } from '@/hooks/useVoiceInput'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, MicOff, X, Check } from 'lucide-react'

interface VoiceInputModalProps {
  isOpen: boolean
  onClose: () => void
  onTranscriptComplete: (transcript: string) => void
}

export function VoiceInputModal({
  isOpen,
  onClose,
  onTranscriptComplete,
}: VoiceInputModalProps) {
  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    volume,
    startListening,
    stopListening,
  } = useVoiceInput({
    continuous: true,
    interimResults: true,
    lang: 'en-US',
  })

  // Auto-start listening when modal opens
  useEffect(() => {
    if (isOpen && isSupported) {
      startListening()
    }

    return () => {
      if (isListening) {
        stopListening()
      }
    }
  }, [isOpen, isSupported])

  const handleComplete = () => {
    if (transcript.trim()) {
      onTranscriptComplete(transcript.trim())
      stopListening()
      onClose()
    }
  }

  const handleCancel = () => {
    stopListening()
    onClose()
  }

  if (!isSupported) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <Card className="p-6 max-w-md mx-auto">
          <div className="text-center">
            <MicOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Voice Input Not Supported</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your browser doesn't support voice input. Please use a modern browser like Chrome,
              Edge, or Safari.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </Card>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 bg-gradient-to-br from-background to-muted">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Voice Input</h2>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Waveform Animation */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 h-32">
              {isListening ? (
                <>
                  {[...Array(20)].map((_, i) => {
                    const height = Math.max(10, volume * (Math.random() * 0.5 + 0.5))
                    return (
                      <div
                        key={i}
                        className="w-2 bg-gradient-to-t from-primary to-primary/50 rounded-full transition-all duration-100"
                        style={{
                          height: `${height}%`,
                          animationDelay: `${i * 50}ms`,
                        }}
                      />
                    )
                  })}
                </>
              ) : (
                <div className="text-muted-foreground">
                  <Mic className="h-12 w-12" />
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="text-center mb-6">
            {isListening ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Listening...</span>
                </div>
                <p className="text-xs text-muted-foreground">Speak naturally, I'm listening</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Click the microphone to start</p>
            )}
          </div>

          {/* Transcript Display */}
          <div className="min-h-[120px] p-4 bg-muted/50 rounded-lg mb-6">
            <p className="text-sm">
              {transcript && <span className="text-foreground">{transcript}</span>}
              {interimTranscript && (
                <span className="text-muted-foreground italic">{interimTranscript}</span>
              )}
              {!transcript && !interimTranscript && (
                <span className="text-muted-foreground">Your speech will appear here...</span>
              )}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>

            {isListening ? (
              <Button
                onClick={stopListening}
                variant="destructive"
                className="flex-1"
              >
                <MicOff className="h-4 w-4 mr-2" />
                Stop
              </Button>
            ) : (
              <Button
                onClick={startListening}
                variant="default"
                className="flex-1"
              >
                <Mic className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
            )}

            <Button
              onClick={handleComplete}
              disabled={!transcript.trim()}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-2" />
              Use Text
            </Button>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Tips:</strong> Speak clearly and naturally. The system will automatically
              capture your speech. You can pause and continue - just keep speaking!
            </p>
          </div>
        </Card>
      </div>
    </Dialog>
  )
}
