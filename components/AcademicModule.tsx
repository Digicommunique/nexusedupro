
import React, { useState } from 'react';
import AcademicPlanner from './AcademicPlanner';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
import { LessonPlan } from '../types';

const AcademicModule: React.FC = () => {
  const [subTab, setSubTab] = useState<'planner' | 'classes' | 'timetable' | 'lessons'>('planner');
  const [selectedLessonGrade, setSelectedLessonGrade] = useState<string>('Class 10');
  
  // State for dynamic Lesson Plans
  const [plans, setPlans] = useState<LessonPlan[]>([
    { id: '1', grade: 'Class 10', subject: 'mathematics', chapterNo: '01', chapterTitle: 'Quadratic Equations', lessonsCount: 8 },
    { id: '2', grade: 'Class 10', subject: 'physics', chapterNo: '01', chapterTitle: 'Light Reflection', lessonsCount: 12 },
    { id: '3', grade: 'Class 1', subject: 'hindi', chapterNo: '01', chapterTitle: 'Varnamala', lessonsCount: 5 }
  ]);

  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);

  const WINGS = ['Foundation', 'Primary', 'Middle', 'Senior'];
  const SECTIONS = ['A', 'B', 'C', 'D', 'E'];
  const GRADES = [
    'Pre-Nursery', 'Nursery', 'KG', 
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
  ];

  const SUBJECTS = [
    'Mathematics', 'English', 'Hindi', 'Science', 'Social Science', 
    'Physics', 'Physics Practical', 'Chemistry', 'Chemistry Practical', 
    'Biology', 'Biology Practical', 'Computer Science', 'Computer Application', 
    'History', 'Geography', 'Political Science', 'Economics', 'Sociology', 
    'Psychology', 'Environmental Science', 'Sports', 'Library', 'Art & Craft'
  ];

  const handleSaveLesson = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPlan: LessonPlan = {
      id: editingPlan ? editingPlan.id : Math.random().toString(36).substr(2, 9),
      grade: selectedLessonGrade,
      subject: formData.get('subject') as string,
      chapterNo: formData.get('chapter_no') as string,
      chapterTitle: formData.get('chapter_title') as string,
      lessonsCount: 10, // Default for demo
    };

    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? newPlan : p));
      setEditingPlan(null);
    } else {
      setPlans([...plans, newPlan]);
    }
    e.currentTarget.reset();
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('Are you sure you want to delete this lesson plan?')) {
      setPlans(plans.filter(p => p.id !== id));
    }
  };

  const handleEditPlan = (plan: LessonPlan) => {
    setEditingPlan(plan);
    setSelectedLessonGrade(plan.grade);
    // Note: In a real app, we'd use a controlled form. Here we might need to use refs or state to reset values.
  };

  const filteredPlans = plans.filter(p => p.grade === selectedLessonGrade);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 p-1 bg-white rounded-2xl border border-slate-200 w-fit">
        {[
          { id: 'planner', label: 'Academic Planner' },
          { id: 'classes', label: 'Class Management' },
          { id: 'timetable', label: 'Time Table' },
          { id: 'lessons', label: 'Lesson Plans' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              subTab === tab.id 
              ? 'text-white shadow-lg' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            style={subTab === tab.id ? { backgroundColor: COLORS.primary } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === 'planner' && <AcademicPlanner />}

      {subTab === 'classes' && (
        <div className="space-y-6 max-w-7xl mx-auto">
          <FormSection title="Class & Teacher Allocation" description="Define wings, sections and assign academic leaders.">
            <Select label="Wing" name="wing" required options={WINGS.map(w => ({value: w, label: w}))} />
            <Select label="Grade" name="grade" required options={GRADES.map(g => ({value: g, label: g}))} />
            <Select label="Section" name="section" required options={SECTIONS.map(s => ({value: s, label: s}))} />
            <Input label="Class Teacher" name="classTeacher" placeholder="Select Teacher" required />
            <div className="lg:col-span-3 border-t border-slate-100 pt-8 mt-4">
              <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Comprehensive Subject Allocation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 mt-4">
                {SUBJECTS.map((subject) => (
                  <div key={subject} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
                    <Input label={subject} name={`teacher_${subject.toLowerCase().replace(/\s+/g, '_')}`} placeholder="Assign Teacher" />
                  </div>
                ))}
              </div>
            </div>
          </FormSection>
        </div>
      )}

      {subTab === 'timetable' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase underline decoration-indigo-200 underline-offset-8 decoration-4">Institutional Schedule</h3>
            <div className="flex gap-4">
              <Select label="" name="filter_class" options={GRADES.map(g => ({value: g, label: g}))} />
              <Select label="" name="filter_section" options={SECTIONS.map(s => ({value: s, label: s}))} />
            </div>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-inner">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-5 text-xs font-black uppercase border border-slate-800 tracking-widest">Period</th>
                  <th className="p-5 text-xs font-black uppercase border border-slate-800 tracking-widest text-center">Mon</th>
                  <th className="p-5 text-xs font-black uppercase border border-slate-800 tracking-widest text-center">Tue</th>
                  <th className="p-5 text-xs font-black uppercase border border-slate-800 tracking-widest text-center">Wed</th>
                  <th className="p-5 text-xs font-black uppercase border border-slate-800 tracking-widest text-center">Thu</th>
                  <th className="p-5 text-xs font-black uppercase border border-slate-800 tracking-widest text-center">Fri</th>
                  <th className="p-5 text-xs font-black uppercase border border-slate-800 tracking-widest text-center">Sat</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 'BREAK', 5, 6, 7, 8].map((slot, i) => (
                  <tr key={i} className={slot === 'BREAK' ? 'bg-indigo-50/50' : 'group hover:bg-slate-50/30'}>
                    <td className="p-4 border border-slate-100 text-center font-black text-slate-400 text-xs">
                      {slot === 'BREAK' ? <span className="text-indigo-600 font-black">RECESS</span> : `0${slot}`}
                    </td>
                    {slot === 'BREAK' ? (
                      <td colSpan={6} className="p-3 border border-slate-100 text-center text-[10px] font-black text-indigo-400 tracking-[1.5em] uppercase italic">Transition & Sustenance Period</td>
                    ) : (
                      ['','','','','',''].map((_, j) => (
                        <td key={j} className="p-4 border border-slate-100 min-h-[90px] transition-all cursor-pointer text-center">
                          <div className="text-[11px] font-black text-slate-800 uppercase truncate">
                            {SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)]}
                          </div>
                          <div className="text-[9px] font-bold text-slate-400 mt-1">Prof. Alexander</div>
                        </td>
                      ))
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'lessons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Lesson Strategy & Planning</h2>
              <p className="text-slate-500 font-medium text-sm italic">Curating academic excellence class-by-class.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Focusing Class:</span>
              <select 
                value={selectedLessonGrade} 
                onChange={(e) => setSelectedLessonGrade(e.target.value)}
                className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black outline-none border-none shadow-lg focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {GRADES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <form onSubmit={handleSaveLesson}>
                <FormSection title={editingPlan ? "Modify Plan" : "Lesson Architect"} description={editingPlan ? "Update existing curriculum module" : "Draft new curriculum modules"}>
                  <div className="lg:col-span-3 space-y-4">
                    <Select 
                      label="Target Subject" 
                      name="subject" 
                      required
                      options={SUBJECTS.map(s => ({value: s.toLowerCase(), label: s}))} 
                    />
                    <Input 
                      label="Module / Chapter #" 
                      name="chapter_no" 
                      required
                      placeholder="e.g., CH-05" 
                      defaultValue={editingPlan?.chapterNo}
                    />
                    <Input 
                      label="Chapter Title" 
                      name="chapter_title" 
                      required
                      placeholder="Descriptive title" 
                      defaultValue={editingPlan?.chapterTitle}
                    />
                    <div className="pt-4 flex gap-3">
                      <button 
                        type="submit"
                        className="flex-1 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:brightness-110 active:scale-95" 
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        {editingPlan ? 'Update Plan' : `Deploy to ${selectedLessonGrade}`}
                      </button>
                      {editingPlan && (
                        <button 
                          type="button"
                          onClick={() => setEditingPlan(null)}
                          className="px-6 py-4 rounded-2xl bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </FormSection>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <h3 className="text-xl font-black text-slate-900">
                    Course Repository: <span className="text-indigo-600">{selectedLessonGrade}</span>
                  </h3>
                  <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">Live Updates</div>
               </div>
               
               <div className="p-8 space-y-6 overflow-y-auto max-h-[600px] flex-1">
                  {filteredPlans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-slate-300">
                      <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      <p className="font-bold">No lesson plans deployed for this class yet.</p>
                    </div>
                  ) : (
                    filteredPlans.map((plan) => (
                      <div key={plan.id} className="p-5 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-indigo-300 hover:shadow-md transition-all group bg-white">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner border border-slate-200 uppercase">
                            {plan.chapterNo}
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1 block">{plan.subject}</span>
                            <p className="font-black text-slate-800">{plan.chapterTitle}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{plan.lessonsCount} Detailed Lessons</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditPlan(plan)}
                            title="Edit Plan"
                            className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button 
                            onClick={() => handleDeletePlan(plan.id)}
                            title="Delete Plan"
                            className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
               </div>
               
               <div className="p-6 bg-slate-900 text-white mt-auto">
                 <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                    <span>Repository Utilization</span>
                    <span>{Math.min(100, (filteredPlans.length / 20) * 100).toFixed(0)}% Capacity</span>
                 </div>
                 <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${(filteredPlans.length / 20) * 100}%` }} />
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicModule;
