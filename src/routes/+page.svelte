<script lang="ts">
  import AgentsSection from '$lib/components/AgentsSection.svelte';
  import TeamSection from '$lib/components/TeamSection.svelte';
  import VisionSection from '$lib/components/VisionSection.svelte';
  import ResearchSection from '$lib/components/ResearchSection.svelte';
  import ProductsSection from '$lib/components/ProductsSection.svelte';
  import VolunteerSection from '$lib/components/VolunteerSection.svelte';
  import DonateSection from '$lib/components/DonateSection.svelte';
  import SectionRibbon from '$lib/components/SectionRibbon.svelte';
  import NewsletterNotification from '$lib/components/NewsletterNotification.svelte';
  import GitHubProjectsCarousel from '$lib/components/GitHubProjectsCarousel.svelte';
  
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

<!-- Hero Section - GitHub Projects Carousel -->
<section class="hero-section">
  <GitHubProjectsCarousel />
</section>

<!-- All Sections -->
<AgentsSection />
<SectionRibbon ribbonIndex={1} />
<TeamSection />
<SectionRibbon ribbonIndex={2} />
<VisionSection />
<SectionRibbon ribbonIndex={3} />
<ResearchSection />
<SectionRibbon ribbonIndex={4} />
<ProductsSection />
<SectionRibbon ribbonIndex={5} />
<VolunteerSection />
<SectionRibbon ribbonIndex={6} />
<DonateSection />

<!-- Newsletter Notification -->
<NewsletterNotification />

<style>
  .hero-section {
    position: relative;
    z-index: 2;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
</style>

