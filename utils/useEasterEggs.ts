import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

const KONAMI_CODE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
];

export const useEasterEggs = () => {
    const [konamiIndex, setKonamiIndex] = useState(0);

    useEffect(() => {
        // Console message easter egg
        const styles = [
            'font-size: 20px',
            'font-weight: bold',
            'background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
            '-webkit-background-clip: text',
            'color: transparent',
            'padding: 20px',
        ].join(';');

        console.log('%c👋 Hey there, curious developer!', styles);
        console.log('%cLooking for easter eggs? Try the Konami Code! ⬆⬆⬇⬇⬅➡⬅➡BA', 'font-size: 14px; color: #6366f1');
        console.log('%cWant to work together? Email me: victorhfduarte@gmail.com', 'font-size: 12px; color: #a855f7');

        // Konami code listener
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key;

            if (key === KONAMI_CODE[konamiIndex]) {
                const newIndex = konamiIndex + 1;
                setKonamiIndex(newIndex);

                if (newIndex === KONAMI_CODE.length) {
                    // Trigger confetti celebration
                    const duration = 5000;
                    const animationEnd = Date.now() + duration;
                    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

                    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

                    const interval = setInterval(() => {
                        const timeLeft = animationEnd - Date.now();

                        if (timeLeft <= 0) {
                            clearInterval(interval);
                            console.log('%c🎉 Achievement Unlocked: Master of Secrets!', 'font-size: 16px; font-weight: bold; color: #10b981');
                            return;
                        }

                        const particleCount = 50 * (timeLeft / duration);

                        confetti({
                            ...defaults,
                            particleCount,
                            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                            colors: ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#eab308'],
                        });
                        confetti({
                            ...defaults,
                            particleCount,
                            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                            colors: ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#eab308'],
                        });
                    }, 250);

                    // Reset
                    setKonamiIndex(0);
                }
            } else {
                // Reset if wrong key
                setKonamiIndex(0);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [konamiIndex]);

    // Secret click counter on logo (click 7 times)
    const [clickCount, setClickCount] = useState(0);

    const handleSecretClick = () => {
        const newCount = clickCount + 1;
        setClickCount(newCount);

        if (newCount === 7) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.3 },
                colors: ['#6366f1', '#a855f7'],
            });
            console.log('%c🎨 You found the secret! Persistence pays off ✨', 'font-size: 14px; color: #ec4899; font-weight: bold');
            setClickCount(0);
        }

        // Reset after 2 seconds of no clicks
        setTimeout(() => setClickCount(0), 2000);
    };

    return { handleSecretClick };
};

// Fun console art
export const displayConsoleArt = () => {
    console.log(`
    ╔══════════════════════════════════════════╗
    ║                                          ║
    ║       VICTOR DUARTE PORTFOLIO            ║
    ║                                          ║
    ║  🎨 Designer  •  💻 Developer            ║
    ║                                          ║
    ║  Built with React + Vite + ❤️            ║
    ║                                          ║
    ╚══════════════════════════════════════════╝
  `);
};
