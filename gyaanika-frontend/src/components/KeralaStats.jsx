import React from 'react';
import AnimatedNumber from './AnimatedNumber';

const KeralaStats = () => {
  const stats = [
    { label: "Total Institutions", value: "1200+" },
    { label: "District Coverage", value: "14/14" }, // Static or you can animate 14
    { label: "Placement Rate", value: "65-85" }, // Range Animation
    { label: "Established", value: "1867-1990" } // Your specific Range
  ];

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Animated Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center transition-all hover:shadow-2xl">
              <div className="text-3xl md:text-4xl font-black text-slate-800 mb-2">
                {/* Logic handles ranges or single numbers */}
                {stat.value.includes('/') ? (
                   stat.value 
                ) : (
                  <AnimatedNumber value={stat.value} />
                )}
                {stat.label === "Placement Rate" && "%"}
              </div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeralaStats;
