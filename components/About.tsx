import React, { useEffect, useState } from 'react';
import SkillsList from './SkillsList';
import { Download, ArrowRight, ExternalLink, Cpu } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CV_CONTENT_PT = `
VICTOR DUARTE
EdTech Branding Manager & Senior Designer
------------------------------------------------------------
Email: victorhfduarte@gmail.com
Telefone: +351 960 263 588
Localização: Porto, Portugal

RESUMO PROFISSIONAL
Sou um profissional dinâmico, com mais de 10 anos de experiência em design, marketing, desenvolvimento educacional e criação de sites. Atuei em empresas como Kainos BPO Tech e a multinacional Atento S/A, presente em 14 países, liderando projetos para marcas como Facebook, Vivo e Carrefour.

EXPERIÊNCIA PROFISSIONAL
Jan 2025 - Atual | EdTech Branding Manager | Instituto Unicenter
Mar 2021 - Dez 2023 | Graphic Designer Senior | Kainos BPO Tech
Mar 2017 - Mar 2021 | Graphic Designer | Atento Brazil S/A

FORMAÇÃO ACADÊMICA
Generative AI with Diffusion Models | Nvidia Deep Learning Institute
Design Gráfico | Universidade Cruzeiro do Sul
`;

const CV_CONTENT_EN = `
VICTOR DUARTE
EdTech Branding Manager & Senior Designer
------------------------------------------------------------
Email: victorhfduarte@gmail.com
Phone: +351 960 263 588
Location: Porto, Portugal

PROFESSIONAL SUMMARY
I am a dynamic professional with over 10 years of experience in design, marketing, educational development, and website creation. I worked at companies like Kainos BPO Tech and the multinational Atento S/A, leading projects for brands like Facebook, Vivo, and Carrefour.

PROFESSIONAL EXPERIENCE
Jan 2025 - Present | EdTech Branding Manager | Instituto Unicenter
Mar 2021 - Dec 2023 | Senior Graphic Designer | Kainos BPO Tech
Mar 2017 - Mar 2021 | Graphic Designer | Atento Brazil S/A

EDUCATION
Generative AI with Diffusion Models | Nvidia Deep Learning Institute
Graphic Design | Universidade Cruzeiro do Sul
`;

const About: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    // Slight delay to trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadCV = (e: React.MouseEvent) => {
    e.preventDefault();
    const content = language === 'en' ? CV_CONTENT_EN : CV_CONTENT_PT;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = t.about.cv_filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="about" className="pt-32 pb-20 bg-brand-dark relative min-h-screen overflow-hidden">
      {/* Background Noise */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* Header Section */}
        <div
          className={`mb-16 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="inline-flex items-center gap-3 px-2 py-2 pr-4 mb-8 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
            <img
              src="/avatar.jpg"
              alt="Victor"
              className="w-8 h-8 rounded-full object-cover border border-white/20"
            />
            <span className="text-xs font-gothic tracking-widest text-gray-300 uppercase">{t.about.badge_name}</span>
          </div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.85] text-white">
            <span className="font-serif italic font-bold block mb-4 text-gray-400">{t.about.role_1}</span>
            <span className="font-gothic text-brand-accent block sm:ml-6 md:ml-8 mb-2">{t.about.role_2}</span>
            <span className="font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600 block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-6 tracking-tight">
              {t.about.role_3}
            </span>
          </h2>
        </div>

        {/* Split Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left Column: Biography - Mobile Optimized */}
          <div
            className={`flex flex-col justify-center text-gray-400 font-light leading-relaxed text-base md:text-lg transition-all duration-1000 ease-out delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
          >
            <p className="mb-6 md:mb-8 first-letter:text-4xl md:first-letter:text-5xl first-letter:font-serif first-letter:text-white first-letter:float-left first-letter:mr-2 md:first-letter:mr-3 first-letter:leading-[0.8]">
              {t.about.bio_intro_1} <strong className="text-white">{t.about.bio_intro_2}</strong> {t.about.bio_intro_3}
            </p>

            <p className="mb-8 md:mb-10">
              {t.about.bio_body} <span className="text-white font-medium">{t.about.bio_body_2}</span>{t.about.bio_body_3} <span className="text-brand-accent font-bold">{t.about.bio_body_4}</span>{t.about.bio_body_5}
            </p>

            {/* Action Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
              <a
                href="#"
                onClick={handleDownloadCV}
                className="group relative flex items-center justify-center gap-3 px-8 py-4 min-h-[48px] bg-brand-accent text-white rounded-full font-bold uppercase tracking-wider text-xs overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-purple-600"></div>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <Download size={16} /> {t.about.download_cv}
                </span>
              </a>
              <button
                onClick={scrollToContact}
                className="group relative flex items-center justify-center gap-3 px-8 py-4 min-h-[48px] border border-white/10 bg-white/5 text-white rounded-full font-bold uppercase tracking-wider text-xs overflow-hidden hover:bg-white/10 hover:border-white/30 backdrop-blur-sm active:scale-95 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {t.about.lets_talk} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>

            {/* Additional Info / Certifications - Mobile Enhanced */}
            <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-white/10">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">{t.about.latest_cert}</p>
              <div className="flex items-start gap-3 md:gap-4 p-4 md:p-0 bg-white/5 md:bg-transparent rounded-xl md:rounded-none border border-white/5 md:border-0">
                <div className="bg-[#76b900]/10 p-2.5 md:p-2 rounded-lg border border-[#76b900]/20">
                  <Cpu className="text-[#76b900]" size={24} />
                </div>
                <div>
                  <h5 className="text-white font-bold text-sm md:text-base">Generative AI with Diffusion Models</h5>
                  <p className="text-xs text-gray-500">Nvidia Deep Learning Institute</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Skills List - Mobile Enhanced */}
          <div
            className={`w-full transition-all duration-1000 ease-out delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
          >
            {/* Wrapper for the Skills Component */}
            <div className="relative h-full bg-white/5 border border-white/10 md:border-white/5 rounded-2xl p-4 md:p-6 lg:p-10 backdrop-blur-sm min-h-[500px] shadow-xl md:shadow-none">
              <div className="absolute top-0 right-0 p-4 opacity-20 hover:opacity-100 transition-opacity">
                <ExternalLink size={24} className="text-white" />
              </div>
              <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-6 md:mb-8">{t.about.tech_proficiency}</h3>

              <SkillsList />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;