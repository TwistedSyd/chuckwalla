        // Musical theory data
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const noteDisplay = {
            'C#': 'C#/Db', 'D#': 'D#/Eb', 'F#': 'F#/Gb',
            'G#': 'G#/Ab', 'A#': 'A#/Bb'
        };

        // Chord formulas (semitones from root)
        const chordFormulas = {
            'major': { intervals: [0, 4, 7], name: 'Major', formula: '1-3-5' },
            'minor': { intervals: [0, 3, 7], name: 'Minor', formula: '1-♭3-5' },
            'diminished': { intervals: [0, 3, 6], name: 'Diminished', formula: '1-♭3-♭5' },
            'augmented': { intervals: [0, 4, 8], name: 'Augmented', formula: '1-3-♯5' },
            'sus2': { intervals: [0, 2, 7], name: 'Suspended 2nd', formula: '1-2-5' },
            'sus4': { intervals: [0, 5, 7], name: 'Suspended 4th', formula: '1-4-5' },
            'major7': { intervals: [0, 4, 7, 11], name: 'Major 7th', formula: '1-3-5-7' },
            'minor7': { intervals: [0, 3, 7, 10], name: 'Minor 7th', formula: '1-♭3-5-♭7' },
            'dominant7': { intervals: [0, 4, 7, 10], name: 'Dominant 7th', formula: '1-3-5-♭7' },
            'diminished7': { intervals: [0, 3, 6, 9], name: 'Diminished 7th', formula: '1-♭3-♭5-♭♭7' },
            'major6': { intervals: [0, 4, 7, 9], name: 'Major 6th', formula: '1-3-5-6' },
            'minor6': { intervals: [0, 3, 7, 9], name: 'Minor 6th', formula: '1-♭3-5-6' },
            'major9': { intervals: [0, 4, 7, 11, 14], name: 'Major 9th', formula: '1-3-5-7-9' },
            'minor9': { intervals: [0, 3, 7, 10, 14], name: 'Minor 9th', formula: '1-♭3-5-♭7-9' },
        };

        // Scale formulas (semitones from root)
        const scaleFormulas = {
            'major': {
                intervals: [0, 2, 4, 5, 7, 9, 11],
                name: 'Major Scale',
                formula: 'W-W-H-W-W-W-H',
                chords: ['I (maj)', 'ii (min)', 'iii (min)', 'IV (maj)', 'V (maj)', 'vi (min)', 'vii° (dim)']
            },
            'minor': {
                intervals: [0, 2, 3, 5, 7, 8, 10],
                name: 'Natural Minor',
                formula: 'W-H-W-W-H-W-W',
                chords: ['i (min)', 'ii° (dim)', 'III (maj)', 'iv (min)', 'v (min)', 'VI (maj)', 'VII (maj)']
            },
            'harmonic-minor': {
                intervals: [0, 2, 3, 5, 7, 8, 11],
                name: 'Harmonic Minor',
                formula: 'W-H-W-W-H-W½-H',
                chords: ['i (min)', 'ii° (dim)', 'III+ (aug)', 'iv (min)', 'V (maj)', 'VI (maj)', 'vii° (dim)']
            },
            'melodic-minor': {
                intervals: [0, 2, 3, 5, 7, 9, 11],
                name: 'Melodic Minor',
                formula: 'W-H-W-W-W-W-H',
                chords: ['i (min)', 'ii (min)', 'III+ (aug)', 'IV (maj)', 'V (maj)', 'vi° (dim)', 'vii° (dim)']
            },
            'pentatonic-major': {
                intervals: [0, 2, 4, 7, 9],
                name: 'Major Pentatonic',
                formula: 'W-W-W½-W-W½',
                chords: ['Limited chord progressions - use major and sus chords']
            },
            'pentatonic-minor': {
                intervals: [0, 3, 5, 7, 10],
                name: 'Minor Pentatonic',
                formula: 'W½-W-W-W½-W',
                chords: ['Limited chord progressions - use minor and power chords']
            },
            'blues': {
                intervals: [0, 3, 5, 6, 7, 10],
                name: 'Blues Scale',
                formula: 'W½-W-H-H-W½-W',
                chords: ['I7, IV7, V7 (dominant 7th chords)']
            },
            'dorian': {
                intervals: [0, 2, 3, 5, 7, 9, 10],
                name: 'Dorian Mode',
                formula: 'W-H-W-W-W-H-W',
                chords: ['i (min)', 'ii (min)', 'III (maj)', 'IV (maj)', 'v (min)', 'vi° (dim)', 'VII (maj)']
            },
            'phrygian': {
                intervals: [0, 1, 3, 5, 7, 8, 10],
                name: 'Phrygian Mode',
                formula: 'H-W-W-W-H-W-W',
                chords: ['i (min)', 'II (maj)', 'III (maj)', 'iv (min)', 'v° (dim)', 'VI (maj)', 'vii (min)']
            },
            'lydian': {
                intervals: [0, 2, 4, 6, 7, 9, 11],
                name: 'Lydian Mode',
                formula: 'W-W-W-H-W-W-H',
                chords: ['I (maj)', 'II (maj)', 'iii (min)', '#iv° (dim)', 'V (maj)', 'vi (min)', 'vii (min)']
            },
            'mixolydian': {
                intervals: [0, 2, 4, 5, 7, 9, 10],
                name: 'Mixolydian Mode',
                formula: 'W-W-H-W-W-H-W',
                chords: ['I (maj)', 'ii (min)', 'iii° (dim)', 'IV (maj)', 'v (min)', 'vi (min)', 'VII (maj)']
            },
            'locrian': {
                intervals: [0, 1, 3, 5, 6, 8, 10],
                name: 'Locrian Mode',
                formula: 'H-W-W-H-W-W-W',
                chords: ['i° (dim)', 'II (maj)', 'iii (min)', 'iv (min)', 'V (maj)', 'VI (maj)', 'vii (min)']
            },
            'chromatic': {
                intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                name: 'Chromatic Scale',
                formula: 'H-H-H-H-H-H-H-H-H-H-H-H',
                chords: ['All 12 chromatic chords available']
            },
            'whole-tone': {
                intervals: [0, 2, 4, 6, 8, 10],
                name: 'Whole Tone Scale',
                formula: 'W-W-W-W-W-W',
                chords: ['Augmented and sus chords']
            },
        };

        let currentTab = 'play';
        let currentOctavePlay = 4;
        let currentOctaveTheory = 4;
        let audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let currentNotes = [];
        let activeOscillators = [];
        let masterVolume = 0.7; // Default 70%
        let sustainEnabled = false;
        let showNoteLabels = true;

        // Audio effects
        let effects = {
            chorus: { enabled: false, node: null },
            reverb: { enabled: false, node: null },
            flanger: { enabled: false, node: null },
            gain: { enabled: false, node: null }
        };

        // Create effect nodes
        function createEffectNodes() {
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
            effects.chorus.node = { delay: chorusDelay, lfo: chorusLFO, depth: chorusDepth };

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
            effects.reverb.node = reverbNode;

            // Flanger effect (similar to chorus but faster)
            const flangerDelay = audioContext.createDelay();
            const flangerLFO = audioContext.createOscillator();
            const flangerDepth = audioContext.createGain();
            const flangerFeedback = audioContext.createGain();
            flangerDelay.delayTime.value = 0.005;
            flangerLFO.frequency.value = 0.3;
            flangerDepth.gain.value = 0.003;
            flangerFeedback.gain.value = 0.5;
            flangerLFO.connect(flangerDepth);
            flangerDepth.connect(flangerDelay.delayTime);
            flangerDelay.connect(flangerFeedback);
            flangerFeedback.connect(flangerDelay);
            flangerLFO.start();
            effects.flanger.node = { delay: flangerDelay, lfo: flangerLFO, depth: flangerDepth, feedback: flangerFeedback };

            // Gain/Distortion effect
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 2.5;
            effects.gain.node = gainNode;
        }

        createEffectNodes();

        // Keyboard mapping
        const keyMap = {
            // First octave
            'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#',
            'd': 'E', 'f': 'F', 't': 'F#', 'g': 'G',
            'y': 'G#', 'h': 'A', 'u': 'A#', 'j': 'B',
            // Second octave
            'k': 'C', 'i': 'C#', 'l': 'D', 'o': 'D#',
            ';': 'E', "'": 'F', 'p': 'F#', '[': 'G',
            ']': 'G#', '\\': 'A'
        };

        // Keys in the first octave
        const firstOctaveKeys = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j'];

        // Function to get octave offset based on key
        function getOctaveOffset(key) {
            return firstOctaveKeys.includes(key.toLowerCase()) ? 0 : 1;
        }

        // Generate frequency for a note
        function getNoteFrequency(note, octave) {
            const noteIndex = notes.indexOf(note);
            const A4 = 440;
            const A4Index = 9; // A is at index 9
            const semitones = (octave - 4) * 12 + (noteIndex - A4Index);
            return A4 * Math.pow(2, semitones / 12);
        }

        // Generate piano keyboard
        function generateKeyboard(containerId, octave, isInteractive = true) {
            const keyboard = document.getElementById(containerId);
            keyboard.innerHTML = '';

            // Black key positioning: at the border between white keys (margin-left will center them)
            const blackKeyPositions = {
                'C#': 1.0,  // Between C (0) and D (1)
                'D#': 2.0,  // Between D (1) and E (2)
                'F#': 4.0,  // Between F (3) and G (4)
                'G#': 5.0,  // Between G (4) and A (5)
                'A#': 6.0   // Between A (5) and B (6)
            };

            const whiteKeyWidth = 50;

            // Generate 2 octaves worth of keys
            for (let oct = octave; oct <= octave + 1; oct++) {
                notes.forEach((note, index) => {
                    const isBlackKey = note.includes('#');
                    const key = document.createElement('div');
                    key.className = `key ${isBlackKey ? 'black-key' : 'white-key'}`;
                    key.dataset.note = note;
                    key.dataset.octave = oct;
                    key.dataset.noteId = `${note}${oct}`;

                    const label = document.createElement('div');
                    label.className = 'key-label';
                    label.textContent = `${note}\n${oct}`;
                    key.appendChild(label);

                    // Add keyboard key labels for Free Play tab (for both octaves)
                    if (containerId === 'piano-keyboard-play') {
                        // Find keyboard key for this note in the correct octave
                        let keyboardKey = null;

                        if (oct === octave) {
                            // First octave - look for keys in firstOctaveKeys
                            keyboardKey = Object.keys(keyMap).find(k =>
                                keyMap[k] === note && firstOctaveKeys.includes(k)
                            );
                        } else if (oct === octave + 1) {
                            // Second octave - look for keys NOT in firstOctaveKeys
                            keyboardKey = Object.keys(keyMap).find(k =>
                                keyMap[k] === note && !firstOctaveKeys.includes(k)
                            );
                        }

                        if (keyboardKey) {
                            const keyboardLabel = document.createElement('div');
                            keyboardLabel.className = 'keyboard-key-label';
                            keyboardLabel.textContent = keyboardKey.toUpperCase();
                            key.appendChild(keyboardLabel);
                        }
                    }

                    if (isBlackKey) {
                        const octaveOffset = (oct - octave) * 7 * whiteKeyWidth;
                        const blackKeyPosition = blackKeyPositions[note];
                        key.style.left = `${octaveOffset + (blackKeyPosition * whiteKeyWidth)}px`;
                    }

                    if (isInteractive) {
                        key.addEventListener('mousedown', () => {
                            playNote(note, oct);
                            key.classList.add('active');

                            // Track note for chord detection in Free Play tab
                            if (containerId === 'piano-keyboard-play') {
                                currentlyPlayingNotes.add(note);
                                updateChordDisplay();
                            }
                        });
                        key.addEventListener('mouseup', () => {
                            key.classList.remove('active');

                            // Remove note from chord detection in Free Play tab
                            if (containerId === 'piano-keyboard-play') {
                                currentlyPlayingNotes.delete(note);
                                updateChordDisplay();
                            }
                        });
                        key.addEventListener('mouseleave', () => {
                            key.classList.remove('active');

                            // Remove note from chord detection in Free Play tab
                            if (containerId === 'piano-keyboard-play') {
                                currentlyPlayingNotes.delete(note);
                                updateChordDisplay();
                            }
                        });
                    }

                    keyboard.appendChild(key);
                });
            }

            // Add one extra C key at the end (25th key like most MIDI controllers)
            const extraOct = octave + 2;
            const extraKey = document.createElement('div');
            extraKey.className = 'key white-key';
            extraKey.dataset.note = 'C';
            extraKey.dataset.octave = extraOct;
            extraKey.dataset.noteId = `C${extraOct}`;

            const extraLabel = document.createElement('div');
            extraLabel.className = 'key-label';
            extraLabel.textContent = `C\n${extraOct}`;
            extraKey.appendChild(extraLabel);

            if (isInteractive) {
                extraKey.addEventListener('mousedown', () => {
                    playNote('C', extraOct);
                    extraKey.classList.add('active');

                    // Track note for chord detection in Free Play tab
                    if (containerId === 'piano-keyboard-play') {
                        currentlyPlayingNotes.add('C');
                        updateChordDisplay();
                    }
                });
                extraKey.addEventListener('mouseup', () => {
                    extraKey.classList.remove('active');

                    // Remove note from chord detection in Free Play tab
                    if (containerId === 'piano-keyboard-play') {
                        currentlyPlayingNotes.delete('C');
                        updateChordDisplay();
                    }
                });
                extraKey.addEventListener('mouseleave', () => {
                    extraKey.classList.remove('active');

                    // Remove note from chord detection in Free Play tab
                    if (containerId === 'piano-keyboard-play') {
                        currentlyPlayingNotes.delete('C');
                        updateChordDisplay();
                    }
                });
            }

            keyboard.appendChild(extraKey);

            if (currentTab === 'chords' || currentTab === 'scales') {
                updateTheoryDisplay();
            }
        }

        // Play a single note
        function playNote(note, octave, duration = 1) {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.value = getNoteFrequency(note, octave);

            const adjustedVolume = 0.3 * masterVolume;
            const sustainDuration = sustainEnabled ? duration * 2 : duration;

            gain.gain.setValueAtTime(adjustedVolume, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sustainDuration);

            // Connect oscillator to gain
            osc.connect(gain);

            // Build effects chain
            let currentNode = gain;

            // Apply gain/distortion effect
            if (effects.gain.enabled) {
                currentNode.connect(effects.gain.node);
                currentNode = effects.gain.node;
            }

            // Apply chorus effect
            if (effects.chorus.enabled) {
                const dryGain = audioContext.createGain();
                const wetGain = audioContext.createGain();
                dryGain.gain.value = 0.7;
                wetGain.gain.value = 0.3;

                currentNode.connect(dryGain);
                currentNode.connect(effects.chorus.node.delay);
                effects.chorus.node.delay.connect(wetGain);

                const merger = audioContext.createGain();
                dryGain.connect(merger);
                wetGain.connect(merger);
                currentNode = merger;
            }

            // Apply flanger effect
            if (effects.flanger.enabled) {
                const dryGain = audioContext.createGain();
                const wetGain = audioContext.createGain();
                dryGain.gain.value = 0.7;
                wetGain.gain.value = 0.3;

                currentNode.connect(dryGain);
                currentNode.connect(effects.flanger.node.delay);
                effects.flanger.node.delay.connect(wetGain);

                const merger = audioContext.createGain();
                dryGain.connect(merger);
                wetGain.connect(merger);
                currentNode = merger;
            }

            // Apply reverb effect
            if (effects.reverb.enabled) {
                const dryGain = audioContext.createGain();
                const wetGain = audioContext.createGain();
                dryGain.gain.value = 0.6;
                wetGain.gain.value = 0.4;

                currentNode.connect(dryGain);
                currentNode.connect(effects.reverb.node);
                effects.reverb.node.connect(wetGain);

                const merger = audioContext.createGain();
                dryGain.connect(merger);
                wetGain.connect(merger);
                currentNode = merger;
            }

            // Connect to destination
            currentNode.connect(audioContext.destination);

            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + sustainDuration);

            return { osc, gain };
        }

        // Calculate notes for current selection
        function calculateNotes() {
            const isChordTab = currentTab === 'chords';
            const root = document.getElementById(isChordTab ? 'root-note-chord' : 'root-note-scale').value;
            const rootIndex = notes.indexOf(root);
            const formula = isChordTab
                ? chordFormulas[document.getElementById('chord-type').value]
                : scaleFormulas[document.getElementById('scale-type').value];

            currentNotes = formula.intervals.map(interval => {
                const noteIndex = (rootIndex + interval) % 12;
                return notes[noteIndex];
            });

            return { notes: currentNotes, formula: formula };
        }

        // Get chord intervals based on chord quality
        function getChordIntervals(chordQuality) {
            // Parse the chord quality from strings like "I (maj)", "ii (min)", "vii° (dim)"
            if (chordQuality.includes('maj')) {
                return [0, 4, 7]; // Major triad
            } else if (chordQuality.includes('min')) {
                return [0, 3, 7]; // Minor triad
            } else if (chordQuality.includes('dim')) {
                return [0, 3, 6]; // Diminished triad
            } else if (chordQuality.includes('aug')) {
                return [0, 4, 8]; // Augmented triad
            }
            return [0, 4, 7]; // Default to major
        }

        // Highlight a specific chord on the keyboard
        function highlightChord(chordRoot, chordIntervals) {
            const containerId = 'piano-keyboard-scale';
            const rootIndex = notes.indexOf(chordRoot);

            // Clear all highlights first
            document.querySelectorAll(`#${containerId} .key`).forEach(key => {
                key.classList.remove('highlighted', 'root');
                const existingInterval = key.querySelector('.interval-label');
                if (existingInterval) existingInterval.remove();
            });

            // Calculate and highlight chord notes
            const chordNotes = chordIntervals.map(interval => {
                const noteIndex = (rootIndex + interval) % 12;
                return notes[noteIndex];
            });

            chordNotes.forEach((note, index) => {
                const keys = document.querySelectorAll(`#${containerId} [data-note="${note}"]`);
                keys.forEach(key => {
                    if (index === 0) {
                        key.classList.add('root');
                    } else {
                        key.classList.add('highlighted');
                    }

                    // Add interval label
                    const intervalLabel = document.createElement('div');
                    intervalLabel.className = 'interval-label';
                    intervalLabel.textContent = index === 0 ? 'R' : `${index + 1}`;
                    key.appendChild(intervalLabel);
                });
            });
        }

        // Play a specific chord
        function playScaleChord(chordRoot, chordIntervals) {
            const rootIndex = notes.indexOf(chordRoot);
            const chordNotes = chordIntervals.map(interval => {
                const noteIndex = (rootIndex + interval) % 12;
                return notes[noteIndex];
            });

            // Calculate octaves for each note to ensure ascending order starting from root
            const octaves = [];
            let lastNoteIndex = rootIndex;
            let currentOctaveOffset = 0;

            chordNotes.forEach((note, index) => {
                const noteIndex = notes.indexOf(note);

                // If current note is lower in the chromatic scale than the previous note, move to next octave
                if (index > 0 && noteIndex <= lastNoteIndex) {
                    currentOctaveOffset++;
                }

                octaves.push(currentOctaveTheory + currentOctaveOffset);
                lastNoteIndex = noteIndex;
            });

            // Play all notes simultaneously (as a chord) with visual feedback
            const keyboard = document.getElementById('piano-keyboard-scale');

            chordNotes.forEach((note, index) => {
                // Play all notes at the same time (duration of 1 second)
                playNote(note, octaves[index], 1);

                // Highlight all keys visually at the same time
                if (keyboard) {
                    const allKeys = keyboard.querySelectorAll('.key');
                    allKeys.forEach(key => {
                        if (key.dataset.note === note && key.dataset.octave === String(octaves[index])) {
                            key.classList.add('active');

                            // Remove highlight after note duration
                            setTimeout(() => {
                                key.classList.remove('active');
                            }, 1000);
                        }
                    });
                }
            });
        }

        // Update the theory display (chords/scales)
        function updateTheoryDisplay() {
            const { notes: chordNotes, formula } = calculateNotes();
            const root = document.getElementById(currentTab === 'chords' ? 'root-note-chord' : 'root-note-scale').value;
            const containerId = currentTab === 'chords' ? 'piano-keyboard-chord' : 'piano-keyboard-scale';

            // Clear all highlights
            document.querySelectorAll(`#${containerId} .key`).forEach(key => {
                key.classList.remove('highlighted', 'root');
                const existingInterval = key.querySelector('.interval-label');
                if (existingInterval) existingInterval.remove();
            });

            // Highlight notes
            chordNotes.forEach((note, index) => {
                const keys = document.querySelectorAll(`#${containerId} [data-note="${note}"]`);
                keys.forEach(key => {
                    if (index === 0) {
                        key.classList.add('root');
                    } else {
                        key.classList.add('highlighted');
                    }

                    // Add interval label
                    const intervalLabel = document.createElement('div');
                    intervalLabel.className = 'interval-label';
                    intervalLabel.textContent = index === 0 ? 'R' : `${index + 1}`;
                    key.appendChild(intervalLabel);
                });
            });

            // Update info panel
            const suffix = currentTab === 'chords' ? 'chord' : 'scale';
            const notesStr = chordNotes.map(n => noteDisplay[n] || n).join(' - ');
            document.getElementById(`info-notes-${suffix}`).textContent = notesStr;
            document.getElementById(`info-intervals-${suffix}`).textContent = formula.intervals.join(', ');
            document.getElementById(`info-formula-${suffix}`).textContent = formula.formula;

            // Update diatonic chords for scales
            if (currentTab === 'scales' && formula.chords) {
                const rootIndex = notes.indexOf(root);
                const chordsContainer = document.getElementById('chord-buttons-container');
                chordsContainer.innerHTML = ''; // Clear existing buttons

                if (Array.isArray(formula.chords) && formula.chords.length > 1) {
                    // Add "Show Scale" button first
                    const scaleButton = document.createElement('button');
                    scaleButton.className = 'chord-button active'; // Active by default
                    scaleButton.innerHTML = `
                        <div class="chord-name">Scale</div>
                        <div class="chord-quality">Show All Notes</div>
                    `;
                    scaleButton.addEventListener('click', function() {
                        // Remove active class from all buttons
                        document.querySelectorAll('.chord-button').forEach(btn => {
                            btn.classList.remove('active');
                        });
                        // Add active class to this button
                        this.classList.add('active');

                        // Restore scale highlighting
                        updateTheoryDisplay();
                    });
                    chordsContainer.appendChild(scaleButton);

                    // Create clickable chord buttons
                    formula.chords.forEach((chordQuality, index) => {
                        const scaleNoteIndex = (rootIndex + formula.intervals[index]) % 12;
                        const scaleDegreeNote = notes[scaleNoteIndex];
                        const scaleDegreeName = noteDisplay[scaleDegreeNote] || scaleDegreeNote;

                        const button = document.createElement('button');
                        button.className = 'chord-button';
                        button.innerHTML = `
                            <div class="chord-name">${scaleDegreeName}</div>
                            <div class="chord-quality">${chordQuality}</div>
                        `;

                        const chordIntervals = getChordIntervals(chordQuality);

                        button.addEventListener('click', function() {
                            // Remove active class from all buttons
                            document.querySelectorAll('.chord-button').forEach(btn => {
                                btn.classList.remove('active');
                            });
                            // Add active class to clicked button
                            this.classList.add('active');

                            // Highlight and play the chord
                            highlightChord(scaleDegreeNote, chordIntervals);
                            playScaleChord(scaleDegreeNote, chordIntervals);
                        });

                        chordsContainer.appendChild(button);
                    });
                } else {
                    // For pentatonic, blues, etc. with general descriptions
                    const infoText = document.createElement('div');
                    infoText.style.color = '#aaa';
                    infoText.style.padding = '10px';
                    infoText.textContent = formula.chords[0];
                    chordsContainer.appendChild(infoText);
                }
            }
        }

        // Play chord or scale together
        function playChordOrScale() {
            const { notes: chordNotes } = calculateNotes();
            const isChordTab = currentTab === 'chords';
            const root = document.getElementById(isChordTab ? 'root-note-chord' : 'root-note-scale').value;
            const rootIndex = notes.indexOf(root);

            // Calculate octaves for each note to ensure ascending order (root position)
            const octaves = [];
            let lastNoteIndex = rootIndex;
            let currentOctaveOffset = 0;

            chordNotes.forEach((note, index) => {
                const noteIndex = notes.indexOf(note);

                // Ensure ascending order: if current note is lower than previous, move to next octave
                if (index > 0 && noteIndex <= lastNoteIndex) {
                    currentOctaveOffset++;
                }

                octaves.push(currentOctaveTheory + currentOctaveOffset);
                lastNoteIndex = noteIndex;
            });

            // Get the appropriate keyboard container
            const keyboardId = isChordTab ? 'piano-keyboard-chord' : 'piano-keyboard-scale';
            const keyboard = document.getElementById(keyboardId);

            // Play all notes simultaneously with visual feedback
            chordNotes.forEach((note, index) => {
                playNote(note, octaves[index], 1);

                // Highlight all keys visually at the same time
                if (keyboard) {
                    const allKeys = keyboard.querySelectorAll('.key');
                    allKeys.forEach(key => {
                        if (key.dataset.note === note && key.dataset.octave === String(octaves[index])) {
                            key.classList.add('active');

                            // Remove highlight after note duration
                            setTimeout(() => {
                                key.classList.remove('active');
                            }, 1000);
                        }
                    });
                }
            });
        }

        // Play chord or scale as arpeggio
        function playChordOrScaleArpeggio() {
            const { notes: chordNotes, formula } = calculateNotes();
            const isChordTab = currentTab === 'chords';
            const root = document.getElementById(isChordTab ? 'root-note-chord' : 'root-note-scale').value;
            const rootIndex = notes.indexOf(root);

            // For scales, add the root note at the next octave to complete it
            let notesToPlay = [...chordNotes];
            if (currentTab === 'scales') {
                notesToPlay.push(chordNotes[0]); // Add root note
            }

            // Pre-calculate octaves for each note to ensure ascending order (root position)
            const octaves = [];
            let lastNoteIndex = rootIndex;
            let currentOctaveOffset = 0;

            notesToPlay.forEach((note, index) => {
                const noteIndex = notes.indexOf(note);

                // Ensure ascending order: if current note is lower than previous, move to next octave
                if (index > 0 && noteIndex <= lastNoteIndex) {
                    currentOctaveOffset++;
                }

                octaves.push(currentOctaveTheory + currentOctaveOffset);
                lastNoteIndex = noteIndex;
            });

            // Get the appropriate keyboard container
            const keyboardId = isChordTab ? 'piano-keyboard-chord' : 'piano-keyboard-scale';
            const keyboard = document.getElementById(keyboardId);

            // Play as arpeggio (one note at a time) with visual feedback
            notesToPlay.forEach((note, index) => {
                setTimeout(() => {
                    playNote(note, octaves[index], 0.5);

                    // Highlight the key visually
                    if (keyboard) {
                        const allKeys = keyboard.querySelectorAll('.key');
                        allKeys.forEach(key => {
                            if (key.dataset.note === note && key.dataset.octave === String(octaves[index])) {
                                key.classList.add('active');

                                // Remove highlight after note duration
                                setTimeout(() => {
                                    key.classList.remove('active');
                                }, 500);
                            }
                        });
                    }
                }, index * 300);
            });
        }

        // Play scale descending
        function playScaleDescending() {
            const { notes: chordNotes, formula } = calculateNotes();
            const root = document.getElementById('root-note-scale').value;
            const rootIndex = notes.indexOf(root);

            // For scales, add the root note at the next octave to complete it
            let notesToPlay = [...chordNotes];
            notesToPlay.push(chordNotes[0]); // Add root note

            // Pre-calculate octaves for each note to ensure ascending order (root position)
            const octaves = [];
            let lastNoteIndex = rootIndex;
            let currentOctaveOffset = 0;

            notesToPlay.forEach((note, index) => {
                const noteIndex = notes.indexOf(note);

                // Ensure ascending order: if current note is lower than previous, move to next octave
                if (index > 0 && noteIndex <= lastNoteIndex) {
                    currentOctaveOffset++;
                }

                octaves.push(currentOctaveTheory + currentOctaveOffset);
                lastNoteIndex = noteIndex;
            });

            // Reverse the arrays for descending playback
            const descendingNotes = [...notesToPlay].reverse();
            const descendingOctaves = [...octaves].reverse();

            // Get the keyboard container
            const keyboard = document.getElementById('piano-keyboard-scale');

            // Play descending (one note at a time) with visual feedback
            descendingNotes.forEach((note, index) => {
                setTimeout(() => {
                    playNote(note, descendingOctaves[index], 0.5);

                    // Highlight the key visually
                    if (keyboard) {
                        const allKeys = keyboard.querySelectorAll('.key');
                        allKeys.forEach(key => {
                            if (key.dataset.note === note && key.dataset.octave === String(descendingOctaves[index])) {
                                key.classList.add('active');

                                // Remove highlight after note duration
                                setTimeout(() => {
                                    key.classList.remove('active');
                                }, 500);
                            }
                        });
                    }
                }, index * 300);
            });
        }

        // Switch between tabs
        function switchTab(tab) {
            currentTab = tab;

            // Save tab state to localStorage
            localStorage.setItem('pianoCurrentTab', tab);

            // Update tab buttons
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
                if (btn.onclick && btn.onclick.toString().includes(tab)) {
                    btn.classList.add('active');
                }
            });

            // Show/hide appropriate content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tab}-tab`).classList.add('active');

            // Generate appropriate keyboard
            if (tab === 'play') {
                generateKeyboard('piano-keyboard-play', currentOctavePlay, true);
            } else if (tab === 'chords') {
                generateKeyboard('piano-keyboard-chord', currentOctaveTheory, true);
                updateTheoryDisplay();
            } else if (tab === 'scales') {
                generateKeyboard('piano-keyboard-scale', currentOctaveTheory, true);
                updateTheoryDisplay();
            }
        }

        // Change octave for free play
        function changeOctave(delta) {
            currentOctavePlay = Math.max(2, Math.min(6, currentOctavePlay + delta));
            document.getElementById('octave-display-play').textContent = currentOctavePlay;
            generateKeyboard('piano-keyboard-play', currentOctavePlay, true);
        }

        // Change octave for theory (chords/scales)
        function changeOctaveTheory(delta) {
            currentOctaveTheory = Math.max(2, Math.min(6, currentOctaveTheory + delta));
            document.getElementById('octave-display-chord').textContent = currentOctaveTheory;
            document.getElementById('octave-display-scale').textContent = currentOctaveTheory;

            if (currentTab === 'chords') {
                generateKeyboard('piano-keyboard-chord', currentOctaveTheory, true);
            } else if (currentTab === 'scales') {
                generateKeyboard('piano-keyboard-scale', currentOctaveTheory, true);
            }
        }

        // Clear all playing notes
        function clearAllNotes() {
            activeOscillators.forEach(({ osc, gain }) => {
                try {
                    gain.gain.cancelScheduledValues(audioContext.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    osc.stop(audioContext.currentTime + 0.1);
                } catch (e) {
                    // Oscillator already stopped
                }
            });
            activeOscillators = [];

            // Remove active class from all keys
            document.querySelectorAll('.key.active').forEach(key => {
                key.classList.remove('active');
            });
        }

        // Toggle note labels visibility
        function toggleNoteLabels(show) {
            showNoteLabels = show;
            const labels = document.querySelectorAll('#piano-keyboard-play .key-label');
            labels.forEach(label => {
                label.style.display = show ? 'block' : 'none';
            });
        }

        // Toggle audio effect
        function toggleEffect(effectName) {
            effects[effectName].enabled = !effects[effectName].enabled;
            const button = document.getElementById(`${effectName}-btn`);

            if (effects[effectName].enabled) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }

        // Track currently playing notes
        let currentlyPlayingNotes = new Set();

        // Detect chord from currently playing notes
        function detectChord(notesSet) {
            if (notesSet.size === 0) {
                return { name: '-', notes: 'Play some keys to see the chord' };
            }

            if (notesSet.size === 1) {
                const note = Array.from(notesSet)[0];
                return { name: noteDisplay[note] || note, notes: 'Single note' };
            }

            // Convert set to sorted array of note indices
            const noteIndices = Array.from(notesSet).map(note => notes.indexOf(note)).sort((a, b) => a - b);

            // Define chord patterns
            const chordPatterns = {
                '0,4,7': 'Major',
                '0,3,7': 'Minor',
                '0,3,6': 'Diminished',
                '0,4,8': 'Augmented',
                '0,2,7': 'sus2',
                '0,5,7': 'sus4',
                '0,4,7,11': 'Major 7',
                '0,3,7,10': 'Minor 7',
                '0,4,7,10': 'Dominant 7',
                '0,3,6,9': 'Diminished 7',
                '0,3,6,10': 'Half-diminished 7',
                '0,4,7,9': 'Major 6',
                '0,3,7,9': 'Minor 6',
                '0,4,7,11,14': 'Major 9',
                '0,3,7,10,14': 'Minor 9',
                '0,4,7,10,14': 'Dominant 9',
                '0,2,4,7,9': 'Major add9',
                '0,3,5,7,10': 'Minor add11',
                '0,7': 'Power Chord (5th)',
                '0,5': 'Perfect 4th',
                '0,2': 'Major 2nd',
                '0,3': 'Minor 3rd',
                '0,4': 'Major 3rd',
                '0,6': 'Tritone'
            };

            // Try each note as a potential root
            for (let i = 0; i < noteIndices.length; i++) {
                const potentialRoot = noteIndices[i];
                const intervals = noteIndices.map(idx => (idx - potentialRoot + 12) % 12).sort((a, b) => a - b);
                const intervalSig = intervals.join(',');

                const chordType = chordPatterns[intervalSig];
                if (chordType) {
                    const root = notes[potentialRoot];
                    const rootDisplay = noteDisplay[root] || root;
                    const notesList = Array.from(notesSet).map(n => noteDisplay[n] || n).join(', ');

                    // Add inversion indicator if not in root position
                    const inversionText = i > 0 ? ` (${i === 1 ? '1st' : i === 2 ? '2nd' : i === 3 ? '3rd' : i + 'th'} inv)` : '';

                    return {
                        name: `${rootDisplay} ${chordType}${inversionText}`,
                        notes: notesList
                    };
                }
            }

            // If no pattern matched, return custom
            const notesList = Array.from(notesSet).map(n => noteDisplay[n] || n).join(', ');
            return {
                name: 'Custom',
                notes: notesList
            };
        }

        // Update the chord display
        function updateChordDisplay() {
            const chord = detectChord(currentlyPlayingNotes);
            document.getElementById('chord-name').textContent = chord.name;
            document.getElementById('chord-notes').textContent = chord.notes;
        }

        // Event listeners for free play controls
        document.getElementById('sustain-toggle').addEventListener('change', (e) => {
            sustainEnabled = e.target.checked;
        });

        document.getElementById('note-labels-toggle').addEventListener('change', (e) => {
            toggleNoteLabels(e.target.checked);
        });

        // Event listeners for theory controls
        document.getElementById('root-note-chord').addEventListener('change', updateTheoryDisplay);
        document.getElementById('chord-type').addEventListener('change', updateTheoryDisplay);
        document.getElementById('root-note-scale').addEventListener('change', updateTheoryDisplay);
        document.getElementById('scale-type').addEventListener('change', updateTheoryDisplay);

        // Keyboard shortcuts (work on all tabs)
        let pressedKeys = new Set();

        document.addEventListener('keydown', (e) => {
            const note = keyMap[e.key.toLowerCase()];
            if (note && !pressedKeys.has(e.key) && !e.repeat) {
                pressedKeys.add(e.key);
                const octaveOffset = getOctaveOffset(e.key);
                playNote(note, currentOctavePlay + octaveOffset);

                // Track the note for chord detection
                currentlyPlayingNotes.add(note);
                updateChordDisplay();

                // Visual feedback - highlight the specific octave on all keyboards
                const targetOctave = currentOctavePlay + octaveOffset;
                const keys = document.querySelectorAll(`.piano-keyboard [data-note="${note}"][data-octave="${targetOctave}"]`);
                keys.forEach(key => key.classList.add('active'));
            }
        });

        document.addEventListener('keyup', (e) => {
            const note = keyMap[e.key.toLowerCase()];
            if (note) {
                pressedKeys.delete(e.key);

                // Remove note from chord detection
                currentlyPlayingNotes.delete(note);
                updateChordDisplay();

                // Remove visual feedback from the specific octave on all keyboards
                const octaveOffset = getOctaveOffset(e.key);
                const targetOctave = currentOctavePlay + octaveOffset;
                const keys = document.querySelectorAll(`.piano-keyboard [data-note="${note}"][data-octave="${targetOctave}"]`);
                keys.forEach(key => key.classList.remove('active'));
            }
        });

        // Initialize - restore saved tab or default to 'play'
        const savedTab = localStorage.getItem('pianoCurrentTab') || 'play';
        currentTab = savedTab;

        // Set initial tab state without animation
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${savedTab}-tab`).classList.add('active');

        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-button').forEach(btn => {
            if (btn.textContent.toLowerCase().includes(savedTab) ||
                (savedTab === 'play' && btn.textContent.includes('Free Play'))) {
                btn.classList.add('active');
            }
        });

        // Generate appropriate keyboard based on saved tab
        if (savedTab === 'play') {
            generateKeyboard('piano-keyboard-play', currentOctavePlay, true);
        } else if (savedTab === 'chords') {
            generateKeyboard('piano-keyboard-chord', currentOctaveTheory, true);
            updateTheoryDisplay();
        } else if (savedTab === 'scales') {
            generateKeyboard('piano-keyboard-scale', currentOctaveTheory, true);
            updateTheoryDisplay();
        }

