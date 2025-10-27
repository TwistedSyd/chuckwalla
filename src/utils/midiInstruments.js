import * as Tone from 'tone';

/**
 * General MIDI Instrument Mapper
 * Maps MIDI program numbers to Tone.js synth configurations
 */

export const createInstrument = (programNumber, channel) => {
  // Channel 9 (index 9) is drums in MIDI
  if (channel === 9) {
    return createDrumKit();
  }

  // Piano & Keyboard instruments (0-7)
  if (programNumber >= 0 && programNumber <= 7) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 64,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.005,
        decay: 0.2,
        sustain: 0.5,
        release: 2
      }
    }).toDestination();
  }

  // Chromatic Percussion (8-15)
  if (programNumber >= 8 && programNumber <= 15) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 64,
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.001,
        decay: 0.3,
        sustain: 0.1,
        release: 0.8
      }
    }).toDestination();
  }

  // Organ (16-23)
  if (programNumber >= 16 && programNumber <= 23) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 64,
      oscillator: { type: 'square' },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.9,
        release: 0.5
      }
    }).toDestination();
  }

  // Guitar (24-31)
  if (programNumber >= 24 && programNumber <= 31) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 32,
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.005,
        decay: 0.5,
        sustain: 0.3,
        release: 1.5
      }
    }).toDestination();
  }

  // Bass (32-39)
  if (programNumber >= 32 && programNumber <= 39) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 32,
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.6,
        release: 0.8
      },
      filter: {
        Q: 6,
        type: 'lowpass',
        frequency: 800
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.5,
        release: 0.5,
        baseFrequency: 200,
        octaves: 2.5
      }
    }).toDestination();
  }

  // Strings (40-47)
  if (programNumber >= 40 && programNumber <= 47) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 64,
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.5,
        decay: 0.3,
        sustain: 0.8,
        release: 2
      },
      filter: {
        Q: 2,
        type: 'lowpass',
        frequency: 3000
      }
    }).toDestination();
  }

  // Ensemble (48-55) - Strings, Choir
  if (programNumber >= 48 && programNumber <= 55) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 64,
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.3,
        decay: 0.2,
        sustain: 0.9,
        release: 1.5
      }
    }).toDestination();
  }

  // Brass (56-63)
  if (programNumber >= 56 && programNumber <= 63) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 32,
      oscillator: { type: 'square' },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.8,
        release: 0.5
      }
    }).toDestination();
  }

  // Reed (64-71)
  if (programNumber >= 64 && programNumber <= 71) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 32,
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.05,
        decay: 0.3,
        sustain: 0.7,
        release: 0.8
      }
    }).toDestination();
  }

  // Pipe (72-79)
  if (programNumber >= 72 && programNumber <= 79) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 32,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.05,
        decay: 0.1,
        sustain: 0.8,
        release: 0.5
      }
    }).toDestination();
  }

  // Synth Lead (80-87)
  if (programNumber >= 80 && programNumber <= 87) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 32,
      oscillator: { type: 'square' },
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.5,
        release: 0.5
      }
    }).toDestination();
  }

  // Synth Pad (88-95)
  if (programNumber >= 88 && programNumber <= 95) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 64,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.8,
        decay: 0.5,
        sustain: 0.9,
        release: 3
      }
    }).toDestination();
  }

  // Synth Effects (96-103)
  if (programNumber >= 96 && programNumber <= 103) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 32,
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.1,
        decay: 0.5,
        sustain: 0.5,
        release: 1
      }
    }).toDestination();
  }

  // Ethnic (104-111) - Banjo, etc.
  if (programNumber >= 104 && programNumber <= 111) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 32,
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.2,
        release: 0.8
      }
    }).toDestination();
  }

  // Percussive (112-119)
  if (programNumber >= 112 && programNumber <= 119) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 32,
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0.1,
        release: 0.3
      }
    }).toDestination();
  }

  // Sound Effects (120-127)
  if (programNumber >= 120 && programNumber <= 127) {
    return new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 32,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.01,
        decay: 0.5,
        sustain: 0.3,
        release: 1
      }
    }).toDestination();
  }

  // Default fallback
  return new Tone.PolySynth(Tone.Synth, {
    maxPolyphony: 32,
    oscillator: { type: 'triangle' },
    envelope: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.3,
      release: 1
    }
  }).toDestination();
};

