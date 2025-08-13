<script lang="ts">
  const BASE_URL = 'https://www.reagent-systems.com';
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${BASE_URL}/`
      }
    ]
  } as const;
</script>

<svelte:head>
  <title>Reagent Systems LLC | Security, Alarm & Fire Protection in Jacksonville</title>
  <meta name="description" content="Security, alarm, camera, and fire protection systems for residential and commercial properties across Northeast Florida. Design, installation, and monitoring." />
  <link rel="canonical" href="https://www.reagent-systems.com/" />
  <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
</svelte:head>

<section class="hero-headline" aria-label="Primary message">
  <div class="inner">
    <div class="kicker">ai research</div>
    <h1 class="display">
      <span class="line">open source</span>
      <span class="line">privacy focused</span>
    </h1>
  </div>
  
</section>

<style>
  .hero-headline {
    position: relative;
    z-index: 2;
    display: block;
    --hero-left-pad: 1.25rem;
    padding: 24rem 0 2.5rem var(--hero-left-pad);
    text-align: left;
    color: #0b1e3a; /* navy */
    --kicker-inset: 0.35rem;
  }
  .hero-headline .inner {
    max-width: none;
    width: 100%;
    margin: 0;
  }
  .kicker {
    color: currentColor;
    font-size: 0.95rem;
    letter-spacing: 0.22em;
    font-weight: 100;
    margin-bottom: 0.25rem;
    margin-left: 0;
    padding-left: var(--kicker-inset);
  }
  .display {
    margin: 0.25rem 0 0;
    line-height: 1.05;
    letter-spacing: -0.01em;
    font-weight: 200;
    font-size: clamp(2.25rem, 7vw, 6rem);
    margin-left: 0;
    padding-left: 0;
  }
  .display .line { display: block; }

  @media (max-width: 51.25rem) {
    .hero-headline { padding: 16rem 0 2rem var(--hero-left-pad); }
    .kicker { font-size: 0.9rem; letter-spacing: 0.2em; }
    .display { font-size: clamp(2rem, 9vw, 3.25rem); }
  }
</style>

