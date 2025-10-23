        const patterns = [
            {
                name: "1. Basic Rock Beat",
                kick: [0, 4, 8, 12],
                snare: [4, 12],
                clap: [],
                hihat: [0, 2, 4, 6, 8, 10, 12, 14],
                cymbal: []
            },
            {
                name: "2. Four on the Floor",
                kick: [0, 4, 8, 12],
                snare: [4, 12],
                clap: [],
                hihat: [2, 6, 10, 14],
                cymbal: [0]
            },
            {
                name: "3. Hip Hop Basic",
                kick: [0, 6, 10],
                snare: [4, 12],
                clap: [4, 12],
                hihat: [0, 2, 4, 6, 8, 10, 12, 14],
                cymbal: []
            },
            {
                name: "4. Disco Beat",
                kick: [0, 4, 8, 12],
                snare: [],
                clap: [4, 12],
                hihat: [2, 6, 10, 14],
                cymbal: [0, 8]
            },
            {
                name: "5. Boom Bap",
                kick: [0, 10],
                snare: [4, 12],
                clap: [4, 12],
                hihat: [0, 2, 4, 6, 8, 10, 12, 14],
                cymbal: []
            },
            {
                name: "6. House Basic",
                kick: [0, 4, 8, 12],
                snare: [4, 12],
                clap: [4, 12],
                hihat: [0, 2, 4, 6, 8, 10, 12, 14],
                cymbal: [0]
            },
            {
                name: "7. Trap Pattern",
                kick: [0, 3, 6, 10, 13],
                snare: [4, 12],
                clap: [],
                hihat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                cymbal: []
            },
            {
                name: "8. Reggae One Drop",
                kick: [4, 12],
                snare: [4, 12],
                clap: [],
                hihat: [2, 6, 10, 14],
                cymbal: [0, 8]
            },
            {
                name: "9. Motown Beat",
                kick: [0, 8],
                snare: [4, 12],
                clap: [4, 12],
                hihat: [0, 2, 4, 6, 8, 10, 12, 14],
                cymbal: []
            },
            {
                name: "10. Breakbeat",
                kick: [0, 5, 10],
                snare: [4, 13],
                clap: [],
                hihat: [0, 2, 4, 6, 8, 10, 12, 14],
                cymbal: [0]
            }
        ];

        const edmPatterns = [
            {
                name: "11. Classic House 4x4",
                kick: [0, 4, 8, 12],
                snare: [],
                clap: [4, 12],
                hihat: [0, 2, 4, 6, 8, 10, 12, 14],
                cymbal: [0, 8],
                shaker: [2, 6, 10, 14]
            },
            {
                name: "12. Progressive House",
                kick: [0, 4, 8, 12],
                snare: [4, 12],
                clap: [4, 12],
                hihat: [2, 6, 10, 14],
                cymbal: [0],
                perc: [1, 3, 5, 7, 9, 11, 13, 15]
            },
            {
                name: "13. Trance Driving",
                kick: [0, 4, 8, 12],
                snare: [4, 12],
                clap: [],
                hihat: [0, 2, 4, 6, 8, 10, 12, 14],
                cymbal: [0, 8],
                rim: [2, 6, 10, 14]
            },
            {
                name: "14. Big Room EDM",
                kick: [0, 4, 8, 12],
                snare: [4, 12],
                clap: [4, 12],
                hihat: [2, 6, 10, 14],
                cymbal: [0, 8],
                tom: [3, 7, 11, 15]
            },
            {
                name: "15. Dubstep Halftime",
                kick: [0, 8],
                snare: [4, 12],
                clap: [4, 12],
                hihat: [0, 2, 4, 6, 8, 10, 12, 14],
                rim: [2, 6, 10, 14],
                perc: [1, 5, 9, 13]
            },
            {
                name: "16. Future Bass",
                kick: [0, 6, 12],
                snare: [4, 12],
                clap: [4, 12],
                hihat: [0, 3, 6, 9, 12, 15],
                cymbal: [0, 8],
                shaker: [0, 3, 6, 9, 12, 15]
            },
            {
                name: "17. Tech House Groove",
                kick: [0, 4, 8, 12],
                snare: [],
                clap: [4, 12],
                hihat: [0, 2, 4, 6, 8, 10, 12, 14],
                rim: [1, 3, 5, 7, 9, 11, 13, 15],
                perc: [2, 6, 10, 14]
            },
            {
                name: "18. Deep House",
                kick: [0, 4, 8, 12],
                snare: [],
                clap: [4, 12],
                hihat: [2, 6, 10, 14],
                cymbal: [0],
                shaker: [0, 2, 4, 6, 8, 10, 12, 14],
                rim: [3, 11]
            },
            {
                name: "19. Hardstyle Kick Roll",
                kick: [0, 2, 4, 6, 8, 10, 12, 14],
                snare: [4, 12],
                clap: [4, 12],
                hihat: [2, 6, 10, 14],
                cymbal: [0, 8],
                rim: [1, 5, 9, 13]
            },
            {
                name: "20. Melodic Techno",
                kick: [0, 4, 8, 12],
                snare: [6, 14],
                clap: [4, 12],
                hihat: [0, 2, 4, 6, 8, 10, 12, 14],
                rim: [1, 5, 9, 13],
                perc: [3, 7, 11, 15],
                shaker: [2, 10]
            }
        ];

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let currentlyPlaying = null;
        let tempo = 120;
        let userPatterns = [];
        let currentEditorPattern = {
            name: "My Custom Beat",
            kick: [],
            snare: [],
            clap: [],
            hihat: [],
            cymbal: [],
            tom: [],
            rim: [],
            shaker: [],
            perc: []
        };

        function createKickDrum() {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.1);
            osc.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + 0.3);

            filter.type = 'lowpass';
            filter.frequency.value = 200;
            filter.Q.value = 1;

            gain.gain.setValueAtTime(1.2, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);

            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.3);
        }

        function createSnare() {
            // White noise for snare body
            const noise = audioContext.createBufferSource();
            const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.15, audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);

            for (let i = 0; i < output.length; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            noise.buffer = noiseBuffer;

            const noiseFilter = audioContext.createBiquadFilter();
            noiseFilter.type = 'highpass';
            noiseFilter.frequency.value = 1000;

            const noiseGain = audioContext.createGain();
            noiseGain.gain.setValueAtTime(0.8, audioContext.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

            // Tone component for body
            const osc = audioContext.createOscillator();
            const oscGain = audioContext.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(180, audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.1);

            oscGain.gain.setValueAtTime(0.5, audioContext.currentTime);
            oscGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(audioContext.destination);

            osc.connect(oscGain);
            oscGain.connect(audioContext.destination);

            noise.start(audioContext.currentTime);
            osc.start(audioContext.currentTime);
            noise.stop(audioContext.currentTime + 0.15);
            osc.stop(audioContext.currentTime + 0.1);
        }

        function createClap() {
            // 808 clap uses multiple short bursts of filtered noise
            for (let i = 0; i < 3; i++) {
                const delay = i * 0.01;
                const noise = audioContext.createBufferSource();
                const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.05, audioContext.sampleRate);
                const output = noiseBuffer.getChannelData(0);

                for (let j = 0; j < output.length; j++) {
                    output[j] = Math.random() * 2 - 1;
                }

                noise.buffer = noiseBuffer;

                const filter = audioContext.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.value = 1000;
                filter.Q.value = 1;

                const gain = audioContext.createGain();
                gain.gain.setValueAtTime(0.4, audioContext.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + 0.05);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(audioContext.destination);

                noise.start(audioContext.currentTime + delay);
                noise.stop(audioContext.currentTime + delay + 0.05);
            }
        }

        function createHiHat() {
            // 808 hi-hat uses 6 square wave oscillators
            const freqs = [296, 285, 365, 445, 540, 630];
            const gain = audioContext.createGain();

            freqs.forEach(freq => {
                const osc = audioContext.createOscillator();
                osc.type = 'square';
                osc.frequency.value = freq;
                osc.connect(gain);
                osc.start(audioContext.currentTime);
                osc.stop(audioContext.currentTime + 0.04);
            });

            const filter = audioContext.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 7000;

            gain.gain.setValueAtTime(0.15, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.04);

            gain.connect(filter);
            filter.connect(audioContext.destination);
        }

        function createCymbal() {
            // 808 open hi-hat/cymbal - similar to closed but longer decay
            const freqs = [296, 285, 365, 445, 540, 630];
            const gain = audioContext.createGain();

            freqs.forEach(freq => {
                const osc = audioContext.createOscillator();
                osc.type = 'square';
                osc.frequency.value = freq;
                osc.connect(gain);
                osc.start(audioContext.currentTime);
                osc.stop(audioContext.currentTime + 0.5);
            });

            const filter = audioContext.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 7000;

            gain.gain.setValueAtTime(0.15, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            gain.connect(filter);
            filter.connect(audioContext.destination);
        }

        function createTom() {
            // 808 tom - pitched oscillator with decay
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(130, audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.2);

            gain.gain.setValueAtTime(0.8, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.2);
        }

        function createRimshot() {
            // 808 rimshot - short, high-pitched click
            const osc1 = audioContext.createOscillator();
            const osc2 = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc1.type = 'square';
            osc2.type = 'square';
            osc1.frequency.value = 1000;
            osc2.frequency.value = 1200;

            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.02);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(audioContext.destination);

            osc1.start(audioContext.currentTime);
            osc2.start(audioContext.currentTime);
            osc1.stop(audioContext.currentTime + 0.02);
            osc2.stop(audioContext.currentTime + 0.02);
        }

        function createCowbell() {
            // 808 cowbell - two square waves
            const osc1 = audioContext.createOscillator();
            const osc2 = audioContext.createOscillator();
            const gain = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();

            osc1.type = 'square';
            osc2.type = 'square';
            osc1.frequency.value = 540;
            osc2.frequency.value = 800;

            filter.type = 'bandpass';
            filter.frequency.value = 650;
            filter.Q.value = 5;

            gain.gain.setValueAtTime(0.5, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);

            osc1.start(audioContext.currentTime);
            osc2.start(audioContext.currentTime);
            osc1.stop(audioContext.currentTime + 0.3);
            osc2.stop(audioContext.currentTime + 0.3);
        }

        function createShaker() {
            // Shaker - short burst of filtered noise
            const noise = audioContext.createBufferSource();
            const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.08, audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);

            for (let i = 0; i < output.length; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            noise.buffer = noiseBuffer;

            const filter = audioContext.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 4000;

            const gain = audioContext.createGain();
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);

            noise.start(audioContext.currentTime);
            noise.stop(audioContext.currentTime + 0.08);
        }

        function createPerc() {
            // Generic percussion - pitched click
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.05);

            gain.gain.setValueAtTime(0.4, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.05);
        }

        function playSound(instrument) {
            switch(instrument) {
                case 'kick': createKickDrum(); break;
                case 'snare': createSnare(); break;
                case 'clap': createClap(); break;
                case 'hihat': createHiHat(); break;
                case 'cymbal': createCymbal(); break;
                case 'tom': createTom(); break;
                case 'rim': createRimshot(); break;
                case 'cowbell': createCowbell(); break;
                case 'shaker': createShaker(); break;
                case 'perc': createPerc(); break;
            }
        }

        // Copy pattern to editor
        function copyPatternToEditor(pattern, copyButton) {
            // Copy pattern data to currentEditorPattern
            const instruments = ['kick', 'snare', 'clap', 'hihat', 'cymbal', 'tom', 'rim', 'cowbell', 'shaker', 'perc'];
            instruments.forEach(inst => {
                if (pattern[inst]) {
                    currentEditorPattern[inst] = [...pattern[inst]];
                } else {
                    currentEditorPattern[inst] = [];
                }
            });

            // Update the editor name
            currentEditorPattern.name = pattern.name + ' (Copy)';

            // Update the pattern name input field
            const patternNameInput = document.getElementById('pattern-name');
            if (patternNameInput) {
                patternNameInput.value = currentEditorPattern.name;
            }

            // Regenerate the editor grid to show the copied pattern
            const editorContainer = document.getElementById('editor-pattern');
            editorContainer.innerHTML = '';
            editorContainer.appendChild(createEditablePattern());

            // Open the editor section if it's closed
            const editorSection = document.getElementById('editor-section');
            if (editorSection && !editorSection.classList.contains('visible')) {
                editorSection.classList.add('visible');
            }

            // Show a brief confirmation message
            const originalText = copyButton.textContent;
            const originalBackground = copyButton.style.background;
            copyButton.textContent = '✓ Copied!';
            copyButton.style.background = '#10b981';
            copyButton.style.border = '1px solid #059669';

            // Scroll to the editor section after a short delay
            setTimeout(() => {
                if (editorSection) {
                    editorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);

            // Reset button after confirmation
            setTimeout(() => {
                copyButton.textContent = originalText;
                copyButton.style.background = originalBackground;
                copyButton.style.border = '1px solid rgba(167, 139, 250, 0.5)';
            }, 1500);
        }

        function createPatternElement(pattern, index) {
            const container = document.createElement('div');
            container.className = 'pattern-container';

            const header = document.createElement('div');
            header.className = 'pattern-header';

            const title = document.createElement('div');
            title.className = 'pattern-title';
            title.textContent = pattern.name;

            const buttonGroup = document.createElement('div');
            buttonGroup.style.display = 'flex';
            buttonGroup.style.gap = '5px';

            const playButton = document.createElement('button');
            playButton.className = 'play-button';
            playButton.textContent = '▶ Play';
            playButton.dataset.patternId = index;

            const copyButton = document.createElement('button');
            copyButton.className = 'play-button copy-button'; // Add copy-button class to distinguish it
            copyButton.textContent = '📋 Copy';
            copyButton.dataset.isCopyButton = 'true'; // Mark as copy button
            copyButton.style.background = 'rgba(139, 92, 246, 0.8)';
            copyButton.style.fontSize = '12px';
            copyButton.style.padding = '8px 12px';
            copyButton.style.border = '1px solid rgba(167, 139, 250, 0.5)';
            copyButton.addEventListener('click', function(e) {
                e.stopPropagation();
                copyPatternToEditor(pattern, e.target);
            });

            buttonGroup.appendChild(playButton);
            buttonGroup.appendChild(copyButton);

            header.appendChild(title);
            header.appendChild(buttonGroup);

            const grid = document.createElement('div');
            grid.className = 'midi-grid';

            // Determine which instruments this pattern uses
            const availableInstruments = Object.keys(pattern).filter(key => key !== 'name');

            availableInstruments.forEach(inst => {
                const label = document.createElement('div');
                label.className = `instrument-label ${inst}`;
                label.textContent = inst.toUpperCase();
                grid.appendChild(label);

                for (let i = 0; i < 16; i++) {
                    const cell = document.createElement('div');
                    cell.className = `grid-cell ${inst}`;
                    cell.dataset.step = i;
                    cell.dataset.instrument = inst;

                    if (i === 0 || i === 4 || i === 8 || i === 12) {
                        const marker = document.createElement('div');
                        marker.className = 'beat-marker';
                        marker.textContent = (i / 4) + 1;
                        cell.appendChild(marker);
                    }

                    if (pattern[inst].includes(i)) {
                        cell.classList.add('active');
                    }

                    grid.appendChild(cell);
                }
            });

            container.appendChild(header);
            container.appendChild(grid);

            return container;
        }

        function createEditablePattern() {
            const container = document.createElement('div');
            container.className = 'pattern-container';

            const header = document.createElement('div');
            header.className = 'pattern-header';

            const title = document.createElement('div');
            title.className = 'pattern-title';
            title.textContent = 'Click cells to add/remove notes';

            const playButton = document.createElement('button');
            playButton.className = 'play-button';
            playButton.textContent = '▶ Play';
            playButton.id = 'play-editor';

            // Add click handler directly to the button
            playButton.addEventListener('click', function() {
                if (this.classList.contains('playing')) {
                    stopPattern();
                    this.textContent = '▶ Play';
                    this.classList.remove('playing');
                } else {
                    stopPattern(); // Stop any other playing pattern

                    const cells = document.getElementById('editor-grid').querySelectorAll('.grid-cell');
                    let currentStep = 0;
                    const stepTime = (60 / tempo) * 1000 / 4;

                    this.textContent = '⏹ Stop';
                    this.classList.add('playing');

                    function step() {
                        cells.forEach(cell => cell.classList.remove('playing'));

                        const stepCells = Array.from(cells).filter(cell =>
                            parseInt(cell.dataset.step) === currentStep
                        );

                        stepCells.forEach(cell => {
                            cell.classList.add('playing');
                            if (cell.classList.contains('active')) {
                                playSound(cell.dataset.instrument);
                            }
                        });

                        currentStep = (currentStep + 1) % 16;
                    }

                    step();
                    currentlyPlaying = setInterval(step, stepTime);
                }
            });

            header.appendChild(title);
            header.appendChild(playButton);

            const grid = document.createElement('div');
            grid.className = 'midi-grid';
            grid.id = 'editor-grid';

            const instruments = ['kick', 'snare', 'clap', 'hihat', 'cymbal', 'tom', 'rim', 'shaker', 'perc'];

            instruments.forEach(inst => {
                const label = document.createElement('div');
                label.className = `instrument-label ${inst}`;
                label.textContent = inst.toUpperCase();
                grid.appendChild(label);

                for (let i = 0; i < 16; i++) {
                    const cell = document.createElement('div');
                    cell.className = `grid-cell ${inst} editable`;
                    cell.dataset.step = i;
                    cell.dataset.instrument = inst;

                    if (i === 0 || i === 4 || i === 8 || i === 12) {
                        const marker = document.createElement('div');
                        marker.className = 'beat-marker';
                        marker.textContent = (i / 4) + 1;
                        cell.appendChild(marker);
                    }

                    // Check if this cell should be active based on currentEditorPattern
                    if (currentEditorPattern[inst] && currentEditorPattern[inst].includes(i)) {
                        cell.classList.add('active');
                    }

                    // Add click/touch handler for editing
                    const handleCellToggle = function() {
                        const step = parseInt(this.dataset.step);
                        const instrument = this.dataset.instrument;

                        if (this.classList.contains('active')) {
                            this.classList.remove('active');
                            const index = currentEditorPattern[instrument].indexOf(step);
                            if (index > -1) {
                                currentEditorPattern[instrument].splice(index, 1);
                            }
                        } else {
                            this.classList.add('active');
                            currentEditorPattern[instrument].push(step);
                            currentEditorPattern[instrument].sort((a, b) => a - b);
                            playSound(instrument);
                        }
                    };

                    // Mouse events
                    cell.addEventListener('click', handleCellToggle);

                    // Touch events for iPad/mobile
                    cell.addEventListener('touchstart', function(e) {
                        e.preventDefault(); // Prevent scrolling
                        handleCellToggle.call(this);
                    });

                    grid.appendChild(cell);
                }
            });

            container.appendChild(header);
            container.appendChild(grid);

            return container;
        }

        function playPattern(patternIndex, button) {
            if (currentlyPlaying !== null) {
                stopPattern();
            }

            // Combine all pattern arrays
            const allPatterns = [...userPatterns, ...patterns, ...edmPatterns];
            const pattern = allPatterns[patternIndex];
            const cells = button.parentElement.parentElement.querySelectorAll('.grid-cell');
            let currentStep = 0;
            const stepTime = (60 / tempo) * 1000 / 4;

            button.textContent = '⏹ Stop';
            button.classList.add('playing');

            function step() {
                cells.forEach(cell => cell.classList.remove('playing'));

                const stepCells = Array.from(cells).filter(cell =>
                    parseInt(cell.dataset.step) === currentStep
                );

                stepCells.forEach(cell => {
                    cell.classList.add('playing');
                    if (cell.classList.contains('active')) {
                        playSound(cell.dataset.instrument);
                    }
                });

                currentStep = (currentStep + 1) % 16;
            }

            step();
            currentlyPlaying = setInterval(step, stepTime);

            button.dataset.intervalId = currentlyPlaying;
        }

        function stopPattern() {
            if (currentlyPlaying !== null) {
                clearInterval(currentlyPlaying);
                currentlyPlaying = null;

                // Reset only actual play buttons, not copy buttons
                document.querySelectorAll('.play-button').forEach(btn => {
                    if (!btn.dataset.isCopyButton) {
                        btn.textContent = '▶ Play';
                        btn.classList.remove('playing');
                    }
                });

                document.querySelectorAll('.grid-cell').forEach(cell => {
                    cell.classList.remove('playing');
                });
            }
        }

        let searchQuery = '';

        function renderAllPatterns() {
            const patternsContainer = document.getElementById('patterns');
            patternsContainer.innerHTML = '';

            // Filter patterns based on search query
            const filterPattern = (pattern) => {
                if (!searchQuery) return true;
                return pattern.name.toLowerCase().includes(searchQuery.toLowerCase());
            };

            const filteredUserPatterns = userPatterns.filter(filterPattern);
            const filteredPatterns = patterns.filter(filterPattern);
            const filteredEdmPatterns = edmPatterns.filter(filterPattern);

            // Add user patterns section if any exist
            if (filteredUserPatterns.length > 0) {
                const userHeader = document.createElement('h2');
                userHeader.textContent = '⭐ YOUR CUSTOM BEATS';
                patternsContainer.appendChild(userHeader);

                filteredUserPatterns.forEach((pattern, index) => {
                    const originalIndex = userPatterns.indexOf(pattern);
                    const patternEl = createPatternElement(pattern, originalIndex);

                    // Add delete button to custom beats
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'play-button';
                    deleteBtn.textContent = '🗑 Delete';
                    deleteBtn.style.background = '#c53030';
                    deleteBtn.style.borderColor = '#c53030';
                    deleteBtn.style.marginLeft = '10px';

                    deleteBtn.addEventListener('click', function() {
                        if (confirm(`Delete "${pattern.name}"?`)) {
                            userPatterns.splice(originalIndex, 1);
                            renderAllPatterns();
                        }
                    });

                    patternEl.querySelector('.pattern-header').appendChild(deleteBtn);
                    patternsContainer.appendChild(patternEl);
                });
            }

            // Add basic patterns section
            if (filteredPatterns.length > 0) {
                filteredPatterns.forEach((pattern) => {
                    const originalIndex = userPatterns.length + patterns.indexOf(pattern);
                    patternsContainer.appendChild(createPatternElement(pattern, originalIndex));
                });
            }

            // Add EDM patterns section
            if (filteredEdmPatterns.length > 0) {
                const edmHeader = document.createElement('h2');
                edmHeader.textContent = '🎧 EDM BEATS';
                patternsContainer.appendChild(edmHeader);

                filteredEdmPatterns.forEach((pattern) => {
                    const originalIndex = userPatterns.length + patterns.length + edmPatterns.indexOf(pattern);
                    patternsContainer.appendChild(createPatternElement(pattern, originalIndex));
                });
            }

            // Show "no results" message if no patterns match
            if (filteredUserPatterns.length === 0 && filteredPatterns.length === 0 && filteredEdmPatterns.length === 0) {
                const noResults = document.createElement('div');
                noResults.style.textAlign = 'center';
                noResults.style.padding = '40px';
                noResults.style.color = '#888';
                noResults.style.fontSize = '16px';
                noResults.innerHTML = `No beats found matching "<strong>${searchQuery}</strong>"`;
                patternsContainer.appendChild(noResults);
            }

            // Re-attach event listeners (excluding copy buttons)
            document.querySelectorAll('.play-button:not([onclick])').forEach(button => {
                if (!button.textContent.includes('Delete') &&
                    !button.dataset.isCopyButton &&
                    button.dataset.patternId) {
                    button.addEventListener('click', function() {
                        const patternId = parseInt(this.dataset.patternId);
                        if (this.classList.contains('playing')) {
                            stopPattern();
                        } else {
                            playPattern(patternId, this);
                        }
                    });
                }
            });
        }

        // Initialize editor
        const editorContainer = document.getElementById('editor-pattern');
        editorContainer.appendChild(createEditablePattern());

        // Render all patterns initially
        renderAllPatterns();

        document.getElementById('stop-all').addEventListener('click', stopPattern);

        // Clear editor button
        document.getElementById('clear-editor').addEventListener('click', function() {
            if (confirm('Clear all notes from the editor?')) {
                const cells = document.getElementById('editor-grid').querySelectorAll('.grid-cell');
                cells.forEach(cell => cell.classList.remove('active'));

                // Reset current editor pattern
                Object.keys(currentEditorPattern).forEach(key => {
                    if (key !== 'name') {
                        currentEditorPattern[key] = [];
                    }
                });
            }
        });

        // Save pattern button
        document.getElementById('save-pattern').addEventListener('click', function() {
            const patternName = document.getElementById('pattern-name').value.trim() || 'My Custom Beat';

            // Check if pattern is empty
            const hasNotes = Object.keys(currentEditorPattern).some(key =>
                key !== 'name' && currentEditorPattern[key].length > 0
            );

            if (!hasNotes) {
                alert('Please add some notes to your beat first!');
                return;
            }

            // Create a copy of the pattern
            const newPattern = {
                name: `${userPatterns.length + 1}. ${patternName}`,
                ...JSON.parse(JSON.stringify(currentEditorPattern))
            };
            delete newPattern.name;
            newPattern.name = `${userPatterns.length + 1}. ${patternName}`;

            userPatterns.push(newPattern);

            // Re-render all patterns
            renderAllPatterns();

            alert(`Beat "${patternName}" saved!`);
        });

        const tempoInput = document.getElementById('tempo-input');
        const tempoUpBtn = document.getElementById('tempo-up');
        const tempoDownBtn = document.getElementById('tempo-down');
        const tapTempoBtn = document.getElementById('tap-tempo');

        let tapTimes = [];

        function updateTempo(newTempo) {
            newTempo = Math.max(60, Math.min(240, newTempo));
            tempo = newTempo;
            tempoInput.value = tempo;

            if (currentlyPlaying !== null) {
                const currentButton = document.querySelector('.play-button.playing');
                const patternId = parseInt(currentButton.dataset.patternId);
                stopPattern();
                playPattern(patternId, currentButton);
            }
        }

        tempoInput.addEventListener('input', function() {
            const newTempo = parseInt(this.value);
            if (!isNaN(newTempo)) {
                updateTempo(newTempo);
            }
        });

        tempoUpBtn.addEventListener('click', function() {
            updateTempo(tempo + 1);
        });

        tempoDownBtn.addEventListener('click', function() {
            updateTempo(tempo - 1);
        });

        tapTempoBtn.addEventListener('click', function() {
            const now = Date.now();
            tapTimes.push(now);

            // Keep only last 4 taps
            if (tapTimes.length > 4) {
                tapTimes.shift();
            }

            // Need at least 2 taps to calculate tempo
            if (tapTimes.length >= 2) {
                const intervals = [];
                for (let i = 1; i < tapTimes.length; i++) {
                    intervals.push(tapTimes[i] - tapTimes[i - 1]);
                }

                const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
                const bpm = Math.round(60000 / avgInterval);
                updateTempo(bpm);
            }

            // Reset if last tap was more than 3 seconds ago
            setTimeout(() => {
                if (tapTimes.length > 0 && Date.now() - tapTimes[tapTimes.length - 1] > 3000) {
                    tapTimes = [];
                }
            }, 3000);
        });

        // Search functionality
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', function() {
            searchQuery = this.value;
            renderAllPatterns();
        });

        // Toggle create beat section
        const createBeatBtn = document.getElementById('create-beat-btn');
        const editorSection = document.getElementById('editor-section');

        createBeatBtn.addEventListener('click', function() {
            editorSection.classList.toggle('visible');
            if (editorSection.classList.contains('visible')) {
                createBeatBtn.textContent = '✓ Close Editor';
                createBeatBtn.classList.add('active');
                editorSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                createBeatBtn.textContent = '✏️ Create Your Own Beat';
                createBeatBtn.classList.remove('active');
            }
        });

        // Switch between tabs
        function switchTab(tab) {
            // Update tab buttons
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            // Show/hide appropriate content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tab}-tab`).classList.add('active');
        }

