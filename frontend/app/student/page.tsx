"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ClipboardList, 
  History, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  LayoutDashboard,
  BookOpen
} from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock Data (In a real app, this would come from an API/Database)
const MOCK_TESTS = [
  {
    id: '1',
    title: 'Science Quiz: Photosynthesis',
    description: 'A basic quiz covering the essentials of photosynthesis and plant biology.',
    durationMinutes: 30,
    questionCount: 15,
  },
  {
    id: '2',
    title: 'Mathematics: Algebra Basics',
    description: 'Test your understanding of linear equations and basic algebraic functions.',
    durationMinutes: 45,
    questionCount: 20,
  }
]

const MOCK_STUDENT_ATTEMPTS = [
  {
    testId: '1',
    testTitle: 'Science Quiz: Photosynthesis',
    timestamp: '2026-05-02 14:30',
    score: '12/15',
    status: 'Completed'
  }
]

export default function StudentDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('available')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 font-display">Student Dashboard</h1>
              <p className="text-slate-500 mt-1">Welcome back! Here are your active assessments.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-sky-50 text-sky-600 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Active Student
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <Tabs defaultValue="available" className="w-full" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-8">
            <TabsList className="bg-slate-200/50 p-1">
              <TabsTrigger value="available" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <ClipboardList className="h-4 w-4 mr-2" />
                Available Tests
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <History className="h-4 w-4 mr-2" />
                My History
              </TabsTrigger>
            </TabsList>
            
            <div className="hidden md:block text-sm text-slate-500 italic">
              {activeTab === 'available' ? 'Showing tests ready to be taken' : 'Review your past performances'}
            </div>
          </div>

          <TabsContent value="available" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_TESTS.map((test) => {
                const isCompleted = MOCK_STUDENT_ATTEMPTS.some(att => att.testId === test.id)
                return (
                  <Card key={test.id} className="group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-sky to-deep-blue" />
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <div className="bg-sky-50 text-sky-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                          {test.durationMinutes} Mins
                        </div>
                        {isCompleted && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                      </div>
                      <CardTitle className="text-xl font-bold group-hover:text-sky transition-colors">{test.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{test.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center bg-slate-50/50 pt-6">
                      <span className="text-sm font-medium text-slate-500">{test.questionCount} Questions</span>
                      {isCompleted ? (
                        <Button disabled variant="outline" className="bg-slate-100 text-slate-400">
                          Completed
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => router.push(`/student/tests/${test.id}`)}
                          className="bg-sky hover:bg-deep-blue text-white group"
                        >
                          Start Test
                          <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Test Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Completed On</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Score</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_STUDENT_ATTEMPTS.map((attempt, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <span className="font-semibold text-slate-900 block">{attempt.testTitle}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center text-slate-500 text-sm">
                            <Clock className="h-3 w-3 mr-2" />
                            {attempt.timestamp}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-emerald-50 text-emerald-700">
                            {attempt.score}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Button variant="ghost" size="sm" className="text-sky hover:text-deep-blue font-bold">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {MOCK_STUDENT_ATTEMPTS.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                          No test history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
