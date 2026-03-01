import React, { useState, useEffect } from 'react';

const Hero = () => {
  const slides = [
    {
      img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80",
      quote: "Fueling the future of Kerala's brilliance."
    },
    {
      img: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80",
      quote: "Bridging the gap between dreams and degrees."
    },
    {
      img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80",
      quote: "Smart guidance for the next generation."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // This is the "Engine" that makes it auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Changes every 5 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative h-[550px] flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Images Layer */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img 
            src={slide.img} 
            className="w-full h-full object-cover opacity-50"
            alt={`Slide ${index}`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-slate-900/90"></div>
        </div>
      ))}

      {/* Static Content Layer (Stays still while background slides) */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-2 drop-shadow-2xl">
          GYAANIKA
        </h1>
        <p className="text-xl md:text-2xl font-bold text-blue-400 tracking-[0.2em] uppercase mb-8 drop-shadow-md">
          AI Based Career Guidance
        </p>
        
        {/* Quote Box that changes with the slide */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-lg mx-auto transform transition-all duration-500">
          <p className="text-white text-lg italic font-medium">
            "{slides[currentIndex].quote}"
          </p>
        </div>
        
        <div className="mt-10 flex justify-center gap-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? "w-8 bg-blue-500" : "w-2 bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
