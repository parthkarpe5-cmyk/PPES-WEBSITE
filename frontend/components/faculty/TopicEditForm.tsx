"use client";

import { useActionState, useEffect } from "react";
import { updateTopicAction } from "../../app/actions/timetable";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";

interface TopicEditFormProps {
  sessionId: string;
  initialTopic: string;
}

export default function TopicEditForm({ sessionId, initialTopic }: TopicEditFormProps) {
  const [state, formAction, isPending] = useActionState(updateTopicAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Topic updated!");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="flex gap-2">
      <input type="hidden" name="sessionId" value={sessionId} />
      <input 
        name="topic" 
        defaultValue={initialTopic} 
        placeholder="Enter topic..."
        className="bg-[#E8F6FA]/50 border border-[#2FA8CC]/20 rounded-xl px-4 py-2 text-sm text-[#1F4E79] outline-none focus:border-[#2FA8CC] transition-all w-full max-w-[200px]"
      />
      <button 
        type="submit" 
        disabled={isPending}
        className="bg-[#2FA8CC] hover:bg-[#1F4E79] text-white p-2 rounded-xl transition-all active:scale-95 disabled:opacity-50"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
      </button>
    </form>
  );
}
