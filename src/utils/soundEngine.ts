interface CustomWindow extends Window {
  AudioContext?: typeof AudioContext
  webkitAudioContext?: typeof AudioContext
}

class SoundEngine {
  private ctx: AudioContext | null = null

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const win = window as unknown as CustomWindow
      const Ctx = win.AudioContext || win.webkitAudioContext
      if (Ctx) this.ctx = new Ctx()
    }
  }

  private tone(freq: number, type: OscillatorType, duration: number, vol: number) {
    this.init()
    if (!this.ctx) return

    const osc  = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
    gain.gain.setValueAtTime(vol, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + duration)
  }

  playTick()  { this.tone(900,  'sine',     0.04, 0.04) }
  playDing()  { this.tone(1200, 'sine',     0.25, 0.08) }

  playError() {
    this.tone(160, 'sawtooth', 0.35, 0.08)
    setTimeout(() => this.tone(110, 'sawtooth', 0.35, 0.08), 140)
  }

  playJackpot() {
    const notes = [440, 554, 659, 880, 1108, 1318]
    notes.forEach((f, i) => setTimeout(() => this.tone(f, 'sine', 0.18, 0.08), i * 75))
  }
}

export const soundEngine = new SoundEngine()