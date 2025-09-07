<script lang="ts">
  // Section ribbon component with rhombus
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
  const topBorderColor = getRandomColor(ribbonIndex, 1);
  const bottomBorderColor = getRandomColor(ribbonIndex, 2);
</script>

<div class="ribbon" style="border-top-color: {topBorderColor}; border-bottom-color: {bottomBorderColor};">
  <div class="ribbon-content">
    <div class="rhombus" style="background: {currentColor}"></div>
  </div>
</div>

<style>
  .ribbon {
    width: 100%;
    height: 4rem;
    background: var(--gray-700);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-top: 0.25rem solid;
    border-bottom: 0.25rem solid;
  }
  
  .ribbon-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .rhombus {
    width: 2rem;
    height: 2rem;
    transform: rotate(45deg);
    border: 2px solid rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    .ribbon {
      height: 3rem;
    }
    
    .rhombus {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
</style>
