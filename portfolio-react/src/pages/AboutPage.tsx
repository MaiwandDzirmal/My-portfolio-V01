export default function AboutPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <h1>About Me</h1>
        <p>Get to know the kid behind the keyboard and the soccer ball.</p>
      </section>

      <section className="card grid two-column">
        <div>
          <h2>Hi, I&apos;m Maiwand Dzirmal!</h2>
          <p>
            I&apos;m a curious 6th grade student who splits time between writing
            code and perfecting my first touch on the soccer field. Learning how
            to build things for the web teaches me how to solve problems
            creatively, just like planning a play with my team.
          </p>
          <p>
            My favorite color is black, my favorite nights are match nights, and
            my favorite projects are the ones that challenge me to try something
            new. This portfolio keeps track of my wins, whether they happen in
            the classroom, on the pitch, or in my terminal.
          </p>
        </div>
        <div className="stack">
          <article className="info-card">
            <h3>⚽ Soccer Player</h3>
            <p>
              I train with my Juventus teammates every Tuesday and Friday.
              Practicing together makes us stronger, faster, and better at
              supporting each other.
            </p>
          </article>
          <article className="info-card">
            <h3>💻 Coder</h3>
            <p>
              I&apos;m diving into front-end development, learning React,
              TypeScript, and crafting 3D scenes with Three.js. Building this
              site is one of my proudest projects.
            </p>
          </article>
          <article className="info-card">
            <h3>🎓 Student Life</h3>
            <p>
              Balancing school, coding, and sports teaches me discipline. I love
              discovering new subjects and sharing what I&apos;ve learned with
              friends.
            </p>
          </article>
        </div>
      </section>

      <section className="card">
        <h2>My Team</h2>
        <p>
          Playing for Juventus means playing alongside some of my favorite
          people: Kenji, Omar, Abdullah, Ben, Gjase, and Hamza. Together we
          celebrate every goal and support each other through every challenge.
        </p>
      </section>
    </div>
  );
}
