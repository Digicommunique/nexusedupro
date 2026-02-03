
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { FormSection, Input, Select, FileUpload } from './FormLayout';
import { Examination, ExamResult, Student, AppSettings } from '../types';

interface ExaminationModuleProps {
  students: Student[];
  settings: AppSettings;
}

const GRADES = [
  'Pre-Nursery', 'Nursery', 'KG', 
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

const SUBJECTS = [
  'Mathematics', 'English', 'Hindi', 'Science', 'Social Science', 
  'Physics', 'Chemistry', 'Biology', 'Computer Science'
];

const QUALITATIVE_GRADES = ['A+', 'A', 'B', 'C', 'D', 'Needs Improvement'];

const ExaminationModule: React.FC<ExaminationModuleProps> = ({ students, settings }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'entry' | 'results'>('create');
  const [exams, setExams] = useState<Examination[]>([
    { id: 'E1', title: 'Final Examination 2025', grade: 'Class 10', section: 'A', subject: 'Mathematics', date: '2025-03-15', totalMarks: 100, isResultDeclared: false }
  ]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  
  // Results view filters
  const [resGrade, setResGrade] = useState<string>('Class 10');
  const [resSection, setResSection] = useState<string>('A');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const handleCreateExam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newExam: Examination = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      title: formData.get('title') as string,
      grade: formData.get('grade') as string,
      section: formData.get('section') as string,
      subject: formData.get('subject') as string,
      date: formData.get('date') as string,
      totalMarks: Number(formData.get('totalMarks')),
      isResultDeclared: false
    };
    setExams([...exams, newExam]);
    e.currentTarget.reset();
    alert('Exam Scheduled Successfully!');
  };

  const getGradeFromMarks = (marks: number, total: number) => {
    const percentage = (marks / total) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const updateResult = (studentId: string, examId: string, updates: Partial<ExamResult>) => {
    setResults(prev => {
      const existing = prev.find(r => r.studentId === studentId && r.examId === examId);
      if (existing) {
        return prev.map(r => (r.studentId === studentId && r.examId === examId) ? { ...r, ...updates } : r);
      } else {
        const exam = exams.find(e => e.id === examId);
        const totalMarks = exam?.totalMarks || 100;
        return [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          examId,
          studentId,
          marksObtained: updates.marksObtained || 0,
          grade: updates.marksObtained ? getGradeFromMarks(updates.marksObtained, totalMarks) : 'N/A',
          promotionStatus: 'Pending',
          isPublished: false,
          ...updates
        } as ExamResult];
      }
    });
  };

  const handleBulkPublish = () => {
    const currentClassStudents = students.filter(s => s.grade === resGrade && s.section === resSection);
    setResults(prev => prev.map(r => {
      if (currentClassStudents.find(s => s.id === r.studentId)) {
        return { ...r, isPublished: true };
      }
      return r;
    }));
    alert(`Report cards published to Parent Portal for ${resGrade} - ${resSection}`);
  };

  const selectedExam = exams.find(e => e.id === selectedExamId);
  const examStudents = useMemo(() => {
    if (!selectedExam) return [];
    return students.filter(s => s.grade === selectedExam.grade && s.section === selectedExam.section);
  }, [selectedExam, students]);

  const reportCardStudent = students.find(s => s.id === selectedStudentId);
  const studentResult = results.find(r => r.studentId === selectedStudentId);
  const allStudentResults = results.filter(r => r.studentId === selectedStudentId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Examination Control Center</h1>
          <p className="text-slate-500 font-medium">Coordinate assessments, manage promotion cycles, and publish results.</p>
        </div>
        <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {[
            { id: 'create', label: 'Setup Exams' },
            { id: 'entry', label: 'Mark Entry' },
            { id: 'results', label: 'Promotion & Reports' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
              style={activeTab === tab.id ? { backgroundColor: COLORS.primary } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleCreateExam}>
              <FormSection title="Schedule New Assessment" description="Class and subject specific exam creation.">
                <div className="lg:col-span-3 space-y-4">
                  <Input label="Exam Cycle Title" name="title" required placeholder="e.g. Unit Test 1" />
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Grade" name="grade" required options={GRADES.map(g => ({value: g, label: g}))} />
                    <Select label="Section" name="section" required options={SECTIONS.map(s => ({value: s, label: s}))} />
                  </div>
                  <Select label="Subject" name="subject" required options={SUBJECTS.map(s => ({value: s, label: s}))} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Max Marks" name="totalMarks" type="number" required placeholder="100" />
                    <Input label="Date" name="date" type="date" required />
                  </div>
                  <FileUpload label="Question Paper Upload" name="paper" />
                  <button 
                    type="submit" 
                    className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    Deploy Examination
                  </button>
                </div>
              </FormSection>
            </form>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden h-full">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Institutional Registry</h3>
              </div>
              <div className="p-8 space-y-4">
                {exams.map(exam => (
                  <div key={exam.id} className="p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between hover:border-indigo-300 transition-all bg-white shadow-sm group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <span className="text-[9px] font-black uppercase opacity-60">ID</span>
                        <span className="text-xs font-black">#{exam.id}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-black text-slate-900 uppercase tracking-tight">{exam.title}</h4>
                          <span className="px-2 py-0.5 bg-indigo-50 text-[9px] font-black text-indigo-500 rounded-md uppercase">{exam.subject}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase">
                          {exam.grade} • SEC {exam.section} • {exam.date} • {exam.totalMarks}M
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'entry' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/30 gap-6">
            <h3 className="text-xl font-black text-slate-900 uppercase">Assessment Terminal</h3>
            <select 
              className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
            >
              <option value="">Select Examination Target...</option>
              {exams.map(e => <option key={e.id} value={e.id}>{e.title} - {e.grade} {e.subject}</option>)}
            </select>
          </div>

          <div className="flex-1 overflow-x-auto p-8">
            {!selectedExam ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-200 py-32">
                <svg className="w-24 h-24 mb-6 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="font-black uppercase tracking-[0.2em] text-sm">Awaiting Cycle Selection</p>
              </div>
            ) : (
              <div className="space-y-6">
                {examStudents.map(student => {
                  const res = results.find(r => r.studentId === student.id && r.examId === selectedExam.id);
                  return (
                    <div key={student.id} className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 flex flex-col gap-8 transition-all hover:bg-white hover:shadow-xl group">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                          <img src={student.photo || `https://picsum.photos/seed/${student.id}/100`} className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white" alt="Profile" />
                          <div>
                            <h4 className="text-xl font-black text-slate-800 uppercase">{student.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Roll: 01 • ID: {student.studentId}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 max-w-2xl">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Score ({selectedExam.totalMarks})</label>
                            <input 
                              type="number" 
                              value={res?.marksObtained || ''}
                              onChange={(e) => updateResult(student.id, selectedExam.id, { marksObtained: Number(e.target.value) })}
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Eng. Comm</label>
                            <select 
                              value={res?.englishComm || ''}
                              onChange={(e) => updateResult(student.id, selectedExam.id, { englishComm: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="">Select...</option>
                              {QUALITATIVE_GRADES.map(q => <option key={q} value={q}>{q}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Hindi Comm</label>
                            <select 
                              value={res?.hindiComm || ''}
                              onChange={(e) => updateResult(student.id, selectedExam.id, { hindiComm: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="">Select...</option>
                              {QUALITATIVE_GRADES.map(q => <option key={q} value={q}>{q}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Viva Voce</label>
                            <input 
                              type="number" 
                              value={res?.viva || ''}
                              onChange={(e) => updateResult(student.id, selectedExam.id, { viva: Number(e.target.value) })}
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-emerald-600 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-slate-100 pt-6">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Sports & Physical</label>
                          <input 
                            value={res?.sports || ''}
                            onChange={(e) => updateResult(student.id, selectedExam.id, { sports: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                            placeholder="Performance summary"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Library Usage</label>
                          <input 
                            value={res?.library || ''}
                            onChange={(e) => updateResult(student.id, selectedExam.id, { library: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                            placeholder="Reading habits"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Handwriting (E/H)</label>
                          <div className="flex gap-2">
                             <input value={res?.handwritingEng || ''} onChange={(e) => updateResult(student.id, selectedExam.id, { handwritingEng: e.target.value })} className="w-1/2 px-3 py-2 bg-white border rounded-lg text-xs" placeholder="Eng" />
                             <input value={res?.handwritingHindi || ''} onChange={(e) => updateResult(student.id, selectedExam.id, { handwritingHindi: e.target.value })} className="w-1/2 px-3 py-2 bg-white border rounded-lg text-xs" placeholder="Hin" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Co-Curricular Activities</label>
                          <input 
                            value={res?.activities || ''}
                            onChange={(e) => updateResult(student.id, selectedExam.id, { activities: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                            placeholder="Activities summary"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Evaluator Remarks</label>
                        <textarea 
                          value={res?.teacherRemarks || ''}
                          onChange={(e) => updateResult(student.id, selectedExam.id, { teacherRemarks: e.target.value })}
                          className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
                          placeholder="Provide detailed qualitative feedback on student progress..."
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="p-8 bg-slate-900 flex justify-between items-center text-white">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">System Ready for Batch Verification</span>
            <button className="px-10 py-3.5 bg-indigo-500 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all">
              Broadcast Verified Results
            </button>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Credential Architect</h3>
              <div className="space-y-4">
                <Select label="Target Class" name="res_class" options={GRADES.map(g => ({value: g, label: g}))} />
                <Select label="Section" name="res_sec" options={SECTIONS.map(s => ({value: s, label: s}))} />
                
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Student</label>
                   <select 
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-black text-slate-800 cursor-pointer"
                   >
                     <option value="">Choose Student...</option>
                     {students.filter(s => s.grade === resGrade).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                   </select>
                </div>

                {selectedStudentId && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Promotion Control</p>
                     <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => updateResult(selectedStudentId, selectedExamId || exams[0].id, { promotionStatus: 'Promoted' })}
                          className={`py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${studentResult?.promotionStatus === 'Promoted' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg' : 'bg-white text-slate-400 border-slate-200'}`}
                        >
                          Promote
                        </button>
                        <button 
                          onClick={() => updateResult(selectedStudentId, selectedExamId || exams[0].id, { promotionStatus: 'Detained' })}
                          className={`py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${studentResult?.promotionStatus === 'Detained' ? 'bg-rose-500 text-white border-rose-500 shadow-lg' : 'bg-white text-slate-400 border-slate-200'}`}
                        >
                          Detain
                        </button>
                     </div>
                     <button 
                        onClick={() => updateResult(selectedStudentId, selectedExamId || exams[0].id, { isPublished: !studentResult?.isPublished })}
                        className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${studentResult?.isPublished ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-700 border-slate-200'}`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        {studentResult?.isPublished ? 'Live in Parent Portal' : 'Publish to Parent Portal'}
                      </button>
                  </div>
                )}

                <div className="pt-6 space-y-3">
                  <button onClick={() => window.print()} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Print Physical Copy
                  </button>
                  <button onClick={handleBulkPublish} className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Publish Batch Results
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-8 xl:col-span-9">
            {!reportCardStudent ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-slate-300 border-4 border-dashed border-slate-200 rounded-[2.5rem] bg-white/50">
                <p className="font-black uppercase tracking-widest text-sm">Select student to generate formal report</p>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden p-16 flex flex-col items-center print:shadow-none print:border-none print:p-0 print:w-full">
                <div className="w-full max-w-[800px] border-[12px] border-slate-900 p-12 flex flex-col relative bg-white min-h-[1100px]">
                  {/* Status Badges for Admin View */}
                  <div className="absolute top-4 right-4 flex gap-2 print:hidden">
                    {studentResult?.isPublished && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase rounded-full border border-emerald-200 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live in Parent Portal
                      </span>
                    )}
                    {studentResult?.promotionStatus && studentResult.promotionStatus !== 'Pending' && (
                      <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full border ${studentResult.promotionStatus === 'Promoted' ? 'bg-indigo-100 text-indigo-600 border-indigo-200' : 'bg-rose-100 text-rose-600 border-rose-200'}`}>
                        {studentResult.promotionStatus}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-start border-b-[6px] border-slate-900 pb-10 mb-10">
                     <div className="text-left">
                       <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{settings.schoolName}</h1>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">{settings.branchName}</p>
                     </div>
                     <div className="text-right">
                        <div className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg inline-block mb-2">Institutional Record</div>
                        <h2 className="text-xl font-serif italic font-black text-slate-800">Holistic Report Card</h2>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assessment Cycle: 2025-26</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-12 gap-8 mb-12">
                     <div className="col-span-3">
                        <img src={reportCardStudent.photo || `https://picsum.photos/seed/${reportCardStudent.id}/200`} className="w-full aspect-square object-cover rounded-2xl border-4 border-slate-50 shadow-md" alt="Profile" />
                     </div>
                     <div className="col-span-9 flex flex-col justify-center space-y-4">
                        <div className="grid grid-cols-2 gap-y-4">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Full Legal Name</p>
                              <p className="text-2xl font-black text-slate-900 uppercase leading-none">{reportCardStudent.name}</p>
                           </div>
                           <div className="space-y-1 text-right">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Enrolment ID</p>
                              <p className="text-lg font-black text-indigo-600">#{reportCardStudent.studentId}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Class / Section</p>
                              <p className="text-sm font-bold text-slate-700 uppercase">{reportCardStudent.grade} - SEC {reportCardStudent.section}</p>
                           </div>
                           <div className="space-y-1 text-right">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Final Status</p>
                              <p className={`text-sm font-black uppercase ${studentResult?.promotionStatus === 'Promoted' ? 'text-emerald-600' : studentResult?.promotionStatus === 'Detained' ? 'text-rose-600' : 'text-slate-400'}`}>
                                {studentResult?.promotionStatus || 'Processing...'}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="mb-12">
                     <h3 className="text-[11px] font-black bg-slate-900 text-white px-4 py-1.5 inline-block mb-4 uppercase tracking-[0.2em]">Part 1: Scholastic Performance</h3>
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-slate-50 border-b-2 border-slate-900">
                              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">Subject / Discipline</th>
                              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase text-center">MM</th>
                              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase text-center">Obtained</th>
                              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase text-center">Grade</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {SUBJECTS.map(sub => {
                             const er = allStudentResults.find(r => exams.find(e => e.id === r.examId)?.subject === sub);
                             return (
                               <tr key={sub} className="text-xs font-bold text-slate-700">
                                  <td className="px-4 py-4 uppercase tracking-tighter">{sub}</td>
                                  <td className="px-4 py-4 text-center">100</td>
                                  <td className="px-4 py-4 text-center font-black text-slate-900">{er?.marksObtained || '00'}</td>
                                  <td className="px-4 py-4 text-center">
                                     <span className="px-2 py-1 bg-slate-100 rounded text-slate-900 font-black">{er?.grade || 'N/A'}</span>
                                  </td>
                               </tr>
                             );
                           })}
                        </tbody>
                     </table>
                  </div>

                  <div className="mb-12">
                     <h3 className="text-[11px] font-black bg-slate-900 text-white px-4 py-1.5 inline-block mb-4 uppercase tracking-[0.2em]">Part 2: Co-Scholastic & Qualitative Traits</h3>
                     <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        {[
                           { label: 'English Communication', value: studentResult?.englishComm || 'A' },
                           { label: 'Hindi Communication', value: studentResult?.hindiComm || 'B+' },
                           { label: 'Sports & Games', value: studentResult?.sports || 'Excellent' },
                           { label: 'Library Utilization', value: studentResult?.library || 'Frequent' },
                           { label: 'Handwriting (English)', value: studentResult?.handwritingEng || 'Clean' },
                           { label: 'Handwriting (Hindi)', value: studentResult?.handwritingHindi || 'Good' },
                           { label: 'Viva-Voce Skills', value: studentResult?.viva ? `${studentResult.viva}/10` : '8/10' },
                           { label: 'Activities & Participation', value: studentResult?.activities || 'Lead Role' },
                        ].map((item, i) => (
                           <div key={i} className="flex justify-between items-end border-b border-slate-100 pb-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.label}</span>
                              <span className="text-xs font-bold text-slate-800 uppercase italic">{item.value}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="mt-auto space-y-12">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-50 border-l-4 border-indigo-600 rounded-r-2xl">
                           <p className="text-[10px] font-black text-indigo-600 uppercase mb-2">Institutional Observations</p>
                           <p className="text-sm font-serif italic text-slate-700 leading-relaxed">
                             {studentResult?.teacherRemarks || "The student has exhibited consistent growth in both academic and personal domains. Their proactive engagement in institutional activities is commendable."}
                           </p>
                        </div>
                        <div className={`p-6 border-l-4 rounded-r-2xl flex flex-col justify-center ${studentResult?.promotionStatus === 'Promoted' ? 'bg-emerald-50 border-emerald-500' : studentResult?.promotionStatus === 'Detained' ? 'bg-rose-50 border-rose-500' : 'bg-slate-50 border-slate-400'}`}>
                           <p className={`text-[10px] font-black uppercase mb-1 ${studentResult?.promotionStatus === 'Promoted' ? 'text-emerald-600' : studentResult?.promotionStatus === 'Detained' ? 'text-rose-600' : 'text-slate-400'}`}>Formal Promotion Decision</p>
                           <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                             {studentResult?.promotionStatus === 'Promoted' ? `Promoted to ${GRADES[GRADES.indexOf(reportCardStudent.grade) + 1] || 'Next Class'}` : 
                              studentResult?.promotionStatus === 'Detained' ? `Detained in ${reportCardStudent.grade}` : 'Decision Pending'}
                           </h3>
                        </div>
                     </div>

                     <div className="flex justify-between items-end px-12 pt-12 pb-4">
                        <div className="flex flex-col items-center">
                           <div className="w-40 h-[1.5px] bg-slate-300 mb-2" />
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Class Teacher</span>
                        </div>
                        <div className="flex flex-col items-center">
                           <div className="w-40 h-[1.5px] bg-slate-300 mb-2" />
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Guardian Signature</span>
                        </div>
                        <div className="flex flex-col items-center">
                           <div className="w-40 h-[1.5px] bg-slate-300 mb-2" />
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Institutional Head</span>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExaminationModule;
