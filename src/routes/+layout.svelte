<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import 'liquid-css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
  <link rel="preload" href="/fonts/AvionicWide-Book.otf" as="font" type="font/otf" crossorigin="anonymous">
</svelte:head>

<header class="site-header" aria-label="Site header">
  <div class="header-inner">
    <nav class="nav nav-left" aria-label="Primary left">
      <a href="/research" class="nav-link">research</a>
    </nav>

    <div class="logo-wrap">
      <div class="hex" aria-hidden="true">
        <svg class="hex-svg" viewBox="0 0 100 120" preserveAspectRatio="none" focusable="false">
          <!-- Downward-pointing triangle (edge-to-edge). Increase .hex-svg width to make it wider. -->
          <polygon points="0,12 100,12 50,110" fill="none" />
        </svg>
      </div>
      <!-- Centered logo that overhangs the header height -->
      <a href="/" class="logo-link" aria-label="Home">
        <img class="logo" src="/logo.svg" alt="Site logo" />
      </a>
    </div>

    <nav class="nav nav-right" aria-label="Primary right">
      <a href="/agents" class="nav-link">agents</a>
    </nav>
  </div>
</header>

<main class="site-main">
  {@render children?.()}
</main>

<style>
  @font-face {
    font-family: "avionic wide book";
    src: url("/fonts/AvionicWide-Book.otf") format("opentype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  .site-header {
    position: fixed;
    inset: 0 0 auto 0;
    height: 64px;
    display: grid;
    place-items: center;
    background: #0F0F0F;
    z-index: 20;
    pointer-events: none;
    padding: 0;
  }
  .header-inner {
    width: 100%;
    max-width: none;
    margin: 0 auto;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 24px;
    padding: 0;
    pointer-events: none;
    /* Independent min/max edge paddings for left/right nav containers */
    --pad-left-min: 16px;
    --pad-left-max: 240px;
    --pad-right-min: 16px;
    --pad-right-max: 240px;
    --pad-left: clamp(var(--pad-left-min), 8vw, var(--pad-left-max));
    --pad-right: clamp(var(--pad-right-min), 8vw, var(--pad-right-max));
    position: relative; /* anchor absolute-centered logo */
  }

  /* Scale edge padding faster on wider screens without changing small-screen spacing */
  @media (min-width: 640px) {
    .header-inner {
      --pad-left: clamp(var(--pad-left-min), 16vw, 480px);
      --pad-right: clamp(var(--pad-right-min), 16vw, 480px);
    }
  }

  /* Third tier: very wide screens — bring links further inward */
  @media (min-width: 1280px) {
    .header-inner {
      --pad-left: clamp(var(--pad-left-min), 24vw, 720px);
      --pad-right: clamp(var(--pad-right-min), 24vw, 720px);
    }
  }
  .logo-wrap { pointer-events: auto; position: absolute; left: 50%; top: 0; transform: translateX(-50%); }
  .logo-link { display: inline-block; text-decoration: none; }

  /* Overhanging centered logo */
  .logo {
    width: var(--logo-w, 100px);
    height: var(--logo-h, 80px);
    transform: translateY(10px); /* overhang below header */
    filter: drop-shadow(0 4px 14px rgba(0,0,0,0.35));
    transition: transform 180ms ease, filter 180ms ease;
    will-change: transform;
  }
  .logo-link:hover .logo,
  .logo-link:focus-visible .logo {
    transform: translateY(10px) scale(1.12); /* uniform scale preserves aspect ratio */
    filter: drop-shadow(0 6px 18px rgba(0,0,0,0.45));
  }

  /* Triangle behind logo */
  .hex { position: absolute; left: 50%; top: 0; transform: translateX(-50%); display: grid; place-items: center; pointer-events: none; }
  .hex-svg { width: 140px; height: 130px; transform: translateY(var(--hex-offset-y, -10px)) rotate(0deg); }
  .hex-svg polygon { stroke: none; fill: #0F0F0F; filter: none; }
  /* Navigation styling */
  .nav {
    display: flex;
    align-items: center;
    gap: 20px;
    pointer-events: auto;
    justify-self: stretch;
    min-width: 0;
    align-self: center; /* vertically align to header center */
    transform: translateY(var(--nav-offset-y, -4px)); /* slight upward nudge */
  }
  /* Each nav is a padded container; the link is centered inside that container */
  .nav-left { justify-content: center; padding-left: var(--pad-left); justify-self: start; }
  .nav-right { justify-content: center; padding-right: var(--pad-right); justify-self: end; }

  .nav-link {
    font-family: "avionic wide book", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial;
    font-weight: 400;
    font-size: 1.5rem;
    text-transform: lowercase;
    color: rgba(255, 255, 255, 0.92);
    text-decoration: none;
    letter-spacing: 0.04em;
    padding: 0.25rem 0; /* remove horizontal padding so edge distance equals container padding */
    border-radius: 6px;
    transition: color 120ms ease, background-color 120ms ease;
    white-space: nowrap; /* prevent breaking link labels */
  }
  .nav-link:hover { color: #3aa3ff; background-color: transparent; }
  .nav-link:active { background-color: rgba(255,255,255,0.1); }

</style>
