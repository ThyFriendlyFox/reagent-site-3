<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  let images: string[] = [];
  let currentIndex = 0;
  let nextIndex = 1;
  let showingA = true;
  let srcA = '';
  let srcB = '';
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const INTERVAL_MS = 7000; // time per slide
  const FADE_MS = 1000; // should match CSS transition duration

  async function loadImages() {
    try {
      const res = await fetch('/api/backgrounds');
      if (!res.ok) return;
      const data: { images: string[] } = await res.json();
      images = data.images ?? [];
      currentIndex = 0;
      nextIndex = images.length > 1 ? 1 : 0;
      srcA = images[0] ?? '';
      srcB = images[1] ?? images[0] ?? '';
    } catch (err) {
      // ignore fetch failures; just show no background
    }
  }

  function startSlideshow() {
    if (images.length <= 1) return; // nothing to cycle
    stopSlideshow();
    intervalId = setInterval(() => {
      // Determine which image should come next
      const incomingIndex = (currentIndex + 1) % images.length;

      // Update the hidden layer's src to the incoming image, then fade it in
      if (showingA) {
        srcB = images[incomingIndex];
      } else {
        srcA = images[incomingIndex];
      }

      // Toggle visibility to crossfade
      showingA = !showingA;

      // Advance indices
      currentIndex = incomingIndex;
      nextIndex = (incomingIndex + 1) % images.length;
    }, INTERVAL_MS);
  }

  function stopSlideshow() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  onMount(async () => {
    await loadImages();
    startSlideshow();
  });

  onDestroy(() => {
    stopSlideshow();
  });
</script>

{#if images.length > 0}
  <div class="slideshow" aria-hidden="true">
    <!-- Two layers for crossfade -->
    <img
      class={`slide ${showingA ? 'visible' : ''}`}
      src={srcA}
      alt=""
      style={`transition-duration:${FADE_MS}ms`}
      decoding="async"
      fetchpriority="low"
    />
    {#if images.length > 1}
      <img
        class={`slide ${!showingA ? 'visible' : ''}`}
        src={srcB}
        alt=""
        style={`transition-duration:${FADE_MS}ms`}
        decoding="async"
        fetchpriority="low"
      />
    {/if}
    <div class="overlay"></div>
  </div>
{/if}

<style>
  .slideshow {
    position: fixed;
    inset: 0;
    z-index: 0; /* behind content but above page background */
    pointer-events: none; /* never block interactions */
    overflow: hidden;
    background: #0f1115; /* fallback color */
  }
  .slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.9) contrast(1.05);
    opacity: 0;
    transition-property: opacity, transform;
    transition-timing-function: ease-in-out;
    will-change: opacity, transform;
  }
  .slide.visible {
    opacity: 1;
    transform: scale(1.0);
  }
  /* Subtle zoom for the non-visible layer to create parallax feel */
  .slide:not(.visible) {
    transform: scale(1.03);
  }

  /* Optional dark overlay to improve foreground contrast */
  .overlay {
    position: absolute;
    inset: 0;
    /* Light overlay to brighten background */
    background: radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.55) 60%, rgba(255,255,255,0.7) 100%);
  }

  @media (prefers-reduced-motion: reduce) {
    .slide { transition: none; }
  }
</style>


