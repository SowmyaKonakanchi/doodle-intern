import React from 'react';

const PhoneInput = ({ label, name, value, onChange, required = false }) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-2 text-[13px] font-normal text-gray-400 tracking-wide">
        {label} {required && <span className="text-gray-400">*</span>}
      </label>
      <div className="flex items-center border border-gray-200 rounded shadow-sm focus-within:ring-1 focus-within:ring-red-300 focus-within:border-red-300 transition-colors bg-white overflow-hidden">
        <div className="flex items-center px-3 border-r border-gray-200 bg-gray-50 py-[6px] h-full flex-shrink-0">
          <img src="https://flagcdn.com/w20/in.png" alt="India Flag" className="w-[18px] object-contain mr-2" />
          <span className="text-sm text-gray-800">+91</span>
        </div>
        <input
          type="tel"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-3 py-[6px] text-sm text-gray-800 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default PhoneInput;
