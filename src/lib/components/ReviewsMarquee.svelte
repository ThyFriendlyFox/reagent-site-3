<script lang="ts">
  import { onMount, tick } from 'svelte';

  type Review = {
    authorName: string;
    rating: number; // 1-5
    text: string;
    url?: string;
  };

  let reviews: Review[] = [];

  const fallback: Review[] = [
    {
      authorName: 'Joseph M.',
      rating: 5,
      text: 'Outstanding service and response time. Highly recommend!'
    },
    {
      authorName: 'Tara M.',
      rating: 5,
      text: 'Professional install and very knowledgeable team.'
    },
    {
      authorName: 'Diego R.',
      rating: 5,
      text: 'Great experience from start to finish. System works flawlessly.'
    },
    {
      authorName: 'Amanda M.',
      rating: 5,
      text: 'They truly are first in quality and service!'
    },
    {
      authorName: 'Chris P.',
      rating: 5,
      text: 'Fast, friendly, and reliable. Could not ask for more.'
    }
  ];

  // Animation state
  let containerEl: HTMLDivElement | null = null;
  let beltAEl: HTMLDivElement | null = null;
  let beltWidth = 0; // width of one full belt (in px)
  let offsetX = 0; // current leftward offset (px)
  let lastFrameTs = 0;
  let rafId: number | null = null;
  let dragging = false;
  let dragLastX = 0;
  let dragLastTs = 0;
  let velocityBoost = 0; // user imparted velocity (px/s), decays over time
  const BASE_DURATION_S = 1080; // match very slow scroll by default
  const MIN_SPEED_PX_S = 5; // ensure it always moves

  function computeBaseSpeed(): number {
    if (beltWidth <= 0) return MIN_SPEED_PX_S;
    return Math.max(MIN_SPEED_PX_S, beltWidth / BASE_DURATION_S);
  }

  function startAnimation() {
    stopAnimation();
    lastFrameTs = performance.now();
    const frame = (ts: number) => {
      const dt = Math.max(0, (ts - lastFrameTs) / 1000);
      lastFrameTs = ts;
      if (!dragging) {
        const base = computeBaseSpeed();
        offsetX -= (base + velocityBoost) * dt;
        // friction for boost
        velocityBoost *= 0.975;
        if (Math.abs(velocityBoost) < 0.01) velocityBoost = 0;
      }
      // wrap offset to [-beltWidth, 0)
      if (beltWidth > 0) {
        if (offsetX <= -beltWidth) offsetX += beltWidth;
        if (offsetX >= 0) offsetX -= beltWidth;
      }
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);
  }

  function stopAnimation() {
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  async function measureAndStart() {
    await tick();
    // measure after DOM update
    if (beltAEl) {
      beltWidth = beltAEl.scrollWidth;
    }
    startAnimation();
  }

  async function loadReviews() {
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('failed');
      const data: { reviews?: Review[] } = await res.json();
      reviews = (data.reviews ?? []).filter((r) => r && r.text && r.rating);
    } catch (e) {
      reviews = fallback;
    }
    await measureAndStart();
  }

  onMount(loadReviews);

  function stars(count: number): string[] {
    return Array.from({ length: Math.max(0, Math.min(5, Math.round(count))) }, () => '★');
  }
</script>

{#if reviews.length}
  <div class="reviews-marquee" aria-label="Customer reviews" bind:this={containerEl}
       on:pointerdown={(e) => {
         dragging = true;
         containerEl?.setPointerCapture(e.pointerId);
         dragLastX = e.clientX;
         dragLastTs = performance.now();
       }}
       on:pointermove={(e) => {
         if (!dragging) return;
         const now = performance.now();
         const dx = e.clientX - dragLastX;
         const dt = Math.max(0.001, (now - dragLastTs) / 1000);
         // move opposite because content scrolls left as offset decreases
         offsetX += dx;
         // instantaneous velocity in px/s (negative means faster left)
         velocityBoost = -(dx / dt);
         dragLastX = e.clientX;
         dragLastTs = now;
       }}
       on:pointerup={(e) => {
         dragging = false;
         containerEl?.releasePointerCapture(e.pointerId);
       }}
       on:pointercancel={() => { dragging = false; }}
  >
    <div class="belt b1" aria-hidden="true" bind:this={beltAEl}
         style={`transform: translate3d(${offsetX}px,0,0);`}>
      {#each reviews as r (r.authorName + r.text)}
        <article class="card">
          <div class="rating" aria-hidden="true">{stars(r.rating).join('')}</div>
          <p class="text">{r.text}</p>
          <div class="author">{r.authorName}</div>
        </article>
      {/each}
      {#each reviews as r (r.authorName + r.text + '-clone1')}
        <article class="card">
          <div class="rating" aria-hidden="true">{stars(r.rating).join('')}</div>
          <p class="text">{r.text}</p>
          <div class="author">{r.authorName}</div>
        </article>
      {/each}
    </div>
    <div class="belt b2" aria-hidden="true"
         style={`transform: translate3d(${offsetX + beltWidth}px,0,0);`}>
      {#each reviews as r (r.authorName + r.text + '-b2')}
        <article class="card">
          <div class="rating" aria-hidden="true">{stars(r.rating).join('')}</div>
          <p class="text">{r.text}</p>
          <div class="author">{r.authorName}</div>
        </article>
      {/each}
      {#each reviews as r (r.authorName + r.text + '-clone2')}
        <article class="card">
          <div class="rating" aria-hidden="true">{stars(r.rating).join('')}</div>
          <p class="text">{r.text}</p>
          <div class="author">{r.authorName}</div>
        </article>
      {/each}
    </div>
  </div>
{/if}

<style>
  .reviews-marquee {
    position: relative;
    overflow: hidden;
    width: 100%;
    margin: 0;
    padding: 0.75rem 0; /* a touch more breathing room for shadows */
    min-height: 12rem; /* reserve room for absolutely positioned belts */
    backdrop-filter: blur(2px);
  }
  .belt {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    gap: 0.75rem;
    width: max-content;
    will-change: transform;
  }
  /* Disable CSS animations; movement is controlled by JS for swipe/drag */
  .belt.b1, .belt.b2 { animation: none !important; }
  .reviews-marquee { cursor: grab; }
  .reviews-marquee:active { cursor: grabbing; }
  .card {
    flex: 0 0 auto;
    width: 40rem;
    background: rgba(16, 18, 23, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.5rem;
    padding: 0.75rem;
    box-shadow: 0 4px 18px rgba(0,0,0,0.25);
  }
  .rating { color: #fbbf24; font-size: 1rem; letter-spacing: 0.08em; }
  .text { margin: 0.25rem 0 0.5rem 0; color: #e5e7eb; font-size: 0.95rem; }
  .author { color: #a7adba; font-size: 0.9rem; }

  /* Keyframes retained for reference, not used */
  @keyframes slide-left { from { transform: translate3d(0,0,0);} to { transform: translate3d(-100%,0,0);} }
  @keyframes slide-right { from { transform: translate3d(100%,0,0);} to { transform: translate3d(0,0,0);} }

  @media (prefers-reduced-motion: reduce) {
    .belt { animation: none; }
  }
</style>


