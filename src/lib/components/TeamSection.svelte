<script lang="ts">
  import { onMount } from 'svelte';

  interface TeamMember {
    name: string;
    alias?: string;
    title: string;
    age?: number;
    location?: string;
    bio: string;
    github?: string;
    social?: {
      label: string;
      url: string;
    }[];
  }

  const teamMembers: TeamMember[] = [
    {
      name: 'Kyle Steel',
      alias: 'ThyFriendlyFox',
      title: 'Chief Executive Officer',
      age: 27,
      location: 'Florida',
      bio: 'I graduated from Florida Polytechnic University with a Masters of Engineering in 2022 with a thesis focused on using Fourier-based machine learning techniques to calculate nonlinear physics systems with greater precision and speed on an Arduino running a custom algorithm than the available university supercomputer running Ansys Mechanical. My passion has always been in Artificial Intelligence, and I even led the research and development team for AutoGPT for a short period of time, unlocking the possibility of truly multi-agent systems. Since graduating, I\'ve been an ITAR and CMMC compliance system administrator. Most of my work has been developing a CMMC compliant ERP system for the manufacturing industry. I\'m a self-taught software developer and system admin with experience running businesses for a number of years now.',
      github: 'thyfriendlyfox'
    },
    {
      name: 'Ethan Shelton',
      alias: 'Spike',
      title: 'Chief Information Officer',
      age: 25,
      location: 'Florida',
      bio: 'Hello, I\'m Spike! I\'ve been coding since I was 13, diving into mods, mobile games, VR experiences, websites, AWS, and software development. I thrive on the challenge, the puzzles, and the fun of piecing it all together. Currently, I\'m focusing on my vlogging and VR YouTube channels and crafting my own AI assistant named KIT. This is only the beginning to my story of relentless creation.',
      github: 'IronLeprechaun'
    },
    {
      name: 'BentlyBro',
      title: 'Chief Technical Officer',
      bio: 'Hey, I\'m Bently — a self-taught developer, systems tinkerer, and all-around builder with a love for pushing boundaries. Whether it\'s designing encrypted chat platforms, wiring up brain-computer interfaces, or spinning up AI agents that talk to each other, I\'m always crafting something weird, useful, or both. My portfolio (which totally needs an update) showcases a mix of tools like Promptly—a live website builder powered by natural language—and NoteNavigator, an AI music recommender that ran a little too close to Spotify\'s sun. As the community lead and developer behind AutoGPT, I balance hands-on coding with leading a vibrant Discord full of chaotic brilliance. Most days you\'ll find me deep in Python, JavaScript, or building cross-device systems that just sync. Other days, I\'m designing VR worlds, experimenting with EEG data, or mapping out new ways to bring decentralized, real-time tech to life. Welcome to my world—it\'s a bit experimental, often chaotic, but always driven by curiosity.',
      github: 'Bentlybro'
    },
    {
      name: 'Colton Frear',
      title: 'Chief Financial Officer',
      location: 'Florida',
      bio: 'My name is Colton Frear, I graduated from Florida Polytechnic University with a Masters in Mechanical Engineering. My first job out of college was as a Liaison Engineer for General Dynamics Electric Boat In Newport News Virginia. While at Electric Boat I provided engineering support on the Virginia Class Nuclear Submarine program for NAVSEA. After a short time there, I moved to Palmdale California to work for Northrop Grumman Aeronautics Systems. During my time with these prime contractors I have become intimately familiar with DoD program requirements and expectations as well as improving my general technical and engineering knowledge.'
    },
    {
      name: 'Alexey Kuznetsov',
      title: 'Chief Science Officer',
      age: 25,
      location: 'Lakeland, Florida',
      bio: 'I graduated from Florida Polytechnic University with a Bachelor\'s in Computer Science focused on cybersecurity in 2022, followed by my Master\'s in 2024, with plans to complete a Master\'s in Data Science by 2028. My biggest achievement has been co-developing Dynamo, a comprehensive all-in-one system built from scratch to run machine shops of any size, using JavaScript, HTML, Python, and PowerShell scripts. What started as a challenge to modernize manufacturing operations has grown into a full-scale platform that I continue to maintain today. My mix of formal education and self-taught skills has shaped me into a versatile problem-solver who thrives on building practical solutions. I bring my cybersecurity background and hands-on development experience to tackle whatever unconventional challenges come my way. Whether it\'s maintaining enterprise systems or exploring new technologies, I\'m driven by the satisfaction of creating tools that actually make a difference.',
      github: 'AlexeyAKuznetsov'
    }
  ];

  let memberElements: (HTMLElement | null)[] = [];
  let visibleMembers = new Set<number>();

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          const newSet = new Set(visibleMembers);
          if (entry.isIntersecting) {
            newSet.add(index);
          } else {
            newSet.delete(index);
          }
          visibleMembers = newSet; // Trigger reactivity
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    memberElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      memberElements.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  });
</script>

