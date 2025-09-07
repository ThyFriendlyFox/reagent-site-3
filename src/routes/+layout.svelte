<script lang="ts">
  import '../app.css';
  import BackgroundSlideshow from '$lib/components/BackgroundSlideshow.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const currentYear: number = new Date().getFullYear();
  const BASE_URL = 'https://www.reagent-systems.com';

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
    name: 'Reagent Systems LLC',
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
      email: 'support@reagent-systems.com'
    },
    sameAs: []
  } as const;

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Reagent Systems LLC',
    url: BASE_URL
  } as const;

  const navigationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      { '@type': 'SiteNavigationElement', name: 'research', url: `${BASE_URL}/research` },
      { '@type': 'SiteNavigationElement', name: 'products', url: `${BASE_URL}/products` },
      { '@type': 'SiteNavigationElement', name: 'agents', url: `${BASE_URL}/agents` },
      { '@type': 'SiteNavigationElement', name: 'vision', url: `${BASE_URL}/vision` },
      { '@type': 'SiteNavigationElement', name: 'volunteer', url: `${BASE_URL}/volunteer` },
      { '@type': 'SiteNavigationElement', name: 'donate', url: `${BASE_URL}/donate` }
    ]
  } as const;
</script>

<svelte:head>
  <title>Reagent Systems LLC | Researching Sentient Computing</title>
  <meta name="description" content="Reagent Systems LLC pushes the boundaries of research into sentient computing." />
  <link rel="canonical" href={`${BASE_URL}${$page.url.pathname}`} />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Reagent Systems LLC" />
  <meta property="og:title" content="Reagent Systems LLC | AI Research, Agentic Apps" />
  <meta property="og:description" content="Pushing the boundaries of research into sentient computing." />
  <meta property="og:url" content={`${BASE_URL}${$page.url.pathname}`} />
  <meta property="og:image" content={`${BASE_URL}/logo.svg`} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Reagent Systems LLC | AI Research, Agentic Apps" />
  <meta name="twitter:description" content="Pushing the boundaries of research into sentient computing." />
  <meta name="twitter:image" content={`${BASE_URL}/logo.svg`} />

  <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
  <script type="application/ld+json">{JSON.stringify(websiteJsonLd)}</script>
  <script type="application/ld+json">{JSON.stringify(navigationJsonLd)}</script>
</svelte:head>

<BackgroundSlideshow />

<nav class="site-header" bind:this={headerEl}>
  <div class="wrap compact">
    <a class="nav-link" href="#research" on:click={() => scrollToSection('research')}>research</a>
    <a class="brand" href="/" aria-label="Reagent Systems LLC home" bind:this={brandEl}>
      <img src="/logo.svg" alt="Reagent Systems LLC" class="brand-logo" decoding="async" fetchpriority="high" />
    </a>
    <a class="nav-link" href="#products" on:click={() => scrollToSection('products')}>products</a>
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
      <div class="footer-heading">links</div>
      <a href="#research" class="footer-link" on:click={() => scrollToSection('research')}>research</a>
      <a href="#products" class="footer-link" on:click={() => scrollToSection('products')}>products</a>
      <a href="#agents" class="footer-link" on:click={() => scrollToSection('agents')}>agents</a>
      <a href="#vision" class="footer-link" on:click={() => scrollToSection('vision')}>vision</a>
      <a href="#volunteer" class="footer-link" on:click={() => scrollToSection('volunteer')}>volunteer</a>
      <a href="#donate" class="footer-link" on:click={() => scrollToSection('donate')}>donate</a>
    </div>
    <div class="footer-col">
      <div class="footer-heading">contact</div>
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
    /* independent sizing controls */
    --logo-scale-x: 1;
    --logo-scale-y: 0.9;
    --hex-width: 16rem;
    --hex-height: 12rem;
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
    transform: translateY(0.5rem) scaleX(var(--logo-scale-x)) scaleY(var(--logo-scale-y)); /* bias slightly upward with independent scaling */
    transform-origin: center;
    transition: transform 200ms ease;
    will-change: transform;
  }
  .brand:hover .brand-logo { transform: translateY(0.5rem) scaleX(calc(var(--logo-scale-x) * 1.1)) scaleY(calc(var(--logo-scale-y) * 1.1)); }

  /* Paint triangle at header background layer positioned by brand center */
  .site-header::before {
    content: "";
    position: absolute;
    top: calc(var(--hex-y) + var(--hex-offset-y));
    left: var(--hex-x);
    transform: translate(-50%, -47.5%);
    width: var(--hex-width);
    height: var(--hex-height);
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
    .brand-logo { height: 7.5rem; transform: translateY(0.5rem) scaleX(var(--logo-scale-x)) scaleY(var(--logo-scale-y)); }
    .footer-grid { grid-template-columns: 1fr; gap: 0.5rem; }
    .site-header {
      --corner: 2rem;
      /* downflow sizes for mobile */
      --logo-scale-x: 1;
      --logo-scale-y: 0.9;
      --hex-width: 16rem;
      --hex-height: 12rem;
    }
    .nav-link { top: -1.75rem; }
  }
</style>
