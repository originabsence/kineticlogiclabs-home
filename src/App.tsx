import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Analytics } from '@vercel/analytics/react';
import pencilCaseOpen from './pencil_case_open.jpeg';
import pencilCaseClosed from './pencil_box_closed.jpeg';
import pencilCaseProcess from './pencil_case_3_top_half_1.mp4';
import remoteSensing from './so_remote_sensing.jpeg';
import ziyaoPhoto from './ziyao_photo.jpeg';

type Page = 'home' | 'about' | 'projects' | 'repository' | 'contact';

const pages: { id: Page; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'repository', label: 'Repository' },
  { id: 'contact', label: 'Contact' },
];

const desktopNavigationQuery = '(min-width: 881px)';

function Logo() {
  return (
    <svg viewBox="120 120 760 760" aria-hidden="true" className="logo-mark">
      <polygon
        fill="none"
        stroke="currentColor"
        strokeWidth="29"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="500 123.78 174.18 311.89 174.18 688.11 500 876.22 825.82 688.11 825.82 311.89 500 123.78"
      />
      <circle fill="none" stroke="currentColor" strokeWidth="29" cx="500" cy="500" r="162.65" />
      <path
        fill="currentColor"
        d="M753.03,448.91l-36.04-7.29c-3.87-.78-6.99-3.62-8.17-7.39-3.87-12.28-8.8-24.1-14.67-35.34-1.83-3.51-1.64-7.72.55-11.02l20.35-30.66c4.43-6.68,4.05-14.91-.92-19.88l-51.46-51.46c-4.97-4.97-13.2-5.35-19.88-.92l-30.66,20.35c-3.3,2.19-7.51,2.38-11.02.55-10.95-5.72-22.44-10.54-34.38-14.35-3.74-1.2-6.56-4.31-7.34-8.16l-8.3-41.03c-1.59-7.85-7.68-13.4-14.7-13.4h-72.78c-7.02,0-13.11,5.55-14.7,13.4l-8.3,41.03c-.78,3.85-3.6,6.96-7.34,8.16-11.94,3.81-23.43,8.63-34.38,14.35-3.51,1.83-7.72,1.64-11.02-.55l-30.66-20.35c-6.68-4.43-14.91-4.05-19.88.92l-51.46,51.46c-4.97,4.97-5.35,13.2-.92,19.88l20.35,30.66c2.19,3.3,2.38,7.51.55,11.02-5.87,11.24-10.8,23.06-14.67,35.34-1.18,3.77-4.3,6.61-8.17,7.39l-36.04,7.29c-7.85,1.59-13.41,7.68-13.41,14.7v72.78c0,7.02,5.56,13.11,13.41,14.7l36.04,7.29c3.87.78,6.99,3.62,8.17,7.39,3.87,12.28,8.8,24.1,14.67,35.34,1.83,3.51,1.64,11.02-.55,11.02l-20.35,30.66c-4.43,6.68-4.05,14.91-.92,19.88l51.46,51.46c4.97,4.97,13.2,5.35,19.88.92l30.66-20.35c3.3-2.19,7.51-2.38,11.02-.55,11.24,5.87,23.06,10.8,35.34,14.67,3.77,1.18,6.61,4.3,7.39,8.17l7.29,36.04c1.59,7.85,7.68,13.41,14.7,13.41h72.78c7.02,0,13.11-5.56,14.7-13.41l7.29-36.04c.78-3.87,3.62-6.99,7.39-8.17,12.28-3.87,23.06-8.8,35.34-14.67,3.51-1.83,7.72-1.64,11.02.55l30.66,20.35c6.68,4.43,14.91,4.05,19.88-.92l51.46-51.46c4.97-4.97,5.35-13.2.92-19.88l-20.35-30.66c-2.19-3.3-2.38-7.51-.55-11.02,5.87-11.24,10.8-23.06,14.67-35.34,1.18-3.77,4.3-6.61,8.17-7.39l36.04-7.29c7.85-1.59,13.41-7.68,13.41-14.7v-72.78c0-7.02-5.56-13.11-13.41-14.7ZM500,662.65c-89.83,0-162.65-72.82-162.65-162.65s72.82-162.65,162.65-162.65,162.65,72.82,162.65,162.65-72.82,162.65-162.65,162.65Z"
      />
    </svg>
  );
}

function routeFor(page: Page) {
  return page === 'home' ? '#/' : `#/${page}`;
}

