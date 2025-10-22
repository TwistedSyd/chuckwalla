        // Circle of Fifths data
        const circleKeys = [
            { major: 'C', minor: 'Am', sharps: 0, flats: 0, color: '#4CAF50' },
            { major: 'G', minor: 'Em', sharps: 1, flats: 0, color: '#8BC34A' },
            { major: 'D', minor: 'Bm', sharps: 2, flats: 0, color: '#CDDC39' },
            { major: 'A', minor: 'Fom', sharps: 3, flats: 0, color: '#FFEB3B' },
            { major: 'E', minor: 'Com', sharps: 4, flats: 0, color: '#FFC107' },
            { major: 'B', minor: 'Gom', sharps: 5, flats: 0, color: '#FF9800' },
            { major: 'Fo/Gm', minor: 'Dom/Emm', sharps: 6, flats: 6, color: '#FF5722' },
            { major: 'Dm', minor: 'Bmm', sharps: 0, flats: 5, color: '#F44336' },
            { major: 'Am', minor: 'Fm', sharps: 0, flats: 4, color: '#E91E63' },
            { major: 'Em', minor: 'Cm', sharps: 0, flats: 3, color: '#9C27B0' },
            { major: 'Bm', minor: 'Gm', sharps: 0, flats: 2, color: '#673AB7' },
            { major: 'F', minor: 'Dm', sharps: 0, flats: 1, color: '#3F51B5' }
        ];

        // Scale formulas
        const majorScale = [0, 2, 4, 5, 7, 9, 11];
        const minorScale = [0, 2, 3, 5, 7, 8, 10];
        const notes = ['C', 'Co', 'D', 'Do', 'E', 'F', 'Fo', 'G', 'Go', 'A', 'Ao', 'B'];

        // Chord formulas (intervals from root)
        const chordShapes = {
            major: { intervals: [0, 4, 7], labels: ['root', 'major 3rd', 'perfect 5th'] },
            minor: { intervals: [0, 3, 7], labels: ['root', 'minor 3rd', 'perfect 5th'] },
            dom7: { intervals: [0, 4, 7, 10], labels: ['root', 'major 3rd', 'perfect 5th', 'minor 7th'] },
            maj7: { intervals: [0, 4, 7, 11], labels: ['root', 'major 3rd', 'perfect 5th', 'major 7th'] }
        };

        let currentRootNote = null;
        let currentChordShape = null;
        let selectedOutline = null;

        // Convert number to Roman numeral
        function toRomanNumeral(num) {
            const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
            return romanNumerals[num - 1] || '';
        }

        // Get the chromatic note index (0-11) for any note name
        function getNoteIndex(noteName) {
            // Map of note names to chromatic index
            const noteMap = {
                'C': 0, 'B#': 0,
                'C#': 1, 'Db': 1,
                'D': 2,
                'D#': 3, 'Eb': 3,
                'E': 4, 'Fb': 4,
                'F': 5, 'E#': 5,
                'F#': 6, 'Gb': 6,
                'G': 7,
                'G#': 8, 'Ab': 8,
                'A': 9,
                'A#': 10, 'Bb': 10,
                'B': 11, 'Cb': 11
            };
            return noteMap[noteName] !== undefined ? noteMap[noteName] : -1;
        }

        // Helper function to format note names with proper sharp/flat symbols
        function formatNoteName(noteName, isMinorKey = false, showMinorIndicator = false) {
            // For minor keys, the final 'm' means "minor", not flat
            if (isMinorKey && noteName.endsWith('m')) {
                // Remove the trailing 'm' (minor indicator)
                const noteWithoutMinor = noteName.slice(0, -1);
                // Replace 'o' with sharp and remaining 'm' with flat
                const formatted = noteWithoutMinor.replace(/o/g, '♯').replace(/m/g, '♭');

                // If showing minor indicator in circle, put 'm' before any accidental
                if (showMinorIndicator) {
                    // Extract base note and accidental
                    const match = formatted.match(/^([A-G])([♯♭])?$/);
                    if (match) {
                        const [, baseNote, accidental] = match;
                        return accidental ? `${baseNote}m${accidental}` : `${baseNote}m`;
                    }
                }
                return formatted;
            } else {
                // For major keys, just replace 'o' with sharp and 'm' with flat
                return noteName.replace(/o/g, '♯').replace(/m/g, '♭');
            }
        }

        // Generate circle segments
        function generateCircle() {
            const svg = document.getElementById('circle-svg');
            const centerX = 300;
            const centerY = 300;
            const outerRadius = 280;
            const middleRadius = 180;
            const innerRadius = 100;
            const segmentAngle = 30; // 360 / 12

            circleKeys.forEach((key, index) => {
                const angle = index * segmentAngle - 105; // Center C at top (12 o'clock)
                const startAngle = angle * Math.PI / 180;
                const endAngle = (angle + segmentAngle) * Math.PI / 180;

                // OUTER RING - Major keys
                const x1 = centerX + outerRadius * Math.cos(startAngle);
                const y1 = centerY + outerRadius * Math.sin(startAngle);
                const x2 = centerX + outerRadius * Math.cos(endAngle);
                const y2 = centerY + outerRadius * Math.sin(endAngle);
                const x3 = centerX + middleRadius * Math.cos(endAngle);
                const y3 = centerY + middleRadius * Math.sin(endAngle);
                const x4 = centerX + middleRadius * Math.cos(startAngle);
                const y4 = centerY + middleRadius * Math.sin(startAngle);

                const majorPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const majorD = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${middleRadius} ${middleRadius} 0 0 0 ${x4} ${y4} Z`;
                majorPath.setAttribute('d', majorD);
                majorPath.setAttribute('fill', key.color);
                majorPath.setAttribute('stroke', '#2d2d2d');
                majorPath.setAttribute('stroke-width', '2');
                majorPath.style.cursor = 'pointer';
                majorPath.style.transition = 'filter 0.3s';

                majorPath.addEventListener('mouseenter', () => {
                    majorPath.style.filter = 'brightness(1.3)';
                });

                majorPath.addEventListener('mouseleave', () => {
                    majorPath.style.filter = 'brightness(1)';
                });

                majorPath.addEventListener('click', () => {
                    // Remove previous outline if exists
                    if (selectedOutline) {
                        selectedOutline.remove();
                        selectedOutline = null;
                    }

                    // Create a new outline path on top
                    const outlinePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    outlinePath.setAttribute('d', majorD);
                    outlinePath.setAttribute('fill', 'none');
                    outlinePath.setAttribute('stroke', '#00d9ff');
                    outlinePath.setAttribute('stroke-width', '4');
                    outlinePath.setAttribute('stroke-linejoin', 'round');
                    outlinePath.setAttribute('stroke-linecap', 'round');
                    outlinePath.setAttribute('class', 'selection-outline');
                    outlinePath.style.pointerEvents = 'none';
                    svg.appendChild(outlinePath);
                    selectedOutline = outlinePath;

                    showKeyInfo(key, true);
                });

                svg.appendChild(majorPath);

                // INNER RING - Minor keys
                const x5 = centerX + middleRadius * Math.cos(startAngle);
                const y5 = centerY + middleRadius * Math.sin(startAngle);
                const x6 = centerX + middleRadius * Math.cos(endAngle);
                const y6 = centerY + middleRadius * Math.sin(endAngle);
                const x7 = centerX + innerRadius * Math.cos(endAngle);
                const y7 = centerY + innerRadius * Math.sin(endAngle);
                const x8 = centerX + innerRadius * Math.cos(startAngle);
                const y8 = centerY + innerRadius * Math.sin(startAngle);

                const minorPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const minorD = `M ${x5} ${y5} A ${middleRadius} ${middleRadius} 0 0 1 ${x6} ${y6} L ${x7} ${y7} A ${innerRadius} ${innerRadius} 0 0 0 ${x8} ${y8} Z`;
                minorPath.setAttribute('d', minorD);
                // Darker version of major key color for minor
                minorPath.setAttribute('fill', key.color);
                minorPath.setAttribute('fill-opacity', '0.6');
                minorPath.setAttribute('stroke', '#2d2d2d');
                minorPath.setAttribute('stroke-width', '2');
                minorPath.style.cursor = 'pointer';
                minorPath.style.transition = 'filter 0.3s';

                minorPath.addEventListener('mouseenter', () => {
                    minorPath.style.filter = 'brightness(1.3)';
                });

                minorPath.addEventListener('mouseleave', () => {
                    minorPath.style.filter = 'brightness(1)';
                });

                minorPath.addEventListener('click', () => {
                    // Remove previous outline if exists
                    if (selectedOutline) {
                        selectedOutline.remove();
                        selectedOutline = null;
                    }

                    // Create a new outline path on top
                    const outlinePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    outlinePath.setAttribute('d', minorD);
                    outlinePath.setAttribute('fill', 'none');
                    outlinePath.setAttribute('stroke', '#ec4899');
                    outlinePath.setAttribute('stroke-width', '4');
                    outlinePath.setAttribute('stroke-linejoin', 'round');
                    outlinePath.setAttribute('stroke-linecap', 'round');
                    outlinePath.setAttribute('class', 'selection-outline');
                    outlinePath.style.pointerEvents = 'none';
                    svg.appendChild(outlinePath);
                    selectedOutline = outlinePath;

                    showKeyInfo(key, false);
                });

                svg.appendChild(minorPath);

                // Add text labels for MAJOR keys (outer ring)
                const labelAngle = (angle + segmentAngle / 2) * Math.PI / 180;
                const majorLabelRadius = (outerRadius + middleRadius) / 2;
                const majorLabelX = centerX + majorLabelRadius * Math.cos(labelAngle);
                const majorLabelY = centerY + majorLabelRadius * Math.sin(labelAngle);

                const majorText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                majorText.setAttribute('x', majorLabelX);
                majorText.setAttribute('y', majorLabelY + 6);
                majorText.setAttribute('text-anchor', 'middle');
                majorText.setAttribute('fill', '#fff');
                majorText.setAttribute('font-size', '18');
                majorText.setAttribute('font-weight', 'bold');
                majorText.textContent = formatNoteName(key.major, false);
                majorText.style.pointerEvents = 'none';
                svg.appendChild(majorText);

                // Add text labels for MINOR keys (inner ring)
                const minorLabelRadius = (middleRadius + innerRadius) / 2;
                const minorLabelX = centerX + minorLabelRadius * Math.cos(labelAngle);
                const minorLabelY = centerY + minorLabelRadius * Math.sin(labelAngle);

                const minorText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                minorText.setAttribute('x', minorLabelX);
                minorText.setAttribute('y', minorLabelY + 5);
                minorText.setAttribute('text-anchor', 'middle');
                minorText.setAttribute('fill', '#fff');
                minorText.setAttribute('font-size', '14');
                minorText.textContent = formatNoteName(key.minor, true, true);
                minorText.style.pointerEvents = 'none';
                svg.appendChild(minorText);
            });
        }

        // Draw chord shape on the circle
        function drawChordShape(rootNote, chordType) {
            const svg = document.getElementById('circle-svg');

            // Remove any existing chord shape lines
            const existingLines = svg.querySelectorAll('.chord-line');
            existingLines.forEach(el => el.remove());

            const centerX = 300;
            const centerY = 300;
            const lineRadius = 250; // Radius for chord shape lines (outside the labels)
            const segmentAngle = 30;

            const rootIndex = getNoteIndex(rootNote);
            if (rootIndex === -1) return;

            const chord = chordShapes[chordType];
            const chordPositions = [];

            // Find circle positions for each chord tone
            chord.intervals.forEach((interval, index) => {
                const noteIndex = (rootIndex + interval) % 12;

                // Find which circle position this note corresponds to
                circleKeys.forEach((key, circlePosition) => {
                    const circleNote = key.major.replace(/o/g, '#').replace(/m/g, 'b').split('/')[0];
                    const circleNoteIndex = getNoteIndex(circleNote);

                    if (circleNoteIndex === noteIndex) {
                        const angle = (circlePosition * segmentAngle - 105 + segmentAngle / 2) * Math.PI / 180;
                        const x = centerX + lineRadius * Math.cos(angle);
                        const y = centerY + lineRadius * Math.sin(angle);
                        chordPositions.push({ x, y, label: chord.labels[index] });
                    }
                });
            });

            // Draw lines connecting the chord tones
            if (chordPositions.length >= 3) {
                // Draw polygon connecting all chord tones
                const pathData = chordPositions.map((pos, i) =>
                    `${i === 0 ? 'M' : 'L'} ${pos.x} ${pos.y}`
                ).join(' ') + ' Z';

                const chordPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                chordPath.setAttribute('d', pathData);
                chordPath.setAttribute('fill', 'rgba(255, 165, 0, 0.15)');
                chordPath.setAttribute('stroke', '#FFA500');
                chordPath.setAttribute('stroke-width', '3');
                chordPath.setAttribute('class', 'chord-line');
                chordPath.style.pointerEvents = 'none';
                svg.appendChild(chordPath);

                // Add dots at chord tone positions
                chordPositions.forEach(pos => {
                    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    dot.setAttribute('cx', pos.x);
                    dot.setAttribute('cy', pos.y);
                    dot.setAttribute('r', '6');
                    dot.setAttribute('fill', '#FFA500');
                    dot.setAttribute('class', 'chord-line');
                    dot.style.pointerEvents = 'none';
                    svg.appendChild(dot);
                });
            }

            currentChordShape = chordType;
        }

        // Add Roman numerals around the circle for scale degrees
        function addRomanNumerals(rootNote, scale, isMajor) {
            const svg = document.getElementById('circle-svg');

            // Remove any existing Roman numerals
            const existingNumerals = svg.querySelectorAll('.scale-degree');
            existingNumerals.forEach(el => el.remove());

            const centerX = 300;
            const centerY = 300;
            const numeralRadius = 295; // Further outside the outer ring
            const segmentAngle = 30; // 360 / 12

            // Get the root note chromatic index
            const rootIndex = getNoteIndex(rootNote);

            if (rootIndex === -1) return;

            // For each position on the circle (all 12 chromatic notes)
            circleKeys.forEach((key, circlePosition) => {
                // Get the note at this circle position
                const circleNote = key.major.replace(/o/g, '#').replace(/m/g, 'b').split('/')[0];
                const circleNoteIndex = getNoteIndex(circleNote);

                if (circleNoteIndex === -1) return; // Skip if note not found

                // Calculate the interval from root to this note
                const interval = (circleNoteIndex - rootIndex + 12) % 12;

                // Check if this interval is in the scale
                const scaleIndex = scale.indexOf(interval);

                if (scaleIndex !== -1) {
                    const degree = scaleIndex + 1;
                    const angle = (circlePosition * segmentAngle - 105 + segmentAngle / 2) * Math.PI / 180;

                    const x = centerX + numeralRadius * Math.cos(angle);
                    const y = centerY + numeralRadius * Math.sin(angle);

                    const numeralText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    numeralText.setAttribute('x', x);
                    numeralText.setAttribute('y', y + 5);
                    numeralText.setAttribute('text-anchor', 'middle');
                    numeralText.setAttribute('fill', '#fff');
                    numeralText.setAttribute('font-size', '16');
                    numeralText.setAttribute('font-weight', 'bold');
                    numeralText.setAttribute('class', 'scale-degree');
                    numeralText.textContent = toRomanNumeral(degree);
                    numeralText.style.pointerEvents = 'none';
                    svg.appendChild(numeralText);
                }
            });
        }

        // Show key information
        function showKeyInfo(key, isMajor = true) {
            const keyDetails = document.getElementById('key-details');
            const chordButtons = document.getElementById('chord-buttons');
            const placeholderText = document.querySelector('.placeholder-text');

            // Hide placeholder, show key details and chord buttons
            placeholderText.style.display = 'none';
            keyDetails.style.display = 'block';
            chordButtons.style.display = 'block';

            // Clear any existing chord shapes
            const svg = document.getElementById('circle-svg');
            const existingLines = svg.querySelectorAll('.chord-line');
            existingLines.forEach(el => el.remove());
            currentChordShape = null;

            // Reset chord button states
            document.querySelectorAll('.chord-shape-btn').forEach(btn => {
                btn.style.background = '#3a3a3a';
                btn.style.borderColor = '#555';
            });

            // Note: selectedOutline is handled in the click handlers, not cleared here

            if (isMajor) {
                // Display major key information
                document.getElementById('selected-key').textContent = `${formatNoteName(key.major, false)} Major`;
                document.getElementById('relative-label').textContent = 'Relative Minor';
                document.getElementById('relative-minor').textContent = `${formatNoteName(key.minor, true)} Minor`;

                // Key signature
                let sigText = '';
                if (key.sharps > 0) {
                    sigText = `${key.sharps} ♯ (sharp${key.sharps > 1 ? 's' : ''})`;
                } else if (key.flats > 0) {
                    sigText = `${key.flats} ♭ (flat${key.flats > 1 ? 's' : ''})`;
                } else {
                    sigText = 'No sharps or flats';
                }
                document.getElementById('key-signature').textContent = sigText;

                // Major scale notes
                const rootNote = key.major.replace('o', '#').replace('m', 'b').split('/')[0];
                currentRootNote = rootNote; // Store for chord shape buttons
                const rootIndex = notes.findIndex(n => n.replace('o', '#').replace('m', 'b') === rootNote);

                if (rootIndex !== -1) {
                    const scaleNotesArray = majorScale.map((interval, index) => {
                        const noteIndex = (rootIndex + interval) % 12;
                        const noteName = formatNoteName(notes[noteIndex], false);
                        const degree = index + 1;

                        return `
                            <div style="text-align: center; flex: 1;">
                                <div style="color: #00d9ff; font-weight: bold; font-size: 13px; margin-bottom: 4px;">${degree}</div>
                                <div style="color: #fff; font-size: 18px; font-weight: bold;">${noteName}</div>
                            </div>
                        `;
                    });
                    document.getElementById('scale-notes').innerHTML = scaleNotesArray.join('');

                    // Add Roman numerals around the circle
                    addRomanNumerals(rootNote, majorScale, true);
                }
            } else {
                // Display minor key information
                document.getElementById('selected-key').textContent = `${formatNoteName(key.minor, true)} Minor`;
                document.getElementById('relative-label').textContent = 'Relative Major';
                document.getElementById('relative-minor').textContent = `${formatNoteName(key.major, false)} Major`;

                // Key signature (same as relative major)
                let sigText = '';
                if (key.sharps > 0) {
                    sigText = `${key.sharps} ♯ (sharp${key.sharps > 1 ? 's' : ''})`;
                } else if (key.flats > 0) {
                    sigText = `${key.flats} ♭ (flat${key.flats > 1 ? 's' : ''})`;
                } else {
                    sigText = 'No sharps or flats';
                }
                document.getElementById('key-signature').textContent = sigText;

                // Natural minor scale notes
                // First remove the trailing 'm' (minor indicator), then replace 'o' with '#' and 'm' with 'b'
                const minorRootNote = key.minor.replace(/m$/, '').replace(/o/g, '#').replace(/m/g, 'b');
                currentRootNote = minorRootNote; // Store for chord shape buttons
                const minorRootIndex = notes.findIndex(n => n.replace(/o/g, '#').replace(/m/g, 'b') === minorRootNote);

                if (minorRootIndex !== -1) {
                    const scaleNotesArray = minorScale.map((interval, index) => {
                        const noteIndex = (minorRootIndex + interval) % 12;
                        const noteName = formatNoteName(notes[noteIndex], false);
                        const degree = index + 1;

                        return `
                            <div style="text-align: center; flex: 1;">
                                <div style="color: #00d9ff; font-weight: bold; font-size: 13px; margin-bottom: 4px;">${degree}</div>
                                <div style="color: #fff; font-size: 18px; font-weight: bold;">${noteName}</div>
                            </div>
                        `;
                    });
                    document.getElementById('scale-notes').innerHTML = scaleNotesArray.join('');

                    // Add Roman numerals around the circle
                    addRomanNumerals(minorRootNote, minorScale, false);
                }
            }
        }

        // Initialize
        generateCircle();

        // Add event listeners for chord shape buttons
        document.querySelectorAll('.chord-shape-btn').forEach(button => {
            button.addEventListener('click', function() {
                const chordType = this.getAttribute('data-chord');

                // Clear previous chord shape if clicking the same button
                if (currentChordShape === chordType) {
                    const svg = document.getElementById('circle-svg');
                    const existingLines = svg.querySelectorAll('.chord-line');
                    existingLines.forEach(el => el.remove());
                    currentChordShape = null;

                    // Remove active state from all buttons
                    document.querySelectorAll('.chord-shape-btn').forEach(btn => {
                        btn.style.background = '#3a3a3a';
                        btn.style.borderColor = '#555';
                    });
                } else {
                    // Draw new chord shape
                    if (currentRootNote) {
                        drawChordShape(currentRootNote, chordType);

                        // Update button states
                        document.querySelectorAll('.chord-shape-btn').forEach(btn => {
                            btn.style.background = '#3a3a3a';
                            btn.style.borderColor = '#555';
                        });
                        this.style.background = '#FFA500';
                        this.style.borderColor = '#FFA500';
                    }
                }
            });

            // Add hover effects
            button.addEventListener('mouseenter', function() {
                if (currentChordShape !== this.getAttribute('data-chord')) {
                    this.style.borderColor = '#666';
                }
            });

            button.addEventListener('mouseleave', function() {
                if (currentChordShape !== this.getAttribute('data-chord')) {
                    this.style.borderColor = '#555';
                }
            });
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
