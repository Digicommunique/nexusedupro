
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Student, Staff, AppSettings } from '../types';
import { COLORS } from '../constants';

interface IDCardProps {
  person: Student | Staff;
  settings: AppSettings;
}

const IDCard: React.FC<IDCardProps> = ({ person, settings }) => {
  const isStudent = 'studentId' in person;
  const idValue = isStudent ? (person as Student).studentId : (person as Staff).staffId;
  const roleValue = isStudent ? (person as Student).grade : (person as Staff).role;

  return (
    <div className="w-[350px] h-[500px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 flex flex-col relative print:shadow-none print:border-slate-300">
      {/* Header */}
      <div className="h-32 bg-slate-900 p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h2 className="text-white font-black text-lg uppercase tracking-tighter leading-tight">{settings.schoolName}</h2>
        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">{settings.branchName}</p>
      </div>

      {/* Profile Photo */}
      <div className="flex justify-center -mt-12 z-10">
        <div className="w-28 h-28 rounded-2xl border-4 border-white bg-slate-100 shadow-lg overflow-hidden">
          <img 
            src={person.photo || `https://picsum.photos/seed/${person.id}/200`} 
            alt={person.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 p-6 flex flex-col items-center text-center space-y-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{person.name}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{roleValue}</p>
        </div>

        <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="text-left">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">ID Number</p>
            <p className="text-[10px] font-bold text-slate-800 uppercase">{idValue}</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Blood Group</p>
            <p className="text-[10px] font-bold text-slate-800 uppercase">{person.bloodGroup}</p>
          </div>
          <div className="text-left">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">DOB</p>
            <p className="text-[10px] font-bold text-slate-800 uppercase">{person.dob}</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Emergency</p>
            <p className="text-[10px] font-bold text-slate-800 uppercase">{person.guardianContact}</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="pt-6 flex flex-col items-center space-y-2">
          <div className="p-2 bg-white border-2 border-slate-900 rounded-xl shadow-sm">
            <QRCodeSVG value={idValue} size={80} level="H" />
          </div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Scan for Attendance</p>
        </div>
      </div>

      {/* Footer */}
      <div className="h-4 bg-slate-900 w-full"></div>
    </div>
  );
};

export default IDCard;
