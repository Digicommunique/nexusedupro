
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select, FileUpload } from './FormLayout';
import { Homework, HomeworkSubmission, Staff, Student } from '../types';

interface HomeworkModuleProps {
  teacher: Staff;
  students: Student[];
}

const GRADES = [
  'Pre-Nursery', 'Nursery', 'KG', 
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

const SECTIONS = ['A', 'B', 'C', 'D', 'E'];
const SUBJECTS = ['Mathematics', 'English', 'Hindi', 'Science', 'Social Science', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];

const HomeworkModule: React.FC<HomeworkModuleProps> = ({ teacher, students }) => {
  const [activeTab, setActiveTab] = useState<'assign' | 'review'>('assign');
  
  // Dynamic Segment Filters
  const [targetGrade, setTargetGrade] = useState<string>(teacher.assignedGrade || 'Class 10');
  const [targetSection, setTargetSection] = useState<string>(teacher.assignedSection || 'A');

  const [homeworks, setHomeworks] = useState<Homework[]>([
    { id: 'H1', title: 'Calculus Problems - Set 1', description: 'Solve all problems from page 42-45 of the main textbook.', grade: 'Class 10', section: 'A', subject: 'Mathematics', dueDate: '2025-03-25' }
  ]);
  
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([
    { 
      id: 'S1', 
      homeworkId: 'H1', 
      studentId: 'S1', 
      studentName: 'Aarav Sharma', 
      submissionDate: '2025-03-24', 
      status: 'Pending', 
      feedback: '',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    }
  ]);

  const [selectedHomeworkId, setSelectedHomeworkId] = useState<string>('H1');

  // Logic: Filter homeworks based on active Grade/Section
  const filteredHomeworks = useMemo(() => {
    return homeworks.filter(h => h.grade === targetGrade && h.section === targetSection);
  }, [homeworks, targetGrade, targetSection]);

  const handleAssign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newHw: Homework = {
      id: `HW-${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      grade: targetGrade,
      section: targetSection,
      subject: formData.get('subject') as string,
      dueDate: formData.get('dueDate') as string,
    };
    setHomeworks([...homeworks, newHw]);
    e.currentTarget.reset();
    alert(`Homework successfully deployed to ${targetGrade} - ${targetSection}`);
  };

  const handleMark = (subId: string, marks: number, feedback: string) => {
    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, marks, feedback, status: 'Checked' } : s));
  };

  // Logic: Filter submissions for evaluation
  const currentHomeworkSubmissions = useMemo(() => {
    if (!selectedHomeworkId) return [];
    // Only show submissions from students who actually belong to the targeted grade/section
    return submissions.filter(s => s.homeworkId === selectedHomeworkId);
  }, [submissions, selectedHomeworkId]);

  const selectedHomework = homeworks.find(h => h.id === selectedHomeworkId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-500 underline-offset-8">Homework Control</h1>
          <p className="text-slate-500 font-medium italic">Assign, collect, and evaluate student academic progress.</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {[
            { id: 'assign', label: 'New Assignment' },
            { id: 'review', label: 'Evaluation Hub' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Global Segment Selector */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 sticky top-4 z-40 backdrop-blur-md bg-white/95">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Context Selector</p>
               <h3 className="text-sm font-black text-slate-900 uppercase">Target Academic Segment</h3>
            </div>
         </div>
         
         <div className="flex-1 flex gap-4">
            <div className="flex-1">
               <Select label="" name="filter_grade" defaultValue={targetGrade} onSelect={setTargetGrade} options={GRADES.map(g => ({value: g, label: g}))} />
            </div>
            <div className="flex-1">
               <Select label="" name="filter_section" defaultValue={targetSection} onSelect={setTargetSection} options={SECTIONS.map(s => ({value: s, label: `Section ${s}`}))} />
            </div>
         </div>
      </div>

      {activeTab === 'assign' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-5">
              <form onSubmit={handleAssign}>
                 <FormSection title="Assignment Architect" description={`Broadcasting to ${targetGrade} - ${targetSection}`}>
                    <div className="lg:col-span-3 space-y-4">
                       <Input label="Title" name="title" required placeholder="e.g. Geometry Quiz" />
                       <Select label="Subject" name="subject" required options={SUBJECTS.map(s => ({value: s, label: s}))} />
                       <Input label="Submission Deadline" name="dueDate" type="date" required />
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Description</label>
                          <textarea name="description" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm h-32 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Details of the assignment..."></textarea>
                       </div>
                       <FileUpload label="Reference Documents / Worksheet" name="hwFile" />
                       <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                          Broadcast Homework
                       </button>
                    </div>
                 </FormSection>
              </form>
           </div>

           <div className="lg:col-span-7 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-black uppercase tracking-tight italic text-slate-800">Deployment Log</h3>
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">{targetGrade} - {targetSection}</p>
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredHomeworks.length} Active Tasks</span>
              </div>
              <div className="p-8 space-y-4 overflow-y-auto max-h-[600px]">
                 {filteredHomeworks.length === 0 ? (
                   <div className="py-20 text-center opacity-20">
                      <p className="text-sm font-black uppercase tracking-[0.3em]">No Homework Indexed for this segment</p>
                   </div>
                 ) : (
                   filteredHomeworks.map(hw => (
                     <div key={hw.id} className="p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-indigo-400 transition-all flex justify-between items-center group shadow-sm">
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{hw.title}</h4>
                              <span className="px-2 py-0.5 bg-indigo-50 text-[9px] font-black text-indigo-500 rounded uppercase">{hw.subject}</span>
                           </div>
                           <p className="text-xs font-medium text-slate-500 line-clamp-1 italic mb-2">"{hw.description}"</p>
                           <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Deadline: {hw.dueDate}</p>
                        </div>
                        <button 
                          onClick={() => { setSelectedHomeworkId(hw.id); setActiveTab('review'); }}
                          className="px-5 py-2.5 bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                           Review Evaluations
                        </button>
                     </div>
                   ))
                 )}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'review' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex-1">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Evaluating for segment {targetGrade} - {targetSection}:</p>
                 <div className="flex items-center gap-4 flex-wrap">
                   <select 
                      value={selectedHomeworkId} 
                      onChange={(e) => setSelectedHomeworkId(e.target.value)}
                      className="text-2xl font-black text-slate-900 uppercase tracking-tight italic bg-transparent outline-none cursor-pointer border-b-2 border-indigo-200"
                   >
                      <option value="">Select Assignment...</option>
                      {filteredHomeworks.map(hw => <option key={hw.id} value={hw.id}>{hw.title}</option>)}
                   </select>
                   {selectedHomework && (
                     <span className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">
                        Deadline: {selectedHomework.dueDate}
                     </span>
                   )}
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 flex flex-col items-center">
                    <span className="text-[8px] font-black uppercase tracking-widest mb-0.5">Checked</span>
                    <span className="text-lg font-black">{currentHomeworkSubmissions.filter(s => s.status === 'Checked').length}</span>
                 </div>
                 <div className="px-6 py-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 flex flex-col items-center">
                    <span className="text-[8px] font-black uppercase tracking-widest mb-0.5">Pending</span>
                    <span className="text-lg font-black">{currentHomeworkSubmissions.filter(s => s.status === 'Pending').length}</span>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white">
                       <tr className="text-[9px] font-black uppercase tracking-[0.2em]">
                          <th className="px-10 py-6">Student Enrollment ({targetGrade}-{targetSection})</th>
                          <th className="px-10 py-6 text-center">Digital Hand-in Status</th>
                          <th className="px-10 py-6">Evaluative Feedback</th>
                          <th className="px-10 py-6 text-right">Marks Registry</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {currentHomeworkSubmissions.map(sub => (
                         <tr key={sub.id} className="hover:bg-slate-50 transition-all">
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-4">
                                  <img src={`https://picsum.photos/seed/${sub.studentId}/50`} className="w-12 h-12 rounded-xl object-cover shadow-sm border-2 border-white" alt="" />
                                  <div>
                                     <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{sub.studentName}</p>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase">Received: {sub.submissionDate}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-10 py-8 text-center">
                               <div className="flex flex-col items-center gap-3">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                    sub.status === 'Checked' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse'
                                  }`}>
                                     {sub.status}
                                  </span>
                                  {sub.fileUrl ? (
                                    <div className="flex gap-2">
                                       <button 
                                         onClick={() => window.open(sub.fileUrl, '_blank')}
                                         className="px-3 py-1 bg-white border border-slate-200 text-[8px] font-black text-indigo-600 rounded-lg shadow-sm hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest"
                                       >
                                         View Submission
                                       </button>
                                    </div>
                                  ) : (
                                    <span className="text-[8px] font-black text-slate-300 uppercase italic">Physically Collected</span>
                                  )}
                               </div>
                            </td>
                            <td className="px-10 py-8 max-w-xs">
                               <textarea 
                                 className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all h-20 resize-none"
                                 placeholder="Academic observations..."
                                 defaultValue={sub.feedback}
                                 onBlur={(e) => handleMark(sub.id, sub.marks || 0, e.target.value)}
                               ></textarea>
                            </td>
                            <td className="px-10 py-8 text-right">
                               <div className="flex flex-col items-end gap-3">
                                  <div className="flex items-center gap-2">
                                     <label className="text-[9px] font-black uppercase text-slate-400">Awarded Points:</label>
                                     <input 
                                       type="number" 
                                       className="w-16 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black text-indigo-600 text-center"
                                       defaultValue={sub.marks}
                                       onBlur={(e) => handleMark(sub.id, Number(e.target.value), sub.feedback || '')}
                                     />
                                  </div>
                                  <button 
                                    onClick={() => handleMark(sub.id, sub.marks || 0, sub.feedback || '')}
                                    className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all"
                                  >
                                     Sync Ledger
                                  </button>
                               </div>
                            </td>
                         </tr>
                       ))}
                       {currentHomeworkSubmissions.length === 0 && (
                         <tr>
                            <td colSpan={4} className="py-32 text-center">
                               <div className="flex flex-col items-center gap-4 opacity-20">
                                  <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  <p className="text-sm font-black uppercase tracking-[0.4em]">
                                     {selectedHomeworkId ? "Awaiting Hand-ins for this assignment" : "Please select an assignment above"}
                                  </p>
                               </div>
                            </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default HomeworkModule;
