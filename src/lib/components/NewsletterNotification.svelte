<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { browser } from '$app/environment';
  import { db } from '$lib/firebase';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
  
  let isExpanded = false;
  let email = '';
  let isSubmitting = false;
  let showSuccess = false;
  let isVisible = true;
  let submitMessage = '';
  let bannerElement: HTMLElement;
  let emailInput: HTMLInputElement;

  function handleClickOutside(event: MouseEvent) {
    if (isExpanded && bannerElement && !bannerElement.contains(event.target as Node)) {
      isExpanded = false;
    }
  }

  onMount(() => {
    console.log('NewsletterNotification component mounted');
    // Add click outside handler only in browser
    if (browser) {
      document.addEventListener('click', handleClickOutside);
    }
  });

  onDestroy(() => {
    if (browser) {
      document.removeEventListener('click', handleClickOutside);
    }
  });

  async function expandBanner() {
    if (!isExpanded) {
      isExpanded = true;
      
      // Focus the email input after animation
      await tick(); // Wait for DOM update
      // Small delay to ensure form is visible
      setTimeout(() => {
        emailInput?.focus();
      }, 100);
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (!email || isSubmitting) return;
    
    // Validate email format
    if (!email.includes('@')) {
      submitMessage = 'Please enter a valid email address';
      showSuccess = false;
      return;
    }
    
    if (!db) {
      submitMessage = 'Firebase not initialized. Please refresh the page.';
      showSuccess = false;
      return;
    }
    
    isSubmitting = true;
    submitMessage = '';
    
    try {
      await addDoc(collection(db, 'newsletter'), {
        email: email,
        timestamp: serverTimestamp()
      });
      
      submitMessage = 'Thank you! You\'ve been added to the newsletter.';
      showSuccess = true;
      email = '';
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        showSuccess = false;
        isExpanded = false;
        submitMessage = '';
      }, 3000);
      
    } catch (error: any) {
      console.error('Newsletter signup failed:', error);
      if (error?.code === 'permission-denied') {
        submitMessage = 'Permission denied. Please check Firebase security rules.';
      } else {
        submitMessage = 'Something went wrong. Please try again.';
      }
      showSuccess = false;
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
  on:click|stopPropagation={expandBanner}
  on:keydown={(e) => e.key === 'Enter' && expandBanner()}
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
          <span>{submitMessage || 'Thank you for subscribing! We\'ll keep you updated.'}</span>
        </div>
      {:else}
        <form on:submit={handleSubmit} on:click|stopPropagation>
          <div class="form-group">
            <label for="newsletter-email" class="visually-hidden">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              bind:value={email}
              bind:this={emailInput}
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
          {#if submitMessage && !showSuccess}
            <div class="error-message">
              {submitMessage}
            </div>
          {/if}
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

  .error-message {
    padding: 0.75rem 0;
    font-size: 0.9rem;
    color: rgba(255, 200, 200, 0.95);
    text-align: center;
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
