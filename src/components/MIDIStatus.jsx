import { useState, useEffect, useCallback } from 'react';
import './MIDIStatus.css';

function MIDIStatus({ connected, deviceName, error, audioContextRef }) {
  const [audioReady, setAudioReady] = useState(false);

  const checkAudioState = useCallback(() => {
    if (audioContextRef?.current) {
      const isRunning = audioContextRef.current.state === 'running';
      setAudioReady(prevReady => {
        // Only update if the state actually changed
        if (prevReady !== isRunning) {
          return isRunning;
        }
        return prevReady;
      });
    }
  }, [audioContextRef]);

  useEffect(() => {
    if (!audioContextRef?.current) {
      return;
    }

    checkAudioState();

    const ctx = audioContextRef.current;
    ctx.addEventListener('statechange', checkAudioState);

    return () => {
      ctx.removeEventListener('statechange', checkAudioState);
    };
  }, [audioContextRef, checkAudioState]);

  const handleClick = async () => {
    if (audioContextRef?.current) {
      if (audioContextRef.current.state === 'suspended') {
        try {
          await audioContextRef.current.resume();
          setAudioReady(true);
        } catch (err) {
          console.error('Failed to resume AudioContext:', err);
        }
      }
    }
  };

  if (error) {
    return (
      <div className="midi-status error" title={error}>
        🎹 MIDI: {error}
      </div>
    );
  }

  if (connected && !audioReady) {
    return (
      <div
        className="midi-status needs-click"
        onClick={handleClick}
        title="Click to enable audio"
      >
        🎹 MIDI: {deviceName} - Click to enable audio
      </div>
    );
  }

  return (
    <div className={`midi-status ${connected ? 'connected' : 'disconnected'}`}>
      🎹 MIDI: {connected ? deviceName : 'Disconnected'}
    </div>
  );
}

export default MIDIStatus;
