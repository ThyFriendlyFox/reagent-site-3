<script lang="ts">
  import '../app.css';
  import BackgroundSlideshow from '$lib/components/BackgroundSlideshow.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  const currentYear: number = new Date().getFullYear();
  const BASE_URL = 'https://firstcoastalarm.com';

  let headerEl: HTMLElement | null = null;
  let brandEl: HTMLElement | null = null;

  function updateHexPosition() {
    if (!headerEl || !brandEl) return;
    const headerRect = headerEl.getBoundingClientRect();
    const brandRect = brandEl.getBoundingClientRect();
    const centerX = brandRect.left + brandRect.width / 2 - headerRect.left;
    const centerY = brandRect.top + brandRect.height / 2 - headerRect.top;
    headerEl.style.setProperty('--hex-x', `${centerX}px`);
    headerEl.style.setProperty('--hex-y', `${centerY}px`);
  }

  onMount(() => {
    updateHexPosition();
    const onResize = () => updateHexPosition();
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(() => updateHexPosition());
    if (brandEl) ro.observe(brandEl);
    if (headerEl) ro.observe(headerEl);
    return () => {
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  });

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'First Coast Alarm',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '5452 Downington Dr',
      addressLocality: 'Jacksonville',
      addressRegion: 'FL',
      postalCode: '32257',
      addressCountry: 'US'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@firstcoastalarm.com'
    },
    sameAs: []
  } as const;

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'First Coast Alarm',
    url: BASE_URL
  } as const;

  const navigationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'SiteNavigationElement',
        name: 'Home',
        url: `${BASE_URL}/`
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Residential',
        url: `${BASE_URL}/residential`
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Commercial',
        url: `${BASE_URL}/commercial`
      }
    ]
  } as const;
</script>

<svelte:head>
  <title>First Coast Alarm | Jacksonville Security, Alarm & Fire Systems</title>
  <meta name="description" content="First Coast Alarm provides professional security, alarm, and fire systems for residential and commercial properties across Northeast Florida." />
  <link rel="canonical" href={`${BASE_URL}${$page.url.pathname}`} />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="First Coast Alarm" />
  <meta property="og:title" content="First Coast Alarm | Jacksonville Security, Alarm & Fire Systems" />
  <meta property="og:description" content="Professional security, alarm, and fire systems for homes and businesses across Northeast Florida." />
  <meta property="og:url" content={`${BASE_URL}${$page.url.pathname}`} />
  <meta property="og:image" content={`${BASE_URL}/file.svg`} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="First Coast Alarm | Jacksonville Security, Alarm & Fire Systems" />
  <meta name="twitter:description" content="Professional security, alarm, and fire systems for homes and businesses across Northeast Florida." />
  <meta name="twitter:image" content={`${BASE_URL}/file.svg`} />

  <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
  <script type="application/ld+json">{JSON.stringify(websiteJsonLd)}</script>
  <script type="application/ld+json">{JSON.stringify(navigationJsonLd)}</script>
</svelte:head>

<BackgroundSlideshow />

<nav class="site-header" bind:this={headerEl}>
  <div class="wrap compact">
    <a class="nav-link" href="/residential">research</a>
    <a class="brand" href="/" aria-label="First Coast Alarm home" bind:this={brandEl}>
      <img src="/logo.svg" alt="First Coast Alarm" class="brand-logo" decoding="async" fetchpriority="high" />
    </a>
    <a class="nav-link" href="/commercial">solutions</a>
  </div>
</nav>

<main class="site-main">
  <slot />
</main>

<footer class="site-footer">
  <div class="wrap compact footer-grid">
    <div class="footer-col">
      <div class="footer-brand">Reagent Systems LLC</div>
      <div class="muted">Tampa, Florida</div>
      <address class="muted">
        10523 Bermuda Isle Dr<br />
        Tampa, FL 33647
      </address>
    </div>
    <div class="footer-col">
      <div class="footer-heading">Links</div>
      <a href="/research" class="footer-link">Research</a>
      <a href="/solutions" class="footer-link">Solutions</a>
      <a href="/contracting" class="footer-link">Contracting</a>
      <a href="/federal" class="footer-link">Federal</a>
      <a href="/support" class="footer-link">Support</a>
      <a href="/" class="footer-link">Home</a>
    </div>
    <div class="footer-col">
      <div class="footer-heading">Contact</div>
      <div class="muted">support@reagent-systems.com</div>
    </div>
  </div>
  <div class="wrap compact copy">© {currentYear} Reagent Systems LLC. All rights reserved.</div>
</footer>

