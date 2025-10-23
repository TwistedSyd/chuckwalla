import { useRef, useEffect, useState } from 'react';
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

  // Initialize audio context and effects
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    createEffectNodes();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Create effect nodes
  const createEffectNodes = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    // Chorus effect (using delay with LFO)
    const chorusDelay = audioContext.createDelay();
    const chorusLFO = audioContext.createOscillator();
    const chorusDepth = audioContext.createGain();
    chorusDelay.delayTime.value = 0.02;
    chorusLFO.frequency.value = 0.5;
    chorusDepth.gain.value = 0.01;
    chorusLFO.connect(chorusDepth);
    chorusDepth.connect(chorusDelay.delayTime);
    chorusLFO.start();
    effectsRef.current.chorus.node = { delay: chorusDelay, lfo: chorusLFO, depth: chorusDepth };

    // Reverb effect (using convolver with synthetic impulse response)
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

  // Play a single note
  const playNote = (note, octave, duration = 1) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const frequency = getNoteFrequency(note, octave);

    // Create main oscillator with triangle wave for brighter sound
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.type = 'triangle';
    osc1.frequency.value = frequency;
    gain1.gain.value = 0.6;

    // Create second oscillator for additional harmonics
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = frequency * 2; // One octave higher
    gain2.gain.value = 0.15;

    // Add a high-pass filter to brighten the sound
    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 200;
    filter.Q.value = 0.5;

    // Main gain envelope
    const gain = audioContext.createGain();
    const adjustedVolume = 0.3 * masterVolume;
    const sustainDuration = sustainEnabled ? duration * 1.2 : duration * 0.6; // Reduced sustain

    gain.gain.setValueAtTime(adjustedVolume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sustainDuration);

    // Connect oscillators to their gains
    osc1.connect(gain1);
    osc2.connect(gain2);

    // Merge oscillators
    gain1.connect(filter);
    gain2.connect(filter);

    // Connect filter to main gain
    filter.connect(gain);

    // Build effects chain
    let currentNode = gain;

    // Apply chorus effect if enabled
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
    // Apply reverb effect if enabled
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

    // Connect to destination
    currentNode.connect(audioContext.destination);

    osc1.start(audioContext.currentTime);
    osc1.stop(audioContext.currentTime + sustainDuration);
    osc2.start(audioContext.currentTime);
    osc2.stop(audioContext.currentTime + sustainDuration);

    return { osc: osc1, gain };
  };

  // Toggle effects
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
    toggleReverb
  };
}
