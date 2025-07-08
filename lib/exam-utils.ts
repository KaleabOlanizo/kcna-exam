export interface ExamQuestion {
  id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  optionE?: string
  correctAnswer: string
  explanation: string
  domain: string
  competency: string
}

export interface ExamSession {
  questions: ExamQuestion[]
  currentQuestionIndex: number
  answers: Record<string, string>
  startTime: number
  timeRemaining: number
  isCompleted: boolean
  score?: number
  passed?: boolean
}

export function parseCSV(csvText: string): ExamQuestion[] {
  const lines = csvText.split("\n").filter((line) => line.trim())
  if (lines.length < 2) return []

  const questions: ExamQuestion[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Parse CSV line handling quoted fields
    const fields = parseCSVLine(line)
    if (fields.length < 11) continue

    const question: ExamQuestion = {
      id: fields[0] || `q${i}`,
      question: fields[1] || "",
      optionA: fields[2] || "",
      optionB: fields[3] || "",
      optionC: fields[4] || "",
      optionD: fields[5] || "",
      optionE: fields[6] || "",
      correctAnswer: fields[7] || "",
      explanation: fields[8] || "",
      domain: fields[9] || "",
      competency: fields[10] || "",
    }

    // Only include questions that have the essential fields
    if (question.question && question.optionA && question.optionB && question.correctAnswer) {
      questions.push(question)
    }
  }

  return questions
}

function parseCSVLine(line: string): string[] {
  const result = []
  let current = ""
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Handle escaped quotes
        current += '"'
        i += 2
      } else {
        inQuotes = !inQuotes
        i++
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
      i++
    } else {
      current += char
      i++
    }
  }

  result.push(current.trim())

  // Clean up quoted fields
  return result.map((field) => {
    if (field.startsWith('"') && field.endsWith('"')) {
      return field.slice(1, -1).replace(/""/g, '"')
    }
    return field
  })
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function selectRandomQuestions(questions: ExamQuestion[], count: number): ExamQuestion[] {
  const shuffled = shuffleArray(questions)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function calculateScore(questions: ExamQuestion[], answers: Record<string, string>): number {
  let correct = 0
  questions.forEach((q) => {
    if (answers[q.id] === q.correctAnswer) {
      correct++
    }
  })
  return Math.round((correct / questions.length) * 100)
}

export function saveSession(session: ExamSession): void {
  localStorage.setItem("kcna-exam-session", JSON.stringify(session))
}

export function loadSession(): ExamSession | null {
  const saved = localStorage.getItem("kcna-exam-session")
  return saved ? JSON.parse(saved) : null
}

export function clearSession(): void {
  localStorage.removeItem("kcna-exam-session")
}
