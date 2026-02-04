
import React, { useState, useEffect } from 'react';
import { FormSection, Input, Select, FileUpload } from './FormLayout';
import { COLORS } from '../constants';
import { AppSettings } from '../types';

interface AddPersonFormProps {
  type: 'student' | 'staff';
  settings: AppSettings;
  initialData?: any;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const GRADES = [
  'Pre-Nursery', 'Nursery', 'KG', 
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

const AddPersonForm: React.FC<AddPersonFormProps> = ({ type, settings, initialData, onCancel, onSubmit }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo || null);
  const [generatedId, setGeneratedId] = useState<string>(initialData?.id || '');
  const [selectedReligion, setSelectedReligion] = useState<string>(initialData?.religion || '');

  useEffect(() => {
    if (!initialData) {
      const getInitials = (str: string) => str.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 3);
      const sInit = getInitials(settings.schoolName || 'EDU');
      const bInit = getInitials(settings.branchName || 'BRN');
      const typeLabel = type === 'student' ? 'STU' : 'STF';
      const random = Math.random().toString(36).substr(2, 4).toUpperCase();
      setGeneratedId(`${sInit}-${bInit}-${typeLabel}-${random}`);
    }
  }, [type, settings, initialData]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    onSubmit({ ...data, photo: photoPreview });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12 max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      {/* Dynamic Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center sticky top-0 bg-slate-50/90 backdrop-blur-md py-6 z-20 border-b border-slate-200 gap-4 px-4 rounded-b-3xl">
        <div>
          <h2 className="text-3xl font-black text-slate-900 capitalize tracking-tight flex items-center gap-3">
             <div className="w-2 h-8 rounded-full bg-indigo-600"></div>
            {initialData ? `Update ${type} Profile` : `Enroll New ${type}`}
          </h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Institutional Node: {settings.schoolName}</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 md:flex-none px-8 py-3 rounded-2xl border-2 border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-slate-900 transition-all"
          >
            Discard
          </button>
          <button
            type="submit"
            className="flex-1 md:flex-none px-10 py-3 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: COLORS.primary, boxShadow: `0 15px 30px -5px ${COLORS.primary}40` }}
          >
            {initialData ? 'Sync Updates' : 'Authorize Enrollment'}
          </button>
        </div>
      </div>

      {/* CORE IDENTITY SECTION (As Requested: Photo, Name, Gender, DOB, Address) */}
      <FormSection title="Student Identity Profile" description="Primary identification and bio-metrics for the central repository.">
        <div className="col-span-1 lg:col-span-3 flex flex-col items-center justify-center p-8 border-2 border-dashed border-indigo-100 rounded-[3rem] bg-white space-y-4 group">
          <div className="relative">
            <div 
              className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-8 border-slate-50 bg-slate-50 shadow-2xl flex items-center justify-center transition-all group-hover:rotate-3 group-hover:scale-105"
              style={{ borderColor: photoPreview ? COLORS.primary : '#f8fafc' }}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-200">
                  <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
              )}
              <input type="file" name="photo_file" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Attach Official Portrait</span>
        </div>
        
        <Input label="Student Full Name" name="name" required placeholder="Full legal name" defaultValue={initialData?.name} />
        
        {type === 'student' ? (
          <>
            <Input label="Institutional ID" name="studentId" defaultValue={initialData?.studentId || generatedId} required />
            <Select label="Assigned Grade" name="grade" defaultValue={initialData?.grade} required options={GRADES.map(g => ({value: g, label: g}))} />
            <Select label="Section" name="section" defaultValue={initialData?.section} required options={SECTIONS.map(s => ({value: s, label: `Section ${s}`}))} />
          </>
        ) : (
          <>
            <Input label="Staff ID" name="staffId" defaultValue={initialData?.staffId || generatedId} required />
            <Select label="System Role" name="role" defaultValue={initialData?.role} required options={[
              { value: 'Teacher', label: 'Teacher' },
              { value: 'Principal', label: 'Principal' },
              { value: 'Accountant', label: 'Accountant' },
              { value: 'Librarian', label: 'Librarian' }
            ]} />
          </>
        )}

        <Select 
          label="Gender" 
          name="gender" 
          required 
          defaultValue={initialData?.gender}
          options={[{value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}, {value: 'Other', label: 'Other'}]} 
        />
        <Input label="Date of Birth" name="dob" type="date" required defaultValue={initialData?.dob} />
        <Select 
          label="Blood Group" 
          name="bloodGroup" 
          required 
          defaultValue={initialData?.bloodGroup}
          options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => ({value: bg, label: bg}))} 
        />

        <div className="lg:col-span-3 mt-4">
          <Input label="Residential Address" name="address" required placeholder="Permanent physical address for correspondence" defaultValue={initialData?.address} />
        </div>
      </FormSection>

      {/* PARENTAL RECORD SECTION (As Requested: Father's Name) */}
      <FormSection title="Guardian Matrix" description="Parental information and emergency contact links.">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100">
           <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-1.5 h-6 bg-indigo-400 rounded-full"></div>
                 <h4 className="text-sm font-black text-slate-900 uppercase italic">Father's Master Record</h4>
              </div>
              <Input label="Father's Full Name" name="fatherName" required defaultValue={initialData?.fatherName} />
              <Input label="Occupation" name="fatherOccupation" required defaultValue={initialData?.fatherOccupation} />
              <Input label="Contact Number" name="fatherContact" required defaultValue={initialData?.fatherContact} placeholder="10 Digit Mobile" />
              <FileUpload label="Father's ID Verification" name="fatherIdDoc" />
              <Input label="Office / Work Address" name="fatherOccupationAddress" required defaultValue={initialData?.fatherOccupationAddress} />
           </div>
           
           <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-1.5 h-6 bg-pink-400 rounded-full"></div>
                 <h4 className="text-sm font-black text-slate-900 uppercase italic">Mother's Master Record</h4>
              </div>
              <Input label="Mother's Full Name" name="motherName" required defaultValue={initialData?.motherName} />
              <Input label="Occupation" name="motherOccupation" required defaultValue={initialData?.motherOccupation} />
              <Input label="Contact Number" name="motherContact" required defaultValue={initialData?.motherContact} />
              <FileUpload label="Mother's ID Verification" name="motherIdDoc" />
              <Input label="Office / Work Address" name="motherOccupationAddress" required defaultValue={initialData?.motherOccupationAddress} />
           </div>
        </div>

        <div className="lg:col-span-3 p-8 bg-white border border-slate-200 rounded-[2.5rem] mt-4 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Demographic Indices</p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select 
                label="Religion" 
                name="religion" 
                required 
                defaultValue={initialData?.religion}
                onSelect={(val) => setSelectedReligion(val)}
                options={[
                  {value: 'Hindu', label: 'Hindu'}, {value: 'Islam', label: 'Islam'}, {value: 'Sikh', label: 'Sikh'},
                  {value: 'Christian', label: 'Christian'}, {value: 'Jain', label: 'Jain'}, {value: 'Buddhism', label: 'Buddhism'},
                  {value: 'Other', label: 'Other (Specify)'}
                ]} 
              />
              <Input label="Caste" name="caste" required placeholder="Enter caste" defaultValue={initialData?.caste} />
              <Select 
                label="Category" 
                name="category" 
                required 
                defaultValue={initialData?.category}
                options={[{value: 'General', label: 'General'}, {value: 'OBC', label: 'OBC'}, {value: 'SC', label: 'SC'}, {value: 'ST', label: 'ST'}]} 
              />
           </div>
        </div>
      </FormSection>

      <FormSection title="Authorization & Consent" description="Final legal verification by the guardian.">
        <div className="lg:col-span-3 p-10 bg-slate-900 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-10 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <div className="flex-1">
              <h4 className="text-xl font-black uppercase italic tracking-tight mb-2">Consent to Enroll</h4>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest leading-relaxed">I hereby confirm that all information provided for this student record is accurate and represents the official legal status of the resident.</p>
           </div>
           <div className="w-full md:w-auto shrink-0">
              <FileUpload label="Authorized Digital Signature" name="parentSignature" required={!initialData} />
           </div>
        </div>
      </FormSection>
    </form>
  );
};

export default AddPersonForm;
