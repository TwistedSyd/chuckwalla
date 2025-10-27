import { useState, useRef, useEffect } from 'react';
import { Midi } from '@tonejs/midi';
import * as Tone from 'tone';
import { createInstrument, getInstrumentName, getInstrumentCategories } from '../utils/midiInstruments';
import './MIDIPage.css';

function MIDIPage({ onNavigate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(100);
  const [volume] = useState(80);
  const [trackVolume, setTrackVolume] = useState(100);
  const [midiFile, setMidiFile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activeNotes, setActiveNotes] = useState(new Set());
  const [midiDebugData, setMidiDebugData] = useState(null);
  const [mutedTracks, setMutedTracks] = useState(new Set());
  const [hiddenTracks, setHiddenTracks] = useState(new Set());
  const [instrumentOverrides, setInstrumentOverrides] = useState(new Map()); // trackIndex -> program number

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const visualAnimationRef = useRef(null);
  const synthsRef = useRef(new Map()); // Map of track index to synth
  const scheduledEventsRef = useRef([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Dispose all synths
      synthsRef.current.forEach(synth => synth?.dispose());
      synthsRef.current.clear();
      Tone.Transport.stop();
      Tone.Transport.cancel();
    };
  }, []);

  // Update all synth volumes when trackVolume changes
  useEffect(() => {
    const volumeDb = (trackVolume / 100) * 20 - 20; // Convert 0-100 to dB
    synthsRef.current.forEach(synth => {
      if (synth && synth.volume) {
        synth.volume.value = volumeDb;
      }
    });
  }, [trackVolume]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      console.log('Loading MIDI file:', file.name);

      // Stop and clear any existing playback
      Tone.Transport.stop();
      Tone.Transport.cancel();
      Tone.Transport.position = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      setActiveNotes(new Set());
      setMutedTracks(new Set());
      setHiddenTracks(new Set());
      setInstrumentOverrides(new Map());

      // Dispose old synths
      synthsRef.current.forEach(synth => synth?.dispose());
      synthsRef.current.clear();

      setMidiFile(file.name);
      const arrayBuffer = await file.arrayBuffer();
      const midi = new Midi(arrayBuffer);
      console.log('MIDI loaded. Duration:', midi.duration, 'Tracks:', midi.tracks.length);
      setDuration(midi.duration);

      // Extract all notes from all tracks and create synths
      const allNotes = [];
      const trackInfo = [];

      midi.tracks.forEach((track, trackIndex) => {
        console.log('Track', trackIndex, ':', track.notes.length, 'notes');
        console.log('  Instrument:', track.instrument?.name || track.instrument?.number, 'Channel:', track.channel);

        // Create synth for this track
        const programNumber = track.instrument?.number ?? 0;
        const channel = track.channel ?? 0;
        const synth = createInstrument(programNumber, channel);

        // Set initial volume
        if (synth && synth.volume) {
          synth.volume.value = (trackVolume / 100) * 20 - 20;
        }

        synthsRef.current.set(trackIndex, synth);
        console.log(`  Created ${channel === 9 ? 'drum kit' : 'synth'} for track ${trackIndex}`);

        // Collect track info for debug display
        const trackNotes = track.notes.map(note => ({
          ...note,
          trackIndex,
          midi: note.midi,
          time: note.time,
          duration: note.duration,
          velocity: note.velocity,
          name: note.name
        }));

        trackInfo.push({
          index: trackIndex,
          name: track.name || `Track ${trackIndex + 1}`,
          instrument: track.instrument?.name || track.instrument?.number || 'Unknown',
          instrumentNumber: programNumber,
          noteCount: track.notes.length,
          channel: track.channel,
          notes: trackNotes
        });

        allNotes.push(...trackNotes);
      });

      // Sort notes by time
      allNotes.sort((a, b) => a.time - b.time);
      console.log('Total notes loaded:', allNotes.length);
      setNotes(allNotes);

      // Store debug data
      setMidiDebugData({
        name: file.name,
        duration: midi.duration,
        header: midi.header,
        tracks: trackInfo,
        totalNotes: allNotes.length
      });

      // Schedule all notes on Tone.Transport
      allNotes.forEach(note => {
        const noteId = `${note.midi}-${note.time}-${note.trackIndex}`;
        const synth = synthsRef.current.get(note.trackIndex);

        if (!synth) {
          console.warn(`No synth found for track ${note.trackIndex}`);
          return;
        }

        // Schedule note start
        Tone.Transport.schedule((time) => {
          // Check if track is muted at playback time
          setMutedTracks(currentMuted => {
            if (!currentMuted.has(note.trackIndex)) {
              synth.triggerAttackRelease(
                note.name,
                note.duration,
                time,
                note.velocity
              );
            }
            return currentMuted;
          });

          // Update visual state
          setActiveNotes(prev => new Set([...prev, noteId]));

          // Schedule note end for visual feedback
          Tone.Transport.scheduleOnce(() => {
            setActiveNotes(prev => {
              const newSet = new Set(prev);
              newSet.delete(noteId);
              return newSet;
            });
          }, `+${note.duration}`);
        }, note.time);
      });

      console.log('All notes scheduled on Transport with', synthsRef.current.size, 'instruments');
    } catch (error) {
      console.error('Error loading MIDI file:', error);
      alert(`Error loading MIDI file: ${error.message || 'Unknown error'}. Please try a different MIDI file.`);

      // Clean up on error
      synthsRef.current.forEach(synth => {
        try {
          synth?.dispose();
        } catch (e) {
          console.error('Error disposing synth:', e);
        }
      });
      synthsRef.current.clear();
      Tone.Transport.stop();
      Tone.Transport.cancel();
      setMidiFile(null);
      setNotes([]);
      setMidiDebugData(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setActiveNotes(new Set());
      setMutedTracks(new Set());
      setHiddenTracks(new Set());
      setInstrumentOverrides(new Map());

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePlayPause = async () => {
    console.log('Play/Pause clicked. isPlaying:', isPlaying, 'notes.length:', notes.length);
    if (!isPlaying && notes.length > 0) {
      console.log('Starting playback...');
      await Tone.start(); // Ensure audio context is started
      Tone.Transport.start();
      setIsPlaying(true);
    } else if (isPlaying) {
      console.log('Pausing playback...');
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      console.log('Cannot play: no notes loaded');
    }
  };

  const handleStop = () => {
    console.log('Stopping playback...');
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveNotes(new Set());
  };

  const handleInstrumentChange = (trackIndex, newProgramNumber, channel) => {
    try {
      console.log(`Changing track ${trackIndex} to instrument ${newProgramNumber}`);

      // Update override map
      setInstrumentOverrides(prev => {
        const newMap = new Map(prev);
        newMap.set(trackIndex, newProgramNumber);
        return newMap;
      });

      // Dispose old synth
      const oldSynth = synthsRef.current.get(trackIndex);
      if (oldSynth) {
        oldSynth.dispose();
      }

      // Create new synth with new instrument
      const newSynth = createInstrument(newProgramNumber, channel);
      if (newSynth && newSynth.volume) {
        newSynth.volume.value = (trackVolume / 100) * 20 - 20;
      }
      synthsRef.current.set(trackIndex, newSynth);

      console.log(`Track ${trackIndex} synth updated`);
    } catch (error) {
      console.error('Error changing instrument:', error);
      alert(`Error changing instrument: ${error.message || 'Unknown error'}`);
    }
  };

  // Convert MIDI note number to note name and octave
  const midiToNoteName = (midiNumber) => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNumber / 12) - 1;
    const noteName = noteNames[midiNumber % 12];
    return { note: noteName, octave };
  };

  // Convert note name and octave to MIDI number
  const getMidiNumber = (note, octave) => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteIndex = noteNames.indexOf(note);
    return (octave + 1) * 12 + noteIndex;
  };

  // Update Transport playback rate when speed changes
  useEffect(() => {
    const playbackRate = speed / 100;
    Tone.Transport.bpm.value = 120; // Keep BPM constant
    // Note: Tone.js doesn't have a direct playbackRate for Transport
    // We'd need to reschedule notes or use a different approach
    // For now, keep speed at 100% and we can add speed control later
    console.log('Speed:', speed, '% (speed control to be implemented)');
  }, [speed]);

  // Update current time from Transport
  useEffect(() => {
    if (!isPlaying) return;

    const updateTime = () => {
      const transportTime = Tone.Transport.seconds;
      setCurrentTime(transportTime);

      // Stop if reached end
      if (transportTime >= duration) {
        console.log('Playback finished');
        Tone.Transport.stop();
        Tone.Transport.position = 0;
        setIsPlaying(false);
        setCurrentTime(0);
        setActiveNotes(new Set());
        return;
      }

      requestAnimationFrame(updateTime);
    };

    const frameId = requestAnimationFrame(updateTime);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isPlaying, duration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate full 88-key piano (A0 to C8)
  const renderFullKeyboard = () => {
    const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const blackNotePattern = [
      { note: 'C#', afterWhite: 'C' },
      { note: 'D#', afterWhite: 'D' },
      { note: 'F#', afterWhite: 'F' },
      { note: 'G#', afterWhite: 'G' },
      { note: 'A#', afterWhite: 'A' }
    ];

    const whiteKeys = [];
    const blackKeys = [];
    let whiteKeyIndex = 0;

    // Start from A0, A#0, B0
    whiteKeys.push({ note: 'A', octave: 0, index: whiteKeyIndex++ });
    blackKeys.push({ note: 'A#', octave: 0, afterIndex: whiteKeyIndex - 1 });
    whiteKeys.push({ note: 'B', octave: 0, index: whiteKeyIndex++ });

    // C1 to C8
    for (let octave = 1; octave <= 8; octave++) {
      for (let i = 0; i < whiteNotes.length; i++) {
        whiteKeys.push({ note: whiteNotes[i], octave, index: whiteKeyIndex++ });

        // Add black key after this white key if applicable
        const blackNote = blackNotePattern.find(bn => bn.afterWhite === whiteNotes[i]);
        if (blackNote) {
          blackKeys.push({ note: blackNote.note, octave, afterIndex: whiteKeyIndex - 1 });
        }
      }
      if (octave === 8) break; // Only go up to C8
    }

    return { whiteKeys, blackKeys };
  };

  const { whiteKeys, blackKeys } = renderFullKeyboard();

  // Falling notes visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || notes.length === 0) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      ctx.fillStyle = '#0f0f0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate positions to match keyboard below
      const whiteKeyWidth = 30; // Must match CSS .piano-key.white width
      const numWhiteKeys = 52; // A0 to C8 has 52 white keys
      const totalKeyboardWidth = numWhiteKeys * whiteKeyWidth;
      const keyboardPadding = 20; // Must match CSS padding

      const playbackLineY = canvas.height * 0.85;
      const fallDistance = playbackLineY;
      const lookAheadTime = 3;

      // Draw playback line
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, playbackLineY);
      ctx.lineTo(canvas.width, playbackLineY);
      ctx.stroke();

      // Helper to get white key index for a MIDI note
      // This must match exactly how the keyboard component counts keys
      const getWhiteKeyIndex = (midiNote) => {
        // Count white keys from A0 (MIDI 21) up to and including this note
        let whiteKeyCount = 0;

        for (let midi = 21; midi <= midiNote; midi++) {
          const noteInOctave = midi % 12;
          // Check if this MIDI note is a white key
          // White keys: 0(C), 2(D), 4(E), 5(F), 7(G), 9(A), 11(B)
          if ([0, 2, 4, 5, 7, 9, 11].includes(noteInOctave)) {
            whiteKeyCount++;
          }
        }

        // Return the index (0-based), so subtract 1
        return whiteKeyCount - 1;
      };

      const isBlackKey = (midiNote) => {
        const noteInOctave = midiNote % 12;
        return [1, 3, 6, 8, 10].includes(noteInOctave); // C#, D#, F#, G#, A#
      };

      // Draw notes
      notes.forEach(note => {
        // Skip hidden tracks
        if (hiddenTracks.has(note.trackIndex)) {
          return;
        }

        const timeUntilNote = note.time - currentTime;

        if (timeUntilNote >= -0.1 && timeUntilNote <= lookAheadTime) {
          const progress = 1 - (timeUntilNote / lookAheadTime);
          const noteY = progress * fallDistance;
          const noteHeight = Math.max(4, note.duration * (fallDistance / lookAheadTime));

          const whiteKeyIndex = getWhiteKeyIndex(note.midi);
          const isBlack = isBlackKey(note.midi);

          // Position based on white key, with offset for black keys
          let noteX = keyboardPadding + (whiteKeyIndex * whiteKeyWidth);
          let noteWidth = whiteKeyWidth - 2;

          if (isBlack) {
            // Black keys are offset to the right of their white key
            noteX += whiteKeyWidth * 0.65;
            noteWidth = 20 - 2; // Match black key width
          }

          // Center the note
          noteX += (isBlack ? 10 : whiteKeyWidth / 2) - noteWidth / 2;

          // Color based on track
          const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3'];
          ctx.fillStyle = colors[note.trackIndex % colors.length];

          const noteId = `${note.midi}-${note.time}-${note.trackIndex}`;
          if (activeNotes.has(noteId)) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = ctx.fillStyle;
          }

          ctx.fillRect(noteX, noteY, noteWidth, noteHeight);

          if (activeNotes.has(noteId)) {
            ctx.shadowBlur = 0;
          }
        }
      });

      visualAnimationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (visualAnimationRef.current) {
        cancelAnimationFrame(visualAnimationRef.current);
      }
    };
  }, [notes, currentTime, activeNotes, hiddenTracks]);

  return (
    <div className="midi-page">
      {/* Control Bar */}
      <div className="midi-control-bar">
        <div className="control-section left">
          <button className="home-btn" onClick={() => onNavigate('home')}>
            <svg className="home-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </button>
          <button className="control-btn" onClick={() => fileInputRef.current?.click()}>
            <span className="icon">📁</span>
            <span>Open</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".mid,.midi"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button className="control-btn">
            <span className="icon">🎚️</span>
            <span>Tracks</span>
          </button>
          <button className="control-btn">
            <span className="icon">🎵</span>
            <span>Songs</span>
          </button>
          <button className="control-btn">
            <span className="icon">🎹</span>
            <span>MIDI</span>
          </button>
        </div>

        <div className="control-section center">
          <button className="playback-btn" onClick={handlePlayPause}>
            <span className="icon">{isPlaying ? '⏸️' : '▶️'}</span>
          </button>
          <button className="playback-btn" onClick={handleStop}>
            <span className="icon">⏹️</span>
          </button>
        </div>

        <div className="control-section right">
          <div className="speed-control">
            <button onClick={() => setSpeed(Math.max(25, speed - 25))}>▲</button>
            <span>{speed}%</span>
            <button onClick={() => setSpeed(Math.min(200, speed + 25))}>▼</button>
          </div>
          <div className="track-volume-control">
            <span className="icon">🎚️</span>
            <span>Track</span>
            <input
              type="range"
              min="0"
              max="100"
              value={trackVolume}
              onChange={(e) => setTrackVolume(Number(e.target.value))}
            />
          </div>
          <div className="volume-control">
            <span className="icon">🔊</span>
            <span>Volume</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </div>
          <button className="control-btn icon-only">
            <span className="icon">⚙️</span>
          </button>
        </div>
      </div>

      {/* Time Display */}
      <div className="midi-time-display">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Falling Notes Visualization */}
      <div className="midi-visualization">
        {!midiFile ? (
          <div className="empty-state">
            <p>Load a MIDI file to begin</p>
            <button className="load-file-btn" onClick={() => fileInputRef.current?.click()}>
              📁 Open MIDI File
            </button>
          </div>
        ) : (
          <>
            <canvas ref={canvasRef} className="falling-notes-canvas" />
            {/* Debug Panel */}
            {midiDebugData && (
              <div className="midi-debug-panel">
                <h3>🔍 MIDI Debug Info</h3>
                <div className="debug-section">
                  <strong>File:</strong> {midiDebugData.name}
                </div>
                <div className="debug-section">
                  <strong>Duration:</strong> {midiDebugData.duration.toFixed(2)}s
                </div>
                <div className="debug-section">
                  <strong>Total Notes:</strong> {midiDebugData.totalNotes}
                </div>
                <div className="debug-section">
                  <strong>PPQ:</strong> {midiDebugData.header?.ppq || 'N/A'}
                </div>
                <div className="debug-section">
                  <strong>Tracks:</strong> {midiDebugData.tracks.length}
                </div>
                <div className="tracks-list">
                  {midiDebugData.tracks.map((track, idx) => {
                    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3'];
                    const trackColor = colors[track.index % colors.length];
                    const isMuted = mutedTracks.has(track.index);
                    const isHidden = hiddenTracks.has(track.index);

                    const toggleMute = () => {
                      setMutedTracks(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(track.index)) {
                          newSet.delete(track.index);
                        } else {
                          newSet.add(track.index);
                        }
                        return newSet;
                      });
                    };

                    const toggleVisibility = () => {
                      setHiddenTracks(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(track.index)) {
                          newSet.delete(track.index);
                        } else {
                          newSet.add(track.index);
                        }
                        return newSet;
                      });
                    };

                    return (
                      <div key={idx} className="track-item" style={{ borderLeft: `4px solid ${trackColor}` }}>
                        <div className="track-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              className="track-color-indicator"
                              style={{ backgroundColor: trackColor }}
                              title={`Color: ${trackColor}`}
                            />
                            <span className="track-index">Track {track.index + 1}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              className={`track-control-btn ${isMuted ? 'active' : ''}`}
                              onClick={toggleMute}
                              title={isMuted ? 'Unmute track' : 'Mute track'}
                            >
                              {isMuted ? '🔇' : '🔊'}
                            </button>
                            <button
                              className={`track-control-btn ${isHidden ? 'active' : ''}`}
                              onClick={toggleVisibility}
                              title={isHidden ? 'Show track' : 'Hide track'}
                            >
                              {isHidden ? '👁️' : '👁️‍🗨️'}
                            </button>
                          </div>
                        </div>
                        <div className="track-info">
                          <div><strong>Name:</strong> {track.name}</div>
                          <div>
                            <strong>Instrument:</strong> {track.instrument}
                            {instrumentOverrides.has(track.index) &&
                              <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}> (Modified)</span>
                            }
                          </div>
                          <div><strong>Channel:</strong> {track.channel !== undefined ? track.channel : 'N/A'}</div>
                          <div><strong>Color:</strong> <span style={{ color: trackColor, fontWeight: 'bold' }}>{trackColor}</span></div>
                          <div style={{ marginTop: '8px' }}>
                            <label style={{ fontSize: '10px', color: '#999', display: 'block', marginBottom: '4px' }}>
                              Change Instrument:
                            </label>
                            <select
                              className="instrument-select"
                              value={instrumentOverrides.get(track.index) ?? track.instrumentNumber ?? 0}
                              onChange={(e) => handleInstrumentChange(track.index, parseInt(e.target.value), track.channel)}
                            >
                              {getInstrumentCategories().map(category => {
                                const instruments = [];
                                for (let i = category.range[0]; i <= category.range[1]; i++) {
                                  instruments.push(
                                    <option key={i} value={i}>
                                      {getInstrumentName(i)}
                                    </option>
                                  );
                                }
                                return (
                                  <optgroup key={category.label} label={category.label}>
                                    {instruments}
                                  </optgroup>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                        <div className="track-note-range">
                          {track.noteCount > 0 && (
                            <>
                              <strong>Note Range:</strong> {track.notes[0].name} to{' '}
                              {track.notes[track.notes.length - 1].name}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Full Piano Keyboard */}
      <div className="midi-keyboard-container">
        <div className="midi-keyboard">
          {/* Render white keys */}
          {whiteKeys.map((key) => {
            const keyId = `${key.note}${key.octave}`;
            const midiNumber = getMidiNumber(key.note, key.octave);
            const isActive = Array.from(activeNotes).some(noteId => {
              const [midi] = noteId.split('-');
              return parseInt(midi) === midiNumber;
            });
            return (
              <div
                key={keyId}
                className={`piano-key white ${isActive ? 'active' : ''}`}
                data-note={key.note}
                data-octave={key.octave}
              >
                <span className="key-label">{key.note}{key.octave}</span>
                <span className="key-debug">MIDI: {midiNumber}</span>
                <span className="key-debug-index">WK: {key.index}</span>
              </div>
            );
          })}
          {/* Render black keys positioned absolutely */}
          {blackKeys.map((key) => {
            const keyId = `${key.note}${key.octave}`;
            // Position black key at the right edge of the white key it comes after
            // 20px padding + (afterIndex + 1) * 30px white key width
            // The margin-left: -10px in CSS will center it between white keys
            const leftPosition = 20 + ((key.afterIndex + 1) * 30);
            const midiNumber = getMidiNumber(key.note, key.octave);
            const isActive = Array.from(activeNotes).some(noteId => {
              const [midi] = noteId.split('-');
              return parseInt(midi) === midiNumber;
            });
            return (
              <div
                key={keyId}
                className={`piano-key black ${isActive ? 'active' : ''}`}
                style={{ left: `${leftPosition}px` }}
                data-note={key.note}
                data-octave={key.octave}
              >
                <span className="key-label-black">{key.note}{key.octave}</span>
                <span className="key-debug-black">M:{midiNumber}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MIDIPage;
