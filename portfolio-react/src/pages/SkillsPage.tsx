const SKILLS = [
  {
    title: "⚽ Soccer",
    description:
      "A dedicated player who loves strategy, teamwork, and the thrill of the game. Playing twice a week keeps me sharp and active.",
  },
  {
    title: "💻 Coding",
    description:
      "Learning modern web development with HTML, CSS, React, TypeScript, and Three.js. I enjoy turning ideas into interactive experiences.",
  },
  {
    title: "⌨️ Typing",
    description:
      "Practicing speed and accuracy through daily drills. Fast typing helps me code faster and communicate better.",
  },
  {
    title: "🔢 Math",
    description:
      "Strong analytical thinking and math skills help me solve problems, debug tricky code, and plan my next big project.",
  },
] as const;

export default function SkillsPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <h1>Skills</h1>
        <p>Technologies and talents that help me build cool things.</p>
      </section>

      <div className="card skills-card">
        <div className="skills-grid">
          {SKILLS.map((skill) => (
            <article className="skill-card" key={skill.title}>
              <h2>{skill.title}</h2>
              <p>{skill.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
