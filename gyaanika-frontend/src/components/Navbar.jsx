import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-6 bg-white shadow-sm border-b">
      <div className="text-2xl font-black text-blue-700 tracking-tighter">GYAANIKA</div>
      <ul className="hidden md:flex gap-8 font-semibold text-sm text-slate-600">
        <li className="cursor-pointer hover:text-blue-600 transition-colors">Home</li>
        <li className="cursor-pointer hover:text-blue-600 transition-colors">Guidance</li>
        <li className="cursor-pointer hover:text-blue-600 transition-colors">About</li>
      </ul>
      <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 font-bold text-sm shadow-lg shadow-blue-100 transition-all">
        Get Started
      </button>
    </nav>
  );
};

export default Navbar;
