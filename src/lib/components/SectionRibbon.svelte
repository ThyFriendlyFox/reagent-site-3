<script lang="ts">
  import { onMount } from 'svelte';
  
  // Section ribbon component with liquid glass background
  let { ribbonIndex = 0 } = $props();
  
  // Colors from logo.svg
  const colors = ['#FC0016', '#44C5EF', '#00CD59', '#FBFB6B'];
  
  // Generate random colors immediately (not in onMount)
  function getRandomColor(index: number, offset: number = 0) {
    const seed = index * 1000 + offset + Math.floor(Math.random() * 10000);
    const randomIndex = Math.abs(seed) % colors.length;
    return colors[randomIndex];
  }
  
  const currentColor = getRandomColor(ribbonIndex, 0);
  
  // Animation state
  let animationTime = 0;
  
  onMount(() => {
    const animate = () => {
      animationTime += 0.016; // ~60fps
      requestAnimationFrame(animate);
    };
    animate();
  });
</script>

<!-- SVG Filter Definitions -->
<svg class="filter-definitions" style="position: absolute; width: 0; height: 0;">
  <defs>
    <!-- Liquid Glass Displacement Map Filter -->
    <filter id="liquidGlass" x="-50%" y="-50%" width="200%" height="200%">
      <!-- Create displacement map using turbulence -->
      <feTurbulence 
        baseFrequency="0.01 0.012" 
        numOctaves="3" 
        result="noise" 
        type="fractalNoise">
        <animateTransform
          attributeName="baseFrequency"
          type="translate"
          values="0.01 0.012;0.012 0.01;0.01 0.012"
          dur="15s"
          repeatCount="indefinite"/>
      </feTurbulence>
      
      <!-- Apply displacement map -->
      <feDisplacementMap 
        in="SourceGraphic" 
        in2="noise" 
        scale="3" 
        xChannelSelector="R" 
        yChannelSelector="G"/>
      
      <!-- Very minimal blur for sharp clarity -->
      <feGaussianBlur stdDeviation="0.1"/>
    </filter>
    
    <!-- Chromatic Aberration Filter -->
    <filter id="chromaticAberration" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset in="SourceGraphic" dx="1" dy="0" result="red">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
      </feOffset>
      <feOffset in="SourceGraphic" dx="-1" dy="0" result="blue">
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"/>
      </feOffset>
      <feOffset in="SourceGraphic" dx="0" dy="0" result="green">
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
      </feOffset>
      <feComposite in="red" in2="green" operator="screen" result="rg"/>
      <feComposite in="rg" in2="blue" operator="screen"/>
    </filter>
  </defs>
</svg>