<style>
  .wrap { max-width: var(--container); margin: 0 auto; padding: 0 var(--pad); }
  .wrap.compact { padding-left: 0.75rem; padding-right: 0.75rem; }

  .site-header {
    position: sticky; top: 0; z-index: 50;
    background: var(--gray-700); /* remove transparency */
    border-bottom: 0.0625rem solid rgba(255,255,255,0.08);
    backdrop-filter: blur(0.5rem);
    /* corner size variable for the triangle */
    --corner: 2.75rem;
    /* minimum gutter from viewport edges for nav links at narrower widths */
    --nav-edge-min: 2.5rem;
    /* dynamic hex coordinates (center of brand) */
    --hex-x: 50%;
    --hex-y: 50%;
    /* vertical offset for hexagon relative to brand center (negative moves up) */
    --hex-offset-y: -1.25rem;
  }
  /* top-right corner triangle */
  .site-header::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: var(--corner);
    height: var(--corner);
    background: var(--red-600);
    /* Cut to a right triangle with equal legs on the top and right edges */
    clip-path: polygon(100% 0, 100% 100%, 0 0);
    pointer-events: none;
    z-index: 60;
  }
  .site-header .wrap {
    position: relative; /* ensure header content sits above ::before hex */
    z-index: 1;
    height: var(--header-h);
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 0.5rem;
  }
  .nav-link {
    color: var(--white);
    opacity: 0.9;
    font-weight: 100;
    letter-spacing: 0.05em;
    font-size: 1.5rem;
    position: relative;
    top: -1.75rem; /* nudge links down to visually align with larger logo */
    display: inline-block; /* enable transforms without affecting layout */
    transform-origin: center;
    transition: transform 180ms ease, color 150ms ease, opacity 150ms ease;
  }
  .nav-link:hover, .nav-link:focus-visible { opacity: 1; color: var(--red-600); transform: scale(1.07); }
  .nav-link:first-child { justify-self: start; }
  .nav-link:last-child { justify-self: end; }

  .brand { display: inline-flex; align-items: center; justify-content: center; }
  .brand { position: relative; z-index: 55; }
  /* Make the logo larger than the header to bleed out of the bar */
  .brand-logo {
    height: 7.5rem; /* header is 4rem */
    width: auto;
    display: block;
    transform: translateY(0.5rem); /* bias slightly upward */
    transform-origin: center;
    transition: transform 200ms ease;
    will-change: transform;
  }
  .brand:hover .brand-logo { transform: translateY(0.5rem) scale(1.1); }

  /* Paint triangle at header background layer positioned by brand center */
  .site-header::before {
    content: "";
    position: absolute;
    top: calc(var(--hex-y) + var(--hex-offset-y));
    left: var(--hex-x);
    transform: translate(-50%, -47.5%);
    width: 14rem;
    height: 12rem;
    background: var(--gray-700);
    /* Downward-pointing triangle */
    clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
    z-index: 0; /* same layer as header background */
    pointer-events: none;
    border: 1px solid rgba(255,255,255,0.06);
  }

  .site-main { min-height: calc(100vh - var(--header-h) - 10.5rem); position: relative; z-index: 1; }

  .site-footer { background: var(--gray-700); border-top: 0.0625rem solid rgba(255,255,255,0.08); margin-top: 0; position: relative; z-index: 1; }
  .site-footer .wrap { padding: 0.75rem var(--pad); }

  .footer-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 0.75rem; align-items: start; }
  .footer-brand { font-size: 1rem; font-weight: 100; margin-bottom: 0.25rem; }
  .footer-heading { font-weight: 100; margin-bottom: 0.25rem; color: var(--white); font-size: 0.95rem; }
  .footer-link { display: block; color: var(--gray-400); margin: 0.25rem 0; font-size: 0.95rem; }
  .footer-link:hover { color: var(--red-600); }
  .muted { color: var(--gray-400); font-size: 0.95rem; }
  .copy { padding: 0.5rem var(--pad) 0.75rem; color: var(--gray-400); border-top: 0.0625rem solid rgba(255,255,255,0.07); font-size: 0.9rem; }

  /* At <=1280px, pull the nav links inward and keep a minimum distance from screen edges */
  @media (max-width: 80rem) {
    .site-header .wrap {
      grid-template-columns: 1fr auto 1fr;
    }
    .site-header .wrap.compact { padding-left: var(--nav-edge-min); padding-right: var(--nav-edge-min); }
  }

  @media (max-width: 51.25rem) {
    .site-header .wrap { height: 4rem; }
    .brand-logo { height: 7.5rem; transform: translateY(0.5rem); }
    .footer-grid { grid-template-columns: 1fr; gap: 0.5rem; }
    .site-header { --corner: 2rem; }
    .nav-link { top: -1.75rem; }
  }
</style>
