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

function getId() {
  return new URLSearchParams(location.search).get('id');
}

function notFound() {
  document.getElementById('case-study').innerHTML = `
    <div class="case-not-found">
      <h1 class="script">Not found</h1>
      <p style="color:var(--cream-muted)">This project doesn't exist.</p>
      <a href="index.html#work" class="btn" style="margin-top:1.5rem">← Back to work</a>
    </div>`;
  document.title = 'Not found · Nat Nguyen';
}

function screenSrc(s) {
  return typeof s === 'string' ? s : s.src;
}

function screenLabel(s, i) {
  return typeof s === 'object' && s.label ? s.label : `Screen ${i + 1}`;
}

function renderVideo(p) {
  if (!p.video && !p.videoFallback) return '';

  const sources = [];
  if (p.video) {
    const ext = p.video.split('.').pop().toLowerCase();
    const type = ext === 'mov' ? 'video/quicktime' : 'video/mp4';
    sources.push(`<source src="${p.video}" type="${type}">`);
  }
  if (p.videoFallback) {
    sources.push(`<source src="${p.videoFallback}" type="video/quicktime">`);
  }

  const title = p.videoTitle || 'Prototype walkthrough';
  const desc = p.videoDesc || 'Screen recording of the interactive Figma prototype.';
  const player = `
    <video class="case-video-player" controls playsinline preload="metadata" poster="${p.videoPoster || p.image || ''}">
      ${sources.join('\n      ')}
      <a href="${p.video || p.videoFallback}">Download the video</a>
    </video>`;

  const wrap = p.videoMockup
    ? `<div class="case-laptop">
        <div class="case-laptop-screen">${player}</div>
        <img class="case-laptop-frame" src="${p.videoMockup}" alt="" aria-hidden="true">
      </div>`
    : `<div class="case-video-wrap${p.videoWide ? ' case-video-wrap--wide' : ''}">${player}</div>`;

  return `
    <section class="case-video${p.videoMockup ? ' case-video--laptop' : ''}${p.videoWide ? ' case-video--wide' : ''}">
      <h2>${title}</h2>
      <p class="case-video-desc">${desc}</p>
      ${wrap}
    </section>`;
}

function renderGallery(screens, title = 'Gallery') {
  if (!screens?.length) return '';
  return `
    <section class="case-gallery">
      <h2>${title}</h2>
      <div class="case-gallery-grid">
        ${screens.map((s, i) => `
          <figure class="case-gallery-item">
            <img src="${screenSrc(s)}" alt="${screenLabel(s, i)}" loading="lazy">
            ${typeof s === 'object' && s.label ? `<figcaption>${s.label}</figcaption>` : ''}
          </figure>
        `).join('')}
      </div>
    </section>`;
}

