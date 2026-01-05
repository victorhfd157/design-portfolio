import React, { useState, useEffect } from 'react';
import { Mail, Reply, Forward, ShieldCheck, FileText, Lock } from 'lucide-react';

interface EmailInterfaceProps {
  sender: string;
  role: string;
  subject: string;
  content: string;
  imageUrl?: string;
}

export const EmailInterface: React.FC<EmailInterfaceProps> = ({ sender, role, subject, content, imageUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Reset loaded state when image url changes
  useEffect(() => {
    setImageLoaded(false);
  }, [imageUrl]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950/80 border border-slate-700/50 shadow-2xl relative overflow-hidden group animate-in fade-in duration-500">
      
      {/* Dynamic Background Image with Fade In */}
      <div className="absolute inset-0 z-0 bg-slate-950">
           {imageUrl && (
             <img 
                src={imageUrl} 
                className={`w-full h-full object-cover opacity-20 blur-sm scale-105 transition-opacity duration-1000 ease-in-out ${imageLoaded ? 'opacity-20' : 'opacity-0'}`} 
                alt="Background Context"
                onLoad={() => setImageLoaded(true)}
             />
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/80"></div>
           {/* Scanning line animation overlay */}
           <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-10 pointer-events-none"></div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/30 z-20"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/30 z-20"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/30 z-20"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30 z-20"></div>

      {/* Header Bar */}
      <div className="bg-slate-900/90 backdrop-blur border-b border-slate-700 p-4 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
            <div className="bg-cyan-900/20 text-cyan-400 p-1.5 rounded border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                <Mail size={16} />
            </div>
            <div>
                <h3 className="font-tech text-cyan-500 text-xs tracking-[0.2em] uppercase font-bold">Securemsg_V4.2 // Inbox</h3>
            </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-tech text-emerald-500 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30 shadow-sm">
            <Lock size={10} />
            <span>ENCRYPTED: AES-256</span>
        </div>
      </div>

      {/* Email Meta */}
      <div className="bg-slate-900/60 p-6 border-b border-slate-800 relative z-10 backdrop-blur-sm">
        <h2 className="text-xl md:text-2xl font-bold text-slate-100 mb-4 tracking-tight leading-tight">{subject}</h2>
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-sm bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 font-bold text-xl font-tech shadow-inner">
                {sender.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
                    <div>
                        <p className="font-bold text-slate-200 text-sm tracking-wide">{sender}</p>
                        <p className="text-xs text-cyan-600 font-tech uppercase tracking-wider font-semibold">{role}</p>
                    </div>
                    <span className="text-xs text-slate-500 font-tech">RECEIVED: TODAY 09:42 AM</span>
                </div>
            </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto relative z-10 scroll-smooth">
        <div className="prose prose-invert prose-sm md:prose-base max-w-none text-slate-300 leading-7 font-sans whitespace-pre-line border-l border-slate-700 pl-6">
            {content}
        </div>
        
        <div className="mt-10 pt-4 border-t border-slate-800/50">
            <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-900/80 p-3 border border-slate-800 w-fit hover:border-cyan-500/50 hover:bg-slate-800 transition-colors cursor-pointer group/attach rounded-sm">
                <FileText size={16} className="text-cyan-600 group-hover/attach:text-cyan-400" />
                <span className="font-tech tracking-wider">ATTACHMENT_CONFIDENTIAL.PDF</span>
                <span className="text-slate-600">2.4MB</span>
            </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex gap-3 relative z-10">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-cyan-950/50 border border-cyan-800 text-cyan-400 text-xs hover:bg-cyan-900/50 hover:border-cyan-500 transition-all uppercase tracking-wider font-tech font-bold rounded-sm">
            <Reply size={14} /> Reply
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/50 border border-slate-700 text-slate-400 text-xs hover:bg-slate-700 hover:text-slate-200 transition-all uppercase tracking-wider font-tech font-bold rounded-sm">
            <Forward size={14} /> Forward
        </button>
        <div className="ml-auto flex items-center gap-2 text-slate-600 px-3 hidden md:flex">
             <ShieldCheck size={16} />
             <span className="text-[10px] font-tech tracking-wider">NO THREATS DETECTED</span>
        </div>
      </div>
    </div>
  );
};