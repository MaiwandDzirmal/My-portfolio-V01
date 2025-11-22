import { Link } from "react-router-dom";
import BeeSwarmScene from "../components/BeeSwarmScene";
import MemoryMatch from "../components/MemoryMatch";
import SnakeGame from "../components/SnakeGame";

const HIGHLIGHTS = [
  "Collect pollen from colorful flower fields and convert it into honey",
  "Upgrade your hive with new bees and gear to unlock special abilities",
  "Team up with friends to defeat bosses and tackle stick bug challenges",
  "Explore hidden areas like the Mountain Top Shop and Spirit Bear quests",
] as const;

export default function GamesPage() {
  return (
    <div className="page games-page">
      <section className="page-hero">
        <h1>Games</h1>
        <p>Step into my favorite Roblox world – Bee Swarm Simulator!</p>
      </section>

      <section className="card game-feature">
        <div className="game-visual">
          <BeeSwarmScene />
        </div>
        <div className="game-copy">
          <h2>Bee Swarm Simulator</h2>
          <p>
            Bee Swarm Simulator is a Roblox adventure where you collect pollen,
            raise bees, and explore a buzzing world full of secrets. I love
            teaming up with friends to unlock new areas and take on epic bosses
            while expanding my hive.
          </p>
          <ul className="game-highlights">
            {HIGHLIGHTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="game-actions">
            <Link
              className="cta primary"
              to="https://www.roblox.com/games/1537690962/Bee-Swarm-Simulator"
              target="_blank"
              rel="noreferrer"
            >
              Play on Roblox
            </Link>
            <Link className="cta secondary" to="/projects">
              See My Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="card game-feature">
        <div className="game-copy">
          <h2>Memory Match</h2>
          <p>
            Test your memory with this classic card matching game! Flip cards to
            find matching pairs. Challenge yourself to complete it in as few
            moves as possible.
          </p>
        </div>
        <div className="game-visual memory-match-wrapper">
          <MemoryMatch />
        </div>
      </section>

      <section className="card game-feature">
        <div className="game-visual memory-match-wrapper">
          <SnakeGame />
        </div>
        <div className="game-copy">
          <h2>Snake Game</h2>
          <p>
            Classic Snake game! Control your snake to eat food and grow longer.
            Avoid hitting the walls or yourself. How long can you survive?
          </p>
          <ul className="game-highlights">
            <li>Use Arrow Keys or WASD to control your snake</li>
            <li>Eat food to grow longer and increase your score</li>
            <li>Avoid walls and don&apos;t bite yourself!</li>
            <li>Press Enter to start or reset the game</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
