import React, { useState, useEffect, useRef } from 'react';
import { MoveRight, Sparkles, Circle, Zap, Hexagon, MousePointer2, Layers } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PROJECTS } from '../constants';

const Hero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Handle mouse move for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const latestProject = PROJECTS && PROJECTS.length > 0 ? PROJECTS[0] : null;

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] pt-20"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

        {/* Aurora Gradients */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen transition-transform duration-1000"
          style={{ transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)` }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/10 rounded-full blur-[100px] animate-float mix-blend-screen transition-transform duration-1000"
          style={{ transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)` }}
        />
        <div
          className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse mix-blend-screen"
        />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full w-full">

        {/* LEFT COLUMN: Content */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left order-2 lg:order-1 relative [perspective:1000px]">

          {/* Badge */}
          <div
            className="flex justify-center lg:justify-start mb-8 transition-transform duration-700 ease-out"
            style={{ transform: `translateZ(20px) translateX(${mousePosition.x * -20}px)` }}
          >
            <div className="glass-panel px-6 py-2 rounded-full flex items-center gap-3 border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.3)] group cursor-default hover:bg-white/5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
              </span>
              <span className="text-xs font-mono text-gray-300 tracking-[0.2em] uppercase group-hover:text-white transition-colors">
                {t.hero.badge}
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="relative mb-8 sm:mb-12">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[9rem] leading-[0.85] font-black tracking-tighter text-white mix-blend-difference">
              <span className="block hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-white hover:to-gray-400 transition-all duration-500 cursor-default drop-shadow-2xl">
                {t.hero.headline_1}
              </span>
              <span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-purple-500 to-brand-accent bg-[length:200%_auto] animate-gradient font-gothic tracking-wide lg:-mt-2 drop-shadow-[0_0_25px_rgba(99,102,241,0.4)]"
                style={{ transform: `translateX(${mousePosition.x * -10}px)` }}
              >
                {t.hero.headline_2}
              </span>
            </h1>

            <div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mt-6 lg:-mt-4 pl-2"
              style={{ transform: `translateY(${mousePosition.y * 10}px)` }}
            >
              <span className="font-script text-3xl sm:text-4xl md:text-5xl text-gray-500 rotate-[-8deg] transform origin-bottom-right hover:rotate-0 transition-transform duration-300">
                {t.hero.headline_3_1}
              </span>
              <span className="font-serif italic font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight drop-shadow-lg">
                {t.hero.headline_3_2}
              </span>
            </div>
          </div>

          {/* Subheadline */}
          <p
            className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
            style={{ transform: `translateZ(10px)` }}
          >
            {t.hero.subhead}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start items-center">
            <button
              onClick={() => scrollToSection('works')}
              className="group relative px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-wider text-sm overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                {t.hero.cta_primary}
                <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="group px-8 py-4 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all duration-300 flex items-center gap-3"
            >
              <span className="text-gray-300 group-hover:text-white font-medium tracking-wide text-sm uppercase">
                {t.hero.cta_secondary}
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Visual Centerpiece */}
        <div className="lg:col-span-5 relative h-[50vh] lg:h-[80vh] flex items-center justify-center order-1 lg:order-2 [perspective:1000px]">

          {/* Floating Elements Behind */}
          <div
            className="absolute top-10 right-10 animate-float delay-100 opacity-60"
            style={{ transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * 20}px)` }}
          >
            <Hexagon size={40} className="text-brand-accent" strokeWidth={1} />
          </div>
          <div
            className="absolute bottom-20 left-0 animate-float delay-300 opacity-40"
            style={{ transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * -30}px)` }}
          >
            <Zap size={50} className="text-purple-500" strokeWidth={1} />
          </div>

          {/* Main Card Container */}
          <div
            className="relative w-full max-w-md aspect-[3/4] transition-all duration-200 ease-out [transform-style:preserve-3d]"
            style={{
              transform: `
                rotateY(${mousePosition.x * 15}deg) 
                rotateX(${mousePosition.y * -15}deg)
                scale(${1 + Math.abs(mousePosition.x) * 0.05})
              `
            }}
          >
            {/* Glowing Ring */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-accent via-purple-500 to-cyan-500 rounded-[2.5rem] opacity-30 blur-2xl animate-pulse-slow" />

            {/* Main Image Card */}
            <div className="absolute inset-0 bg-[#1a1a1a] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />

              <img
                src="/hero-vr.png"
                alt="VR Future Design"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />

              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform translate-z-20">
                <div className="glass-panel p-4 rounded-xl border border-white/10 backdrop-blur-md flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Latest Creation</p>
                    <p className="text-white font-bold">{latestProject?.title || 'Digital Experience'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Glass Cards */}
            <div
              className="absolute -right-8 top-20 glass-panel p-4 rounded-2xl border border-white/20 shadow-xl backdrop-blur-xl animate-float delay-700 hidden sm:block"
              style={{ transform: 'translateZ(40px)' }}
            >
              <MousePointer2 size={24} className="text-white mb-2" />
              <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>

            <div
              className="absolute -left-8 bottom-40 glass-panel p-4 rounded-2xl border border-white/20 shadow-xl backdrop-blur-xl animate-float delay-500 hidden sm:block"
              style={{ transform: 'translateZ(60px)' }}
            >
              <Layers size={24} className="text-brand-accent mb-2" />
              <div className="w-8 h-1 bg-brand-accent/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;