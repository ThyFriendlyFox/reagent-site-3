<script lang="ts">
  import AgentsSection from '$lib/components/AgentsSection.svelte';
  import VisionSection from '$lib/components/VisionSection.svelte';
  import ResearchSection from '$lib/components/ResearchSection.svelte';
  import ProductsSection from '$lib/components/ProductsSection.svelte';
  import VolunteerSection from '$lib/components/VolunteerSection.svelte';
  import DonateSection from '$lib/components/DonateSection.svelte';
  import SectionRibbon from '$lib/components/SectionRibbon.svelte';
  import NewsletterNotification from '$lib/components/NewsletterNotification.svelte';
  
  const BASE_URL = 'https://www.reagent-systems.com';
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'home',
        item: `${BASE_URL}/`
      }
    ]
  } as const;
</script>

<svelte:head>
  <title>Reagent Systems LLC | AI Research, Agentic Apps</title>
  <meta name="description" content="Pushing the boundaries of research into sentient computing." />
  <link rel="canonical" href="https://www.reagent-systems.com/" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Reagent Systems LLC" />
  <meta property="og:title" content="Reagent Systems LLC | AI Research, Agentic Apps" />
  <meta property="og:description" content="Pushing the boundaries of research into sentient computing." />
  <meta property="og:url" content="https://www.reagent-systems.com/" />
  <meta property="og:image" content="https://www.reagent-systems.com/logo.svg" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Reagent Systems LLC | AI Research, Agentic Apps" />
  <meta name="twitter:description" content="Pushing the boundaries of research into sentient computing." />
  <meta name="twitter:image" content="https://www.reagent-systems.com/logo.svg" />
  <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
</svelte:head>

<!-- Hero Section -->
<section class="hero-headline" aria-label="Primary message">
  <div class="inner">
    <!-- <div class="kicker"></div> -->
    <h1 class="display">
      <span class="line">open source</span>
      <span class="line">sentient computers</span>
    </h1>
  </div>
</section>

<!-- All Sections -->
<SectionRibbon ribbonIndex={0} />
<AgentsSection />
<SectionRibbon ribbonIndex={1} />
<VisionSection />
<SectionRibbon ribbonIndex={2} />
<ResearchSection />
<SectionRibbon ribbonIndex={3} />
<ProductsSection />
<SectionRibbon ribbonIndex={4} />
<VolunteerSection />
<SectionRibbon ribbonIndex={5} />
<DonateSection />

<!-- Newsletter Notification -->
<NewsletterNotification />

<style>
  .hero-headline {
    position: relative;
    z-index: 2;
    display: block;
    --hero-left-pad: 1.25rem;
    padding: 30rem 0 2.5rem var(--hero-left-pad);
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
    .hero-headline { padding: 30rem 0 2rem var(--hero-left-pad); }
    .kicker { font-size: 0.9rem; letter-spacing: 0.2em; }
    .display { font-size: clamp(2rem, 9vw, 3.25rem); }
  }
</style>

