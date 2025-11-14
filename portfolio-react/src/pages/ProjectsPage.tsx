const PROJECTS = [
  {
    title: "🌐 Portfolio Website",
    status: "Completed",
    description:
      "My personal portfolio site built with React, TypeScript, and Three.js. It showcases my story, skills, and the projects I am most excited about.",
    highlights: [
      "Responsive layout with themed styling and a custom design system",
      "Dynamic routing for pages like About, Projects, Skills, and Contact",
      "Interactive theme switching with Kid Fun, Royal Purple, and Midnight modes",
      "Three.js-powered hero experience on the home page",
    ],
  },
  {
    title: "⌨️ Typing Club with Dad",
    status: "In Progress",
    description:
      "A collaborative project with my dad to build a fun typing practice platform that helps kids improve accuracy and speed.",
    highlights: [
      "Uses HTML, CSS, and JavaScript to create interactive typing drills",
      "Tracks words per minute and accuracy to show progress over time",
      "Plans for mini-games and challenges to keep practice fun",
      "Teaches teamwork and project planning while we code together",
    ],
  },
] as const;

export default function ProjectsPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <h1>Projects</h1>
        <p>Here&apos;s what I&apos;ve been building lately.</p>
      </section>

      <div className="projects-grid">
        {PROJECTS.map((project) => (
          <article className="project-card" key={project.title}>
            <header>
              <h2>{project.title}</h2>
              <span
                className={`status ${
                  project.status === "Completed" ? "done" : "progress"
                }`}
              >
                {project.status}
              </span>
            </header>
            <p>{project.description}</p>
            <ul>
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
