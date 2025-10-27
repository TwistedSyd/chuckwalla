import './HomePage.css';

function HomePage({ onNavigate }) {
  return (
    <div className="home-page">
      <button className="midi-logo-button" onClick={() => onNavigate('midi')}>
        <img src="/midi-port-icon.png" alt="MIDI" />
      </button>
      <span className="chuckwalla-bg chuckwalla-bg-1">🦎</span>
      <span className="chuckwalla-bg chuckwalla-bg-2">🦎</span>
      <span className="chuckwalla-bg chuckwalla-bg-3">🦎</span>
      <span className="chuckwalla-bg chuckwalla-bg-4">🦎</span>
      <div className="home-container">
        <h1>
          <span className="chuckwalla-graphic">🦎</span>
          Chuckwalla
        </h1>
        <p className="subtitle">Create amazing beats and melodies in your browser</p>

        <div className="instruments-grid">
          <div
            className="instrument-card drums clickable"
            onClick={() => onNavigate('drums')}
          >
            <div className="instrument-card-content">
              <div className="instrument-icon">🥁</div>
              <div className="instrument-name">Drum Machine</div>
              <div className="instrument-description">
                Create and customize drum patterns with our interactive MIDI grid.
                Features 20+ preset patterns including Rock, EDM, Hip Hop, and more.
              </div>
            </div>
          </div>

          <div
            className="instrument-card piano clickable"
            onClick={() => onNavigate('piano')}
          >
            <div className="instrument-card-content">
              <div className="instrument-icon">🎹</div>
              <div className="instrument-name">Piano</div>
              <div className="instrument-description">
                Play melodies, explore chords & scales with interactive visualization.
                Includes 14 chord types, 14 scales, and music theory learning.
              </div>
            </div>
          </div>

          <div
            className="instrument-card guitar clickable"
            onClick={() => onNavigate('guitar')}
          >
            <div className="instrument-card-content">
              <div className="instrument-icon">🎸</div>
              <div className="instrument-name">Guitar</div>
              <div className="instrument-description">
                Interactive fretboard with chord shapes and scale patterns.
                Includes multiple tunings, 14 chord types, 14 scales, and music theory learning.
              </div>
            </div>
          </div>

          <div
            className="instrument-card circle-of-fifths clickable"
            onClick={() => onNavigate('circle-of-fifths')}
          >
            <div className="instrument-card-content">
              <div className="instrument-icon">🌀</div>
              <div className="instrument-name">Circle of Fifths</div>
              <div className="instrument-description">
                Explore music theory with an interactive Circle of Fifths.
                Visualize key signatures, relative major/minor keys, and chord relationships.
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          Made with Web Audio API | No installation required
        </div>
      </div>
    </div>
  );
}

export default HomePage;