/**
 * Create a basic drum kit using simple synth voices for reliability
 */
const createDrumKit = () => {
  // Use simple PolySynth with basic waveforms for drums - most reliable approach
  const kick = new Tone.PolySynth(Tone.Synth, {
    maxPolyphony: 8,
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.001,
      decay: 0.4,
      sustain: 0.01,
      release: 0.5
    }
  }).toDestination();

  const snare = new Tone.PolySynth(Tone.Synth, {
    maxPolyphony: 8,
    oscillator: { type: 'triangle' },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0.05,
      release: 0.1
    }
  }).toDestination();

  const hihat = new Tone.PolySynth(Tone.Synth, {
    maxPolyphony: 16,
    oscillator: { type: 'square' },
    envelope: {
      attack: 0.001,
      decay: 0.03,
      sustain: 0.01,
      release: 0.03
    }
  }).toDestination();

  const tom = new Tone.PolySynth(Tone.Synth, {
    maxPolyphony: 8,
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.001,
      decay: 0.3,
      sustain: 0.05,
      release: 0.4
    }
  }).toDestination();

  const cymbal = new Tone.PolySynth(Tone.Synth, {
    maxPolyphony: 8,
    oscillator: { type: 'square' },
    envelope: {
      attack: 0.001,
      decay: 0.2,
      sustain: 0.1,
      release: 0.3
    }
  }).toDestination();

  // Map MIDI drum notes to sounds
  return {
    isDrumKit: true,
    triggerAttackRelease: (note, duration, time, velocity) => {
      try {
        const midiNote = Tone.Frequency(note).toMidi();

        // General MIDI drum mapping
        if (midiNote >= 35 && midiNote <= 36) {
          // Bass Drum - low pitch
          kick.triggerAttackRelease('C1', duration, time, velocity);
        } else if (midiNote >= 38 && midiNote <= 40) {
          // Snare - mid-high pitch with short decay
          snare.triggerAttackRelease('C4', duration, time, velocity);
        } else if (midiNote >= 42 && midiNote <= 44) {
          // Closed Hi-hat - very high, very short
          hihat.triggerAttackRelease('C7', duration, time, velocity);
        } else if (midiNote >= 46 && midiNote <= 46) {
          // Open Hi-hat
          hihat.triggerAttackRelease('C6', duration, time, velocity * 0.8);
        } else if ((midiNote >= 41 && midiNote <= 43) || (midiNote >= 47 && midiNote <= 50)) {
          // Toms (low to high)
          const tomPitch = midiNote <= 43 ? 'C2' : midiNote <= 48 ? 'C3' : 'C4';
          tom.triggerAttackRelease(tomPitch, duration, time, velocity);
        } else if (midiNote >= 49 && midiNote <= 59) {
          // Crashes and Rides
          cymbal.triggerAttackRelease('C6', duration, time, velocity);
        } else if (midiNote >= 51 && midiNote <= 53) {
          // Ride cymbal
          cymbal.triggerAttackRelease('C5', duration, time, velocity * 0.7);
        } else {
          // Other percussion - use hihat as default
          hihat.triggerAttackRelease('C6', duration, time, velocity * 0.5);
        }
      } catch (err) {
        console.error('Drum trigger error:', err);
      }
    },
    dispose: () => {
      kick.dispose();
      snare.dispose();
      hihat.dispose();
      tom.dispose();
      cymbal.dispose();
    }
  };
};

export const getInstrumentCategories = () => {
  return [
    { label: 'Piano', range: [0, 7] },
    { label: 'Chromatic Percussion', range: [8, 15] },
    { label: 'Organ', range: [16, 23] },
    { label: 'Guitar', range: [24, 31] },
    { label: 'Bass', range: [32, 39] },
    { label: 'Strings', range: [40, 47] },
    { label: 'Ensemble', range: [48, 55] },
    { label: 'Brass', range: [56, 63] },
    { label: 'Reed', range: [64, 71] },
    { label: 'Pipe', range: [72, 79] },
    { label: 'Synth Lead', range: [80, 87] },
    { label: 'Synth Pad', range: [88, 95] },
    { label: 'Synth Effects', range: [96, 103] },
    { label: 'Ethnic', range: [104, 111] },
    { label: 'Percussive', range: [112, 119] },
    { label: 'Sound Effects', range: [120, 127] }
  ];
};

