<script lang="ts">
  // No props needed; self-contained animated background
</script>

<svg class="neural-bg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <!-- Base gradient -->
    <linearGradient id="bg-grad" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#eaf3ff"/>
      <stop offset="50%" stop-color="#d6e9ff"/>
      <stop offset="100%" stop-color="#c4e1ff"/>
    </linearGradient>

    <!-- Wisp stroke gradient -->
    <linearGradient id="wisp-grad" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#ccefff" stop-opacity="0"/>
      <stop offset="8%" stop-color="#ccefff" stop-opacity="0.9"/>
      <stop offset="92%" stop-color="#9fdcff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#9fdcff" stop-opacity="0"/>
    </linearGradient>

    <!-- Soft glow filter for wisps -->
    <filter id="wisp-blur" x="-20%" y="-200%" width="140%" height="500%">
      <feGaussianBlur stdDeviation="0.8"/>
    </filter>

    <!-- Slight soften for lines only -->
    <filter id="wisp-soft" x="-20%" y="-200%" width="140%" height="500%">
      <feGaussianBlur stdDeviation="0.35"/>
    </filter>
  </defs>

  <!-- Base -->
  <rect x="0" y="0" width="100" height="100" fill="url(#bg-grad)"/>

  <!-- Wispy sweeps only -->
  <g class="wisps" filter="url(#wisp-soft)">
    <path class="w w1" d="M -10 38 Q 25 28, 50 38 T 110 44" stroke="url(#wisp-grad)" stroke-width="3.6" fill="none"/>
    <path class="w w2" d="M -10 56 Q 30 62, 55 48 T 110 50" stroke="url(#wisp-grad)" stroke-width="3.2" fill="none"/>
    <path class="w w3" d="M -10 70 Q 25 56, 47 64 T 110 68" stroke="url(#wisp-grad)" stroke-width="3.4" fill="none"/>
  </g>
</svg>

<style>
  .neural-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    overflow: hidden;
  }

  /* Wisps glide */
  .wisps .w { animation: sweep 30s ease-in-out infinite; }
  .wisps .w2 { animation-duration: 36s; animation-delay: -8s; opacity: 0.95; }
  .wisps .w3 { animation-duration: 42s; animation-delay: -12s; opacity: 0.9; }

  @keyframes sweep {
    0%   { transform: translateX(-3vw) translateY(-0.4vh); opacity: 0.85; }
    50%  { transform: translateX(3vw) translateY(0.4vh); opacity: 1; }
    100% { transform: translateX(-3vw) translateY(-0.4vh); opacity: 0.85; }
  }

  /* remove glows/tiles/network */
</style>


