import Image from "next/image";
import Gallery from "@/components/Gallery";
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
        <p className="photo-marker">Photo / Malibu, California</p>
      </aside>

      <div className="resume-pane">
        <nav className="pane-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#projects">Projects</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact Me</a>
        </nav>

        <section id="profile" className="profile">
          <p className="section-label">PORTFOLIO / 2026</p>
          <div className="name-lockup">
            <h1>Reagan Hu</h1>
            <span className="chinese-inline" lang="zh-Hans">胡予潇</span>
          </div>
          <p className="role">Engineering Science student<br />University of Toronto</p>
          <p className="summary">I build the bridge that brings intelligent systems into the real world.</p>
          <a className="profile-resume" href="/HuReaganCV_2026.pdf" download>Download résumé ↓</a>
          <dl className="quick-facts">
            <div><dt>Focus</dt><dd>AI · Robotics · Software</dd></div>
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
                <p className="job-description">{item.description}</p>
                <p className="tools">{item.tools.join(" · ")}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="section-block">
          <div className="section-title"><span>02</span><h2>Select Projects</h2></div>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-item" key={project.title}>
                <div>
                  <h3>
                    <a href={project.url} target="_blank" rel="noreferrer">
                      {project.title} <ExternalArrow />
                    </a>
                  </h3>
                  <span>{project.type}</span>
                </div>
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
          <p className="education-note">{education.honours} · GPA {education.gpa}</p>
          <p className="education-note education-award">{education.award}</p>
        </section>

        <section id="gallery" className="section-block gallery-block">
          <div className="section-title"><span>04</span><h2>My Gallery</h2></div>
          <p className="gallery-intro">A small collection of places that made me stop and look twice.</p>
          <Gallery />
        </section>

        <footer id="contact" className="contact">
          <p className="section-label">CONTACT</p>
          <a className="email" href="mailto:reagan.hu@gmail.com">reagan.hu@gmail.com</a>
          <div className="contact-links">
            <a href="https://github.com/Y3EGAN" target="_blank" rel="noreferrer">GitHub <ExternalArrow /></a>
            <a href="https://www.linkedin.com/in/reagan-hu-672a22305" target="_blank" rel="noreferrer">LinkedIn <ExternalArrow /></a>
          </div>
        </footer>
      </div>
    </main>
  );
}
