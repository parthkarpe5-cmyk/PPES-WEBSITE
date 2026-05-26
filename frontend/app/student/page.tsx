"use client"

import React, { useState, useEffect } from 'react'
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
import { getMyProfile, getStoredUserData } from '@/lib/api'

export default function StudentDashboard() {
  const router = useRouter()
  const [activeTestTab, setActiveTestTab] = useState('available')
  
  // State for API data
  const [tests, setTests] = useState<any[]>([])
  const [attempts, setAttempts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTestsData = async () => {
      try {
        const [testsRes, attemptsRes] = await Promise.all([
          fetch('http://localhost:5000/api/tests'),
          fetch('http://localhost:5000/api/tests/attempts/me')
        ]);
        
        if (testsRes.ok) {
          const testsData = await testsRes.json();
          setTests(testsData);
        }
        
        if (attemptsRes.ok) {
          const attemptsData = await attemptsRes.json();
          setAttempts(attemptsData);
        }
      } catch (error) {
        console.error("Failed to fetch tests data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestsData();
  }, []);
  const [student, setStudent] = useState(getStoredUserData())
  const [purchasedCourses, setPurchasedCourses] = useState<any[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)

  React.useEffect(() => {
    const refreshStudent = async () => {
      const stored = getStoredUserData()

      if (stored?.id && !stored.grade) {
        try {
          const latest = await getMyProfile()
          setStudent({ ...stored, ...latest })
          return
        } catch {
          // Keep stored value if the profile endpoint is temporarily unavailable.
        }
      }

      setStudent(stored)
    }

    refreshStudent()
    window.addEventListener('user-data-updated', refreshStudent)
    return () => window.removeEventListener('user-data-updated', refreshStudent)
  }, [])

  React.useEffect(() => {
    const fetchPurchasedCourses = async () => {
      if (!student?.unlockedCourses) {
        setLoadingCourses(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:5000/api/courses');
        const allCourses = await res.json();
        
        if (Array.isArray(allCourses)) {
          const unlocked = allCourses.filter(c => student.unlockedCourses.includes(c._id));
          setPurchasedCourses(unlocked);
        }
      } catch (err) {
        console.error('Failed to fetch courses', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchPurchasedCourses();
  }, [student?.unlockedCourses])

  const displayName = student?.name || 'Student'
  const displayGrade = student?.grade || 'Student Profile'
  const displayUsn = student?.usn || student?.id || 'USN unavailable'

  return (
    <div className="p-6 lg:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 bg-slate-950 min-h-screen">
      
      {/* 1. Welcome Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1F4E79] to-[#0A101F] p-8 md:p-12 shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <Badge variant="outline" className="bg-white/10 text-[#2FA8CC] border-white/10 px-3 py-1 text-[10px] uppercase font-bold tracking-widest">
              {displayGrade}
            </Badge>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 font-display">
                Welcome, <span className="text-[#2FA8CC] inline-block animate-shimmer bg-gradient-to-r from-[#2FA8CC] via-white to-[#2FA8CC] bg-[length:200%_auto] bg-clip-text text-transparent">{displayName}</span>
              </h1>
              <p className="text-slate-300 text-lg max-w-md italic">
                "The beautiful thing about learning is that no one can take it away from you."
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/50">
                {displayUsn}
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
                  {loading ? (
                    <div className="text-white text-sm">Loading tests...</div>
                  ) : tests.length === 0 ? (
                    <div className="text-white text-sm">No tests available at the moment.</div>
                  ) : tests.map((test) => {
                    const isCompleted = attempts.some(att => att.testId?._id === test._id)
                    return (
                      <Card key={test._id} className="bg-white/[0.03] border-white/5 hover:border-[#2FA8CC]/30 transition-all overflow-hidden group">
                        <div className="h-1 bg-[#2FA8CC]/20 group-hover:bg-[#2FA8CC] transition-all" />
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <Badge className="bg-[#2FA8CC]/10 text-[#2FA8CC] border-none text-[10px]">
                              {test.durationMinutes} MINS
                            </Badge>
                            {isCompleted && <CheckCircle2 className="h-5 w-5 text-saffron" />}
                          </div>
                          <CardTitle className="text-lg font-bold text-white">{test.title}</CardTitle>
                          <CardDescription className="text-sky/70 text-xs line-clamp-2">{test.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between items-center pt-2">
                          <span className="text-[10px] font-bold text-deep-blue/60 uppercase tracking-widest">{test.questions?.length || 0} Questions</span>
                          {isCompleted ? (
                            <Button disabled variant="ghost" className="text-deep-blue/60 text-xs font-bold">
                              Completed
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => router.push(`/student/tests/${test._id}`)}
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
                        <th className="px-6 py-4 text-[10px] font-bold text-deep-blue/60 uppercase tracking-widest">Test</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-deep-blue/60 uppercase tracking-widest">Score</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-deep-blue/60 uppercase tracking-widest text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loading ? (
                        <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-deep-blue/60">Loading attempts...</td></tr>
                      ) : attempts.length === 0 ? (
                        <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-deep-blue/60">No tests completed yet.</td></tr>
                      ) : attempts.map((attempt, index) => (
                        <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-white block">{attempt.testId?.title || 'Unknown Test'}</span>
                            <span className="text-[10px] text-deep-blue/60">{new Date(attempt.createdAt).toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className="bg-saffron/100/10 text-saffron border-none font-bold">
                              {attempt.status === 'pending_review' ? 'Pending Review' : `${attempt.score}/${attempt.maxScore}`}
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
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-[#2FA8CC]" />
                Purchased Courses
              </h2>
              <Button 
                onClick={() => router.push('/student/courses')}
                variant="link" 
                className="text-[#2FA8CC] text-xs font-bold hover:no-underline font-display"
              >
                Browse All
              </Button>
            </div>
            
            <div className="bg-white/[0.02] rounded-3xl border border-white/5 overflow-hidden">
              {loadingCourses ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2FA8CC]"></div>
                </div>
              ) : purchasedCourses.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4 opacity-50" />
                  <p className="text-slate-400 font-bold text-lg mb-2">No Courses Enrolled</p>
                  <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto">
                    You haven't purchased any courses yet. Browse our catalog to start learning.
                  </p>
                  <Button 
                    onClick={() => router.push('/student/courses')}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold"
                  >
                    View Catalog
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-black/20 border-b border-white/5">
                      <tr>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Course Name</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Subjects</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {purchasedCourses.map((course) => (
                        <tr key={course._id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#2FA8CC]/20 to-transparent border border-[#2FA8CC]/20 flex items-center justify-center shrink-0">
                                <BookOpen className="h-4 w-4 text-[#2FA8CC]" />
                              </div>
                              <div>
                                <span className="text-sm font-bold text-white block group-hover:text-[#2FA8CC] transition-colors">{course.course_name}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{course.course_id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <Badge className="bg-white/5 text-slate-300 border-white/10 font-bold">
                              {course.subjects?.length || 0} Modules
                            </Badge>
                          </td>
                          <td className="px-6 py-5">
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-black tracking-wider uppercase text-[9px]">
                              Active
                            </Badge>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <Button 
                              onClick={() => router.push(`/student/courses`)}
                              className="bg-white/5 hover:bg-[#2FA8CC] text-white border border-white/10 hover:border-[#2FA8CC] transition-all h-9 text-xs font-bold"
                            >
                              Study Hub <ChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                      <span className="text-[10px] font-bold text-deep-blue/60 flex items-center gap-1">
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
                         <BookOpen className="h-8 w-8 text-sky/70" />
                      </div>
                    </div>
                    <span className="block text-[10px] font-bold text-sky/70 uppercase tracking-widest">Course Master</span>
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
              <p className="text-[10px] text-deep-blue/60 font-bold uppercase">Average response: 15m</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
