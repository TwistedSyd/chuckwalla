import { useState, useEffect, useRef } from 'react';
import GuitarRoadmap from './GuitarRoadmap';
import GuitarFretboard from './GuitarFretboard';
import { chordFormulas, scaleFormulas, notes as musicNotes } from '../data/musicTheory';
import './GuitarPage.css';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const noteDisplay = {
  'C#': 'C♯', 'D#': 'D♯', 'F#': 'F♯', 'G#': 'G♯', 'A#': 'A♯'
};

const tunings = {
  standard: ['E', 'A', 'D', 'G', 'B', 'E'],
  dropd: ['D', 'A', 'D', 'G', 'B', 'E'],
  halfstep: ['D#', 'G#', 'C#', 'F#', 'A#', 'D#']
};

const stringOctaves = [2, 2, 3, 3, 3, 4]; // E2, A2, D3, G3, B3, E4

function GuitarPage() {
  const [currentTab, setCurrentTab] = useState(() => {
    return localStorage.getItem('guitarCurrentTab') || 'play';
  });
  const [tuning, setTuning] = useState('standard');
  const [showNotes, setShowNotes] = useState(true);
  const [chorusEnabled, setChorusEnabled] = useState(false);
  const [reverbEnabled, setReverbEnabled] = useState(false);

  // Chords tab state
  const [chordRoot, setChordRoot] = useState('C');
  const [chordType, setChordType] = useState('major');
  const [chordPositionIndex, setChordPositionIndex] = useState(0);

  // Scales tab state
  const [scaleRoot, setScaleRoot] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  const [scalePosition, setScalePosition] = useState(0);
  const [activeScaleChord, setActiveScaleChord] = useState('scale');

  // Currently playing notes (for display)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(new Set());
  const playingTimeouts = useRef(new Map());

  // Active notes on fretboard (for visual feedback during scale playback)
  const [activeNotes, setActiveNotes] = useState([]);

  const audioContextRef = useRef(null);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // Save current tab to localStorage
  useEffect(() => {
    localStorage.setItem('guitarCurrentTab', currentTab);
  }, [currentTab]);

  // Reset chord position when root note or chord type changes
  useEffect(() => {
    setChordPositionIndex(0);
  }, [chordRoot, chordType, tuning]);

  // Clamp chord position index if it's out of bounds
  useEffect(() => {
    if (currentTab === 'chords') {
      const { notes: chordNotes } = calculateTheoryNotes();
      const allVoicings = findAllChordVoicings(chordRoot, chordNotes);
      if (chordPositionIndex >= allVoicings.length && allVoicings.length > 0) {
        setChordPositionIndex(allVoicings.length - 1);
      }
    }
  }, [chordPositionIndex, chordRoot, chordType, currentTab, tuning]);

  // Clear currently playing notes when switching tabs
  useEffect(() => {
    if (currentTab !== 'play') {
      // Clear all timeouts
      playingTimeouts.current.forEach(timeout => clearTimeout(timeout));
      playingTimeouts.current.clear();
      setCurrentlyPlaying(new Set());
    }
  }, [currentTab]);

  const playNote = (note, octave, duration = 0.5) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    const noteIndex = notes.indexOf(note);
    const A4 = 440;
    const semitones = (octave - 4) * 12 + (noteIndex - 9); // A is at index 9
    const frequency = A4 * Math.pow(2, semitones / 12);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);

    // Update currently playing display (for Free Play tab)
    if (currentTab === 'play') {
      // Add note to currently playing (shows instantly at full opacity)
      setCurrentlyPlaying(prev => new Set([...prev, note]));

      // Clear and set timeout to remove this specific note
      if (playingTimeouts.current.has(note)) {
        clearTimeout(playingTimeouts.current.get(note));
      }

      // Remove note after 800ms
      const timeout = setTimeout(() => {
        setCurrentlyPlaying(prev => {
          const newSet = new Set(prev);
          newSet.delete(note);
          return newSet;
        });
        playingTimeouts.current.delete(note);
      }, 800);

      playingTimeouts.current.set(note, timeout);
    }
  };

  const calculateTheoryNotes = () => {
    const isChordTab = currentTab === 'chords';
    const root = isChordTab ? chordRoot : scaleRoot;
    const type = isChordTab ? chordType : scaleType;
    const formula = isChordTab ? chordFormulas[type] : scaleFormulas[type];

    if (!formula) return { notes: [], formula: null };

    const rootIndex = notes.indexOf(root);
    const theoryNotes = formula.intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return notes[noteIndex];
    });

    return { notes: theoryNotes, formula };
  };

  // Find all frets where the root note appears
  const findRootNoteFrets = (rootNote) => {
    const currentTuning = tunings[tuning];
    const rootFrets = new Set();

    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      const stringNote = currentTuning[stringIndex];
      const stringNoteIndex = notes.indexOf(stringNote);

      for (let fret = 0; fret <= 21; fret++) {
        const fretNoteIndex = (stringNoteIndex + fret) % 12;
        const fretNote = notes[fretNoteIndex];

        if (fretNote === rootNote) {
          rootFrets.add(fret);
        }
      }
    }

    return Array.from(rootFrets).sort((a, b) => a - b);
  };

  // Build a chord voicing from a starting position
  const buildVoicingFromPosition = (startString, startFret, rootNote, chordNotes, maxFretSpan = 5) => {
    const currentTuning = tunings[tuning];
    const voicing = [];
    const usedStrings = new Set();
    const usedDegrees = new Set(); // Track which scale degrees we've already used
    const minFret = Math.max(0, startFret - 1);
    const maxFret = Math.min(21, startFret + maxFretSpan);

    // Calculate scale degrees for each chord note
    const rootIndex = notes.indexOf(rootNote);
    const getScaleDegree = (note) => {
      const noteIndex = notes.indexOf(note);
      return (noteIndex - rootIndex + 12) % 12;
    };

    for (let stringIndex = startString; stringIndex < 6 && voicing.length < 4; stringIndex++) {
      if (usedStrings.has(stringIndex)) continue;

      const stringNote = currentTuning[stringIndex];
      const stringNoteIndex = notes.indexOf(stringNote);
      const stringOctave = stringOctaves[stringIndex];

      let bestMatch = null;
      let bestScore = -1;

      for (let fret = minFret; fret <= maxFret; fret++) {
        const fretNoteIndex = (stringNoteIndex + fret) % 12;
        const fretNote = notes[fretNoteIndex];
        const fretOctave = stringOctave + Math.floor((stringNoteIndex + fret) / 12);

        if (chordNotes.includes(fretNote)) {
          const isRoot = fretNote === rootNote;
          const degree = getScaleDegree(fretNote);

          // For the first note (lowest string), ONLY accept root notes
          if (voicing.length === 0 && !isRoot) {
            continue;
          }

          // Skip if we already have this scale degree
          if (usedDegrees.has(degree)) {
            continue;
          }

          const distance = Math.abs(fret - startFret);

          let score = 10 - distance;
          if (isRoot) score += 20;

          if (score > bestScore) {
            bestScore = score;
            bestMatch = {
              string: stringIndex,
              fret: fret,
              note: fretNote,
              octave: fretOctave,
              isRoot: isRoot,
              degree: degree
            };
          }
        }
      }

      if (bestMatch) {
        voicing.push(bestMatch);
        usedStrings.add(stringIndex);
        usedDegrees.add(bestMatch.degree);
      }
    }

    return voicing.length >= 3 ? voicing : null;
  };

  // Find all possible chord voicings (one unique voicing per root note fret)
  const findAllChordVoicings = (rootNote, chordNotes) => {
    const rootFrets = findRootNoteFrets(rootNote);
    const voicingsByRootFret = new Map();

    // For each root note fret, find the best unique voicing
    rootFrets.forEach(rootFret => {
      // Try different starting strings to find voicings at this root fret
      for (let startString = 0; startString <= 3; startString++) {
        const voicing = buildVoicingFromPosition(startString, rootFret, rootNote, chordNotes);

        if (voicing && voicing.length >= 3) {
          // Create a signature for this voicing (the actual positions on fretboard)
          const voicingSignature = voicing.map(n => `${n.string}-${n.fret}`).sort().join(',');

          // Check if we already have this exact voicing for another root fret
          const isDuplicate = Array.from(voicingsByRootFret.values()).some(v =>
            v.signature === voicingSignature
          );

          // Only add if we don't have a voicing for this root fret yet, and it's not a duplicate
          if (!voicingsByRootFret.has(rootFret) && !isDuplicate) {
            const lowestNote = Math.min(...voicing.map(n => n.octave * 12 + notes.indexOf(n.note)));
            voicingsByRootFret.set(rootFret, {
              notes: voicing,
              lowestNote: lowestNote,
              rootFret: rootFret,
              signature: voicingSignature
            });
            break; // Found a voicing for this root fret, move to next
          }
        }
      }
    });

    // Convert map to array and sort by lowest note
    const allVoicings = Array.from(voicingsByRootFret.values());
    allVoicings.sort((a, b) => a.lowestNote - b.lowestNote);
    return allVoicings;
  };

  // Get the best chord voicing at or near a specific fret
  const getChordVoicingAtFret = (targetFret, rootNote, chordNotes) => {
    const allVoicings = findAllChordVoicings(rootNote, chordNotes);

    if (allVoicings.length === 0) return [];

    let bestVoicing = null;
    let bestScore = Infinity;

    allVoicings.forEach(voicing => {
      const rootNotes = voicing.notes.filter(n => n.isRoot);
      if (rootNotes.length > 0) {
        const closestRoot = rootNotes.reduce((closest, note) => {
          const dist = Math.abs(note.fret - targetFret);
          const closestDist = Math.abs(closest.fret - targetFret);
          return dist < closestDist ? note : closest;
        });

        const distance = Math.abs(closestRoot.fret - targetFret);

        if (distance < bestScore) {
          bestScore = distance;
          bestVoicing = voicing;
        }
      }
    });

    return bestVoicing ? bestVoicing.notes : [];
  };

  const playChord = () => {
    const { notes: chordNotes } = calculateTheoryNotes();
    const allVoicings = findAllChordVoicings(chordRoot, chordNotes);

    if (allVoicings.length === 0) return;

    const voicing = allVoicings[chordPositionIndex]?.notes || [];
    if (voicing.length === 0) return;

    setActiveNotes([]);
    voicing.forEach((pos, index) => {
      setTimeout(() => {
        playNote(pos.note, pos.octave, 2);
      }, index * 100);
    });

    // Light up all notes in the chord
    setActiveNotes(voicing.map(v => ({ string: v.string, fret: v.fret })));

    setTimeout(() => {
      setActiveNotes([]);
    }, 2500);
  };

  const playArpeggio = () => {
    const { notes: chordNotes } = calculateTheoryNotes();
    const allVoicings = findAllChordVoicings(chordRoot, chordNotes);

    if (allVoicings.length === 0) return;

    const voicing = allVoicings[chordPositionIndex]?.notes || [];
    if (voicing.length === 0) return;

    setActiveNotes([]);
    voicing.forEach((pos, index) => {
      setTimeout(() => {
        // Light up this specific note
        setActiveNotes([{ string: pos.string, fret: pos.fret }]);
        playNote(pos.note, pos.octave, 0.5);
      }, index * 250);
    });

    setTimeout(() => {
      setActiveNotes([]);
    }, voicing.length * 250 + 500);
  };

  const playScaleAscending = () => {
    const { notes: scaleNotes } = calculateTheoryNotes();
    const rootNote = currentTab === 'scales' ? scaleRoot : chordRoot;

    // Get all available positions from the box pattern with octave info
    const boxPattern = getScaleBoxPattern(scalePosition, rootNote, scaleNotes);
    if (boxPattern.length === 0) return;

    // Add octave information to each position in the box pattern
    const boxWithOctave = boxPattern.map(pos => {
      const openNote = tunings[tuning][pos.string];
      const openNoteIndex = notes.indexOf(openNote);
      const octave = stringOctaves[pos.string] + Math.floor((openNoteIndex + pos.fret) / 12);
      return { ...pos, octave };
    });

    // Find root notes within the box pattern
    const boxRootNotes = boxWithOctave.filter(n => n.note === rootNote);
    if (boxRootNotes.length === 0) return;

    // Sort box roots by pitch and take the lowest
    boxRootNotes.sort((a, b) => {
      const pitchA = a.octave * 12 + notes.indexOf(a.note);
      const pitchB = b.octave * 12 + notes.indexOf(b.note);
      return pitchA - pitchB;
    });

    const startRoot = boxRootNotes[0];

    // Build ordered scale degrees from root
    const rootIndex = scaleNotes.indexOf(rootNote);
    const orderedScale = [];
    for (let i = 0; i < scaleNotes.length; i++) {
      orderedScale.push(scaleNotes[(rootIndex + i) % scaleNotes.length]);
    }
    orderedScale.push(rootNote); // Add octave root

    // Build the 8-note ascending scale pattern
    const scalePattern = [];
    let currentOctave = startRoot.octave;
    let lastNoteIndex = notes.indexOf(rootNote);

    scalePattern.push(startRoot);

    // For each of the remaining 7 notes, find the best candidate in the box
    for (let i = 1; i < orderedScale.length; i++) {
      const targetNote = orderedScale[i];
      const noteIndex = notes.indexOf(targetNote);

      // Determine target octave
      if (noteIndex <= lastNoteIndex) {
        currentOctave++;
      }

      // Find all instances of this note at this octave in the box
      const candidates = boxWithOctave.filter(n =>
        n.note === targetNote && n.octave === currentOctave
      );

      if (candidates.length > 0) {
        // Choose the one closest to the last played note
        candidates.sort((a, b) => {
          const lastNote = scalePattern[scalePattern.length - 1];
          const distA = Math.abs(a.string - lastNote.string) + Math.abs(a.fret - lastNote.fret);
          const distB = Math.abs(b.string - lastNote.string) + Math.abs(b.fret - lastNote.fret);
          return distA - distB;
        });

        scalePattern.push(candidates[0]);
      }

      lastNoteIndex = noteIndex;
    }

    // Play the sequence with visual feedback
    setActiveNotes([]);
    scalePattern.forEach((pos, index) => {
      setTimeout(() => {
        // Light up the note
        setActiveNotes([{ string: pos.string, fret: pos.fret }]);
        // Play the sound
        playNote(pos.note, pos.octave, 0.5);
      }, index * 250);
    });

    // Clear active notes after sequence completes
    setTimeout(() => {
      setActiveNotes([]);
    }, scalePattern.length * 250 + 500);
  };

  const playScaleDescending = () => {
    const { notes: scaleNotes } = calculateTheoryNotes();
    const rootNote = currentTab === 'scales' ? scaleRoot : chordRoot;

    // Get all available positions from the box pattern with octave info
    const boxPattern = getScaleBoxPattern(scalePosition, rootNote, scaleNotes);
    if (boxPattern.length === 0) return;

    // Add octave information to each position in the box pattern
    const boxWithOctave = boxPattern.map(pos => {
      const openNote = tunings[tuning][pos.string];
      const openNoteIndex = notes.indexOf(openNote);
      const octave = stringOctaves[pos.string] + Math.floor((openNoteIndex + pos.fret) / 12);
      return { ...pos, octave };
    });

    // Find root notes within the box pattern
    const boxRootNotes = boxWithOctave.filter(n => n.note === rootNote);
    if (boxRootNotes.length === 0) return;

    // Sort box roots by pitch and take the lowest
    boxRootNotes.sort((a, b) => {
      const pitchA = a.octave * 12 + notes.indexOf(a.note);
      const pitchB = b.octave * 12 + notes.indexOf(b.note);
      return pitchA - pitchB;
    });

    const startRoot = boxRootNotes[0];

    // Build ordered scale degrees from root
    const rootIndex = scaleNotes.indexOf(rootNote);
    const orderedScale = [];
    for (let i = 0; i < scaleNotes.length; i++) {
      orderedScale.push(scaleNotes[(rootIndex + i) % scaleNotes.length]);
    }
    orderedScale.push(rootNote); // Add octave root

    // Build an 8-note ascending scale, then reverse for descending
    const scalePattern = [];
    let currentOctave = startRoot.octave;
    let lastNoteIndex = notes.indexOf(rootNote);

    scalePattern.push(startRoot);

    // For each of the remaining 7 notes, find the best candidate in the box
    for (let i = 1; i < orderedScale.length; i++) {
      const targetNote = orderedScale[i];
      const noteIndex = notes.indexOf(targetNote);

      // Determine target octave
      if (noteIndex <= lastNoteIndex) {
        currentOctave++;
      }

      // Find all instances of this note at this octave in the box
      const candidates = boxWithOctave.filter(n =>
        n.note === targetNote && n.octave === currentOctave
      );

      if (candidates.length > 0) {
        // Choose the one closest to the last played note
        candidates.sort((a, b) => {
          const lastNote = scalePattern[scalePattern.length - 1];
          const distA = Math.abs(a.string - lastNote.string) + Math.abs(a.fret - lastNote.fret);
          const distB = Math.abs(b.string - lastNote.string) + Math.abs(b.fret - lastNote.fret);
          return distA - distB;
        });

        scalePattern.push(candidates[0]);
      }

      lastNoteIndex = noteIndex;
    }

    // Reverse for descending
    scalePattern.reverse();

    // Play the sequence with visual feedback
    setActiveNotes([]);
    scalePattern.forEach((pos, index) => {
      setTimeout(() => {
        // Light up the note
        setActiveNotes([{ string: pos.string, fret: pos.fret }]);
        // Play the sound
        playNote(pos.note, pos.octave, 0.5);
      }, index * 250);
    });

    // Clear active notes after sequence completes
    setTimeout(() => {
      setActiveNotes([]);
    }, scalePattern.length * 250 + 500);
  };

  const getScaleBoxPattern = (startingFret, rootNote, scaleNotes) => {
    const currentTuning = tunings[tuning];
    const boxNotes = [];

    // Highlight 5 frets starting from the starting fret
    // Position 0: frets 0-4, Position 1: frets 1-5, etc.
    const minFret = startingFret;
    const maxFret = Math.min(21, startingFret + 4);

    // Search all strings within this fret range for scale notes
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      const stringNote = currentTuning[stringIndex];
      const stringNoteIndex = notes.indexOf(stringNote);
      const stringOctave = stringOctaves[stringIndex];

      for (let fret = minFret; fret <= maxFret; fret++) {
        const fretNoteIndex = (stringNoteIndex + fret) % 12;
        const fretNote = notes[fretNoteIndex];

        // Check if this note is in the scale
        if (scaleNotes.includes(fretNote)) {
          boxNotes.push({
            string: stringIndex,
            fret: fret,
            note: fretNote,
            isRoot: fretNote === rootNote
          });
        }
      }
    }

    return boxNotes;
  };

  const renderFretboard = () => {
    const { notes: highlightNotes } = calculateTheoryNotes();
    const currentRoot = currentTab === 'chords' ? chordRoot : scaleRoot;

    // For chords tab, get the specific voicing at the current position
    let boxPattern = null;
    if (currentTab === 'chords') {
      const allVoicings = findAllChordVoicings(chordRoot, highlightNotes);
      const voicing = allVoicings[chordPositionIndex]?.notes || [];
      // Convert voicing to box pattern format
      boxPattern = voicing.map(v => ({
        string: v.string,
        fret: v.fret,
        note: v.note,
        isRoot: v.isRoot
      }));
    } else if (currentTab === 'scales') {
      // For scales tab, get the box pattern for position-based highlighting
      boxPattern = getScaleBoxPattern(scalePosition, currentRoot, highlightNotes);
    }

    return (
      <GuitarFretboard
        tuning={tuning}
        highlightedNotes={currentTab === 'play' ? [] : highlightNotes}
        rootNote={currentTab === 'play' ? null : currentRoot}
        onNotePlay={playNote}
        showNoteLabels={showNotes}
        boxPattern={boxPattern}
        activeNotes={activeNotes}
      />
    );
  };

  const renderInfoPanel = () => {
    const { notes: theoryNotes, formula } = calculateTheoryNotes();
    if (!formula) return null;

    const notesStr = theoryNotes.map(n => noteDisplay[n] || n).join(' - ');

    return (
      <div className="info-panel">
        <h2>{currentTab === 'chords' ? 'Chord' : 'Scale'} Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Notes:</label>
            <value>{notesStr}</value>
          </div>
          <div className="info-item">
            <label>Intervals:</label>
            <value>{formula.intervals.join(', ')}</value>
          </div>
          <div className="info-item">
            <label>Formula:</label>
            <value>{formula.formula}</value>
          </div>
        </div>
        {currentTab === 'scales' && formula.chords && Array.isArray(formula.chords) && (
          <div style={{ marginTop: '20px' }}>
            <label style={{ color: '#888', fontSize: '12px', marginBottom: '10px', display: 'block' }}>Diatonic Chords:</label>
            <div className="chord-buttons-container">
              <button
                className={`chord-button ${activeScaleChord === 'scale' ? 'active' : ''}`}
                onClick={() => setActiveScaleChord('scale')}
              >
                <div className="chord-name">Scale</div>
                <div className="chord-quality">Show All Notes</div>
              </button>
              {formula.chords.map((quality, index) => {
                if (typeof quality !== 'string') return null;
                const degreeNote = theoryNotes[index];
                return (
                  <button
                    key={index}
                    className={`chord-button ${activeScaleChord === index ? 'active' : ''}`}
                    onClick={() => {
                      setActiveScaleChord(index);
                      // Play the diatonic chord
                      const intervals = quality === 'Maj' ? [0, 4, 7] : quality === 'min' ? [0, 3, 7] : quality === 'dim' ? [0, 3, 6] : [0, 4, 8];
                      const rootIndex = notes.indexOf(degreeNote);
                      intervals.forEach((interval, i) => {
                        setTimeout(() => {
                          const note = notes[(rootIndex + interval) % 12];
                          playNote(note, 3, 1);
                        }, i * 100);
                      });
                    }}
                  >
                    <div className="chord-name">{noteDisplay[degreeNote] || degreeNote}</div>
                    <div className="chord-quality">{quality}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="guitar-page">
      <h1>🎸 Guitar</h1>

      <div className="tab-buttons">
        <button className={`tab-button ${currentTab === 'play' ? 'active' : ''}`} onClick={() => setCurrentTab('play')}>Free Play</button>
        <button className={`tab-button ${currentTab === 'chords' ? 'active' : ''}`} onClick={() => setCurrentTab('chords')}>Chords</button>
        <button className={`tab-button ${currentTab === 'scales' ? 'active' : ''}`} onClick={() => setCurrentTab('scales')}>Scales</button>
        <button className={`tab-button ${currentTab === 'roadmap' ? 'active' : ''}`} onClick={() => setCurrentTab('roadmap')}>Learning Roadmap 📚</button>
      </div>

      {currentTab === 'play' && (
        <div className="tab-content active">
          <div className="controls-section">
            <div className="control-group">
              <h3>Currently Playing</h3>
              <div style={{ padding: '8px 12px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '5px', minHeight: '38px' }}>
                <div style={{
                  color: '#f97316',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '2px',
                  opacity: currentlyPlaying.size > 0 ? 1 : 0.5,
                  transition: currentlyPlaying.size > 0 ? 'none' : 'opacity 1s ease-out'
                }}>
                  {currentlyPlaying.size > 0
                    ? Array.from(currentlyPlaying).map(n => noteDisplay[n] || n).join(', ')
                    : '-'}
                </div>
                <div style={{
                  color: '#aaa',
                  fontSize: '12px',
                  opacity: currentlyPlaying.size > 0 ? 1 : 0.5,
                  transition: currentlyPlaying.size > 0 ? 'none' : 'opacity 1s ease-out'
                }}>
                  {currentlyPlaying.size === 0 ? 'Click notes to play' :
                   currentlyPlaying.size === 1 ? 'Single note' :
                   `${currentlyPlaying.size} notes`}
                </div>
              </div>
            </div>

            <div className="control-group">
              <h3>Options</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa', cursor: 'pointer', marginBottom: '6px' }}>
                <input type="checkbox" checked={showNotes} onChange={(e) => setShowNotes(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                <span>Show Note Names</span>
              </label>
              <select value={tuning} onChange={(e) => setTuning(e.target.value)} style={{ width: '100%', padding: '5px', background: '#2d2d2d', border: '1px solid #555', borderRadius: '4px', color: '#fff', fontFamily: 'Courier New, monospace', fontSize: '12px', cursor: 'pointer' }}>
                <option value="standard">Standard</option>
                <option value="dropd">Drop D</option>
                <option value="halfstep">Half Step Down</option>
              </select>
            </div>

            <div className="control-group">
              <h3>Guitar Effects</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
                <button className={`effect-btn ${chorusEnabled ? 'active' : ''}`} onClick={() => setChorusEnabled(!chorusEnabled)}>Chorus</button>
                <button className={`effect-btn ${reverbEnabled ? 'active' : ''}`} onClick={() => setReverbEnabled(!reverbEnabled)}>Reverb</button>
              </div>
            </div>
          </div>
          {renderFretboard()}
        </div>
      )}

      {currentTab === 'chords' && (
        <div className="tab-content active">
          <div className="controls-section">
            <div className="control-group">
              <h3>Root Note</h3>
              <select value={chordRoot} onChange={(e) => setChordRoot(e.target.value)}>
                {notes.map(note => <option key={note} value={note}>{noteDisplay[note] || note}</option>)}
              </select>
            </div>

            <div className="control-group">
              <h3>Chord Type</h3>
              <select value={chordType} onChange={(e) => setChordType(e.target.value)}>
                {Object.entries(chordFormulas).map(([key, data]) => (
                  <option key={key} value={key}>{data.name}</option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <h3>Chord Position</h3>
              <div className="octave-controls">
                <button onClick={() => {
                  const { notes: chordNotes } = calculateTheoryNotes();
                  const allVoicings = findAllChordVoicings(chordRoot, chordNotes);
                  if (allVoicings.length === 0) return;
                  let newIndex = chordPositionIndex - 1;
                  if (newIndex < 0) newIndex = allVoicings.length - 1;
                  setChordPositionIndex(newIndex);
                }}>◀</button>
                <span>Position {chordPositionIndex + 1}</span>
                <button onClick={() => {
                  const { notes: chordNotes } = calculateTheoryNotes();
                  const allVoicings = findAllChordVoicings(chordRoot, chordNotes);
                  if (allVoicings.length === 0) return;
                  let newIndex = chordPositionIndex + 1;
                  if (newIndex >= allVoicings.length) newIndex = 0;
                  setChordPositionIndex(newIndex);
                }}>▶</button>
              </div>
            </div>

            <div className="control-group">
              <h3>Actions</h3>
              <div className="action-buttons">
                <button onClick={playChord}>▶ Play Chord</button>
                <button onClick={playArpeggio}>🎵 Play Arpeggio</button>
              </div>
            </div>
          </div>
          {renderFretboard()}
          {renderInfoPanel()}
        </div>
      )}

      {currentTab === 'scales' && (
        <div className="tab-content active">
          <div className="controls-section">
            <div className="control-group">
              <h3>Root Note</h3>
              <select value={scaleRoot} onChange={(e) => setScaleRoot(e.target.value)}>
                {notes.map(note => <option key={note} value={note}>{noteDisplay[note] || note}</option>)}
              </select>
            </div>

            <div className="control-group">
              <h3>Scale Type</h3>
              <select value={scaleType} onChange={(e) => setScaleType(e.target.value)}>
                {Object.entries(scaleFormulas).map(([key, data]) => (
                  <option key={key} value={key}>{data.name}</option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <h3>Scale Position</h3>
              <div className="octave-controls">
                <button onClick={() => setScalePosition(Math.max(0, scalePosition - 1))}>◀</button>
                <input
                  type="number"
                  id="scale-position-input"
                  min="0"
                  max="17"
                  value={scalePosition}
                  onChange={(e) => setScalePosition(Math.max(0, Math.min(17, parseInt(e.target.value) || 0)))}
                  style={{
                    width: '60px',
                    textAlign: 'center',
                    background: '#2d2d2d',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#f97316',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    padding: '5px',
                    lineHeight: '1',
                    height: '28px',
                    boxSizing: 'border-box'
                  }}
                />
                <button onClick={() => setScalePosition(Math.min(17, scalePosition + 1))}>▶</button>
              </div>
            </div>

            <div className="control-group">
              <h3>Actions</h3>
              <div className="action-buttons">
                <button onClick={playScaleAscending}>🎵 Play Ascending</button>
                <button onClick={playScaleDescending}>🎵 Play Descending</button>
              </div>
            </div>
          </div>
          {renderFretboard()}
          {renderInfoPanel()}
        </div>
      )}

      {currentTab === 'roadmap' && <GuitarRoadmap />}
    </div>
  );
}

export default GuitarPage;
