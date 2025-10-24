import { useRef, useEffect, useState, useCallback } from 'react';
import { getNoteFrequency } from '../data/musicTheory';

export function useAudio() {
  const audioContextRef = useRef(null);
  const effectsRef = useRef({
    chorus: { enabled: false, node: null },
    reverb: { enabled: false, node: null }
  });

  const [sustainEnabled, setSustainEnabled] = useState(false);
  const [chorusEnabled, setChorusEnabled] = useState(false);
  const [reverbEnabled, setReverbEnabled] = useState(false);
  const masterVolume = 0.7;

  const initAudioContext = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      createEffectNodes();
    }
    // Resume if suspended (happens due to browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
        console.log('AudioContext resumed successfully');
      } catch (err) {
        console.error('Failed to resume AudioContext:', err);
      }
    }
    return audioContextRef.current;
  };

  // Initialize audio context immediately on mount (will be suspended until user interaction)
  useEffect(() => {
    // Create context immediately so it's ready for MIDI
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = ctx;
    createEffectNodes();

    console.log('AudioContext created on mount, state:', ctx.state);

    // Add user interaction handlers to resume AudioContext
    // Only listen for qualifying user gestures (click, keydown, touchstart)
    const resumeAudio = async () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        try {
          await audioContextRef.current.resume();
          console.log('✅ AudioContext resumed via user interaction');
          // Remove all listeners once resumed successfully
          document.removeEventListener('click', resumeAudio);
          document.removeEventListener('keydown', resumeAudio);
          document.removeEventListener('touchstart', resumeAudio);
          document.removeEventListener('mousedown', resumeAudio);
          // Note: The statechange event will notify any listeners (like MIDIStatus)
        } catch (err) {
          console.error('Failed to resume AudioContext:', err);
        }
      }
    };

    // Listen for qualifying user gestures on document
    document.addEventListener('click', resumeAudio);
    document.addEventListener('keydown', resumeAudio);
    document.addEventListener('touchstart', resumeAudio);
    document.addEventListener('mousedown', resumeAudio);

    return () => {
      // Cleanup listeners if component unmounts
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('keydown', resumeAudio);
      document.removeEventListener('touchstart', resumeAudio);
      document.removeEventListener('mousedown', resumeAudio);

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const createEffectNodes = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const chorusDelay = audioContext.createDelay();
    const chorusLFO = audioContext.createOscillator();
    const chorusDepth = audioContext.createGain();
    chorusDelay.delayTime.value = 0.02;
    chorusLFO.frequency.value = 0.5;
    chorusDepth.gain.value = 0.01;
    chorusLFO.connect(chorusDepth);
    chorusDepth.connect(chorusDelay.delayTime);

    // Only start the oscillator if the context is running
    // Otherwise, start it when the context resumes
    if (audioContext.state === 'running') {
      chorusLFO.start();
    } else {
      // Start the oscillator once the context is resumed
      const startOscillator = () => {
        if (audioContext.state === 'running') {
          try {
            chorusLFO.start();
          } catch (e) {
            // Already started, ignore
          }
          audioContext.removeEventListener('statechange', startOscillator);
        }
      };
      audioContext.addEventListener('statechange', startOscillator);
    }

    effectsRef.current.chorus.node = { delay: chorusDelay, lfo: chorusLFO, depth: chorusDepth };

    const reverbNode = audioContext.createConvolver();
    const reverbTime = 2;
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * reverbTime;
    const impulse = audioContext.createBuffer(2, length, sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    reverbNode.buffer = impulse;
    effectsRef.current.reverb.node = reverbNode;
  };

  const ensureAudioReady = async () => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;
    if (audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
        console.log('AudioContext preemptively resumed');
      } catch (err) {
        console.error('Failed to resume AudioContext:', err);
      }
    }
  };

  const playNote = useCallback(async (note, octave, duration = 1) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    // Ensure AudioContext is running before playing
    await ensureAudioReady();
    if (audioContext.state !== 'running') return;

    playNoteImmediately(note, octave, duration);
  }, [sustainEnabled, chorusEnabled, reverbEnabled]);

  const playNoteImmediately = (note, octave, duration) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const frequency = getNoteFrequency(note, octave);

    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.type = 'triangle';
    osc1.frequency.value = frequency;
    gain1.gain.value = 0.6;

    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = frequency * 2;
    gain2.gain.value = 0.15;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 200;
    filter.Q.value = 0.5;

    const gain = audioContext.createGain();
    const adjustedVolume = 0.3 * masterVolume;
    const sustainDuration = sustainEnabled ? duration * 1.2 : duration * 0.6;

    gain.gain.setValueAtTime(adjustedVolume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sustainDuration);

    osc1.connect(gain1);
    osc2.connect(gain2);

    gain1.connect(filter);
    gain2.connect(filter);

    filter.connect(gain);

    let currentNode = gain;

    if (chorusEnabled && effectsRef.current.chorus.node) {
      const dryGain = audioContext.createGain();
      const wetGain = audioContext.createGain();
      dryGain.gain.value = 0.6;
      wetGain.gain.value = 0.4;

      currentNode.connect(dryGain);
      currentNode.connect(effectsRef.current.chorus.node.delay);
      effectsRef.current.chorus.node.delay.connect(wetGain);

      const merger = audioContext.createGain();
      dryGain.connect(merger);
      wetGain.connect(merger);
      currentNode = merger;
    }
    else if (reverbEnabled && effectsRef.current.reverb.node) {
      const dryGain = audioContext.createGain();
      const wetGain = audioContext.createGain();
      dryGain.gain.value = 0.5;
      wetGain.gain.value = 0.5;

      currentNode.connect(dryGain);
      currentNode.connect(effectsRef.current.reverb.node);
      effectsRef.current.reverb.node.connect(wetGain);

      const merger = audioContext.createGain();
      dryGain.connect(merger);
      wetGain.connect(merger);
      currentNode = merger;
    }

    currentNode.connect(audioContext.destination);

    osc1.start(audioContext.currentTime);
    osc1.stop(audioContext.currentTime + sustainDuration);
    osc2.start(audioContext.currentTime);
    osc2.stop(audioContext.currentTime + sustainDuration);

    const cleanup = () => {
      try {
        osc1.disconnect();
        osc2.disconnect();
        gain1.disconnect();
        gain2.disconnect();
        filter.disconnect();
        gain.disconnect();
      } catch (e) {
      }
    };

    setTimeout(cleanup, (sustainDuration + 0.1) * 1000);

    return { osc: osc1, gain };
  };

  const toggleChorus = () => {
    setChorusEnabled(!chorusEnabled);
    if (reverbEnabled) setReverbEnabled(false);
  };

  const toggleReverb = () => {
    setReverbEnabled(!reverbEnabled);
    if (chorusEnabled) setChorusEnabled(false);
  };

  return {
    playNote,
    sustainEnabled,
    setSustainEnabled,
    chorusEnabled,
    toggleChorus,
    reverbEnabled,
    toggleReverb,
    audioContextRef,
    ensureAudioReady
  };
}
