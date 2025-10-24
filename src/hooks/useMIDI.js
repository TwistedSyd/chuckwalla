import { useEffect, useState, useRef } from 'react';
import { WebMidi } from 'webmidi';
import { notes } from '../data/musicTheory';

export function useMIDI(onNoteOn, onNoteOff, audioContextRef) {
  const [midiConnected, setMidiConnected] = useState(false);
  const [midiDeviceName, setMidiDeviceName] = useState('');
  const [midiError, setMidiError] = useState(null);
  const activeMidiNotesRef = useRef(new Map());
  const onNoteOnRef = useRef(onNoteOn);
  const onNoteOffRef = useRef(onNoteOff);
  const audioContextRefInternal = useRef(audioContextRef);

  // Keep refs up to date
  useEffect(() => {
    onNoteOnRef.current = onNoteOn;
    onNoteOffRef.current = onNoteOff;
    audioContextRefInternal.current = audioContextRef;
  }, [onNoteOn, onNoteOff, audioContextRef]);

  // Convert MIDI note number to note name and octave
  const midiNoteToNoteAndOctave = (midiNote) => {
    const octave = Math.floor(midiNote / 12) - 1;
    const noteIndex = midiNote % 12;
    return { note: notes[noteIndex], octave: octave };
  };

  // Initialize MIDI
  useEffect(() => {
    // Check if browser supports MIDI
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

    if (isFirefox) {
      console.log('Firefox detected - MIDI not supported');
      setMidiError('Firefox does not support MIDI. Please use Chrome, Edge, or Brave.');
      setMidiConnected(false);
      return;
    }

    if (!navigator.requestMIDIAccess) {
      console.log('Browser does not support MIDI');
      setMidiError('Your browser does not support MIDI.');
      setMidiConnected(false);
      return;
    }

    console.log('Attempting to enable WebMIDI...');

    WebMidi.enable((err) => {
      if (err) {
        setMidiConnected(false);

        // Provide helpful error message without spamming console
        if (err.message && err.message.includes('site permission add-on')) {
          setMidiError('MIDI not available (browser extension required)');
        } else if (err.message && err.message.includes('no devices')) {
          setMidiError('No MIDI devices detected');
        } else {
          console.error('MIDI error:', err.message);
          setMidiError('MIDI not available');
        }
        return;
      }

      console.log('✅ WebMidi enabled successfully!');
      console.log(`📊 Found ${WebMidi.inputs.length} MIDI input device(s):`);

      if (WebMidi.inputs.length === 0) {
        console.warn('⚠️ No MIDI input devices detected!');
        console.log('Please check:');
        console.log('  1. Is your MIDI device plugged in?');
        console.log('  2. Is it powered on?');
        console.log('  3. Try unplugging and replugging the device');
        console.log('  4. Refresh the page after connecting');
        setMidiError('No MIDI devices detected. Please connect a MIDI device and refresh the page.');
        setMidiConnected(false);
        return;
      }

      WebMidi.inputs.forEach((input, index) => {
        console.log(`  ${index + 1}. "${input.name}" (manufacturer: "${input.manufacturer || 'Unknown'}")`);
        console.log(`     - ID: ${input.id}`);
        console.log(`     - State: ${input.state}`);
        console.log(`     - Type: ${input.type}`);
      });

      // Function to setup input listeners
      const setupInput = (input) => {
        console.log(`🎹 Setting up MIDI Input: "${input.name}"`);

        // Listen for ALL MIDI messages for debugging
        input.addListener('midimessage', 'all', (e) => {
          console.log('🎵 Raw MIDI message received:', {
            data: Array.from(e.data),
            timestamp: e.timestamp,
            type: e.type
          });
        });

        // Listen for note on
        input.addListener('noteon', 'all', (e) => {
          const midiNote = e.note.number;
          const { note: noteName, octave } = midiNoteToNoteAndOctave(midiNote);
          console.log(`🎹 Note ON: ${noteName}${octave} (MIDI note: ${midiNote}, velocity: ${e.velocity})`);
          onNoteOnRef.current?.(noteName, octave);
          activeMidiNotesRef.current.set(midiNote, octave);
        });

        // Listen for note off
        input.addListener('noteoff', 'all', (e) => {
          const midiNote = e.note.number;
          const { note: noteName, octave } = midiNoteToNoteAndOctave(midiNote);
          const storedOctave = activeMidiNotesRef.current.get(midiNote);
          console.log(`🎹 Note OFF: ${noteName}${octave} (MIDI note: ${midiNote})`);
          if (storedOctave !== undefined) {
            onNoteOffRef.current?.(noteName, storedOctave);
            activeMidiNotesRef.current.delete(midiNote);
          }
        });

        setMidiConnected(true);
        setMidiDeviceName(input.name);
        console.log(`✅ MIDI Input "${input.name}" is ready! Try playing a note...`);
      };

      // Setup listeners for all existing inputs
      if (WebMidi.inputs.length > 0) {
        console.log(`Setting up ${WebMidi.inputs.length} MIDI input(s)...`);
        WebMidi.inputs.forEach(setupInput);
      } else {
        console.log('No MIDI devices detected. Please connect a MIDI device and refresh the page.');
        setMidiConnected(false);
      }

      // Listen for device connections
      WebMidi.addListener('connected', (e) => {
        if (e.port.type === 'input') {
          console.log(`MIDI device connected: ${e.port.name}`);
          setupInput(e.port);
        }
      });

      // Listen for device disconnections
      WebMidi.addListener('disconnected', (e) => {
        if (e.port.type === 'input') {
          console.log(`MIDI device disconnected: ${e.port.name}`);
          // If no inputs remain, set disconnected
          if (WebMidi.inputs.length === 0) {
            setMidiConnected(false);
            setMidiDeviceName('');
          } else {
            // Switch to another available input
            setMidiDeviceName(WebMidi.inputs[0].name);
          }
        }
      });
    }, true); // Pass true to enable sysex support

    // Cleanup
    return () => {
      if (WebMidi.enabled) {
        WebMidi.inputs.forEach(input => {
          input.removeListener();
        });
      }
    };
  }, []);

  return { midiConnected, midiDeviceName, midiError };
}
