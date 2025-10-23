// Musical theory data
export const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const noteDisplay = {
  'C#': 'C#/Db',
  'D#': 'D#/Eb',
  'F#': 'F#/Gb',
  'G#': 'G#/Ab',
  'A#': 'A#/Bb'
};

// Chord formulas (semitones from root)
export const chordFormulas = {
  'major': { intervals: [0, 4, 7], name: 'Major', formula: '1-3-5' },
  'minor': { intervals: [0, 3, 7], name: 'Minor', formula: '1-♭3-5' },
  'diminished': { intervals: [0, 3, 6], name: 'Diminished', formula: '1-♭3-♭5' },
  'augmented': { intervals: [0, 4, 8], name: 'Augmented', formula: '1-3-♯5' },
  'sus2': { intervals: [0, 2, 7], name: 'Suspended 2nd', formula: '1-2-5' },
  'sus4': { intervals: [0, 5, 7], name: 'Suspended 4th', formula: '1-4-5' },
  'major7': { intervals: [0, 4, 7, 11], name: 'Major 7th', formula: '1-3-5-7' },
  'minor7': { intervals: [0, 3, 7, 10], name: 'Minor 7th', formula: '1-♭3-5-♭7' },
  'dominant7': { intervals: [0, 4, 7, 10], name: 'Dominant 7th', formula: '1-3-5-♭7' },
  'diminished7': { intervals: [0, 3, 6, 9], name: 'Diminished 7th', formula: '1-♭3-♭5-♭♭7' },
  'major6': { intervals: [0, 4, 7, 9], name: 'Major 6th', formula: '1-3-5-6' },
  'minor6': { intervals: [0, 3, 7, 9], name: 'Minor 6th', formula: '1-♭3-5-6' },
  'major9': { intervals: [0, 4, 7, 11, 14], name: 'Major 9th', formula: '1-3-5-7-9' },
  'minor9': { intervals: [0, 3, 7, 10, 14], name: 'Minor 9th', formula: '1-♭3-5-♭7-9' },
};

// Scale formulas (semitones from root)
export const scaleFormulas = {
  'major': {
    intervals: [0, 2, 4, 5, 7, 9, 11],
    name: 'Major Scale',
    formula: 'W-W-H-W-W-W-H',
    chords: ['I (maj)', 'ii (min)', 'iii (min)', 'IV (maj)', 'V (maj)', 'vi (min)', 'vii° (dim)']
  },
  'minor': {
    intervals: [0, 2, 3, 5, 7, 8, 10],
    name: 'Natural Minor',
    formula: 'W-H-W-W-H-W-W',
    chords: ['i (min)', 'ii° (dim)', 'III (maj)', 'iv (min)', 'v (min)', 'VI (maj)', 'VII (maj)']
  },
  'harmonic-minor': {
    intervals: [0, 2, 3, 5, 7, 8, 11],
    name: 'Harmonic Minor',
    formula: 'W-H-W-W-H-W½-H',
    chords: ['i (min)', 'ii° (dim)', 'III+ (aug)', 'iv (min)', 'V (maj)', 'VI (maj)', 'vii° (dim)']
  },
  'melodic-minor': {
    intervals: [0, 2, 3, 5, 7, 9, 11],
    name: 'Melodic Minor',
    formula: 'W-H-W-W-W-W-H',
    chords: ['i (min)', 'ii (min)', 'III+ (aug)', 'IV (maj)', 'V (maj)', 'vi° (dim)', 'vii° (dim)']
  },
  'pentatonic-major': {
    intervals: [0, 2, 4, 7, 9],
    name: 'Major Pentatonic',
    formula: 'W-W-W½-W-W½',
    chords: ['Limited chord progressions - use major and sus chords']
  },
  'pentatonic-minor': {
    intervals: [0, 3, 5, 7, 10],
    name: 'Minor Pentatonic',
    formula: 'W½-W-W-W½-W',
    chords: ['Limited chord progressions - use minor and power chords']
  },
  'blues': {
    intervals: [0, 3, 5, 6, 7, 10],
    name: 'Blues Scale',
    formula: 'W½-W-H-H-W½-W',
    chords: ['I7, IV7, V7 (dominant 7th chords)']
  },
  'dorian': {
    intervals: [0, 2, 3, 5, 7, 9, 10],
    name: 'Dorian Mode',
    formula: 'W-H-W-W-W-H-W',
    chords: ['i (min)', 'ii (min)', 'III (maj)', 'IV (maj)', 'v (min)', 'vi° (dim)', 'VII (maj)']
  },
  'phrygian': {
    intervals: [0, 1, 3, 5, 7, 8, 10],
    name: 'Phrygian Mode',
    formula: 'H-W-W-W-H-W-W',
    chords: ['i (min)', 'II (maj)', 'III (maj)', 'iv (min)', 'v° (dim)', 'VI (maj)', 'vii (min)']
  },
  'lydian': {
    intervals: [0, 2, 4, 6, 7, 9, 11],
    name: 'Lydian Mode',
    formula: 'W-W-W-H-W-W-H',
    chords: ['I (maj)', 'II (maj)', 'iii (min)', '#iv° (dim)', 'V (maj)', 'vi (min)', 'vii (min)']
  },
  'mixolydian': {
    intervals: [0, 2, 4, 5, 7, 9, 10],
    name: 'Mixolydian Mode',
    formula: 'W-W-H-W-W-H-W',
    chords: ['I (maj)', 'ii (min)', 'iii° (dim)', 'IV (maj)', 'v (min)', 'vi (min)', 'VII (maj)']
  },
  'locrian': {
    intervals: [0, 1, 3, 5, 6, 8, 10],
    name: 'Locrian Mode',
    formula: 'H-W-W-H-W-W-W',
    chords: ['i° (dim)', 'II (maj)', 'iii (min)', 'iv (min)', 'V (maj)', 'VI (maj)', 'vii (min)']
  },
  'chromatic': {
    intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    name: 'Chromatic Scale',
    formula: 'H-H-H-H-H-H-H-H-H-H-H-H',
    chords: ['All 12 chromatic chords available']
  },
  'whole-tone': {
    intervals: [0, 2, 4, 6, 8, 10],
    name: 'Whole Tone Scale',
    formula: 'W-W-W-W-W-W',
    chords: ['Augmented and sus chords']
  },
};

