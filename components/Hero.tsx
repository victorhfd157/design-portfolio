import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MoveRight, Sparkles, Circle, Zap, Hexagon, TrendingUp, Award, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PROJECTS } from '../constants';
import ParticleBackground from './ParticleBackground';
import MagneticButton from './MagneticButton';
import { useParallax } from '../utils/useParallax';
import { loadProjects } from '../utils/projectLoader';
import { Project } from '../types';

const Hero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, size: number, delay: number, duration: number }>>([]);
  const { t, language } = useLanguage();
  const parallaxOffset = useParallax(0.3);

  const [projectsList, setProjectsList] = useState<Project[]>([]);

  // Load Projects on Mount
  useEffect(() => {
    const fetchProjects = async () => {
      const loaded = await loadProjects();
      setProjectsList(loaded.reverse());
    };
    fetchProjects();
  }, []);

  // Get latest project title
  const latestProject = projectsList.length > 0 ? projectsList[0] : null;

  // Carousel Logic
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentProject = projectsList[currentImageIndex];
  const heroImage = currentProject ? currentProject.imageUrl : '/hero_design_v1.jpg';
  const heroTitle = currentProject ? currentProject.title : (latestProject?.title || "Latest Work");

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



  // Animated stat counters
  const Counter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({ end, suffix = '', duration = 2 }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(0);

    useEffect(() => {
      const startTime = Date.now();
      const endTime = startTime + duration * 1000;

      const updateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (duration * 1000), 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        countRef.current = Math.floor(easeOutQuart * end);
        setCount(countRef.current);

        if (now < endTime) {
          requestAnimationFrame(updateCount);
        } else {
          setCount(end);
        }
      };

      const timer = setTimeout(updateCount, 500); // Start after 500ms
      return () => clearTimeout(timer);
    }, [end, duration]);

    return <>{count}{suffix}</>;
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-dark pt-20">

      {/* Particle Background */}
      <ParticleBackground particleCount={60} mouseInteraction={true} />

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

        {/* Geometric Decorative Elements with Parallax */}
        <div
          className="absolute top-20 left-10 opacity-20 animate-spin-slow"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        >
          <Hexagon size={60} className="text-brand-accent" strokeWidth={1} />
        </div>

        <div
          className="absolute top-1/3 right-20 opacity-25 animate-pulse-slow"
          style={{
            animationDelay: '2s',
            transform: `translateY(${parallaxOffset * 0.5}px)`
          }}
        >
          <Zap size={50} className="text-brand-accent" strokeWidth={1} />
        </div>
        <div
          className="absolute bottom-20 right-1/3 opacity-20 animate-float"
          style={{
            animationDelay: '3s',
            transform: `translateY(${parallaxOffset * 1.5}px)`
          }}
        >
          <Circle size={35} className="text-white" strokeWidth={1} />
        </div>

        {/* Glowing Dots */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-brand-accent rounded-full shadow-[0_0_20px_rgba(99,102,241,0.8)] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_25px_rgba(168,85,247,0.8)] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: '2.5s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">

        {/* LEFT COLUMN: Typography & Content */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center text-center lg:text-left order-2 lg:order-1 relative h-screen lg:h-auto z-20">

          {/* Badge */}
          <div className="flex justify-center lg:justify-start mb-6">
            <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-mono text-gray-300 tracking-wider">{t.hero.badge}</span>
            </div>
          </div>

          {/* Main Headline with 3D Effect */}
          <motion.h1
            className="text-[13vw] sm:text-8xl md:text-9xl lg:text-8xl xl:text-[8rem] leading-[0.85] sm:leading-[0.85] lg:leading-[0.9] text-white mb-6 sm:mb-8 perspective-500"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span
              className="block font-sans font-black tracking-tighter mix-blend-difference transition-transform duration-700 ease-out break-words"
              style={{ transform: `translateX(${mousePosition.x * 15}px)` }}
            >
              {t.hero.headline_1}
            </span>
            <span
              className="block font-gothic text-brand-accent holographic-text lg:-mt-4 transition-transform duration-1000 ease-out"
              style={{ transform: `translateX(${mousePosition.x * -8}px)` }}
            >
              {t.hero.headline_2}
            </span>
            <div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4 mt-2 lg:-mt-2 transition-transform duration-500 ease-out"
              style={{ transform: `translateY(${mousePosition.y * 5}px)` }}
            >
              <span className="font-script text-5xl sm:text-5xl md:text-6xl lg:text-6xl text-gray-400 font-light">
                {t.hero.headline_3_1}
              </span>
              <span className="font-serif italic font-bold text-5xl sm:text-5xl md:text-6xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">
                {t.hero.headline_3_2}
              </span>
            </div>
          </motion.h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
            {t.hero.subhead}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 sm:mb-12 px-4 sm:px-0">
            {/* Primary Button: Gradient & Glow with Magnetic Effect */}
            <MagneticButton
              onClick={() => scrollToSection('works')}
              className="group relative px-8 py-3 bg-brand-accent text-white rounded-full font-bold uppercase tracking-wider text-xs sm:text-sm overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:scale-105 transition-all duration-300"
              strength={0.4}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-purple-600 transition-transform duration-300 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center gap-3 tracking-wider text-xs uppercase">
                {t.hero.cta_primary} <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </MagneticButton>

            {/* Secondary Button: Glass & Slide with Magnetic Effect */}
            <MagneticButton
              onClick={() => scrollToSection('contact')}
              className="group relative px-8 py-3 rounded-full overflow-hidden transition-all duration-300 border border-white/20 hover:border-white/50"
              strength={0.3}
            >
              <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
              <span className="relative flex items-center gap-2 font-serif italic text-sm sm:text-base text-gray-300 group-hover:text-white transition-colors">
                {t.hero.cta_secondary}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </span>
            </MagneticButton>
          </div>

          {/* Animated Stats - Bottom */}
          <motion.div
            className="hidden sm:flex gap-6 sm:gap-8 justify-center lg:justify-start mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {/* Years of Experience */}
            <div className="glass-panel px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-md group hover:border-brand-accent/50 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-accent/20 rounded-lg group-hover:bg-brand-accent/30 transition-colors">
                  <TrendingUp size={20} className="text-brand-accent" />
                </div>
                <div>
                  <p className="text-3xl font-bold font-gothic text-white">
                    <Counter end={10} suffix="+" />
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{t.hero.years_xp}</p>
                </div>
              </div>
            </div>

            {/* Projects Completed */}
            <div className="glass-panel px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-md group hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <Award size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold font-gothic text-white">
                    <Counter end={50} suffix="+" />
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Projects</p>
                </div>
              </div>
            </div>

            {/* Happy Clients */}
            <div className="glass-panel px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-md group hover:border-cyan-500/50 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg group-hover:bg-cyan-500/30 transition-colors">
                  <Users size={20} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold font-gothic text-white">
                    <Counter end={30} suffix="+" />
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Clients</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Visual Centerpiece - Hidden on Mobile for clean typography look */}
        <div className="hidden lg:block lg:col-span-5 relative h-[80vh] flex items-center justify-center order-1 lg:order-2">

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

          {/* The Portal - "Broken Reality" Layout */}
          <div className="relative z-10 w-full h-[600px] flex items-center justify-center perspective-1000">

            {/* Spinning Magic Text Ring */}
            <div className="absolute w-[500px] h-[500px] animate-spin-slow-reverse opacity-20 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                <text fill="currentColor" className="text-white" fontSize="4.5" letterSpacing="3px">
                  <textPath href="#circlePath" startOffset="0%">
                    DIGITAL ALCHEMIST • CREATIVE DEVELOPER • DESIGN MAGIC •
                  </textPath>
                </text>
              </svg>
            </div>



            {/* Split Image Effect - DECONSTRUCT ON HOVER -- ROTATE IMAGE ON INTERACTION */}
            <div
              className="relative w-[320px] h-[480px] group cursor-pointer"
              onMouseEnter={() => {
                if (projectsList.length > 0) {
                  setCurrentImageIndex((prev) => (prev + 1) % projectsList.length);
                }
              }}
              onTouchStart={() => {
                if (projectsList.length > 0) {
                  setCurrentImageIndex((prev) => (prev + 1) % projectsList.length);
                }
              }}
            >

              {/* Left Half - Glitched Offset - FLIES LEFT ON HOVER (Extreme) */}
              <div
                className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl border border-white/20 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-x-32 group-hover:-translate-y-16 group-hover:rotate-[-12deg] group-hover:scale-90 group-hover:opacity-80 grayscale hover:grayscale-0 rotate-0 z-10 bg-black opacity-0 group-hover:opacity-100"
              >
                <img key={heroImage} src={heroImage} className="w-full h-full object-cover opacity-60 mix-blend-luminosity animate-fade-in" alt="Work Glitch" />
                <div className="absolute inset-0 bg-brand-accent/30 mix-blend-overlay"></div>
              </div>

              {/* Main Center Card - Clear - LIFTS & ROTATES */}
              <div
                className="absolute inset-0 overflow-hidden rounded-3xl border-2 border-white/10 shadow-2xl z-20 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-translate-y-6 group-hover:rotate-3 group-hover:shadow-[0_20px_50px_rgba(168,85,247,0.4)]"
                style={{
                  transform: `rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * -5}deg)`
                }}
              >
                <img key={heroImage} src={heroImage} className="w-full h-full object-cover animate-fade-in" alt="Focus" />

                {/* Glass Overlay with Noise */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                {/* Floating Badge inside Image */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-auto glass-panel px-5 py-2.5 rounded-full border border-white/20 flex items-center gap-2 backdrop-blur-xl animate-float">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]"></div>
                  <p className="text-[11px] text-gray-200 font-mono uppercase tracking-[0.15em] font-medium">{t.hero.latest_work}</p>
                </div>
              </div>

              {/* Right Accent - Wireframe - FLIES RIGHT ON HOVER (Extreme) */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl border border-brand-accent/30 z-0 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-32 group-hover:translate-y-16 group-hover:rotate-[12deg] group-hover:scale-90 opacity-0 group-hover:opacity-60"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.2) 1px, transparent 1px)', backgroundSize: '10px 10px' }}
              ></div>

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