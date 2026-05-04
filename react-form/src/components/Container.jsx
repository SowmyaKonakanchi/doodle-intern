import React from 'react';

const Container = ({ children }) => {
  return (
    <div className="flex justify-center min-h-screen py-10 px-4 bg-[#f2f2f2]">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-sm border border-gray-100 p-8 h-fit">
        {children}
      </div>
    </div>
  );
};

export default Container;
