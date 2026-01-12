class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  
  // Music Scheduler State
  private currentTrack: 'MENU' | 'PLAYING' | 'GAME_OVER' | null = null;
  private nextNoteTime: number = 0;
  private timerID: number | null = null;
  private beatCount: number = 0;
  private tempo: number = 120;
  private lookahead: number = 25.0; // ms
  private scheduleAheadTime: number = 0.1; // s

  // Buffers
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {}

  public init() {
    if (this.ctx) return;
    
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3; // Default volume
      this.masterGain.connect(this.ctx.destination);

      // Create Noise Buffer for explosions (white noise)
      const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      this.startScheduler();
    } catch (e) {
      console.error("AudioContext not supported", e);
    }
  }

  public toggleMute(): boolean {
    if (!this.ctx) this.init();
    
    this.isMuted = !this.isMuted;
    if (this.ctx && this.masterGain) {
      const target = this.isMuted ? 0 : 0.3;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
      
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }
    return this.isMuted;
  }

  public getMuteState() {
      return this.isMuted;
  }

  public setMusicState(state: 'MENU' | 'PLAYING' | 'GAME_OVER') {
    if (this.currentTrack === state) return;
    this.currentTrack = state;
    this.beatCount = 0;
    
    if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
    }
  }

  // --- Sound Effects ---

  public playShoot() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.15);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playExplosion() {
    if (!this.ctx || this.isMuted || !this.noiseBuffer) return;
    const t = this.ctx.currentTime;

    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, t);
    filter.frequency.exponentialRampToValueAtTime(100, t + 0.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    source.start(t);
    source.stop(t + 0.5);
  }

  public playCorrect() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Play a happy major triad arpeggio
    [523.25, 659.25, 783.99].forEach((freq, i) => { // C5, E5, G5
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.type = 'triangle';
        osc.frequency.value = freq;
        
        const startTime = t + i * 0.05;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        
        osc.start(startTime);
        osc.stop(startTime + 0.3);
    });
  }

  public playWrong() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(100, t + 0.3);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  public playGameOver() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 1.5);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.linearRampToValueAtTime(0, t + 1.5);

    osc.start(t);
    osc.stop(t + 1.5);
  }

  // --- Music Scheduler ---

  private startScheduler() {
      if (this.timerID) return;
      this.nextNoteTime = this.ctx?.currentTime || 0;
      this.timerID = window.setInterval(() => this.scheduler(), this.lookahead);
  }

  private scheduler() {
      if (!this.ctx) return;
      while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
          this.scheduleNote(this.beatCount, this.nextNoteTime);
          this.nextNote();
      }
  }

  private nextNote() {
      const secondsPerBeat = 60.0 / this.tempo;
      this.nextNoteTime += 0.25 * secondsPerBeat; // 16th notes
      this.beatCount++;
  }

  private scheduleNote(beatNumber: number, time: number) {
      if (this.isMuted || !this.masterGain || !this.ctx) return;
      if (!this.currentTrack) return;

      const beat16 = beatNumber % 16;
      const beat4 = beatNumber % 4;

      if (this.currentTrack === 'MENU') {
          // Slow, atmospheric
          this.tempo = 90;
          if (beat16 === 0) {
             this.playPad(220, time, 2); // A3
          }
          if (beat16 === 8) {
             this.playPad(329.63, time, 2); // E4
          }
          if (beat4 === 0) {
              this.playBlip(880, time, 0.05);
          }
      } 
      else if (this.currentTrack === 'PLAYING') {
          // Driving bassline
          this.tempo = 130;
          
          // Bass
          if (beat4 === 0 || beat4 === 2) {
              this.playBass(110, time, 0.1); // A2
          } else if (beat4 === 1 || beat4 === 3) {
              this.playBass(110, time, 0.1); 
          }

          // High hat ticks
          if (beatNumber % 2 === 0) {
              this.playNoiseTick(time);
          }
      }
      else if (this.currentTrack === 'GAME_OVER') {
          // Silence or very slow throb
          this.tempo = 60;
          if (beat16 === 0) {
             this.playPad(110, time, 0.5);
          }
      }
  }

  private playBass(freq: number, time: number, dur: number) {
      if(!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + dur);
      
      osc.start(time);
      osc.stop(time + dur);
  }

  private playPad(freq: number, time: number, dur: number) {
      if(!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.1, time + dur * 0.2);
      gain.gain.linearRampToValueAtTime(0, time + dur);
      
      osc.start(time);
      osc.stop(time + dur);
  }

  private playBlip(freq: number, time: number, dur: number) {
      if(!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.05, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + dur);
      osc.start(time);
      osc.stop(time + dur);
  }

  private playNoiseTick(time: number) {
      if(!this.ctx || !this.noiseBuffer) return;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const gain = this.ctx.createGain();
      
      // Highpass filter for "chk" sound
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 5000;

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      gain.gain.setValueAtTime(0.05, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

      src.start(time);
      src.stop(time + 0.05);
  }
}

export const audioService = new AudioService();