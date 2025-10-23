function GuitarRoadmap() {
  return (
    <div className="tab-content active">
      <div className="roadmap-container">
        <div className="roadmap-section">
          <span className="level-badge level-beginner">LEVEL 1: BEGINNER</span>
          <h2>🎸 Getting Started with Guitar</h2>

          <h3>1. Parts of the Guitar</h3>
          <p>Learn the anatomy: headstock, tuners, nut, fretboard, frets, strings (6th = thickest E), body, bridge, pickguard.</p>

          <h3>2. Proper Posture & Hand Position</h3>
          <p>Sit comfortably with guitar on your lap or use a strap. Left hand thumb behind neck, fingers curved. Right hand relaxed over soundhole/pickups.</p>

          <h3>3. Tuning Your Guitar</h3>
          <p>Standard tuning from 6th to 1st string: E-A-D-G-B-E. Use the tuning selector above or an electronic tuner.</p>

          <h3>4. Open Chords</h3>
          <p>Start with: C, G, D, E minor, A minor. Practice switching between them smoothly.</p>

          <div className="tip-box">
            <strong>Practice Tip:</strong> Use the Chords tab to visualize finger positions. Start with 2-chord progressions (C to G, Am to Em) before attempting more complex changes.
          </div>

          <h3>5. Basic Strumming Patterns</h3>
          <p>Down strums only, then down-down-up-down-up. Keep a steady rhythm.</p>
        </div>

        <div className="roadmap-section">
          <span className="level-badge level-beginner">LEVEL 2: BEGINNER+</span>
          <h2>🎸 Building Skills</h2>

          <h3>6. Bar Chords (Power Chords)</h3>
          <p>F major bar chord shape, E minor shape. Move these shapes up the neck to play any chord.</p>

          <h3>7. Pentatonic Scales</h3>
          <p>Minor pentatonic box position 1 (most common for solos). Major pentatonic for country/rock.</p>

          <div className="tip-box">
            <strong>Practice Tip:</strong> Use the Scales tab to see the Minor Pentatonic pattern. This is the foundation for most rock and blues solos!
          </div>

          <h3>8. Reading Tabs</h3>
          <p>Numbers on 6 lines (strings). Number = fret to press. 0 = open string.</p>
        </div>

        <div className="roadmap-section">
          <span className="level-badge level-intermediate">LEVEL 3: INTERMEDIATE</span>
          <h2>🎸 Expanding Your Skills</h2>

          <h3>9. Major & Minor Scales</h3>
          <p>3-notes-per-string patterns. Connect box positions across the fretboard.</p>

          <h3>10. Chord Progressions & Theory</h3>
          <p>I-IV-V progressions, understanding diatonic chords. Common progressions: I-V-vi-IV, I-IV-I-V</p>

          <h3>11. Fingerpicking Patterns</h3>
          <p>Travis picking, classical patterns. Thumb plays bass notes, fingers play melody.</p>

          <div className="tip-box">
            <strong>Practice Tip:</strong> In the Scales tab, click on diatonic chords to hear how chords from a scale sound together.
          </div>
        </div>

        <div className="roadmap-section">
          <span className="level-badge level-advanced">LEVEL 4: ADVANCED</span>
          <h2>🎸 Mastery & Expression</h2>

          <h3>12. Modes & Advanced Harmony</h3>
          <p>Dorian, Phrygian, Lydian, Mixolydian modes. Modal interchange and borrowing chords.</p>

          <h3>13. Lead Techniques</h3>
          <p>Bends, vibrato, hammer-ons, pull-offs, slides. String skipping and sweep picking.</p>

          <h3>14. Jazz Chords & Voicings</h3>
          <p>7th, 9th, 11th, 13th chords. Drop 2 and Drop 3 voicings.</p>

          <h3>15. Composition & Improvisation</h3>
          <p>Creating solos using scales and arpeggios. Tension and resolution. Call and response phrasing.</p>
        </div>
      </div>
    </div>
  );
}

export default GuitarRoadmap;
