"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Users, 
  FileText, 
  TrendingUp, 
  Settings, 
  MoreVertical,
  Search,
  Filter,
  Eye
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const STATS = [
  { label: 'Total Tests', value: '12', icon: FileText, color: 'text-sky', bg: 'bg-sky/10' },
  { label: 'Total Students', value: '148', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Avg. Score', value: '76%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
]

const RECENT_TESTS = [
  { id: '1', title: 'Science Quiz: Photosynthesis', date: '2026-05-02', submissions: 24, status: 'Published' },
  { id: '2', title: 'Mathematics: Algebra Basics', date: '2026-04-30', submissions: 18, status: 'Draft' },
  { id: '3', title: 'History: World War II', date: '2026-04-25', submissions: 42, status: 'Published' },
]

export default function TeacherDashboard() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Teacher Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 font-display">Faculty Dashboard</h1>
              <p className="text-slate-500 mt-1">Manage your classes, tests, and student progress.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => router.push('/teacher/tests/create')}
                className="bg-saffron hover:bg-orange-600 text-white shadow-lg shadow-saffron/20 h-11 px-6 font-bold"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Test
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATS.map((stat, i) => (
            <Card key={i} className="border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                  </div>
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Manage Tests</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search tests..." 
                    className="pl-10 pr-4 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-sky/20 outline-none w-64 transition-all"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Test Details</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submissions</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {RECENT_TESTS.map((test) => (
                      <tr key={test.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <span className="font-semibold text-slate-900 block">{test.title}</span>
                          <span className="text-xs text-slate-400">Created: {test.date}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center text-slate-600">
                            <Users className="h-3.5 w-3.5 mr-2 text-sky" />
                            {test.submissions}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold",
                            test.status === 'Published' ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                          )}>
                            {test.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-sky">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Quick Tools</h2>
            <Card className="border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Grading Tools</CardTitle>
                <CardDescription>Review manual assessments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start text-left border-dashed py-6 hover:bg-sky/5 hover:border-sky/50 transition-all">
                  <div className="bg-sky/10 p-2 rounded-lg mr-3">
                    <FileText className="h-4 w-4 text-sky" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Review Descriptive</p>
                    <p className="text-xs text-slate-400">4 pending submissions</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left border-dashed py-6 hover:bg-indigo-50 hover:border-indigo-200 transition-all">
                  <div className="bg-indigo-50 p-2 rounded-lg mr-3">
                    <Plus className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Review Coding</p>
                    <p className="text-xs text-slate-400">2 pending submissions</p>
                  </div>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-deep-blue text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="h-24 w-24" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg text-white">Student Analytics</CardTitle>
                <CardDescription className="text-white/60">Insights into class performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-white text-deep-blue hover:bg-sky hover:text-white font-bold">
                  View Full Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
