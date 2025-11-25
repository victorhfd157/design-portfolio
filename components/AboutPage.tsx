import React from 'react';
import Timeline from './Timeline';
import AlchemistLab from './AlchemistLab';
import Grimoire from './Grimoire';
import { Download, Cpu, GraduationCap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage: React.FC = () => {
   const { t, language } = useLanguage();

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
               <div className="lg:col-span-5 relative">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl">
                     <img
                        src="/avatar.jpg"
                        alt="Victor Duarte"
                        className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-60"></div>

                     {/* Floating Badge */}
                     <div className="absolute bottom-6 left-6 glass-panel px-4 py-3 rounded-xl border border-white/10 flex items-center gap-3">
                        <div className="bg-[#76b900]/20 p-2 rounded-lg">
                           <Cpu size={20} className="text-[#76b900]" />
                        </div>
                        <div>
                           <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t.about_page.certification_label}</p>
                           <p className="text-xs text-white font-bold">Nvidia AI & Diffusion Models</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-7 prose prose-invert prose-lg">
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
               </div>
            </div>

            {/* Timeline Section */}
            <div className="mb-32">
               <div className="flex items-center gap-4 mb-12">
                  <span className="h-px flex-1 bg-white/10"></span>
                  <h2 className="text-3xl font-serif italic text-white">{t.about_page.career_timeline}</h2>
                  <span className="h-px flex-1 bg-white/10"></span>
               </div>
               <Timeline />
            </div>

            {/* Alchemist Lab Section */}
            <div className="mb-20">
               <AlchemistLab />
            </div>

            {/* Grimoire Section */}
            <div className="mb-32">
               <Grimoire />
            </div>

            {/* Academic Formation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="glass-panel p-8 rounded-2xl border border-white/5 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                     <GraduationCap size={32} className="text-white" />
                  </div>
                  <div>
                     <p className="text-xs text-brand-accent font-mono mb-1 uppercase tracking-widest">{t.about_page.graduation}</p>
                     <h4 className="text-xl font-serif text-white italic">Design Gráfico</h4>
                     <p className="text-sm text-gray-400">Universidade Cruzeiro do Sul</p>
                  </div>
               </div>

               <div className="glass-panel p-8 rounded-2xl border border-white/5 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-[#76b900]/10 flex items-center justify-center border border-[#76b900]/20">
                     <Cpu size={32} className="text-[#76b900]" />
                  </div>
                  <div>
                     <p className="text-xs text-[#76b900] font-mono mb-1 uppercase tracking-widest">{t.about_page.specialization}</p>
                     <h4 className="text-xl font-serif text-white italic">Generative AI with Diffusion Models</h4>
                     <p className="text-sm text-gray-400">Nvidia Deep Learning Institute</p>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
};

export default AboutPage;