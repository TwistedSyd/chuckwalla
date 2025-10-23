const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const noteDisplay = {
  'C#': 'C♯', 'D#': 'D♯', 'F#': 'F♯', 'G#': 'G♯', 'A#': 'A♯'
};

const tunings = {
  standard: ['E', 'A', 'D', 'G', 'B', 'E'],
  dropd: ['D', 'A', 'D', 'G', 'B', 'E'],
  halfstep: ['D#', 'G#', 'C#', 'F#', 'A#', 'D#']
};

const stringOctaves = [2, 2, 3, 3, 3, 4]; // E2, A2, D3, G3, B3, E4

function GuitarFretboard({
  tuning = 'standard',
  highlightedNotes = [],
  rootNote = null,
  onNotePlay,
  showNoteLabels = true,
  boxPattern = null,
  activeNotes = []
}) {
  const numFrets = 21;

  const getNoteAtFret = (stringIndex, fret) => {
    const openNote = tunings[tuning][stringIndex];
    const openNoteIndex = notes.indexOf(openNote);
    const noteIndex = (openNoteIndex + fret) % 12;
    const octave = stringOctaves[stringIndex] + Math.floor((openNoteIndex + fret) / 12);
    return { note: notes[noteIndex], octave };
  };

  // Calculate fret positions using proper guitar fret spacing formula
  // This matches the original implementation exactly
  const scaleLength = 650; // Virtual scale length
  const fretConstant = Math.pow(2, 1/12); // 12th root of 2
  const fretPositions = [0]; // Start at nut

  // Calculate positions up to fret 12 using proper scaling
  for (let i = 1; i <= 12; i++) {
    const distance = scaleLength * (1 - Math.pow(fretConstant, -i));
    fretPositions.push(distance);
  }

  // After fret 12, use constant spacing
  if (numFrets > 12) {
    const lastFretWidth = fretPositions[12] - fretPositions[11];
    for (let i = 13; i <= numFrets; i++) {
      fretPositions.push(fretPositions[i - 1] + lastFretWidth);
    }
  }

  // Scale down to fit our display
  const displayWidth = 1200; // Target width for fretboard
  const scaleFactor = displayWidth / fretPositions[numFrets];
  for (let i = 0; i < fretPositions.length; i++) {
    fretPositions[i] = fretPositions[i] * scaleFactor;
  }

  const totalWidth = fretPositions[fretPositions.length - 1];
  const leftPadding = 35; // Space for string labels (matching original)

  return (
    <div className="fretboard-container">
      <div className="fretboard" style={{ width: `${totalWidth + 60}px`, margin: '0 auto' }}>
        {/* Render strings in reverse order so low E appears at bottom */}
        {Array.from({ length: 6 }).map((_, reverseIndex) => {
          const stringIndex = 5 - reverseIndex; // 5, 4, 3, 2, 1, 0

          // Check if open string (fret 0) has a note dot
          const openStringNote = getNoteAtFret(stringIndex, 0);
          const hasOpenStringDot = highlightedNotes.length === 0 || highlightedNotes.includes(openStringNote.note);

          return (
            <div key={stringIndex} className="string-row" style={{ position: 'relative', height: '28px', marginBottom: '2px' }}>
              {/* String label - only show if no button at open position */}
              {!hasOpenStringDot && (
                <div style={{
                  position: 'absolute',
                  left: `${leftPadding - 20}px`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  background: '#2d2d2d',
                  border: '2px solid #555',
                  borderRadius: '50%',
                  zIndex: 15,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  opacity: 0.6
                }}>
                  {noteDisplay[tunings[tuning][stringIndex]] || tunings[tuning][stringIndex]}
                </div>
              )}
              {/* String line */}
              <div style={{
                position: 'absolute',
                left: `${leftPadding - 15}px`,
                top: '50%',
                transform: 'translateY(-50%)',
                width: `${totalWidth + 15}px`,
                height: `${7 - stringIndex}px`,
                background: 'linear-gradient(to right, #888 0%, #aaa 50%, #888 100%)',
                borderRadius: '2px'
              }} />
              {/* Note dots */}
              {Array.from({ length: numFrets + 1 }).map((_, fret) => {
                const { note, octave } = getNoteAtFret(stringIndex, fret);
                const shouldHighlight = highlightedNotes.length === 0 || highlightedNotes.includes(note);
                const isRoot = note === rootNote;

                if (!shouldHighlight) return null;

                // Check if this note is in the box pattern (for scales tab)
                let isInBoxPattern = true;
                if (boxPattern !== null) {
                  isInBoxPattern = boxPattern.some(
                    bp => bp.string === stringIndex && bp.fret === fret && bp.note === note
                  );
                }

                // Check if this note is currently active (being played)
                const isActive = activeNotes.some(
                  an => an.string === stringIndex && an.fret === fret
                );

                // Position centered in the fret space
                let xPos;
                if (fret === 0) {
                  // Open string - position to the LEFT of the nut (yellow line)
                  xPos = leftPadding - 20;
                } else {
                  // Fretted notes - position between fret wires
                  xPos = leftPadding + (fretPositions[fret - 1] + fretPositions[fret]) / 2 - 19;
                }

                return (
                  <div
                    key={fret}
                    className={`note-dot ${isRoot ? 'root' : ''} ${!isInBoxPattern ? 'ghosted' : ''} ${isActive ? 'active' : ''}`}
                    style={{
                      position: 'absolute',
                      left: `${xPos}px`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: isRoot ? '#ec4899' : '#f97316',
                      border: '2px solid #fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: '#fff',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                      zIndex: 10,
                      opacity: !isInBoxPattern ? 0.5 : 1
                    }}
                    onClick={() => onNotePlay && onNotePlay(note, octave, 0.8)}
                  >
                    {showNoteLabels ? (noteDisplay[note] || note) : ''}
                  </div>
                );
              })}
            </div>
          );
        })}
        {/* Fret lines */}
        {Array.from({ length: numFrets + 1 }).map((_, fret) => {
          return (
            <div
              key={fret}
              style={{
                position: 'absolute',
                left: `${leftPadding + fretPositions[fret]}px`,
                top: '0',
                width: fret === 0 ? '3px' : '2px',
                height: '100%',
                background: fret === 0 ? '#d4af37' : '#555',
                zIndex: 1
              }}
            />
          );
        })}
        {/* Fret markers */}
        {[3, 5, 7, 9, 12, 15, 17, 19, 21].map(fret => {
          const centerPos = leftPadding + (fretPositions[fret - 1] + fretPositions[fret]) / 2;
          return (
            <div
              key={fret}
              style={{
                position: 'absolute',
                left: `${centerPos}px`,
                transform: 'translateX(-50%)',
                bottom: '-20px',
                textAlign: 'center',
                color: '#666',
                fontSize: '10px',
                fontWeight: 'bold'
              }}
            >
              {fret}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GuitarFretboard;