function pageFromHash(fallback: Page = 'home'): Page {
  const candidate = window.location.hash.replace(/^#\/?/, '') || 'home';
  return pages.some((item) => item.id === candidate) ? candidate as Page : fallback;
}

type RouteViewTransition = {
  finished: Promise<void>;
  skipTransition?: () => void;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => RouteViewTransition;
};

function Header({ page }: { page: Page }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    const closeOnDesktop = () => {
      if (window.matchMedia(desktopNavigationQuery).matches) setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnDesktop);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnDesktop);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <a className="brand-lockup" href="#/" aria-label="Kinetic Logic Labs home">
        <Logo />
        <span>KINETIC<br />LOGIC LABS</span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {pages.map((item) => (
          <a key={item.id} href={routeFor(item.id)} aria-current={page === item.id ? 'page' : undefined}>
            {item.label}
            {page === item.id && <span className="nav-active-indicator" aria-hidden="true" />}
          </a>
        ))}
      </nav>
      <div className={`mobile-nav ${menuOpen ? 'is-open' : ''}`}>
        <button
          ref={menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg className="menu-icon" viewBox="0 0 32 32" aria-hidden="true">
            <line className="menu-icon-line menu-icon-top" x1="8" y1="10" x2="24" y2="10" />
            <line className="menu-icon-line menu-icon-middle" x1="8" y1="16" x2="24" y2="16" />
            <line className="menu-icon-line menu-icon-bottom" x1="8" y1="22" x2="24" y2="22" />
          </svg>
          <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
        <nav id="mobile-navigation" aria-label="Mobile navigation" aria-hidden={!menuOpen}>
          {pages.map((item) => (
            <a
              key={item.id}
              href={routeFor(item.id)}
              aria-current={page === item.id ? 'page' : undefined}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => flushSync(() => setMenuOpen(false))}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <span className="issue">JOURNAL / {__LAST_UPDATED__}</span>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a className="brand-lockup" href="#/">
            <Logo />
            <span>KINETIC<br />LOGIC LABS</span>
          </a>
          <p>An independent engineering portfolio documenting CAD, fabrication, and science research.</p>
          <a className="text-link" href="mailto:kineticlogiclabs@gmail.com">kineticlogiclabs@gmail.com</a>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <span className="section-label">EXPLORE</span>
          {pages.map((item) => <a key={item.id} href={routeFor(item.id)}>{item.label}</a>)}
        </nav>
        <div className="footer-note">
          <span>© 2026 KINETIC LOGIC LABS</span>
          <small>ALL RIGHTS RESERVED</small>
          <small>WEBSITE DESIGN BY ZIYAO XU</small>
        </div>
      </div>
    </footer>
  );
}

function PageHeader({ label, title, intro }: { label: string; title: ReactNode; intro: string }) {
  return (
    <section className="page-header" data-reveal>
      <div className="measure">
        <span className="coral-label">{label}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </section>
  );
}

function MediaImage({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      className={`media-image ${loaded ? 'is-loaded' : ''}`}
      src={src}
      alt={alt}
      width="1600"
      height="1000"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
    />
  );
}

function HomePage() {
  return (
    <>
      <section className="home-hero" data-reveal>
        <div className="measure">
          <span className="coral-label">INDEPENDENT ENGINEERING JOURNAL</span>
          <h1>Observe.<br />Model. Test.</h1>
          <p>Kinetic Logic Labs records work in CAD, fabrication, and science research with enough context to show how an idea changed into evidence.</p>
          <a className="hero-browse" href="#/projects">BROWSE ALL PROJECTS</a>
        </div>
      </section>
      <section className="featured" data-reveal>
        <a className="featured-media" href="#/projects" aria-label="Open the Pencil Case project record">
          <MediaImage src={pencilCaseOpen} alt="Open 3D-printed pencil case showing its interior" eager />
          <span>FIG. 01 — OPEN STATE / INTERIOR AND LID VISIBLE</span>
        </a>
        <div className="featured-copy">
          <span className="coral-label">FEATURED PROJECT / RECORD 001</span>
          <h2>Pencil Case: Fusion model and printed artifact.</h2>
          <p>Designed in Fusion and fabricated through 3D printing, the pencil case is documented in open and closed states alongside a process video. The complete record keeps the model, physical artifact, and source media connected.</p>
          <a className="action-link" href="#/projects">OPEN COMPLETE RECORD →</a>
        </div>
      </section>
      <section className="journal-index" data-reveal>
        <div className="measure">
          <span className="coral-label">PORTFOLIO INDEX</span>
          <h2>Records, evidence, and background</h2>
          <a className="index-row" href="#/projects"><small>01 / PROJECT</small><strong>Pencil Case — model and physical artifact</strong><span>PROJECT RECORD →</span></a>
          <a className="index-row" href="#/repository"><small>02 / REPOSITORY</small><strong>Source media and process documentation</strong><span>VIEW ARCHIVE →</span></a>
          <a className="index-row" href="#/about"><small>03 / PROFILE</small><strong>Ziyao Xu — STEM, engineering, and CAD</strong><span>READ PROFILE →</span></a>
        </div>
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <PageHeader label="PROFILE / 001" title={<>Engineering through evidence and iteration.</>} intro="Kinetic Logic Labs is Ziyao Xu’s independent portfolio for engineering work, CAD practice, fabrication, and science research." />
      <section className="editorial-grid" data-reveal>
        <figure className="portrait">
          <MediaImage src={ziyaoPhoto} alt="Portrait of Ziyao Xu" />
          <figcaption>FIG. 01 — ZIYAO XU / FOUNDER</figcaption>
        </figure>
        <article className="longform">
          <span className="coral-label">BACKGROUND</span>
          <h2>A student-led technical practice.</h2>
          <p>Ziyao is a freshman at Eastlake High School who works across STEM and engineering, including 3D design and CAD.</p>
          <p>In Science Olympiad, he achieved first place at Nationals in Remote Sensing and sixth place nationally in Mission Possible. His independent practice includes designing functional objects in Fusion and documenting their fabrication through 3D printing.</p>
          <dl className="record-list">
            <div><dt>FOCUS</dt><dd>STEM, engineering, 3D design, and CAD</dd></div>
            <div><dt>SCIENCE OLYMPIAD</dt><dd>Remote Sensing and Mission Possible</dd></div>
            <div><dt>PRACTICE</dt><dd>Fusion modeling and 3D printing</dd></div>
          </dl>
        </article>
      </section>
    </>
  );
}

function ProjectsPage() {
  return (
    <>
      <PageHeader label="PROJECTS / DOCUMENTED WORK" title={<>From digital model to physical record.</>} intro="Projects are presented as technical records: context, tools, physical evidence, and source media remain connected." />
      <article className="project-record" data-reveal>
        <header>
          <span className="coral-label">PROJECT RECORD / 001</span>
          <h2>Pencil Case</h2>
          <p>A Fusion CAD model documented as a 3D-printed object in open and closed states, with a video of the printing process.</p>
        </header>
        <div className="project-media">
          <figure><MediaImage src={pencilCaseOpen} alt="Open 3D-printed pencil case" eager /><figcaption>FIG. 01 — OPEN STATE</figcaption></figure>
          <figure><MediaImage src={pencilCaseClosed} alt="Closed 3D-printed pencil case" /><figcaption>FIG. 02 — CLOSED STATE</figcaption></figure>
        </div>
        <div className="project-detail">
          <div>
            <span className="section-label">RECORD SUMMARY</span>
            <p>The open view documents the interior and lid relationship. The closed view records the same physical object as an assembled case. The process video provides a separate fabrication record.</p>
          </div>
          <dl className="record-list">
            <div><dt>SOFTWARE</dt><dd>Fusion</dd></div>
            <div><dt>PRACTICE</dt><dd>CAD modeling and 3D printing</dd></div>
            <div><dt>AVAILABLE MEDIA</dt><dd>Two photographs and one process video</dd></div>
          </dl>
        </div>
        <a className="video-record" href={pencilCaseProcess} target="_blank" rel="noreferrer">
          <span><small>PROCESS RECORD / VIDEO</small><strong>View the 3D-printing process</strong></span>
          <span>OPEN MEDIA →</span>
        </a>
      </article>
    </>
  );
}

function RepositoryPage() {
  const records = [
    { id: 'R-001', type: 'IMAGE', title: 'Pencil Case — open state', detail: 'Project documentation', href: pencilCaseOpen },
    { id: 'R-002', type: 'IMAGE', title: 'Pencil Case — closed state', detail: 'Project documentation', href: pencilCaseClosed },
    { id: 'R-003', type: 'VIDEO', title: 'Pencil Case — printing process', detail: 'Fabrication documentation', href: pencilCaseProcess },
    { id: 'R-004', type: 'IMAGE', title: 'Remote Sensing — Science Olympiad', detail: 'Profile source image', href: remoteSensing },
  ];
  return (
    <>
      <PageHeader label="REPOSITORY / SOURCE MATERIAL" title={<>An index of the available evidence.</>} intro="The repository separates source media from interpretation so each project claim can be traced to an existing record." />
      <section className="repository" data-reveal>
        <div className="repository-head"><span>RECORD</span><span>DESCRIPTION</span><span>FORMAT</span><span>ACCESS</span></div>
        {records.map((record) => (
          <a className="repository-row" href={record.href} target="_blank" rel="noreferrer" key={record.id}>
            <small>{record.id}</small>
            <span><strong>{record.title}</strong><small>{record.detail}</small></span>
            <small>{record.type}</small>
            <small>OPEN →</small>
          </a>
        ))}
      </section>
    </>
  );
}

function ContactPage() {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '');
    const subject = String(data.get('subject') || '');
    const message = String(data.get('message') || '');
    const body = `Name: ${name}\n\n${message}\n\nSent from the Kinetic Logic Labs portfolio.`;
    window.location.href = `mailto:kineticlogiclabs@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <>
      <PageHeader label="CONTACT / INQUIRY" title={<>Start a technical conversation.</>} intro="Questions, feedback, and project inquiries can be sent directly to Kinetic Logic Labs." />
      <section className="contact-layout" data-reveal>
        <form className="contact-form" onSubmit={submit}>
          <label>NAME<input required name="name" autoComplete="name" /></label>
          <label>SUBJECT<input required name="subject" /></label>
          <label>MESSAGE<textarea required name="message" rows={7} /></label>
          <button type="submit">PREPARE EMAIL →</button>
        </form>
        <aside className="contact-aside">
          <span className="coral-label">DIRECT CONTACT</span>
          <h2>Email the lab.</h2>
          <p>The form prepares a message in your default email application. You can also write directly:</p>
          <a className="text-link" href="mailto:kineticlogiclabs@gmail.com">kineticlogiclabs@gmail.com</a>
        </aside>
      </section>
    </>
  );
}

export default function App() {
  const initialPage = pageFromHash();
  const [page, setPage] = useState<Page>(initialPage);
  const pageRef = useRef<Page>(initialPage);
  const activeTransition = useRef<RouteViewTransition | null>(null);

  useEffect(() => {
    const syncRoute = () => {
      const next = pageFromHash(pageRef.current);
      if (next === pageRef.current) return;

      const current = pageRef.current;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const viewTransitionDocument = document as ViewTransitionDocument;
      const updateRoute = () => {
        pageRef.current = next;
        window.scrollTo(0, 0);
        flushSync(() => setPage(next));
        document.querySelectorAll<HTMLElement>('#main [data-reveal]')
          .forEach((target) => target.classList.add('is-visible'));
      };

      activeTransition.current?.skipTransition?.();
      if (reducedMotion || !viewTransitionDocument.startViewTransition) {
        updateRoute();
        return;
      }

      const direction = pages.findIndex((item) => item.id === next) > pages.findIndex((item) => item.id === current)
        ? 'forward'
        : 'backward';
      document.documentElement.dataset.routeDirection = window.matchMedia(desktopNavigationQuery).matches
        ? direction
        : 'fade';
      document.documentElement.classList.add('is-route-transitioning');
      const transition = viewTransitionDocument.startViewTransition(updateRoute);
      activeTransition.current = transition;
      transition.finished.finally(() => {
        if (activeTransition.current !== transition) return;
        activeTransition.current = null;
        document.documentElement.classList.remove('is-route-transitioning');
        delete document.documentElement.dataset.routeDirection;
      });
    };
    const cancelTransitionAcrossBreakpoint = () => {
      if (!activeTransition.current) return;
      activeTransition.current.skipTransition?.();
      activeTransition.current = null;
      document.documentElement.classList.remove('is-route-transitioning');
      delete document.documentElement.dataset.routeDirection;
    };
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('resize', cancelTransitionAcrossBreakpoint);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('resize', cancelTransitionAcrossBreakpoint);
      activeTransition.current?.skipTransition?.();
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('motion-ready');
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [page]);

  const content: Record<Page, ReactNode> = {
    home: <HomePage />,
    about: <AboutPage />,
    projects: <ProjectsPage />,
    repository: <RepositoryPage />,
    contact: <ContactPage />,
  };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="blue-shell"><Header page={page} /></div>
      <main id="main" className={`route-stage route-page-${page}`} aria-live="polite">
        <div className="route-blue-background" aria-hidden="true" />
        <div className="route-content">{content[page]}</div>
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}
