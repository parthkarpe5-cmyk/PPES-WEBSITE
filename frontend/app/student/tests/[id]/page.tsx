"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

// Mock Data fetching (would be from API in real app)
const MOCK_TESTS = [
  {
    id: '1',
    title: 'Science Quiz: Photosynthesis',
    durationMinutes: 30,
    questions: [
      {
        id: 'q1',
        type: 'MCQ',
        text: 'What is the primary byproduct of photosynthesis released into the atmosphere?',
        points: 5,
        options: ['Carbon Dioxide', 'Oxygen', 'Nitrogen', 'Methane'],
      },
      {
        id: 'q2',
        type: 'DESCRIPTIVE',
        text: 'Explain the role of Chlorophyll in the photosynthesis process.',
        points: 10,
      }
    ]
  }
]

export default function TakeTest() {
  const router = useRouter()
  const { id } = useParams()
  
  const test = useMemo(() => MOCK_TESTS.find(t => t.id === id), [id])
  
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeLeft, setTimeLeft] = useState(test ? test.durationMinutes * 60 : 0)

  useEffect(() => {
    if (!test) {
      toast.error("Test not found")
      router.push('/student')
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [test])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const handleAutoSubmit = () => {
    toast.error("Time is up! Submitting your answers automatically.")
    submitTest()
  }

  const submitTest = () => {
    // In a real app, POST to API
    console.log("Submitting answers:", answers)
    toast.success("Test submitted successfully!")
    router.push('/student')
  }

  if (!test) return null

  const currentQ = test.questions[currentIdx]
  const progress = ((currentIdx + 1) / test.questions.length) * 100

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Test Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-900 truncate pr-4">{test.title}</h1>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full font-bold",
              timeLeft < 300 ? "bg-red-50 text-red-600 animate-pulse" : "bg-sky-50 text-sky-700"
            )}>
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Question {currentIdx + 1} of {test.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
          <CardHeader className="pb-8 border-b border-slate-50 bg-slate-50/30">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-sky/10 text-sky text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                {currentQ.type.replace('_', ' ')}
              </span>
              <span className="text-sm font-bold text-slate-400">{currentQ.points} Points</span>
            </div>
            <CardTitle className="text-2xl font-bold leading-relaxed text-slate-800">
              {currentQ.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-10 pb-10">
            {currentQ.type === 'MCQ' && (
              <RadioGroup 
                value={answers[currentQ.id]} 
                onValueChange={(val) => setAnswers({...answers, [currentQ.id]: val})}
                className="space-y-4"
              >
                {currentQ.options?.map((opt, i) => (
                  <div key={i} className="flex items-center space-x-3 group cursor-pointer">
                    <RadioGroupItem value={opt} id={`opt-${i}`} className="border-slate-300 text-sky focus:ring-sky" />
                    <Label 
                      htmlFor={`opt-${i}`} 
                      className="text-lg font-medium text-slate-700 cursor-pointer w-full p-4 rounded-xl border border-transparent transition-all group-hover:bg-slate-50 group-has-[:checked]:bg-sky/5 group-has-[:checked]:border-sky/20 group-has-[:checked]:text-sky-900"
                    >
                      {opt}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQ.type === 'DESCRIPTIVE' && (
              <div className="space-y-4">
                <Textarea 
                  placeholder="Type your detailed answer here..."
                  className="min-h-[250px] text-lg leading-relaxed p-6 focus:ring-sky/20 border-slate-200"
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => setAnswers({...answers, [currentQ.id]: e.target.value})}
                />
                <div className="flex items-start gap-2 text-slate-400">
                  <HelpCircle className="h-4 w-4 mt-1" />
                  <p className="text-xs italic">Your answer is automatically saved as you type.</p>
                </div>
              </div>
            )}

            {/* Add logic for Multi-select and Coding similarly */}
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-12">
          <Button 
            variant="ghost" 
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="h-12 px-6 font-bold text-slate-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentIdx === test.questions.length - 1 ? (
            <Button 
              onClick={submitTest}
              className="h-12 px-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Submit Assessment
            </Button>
          ) : (
            <Button 
              onClick={() => setCurrentIdx(currentIdx + 1)}
              className="h-12 px-8 bg-sky hover:bg-deep-blue text-white font-bold"
            >
              Next Question
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
