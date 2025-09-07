<script lang="ts">
  import { onMount } from 'svelte';
  
  let isExpanded = false;
  let email = '';
  let isSubmitting = false;
  let showSuccess = false;
  let isVisible = true;
  let bannerElement: HTMLElement;

  onMount(() => {
    console.log('NewsletterNotification component mounted');
  });

  function toggleExpansion() {
    isExpanded = !isExpanded;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (!email || isSubmitting) return;
    
    isSubmitting = true;
    
    try {
      // Simulate API call - replace with actual newsletter signup endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess = true;
      email = '';
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        showSuccess = false;
        isExpanded = false;
      }, 3000);
      
    } catch (error) {
      console.error('Newsletter signup failed:', error);
    } finally {
      isSubmitting = false;
    }
  }

  function closeBanner() {
    isVisible = false;
  }
</script>

<!-- Newsletter Notification Banner -->
{#if isVisible}
<div 
  class="newsletter-notification" 
  class:expanded={isExpanded}
  bind:this={bannerElement}
  role="button"
  aria-label="Newsletter signup notification"
  on:click={toggleExpansion}
  on:keydown={(e) => e.key === 'Enter' && toggleExpansion()}
  tabindex="0"
>
  <div class="banner-content">
    <!-- Collapsed state - clickable banner -->
    <div class="banner-header">
      <div class="banner-text">
        <span class="message">Sign up for our newsletter</span>
      </div>
      <button class="close-btn" on:click|stopPropagation={closeBanner} aria-label="Close notification">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- Expanded state - newsletter form -->
    <div class="newsletter-form" class:show={isExpanded}>
      {#if showSuccess}
        <div class="success-message">
          <span class="success-icon">✅</span>
          <span>Thank you for subscribing! We'll keep you updated.</span>
        </div>
      {:else}
        <form on:submit={handleSubmit}>
          <div class="form-group">
            <label for="newsletter-email" class="visually-hidden">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              bind:value={email}
              placeholder="Enter your email address"
              required
              disabled={isSubmitting}
              class="email-input"
            />
            <button 
              type="submit" 
              disabled={isSubmitting || !email}
              class="subscribe-btn"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </form>
      {/if}
    </div>
  </div>
</div>
{/if}

<style>
  .newsletter-notification {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(0);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
  }

  .newsletter-notification:hover:not(.expanded) {
    transform: translateY(-8px);
  }

  .newsletter-notification:focus {
    outline: none;
  }

  .banner-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .banner-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 0;
    position: relative;
  }

  .banner-text {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    justify-content: center;
  }

  .icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .message {
    font-size: 0.95rem;
    font-weight: 500;
    flex: 1;
  }

  .cta {
    font-size: 0.85rem;
    opacity: 0.9;
    font-weight: 400;
  }

  .close-btn {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    flex-shrink: 0;
  }

  .close-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .newsletter-form {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .newsletter-form.show {
    max-height: 200px;
  }

  .form-group {
    display: flex;
    gap: 0.75rem;
    padding: 1.5rem 0;
    align-items: center;
  }

  .email-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 0.95rem;
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
  }

  .email-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  .email-input:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }

  .email-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .subscribe-btn {
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    color: white;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
    flex-shrink: 0;
  }

  .subscribe-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .subscribe-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .success-message {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem 0;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .success-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .banner-content {
      padding: 0 0.75rem;
    }

    .banner-text {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .message {
      font-size: 0.9rem;
    }

    .cta {
      font-size: 0.8rem;
    }

    .form-group {
      flex-direction: column;
      gap: 0.75rem;
      align-items: stretch;
    }

    .email-input,
    .subscribe-btn {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .banner-header {
      padding: 0.75rem 0;
    }

    .form-group {
      padding: 1rem 0;
    }
  }
</style>
