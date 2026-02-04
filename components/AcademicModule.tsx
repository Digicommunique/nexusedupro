
import React, { useState, useMemo, useEffect } from 'react';
import AcademicPlanner from './AcademicPlanner';
import { COLORS } from '../constants';
import { FormSection, Input, Select } from './FormLayout';
import { LessonPlan, Staff } from '../types';

interface AcademicModuleProps {
  staff: Staff[];
}

interface ClassAssignment {
  grade: string;
  section: string;
  classTeacherId: string;
  subjectTeachers: Record<string, string>;
}

interface TimetableCell {
  subject: string;
  teacherId: string;
}

const AcademicModule: React.FC<AcademicModuleProps> = ({ staff }) => {
  const [subTab, setSubTab] = useState<'planner' | 'classes' | 'timetable' | 'lessons'>('planner');
  
  // Selection Filters
  const [selectedGrade, setSelectedGrade] = useState<string>('Class 10');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedSubjectForLessons, setSelectedSubjectForLessons] = useState<string>('Mathematics');

  // Persistence States
  const [classConfigs, setClassConfigs] = useState<ClassAssignment[]>([]);
  const [timeTables, setTimeTables] = useState<Record<string, Record<number, Record<number, TimetableCell>>>>({});
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([
    { id: 'LP1', grade: 'Class 10', subject: 'Mathematics', chapterNo: '01', chapterTitle: 'Real Numbers', lessonsCount: 5 },
    { id: 'LP2', grade: 'Class 10', subject: 'Mathematics', chapterNo: '02', chapterTitle: 'Polynomials', lessonsCount: 8 }
  ]);
  
  // UI Interaction States
  const [isEditingClass, setIsEditingClass] = useState(false);
  const [editCell, setEditCell] = useState<{ day: number, period: number } | null>(null);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

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

  const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

  // Logic: Fetch existing configuration for selected Grade/Section
  const currentClassConfig = useMemo(() => {
    return classConfigs.find(c => c.grade === selectedGrade && c.section === selectedSection);
  }, [classConfigs, selectedGrade, selectedSection]);

  const currentTimeTable = useMemo(() => {
    const key = `${selectedGrade}-${selectedSection}`;
    return timeTables[key] || {};
  }, [timeTables, selectedGrade, selectedSection]);

  const filteredLessons = useMemo(() => {
    return lessonPlans.filter(lp => lp.grade === selectedGrade && lp.subject === selectedSubjectForLessons);
  }, [lessonPlans, selectedGrade, selectedSubjectForLessons]);

  const handleSaveClassConfig = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const subjectTeachers: Record<string, string> = {};
    SUBJECTS.forEach(sub => {
      const fieldName = `teacher_${sub.toLowerCase().replace(/\s+/g, '_')}`;
      const teacherId = formData.get(fieldName) as string;
      if (teacherId) subjectTeachers[sub] = teacherId;
    });

    const newConfig: ClassAssignment = {
      grade: selectedGrade,
      section: selectedSection,
      classTeacherId: formData.get('classTeacherId') as string,
      subjectTeachers
    };

    setClassConfigs(prev => {
      const filtered = prev.filter(c => !(c.grade === selectedGrade && c.section === selectedSection));
      return [...filtered, newConfig];
    });
    
    setIsEditingClass(false);
    alert(`Configuration for ${selectedGrade} ${selectedSection} Saved!`);
  };

  const handleSaveTimetableCell = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editCell) return;
    const formData = new FormData(e.currentTarget);
    const key = `${selectedGrade}-${selectedSection}`;
    
    const newCell: TimetableCell = {
      subject: formData.get('cell_subject') as string,
      teacherId: formData.get('cell_teacher') as string
    };

    setTimeTables(prev => {
      const classTable = { ...(prev[key] || {}) };
      const dayRow = { ...(classTable[editCell.day] || {}) };
      dayRow[editCell.period] = newCell;
      classTable[editCell.day] = dayRow;
      return { ...prev, [key]: classTable };
    });

    setEditCell(null);
  };

  const handleSaveLesson = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      chapterNo: formData.get('chapterNo') as string,
      chapterTitle: formData.get('chapterTitle') as string,
      lessonsCount: Number(formData.get('lessonsCount')),
      grade: selectedGrade,
      subject: selectedSubjectForLessons
    };

    if (editingChapterId) {
      setLessonPlans(prev => prev.map(lp => lp.id === editingChapterId ? { ...lp, ...data } : lp));
      setEditingChapterId(null);
    } else {
      setLessonPlans(prev => [...prev, { id: `LP-${Date.now()}`, ...data }]);
    }
    e.currentTarget.reset();
  };

  const handleDeleteChapter = (id: string) => {
    if (confirm("Permanently delete this chapter from the repository?")) {
      setLessonPlans(prev => prev.filter(lp => lp.id !== id));
    }
  };

  const staffOptions = staff.map(s => ({ value: s.id, label: s.name }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-white rounded-2xl border border-slate-200 w-fit">
        {[
          { id: 'planner', label: 'Academic Planner' },
          { id: 'classes', label: 'Class Management' },
          { id: 'timetable', label: 'Time Table' },
          { id: 'lessons', label: 'Curriculum Repository' },
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

      {/* Persistence Controls for Institutional Matrix */}
      {(subTab !== 'planner') && (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6 sticky top-4 z-40 backdrop-blur-md bg-white/95">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Selector</p>
                 <h3 className="text-sm font-black text-slate-900 uppercase">Academic Matrix</h3>
              </div>
           </div>
           
           <div className="flex-1 flex gap-4">
              <div className="flex-1">
                 <Select label="" name="nav_grade" defaultValue={selectedGrade} onSelect={setSelectedGrade} options={GRADES.map(g => ({value: g, label: g}))} />
              </div>
              {subTab !== 'lessons' && (
                <div className="flex-1">
                   <Select label="" name="nav_section" defaultValue={selectedSection} onSelect={setSelectedSection} options={SECTIONS.map(s => ({value: s, label: `Section ${s}`}))} />
                </div>
              )}
           </div>

           <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${subTab === 'lessons' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : currentClassConfig ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                 {subTab === 'lessons' ? `${selectedGrade} Repository` : currentClassConfig ? 'Mapping Active' : 'No Mapping Found'}
              </div>
           </div>
        </div>
      )}

      {subTab === 'planner' && <AcademicPlanner />}

      {subTab === 'classes' && (
        <div className="space-y-6 max-w-7xl mx-auto animate-in slide-in-from-bottom-4">
          <form onSubmit={handleSaveClassConfig}>
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Institutional Mapping</h2>
               <div className="flex gap-4">
                  {!isEditingClass && currentClassConfig ? (
                    <button type="button" onClick={() => setIsEditingClass(true)} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all">Modify Mapping</button>
                  ) : (
                    <button type="submit" className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all">Save Institutional Mapping</button>
                  )}
               </div>
            </div>

            <div className={`space-y-8 ${(!isEditingClass && currentClassConfig) ? 'pointer-events-none opacity-80 grayscale-[0.5]' : ''}`}>
              <FormSection title="Leadership Assignment" description={`Authorized staff for ${selectedGrade} ${selectedSection}`}>
                <div className="lg:col-span-3">
                  <Select 
                    label="Assigned Class Teacher" 
                    name="classTeacherId" 
                    required 
                    defaultValue={currentClassConfig?.classTeacherId}
                    options={staffOptions} 
                  />
                </div>
              </FormSection>

              <FormSection title="Curriculum Allocation" description="Assign faculty leaders to specific subject curricula.">
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {SUBJECTS.map((subject) => (
                    <div key={subject} className="bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group">
                      <Select 
                        label={subject} 
                        name={`teacher_${subject.toLowerCase().replace(/\s+/g, '_')}`} 
                        defaultValue={currentClassConfig?.subjectTeachers[subject]}
                        options={staffOptions} 
                      />
                    </div>
                  ))}
                </div>
              </FormSection>
            </div>
          </form>
        </div>
      )}

      {subTab === 'timetable' && (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase underline decoration-indigo-200 underline-offset-8 decoration-8 mb-2">Academic Schedule Blueprint</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session 2025-26 • {selectedGrade} Section {selectedSection}</p>
            </div>
            <button 
              onClick={() => alert(`Timetable for ${selectedGrade} ${selectedSection} committed to master ledger.`)}
              className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              Commit Master Schedule
            </button>
          </div>

          <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-inner">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-6 text-xs font-black uppercase border border-slate-800 tracking-widest text-center">Period</th>
                  {DAYS.map(day => (
                    <th key={day} className="p-6 text-xs font-black uppercase border border-slate-800 tracking-widest text-center">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((pNum, pIdx) => (
                  <tr key={pNum} className="group hover:bg-slate-50/50 transition-all">
                    <td className="p-6 border border-slate-100 text-center font-black text-slate-300 text-xs italic">
                       {pIdx === 4 ? <span className="text-indigo-600">BREAK</span> : `0${pNum}`}
                    </td>
                    {pIdx === 4 ? (
                       <td colSpan={6} className="p-4 border border-slate-100 text-center text-[10px] font-black text-indigo-200 tracking-[1.5em] uppercase italic bg-indigo-50/30">Transition & Sustenance</td>
                    ) : (
                      DAYS.map((_, dIdx) => {
                        const cell = currentTimeTable[dIdx]?.[pNum];
                        const teacher = staff.find(s => s.id === cell?.teacherId);
                        return (
                          <td 
                            key={dIdx} 
                            onClick={() => setEditCell({ day: dIdx, period: pNum })}
                            className="p-6 border border-slate-100 min-h-[100px] transition-all cursor-pointer text-center relative hover:bg-white hover:shadow-xl hover:z-10 group/cell"
                          >
                             {cell ? (
                               <div className="space-y-1">
                                  <div className="text-[11px] font-black text-slate-800 uppercase tracking-tight italic group-hover/cell:text-indigo-600">{cell.subject}</div>
                                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{teacher?.name || 'TBA'}</div>
                               </div>
                             ) : (
                               <div className="opacity-0 group-hover/cell:opacity-100 transition-opacity">
                                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Assign Period</span>
                               </div>
                             )}
                             <div className="absolute top-2 right-2 opacity-0 group-hover/cell:opacity-100">
                                <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                             </div>
                          </td>
                        );
                      })
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4">
           {/* Subject Sidebar */}
           <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Subject Filter</h3>
                 <div className="space-y-1 overflow-y-auto max-h-[500px] custom-scrollbar pr-2">
                    {SUBJECTS.map(sub => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubjectForLessons(sub)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all border ${
                          selectedSubjectForLessons === sub 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                          : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'
                        }`}
                      >
                         <div className="text-xs font-black uppercase tracking-tight">{sub}</div>
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           {/* Chapter Management */}
           <div className="lg:col-span-9 space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                 <div className="xl:col-span-4">
                    <form onSubmit={handleSaveLesson}>
                       <FormSection 
                         title={editingChapterId ? "Update Chapter" : "Enroll Chapter"} 
                         description={`Managing ${selectedSubjectForLessons} - ${selectedGrade}`}
                       >
                          <div className="lg:col-span-3 space-y-4">
                             <div className="grid grid-cols-2 gap-4">
                                <Input label="Chapter #" name="chapterNo" required placeholder="01" defaultValue={lessonPlans.find(lp=>lp.id === editingChapterId)?.chapterNo} />
                                <Input label="Lesson Count" name="lessonsCount" type="number" required placeholder="5" defaultValue={lessonPlans.find(lp=>lp.id === editingChapterId)?.lessonsCount} />
                             </div>
                             <Input label="Chapter Title" name="chapterTitle" required placeholder="Calculus Basics" defaultValue={lessonPlans.find(lp=>lp.id === editingChapterId)?.chapterTitle} />
                             
                             <div className="flex gap-2">
                                <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all">
                                   {editingChapterId ? 'Apply Update' : 'Index Chapter'}
                                </button>
                                {editingChapterId && (
                                  <button type="button" onClick={() => setEditingChapterId(null)} className="px-6 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
                                )}
                             </div>
                          </div>
                       </FormSection>
                    </form>
                 </div>

                 <div className="xl:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
                       <div>
                          <h3 className="text-xl font-black uppercase tracking-tight italic">{selectedSubjectForLessons} Roadmap</h3>
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Academic Session 2025-26</p>
                       </div>
                       <span className="px-3 py-1 bg-white/10 text-white rounded-full text-[9px] font-black uppercase tracking-widest">{filteredLessons.length} Chapters Indexed</span>
                    </div>
                    
                    <div className="p-4 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
                       {filteredLessons.length === 0 ? (
                         <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                            <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            <p className="text-sm font-black uppercase tracking-[0.4em]">Empty Curriculum Repository</p>
                         </div>
                       ) : (
                         <div className="space-y-4 p-4">
                            {filteredLessons.sort((a,b) => a.chapterNo.localeCompare(b.chapterNo)).map(lp => (
                              <div key={lp.id} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:border-indigo-200 transition-all flex items-center justify-between group">
                                 <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                       <span className="text-[8px] font-black uppercase opacity-60">CH</span>
                                       <span className="text-xl font-black italic">{lp.chapterNo}</span>
                                    </div>
                                    <div>
                                       <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-1">{lp.chapterTitle}</h4>
                                       <div className="flex items-center gap-3">
                                          <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{lp.lessonsCount} Modules</span>
                                          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                          <span className="text-[9px] font-bold text-slate-400 uppercase italic">Institutional Core</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => setEditingChapterId(lp.id)}
                                      className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white shadow-sm transition-all"
                                    >
                                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteChapter(lp.id)}
                                      className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white shadow-sm transition-all"
                                    >
                                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                 </div>
                              </div>
                            ))}
                         </div>
                       )}
                    </div>

                    <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Data validated by Educational Directorate</p>
                       <button className="px-8 py-3 bg-white text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl border border-slate-200 hover:scale-105 transition-all">Download Subject Syllabus</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Cell Editor Modal for Timetable */}
      {editCell && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-12 animate-in zoom-in-95 duration-300">
              <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight mb-2 underline decoration-indigo-500 underline-offset-8">Configure Period</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Assigning for {DAYS[editCell.day]} • Period 0{editCell.period}</p>
              
              <form onSubmit={handleSaveTimetableCell} className="space-y-6">
                 <Select label="Course / Subject" name="cell_subject" required defaultValue={currentTimeTable[editCell.day]?.[editCell.period]?.subject} options={SUBJECTS.map(s=>({value:s, label:s}))} />
                 <Select label="Assigned Faculty" name="cell_teacher" required defaultValue={currentTimeTable[editCell.day]?.[editCell.period]?.teacherId} options={staffOptions} />
                 
                 <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setEditCell(null)} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Discard</button>
                    <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Update Cell</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AcademicModule;
