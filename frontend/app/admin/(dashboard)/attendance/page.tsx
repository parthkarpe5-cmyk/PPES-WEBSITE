"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  Video,
  ChevronRight,
  RefreshCw,
  Activity,
  History
} from "lucide-react";
import { format } from "date-fns";

interface AttendanceSummary {
  _id: { userId: string; classId: string };
  userName: string;
  role: string;
  sessions: Array<{ entryTime: string; exitTime?: string }>;
  totalDurationMs: number;
  lastSeen: string;
  sessionCount: number;
  isInClass: number;
}

export default function AttendancePage() {
  const [summaries, setSummaries] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/attendance");
      const data = await response.json();
      setSummaries(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const formatDuration = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    if (mins === 0 && secs === 0) return "0m";
    return `${mins}m ${secs}s`;
  };

  const filteredRecords = summaries.filter(record => 
    record.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    record._id.classId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record._id.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-sky/10 border border-sky/20">
              <Activity className="text-sky" size={32} />
            </div>
            Smart <span className="text-sky">Attendance</span>
          </h1>
          <p className="text-white/40 mt-2 font-medium tracking-tight">Consolidated session tracking with robust multi-entry calculation.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchAttendance}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all active:scale-95"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky text-white font-bold text-sm hover:bg-sky-500 transition-all active:scale-95 shadow-lg shadow-sky/20">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Students Monitored", value: new Set(summaries.map(s => s._id.userId)).size, icon: Users, color: "text-sky", bg: "bg-sky/10" },
           { label: "Active Now", value: summaries.filter(s => s.isInClass).length, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
           { label: "Total Sessions", value: summaries.reduce((acc, curr) => acc + curr.sessionCount, 0), icon: History, color: "text-amber-500", bg: "bg-amber-500/10" },
           { label: "Avg. Duration", value: summaries.length ? formatDuration(summaries.reduce((acc, curr) => acc + curr.totalDurationMs, 0) / summaries.length) : "0m", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" }
         ].map((stat, i) => (
           <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 relative overflow-hidden group hover:bg-white/10 transition-all">
             <div className="relative z-10">
               <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
               <div className="flex items-end justify-between">
                 <p className="text-3xl font-black text-white">{stat.value}</p>
                 <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                   <stat.icon size={20} />
                 </div>
               </div>
             </div>
           </div>
         ))}
      </div>

      <div className="rounded-[2.5rem] bg-black/40 border border-white/5 overflow-hidden backdrop-blur-2xl shadow-2xl">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.01]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
            <input 
              type="text" 
              placeholder="Search student or class ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-sky/50 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-all">
              <Filter size={14} />
              Filter by Class
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-black/40">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-white/20 font-bold uppercase tracking-widest text-[10px] p-6">Participant</TableHead>
                <TableHead className="text-white/20 font-bold uppercase tracking-widest text-[10px] p-6">Class ID</TableHead>
                <TableHead className="text-white/20 font-bold uppercase tracking-widest text-[10px] p-6">Session Count</TableHead>
                <TableHead className="text-white/20 font-bold uppercase tracking-widest text-[10px] p-6">Total Time Spent</TableHead>
                <TableHead className="text-white/20 font-bold uppercase tracking-widest text-[10px] p-6">Current Status</TableHead>
                <TableHead className="text-white/20 font-bold uppercase tracking-widest text-[10px] p-6 text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={6} className="p-8">
                      <div className="h-12 bg-white/5 rounded-xl w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-20 text-center">
                     <Activity size={48} className="mx-auto text-white/10 mb-4" />
                     <p className="text-white/40 font-bold uppercase tracking-widest text-xs">No attendance data detected</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={`${record._id.userId}-${record._id.classId}`} className="group hover:bg-sky/5 transition-colors border-white/5">
                    <TableCell className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/40 font-black relative overflow-hidden group-hover:border-sky/30 transition-all">
                          {record.userName.charAt(0)}
                          <div className="absolute inset-0 bg-sky/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white/90 tracking-tight">{record.userName}</p>
                          <p className="text-[10px] text-white/20 font-bold tracking-widest uppercase">{record.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit">
                        <Video size={12} className="text-sky" />
                        <span className="text-xs font-bold text-white/60 tracking-tight">{record._id.classId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-white">{record.sessionCount}</span>
                        <span className="text-[9px] text-white/20 font-bold uppercase">Entries</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-sky">{formatDuration(record.totalDurationMs)}</span>
                        <span className="text-[9px] text-white/20 font-bold uppercase">Accumulated</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-6">
                       {record.isInClass ? (
                         <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 w-fit">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Now</span>
                         </div>
                       ) : (
                         <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 w-fit">
                           <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Offline</span>
                         </div>
                       )}
                    </TableCell>
                    <TableCell className="p-6 text-right">
                      <button className="p-3 hover:bg-sky/10 hover:text-sky rounded-xl transition-all text-white/10">
                        <ChevronRight size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