<section id="team" class="team-section">
  <div class="wrap">
    <h2 class="section-title">Team</h2>
    <p class="team-description">Meet the people behind Reagent Systems.</p>
  </div>
  
  <div class="team-members-container">
    {#each teamMembers as member, index}
      <div 
        class="team-member-section"
        class:visible={visibleMembers.has(index)}
        bind:this={memberElements[index]}
        data-index={index}
      >
        <div class="team-member-content">
          <div class="team-card">
            {#if member.github}
              <div class="team-avatar">
                <img 
                  src="https://github.com/{member.github}.png" 
                  alt="{member.name} profile picture"
                  loading="lazy"
                />
              </div>
            {/if}
            <div class="team-card-header">
              <h3 class="team-name">{member.name}</h3>
              {#if member.alias}
                <span class="team-alias">@{member.alias}</span>
              {/if}
              <div class="team-meta">
                <span class="team-title">{member.title}</span>
                {#if member.age || member.location}
                  <span class="team-details">
                    {#if member.age}{member.age}{/if}
                    {#if member.age && member.location} • {/if}
                    {#if member.location}{member.location}{/if}
                  </span>
                {/if}
              </div>
            </div>
            <p class="team-bio">{member.bio}</p>
            <div class="team-links">
              {#if member.github}
                <a href="https://github.com/{member.github}" target="_blank" rel="noopener noreferrer" class="social-link github">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
              {/if}
              {#if member.social}
                {#each member.social as link}
                  <a href={link.url} target="_blank" rel="noopener noreferrer" class="social-link">
                    <span>{link.label}</span>
                  </a>
                {/each}
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  .team-section {
    position: relative;
    background: var(--gray-700);
    padding: 4rem 0;
    border-top: 0.0625rem solid rgba(255,255,255,0.08);
    border-bottom: 0.0625rem solid rgba(255,255,255,0.06);
  }

  .wrap {
    max-width: var(--container);
    margin: 0 auto;
    padding: 0 var(--pad);
  }

  .section-title {
    margin: 0 0 1rem 0;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 200;
    color: var(--white);
    text-align: center;
  }

  .team-description {
    margin: 0 0 4rem 0;
    font-size: 1.125rem;
    color: var(--gray-400);
    text-align: center;
    line-height: 1.6;
  }

  .team-members-container {
    position: relative;
    width: 100%;
  }

  .team-member-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem var(--pad);
    position: relative;
    opacity: 0;
    transform: translateY(3rem);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  .team-member-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .team-member-content {
    max-width: var(--container);
    width: 100%;
    margin: 0 auto;
  }

  .team-card {
    max-width: 50rem;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.03);
    border: 0.0625rem solid rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
    padding: 3rem;
    transition: all 0.4s ease;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  .team-member-section.visible .team-card {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .team-avatar {
    width: 120px;
    height: 120px;
    margin: 0 auto 2rem auto;
    border-radius: 50%;
    overflow: hidden;
    border: 0.1875rem solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    flex-shrink: 0;
  }

  .team-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .team-card-header {
    margin-bottom: 2rem;
    text-align: center;
  }

  .team-name {
    margin: 0 0 0.5rem 0;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 200;
    color: var(--white);
    line-height: 1.2;
  }

  .team-alias {
    display: block;
    font-size: 1rem;
    color: var(--gray-400);
    margin-bottom: 1rem;
    font-style: italic;
  }

  .team-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .team-title {
    font-size: 1.25rem;
    color: var(--white);
    font-weight: 200;
  }

  .team-details {
    font-size: 1rem;
    color: var(--gray-400);
  }

  .team-bio {
    margin: 0 0 2rem 0;
    font-size: 1.0625rem;
    color: var(--gray-400);
    line-height: 1.8;
    flex-grow: 1;
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 400;
    letter-spacing: 0.01em;
  }

  .team-links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: auto;
    padding-top: 1.5rem;
    border-top: 0.0625rem solid rgba(255, 255, 255, 0.08);
  }

  .social-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: rgba(255, 255, 255, 0.05);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
    border-radius: 0.375rem;
    font-size: 0.9375rem;
    color: var(--gray-400);
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .social-link:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: var(--white);
    transform: translateY(-2px);
  }

  .social-link svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  @media (max-width: 51.25rem) {
    .team-section {
      padding: 3rem 0;
    }

    .section-title {
      margin-bottom: 0.75rem;
    }

    .team-description {
      margin-bottom: 3rem;
      font-size: 1rem;
    }

    .team-member-section {
      min-height: auto;
      padding: 3rem var(--pad);
    }

    .team-card {
      padding: 2rem 1.5rem;
    }

    .team-avatar {
      width: 100px;
      height: 100px;
      margin-bottom: 1.5rem;
    }

    .team-name {
      font-size: 1.5rem;
    }

    .team-title {
      font-size: 1.125rem;
    }

    .team-bio {
      font-size: 1rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .team-member-section {
      transition: none;
      opacity: 1;
      transform: none;
    }
    .team-card {
      transition: none;
    }
    .social-link {
      transition: none;
    }
  }
</style>

