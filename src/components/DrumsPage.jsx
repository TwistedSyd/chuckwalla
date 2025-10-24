import { useState, useEffect, useRef, memo, useCallback } from 'react';
import DrumRoadmap from './DrumRoadmap';
import './DrumsPage.css';

const STEPS = 16;

const patterns = [
  { name: "1. Basic Rock Beat", kick: [0, 4, 8, 12], snare: [4, 12], clap: [], hihat: [0, 2, 4, 6, 8, 10, 12, 14], cymbal: [] },
  { name: "2. Four on the Floor", kick: [0, 4, 8, 12], snare: [4, 12], clap: [], hihat: [2, 6, 10, 14], cymbal: [0] },
  { name: "3. Hip Hop Basic", kick: [0, 6, 10], snare: [4, 12], clap: [4, 12], hihat: [0, 2, 4, 6, 8, 10, 12, 14], cymbal: [] },
  { name: "4. Disco Beat", kick: [0, 4, 8, 12], snare: [], clap: [4, 12], hihat: [2, 6, 10, 14], cymbal: [0, 8] },
  { name: "5. Boom Bap", kick: [0, 10], snare: [4, 12], clap: [4, 12], hihat: [0, 2, 4, 6, 8, 10, 12, 14], cymbal: [] },
  { name: "6. House Basic", kick: [0, 4, 8, 12], snare: [4, 12], clap: [4, 12], hihat: [0, 2, 4, 6, 8, 10, 12, 14], cymbal: [0] },
  { name: "7. Trap Pattern", kick: [0, 3, 6, 10, 13], snare: [4, 12], clap: [], hihat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], cymbal: [] },
  { name: "8. Reggae One Drop", kick: [4, 12], snare: [4, 12], clap: [], hihat: [2, 6, 10, 14], cymbal: [0, 8] },
  { name: "9. Motown Beat", kick: [0, 8], snare: [4, 12], clap: [4, 12], hihat: [0, 2, 4, 6, 8, 10, 12, 14], cymbal: [] },
  { name: "10. Breakbeat", kick: [0, 5, 10], snare: [4, 13], clap: [], hihat: [0, 2, 4, 6, 8, 10, 12, 14], cymbal: [0] }
];

const edmPatterns = [
  { name: "11. Classic House 4x4", kick: [0, 4, 8, 12], snare: [], clap: [4, 12], hihat: [0, 2, 4, 6, 8, 10, 12, 14], cymbal: [0, 8], shaker: [2, 6, 10, 14] },
  { name: "12. Progressive House", kick: [0, 4, 8, 12], snare: [4, 12], clap: [4, 12], hihat: [2, 6, 10, 14], cymbal: [0], perc: [1, 3, 5, 7, 9, 11, 13, 15] },
  { name: "13. Trance Driving", kick: [0, 4, 8, 12], snare: [4, 12], clap: [], hihat: [0, 2, 4, 6, 8, 10, 12, 14], cymbal: [0, 8], rim: [2, 6, 10, 14] },
  { name: "14. Big Room EDM", kick: [0, 4, 8, 12], snare: [4, 12], clap: [4, 12], hihat: [2, 6, 10, 14], cymbal: [0, 8], tom: [3, 7, 11, 15] },
  { name: "15. Dubstep Halftime", kick: [0, 8], snare: [4, 12], clap: [4, 12], hihat: [0, 2, 4, 6, 8, 10, 12, 14], rim: [2, 6, 10, 14], perc: [1, 5, 9, 13] },
  { name: "16. Future Bass", kick: [0, 6, 12], snare: [4, 12], clap: [4, 12], hihat: [0, 3, 6, 9, 12, 15], cymbal: [0, 8], shaker: [0, 3, 6, 9, 12, 15] },
  { name: "17. Tech House Groove", kick: [0, 4, 8, 12], snare: [], clap: [4, 12], hihat: [0, 2, 4, 6, 8, 10, 12, 14], rim: [1, 3, 5, 7, 9, 11, 13, 15], perc: [2, 6, 10, 14] },
  { name: "18. Deep House", kick: [0, 4, 8, 12], snare: [], clap: [4, 12], hihat: [2, 6, 10, 14], cymbal: [0], shaker: [0, 2, 4, 6, 8, 10, 12, 14], rim: [3, 11] },
  { name: "19. Hardstyle Kick Roll", kick: [0, 2, 4, 6, 8, 10, 12, 14], snare: [4, 12], clap: [4, 12], hihat: [2, 6, 10, 14], cymbal: [0, 8], rim: [1, 5, 9, 13] },
  { name: "20. Melodic Techno", kick: [0, 4, 8, 12], snare: [6, 14], clap: [4, 12], hihat: [0, 2, 4, 6, 8, 10, 12, 14], rim: [1, 5, 9, 13], perc: [3, 7, 11, 15], shaker: [2, 10] }
];

