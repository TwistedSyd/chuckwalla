import { useState, useEffect, useRef } from 'react';
import PianoKeyboard from './PianoKeyboard';
import { notes, chordFormulas, noteDisplay } from '../data/musicTheory';

function ChordsTab({ octave, onOctaveChange, playNote, keyboardActiveKeys = new Set() }) {
  const [rootNote, setRootNote] = useState('C');
  const [chordType, setChordType] = useState('major');
  const [chordNotes, setChordNotes] = useState([]);
  const [chordInfo, setChordInfo] = useState({ intervals: [], formula: '' });
  const [activeKeys, setActiveKeys] = useState(new Set());
  const activeKeysTimeoutRef = useRef(null);

  // Calculate chord notes whenever root or type changes
  useEffect(() => {
    const rootIndex = notes.indexOf(rootNote);
    const formula = chordFormulas[chordType];

    const calculatedNotes = formula.intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return notes[noteIndex];
    });

    setChordNotes(calculatedNotes);
    setChordInfo({ intervals: formula.intervals, formula: formula.formula });
  }, [rootNote, chordType]);

  // Play chord (all notes together)
  const playChord = () => {
    const rootIndex = notes.indexOf(rootNote);
    const octaves = [];
    let lastNoteIndex = rootIndex;
    let currentOctaveOffset = 0;

    chordNotes.forEach((note, index) => {
      const noteIndex = notes.indexOf(note);
      if (index > 0 && noteIndex <= lastNoteIndex) {
        currentOctaveOffset++;
      }
      octaves.push(octave - 1 + currentOctaveOffset);
      lastNoteIndex = noteIndex;
    });

    // Create set of active key IDs
    const keyIds = new Set();
    chordNotes.forEach((note, index) => {
      keyIds.add(`${note}${octaves[index]}`);
    });

    // Light up keys
    setActiveKeys(keyIds);

    // Clear any existing timeout
    if (activeKeysTimeoutRef.current) {
      clearTimeout(activeKeysTimeoutRef.current);
    }

    // Clear active keys after 1 second
    activeKeysTimeoutRef.current = setTimeout(() => {
      setActiveKeys(new Set());
    }, 1000);

    chordNotes.forEach((note, index) => {
      playNote(note, octaves[index], 1);
    });
  };

  // Play arpeggio (one note at a time)
  const playArpeggio = () => {
    const rootIndex = notes.indexOf(rootNote);
    const octaves = [];
    let lastNoteIndex = rootIndex;
    let currentOctaveOffset = 0;

    chordNotes.forEach((note, index) => {
      const noteIndex = notes.indexOf(note);
      if (index > 0 && noteIndex <= lastNoteIndex) {
        currentOctaveOffset++;
      }
      octaves.push(octave - 1 + currentOctaveOffset);
      lastNoteIndex = noteIndex;
    });

    // Clear any existing timeout
    if (activeKeysTimeoutRef.current) {
      clearTimeout(activeKeysTimeoutRef.current);
    }

    chordNotes.forEach((note, index) => {
      setTimeout(() => {
        // Light up current key
        const keyId = `${note}${octaves[index]}`;
        setActiveKeys(new Set([keyId]));

        playNote(note, octaves[index], 0.5);

        // Clear key after 500ms
        setTimeout(() => {
          setActiveKeys(new Set());
        }, 500);
      }, index * 300);
    });
  };

  const notesStr = chordNotes.map(n => noteDisplay[n] || n).join(' - ');

  return (
    <div className="tab-content">
      <div className="controls-section">
        <div className="control-group">
          <h3>Root Note</h3>
          <select value={rootNote} onChange={(e) => setRootNote(e.target.value)}>
            <option value="C">C</option>
            <option value="C#">C# / Db</option>
            <option value="D">D</option>
            <option value="D#">D# / Eb</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="F#">F# / Gb</option>
            <option value="G">G</option>
            <option value="G#">G# / Ab</option>
            <option value="A">A</option>
            <option value="A#">A# / Bb</option>
            <option value="B">B</option>
          </select>
        </div>

        <div className="control-group">
          <h3>Chord Type</h3>
          <select value={chordType} onChange={(e) => setChordType(e.target.value)}>
            <option value="major">Major</option>
            <option value="minor">Minor</option>
            <option value="diminished">Diminished</option>
            <option value="augmented">Augmented</option>
            <option value="sus2">Suspended 2nd (sus2)</option>
            <option value="sus4">Suspended 4th (sus4)</option>
            <option value="major7">Major 7th</option>
            <option value="minor7">Minor 7th</option>
            <option value="dominant7">Dominant 7th</option>
            <option value="diminished7">Diminished 7th</option>
            <option value="major6">Major 6th</option>
            <option value="minor6">Minor 6th</option>
            <option value="major9">Major 9th</option>
            <option value="minor9">Minor 9th</option>
          </select>
        </div>

        <div className="control-group">
          <h3>Actions</h3>
          <div className="action-buttons">
            <button onClick={playChord}>▶ Play Chord</button>
            <button onClick={playArpeggio}>🎵 Play Arpeggio</button>
          </div>
        </div>
      </div>

      <div className="piano-container">
        <div className="piano-octave-controls">
          <span className="octave-label">Octave</span>
          <button className="octave-btn" onClick={() => onOctaveChange(-1)}>−</button>
          <span className="octave-value">{octave}</span>
          <button className="octave-btn" onClick={() => onOctaveChange(1)}>+</button>
        </div>
        <PianoKeyboard
          octave={octave}
          onNotePlay={playNote}
          highlightedNotes={chordNotes}
          rootNote={rootNote}
          externalActiveKeys={new Set([...activeKeys, ...keyboardActiveKeys])}
        />
      </div>

      <div className="info-panel">
        <h2>Chord Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Notes:</label>
            <value>{notesStr}</value>
          </div>
          <div className="info-item">
            <label>Intervals:</label>
            <value>{chordInfo.intervals.join(', ')}</value>
          </div>
          <div className="info-item">
            <label>Formula:</label>
            <value>{chordInfo.formula}</value>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChordsTab;
