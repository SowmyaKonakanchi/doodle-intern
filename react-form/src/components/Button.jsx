import React from 'react';

const Button = ({ children, type = 'button', onClick }) => {
  return (
    <div className="flex justify-center mt-6">
      <button
        type={type}
        onClick={onClick}
        className="px-8 py-2 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
