import { useState, useEffect, useRef } from 'react';
import PianoKeyboard from './PianoKeyboard';
import { notes, scaleFormulas, noteDisplay, getChordIntervals } from '../data/musicTheory';

function ScalesTab({ octave, onOctaveChange, playNote, keyboardActiveKeys = new Set() }) {
  const [rootNote, setRootNote] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  const [scaleNotes, setScaleNotes] = useState([]);
  const [scaleInfo, setScaleInfo] = useState({ intervals: [], formula: '', chords: [] });
  const [activeChordButton, setActiveChordButton] = useState('scale');
  const [displayedNotes, setDisplayedNotes] = useState([]);
  const [currentRootNote, setCurrentRootNote] = useState('C');
  const [activeKeys, setActiveKeys] = useState(new Set());
  const activeKeysTimeoutRef = useRef(null);

  // Calculate scale notes whenever root or type changes
  useEffect(() => {
    const rootIndex = notes.indexOf(rootNote);
    const formula = scaleFormulas[scaleType];

    const calculatedNotes = formula.intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return notes[noteIndex];
    });

    setScaleNotes(calculatedNotes);
    setScaleInfo({
      intervals: formula.intervals,
      formula: formula.formula,
      chords: formula.chords
    });
    setDisplayedNotes(calculatedNotes);
    setCurrentRootNote(rootNote);
    setActiveChordButton('scale');
  }, [rootNote, scaleType]);

  // Play scale ascending
  const playAscending = () => {
    const rootIndex = notes.indexOf(rootNote);
    const notesToPlay = [...scaleNotes, scaleNotes[0]]; // Add root at end
    const octaves = [];
    let lastNoteIndex = rootIndex;
    let currentOctaveOffset = 0;

    notesToPlay.forEach((note, index) => {
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

    notesToPlay.forEach((note, index) => {
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

  // Play scale descending
  const playDescending = () => {
    const rootIndex = notes.indexOf(rootNote);
    const notesToPlay = [...scaleNotes, scaleNotes[0]]; // Add root at end
    const octaves = [];
    let lastNoteIndex = rootIndex;
    let currentOctaveOffset = 0;

    notesToPlay.forEach((note, index) => {
      const noteIndex = notes.indexOf(note);
      if (index > 0 && noteIndex <= lastNoteIndex) {
        currentOctaveOffset++;
      }
      octaves.push(octave - 1 + currentOctaveOffset);
      lastNoteIndex = noteIndex;
    });

    const descendingNotes = [...notesToPlay].reverse();
    const descendingOctaves = [...octaves].reverse();

    // Clear any existing timeout
    if (activeKeysTimeoutRef.current) {
      clearTimeout(activeKeysTimeoutRef.current);
    }

    descendingNotes.forEach((note, index) => {
      setTimeout(() => {
        // Light up current key
        const keyId = `${note}${descendingOctaves[index]}`;
        setActiveKeys(new Set([keyId]));

        playNote(note, descendingOctaves[index], 0.5);

        // Clear key after 500ms
        setTimeout(() => {
          setActiveKeys(new Set());
        }, 500);
      }, index * 300);
    });
  };

  // Play a diatonic chord
  const playDiatonicChord = (chordRoot, chordIntervals) => {
    const rootIndex = notes.indexOf(chordRoot);
    const chordNotes = chordIntervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return notes[noteIndex];
    });

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

    // Update displayed notes and root
    setDisplayedNotes(chordNotes);
    setCurrentRootNote(chordRoot);
  };

  // Handle scale button click
  const handleScaleButtonClick = () => {
    setActiveChordButton('scale');
    setDisplayedNotes(scaleNotes);
    setCurrentRootNote(rootNote);
  };

  // Handle chord button click
  const handleChordButtonClick = (index, chordRoot, chordQuality) => {
    setActiveChordButton(index);
    const chordIntervals = getChordIntervals(chordQuality);
    setDisplayedNotes(chordIntervals.map(interval => {
      const noteIndex = (notes.indexOf(chordRoot) + interval) % 12;
      return notes[noteIndex];
    }));
    setCurrentRootNote(chordRoot);
    playDiatonicChord(chordRoot, chordIntervals);
  };

  const notesStr = scaleNotes.map(n => noteDisplay[n] || n).join(' - ');

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
          <h3>Scale Type</h3>
          <select value={scaleType} onChange={(e) => setScaleType(e.target.value)}>
            <option value="major">Major (Ionian)</option>
            <option value="minor">Natural Minor (Aeolian)</option>
            <option value="harmonic-minor">Harmonic Minor</option>
            <option value="melodic-minor">Melodic Minor</option>
            <option value="pentatonic-major">Pentatonic Major</option>
            <option value="pentatonic-minor">Pentatonic Minor</option>
            <option value="blues">Blues</option>
            <option value="dorian">Dorian</option>
            <option value="phrygian">Phrygian</option>
            <option value="lydian">Lydian</option>
            <option value="mixolydian">Mixolydian</option>
            <option value="locrian">Locrian</option>
            <option value="chromatic">Chromatic</option>
            <option value="whole-tone">Whole Tone</option>
          </select>
        </div>

        <div className="control-group">
          <h3>Actions</h3>
          <div className="action-buttons">
            <button onClick={playAscending}>🎵 Play Ascending</button>
            <button onClick={playDescending}>🎵 Play Descending</button>
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
          highlightedNotes={displayedNotes}
          rootNote={currentRootNote}
          externalActiveKeys={new Set([...activeKeys, ...keyboardActiveKeys])}
        />
      </div>

      <div className="info-panel">
        <h2>Scale Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Notes:</label>
            <value>{notesStr}</value>
          </div>
          <div className="info-item">
            <label>Intervals:</label>
            <value>{scaleInfo.intervals.join(', ')}</value>
          </div>
          <div className="info-item">
            <label>Formula:</label>
            <value>{scaleInfo.formula}</value>
          </div>
        </div>
        <div className="info-item" style={{ marginTop: '15px' }}>
          <label>Diatonic Chords:</label>
          <div className="chord-buttons-container">
            {Array.isArray(scaleInfo.chords) && scaleInfo.chords.length > 1 ? (
              <>
                <button
                  className={`chord-button ${activeChordButton === 'scale' ? 'active' : ''}`}
                  onClick={handleScaleButtonClick}
                >
                  <div className="chord-name">Scale</div>
                  <div className="chord-quality">Show All Notes</div>
                </button>
                {scaleInfo.chords.map((chordQuality, index) => {
                  const rootIndex = notes.indexOf(rootNote);
                  const scaleNoteIndex = (rootIndex + scaleInfo.intervals[index]) % 12;
                  const scaleDegreeNote = notes[scaleNoteIndex];
                  const scaleDegreeName = noteDisplay[scaleDegreeNote] || scaleDegreeNote;

                  return (
                    <button
                      key={index}
                      className={`chord-button ${activeChordButton === index ? 'active' : ''}`}
                      onClick={() => handleChordButtonClick(index, scaleDegreeNote, chordQuality)}
                    >
                      <div className="chord-name">{scaleDegreeName}</div>
                      <div className="chord-quality">{chordQuality}</div>
                    </button>
                  );
                })}
              </>
            ) : (
              <div style={{ color: '#aaa', padding: '10px' }}>
                {scaleInfo.chords[0]}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScalesTab;
