"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Play, 
  BookOpen, 
  Calendar, 
  Trophy, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Search,
  MessageCircle,
  ClipboardList,
  ChevronRight,
  CheckCircle2
} from "lucide-react"
import { LiveSessionsList } from "@/components/LiveSessionsList"
import { cn } from "@/lib/utils"

// Mock Data for Test Module
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
  const [activeTestTab, setActiveTestTab] = useState('available')

  return (
    <div className="p-6 lg:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 bg-slate-950 min-h-screen">
      
      {/* 1. Welcome Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1F4E79] to-[#0A101F] p-8 md:p-12 shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <Badge variant="outline" className="bg-white/10 text-[#2FA8CC] border-white/10 px-3 py-1 text-[10px] uppercase font-bold tracking-widest">
              Daily Progress: 75%
            </Badge>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 font-display">
                Welcome, <span className="text-[#2FA8CC] inline-block animate-shimmer bg-gradient-to-r from-[#2FA8CC] via-white to-[#2FA8CC] bg-[length:200%_auto] bg-clip-text text-transparent">Aryan Sharma</span>
              </h1>
              <p className="text-slate-300 text-lg max-w-md italic">
                "The beautiful thing about learning is that no one can take it away from you."
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center min-w-[120px] group hover:border-[#2FA8CC]/40 transition-all cursor-default">
              <Trophy className="h-6 w-6 text-[#FFD700] mx-auto mb-2 group-hover:scale-125 transition-transform" />
              <div className="text-2xl font-bold text-white">1,240</div>
              <div className="text-[10px] font-bold text-[#2FA8CC] uppercase tracking-wider">XP Points</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center min-w-[120px] group hover:border-[#2FA8CC]/40 transition-all cursor-default">
              <TrendingUp className="h-6 w-6 text-[#2FA8CC] mx-auto mb-2 group-hover:scale-125 transition-transform" />
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-[10px] font-bold text-[#2FA8CC] uppercase tracking-wider">Day Streak</div>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2FA8CC]/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF6B00]/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          to {
            background-position: 200% center;
          }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        .achievement-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px -10px rgba(255, 215, 0, 0.2);
        }
      `}} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column (8 units) */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* 2. Live Classes */}
          <section>
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                Live Classes
                <span className="flex h-2 w-2 rounded-full bg-[#FF6B00] animate-pulse" />
              </h2>
              <Button variant="link" className="text-[#2FA8CC] text-xs font-bold hover:no-underline">Weekly View</Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <LiveSessionsList />
            </div>
          </section>

          {/* 3. Test Module Integration */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                Assessments & Tests
                <ClipboardList className="h-5 w-5 text-[#2FA8CC]" />
              </h2>
            </div>

            <Tabs defaultValue="available" className="w-full" onValueChange={setActiveTestTab}>
              <TabsList className="bg-white/5 border border-white/10 p-1 mb-6">
                <TabsTrigger value="available" className="data-[state=active]:bg-[#2FA8CC] data-[state=active]:text-white">
                  Available Tests
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-[#2FA8CC] data-[state=active]:text-white">
                  My History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_TESTS.map((test) => {
                    const isCompleted = MOCK_STUDENT_ATTEMPTS.some(att => att.testId === test.id)
                    return (
                      <Card key={test.id} className="bg-white/[0.03] border-white/5 hover:border-[#2FA8CC]/30 transition-all overflow-hidden group">
                        <div className="h-1 bg-[#2FA8CC]/20 group-hover:bg-[#2FA8CC] transition-all" />
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <Badge className="bg-[#2FA8CC]/10 text-[#2FA8CC] border-none text-[10px]">
                              {test.durationMinutes} MINS
                            </Badge>
                            {isCompleted && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                          </div>
                          <CardTitle className="text-lg font-bold text-white">{test.title}</CardTitle>
                          <CardDescription className="text-slate-400 text-xs line-clamp-2">{test.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between items-center pt-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{test.questionCount} Questions</span>
                          {isCompleted ? (
                            <Button disabled variant="ghost" className="text-slate-500 text-xs font-bold">
                              Completed
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => router.push(`/student/tests/${test.id}`)}
                              className="bg-[#2FA8CC] hover:bg-[#1F4E79] text-white text-xs h-8 px-4"
                            >
                              Start Test
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <div className="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Test</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {MOCK_STUDENT_ATTEMPTS.map((attempt, index) => (
                        <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-white block">{attempt.testTitle}</span>
                            <span className="text-[10px] text-slate-500">{attempt.timestamp}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold">
                              {attempt.score}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm" className="text-[#2FA8CC] hover:text-white font-bold text-xs">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          {/* 4. My Courses */}
          <section>
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">Active Courses</h2>
              <Button variant="link" className="text-[#2FA8CC] text-xs font-bold hover:no-underline font-display">Show All</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Advanced Physics", progress: 65, color: "#2FA8CC" },
                { title: "Pure Mathematics", progress: 42, color: "#1F4E79" },
              ].map((course, i) => (
                <Card key={i} className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-all hover:translate-y-[-2px]">
                  <CardContent className="p-0">
                    <div className="h-32 bg-gradient-to-br from-white/10 to-transparent relative p-6 flex flex-col justify-end">
                      <div className="absolute top-4 left-4 h-8 w-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <BookOpen className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-white relative z-10">{course.title}</h4>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                          <span className="text-slate-500">Progress</span>
                          <span className="text-[#2FA8CC]">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1.5 bg-white/5" />
                      </div>
                      <Button variant="ghost" className="w-full text-xs font-bold py-2 border border-white/5 hover:bg-white/5 text-slate-300 rounded-xl group">
                        Continue Learning
                        <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column (4 units) */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* 5. Events Section */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 px-1">Upcoming Events</h2>
            <div className="space-y-4">
              {[
                { date: "Oct 24", title: "NASA Webinar", type: "Special Class", time: "10:00 AM" },
                { date: "Oct 26", title: "Algebra Contest", type: "Workshop", time: "05:00 PM" },
              ].map((event, j) => (
                <div key={j} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group cursor-pointer">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-[#2FA8CC] uppercase mb-px leading-none">{event.date.split(' ')[0]}</span>
                    <span className="text-lg font-bold text-white leading-none">{event.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-white group-hover:text-[#2FA8CC] transition-colors truncate">{event.title}</h5>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {event.time}
                      </span>
                      <Badge className="bg-white/5 hover:bg-white/5 text-[9px] text-[#2FA8CC] border-white/10 uppercase py-0 px-1.5 h-4">{event.type}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Achievements */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white tracking-tight">Achievements</h2>
              <Trophy className="h-5 w-5 text-[#FFD700]" />
            </div>
            <Card className="bg-gradient-to-br from-[#FFD700]/10 via-[#FFD700]/5 to-transparent border-[#FFD700]/20 rounded-[2rem] p-6 backdrop-blur-xl group overflow-hidden">
               <div className="grid grid-cols-2 gap-4 relative z-10 text-center">
                 <div className="space-y-3 achievement-card transition-all duration-300">
                    <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-b from-[#FFD700] to-[#B8860B] p-[2px] shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                      <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center">
                         <Sparkles className="h-8 w-8 text-[#FFD700]" />
                      </div>
                    </div>
                    <span className="block text-[10px] font-bold text-white uppercase tracking-widest">Early Bird</span>
                 </div>
                 <div className="space-y-3 achievement-card transition-all duration-300 opacity-40 grayscale">
                    <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-b from-slate-400 to-slate-600 p-[2px]">
                      <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center">
                         <BookOpen className="h-8 w-8 text-slate-400" />
                      </div>
                    </div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course Master</span>
                 </div>
               </div>
               <div className="mt-8 text-center space-y-4">
                  <p className="text-xs text-[#FFD700] font-bold uppercase tracking-wider animate-pulse">80% to "Atomic Scholar" badge</p>
                  <Button className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-slate-950 font-bold rounded-xl h-10 shadow-[0_4px_15px_rgba(255,215,0,0.3)]">
                    All Achievements
                  </Button>
               </div>
               {/* Shine effect */}
               <div className="absolute top-0 -left-1/2 w-full h-full bg-white opacity-5 rotate-45 pointer-events-none group-hover:animate-ping" />
            </Card>
          </section>

          {/* Quick Support */}
          <section className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all">
            <div className="h-10 w-10 bg-[#2FA8CC]/20 rounded-xl flex items-center justify-center text-[#2FA8CC]">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Ask your Mentor</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Average response: 15m</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
