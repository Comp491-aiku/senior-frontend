/**
 * Custom hook for Web Speech API voice input
 * Provides voice-to-text with visual feedback
 */

import { useState, useEffect, useRef, useCallback } from 'react'

interface VoiceInputOptions {
  continuous?: boolean
  interimResults?: boolean
  lang?: string
  onTranscript?: (transcript: string, isFinal: boolean) => void
  onError?: (error: string) => void
}

interface VoiceInputState {
  isListening: boolean
  transcript: string
  interimTranscript: string
  error: string | null
  isSupported: boolean
  volume: number
}

export function useVoiceInput(options: VoiceInputOptions = {}) {
  const {
    continuous = true,
    interimResults = true,
    lang = 'en-US',
    onTranscript,
    onError,
  } = options

  const [state, setState] = useState<VoiceInputState>({
    isListening: false,
    transcript: '',
    interimTranscript: '',
    error: null,
    isSupported: false,
    volume: 0,
  })

  const recognitionRef = useRef<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Check browser support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setState((prev) => ({ ...prev, isSupported: true }))

      const recognition = new SpeechRecognition()
      recognition.continuous = continuous
      recognition.interimResults = interimResults
      recognition.lang = lang

      recognition.onstart = () => {
        setState((prev) => ({ ...prev, isListening: true, error: null }))
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        setState((prev) => ({
          ...prev,
          transcript: finalTranscript ? prev.transcript + finalTranscript : prev.transcript,
          interimTranscript,
        }))

        if (finalTranscript && onTranscript) {
          onTranscript(finalTranscript.trim(), true)
        } else if (interimTranscript && onTranscript) {
          onTranscript(interimTranscript, false)
        }
      }

      recognition.onerror = (event: any) => {
        const errorMessage = `Speech recognition error: ${event.error}`
        setState((prev) => ({
          ...prev,
          isListening: false,
          error: errorMessage,
        }))

        if (onError) {
          onError(errorMessage)
        }
      }

      recognition.onend = () => {
        setState((prev) => ({ ...prev, isListening: false }))
        stopVolumeMonitoring()
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      stopVolumeMonitoring()
    }
  }, [continuous, interimResults, lang, onTranscript, onError])

  // Volume monitoring for visual feedback
  const startVolumeMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)

      analyserRef.current.fftSize = 256
      microphoneRef.current.connect(analyserRef.current)

      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const updateVolume = () => {
        if (analyserRef.current && state.isListening) {
          analyserRef.current.getByteFrequencyData(dataArray)

          // Calculate average volume
          const sum = dataArray.reduce((acc, val) => acc + val, 0)
          const average = sum / bufferLength
          const volume = Math.min(100, (average / 255) * 100)

          setState((prev) => ({ ...prev, volume }))

          animationFrameRef.current = requestAnimationFrame(updateVolume)
        }
      }

      updateVolume()
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopVolumeMonitoring = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (microphoneRef.current) {
      microphoneRef.current.disconnect()
      microphoneRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    setState((prev) => ({ ...prev, volume: 0 }))
  }

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      setState((prev) => ({
        ...prev,
        transcript: '',
        interimTranscript: '',
        error: null
      }))
      recognitionRef.current.start()
      startVolumeMonitoring()
    }
  }, [state.isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop()
      stopVolumeMonitoring()
    }
  }, [state.isListening])

  const resetTranscript = useCallback(() => {
    setState((prev) => ({ ...prev, transcript: '', interimTranscript: '' }))
  }, [])

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
  }
}
