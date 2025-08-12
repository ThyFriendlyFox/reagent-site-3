<script lang="ts">
  import EffectWindow from '$lib/components/EffectWindow.svelte';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  let { backgroundImageUrl, backgroundVideoUrl, children } = $props();

  // Track viewport size safely in the browser only
  let stageWidth = $state(0);
  let stageHeight = $state(0);
  onMount(() => {
    if (!browser) return;
    const update = () => {
      stageWidth = window.innerWidth;
      stageHeight = window.innerHeight;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  });
  
  const hasVideo = Boolean(backgroundVideoUrl);
  const hasImage = Boolean(backgroundImageUrl);
</script>

<section class="hero" aria-label="Site hero">
  <div class="bg">
    {#if hasVideo}
      <video class="bg-video" src={backgroundVideoUrl} autoplay muted loop playsinline></video>
    {:else if hasImage}
      <div class="bg-image" style={`--bg-url: url('${backgroundImageUrl}')`}></div>
    {/if}
  </div>

  <!-- Foreground tint overlay (displacement is applied on background elements) -->
  <div class="overlay-blur">
  </div>

  <div class="hero-content">
    {@render children?.()}
  </div>

  

</section>

<!-- Draggable effect window aligned with the hero background -->
<EffectWindow
  imageUrl={backgroundImageUrl}
  stageWidth={stageWidth}
  stageHeight={stageHeight}
  width={420}
  height={260}
  displacementScale={22}
  blur={1.25}
  aberration={1.2}
  magnification={1.08}
/>

<style>
  :global(html), :global(body) {
    margin: 0;
    padding: 0;
    height: 100%;
    background: #0b0c10;
    color: #e8eaed;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .hero {
    position: relative;
    isolation: isolate;
    height: 100vh;
    overflow: hidden;
  }

  .bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
  }

  .bg-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(1.1) contrast(1.05) brightness(0.9);
    -webkit-filter: saturate(1.1) contrast(1.05) brightness(0.9);
  }

  .bg-image {
    position: absolute;
    inset: 0;
    background-image: var(--bg-url);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: saturate(1.1) contrast(1.05) brightness(0.9);
    -webkit-filter: saturate(1.1) contrast(1.05) brightness(0.9);
  }

  /* Full-screen blur overlay container */
  .overlay-blur {
    position: absolute;
    inset: 0;
    z-index: 1;
    /* tint only; displacement is applied directly on the background layer */
    background-color: rgba(11, 12, 16, 0.22);
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  /* no filters in the hero background now */

  @media (max-width: 640px) {
    /* no-op for now */
  }
</style>


