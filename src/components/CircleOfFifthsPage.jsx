import { useState, useEffect } from 'react';
import CircleOfFifthsRoadmap from './CircleOfFifthsRoadmap';
import './CircleOfFifthsPage.css';

const circleKeys = [
  { major: 'C', minor: 'Am', sharps: 0, flats: 0, color: '#4CAF50' },
  { major: 'G', minor: 'Em', sharps: 1, flats: 0, color: '#8BC34A' },
  { major: 'D', minor: 'Bm', sharps: 2, flats: 0, color: '#CDDC39' },
  { major: 'A', minor: 'F♯m', sharps: 3, flats: 0, color: '#FFEB3B' },
  { major: 'E', minor: 'C♯m', sharps: 4, flats: 0, color: '#FFC107' },
  { major: 'B', minor: 'G♯m', sharps: 5, flats: 0, color: '#FF9800' },
  { major: 'F♯/G♭', minor: 'D♯m/E♭m', sharps: 6, flats: 6, color: '#FF5722' },
  { major: 'D♭', minor: 'B♭m', sharps: 0, flats: 5, color: '#F44336' },
  { major: 'A♭', minor: 'Fm', sharps: 0, flats: 4, color: '#E91E63' },
  { major: 'E♭', minor: 'Cm', sharps: 0, flats: 3, color: '#9C27B0' },
  { major: 'B♭', minor: 'Gm', sharps: 0, flats: 2, color: '#673AB7' },
  { major: 'F', minor: 'Dm', sharps: 0, flats: 1, color: '#3F51B5' }
];

const notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const majorScale = [0, 2, 4, 5, 7, 9, 11];
const minorScale = [0, 2, 3, 5, 7, 8, 10];

