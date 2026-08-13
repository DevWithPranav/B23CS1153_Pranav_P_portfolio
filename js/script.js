/* ============================================================
   PORTFOLIO SCRIPT
   Vanilla JS only. Sections:
   1. Theme toggle + persistence (localStorage)
   2. Header scroll state
   3. Mobile nav toggle
   4. Typewriter effect
   5. Scroll reveal animations
   6. Skills data + DOM rendering + tabs
   7. About stat counters
   8. Projects data + DOM rendering + tech filter
   9. Contact form — regex validation, inline errors
   10. Scroll-to-top button
   11. Footer year
   ============================================================ */

// ------------------------------------------------------------
// 1. THEME TOGGLE
// Persists the chosen theme in localStorage so it survives a
// page refresh (browser storage requirement).
// ------------------------------------------------------------
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') root.setAttribute('data-theme', 'dark');

themeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  if (isDark) {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
});

// ------------------------------------------------------------
// 2. HEADER SCROLL STATE
// ------------------------------------------------------------
const siteHeader = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 20);
});

// ------------------------------------------------------------
// 3. MOBILE NAV TOGGLE (event handling behaviour #1)
// ------------------------------------------------------------
const navBurger = document.getElementById('navBurger');
const nav = document.getElementById('nav');

navBurger.addEventListener('click', () => {
  navBurger.classList.toggle('open');
  nav.classList.toggle('open');
});

nav.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navBurger.classList.remove('open');
    nav.classList.remove('open');
  });
});

// ------------------------------------------------------------
// 4. TYPEWRITER
// ------------------------------------------------------------
const roles = ['Full Stack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Lifelong Learner'];
const typewriterEl = document.getElementById('typewriter');
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

const typeLoop = () => {
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typewriterEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typewriterEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeLoop, deleting ? 45 : 90);
};
typeLoop();

// ------------------------------------------------------------
// 5. SCROLL REVEAL
// ------------------------------------------------------------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

// ------------------------------------------------------------
// 6. SKILLS — data-driven rendering (dl/dt/dd) + tabs
// Skills live as a plain array of objects per category. The DOM
// is built from this data with map()/join() and template
// literals — nothing is hardcoded in the HTML.
// ------------------------------------------------------------
const skillsData = {
  frontend: [
    { name: 'HTML5 & CSS3', level: 95 },
    { name: 'JavaScript (ES6+)', level: 90 },
    { name: 'React', level: 85 },
    { name: 'Responsive Design', level: 92 },
  ],
  backend: [
    { name: 'Node.js', level: 85 },
    { name: 'Django', level: 88 },
    { name: 'Express', level: 82 },
    { name: 'REST APIs', level: 88 },
    { name: 'MySQL', level: 80 },
    { name: 'NoSQL (MongoDB)', level: 83 },
  ],
  tools: [
    { name: 'Git & GitHub', level: 90 },
    { name: 'VS Code', level: 95 },
    { name: 'Figma', level: 78 },
    { name: 'Command Line', level: 85 },
  ],
  other: [
    { name: 'Problem Solving', level: 92 },
    { name: 'UI / UX Principles', level: 85 },
    { name: 'Performance Tuning', level: 80 },
    { name: 'Team Collaboration', level: 90 },
  ],
};

// Builds the markup for one skill category as a description list.
const buildSkillRows = (skills) =>
  skills
    .map(({ name, level }) => `
      <div class="bar-row" data-level="${level}">
        <dt>${name}</dt>
        <dd>
          <div class="bar-track"><div class="bar-fill"></div></div>
          <span class="bar-percent">0%</span>
        </dd>
      </div>
    `)
    .join('');

// Render every category's rows into its matching <dl data-panel="...">
Object.entries(skillsData).forEach(([category, skills]) => {
  const panel = document.querySelector(`.tab-panel[data-panel="${category}"]`);
  if (panel) panel.innerHTML = buildSkillRows(skills);
});

const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

// Animates each bar-fill/percentage in a panel, staggered by row index.
const animateBars = (panel) => {
  if (!panel) return;
  const rows = panel.querySelectorAll('.bar-row');

  rows.forEach((row, i) => {
    const fill = row.querySelector('.bar-fill');
    const percentEl = row.querySelector('.bar-percent');
    const level = parseInt(row.dataset.level, 10);
    const delay = i * 110;

    fill.style.width = '0%';
    percentEl.textContent = '0%';

    setTimeout(() => {
      fill.style.width = `${level}%`;

      const duration = 900;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        percentEl.textContent = `${Math.floor(progress * level)}%`;
        if (progress < 1) requestAnimationFrame(tick);
        else percentEl.textContent = `${level}%`;
      };
      requestAnimationFrame(tick);
    }, delay);
  });
};