<div class="ribbon">
  <!-- Liquid Glass Effect Layer -->
  <div class="liquid-glass-layer" filter="url(#liquidGlass)"></div>
  
  <!-- SVG Icons positioned in front of the ribbon -->
  <!-- <div class="ribbon-content">
    <svg class="logo-shape" viewBox="250 300 250 350" style="fill: #44C5EF" filter="url(#liquidGlass)">
      <path d="m302.54,362.71c6.93,-11.77 13.61,-23.27 20.42,-34.7c2.72,-4.57 3.52,-4.57 6.15,0c14.83,25.79 29.58,51.63 44.37,77.44c0.22,0.39 0.73,0.61 1.47,1.21c15.63,-27.07 31.19,-54.01 47.29,-81.9c3.9,6.46 7.28,11.9 10.49,17.43c18.79,32.3 37.5,64.65 56.37,96.9c2.55,4.36 2.68,7.95 0.04,12.43c-18.22,30.94 -36.18,62.04 -54.25,93.06c-15.82,27.15 -31.69,54.26 -47.53,81.4c-4.32,7.4 -8.62,14.82 -13.75,23.64c-3.69,-6.2 -6.7,-11.19 -9.63,-16.22c-16.13,-27.71 -32.24,-55.43 -48.37,-83.14c-19.29,-33.16 -38.56,-66.32 -57.93,-99.43c-2.26,-3.86 -2.29,-7.06 0.07,-11.05c14.22,-24.04 28.19,-48.22 42.22,-72.37c0.84,-1.43 1.58,-2.92 2.57,-4.7z"/>
    </svg>
    <svg class="logo-shape" viewBox="250 300 250 350" style="fill: #44C5EF" filter="url(#liquidGlass)">
      <path d="m302.54,362.71c6.93,-11.77 13.61,-23.27 20.42,-34.7c2.72,-4.57 3.52,-4.57 6.15,0c14.83,25.79 29.58,51.63 44.37,77.44c0.22,0.39 0.73,0.61 1.47,1.21c15.63,-27.07 31.19,-54.01 47.29,-81.9c3.9,6.46 7.28,11.9 10.49,17.43c18.79,32.3 37.5,64.65 56.37,96.9c2.55,4.36 2.68,7.95 0.04,12.43c-18.22,30.94 -36.18,62.04 -54.25,93.06c-15.82,27.15 -31.69,54.26 -47.53,81.4c-4.32,7.4 -8.62,14.82 -13.75,23.64c-3.69,-6.2 -6.7,-11.19 -9.63,-16.22c-16.13,-27.71 -32.24,-55.43 -48.37,-83.14c-19.29,-33.16 -38.56,-66.32 -57.93,-99.43c-2.26,-3.86 -2.29,-7.06 0.07,-11.05c14.22,-24.04 28.19,-48.22 42.22,-72.37c0.84,-1.43 1.58,-2.92 2.57,-4.7z"/>
    </svg>
    <svg class="logo-shape" viewBox="250 300 250 350" style="fill: #44C5EF" filter="url(#liquidGlass)">
      <path d="m302.54,362.71c6.93,-11.77 13.61,-23.27 20.42,-34.7c2.72,-4.57 3.52,-4.57 6.15,0c14.83,25.79 29.58,51.63 44.37,77.44c0.22,0.39 0.73,0.61 1.47,1.21c15.63,-27.07 31.19,-54.01 47.29,-81.9c3.9,6.46 7.28,11.9 10.49,17.43c18.79,32.3 37.5,64.65 56.37,96.9c2.55,4.36 2.68,7.95 0.04,12.43c-18.22,30.94 -36.18,62.04 -54.25,93.06c-15.82,27.15 -31.69,54.26 -47.53,81.4c-4.32,7.4 -8.62,14.82 -13.75,23.64c-3.69,-6.2 -6.7,-11.19 -9.63,-16.22c-16.13,-27.71 -32.24,-55.43 -48.37,-83.14c-19.29,-33.16 -38.56,-66.32 -57.93,-99.43c-2.26,-3.86 -2.29,-7.06 0.07,-11.05c14.22,-24.04 28.19,-48.22 42.22,-72.37c0.84,-1.43 1.58,-2.92 2.57,-4.7z"/>
    </svg>
  </div> -->
</div>

<style>
  .filter-definitions {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
  }
  
  .ribbon {
    width: 100%;
    height: 4rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(1px) saturate(150%) brightness(1.05);
    -webkit-backdrop-filter: blur(1px) saturate(150%) brightness(1.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  }
  
  .liquid-glass-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    pointer-events: none;
    z-index: 1;
  }
  
  .ribbon-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    z-index: 10;
  }
  
  .logo-shape {
    width: 3.5rem;
    height: 3rem;
    animation: bob 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
    filter: 
      brightness(1.1) 
      blur(0.5px) 
      url(#liquidGlass);
    transition: filter 0.3s ease;
    position: relative;
    z-index: 11;
  }
  
  .logo-shape:hover {
    filter: 
      brightness(1.2) 
      blur(0.3px) 
      url(#liquidGlass) 
      url(#chromaticAberration);
  }
  
  .logo-shape:nth-child(1) {
    animation-delay: 0s;
  }
  
  .logo-shape:nth-child(2) {
    animation-delay: 0.1s;
  }
  
  .logo-shape:nth-child(3) {
    animation-delay: 0.2s;
  }
  
  @keyframes bob {
    0% {
      transform: translateY(0.25rem);
      animation-timing-function: ease-out;
    }
    50% {
      transform: translateY(-0.25rem);
      animation-timing-function: ease-in;
    }
    100% {
      transform: translateY(0.25rem);
    }
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .ribbon {
      height: 3rem;
    }
    
    .logo-shape {
      width: 2rem;
      height: 2rem;
    }
  }
  
  @media (max-width: 480px) {
    .ribbon {
      height: 2.5rem;
    }
    
    .logo-shape {
      width: 1.5rem;
      height: 1.5rem;
    }
    
    .ribbon-content {
      gap: 0.5rem;
    }
  }
</style>