const instruments = ['kick', 'snare', 'clap', 'hihat', 'cymbal', 'tom', 'rim', 'shaker', 'perc'];

const PatternGrid = memo(function PatternGrid({ pattern, isEditor, isPlaying, currentStep, onCellClick }) {
  const availableInstruments = instruments.filter(inst => pattern[inst]);

  return (
    <div className="midi-grid">
      {availableInstruments.map(inst => (
        <div key={`row-${inst}`} style={{ display: 'contents' }}>
          <div className={`instrument-label ${inst}`}>
            {inst.toUpperCase()}
          </div>
          {Array.from({ length: STEPS }).map((_, i) => (
            <div
              key={`${inst}-${i}`}
              className={`grid-cell ${inst} ${pattern[inst].includes(i) ? 'active' : ''} ${
                isPlaying && currentStep === i ? 'playing' : ''
              } ${isEditor ? 'editable' : ''}`}
              onMouseDown={isEditor ? (e) => {
                e.preventDefault();
                onCellClick(inst, i);
              } : undefined}
            >
              {(i === 0 || i === 4 || i === 8 || i === 12) && (
                <div className="beat-marker">{(i / 4) + 1}</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

function DrumsPage() {
  const [currentTab, setCurrentTab] = useState(() => {
    return localStorage.getItem('drumsCurrentTab') || 'patterns';
  });
  const [tempo, setTempo] = useState(120);
  const [searchQuery, setSearchQuery] = useState('');
  const [editorVisible, setEditorVisible] = useState(false);
  const [editorPattern, setEditorPattern] = useState(() => {
    const initial = {};
    instruments.forEach(inst => { initial[inst] = []; });
    return initial;
  });
  const [editorName, setEditorName] = useState('My Custom Beat');
  const [userPatterns, setUserPatterns] = useState([]);
  const [playingPattern, setPlayingPattern] = useState(null);
  const [isPlayingEditor, setIsPlayingEditor] = useState(false); // Track if editor is playing
  const [currentStep, setCurrentStep] = useState(0);
  const [tapTimes, setTapTimes] = useState([]);

  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);
  const editorPatternRef = useRef(editorPattern);
  const playingPatternRef = useRef(playingPattern);
  const isPlayingEditorRef = useRef(isPlayingEditor);
  const currentStepRef = useRef(currentStep);

  // Initialize audio context
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // Proactively resume audio context on any interaction
  const ensureAudioReady = async () => {
    const ctx = initAudioContext();
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
        console.log('AudioContext preemptively resumed');
      } catch (err) {
        console.error('Failed to resume AudioContext:', err);
      }
    }
  };

  // Audio synthesis functions
  const createKickDrum = () => {
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Schedule slightly in the future for more reliable playback
    const now = ctx.currentTime + 0.01;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.3);

    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.Q.value = 1;

    gain.gain.setValueAtTime(1.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  };

  const createSnare = () => {
    const ctx = audioContextRef.current;
    const now = ctx.currentTime + 0.01;

    // White noise
    const noise = ctx.createBufferSource();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < output.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    // Tone component
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    noise.start(now);
    osc.start(now);
    noise.stop(now + 0.15);
    osc.stop(now + 0.1);
  };

  const createClap = () => {
    const ctx = audioContextRef.current;
    const now = ctx.currentTime + 0.01;

    for (let i = 0; i < 3; i++) {
      const delay = i * 0.01;
      const noise = ctx.createBufferSource();
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let j = 0; j < output.length; j++) {
        output[j] = Math.random() * 2 - 1;
      }
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      filter.Q.value = 1;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now + delay);
      noise.stop(now + delay + 0.05);
    }
  };

  const createHiHat = () => {
    const ctx = audioContextRef.current;
    const now = ctx.currentTime + 0.01;
    const freqs = [296, 285, 365, 445, 540, 630];
    const gain = ctx.createGain();

    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = freq;
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.04);
    });

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

    gain.connect(filter);
    filter.connect(ctx.destination);
  };

  const createCymbal = () => {
    const ctx = audioContextRef.current;
    const now = ctx.currentTime + 0.01;
    const freqs = [296, 285, 365, 445, 540, 630];
    const gain = ctx.createGain();

    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = freq;
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.5);
    });

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    gain.connect(filter);
    filter.connect(ctx.destination);
  };

  const createTom = () => {
    const ctx = audioContextRef.current;
    const now = ctx.currentTime + 0.01;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  };

  const createRimshot = () => {
    const ctx = audioContextRef.current;
    const now = ctx.currentTime + 0.01;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'square';
    osc2.type = 'square';
    osc1.frequency.value = 1000;
    osc2.frequency.value = 1200;

    filter.type = 'bandpass';
    filter.frequency.value = 1100;
    filter.Q.value = 2;

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.08);
    osc2.stop(now + 0.08);
  };

  const createShaker = () => {
    const ctx = audioContextRef.current;
    const now = ctx.currentTime + 0.01;
    const noise = ctx.createBufferSource();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < output.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 4000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.08);
  };

  const createPerc = () => {
    const ctx = audioContextRef.current;
    const now = ctx.currentTime + 0.01;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  };

  const playSound = (instrument) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Log state for debugging
    if (ctx.state !== 'running') {
      console.warn('⚠️ Trying to play sound while AudioContext is:', ctx.state);
    }

    switch(instrument) {
      case 'kick': createKickDrum(); break;
      case 'snare': createSnare(); break;
      case 'clap': createClap(); break;
      case 'hihat': createHiHat(); break;
      case 'cymbal': createCymbal(); break;
      case 'tom': createTom(); break;
      case 'rim': createRimshot(); break;
      case 'shaker': createShaker(); break;
      case 'perc': createPerc(); break;
    }
  };

  // Pattern playback
  const playPattern = async (pattern, isEditor = false) => {
    stopPattern();

    // FIRST: Ensure audio is ready
    const ctx = initAudioContext();
    if (ctx.state === 'suspended') {
      console.log('🔊 AudioContext suspended, resuming...');
      await ctx.resume();
      console.log('🔊 AudioContext resumed, state:', ctx.state);
      // Wait for audio to actually be ready (increased from 50ms to 100ms)
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('🔊 AudioContext after wait, state:', ctx.state);
    }

    // Update the refs FIRST before setting state
    if (isEditor) {
      editorPatternRef.current = pattern;
      isPlayingEditorRef.current = true;
    } else {
      playingPatternRef.current = pattern;
      isPlayingEditorRef.current = false;
    }

    // Play step 0 immediately now that audio is ready
    console.log('🥁 Playing step 0 immediately, AudioContext state:', ctx.state);
    instruments.forEach(inst => {
      if (pattern[inst] && pattern[inst].includes(0)) {
        console.log('  Playing instrument:', inst);
        playSound(inst);
      }
    });

    // Start at step 0
    setCurrentStep(0);

    // Set the playing pattern which will trigger the useEffect to start the interval
    setPlayingPattern(pattern);
    setIsPlayingEditor(isEditor);
  };

  const stopPattern = () => {
    setPlayingPattern(null);
    setIsPlayingEditor(false);
    setCurrentStep(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Save current tab to localStorage
  useEffect(() => {
    localStorage.setItem('drumsCurrentTab', currentTab);
  }, [currentTab]);

  // Keep refs in sync with state
  useEffect(() => {
    editorPatternRef.current = editorPattern;
  }, [editorPattern]);

  useEffect(() => {
    playingPatternRef.current = playingPattern;
  }, [playingPattern]);

  useEffect(() => {
    isPlayingEditorRef.current = isPlayingEditor;
  }, [isPlayingEditor]);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  // Playback loop - only restart when playingPattern, tempo, or isPlayingEditor changes
  useEffect(() => {
    if (playingPattern) {
      const stepTime = (60 / tempo) * 1000 / 4;

      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          const next = (prev + 1) % STEPS;
          const patternToPlay = isPlayingEditorRef.current ? editorPatternRef.current : playingPatternRef.current;

          instruments.forEach(inst => {
            if (patternToPlay[inst] && patternToPlay[inst].includes(next)) {
              playSound(inst);
            }
          });
          return next;
        });
      }, stepTime);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [playingPattern, tempo, isPlayingEditor]);

  const copyPatternToEditor = (pattern) => {
    const newPattern = {};
    instruments.forEach(inst => {
      newPattern[inst] = pattern[inst] ? [...pattern[inst]] : [];
    });
    setEditorPattern(newPattern);
    setEditorName(pattern.name + ' (Copy)');
    setEditorVisible(true);
    setTimeout(() => {
      document.getElementById('editor-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const toggleEditorCell = useCallback((inst, step) => {
    setEditorPattern(prev => {
      const newPattern = { ...prev };
      const arr = [...newPattern[inst]];
      const index = arr.indexOf(step);
      const isRemoving = index > -1;

      if (isRemoving) {
        arr.splice(index, 1);
      } else {
        arr.push(step);
        arr.sort((a, b) => a - b);
      }
      newPattern[inst] = arr;

      return newPattern;
    });
  }, []); // No dependencies - uses refs instead

  const clearEditor = () => {
    if (confirm('Clear all notes from the editor?')) {
      const cleared = {};
      instruments.forEach(inst => { cleared[inst] = []; });
      setEditorPattern(cleared);
    }
  };

  const savePattern = () => {
    const hasNotes = instruments.some(inst => editorPattern[inst].length > 0);
    if (!hasNotes) {
      alert('Please add some notes to your beat first!');
      return;
    }

    const newPattern = {
      name: `${userPatterns.length + 1}. ${editorName}`,
      ...editorPattern
    };
    setUserPatterns([...userPatterns, newPattern]);
    alert(`Beat "${editorName}" saved!`);
  };

  const deleteUserPattern = (index) => {
    if (confirm(`Delete "${userPatterns[index].name}"?`)) {
      setUserPatterns(userPatterns.filter((_, i) => i !== index));
    }
  };

  const handleTapTempo = () => {
    const now = Date.now();
    const newTapTimes = [...tapTimes, now];

    // Keep only last 4 taps
    if (newTapTimes.length > 4) {
      newTapTimes.shift();
    }

    if (newTapTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTapTimes.length; i++) {
        intervals.push(newTapTimes[i] - newTapTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgInterval);
      setTempo(Math.max(60, Math.min(240, bpm)));
    }

    setTapTimes(newTapTimes);

    // Reset if last tap was more than 3 seconds ago
    setTimeout(() => {
      setTapTimes(prev => {
        if (prev.length > 0 && Date.now() - prev[prev.length - 1] > 3000) {
          return [];
        }
        return prev;
      });
    }, 3000);
  };

  // Filter patterns based on search
  const allPatterns = [...userPatterns, ...patterns, ...edmPatterns];
  const filteredPatterns = allPatterns.filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container drums-page">
      <h1>🥁 Drums</h1>

      <div className="tab-buttons">
        <button
          className={`tab-button ${currentTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setCurrentTab('patterns')}
        >
          Patterns
        </button>
        <button
          className={`tab-button ${currentTab === 'roadmap' ? 'active' : ''}`}
          onClick={() => setCurrentTab('roadmap')}
        >
          Learning Roadmap 📚
        </button>
      </div>

      {currentTab === 'patterns' && (
        <div className="tab-content active">
          <div className="controls-wrapper">
            <div className="tempo-control">
              <label>Tempo (BPM):</label>
              <div className="tempo-inputs">
                <button className="tempo-btn" onClick={() => setTempo(Math.max(60, tempo - 1))}>−</button>
                <input
                  type="number"
                  id="tempo-input"
                  min="60"
                  max="240"
                  value={tempo}
                  onChange={(e) => setTempo(Math.max(60, Math.min(240, Number(e.target.value))))}
                />
                <button className="tempo-btn" onClick={() => setTempo(Math.min(240, tempo + 1))}>+</button>
              </div>
              <button id="tap-tempo" onClick={handleTapTempo}>🎵 Tap Tempo</button>
            </div>

            <div className="search-container">
              <label>Search:</label>
              <input
                type="text"
                id="search-input"
                placeholder="Find a beat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="master-controls">
              <button
                id="create-beat-btn"
                className={editorVisible ? 'active' : ''}
                onClick={() => setEditorVisible(!editorVisible)}
              >
                {editorVisible ? '✓ Close Editor' : '✏️ Create Your Own Beat'}
              </button>
              <button id="stop-all" onClick={stopPattern}>⏹ Stop All</button>
            </div>
          </div>

          {editorVisible && (
            <div className="editor-section visible" id="editor-section">
              <h2>🎹 CREATE YOUR OWN BEAT</h2>
              <div className="editor-controls">
                <input
                  type="text"
                  id="pattern-name"
                  placeholder="Enter beat name..."
                  value={editorName}
                  onChange={(e) => setEditorName(e.target.value)}
                />
                <button id="clear-editor" onClick={clearEditor}>Clear All</button>
                <button id="save-pattern" onClick={savePattern}>Save Pattern</button>
              </div>
              <div className="pattern-container">
                <div className="pattern-header">
                  <div className="pattern-title">Click cells to add/remove notes</div>
                  <button
                    className={`play-button ${isPlayingEditor ? 'playing' : ''}`}
                    onMouseEnter={ensureAudioReady}
                    onClick={() => isPlayingEditor ? stopPattern() : playPattern(editorPattern, true)}
                  >
                    {isPlayingEditor ? '⏹ Stop' : '▶ Play'}
                  </button>
                </div>
                <PatternGrid
                  pattern={editorPattern}
                  isEditor={true}
                  isPlaying={isPlayingEditor}
                  currentStep={currentStep}
                  onCellClick={toggleEditorCell}
                />
              </div>
            </div>
          )}

          <div id="patterns">
            {userPatterns.length > 0 && (
              <>
                <h2>⭐ YOUR CUSTOM BEATS</h2>
                {userPatterns.map((pattern, index) => (
                  <div key={`user-${index}`} className="pattern-container">
                    <div className="pattern-header">
                      <div className="pattern-title">{pattern.name}</div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          className={`play-button ${playingPattern === pattern ? 'playing' : ''}`}
                          onMouseEnter={ensureAudioReady}
                          onClick={() => playingPattern === pattern ? stopPattern() : playPattern(pattern)}
                        >
                          {playingPattern === pattern ? '⏹ Stop' : '▶ Play'}
                        </button>
                        <button
                          className="play-button"
                          style={{ background: 'rgba(139, 92, 246, 0.8)', border: '1px solid rgba(167, 139, 250, 0.5)' }}
                          onClick={() => copyPatternToEditor(pattern)}
                        >
                          📋 Copy
                        </button>
                        <button
                          className="play-button"
                          style={{ background: '#c53030', borderColor: '#c53030' }}
                          onClick={() => deleteUserPattern(index)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                    <PatternGrid
                      pattern={pattern}
                      isEditor={false}
                      isPlaying={playingPattern === pattern}
                      currentStep={currentStep}
                    />
                  </div>
                ))}
              </>
            )}

            {filteredPatterns.filter(p => patterns.includes(p)).map((pattern, index) => (
              <div key={`basic-${index}`} className="pattern-container">
                <div className="pattern-header">
                  <div className="pattern-title">{pattern.name}</div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      className={`play-button ${playingPattern === pattern ? 'playing' : ''}`}
                      onClick={() => playingPattern === pattern ? stopPattern() : playPattern(pattern)}
                    >
                      {playingPattern === pattern ? '⏹ Stop' : '▶ Play'}
                    </button>
                    <button
                      className="play-button"
                      style={{ background: 'rgba(139, 92, 246, 0.8)', border: '1px solid rgba(167, 139, 250, 0.5)' }}
                      onClick={() => copyPatternToEditor(pattern)}
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
                <PatternGrid
                  pattern={pattern}
                  isEditor={false}
                  isPlaying={playingPattern === pattern}
                  currentStep={currentStep}
                />
              </div>
            ))}

            {filteredPatterns.filter(p => edmPatterns.includes(p)).length > 0 && (
              <>
                <h2>🎧 EDM BEATS</h2>
                {filteredPatterns.filter(p => edmPatterns.includes(p)).map((pattern, index) => (
                  <div key={`edm-${index}`} className="pattern-container">
                    <div className="pattern-header">
                      <div className="pattern-title">{pattern.name}</div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          className={`play-button ${playingPattern === pattern ? 'playing' : ''}`}
                          onMouseEnter={ensureAudioReady}
                          onClick={() => playingPattern === pattern ? stopPattern() : playPattern(pattern)}
                        >
                          {playingPattern === pattern ? '⏹ Stop' : '▶ Play'}
                        </button>
                        <button
                          className="play-button"
                          style={{ background: 'rgba(139, 92, 246, 0.8)', border: '1px solid rgba(167, 139, 250, 0.5)' }}
                          onClick={() => copyPatternToEditor(pattern)}
                        >
                          📋 Copy
                        </button>
                      </div>
                    </div>
                    <PatternGrid
                      pattern={pattern}
                      isEditor={false}
                      isPlaying={playingPattern === pattern}
                      currentStep={currentStep}
                    />
                  </div>
                ))}
              </>
            )}

            {filteredPatterns.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                No beats found matching "<strong>{searchQuery}</strong>"
              </div>
            )}
          </div>
        </div>
      )}

      {currentTab === 'roadmap' && <DrumRoadmap />}
    </div>
  );
}

export default DrumsPage;
