document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function renderMedia(project) {
  if (project.previewVideo) {
    return `
      <video class="project-card-video" autoplay muted loop playsinline preload="metadata" poster="${project.preview || project.image || ''}">
        <source src="${project.previewVideo}" type="video/mp4">
      </video>`;
  }
  if (project.preview || project.image) {
    return `<img class="project-card-img" src="${project.preview || project.image}" alt="${project.title} preview" loading="lazy">`;
  }
  return `<span class="project-card-placeholder">${project.title}</span>`;
}

async function loadProjects() {
  const grid = document.getElementById('project-grid');
  const count = document.getElementById('project-count');
  if (!grid) return;

  try {
    const res = await fetch('data/projects.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();

    if (count) count.textContent = `${projects.length} projects`;

    grid.innerHTML = projects.map(p => `
      <article class="project-card" role="listitem">
        <a href="project.html?id=${p.id}" class="project-card-link">
          <div class="project-card-media">${renderMedia(p)}</div>
          <div class="project-card-body">
            <span class="project-card-tag">${p.tags[0]}</span>
            <h3 class="project-card-title">${p.title}</h3>
            <p class="project-card-date">${p.date}</p>
          </div>
        </a>
      </article>
    `).join('');
  } catch (e) {
    grid.innerHTML = '<p style="color:var(--cream-muted)">Could not load projects.</p>';
    console.error('loadProjects:', e);
  }
}

loadProjects();
