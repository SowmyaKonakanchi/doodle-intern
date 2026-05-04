import React from 'react';

const Toggle = ({ label, name, checked, onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-800">{label}</span>
      <div className="relative inline-block w-11 h-6 align-middle select-none transition duration-200 ease-in">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 z-10 transition-transform duration-300 outline-none focus:outline-none"
          style={{ transform: checked ? 'translateX(100%)' : 'translateX(0)', borderColor: '#e5e7eb' }}
        />
        <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${checked ? 'bg-green-400' : 'bg-gray-300'}`}>
        </label>
      </div>
      <span className="text-xs text-gray-500 uppercase tracking-wide">{checked ? 'ON' : 'OFF'}</span>
    </div>
  );
};

export default Toggle;
