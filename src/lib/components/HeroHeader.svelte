<script lang="ts">
  import DigitalNeuralBackground from '$lib/components/DigitalNeuralBackground.svelte';
  let { backgroundImageUrl, backgroundVideoUrl, children } = $props();
  
  const hasVideo = Boolean(backgroundVideoUrl);
  const hasImage = Boolean(backgroundImageUrl);
</script>

<section class="hero" aria-label="Site hero">
  <div class="bg">
    <DigitalNeuralBackground />
  </div>

  <!-- Foreground tint overlay (displacement is applied on background elements) -->
  <div class="overlay-blur">
  </div>

  <div class="hero-content">
    {@render children?.()}
  </div>

  

</section>



<style>
  :global(html), :global(body) {
    margin: 0;
    padding: 0;
    height: 100%;
    background: #eaf3ff; /* light blue page background to match light mode */
    color: #e8eaed;
    font-family: 'avionic', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    font-weight: 200;
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

  /* background video/image styles not used currently */

  /* Full-screen blur overlay container */
  .overlay-blur {
    position: absolute;
    inset: 0;
    z-index: 1;
    /* tint only; displacement is applied directly on the background layer */
    background-color: rgba(255, 255, 255, 0.5);
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


