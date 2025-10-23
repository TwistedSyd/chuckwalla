import { useState, useEffect } from 'react';
import { notes, keyMap, firstOctaveKeys } from '../data/musicTheory';
import './PianoKeyboard.css';

function PianoKeyboard({
  octave,
  onNotePlay,
  highlightedNotes = [],
  rootNote = null,
  isInteractive = true,
  showKeyboardLabels = false,
  onKeyDown,
  onKeyUp,
  externalActiveKeys = new Set()
}) {
  const [activeKeys, setActiveKeys] = useState(new Set());

  const blackKeyPositions = {
    'C#': 1.0,
    'D#': 2.0,
    'F#': 4.0,
    'G#': 5.0,
    'A#': 6.0
  };

  const whiteKeyWidth = 50;

  // Handle mouse/touch events
  const handleNoteStart = (note, noteOctave) => {
    if (!isInteractive) return;

    const keyId = `${note}${noteOctave}`;
    setActiveKeys(prev => new Set([...prev, keyId]));
    onNotePlay?.(note, noteOctave);
    onKeyDown?.(note, noteOctave);
  };

  const handleNoteEnd = (note, noteOctave) => {
    if (!isInteractive) return;

    const keyId = `${note}${noteOctave}`;
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(keyId);
      return newSet;
    });
    onKeyUp?.(note, noteOctave);
  };

  // Render a single piano key
  const renderKey = (note, oct) => {
    const isBlackKey = note.includes('#');
    const keyId = `${note}${oct}`;
    const isActive = activeKeys.has(keyId) || externalActiveKeys.has(keyId);
    const isHighlighted = highlightedNotes.includes(note);
    const isRoot = rootNote === note;

    const className = `key ${isBlackKey ? 'black-key' : 'white-key'} ${
      isActive ? 'active' : ''
    } ${isHighlighted ? 'highlighted' : ''} ${isRoot ? 'root' : ''}`;

    const style = isBlackKey ? {
      left: `${((oct - (octave - 1)) * 7 * whiteKeyWidth) + (blackKeyPositions[note] * whiteKeyWidth)}px`
    } : {};

    // Find keyboard key label for Free Play
    let keyboardKey = null;
    if (showKeyboardLabels) {
      if (oct === octave - 1) {
        keyboardKey = Object.keys(keyMap).find(k =>
          keyMap[k] === note && firstOctaveKeys.includes(k)
        );
      } else if (oct === octave) {
        keyboardKey = Object.keys(keyMap).find(k =>
          keyMap[k] === note && !firstOctaveKeys.includes(k)
        );
      }
    }

    // Find interval label
    const intervalIndex = highlightedNotes.indexOf(note);
    const intervalLabel = intervalIndex >= 0 ? (intervalIndex === 0 && isRoot ? 'R' : intervalIndex + 1) : null;

    return (
      <div
        key={keyId}
        className={className}
        style={style}
        onMouseDown={() => handleNoteStart(note, oct)}
        onMouseUp={() => handleNoteEnd(note, oct)}
        onMouseLeave={() => handleNoteEnd(note, oct)}
        onTouchStart={(e) => {
          e.preventDefault();
          handleNoteStart(note, oct);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleNoteEnd(note, oct);
        }}
        onTouchCancel={(e) => {
          e.preventDefault();
          handleNoteEnd(note, oct);
        }}
      >
        {showKeyboardLabels && (
          <div className="key-label">{note}{oct}</div>
        )}
        {keyboardKey && (
          <div className="keyboard-key-label">{keyboardKey.toUpperCase()}</div>
        )}
        {intervalLabel && (
          <div className="interval-label">{intervalLabel}</div>
        )}
      </div>
    );
  };

  return (
    <div className="piano-keyboard">
      {/* Generate 2 octaves worth of keys */}
      {[octave - 1, octave].map(oct => (
        notes.map(note => renderKey(note, oct))
      ))}
      {/* Extra C key at the end (25th key) */}
      {renderKey('C', octave + 1)}
    </div>
  );
}

export default PianoKeyboard;
