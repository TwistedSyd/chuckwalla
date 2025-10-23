import { useState, useEffect, useMemo } from 'react';
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

  // Convert pressed keyboard keys to piano key IDs for visual feedback
  const keyboardActiveKeys = useMemo(() => {
    const activeSet = new Set();
    if (pressedKeys) {
      pressedKeys.forEach(key => {
        const note = keyMap[key.toLowerCase()];
        if (note) {
          const octaveOffset = getOctaveOffset(key);
          const noteOctave = octavePlay - 1 + octaveOffset;
          activeSet.add(`${note}${noteOctave}`);
        }
      });
    }
    return activeSet;
  }, [pressedKeys, octavePlay]);

  const {
    playNote,
    sustainEnabled,
    setSustainEnabled,
    chorusEnabled,
    toggleChorus,
    reverbEnabled,
    toggleReverb
  } = useAudio();

  // MIDI support
  const handleMIDINoteOn = (note, octave) => {
    playNote(note, octave, 2);
  };

  const handleMIDINoteOff = () => {
    // Note off handled by audio hook
  };

  const { midiConnected, midiDeviceName } = useMIDI(handleMIDINoteOn, handleMIDINoteOff);

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

  // Keyboard event handlers - only for piano page
  useEffect(() => {
    // Only enable keyboard controls when NOT on home, drums, guitar, or circle-of-fifths pages
    if (currentPage !== 'home' && currentPage !== 'drums' && currentPage !== 'guitar' && currentPage !== 'circle-of-fifths') {
      const handleKeyDown = (e) => {
        const note = keyMap[e.key.toLowerCase()];
        if (note && !pressedKeys.has(e.key) && !e.repeat) {
          setPressedKeys(prev => new Set([...prev, e.key]));
          const octaveOffset = getOctaveOffset(e.key);
          playNote(note, octavePlay - 1 + octaveOffset, 2);
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
  }, [octavePlay, playNote, pressedKeys, currentPage]);

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
      <MIDIStatus connected={midiConnected} deviceName={midiDeviceName} />

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
            keyboardActiveKeys={keyboardActiveKeys}
          />
        )}

        {currentTab === 'chords' && (
          <ChordsTab
            octave={octaveTheory}
            onOctaveChange={changeOctaveTheory}
            playNote={playNote}
            keyboardActiveKeys={keyboardActiveKeys}
          />
        )}

        {currentTab === 'scales' && (
          <ScalesTab
            octave={octaveTheory}
            onOctaveChange={changeOctaveTheory}
            playNote={playNote}
            keyboardActiveKeys={keyboardActiveKeys}
          />
        )}

        {currentTab === 'roadmap' && <LearningRoadmap />}
      </div>
    </div>
  );
}

export default App;
