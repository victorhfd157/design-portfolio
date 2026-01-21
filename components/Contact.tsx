import React, { useEffect, useState, useRef } from 'react';
import { Mail, Linkedin, Instagram, ArrowUpRight, Copy, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import ContactForm from './ContactForm';

const Contact: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const { t, language } = useLanguage();
  const { showToast } = useToast();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText("victorhfduarte@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Show success toast
    const message = language === 'en' ? 'Email copied to clipboard!' : 'Email copiado para a área de transferência!';
    showToast(message, 'success');
  };

  const socialLinks = [
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/victorhfduarte/" },
    { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/victor.hfd/" }
  ];

  return (
    <div
      id="contact"
      className={`relative pt-32 pb-32 md:pb-20 bg-brand-dark min-h-screen overflow-hidden transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-[600px] bg-gradient-to-t from-brand-accent/5 to-transparent"></div>
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col justify-between h-full min-h-[70vh]">

        {/* Header */}
        <div className="max-w-5xl mx-auto text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">Open for opportunities</span>
          </div>

          <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] leading-[0.85] sm:leading-[0.85] md:leading-[0.85] text-white tracking-tighter">
            <span className="font-serif italic block text-gray-600 mix-blend-difference hover:text-gray-500 transition-colors duration-500 mb-2">{t.contact.headline_1}</span>
            <span className="font-sans font-black block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-2">{t.contact.headline_2}</span>
            <span className="font-gothic block text-brand-accent opacity-90">{t.contact.headline_3}</span>
          </h2>
        </div>

        {/* Main Action Area */}
        <div className="flex flex-col items-center gap-12 mb-24">

          {/* Big Magnetic Email */}
          <div className="relative group w-full max-w-2xl mx-auto">
            <div className="absolute -inset-4 bg-brand-accent/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <a
              href="mailto:victorhfduarte@gmail.com"
              className="group relative w-full flex items-center justify-center px-8 py-4 bg-brand-accent text-white rounded-full font-bold uppercase tracking-wider text-sm overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:scale-105 transition-all duration-300"
              ref={emailRef}
            >
              <span className="relative flex items-center justify-center">
                victorhfduarte@gmail.com
              </span>
            </a>
          </div>

          {/* Floating Copy Button */}
          <button
            onClick={handleCopyEmail}
            className="absolute -right-2 -top-2 md:right-0 md:top-0 p-3 bg-brand-dark border border-white/20 rounded-full text-gray-400 hover:text-white hover:border-brand-accent hover:bg-brand-accent transition-all duration-300 shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 z-20"
            title="Copy Email"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        {/* Contact Form */}
        <div className="mb-16">
          <h3 className="text-2xl font-serif italic text-center text-gray-400 mb-8">
            {t.contact_form?.title || 'Or send me a message'}
          </h3>
          <ContactForm />
        </div>

        {/* Divider */}
        <div className="w-full max-w-md mx-auto border-t border-white/10 mb-12" />

        {/* Minimal Social Pills */}
        <div className="flex flex-wrap justify-center gap-4">
          {socialLinks.map((social, i) => (
            <a
              key={i}
              href={social.href}
              className="group relative px-6 py-3.5 min-h-[44px] rounded-full border border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-3 overflow-hidden active:scale-95"
            >
              <social.icon size={18} className="text-gray-400 group-hover:text-black transition-colors" />
              <span className="text-xs font-mono uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                {social.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
        <p className="font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
          &copy; 2024 VICTOR DUARTE. {t.contact.rights}
        </p>
        <div className="flex gap-8 mt-4 md:mt-0 font-mono text-[10px] tracking-[0.2em] uppercase">
          <button
            onClick={() => window.dispatchEvent(new Event('openOnboarding'))}
            className="hover:text-white transition-colors uppercase tracking-[0.2em]"
          >
            Como navegar
          </button>
          <a href="#" className="hover:text-white transition-colors">
            {t.contact.privacy}
          </a>
          <a href="#" className="hover:text-white transition-colors">
            {t.contact.terms}
          </a>
        </div>
      </div>
    </div>

  );
};

export default Contact;