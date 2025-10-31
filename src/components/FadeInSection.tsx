'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface FadeInSectionProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
}

export function FadeInSection({
  children,
  delay = 0,
  className = '',
  direction = 'up',
  duration = 600
}: FadeInSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)'
    switch (direction) {
      case 'up':
        return 'translate(0, 40px)'
      case 'down':
        return 'translate(0, -40px)'
      case 'left':
        return 'translate(40px, 0)'
      case 'right':
        return 'translate(-40px, 0)'
      default:
        return 'translate(0, 0)'
    }
  }

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`
      }}
    >
      {children}
    </div>
  )
}
