const cases = JSON.parse(document.querySelector('#case-data').textContent);
const methods = [['direct', 'Seedance'], ['codex_blender', 'Codex + Blender'], ['harness', 'Coda-DaVinci (Ours)']];
const tabs = document.querySelector('.case-tabs');
const panel = document.querySelector('#case-panel');
const grid = document.querySelector('.compare-grid');
const playButton = document.querySelector('#play-all');
const timeline = document.querySelector('#timeline');
const proxyToggle = document.querySelector('#show-proxies');
const errorText = document.querySelector('#play-error');
let selected = 0;
let playing = false;
let loading = false;
let videos = [];
let revision = 0;
const stamp = value => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
const duration = () => Math.min(...videos.map(video => Number.isFinite(video.duration) ? video.duration : Infinity));
function pause() {
  playing = false;
  videos.forEach(video => video.pause());
  playButton.textContent = 'Play all';
}
function updateTime() {
  const total = duration();
  const time = videos[0]?.currentTime || 0;
  if (Number.isFinite(total)) {
    timeline.value = total ? time / total * 1000 : 0;
    document.querySelector('#time-label').textContent = `${stamp(time)} / ${stamp(total)}`;
  }
}
function loadCase(index, keepTime = false) {
  const savedTime = keepTime ? videos[0]?.currentTime || 0 : 0;
  revision += 1;
  pause();
  loading = false;
  playButton.disabled = false;
  selected = index;
  const item = cases[index];
  errorText.textContent = '';
  tabs.querySelectorAll('button').forEach((button, i) => {
    button.setAttribute('aria-selected', String(i === index));
    button.tabIndex = i === index ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', `case-tab-${index}`);
  document.querySelector('#case-title').textContent = item.title;
  document.querySelector('#case-description').textContent = item.description;
  document.querySelector('#case-prompt').textContent = item.prompt;
  const references = document.querySelector('#case-references');
  references.replaceChildren();
  references.hidden = !item.references?.length;
  (item.references || []).forEach(reference => {
    const figure = document.createElement('figure');
    const link = document.createElement('a');
    link.href = reference.image;
    link.target = '_blank';
    link.rel = 'noopener';
    link.title = 'Open reference image';
    const image = document.createElement('img');
    image.src = reference.image;
    image.alt = `${item.title}: ${reference.label}`;
    const caption = document.createElement('figcaption');
    caption.textContent = reference.label;
    link.append(image);
    figure.append(link, caption);
    references.append(figure);
  });
  const caseMethods = methods.filter(([key]) => item.videos[key]);
  grid.classList.toggle('two-methods', caseMethods.length === 2);
  const hasProxies = caseMethods.some(([key]) => item.videos[key].proxy);
  proxyToggle.closest('label').hidden = !hasProxies;
  proxyToggle.disabled = !hasProxies;
  if (!hasProxies) proxyToggle.checked = false;
  grid.replaceChildren();
  videos = caseMethods.map(([key, label]) => {
    const media = item.videos[key];
    const proxy = proxyToggle.checked && media.proxy;
    const article = document.createElement('article');
    article.className = `compare-card${key === 'harness' ? ' ours' : ''}`;
    const title = document.createElement('h4');
    title.textContent = label;
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = proxy || media.final;
    video.poster = proxy ? media.proxyPoster : media.poster;
    video.setAttribute('aria-label', `${label}: ${proxy ? '3D proxy' : 'generated video'}`);
    video.addEventListener('loadedmetadata', () => {
      if (savedTime) video.currentTime = Math.min(savedTime, video.duration - 0.05);
      updateTime();
    });
    video.addEventListener('error', () => {
      pause();
      errorText.textContent = 'This video could not be loaded. Open it directly using the link below.';
    });
    const link = document.createElement('a');
    link.className = 'video-label';
    link.style.display = 'block';
    link.href = video.src;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = proxy ? '3D proxy · open video' : 'Generated video · open video';
    article.append(title, video, link);
    grid.append(article);
    return video;
  });
  timeline.value = 0;
  document.querySelector('#time-label').textContent = '0:00 / 0:00';
  document.querySelector('#case-note').textContent = proxyToggle.checked ? 'Seedance uses direct generation. Available 3D proxies are shown for the Code2Video methods.' : 'Videos play from the same timestamp.';
  videos[0].addEventListener('timeupdate', updateTime);
  videos.forEach(video => video.addEventListener('ended', pause));
}
cases.forEach((item, i) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.id = `case-tab-${i}`;
  button.setAttribute('role', 'tab');
  button.setAttribute('aria-controls', 'case-panel');
  button.textContent = item.kicker;
  button.addEventListener('click', () => loadCase(i));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? cases.length - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + cases.length) % cases.length;
    loadCase(next);
    tabs.children[next].focus();
  });
  tabs.append(button);
});
playButton.addEventListener('click', async () => {
  if (playing) { pause(); return; }
  if (loading) return;
  const currentRevision = revision;
  const currentVideos = [...videos];
  loading = true;
  playButton.disabled = true;
  playButton.textContent = 'Loading…';
  errorText.textContent = '';
  const current = videos[0].currentTime >= duration() - 0.1 ? 0 : videos[0].currentTime;
  currentVideos.forEach(video => { video.currentTime = current; });
  const outcomes = await Promise.allSettled(currentVideos.map(video => video.play()));
  if (currentRevision !== revision) { currentVideos.forEach(video => video.pause()); return; }
  loading = false;
  playButton.disabled = false;
  if (outcomes.some(result => result.status === 'rejected')) {
    pause();
    errorText.textContent = 'Playback could not start. Please try again or open a video directly.';
    return;
  }
  playing = true;
  playButton.textContent = 'Pause all';
});
timeline.addEventListener('input', () => {
  const total = duration();
  if (!Number.isFinite(total)) return;
  videos.forEach(video => { video.currentTime = Number(timeline.value) / 1000 * total; });
  updateTime();
});
proxyToggle.addEventListener('change', () => loadCase(selected, true));
setInterval(() => {
  if (!playing || videos[0].seeking) return;
  const time = videos[0].currentTime;
  if (time >= duration() - 0.06) { pause(); return; }
  videos.slice(1).forEach(video => {
    if (!video.seeking && Math.abs(video.currentTime - time) > 0.25) video.currentTime = time;
  });
}, 400);
loadCase(0);

