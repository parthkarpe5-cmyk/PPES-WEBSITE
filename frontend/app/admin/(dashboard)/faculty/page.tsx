'use client';

import { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AddFacultyPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userId: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/admin/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create faculty');
      }

      setIsSuccess(true);
      toast({
        title: "Faculty Created",
        description: `Welcome email sent to ${formData.email}`,
      });
      
      // Reset form after a delay
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', userId: '', password: '' });
      }, 3000);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <header className="mb-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky/10 border border-sky/20 text-sky text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            <ShieldCheck size={12} />
            Administrative Control
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
            Add New <span className="text-sky">Faculty</span>
          </h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Create a new faculty account and automatically send them their login credentials via email.
          </p>
        </header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-[2.5rem] p-8 md:p-12 border-white/5 relative overflow-hidden"
        >
          {/* Success Overlay */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/30">
                  <CheckCircle2 className="text-emerald-500" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Faculty Added Successfully!</h3>
                <p className="text-slate-400 mb-6">Credential email has been dispatched to the faculty member.</p>
                <div className="flex gap-4">
                   <Button variant="outline" className="rounded-xl border-white/10" onClick={() => setIsSuccess(false)}>
                     Add Another
                   </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</Label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky transition-colors" size={18} />
                  <Input 
                    id="name"
                    placeholder="Dr. John Doe"
                    required
                    className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-sky/50 focus:border-sky transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky transition-colors" size={18} />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="john@ppes.edu"
                    required
                    className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-sky/50 focus:border-sky transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Faculty UserID / USN</Label>
                <div className="relative group">
                  <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky transition-colors" size={18} />
                  <Input 
                    id="userId"
                    placeholder="FAC-2024-001"
                    required
                    className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-sky/50 focus:border-sky transition-all"
                    value={formData.userId}
                    onChange={(e) => setFormData({...formData, userId: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Default Password</Label>
                <div className="relative group">
                  <Input 
                    id="password"
                    type="text"
                    placeholder="Leave blank for 'password123'"
                    className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-sky/50 focus:border-sky transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <p className="text-[10px] text-slate-500 ml-2">Faculty will be prompted to change this on first login.</p>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-sky hover:bg-sky/90 text-white font-bold text-lg shadow-[0_0_20px_rgba(47,168,204,0.3)] transition-all active:scale-95 group overflow-hidden relative mt-4"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Register Faculty Member
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </Button>
          </form>

          {/* Decorative background circle */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-sky/5 blur-[100px] rounded-full -z-10" />
        </motion.div>

        <div className="mt-8 flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-500/70">
           <AlertCircle size={20} className="shrink-0" />
           <p className="text-xs font-medium">
             Important: Ensure the email address is correct. The system will automatically dispatch login credentials once you click register.
           </p>
        </div>
      </div>
    </div>
  );
};

export default AddFacultyPage;
