import React from 'react';

const Select = ({ label, name, value, onChange, options, required = false }) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-2 text-[13px] font-normal text-gray-400 tracking-wide">
        {label} {required && <span className="text-gray-400">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="px-3 py-[6px] border border-gray-200 rounded text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-300 transition-colors shadow-sm bg-white"
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;
