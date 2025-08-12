<script lang="ts">
  import { onMount } from 'svelte';

  type Metric = { label: string; value: number; suffix?: string; prefix?: string };

  const metrics: Metric[] = [
    { label: 'Systems Installed', value: 1200, suffix: '+' },
    { label: 'Avg Response Time', value: 6, suffix: ' min' },
    { label: 'Years Experience', value: 25, suffix: '+' },
    { label: 'Customer Satisfaction', value: 98, suffix: '%' }
  ];

  let current: number[] = metrics.map(() => 0);
  let started = false;
  let prefersReducedMotion = false;
  let rafId: number | null = null;

  function formatNumber(n: number): string {
    try { return n.toLocaleString(); } catch { return String(n); }
  }
  function easeOutCubic(t: number): number { return 1 - Math.pow(1 - t, 3); }

  function animateCounts(durationMs = 1500) {
    const start = performance.now();
    const frame = () => {
      const now = performance.now();
      const t = Math.min(1, (now - start) / durationMs);
      const e = easeOutCubic(t);
      current = metrics.map((m) => Math.round(m.value * e));
      if (t < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        current = metrics.map((m) => m.value);
        rafId = null;
      }
    };
    rafId = requestAnimationFrame(frame);
  }

  function stop() { if (rafId != null) cancelAnimationFrame(rafId); rafId = null; }

  function observe(node: HTMLElement) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !started) {
          started = true;
          if (prefersReducedMotion) {
            current = metrics.map((m) => m.value);
          } else {
            stop();
            animateCounts();
          }
        }
      }
    }, { threshold: 0.35 });
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }

  onMount(() => {
    prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  });
</script>

<section class="metrics" use:observe>
  <div class="wrap">
    <div class="grid" role="list">
      {#each metrics as m, i}
        <div class="item" role="listitem" aria-label={`${m.label}: ${m.prefix ?? ''}${m.value}${m.suffix ?? ''}`}>
          <div class="value">{m.prefix}{formatNumber(current[i])}{m.suffix}</div>
          <div class="label">{m.label}</div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .metrics {
    position: relative;
    padding: 0.75rem 0;
    background: var(--gray-700);
    border-top: 0.0625rem solid rgba(255,255,255,0.08);
    border-bottom: 0.0625rem solid rgba(255,255,255,0.06);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    align-items: stretch;
  }
  .item {
    text-align: center;
    padding: 0.5rem 0.25rem;
    background: rgba(16, 18, 23, 0.6);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 0.5rem;
  }
  .value {
    font-weight: 400;
    font-size: clamp(1.35rem, 2.2vw + 0.5rem, 2rem);
    line-height: 1.1;
    letter-spacing: 0.01em;
    color: var(--white);
  }
  .label {
    margin-top: 0.1rem;
    color: var(--gray-400);
    font-size: 0.9rem;
  }
  @media (max-width: 56rem) {
    .metrics { padding: 0.5rem 0; }
    .grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
    .item { padding: 0.5rem 0.4rem; }
    .label { font-size: 0.85rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .item { transition: none; }
  }
</style> 