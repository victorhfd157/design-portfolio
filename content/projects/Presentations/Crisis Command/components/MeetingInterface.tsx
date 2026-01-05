import React, { useState, useEffect } from 'react';
import { Mic, Video, PhoneOff, Users, Activity, Signal, Wifi } from 'lucide-react';

interface MeetingInterfaceProps {
  sender: string;
  role: string;
  content: string;
  imageUrl?: string;
}

export const MeetingInterface: React.FC<MeetingInterfaceProps> = ({ sender, role, content, imageUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [imageUrl]);

  return (
    <div className="w-full h-full bg-black rounded-sm border border-slate-700 shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-500">
      
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 z-30 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 bg-red-950/90 border border-red-500/50 px-2 py-0.5 text-red-500 text-[10px] font-tech tracking-widest uppercase animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> REC
            </div>
            <div className="text-cyan-500/70 font-tech text-[10px] tracking-wider bg-black/50 px-1">
                SECURE_CHANNEL_09
            </div>
        </div>
        <div className="flex flex-col items-end gap-1">
             <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-tech bg-black/40 px-2 py-1 rounded border border-emerald-900/50">
                <Wifi size={12} /> 
                <span className="tracking-widest">120ms</span>
             </div>
        </div>
      </div>

      {/* Main Video Feed Area */}
      <div className="flex-1 relative flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Scanlines overlay for video only */}
        <div className="absolute inset-0 z-20 opacity-10 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 4px)' }}></div>
        
        {/* Main Image Layer */}
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Loading Placeholder */}
            {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                    <Activity size={48} className="text-cyan-900 animate-pulse opacity-50" />
                </div>
            )}
            
            <img 
                src={imageUrl || `https://picsum.photos/seed/${sender.replace(' ','')}/1280/720`} 
                alt="Meeting Participant" 
                className={`w-full h-full object-cover grayscale-[30%] contrast-125 transition-opacity duration-1000 ease-out ${imageLoaded ? 'opacity-80' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
            />

            {/* Blue tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/40 via-blue-900/10 to-transparent mix-blend-overlay pointer-events-none"></div>
            
            {/* Vignette specific to video */}
            <div className="absolute inset-0 bg-[radial-gradient(transparent_40%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
            
            {/* Speaker Label */}
            <div className="absolute bottom-6 left-6 z-30">
                <div className="bg-black/80 backdrop-blur-sm border-l-4 border-cyan-500 pl-4 pr-8 py-2 shadow-lg">
                    <p className="text-cyan-400 font-bold uppercase tracking-widest text-sm drop-shadow-md">{sender}</p>
                    <p className="text-slate-400 text-[10px] font-tech uppercase tracking-wide">{role}</p>
                </div>
            </div>
            
            {/* Live Transcript Box */}
            <div className="absolute top-16 right-4 sm:right-8 sm:w-80 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 p-5 text-slate-100 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-30 rounded-sm">
                <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-2">
                    <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.2em]">Live Transcript</span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
                <p className="leading-relaxed font-mono text-xs md:text-sm text-emerald-400 typing-effect">
                    <span className="text-slate-500 mr-2 font-bold uppercase">[{sender}]:</span>
                    "{content}"
                </p>
            </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-16 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-6 z-30 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <div className="text-slate-500 text-[10px] font-tech tracking-[0.2em] hidden sm:block opacity-70">
            CONFIDENTIAL // DO NOT DISTRIBUTE
        </div>

        <div className="flex items-center gap-6">
            <button className="p-3 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:bg-cyan-950 hover:border-cyan-500 hover:text-cyan-400 transition-all shadow-lg group">
                <Mic size={18} className="group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
            </button>
            <button className="p-3 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:bg-cyan-950 hover:border-cyan-500 hover:text-cyan-400 transition-all shadow-lg group">
                <Video size={18} className="group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
            </button>
            <button className="p-3 rounded-full bg-red-950/30 border border-red-900/50 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                <PhoneOff size={18} />
            </button>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
            <div className="flex items-center gap-2 cursor-pointer hover:text-cyan-400 transition-colors">
                <Users size={16} />
                <span className="text-xs font-tech font-bold">4/12</span>
            </div>
        </div>
      </div>
    </div>
  );
};