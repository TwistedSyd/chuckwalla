import { useState, useEffect, useRef, useMemo } from 'react';
import PianoKeyboard from './PianoKeyboard';
import { detectChord, keyMap, getOctaveOffset } from '../data/musicTheory';

function FreePlayTab({ octave, onOctaveChange, playNote, sustainEnabled, setSustainEnabled, showNoteLabels, setShowNoteLabels, chorusEnabled, toggleChorus, reverbEnabled, toggleReverb, pressedKeys, keyboardActiveKeys }) {
  const [currentlyPlayingNotes, setCurrentlyPlayingNotes] = useState(new Set());
  const [chordInfo, setChordInfo] = useState({ name: '-', notes: 'Play some keys to see the chord' });
  const noteTimeoutsRef = useRef(new Map());

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      noteTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      noteTimeoutsRef.current.clear();
    };
  }, []);

  // Get notes from keyboard presses
  const keyboardNotes = useMemo(() => {
    const noteSet = new Set();
    if (pressedKeys) {
      pressedKeys.forEach(key => {
        const note = keyMap[key.toLowerCase()];
        if (note) {
          noteSet.add(note);
        }
      });
    }
    return noteSet;
  }, [pressedKeys]);

  // Track if notes are currently active (for fade effect)
  const hasActiveNotes = currentlyPlayingNotes.size > 0 || keyboardNotes.size > 0;

  // Update chord display when notes change (combine mouse and keyboard notes)
  useEffect(() => {
    const allNotes = new Set([...currentlyPlayingNotes, ...keyboardNotes]);
    const chord = detectChord(allNotes);
    setChordInfo(chord);
  }, [currentlyPlayingNotes, keyboardNotes]);

  const handleKeyDown = (note, noteOctave) => {
    playNote(note, noteOctave);

    // Clear any existing timeout for this note
    if (noteTimeoutsRef.current.has(note)) {
      clearTimeout(noteTimeoutsRef.current.get(note));
      noteTimeoutsRef.current.delete(note);
    }

    setCurrentlyPlayingNotes(prev => new Set([...prev, note]));
  };

  const handleKeyUp = (note) => {
    // Clear any existing timeout for this note
    if (noteTimeoutsRef.current.has(note)) {
      clearTimeout(noteTimeoutsRef.current.get(note));
    }

    // Set timeout to remove note after 0.5 seconds (matches fade duration)
    const timeout = setTimeout(() => {
      setCurrentlyPlayingNotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
      noteTimeoutsRef.current.delete(note);
    }, 500);

    noteTimeoutsRef.current.set(note, timeout);
  };

  return (
    <div className="tab-content active">
      <div className="controls-section">
        <div className="control-group">
          <h3>Currently Playing</h3>
          <div className="current-chord-display">
            <div
              className="chord-name"
              style={{
                opacity: hasActiveNotes ? 1 : 0.5,
                transition: hasActiveNotes ? 'none' : 'opacity 0.5s ease-out'
              }}
            >
              {chordInfo.name}
            </div>
            <div
              className="chord-notes"
              style={{
                opacity: hasActiveNotes ? 1 : 0.5,
                transition: hasActiveNotes ? 'none' : 'opacity 0.5s ease-out'
              }}
            >
              {chordInfo.notes}
            </div>
          </div>
        </div>

        <div className="control-group">
          <h3>Options</h3>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={sustainEnabled}
              onChange={(e) => setSustainEnabled(e.target.checked)}
            />
            <span>Sustain Pedal</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showNoteLabels}
              onChange={(e) => setShowNoteLabels(e.target.checked)}
            />
            <span>Show Note Labels</span>
          </label>
        </div>

        <div className="control-group">
          <h3>Effects</h3>
          <div className="action-buttons effects-grid">
            <button
              className={`effect-btn ${chorusEnabled ? 'active' : ''}`}
              onClick={toggleChorus}
            >
              Chorus
            </button>
            <button
              className={`effect-btn ${reverbEnabled ? 'active' : ''}`}
              onClick={toggleReverb}
            >
              Reverb
            </button>
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
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          showKeyboardLabels={showNoteLabels}
          externalActiveKeys={keyboardActiveKeys}
        />
      </div>

      <div className="info-panel">
        <h2>Free Play Mode</h2>
        <p>Click on the piano keys or use your keyboard to play notes. Experiment with melodies and practice your skills!</p>
      </div>
    </div>
  );
}

export default FreePlayTab;
