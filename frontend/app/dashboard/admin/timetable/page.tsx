"use client";

import { useActionState, useEffect, useState } from "react";
import { assignClassAction } from "../../../actions/timetable";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  ChevronRight, 
  LayoutDashboard,
  CheckCircle2,
  Loader2,
  Plus,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminTimetable() {
  const [state, formAction, isPending] = useActionState(assignClassAction, null);
  const [activeTab, setActiveTab] = useState('allocate');

  useEffect(() => {
    if (state?.success) {
      toast.success("Class allocated successfully!");
    } else if (state?.error) {
      toast.error(`Error: ${state.error}`);
    }
  }, [state]);

  return (
    <div className="min-h-screen w-full bg-[#050810] text-slate-200 p-4 md:p-8 relative overflow-hidden flex flex-col items-center">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-sky/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-saffron/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky/10 border border-sky/20 text-sky text-[10px] font-bold uppercase tracking-widest mb-3">
              <LayoutDashboard size={12} />
              Administrative Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              Timetable <span className="text-sky">Manager</span>
            </h1>
            <p className="text-slate-400 font-medium mt-2">Precision scheduling for the academic term.</p>
          </motion.div>
          
          <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-xl">
             <button 
               onClick={() => setActiveTab('allocate')}
               className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'allocate' ? 'bg-sky text-white shadow-lg shadow-sky/20' : 'text-slate-400 hover:text-white'}`}
             >
               <Plus size={14} /> Allocate
             </button>
             <button 
               onClick={() => setActiveTab('view')}
               className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'view' ? 'bg-sky text-white shadow-lg shadow-sky/20' : 'text-slate-400 hover:text-white'}`}
             >
               <BookOpen size={14} /> View Weekly
             </button>
          </div>
        </div>

        {/* Main Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] p-px bg-gradient-to-br from-white/10 to-transparent"
        >
          <div className="glass-card relative bg-[#0D121F]/80 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 overflow-hidden">
            
            {/* Form Background Accent */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Calendar size={200} className="text-sky" />
            </div>

            <form action={formAction} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-6">
                {/* Faculty Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Assigned Faculty</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky transition-colors" size={18} />
                    <input 
                      name="facultyName" 
                      required 
                      placeholder="e.g. Dr. Aris" 
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white outline-none focus:border-sky focus:ring-4 focus:ring-sky/10 transition-all placeholder:text-slate-600" 
                    />
                  </div>
                </div>

                {/* Target Class Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Target Academic Class</label>
                  <div className="relative group">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky transition-colors" size={18} />
                    <select 
                      name="studentClass" 
                      required 
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white font-bold outline-none focus:border-sky focus:ring-4 focus:ring-sky/10 cursor-pointer appearance-none"
                    >
                      <option value="09" className="bg-[#0D121F]">Class 9th (Goa)</option>
                      <option value="10" className="bg-[#0D121F]">Class 10th (Goa)</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Subject Area</label>
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky transition-colors" size={18} />
                    <input 
                      name="subject" 
                      required 
                      placeholder="e.g. Mathematics" 
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white outline-none focus:border-sky focus:ring-4 focus:ring-sky/10 transition-all placeholder:text-slate-600" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Date */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Session Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky transition-colors" size={18} />
                    <input 
                      name="date" 
                      required 
                      type="date" 
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white outline-none focus:border-sky focus:ring-4 focus:ring-sky/10 transition-all [color-scheme:dark]" 
                    />
                  </div>
                </div>

                {/* Topic */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Lecture Topic / Unit</label>
                  <div className="relative group">
                    <ChevronRight className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky transition-colors" size={18} />
                    <input 
                      name="topic" 
                      required 
                      placeholder="e.g. Trigonometry" 
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white outline-none focus:border-sky focus:ring-4 focus:ring-sky/10 transition-all placeholder:text-slate-600" 
                    />
                  </div>
                </div>

                {/* Start Time */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Commencement Time</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky transition-colors" size={18} />
                    <input 
                      name="startTime" 
                      required 
                      type="time" 
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white outline-none focus:border-sky focus:ring-4 focus:ring-sky/10 transition-all [color-scheme:dark]" 
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full h-16 bg-sky hover:bg-sky/90 text-white font-black rounded-2xl shadow-xl shadow-sky/20 transition-all active:scale-[0.98] text-sm uppercase tracking-widest disabled:opacity-50 group"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={18} />
                      Commit Allocation
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-6 py-4 opacity-30">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-white" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Prarambha Path • Core Engine</p>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-white" />
        </div>
      </div>
    </div>
  );
}