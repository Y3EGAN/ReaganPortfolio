import Image from "next/image";
import Gallery from "@/components/Gallery";
import { education, experience, projects } from "@/content/site";

function ExternalArrow() {
  return <span aria-hidden="true">↗</span>;
}

function SectionTitle({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="section-title">
      <span>{number}</span>
      <h2>{children}</h2>
    </div>
  );
}

export default function Home() {
  return (
    <main className="portfolio">
      <a className="skip-link" href="#work">Skip to experience</a>
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
          <a className="nav-mark" href="#profile" aria-label="Back to top">RH</a>
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
          <p className="summary">Building the bridge that brings intelligent systems into the real world.</p>
          <a className="profile-resume" href="/HuReaganCV_2026.pdf" download>Download résumé ↓</a>
          <dl className="quick-facts">
            <div><dt>Focus</dt><dd>AI · Robotics · Software</dd></div>
            <div><dt>GPA</dt><dd>{education.gpa}</dd></div>
            <div><dt>Current</dt><dd>Acceleration Consortium</dd></div>
          </dl>
        </section>

        <section id="work" className="section-block">
          <SectionTitle number="01">Experience</SectionTitle>
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
          <SectionTitle number="02">Selected Projects</SectionTitle>
          <div className="project-list">
            {projects.map((project, index) => (
              <article className="project-item" key={project.title}>
                <div className="project-topline">
                  <span className="project-index" aria-hidden="true">0{index + 1} / 0{projects.length}</span>
                  <span>{project.type}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p className="tools">{project.tools.join(" · ")}</p>
                <a className="project-link" href={project.url} target="_blank" rel="noreferrer">
                  View repository <ExternalArrow />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block education-block">
          <SectionTitle number="03">Education</SectionTitle>
          <h3>{education.school}</h3>
          <p>{education.degree}</p>
          <p className="education-note">{education.honours} · GPA {education.gpa}</p>
          <p className="education-note education-award">{education.award}</p>
        </section>

        <aside className="contact-ribbon" aria-label="Contact Reagan">
          <div>
            <p>Working on robotics or intelligent systems?</p>
            <span>I would be glad to hear what you are building.</span>
          </div>
          <a href="#contact">Let&apos;s talk <span aria-hidden="true">↓</span></a>
        </aside>

        <section id="gallery" className="section-block gallery-block">
          <SectionTitle number="04">My Gallery</SectionTitle>
          <p className="gallery-intro">Some places that made me stop and look twice.</p>
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
