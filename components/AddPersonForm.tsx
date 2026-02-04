
import React, { useState, useEffect } from 'react';
import { FormSection, Input, Select } from './FormLayout';
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
  const [fatherIdPreview, setFatherIdPreview] = useState<string | null>(initialData?.fatherIdDoc || null);
  const [motherIdPreview, setMotherIdPreview] = useState<string | null>(initialData?.motherIdDoc || null);
  const [parentSignPreview, setParentSignPreview] = useState<string | null>(initialData?.parentSignature || null);
  const [generatedId, setGeneratedId] = useState<string>(initialData?.studentId || initialData?.staffId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const compressImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
      };
    });
  };

  const handleFileChange = async (file: File | undefined, setter: (val: string) => void) => {
    if (file) {
      const compressed = await compressImage(file, 600, 600);
      setter(compressed);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data: any = {};
      
      formData.forEach((value, key) => {
        if (!(value instanceof File)) {
          data[key] = value;
        }
      });
      
      // Explicit Mapping for Cloud Integrity
      if (type === 'student') data.studentId = formData.get('studentId') || generatedId;
      else data.staffId = formData.get('staffId') || generatedId;

      const payload = { 
        ...data, 
        photo: photoPreview,
        fatherIdDoc: fatherIdPreview,
        motherIdDoc: motherIdPreview,
        parentSignature: parentSignPreview,
        id: initialData?.id
      };
      
      await onSubmit(payload);
    } catch (err) {
      console.error("Critical Form Logic Failure:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20 max-w-6xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center sticky top-0 bg-slate-50/90 backdrop-blur-md py-6 z-[60] border-b border-slate-200 gap-4 px-4 rounded-b-3xl shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 capitalize tracking-tight flex items-center gap-3">
             <div className="w-2.5 h-10 rounded-full bg-indigo-600"></div>
            {initialData ? `Update ${type} Profile` : `Enroll New ${type}`}
          </h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1 ml-1">Institutional Node: {settings.schoolName}</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="flex-1 md:flex-none px-10 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-slate-900 transition-all disabled:opacity-50">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 md:flex-none px-12 py-3.5 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            style={{ backgroundColor: COLORS.primary, boxShadow: `0 20px 40px -10px ${COLORS.primary}60` }}
          >
            {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (initialData ? 'Apply Updates' : 'Authorize Enrollment')}
          </button>
        </div>
      </div>

      <FormSection title="Identity Matrix" description="Centralized biometric and registrar identification.">
        <div className="col-span-1 lg:col-span-3 flex flex-col items-center justify-center p-12 border-4 border-dashed border-indigo-100 rounded-[4rem] bg-white space-y-6 group mb-10 shadow-inner">
          <div className="relative">
            <div className="w-48 h-48 rounded-[3.5rem] overflow-hidden border-8 border-slate-50 bg-slate-50 shadow-2xl flex items-center justify-center transition-all group-hover:scale-105 group-hover:rotate-2" style={{ borderColor: photoPreview ? COLORS.primary : '#f8fafc' }}>
              {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : <div className="text-slate-100 text-center"><svg className="w-24 h-24 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>}
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files?.[0], setPhotoPreview)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            </div>
            <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl pointer-events-none group-hover:scale-110 transition-transform">
               <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
          </div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Official Photo Protocol</span>
        </div>
        
        <div className="lg:col-span-1 space-y-2">
           <Input label={`${type === 'student' ? 'Enrollment' : 'Staff'} ID (Strict)`} name={type === 'student' ? 'studentId' : 'staffId'} defaultValue={generatedId} required placeholder="Unique Code" />
           <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest ml-1">Cloud Schema Mapping active</p>
        </div>
        <div className="lg:col-span-2">
           <Input label="Full Legal Name" name="name" required placeholder="As per verified documents" defaultValue={initialData?.name} />
        </div>
        
        {type === 'student' ? (
          <>
            <Select label="Allocated Grade" name="grade" defaultValue={initialData?.grade} required options={GRADES.map(g => ({value: g, label: g}))} />
            <Select label="Allocated Section" name="section" defaultValue={initialData?.section} required options={SECTIONS.map(s => ({value: s, label: `Section ${s}`}))} />
          </>
        ) : (
          <Select label="Institutional Role" name="role" defaultValue={initialData?.role} required options={['Teacher', 'Principal', 'Accountant', 'Librarian', 'Receptionist', 'Coordinator'].map(r => ({value: r, label: r}))} />
        )}

        <Select label="Gender Identity" name="gender" required defaultValue={initialData?.gender} options={[{value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}, {value: 'Other', label: 'Other'}]} />
        <Input label="Date of Birth" name="dob" type="date" required defaultValue={initialData?.dob} />
        <Select label="Blood Group" name="bloodGroup" required defaultValue={initialData?.bloodGroup} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => ({value: bg, label: bg}))} />
        <div className="lg:col-span-3"><Input label="Permanent Residential Address" name="address" required defaultValue={initialData?.address} /></div>
      </FormSection>

      <FormSection title="Parental Liaison" description="Family records and verified identification documentation.">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-50/50 p-12 rounded-[4rem] border border-slate-100 shadow-inner">
           <div className="space-y-6">
              <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] border-b-2 border-indigo-100 pb-3">Primary Father Profile</h4>
              <Input label="Name" name="fatherName" required defaultValue={initialData?.fatherName} />
              <Input label="Contact Mobil #" name="fatherContact" required defaultValue={initialData?.fatherContact} />
              <Input label="Professional Occupation" name="fatherOccupation" required defaultValue={initialData?.fatherOccupation} />
              <div className="pt-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block ml-1">Upload Father ID Proof (Strict)</label>
                <div className="relative h-32 bg-white border-2 border-dashed border-indigo-200 rounded-[2rem] flex items-center justify-center overflow-hidden hover:border-indigo-500 transition-all cursor-pointer shadow-sm">
                    {fatherIdPreview ? <img src={fatherIdPreview} className="w-full h-full object-cover" /> : <svg className="w-12 h-12 text-indigo-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    <input type="file" onChange={(e) => handleFileChange(e.target.files?.[0], setFatherIdPreview)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
           </div>
           <div className="space-y-6">
              <h4 className="text-[11px] font-black text-pink-600 uppercase tracking-[0.3em] border-b-2 border-pink-100 pb-3">Primary Mother Profile</h4>
              <Input label="Name" name="motherName" required defaultValue={initialData?.motherName} />
              <Input label="Contact Mobil #" name="motherContact" required defaultValue={initialData?.motherContact} />
              <Input label="Professional Occupation" name="motherOccupation" required defaultValue={initialData?.motherOccupation} />
              <div className="pt-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block ml-1">Upload Mother ID Proof (Strict)</label>
                <div className="relative h-32 bg-white border-2 border-dashed border-pink-200 rounded-[2rem] flex items-center justify-center overflow-hidden hover:border-pink-500 transition-all cursor-pointer shadow-sm">
                    {motherIdPreview ? <img src={motherIdPreview} className="w-full h-full object-cover" /> : <svg className="w-12 h-12 text-pink-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    <input type="file" onChange={(e) => handleFileChange(e.target.files?.[0], setMotherIdPreview)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
           </div>
        </div>
      </FormSection>

      <FormSection title="Legal Authorization" description="Emergency contacts and verified digital signatures.">
         <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10 bg-amber-50/40 p-12 rounded-[3.5rem] border border-amber-100/50">
            <Input label="Legal Guardian Name" name="guardianName" required defaultValue={initialData?.guardianName} />
            <Input label="Kinship Relationship" name="guardianRelationship" required defaultValue={initialData?.guardianRelationship} />
            <Input label="Emergency Rapid Dial" name="guardianContact" required defaultValue={initialData?.guardianContact} />
            <Input label="Guardian Official Address" name="guardianAddress" required defaultValue={initialData?.guardianAddress} />
         </div>
         <div className="lg:col-span-1 bg-slate-900 rounded-[3.5rem] p-12 text-white flex flex-col justify-center text-center relative overflow-hidden group border-8 border-white shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 text-indigo-400">Guardian Digital Hand-Sign</p>
            <div className="w-full h-40 bg-white/10 border-4 border-dashed border-white/20 rounded-[2.5rem] flex items-center justify-center relative hover:border-white/50 transition-all cursor-pointer shadow-inner">
               {parentSignPreview ? <img src={parentSignPreview} className="max-h-full max-w-full object-contain p-8 invert" /> : <div className="text-center space-y-2"><svg className="w-8 h-8 mx-auto text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg><span className="text-[9px] font-black text-white/20 uppercase tracking-widest block">Upload Scan</span></div>}
               <input type="file" onChange={(e) => handleFileChange(e.target.files?.[0], setParentSignPreview)} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <p className="text-[9px] font-bold text-white/30 mt-8 uppercase leading-relaxed italic tracking-tighter">Verified compliance for institutional policy.</p>
         </div>
      </FormSection>

      <FormSection title="Demographic Registry" description="Statutory data classification and portal security keys.">
        <Select label="Institutional Religion" name="religion" required defaultValue={initialData?.religion} options={['Hindu', 'Islam', 'Sikh', 'Christian', 'Jain', 'Other'].map(r => ({value:r, label:r}))} />
        <Select label="Statutory Category" name="category" required defaultValue={initialData?.category} options={['General', 'OBC', 'SC', 'ST'].map(c => ({value:c, label:c}))} />
        
        {/* CASTE is strictly for Students based on common School Management DB schemas */}
        {type === 'student' ? (
          <Input label="Caste Identification" name="caste" defaultValue={initialData?.caste} placeholder="e.g. Brahmin, etc." />
        ) : (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-center text-center">
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Caste tracking disabled for Faculty</p>
          </div>
        )}

        <Input label="Secure Portal Password" name="password" defaultValue={initialData?.password || 'edu@123'} />
      </FormSection>
    </form>
  );
};

export default AddPersonForm;
