
import React, { useState, useEffect } from 'react';
import { FormSection, Input, Select, FileUpload } from './FormLayout';
import { COLORS } from '../constants';
import { AppSettings } from '../types';

interface AddPersonFormProps {
  type: 'student' | 'staff';
  settings: AppSettings;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const GRADES = [
  'Pre-Nursery', 'Nursery', 'KG', 
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

const AddPersonForm: React.FC<AddPersonFormProps> = ({ type, settings, onCancel, onSubmit }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [generatedId, setGeneratedId] = useState<string>('');
  const [isClassTeacher, setIsClassTeacher] = useState<boolean>(false);

  useEffect(() => {
    const getInitials = (str: string) => str.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 3);
    const sInit = getInitials(settings.schoolName || 'EDU');
    const bInit = getInitials(settings.branchName || 'BRN');
    const typeLabel = type === 'student' ? 'STU' : 'STF';
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    setGeneratedId(`${sInit}-${bInit}-${typeLabel}-${random}`);
  }, [type, settings]);

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
    onSubmit({ ...data, isClassTeacher });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center sticky top-0 bg-[#F4F5F7]/95 backdrop-blur-md py-6 z-20 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 capitalize tracking-tight">Register {type}</h2>
          <p className="text-slate-500 font-medium text-sm">Create a new institutional record for {settings.schoolName} ({settings.branchName}).</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 md:flex-none px-8 py-3 rounded-xl border-2 border-slate-300 text-slate-600 font-bold hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 md:flex-none px-8 py-3 rounded-xl text-white font-black shadow-xl transition-all hover:brightness-110 active:scale-95"
            style={{ backgroundColor: COLORS.primary, boxShadow: `0 10px 15px -3px ${COLORS.primary}40` }}
          >
            Confirm & Save
          </button>
        </div>
      </div>

      <FormSection title="Core Information" description="Identity and personal identifiers">
        <div className="col-span-1 lg:col-span-3 flex flex-col items-center justify-center p-8 border-2 border-dashed border-indigo-100 rounded-2xl bg-white space-y-4">
          <div className="relative group">
            <div 
              className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-slate-50 bg-slate-50 shadow-inner flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ borderColor: photoPreview ? COLORS.primary : '#f1f5f9' }}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-300">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
              )}
              <input type="file" name="photo" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div 
              className="absolute -bottom-2 -right-2 p-2 rounded-lg text-white shadow-lg pointer-events-none"
              style={{ backgroundColor: COLORS.primary }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            </div>
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Attach Official Photograph</span>
        </div>
        
        <Input label="Full Name" name="name" required placeholder="Full legal name" />
        
        {type === 'student' && (
          <>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                Student ID <span className="text-rose-500">*</span>
              </label>
              <input
                name="studentId"
                value={generatedId}
                onChange={(e) => setGeneratedId(e.target.value)}
                required
                placeholder="Enter unique student identifier"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none transition-all text-sm font-medium"
                style={{ '--tw-ring-color': COLORS.primary } as any}
              />
            </div>
            <Select 
              label="Grade" 
              name="grade" 
              required 
              options={GRADES.map(g => ({value: g, label: g}))} 
            />
            <Select 
              label="Section" 
              name="section" 
              required 
              options={SECTIONS.map(s => ({value: s, label: s}))} 
            />
          </>
        )}

        {type === 'staff' && (
          <>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                Staff ID <span className="text-rose-500">*</span>
              </label>
              <input
                name="staffId"
                value={generatedId}
                onChange={(e) => setGeneratedId(e.target.value)}
                required
                placeholder="Enter unique staff identifier"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none transition-all text-sm font-medium"
                style={{ '--tw-ring-color': COLORS.primary } as any}
              />
            </div>
            <Select 
              label="Role" 
              name="role" 
              required 
              options={[
                { value: 'Teacher', label: 'Teacher' },
                { value: 'Principal', label: 'Principal' },
                { value: 'Coordinator', label: 'Coordinator' },
                { value: 'Non-Teaching Staff', label: 'Non-Teaching Staff' }
              ]} 
            />
            <div className="space-y-4 col-span-1 lg:col-span-3 p-6 bg-slate-50 rounded-2xl border border-slate-200">
               <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="classTeacherCheck"
                    checked={isClassTeacher} 
                    onChange={(e) => setIsClassTeacher(e.target.checked)} 
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="classTeacherCheck" className="text-sm font-black text-slate-800 uppercase tracking-tight">Appoint as Class Teacher</label>
               </div>
               {isClassTeacher && (
                 <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                    <Select label="Assigned Grade" name="assignedGrade" required options={GRADES.map(g => ({value: g, label: g}))} />
                    <Select label="Assigned Section" name="assignedSection" required options={SECTIONS.map(s => ({value: s, label: s}))} />
                 </div>
               )}
            </div>
          </>
        )}

        <Select 
          label="Gender" 
          name="gender" 
          required 
          options={[{value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}, {value: 'Other', label: 'Other'}]} 
        />
        <Input label="Date of Birth" name="dob" type="date" required />
        <Select 
          label="Blood Group" 
          name="bloodGroup" 
          required 
          options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => ({value: bg, label: bg}))} 
        />
        <Select 
          label="Relationship Status" 
          name="relationshipStatus" 
          required 
          options={[
            {value: 'Single', label: 'Single'}, 
            {value: 'Married', label: 'Married'},
            {value: 'Divorced', label: 'Divorced'}
          ]} 
        />
        <Input label="Allergies" name="allergy" placeholder="Any medical concerns?" />
        <FileUpload label="Identification Document" name="idDocument" required />
        <div className="lg:col-span-2">
          <Input label="Current Residence" name="address" required placeholder="Permanent residential address" />
        </div>
      </FormSection>

      {type === 'staff' && (
        <>
          <FormSection title="Academic Credentials" description="Educational background and valid documents">
            <div className="lg:col-span-2">
              <Input label="Qualification" name="qualification" required placeholder="e.g., M.Sc in Mathematics, PhD in Education" />
            </div>
            <FileUpload label="Degree Certificate" name="degreeDoc" required />
            <FileUpload label="Marksheets (Consolidated)" name="marksheetDoc" required />
            <FileUpload label="Highest Degree Document" name="highestDegreeDoc" required />
          </FormSection>

          <FormSection title="Bank Settlement Details" description="Payroll and financial routing info">
            <Input label="Bank Institution" name="bankName" required placeholder="e.g. Standard Chartered" />
            <Input label="IFSC / Routing Code" name="ifscCode" required placeholder="Bank routing code" />
            <Input label="Account Number" name="accountNumber" required placeholder="Full bank account digits" />
          </FormSection>
        </>
      )}

      <FormSection title="Father's Profile" description="Family background details">
        <Input label="Father's Name" name="fatherName" required />
        <Input label="Occupation" name="fatherOccupation" required />
        <Input label="Contact Number" name="fatherContact" required />
        <FileUpload label="Upload ID Document" name="fatherIdDoc" required />
        <div className="lg:col-span-2">
          <Input label="Workplace Address" name="fatherOccupationAddress" required />
        </div>
      </FormSection>

      <FormSection title="Mother's Profile" description="Family background details">
        <Input label="Mother's Name" name="motherName" required />
        <Input label="Occupation" name="motherOccupation" required />
        <Input label="Contact Number" name="motherContact" required />
        <FileUpload label="Upload ID Document" name="motherIdDoc" required />
        <div className="lg:col-span-2">
          <Input label="Workplace Address" name="motherOccupationAddress" required />
        </div>
      </FormSection>

      <FormSection title="Local Guardianship" description="Authorized local contact">
        <Input label="Guardian Name" name="guardianName" required />
        <Input label="Relationship" name="guardianRelationship" required placeholder="Legal relation" />
        <Input label="Contact Number" name="guardianContact" required />
        <div className="lg:col-span-3">
          <Input label="Full Address" name="guardianAddress" required />
        </div>
      </FormSection>

      {type === 'student' && (
        <FormSection title="Legal Authorization" description="Digital signatures and validation">
          <div className="lg:col-span-3 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <FileUpload label="Parents Digital Signature" name="parentSignature" required />
            <div className="flex gap-3 mt-4 items-start">
               <div className="w-5 h-5 mt-0.5 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.accent }}>
                 <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
               </div>
               <p className="text-xs text-slate-500 font-medium">
                 I hereby certify that the information provided is accurate. The digital signature uploaded represents legal consent for institutional registration.
               </p>
            </div>
          </div>
        </FormSection>
      )}
    </form>
  );
};

export default AddPersonForm;
