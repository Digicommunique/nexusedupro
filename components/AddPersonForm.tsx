
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
  const [selectedReligion, setSelectedReligion] = useState<string>('');

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
          <p className="text-slate-500 font-medium text-sm">Create a new institutional record for {settings.schoolName}.</p>
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
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Attach Official Photograph</span>
        </div>
        
        <Input label="Full Name" name="name" required placeholder="Full legal name" />
        
        {type === 'student' ? (
          <>
            <Input label="Student ID" name="studentId" defaultValue={generatedId} required />
            <Select label="Grade" name="grade" required options={GRADES.map(g => ({value: g, label: g}))} />
            <Select label="Section" name="section" required options={SECTIONS.map(s => ({value: s, label: s}))} />
          </>
        ) : (
          <>
            <Input label="Staff ID" name="staffId" defaultValue={generatedId} required />
            <Select label="Role" name="role" required options={[
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
          options={[{value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}, {value: 'Other', label: 'Other'}]} 
        />
        <Input label="Date of Birth" name="dob" type="date" required />
        <Select 
          label="Blood Group" 
          name="bloodGroup" 
          required 
          options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => ({value: bg, label: bg}))} 
        />

        <div className="lg:col-span-3 bg-indigo-50/30 p-8 rounded-[2rem] border border-indigo-100 mt-4">
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Demographic Profile</p>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Select 
                label="Religion" 
                name="religion" 
                required 
                onSelect={(val) => setSelectedReligion(val)}
                options={[
                  {value: 'Hindu', label: 'Hindu'},
                  {value: 'Islam', label: 'Islam'},
                  {value: 'Sikh', label: 'Sikh'},
                  {value: 'Christian', label: 'Christian'},
                  {value: 'Jain', label: 'Jain'},
                  {value: 'Jews', label: 'Jews'},
                  {value: 'Buddhism', label: 'Buddhism'},
                  {value: 'Zorastians', label: 'Zorastians'},
                  {value: 'Other', label: 'Other (Specify)'}
                ]} 
              />
              {selectedReligion === 'Other' && (
                <Input label="Mention Religion" name="otherReligion" required placeholder="Specify religion" />
              )}
              <Input label="Caste" name="caste" required placeholder="Enter caste" />
              <Select 
                label="Category" 
                name="category" 
                required 
                options={[
                  {value: 'General', label: 'General'},
                  {value: 'OBC', label: 'OBC'},
                  {value: 'SC', label: 'SC'},
                  {value: 'ST', label: 'ST'},
                  {value: 'Others', label: 'Others'}
                ]} 
              />
           </div>
        </div>

        <Select 
          label="Relationship Status" 
          name="relationshipStatus" 
          required 
          options={[{value: 'Single', label: 'Single'}, {value: 'Married', label: 'Married'}]} 
        />
        <Input label="Medical Allergies" name="allergy" placeholder="Any medical concerns?" />
        <FileUpload label="Upload Identification (PDF/JPG)" name="idDocument" required />
        <div className="lg:col-span-2">
          <Input label="Current Residence" name="address" required placeholder="Permanent residential address" />
        </div>
      </FormSection>

      <FormSection title="Parental / Guardian Profile" description="Family background and emergency contacts">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
           <div className="space-y-6">
              <h4 className="text-sm font-black text-slate-900 uppercase italic">Father's Details</h4>
              <Input label="Name" name="fatherName" required />
              <Input label="Occupation" name="fatherOccupation" required />
              <Input label="Contact #" name="fatherContact" required />
              <FileUpload label="Father's ID Proof" name="fatherIdDoc" required />
              <Input label="Office Address" name="fatherOccupationAddress" required />
           </div>
           <div className="space-y-6">
              <h4 className="text-sm font-black text-slate-900 uppercase italic">Mother's Details</h4>
              <Input label="Name" name="motherName" required />
              <Input label="Occupation" name="motherOccupation" required />
              <Input label="Contact #" name="motherContact" required />
              <FileUpload label="Mother's ID Proof" name="motherIdDoc" required />
              <Input label="Office Address" name="motherOccupationAddress" required />
           </div>
        </div>
        
        <div className="lg:col-span-3 mt-8">
           <h4 className="text-sm font-black text-slate-900 uppercase italic mb-6">Local Guardianship (Emergency)</h4>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Guardian Name" name="guardianName" required />
              <Input label="Relationship" name="guardianRelationship" required />
              <Input label="Contact Number" name="guardianContact" required />
              <div className="md:col-span-3">
                 <Input label="Guardian Address" name="guardianAddress" required />
              </div>
           </div>
        </div>
      </FormSection>

      <FormSection title="Institutional Validation" description="Final verification and signatures">
        <div className="lg:col-span-3 p-8 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center text-center space-y-4">
           <FileUpload label="Upload Parents/Guardian Signature" name="parentSignature" required />
           <p className="text-[10px] font-bold text-slate-400 max-w-lg">I hereby confirm that all information provided is accurate and represents official institutional data for registration.</p>
        </div>
      </FormSection>
    </form>
  );
};

export default AddPersonForm;