function renderPlaceholders(p) {
  if (!p.placeholders?.length) return '';
  return `
    <section class="case-placeholders">
      <h2>Process</h2>
      <p class="case-placeholders-desc">Additional visuals to be added.</p>
      <div class="case-placeholders-grid">
        ${p.placeholders.map(item => `
          <div class="case-placeholder-card">
            <div class="case-placeholder-frame" aria-hidden="true"></div>
            <p class="case-placeholder-label">${item.label}</p>
            ${item.note ? `<p class="case-placeholder-note">${item.note}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </section>`;
}

function renderProject(p) {
  document.title = `${p.title} · Nat Nguyen`;

  const heroVisual = p.image
    ? `<img src="${p.image}" alt="${p.title}">`
    : `<span class="case-hero-placeholder">${p.title}</span>`;

  const draftBanner = p.draft
    ? `<p class="case-draft-banner">Case study in progress — visuals and copy will be updated soon.</p>`
    : '';

  let extra = '';

  if (p.challenges) {
    extra = p.challenges.map((c, i) => {
      const heading = p.blockStyle === 'feature' ? c.title : `Challenge ${i + 1}: ${c.title}`;
      const imgs = c.images?.length
        ? c.images
        : (p.screens?.[i] ? [p.screens[i]] : []);
      const multi = imgs.length > 1 || c.wide;
      const media = imgs.length
        ? `<div class="case-challenge-imgs${imgs.length > 1 ? ' case-challenge-imgs--stack' : ''}${c.wide && imgs.length === 1 ? ' case-challenge-imgs--full' : ''}${c.compact ? ' case-challenge-imgs--compact' : ''}">
            ${imgs.map(img => `
              <figure class="case-challenge-img">
                <img src="${screenSrc(img)}" alt="${typeof img === 'object' && img.label ? img.label : c.title}" loading="lazy">
                ${typeof img === 'object' && img.label ? `<figcaption class="case-challenge-caption">${img.label}</figcaption>` : ''}
              </figure>
            `).join('')}
          </div>`
        : `<div class="case-challenge-img"><span class="case-hero-placeholder">${p.title}</span></div>`;
      return `
      <div class="case-challenge${multi ? ' case-challenge--wide' : ''}${p.blockStyle === 'feature' ? ' case-challenge--feature' : ''}${!multi && p.blockStyle === 'feature' && i % 2 === 1 ? ' case-challenge--flip' : ''}${c.compact ? ' case-challenge--compact' : ''}">
        <div class="case-challenge-text">
          <h3>${heading}</h3>
          <p>${c.body}</p>
        </div>
        ${media}
      </div>`;
    }).join('');
  } else if (p.sections) {
    extra = p.sections.map((s, i) => `
      <section class="case-section">
        <h2>${s.title}</h2>
        <p>${s.body}</p>
      </section>
      ${p.screens[i] ? `<section class="case-gallery"><div class="case-gallery-grid"><img src="${screenSrc(p.screens[i])}" alt="" loading="lazy"></div></section>` : ''}
    `).join('');
  }

  const problemBlock = p.problem ? `
    <div class="case-split">
      <div class="case-split-block">
        <h2>The Problem</h2>
        <p>${p.problem}</p>
      </div>
      <div class="case-split-block">
        <h2>The Objective</h2>
        <p>${p.objective}</p>
      </div>
    </div>` : '';

  const galleryTitle = p.id === 'nekobeat' ? 'Gameplay' : p.id === 'boozebuddy' ? 'App Screens' : 'Work';

  document.getElementById('case-study').innerHTML = `
    <header class="case-hero">
      <div class="case-hero-inner">
        <div>
          <span class="case-tag">${p.tags.join(' · ')}</span>
          <h1 class="script">${p.title}</h1>
          <p class="case-meta">${p.date} · ${p.role}</p>
          <p class="case-summary">${p.summary}</p>
          ${draftBanner}
          ${p.link ? `<a href="${p.link}" class="case-link" target="_blank" rel="noopener noreferrer">${p.linkLabel || 'View project →'}</a>` : ''}
        </div>
        <div class="case-hero-visual">${heroVisual}</div>
      </div>
    </header>

    ${renderVideo(p)}

    <section class="case-section">
      <h2>Overview</h2>
      <p>${p.overview}</p>
    </section>

    ${problemBlock}

    ${p.solution ? `
      <section class="case-section">
        <h2>${p.solutionTitle || 'Solution'}</h2>
        <p>${p.solution}</p>
      </section>` : ''}

    ${extra}

    ${renderPlaceholders(p)}

    ${!p.challenges && !p.sections ? renderGallery(p.screens, galleryTitle) : ''}

    <div class="case-back">
      <a href="index.html#work" class="btn">← All work</a>
    </div>
  `;
}

async function init() {
  const id = getId();
  if (!id) return notFound();
  try {
    const res = await fetch('data/projects.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();
    const p = projects.find(x => x.id === id);
    p ? renderProject(p) : notFound();
  } catch (e) {
    notFound();
    console.error('init:', e);
  }
}

init();
