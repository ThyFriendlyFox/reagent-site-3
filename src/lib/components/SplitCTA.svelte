<script lang="ts">
  const panels = [
    {
      href: '/research',
      title: 'Research',
      lead: 'Open source research into AI Agents.',
      body: "Click here to see the discoveries we've made",
      img: '/PXL_20240625_193819739.PORTRAIT.jpg',
      aria: 'Go to Open Source Research'
    },
    {
      href: '/commercial',
      title: 'Commercial',
      lead: 'From small offices to large facilities, our commercial offerings scale with your needs.',
      body: "If you're a business owner looking to protect your employees, click here",
      img: '/PXL_20250328_121603570.jpg',
      aria: 'Go to Commercial security solutions'
    }
  ];
</script>

<section class="split-cta" aria-label="Choose Research or Solutions">
  <div class="row">
    {#each panels as p}
      <a class="panel" href={p.href} aria-label={p.aria} style={`--bg:url(${p.img})`}>
        <div class="overlay"><div class="tint" aria-hidden="true"></div></div>
        <div class="content">
          <h3 class="title">{p.title}</h3>
          {#if p.lead}<p class="lead">{p.lead}</p>{/if}
          <p class="desc">{p.body}</p>
        </div>
      </a>
    {/each}
  </div>
</section>

<style>
  :root { --ease-snap: cubic-bezier(0.22, 1, 0.36, 1); --ease-soft: cubic-bezier(0.2, 0.8, 0.2, 1); }

  .split-cta {
    position: relative;
    background: var(--gray-700);
    border-top: 0.0625rem solid rgba(255,255,255,0.08);
    border-bottom: 0.0625rem solid rgba(255,255,255,0.06);
    padding: 0; /* full bleed inside */
  }
  .row {
    display: flex;
    min-height: 56vh;
    gap: 0.0625rem; /* subtle seam */
    background: rgba(255,255,255,0.06);
  }
  .panel {
    position: relative;
    flex: 1 1 50%;
    display: grid;
    place-items: center;
    overflow: hidden;
    color: #111;
    text-align: center;
    isolation: isolate; /* manage overlay stacking */
    transition: flex 650ms var(--ease-soft), transform 650ms var(--ease-soft), filter 650ms var(--ease-soft);
    background: #0f1115;
  }
  .panel::before {
    /* background image layer */
    content: '';
    position: absolute; inset: 0; z-index: -2;
    background-image: var(--bg);
    background-position: center; background-size: cover;
    filter: saturate(0.95) contrast(1.03);
    transform: scale(1.02);
    transition: transform 1000ms var(--ease-soft);
  }
  .overlay {
    position: absolute; inset: 0; z-index: -1;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.80) 0%,
      rgba(255,255,255,0.70) 45%,
      rgba(255,255,255,0.58) 100%
    );
    opacity: 1;
    transition: opacity 650ms var(--ease-soft);
  }
  .tint {
    position: absolute; inset: 0;
    background: #e02222;
    opacity: 0;
    transition: opacity 700ms var(--ease-soft);
  }

  .content { padding: 2rem 1rem; max-width: 36rem; }
  .title { margin: 0 0 0.25rem; font-size: clamp(1.5rem, 2.2vw + 0.5rem, 2rem); color: #111; transition: color 500ms var(--ease-soft); }
  .lead { margin: 0.25rem 0 0.35rem; color: #333; font-size: clamp(1rem, 1.2vw + 0.6rem, 1.15rem); transition: color 500ms var(--ease-soft); }
  .desc { margin: 0; color: #1a1d24; font-weight: 400; font-size: clamp(1rem, 1.1vw + 0.6rem, 1.125rem); transition: color 500ms var(--ease-soft); }

  /* Hover/Focus expansion */
  @media (hover: hover) and (pointer: fine) {
    .row:hover .panel { flex: 1 1 40%; filter: brightness(1.0); }
    .row:hover .panel:hover { flex: 1 1 60%; filter: brightness(1.05); }
    .row:hover .panel:hover::before { transform: scale(1.0); }

    /* make the white overlay a bit more transparent on hover */
    .row:hover .panel:hover .overlay { opacity: 0.6; }
    /* fade in a red tint smoothly */
    .row:hover .panel:hover .tint { opacity: 0.28; }

    /* Text shifts to white on the focused (hovered) side */
    .row:hover .panel:hover .title { color: #ffffff; }
    .row:hover .panel:hover .lead { color: #f1f5f9; }
    .row:hover .panel:hover .desc { color: #ffffff; }

    .panel:focus-visible { outline: 2px solid var(--red-600); outline-offset: -2px; }
  }

  /* Small screens: stack panels; keep white gradient stronger for readability */
  @media (max-width: 56rem) {
    .row { flex-direction: column; min-height: 70vh; }
    .panel { min-height: 35vh; }
    .overlay {
      background: linear-gradient(180deg,
        rgba(255,255,255,0.92) 0%,
        rgba(255,255,255,0.82) 36%,
        rgba(255,255,255,0.70) 100%
      );
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .panel, .panel::before, .overlay, .tint, .title, .lead, .desc { transition: none; }
  }
</style> 