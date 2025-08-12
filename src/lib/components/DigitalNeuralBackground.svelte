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

    <!-- Glows -->
    <radialGradient id="glow-cyan" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8fd4ff" stop-opacity="0.7"/>
      <stop offset="60%" stop-color="#64b8ff" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#3d98f0" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow-azure" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#b2e8ff" stop-opacity="0.6"/>
      <stop offset="60%" stop-color="#7dc6ff" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#4aa9f0" stop-opacity="0"/>
    </radialGradient>

    <!-- Wisp stroke gradient -->
    <linearGradient id="wisp-grad" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#bde9ff" stop-opacity="0"/>
      <stop offset="10%" stop-color="#bde9ff" stop-opacity="0.7"/>
      <stop offset="90%" stop-color="#91d6ff" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#91d6ff" stop-opacity="0"/>
    </linearGradient>

    <!-- Soft glow filter for wisps -->
    <filter id="wisp-blur" x="-20%" y="-200%" width="140%" height="500%">
      <feGaussianBlur stdDeviation="0.8"/>
    </filter>

    <!-- Node glow -->
    <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="0.6"/>
    </filter>

    <!-- Tile soft edge -->
    <filter id="tile-soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="0.6"/>
    </filter>
  </defs>

  <!-- Base -->
  <rect x="0" y="0" width="100" height="100" fill="url(#bg-grad)"/>

  <!-- Large drifting glows -->
  <g class="glows">
    <circle cx="20" cy="30" r="26" fill="url(#glow-cyan)" class="g g1"/>
    <circle cx="85" cy="70" r="24" fill="url(#glow-azure)" class="g g2"/>
    <circle cx="55" cy="20" r="18" fill="url(#glow-cyan)" class="g g3"/>
  </g>

  <!-- Very light network tiles (links surfaces) -->
  <g class="tiles" opacity="0.08" filter="url(#tile-soft)">
    <rect x="-10" y="-8" width="38" height="38" rx="1" fill="#2c4050" transform="rotate(18 9 11)" />
    <rect x="64" y="-6" width="34" height="34" rx="1" fill="#2c4050" transform="rotate(12 81 11)" />
    <rect x="50" y="60" width="36" height="36" rx="1" fill="#2c4050" transform="rotate(16 68 78)" />
  </g>

  <!-- Wispy sweeps -->
  <g class="wisps" filter="url(#wisp-blur)">
    <path class="w w1" d="M -10 40 Q 25 30, 50 40 T 110 45" stroke="url(#wisp-grad)" stroke-width="2.2" fill="none"/>
    <path class="w w2" d="M -10 55 Q 30 60, 55 50 T 110 48" stroke="url(#wisp-grad)" stroke-width="1.8" fill="none"/>
    <path class="w w3" d="M -10 65 Q 25 52, 47 60 T 110 63" stroke="url(#wisp-grad)" stroke-width="2" fill="none"/>
  </g>

  <!-- Subtle network -->
  <g class="network">
    <g class="links" stroke="#7fc9ff" stroke-opacity="0.08" stroke-width="0.3">
      <path d="M15 22 L35 28 L28 42 L18 35 Z"/>
      <path d="M62 18 L78 26 L74 41 L58 33 Z"/>
      <path d="M42 58 L60 66 L56 80 L38 73 Z"/>
    </g>
    <g class="nodes" fill="#aee2ff" fill-opacity="0.4" filter="url(#node-glow)">
      <circle cx="15" cy="22" r="0.8"/>
      <circle cx="35" cy="28" r="0.9"/>
      <circle cx="28" cy="42" r="0.8"/>
      <circle cx="18" cy="35" r="0.7"/>
      <circle cx="62" cy="18" r="0.9"/>
      <circle cx="78" cy="26" r="0.8"/>
      <circle cx="74" cy="41" r="0.9"/>
      <circle cx="58" cy="33" r="0.7"/>
      <circle cx="42" cy="58" r="0.8"/>
      <circle cx="60" cy="66" r="0.8"/>
      <circle cx="56" cy="80" r="0.9"/>
      <circle cx="38" cy="73" r="0.7"/>
    </g>
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

  /* Glow drift */
  .glows .g { animation: drift 28s ease-in-out infinite; transform-origin: center; }
  .glows .g1 { animation-duration: 36s; animation-delay: -4s; }
  .glows .g2 { animation-duration: 32s; animation-delay: -10s; }
  .glows .g3 { animation-duration: 28s; animation-delay: -7s; }

  @keyframes drift {
    0%   { transform: translate(-1.2vw, -0.2vh) scale(1); opacity: 0.9; }
    50%  { transform: translate(1.4vw, 0.6vh) scale(1.06); opacity: 1; }
    100% { transform: translate(-1.2vw, -0.2vh) scale(1); opacity: 0.9; }
  }

  /* Wisps glide */
  .wisps .w { animation: sweep 26s ease-in-out infinite; }
  .wisps .w2 { animation-duration: 32s; animation-delay: -8s; opacity: 0.9; }
  .wisps .w3 { animation-duration: 38s; animation-delay: -12s; opacity: 0.85; }

  @keyframes sweep {
    0%   { transform: translateX(-3vw) translateY(-0.4vh); opacity: 0.85; }
    50%  { transform: translateX(3vw) translateY(0.4vh); opacity: 1; }
    100% { transform: translateX(-3vw) translateY(-0.4vh); opacity: 0.85; }
  }

  /* Network slow float */
  .network { animation: float 44s ease-in-out infinite; }
  @keyframes float {
    0%   { transform: translate(0, 0) scale(1); opacity: 0.5; }
    50%  { transform: translate(1vw, -0.8vh) scale(1.015); opacity: 0.6; }
    100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
  }
</style>


