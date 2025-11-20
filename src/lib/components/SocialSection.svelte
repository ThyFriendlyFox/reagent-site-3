<script lang="ts">
  interface SocialPlatform {
    name: string;
    displayName: string;
    icon: string;
    url: string;
    description: string;
    linkText: string;
  }

  const platforms: SocialPlatform[] = [
    {
      name: 'Discord',
      displayName: 'Discord',
      icon: '/social/Discord-Symbol-White.svg',
      url: 'https://discord.reagent-systems.com',
      description: 'Join our Discord community for real-time discussions, development updates, and collaboration opportunities. Connect with developers, researchers, and AI enthusiasts.',
      linkText: 'discord.reagent-systems.com'
    },
    {
      name: 'X',
      displayName: 'X',
      icon: '/social/x_logo.svg',
      url: 'https://x.com/Reagent_Systems',
      description: 'Follow us on X for announcements, technical insights, breakthrough moments, and updates on our revolutionary AI architecture development.',
      linkText: '@Reagent_Systems'
    }
  ];
</script>

<section id="social" class="section">
  <div class="section-content">
    <h2 class="section-title">Connect With Us</h2>
    <p class="section-subtitle">Join our community and stay updated with the latest developments in decentralized AI and federated learning.</p>
    
    <div class="social-platforms">
      {#each platforms as platform}
        <a 
          href={platform.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          class="platform-card"
          class:discord={platform.name === 'Discord'}
          class:x={platform.name === 'X'}
        >
          <div class="platform-icon">
            <img src={platform.icon} alt="{platform.name} logo" />
          </div>
          <h3 class="platform-name">{platform.displayName}</h3>
          <p class="platform-description">{platform.description}</p>
          <div class="platform-link">{platform.linkText}</div>
        </a>
      {/each}
    </div>
    
    <p class="section-footer">Be part of the revolution in decentralized AI</p>
  </div>
</section>

<style>
  .section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background: var(--gray-900);
    color: var(--white);
    border-top: 0.0625rem solid rgba(255,255,255,0.08);
    border-bottom: 0.0625rem solid rgba(255,255,255,0.06);
  }
  
  .section-content {
    max-width: 1200px;
    width: 100%;
    text-align: center;
  }
  
  .section-title {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 200;
    margin: 0 0 1rem 0;
    letter-spacing: 0.05em;
    color: var(--white);
    font-family: 'avionic', monospace;
  }
  
  .section-subtitle {
    font-size: clamp(1rem, 2vw, 1.25rem);
    color: var(--gray-400);
    margin: 0 0 3rem 0;
    line-height: 1.6;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    font-family: 'avionic', monospace;
  }

  .social-platforms {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-bottom: 3rem;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  .platform-card {
    background: rgba(255, 255, 255, 0.03);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    padding: 2.5rem 2rem;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    text-align: center;
    position: relative;
    align-items: center;
  }

  .platform-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 0.5rem;
    padding: 0.0625rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .platform-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  .platform-card:hover::before {
    opacity: 1;
  }

  .platform-icon {
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .platform-icon img {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  .platform-name {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 200;
    color: var(--white);
    font-family: 'avionic', monospace;
    letter-spacing: 0.02em;
  }

  .platform-description {
    margin: 0 0 1.5rem 0;
    font-size: 0.9375rem;
    color: var(--white);
    line-height: 1.6;
    flex-grow: 1;
    font-family: 'avionic', monospace;
  }

  .platform-link {
    font-size: 0.875rem;
    color: var(--white);
    margin-top: auto;
    font-family: 'avionic', monospace;
    opacity: 0.9;
  }

  .section-footer {
    font-size: 1.125rem;
    color: var(--white);
    margin: 0;
    font-family: 'avionic', monospace;
  }
  
  @media (max-width: 768px) {
    .section {
      padding: 3rem 1rem;
    }

    .section-title {
      font-size: 2rem;
    }
    
    .section-subtitle {
      font-size: 1rem;
    }

    .social-platforms {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .platform-card {
      padding: 2rem 1.5rem;
    }

    .platform-icon img {
      width: 40px;
      height: 40px;
    }

    .platform-name {
      font-size: 1.25rem;
    }

    .platform-description {
      font-size: 0.875rem;
    }

    .platform-link {
      font-size: 0.8125rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .platform-card {
      transition: none;
    }
    .platform-link svg {
      transition: none;
    }
  }
</style>

