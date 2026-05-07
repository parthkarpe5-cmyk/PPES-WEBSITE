"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Layout,
  Type,
  CheckSquare,
  Code
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type QuestionType = 'MCQ' | 'MULTIPLE_SELECT' | 'DESCRIPTIVE' | 'CODING'

interface Question {
  id: string
  type: QuestionType
  text: string
  points: number
  options?: string[]
  correctAnswer?: string | string[]
  imageUrl?: string
}

export default function CreateTest() {
  const router = useRouter()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('30')
  const [passingScore, setPassingScore] = useState('60')
  const [postTestMessage, setPostTestMessage] = useState('')
  const [isManualRelease, setIsManualRelease] = useState(true)
  
  const [questions, setQuestions] = useState<Question[]>([])

  const totalPoints = questions.reduce((acc, q) => acc + q.points, 0)

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      text: '',
      points: 5,
      options: type === 'MCQ' || type === 'MULTIPLE_SELECT' ? ['', '', '', ''] : [],
      correctAnswer: type === 'MCQ' ? '' : []
    }
    setQuestions([...questions, newQuestion])
    toast.success(`Added ${type.replace('_', ' ')} question`)
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const updateOption = (qId: string, optIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.options) {
        const newOptions = [...q.options]
        newOptions[optIndex] = value
        return { ...q, options: newOptions }
      }
      return q
    }))
  }

  const handleSave = () => {
    if (!title || !description || questions.length === 0) {
      toast.error("Please fill in the title, description, and add at least one question.")
      return
    }
    
    // In a real app, this would be a POST request to the backend
    console.log({ title, description, duration, passingScore, postTestMessage, isManualRelease, questions })
    
    toast.success("Test published successfully!")
    router.push('/teacher')
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 font-display">Create Assessment</h1>
              <p className="text-xs text-slate-500 font-medium">Total Points: {totalPoints}</p>
            </div>
          </div>
          <Button 
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6"
          >
            <Save className="h-4 w-4 mr-2" />
            Publish Test
          </Button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Test Configuration */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Test Details</CardTitle>
            <CardDescription>Configure basic information and settings for this assessment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="title">Test Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Science Mid-Term Quiz" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 text-lg font-semibold"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe what the test covers..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Minutes)</Label>
                <Input 
                  id="duration" 
                  type="number" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passing">Passing Score (%)</Label>
                <Input 
                  id="passing" 
                  type="number" 
                  value={passingScore}
                  onChange={(e) => setPassingScore(e.target.value)}
                />
              </div>
              <div className="col-span-2 flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-0.5">
                  <Label className="text-base">Manual Result Release</Label>
                  <p className="text-sm text-slate-500">Hide correct answers until manually reviewed by you.</p>
                </div>
                <Switch 
                  checked={isManualRelease}
                  onCheckedChange={setIsManualRelease}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="postMessage">Post-Test Message (Optional)</Label>
                <Input 
                  id="postMessage" 
                  placeholder="e.g. Great job! Results will be released on Monday." 
                  value={postTestMessage}
                  onChange={(e) => setPostTestMessage(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Builder */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Questions ({questions.length})</h2>
          </div>

          {questions.map((q, index) => (
            <Card key={q.id} className="border-slate-200 overflow-hidden group">
              <div className="h-1 bg-slate-100 group-focus-within:bg-sky transition-colors" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="bg-sky/10 text-sky text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                    {q.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-lg bg-white px-2">
                    <span className="text-[10px] font-bold text-slate-400 mr-1 uppercase">Pts:</span>
                    <input 
                      type="number" 
                      className="w-10 h-8 text-sm outline-none text-center font-bold"
                      value={q.points}
                      onChange={(e) => updateQuestion(q.id, { points: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400 hover:text-red-500 h-8 w-8"
                    onClick={() => removeQuestion(q.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Enter your question here..." 
                  className="text-lg font-medium bg-transparent border-none focus-visible:ring-0 p-0 resize-none min-h-[60px]"
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                />
                
                {/* Options for MCQ/MultiSelect */}
                {(q.type === 'MCQ' || q.type === 'MULTIPLE_SELECT') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {q.options?.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2 group/opt">
                        <div className="w-6 text-[10px] font-bold text-slate-400">{String.fromCharCode(65 + i)}</div>
                        <Input 
                          placeholder={`Option ${i + 1}`} 
                          value={opt}
                          onChange={(e) => updateOption(q.id, i, e.target.value)}
                          className="bg-slate-50/50 border-slate-200 focus:bg-white"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Question Helper for Descriptive/Coding */}
                {(q.type === 'DESCRIPTIVE' || q.type === 'CODING') && (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3 mt-4">
                    <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                    <p className="text-sm text-amber-700">
                      This is a <strong>manual review</strong> question. You will need to grade student submissions manually from your dashboard after the test.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Add Question Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <Button variant="outline" className="h-20 flex-col gap-2 border-dashed hover:border-sky hover:bg-sky/5" onClick={() => addQuestion('MCQ')}>
              <CheckSquare className="h-5 w-5 text-sky" />
              <span className="text-xs font-bold uppercase tracking-wider">MCQ</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-dashed hover:border-sky hover:bg-sky/5" onClick={() => addQuestion('MULTIPLE_SELECT')}>
              <Layout className="h-5 w-5 text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Multi-Select</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-dashed hover:border-sky hover:bg-sky/5" onClick={() => addQuestion('DESCRIPTIVE')}>
              <Type className="h-5 w-5 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Descriptive</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-dashed hover:border-sky hover:bg-sky/5" onClick={() => addQuestion('CODING')}>
              <Code className="h-5 w-5 text-slate-700" />
              <span className="text-xs font-bold uppercase tracking-wider">Coding</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