// Keyboard mapping
export const keyMap = {
  // First octave
  'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#',
  'd': 'E', 'f': 'F', 't': 'F#', 'g': 'G',
  'y': 'G#', 'h': 'A', 'u': 'A#', 'j': 'B',
  // Second octave
  'k': 'C', 'i': 'C#', 'l': 'D', 'o': 'D#',
  ';': 'E', "'": 'F', 'p': 'F#', '[': 'G',
  ']': 'G#', '\\': 'A'
};

// Keys in the first octave
export const firstOctaveKeys = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j'];

// Function to get octave offset based on key
export function getOctaveOffset(key) {
  return firstOctaveKeys.includes(key.toLowerCase()) ? 0 : 1;
}

// Generate frequency for a note
export function getNoteFrequency(note, octave) {
  const noteIndex = notes.indexOf(note);
  const A4 = 440;
  const A4Index = 9; // A is at index 9
  const semitones = (octave - 4) * 12 + (noteIndex - A4Index);
  return A4 * Math.pow(2, semitones / 12);
}

// Get chord intervals based on chord quality
export function getChordIntervals(chordQuality) {
  // Parse the chord quality from strings like "I (maj)", "ii (min)", "vii° (dim)"
  if (chordQuality.includes('maj')) {
    return [0, 4, 7]; // Major triad
  } else if (chordQuality.includes('min')) {
    return [0, 3, 7]; // Minor triad
  } else if (chordQuality.includes('dim')) {
    return [0, 3, 6]; // Diminished triad
  } else if (chordQuality.includes('aug')) {
    return [0, 4, 8]; // Augmented triad
  }
  return [0, 4, 7]; // Default to major
}

// Chord patterns for detection
export const chordPatterns = {
  '0,4,7': 'Major',
  '0,3,7': 'Minor',
  '0,3,6': 'Diminished',
  '0,4,8': 'Augmented',
  '0,2,7': 'sus2',
  '0,5,7': 'sus4',
  '0,4,7,11': 'Major 7',
  '0,3,7,10': 'Minor 7',
  '0,4,7,10': 'Dominant 7',
  '0,3,6,9': 'Diminished 7',
  '0,3,6,10': 'Half-diminished 7',
  '0,4,7,9': 'Major 6',
  '0,3,7,9': 'Minor 6',
  '0,4,7,11,14': 'Major 9',
  '0,3,7,10,14': 'Minor 9',
  '0,4,7,10,14': 'Dominant 9',
  '0,2,4,7,9': 'Major add9',
  '0,3,5,7,10': 'Minor add11',
  '0,7': 'Power Chord (5th)',
  '0,5': 'Perfect 4th',
  '0,2': 'Major 2nd',
  '0,3': 'Minor 3rd',
  '0,4': 'Major 3rd',
  '0,6': 'Tritone'
};

// Detect chord from currently playing notes
export function detectChord(notesSet) {
  if (notesSet.size === 0) {
    return { name: '-', notes: 'Play some keys to see the chord' };
  }

  if (notesSet.size === 1) {
    const note = Array.from(notesSet)[0];
    return { name: noteDisplay[note] || note, notes: 'Single note' };
  }

  // Convert set to sorted array of note indices
  const noteIndices = Array.from(notesSet).map(note => notes.indexOf(note)).sort((a, b) => a - b);

  // Try each note as a potential root
  for (let i = 0; i < noteIndices.length; i++) {
    const potentialRoot = noteIndices[i];
    const intervals = noteIndices.map(idx => (idx - potentialRoot + 12) % 12).sort((a, b) => a - b);
    const intervalSig = intervals.join(',');

    const chordType = chordPatterns[intervalSig];
    if (chordType) {
      const root = notes[potentialRoot];
      const rootDisplay = noteDisplay[root] || root;
      const notesList = Array.from(notesSet).map(n => noteDisplay[n] || n).join(', ');

      // Add inversion indicator if not in root position
      const inversionText = i > 0 ? ` (${i === 1 ? '1st' : i === 2 ? '2nd' : i === 3 ? '3rd' : i + 'th'} inv)` : '';

      return {
        name: `${rootDisplay} ${chordType}${inversionText}`,
        notes: notesList
      };
    }
  }

  // If no pattern matched, return custom
  const notesList = Array.from(notesSet).map(n => noteDisplay[n] || n).join(', ');
  return {
    name: 'Custom',
    notes: notesList
  };
}
