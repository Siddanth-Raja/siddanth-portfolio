import './App.css'

const projects = [
  {
    title: 'LL Law Group',
    category: 'Client Website',
    description:
      'A polished website for a law firm focused on trust, clarity, and professional credibility.',
    tags: ['Web Design', 'Front-End', 'Client Work'],
  },
  {
    title: 'CyberForYouth',
    category: 'Nonprofit Platform',
    description:
      "Redesigned and rebuilt a cybersecurity nonprofit's website to improve navigation, clarity, and engagement.",
    tags: ['UI/UX', 'Web Development', 'Nonprofit'],
  },
  {
    title: 'Aeris - NASA HUNCH',
    category: 'Student Innovation Project',
    description:
      'Designed front-end experiences for a wellness-focused NASA HUNCH concept, including inventory flows, alerts, and responsive UI.',
    tags: ['Product Design', 'Front-End', 'UX'],
  },
]

const services = [
  'Website Design',
  'Website Redesigns',
  'Landing Pages',
  'Monthly Maintenance',
  'Branding/UI Cleanup',
  'Analytics + Conversion Improvements',
]

const processSteps = [
  {
    number: '01',
    title: 'Audit',
    description:
      'I review your current website, branding, and user experience to identify what feels outdated, confusing, or ineffective.',
  },
  {
    number: '02',
    title: 'Design',
    description:
      'I create modern layouts and visuals focused on clarity, trust, and making your business feel premium online.',
  },
  {
    number: '03',
    title: 'Build',
    description:
      'I turn the designs into a fast, responsive website that works smoothly across desktop and mobile.',
  },
  {
    number: '04',
    title: 'Launch',
    description:
      'After testing and final revisions, I deploy the site and make sure everything is running properly.',
  },
  {
    number: '05',
    title: 'Maintain',
    description:
      'I stay available for updates, improvements, analytics, and ongoing support after launch.',
  },
]

function App() {
  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grid-glow" />

      <nav className="navbar" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Siddanth Raja home">
          Siddanth Raja
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </div>
        <a
          className="nav-cta"
          href="mailto:siddu123raja@gmail.com?subject=Freelance%20Website%20Project"
        >
          Start a Project
        </a>
      </nav>

      <section className="hero-section" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Freelance web design and front-end buildout</p>
          <h1>Modern websites for businesses that want to look impossible to ignore.</h1>
          <p className="hero-subhead">
            I design and build clean, fast, conversion-focused websites for local
            businesses, startups, and personal brands.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#work">
              View Work
            </a>
            <a className="button secondary" href="#contact">
              Contact Me
            </a>
          </div>
        </div>

        <div className="visual-card" aria-label="Abstract premium website preview">
          <div className="card-noise" />
          <div className="orb orb-large" />
          <div className="orb orb-small" />
          <div className="orb orb-line" />
          <div className="card-topline">
            <span />
            <span />
            <span />
          </div>
          <div className="preview-panel">
            <div className="preview-header">
              <span>Launch Signal</span>
              <strong>98</strong>
            </div>
            <div className="preview-chart">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="preview-stack">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      <section className="section" id="work">
        <div className="section-heading">
          <p className="eyebrow">Selected work</p>
          <h2>Websites and digital products with a sharper first impression.</h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <p>{project.category}</p>
              <h3>{project.title}</h3>
              <span>{project.description}</span>
              <div className="tag-row">
                {project.tags.map((tag) => (
                  <small key={tag}>{tag}</small>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section split-section" id="services">
        <div className="section-heading">
          <p className="eyebrow">Services</p>
          <h2>Focused help for businesses that need their site to feel current.</h2>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service}>
              <span />
              <h3>{service}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="section-heading">
          <p className="eyebrow">Process</p>
          <h2>A simple path from unclear website to polished launch.</h2>
        </div>
        <div className="process-track">
          {processSteps.map((step) => (
            <article className="process-step" key={step.title}>
              <span>{step.number}</span>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Need a site that actually makes people take you seriously?</h2>
          <p>
            Tell me what you're building, what feels outdated, or what you want
            your site to do better.
          </p>
        </div>
        <div className="contact-actions">
          <a
            className="button primary"
            href="mailto:siddu123raja@gmail.com?subject=Freelance%20Website%20Project"
          >
            Email Siddanth
          </a>
          <a className="button secondary" href="sms:+19724822117">
            Text Siddanth
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