function CircleOfFifthsPage() {
  const [currentTab, setCurrentTab] = useState(() => {
    return localStorage.getItem('circleCurrentTab') || 'circle';
  });
  const [selectedKey, setSelectedKey] = useState(null);
  const [isMajor, setIsMajor] = useState(true);
  const [chordShape, setChordShape] = useState('major');

  // Save current tab to localStorage
  useEffect(() => {
    localStorage.setItem('circleCurrentTab', currentTab);
  }, [currentTab]);

  const formatNoteName = (name) => {
    return name.replace(/o/g, '♯').replace(/m(?!$)/g, '♭');
  };

  const getKeySignature = (key) => {
    if (key.sharps === 0 && key.flats === 0) return 'No sharps or flats';
    if (key.sharps > 0) return `${key.sharps} sharp${key.sharps > 1 ? 's' : ''} (${['F♯', 'C♯', 'G♯', 'D♯', 'A♯', 'E♯'].slice(0, key.sharps).join(', ')})`;
    return `${key.flats} flat${key.flats > 1 ? 's' : ''} (${['B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭'].slice(0, key.flats).join(', ')})`;
  };

  const getScaleNotes = (root, isMajorScale = true) => {
    const scale = isMajorScale ? majorScale : minorScale;
    const rootIndex = notes.indexOf(root.replace(/♭/g, '♯')); // Normalize flats to sharps for lookup
    if (rootIndex === -1) return [];

    return scale.map((interval, degree) => {
      const noteIndex = (rootIndex + interval) % 12;
      return { note: notes[noteIndex], degree: degree + 1 };
    });
  };

  const handleKeyClick = (key, major) => {
    setSelectedKey(key);
    setIsMajor(major);
  };

  const renderCircle = () => {
    const centerX = 300;
    const centerY = 300;
    const outerRadius = 280;
    const middleRadius = 180;
    const innerRadius = 100;
    const segmentAngle = 30; // 360 / 12

    return (
      <svg className="circle-of-fifths" viewBox="-20 0 640 600">
        {circleKeys.map((key, index) => {
          const angle = index * segmentAngle - 105; // Center C at top
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

          const majorD = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${middleRadius} ${middleRadius} 0 0 0 ${x4} ${y4} Z`;

          // INNER RING - Minor keys
          const x5 = centerX + middleRadius * Math.cos(startAngle);
          const y5 = centerY + middleRadius * Math.sin(startAngle);
          const x6 = centerX + middleRadius * Math.cos(endAngle);
          const y6 = centerY + middleRadius * Math.sin(endAngle);
          const x7 = centerX + innerRadius * Math.cos(endAngle);
          const y7 = centerY + innerRadius * Math.sin(endAngle);
          const x8 = centerX + innerRadius * Math.cos(startAngle);
          const y8 = centerY + innerRadius * Math.sin(startAngle);

          const minorD = `M ${x5} ${y5} A ${middleRadius} ${middleRadius} 0 0 1 ${x6} ${y6} L ${x7} ${y7} A ${innerRadius} ${innerRadius} 0 0 0 ${x8} ${y8} Z`;

          const isSelectedMajor = selectedKey === key && isMajor;
          const isSelectedMinor = selectedKey === key && !isMajor;

          // Text position for major key
          const textAngle = angle + segmentAngle / 2;
          const textRad = textAngle * Math.PI / 180;
          const majorTextX = centerX + ((outerRadius + middleRadius) / 2) * Math.cos(textRad);
          const majorTextY = centerY + ((outerRadius + middleRadius) / 2) * Math.sin(textRad);

          // Text position for minor key
          const minorTextX = centerX + ((middleRadius + innerRadius) / 2) * Math.cos(textRad);
          const minorTextY = centerY + ((middleRadius + innerRadius) / 2) * Math.sin(textRad);

          return (
            <g key={index}>
              {/* Major segment */}
              <path
                d={majorD}
                fill={key.color}
                stroke="#2d2d2d"
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'filter 0.3s' }}
                onClick={() => handleKeyClick(key, true)}
                onMouseEnter={(e) => e.target.style.filter = 'brightness(1.3)'}
                onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
              />
              {isSelectedMajor && (
                <path
                  d={majorD}
                  fill="none"
                  stroke="#00d9ff"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{ pointerEvents: 'none' }}
                />
              )}
              <text
                x={majorTextX}
                y={majorTextY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontSize="16"
                fontWeight="bold"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {key.major}
              </text>

              {/* Minor segment */}
              <path
                d={minorD}
                fill={key.color}
                fillOpacity="0.6"
                stroke="#2d2d2d"
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'filter 0.3s' }}
                onClick={() => handleKeyClick(key, false)}
                onMouseEnter={(e) => e.target.style.filter = 'brightness(1.3)'}
                onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
              />
              {isSelectedMinor && (
                <path
                  d={minorD}
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{ pointerEvents: 'none' }}
                />
              )}
              <text
                x={minorTextX}
                y={minorTextY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontSize="12"
                fontWeight="bold"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {key.minor}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderKeyInfo = () => {
    if (!selectedKey) {
      return <div className="placeholder-text">Click a key to view details</div>;
    }

    const keyName = isMajor ? selectedKey.major : selectedKey.minor;
    const relativeKey = isMajor ? selectedKey.minor : selectedKey.major;
    const scaleNotes = getScaleNotes(keyName.replace(/♭/g, '♯').replace(/m$/, ''), isMajor);

    return (
      <div id="key-details">
        <h2 id="selected-key">{keyName}</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>{isMajor ? 'Relative Minor' : 'Relative Major'}</label>
            <value>{relativeKey}</value>
          </div>
          <div className="info-item">
            <label>Key Signature</label>
            <value>{getKeySignature(selectedKey)}</value>
          </div>
          <div className="info-item" style={{ padding: '20px' }}>
            <label style={{ marginBottom: '15px', display: 'block' }}>Scale Notes & Degrees</label>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '10px' }}>
              {scaleNotes.map((item, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981' }}>{item.note}</div>
                  <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>{item.degree}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="circle-of-fifths-page">
      <h1>Circle of Fifths</h1>

      <div className="tab-buttons">
        <button className={`tab-button ${currentTab === 'circle' ? 'active' : ''}`} onClick={() => setCurrentTab('circle')}>Circle</button>
        <button className={`tab-button ${currentTab === 'roadmap' ? 'active' : ''}`} onClick={() => setCurrentTab('roadmap')}>Learning Roadmap 📚</button>
      </div>

      {currentTab === 'circle' && (
        <div className="tab-content active">
          <p className="description">
            The Circle of Fifths shows the relationship between the 12 tones of the chromatic scale,
            their corresponding key signatures, and their associated major and minor keys.
          </p>

          <div className="content-wrapper">
            <div className="left-content">
              <div className="circle-container">
                {renderCircle()}
                <div className="center-circle">
                  <div className="center-title">Circle</div>
                  <div className="center-subtitle">of Fifths</div>
                </div>
              </div>
            </div>

            <div className="info-panel">
              <div className="chord-shape-buttons" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: '#888', fontSize: '12px' }}>CHORD SHAPES</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    className={`chord-shape-btn ${chordShape === 'major' ? 'active' : ''}`}
                    onClick={() => setChordShape('major')}
                  >
                    Major
                  </button>
                  <button
                    className={`chord-shape-btn ${chordShape === 'minor' ? 'active' : ''}`}
                    onClick={() => setChordShape('minor')}
                  >
                    Minor
                  </button>
                  <button
                    className={`chord-shape-btn ${chordShape === 'dom7' ? 'active' : ''}`}
                    onClick={() => setChordShape('dom7')}
                  >
                    Dom 7th
                  </button>
                  <button
                    className={`chord-shape-btn ${chordShape === 'maj7' ? 'active' : ''}`}
                    onClick={() => setChordShape('maj7')}
                  >
                    Maj 7th
                  </button>
                </div>
              </div>
              {renderKeyInfo()}
            </div>
          </div>
        </div>
      )}

      {currentTab === 'roadmap' && <CircleOfFifthsRoadmap />}
    </div>
  );
}

export default CircleOfFifthsPage;
