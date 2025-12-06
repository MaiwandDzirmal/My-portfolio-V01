class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private backgroundMusic: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;

  constructor() {
    // Initialize Web Audio API
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  }

  private async createTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine"
  ): Promise<void> {
    if (!this.audioContext || !this.gainNode || !this.enabled) return;

    return new Promise((resolve) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.gainNode);

      oscillator.frequency.setValueAtTime(
        frequency,
        this.audioContext!.currentTime
      );
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, this.audioContext!.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext!.currentTime + duration
      );

      oscillator.start(this.audioContext!.currentTime);
      oscillator.stop(this.audioContext!.currentTime + duration);

      oscillator.onended = () => resolve();
    });
  }

  private async createMelody(
    notes: { freq: number; duration: number; delay?: number }[]
  ): Promise<void> {
    if (!this.enabled) return;

    for (const note of notes) {
      if (note.delay) {
        await new Promise((resolve) => setTimeout(resolve, note.delay));
      }
      await this.createTone(note.freq, note.duration);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopBackgroundMusic();
    }
  }

  async play(soundName: string) {
    if (!this.enabled) return;

    switch (soundName) {
      case "eat":
        // Pleasant ascending tone for eating food
        await this.createMelody([
          { freq: 523, duration: 0.1 }, // C5
          { freq: 659, duration: 0.1, delay: 10 }, // E5
          { freq: 784, duration: 0.2, delay: 10 }, // G5
        ]);
        break;

      case "move":
        // Very short, subtle click for movement
        await this.createTone(800, 0.05, "square");
        break;

      case "gameOver":
        // Descending sad melody
        await this.createMelody([
          { freq: 440, duration: 0.15 }, // A4
          { freq: 392, duration: 0.15, delay: 20 }, // G4
          { freq: 349, duration: 0.15, delay: 20 }, // F4
          { freq: 294, duration: 0.3, delay: 20 }, // D4
        ]);
        break;

      case "start":
        // Triumphant ascending notes
        await this.createMelody([
          { freq: 330, duration: 0.1 }, // E4
          { freq: 392, duration: 0.1, delay: 10 }, // G4
          { freq: 523, duration: 0.2, delay: 10 }, // C5
        ]);
        break;

      case "directionChange":
        // Quick click for direction changes
        await this.createTone(600, 0.03, "sawtooth");
        break;
    }
  }

  async playBackgroundMusic() {
    if (!this.enabled || !this.audioContext || !this.gainNode) return;

    // Create a simple looping melody
    const playNote = (freq: number, duration: number) => {
      return new Promise<void>((resolve) => {
        const oscillator = this.audioContext!.createOscillator();
        const noteGain = this.audioContext!.createGain();

        oscillator.connect(noteGain);
        noteGain.connect(this.gainNode!);

        oscillator.frequency.setValueAtTime(
          freq,
          this.audioContext!.currentTime
        );
        oscillator.type = "sine";

        noteGain.gain.setValueAtTime(0.05, this.audioContext!.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext!.currentTime + duration
        );

        oscillator.start(this.audioContext!.currentTime);
        oscillator.stop(this.audioContext!.currentTime + duration);

        oscillator.onended = () => resolve();
      });
    };

    const melody = [
      262,
      294,
      330,
      349,
      392,
      440,
      494,
      523, // C4 to C5
      523,
      494,
      440,
      392,
      349,
      330,
      294,
      262, // Back down
    ];

    const playMelody = async () => {
      if (!this.enabled) return;

      for (const freq of melody) {
        await playNote(freq, 0.3);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      // Loop the melody
      setTimeout(playMelody, 1000);
    };

    playMelody();
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.stop();
      this.backgroundMusic = null;
    }
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }
}

// Create a singleton instance
export const soundManager = new SoundManager();
export default soundManager;
