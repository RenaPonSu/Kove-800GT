/**
 * Helmet audio & Alexa motorcycle voice assistant manager using Web Speech API
 * Routes turn-by-turn navigation alerts, helmet voice prompts, and rider queries with authentic Alexa chimes and timbre.
 */

export type AlexaStatus = 'idle' | 'listening' | 'speaking';

export interface AlexaState {
  status: AlexaStatus;
  currentText: string;
  isListening: boolean;
  voiceName: string;
}

export type AlexaStateListener = (state: AlexaState) => void;

export class VoiceGuideService {
  private static instance: VoiceGuideService;
  private enabled: boolean = true;
  private volume: number = 0.9;
  private rate: number = 1.02; // Alexa natural speaking rate
  private pitch: number = 1.12; // Alexa bright, friendly feminine pitch
  private voice: SpeechSynthesisVoice | null = null;
  private status: AlexaStatus = 'idle';
  private currentText: string = '';
  private listeners: Set<AlexaStateListener> = new Set();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private isListeningActive: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => this.initVoices();
    }
  }

  public static getInstance(): VoiceGuideService {
    if (!VoiceGuideService.instance) {
      VoiceGuideService.instance = new VoiceGuideService();
    }
    return VoiceGuideService.instance;
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();

    // Prefer high-clarity natural female voices resembling Alexa (Samantha, Victoria, Google UK English Female, Microsoft Zira, Karen, US English natural)
    const alexaPreferredNames = [
      'samantha',
      'victoria',
      'karen',
      'zira',
      'moira',
      'fiona',
      'google uk english female',
      'google us english',
      'natural',
      'aria',
      'jenny'
    ];

    const foundAlexaVoice = voices.find((v) => {
      const lower = v.name.toLowerCase();
      return alexaPreferredNames.some((pref) => lower.includes(pref));
    });

    this.voice =
      foundAlexaVoice ||
      voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0] ||
      null;

    this.notifyState();
  }

  public subscribe(listener: AlexaStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AlexaState {
    return {
      status: this.status,
      currentText: this.currentText,
      isListening: this.isListeningActive,
      voiceName: this.voice ? this.voice.name : 'Alexa Digital Default'
    };
  }

  private setStatus(status: AlexaStatus, text: string = '') {
    this.status = status;
    this.currentText = text;
    this.notifyState();
  }

  private notifyState() {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch {
        // ignore subscriber errors
      }
    });
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.setStatus('idle', '');
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Authentic Alexa dual-tone start chime (C5 523.25Hz -> E5 659.25Hz)
   */
  public playAlexaWakeChime() {
    if (!this.enabled || typeof window === 'undefined') return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();

      // First tone: C5 (523.25 Hz)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      gain1.gain.setValueAtTime(0, audioCtx.currentTime);
      gain1.gain.linearRampToValueAtTime(this.volume * 0.22, audioCtx.currentTime + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.14);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.15);

      // Second tone: E5 (659.25 Hz) slightly louder & sustained
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.11);
      gain2.gain.setValueAtTime(0, audioCtx.currentTime + 0.11);
      gain2.gain.linearRampToValueAtTime(this.volume * 0.26, audioCtx.currentTime + 0.13);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(audioCtx.currentTime + 0.11);
      osc2.stop(audioCtx.currentTime + 0.36);
    } catch {
      // audio context autoplay restriction fallback
    }
  }

  /**
   * Authentic Alexa completion chime (E5 659.25Hz -> C5 523.25Hz soft tone)
   */
  public playAlexaSuccessChime() {
    if (!this.enabled || typeof window === 'undefined') return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(523.25, audioCtx.currentTime + 0.16);
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.2, audioCtx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.24);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.25);
    } catch {
      // fallback
    }
  }

  /**
   * Turn notification chime for helmet intercom navigation
   */
  public playTurnChime() {
    this.playAlexaWakeChime();
  }

  /**
   * Alexa speaks to the motorcycle helmet intercom with Alexa cadence and visual status
   */
  public speak(text: string, priority: 'urgent' | 'normal' = 'normal') {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.setStatus('speaking', text);
      setTimeout(() => this.setStatus('idle', ''), 2500);
      return;
    }

    if (priority === 'urgent') {
      window.speechSynthesis.cancel();
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.voice) {
        utterance.voice = this.voice;
      }
      utterance.volume = this.volume;
      utterance.rate = this.rate;
      utterance.pitch = this.pitch;

      utterance.onstart = () => {
        this.setStatus('speaking', text);
      };

      utterance.onend = () => {
        this.setStatus('idle', '');
        this.playAlexaSuccessChime();
      };

      utterance.onerror = () => {
        this.setStatus('idle', '');
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.setStatus('speaking', text);
      setTimeout(() => this.setStatus('idle', ''), 2500);
    }
  }

  /**
   * Hands-free speech recognition (Listen for Alexa wake command or speech)
   */
  public startListening(
    onResult: (transcript: string) => void,
    onError?: (err: string) => void
  ) {
    if (typeof window === 'undefined') return;

    this.playAlexaWakeChime();
    this.isListeningActive = true;
    this.setStatus('listening', 'Alexa is listening...');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setTimeout(() => {
        this.isListeningActive = false;
        this.setStatus('idle', '');
        if (onError) onError('Speech recognition not supported in this browser. Use quick command buttons.');
      }, 1500);
      return;
    }

    try {
      if (this.recognition) {
        try {
          this.recognition.abort();
        } catch {
          // ignore abort
        }
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        this.isListeningActive = false;
        this.setStatus('idle', '');
        if (transcript) {
          onResult(transcript);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.recognition.onerror = (e: any) => {
        this.isListeningActive = false;
        this.setStatus('idle', '');
        if (onError) onError(e?.error || 'Mic input ended');
      };

      this.recognition.onend = () => {
        this.isListeningActive = false;
        if (this.status === 'listening') {
          this.setStatus('idle', '');
        }
      };

      this.recognition.start();
    } catch (err) {
      this.isListeningActive = false;
      this.setStatus('idle', '');
      if (onError) onError(String(err));
    }
  }

  public stopListening() {
    this.isListeningActive = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
    this.setStatus('idle', '');
  }
}

export const voiceGuide = VoiceGuideService.getInstance();
