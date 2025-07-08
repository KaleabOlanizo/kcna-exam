"use client"

import { useEffect, useState } from "react"

interface ExamTimerProps {
  initialTime: number
  onTimeUp: () => void
  isActive: boolean
}

export function ExamTimer({ initialTime, onTimeUp, isActive }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const isWarning = timeLeft <= 300 // 5 minutes
  const isCritical = timeLeft <= 60 // 1 minute

  return (
    <div
      className={`text-lg font-mono ${isCritical ? "text-red-600" : isWarning ? "text-orange-600" : "text-gray-700"}`}
    >
      Time Remaining: {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
    </div>
  )
}
