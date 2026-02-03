
import React from 'react';
import { COLORS } from '../constants';

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<SectionProps> = ({ title, description, children }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
    <div className="border-l-4 pl-4" style={{ borderColor: COLORS.primary }}>
      <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {children}
    </div>
  </div>
);

export const Input: React.FC<{
  label: string;
  type?: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  defaultValue?: string | number;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}> = ({ label, type = 'text', name, required, placeholder, className, defaultValue, onBlur }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      required={required}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onBlur={onBlur}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none transition-all text-sm font-medium"
      style={{ '--tw-ring-color': COLORS.primary } as any}
      onFocus={(e) => (e.currentTarget.style.borderColor = COLORS.primary)}
    />
  </div>
);

export const Select: React.FC<{
  label: string;
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  onSelect?: (value: string) => void;
  defaultValue?: string | number;
}> = ({ label, name, options, required, onSelect, defaultValue }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        onChange={(e) => onSelect?.(e.target.value)}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 outline-none transition-all text-sm font-medium appearance-none"
        onFocus={(e) => (e.currentTarget.style.borderColor = COLORS.primary)}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
);

export const FileUpload: React.FC<{
  label: string;
  name: string;
  accept?: string;
  required?: boolean;
}> = ({ label, name, accept = "image/*", required }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative group">
      <input
        type="file"
        name={name}
        accept={accept}
        required={required}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="w-full px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl group-hover:bg-slate-100 transition-all text-center border-indigo-100">
        <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600">Click to attach file</span>
      </div>
    </div>
  </div>
);
