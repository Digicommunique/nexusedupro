
import React from 'react';
import { FormSection, Input } from './FormLayout';
import { AppSettings } from '../types';
import { COLORS } from '../constants';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated = {
      schoolName: formData.get('schoolName') as string,
      branchName: formData.get('branchName') as string,
    };
    onUpdate(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Global Settings</h1>
        <p className="text-slate-500 font-medium italic">Configure institutional prefixes for ID generation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Institution Configuration" description="These values are used to auto-generate unique identifiers.">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">School Name</label>
            <input
              name="schoolName"
              defaultValue={settings.schoolName}
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 outline-none transition-all text-sm font-medium"
              style={{ '--tw-ring-color': COLORS.primary } as any}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Branch Name</label>
            <input
              name="branchName"
              defaultValue={settings.branchName}
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 outline-none transition-all text-sm font-medium"
              style={{ '--tw-ring-color': COLORS.primary } as any}
            />
          </div>
        </FormSection>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl text-white font-black shadow-xl transition-all hover:brightness-110 active:scale-95"
            style={{ backgroundColor: COLORS.primary }}
          >
            Update Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsView;
