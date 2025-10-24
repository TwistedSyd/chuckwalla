# 🦎 Chuckwalla

**Create amazing beats and melodies in your browser**

Chuckwalla is an interactive music creation and learning platform built entirely with web technologies. No installation required - just open your browser and start making music!

## ✨ Features

### 🥁 Drum Machine
- Interactive 16-step MIDI grid sequencer
- 20+ preset patterns (Rock, EDM, Hip Hop, Trap, House, and more)
- Custom pattern editor with 9 drum instruments
- Tap tempo with BPM control (40-240 BPM)
- Pattern search and filter
- Export and save custom beats
- Learning roadmap for beginners

### 🎹 Piano
- Interactive 25-key piano keyboard
- 14 chord types (Major, Minor, 7ths, 9ths, Suspended, and more)
- 14 scales and modes (Major, Minor, Pentatonic, Blues, Modal scales)
- Real-time chord detection
- Music theory visualization
- MIDI device support
- Keyboard shortcuts for computer keyboard playing
- Audio effects (Sustain, Chorus, Reverb)
- Learning roadmap with music theory fundamentals

### 🎸 Guitar
- Interactive fretboard with 21 frets
- Multiple tunings (Standard, Drop D, Half Step Down)
- 14 chord types with multiple voicings
- 14 scales with position-based patterns
- Diatonic chord exploration
- Scale box patterns (CAGED system)
- Root note highlighting
- Learning roadmap for guitarists

### 🌀 Circle of Fifths
- Interactive Circle of Fifths visualization
- Key signature exploration
- Relative major/minor relationships
- Chord progression suggestions
- Enharmonic equivalents
- Learning roadmap for music theory

## 🚀 Technologies

- **React 19** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Web Audio API** - Native browser audio synthesis
- **WebMIDI API** - MIDI device support
- **CSS3** - Custom styling and animations

## 📦 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chuckwalla.git

# Navigate to the project directory
cd chuckwalla

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎮 Usage

### Piano
1. Click on piano keys or use your computer keyboard
2. Select a chord or scale to visualize music theory
3. Connect a MIDI keyboard for advanced playing
4. Explore the Learning Roadmap to understand music fundamentals

### Guitar
1. Click on fret positions to play notes
2. Browse chord shapes across different positions
3. Explore scale patterns in different keys
4. Learn diatonic chords within scales

### Drums
1. Choose a preset pattern or create your own
2. Click cells in the grid to add/remove drum hits
3. Adjust tempo with the slider or tap tempo button
4. Save and export your custom patterns

### Circle of Fifths
1. Click on keys to explore relationships
2. View key signatures and relative keys
3. Get chord progression suggestions
4. Learn music theory concepts interactively

## 📁 Project Structure

```
chuckwalla/
├── src/
│   ├── components/       # React components
│   │   ├── HomePage.jsx
│   │   ├── PianoKeyboard.jsx
│   │   ├── GuitarFretboard.jsx
│   │   ├── DrumsPage.jsx
│   │   ├── CircleOfFifthsPage.jsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   │   ├── useAudio.js
│   │   ├── useMIDI.js
│   │   └── useDrumMachine.js
│   ├── data/            # Music theory data
│   │   ├── musicTheory.js
│   │   └── guitarTheory.js
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── index.html
├── vite.config.js
└── package.json
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🎯 Roadmap

- [ ] More drum patterns and instruments
- [ ] Bass guitar support
- [ ] Pattern recording and playback
- [ ] Audio file export
- [ ] Collaborative jam sessions
- [ ] Mobile app version
- [ ] Extended chord voicings
- [ ] Advanced music theory lessons

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with the Web Audio API
- Music theory data and patterns curated for educational purposes
- Inspired by the need for accessible music education tools

## 📧 Contact

Have questions or suggestions? Open an issue or reach out!

---

**Made with ❤️ and Web Audio API | No installation required**
