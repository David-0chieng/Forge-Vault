import './style.css';
import { get, post } from './lib/api.js';
import { cartCount, onCartChange } from './lib/cart.js';
import { esc } from './lib/format.js';
import { applySiteImages, hydrateStaticImages, imageTag, installImageFallback } from './lib/images.js';
import { loadSession } from './lib/auth.js';
import { initHeader, initSliders, initSmoothScroll, paintAccountState, updateCartBadge } from './lib/ui.js';
import { mountChrome } from './partials.js';

/* =========================================================================
   Forge Vault — storefront (index / about / contact)
   Every block below no-ops when its markup is absent, so one bundle serves
   all three pages.
   ========================================================================= */

installImageFallback();

const CAR_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12" aria-hidden="true"><path d="M5 17h14M3 13l1.6-4.5A3 3 0 0 1 7.4 6.5h9.2a3 3 0 0 1 2.8 2L21 13v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="13.5" r="1"/><circle cx="16.5" cy="13.5" r="1"/></svg>`;

/* -------------------------------------------------------------------------
   Hero — search bar and the floating "buyer request" card marquee
   ---------------------------------------------------------------------- */

function initHeroSearch() {
  const form = document.querySelector('[data-hero-search]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = form.elements.q.value.trim();
    location.href = value ? `/products.html?q=${encodeURIComponent(value)}` : '/products.html';
  });
}

// Illustrative sample requests — not real orders, just showing how sourcing
// flows through the marketplace. Cloned from the design concept.
const HERO_CARDS = [
  { kind: 'buyer', meta: 'BUYER · LAGOS, NG', body: 'Need a rear bumper for a 2019 Range Rover Sport HSE. Budget around $450.' },
  { kind: 'matched', meta: 'FORGE VAULT · MATCHED', body: '6 verified suppliers found across Germany, Japan &amp; the UAE. Best price <strong>$310</strong>, ships in 4 days.' },
  { kind: 'buyer', meta: 'BUYER · NAIROBI, KE', body: 'Looking for a genuine timing chain kit for a 2015 Honda Civic.' },
  { kind: 'matched', meta: 'FORGE VAULT · MATCHED', body: 'Nippon Direct has it in stock — genuine OEM, <strong>$150</strong>, delivered in 6 days.' },
  { kind: 'buyer', meta: 'BUYER · DUBAI, AE', body: 'Front suspension strut for a Nissan Patrol — needs to arrive this week.' },
  { kind: 'progress', meta: 'FORGE VAULT · IN PROGRESS', body: 'Payment protected. Freight booked — your tracking is on the way.' },
];

const heroCard = ({ kind, meta, body }) => `
  <div class="max-w-[430px] rounded-[18px] border p-5 shadow-panel ${
    kind === 'matched'
      ? 'border-moto-accent/40 bg-moto-accent/10'
      : `border-moto-line-2 bg-moto-panel/90 backdrop-blur ${kind === 'progress' ? 'opacity-70' : ''}`
  }">
    <div class="flex items-center gap-2 text-xs tracking-widest2 ${kind === 'matched' ? 'text-moto-accent' : 'text-moto-outline'}">
      <span class="h-1.5 w-1.5 rounded-full ${kind === 'matched' ? 'bg-moto-accent' : 'bg-moto-outline'}"></span>
      ${meta}
    </div>
    <div class="mt-2.5 text-[15px] leading-relaxed text-moto-ink">${body}</div>
  </div>`;

function initHeroCards() {
  const mounts = document.querySelectorAll('[data-hero-cards]');
  if (!mounts.length) return;

  const html = HERO_CARDS.map(heroCard).join('');
  mounts.forEach((mount) => {
    mount.innerHTML = html;
  });
}

/* -------------------------------------------------------------------------
   Category tiles — real catalogue data, styled as the design concept's
   image tiles (no card border, bottom-left label over a gradient).
   ---------------------------------------------------------------------- */

const categoryTile = (category, index) => `
  <a href="/products.html?category=${encodeURIComponent(category.slug)}"
     class="group relative block h-[220px] overflow-hidden rounded-[18px] transition duration-200 hover:-translate-y-0.5 sm:h-[290px]">
    <div class="ph ph-${(index % 4) + 1} absolute inset-0 rounded-none">
      <span class="ph-icon">${CAR_ICON}</span>
      ${imageTag(category.imagePath, {
        alt: `${esc(category.name)} parts`,
        className: 'absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]',
      })}
    </div>
    <div class="absolute inset-0 bg-gradient-to-t from-moto-bg via-moto-bg/10 to-transparent opacity-90"></div>
    <span class="absolute bottom-5 left-5 font-display text-lg font-semibold text-moto-ink">${esc(category.name)}</span>
  </a>`;

const skeleton = (count, height) =>
  Array.from({ length: count }, () => `<div class="rounded-[18px] ${height} animate-pulse bg-moto-high/60"></div>`).join('');

const errorState = (message) => `
  <div class="col-span-full rounded-[18px] border border-amber-500/40 bg-amber-500/10 p-6 text-center">
    <p class="text-sm font-semibold text-amber-300">${esc(message)}</p>
    <button type="button" data-retry class="link-all mt-2">Try again</button>
  </div>`;

async function fillGrid(mount, fetcher, template, { skeletonHeight = 'h-80', empty = 'Nothing here yet.' } = {}) {
  if (!mount) return;

  const columns = Number(mount.dataset.count ?? 6);
  mount.innerHTML = skeleton(columns, skeletonHeight);

  try {
    const items = await fetcher();

    mount.innerHTML = items.length
      ? items.map(template).join('')
      : `<p class="col-span-full py-8 text-center text-sm text-moto-outline">${esc(empty)}</p>`;
  } catch (error) {
    mount.innerHTML = errorState(
      error.status === 0
        ? 'We could not load these parts — check your connection.'
        : 'We could not load these parts right now.',
    );

    mount.querySelector('[data-retry]')?.addEventListener('click', () => {
      fillGrid(mount, fetcher, template, { skeletonHeight, empty });
    });
  }
}

function renderGrids() {
  fillGrid(
    document.querySelector('[data-grid="categories"]'),
    // tiles=1 → the categories that have artwork.
    async () => (await get('/api/categories?tiles=1')).categories,
    categoryTile,
    { skeletonHeight: 'h-[220px] sm:h-[290px]' },
  );
}

/* -------------------------------------------------------------------------
   Contact form — live character counters and client-side validation.
   Spam protection is server-side (rate limit + honeypot), so there is no
   challenge widget to wait on and the submit button is enabled from the start.
   ---------------------------------------------------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function paintCharCounters(form) {
  form.querySelectorAll('[data-counter-for]').forEach((counter) => {
    const field = form.elements[counter.dataset.counterFor];
    if (field) counter.textContent = `${field.value.length}/${field.getAttribute('maxlength')}`;
  });
}

function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('[data-submit]');
  const submitLabel = form.querySelector('[data-submit-label]');

  form.querySelectorAll('[data-counter-for]').forEach((counter) => {
    form.elements[counter.dataset.counterFor]?.addEventListener('input', () => paintCharCounters(form));
  });
  paintCharCounters(form);

  const showError = (name, message) => {
    const field = form.elements[name];
    const slot = form.querySelector(`[data-error-for="${name}"]`);
    if (!field || !slot) return;

    field.setAttribute('aria-invalid', String(Boolean(message)));
    slot.dataset.visible = String(Boolean(message));
    slot.textContent = message ?? '';
  };

  const validate = () => {
    const errors = {};
    const read = (name) => String(form.elements[name]?.value ?? '').trim();

    if (!read('name')) errors.name = 'Please enter your name.';
    if (!read('email')) errors.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(read('email'))) errors.email = 'Enter a valid email address.';
    if (!read('subject')) errors.subject = 'Please enter a subject.';
    if (!read('message')) errors.message = 'Please enter a message.';

    ['name', 'email', 'subject', 'message'].forEach((name) => showError(name, errors[name]));
    return errors;
  };

  ['name', 'email', 'subject', 'message'].forEach((name) => {
    form.elements[name]?.addEventListener('blur', validate);
  });

  const setStatus = (tone, message) => {
    status.textContent = message;
    status.className =
      tone === 'success'
        ? 'mt-4 rounded-lg border border-moto-line bg-moto-high px-4 py-3 text-sm font-medium text-moto-accent-soft'
        : tone === 'error'
          ? 'mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300'
          : 'sr-only';
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('idle', '');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setStatus('error', 'Please correct the highlighted fields and try again.');
      form.elements[Object.keys(errors)[0]]?.focus();
      return;
    }

    submit.disabled = true;
    submitLabel.textContent = 'Sending…';

    try {
      const result = await post('/api/contact', {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        subject: form.elements.subject.value.trim(),
        location: form.elements.location.value,
        message: form.elements.message.value.trim(),
        // Honeypot — always empty for a real person.
        website: form.elements.website?.value ?? '',
      });

      form.reset();
      paintCharCounters(form);
      setStatus('success', result.message ?? 'Thanks — your message has been sent.');
    } catch (error) {
      setStatus('error', error.message);
    } finally {
      submit.disabled = false;
      submitLabel.textContent = 'Send message';
    }
  });
}

/* -------------------------------------------------------------------------
   Boot
   ---------------------------------------------------------------------- */

function boot() {
  mountChrome(); // must run before initHeader — it creates the nav it wires up
  hydrateStaticImages();
  applySiteImages(get); // hero + partner artwork, from the database
  initHeader();
  initSliders();
  initSmoothScroll();
  initHeroSearch();
  initHeroCards();
  initContactForm();
  renderGrids();

  updateCartBadge(cartCount());
  onCartChange(() => updateCartBadge(cartCount()));

  // Swap the header "Sign in" for the Profile menu once the session resolves —
  // home/about/contact need this too, not just the shop pages.
  paintAccountState(loadSession);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
