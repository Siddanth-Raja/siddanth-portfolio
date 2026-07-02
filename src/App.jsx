import './App.css'

const projects = [
  {
    title: 'LL Law Group',
    category: 'Client Website',
    description:
      'A polished website for a law firm focused on trust, clarity, and stronger first-contact confidence.',
    tags: ['Credibility', 'Client Site', 'Lead Trust'],
  },
  {
    title: 'CyberForYouth',
    category: 'Nonprofit Platform',
    description:
      "Improved a cybersecurity nonprofit's website so programs felt clearer, more credible, and easier to act on.",
    tags: ['Clarity', 'Engagement', 'Nonprofit'],
  },
  {
    title: 'Aeris - NASA HUNCH',
    category: 'Operational Concept',
    description:
      'Created product concepts to help teams track inventory, respond to alerts, and manage daily operations with less friction.',
    tags: ['Workflow Systems', 'Operations', 'Clarity'],
  },
]

const solutions = [
  {
    title: 'AI Growth Audit',
    description:
      'A focused review of your website, customer journey, and follow-up gaps so you can see where leads and time are being lost.',
  },
  {
    title: 'Optimized Websites',
    description:
      'Fast, modern websites designed to build trust, improve conversions, and turn more visitors into customers.',
  },
  {
    title: 'AI Automations',
    description:
      'Save time on follow-ups, intake, FAQs, scheduling, and repeat customer tasks so your team can move faster.',
  },
  {
    title: 'Lead Capture Systems',
    description:
      'Cleaner forms, booking paths, and follow-up flows that make it easier for customers to take the next step.',
  },
  {
    title: 'Internal Tools',
    description:
      'Simple dashboards and tools that help you manage operations without messy spreadsheets or manual busywork.',
  },
]

const auditItems = [
  'Website conversion review',
  'Mobile experience review',
  'Lead capture opportunities',
  'AI automation ideas',
  'Simple prioritized recommendations',
]

const trustItems = [
  'Personally reviewed',
  'Actionable recommendations',
  'Built for your specific business',
]

const processSteps = [
  {
    number: '01',
    title: 'Audit',
    description:
      'I review your website, customer flow, and missed opportunities for leads, trust, and automation.',
  },
  {
    number: '02',
    title: 'Prioritize',
    description:
      'We focus on the improvements most likely to save time, increase inquiries, or remove friction.',
  },
  {
    number: '03',
    title: 'Build',
    description:
      'I build the website, automations, forms, or internal tools with a clean path from visitor to action.',
  },
  {
    number: '04',
    title: 'Launch',
    description:
      'After testing, the system goes live with the key details checked across desktop and mobile.',
  },
  {
    number: '05',
    title: 'Improve',
    description:
      'We keep improving based on real customer behavior, follow-up gaps, and new automation opportunities.',
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
          <a href="#solutions">Solutions</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href="#audit">
          Free AI Growth Audit
        </a>
      </nav>

      <section className="hero-section" id="top">
        <div className="hero-copy">
          <p className="eyebrow">AI websites • lead capture • automation • local business growth</p>
          <h1>Stop losing customers because of outdated systems.</h1>
          <p className="hero-subhead">
            We build modern websites and AI automations that help local businesses
            save time, capture more leads, and grow.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#audit">
              Get Free AI Growth Audit
            </a>
            <a className="button secondary" href="#process">
              See How It Works
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
              <span>Conversion Score</span>
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
          <h2>Projects that solve real business problems.</h2>
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

      <section className="section split-section" id="solutions">
        <div className="section-heading">
          <p className="eyebrow">Solutions</p>
          <h2>How we help your business grow.</h2>
          <p className="section-subhead">
            Practical AI systems that help local businesses save time, earn
            trust, and convert more visitors into customers.
          </p>
        </div>
        <div className="service-grid">
          {solutions.map((solution) => (
            <article className="service-card" key={solution.title}>
              <span />
              <h3>{solution.title}</h3>
              <p>{solution.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section audit-section" id="audit">
        <div className="audit-copy">
          <p className="eyebrow">Free AI Growth Audit</p>
          <h2>See where your business could be losing customers, wasting time, or missing easy automation wins.</h2>
          <p>
            I'll review your website and customer flow, then send back a short,
            practical report with specific ways to improve trust, lead capture,
            mobile experience, and AI automation opportunities.
          </p>
          <a className="button primary" href="#contact">
            Request Free Audit
          </a>
        </div>
        <div className="audit-panel">
          <h3>What you'll get</h3>
          <ul className="audit-list">
            {auditItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="audit-trust">
            Local businesses are already using AI to respond faster, follow up
            better, and reduce repetitive work. The earlier you start, the
            sooner it compounds.
          </p>
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="section-heading">
          <p className="eyebrow">Process</p>
          <h2>A simple path from outdated systems to better customer flow.</h2>
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

      <section className="trust-section">
        <div className="trust-copy">
          <p className="eyebrow">Trust</p>
          <h2>What makes every audit different</h2>
          <p>
            Every recommendation is reviewed by me before it's sent.
          </p>
          <p>
            I don't generate generic AI reports or automated checklists.
          </p>
          <p>
            Each audit combines AI analysis with a manual review of your
            website, customer journey, and business goals so the recommendations
            are practical, relevant, and worth implementing.
          </p>
        </div>
        <ul className="trust-list">
          {trustItems.map((item) => (
            <li key={item}>✓ {item}</li>
          ))}
        </ul>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <p className="eyebrow">Contact</p>
          <h2>Request your free AI growth audit.</h2>
          <p>
            I'll personally review your website and customer journey, then send
            practical recommendations tailored to your business.
          </p>
        </div>
        <form className="audit-form" onSubmit={(event) => event.preventDefault()}>
          <label>
            Name
            <input type="text" name="name" placeholder="Your name" autoComplete="name" />
          </label>
          <label>
            Business name
            <input type="text" name="business" placeholder="Your business name" />
          </label>
          <label>
            Website URL
            <input type="url" name="website" placeholder="https://yourbusiness.com" />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="you@business.com" autoComplete="email" />
          </label>
          <label className="form-wide">
            What do you want help with?
            <textarea
              name="goals"
              placeholder="More leads, faster follow-ups, a better mobile site, AI automation, or something else..."
            />
          </label>
          <button className="button primary form-wide" type="submit">
            Request My Free Audit
          </button>
        </form>
      </section>
    </main>
  )
}

export default App
