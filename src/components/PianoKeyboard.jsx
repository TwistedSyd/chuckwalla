import { useState, memo, useRef } from 'react';
import { notes, keyMap, firstOctaveKeys } from '../data/musicTheory';
import './PianoKeyboard.css';

const PianoKeyboard = memo(function PianoKeyboard({
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
  const activeTouchesRef = useRef(new Map());

  const blackKeyPositions = {
    'C#': 1.0,
    'D#': 2.0,
    'F#': 4.0,
    'G#': 5.0,
    'A#': 6.0
  };

  const whiteKeyWidth = 50;

  const handleMouseDown = (note, noteOctave) => {
    if (!isInteractive) return;

    const keyId = `${note}${noteOctave}`;
    setActiveKeys(prev => new Set([...prev, keyId]));
    onNotePlay?.(note, noteOctave);
    onKeyDown?.(note, noteOctave);
  };

  const handleMouseUp = (note, noteOctave) => {
    if (!isInteractive) return;

    const keyId = `${note}${noteOctave}`;
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(keyId);
      return newSet;
    });
    onKeyUp?.(note, noteOctave);
  };

  const handleTouchStart = (e, note, noteOctave) => {
    if (!isInteractive) return;
    e.preventDefault();

    const keyId = `${note}${noteOctave}`;

    Array.from(e.changedTouches).forEach(touch => {
      activeTouchesRef.current.set(touch.identifier, keyId);
    });

    setActiveKeys(prev => new Set([...prev, keyId]));
    onNotePlay?.(note, noteOctave);
    onKeyDown?.(note, noteOctave);
  };

  const handleTouchEnd = (e, note, noteOctave) => {
    if (!isInteractive) return;
    e.preventDefault();

    const keyId = `${note}${noteOctave}`;

    Array.from(e.changedTouches).forEach(touch => {
      const touchKeyId = activeTouchesRef.current.get(touch.identifier);
      if (touchKeyId === keyId) {
        activeTouchesRef.current.delete(touch.identifier);
      }
    });

    const stillTouched = Array.from(activeTouchesRef.current.values()).includes(keyId);
    if (!stillTouched) {
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(keyId);
        return newSet;
      });
      onKeyUp?.(note, noteOctave);
    }
  };

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

    const intervalIndex = highlightedNotes.indexOf(note);
    const intervalLabel = intervalIndex >= 0 ? (intervalIndex === 0 && isRoot ? 'R' : intervalIndex + 1) : null;

    const keyStyle = isBlackKey ? {
      ...style,
      touchAction: 'none'
    } : {
      touchAction: 'none'
    };

    return (
      <div
        key={keyId}
        className={className}
        style={keyStyle}
        onMouseDown={() => handleMouseDown(note, oct)}
        onMouseUp={() => handleMouseUp(note, oct)}
        onMouseLeave={() => handleMouseUp(note, oct)}
        onTouchStart={(e) => handleTouchStart(e, note, oct)}
        onTouchEnd={(e) => handleTouchEnd(e, note, oct)}
        onTouchCancel={(e) => handleTouchEnd(e, note, oct)}
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
      {[octave - 1, octave].map(oct => (
        notes.map(note => renderKey(note, oct))
      ))}
      {renderKey('C', octave + 1)}
    </div>
  );
});

export default PianoKeyboard;
