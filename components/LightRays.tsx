import React from 'react';

const LightRays: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Ray Container - Rotated slightly for drama */}
            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] animate-spin-slow-reverse opacity-20">

                {/* Ray 1 */}
                <div className="absolute top-1/2 left-1/2 w-[200%] h-[100px] -translate-y-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent rotate-0 blur-3xl transform-gpu" />

                {/* Ray 2 */}
                <div className="absolute top-1/2 left-1/2 w-[200%] h-[80px] -translate-y-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent rotate-45 blur-3xl transform-gpu" />

                {/* Ray 3 */}
                <div className="absolute top-1/2 left-1/2 w-[200%] h-[120px] -translate-y-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent rotate-90 blur-3xl transform-gpu" />

                {/* Ray 4 */}
                <div className="absolute top-1/2 left-1/2 w-[200%] h-[60px] -translate-y-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[135deg] blur-3xl transform-gpu" />

            </div>

            {/* Secondary Rays - Counter Rotation */}
            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] animate-spin-slow opacity-10">
                <div className="absolute top-1/2 left-1/2 w-[200%] h-[150px] -translate-y-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent rotate-[22.5deg] blur-3xl transform-gpu" />
                <div className="absolute top-1/2 left-1/2 w-[200%] h-[90px] -translate-y-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-pink-500/20 to-transparent rotate-[112.5deg] blur-3xl transform-gpu" />
            </div>
        </div>
    );
};

export default LightRays;
