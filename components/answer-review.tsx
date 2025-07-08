"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import type { ExamQuestion } from "@/lib/exam-utils"

interface AnswerReviewProps {
  questions: ExamQuestion[]
  answers: Record<string, string>
  onBack: () => void
}

export function AnswerReview({ questions, answers, onBack }: AnswerReviewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Back to Results
        </Button>
        <h1 className="text-2xl font-bold">Answer Review</h1>
      </div>

      {questions.map((question, index) => {
        const userAnswer = answers[question.id]
        const isCorrect = userAnswer === question.correctAnswer

        const options = [
          { value: "A", text: question.optionA },
          { value: "B", text: question.optionB },
          { value: "C", text: question.optionC },
          { value: "D", text: question.optionD },
        ]

        if (question.optionE && question.optionE.trim()) {
          options.push({ value: "E", text: question.optionE })
        }

        return (
          <Card key={question.id} className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  Question {index + 1}
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </CardTitle>
                <Badge variant={isCorrect ? "default" : "destructive"}>{isCorrect ? "Correct" : "Incorrect"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="font-medium">{question.question}</div>

              <div className="space-y-2">
                {options.map((option) => {
                  const isUserAnswer = userAnswer === option.value
                  const isCorrectAnswer = question.correctAnswer === option.value

                  let className = "p-3 rounded-lg border "
                  if (isCorrectAnswer) {
                    className += "bg-green-50 border-green-200 text-green-800"
                  } else if (isUserAnswer && !isCorrect) {
                    className += "bg-red-50 border-red-200 text-red-800"
                  } else {
                    className += "bg-gray-50"
                  }

                  return (
                    <div key={option.value} className={className}>
                      <span className="font-medium">{option.value}.</span> {option.text}
                      {isUserAnswer && (
                        <Badge variant="outline" className="ml-2">
                          Your Answer
                        </Badge>
                      )}
                      {isCorrectAnswer && (
                        <Badge variant="default" className="ml-2">
                          Correct Answer
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>

              {question.explanation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800 mb-2">Explanation:</div>
                  <div className="text-blue-700">{question.explanation}</div>
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                Domain: {question.domain} • Competency: {question.competency}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
