"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, MapPin, Users, Video, Clock, Tag, Sparkles, Plus, Search, Filter, BookOpen, AlertCircle, User, ShieldAlert, Trash2, Edit3, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

// Define interface for custom events
interface EventItem {
  id?: number
  _id?: string
  type: "Workshop" | "Special Class"
  title: string
  topic?: string
  speaker?: string
  mentor?: string
  mode: "Online" | "Offline"
  platformOrLocation: string
  date: string
  time: string
  duration: string
  price?: string
  limitSeats?: string
  category?: string
  description: string
}

export function EventsModule({ isAdmin = false }: { isAdmin?: boolean }) {
  const [view, setView] = useState<"student" | "admin">("student")
  const [events, setEvents] = useState<EventItem[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "Workshop" | "Special Class">("all")
  const [searchQuery, setSearchQuery] = useState("")

  // --- ADMIN FORM STATE ---
  const [eventType, setEventType] = useState<"Workshop" | "Special Class">("Workshop")
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<string | number | null>(null)

  const todayStr = (() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })();

  const [formData, setFormData] = useState({
    title: "", topic: "", speaker: "", mode: "Online", platformOrLocation: "",
    date: "", time: "", duration: "", price: "Free", description: "",
    category: "Motivation", mentor: "", limitSeats: ""
  })

  // Load events from Backend on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        } else {
          loadFromLocalFallback();
        }
      } catch (err) {
        console.error("Error fetching events, falling back to local storage:", err);
        loadFromLocalFallback();
      }
    };

    const loadFromLocalFallback = () => {
      const saved = localStorage.getItem("prarambha_events")
      if (saved) {
        setEvents(JSON.parse(saved))
      } else {
        // Seed premium data immediately so they can see the design
        const dummyEvents: EventItem[] = [
          {
            id: 1,
            type: "Workshop",
            title: "Crash Course on Algebra & Functions",
            topic: "Mathematics",
            speaker: "Prof. Rahul Sharma",
            mode: "Online",
            platformOrLocation: "Zoom Classroom",
            date: "2026-10-15",
            time: "18:00",
            duration: "2 Hours",
            price: "Free",
            category: "Academic Support",
            description: "An intensive algebra mastery session focusing on high-weightage linear equations, functions, and quadratic formulas."
          },
          {
            id: 2,
            type: "Special Class",
            title: "Mission 90+ Board Strategy Roadshow",
            category: "Strategy",
            mentor: "Dr. Anita Desai",
            mode: "Offline",
            platformOrLocation: "Prarambha High School Campus",
            date: "2026-11-05",
            time: "10:00",
            duration: "3 Hours",
            limitSeats: "50",
            description: "Get a comprehensive study blueprint, secret answer-writing guidelines, and personalized tips directly from a senior board examiner."
          },
          {
            id: 3,
            type: "Workshop",
            title: "Public Speaking & Career Guidance",
            topic: "Soft Skills",
            speaker: "Siddharth Sen (TEDx)",
            mode: "Online",
            platformOrLocation: "Google Meet",
            date: "2026-12-01",
            time: "17:00",
            duration: "1.5 Hours",
            price: "Free",
            category: "Career Guidance",
            description: "Overcome stage fright and learn persuasive speaking strategies tailored specifically for college applications and interview prep."
          }
        ]
        setEvents(dummyEvents)
        localStorage.setItem("prarambha_events", JSON.stringify(dummyEvents))
      }
    };

    fetchEvents();
  }, [isAdmin])

  // Create / Update event handler
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.date || !formData.time || !formData.platformOrLocation) {
      toast.error("Required Fields Missing", {
        description: "Please fill in the Event Title, Date, Time, and Platform/Location.",
      })
      return
    }

    const eventPayload: EventItem = {
      type: eventType,
      title: formData.title,
      topic: eventType === "Workshop" ? formData.topic : undefined,
      speaker: eventType === "Workshop" ? formData.speaker : undefined,
      mentor: eventType === "Special Class" ? formData.mentor : undefined,
      mode: formData.mode as "Online" | "Offline",
      platformOrLocation: formData.platformOrLocation,
      date: formData.date,
      time: formData.time,
      duration: formData.duration || "2 Hours",
      price: eventType === "Workshop" ? formData.price : undefined,
      limitSeats: eventType === "Special Class" ? formData.limitSeats : undefined,
      category: formData.category,
      description: formData.description
    }

    try {
      const url = editingEvent 
        ? `http://localhost:5000/api/events/${editingEvent._id || editingEvent.id}`
        : "http://localhost:5000/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventPayload)
      });
      if (res.ok) {
        const savedEvent = await res.json();
        if (editingEvent) {
          setEvents(prev => prev.map(evt => (evt._id === savedEvent._id || evt.id === savedEvent.id) ? savedEvent : evt));
          toast.success("Event Updated Successfully! ✨");
        } else {
          setEvents(prev => [savedEvent, ...prev]);
          toast.success("Event Published Successfully! ✨", {
            description: `"${savedEvent.title}" is now live in the student catalog.`,
          });
        }
        
        // Reset Form & State
        setEditingEvent(null);
        setFormData({
          title: "", topic: "", speaker: "", mode: "Online", platformOrLocation: "",
          date: "", time: "", duration: "", price: "Free", description: "",
          category: "Motivation", mentor: "", limitSeats: ""
        });
        setView("student"); // Switch back to see it
      } else {
        const errData = await res.json();
        toast.error("Error saving event: " + (errData.error || "Unknown error"));
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to connect to server: " + err.message);
    }
  }

  // Edit event click handler
  const handleEditClick = (event: EventItem) => {
    setEditingEvent(event);
    setEventType(event.type);
    setFormData({
      title: event.title || "",
      topic: event.topic || "",
      speaker: event.speaker || "",
      mode: event.mode || "Online",
      platformOrLocation: event.platformOrLocation || "",
      date: event.date || "",
      time: event.time || "",
      duration: event.duration || "",
      price: event.price || "Free",
      description: event.description || "",
      category: event.category || "Motivation",
      mentor: event.mentor || "",
      limitSeats: event.limitSeats || ""
    });
    setView("admin");
  };

  // Trigger delete confirmation modal
  const handleDeleteClick = (eventId: string | number | undefined) => {
    if (!eventId) return;
    setEventToDelete(eventId);
    setShowDeleteConfirm(true);
  };

  // Delete event handler (from confirmation modal)
  const executeDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventToDelete}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setEvents(prev => prev.filter(evt => (evt._id || evt.id) !== eventToDelete));
        toast.success("Event Deleted Successfully! 🗑️");
      } else {
        setEvents(prev => prev.filter(evt => (evt._id || evt.id) !== eventToDelete));
        toast.success("Event Deleted Successfully! 🗑️");
      }
      
      const saved = localStorage.getItem("prarambha_events");
      if (saved) {
        const parsed = JSON.parse(saved);
        const filtered = parsed.filter((evt: any) => (evt._id || evt.id) !== eventToDelete);
        localStorage.setItem("prarambha_events", JSON.stringify(filtered));
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      setEvents(prev => prev.filter(evt => (evt._id || evt.id) !== eventToDelete));
      toast.success("Event Deleted Successfully! 🗑️");
      
      const saved = localStorage.getItem("prarambha_events");
      if (saved) {
        const parsed = JSON.parse(saved);
        const filtered = parsed.filter((evt: any) => (evt._id || evt.id) !== eventToDelete);
        localStorage.setItem("prarambha_events", JSON.stringify(filtered));
      }
    } finally {
      setShowDeleteConfirm(false);
      setEventToDelete(null);
    }
  };

  // Filter events
  const filteredEvents = events.filter(e => {
    const matchesCategory = activeTab === "all" || e.type === activeTab
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (e.topic && e.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (e.category && e.category.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-slate-200 p-6 md:p-10 font-sans transition-all selection:bg-sky/30">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER (Identical to Doubts Layout) --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
              <Calendar className="text-sky" size={36} />
              Events Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Join interactive, expert-led workshops and structured special courses.</p>
          </div>

          {/* Portal Switcher - ONLY show if logged in user is Admin */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              {view === "student" ? (
                <button 
                  onClick={() => {
                    setEditingEvent(null);
                    setFormData({
                      title: "", topic: "", speaker: "", mode: "Online", platformOrLocation: "",
                      date: "", time: "", duration: "", price: "Free", description: "",
                      category: "Motivation", mentor: "", limitSeats: ""
                    });
                    setView("admin");
                  }}
                  className="bg-sky hover:bg-sky/90 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_30px_rgba(47,168,204,0.3)]"
                >
                  <Plus size={20} />
                  Create New Event
                </button>
              ) : (
                <button 
                  onClick={() => setView("student")}
                  className="text-slate-400 hover:text-white font-medium flex items-center gap-2 transition-colors"
                >
                  ← Back to Dashboard
                </button>
              )}
            </div>
          )}
        </header>

        {/* ========================================= */}
        {/* STUDENT PORTAL VIEW                       */}
        {/* ========================================= */}
        {view === "student" && (
          <div className="space-y-8">
            
            {/* Search & Filter (Identical to Doubts Layout) */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search your events..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-sky/50 transition-all text-slate-200 placeholder:text-slate-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* TABS WITH PREMIUM SLIDING PILL BACKGROUND */}
              <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl relative">
                {["all", "Workshop", "Special Class"].map((tab) => {
                  const isActive = activeTab === tab
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-5 py-3 rounded-xl text-xs font-bold transition-colors duration-300 whitespace-nowrap relative z-10 ${
                        isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {/* Sliding visual background */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute inset-0 bg-sky rounded-xl -z-10 shadow-[0_0_20px_rgba(47,168,204,0.3)]"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      {tab === "all" ? "All Events" : tab === "Workshop" ? "Workshops" : "Special Classes"}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Smooth Spring-based Grid Layout Transition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredEvents.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]"
                  >
                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="text-slate-500" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No active events found</h3>
                    <p className="text-slate-400 max-w-sm mx-auto">Try typing a different keyword or checking other filter categories.</p>
                  </motion.div>
                ) : (
                  filteredEvents.map((event) => (
                    <motion.div
                      key={event._id || event.id}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96, y: 10 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 380, 
                        damping: 32,
                        layout: { duration: 0.35, type: "spring", stiffness: 350, damping: 30 }
                      }}
                      className="group bg-white/5 border border-white/10 hover:bg-white/[0.08] p-6 rounded-[2rem] cursor-pointer transition-colors duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Top Pill Badges */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-2">
                            <div className={`px-3 py-1 rounded-full border ${
                              event.type === 'Workshop' 
                                ? 'bg-sky/10 border-sky/20 text-sky' 
                                : 'bg-saffron/10 border-saffron/20 text-saffron'
                            }`}>
                              <span className="text-[10px] font-bold uppercase tracking-widest">{event.type}</span>
                            </div>

                            {event.type === 'Workshop' && (
                              <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                {event.price}
                              </div>
                            )}

                            {event.type === 'Special Class' && (
                              <div className="px-3 py-1 bg-rose-500/10 rounded-full border border-rose-500/20 text-[10px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1">
                                <Users className="w-3 h-3" /> ONLY {event.limitSeats} SEATS
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">{event.mode}</span>
                          </div>
                        </div>

                        {/* Title & Leader */}
                        <h3 className="text-xl font-bold text-white group-hover:text-sky transition-colors line-clamp-1 mb-1">
                          {event.title}
                        </h3>
                        <p className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
                          <BookOpen size={13} className="text-sky" />
                          Led by: <span className="text-slate-300 font-semibold">{event.type === 'Workshop' ? event.speaker : event.mentor}</span>
                        </p>

                        {/* Description */}
                        <p className="text-sm leading-relaxed text-slate-400 mb-6 line-clamp-3">
                          {event.description}
                        </p>
                      </div>

                      {/* Metadata Footer */}
                      <div className="pt-4 border-t border-white/5 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-slate-400 text-xs">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-sky" />
                            {event.date} • {event.time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} className="text-sky" />
                            {event.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          {event.mode === 'Online' ? <Video size={13} className="text-sky" /> : <MapPin size={13} className="text-saffron" />}
                          <span className="truncate">{event.platformOrLocation}</span>
                        </div>

                        {isAdmin ? (
                          <div className="flex gap-2 mt-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(event);
                              }}
                              className="flex-1 h-11 rounded-xl bg-[#2FA8CC]/10 hover:bg-[#2FA8CC] text-[#2FA8CC] hover:text-white border border-[#2FA8CC]/20 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5"
                            >
                              <Edit3 size={14} />
                              Edit
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(event._id || event.id);
                              }}
                              className="h-11 w-11 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-300 hover:text-red-500 border border-white/5 transition-all flex items-center justify-center"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ) : (
                          <button className="w-full mt-2 bg-white/5 border border-white/10 group-hover:bg-sky group-hover:text-white group-hover:border-sky py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300">
                            {event.type === 'Workshop' ? 'Register Now' : 'Reserve Seat'}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* ADMIN PORTAL / EVENT CREATION             */}
        {/* ========================================= */}
        {view === "admin" && isAdmin && (
          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-sky/10 rounded-2xl text-sky">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{editingEvent ? "Modify Event" : "Create New Event"}</h2>
                  <p className="text-slate-400 text-sm">
                    {editingEvent ? "Update the details of your live event session." : "Publish masterclasses, special workshops, and expert keynotes live."}
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleCreateEvent} className="space-y-6">
                {/* Switcher Form Type */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Event Classification</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setEventType("Workshop")} 
                      className={`flex-1 flex items-center justify-center gap-2 py-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                        eventType === "Workshop" 
                          ? "border-sky bg-sky/10 text-white font-bold" 
                          : "border-white/10 text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      <Tag className="w-4 h-4" />
                      <span>Workshop</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEventType("Special Class")} 
                      className={`flex-1 flex items-center justify-center gap-2 py-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                        eventType === "Special Class" 
                          ? "border-saffron bg-saffron/10 text-white font-bold" 
                          : "border-white/10 text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Special Class</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-full">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Event Title *</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Masterclass in Quantum Theory"
                      value={formData.title}
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-sky/50 rounded-2xl py-3.5 px-4 text-sm transition-all outline-none text-slate-200" 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                    />
                  </div>

                  {/* DYNAMIC FIELDS: WORKSHOP */}
                  {eventType === "Workshop" && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Topic / Subject</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Mathematics, Career, Dev"
                          value={formData.topic}
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-sky/50 rounded-2xl py-3.5 px-4 text-sm transition-all outline-none text-slate-200" 
                          onChange={e => setFormData({...formData, topic: e.target.value})} 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Speaker Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Dr. Homi Bhabha"
                          value={formData.speaker}
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-sky/50 rounded-2xl py-3.5 px-4 text-sm transition-all outline-none text-slate-200" 
                          onChange={e => setFormData({...formData, speaker: e.target.value})} 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Pricing (Free or Amount)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Free, ₹499" 
                          value={formData.price}
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-sky/50 rounded-2xl py-3.5 px-4 text-sm transition-all outline-none text-slate-200" 
                          onChange={e => setFormData({...formData, price: e.target.value})} 
                        />
                      </div>
                    </>
                  )}

                  {/* DYNAMIC FIELDS: SPECIAL CLASS */}
                  {eventType === "Special Class" && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Category Type</label>
                        <select 
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-sky/50 rounded-2xl py-3.5 px-4 text-sm transition-all outline-none text-slate-200 cursor-pointer"
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                          <option value="Motivation">Motivation</option>
                          <option value="Strategy">Strategy</option>
                          <option value="Guidance">Guidance</option>
                          <option value="Academic Support">Academic Support</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Mentor Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Senior Faculty Member"
                          value={formData.mentor}
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-sky/50 rounded-2xl py-3.5 px-4 text-sm transition-all outline-none text-slate-200" 
                          onChange={e => setFormData({...formData, mentor: e.target.value})} 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Limit Seats</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 50" 
                          value={formData.limitSeats}
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-sky/50 rounded-2xl py-3.5 px-4 text-sm transition-all outline-none text-slate-200" 
                          onChange={e => setFormData({...formData, limitSeats: e.target.value})} 
                        />
                      </div>
                    </>
                  )}

                  {/* SHARED FIELDS */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Mode of Delivery</label>
                    <select 
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-sky/50 rounded-2xl py-3.5 px-4 text-sm transition-all outline-none text-slate-200 cursor-pointer"
                      value={formData.mode}
                      onChange={e => setFormData({...formData, mode: e.target.value})}
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Platform / Location *</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Zoom Meeting / Classroom Hall C" 
                      value={formData.platformOrLocation}
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-sky/50 rounded-2xl py-3.5 px-4 text-sm transition-all outline-none text-slate-200" 
                      onChange={e => setFormData({...formData, platformOrLocation: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Scheduled Date *</label>
                    <input 
                      required 
                      type="date" 
                      value={formData.date}
                      min={editingEvent ? undefined : todayStr}
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-sky/50 rounded-2xl py-3.5 px-4 text-sm transition-all outline-none text-slate-200 cursor-pointer" 
                      onChange={e => setFormData({...formData, date: e.target.value})} 
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Time & Duration</label>
                    <div className="flex gap-2">
                      <input 
                        required 
                        type="time" 
                        value={formData.time}
                        className="w-1/2 bg-white/[0.03] border border-white/10 focus:border-sky/50 rounded-2xl py-3.5 px-4 text-sm transition-all outline-none text-slate-200 cursor-pointer" 
                        onChange={e => setFormData({...formData, time: e.target.value})} 
                      />
                      <input 
                        type="text" 
                        placeholder="e.g. 2 Hours" 
                        value={formData.duration}
                        className="w-1/2 bg-white/[0.03] border border-white/10 focus:border-sky/50 rounded-2xl py-3.5 px-4 text-sm transition-all outline-none text-slate-200" 
                        onChange={e => setFormData({...formData, duration: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="col-span-full">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Brief Summary Description *</label>
                    <textarea 
                      required 
                      placeholder="Give a brief summary outlining the key focus, goals, and prerequisites of this event session."
                      value={formData.description}
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-sky/50 rounded-2xl py-3.5 px-4 text-sm h-32 outline-none resize-none text-slate-200" 
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                <button type="submit" className="w-full bg-sky hover:bg-sky/90 text-white font-bold py-4 rounded-2xl shadow-[0_0_30px_rgba(47,168,204,0.3)] transition-all duration-300">
                  {editingEvent ? "Save Event Changes" : "Publish Event Live"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

      {/* --- CUSTOM CONFIRMATION MODAL (No Alert system) --- */}
      {showDeleteConfirm && eventToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-6 text-center relative animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white uppercase tracking-tight font-sans">Confirm Deletion</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-sans">
                Are you absolutely sure you want to delete this event? This action is permanent and will completely remove this session catalog entry.
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={executeDeleteEvent}
                className="flex-grow h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all text-xs uppercase tracking-wider font-sans"
              >
                Delete
              </button>
              <button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setEventToDelete(null);
                }}
                className="px-6 h-12 border border-white/10 hover:bg-white/5 text-slate-300 font-bold rounded-xl transition-all text-xs uppercase tracking-wider font-sans"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  )
}
