<script lang="ts">
  import { onMount } from 'svelte';

  type Step = { title: string; body: string; img: string };

  const steps: Step[] = [
    {
      title: 'What is low voltage?',
      body:
        'Low voltage refers to electrical systems that operate below the standard 120/240 volts used for most household appliances and lighting.',
      img: '/backgrounds/PXL_20250328_121802866.jpg'
    },
    {
      title: 'What do low voltage contractors do?',
      body:
        'They work with systems like security cameras, access control, fire alarms, and data networks, installing and maintaining the wiring and equipment associated with these systems.',
        img: '/backgrounds/PXL_20250329_020050369.jpg'
      },
      {
        title: 'Where do they work?',
        body:
        'Low voltage contractors can be found in a variety of settings, including homes, offices, commercial buildings, schools, and hospitals.',
        img: '/backgrounds/PXL_20250328_133624838.jpg'
    },
    {
      title: 'Why is it important?',
      body:
        'Low voltage systems are crucial for modern security, communication, and automation in buildings. Low voltage contractors ensure these systems function properly, enhancing safety, convenience, and productivity.',
      img: '/backgrounds/PXL_20240625_193958013.PORTRAIT~2.jpg'
    }
  ];

  let activeIndex = 0;

  type ObserveOpts = { index: number };
  function observeStep(node: HTMLElement, opts: ObserveOpts) {
    const threshold = 0.6;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= threshold) {
            activeIndex = opts.index;
          }
        }
      },
      { threshold: [0, threshold, 1], root: null, rootMargin: `0px 0px -10% 0px` }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }

  onMount(() => {
    // Ensure the first image is visible on load
    activeIndex = 0;
  });
</script>

<section class="scrolly">
  <div class="scrolly-inner">
    <!-- Sticky media (left on desktop, fixed background on mobile) -->
    <div class="media" aria-hidden="true">
      {#each steps as s, i}
        <img class={`media-img ${i === activeIndex ? 'visible' : ''}`} src={s.img} alt="" />
      {/each}
      <!-- Mobile overlay to create a soft white gradient behind text -->
      <div class="mobile-white-gradient"></div>
    </div>

    <!-- Steps column -->
    <div class="steps">
      {#each steps as s, i}
        <article class={`step ${i === activeIndex ? 'is-active' : ''}`} use:observeStep={{ index: i }}>
          <div class="step-inner">
            <h3 class="step-title">{s.title}</h3>
            <p class="step-body">{s.body}</p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  /* Container covers natural height driven by steps */
  .scrolly {
    position: relative;
    padding: 0; /* let content butt to edges for immersive feel */
    background: var(--gray-700);
    border-top: 0.0625rem solid rgba(255,255,255,0.08);
    border-bottom: 0.0625rem solid rgba(255,255,255,0.06);
  }

  .scrolly-inner {
    display: grid;
    grid-template-columns: 1fr 1fr; /* media | steps */
    min-height: calc(100vh - var(--header-h));
  }

  /* Sticky image pane */
  .media {
    position: sticky;
    top: var(--header-h);
    height: calc(100vh - var(--header-h));
    overflow: hidden;
    z-index: 0;
    background: #0f1115; /* fallback */
  }
  .media-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transform: scale(1.03);
    transition: opacity 600ms ease, transform 1000ms ease;
    filter: saturate(0.95) contrast(1.05);
  }
  .media-img.visible {
    opacity: 1;
    transform: scale(1.0);
  }

  /* gradient only used on mobile, but render it here and hide by default */
  .mobile-white-gradient { display: none; }

  /* Steps column drives height and scrolling */
  .steps {
    position: relative;
    z-index: 1;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .step {
    min-height: 80vh; /* each step nearly a screen */
    display: flex;
    align-items: center;
  }
  .step-inner {
    max-width: 42rem;
    margin: 0 auto 0 0; /* left align on desktop */
    background: rgba(16, 18, 23, 0.78);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 0.5rem;
    padding: 1.25rem 1rem;
    box-shadow: 0 8px 28px rgba(0,0,0,0.28);
    transform: translateY(10px);
    opacity: 0.0;
    transition: opacity 420ms ease, transform 500ms ease, box-shadow 300ms ease;
    will-change: opacity, transform;
  }
  .step.is-active .step-inner { opacity: 1; transform: none; }

  .step-title { margin: 0 0 0.25rem; font-size: 1.6rem; line-height: 1.1; }
  .step-body { margin: 0; color: var(--gray-400); font-size: 1.05rem; }

  /* Mobile: media becomes fixed background, text gets white gradient overlay */
  @media (max-width: 56rem) {
    .scrolly-inner { display: block; }

    .media {
      position: fixed;
      top: var(--header-h);
      left: 0;
      right: 0;
      height: calc(100vh - var(--header-h));
      z-index: 0;
    }
    .mobile-white-gradient {
      position: absolute;
      inset: 0;
      display: block;
      background: linear-gradient(
        to bottom,
        rgba(255,255,255,0.92) 0%,
        rgba(255,255,255,0.82) 28%,
        rgba(255,255,255,0.66) 56%,
        rgba(255,255,255,0.42) 100%
      );
    }

    .steps {
      position: relative;
      z-index: 1;
      padding: 1rem var(--pad) 2rem;
      background: transparent; /* overlay comes from gradient above */
      color: #111;
    }
    .step-inner {
      background: rgba(255,255,255,0.85);
      border-color: rgba(0,0,0,0.06);
      color: #111;
      box-shadow: 0 10px 24px rgba(0,0,0,0.15);
    }
    .step-title { color: #111; }
    .step-body { color: #222; }
  }

  @media (prefers-reduced-motion: reduce) {
    .media-img { transition: none; }
    .step-inner { transition: none; opacity: 1; transform: none; }
  }
</style> 