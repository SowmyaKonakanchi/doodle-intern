import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, required = false, placeholder }) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-2 text-[13px] font-normal text-gray-400 tracking-wide">
        {label} {required && <span className="text-gray-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="px-3 py-[6px] border border-gray-200 rounded text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-300 transition-colors shadow-sm"
      />
    </div>
  );
};

export default Input;
