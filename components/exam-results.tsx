"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw } from "lucide-react"
import type { ExamQuestion } from "@/lib/exam-utils"

interface ExamResultsProps {
  questions: ExamQuestion[]
  answers: Record<string, string>
  score: number
  passed: boolean
  onRetry: () => void
  onReviewAnswers: () => void
}

export function ExamResults({ questions, answers, score, passed, onRetry, onReviewAnswers }: ExamResultsProps) {
  const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length
  const incorrectCount = questions.length - correctCount

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {passed ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">{passed ? "Congratulations! You Passed!" : "Exam Not Passed"}</CardTitle>
          <div className="text-4xl font-bold mt-2">{score}%</div>
          <Badge variant={passed ? "default" : "destructive"} className="mt-2">
            {passed ? "PASSED" : "FAILED"} (80% required to pass)
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{questions.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={onReviewAnswers} variant="outline">
              Review Answers
            </Button>
            <Button onClick={onRetry} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
