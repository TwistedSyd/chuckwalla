import { chordFormulas, scaleFormulas } from './musicTheory';

// Standard guitar tuning (E A D G B E)
export const standardTuning = ['E', 'A', 'D', 'G', 'B', 'E'];

export const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Get note at specific fret on specific string
export function getNoteAtFret(stringIndex, fret, tuning = standardTuning) {
  const openNote = tuning[stringIndex];
  const openNoteIndex = notes.indexOf(openNote);
  const noteIndex = (openNoteIndex + fret) % 12;
  return notes[noteIndex];
}

// Common chord shapes (fret positions for each string, -1 means muted, 0 means open)
export const chordShapes = {
  'C': { name: 'C Major', frets: [-1, 3, 2, 0, 1, 0], type: 'major' },
  'C#': { name: 'C# Major', frets: [-1, 4, 3, 1, 2, 1], type: 'major' },
  'D': { name: 'D Major', frets: [-1, -1, 0, 2, 3, 2], type: 'major' },
  'D#': { name: 'D# Major', frets: [-1, -1, 1, 3, 4, 3], type: 'major' },
  'E': { name: 'E Major', frets: [0, 2, 2, 1, 0, 0], type: 'major' },
  'F': { name: 'F Major', frets: [1, 3, 3, 2, 1, 1], type: 'major' },
  'F#': { name: 'F# Major', frets: [2, 4, 4, 3, 2, 2], type: 'major' },
  'G': { name: 'G Major', frets: [3, 2, 0, 0, 0, 3], type: 'major' },
  'G#': { name: 'G# Major', frets: [4, 6, 6, 5, 4, 4], type: 'major' },
  'A': { name: 'A Major', frets: [-1, 0, 2, 2, 2, 0], type: 'major' },
  'A#': { name: 'A# Major', frets: [-1, 1, 3, 3, 3, 1], type: 'major' },
  'B': { name: 'B Major', frets: [-1, 2, 4, 4, 4, 2], type: 'major' },

  'Cm': { name: 'C Minor', frets: [-1, 3, 5, 5, 4, 3], type: 'minor' },
  'C#m': { name: 'C# Minor', frets: [-1, 4, 6, 6, 5, 4], type: 'minor' },
  'Dm': { name: 'D Minor', frets: [-1, -1, 0, 2, 3, 1], type: 'minor' },
  'D#m': { name: 'D# Minor', frets: [-1, -1, 1, 3, 4, 2], type: 'minor' },
  'Em': { name: 'E Minor', frets: [0, 2, 2, 0, 0, 0], type: 'minor' },
  'Fm': { name: 'F Minor', frets: [1, 3, 3, 1, 1, 1], type: 'minor' },
  'F#m': { name: 'F# Minor', frets: [2, 4, 4, 2, 2, 2], type: 'minor' },
  'Gm': { name: 'G Minor', frets: [3, 5, 5, 3, 3, 3], type: 'minor' },
  'G#m': { name: 'G# Minor', frets: [4, 6, 6, 4, 4, 4], type: 'minor' },
  'Am': { name: 'A Minor', frets: [-1, 0, 2, 2, 1, 0], type: 'minor' },
  'A#m': { name: 'A# Minor', frets: [-1, 1, 3, 3, 2, 1], type: 'minor' },
  'Bm': { name: 'B Minor', frets: [-1, 2, 4, 4, 3, 2], type: 'minor' },

  'C7': { name: 'C7', frets: [-1, 3, 2, 3, 1, 0], type: 'dominant7' },
  'D7': { name: 'D7', frets: [-1, -1, 0, 2, 1, 2], type: 'dominant7' },
  'E7': { name: 'E7', frets: [0, 2, 0, 1, 0, 0], type: 'dominant7' },
  'G7': { name: 'G7', frets: [3, 2, 0, 0, 0, 1], type: 'dominant7' },
  'A7': { name: 'A7', frets: [-1, 0, 2, 0, 2, 0], type: 'dominant7' },

  'Cmaj7': { name: 'Cmaj7', frets: [-1, 3, 2, 0, 0, 0], type: 'major7' },
  'Dmaj7': { name: 'Dmaj7', frets: [-1, -1, 0, 2, 2, 2], type: 'major7' },
  'Emaj7': { name: 'Emaj7', frets: [0, 2, 1, 1, 0, 0], type: 'major7' },
  'Gmaj7': { name: 'Gmaj7', frets: [3, 2, 0, 0, 0, 2], type: 'major7' },
  'Amaj7': { name: 'Amaj7', frets: [-1, 0, 2, 1, 2, 0], type: 'major7' },
};

// Get scale pattern on fretboard (returns fret positions for each string within range)
export function getScalePattern(rootNote, scaleType, startFret = 0, endFret = 12) {
  const formula = scaleFormulas[scaleType];
  if (!formula) return [];

  const rootIndex = notes.indexOf(rootNote);
  const scaleNotes = formula.intervals.map(interval =>
    notes[(rootIndex + interval) % 12]
  );

  const pattern = [];

  standardTuning.forEach((openNote, stringIndex) => {
    for (let fret = startFret; fret <= endFret; fret++) {
      const note = getNoteAtFret(stringIndex, fret);
      if (scaleNotes.includes(note)) {
        const degreeIndex = scaleNotes.indexOf(note);
        pattern.push({
          string: stringIndex,
          fret,
          note,
          degree: degreeIndex + 1,
          isRoot: note === rootNote
        });
      }
    }
  });

  return pattern;
}

// Get chord notes on fretboard from shape
export function getChordNotes(chordShape) {
  const chordNotes = [];
  chordShape.frets.forEach((fret, stringIndex) => {
    if (fret >= 0) {
      const note = getNoteAtFret(stringIndex, fret);
      chordNotes.push({
        string: stringIndex,
        fret,
        note
      });
    }
  });
  return chordNotes;
}
