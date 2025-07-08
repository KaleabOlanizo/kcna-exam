"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ExamTimer } from "@/components/exam-timer"
import { ExamQuestionComponent } from "@/components/exam-question"
import { ExamResults } from "@/components/exam-results"
import { AnswerReview } from "@/components/answer-review"
import {
  parseCSV,
  selectRandomQuestions,
  calculateScore,
  saveSession,
  loadSession,
  clearSession,
  type ExamQuestion,
  type ExamSession,
} from "@/lib/exam-utils"

type ExamState = "start" | "exam" | "results" | "review"

export default function ExamPage() {
  const [examState, setExamState] = useState<ExamState>("start")
  const [allQuestions, setAllQuestions] = useState<ExamQuestion[]>([])
  const [session, setSession] = useState<ExamSession | null>(null)
  const [loading, setLoading] = useState(true)

  // Load CSV data on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KCNA%20Exam%20Question%20Dump-fmmPJDnZezv3ay8HfeVD8ZHAWNSe7D.csv",
        )
        const csvText = await response.text()
        console.log(csvText)
        const questions = parseCSV(csvText)
        setAllQuestions(questions)
        console.log(questions)

        // Check for existing session
        const savedSession = loadSession()
        if (savedSession && !savedSession.isCompleted) {
          setSession(savedSession)
          setExamState("exam")
        }
      } catch (error) {
        console.error("Failed to load questions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [])

  const startExam = useCallback(() => {
    const examQuestions = selectRandomQuestions(allQuestions, 90)
    const newSession: ExamSession = {
      questions: examQuestions,
      currentQuestionIndex: 0,
      answers: {},
      startTime: Date.now(),
      timeRemaining: 40 * 60, // 40 minutes in seconds
      isCompleted: false,
    }

    setSession(newSession)
    saveSession(newSession)
    setExamState("exam")
  }, [allQuestions])

  const handleAnswerSelect = useCallback(
    (answer: string) => {
      if (!session) return

      const currentQuestion = session.questions[session.currentQuestionIndex]
      const updatedAnswers = { ...session.answers, [currentQuestion.id]: answer }
      const updatedSession = { ...session, answers: updatedAnswers }

      setSession(updatedSession)
      saveSession(updatedSession)
    },
    [session],
  )

  const handleNext = useCallback(() => {
    if (!session) return

    if (session.currentQuestionIndex < session.questions.length - 1) {
      const updatedSession = {
        ...session,
        currentQuestionIndex: session.currentQuestionIndex + 1,
      }
      setSession(updatedSession)
      saveSession(updatedSession)
    } else {
      finishExam()
    }
  }, [session])

  const handlePrevious = useCallback(() => {
    if (!session || session.currentQuestionIndex === 0) return

    const updatedSession = {
      ...session,
      currentQuestionIndex: session.currentQuestionIndex - 1,
    }
    setSession(updatedSession)
    saveSession(updatedSession)
  }, [session])

  const finishExam = useCallback(() => {
    if (!session) return

    const score = calculateScore(session.questions, session.answers)
    const passed = score >= 80

    const completedSession = {
      ...session,
      isCompleted: true,
      score,
      passed,
    }

    setSession(completedSession)
    saveSession(completedSession)
    setExamState("results")
  }, [session])

  const handleTimeUp = useCallback(() => {
    finishExam()
  }, [finishExam])

  const handleRetry = useCallback(() => {
    clearSession()
    setSession(null)
    setExamState("start")
  }, [])

  const handleReviewAnswers = useCallback(() => {
    setExamState("review")
  }, [])

  const handleBackToResults = useCallback(() => {
    setExamState("results")
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading exam questions...</div>
        </div>
      </div>
    )
  }

  if (allQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <div className="text-red-600 mb-2">Error</div>
            <div>Failed to load exam questions. Please refresh the page.</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        {examState === "start" && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4">KCNA Exam Simulation</CardTitle>
                <div className="text-muted-foreground space-y-2">
                  <p>Kubernetes and Cloud Native Associate Certification Practice</p>
                  <p>Ready to test your knowledge?</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">90</div>
                    <div className="text-sm text-blue-800">Questions</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">40</div>
                    <div className="text-sm text-green-800">Minutes</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">80%</div>
                    <div className="text-sm text-purple-800">To Pass</div>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Questions are randomly selected from {allQuestions.length} available questions
                  </div>
                  <Button onClick={startExam} size="lg" className="w-full md:w-auto">
                    Start Exam
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {examState === "exam" && session && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <ExamTimer
                  initialTime={session.timeRemaining}
                  onTimeUp={handleTimeUp}
                  isActive={!session.isCompleted}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Question {session.currentQuestionIndex + 1} of {session.questions.length}
              </div>
            </div>

            <Progress
              value={((session.currentQuestionIndex + 1) / session.questions.length) * 100}
              className="w-full"
            />

            <ExamQuestionComponent
              question={session.questions[session.currentQuestionIndex]}
              questionNumber={session.currentQuestionIndex + 1}
              totalQuestions={session.questions.length}
              selectedAnswer={session.answers[session.questions[session.currentQuestionIndex].id]}
              onAnswerSelect={handleAnswerSelect}
              onNext={handleNext}
              onPrevious={handlePrevious}
              canGoNext={session.currentQuestionIndex < session.questions.length}
              canGoPrevious={session.currentQuestionIndex > 0}
            />
          </div>
        )}

        {examState === "results" && session && (
          <ExamResults
            questions={session.questions}
            answers={session.answers}
            score={session.score || 0}
            passed={session.passed || false}
            onRetry={handleRetry}
            onReviewAnswers={handleReviewAnswers}
          />
        )}

        {examState === "review" && session && (
          <AnswerReview questions={session.questions} answers={session.answers} onBack={handleBackToResults} />
        )}
      </div>
    </div>
  )
}
