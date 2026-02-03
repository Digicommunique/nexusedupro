
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
import { Alumni, AlumniGroup, AlumniMessage, BloodGroup } from '../types';

const AlumniModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'directory' | 'add' | 'groups' | 'connect'>('directory');
  
  const [alumniList, setAlumniList] = useState<Alumni[]>([
    { 
      id: 'AL1', 
      name: 'Vikram Mehta', 
      gender: 'Male', 
      dob: '1998-04-12', 
      address: 'Vasant Vihar, Delhi', 
      bloodGroup: 'A+', 
      alumniId: 'ALU-2016-001',
      graduationYear: '2016',
      currentProfession: 'Senior Software Engineer',
      currentOrganization: 'Google India',
      higherEducation: 'IIT Bombay',
      linkedInUrl: 'https://linkedin.com/in/vikrammehta',
      fatherName: 'Sanjay Mehta', fatherOccupation: 'Business', fatherOccupationAddress: 'Vasant Vihar', fatherContact: '9812345678',
      motherName: 'Anjali Mehta', motherOccupation: 'Artist', motherOccupationAddress: 'Home', motherContact: '9812345679',
      guardianName: 'Sanjay Mehta', guardianRelationship: 'Father', guardianAddress: 'Delhi', guardianContact: '9812345678'
    },
    { 
      id: 'AL2', 
      name: 'Priyanka Chopra', 
      gender: 'Female', 
      dob: '1995-07-22', 
      address: 'Bandra, Mumbai', 
      bloodGroup: 'B+', 
      alumniId: 'ALU-2013-042',
      graduationYear: '2013',
      currentProfession: 'Architect',
      currentOrganization: 'Design Studio',
      higherEducation: 'CEPT University',
      linkedInUrl: 'https://linkedin.com/in/priyankac',
      fatherName: 'Ashok Chopra', fatherOccupation: 'Physician', fatherOccupationAddress: 'Mumbai', fatherContact: '9922334455',
      motherName: 'Madhu Chopra', motherOccupation: 'Doctor', motherOccupationAddress: 'Mumbai', motherContact: '9922334456',
      guardianName: 'Ashok Chopra', guardianRelationship: 'Father', guardianAddress: 'Mumbai', guardianContact: '9922334455'
    }
  ]);

  const [groups, setGroups] = useState<AlumniGroup[]>([
    { id: 'G1', name: 'Batch 2016 Official', description: 'Main coordination group for Class of 2016.', category: 'Batch', memberCount: 145 },
    { id: 'G2', name: 'Tech Mentors', description: 'Alumni working in software and hardware domains.', category: 'Professional', memberCount: 56 },
    { id: 'G3', name: 'Alumni Sports Club', description: 'Interest group for active sports and tournaments.', category: 'Interest', memberCount: 89 }
  ]);

  const [messages, setMessages] = useState<AlumniMessage[]>([
    { id: 'M1', senderId: 'AL1', senderName: 'Vikram Mehta', content: 'Excited for the upcoming alumni meet!', timestamp: '2:45 PM' },
    { id: 'M2', senderId: 'System', senderName: 'EduNexus Admin', content: 'Welcome to the 2025 Alumni Portal.', timestamp: '1:00 PM' }
  ]);

  const handleAddAlumni = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAlumni: Alumni = {
      id: `AL${alumniList.length + 1}`,
      name: formData.get('name') as string,
      gender: formData.get('gender') as any,
      dob: formData.get('dob') as string,
      address: formData.get('address') as string,
      bloodGroup: formData.get('bloodGroup') as BloodGroup,
      alumniId: `ALU-${formData.get('graduationYear')}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      graduationYear: formData.get('graduationYear') as string,
      currentProfession: formData.get('currentProfession') as string,
      currentOrganization: formData.get('currentOrganization') as string,
      higherEducation: formData.get('higherEducation') as string,
      linkedInUrl: formData.get('linkedInUrl') as string,
      fatherName: formData.get('fatherName') as string,
      fatherOccupation: '', fatherOccupationAddress: '', fatherContact: '',
      motherName: '', motherOccupation: '', motherOccupationAddress: '', motherContact: '',
      guardianName: '', guardianRelationship: '', guardianAddress: '', guardianContact: ''
    };
    setAlumniList([...alumniList, newAlumni]);
    e.currentTarget.reset();
    setActiveTab('directory');
  };

  const handleCreateGroup = () => {
    const name = prompt('Group Name:');
    if (!name) return;
    const desc = prompt('Description:');
    const category = prompt('Category (Batch/Professional/Interest):') as any;
    
    setGroups([...groups, {
      id: `G${groups.length + 1}`,
      name,
      description: desc || '',
      category: category || 'Interest',
      memberCount: 1
    }]);
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get('message') as string;
    if (!content) return;

    setMessages([...messages, {
      id: `M${messages.length + 1}`,
      senderId: 'Admin',
      senderName: 'System Administrator',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    e.currentTarget.reset();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-500 underline-offset-8">Alumni Central</h1>
          <p className="text-slate-500 font-medium">Connecting generations of institutional excellence.</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          {[
            { id: 'directory', label: 'Directory' },
            { id: 'add', label: 'Enroll Record' },
            { id: 'groups', label: 'Communities' },
            { id: 'connect', label: 'Connections' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
              style={activeTab === tab.id ? { backgroundColor: COLORS.primary } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'directory' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
           <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Alumni Registry</h3>
              <div className="flex gap-4">
                 <input type="text" placeholder="Search by name, year..." className="px-4 py-2 bg-white border rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-64 shadow-inner" />
                 <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase">{alumniList.length} Connected Members</span>
              </div>
           </div>
           <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumniList.map(alu => (
                <div key={alu.id} className="p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-indigo-300 hover:shadow-xl transition-all group relative overflow-hidden">
                   <div className="flex items-center gap-4 mb-6">
                      <img src={alu.photo || `https://picsum.photos/seed/${alu.id}/100`} className="w-16 h-16 rounded-2xl object-cover border-4 border-slate-50" alt="" />
                      <div>
                         <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{alu.name}</h4>
                         <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Batch {alu.graduationYear}</p>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                           <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                         </div>
                         <p className="text-xs font-bold text-slate-600">{alu.currentProfession} at {alu.currentOrganization}</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                           <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                         </div>
                         <p className="text-xs font-bold text-slate-600 truncate">{alu.higherEducation || 'University Degree'}</p>
                      </div>
                   </div>
                   <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                      <a href={alu.linkedInUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">LinkedIn</a>
                      <button className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">Message →</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'add' && (
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleAddAlumni}>
             <FormSection title="Previous Student Record" description="Archiving student progress post-graduation.">
                <Input label="Full Name" name="name" required />
                <Select label="Gender" name="gender" required options={[{value:'Male', label:'Male'}, {value:'Female', label:'Female'}]} />
                <Input label="Graduation Year" name="graduationYear" required placeholder="e.g. 2018" />
                <Input label="Current Profession" name="currentProfession" required placeholder="e.g. Data Scientist" />
                <Input label="Current Organization" name="currentOrganization" required placeholder="e.g. Microsoft" />
                <Input label="Higher Education" name="higherEducation" placeholder="e.g. MBA from IIM" />
                <Input label="Contact Address" name="address" required />
                <Select label="Blood Group" name="bloodGroup" required options={['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => ({value:bg, label:bg}))} />
                <Input label="LinkedIn Profile URL" name="linkedInUrl" placeholder="https://..." />
                <div className="lg:col-span-3 pt-6">
                  <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:brightness-110 active:scale-95 transition-all">
                    Finalize Alumni Enrollment
                  </button>
                </div>
             </FormSection>
          </form>
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 uppercase italic">Active Communities</h3>
            <button onClick={handleCreateGroup} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
              Create New Group
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {groups.map(group => (
              <div key={group.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-2xl transition-all group flex flex-col justify-between h-80">
                 <div>
                    <div className="flex justify-between items-start mb-6">
                       <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                         group.category === 'Batch' ? 'bg-amber-100 text-amber-700' : group.category === 'Professional' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                       }`}>
                         {group.category}
                       </span>
                       <div className="flex -space-x-3">
                          {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400">U</div>)}
                       </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-2">{group.name}</h3>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">{group.description}</p>
                 </div>
                 <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{group.memberCount} Members</span>
                    <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Enter Room</button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'connect' && (
        <div className="max-w-5xl mx-auto bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[700px]">
           <div className="w-full md:w-80 border-r border-slate-100 flex flex-col">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Conversations</h4>
              </div>
              <div className="flex-1 overflow-y-auto">
                 {alumniList.map(alu => (
                    <button key={alu.id} className="w-full p-6 flex items-center gap-4 hover:bg-indigo-50/50 transition-all border-b border-slate-50 text-left group">
                       <img src={alu.photo || `https://picsum.photos/seed/${alu.id}/50`} className="w-12 h-12 rounded-xl object-cover" alt="" />
                       <div>
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{alu.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase italic">Online</p>
                       </div>
                    </button>
                 ))}
              </div>
           </div>

           <div className="flex-1 flex flex-col relative bg-slate-50/30">
              <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">General Channel</h4>
                 </div>
                 <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500">Report Abuse</button>
              </div>

              <div className="flex-1 p-8 overflow-y-auto space-y-6">
                 {messages.map(msg => (
                   <div key={msg.id} className={`flex flex-col ${msg.senderId === 'Admin' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-md p-5 rounded-[1.5rem] shadow-sm ${
                        msg.senderId === 'Admin' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                      }`}>
                         <p className="text-xs font-bold mb-1 opacity-60">{msg.senderName}</p>
                         <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                      </div>
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1 ml-2 mr-2">{msg.timestamp}</span>
                   </div>
                 ))}
              </div>

              <div className="p-8 bg-white border-t border-slate-100">
                 <form onSubmit={handleSendMessage} className="flex gap-4">
                    <input name="message" placeholder="Broadcast a message to the alumni network..." className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" />
                    <button type="submit" className="px-10 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all">
                       Send
                    </button>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AlumniModule;
