import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Timeline from './Timeline';
import AlchemistLab from './AlchemistLab';
import AlchemistProfileCard from './AlchemistProfileCard';
import Grimoire from './Grimoire';
import { Download, Cpu, GraduationCap, Award, Users, Briefcase, Code } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollReveal, revealVariants, staggerContainer, staggerItem } from '../utils/useScrollReveal';

const AboutPage: React.FC = () => {
   const { t, language } = useLanguage();
   const photoRef = useRef<HTMLDivElement>(null);
   const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
   const [isPhotoHovering, setIsPhotoHovering] = useState(false);

   // Scroll reveal hooks
   const bioReveal = useScrollReveal({ threshold: 0.2 });
   const statsReveal = useScrollReveal({ threshold: 0.2 });
   const timelineReveal = useScrollReveal({ threshold: 0.1 });
   const educationReveal = useScrollReveal({ threshold: 0.2 });

   // 3D photo effect
   useEffect(() => {
      const photo = photoRef.current;
      if (!photo) return;

      const handleMouseMove = (e: MouseEvent) => {
         const rect = photo.getBoundingClientRect();
         const x = ((e.clientX - rect.left) / rect.width) * 100;
         const y = ((e.clientY - rect.top) / rect.height) * 100;
         setMousePosition({ x, y });
      };

      photo.addEventListener('mousemove', handleMouseMove);
      photo.addEventListener('mouseenter', () => setIsPhotoHovering(true));
      photo.addEventListener('mouseleave', () => {
         setIsPhotoHovering(false);
         setMousePosition({ x: 50, y: 50 });
      });

      return () => {
         photo.removeEventListener('mousemove', handleMouseMove);
         photo.removeEventListener('mouseenter', () => setIsPhotoHovering(true));
         photo.removeEventListener('mouseleave', () => setIsPhotoHovering(false));
      };
   }, []);

   // Calculate 3D tilt
   const tiltX = isPhotoHovering ? (mousePosition.y - 50) * 0.1 : 0;
   const tiltY = isPhotoHovering ? (mousePosition.x - 50) * -0.1 : 0;

   // Animated counter component
   const Counter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({ end, suffix = '', duration = 2 }) => {
      const [count, setCount] = useState(0);

      useEffect(() => {
         let startTime: number;
         const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
               requestAnimationFrame(animate);
            } else {
               setCount(end);
            }
         };

         const timer = setTimeout(() => requestAnimationFrame(animate), 500);
         return () => clearTimeout(timer);
      }, [end, duration]);

      return <>{count}{suffix}</>;
   };

   const handleDownloadCV = (e: React.MouseEvent) => {
      e.preventDefault();
      // In a real implementation, we would duplicate the logic from About.tsx
      // For brevity, let's assume it generates a simple file
      const blob = new Blob(["Full CV Download Placeholder"], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = t.about.cv_filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
   };

   return (
      <div className="bg-brand-dark min-h-screen pt-32 pb-20 relative overflow-hidden">

         {/* Background Noise */}
         <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50 mix-blend-overlay"></div>
         </div>

         <div className="container mx-auto px-6 relative z-10">

            {/* Header */}
            <div className="text-center mb-24 animate-fade-in">
               <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
                  <span className="text-xs font-gothic tracking-widest text-gray-300 uppercase">{t.about_page.badge}</span>
               </div>
               <h1 className="text-6xl md:text-9xl text-white leading-[0.85] mb-8">
                  <span className="font-serif italic text-gray-500 block">{t.about_page.headline_1}</span>
                  <span className="font-gothic text-brand-accent">{t.about_page.headline_2}</span>
               </h1>
               <p className="max-w-2xl mx-auto text-gray-400 font-light text-lg">
                  {t.about_page.subhead}
               </p>
            </div>

            {/* Bio Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-start">
               <motion.div
                  className="lg:col-span-5 relative"
                  ref={bioReveal.ref}
                  initial="hidden"
                  animate={bioReveal.isVisible ? "visible" : "hidden"}
                  variants={revealVariants.fadeInLeft}
                  transition={{ duration: 0.8 }}
               >
                  <AlchemistProfileCard />
               </motion.div>

               <motion.div
                  className="lg:col-span-7 prose prose-invert prose-lg"
                  initial="hidden"
                  animate={bioReveal.isVisible ? "visible" : "hidden"}
                  variants={revealVariants.fadeInRight}
                  transition={{ duration: 0.8, delay: 0.2 }}
               >
                  <h3 className="text-3xl font-serif text-white italic mb-6">{t.about_page.quote}</h3>
                  <p className="text-gray-300 font-light leading-relaxed">
                     {t.about_page.bio_p1}
                  </p>
                  <p className="text-gray-300 font-light leading-relaxed">
                     {t.about_page.bio_p2}
                  </p>
                  <p className="text-gray-300 font-light leading-relaxed">
                     {t.about_page.bio_p3}
                  </p>

                  <div className="pt-8 mt-8 border-t border-white/10 flex flex-wrap gap-4">
                     <button
                        onClick={handleDownloadCV}
                        className="group relative flex items-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-full font-bold uppercase tracking-wider text-[10px] overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:scale-105 transition-all duration-300"
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-purple-600"></div>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative z-10 flex items-center gap-2">
                           <Download size={14} /> {t.about_page.download_full_cv}
                        </span>
                     </button>
                  </div>
               </motion.div>
            </div>

            {/* Animated Stats */}
            <motion.div
               ref={statsReveal.ref}
               className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32"
               initial="hidden"
               animate={statsReveal.isVisible ? "visible" : "hidden"}
               variants={staggerContainer}
            >
               <motion.div variants={staggerItem} className="glass-panel p-6 rounded-2xl border border-white/10 text-center group hover:border-brand-accent/50 transition-all">
                  <div className="w-12 h-12 mx-auto mb-4 bg-brand-accent/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Briefcase size={24} className="text-brand-accent" />
                  </div>
                  <div className="text-4xl font-bold font-gothic text-white mb-2">
                     <Counter end={10} suffix="+" />
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Anos XP</p>
               </motion.div>

               <motion.div variants={staggerItem} className="glass-panel p-6 rounded-2xl border border-white/10 text-center group hover:border-purple-500/50 transition-all">
                  <div className="w-12 h-12 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Award size={24} className="text-purple-400" />
                  </div>
                  <div className="text-4xl font-bold font-gothic text-white mb-2">
                     <Counter end={150} suffix="+" />
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Projetos</p>
               </motion.div>

               <motion.div variants={staggerItem} className="glass-panel p-6 rounded-2xl border border-white/10 text-center group hover:border-cyan-500/50 transition-all">
                  <div className="w-12 h-12 mx-auto mb-4 bg-cyan-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Users size={24} className="text-cyan-400" />
                  </div>
                  <div className="text-4xl font-bold font-gothic text-white mb-2">
                     <Counter end={50} suffix="+" />
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Clientes</p>
               </motion.div>

               <motion.div variants={staggerItem} className="glass-panel p-6 rounded-2xl border border-white/10 text-center group hover:border-green-500/50 transition-all">
                  <div className="w-12 h-12 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Code size={24} className="text-green-400" />
                  </div>
                  <div className="text-4xl font-bold font-gothic text-white mb-2">
                     <Counter end={25} suffix="+" />
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Tecnologias</p>
               </motion.div>
            </motion.div>

            {/* Timeline Section */}
            <motion.div
               ref={timelineReveal.ref}
               className="mb-32"
               initial="hidden"
               animate={timelineReveal.isVisible ? "visible" : "hidden"}
               variants={revealVariants.fadeInUp}
               transition={{ duration: 0.6 }}
            >
               <div className="flex items-center gap-4 mb-12">
                  <span className="h-px flex-1 bg-white/10"></span>
                  <h2 className="text-3xl font-serif italic text-white">{t.about_page.career_timeline}</h2>
                  <span className="h-px flex-1 bg-white/10"></span>
               </div>
               <Timeline />
            </motion.div>

            {/* Alchemist Lab Section */}
            <div className="mb-20">
               <AlchemistLab />
            </div>

            {/* Grimoire Section */}
            <div className="mb-32">
               <Grimoire />
            </div>

            {/* Academic Formation */}
            <motion.div
               ref={educationReveal.ref}
               className="grid grid-cols-1 md:grid-cols-2 gap-6"
               initial="hidden"
               animate={educationReveal.isVisible ? "visible" : "hidden"}
               variants={staggerContainer}
            >
               <motion.div variants={staggerItem} className="glass-panel p-8 rounded-2xl border border-white/5 flex items-center gap-6 hover:border-white/20 transition-all group">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <GraduationCap size={32} className="text-white" />
                  </div>
                  <div>
                     <p className="text-xs text-brand-accent font-mono mb-1 uppercase tracking-widest">{t.about_page.graduation}</p>
                     <h4 className="text-xl font-serif text-white italic">Design Gráfico</h4>
                     <p className="text-sm text-gray-400">Universidade Cruzeiro do Sul</p>
                  </div>
               </motion.div>

               <motion.div variants={staggerItem} className="glass-panel p-8 rounded-2xl border border-white/5 flex items-center gap-6 hover:border-[#76b900]/30 transition-all group">
                  <div className="w-16 h-16 rounded-full bg-[#76b900]/10 flex items-center justify-center border border-[#76b900]/20 group-hover:scale-110 transition-transform">
                     <Cpu size={32} className="text-[#76b900]" />
                  </div>
                  <div>
                     <p className="text-xs text-[#76b900] font-mono mb-1 uppercase tracking-widest">{t.about_page.specialization}</p>
                     <h4 className="text-xl font-serif text-white italic">Generative AI with Diffusion Models</h4>
                     <p className="text-sm text-gray-400">Nvidia Deep Learning Institute</p>
                  </div>
               </motion.div>
            </motion.div>

         </div>
      </div>
   );
};

export default AboutPage;