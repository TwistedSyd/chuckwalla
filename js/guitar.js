        // Audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Current tab
        let currentTab = 'play';

        // Current scale position (1-6, representing which string to start on)
        let currentScalePosition = 1; // 1 = Low E (string 0), 6 = High E (string 5)

        // Show note names toggle
        let showNoteNames = true;

        // Guitar tunings
        const tunings = {
            standard: ['E', 'A', 'D', 'G', 'B', 'E'],
            dropd: ['D', 'A', 'D', 'G', 'B', 'E'],
            halfstep: ['D#', 'G#', 'C#', 'F#', 'A#', 'D#']
        };

        // String base octaves for standard tuning
        const stringOctaves = [2, 2, 3, 3, 3, 4]; // E2, A2, D3, G3, B3, E4

        // Chromatic scale
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        // Note display names
        const noteDisplay = {
            'C#': 'C♯', 'D#': 'D♯', 'F#': 'F♯', 'G#': 'G♯', 'A#': 'A♯'
        };

        // Chord formulas (same as piano)
        const chordFormulas = {
            major: { intervals: [0, 4, 7], formula: '1-3-5', name: 'Major' },
            minor: { intervals: [0, 3, 7], formula: '1-♭3-5', name: 'Minor' },
            diminished: { intervals: [0, 3, 6], formula: '1-♭3-♭5', name: 'Diminished' },
            augmented: { intervals: [0, 4, 8], formula: '1-3-♯5', name: 'Augmented' },
            major7: { intervals: [0, 4, 7, 11], formula: '1-3-5-7', name: 'Major 7th' },
            minor7: { intervals: [0, 3, 7, 10], formula: '1-♭3-5-♭7', name: 'Minor 7th' },
            dominant7: { intervals: [0, 4, 7, 10], formula: '1-3-5-♭7', name: 'Dominant 7th' },
            diminished7: { intervals: [0, 3, 6, 9], formula: '1-♭3-♭5-♭♭7', name: 'Diminished 7th' },
            sus2: { intervals: [0, 2, 7], formula: '1-2-5', name: 'Suspended 2nd' },
            sus4: { intervals: [0, 5, 7], formula: '1-4-5', name: 'Suspended 4th' },
            add9: { intervals: [0, 4, 7, 14], formula: '1-3-5-9', name: 'Add 9' },
            major9: { intervals: [0, 4, 7, 11, 14], formula: '1-3-5-7-9', name: 'Major 9th' },
            minor9: { intervals: [0, 3, 7, 10, 14], formula: '1-♭3-5-♭7-9', name: 'Minor 9th' },
            power: { intervals: [0, 7], formula: '1-5', name: 'Power Chord' }
        };

        // Scale formulas (same as piano)
        const scaleFormulas = {
            major: {
                intervals: [0, 2, 4, 5, 7, 9, 11],
                formula: 'W-W-H-W-W-W-H',
                name: 'Major (Ionian)',
                chords: ['Maj', 'min', 'min', 'Maj', 'Maj', 'min', 'dim']
            },
            minor: {
                intervals: [0, 2, 3, 5, 7, 8, 10],
                formula: 'W-H-W-W-H-W-W',
                name: 'Natural Minor (Aeolian)',
                chords: ['min', 'dim', 'Maj', 'min', 'min', 'Maj', 'Maj']
            },
            harmonicminor: {
                intervals: [0, 2, 3, 5, 7, 8, 11],
                formula: 'W-H-W-W-H-W+H-H',
                name: 'Harmonic Minor',
                chords: ['min', 'dim', 'aug', 'min', 'Maj', 'Maj', 'dim']
            },
            melodicminor: {
                intervals: [0, 2, 3, 5, 7, 9, 11],
                formula: 'W-H-W-W-W-W-H',
                name: 'Melodic Minor',
                chords: ['min', 'min', 'aug', 'Maj', 'Maj', 'dim', 'dim']
            },
            dorian: {
                intervals: [0, 2, 3, 5, 7, 9, 10],
                formula: 'W-H-W-W-W-H-W',
                name: 'Dorian',
                chords: ['min', 'min', 'Maj', 'Maj', 'min', 'dim', 'Maj']
            },
            phrygian: {
                intervals: [0, 1, 3, 5, 7, 8, 10],
                formula: 'H-W-W-W-H-W-W',
                name: 'Phrygian',
                chords: ['min', 'Maj', 'Maj', 'min', 'dim', 'Maj', 'min']
            },
            lydian: {
                intervals: [0, 2, 4, 6, 7, 9, 11],
                formula: 'W-W-W-H-W-W-H',
                name: 'Lydian',
                chords: ['Maj', 'Maj', 'min', 'dim', 'Maj', 'min', 'min']
            },
            mixolydian: {
                intervals: [0, 2, 4, 5, 7, 9, 10],
                formula: 'W-W-H-W-W-H-W',
                name: 'Mixolydian',
                chords: ['Maj', 'min', 'dim', 'Maj', 'min', 'min', 'Maj']
            },
            locrian: {
                intervals: [0, 1, 3, 5, 6, 8, 10],
                formula: 'H-W-W-H-W-W-W',
                name: 'Locrian',
                chords: ['dim', 'Maj', 'min', 'min', 'Maj', 'Maj', 'min']
            },
            majorpentatonic: {
                intervals: [0, 2, 4, 7, 9],
                formula: 'W-W-W+H-W-W+H',
                name: 'Major Pentatonic',
                chords: ['5-note scale - diatonic chords not typically defined']
            },
            minorpentatonic: {
                intervals: [0, 3, 5, 7, 10],
                formula: 'W+H-W-W-W+H-W',
                name: 'Minor Pentatonic',
                chords: ['5-note scale - diatonic chords not typically defined']
            },
            blues: {
                intervals: [0, 3, 5, 6, 7, 10],
                formula: 'W+H-W-H-H-W+H-W',
                name: 'Blues Scale',
                chords: ['6-note scale - often used over dominant 7th chords']
            },
            chromatic: {
                intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                formula: 'H-H-H-H-H-H-H-H-H-H-H-H',
                name: 'Chromatic',
                chords: ['12-note scale - includes all notes']
            },
            wholetone: {
                intervals: [0, 2, 4, 6, 8, 10],
                formula: 'W-W-W-W-W-W',
                name: 'Whole Tone',
                chords: ['6-note scale - augmented harmony']
            }
        };

        // Generate frequency for a note
        function getNoteFrequency(note, octave) {
            const noteIndex = notes.indexOf(note);
            const A4 = 440;
            const A4Index = 9; // A is at index 9
            const semitones = (octave - 4) * 12 + (noteIndex - A4Index);
            return A4 * Math.pow(2, semitones / 12);
        }

        // Play a single note
        function playNote(note, octave, duration = 0.5) {
            const now = audioContext.currentTime;

            // Create oscillator and gain
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.type = 'triangle';
            osc.frequency.value = getNoteFrequency(note, octave);

            // Quick attack for guitar
            const peakGain = 0.3;
            const attackTime = 0.01;

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.exponentialRampToValueAtTime(peakGain, now + attackTime);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.connect(gain);

            // Route through effects chain based on current tone (only in Free Play tab)
            if (preGainNode && gainNode && filterNode && lowCutNode) {
                gain.connect(preGainNode);
                preGainNode.connect(gainNode);
                gainNode.connect(lowCutNode);
                lowCutNode.connect(filterNode);

                // Disconnect filterNode from all outputs to prevent accumulation
                try {
                    filterNode.disconnect();
                } catch (e) {
                    // Already disconnected, ignore
                }

                // Apply effects only in Free Play tab
                if (currentTab === 'play') {
                    // Apply chorus effect if enabled
                    if (currentGuitarTone === 'chorus' && chorusNodes) {
                        const dryGain = audioContext.createGain();
                        const wetGain = audioContext.createGain();
                        dryGain.gain.value = 0.6; // Dry signal
                        wetGain.gain.value = 0.4; // Wet signal

                        filterNode.connect(dryGain);
                        filterNode.connect(chorusNodes.delay);
                        chorusNodes.delay.connect(wetGain);

                        const merger = audioContext.createGain();
                        dryGain.connect(merger);
                        wetGain.connect(merger);
                        merger.connect(audioContext.destination);
                    }
                    // Apply reverb effect if enabled
                    else if (currentGuitarTone === 'reverb' && reverbNode) {
                        const dryGain = audioContext.createGain();
                        const wetGain = audioContext.createGain();
                        dryGain.gain.value = 0.5; // Dry signal
                        wetGain.gain.value = 0.5; // Wet signal (more pronounced)

                        filterNode.connect(dryGain);
                        filterNode.connect(reverbNode);
                        reverbNode.connect(wetGain);

                        const merger = audioContext.createGain();
                        dryGain.connect(merger);
                        wetGain.connect(merger);
                        merger.connect(audioContext.destination);
                    }
                    // No effect - just connect to destination
                    else {
                        filterNode.connect(audioContext.destination);
                    }
                } else {
                    // In Chords/Scales tabs, no effects - just clean sound
                    filterNode.connect(audioContext.destination);
                }
            } else {
                gain.connect(audioContext.destination);
            }

            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + duration);
        }

        // Generate fretboard
        function generateFretboard(containerId, isInteractive = true) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';

            const tuning = tunings[document.getElementById('tuning-select')?.value || 'standard'];
            const numFrets = 12;

            // Calculate fret positions using proper guitar scale (Rule of 18)
            // Frets get progressively smaller as you move up the neck
            const scaleLength = 650; // Virtual scale length in pixels
            const fretConstant = Math.pow(2, 1/12); // 12th root of 2
            const fretPositions = [0]; // Start at nut

            for (let i = 1; i <= numFrets; i++) {
                const distance = scaleLength * (1 - Math.pow(fretConstant, -i));
                fretPositions.push(distance);
            }

            // Scale down to fit our display
            const displayWidth = 850; // Target display width
            const scaleFactor = displayWidth / fretPositions[numFrets];
            for (let i = 0; i < fretPositions.length; i++) {
                fretPositions[i] = fretPositions[i] * scaleFactor;
            }

            const totalWidth = fretPositions[fretPositions.length - 1];

            // Create fretboard wrapper
            const fretboardWrapper = document.createElement('div');
            fretboardWrapper.style.position = 'relative';
            fretboardWrapper.style.width = `${totalWidth + 60}px`;
            fretboardWrapper.style.margin = '0 auto';

            // Get highlight notes if in chords or scales tab
            let highlightNotes = [];
            let rootNote = null;
            if (currentTab === 'chords' || currentTab === 'scales') {
                const { notes: theoryNotes } = calculateNotes();
                highlightNotes = theoryNotes;
                rootNote = document.getElementById(currentTab === 'chords' ? 'root-note-chord' : 'root-note-scale').value;
            }

            // Create each string (high E to low E, so Low E appears at bottom)
            for (let stringIndex = 5; stringIndex >= 0; stringIndex--) {
                const stringNote = tuning[stringIndex];
                const stringNoteIndex = notes.indexOf(stringNote);
                const stringOctave = stringOctaves[stringIndex];

                const stringDiv = document.createElement('div');
                stringDiv.style.position = 'relative';
                stringDiv.style.height = '28px';
                stringDiv.style.marginBottom = '2px';

                // String label
                const label = document.createElement('div');
                label.style.position = 'absolute';
                label.style.left = '0';
                label.style.top = '50%';
                label.style.transform = 'translateY(-50%)';
                label.style.width = '30px';
                label.style.textAlign = 'center';
                label.style.color = '#aaa';
                label.style.fontSize = '11px';
                label.style.fontWeight = 'bold';
                label.textContent = noteDisplay[stringNote] || stringNote;
                stringDiv.appendChild(label);

                // String line (thicker for lower strings)
                const stringLine = document.createElement('div');
                stringLine.style.position = 'absolute';
                stringLine.style.left = '35px';
                stringLine.style.top = '50%';
                stringLine.style.transform = 'translateY(-50%)';
                stringLine.style.width = `${totalWidth}px`;
                stringLine.style.height = `${7 - stringIndex}px`; // Low E (0) = 7px, High E (5) = 2px
                stringLine.style.background = 'linear-gradient(to right, #888 0%, #aaa 50%, #888 100%)';
                stringLine.style.borderRadius = '2px';
                stringDiv.appendChild(stringLine);

                // Add note dots for each fret
                for (let fret = 0; fret <= numFrets; fret++) {
                    const fretNoteIndex = (stringNoteIndex + fret) % 12;
                    const fretNote = notes[fretNoteIndex];
                    const fretOctave = stringOctave + Math.floor((stringNoteIndex + fret) / 12);

                    // Check if should be highlighted
                    const shouldHighlight = highlightNotes.length === 0 || highlightNotes.includes(fretNote);
                    const isRoot = fretNote === rootNote;

                    if (shouldHighlight) {
                        const dot = document.createElement('div');
                        dot.className = 'note-dot';
                        if (isRoot) dot.className += ' root';

                        // Position centered between frets
                        const xPos = 35 + (fretPositions[fret] + fretPositions[fret + 1]) / 2;
                        dot.style.position = 'absolute';
                        dot.style.left = `${xPos}px`;
                        dot.style.top = '50%';
                        dot.style.transform = 'translate(-50%, -50%)';

                        // Style
                        dot.style.width = '22px';
                        dot.style.height = '22px';
                        dot.style.borderRadius = '50%';
                        dot.style.background = isRoot ? '#ec4899' : '#f97316';
                        dot.style.border = '2px solid #fff';
                        dot.style.cursor = 'pointer';
                        dot.style.display = 'flex';
                        dot.style.alignItems = 'center';
                        dot.style.justifyContent = 'center';
                        dot.style.fontSize = '10px';
                        dot.style.fontWeight = 'bold';
                        dot.style.color = '#fff';
                        dot.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.4)';
                        dot.style.transition = 'all 0.2s';

                        dot.textContent = showNoteNames ? (noteDisplay[fretNote] || fretNote) : '';

                        // Store data
                        dot.dataset.note = fretNote;
                        dot.dataset.octave = fretOctave;
                        dot.dataset.string = stringIndex;
                        dot.dataset.fret = fret;

                        // Click/Touch handler
                        const handleNotePlay = function() {
                            playNote(this.dataset.note, parseInt(this.dataset.octave), 0.8);

                            // Visual feedback
                            this.style.transform = 'translate(-50%, -50%) scale(1.3)';
                            this.style.boxShadow = '0 0 20px rgba(249, 115, 22, 0.8)';
                            setTimeout(() => {
                                this.style.transform = 'translate(-50%, -50%) scale(1)';
                                this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.4)';
                            }, 300);
                        };

                        // Mouse events
                        dot.addEventListener('click', handleNotePlay);
                        dot.addEventListener('mouseenter', function() {
                            this.style.transform = 'translate(-50%, -50%) scale(1.2)';
                        });
                        dot.addEventListener('mouseleave', function() {
                            this.style.transform = 'translate(-50%, -50%) scale(1)';
                        });

                        // Touch events for iPad/mobile
                        dot.addEventListener('touchstart', function(e) {
                            e.preventDefault(); // Prevent scrolling and mouse events
                            handleNotePlay.call(this);
                        });

                        stringDiv.appendChild(dot);
                    }
                }

                fretboardWrapper.appendChild(stringDiv);
            }

            // Add fret markers
            for (let fret = 0; fret <= numFrets; fret++) {
                const fretLine = document.createElement('div');
                fretLine.style.position = 'absolute';
                fretLine.style.left = `${35 + fretPositions[fret]}px`;
                fretLine.style.top = '0';
                fretLine.style.width = fret === 0 ? '3px' : '2px';
                fretLine.style.height = '100%';
                fretLine.style.background = fret === 0 ? '#d4af37' : '#555';
                fretLine.style.zIndex = '1';
                fretboardWrapper.appendChild(fretLine);

                // Fret number (centered in the fret space)
                if (fret > 0 && [3, 5, 7, 9, 12].includes(fret)) {
                    const marker = document.createElement('div');
                    const centerPos = 35 + (fretPositions[fret - 1] + fretPositions[fret]) / 2;
                    marker.style.position = 'absolute';
                    marker.style.left = `${centerPos}px`;
                    marker.style.transform = 'translateX(-50%)';
                    marker.style.bottom = '-20px';
                    marker.style.textAlign = 'center';
                    marker.style.color = '#666';
                    marker.style.fontSize = '10px';
                    marker.style.fontWeight = 'bold';
                    marker.textContent = fret;
                    fretboardWrapper.appendChild(marker);
                }
            }

            container.appendChild(fretboardWrapper);
        }

        // Calculate chord or scale notes
        function calculateNotes() {
            const isChordTab = currentTab === 'chords';
            const root = document.getElementById(isChordTab ? 'root-note-chord' : 'root-note-scale').value;
            const type = document.getElementById(isChordTab ? 'chord-type' : 'scale-type').value;
            const formula = isChordTab ? chordFormulas[type] : scaleFormulas[type];

            const rootIndex = notes.indexOf(root);
            const chordNotes = formula.intervals.map(interval => {
                const noteIndex = (rootIndex + interval) % 12;
                return notes[noteIndex];
            });

            return { notes: chordNotes, formula };
        }

        // Update theory display
        function updateTheoryDisplay() {
            const { notes: theoryNotes, formula } = calculateNotes();
            const isChordTab = currentTab === 'chords';
            const suffix = isChordTab ? 'chord' : 'scale';

            const notesStr = theoryNotes.map(n => noteDisplay[n] || n).join(' - ');
            document.getElementById(`info-notes-${suffix}`).textContent = notesStr;
            document.getElementById(`info-intervals-${suffix}`).textContent = formula.intervals.join(', ');
            document.getElementById(`info-formula-${suffix}`).textContent = formula.formula;

            // Show scale chords if in scales tab
            if (!isChordTab && formula.chords) {
                const chordsContainer = document.getElementById('scale-chords-container');
                chordsContainer.innerHTML = '';

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
                        updateScaleDisplay();
                    });
                    chordsContainer.appendChild(scaleButton);

                    // Create clickable chord buttons
                    formula.chords.forEach((chordQuality, index) => {
                        const scaleDegreeNote = theoryNotes[index];
                        const scaleDegreeName = noteDisplay[scaleDegreeNote] || scaleDegreeNote;

                        let chordIntervals;
                        if (chordQuality === 'Maj') chordIntervals = [0, 4, 7];
                        else if (chordQuality === 'min') chordIntervals = [0, 3, 7];
                        else if (chordQuality === 'dim') chordIntervals = [0, 3, 6];
                        else if (chordQuality === 'aug') chordIntervals = [0, 4, 8];

                        const button = document.createElement('button');
                        button.className = 'chord-button';
                        button.innerHTML = `
                            <div class="chord-name">${scaleDegreeName}</div>
                            <div class="chord-quality">${chordQuality}</div>
                        `;

                        button.addEventListener('click', function() {
                            // Remove active class from all buttons
                            document.querySelectorAll('.chord-button').forEach(btn => {
                                btn.classList.remove('active');
                            });
                            // Add active class to clicked button
                            this.classList.add('active');

                            // Highlight and play the chord
                            highlightChordOnFretboard(scaleDegreeNote, chordIntervals);
                            playScaleChord(scaleDegreeNote, chordIntervals);
                        });

                        chordsContainer.appendChild(button);
                    });
                }
            }

            // Regenerate fretboard to show updated notes
            const fretboardId = isChordTab ? 'fretboard-chord' : 'fretboard-scale';
            generateFretboard(fretboardId, true);
        }

        // Update scale display (show all scale notes)
        function updateScaleDisplay() {
            if (currentTab === 'scales') {
                generateFretboard('fretboard-scale', true);
            }
        }

        // Highlight specific chord notes on fretboard
        function highlightChordOnFretboard(rootNote, chordIntervals) {
            if (currentTab === 'scales') {
                const fretboardId = 'fretboard-scale';
                const container = document.getElementById(fretboardId);

                // Calculate chord notes from root and intervals
                const rootIndex = notes.indexOf(rootNote);
                const chordNotes = chordIntervals.map(interval => notes[(rootIndex + interval) % 12]);

                // Hide all note dots except chord notes
                const allDots = container.querySelectorAll('.note-dot, .ghost-note');
                allDots.forEach(dot => {
                    const noteName = dot.dataset.note;
                    if (chordNotes.includes(noteName)) {
                        dot.style.display = '';
                    } else {
                        dot.style.display = 'none';
                    }
                });
            }
        }

        // Highlight a note on the fretboard
        function highlightNoteOnFretboard(note, octave, duration = 1000, highlightAllOctaves = true) {
            const fretboardId = currentTab === 'chords' ? 'fretboard-chord' : 'fretboard-scale';
            const container = document.getElementById(fretboardId);

            if (!container) return;

            // Find note dots - either specific octave or all octaves
            const selector = highlightAllOctaves
                ? `.note-dot[data-note="${note}"]`
                : `.note-dot[data-note="${note}"][data-octave="${octave}"]`;
            const noteDots = container.querySelectorAll(selector);

            if (noteDots.length > 0) {
                // For scales, only light up the FIRST note found (to avoid multiple notes lighting up)
                // For chords, light up all occurrences
                const dotsToHighlight = (currentTab === 'scales' && noteDots.length > 1)
                    ? [noteDots[0]]
                    : Array.from(noteDots);

                // Light up note dots
                dotsToHighlight.forEach(dot => {
                    dot.classList.add('active');
                    setTimeout(() => {
                        dot.classList.remove('active');
                    }, duration);
                });
            } else {
                // Create ghost notes if this note isn't in the current chord/scale
                const tuning = tunings[document.getElementById('tuning-select')?.value || 'standard'];
                const numFrets = 12;
                const fretWidth = 60;

                // Find where this note would appear on the fretboard
                tuning.forEach((stringNote, stringIndex) => {
                    const stringNoteIndex = notes.indexOf(stringNote);
                    const stringOctave = stringOctaves[stringIndex];

                    for (let fret = 0; fret <= numFrets; fret++) {
                        const fretNoteIndex = (stringNoteIndex + fret) % 12;
                        const fretNote = notes[fretNoteIndex];
                        const fretOctave = stringOctave + Math.floor((stringNoteIndex + fret) / 12);

                        if (fretNote === note && fretOctave === octave) {
                            // Get the string line element
                            const stringLines = container.querySelectorAll('.string-line');
                            const actualStringIndex = tuning.length - 1 - stringIndex;
                            const stringLine = stringLines[actualStringIndex];

                            if (stringLine) {
                                // Create ghost note
                                const ghost = document.createElement('div');
                                const rootNote = document.getElementById(currentTab === 'chords' ? 'root-note-chord' : 'root-note-scale')?.value;
                                ghost.className = 'ghost-note';
                                if (note === rootNote) {
                                    ghost.className += ' root';
                                }

                                const xPos = 50 + fret * fretWidth + (fret === 0 ? 0 : fretWidth / 2);
                                ghost.style.left = `${xPos}px`;
                                ghost.style.top = '50%';
                                ghost.textContent = noteDisplay[note] || note;

                                stringLine.appendChild(ghost);

                                // Activate and then remove
                                setTimeout(() => {
                                    ghost.classList.add('active');
                                }, 10);

                                setTimeout(() => {
                                    ghost.remove();
                                }, duration);
                            }
                        }
                    }
                });
            }
        }

        // Play scale chord
        function playScaleChord(chordRoot, chordIntervals) {
            const rootIndex = notes.indexOf(chordRoot);
            const chordNotes = chordIntervals.map(interval => {
                const noteIndex = (rootIndex + interval) % 12;
                return notes[noteIndex];
            });

            const baseOctave = 3;
            const octaves = [];
            let lastNoteIndex = rootIndex;
            let currentOctaveOffset = 0;

            chordNotes.forEach((note, index) => {
                const noteIndex = notes.indexOf(note);
                if (index > 0 && noteIndex <= lastNoteIndex) {
                    currentOctaveOffset++;
                }
                octaves.push(baseOctave + currentOctaveOffset);
                lastNoteIndex = noteIndex;
            });

            chordNotes.forEach((note, index) => {
                playNote(note, octaves[index], 1);
                highlightNoteOnFretboard(note, octaves[index], 1000);
            });
        }

        // Play chord or scale
        function playChordOrScale() {
            const { notes: theoryNotes } = calculateNotes();
            const isChordTab = currentTab === 'chords';
            const root = document.getElementById(isChordTab ? 'root-note-chord' : 'root-note-scale').value;
            const rootIndex = notes.indexOf(root);

            let baseOctave = 3;
            if (currentTab === 'scales') {
                const targetStringIndex = currentScalePosition - 1;
                const rootInfo = findRootNoteOnString(targetStringIndex, root);
                baseOctave = rootInfo ? rootInfo.octave : 3;
            }
            const octaves = [];
            let lastNoteIndex = rootIndex;
            let currentOctaveOffset = 0;

            theoryNotes.forEach((note, index) => {
                const noteIndex = notes.indexOf(note);
                if (index > 0 && noteIndex <= lastNoteIndex) {
                    currentOctaveOffset++;
                }
                octaves.push(baseOctave + currentOctaveOffset);
                lastNoteIndex = noteIndex;
            });

            theoryNotes.forEach((note, index) => {
                playNote(note, octaves[index], 1);
                // For scales, only highlight specific octave; for chords, highlight all octaves
                const highlightAll = currentTab === 'chords';
                highlightNoteOnFretboard(note, octaves[index], 1000, highlightAll);
            });
        }

        // Play chord or scale as arpeggio
        function playChordOrScaleArpeggio() {
            const { notes: theoryNotes } = calculateNotes();
            const isChordTab = currentTab === 'chords';
            const root = document.getElementById(isChordTab ? 'root-note-chord' : 'root-note-scale').value;
            const rootIndex = notes.indexOf(root);

            let notesToPlay = [...theoryNotes];
            if (currentTab === 'scales') {
                notesToPlay.push(theoryNotes[0]);
            }

            let baseOctave = 3;
            if (currentTab === 'scales') {
                const targetStringIndex = currentScalePosition - 1;
                const rootInfo = findRootNoteOnString(targetStringIndex, root);
                baseOctave = rootInfo ? rootInfo.octave : 3;
            }
            const octaves = [];
            let lastNoteIndex = rootIndex;
            let currentOctaveOffset = 0;

            notesToPlay.forEach((note, index) => {
                const noteIndex = notes.indexOf(note);
                if (index > 0 && noteIndex <= lastNoteIndex) {
                    currentOctaveOffset++;
                }
                octaves.push(baseOctave + currentOctaveOffset);
                lastNoteIndex = noteIndex;
            });

            notesToPlay.forEach((note, index) => {
                setTimeout(() => {
                    playNote(note, octaves[index], 0.5);
                    // For scales, only highlight specific octave; for chords, highlight all octaves
                    const highlightAll = currentTab === 'chords';
                    highlightNoteOnFretboard(note, octaves[index], 500, highlightAll);
                }, index * 300);
            });
        }

        // Play scale descending
        function playScaleDescending() {
            const { notes: theoryNotes } = calculateNotes();
            const root = document.getElementById('root-note-scale').value;
            const rootIndex = notes.indexOf(root);

            let notesToPlay = [...theoryNotes];
            notesToPlay.push(theoryNotes[0]); // Add root note at the end

            let baseOctave = 3;
            const targetStringIndex = currentScalePosition - 1;
            const rootInfo = findRootNoteOnString(targetStringIndex, root);
            baseOctave = rootInfo ? rootInfo.octave : 3;

            const octaves = [];
            let lastNoteIndex = rootIndex;
            let currentOctaveOffset = 0;

            notesToPlay.forEach((note, index) => {
                const noteIndex = notes.indexOf(note);
                if (index > 0 && noteIndex <= lastNoteIndex) {
                    currentOctaveOffset++;
                }
                octaves.push(baseOctave + currentOctaveOffset);
                lastNoteIndex = noteIndex;
            });

            // Reverse for descending playback
            const descendingNotes = [...notesToPlay].reverse();
            const descendingOctaves = [...octaves].reverse();

            descendingNotes.forEach((note, index) => {
                setTimeout(() => {
                    playNote(note, descendingOctaves[index], 0.5);
                    highlightNoteOnFretboard(note, descendingOctaves[index], 500, false);
                }, index * 300);
            });
        }

        // Get string name by position
        function getStringNameByPosition(position) {
            const stringNames = ['Low E', 'A', 'D', 'G', 'B', 'High E'];
            return stringNames[position - 1] || 'Low E';
        }

        // Change scale position
        function changeScalePosition(delta) {
            currentScalePosition += delta;
            // Limit to 6 strings
            currentScalePosition = Math.max(1, Math.min(6, currentScalePosition));

            const stringName = getStringNameByPosition(currentScalePosition);
            document.getElementById('scale-position-display').textContent = `${stringName} String`;

            // Regenerate fretboard to show notes at new position
            if (currentTab === 'scales') {
                generateFretboard('fretboard-scale', true);
            }
        }

        // Get scale box pattern notes (8 notes: root through 7 scale degrees back to root)
        // Returns array of {string, fret, note, octave, isRoot} for the box pattern
        function getScaleBoxPattern(stringIndex, rootNote, scaleNotes) {
            const tuning = tunings[document.getElementById('tuning-select')?.value || 'standard'];

            // Find root note on the target string
            const rootInfo = findRootNoteOnString(stringIndex, rootNote);
            if (!rootInfo) return [];

            // Build ordered scale starting from root
            const rootIndex = scaleNotes.indexOf(rootNote);
            const orderedScale = [];
            for (let i = 0; i < 7; i++) {
                orderedScale.push(scaleNotes[(rootIndex + i) % scaleNotes.length]);
            }

            // Find all possible positions for scale notes on 3 strings
            const targetStrings = [stringIndex, Math.min(stringIndex + 1, 5), Math.min(stringIndex + 2, 5)];
            const allCandidates = [];

            targetStrings.forEach(str => {
                const stringNote = tuning[str];
                const stringNoteIndex = notes.indexOf(stringNote);
                const stringOctave = stringOctaves[str];

                // Search fret range starting from root position going higher
                const minFret = Math.max(0, rootInfo.fret);
                const maxFret = Math.min(12, rootInfo.fret + 12);

                for (let fret = minFret; fret <= maxFret; fret++) {
                    const fretNoteIndex = (stringNoteIndex + fret) % 12;
                    const fretNote = notes[fretNoteIndex];
                    const fretOctave = stringOctave + Math.floor((stringNoteIndex + fret) / 12);

                    // Only consider notes at or above the starting root octave
                    if (str < rootInfo.string || (str === rootInfo.string && fret < rootInfo.fret)) {
                        continue;
                    }

                    // Find which scale degree this note is
                    const noteScaleIndex = orderedScale.indexOf(fretNote);
                    if (noteScaleIndex !== -1) {
                        // Calculate actual position accounting for octave
                        let scalePosition = noteScaleIndex;

                        // If this is a root note and it's higher than the starting root, it's position 7 (ending root)
                        if (fretNote === rootNote && (str > rootInfo.string || (str === rootInfo.string && fret > rootInfo.fret))) {
                            // Check if this is actually higher in pitch
                            if (fretOctave > rootInfo.octave) {
                                scalePosition = 7; // Ending root
                            }
                        }

                        allCandidates.push({
                            string: str,
                            fret: fret,
                            note: fretNote,
                            octave: fretOctave,
                            isRoot: fretNote === rootNote,
                            scalePosition: scalePosition,
                            distance: Math.abs(fret - rootInfo.fret) + Math.abs(str - stringIndex)
                        });
                    }
                }
            });

            // Select exactly 8 notes - one for each scale degree plus ending root
            const boxNotes = [];
            const usedPositions = new Set();

            for (let pos = 0; pos < 8; pos++) {
                // Find candidates for this scale position
                const candidates = allCandidates.filter(c => {
                    const posKey = `${c.string}_${c.fret}`;
                    return c.scalePosition === pos && !usedPositions.has(posKey);
                });

                if (candidates.length > 0) {
                    // Choose the closest one to create a compact pattern
                    candidates.sort((a, b) => a.distance - b.distance);
                    const chosen = candidates[0];
                    boxNotes.push(chosen);
                    usedPositions.add(`${chosen.string}_${chosen.fret}`);
                }
            }

            return boxNotes;
        }

        // Find the first occurrence of root note on a specific string
        function findRootNoteOnString(stringIndex, rootNote) {
            const tuning = tunings[document.getElementById('tuning-select')?.value || 'standard'];
            const stringNote = tuning[stringIndex];
            const stringNoteIndex = notes.indexOf(stringNote);
            const rootNoteIndex = notes.indexOf(rootNote);
            const stringOctave = stringOctaves[stringIndex];

            // Find the fret where root note appears on this string
            for (let fret = 0; fret <= 12; fret++) {
                const fretNoteIndex = (stringNoteIndex + fret) % 12;
                if (fretNoteIndex === rootNoteIndex) {
                    const fretOctave = stringOctave + Math.floor((stringNoteIndex + fret) / 12);
                    return { fret, octave: fretOctave, string: stringIndex };
                }
            }
            return null;
        }

        // Switch tabs
        function switchTab(tab) {
            currentTab = tab;
            localStorage.setItem('guitarCurrentTab', tab);

            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
                if (btn.onclick && btn.onclick.toString().includes(tab)) {
                    btn.classList.add('active');
                }
            });

            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tab}-tab`).classList.add('active');

            if (tab === 'play') {
                generateFretboard('fretboard-play', true);
            } else if (tab === 'chords') {
                generateFretboard('fretboard-chord', true);
                updateTheoryDisplay();
            } else if (tab === 'scales') {
                generateFretboard('fretboard-scale', true);
                updateTheoryDisplay();
            }
        }

        // Event listeners
        document.getElementById('root-note-chord').addEventListener('change', updateTheoryDisplay);
        document.getElementById('chord-type').addEventListener('change', updateTheoryDisplay);
        document.getElementById('root-note-scale').addEventListener('change', updateTheoryDisplay);
        document.getElementById('scale-type').addEventListener('change', updateTheoryDisplay);
        document.getElementById('tuning-select').addEventListener('change', () => generateFretboard('fretboard-play', true));

        // Initialize
        const savedTab = localStorage.getItem('guitarCurrentTab') || 'play';
        currentTab = savedTab;

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${savedTab}-tab`).classList.add('active');

        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.onclick && btn.onclick.toString().includes(savedTab)) {
                btn.classList.add('active');
            }
        });

        if (savedTab === 'play') {
            generateFretboard('fretboard-play', true);
        } else if (savedTab === 'chords') {
            generateFretboard('fretboard-chord', true);
            updateTheoryDisplay();
        } else if (savedTab === 'scales') {
            generateFretboard('fretboard-scale', true);
            updateTheoryDisplay();
        }

        // Guitar tone toggle function and audio effects
        let currentGuitarTone = 'none';
        let preGainNode = null;
        let gainNode = null;
        let chorusNodes = null;
        let reverbNode = null;
        let filterNode = null;
        let lowCutNode = null;

        // Create audio nodes for guitar effects
        function setupGuitarEffects() {
            preGainNode = audioContext.createGain();
            gainNode = audioContext.createGain();
            filterNode = audioContext.createBiquadFilter();
            lowCutNode = audioContext.createBiquadFilter();

            preGainNode.gain.value = 1;
            gainNode.gain.value = 1;
            filterNode.type = 'lowpass';
            filterNode.frequency.value = 5000;
            lowCutNode.type = 'highpass';
            lowCutNode.frequency.value = 80;

            // Create chorus effect (delay with LFO)
            const chorusDelay = audioContext.createDelay();
            const chorusLFO = audioContext.createOscillator();
            const chorusDepth = audioContext.createGain();

            chorusDelay.delayTime.value = 0.025; // Base delay
            chorusLFO.frequency.value = 2; // Modulation speed (2 Hz for noticeable effect)
            chorusDepth.gain.value = 0.008; // Modulation depth

            chorusLFO.connect(chorusDepth);
            chorusDepth.connect(chorusDelay.delayTime);
            chorusLFO.start();

            chorusNodes = {
                delay: chorusDelay,
                lfo: chorusLFO,
                depth: chorusDepth
            };

            // Create reverb effect (convolver with synthetic impulse response)
            reverbNode = audioContext.createConvolver();
            const reverbTime = 3; // 3 seconds of reverb
            const sampleRate = audioContext.sampleRate;
            const length = sampleRate * reverbTime;
            const impulse = audioContext.createBuffer(2, length, sampleRate);

            for (let channel = 0; channel < 2; channel++) {
                const channelData = impulse.getChannelData(channel);
                for (let i = 0; i < length; i++) {
                    // Create exponential decay with random noise
                    channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
                }
            }
            reverbNode.buffer = impulse;
        }

        setupGuitarEffects();

        window.toggleGuitarTone = function(tone) {
            // Toggle effect on/off
            if (currentGuitarTone === tone) {
                // Turn off the effect
                currentGuitarTone = 'none';
                document.getElementById(`${tone}-btn`).classList.remove('active');
            } else {
                // Turn on the new effect and turn off any other effect
                document.querySelectorAll('#chorus-btn, #reverb-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.getElementById(`${tone}-btn`).classList.add('active');
                currentGuitarTone = tone;
            }
        };

        // Chord detection for guitar free play
        let currentlyPlayingNotes = new Set();

        // Store note timeouts to manage note removal
        const noteTimeouts = new Map();

        // Override note click handler to track chord detection
        const originalGenerateFretboard = generateFretboard;
        generateFretboard = function(containerId, isInteractive = true) {
            originalGenerateFretboard(containerId, isInteractive);

            // Add chord detection to free play
            if (containerId === 'fretboard-play') {
                const dots = document.querySelectorAll('#fretboard-play .note-dot');
                dots.forEach(dot => {
                    // Add additional click handler for chord detection
                    // The original event listeners from generateFretboard still work
                    dot.addEventListener('click', function() {
                        const note = this.dataset.note;

                        // Clear any existing timeout for this note
                        if (noteTimeouts.has(note)) {
                            clearTimeout(noteTimeouts.get(note));
                        }

                        // Track notes for chord detection
                        currentlyPlayingNotes.add(note);

                        // Flash animation on the display
                        const chordDisplay = document.getElementById('current-chord-display-guitar');
                        chordDisplay.style.transition = 'none';
                        chordDisplay.style.background = 'rgba(249, 115, 22, 0.3)';
                        chordDisplay.style.boxShadow = '0 0 10px rgba(249, 115, 22, 0.5)';

                        setTimeout(() => {
                            chordDisplay.style.transition = 'all 0.8s ease-out';
                            chordDisplay.style.background = 'rgba(0, 0, 0, 0.3)';
                            chordDisplay.style.boxShadow = 'none';
                        }, 50);

                        // Detect chord
                        setTimeout(() => {
                            detectGuitarChord();
                        }, 50);

                        // Remove note after 3 seconds (longer display time)
                        const timeout = setTimeout(() => {
                            currentlyPlayingNotes.delete(note);
                            noteTimeouts.delete(note);

                            if (currentlyPlayingNotes.size === 0) {
                                document.getElementById('chord-name-guitar').textContent = '-';
                                document.getElementById('chord-notes-guitar').textContent = 'Click notes to see the chord';
                            } else {
                                // Re-detect chord with remaining notes
                                detectGuitarChord();
                            }
                        }, 3000);

                        noteTimeouts.set(note, timeout);
                    });
                });
            }
        };

        function detectGuitarChord() {
            if (currentlyPlayingNotes.size === 0) return;

            const notesArray = Array.from(currentlyPlayingNotes);
            const chordNameDisplay = document.getElementById('chord-name-guitar');
            const chordNotesDisplay = document.getElementById('chord-notes-guitar');

            if (notesArray.length === 1) {
                chordNameDisplay.textContent = noteDisplay[notesArray[0]] || notesArray[0];
                chordNotesDisplay.textContent = 'Single note';
                return;
            }

            // Use same chord detection logic as piano
            const noteIndices = notesArray.map(n => notes.indexOf(n)).sort((a, b) => a - b);

            const chordPatterns = {
                '0,4,7': 'Major',
                '0,3,7': 'Minor',
                '0,3,6': 'Diminished',
                '0,4,8': 'Augmented',
                '0,4,7,11': 'Major 7th',
                '0,3,7,10': 'Minor 7th',
                '0,4,7,10': 'Dominant 7th',
                '0,2,7': 'Sus2',
                '0,5,7': 'Sus4',
                '0,7': 'Power Chord'
            };

            // Try each note as root
            for (let i = 0; i < noteIndices.length; i++) {
                const potentialRoot = noteIndices[i];
                const intervals = noteIndices.map(idx => (idx - potentialRoot + 12) % 12).sort((a, b) => a - b);
                const intervalSig = intervals.join(',');
                const chordType = chordPatterns[intervalSig];

                if (chordType) {
                    const rootDisplay = noteDisplay[notes[potentialRoot]] || notes[potentialRoot];
                    const inversionText = i > 0 ? ` (${i === 1 ? '1st' : i === 2 ? '2nd' : i === 3 ? '3rd' : i + 'th'} inv)` : '';
                    chordNameDisplay.textContent = `${rootDisplay} ${chordType}${inversionText}`;
                    chordNotesDisplay.textContent = notesArray.map(n => noteDisplay[n] || n).join(', ');
                    return;
                }
            }

            // If no match, just show notes
            chordNameDisplay.textContent = notesArray.length + ' notes';
            chordNotesDisplay.textContent = notesArray.map(n => noteDisplay[n] || n).join(', ');
        }

        // Show note names toggle
        document.getElementById('show-notes-toggle').addEventListener('change', function() {
            showNoteNames = this.checked;
            // Re-render the current fretboard
            if (currentTab === 'play') {
                generateFretboard('fretboard-play', true);
            } else if (currentTab === 'chords') {
                updateChordDisplay();
            } else if (currentTab === 'scales') {
                updateScaleDisplay();
            }
        });

        // Re-generate the fretboard if we're on the play tab to attach chord detection
        if (currentTab === 'play') {
            generateFretboard('fretboard-play', true);
        }

