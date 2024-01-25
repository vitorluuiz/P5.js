import { useSettingsCtx } from "../../contexts/GameSettingsCtx";

export default function GameSettings() {
  const {
    radius,
    handleRadius,
    units,
    handleUnits,
    velocity,
    handleVelocity,
    music,
    handleMusic,
    bounceSound,
    handleBounceSounds,
  } = useSettingsCtx();

  const applySettings = () => {
      sessionStorage.setItem(
        "gameSettings",
        JSON.stringify({
          radius,
          units,
          velocity,
          music,
          bounceSound,
        })
      );
  }

  return (
    <div id="settings" className="modal">
      <div className="modal__content" id="settings__content">
        <div className="sound-options flex-column">
          <div className="option" onClick={handleMusic}>
            <h2>Music in Game</h2>
            <h2 id="music">{music ? "ON" : "OFF"}</h2>
          </div>
          <div className="option" onClick={handleBounceSounds}>
            <h2>Bounces Sounds</h2>
            <h2 id="bounce">{bounceSound ? "ON" : "OFF"}</h2>
          </div>
        </div>
        <div className="setting">
          <h2>Circle Velocity</h2>
          <div className="slider">
            <input
              id="velocityInput"
              type="range"
              onChange={handleVelocity}
              min="5"
              value={velocity}
              max="15"
            />
            <span id="velocity">{velocity}</span>
          </div>
        </div>
        <div className="setting">
          <h2>Circle Units</h2>
          <div className="slider">
            <input
              id="unitsInput"
              type="range"
              onChange={handleUnits}
              min="3"
              value={units}
              max="15"
            />
            <span id="units">{units}</span>
          </div>
        </div>
        <div className="setting">
          <h2>Circle Radius</h2>
          <div className="slider">
            <input
              id="radiusInput"
              type="range"
              onChange={handleRadius}
              min="10"
              value={radius}
              max="20"
            />
            <span id="radius">{radius}</span>
          </div>
        </div>

        <nav className="modal__nav">
          <a className="nav-button" href="#">
            Cancel
          </a>
          <a className="nav-button" href="#" onClick={() => applySettings()}>
            Apply
          </a>
        </nav>
      </div>
    </div>
  );
}
