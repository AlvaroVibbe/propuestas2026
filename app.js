const categories = [
  { id: 'cumplida', label: 'Cumplida', compact: 'CUMPLIDA', definition: 'La propuesta o promesa se ejecutó en el plazo previsto.', icon: 'check' },
  { id: 'incumplida', label: 'Incumplida', compact: 'INCUMPLIDA', definition: 'A la fecha de la evaluación no se avanzó en la propuesta o promesa, o los resultados muestran que la situación tuvo un retroceso.', icon: 'cross' },
  { id: 'demorada', label: 'En proceso, demorada', compact: 'EN PROCESO, DEMORADA', definition: 'Se avanzó poco en las acciones necesarias para cumplir con el compromiso o promesa y todavía podría lograrse en lo que queda del período de mandato.', icon: 'clock' },
  { id: 'adelantada', label: 'En proceso, adelantada', compact: 'EN PROCESO, ADELANTADA', definition: 'Se ejecutaron acciones y tareas necesarias para lograr la propuesta o promesa en un menor tiempo, aunque todavía no está cumplida.', icon: 'arrow' }
];

const icon = (name) => {
  const paths = {
    check: '<path d="m5 12 4 4L19 6"/>',
    cross: '<path d="m6 6 12 12M18 6 6 18"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
};
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const labelFor = (id) => categories.find((category) => category.id === id);

const definitions = document.querySelector('#definitions-grid');
definitions.innerHTML = categories.map((category) => `<article class="definition-card status-${category.id}"><div class="definition-head"><span class="status-icon">${icon(category.icon)}</span><h3>${category.label}</h3></div><p>${category.definition}</p></article>`).join('');

const list = document.querySelector('#verification-list');
const filterBar = document.querySelector('#filter-bar');
const emptySummary = document.querySelector('#empty-summary');
const emptyList = document.querySelector('#empty-list');
const resultsCount = document.querySelector('#results-count');
let entries = [];
let activeFilter = 'all';

function card(item) {
  const category = labelFor(item.status);
  const image = item.coverImage ? `<img src="${esc(item.coverImage)}" alt="${esc(item.coverAlt || '')}" loading="lazy">` : `<div class="card-image-placeholder" aria-hidden="true"><span>CHEQUEA<br>LA PROMESA</span></div>`;
  const date = item.date ? `<time datetime="${esc(item.date)}">${esc(item.date)}</time>` : '';
  return `<article class="verification-card status-${category.id}"><a class="card-image" href="/verificaciones/${esc(item.id)}/" tabindex="-1" aria-hidden="true">${image}</a><div class="card-content"><span class="status-pill">${icon(category.icon)}<span>${category.label}</span></span><h3><a href="/verificaciones/${esc(item.id)}/">${esc(item.title)}</a></h3><div class="card-meta">${date}<a class="card-read" href="/verificaciones/${esc(item.id)}/">Leer verificación <span aria-hidden="true">↗</span></a></div></div></article>`;
}

function render() {
  const published = entries.filter((item) => item.published && item.title?.trim() && labelFor(item.status));
  const counts = Object.fromEntries(categories.map((category) => [category.id, published.filter((item) => item.status === category.id).length]));
  document.querySelector('#stats-grid').innerHTML = categories.map((category) => `<article class="stat-card status-${category.id}"><div class="stat-label"><span class="status-icon">${icon(category.icon)}</span><span>${category.label}</span></div><strong>${counts[category.id]}</strong><span class="stat-caption">${counts[category.id] === 1 ? 'verificación' : 'verificaciones'}</span></article>`).join('');
  document.querySelector('#published-total').textContent = `${published.length} ${published.length === 1 ? 'publicada' : 'publicadas'}`;
  emptySummary.hidden = published.length !== 0;

  for (const category of categories) {
    if (filterBar.querySelector(`[data-filter="${category.id}"]`)) continue;
    const button = document.createElement('button');
    button.className = `filter-button status-${category.id}`;
    button.type = 'button';
    button.dataset.filter = category.id;
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `<span class="status-icon">${icon(category.icon)}</span><span>${category.compact}</span><span class="filter-count" data-count="${category.id}">0</span>`;
    filterBar.append(button);
  }
  filterBar.querySelector('[data-count="all"]').textContent = String(published.length);
  for (const category of categories) filterBar.querySelector(`[data-count="${category.id}"]`).textContent = String(counts[category.id]);
  filterBar.querySelectorAll('.filter-button').forEach((button) => {
    const selected = button.dataset.filter === activeFilter;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const shown = activeFilter === 'all' ? published : published.filter((item) => item.status === activeFilter);
  list.innerHTML = shown.map(card).join('');
  emptyList.hidden = shown.length !== 0;
  emptyList.querySelector('h3').textContent = published.length === 0 ? 'Aún no hay verificaciones publicadas' : 'No hay verificaciones en esta categoría';
  emptyList.querySelector('p').textContent = published.length === 0 ? 'El listado se actualizará cuando la redacción incorpore los artículos y su evaluación.' : 'Prueba otra categoría o vuelve a todas las verificaciones.';
  resultsCount.textContent = `${shown.length} ${shown.length === 1 ? 'resultado' : 'resultados'}`;
}

filterBar.addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  activeFilter = button.dataset.filter;
  render();
});

fetch('/data/verifications.json').then((response) => {
  if (!response.ok) throw new Error('No se pudo cargar el contenido');
  return response.json();
}).then((data) => { entries = data; render(); }).catch(() => {
  emptySummary.hidden = false;
  document.querySelector('#stats-grid').innerHTML = '';
  emptySummary.textContent = 'No se pudo cargar el contenido. Comprueba que el sitio se sirve desde un servidor local.';
});
