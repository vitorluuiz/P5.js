export default function GameRooms() {
  return (
    <div id="rooms" className="modal">
      <div className="modal__content" id="rooms__content">
        <nav className="modal__header">
          <a href="#">Exit</a>
        </nav>
        <table id="rooms-table">
          <thead>
            <tr>
              <th>Room Code</th>
              <th>Players</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Sala zezinho gampelays 2015</th>
              <th>5 players live</th>
            </tr>
            <tr>
              <th>Tiny room</th>
              <th>2 players live</th>
            </tr>
            <tr>
              <th>Sala zezinho gampelays</th>
              <th>299 players live</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
