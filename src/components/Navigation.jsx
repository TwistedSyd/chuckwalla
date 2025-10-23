import './Navigation.css';

function Navigation({ onBackHome, currentPage, onNavigate }) {
  return (
    <div className="nav-icons">
      <div className="nav-icon-button nav-home" title="Home" onClick={onBackHome} style={{ cursor: 'pointer' }}>🏠</div>
      <div className={`nav-icon-button nav-drums ${currentPage === 'drums' ? 'active' : ''}`} title="Drums" onClick={() => onNavigate('drums')} style={{ cursor: 'pointer' }}>🥁</div>
      <div className={`nav-icon-button nav-piano ${currentPage === 'piano' ? 'active' : ''}`} title="Piano" onClick={() => onNavigate('piano')} style={{ cursor: 'pointer' }}>🎹</div>
      <div className={`nav-icon-button nav-guitar ${currentPage === 'guitar' ? 'active' : ''}`} title="Guitar" onClick={() => onNavigate('guitar')} style={{ cursor: 'pointer' }}>🎸</div>
      <div className={`nav-icon-button nav-circle ${currentPage === 'circle-of-fifths' ? 'active' : ''}`} title="Circle of Fifths" onClick={() => onNavigate('circle-of-fifths')} style={{ cursor: 'pointer' }}>🌀</div>
    </div>
  );
}

export default Navigation;