export const getInstrumentName = (programNumber) => {
  const instrumentNames = [
    // Piano (0-7)
    'Acoustic Grand Piano', 'Bright Acoustic Piano', 'Electric Grand Piano', 'Honky-tonk Piano',
    'Electric Piano 1', 'Electric Piano 2', 'Harpsichord', 'Clavinet',
    // Chromatic Percussion (8-15)
    'Celesta', 'Glockenspiel', 'Music Box', 'Vibraphone',
    'Marimba', 'Xylophone', 'Tubular Bells', 'Dulcimer',
    // Organ (16-23)
    'Drawbar Organ', 'Percussive Organ', 'Rock Organ', 'Church Organ',
    'Reed Organ', 'Accordion', 'Harmonica', 'Tango Accordion',
    // Guitar (24-31)
    'Acoustic Guitar (nylon)', 'Acoustic Guitar (steel)', 'Electric Guitar (jazz)', 'Electric Guitar (clean)',
    'Electric Guitar (muted)', 'Overdriven Guitar', 'Distortion Guitar', 'Guitar Harmonics',
    // Bass (32-39)
    'Acoustic Bass', 'Electric Bass (finger)', 'Electric Bass (pick)', 'Fretless Bass',
    'Slap Bass 1', 'Slap Bass 2', 'Synth Bass 1', 'Synth Bass 2',
    // Strings (40-47)
    'Violin', 'Viola', 'Cello', 'Contrabass',
    'Tremolo Strings', 'Pizzicato Strings', 'Orchestral Harp', 'Timpani',
    // Ensemble (48-55)
    'String Ensemble 1', 'String Ensemble 2', 'Synth Strings 1', 'Synth Strings 2',
    'Choir Aahs', 'Voice Oohs', 'Synth Voice', 'Orchestra Hit',
    // Brass (56-63)
    'Trumpet', 'Trombone', 'Tuba', 'Muted Trumpet',
    'French Horn', 'Brass Section', 'Synth Brass 1', 'Synth Brass 2',
    // Reed (64-71)
    'Soprano Sax', 'Alto Sax', 'Tenor Sax', 'Baritone Sax',
    'Oboe', 'English Horn', 'Bassoon', 'Clarinet',
    // Pipe (72-79)
    'Piccolo', 'Flute', 'Recorder', 'Pan Flute',
    'Blown Bottle', 'Shakuhachi', 'Whistle', 'Ocarina',
    // Synth Lead (80-87)
    'Lead 1 (square)', 'Lead 2 (sawtooth)', 'Lead 3 (calliope)', 'Lead 4 (chiff)',
    'Lead 5 (charang)', 'Lead 6 (voice)', 'Lead 7 (fifths)', 'Lead 8 (bass + lead)',
    // Synth Pad (88-95)
    'Pad 1 (new age)', 'Pad 2 (warm)', 'Pad 3 (polysynth)', 'Pad 4 (choir)',
    'Pad 5 (bowed)', 'Pad 6 (metallic)', 'Pad 7 (halo)', 'Pad 8 (sweep)',
    // Synth Effects (96-103)
    'FX 1 (rain)', 'FX 2 (soundtrack)', 'FX 3 (crystal)', 'FX 4 (atmosphere)',
    'FX 5 (brightness)', 'FX 6 (goblins)', 'FX 7 (echoes)', 'FX 8 (sci-fi)',
    // Ethnic (104-111)
    'Sitar', 'Banjo', 'Shamisen', 'Koto',
    'Kalimba', 'Bagpipe', 'Fiddle', 'Shanai',
    // Percussive (112-119)
    'Tinkle Bell', 'Agogo', 'Steel Drums', 'Woodblock',
    'Taiko Drum', 'Melodic Tom', 'Synth Drum', 'Reverse Cymbal',
    // Sound Effects (120-127)
    'Guitar Fret Noise', 'Breath Noise', 'Seashore', 'Bird Tweet',
    'Telephone Ring', 'Helicopter', 'Applause', 'Gunshot'
  ];

  return instrumentNames[programNumber] || `Program ${programNumber}`;
};