// Tab click switches the active panel (event handling behaviour #2)
tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) return;

    tabBtns.forEach((b) => b.classList.remove('active'));
    tabPanels.forEach((p) => p.classList.remove('active'));

    btn.classList.add('active');
    const panel = document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`);
    panel.classList.add('active');
    animateBars(panel);
  });
});

let skillsAnimated = false;
const skillsSection = document.getElementById('skills');
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !skillsAnimated) {
      skillsAnimated = true;
      animateBars(document.querySelector('.tab-panel.active'));
    }
  });
}, { threshold: 0.3 });
if (skillsSection) skillsObserver.observe(skillsSection);

// ------------------------------------------------------------
// 7. ABOUT STAT COUNTERS
// ------------------------------------------------------------
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach((el) => countObserver.observe(el));

// ------------------------------------------------------------
// 8. PROJECTS — data-driven rendering + technology filter
// Projects are stored as an array of objects and rendered into
// the DOM on load. Filter buttons are derived from the unique
// set of tags across all projects (Set + spread).
// ------------------------------------------------------------
const projectsData = [
  {
    id: 'catalyst',
    title: 'Catalyst — IEDC Web Platform',
    description: 'Official website for Catalyst, the Innovation and Entrepreneurship Development Centre at MBCET. Built an admin dashboard with full CRUD event management, plus UI, gallery, and SEO work on the live site.',
    image: 'images/projects/catalyst.svg',
    tags: ['Next.js', 'React', 'Supabase', 'Three.js'],
    tag: 'Featured',
    github: 'https://github.com/thecatalystiedcmbcet/Catalyst-Web',
    live: 'https://catalyst-web.vercel.app',
  },
  {
    id: 'design-unlock',
    title: 'Design Unlocked',
    description: 'A real-time peer + mentor investment and voting platform built for a live design event, with a Supabase-backed scoring engine, RLS-secured roles, and an animated results reveal.',
    image: 'images/projects/design-unlock.svg',
    tags: ['Next.js', 'Supabase', 'Framer Motion'],
    tag: 'Featured',
    github: 'https://github.com/DevWithPranav/design-unlock',
    live: 'https://design-unlock.vercel.app',
  },
  {
    id: 'echo-discord',
    title: 'Echo Discord Framework',
    description: 'A modular, scalable Discord bot framework with an auto handler loader, MongoDB integration, structured error handling, and file/console/Discord-channel logging.',
    image: 'images/projects/echo-discord.svg',
    tags: ['Node.js', 'discord.js', 'MongoDB'],
    tag: 'Project',
    github: 'https://github.com/DevWithPranav/echo-discord',
    live: null,
  },
  {
    id: 'aerial-surveillance',
    title: 'Autonomous Aerial Surveillance',
    description: 'An in-progress research framework that turns UAV footage into geo-tagged traffic-violation and road-anomaly data, feeding a 3D digital twin for simulation-driven urban planning.',
    image: 'images/projects/aerial-surveillance.svg',
    tags: ['YOLOv8', 'FastAPI', 'PostGIS', 'CesiumJS'],
    tag: 'Research',
    github: 'https://github.com/DevWithPranav/main-project',
    live: null,
  },
];

const projectsGrid = document.getElementById('projectsGrid');
const projectFilters = document.getElementById('projectFilters');

// Builds a single project card's markup from a project object.
const buildProjectCard = ({ title, description, image, tags, tag, github, live }) => `
  <article class="project-card" data-tags="${tags.join(',')}">
    <div class="project-image">
      <img src="${image}" alt="${title} project banner" loading="lazy">
    </div>
    <div class="project-top">
      <span class="project-tag">${tag}</span>
      <div class="project-links">
        <a href="${github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">GH</a>
        ${live ? `<a href="${live}" target="_blank" rel="noopener noreferrer" aria-label="Live site">↗</a>` : ''}
      </div>
    </div>
    <h4>${title}</h4>
    <p>${description}</p>
    <ul class="project-stack">
      ${tags.map((t) => `<li>${t}</li>`).join('')}
    </ul>
  </article>
