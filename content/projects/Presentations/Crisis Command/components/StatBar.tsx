import React from 'react';
import { TrendingUp, Users, ShieldAlert } from 'lucide-react';

interface StatBarProps {
  label: string;
  value: number;
  type: 'morale' | 'profit' | 'reputation';
  change?: number;
}

export const StatBar: React.FC<StatBarProps> = ({ label, value, type, change }) => {
  const getIcon = () => {
    switch (type) {
      case 'morale': return <Users size={14} />;
      case 'profit': return <TrendingUp size={14} />;
      case 'reputation': return <ShieldAlert size={14} />;
    }
  };

  const getColorClass = (val: number) => {
    if (val > 60) return 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]';
    if (val > 30) return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]';
    return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]';
  };

  // Create segments for the bar
  const segments = Array.from({ length: 25 }); // 25 segments = 4% each

  return (
    <div className="w-full mb-6 font-tech group relative">
      <div className="flex justify-between items-end mb-1 px-1">
        <div className="flex items-center gap-2 text-slate-400 group-hover:text-cyan-300 transition-colors uppercase tracking-widest text-[10px] font-bold">
          {getIcon()}
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {change !== undefined && change !== 0 && (
                <span className={`text-[10px] font-bold ${change > 0 ? 'text-cyan-400' : 'text-red-500'} animate-bounce`}>
                    {change > 0 ? '▲' : '▼'} {Math.abs(change)}
                </span>
            )}
            <span className={`text-base leading-none font-bold ${value < 30 ? 'text-red-500' : 'text-slate-200'}`}>
                {value}<span className="text-[10px] text-slate-500 ml-0.5">%</span>
            </span>
        </div>
      </div>
      
      {/* Container with "ruler" background */}
      <div className="relative h-2 bg-slate-900 border border-slate-700/50 rounded-sm overflow-hidden">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex justify-between px-0.5" style={{ opacity: 0.2 }}>
            {segments.map((_, i) => (
                <div key={`line-${i}`} className="w-px h-full bg-slate-500"></div>
            ))}
        </div>

        {/* The Bar */}
        <div className="absolute inset-y-0 left-0 flex items-center gap-0.5 px-0.5 transition-all duration-700 ease-out" style={{ width: `${value}%` }}>
             <div className={`h-1.5 w-full rounded-[1px] ${getColorClass(value)} transition-all duration-500`}></div>
        </div>
      </div>
    </div>
  );
};