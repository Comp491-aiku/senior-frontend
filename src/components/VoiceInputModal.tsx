'use client'

/**
 * Beautiful voice input modal with waveform animation
 */
import { useEffect } from 'react'
import { useVoiceInput } from '@/hooks/useVoiceInput'
// Dialog component removed - using custom overlay instead
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

  if (!isOpen) return null

  if (!isSupported) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={onClose}
        >
          <Card
            className="p-8 max-w-md mx-auto border-2 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-destructive/20 blur-2xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-destructive/10 to-destructive/5 p-6 rounded-full">
                  <MicOff className="h-16 w-16 text-destructive" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Voice Input Not Supported
              </h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Your browser doesn&apos;t support voice input. Please use a modern browser like{' '}
                <strong className="text-foreground">Chrome</strong>,{' '}
                <strong className="text-foreground">Edge</strong>, or{' '}
                <strong className="text-foreground">Safari</strong> for the best experience.
              </p>
              <Button
                onClick={onClose}
                className="w-full h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Got it
              </Button>
            </div>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Backdrop with animation */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        onClick={handleCancel}
      >
        {/* Modal with premium styling */}
        <Card
          className="w-full max-w-2xl p-8 bg-gradient-to-br from-background via-background to-primary/5 border-2 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                <Mic className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Voice Input
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-all hover:rotate-90 duration-300"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Waveform Animation with glow */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
            <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm rounded-2xl p-8 border border-primary/10">
              <div className="flex items-center justify-center gap-1.5 h-40">
                {isListening ? (
                  <>
                    {[...Array(24)].map((_, i) => {
                      const height = Math.max(15, volume * (Math.random() * 0.5 + 0.5))
                      return (
                        <div
                          key={i}
                          className="w-1.5 bg-gradient-to-t from-primary via-primary to-primary/50 rounded-full transition-all duration-75 shadow-lg shadow-primary/50"
                          style={{
                            height: `${height}%`,
                            animationDelay: `${i * 30}ms`,
                          }}
                        />
                      )
                    })}
                  </>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse" />
                    <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-full">
                      <Mic className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status with modern styling */}
          <div className="text-center mb-8">
            {isListening ? (
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-full">
                <div className="relative flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <div className="absolute w-6 h-6 bg-red-500/30 rounded-full animate-ping" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400 block">
                    Listening...
                  </span>
                  <p className="text-xs text-muted-foreground">Speak naturally, I&apos;m here</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click the microphone button below to start recording
              </p>
            )}
          </div>

          {/* Transcript Display with modern styling */}
          <div className="min-h-[140px] p-6 bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm rounded-2xl mb-6 border border-primary/10">
            <div className="text-base leading-relaxed">
              {transcript && (
                <span className="text-foreground font-medium">{transcript}</span>
              )}
              {interimTranscript && (
                <span className="text-primary/70 italic animate-pulse"> {interimTranscript}</span>
              )}
              {!transcript && !interimTranscript && (
                <span className="text-muted-foreground/60 text-center block">
                  ✨ Your speech will appear here in real-time...
                </span>
              )}
            </div>
          </div>

          {/* Error Message with modern alert */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 border-2 border-red-500/20 rounded-xl animate-in slide-in-from-top-2">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">⚠️ {error}</p>
            </div>
          )}

          {/* Actions with modern buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-12 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>

            {isListening ? (
              <Button
                onClick={stopListening}
                variant="destructive"
                className="flex-1 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <MicOff className="h-5 w-5 mr-2" />
                Stop Recording
              </Button>
            ) : (
              <Button
                onClick={startListening}
                className="flex-1 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-primary to-primary/80"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Recording
              </Button>
            )}

            <Button
              onClick={handleComplete}
              disabled={!transcript.trim()}
              className="flex-1 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Check className="h-5 w-5 mr-2" />
              Use Text
            </Button>
          </div>

          {/* Tips with modern styling */}
          <div className="mt-6 p-5 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/10 rounded-xl">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-2xl">💡</span>{' '}
              <strong className="text-foreground">Pro Tips:</strong> Speak clearly and naturally.
              The system captures your speech in real-time. You can pause and continue - just keep
              speaking! Click &quot;Use Text&quot; when you&apos;re done.
            </p>
          </div>
        </Card>
      </div>
    </>
  )
}
