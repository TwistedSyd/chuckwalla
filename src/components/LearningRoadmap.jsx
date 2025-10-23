import './LearningRoadmap.css';

function LearningRoadmap() {
  return (
    <div className="tab-content">
      <div className="roadmap-container">
        <div className="roadmap-section">
          <span className="level-badge level-beginner">LEVEL 1: BEGINNER</span>
          <h2>🎵 Understanding the Basics</h2>
          <p>Start your musical journey by understanding the fundamental building blocks of music.</p>

          <h3>1. The Musical Alphabet</h3>
          <ul>
            <li>Learn the 12 notes: C, C#, D, D#, E, F, F#, G, G#, A, A#, B</li>
            <li>Understand whole steps (2 semitones) and half steps (1 semitone)</li>
            <li>Notice that there's no black key between E-F and B-C</li>
          </ul>

          <div className="tip-box">
            <strong>Practice Tip:</strong> Use the Free Play tab to familiarize yourself with the keyboard layout. Play each note and listen to how they sound.
          </div>

          <h3>2. Major Scales</h3>
          <ul>
            <li>Start with C Major (all white keys: C-D-E-F-G-A-B-C)</li>
            <li>Learn the pattern: Whole-Whole-Half-Whole-Whole-Whole-Half (W-W-H-W-W-W-H)</li>
            <li>Practice in different keys using the Scales tab</li>
          </ul>

          <div className="tip-box">
            <strong>Practice Tip:</strong> Use the Scales tab, select "Major (Ionian)", and try different root notes. Click "Play Ascending" to hear the scale.
          </div>

          <h3>3. Basic Chords - Triads</h3>
          <ul>
            <li>Major chords: Root + Major 3rd + Perfect 5th (sounds happy)</li>
            <li>Minor chords: Root + Minor 3rd + Perfect 5th (sounds sad)</li>
            <li>Practice C Major (C-E-G) and A Minor (A-C-E)</li>
          </ul>

          <div className="tip-box">
            <strong>Practice Tip:</strong> Use the Chords tab to explore Major and Minor chords. Click on different root notes to hear how they sound.
          </div>
        </div>

        <div className="roadmap-section">
          <span className="level-badge level-beginner">LEVEL 2: BEGINNER+</span>
          <h2>🎼 Building Chord Progressions</h2>
          <p>Learn how chords work together to create music.</p>

          <h3>4. Diatonic Chords</h3>
          <ul>
            <li>Every scale has 7 diatonic chords built from its notes</li>
            <li>In C Major: C (I), Dm (ii), Em (iii), F (IV), G (V), Am (vi), Bdim (vii°)</li>
            <li>Roman numerals show the position (I, II, III, IV, V, VI, VII)</li>
            <li>Uppercase = Major, lowercase = minor, ° = diminished</li>
          </ul>

          <div className="tip-box">
            <strong>Practice Tip:</strong> Go to Scales tab, select a Major scale, and click on each diatonic chord button to see and hear them on the keyboard.
          </div>

          <h3>5. Common Chord Progressions</h3>
          <ul>
            <li>I-IV-V (e.g., C-F-G in C Major) - Classic rock/pop</li>
            <li>I-V-vi-IV (e.g., C-G-Am-F) - Very popular in modern music</li>
            <li>ii-V-I (e.g., Dm-G-C) - Jazz standard</li>
            <li>I-vi-IV-V (e.g., C-Am-F-G) - 50s progression</li>
          </ul>

          <h3>6. Minor Scales</h3>
          <ul>
            <li>Natural Minor: Most basic minor scale (sad, melancholic)</li>
            <li>Harmonic Minor: Raised 7th degree (exotic, dramatic)</li>
            <li>Melodic Minor: Raised 6th and 7th (smooth, jazzy)</li>
          </ul>
        </div>

        <div className="roadmap-section">
          <span className="level-badge level-intermediate">LEVEL 3: INTERMEDIATE</span>
          <h2>🎸 Advanced Chords & Techniques</h2>
          <p>Expand your musical vocabulary with richer harmonies.</p>

          <h3>7. 7th Chords</h3>
          <ul>
            <li>Major 7th: Dreamy, jazzy sound (e.g., Cmaj7)</li>
            <li>Dominant 7th: Tension, wants to resolve (e.g., G7)</li>
            <li>Minor 7th: Smooth, mellow (e.g., Dm7)</li>
            <li>Diminished 7th: Very tense, transition chord</li>
          </ul>

          <h3>8. Suspended & Extended Chords</h3>
          <ul>
            <li>sus2 & sus4: Create tension and release</li>
            <li>6th chords: Add color and jazz flavor</li>
            <li>9th chords: Complex, sophisticated sound</li>
            <li>Use these to add variety to basic progressions</li>
          </ul>

          <h3>9. Modes</h3>
          <ul>
            <li>Dorian: Minor with raised 6th (jazzy, funky)</li>
            <li>Phrygian: Minor with flat 2nd (Spanish, dark)</li>
            <li>Lydian: Major with raised 4th (dreamy, ethereal)</li>
            <li>Mixolydian: Major with flat 7th (blues, rock)</li>
            <li>Locrian: Most dissonant mode (rarely used)</li>
          </ul>

          <div className="tip-box">
            <strong>Practice Tip:</strong> Explore different modes in the Scales tab. Each mode has a unique character and feeling.
          </div>
        </div>

        <div className="roadmap-section">
          <span className="level-badge level-advanced">LEVEL 4: ADVANCED</span>
          <h2>🎹 Mastery & Creativity</h2>
          <p>Apply your knowledge to create original music.</p>

          <h3>10. Chord Substitutions</h3>
          <ul>
            <li>Replace I with I6 or Imaj7 for variety</li>
            <li>Use relative minors (vi for I, iii for V)</li>
            <li>Secondary dominants (V7/V, V7/IV)</li>
            <li>Tritone substitutions in jazz</li>
          </ul>

          <h3>11. Modal Interchange</h3>
          <ul>
            <li>Borrow chords from parallel modes</li>
            <li>Use minor iv in major keys for emotion</li>
            <li>Flat VI and flat VII from natural minor</li>
            <li>Creates unexpected but pleasing sounds</li>
          </ul>

          <h3>12. Creating Your Own Music</h3>
          <ul>
            <li>Start with a chord progression you like</li>
            <li>Compose melodies using the scale notes</li>
            <li>Add rhythm and dynamics</li>
            <li>Experiment with different chord voicings</li>
            <li>Trust your ears - if it sounds good, it is good!</li>
          </ul>

          <div className="tip-box">
            <strong>Final Tip:</strong> Music theory is a tool, not a rule book. Use what you've learned to express yourself creatively. The best way to learn is to play and experiment!
          </div>
        </div>

        <div className="roadmap-section">
          <h2>📚 Practice Suggestions</h2>
          <p>Consistent practice is key to mastering music theory and piano.</p>
          <ul>
            <li>Spend 10-15 minutes daily exploring scales in different keys</li>
            <li>Practice chord progressions in multiple keys for muscle memory</li>
            <li>Listen to your favorite songs and try to identify the chords</li>
            <li>Experiment with creating your own progressions</li>
            <li>Record yourself and listen back to identify areas for improvement</li>
            <li>Learn songs you love - it's more motivating than exercises</li>
            <li>Join online communities to share your progress and get feedback</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LearningRoadmap;
