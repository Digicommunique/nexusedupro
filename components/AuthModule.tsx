
import React, { useState } from 'react';
import { COLORS } from '../constants';

interface AuthModuleProps {
  onLogin: (role: string) => void;
}

const ROLES = [
  { id: 'super_admin', label: 'Super Admin', desc: 'Take full control with all features', color: '#9333ea', icon: '👑' },
  { id: 'admin', label: 'Admin', desc: 'Manage day to day activities', color: '#2563eb', icon: '👤' },
  { id: 'receptionist', label: 'Receptionist', desc: 'Manage all front office activities', color: '#06b6d4', icon: '🎧' },
  { id: 'librarian', label: 'Librarian', desc: 'Systematic library management', color: '#10b981', icon: '📚' },
  { id: 'parent', label: 'Parent', desc: 'Get child academic updates', color: '#ec4899', icon: '👨‍👩‍👧' },
  { id: 'student', label: 'Student', desc: 'Collaborate with school activities', color: '#84cc16', icon: '📖' },
  { id: 'accountant', label: 'Accountant', desc: 'Trace student fees and expenses', color: '#f59e0b', icon: '💰' },
  { id: 'teacher', label: 'Teacher', desc: 'Manage student & academic activities', color: '#64748b', icon: '👨‍🏫' },
];

const AuthModule: React.FC<AuthModuleProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<typeof ROLES[0] | null>(null);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId === 'admin12' && password === 'admin') {
      onLogin(selectedRole?.label || 'Admin');
    } else {
      setError('Invalid Institutional Credentials');
      setTimeout(() => setError(''), 3000);
    }
  };

  const isSuperAdminSelected = selectedRole?.id === 'super_admin';

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left: Orbital Visual Stage */}
      <div className="flex-1 relative bg-slate-50 flex items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#5B2D8B 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        {/* Central Hub */}
        <div className="relative z-10 w-full max-w-2xl aspect-square flex items-center justify-center">
           {/* Decorative Rings */}
           <div className="absolute w-[110%] h-[110%] border border-slate-200 rounded-full animate-[spin_60s_linear_infinite]"></div>
           <div className="absolute w-[85%] h-[85%] border border-slate-100 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
           
           <div className="bg-white p-4 rounded-[3rem] shadow-2xl border-8 border-slate-900 overflow-hidden w-[60%] aspect-video relative group cursor-crosshair">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover rounded-2xl opacity-80 group-hover:scale-110 transition-transform duration-1000" alt="Dashboard Preview" />
              <div className="absolute inset-0 bg-indigo-900/40 flex flex-col items-center justify-center text-white text-center p-6">
                 <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2 leading-none">Institutional Core</h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-4">360° Management Pulse</p>
                 <div className="h-0.5 w-12 bg-white/30 rounded-full"></div>
                 <p className="mt-4 text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Powered by Digital Communique</p>
              </div>
           </div>

           {/* Role Orbs */}
           {ROLES.map((role, idx) => {
             const angle = (idx / ROLES.length) * 2 * Math.PI;
             const radius = 300; // Radius of orbit
             const x = Math.cos(angle) * radius;
             const y = Math.sin(angle) * radius;

             return (
               <div 
                 key={role.id}
                 className="absolute transition-all duration-700 hover:scale-110 cursor-pointer text-center group"
                 style={{ 
                    transform: `translate(${x}px, ${y}px)`,
                    zIndex: 20
                 }}
                 onClick={() => { setSelectedRole(role); setShowPass(role.id === 'super_admin'); }}
               >
                 <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center text-3xl border-4 border-slate-50 transition-all group-hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] mb-3 overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: role.color }}></div>
                    {role.icon}
                 </div>
                 <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-lg group-hover:border-slate-900 transition-colors">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-800 leading-none mb-1">{role.label}</p>
                    <p className="text-[7px] font-bold text-slate-400 uppercase leading-tight max-w-[80px] mx-auto opacity-0 group-hover:opacity-100 transition-opacity">{role.desc}</p>
                 </div>
               </div>
             );
           })}
        </div>
      </div>

      {/* Right: Action Sidebar & Login Terminal */}
      <div className="w-full lg:w-[450px] bg-white border-l border-slate-200 p-12 flex flex-col relative z-50 shadow-[-20px_0_40px_rgba(0,0,0,0.02)]">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none border-b-8 border-indigo-500 pb-2 inline-block">EDUNEXUS</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-3 leading-relaxed">Smart Institution Portal</p>
          <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-lg w-fit border border-indigo-100">
             <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">A Product of Digital Communique Private Limited</span>
          </div>
        </div>

        {!selectedRole ? (
          <div className="flex-1 space-y-3 animate-in fade-in slide-in-from-right-8 duration-500 overflow-y-auto custom-scrollbar pr-2">
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 italic border-l-4 border-indigo-200 pl-4">Secure Entry Points —</p>
             {ROLES.map(role => (
               <button
                 key={role.id}
                 onClick={() => { setSelectedRole(role); setShowPass(role.id === 'super_admin'); }}
                 className="w-full p-5 rounded-2xl text-white flex items-center justify-between group transition-all hover:-translate-x-2 shadow-lg hover:shadow-2xl"
                 style={{ backgroundColor: role.color }}
               >
                 <div className="flex items-center gap-4">
                    <span className="text-xl">{role.icon}</span>
                    <span className="text-xs font-black uppercase tracking-[0.2em]">{role.label} Login</span>
                 </div>
                 <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </button>
             ))}
          </div>
        ) : (
          <div className="flex-1 animate-in zoom-in-95 duration-300">
             <button onClick={() => setSelectedRole(null)} className="mb-10 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 hover:text-slate-900 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Return to Roles
             </button>
             
             <div className="p-10 rounded-[3rem] border border-slate-200 shadow-2xl relative overflow-hidden bg-slate-50/50">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <span className="text-8xl">{selectedRole.icon}</span>
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight mb-2">{selectedRole.label} Access</h3>
                <p className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">Verification Required</p>
                
                <form onSubmit={handleAuth} className="space-y-6 relative z-10">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional ID</label>
                      <input 
                        required
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="e.g. admin12" 
                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-black text-slate-800 placeholder:opacity-20" 
                      />
                   </div>
                   <div className="space-y-2 relative">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                      <div className="relative">
                        <input 
                          required
                          type={showPass ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-black text-slate-800 placeholder:opacity-20" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                        >
                          {showPass ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          )}
                        </button>
                      </div>
                   </div>
                   
                   {error && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 p-3 rounded-xl border border-rose-100 text-center animate-bounce">{error}</p>}
                   
                   <button 
                     type="submit" 
                     className="w-full py-5 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:brightness-110 active:scale-95 transition-all"
                     style={{ backgroundColor: selectedRole.color }}
                   >
                     Authenticate
                   </button>
                </form>
             </div>
             
             {isSuperAdminSelected && (
               <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Visibility Rule Enabled</p>
                  <p className="text-[8px] font-bold text-rose-400 mt-1 uppercase">Super Admin passwords are visible during entry for validation.</p>
               </div>
             )}
          </div>
        )}

        <div className="mt-auto pt-12 flex flex-col gap-6 opacity-60">
           <div className="flex justify-between items-center">
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">© 2025 Digital Communique Private Limited</p>
              <div className="flex gap-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              </div>
           </div>
           <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest text-center leading-relaxed">
             All rights reserved. Unauthorized institutional access is strictly prohibited under the IT Act.
           </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModule;