const heroVideos = [...document.querySelectorAll('.film video')];
const heroToggle = document.querySelector('#hero-toggle');
let heroPaused = matchMedia('(prefers-reduced-motion: reduce)').matches;
heroToggle.textContent = heroPaused ? 'Play previews' : 'Pause previews';
function playHero(video) {
  if (!video.src) video.src = video.dataset.src;
  video.play().catch(() => {
    heroPaused = true;
    heroVideos.forEach(item => item.pause());
    heroToggle.textContent = 'Play previews';
  });
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(({target, isIntersecting}) => {
    target.dataset.visible = isIntersecting ? 'true' : 'false';
    if (isIntersecting && !heroPaused) playHero(target); else target.pause();
  });
}, {threshold:0.2});
heroVideos.forEach(video => observer.observe(video));
heroToggle.addEventListener('click', () => {
  heroPaused = !heroPaused;
  heroToggle.textContent = heroPaused ? 'Play previews' : 'Pause previews';
  heroVideos.forEach(video => {
    if (!heroPaused && video.dataset.visible === 'true') playHero(video); else video.pause();
  });
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { pause(); heroVideos.forEach(video => video.pause()); }
  else if (!heroPaused) heroVideos.filter(video => video.dataset.visible === 'true').forEach(playHero);
});
const dialog = document.querySelector('#figure-dialog');
document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
  dialog.querySelector('img').src = button.dataset.zoom;
  dialog.querySelector('img').alt = button.querySelector('img').alt;
  dialog.showModal();
}));
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelector('#copy-citation').addEventListener('click', async event => {
  const text = document.querySelector('#bibtex').textContent;
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      event.target.textContent = 'Copied';
      return;
    } catch (error) {
      document.querySelector('#copy-status').textContent = 'Select and copy the citation below.';
    }
  }
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(document.querySelector('#bibtex'));
  selection.removeAllRanges();
  selection.addRange(range);
});
