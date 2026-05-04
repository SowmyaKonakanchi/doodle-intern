import React from 'react';

const RadioGroup = ({ label, name, value, onChange, options }) => {
  return (
    <div className="mb-6 flex items-center">
      <span className="text-sm text-gray-800 mr-4 tracking-wide">{label}</span>
      <div className="flex items-center gap-4">
        {options.map((opt) => (
          <label key={opt} className="flex items-center cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                name={name}
                value={opt}
                checked={value === opt}
                onChange={onChange}
                className="peer appearance-none w-4 h-4 border border-gray-400 rounded-full transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <div className="absolute w-2 h-2 rounded-full bg-gray-600 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
            </div>
            <span className="ml-2 text-sm text-gray-800">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
