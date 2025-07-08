"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { ExamQuestion } from "@/lib/exam-utils"

interface ExamQuestionProps {
  question: ExamQuestion
  questionNumber: number
  totalQuestions: number
  selectedAnswer?: string
  onAnswerSelect: (answer: string) => void
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export function ExamQuestionComponent({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
}: ExamQuestionProps) {
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            Question {questionNumber} of {totalQuestions}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {question.domain} • {question.competency}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg leading-relaxed">{question.question}</div>

        <RadioGroup value={selectedAnswer || ""} onValueChange={onAnswerSelect} className="space-y-3">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
              onClick={() => onAnswerSelect(option.value)}
            >
              <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
              <Label htmlFor={option.value} className="flex-1 cursor-pointer leading-relaxed">
                <span className="font-medium">{option.value}.</span> {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrevious} disabled={!canGoPrevious}>
            Previous
          </Button>
          <Button onClick={onNext} disabled={!canGoNext}>
            {questionNumber === totalQuestions ? "Finish Exam" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
