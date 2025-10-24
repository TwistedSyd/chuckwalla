import { useState, useEffect, useRef } from 'react';
import GuitarRoadmap from './GuitarRoadmap';
import GuitarFretboard from './GuitarFretboard';
import { chordFormulas, scaleFormulas } from '../data/musicTheory';
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

const stringOctaves = [2, 2, 3, 3, 3, 4];

function GuitarPage() {
  const [currentTab, setCurrentTab] = useState(() => {
    return localStorage.getItem('guitarCurrentTab') || 'play';
  });
  const [tuning, setTuning] = useState('standard');
  const [showNotes, setShowNotes] = useState(true);
  const [chordRoot, setChordRoot] = useState('C');
  const [chordType, setChordType] = useState('major');
  const [chordPositionIndex, setChordPositionIndex] = useState(0);
  const [scaleRoot, setScaleRoot] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  const [scalePosition, setScalePosition] = useState(0);
  const [activeScaleChord, setActiveScaleChord] = useState('scale');
  const [currentlyPlaying, setCurrentlyPlaying] = useState(new Set());
  const playingTimeouts = useRef(new Map());
  const [activeNotes, setActiveNotes] = useState([]);

  const audioContextRef = useRef(null);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // Proactively resume audio context
  const ensureAudioReady = async () => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
        console.log('AudioContext preemptively resumed');
      } catch (err) {
        console.error('Failed to resume AudioContext:', err);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('guitarCurrentTab', currentTab);
  }, [currentTab]);

  useEffect(() => {
    setChordPositionIndex(0);
  }, [chordRoot, chordType, tuning]);

  useEffect(() => {
    if (currentTab === 'chords') {
      const { notes: chordNotes } = calculateTheoryNotes();
      const allVoicings = findAllChordVoicings(chordRoot, chordNotes);
      if (chordPositionIndex >= allVoicings.length && allVoicings.length > 0) {
        setChordPositionIndex(allVoicings.length - 1);
      }
    }
  }, [chordPositionIndex, chordRoot, chordType, currentTab, tuning]);

  useEffect(() => {
    if (currentTab !== 'play') {
      playingTimeouts.current.forEach(timeout => clearTimeout(timeout));
      playingTimeouts.current.clear();
      setCurrentlyPlaying(new Set());
    }
  }, [currentTab]);

  const playNote = async (note, octave, duration = 0.5) => {
    if (!audioContextRef.current) return;

    // Ensure audio is ready first
    await ensureAudioReady();

    const ctx = audioContextRef.current;
    if (ctx.state !== 'running') return;

    const now = ctx.currentTime;

    const noteIndex = notes.indexOf(note);
    const A4 = 440;
    const semitones = (octave - 4) * 12 + (noteIndex - 9);
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

    if (currentTab === 'play') {
      setCurrentlyPlaying(prev => new Set([...prev, note]));

      if (playingTimeouts.current.has(note)) {
        clearTimeout(playingTimeouts.current.get(note));
      }

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

  const buildVoicingFromPosition = (startString, startFret, rootNote, chordNotes, maxFretSpan = 5) => {
    const currentTuning = tunings[tuning];
    const voicing = [];
    const usedStrings = new Set();
    const usedDegrees = new Set();
    const minFret = Math.max(0, startFret - 1);
    const maxFret = Math.min(21, startFret + maxFretSpan);

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

          if (voicing.length === 0 && !isRoot) {
            continue;
          }

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

  const findAllChordVoicings = (rootNote, chordNotes) => {
    const rootFrets = findRootNoteFrets(rootNote);
    const voicingsByRootFret = new Map();

    rootFrets.forEach(rootFret => {
      for (let startString = 0; startString <= 3; startString++) {
        const voicing = buildVoicingFromPosition(startString, rootFret, rootNote, chordNotes);

        if (voicing && voicing.length >= 3) {
          const voicingSignature = voicing.map(n => `${n.string}-${n.fret}`).sort().join(',');

          const isDuplicate = Array.from(voicingsByRootFret.values()).some(v =>
            v.signature === voicingSignature
          );

          if (!voicingsByRootFret.has(rootFret) && !isDuplicate) {
            const lowestNote = Math.min(...voicing.map(n => n.octave * 12 + notes.indexOf(n.note)));
            voicingsByRootFret.set(rootFret, {
              notes: voicing,
              lowestNote: lowestNote,
              rootFret: rootFret,
              signature: voicingSignature
            });
            break;
          }
        }
      }
    });

    const allVoicings = Array.from(voicingsByRootFret.values());
    allVoicings.sort((a, b) => a.lowestNote - b.lowestNote);
    return allVoicings;
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

    const boxPattern = getScaleBoxPattern(scalePosition, rootNote, scaleNotes);
    if (boxPattern.length === 0) return;

    const boxWithOctave = boxPattern.map(pos => {
      const openNote = tunings[tuning][pos.string];
      const openNoteIndex = notes.indexOf(openNote);
      const octave = stringOctaves[pos.string] + Math.floor((openNoteIndex + pos.fret) / 12);
      return { ...pos, octave };
    });

    const boxRootNotes = boxWithOctave.filter(n => n.note === rootNote);
    if (boxRootNotes.length === 0) return;

    boxRootNotes.sort((a, b) => {
      const pitchA = a.octave * 12 + notes.indexOf(a.note);
      const pitchB = b.octave * 12 + notes.indexOf(b.note);
      return pitchA - pitchB;
    });

    const startRoot = boxRootNotes[0];

    const rootIndex = scaleNotes.indexOf(rootNote);
    const orderedScale = [];
    for (let i = 0; i < scaleNotes.length; i++) {
      orderedScale.push(scaleNotes[(rootIndex + i) % scaleNotes.length]);
    }
    orderedScale.push(rootNote);

    const scalePattern = [];
    let currentOctave = startRoot.octave;
    let lastNoteIndex = notes.indexOf(rootNote);

    scalePattern.push(startRoot);

    for (let i = 1; i < orderedScale.length; i++) {
      const targetNote = orderedScale[i];
      const noteIndex = notes.indexOf(targetNote);

      if (noteIndex <= lastNoteIndex) {
        currentOctave++;
      }

      const candidates = boxWithOctave.filter(n =>
        n.note === targetNote && n.octave === currentOctave
      );

      if (candidates.length > 0) {
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

    setActiveNotes([]);
    scalePattern.forEach((pos, index) => {
      setTimeout(() => {
        setActiveNotes([{ string: pos.string, fret: pos.fret }]);
        playNote(pos.note, pos.octave, 0.5);
      }, index * 250);
    });

    setTimeout(() => {
      setActiveNotes([]);
    }, scalePattern.length * 250 + 500);
  };

  const playScaleDescending = () => {
    const { notes: scaleNotes } = calculateTheoryNotes();
    const rootNote = currentTab === 'scales' ? scaleRoot : chordRoot;

    const boxPattern = getScaleBoxPattern(scalePosition, rootNote, scaleNotes);
    if (boxPattern.length === 0) return;

    const boxWithOctave = boxPattern.map(pos => {
      const openNote = tunings[tuning][pos.string];
      const openNoteIndex = notes.indexOf(openNote);
      const octave = stringOctaves[pos.string] + Math.floor((openNoteIndex + pos.fret) / 12);
      return { ...pos, octave };
    });

    const boxRootNotes = boxWithOctave.filter(n => n.note === rootNote);
    if (boxRootNotes.length === 0) return;

    boxRootNotes.sort((a, b) => {
      const pitchA = a.octave * 12 + notes.indexOf(a.note);
      const pitchB = b.octave * 12 + notes.indexOf(b.note);
      return pitchA - pitchB;
    });

    const startRoot = boxRootNotes[0];

    const rootIndex = scaleNotes.indexOf(rootNote);
    const orderedScale = [];
    for (let i = 0; i < scaleNotes.length; i++) {
      orderedScale.push(scaleNotes[(rootIndex + i) % scaleNotes.length]);
    }
    orderedScale.push(rootNote);

    const scalePattern = [];
    let currentOctave = startRoot.octave;
    let lastNoteIndex = notes.indexOf(rootNote);

    scalePattern.push(startRoot);

    for (let i = 1; i < orderedScale.length; i++) {
      const targetNote = orderedScale[i];
      const noteIndex = notes.indexOf(targetNote);

      if (noteIndex <= lastNoteIndex) {
        currentOctave++;
      }

      const candidates = boxWithOctave.filter(n =>
        n.note === targetNote && n.octave === currentOctave
      );

      if (candidates.length > 0) {
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

    scalePattern.reverse();

    setActiveNotes([]);
    scalePattern.forEach((pos, index) => {
      setTimeout(() => {
        setActiveNotes([{ string: pos.string, fret: pos.fret }]);
        playNote(pos.note, pos.octave, 0.5);
      }, index * 250);
    });

    setTimeout(() => {
      setActiveNotes([]);
    }, scalePattern.length * 250 + 500);
  };

  const getScaleBoxPattern = (startingFret, rootNote, scaleNotes) => {
    const currentTuning = tunings[tuning];
    const boxNotes = [];

    const minFret = startingFret;
    const maxFret = Math.min(21, startingFret + 4);

    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      const stringNote = currentTuning[stringIndex];
      const stringNoteIndex = notes.indexOf(stringNote);

      for (let fret = minFret; fret <= maxFret; fret++) {
        const fretNoteIndex = (stringNoteIndex + fret) % 12;
        const fretNote = notes[fretNoteIndex];

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

    let boxPattern = null;
    if (currentTab === 'chords') {
      const allVoicings = findAllChordVoicings(chordRoot, highlightNotes);
      const voicing = allVoicings[chordPositionIndex]?.notes || [];
      boxPattern = voicing.map(v => ({
        string: v.string,
        fret: v.fret,
        note: v.note,
        isRoot: v.isRoot
      }));
    } else if (currentTab === 'scales') {
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

                      const chordRoot = theoryNotes[index];
                      const chordNotes = [
                        theoryNotes[index],
                        theoryNotes[(index + 2) % theoryNotes.length],
                        theoryNotes[(index + 4) % theoryNotes.length]
                      ];

                      const boxPattern = getScaleBoxPattern(scalePosition, scaleRoot, theoryNotes);
                      const boxWithOctaves = boxPattern.map(pos => {
                        const openNote = tunings[tuning][pos.string];
                        const openNoteIndex = notes.indexOf(openNote);
                        const octave = stringOctaves[pos.string] + Math.floor((openNoteIndex + pos.fret) / 12);
                        return { ...pos, octave };
                      });

                      const allRoots = boxWithOctaves.filter(n => n.note === chordRoot);
                      if (allRoots.length === 0) return;

                      allRoots.sort((a, b) => {
                        const pitchA = a.octave * 12 + notes.indexOf(a.note);
                        const pitchB = b.octave * 12 + notes.indexOf(b.note);
                        return pitchA - pitchB;
                      });

                      const bassRoot = allRoots[0];
                      const bassRootPitch = bassRoot.octave * 12 + notes.indexOf(bassRoot.note);
                      const voicingNotes = [bassRoot];

                      for (let i = 1; i < chordNotes.length; i++) {
                        const chordNote = chordNotes[i];
                        const candidates = boxWithOctaves.filter(n => {
                          const pitch = n.octave * 12 + notes.indexOf(n.note);
                          return n.note === chordNote && pitch >= bassRootPitch;
                        });

                        if (candidates.length > 0) {
                          candidates.sort((a, b) => {
                            const pitchA = a.octave * 12 + notes.indexOf(a.note);
                            const pitchB = b.octave * 12 + notes.indexOf(b.note);
                            return pitchA - pitchB;
                          });
                          voicingNotes.push(candidates[0]);
                        }
                      }

                      voicingNotes.sort((a, b) => {
                        const pitchA = a.octave * 12 + notes.indexOf(a.note);
                        const pitchB = b.octave * 12 + notes.indexOf(b.note);
                        return pitchA - pitchB;
                      });

                      setActiveNotes(voicingNotes.map(v => ({ string: v.string, fret: v.fret })));

                      voicingNotes.forEach((note, i) => {
                        setTimeout(() => {
                          playNote(note.note, note.octave, 1);
                        }, i * 100);
                      });

                      setTimeout(() => {
                        setActiveNotes([]);
                      }, 1500);
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
