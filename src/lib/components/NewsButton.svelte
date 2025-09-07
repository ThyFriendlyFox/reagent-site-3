<script lang="ts">
  import { onMount } from 'svelte';
  
  let alertEl: HTMLElement;
  let isVisible = true;
  let isDismissed = false;
  
  onMount(() => {
    // Add any initialization logic here
  });
  
  function handleClick() {
    // Handle news alert click
    console.log('News alert clicked!');
    // You can add functionality to show news modal, navigate to news section, etc.
  }
  
  function dismissAlert() {
    isDismissed = true;
  }
</script>

{#if !isDismissed}
  <div 
    bind:this={alertEl}
    class="news-alert"
    class:visible={isVisible}
    role="alert"
    aria-live="polite"
  >
    <div class="alert-content">
      <div class="alert-icon">📢</div>
      <div class="alert-text">
        <span class="alert-title">news!</span>
        <span class="alert-subtitle">latest updates available</span>
      </div>
      <button 
        class="dismiss-button"
        on:click={dismissAlert}
        aria-label="Dismiss news alert"
      >
        ×
      </button>
    </div>
  </div>
{/if}

<style>
  .news-alert {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    
    background: white;
    border-top: 3px solid #dc2626; /* red accent border */
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    
    transform: translateY(100%);
    transition: transform 0.4s ease;
  }
  
  .news-alert.visible {
    transform: translateY(0);
  }
  
  .alert-content {
    display: flex;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
    gap: 1rem;
  }
  
  .alert-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  
  .alert-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .alert-title {
    color: #0f1115; /* dark text */
    font-weight: 600;
    font-size: 1.1rem;
    letter-spacing: 0.05em;
  }
  
  .alert-subtitle {
    color: #1a1d24; /* slightly lighter dark text */
    font-size: 0.9rem;
    font-weight: 300;
  }
  
  .dismiss-button {
    background: none;
    border: none;
    color: #0f1115; /* dark text */
    font-size: 1.5rem;
    font-weight: 300;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
    flex-shrink: 0;
  }
  
  .dismiss-button:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  .dismiss-button:active {
    background-color: rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    .alert-content {
      padding: 0.75rem 1rem;
      gap: 0.75rem;
    }
    
    .alert-title {
      font-size: 1rem;
    }
    
    .alert-subtitle {
      font-size: 0.85rem;
    }
    
    .alert-icon {
      font-size: 1.25rem;
    }
  }
</style>
