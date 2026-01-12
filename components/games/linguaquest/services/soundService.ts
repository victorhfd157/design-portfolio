class SoundService {
    private audioContext: AudioContext | null = null;

    constructor() {
        this.initAudio();
    }

    private initAudio() {
        if (typeof window !== 'undefined' && !this.audioContext) {
            // @ts-ignore
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        }
    }

    // Generic tone generator
    private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0) {
        if (!this.audioContext) this.initAudio();
        if (!this.audioContext) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + startTime);

        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start(this.audioContext.currentTime + startTime);
        osc.stop(this.audioContext.currentTime + startTime + duration);
    }

    // --- SFX Presets ---

    public playClick() {
        // Sharp click
        this.playTone(800, 'sine', 0.1);
    }

    public playPop() {
        // Cute bubble pop
        this.playTone(600, 'sine', 0.1);
    }

    public playSuccess() {
        // "Coin" or "Level Up" sound (Major Arpeggio)
        if (!this.audioContext) this.initAudio();
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        this.playTone(523.25, 'sine', 0.2, 0);       // C5
        this.playTone(659.25, 'sine', 0.2, 0.1);     // E5
        this.playTone(783.99, 'sine', 0.4, 0.2);     // G5
        this.playTone(1046.50, 'square', 0.5, 0.3);  // C6 (sparkle)
    }

    public playError() {
        // "Buzz" or "Wrong" sound (Dissonant)
        if (!this.audioContext) this.initAudio();
        if (!this.audioContext) return;

        this.playTone(150, 'sawtooth', 0.3, 0);
        this.playTone(140, 'sawtooth', 0.3, 0.1);
    }

    public playTypewriter() {
        // Very subtle click for text scrolling
        if (!this.audioContext) this.initAudio();
        // Use noise buffer for realistic key sound if possible, but keeping it simple for now
        this.playTone(800, 'triangle', 0.05);
    }
}

export const soundService = new SoundService();
