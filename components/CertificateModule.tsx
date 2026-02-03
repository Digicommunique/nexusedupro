
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';
import { AppSettings, Student, Staff } from '../types';

interface CertificateModuleProps {
  settings: AppSettings;
  students: Student[];
  staff: Staff[];
}

type DocType = 'id_student' | 'id_staff' | 'exam' | 'merit' | 'sports' | 'transfer' | 'pass' | 'library' | 'lab';

const GRADES = [
  'Pre-Nursery', 'Nursery', 'KG', 
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

const CertificateModule: React.FC<CertificateModuleProps> = ({ settings, students, staff }) => {
  const [selectedDoc, setSelectedDoc] = useState<DocType>('id_student');
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  
  // Filters for student selection
  const [filterGrade, setFilterGrade] = useState<string>('');
  const [filterSection, setFilterSection] = useState<string>('');

  const documents: { id: DocType; label: string; category: string }[] = [
    { id: 'id_student', label: 'Student ID Card', category: 'Identification' },
    { id: 'id_staff', label: 'Staff ID Card', category: 'Identification' },
    { id: 'library', label: 'Library Card', category: 'Identification' },
    { id: 'lab', label: 'Laboratory Card', category: 'Identification' },
    { id: 'exam', label: 'Examination Admit', category: 'Academic' },
    { id: 'merit', label: 'Merit Certificate', category: 'Recognition' },
    { id: 'sports', label: 'Sports Excellence', category: 'Recognition' },
    { id: 'transfer', label: 'Transfer Certificate', category: 'Legal' },
    { id: 'pass', label: 'Pass Certificate', category: 'Academic' },
  ];

  const filteredItems = useMemo(() => {
    if (selectedDoc === 'id_staff') {
      return staff;
    }
    return students.filter(s => {
      const matchGrade = !filterGrade || s.grade === filterGrade;
      const matchSection = !filterSection || s.section === filterSection;
      return matchGrade && matchSection;
    });
  }, [selectedDoc, staff, students, filterGrade, filterSection]);

  const person = selectedDoc === 'id_staff' 
    ? staff.find(s => s.id === selectedPersonId) 
    : students.find(s => s.id === selectedPersonId);

  const handlePrint = () => {
    window.print();
  };

  const renderPreview = () => {
    if (!person) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-slate-300 border-4 border-dashed border-slate-200 rounded-[2.5rem] bg-white/50 backdrop-blur-sm">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Ready to Generate</h3>
          <p className="font-bold text-center text-slate-400 max-w-xs">Select a profile from the sidebar to visualize the official institutional document.</p>
        </div>
      );
    }

    const isIDCard = selectedDoc === 'id_student' || selectedDoc === 'id_staff' || selectedDoc === 'library' || selectedDoc === 'lab';

    return (
      <div className="flex flex-col items-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="relative group">
          <div className="absolute -top-16 left-0 right-0 flex justify-center gap-4 opacity-100 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handlePrint}
              className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Print Document
            </button>
            <button className="px-6 py-3.5 bg-white text-slate-700 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl border border-slate-100 hover:bg-slate-50 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download PDF
            </button>
          </div>

          {isIDCard ? (
            <div className="w-[350px] h-[550px] bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100 flex flex-col relative print:shadow-none print:border-slate-300">
               <div className="h-52 relative flex flex-col items-center pt-10 px-6 text-white overflow-hidden" style={{ backgroundColor: selectedDoc === 'library' ? COLORS.accent : selectedDoc === 'lab' ? COLORS.success : COLORS.primary }}>
                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                   <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2z"/></svg>
                 </div>
                 <h4 className="text-sm font-black uppercase tracking-[0.15em] text-center mb-1">{settings.schoolName}</h4>
                 <p className="text-[9px] font-black opacity-60 uppercase tracking-widest">{settings.branchName}</p>
                 <div className="mt-6 px-5 py-2 bg-black/20 rounded-full text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-md border border-white/10">
                   {selectedDoc.replace('_', ' ')}
                 </div>
               </div>

               <div className="flex-1 flex flex-col items-center -mt-24 px-8 relative z-10">
                 <div className="w-36 h-36 rounded-[2.5rem] bg-white p-2 shadow-2xl border border-slate-50 overflow-hidden ring-4 ring-white">
                   <img src={person.photo || `https://picsum.photos/seed/${person.id}/300`} className="w-full h-full object-cover rounded-[2rem]" alt="Profile" />
                 </div>
                 
                 <div className="mt-8 text-center space-y-1">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{person.name}</h3>
                   <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                    {isStaff(person) ? person.role : `${(person as Student).grade} - ${(person as Student).section}`}
                   </p>
                 </div>

                 <div className="mt-10 w-full grid grid-cols-2 gap-y-6 gap-x-4 border-t border-slate-50 pt-8">
                   <div className="space-y-1">
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.15em]">Official ID</p>
                     <p className="text-sm font-bold text-slate-800">{isStaff(person) ? person.staffId : (person as Student).studentId}</p>
                   </div>
                   <div className="space-y-1 text-right">
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.15em]">Blood Gr.</p>
                     <p className="text-sm font-bold text-slate-800">{person.bloodGroup}</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.15em]">Emergency #</p>
                     <p className="text-sm font-bold text-slate-800 truncate">{person.guardianContact || person.fatherContact}</p>
                   </div>
                   <div className="space-y-1 text-right">
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.15em]">Validity</p>
                     <p className="text-sm font-bold text-slate-800">2026-2027</p>
                   </div>
                 </div>

                 <div className="mt-auto mb-12 flex flex-col items-center">
                    <div className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center px-4 overflow-hidden opacity-30 grayscale mb-4">
                       <div className="flex gap-0.5">
                         {[...Array(40)].map((_, i) => <div key={i} className="w-1 bg-black" style={{ height: `${Math.random() * 20 + 5}px` }} />)}
                       </div>
                    </div>
                    <div className="w-12 h-1 bg-slate-100 rounded-full" />
                 </div>
               </div>
            </div>
          ) : (
            <div className="w-[840px] h-[594px] bg-white shadow-[0_60px_120px_-30px_rgba(0,0,0,0.2)] border-[24px] border-double border-slate-900 p-16 flex flex-col items-center text-center relative overflow-hidden bg-[radial-gradient(circle_at_center,_#fff_0%,_#f8fafc_100%)] print:shadow-none print:border-slate-800">
               <div className="absolute top-6 left-6 w-24 h-24 border-t-8 border-l-8 border-slate-900 opacity-10" />
               <div className="absolute top-6 right-6 w-24 h-24 border-t-8 border-r-8 border-slate-900 opacity-10" />
               <div className="absolute bottom-6 left-6 w-24 h-24 border-b-8 border-l-8 border-slate-900 opacity-10" />
               <div className="absolute bottom-6 right-6 w-24 h-24 border-b-8 border-r-8 border-slate-900 opacity-10" />

               <div className="w-28 h-28 rounded-full border-4 border-slate-900 flex items-center justify-center mb-10 bg-white shadow-xl relative z-10">
                  <div className="w-20 h-20 rounded-full border-2 border-slate-900 flex items-center justify-center font-black text-3xl text-slate-900">E</div>
               </div>

               <h4 className="text-xl font-black tracking-[0.5em] text-slate-400 uppercase mb-3 relative z-10">{settings.schoolName}</h4>
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-14 relative z-10">{settings.branchName}</p>

               <h1 className="text-6xl font-serif italic font-black text-slate-900 mb-10 tracking-tight relative z-10">
                 {selectedDoc === 'exam' ? 'EXAMINATION ADMIT' : 
                  selectedDoc === 'merit' ? 'CERTIFICATE OF MERIT' : 
                  selectedDoc === 'sports' ? 'SPORTS EXCELLENCE' : 
                  selectedDoc === 'transfer' ? 'TRANSFER CERTIFICATE' : 'PASS CERTIFICATE'}
               </h1>

               <div className="space-y-8 max-w-2xl relative z-10">
                 <p className="text-xl font-medium text-slate-400 italic font-serif">This is to officially certify that</p>
                 <h2 className="text-5xl font-black text-slate-900 border-b-4 border-slate-900/5 pb-4 px-16 inline-block uppercase tracking-wide decoration-indigo-500 underline underline-offset-8">
                   {person.name}
                 </h2>
                 <p className="text-lg font-medium text-slate-500 leading-relaxed px-12">
                   {selectedDoc === 'merit' || selectedDoc === 'sports' 
                     ? `has demonstrated exceptional dedication and achieved a superior level of excellence in their academic and extra-curricular endeavors during the 2025-26 academic session.` 
                     : `registered under System ID #${person.id} in ${!isStaff(person) ? `${person.grade} Section ${person.section}` : person.role}, has successfully fulfilled the criteria for this official document.`}
                 </p>
               </div>

               <div className="mt-auto w-full flex justify-between px-24 pb-4 relative z-10">
                  <div className="flex flex-col items-center">
                     <div className="w-40 h-[2px] bg-slate-200 mb-3" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Date of Validation</span>
                     <span className="text-sm font-bold text-slate-800 mt-1">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="w-40 h-[2px] bg-slate-200 mb-3" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Registrar Signature</span>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4 xl:col-span-3 space-y-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Document Template</h3>
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          </div>
          <div className="space-y-2">
            {documents.map(doc => (
              <button
                key={doc.id}
                onClick={() => {
                  setSelectedDoc(doc.id);
                  setSelectedPersonId('');
                }}
                className={`w-full text-left px-4 py-3 rounded-2xl transition-all border ${
                  selectedDoc === doc.id 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                  : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="text-[8px] font-black opacity-50 mb-0.5 uppercase tracking-widest">{doc.category}</div>
                <div className="text-sm font-black">{doc.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Target Selection</h3>
            <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          
          {selectedDoc !== 'id_staff' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Grade</label>
                <select 
                  value={filterGrade}
                  onChange={(e) => {
                    setFilterGrade(e.target.value);
                    setSelectedPersonId('');
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">All Grades</option>
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Section</label>
                <select 
                  value={filterSection}
                  onChange={(e) => {
                    setFilterSection(e.target.value);
                    setSelectedPersonId('');
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">All</option>
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Select {selectedDoc === 'id_staff' ? 'Staff' : 'Student'}
            </label>
            <select 
              value={selectedPersonId}
              onChange={(e) => setSelectedPersonId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-black text-slate-800 cursor-pointer transition-all"
            >
              <option value="">Select individual profile...</option>
              {filteredItems.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({isStaff(p) ? p.staffId : p.studentId})</option>
              ))}
            </select>
            {filteredItems.length === 0 && (
              <p className="text-[10px] text-rose-500 font-bold ml-1">No matching individuals found.</p>
            )}
          </div>
          
          <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">The document will be auto-populated with data from our official institutional repository.</p>
        </div>
      </div>

      <div className="lg:col-span-8 xl:col-span-9">
        {renderPreview()}
      </div>
    </div>
  );
};

function isStaff(p: any): p is Staff {
  return (p as Staff).staffId !== undefined;
}

export default CertificateModule;
