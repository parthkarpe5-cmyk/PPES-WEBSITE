'use client';

import { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Fingerprint,
  Trash2,
  Search,
  MoreVertical,
  Plus,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Faculty {
  _id: string;
  userId: string;
  name: string;
  email: string;
  usn: string;
  status: string;
  createdAt: string;
}

const FacultyManagementPage = () => {
  const { toast } = useToast();
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userId: '',
    password: '',
  });

  const fetchFaculty = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/faculty');
      const data = await response.json();
      setFaculty(data);
    } catch (error) {
      console.error('Failed to fetch faculty:', error);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const url = editingFaculty 
      ? `http://localhost:5000/api/admin/faculty/${editingFaculty._id}`
      : 'http://localhost:5000/api/admin/faculty';
    
    const method = editingFaculty ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      toast({
        title: editingFaculty ? "Faculty Updated" : "Faculty Created",
        description: editingFaculty 
          ? `Changes saved for ${formData.name}`
          : `Welcome email sent to ${formData.email}`,
      });
      
      setIsDialogOpen(false);
      setEditingFaculty(null);
      setFormData({ name: '', email: '', userId: '', password: '' });
      fetchFaculty();

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this faculty member?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/faculty/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Faculty Removed",
          description: "Member has been deleted from the database.",
        });
        fetchFaculty();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete faculty member.",
      });
    }
  };

  const openEditDialog = (f: Faculty) => {
    setEditingFaculty(f);
    setFormData({
      name: f.name,
      email: f.email,
      userId: f.userId,
      password: '', // Don't show or change password during simple edit
    });
    setIsDialogOpen(true);
  };

  const filteredFaculty = faculty.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full p-4 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky/10 border border-sky/20 text-sky text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            <ShieldCheck size={12} />
            Administrative Control
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Faculty <span className="text-sky">Directory</span>
          </h1>
          <p className="text-slate-400 mt-2">Manage your academic team and access controls.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingFaculty(null);
            setFormData({ name: '', email: '', userId: '', password: '' });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl bg-sky hover:bg-sky/90 text-white font-bold h-14 px-8 shadow-lg shadow-sky/20 active:scale-95 transition-all gap-2">
              <Plus size={20} />
              Add New Faculty
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0D121F] border-white/5 text-white max-w-2xl rounded-[2.5rem] p-0 overflow-hidden">
            <div className="p-8 md:p-12">
              <DialogHeader className="mb-8">
                <DialogTitle className="text-3xl font-bold tracking-tight">
                  {editingFaculty ? "Edit" : "Register"} <span className="text-sky">Faculty</span>
                </DialogTitle>
                <p className="text-slate-400 text-sm">
                  {editingFaculty ? "Update existing account details." : "Credentials will be sent automatically via email."}
                </p>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</Label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky transition-colors" size={18} />
                      <Input 
                        placeholder="Dr. John Doe"
                        required
                        className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-sky/50 focus:border-sky transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky transition-colors" size={18} />
                      <Input 
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
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Faculty ID / USN</Label>
                    <div className="relative group">
                      <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky transition-colors" size={18} />
                      <Input 
                        placeholder="FAC-2024-001"
                        required
                        className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-sky/50 focus:border-sky transition-all"
                        value={formData.userId}
                        onChange={(e) => setFormData({...formData, userId: e.target.value})}
                      />
                    </div>
                  </div>
                  {!editingFaculty && (
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Default Password</Label>
                      <Input 
                        placeholder="Default: password123"
                        className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-sky/50 focus:border-sky transition-all"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitLoading}
                  className="w-full h-14 rounded-2xl bg-sky hover:bg-sky/90 text-white font-bold text-lg shadow-lg shadow-sky/20 transition-all active:scale-95 group overflow-hidden"
                >
                  {isSubmitLoading ? <Loader2 className="animate-spin" /> : editingFaculty ? "Save Changes" : "Register & Notify Faculty"}
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Section */}
      <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <Input 
              placeholder="Search by name, email, or ID..."
              className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl focus:ring-sky/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
               Total: {faculty.length}
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Faculty Member</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Faculty ID</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {isPageLoading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <Loader2 className="animate-spin mx-auto text-sky/40" size={40} />
                      <p className="text-slate-500 mt-4 font-medium tracking-tight">Syncing directory...</p>
                    </td>
                  </tr>
                ) : filteredFaculty.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 text-slate-600">
                        <Search size={32} />
                      </div>
                      <p className="text-slate-400 font-bold text-lg">No Faculty Found</p>
                      <p className="text-slate-600 text-sm">Try adjusting your search or add a new member.</p>
                    </td>
                  </tr>
                ) : (
                  filteredFaculty.map((f, index) => (
                    <motion.tr 
                      key={f._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky to-deep-blue flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {f.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-base">{f.name}</div>
                            <div className="text-xs text-slate-500 font-medium">{f.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-sky/80">
                          {f.userId}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {f.status || 'Active'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="w-10 h-10 rounded-xl hover:bg-sky/10 hover:text-sky text-slate-600 transition-all"
                             onClick={() => openEditDialog(f)}
                           >
                             <Pencil size={18} />
                           </Button>
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="w-10 h-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-slate-600 transition-all"
                             onClick={() => handleDelete(f._id)}
                           >
                             <Trash2 size={18} />
                           </Button>
                           <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-white/5 text-slate-600">
                             <MoreVertical size={18} />
                           </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacultyManagementPage;
