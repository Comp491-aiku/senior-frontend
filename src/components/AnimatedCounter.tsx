'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  start?: number
}

export function AnimatedCounter({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
  start = 0
}: AnimatedCounterProps) {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const endTime = startTime + duration

    const timer = setInterval(() => {
      const now = Date.now()
      const remaining = endTime - now

      if (remaining <= 0) {
        setCount(end)
        clearInterval(timer)
      } else {
        const progress = 1 - remaining / duration
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(start + (end - start) * easeOutQuart))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isVisible, end, duration, start])

  return (
    <span ref={counterRef} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}
