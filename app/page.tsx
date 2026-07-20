import Image from "next/image";
import { education, experience, projects } from "@/content/site";

function ExternalArrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <main className="portfolio">
      <aside className="portrait" aria-label="Portrait of Reagan Hu at sunset">
        <Image
          src="/images/reagan-horizon-original.jpg"
          alt="Reagan Hu looking across the ocean at sunset"
          fill
          priority
          sizes="100vw"
        />
        <div className="portrait-overlay" aria-hidden="true" />
        <p className="photo-marker">Toronto, Canada</p>
      </aside>

      <div className="resume-pane">
        <nav className="pane-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#projects">Projects</a>
          <a href="/HuReaganCV_2026.pdf" download>CV ↓</a>
        </nav>

        <section id="profile" className="profile">
          <p className="section-label">PROFILE</p>
          <h1>Reagan Hu</h1>
          <p className="role">Engineering Science student<br />University of Toronto</p>
          <p className="summary">
            I work on robotics systems across simulation, learned policies,
            embedded control, and teleoperation.
          </p>
          <dl className="quick-facts">
            <div><dt>Focus</dt><dd>Robotics</dd></div>
            <div><dt>GPA</dt><dd>{education.gpa}</dd></div>
            <div><dt>Current</dt><dd>Acceleration Consortium</dd></div>
          </dl>
        </section>

        <section id="work" className="section-block">
          <div className="section-title"><span>01</span><h2>Experience</h2></div>
          <div className="experience-list">
            {experience.map((item) => (
              <article className="experience-item" key={item.role}>
                <div className="item-heading">
                  <p>{item.date}</p>
                  <h3>{item.role}</h3>
                  <span>{item.place}</span>
                </div>
                <ul>
                  {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
                <p className="tools">{item.tools.join(" · ")}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="section-block">
          <div className="section-title"><span>02</span><h2>Projects</h2></div>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-item" key={project.title}>
                <div><h3>{project.title}</h3><span>{project.type}</span></div>
                <p>{project.description}</p>
                <p className="tools">{project.tools.join(" · ")}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block education-block">
          <div className="section-title"><span>03</span><h2>Education</h2></div>
          <h3>{education.school}</h3>
          <p>{education.degree}</p>
          <p className="education-note">GPA {education.gpa} · {education.award}</p>
        </section>

        <footer className="contact">
          <p className="section-label">CONTACT</p>
          <a className="email" href="mailto:reagan.hu@gmail.com">reagan.hu@gmail.com</a>
          <div className="contact-links">
            <a href="https://github.com/Y3EGAN" target="_blank" rel="noreferrer">GitHub <ExternalArrow /></a>
            <a href="https://www.linkedin.com/in/reagan-hu" target="_blank" rel="noreferrer">LinkedIn <ExternalArrow /></a>
            <a href="/HuReaganCV_2026.pdf" download>Download CV ↓</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
