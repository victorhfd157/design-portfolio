import React, { useState, useEffect } from 'react';
import { MoveRight, Sparkles, Circle, Zap, Hexagon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PROJECTS } from '../constants';

const Hero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, size: number, delay: number, duration: number }>>([]);
  const { t, language } = useLanguage();

  // Generate floating particles
  useEffect(() => {
    const particleCount = 20;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 4
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized position (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get latest project title
  const latestProject = PROJECTS && PROJECTS.length > 0 ? PROJECTS[0] : null;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-dark pt-20">

      {/* Background Noise & Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>

        {/* Animated Gradient Orbs - Background Layer */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-brand-accent/20 rounded-full blur-[100px] animate-pulse-slow transition-transform duration-[2000ms] ease-out"
          style={{ transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)` }}
        ></div>

        <div
          className="absolute bottom-[-10%] right-[-10%] transition-transform duration-[2500ms] ease-out"
          style={{ transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * 25}px)` }}
        >
          <div className="w-[40vw] h-[40vw] bg-purple-900/20 rounded-full blur-[100px] animate-float"></div>
        </div>

        {/* Floating Particles - Mouse Responsive */}
        {particles.map((particle) => {
          const offsetX = mousePosition.x * (particle.size * 2);
          const offsetY = mousePosition.y * (particle.size * 2);
          return (
            <div
              key={particle.id}
              className="absolute bg-white/40 rounded-full transition-transform duration-700 ease-out"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                transform: `translate(${offsetX}px, ${offsetY}px)`
              }}
            />
          );
        })}

        {/* Animated Grid Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Geometric Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20 animate-spin-slow">
          <Hexagon size={60} className="text-brand-accent" strokeWidth={1} />
        </div>

        <div className="absolute top-1/3 right-20 opacity-25 animate-pulse-slow" style={{ animationDelay: '2s' }}>
          <Zap size={50} className="text-brand-accent" strokeWidth={1} />
        </div>
        <div className="absolute bottom-20 right-1/3 opacity-20 animate-float" style={{ animationDelay: '3s' }}>
          <Circle size={35} className="text-white" strokeWidth={1} />
        </div>

        {/* Glowing Dots */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-brand-accent rounded-full shadow-[0_0_20px_rgba(99,102,241,0.8)] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_25px_rgba(168,85,247,0.8)] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: '2.5s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">

        {/* LEFT COLUMN: Typography & Content */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left order-2 lg:order-1 relative">

          {/* Badge */}
          <div className="flex justify-center lg:justify-start mb-6">
            <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-mono text-gray-300 tracking-wider">{t.hero.badge}</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[8rem] leading-[1.1] sm:leading-[0.95] lg:leading-[0.9] text-white mb-4 sm:mb-6 perspective-500">
            <span
              className="block font-sans font-black tracking-tighter mix-blend-difference transition-transform duration-700 ease-out"
              style={{ transform: `translateX(${mousePosition.x * 15}px)` }}
            >
              {t.hero.headline_1}
            </span>
            <span
              className="block font-gothic text-brand-accent lg:-mt-4 transition-transform duration-1000 ease-out"
              style={{ transform: `translateX(${mousePosition.x * -8}px)` }}
            >
              {t.hero.headline_2}
            </span>
            <div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4 lg:-mt-2 transition-transform duration-500 ease-out"
              style={{ transform: `translateY(${mousePosition.y * 5}px)` }}
            >
              <span className="font-script text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-gray-400 font-light">
                {t.hero.headline_3_1}
              </span>
              <span className="font-serif italic font-bold text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">
                {t.hero.headline_3_2}
              </span>
            </div>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
            {t.hero.subhead}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 sm:mb-12 px-4 sm:px-0">
            {/* Primary Button: Gradient & Glow */}
            <button
              onClick={() => scrollToSection('works')}
              className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-brand-accent text-white rounded-full font-bold uppercase tracking-wider text-xs sm:text-sm overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-purple-600 transition-transform duration-300 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center gap-3 tracking-wider text-xs uppercase">
                {t.hero.cta_primary} <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            {/* Secondary Button: Glass & Slide */}
            <button
              onClick={() => scrollToSection('contact')}
              className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-full overflow-hidden transition-all duration-300 border border-white/20 hover:border-white/50"
            >
              <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
              <span className="relative flex items-center gap-2 font-serif italic text-sm sm:text-base text-gray-300 group-hover:text-white transition-colors">
                {t.hero.cta_secondary}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </span>
            </button>
          </div>

          {/* Floating Stats - Left */}
          <div
            className="absolute -left-10 bottom-0 hidden lg:block transition-transform duration-1000 ease-out"
            style={{ transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)` }}
          >
            <div className="glass-panel p-4 rounded-xl border border-white/5 backdrop-blur-md rotate-[-5deg] hover:rotate-0 transition-transform animate-float delay-700">
              <p className="text-2xl font-bold font-gothic text-white">10+</p>
              <p className="text-xs text-gray-400 uppercase">{t.hero.years_xp}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Visual Centerpiece */}
        <div className="lg:col-span-5 relative h-[40vh] sm:h-[50vh] lg:h-[80vh] flex items-center justify-center order-1 lg:order-2">

          {/* Background Circle/Halo */}
          <div
            className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] border border-white/10 rounded-full opacity-30 transition-transform duration-[1200ms] ease-out"
            style={{ transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)` }}
          >
            <div className="absolute top-0 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_white] animate-spin-slow origin-[0_250px]"></div>
          </div>

          <div
            className="absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-gradient-to-b from-brand-accent/20 to-transparent rounded-full blur-3xl transition-transform duration-[1500ms]"
            style={{ transform: `translate(${mousePosition.x * -5}px, ${mousePosition.y * -5}px)` }}
          ></div>

          {/* The Statue Image (Masked) */}
          <div className="relative z-10 w-full h-full flex items-center justify-center perspective-1000">
            <div
              className="relative w-full max-w-md aspect-[3/4] overflow-hidden rounded-t-[10rem] rounded-b-[2rem] border border-white/10 shadow-2xl transition-transform duration-700 ease-out hover:scale-105"
              style={{
                transform: `rotateY(${mousePosition.x * 3}deg) rotateX(${mousePosition.y * -3}deg)`
              }}
            >
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent z-20 opacity-60"></div>

              {/* Statue Image */}
              <img
                src="https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?auto=format&fit=crop&w=800&q=80"
                alt="Classical Statue"
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
              />

              {/* Floating UI Elements on top of image - Only show if latestProject exists */}
              {latestProject && (
                <div
                  className="absolute bottom-6 left-6 z-30 transition-transform duration-500 ease-out"
                  style={{ transform: `translate(${mousePosition.x * -8}px, ${mousePosition.y * -8}px)` }}
                >
                  <div className="glass-panel px-4 py-3 rounded-xl border border-white/10 flex items-center gap-3 animate-float delay-100">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <Sparkles size={16} className="text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-mono">{t.hero.latest_work}</p>
                      <p className="text-sm text-white font-bold">{latestProject.title}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Decorative Floating Elements */}
          <div
            className="absolute top-1/4 right-0 lg:-right-10 hidden md:block transition-transform duration-[800ms] ease-out"
            style={{ transform: `translate(${mousePosition.x * 12}px, ${mousePosition.y * 12}px)` }}
          >
            <div className="glass-panel p-4 rounded-full border border-white/10 shadow-lg shadow-brand-accent/10 animate-float delay-300">
              <Circle size={32} className="text-white animate-spin-slow" strokeWidth={1} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;