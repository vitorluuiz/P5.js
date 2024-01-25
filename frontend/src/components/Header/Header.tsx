import { useState } from "react";

import GameRooms from "./GameRooms";
import GameSettings from "./GameSettings";
import SnackBar from "./SnackBar";
import "./Header.css";

export default function Header() {
  const [roomCode, setRoomCode] = useState<string>("");

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(e.target.value);
  };

  return (
    <header>
      <section className="container flex-row justify-between">
        <div className="support-logo">
          <a href="index.html">
            <h1>CirclesBox</h1>
          </a>
        </div>
        <nav className="support-nav">
          <form id="room-form">
            <input
              id="room-input"
              type="text"
              placeholder="ROOM CODE"
              onChange={handleRoomCodeChange}
            />
            <button>Join</button>
          </form>
          <a href="#rooms">Rooms</a>
          <GameRooms />
          <a href="#settings">Settings</a>
          <GameSettings />
          <SnackBar />
          <a href="#">Leaderboard</a>
          <a href="#">Help</a>
        </nav>
      </section>
    </header>
  );
}