`;

// Renders a list of projects (filtered or full) into the grid.
const renderProjects = (list) => {
  projectsGrid.innerHTML = list.map(buildProjectCard).join('');
};

// Unique tag list, "All" first, built with Set + spread.
const uniqueTags = ['All', ...new Set(projectsData.flatMap((p) => p.tags))];

const buildFilterButton = (tagName) => `
  <button type="button" class="filter-btn${tagName === 'All' ? ' active' : ''}" data-filter="${tagName}">
    ${tagName}
  </button>
`;

projectFilters.innerHTML = uniqueTags.map(buildFilterButton).join('');

// Filter click handling: re-render only the projects matching the tag.
projectFilters.addEventListener('click', (event) => {
  const btn = event.target.closest('.filter-btn');
  if (!btn) return;

  projectFilters.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');

  const { filter } = btn.dataset;
  const filtered = filter === 'All'
    ? projectsData
    : projectsData.filter((p) => p.tags.includes(filter));

  renderProjects(filtered);
});

// Initial render — everything, unfiltered.
renderProjects(projectsData);

// ------------------------------------------------------------
// 9. CONTACT FORM — regex validation, inline errors, no reload
// ------------------------------------------------------------
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

// Regex patterns used for client-side validation.
const NAME_PATTERN = /^[A-Za-z][A-Za-z\s'-]{1,49}$/;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Each validator returns an error string, or '' when the field is valid.
const validators = {
  name: (value) => {
    if (!value.trim()) return 'Name is required.';
    if (!NAME_PATTERN.test(value.trim())) return 'Enter a valid name (letters only, 2-50 chars).';
    return '';
  },
  email: (value) => {
    if (!value.trim()) return 'Email is required.';
    if (!EMAIL_PATTERN.test(value.trim())) return 'Enter a valid email address.';
    return '';
  },
  message: (value) => {
    if (!value.trim()) return 'Message is required.';
    if (value.trim().length < 10) return 'Message must be at least 10 characters.';
    return '';
  },
};

// Wires one input to its error element and validator for live feedback.
const bindFieldValidation = (input, errorEl, validatorKey) => {
  input.addEventListener('input', () => {
    const message = validators[validatorKey](input.value);
    errorEl.textContent = message;
    input.classList.toggle('invalid', Boolean(message));
  });
};

bindFieldValidation(nameInput, nameError, 'name');
bindFieldValidation(emailInput, emailError, 'email');
bindFieldValidation(messageInput, messageError, 'message');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault(); // no page reload — this is the whole point of client-side validation

  // Re-validate every field on submit, in case the user never touched one.
  const fields = [
    { input: nameInput, errorEl: nameError, key: 'name' },
    { input: emailInput, errorEl: emailError, key: 'email' },
    { input: messageInput, errorEl: messageError, key: 'message' },
  ];

  const errors = fields.map(({ input, errorEl, key }) => {
    const message = validators[key](input.value);
    errorEl.textContent = message;
    input.classList.toggle('invalid', Boolean(message));
    return message;
  });

  const hasErrors = errors.some((message) => message !== '');
  if (hasErrors) {
    formStatus.textContent = 'Please fix the errors above before sending.';
    formStatus.classList.add('is-error');
    return;
  }

  // Valid — persist the last message to localStorage (browser storage bonus)
  // and prefill the name field on the next visit as a small "welcome back".
  const { value: name } = nameInput;
  const { value: email } = emailInput;
  const { value: message } = messageInput;
  localStorage.setItem('lastMessage', JSON.stringify({ name, email, message, date: new Date().toISOString() }));

  formStatus.classList.remove('is-error');
  formStatus.textContent = `Thanks, ${name.trim()} — your message looks good! Reach me directly any time at pranavp92075@gmail.com.`;
  contactForm.reset();
});

// Prefill the name field from a previous visit, if one exists.
const lastMessageRaw = localStorage.getItem('lastMessage');
if (lastMessageRaw) {
  const { name } = JSON.parse(lastMessageRaw);
  if (name) nameInput.value = name;
}

// ------------------------------------------------------------
// 10. SCROLL-TO-TOP BUTTON (fixed positioning + event handling)
// ------------------------------------------------------------
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ------------------------------------------------------------
// 11. FOOTER YEAR
// ------------------------------------------------------------
document.getElementById('year').textContent = new Date().getFullYear();
