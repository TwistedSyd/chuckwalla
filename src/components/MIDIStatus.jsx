import './MIDIStatus.css';

function MIDIStatus({ connected, deviceName }) {
  return (
    <div className={`midi-status ${connected ? 'connected' : 'disconnected'}`}>
      🎹 MIDI: {connected ? deviceName : 'Disconnected'}
    </div>
  );
}

export default MIDIStatus;
