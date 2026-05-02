"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Shield, 
  User as UserIcon,
  Mail,
  Calendar,
  ArrowUpDown,
  RefreshCw
} from "lucide-react";

interface User {
  userId: string;
  usn?: string;
  name?: string;
  role?: string;
  password?: string;
  image?: string;
  created_at?: string;
  last_active?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = Array.isArray(users) ? users.filter(user => 
    user.userId?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.usn?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-black text-white tracking-tighter">
             User <span className="text-sky/60 font-medium">Management</span>
           </h2>
           <p className="text-white/40 text-sm font-medium mt-1">
             Manage and monitor all registered accounts on the platform.
           </p>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={fetchUsers}
             className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-95"
           >
             <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
           </button>
           <button className="px-6 py-3 rounded-xl bg-sky text-white text-xs font-black uppercase tracking-widest hover:bg-deep-blue shadow-lg shadow-sky/20 transition-all active:scale-95">
             Add New User
           </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-sky transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text"
            placeholder="Search by ID or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-sky/50 focus:ring-1 focus:ring-sky/50 transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white hover:bg-white/[0.08] transition-all">
          <Filter size={18} className="text-sky" />
          More Filters
        </button>
      </div>

      {/* Users Table */}
      <div className="relative overflow-hidden rounded-[2rem] p-px bg-white/5 border border-white/5">
        <div className="glass-card relative h-full rounded-[2rem] overflow-hidden bg-[#050810]/40 backdrop-blur-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/40">
                  <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">User Profile</th>
                  <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">User ID</th>
                  <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Password</th>
                  <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Role</th>
                  <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Status</th>
                  <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Joined</th>
                  <th className="p-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={`user-skeleton-${i}`} className="animate-pulse">
                      <td colSpan={6} className="p-8">
                        <div className="h-12 bg-white/5 rounded-xl w-full" />
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                       <Users size={48} className="mx-auto text-white/10 mb-4" />
                       <p className="text-white/40 font-bold uppercase tracking-widest text-xs">No users found</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.userId} className="group hover:bg-sky/5 transition-colors border-white/5">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-sky/10 border border-sky/20 flex items-center justify-center text-sky font-black">
                              {user.name?.charAt(0) || user.userId.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#0D121F] rounded-full" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white tracking-tight">{user.name || "Anonymous"}</p>
                            <p className="text-[10px] text-white/40 font-medium tracking-wide">Standard Account</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <code className="text-[11px] font-mono bg-white/5 px-2 py-1 rounded text-sky/80 border border-white/5 w-fit">
                            ID: {user.userId}
                          </code>
                          {user.usn && (
                            <span className="text-[10px] font-bold text-amber-500/80 ml-1">
                              USN: {user.usn}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                         <div className="group/pass relative flex items-center gap-2">
                           <span className="text-xs font-mono text-white/40 blur-[4px] group-hover/pass:blur-0 transition-all duration-300">
                             {user.password || "********"}
                           </span>
                           <div className="absolute inset-0 flex items-center justify-center bg-[#050810]/80 rounded opacity-100 group-hover/pass:opacity-0 transition-opacity">
                             <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Hover to View</span>
                           </div>
                         </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${
                            user.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-sky/10 text-sky'
                          }`}>
                            <Shield size={14} />
                          </div>
                          <span className="text-xs font-bold text-white/80 capitalize">{user.role || "Student"}</span>
                        </div>
                      </td>
                      <td className="p-6">
                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider">
                           <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                           Active
                         </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-white/40">
                          <Calendar size={14} />
                          <span className="text-xs font-medium">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <button className="p-2 hover:bg-white/5 rounded-xl text-white/20 hover:text-white transition-all">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="p-6 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-white/30 font-medium">
              Showing <span className="text-white/60">{filteredUsers.length}</span> of <span className="text-white/60">{users.length}</span> results
            </p>
            <div className="flex gap-2">
               <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:pointer-events-none" disabled>
                 Previous
               </button>
               <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:pointer-events-none" disabled>
                 Next
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
