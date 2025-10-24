import { useEffect, useState, useRef } from 'react';
import { WebMidi } from 'webmidi';
import { notes } from '../data/musicTheory';

export function useMIDI(onNoteOn, onNoteOff) {
  const [midiConnected, setMidiConnected] = useState(false);
  const [midiDeviceName, setMidiDeviceName] = useState('');
  const activeMidiNotesRef = useRef(new Map());
  const onNoteOnRef = useRef(onNoteOn);
  const onNoteOffRef = useRef(onNoteOff);

  // Keep refs up to date
  useEffect(() => {
    onNoteOnRef.current = onNoteOn;
    onNoteOffRef.current = onNoteOff;
  }, [onNoteOn, onNoteOff]);

  // Convert MIDI note number to note name and octave
  const midiNoteToNoteAndOctave = (midiNote) => {
    const octave = Math.floor(midiNote / 12) - 1;
    const noteIndex = midiNote % 12;
    return { note: notes[noteIndex], octave: octave };
  };

  // Initialize MIDI
  useEffect(() => {
    WebMidi.enable((err) => {
      if (err) {
        console.log('WebMidi could not be enabled:', err);
        setMidiConnected(false);
        return;
      }

      console.log('WebMidi enabled');

      // Function to setup input listeners
      const setupInput = (input) => {
        console.log(`MIDI Input detected: ${input.name}`);

        // Listen for note on
        input.addListener('noteon', (e) => {
          const midiNote = e.note.number;
          const { note: noteName, octave } = midiNoteToNoteAndOctave(midiNote);
          onNoteOnRef.current?.(noteName, octave);
          activeMidiNotesRef.current.set(midiNote, octave);
        });

        // Listen for note off
        input.addListener('noteoff', (e) => {
          const midiNote = e.note.number;
          const { note: noteName, octave } = midiNoteToNoteAndOctave(midiNote);
          const storedOctave = activeMidiNotesRef.current.get(midiNote);
          if (storedOctave !== undefined) {
            onNoteOffRef.current?.(noteName, storedOctave);
            activeMidiNotesRef.current.delete(midiNote);
          }
        });

        setMidiConnected(true);
        setMidiDeviceName(input.name);
      };

      // Setup listeners for all existing inputs
      if (WebMidi.inputs.length > 0) {
        WebMidi.inputs.forEach(setupInput);
      } else {
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

  return { midiConnected, midiDeviceName };
}
