
import React, { useState } from 'react';
import { COLORS } from '../constants';
import { Staff, Student } from '../types';

interface TeacherMessagesProps {
  teacher: Staff;
  students: Student[];
}

const TeacherMessages: React.FC<TeacherMessagesProps> = ({ teacher, students }) => {
  const [selectedChat, setSelectedChat] = useState<Student | null>(null);

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[750px] animate-in fade-in zoom-in-95 duration-500">
       {/* Contact Sidebar */}
       <div className="w-full md:w-96 border-r border-slate-100 flex flex-col bg-slate-50/30">
          <div className="p-8 border-b border-slate-100 bg-white">
             <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-2">Classroom Parents</h3>
             <input type="text" placeholder="Search by student name..." className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner" />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
             {students.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => setSelectedChat(s)}
                  className={`w-full p-6 flex items-center gap-4 transition-all border-b border-slate-50 text-left group ${selectedChat?.id === s.id ? 'bg-indigo-50' : 'hover:bg-white'}`}
                >
                   <div className="relative">
                      <img src={s.photo || `https://picsum.photos/seed/${s.id}/60`} className="w-14 h-14 rounded-[1.25rem] object-cover border-2 border-white shadow-sm" alt="" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                   </div>
                   <div className="overflow-hidden">
                      <p className={`text-sm font-black uppercase tracking-tight transition-colors ${selectedChat?.id === s.id ? 'text-indigo-600' : 'text-slate-800'}`}>{s.fatherName}'s Parent</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate italic">Parent of {s.name}</p>
                   </div>
                </button>
             ))}
          </div>
       </div>

       {/* Conversation Pane */}
       <div className="flex-1 flex flex-col bg-white">
          {!selectedChat ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-200 p-20 text-center">
               <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-8">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
               </div>
               <h3 className="text-2xl font-black text-slate-800 uppercase italic mb-2 tracking-tight">Active Liaison Interface</h3>
               <p className="font-bold text-slate-400 max-w-sm">Select a student record from the sidebar to establish a professional communication link with their guardian.</p>
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <img src={selectedChat.photo || `https://picsum.photos/seed/${selectedChat.id}/40`} className="w-10 h-10 rounded-xl object-cover" alt="" />
                    <div>
                       <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">{selectedChat.fatherName} (Parent)</h4>
                       <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Verified Institutional Identity</span>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 shadow-sm transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></button>
                    <button className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 shadow-sm transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                 </div>
              </div>

              <div className="flex-1 p-10 overflow-y-auto space-y-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
                 <div className="flex flex-col items-start">
                    <div className="bg-slate-100 text-slate-700 p-5 rounded-[1.75rem] rounded-tl-none max-w-md shadow-sm">
                       <p className="text-sm font-medium leading-relaxed italic">"Good morning Prof. {teacher.name.split(' ').pop()}, wanted to inquire about the syllabus coverage for the upcoming mid-terms for {selectedChat.name}."</p>
                    </div>
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-2 ml-2">Guardian • 09:15 AM</span>
                 </div>

                 <div className="flex flex-col items-end">
                    <div className="bg-indigo-600 text-white p-5 rounded-[1.75rem] rounded-tr-none max-w-md shadow-xl">
                       <p className="text-sm font-medium leading-relaxed uppercase tracking-tight">"Greetings. We have completed 80% of the core curriculum. Detailed unit-wise weightage has been uploaded in the Academic Module. Please ensure {selectedChat.name.split(' ')[0]} reviews Chapter 5 thoroughly."</p>
                    </div>
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-2 mr-2">You (Faculty) • 10:30 AM</span>
                 </div>
              </div>

              <div className="p-8 border-t border-slate-100">
                 <form onSubmit={(e) => { e.preventDefault(); e.currentTarget.reset(); }} className="flex gap-4">
                    <input placeholder="Communicate professional insights..." className="flex-1 px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm font-black outline-none focus:ring-4 focus:ring-indigo-100 transition-all focus:bg-white" />
                    <button type="submit" className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all">Send Dispatch</button>
                 </form>
              </div>
            </>
          )}
       </div>
    </div>
  );
};

export default TeacherMessages;
