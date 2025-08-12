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
  <title>First Coast Alarm | Security, Alarm & Fire Protection in Jacksonville</title>
  <meta name="description" content="Security, alarm, camera, and fire protection systems for residential and commercial properties across Northeast Florida. Design, installation, and monitoring." />
  <link rel="canonical" href="https://firstcoastalarm.com/" />
  <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
</svelte:head>

