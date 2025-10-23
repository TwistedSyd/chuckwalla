function CircleOfFifthsRoadmap() {
  return (
    <div className="tab-content active">
      <div className="roadmap-container">
        <div className="roadmap-section">
          <span className="level-badge level-beginner">LEVEL 1: BEGINNER</span>
          <h2>🌀 Understanding the Circle</h2>
          <p>Learn how the Circle of Fifths reveals the deep relationships between musical keys.</p>

          <h3>1. What is the Circle of Fifths?</h3>
          <ul>
            <li>A visual representation of relationships between the 12 chromatic notes</li>
            <li>Moving clockwise increases by a perfect fifth interval</li>
            <li>Moving counter-clockwise decreases by a perfect fifth (or goes up by a fourth)</li>
            <li>Each key is closely related to the keys adjacent to it</li>
          </ul>

          <div className="tip-box">
            <strong>Practice Tip:</strong> Click on each key in the circle to see its scale notes, relative minor/major, and key signature.
          </div>

          <h3>2. Reading the Circle</h3>
          <ul>
            <li>Major keys are shown on the outer part of each segment</li>
            <li>Relative minor keys are shown on the inner part</li>
            <li>Keys at the top (C/Am) have no sharps or flats</li>
            <li>Moving clockwise adds sharps (G has 1♯, D has 2♯, etc.)</li>
            <li>Moving counter-clockwise adds flats (F has 1♭, B♭ has 2♭, etc.)</li>
          </ul>

          <h3>3. Relative Major and Minor</h3>
          <ul>
            <li>Each major key shares all the same notes with its relative minor</li>
            <li>The relative minor is 3 semitones (a minor 3rd) below the major key</li>
            <li>Example: C Major and A minor both have no sharps or flats</li>
            <li>They sound different because they start on different notes</li>
          </ul>

          <div className="tip-box">
            <strong>Practice Tip:</strong> Play the scales of C Major and A minor. Notice they use the same notes but have different feels.
          </div>
        </div>

        <div className="roadmap-section">
          <span className="level-badge level-beginner">LEVEL 2: BEGINNER+</span>
          <h2>🎵 Key Signatures</h2>
          <p>Master the sharps and flats that define each key.</p>

          <h3>4. The Sharp Keys (Clockwise)</h3>
          <ul>
            <li>C (0♯) → G (1♯) → D (2♯) → A (3♯) → E (4♯) → B (5♯) → F♯ (6♯)</li>
            <li>Sharps are added in order: F♯, C♯, G♯, D♯, A♯, E♯, B♯</li>
            <li>Each new key adds one more sharp to the previous key</li>
            <li>The new sharp is always on the 7th degree of the scale</li>
          </ul>

          <div className="tip-box">
            <strong>Memory Tip:</strong> "Father Charles Goes Down And Ends Battle" - the order sharps appear!
          </div>

          <h3>5. The Flat Keys (Counter-clockwise)</h3>
          <ul>
            <li>C (0♭) → F (1♭) → B♭ (2♭) → E♭ (3♭) → A♭ (4♭) → D♭ (5♭) → G♭ (6♭)</li>
            <li>Flats are added in reverse order: B♭, E♭, A♭, D♭, G♭, C♭, F♭</li>
            <li>Each new key adds one more flat to the previous key</li>
            <li>The new flat is always on the 4th degree of the scale</li>
          </ul>

          <div className="tip-box">
            <strong>Memory Tip:</strong> "BEAD GCF" or "Battle Ends And Down Goes Charles Father" - the order flats appear!
          </div>

          <h3>6. Enharmonic Keys</h3>
          <ul>
            <li>F♯ major and G♭ major sound the same but are written differently</li>
            <li>Located at the bottom of the circle (6 o'clock position)</li>
            <li>Composers choose based on context and ease of reading</li>
            <li>Generally, use the key with fewer accidentals</li>
          </ul>
        </div>

        <div className="roadmap-section">
          <span className="level-badge level-intermediate">LEVEL 3: INTERMEDIATE</span>
          <h2>🎸 Chord Progressions</h2>
          <p>Use the circle to create smooth, musical chord progressions.</p>

          <h3>7. Adjacent Keys</h3>
          <ul>
            <li>Keys next to each other share many common notes</li>
            <li>Moving to adjacent keys creates smooth modulations</li>
            <li>Popular in classical music and jazz</li>
            <li>Example: C major to G major (only one note difference)</li>
          </ul>

          <div className="tip-box">
            <strong>Practice Tip:</strong> Try playing chord progressions using adjacent keys from the circle. Notice how smooth they sound!
          </div>

          <h3>8. The I-IV-V Progression</h3>
          <ul>
            <li>The I chord is your chosen key</li>
            <li>The V chord is one step clockwise (perfect fifth up)</li>
            <li>The IV chord is one step counter-clockwise (perfect fourth up)</li>
            <li>This is the most common progression in Western music</li>
            <li>Example in C: C (I) - F (IV) - G (V)</li>
          </ul>

          <h3>9. The ii-V-I Jazz Progression</h3>
          <ul>
            <li>The most important progression in jazz music</li>
            <li>Example in C major: Dm7 (ii) - G7 (V) - Cmaj7 (I)</li>
            <li>Creates strong forward motion toward resolution</li>
            <li>Practice this in all 12 keys using the circle</li>
          </ul>

          <h3>10. Circle Progressions</h3>
          <ul>
            <li>Moving through the circle creates strong harmonic motion</li>
            <li>"Autumn Leaves" uses: ii-V-I in minor, then IV-VII-III</li>
            <li>Many jazz standards follow the circle of fifths</li>
            <li>Creates a sense of continuous forward movement</li>
          </ul>
        </div>

        <div className="roadmap-section">
          <span className="level-badge level-intermediate">LEVEL 4: INTERMEDIATE+</span>
          <h2>🎹 Modulation & Key Changes</h2>
          <p>Learn to smoothly transition between different keys.</p>

          <h3>11. Close Modulations</h3>
          <ul>
            <li>Modulating to adjacent keys on the circle is easiest</li>
            <li>They share 6 out of 7 notes (or 5 out of 7 for minor)</li>
            <li>Use a pivot chord that exists in both keys</li>
            <li>Common in pop music for key changes up a whole step</li>
          </ul>

          <div className="tip-box">
            <strong>Practice Tip:</strong> Take a simple song and try modulating it to the key one step clockwise on the circle.
          </div>

          <h3>12. Distant Modulations</h3>
          <ul>
            <li>Keys opposite on the circle (tritone apart) create dramatic changes</li>
            <li>Share very few common notes - creates surprise</li>
            <li>Used for effect in film scores and progressive music</li>
            <li>Example: C major to F♯ major (completely different worlds)</li>
          </ul>

          <h3>13. Relative vs Parallel Keys</h3>
          <ul>
            <li>Relative: Share the same notes (C Major ↔ A minor)</li>
            <li>Parallel: Share the same tonic (C Major ↔ C minor)</li>
            <li>Parallel keys are 3 steps away on the circle</li>
            <li>Switching between parallel keys creates emotional contrast</li>
          </ul>

          <h3>14. Borrowed Chords</h3>
          <ul>
            <li>Take chords from the parallel minor/major key</li>
            <li>Adds color without fully modulating</li>
            <li>Very common in modern pop and rock</li>
            <li>Example: Using A♭ major in C major (borrowed from C minor)</li>
          </ul>
        </div>

        <div className="roadmap-section">
          <span className="level-badge level-advanced">LEVEL 5: ADVANCED</span>
          <h2>🎼 Advanced Theory</h2>
          <p>Master advanced concepts using the circle as your guide.</p>

          <h3>15. Secondary Dominants</h3>
          <ul>
            <li>Treat any chord as a temporary tonic</li>
            <li>Play the V7 chord of your target (one step clockwise)</li>
            <li>Example in C: D7 → G (V7/V → V)</li>
            <li>Creates tension and forward momentum</li>
          </ul>

          <h3>16. Modal Interchange</h3>
          <ul>
            <li>Borrow entire sections from parallel modes</li>
            <li>Common: Major key borrowing from Dorian or Mixolydian</li>
            <li>Creates unique flavors while staying in one key center</li>
            <li>Used extensively in jazz and progressive rock</li>
          </ul>

          <h3>17. The Circle in Composition</h3>
          <ul>
            <li>Plan your song's key centers using the circle</li>
            <li>Verse in I, Pre-chorus in IV, Chorus back to I</li>
            <li>Bridge to vi (relative minor) for contrast</li>
            <li>Use circle relationships to create memorable progressions</li>
          </ul>

          <div className="tip-box">
            <strong>Final Tip:</strong> The Circle of Fifths is a map, not a rulebook. Use it to explore and understand relationships, but trust your ears above all!
          </div>
        </div>

        <div className="roadmap-section">
          <h2>📚 Practice Suggestions</h2>
          <p>Integrate the Circle of Fifths into your daily practice.</p>
          <ul>
            <li>Practice scales moving clockwise around the circle</li>
            <li>Play I-IV-V progressions in every key</li>
            <li>Transpose your favorite songs to different keys</li>
            <li>Compose a chord progression using only adjacent keys</li>
            <li>Practice ii-V-I in all 12 keys (essential for jazz)</li>
            <li>Experiment with modulations in your own compositions</li>
            <li>Analyze songs you love - where do they move on the circle?</li>
            <li>Challenge yourself: Compose using the entire circle!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CircleOfFifthsRoadmap;
