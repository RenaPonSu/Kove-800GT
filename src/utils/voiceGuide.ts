/**
 * Helmet audio voice guidance manager using Web Speech API
 * Routes turn-by-turn navigation alerts and communication prompts to the rider's intercom
 */
export class VoiceGuideService {
  private static instance: VoiceGuideService;
  private enabled: boolean = true;
  private volume: number = 0.9;
  private rate: number = 1.05; // slightly faster for quick riding prompts
  private voice: SpeechSynthesisVoice | null = null;

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
    // Prefer clear English or natural voice
    this.voice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri'))) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0] ||
      null;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public speak(text: string, priority: 'urgent' | 'normal' = 'normal') {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // If urgent (e.g. call or immediate turn), cancel previous speech
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
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Graceful fallback if speech synthesis is blocked or unavailable
    }
  }

  public playTurnChime() {
    if (!this.enabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.15); // A6
      gain.gain.setValueAtTime(this.volume * 0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.22);
    } catch {
      // AudioContext unavailable or autoplay prevented
    }
  }
}

export const voiceGuide = VoiceGuideService.getInstance();
