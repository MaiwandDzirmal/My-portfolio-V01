import { Link } from "react-router-dom";
import HeroCanvas from "../components/HeroCanvas";

export default function HomePage() {
  return (
    <div className="page home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-eyebrow">Hello, I'm Maiwand</span>
          <h1>Student, Soccer Player & Budding Developer</h1>
          <p>
            I&apos;m a 6th grader who loves building things with code and
            scoring goals on the field. Welcome to my digital playground where I
            share the projects I&apos;m proud of and the skills I&apos;m growing
            every day.
          </p>
          <div className="hero-actions">
            <Link className="cta primary" to="/projects">
              Explore Projects
            </Link>
            <Link className="cta secondary" to="/contact">
              Contact Me
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <HeroCanvas />
        </div>
      </section>

      <section className="card welcome-card">
        <h2>Welcome!</h2>
        <p>
          This site is a snapshot of everything I&apos;m currently learning.
          From web development with React and TypeScript to crafting 3D
          experiences with Three.js, I love experimenting and sharing the
          journey. When I&apos;m not coding, you can find me training with my
          Juventus teammates.
        </p>
      </section>
    </div>
  );
}
