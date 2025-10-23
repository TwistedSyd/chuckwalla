# Piano React App

A fully-featured React conversion of the Chuckwalla Piano application.

## Features

- **Free Play Mode**: Play piano with mouse, keyboard, or MIDI controller
- **Chord Detection**: Real-time chord identification as you play
- **Chords Tab**: Explore 14 different chord types with interactive visualization
- **Scales Tab**: Learn 14 scales with diatonic chord buttons
- **Learning Roadmap**: Comprehensive music theory guide from beginner to advanced
- **Audio Effects**: Chorus and Reverb effects
- **MIDI Support**: Connect your MIDI keyboard controller
- **Touch Support**: Optimized for tablets and touch devices

## Tech Stack

- **React 18** with functional components and hooks
- **Vite** for fast development and building
- **Web Audio API** for audio synthesis
- **Web MIDI API** for MIDI controller support
- **Custom Hooks**:
  - `useAudio` - Audio synthesis and effects management
  - `useMIDI` - MIDI controller integration

## Project Structure

```
src/
├── components/
│   ├── PianoKeyboard.jsx       # Interactive piano keyboard component
│   ├── FreePlayTab.jsx          # Free play mode with chord detection
│   ├── ChordsTab.jsx            # Chord explorer
│   ├── ScalesTab.jsx            # Scale explorer with diatonic chords
│   ├── LearningRoadmap.jsx      # Music theory educational content
│   ├── Navigation.jsx           # Navigation bar
│   └── MIDIStatus.jsx           # MIDI connection status indicator
├── hooks/
│   ├── useAudio.js              # Web Audio API hook
│   └── useMIDI.js               # Web MIDI API hook
├── data/
│   └── musicTheory.js           # Music theory data and utilities
├── App.jsx                      # Main app component
└── main.jsx                     # App entry point
```

## Development

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Run Development Server
\`\`\`bash
npm run dev
\`\`\`

The app will be available at http://localhost:5173/

### Build for Production
\`\`\`bash
npm run build
\`\`\`

### Preview Production Build
\`\`\`bash
npm run preview
\`\`\`

## Keyboard Controls

The piano keyboard is playable using your computer keyboard:

### First Octave
- White keys: `A S D F G H J`
- Black keys: `W E T Y U`

### Second Octave
- White keys: `K L ; '`
- Black keys: `I O P [ ]`

## Original HTML Version

The original HTML version is preserved in:
- `/html/piano.html` - HTML page
- `/js/piano.js` - JavaScript logic
- `/css/piano.css` - Styles

Both versions coexist and have identical functionality.

## Features Comparison

| Feature | HTML Version | React Version |
|---------|-------------|---------------|
| Free Play Mode | ✅ | ✅ |
| Chord Detection | ✅ | ✅ |
| Chords Explorer | ✅ | ✅ |
| Scales Explorer | ✅ | ✅ |
| Learning Roadmap | ✅ | ✅ |
| Audio Effects | ✅ | ✅ |
| MIDI Support | ✅ | ✅ |
| Keyboard Input | ✅ | ✅ |
| Touch Support | ✅ | ✅ |
| Tab Persistence | ✅ | ✅ |
| Component-Based | ❌ | ✅ |
| Hot Module Reload | ❌ | ✅ |
| TypeScript Ready | ❌ | ✅ (with migration) |

## Notes

- The React version uses modern React patterns (hooks, functional components)
- All music theory logic is extracted into reusable utilities
- Custom hooks provide clean separation of concerns
- State management uses React's built-in useState and useEffect
- LocalStorage is used to persist user preferences

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any browser with Web Audio API support
- MIDI support requires Web MIDI API (Chrome/Edge)
