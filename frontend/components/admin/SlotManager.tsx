"use client";

import { useActionState, useEffect } from "react";
import { upsertSlotAction } from "../../app/actions/timetable";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SlotManagerProps {
  faculty: any[];
  timeSlots: string[];
}

export default function SlotManager({ faculty, timeSlots }: SlotManagerProps) {
  const [state, formAction, isPending] = useActionState(upsertSlotAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Schedule updated successfully!");
    } else if (state?.error) {
      toast.error(`Failed to update: ${state.error}`);
    }
  }, [state]);

  return (
    <div className="fixed bottom-8 right-8 z-50 bg-white p-8 rounded-[3rem] shadow-2xl border-2 border-sky/20 w-[350px]">
      <h3 className="text-xl font-bold text-[#1F4E79] mb-6">⚡ Slot Manager</h3>
      <form action={formAction} className="flex flex-col gap-4">
        <select 
          name="facultyId" 
          required 
          className="w-full h-12 bg-slate-50 border border-sky/10 rounded-xl px-4 text-sm font-bold outline-none focus:border-sky/50 transition-all"
        >
          <option value="">Select Faculty</option>
          {faculty.map((f: any) => (
            <option key={f._id} value={f._id}>
              {f.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <input 
            name="date" 
            type="date" 
            required 
            className="h-12 bg-slate-50 border border-sky/10 rounded-xl px-3 text-xs outline-none focus:border-sky/50" 
          />
          <select 
            name="slotIndex" 
            className="h-12 bg-slate-50 border border-sky/10 rounded-xl px-3 text-xs outline-none focus:border-sky/50"
          >
            {timeSlots.map((t, i) => (
              <option key={i} value={i}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select 
            name="studentClass" 
            className="h-12 bg-slate-50 border border-sky/10 rounded-xl px-3 text-xs font-bold outline-none focus:border-sky/50"
          >
            <option value="09">Class 9th</option>
            <option value="10">Class 10th</option>
          </select>
          <select 
            name="duration" 
            className="h-12 bg-slate-50 border border-sky/10 rounded-xl px-3 text-xs font-bold outline-none focus:border-sky/50"
          >
            <option value="1">1 Hour</option>
            <option value="2">2 Hours</option>
          </select>
        </div>

        <input 
          name="subject" 
          placeholder="Subject Name" 
          required 
          className="h-12 bg-slate-50 border border-sky/10 rounded-xl px-4 text-sm outline-none focus:border-sky/50" 
        />

        <label className="flex items-center gap-3 bg-red-50 p-3 rounded-xl cursor-pointer hover:bg-red-100/50 transition-colors">
          <input 
            type="checkbox" 
            name="isProxy" 
            value="true" 
            className="w-4 h-4 accent-red-500" 
          />
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Mark as Proxy</span>
        </label>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full h-14 bg-[#2FA8CC] text-white font-black rounded-xl hover:bg-[#1F4E79] transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-sky/10 active:scale-95 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Updating...
            </>
          ) : (
            "UPDATE SCHEDULE"
          )}
        </button>
      </form>
    </div>
  );
}
