
/**
 * EduNexus Neural Sound Engine
 * Curated high-fidelity UI sounds for immersive feedback.
 */

const SOUND_LIBRARY = {
  // Gatekeeper Sequence
  KEY_START: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Mechanical Click
  KEY_INSERT: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Metal Slide
  KEY_TURN: 'https://assets.mixkit.co/active_storage/sfx/2565/2565-preview.mp3', // Gear Turn
  UNLOCK_REVEAL: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Ethereal Reveal
  
  // UI Interactions
  TAP: 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3', // Soft Tap
  DIGITAL_BLIP: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', // Tech Blip
  SUCCESS: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Chime
  BACK: 'https://assets.mixkit.co/active_storage/sfx/2581/2581-preview.mp3' // Whoosh back
};

class SoundService {
  private static instance: SoundService;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  private constructor() {
    // Preload critical sounds
    Object.values(SOUND_LIBRARY).forEach(url => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.audioCache.set(url, audio);
    });
  }

  static getInstance() {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  play(soundKey: keyof typeof SOUND_LIBRARY, volume: number = 0.4) {
    if (!this.enabled) return;
    
    const url = SOUND_LIBRARY[soundKey];
    const cachedAudio = this.audioCache.get(url);
    
    if (cachedAudio) {
      const playAudio = cachedAudio.cloneNode() as HTMLAudioElement;
      playAudio.volume = volume;
      playAudio.play().catch(e => console.debug('Audio play blocked by browser policy until interaction.'));
    }
  }

  toggle(state?: boolean) {
    this.enabled = state !== undefined ? state : !this.enabled;
  }
}

export const soundEngine = SoundService.getInstance();
