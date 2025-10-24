import { useState, useEffect, useMemo, useRef } from 'react';
import HomePage from './components/HomePage';
import Navigation from './components/Navigation';
import MIDIStatus from './components/MIDIStatus';
import FreePlayTab from './components/FreePlayTab';
import ChordsTab from './components/ChordsTab';
import ScalesTab from './components/ScalesTab';
import LearningRoadmap from './components/LearningRoadmap';
import DrumsPage from './components/DrumsPage';
import GuitarPage from './components/GuitarPage';
import CircleOfFifthsPage from './components/CircleOfFifthsPage';
import { useAudio } from './hooks/useAudio';
import { useMIDI } from './hooks/useMIDI';
import { keyMap, getOctaveOffset } from './data/musicTheory';
import './App.css';

function App() {
  // Initialize page from URL hash, defaulting to home
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.slice(1);
    // Only use hash if it exists and is not empty
    return hash || 'home';
  });
  const [currentTab, setCurrentTab] = useState(() => {
    return localStorage.getItem('pianoCurrentTab') || 'play';
  });
  const [octavePlay, setOctavePlay] = useState(4);
  const [octaveTheory, setOctaveTheory] = useState(4);
  const [showNoteLabels, setShowNoteLabels] = useState(true);
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [midiActiveKeys, setMidiActiveKeys] = useState(new Set());

  // Convert pressed keyboard keys to piano key IDs for visual feedback
  const keyboardActiveKeys = useMemo(() => {
    const activeSet = new Set();
    if (pressedKeys) {
      pressedKeys.forEach(key => {
        const note = keyMap[key.toLowerCase()];
        if (note) {
          const octaveOffset = getOctaveOffset(key);
          // Use the appropriate octave based on current tab
          const currentOctave = (currentTab === 'chords' || currentTab === 'scales') ? octaveTheory : octavePlay;
          const noteOctave = currentOctave - 1 + octaveOffset;
          activeSet.add(`${note}${noteOctave}`);
        }
      });
    }
    return activeSet;
  }, [pressedKeys, octavePlay, octaveTheory, currentTab]);

  // Combine keyboard and MIDI active keys for visual feedback
  const allActiveKeys = useMemo(() => {
    return new Set([...keyboardActiveKeys, ...midiActiveKeys]);
  }, [keyboardActiveKeys, midiActiveKeys]);

  const {
    playNote,
    sustainEnabled,
    setSustainEnabled,
    chorusEnabled,
    toggleChorus,
    reverbEnabled,
    toggleReverb,
    audioContextRef,
    ensureAudioReady
  } = useAudio();

  // MIDI support
  const handleMIDINoteOn = async (note, octave) => {
    // Try to resume AudioContext if suspended (even though MIDI isn't a user gesture)
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
        console.log('🎵 AudioContext resumed via MIDI event');
      } catch (err) {
        console.warn('Could not resume AudioContext via MIDI:', err);
      }
    }

    playNote(note, octave, 2);
    // Add visual feedback for MIDI notes
    setMidiActiveKeys(prev => new Set([...prev, `${note}${octave}`]));
  };

  const handleMIDINoteOff = (note, octave) => {
    // Remove visual feedback when MIDI note is released
    setMidiActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(`${note}${octave}`);
      return newSet;
    });
  };

  const { midiConnected, midiDeviceName, midiError } = useMIDI(handleMIDINoteOn, handleMIDINoteOff, audioContextRef);

  // Handle navigation and update URL
  const navigateToPage = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  // Update hash when page changes
  useEffect(() => {
    window.location.hash = currentPage;
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('pianoCurrentTab', currentTab);
  }, [currentTab]);

  // Listen for hash changes (browser back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && hash !== currentPage) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPage]);

  // Use ref to track pressed keys within the effect to avoid recreating listeners
  const pressedKeysRef = useRef(new Set());
  const octavePlayRef = useRef(octavePlay);
  const octaveTheoryRef = useRef(octaveTheory);
  const currentTabRef = useRef(currentTab);

  // Keep refs in sync
  useEffect(() => {
    octavePlayRef.current = octavePlay;
  }, [octavePlay]);

  useEffect(() => {
    octaveTheoryRef.current = octaveTheory;
  }, [octaveTheory]);

  useEffect(() => {
    currentTabRef.current = currentTab;
  }, [currentTab]);

  useEffect(() => {
    pressedKeysRef.current = pressedKeys;
  }, [pressedKeys]);

  // Keyboard event handlers - only for piano page
  useEffect(() => {
    // Only enable keyboard controls when NOT on home, drums, guitar, or circle-of-fifths pages
    if (currentPage !== 'home' && currentPage !== 'drums' && currentPage !== 'guitar' && currentPage !== 'circle-of-fifths') {
      const handleKeyDown = (e) => {
        const note = keyMap[e.key.toLowerCase()];

        if (note && !pressedKeysRef.current.has(e.key) && !e.repeat) {
          setPressedKeys(prev => new Set([...prev, e.key]));
          const octaveOffset = getOctaveOffset(e.key);
          // Use the appropriate octave based on current tab
          const currentOctave = (currentTabRef.current === 'chords' || currentTabRef.current === 'scales')
            ? octaveTheoryRef.current
            : octavePlayRef.current;
          // Don't await - let it play asynchronously
          playNote(note, currentOctave - 1 + octaveOffset, 2);
        }
      };

      const handleKeyUp = (e) => {
        const note = keyMap[e.key.toLowerCase()];
        if (note) {
          setPressedKeys(prev => {
            const newSet = new Set(prev);
            newSet.delete(e.key);
            return newSet;
          });
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [playNote, currentPage]);

  const changeOctavePlay = (delta) => {
    setOctavePlay(prev => Math.max(2, Math.min(6, prev + delta)));
  };

  const changeOctaveTheory = (delta) => {
    setOctaveTheory(prev => Math.max(2, Math.min(6, prev + delta)));
  };

  // Show home page
  if (currentPage === 'home') {
    return <HomePage onNavigate={navigateToPage} />;
  }

  // Show drums page
  if (currentPage === 'drums') {
    return (
      <div className="app">
        <Navigation onBackHome={() => navigateToPage('home')} currentPage={currentPage} onNavigate={navigateToPage} />
        <DrumsPage />
      </div>
    );
  }

  // Show guitar page
  if (currentPage === 'guitar') {
    return (
      <div className="app">
        <Navigation onBackHome={() => navigateToPage('home')} currentPage={currentPage} onNavigate={navigateToPage} />
        <GuitarPage />
      </div>
    );
  }

  // Show circle of fifths page
  if (currentPage === 'circle-of-fifths') {
    return (
      <div className="app">
        <Navigation onBackHome={() => navigateToPage('home')} currentPage={currentPage} onNavigate={navigateToPage} />
        <CircleOfFifthsPage />
      </div>
    );
  }

  // Show piano app
  return (
    <div className="app">
      <Navigation onBackHome={() => navigateToPage('home')} currentPage={currentPage} onNavigate={navigateToPage} />
      <MIDIStatus connected={midiConnected} deviceName={midiDeviceName} error={midiError} audioContextRef={audioContextRef} />

      <div className="container">
        <h1>🎹 Piano</h1>

        <div className="tab-buttons">
          <button
            className={`tab-button ${currentTab === 'play' ? 'active' : ''}`}
            onClick={() => setCurrentTab('play')}
          >
            Free Play
          </button>
          <button
            className={`tab-button ${currentTab === 'chords' ? 'active' : ''}`}
            onClick={() => setCurrentTab('chords')}
          >
            Chords
          </button>
          <button
            className={`tab-button ${currentTab === 'scales' ? 'active' : ''}`}
            onClick={() => setCurrentTab('scales')}
          >
            Scales
          </button>
          <button
            className={`tab-button ${currentTab === 'roadmap' ? 'active' : ''}`}
            onClick={() => setCurrentTab('roadmap')}
          >
            Learning Roadmap 📚
          </button>
        </div>

        {currentTab === 'play' && (
          <FreePlayTab
            octave={octavePlay}
            onOctaveChange={changeOctavePlay}
            playNote={playNote}
            sustainEnabled={sustainEnabled}
            setSustainEnabled={setSustainEnabled}
            showNoteLabels={showNoteLabels}
            setShowNoteLabels={setShowNoteLabels}
            chorusEnabled={chorusEnabled}
            toggleChorus={toggleChorus}
            reverbEnabled={reverbEnabled}
            toggleReverb={toggleReverb}
            pressedKeys={pressedKeys}
            keyboardActiveKeys={allActiveKeys}
            midiActiveKeys={midiActiveKeys}
            ensureAudioReady={ensureAudioReady}
          />
        )}

        {currentTab === 'chords' && (
          <ChordsTab
            octave={octaveTheory}
            onOctaveChange={changeOctaveTheory}
            playNote={playNote}
            keyboardActiveKeys={allActiveKeys}
          />
        )}

        {currentTab === 'scales' && (
          <ScalesTab
            octave={octaveTheory}
            onOctaveChange={changeOctaveTheory}
            playNote={playNote}
            keyboardActiveKeys={allActiveKeys}
          />
        )}

        {currentTab === 'roadmap' && <LearningRoadmap />}
      </div>
    </div>
  );
}

export default App;
