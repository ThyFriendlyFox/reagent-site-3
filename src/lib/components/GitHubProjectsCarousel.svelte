<script lang="ts">
  import { onMount, tick } from 'svelte';

  type GitHubProject = {
    id: number;
    name: string;
    fullName: string;
    description: string;
    url: string;
    homepage: string | null;
    language: string | null;
    stars: number;
    forks: number;
    topics: string[];
    updatedAt: string;
  };

  let projects: GitHubProject[] = [];

  // Animation state
  let containerEl: HTMLElement | null = null;
  let beltAEl: HTMLDivElement | null = null;
  let beltWidth = 0; // width of one full belt (in px)
  let offsetX = 0; // current leftward offset (px)
  let lastFrameTs = 0;
  let rafId: number | null = null;
  const BASE_DURATION_S = 180; // 3 minutes for full rotation (slower than reviews)
  const MIN_SPEED_PX_S = 6; // ensure it always moves

  // Interaction state
  let isInteracting = false;
  let dragStartX = 0;
  let dragOffsetX = 0;
  let userOffsetX = 0; // User's drag/swipe offset
  let interactionStartTime = 0;
  let lastInteractionTime = 0;
  let hasMoved = false; // Track if user actually dragged
  const INTERACTION_DECAY_MS = 300; // Time after interaction ends before resuming full speed
  const DRAG_THRESHOLD = 5; // Pixels to move before considering it a drag

  function computeBaseSpeed(): number {
    if (beltWidth <= 0) return MIN_SPEED_PX_S;
    // Slow down during interaction
    if (isInteracting) {
      return Math.max(MIN_SPEED_PX_S * 0.3, beltWidth / BASE_DURATION_S);
    }
    // Gradually resume speed after interaction
    const timeSinceInteraction = performance.now() - lastInteractionTime;
    if (timeSinceInteraction < INTERACTION_DECAY_MS) {
      const factor = timeSinceInteraction / INTERACTION_DECAY_MS;
      return Math.max(MIN_SPEED_PX_S, beltWidth / BASE_DURATION_S) * (0.3 + 0.7 * factor);
    }
    return Math.max(MIN_SPEED_PX_S, beltWidth / BASE_DURATION_S);
  }

  function startAnimation() {
    stopAnimation();
    lastFrameTs = performance.now();
    const frame = (ts: number) => {
      const dt = Math.max(0, (ts - lastFrameTs) / 1000);
      lastFrameTs = ts;
      const base = computeBaseSpeed();
      
      // Only advance automatic animation if not actively dragging
      if (!isInteracting) {
        offsetX -= base * dt;
      }
      
      // Apply user offset
      const totalOffset = offsetX + userOffsetX;
      
      // Wrap offset to [-beltWidth, 0)
      if (beltWidth > 0) {
        let wrappedOffset = totalOffset;
        if (wrappedOffset <= -beltWidth) wrappedOffset += beltWidth;
        if (wrappedOffset >= 0) wrappedOffset -= beltWidth;
        offsetX = wrappedOffset - userOffsetX;
      }
      
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);
  }

  function stopAnimation() {
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function handleInteractionStart(clientX: number) {
    isInteracting = true;
    dragStartX = clientX;
    dragOffsetX = 0;
    hasMoved = false;
    interactionStartTime = performance.now();
  }

  function handleInteractionMove(clientX: number) {
    if (!isInteracting) return;
    dragOffsetX = clientX - dragStartX;
    const absOffset = Math.abs(dragOffsetX);
    
    // Only consider it a drag if moved beyond threshold
    if (absOffset > DRAG_THRESHOLD) {
      hasMoved = true;
      userOffsetX = dragOffsetX;
    }
  }

  function handleInteractionEnd() {
    if (!isInteracting) return;
    const wasDragging = hasMoved && Math.abs(userOffsetX) > DRAG_THRESHOLD;
    isInteracting = false;
    lastInteractionTime = performance.now();
    
    if (wasDragging) {
      // Gradually decay user offset back to 0
      const decayStart = userOffsetX;
      const decayDuration = 200; // ms
      const startTime = performance.now();
      
      const decay = () => {
        const elapsed = performance.now() - startTime;
        if (elapsed < decayDuration) {
          const progress = elapsed / decayDuration;
          // Ease out
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          userOffsetX = decayStart * (1 - easeProgress);
          requestAnimationFrame(decay);
        } else {
          userOffsetX = 0;
        }
      };
      requestAnimationFrame(decay);
    } else {
      // Reset immediately if it was just a click
      userOffsetX = 0;
    }
    
    hasMoved = false;
  }

  // Touch handlers
  function handleTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      handleInteractionStart(e.touches[0].clientX);
    }
  }

  function handleTouchMove(e: TouchEvent) {
    if (e.touches.length === 1 && isInteracting) {
      handleInteractionMove(e.touches[0].clientX);
      // Only prevent default if actually dragging
      if (hasMoved) {
        e.preventDefault();
      }
    }
  }

  function handleTouchEnd(e: TouchEvent) {
    if (isInteracting) {
      // Only prevent default if it was a drag
      if (hasMoved && Math.abs(userOffsetX) > DRAG_THRESHOLD) {
        e.preventDefault();
      }
      handleInteractionEnd();
    }
  }

  // Mouse handlers
  function handleMouseDown(e: MouseEvent) {
    if (e.button === 0) { // Left mouse button
      handleInteractionStart(e.clientX);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (isInteracting) {
      handleInteractionMove(e.clientX);
      // Only prevent default if actually dragging
      if (hasMoved) {
        e.preventDefault();
      }
    }
  }

  function handleMouseUp(e: MouseEvent) {
    handleInteractionEnd();
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  async function measureAndStart() {
    await tick();
    // measure after DOM update
    if (beltAEl) {
      beltWidth = beltAEl.scrollWidth;
    }
    startAnimation();
  }

  async function loadProjects() {
    try {
      const res = await fetch('/api/github-projects');
      if (!res.ok) throw new Error('failed');
      const data: { projects?: GitHubProject[] } = await res.json();
      projects = (data.projects ?? []).filter((p) => p && p.name);
      if (projects.length === 0) return;
      await measureAndStart();
    } catch (e) {
      console.error('Failed to load GitHub projects:', e);
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  onMount(loadProjects);
</script>

{#if projects.length}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <section 
    class="github-projects-carousel" 
    class:interacting={isInteracting}
    aria-label="Open source projects" 
    bind:this={containerEl}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
    on:mousedown={handleMouseDown}
  >
    <div class="hero-overlay">
      <div class="belt b1" aria-hidden="true" bind:this={beltAEl}
           style={`transform: translate3d(${offsetX + userOffsetX}px,0,0);`}>
      {#each projects as project (project.id)}
        <a href={project.url} target="_blank" rel="noopener noreferrer" class="card">
          <div class="card-header">
            <h3 class="project-name">{project.name}</h3>
            {#if project.language}
              <span class="language">{project.language}</span>
            {/if}
          </div>
          <p class="description">{project.description}</p>
          <div class="card-footer">
            <div class="stats">
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                </svg>
                {project.stars}
              </span>
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                </svg>
                {project.forks}
              </span>
            </div>
            <span class="updated">Updated {formatDate(project.updatedAt)}</span>
          </div>
          {#if project.topics.length > 0}
            <div class="topics">
              {#each project.topics.slice(0, 3) as topic}
                <span class="topic">{topic}</span>
              {/each}
            </div>
          {/if}
        </a>
      {/each}
      {#each projects as project (project.id + '-clone1')}
        <a href={project.url} target="_blank" rel="noopener noreferrer" class="card">
          <div class="card-header">
            <h3 class="project-name">{project.name}</h3>
            {#if project.language}
              <span class="language">{project.language}</span>
            {/if}
          </div>
          <p class="description">{project.description}</p>
          <div class="card-footer">
            <div class="stats">
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                </svg>
                {project.stars}
              </span>
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                </svg>
                {project.forks}
              </span>
            </div>
            <span class="updated">Updated {formatDate(project.updatedAt)}</span>
          </div>
          {#if project.topics.length > 0}
            <div class="topics">
              {#each project.topics.slice(0, 3) as topic}
                <span class="topic">{topic}</span>
              {/each}
            </div>
          {/if}
        </a>
      {/each}
      </div>
      <div class="belt b2" aria-hidden="true"
           style={`transform: translate3d(${offsetX + beltWidth + userOffsetX}px,0,0);`}>
      {#each projects as project (project.id + '-b2')}
        <a href={project.url} target="_blank" rel="noopener noreferrer" class="card">
          <div class="card-header">
            <h3 class="project-name">{project.name}</h3>
            {#if project.language}
              <span class="language">{project.language}</span>
            {/if}
          </div>
          <p class="description">{project.description}</p>
          <div class="card-footer">
            <div class="stats">
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                </svg>
                {project.stars}
              </span>
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                </svg>
                {project.forks}
              </span>
            </div>
            <span class="updated">Updated {formatDate(project.updatedAt)}</span>
          </div>
          {#if project.topics.length > 0}
            <div class="topics">
              {#each project.topics.slice(0, 3) as topic}
                <span class="topic">{topic}</span>
              {/each}
            </div>
          {/if}
        </a>
      {/each}
      {#each projects as project (project.id + '-clone2')}
        <a href={project.url} target="_blank" rel="noopener noreferrer" class="card">
          <div class="card-header">
            <h3 class="project-name">{project.name}</h3>
            {#if project.language}
              <span class="language">{project.language}</span>
            {/if}
          </div>
          <p class="description">{project.description}</p>
          <div class="card-footer">
            <div class="stats">
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                </svg>
                {project.stars}
              </span>
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                </svg>
                {project.forks}
              </span>
            </div>
            <span class="updated">Updated {formatDate(project.updatedAt)}</span>
          </div>
          {#if project.topics.length > 0}
            <div class="topics">
              {#each project.topics.slice(0, 3) as topic}
                <span class="topic">{topic}</span>
              {/each}
            </div>
          {/if}
        </a>
      {/each}
      </div>
      <div class="belt b2" aria-hidden="true"
           style={`transform: translate3d(${offsetX + beltWidth + userOffsetX}px,0,0);`}>
      {#each projects as project (project.id + '-b2')}
        <a href={project.url} target="_blank" rel="noopener noreferrer" class="card">
          <div class="card-header">
            <h3 class="project-name">{project.name}</h3>
            {#if project.language}
              <span class="language">{project.language}</span>
            {/if}
          </div>
          <p class="description">{project.description}</p>
          <div class="card-footer">
            <div class="stats">
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                </svg>
                {project.stars}
              </span>
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                </svg>
                {project.forks}
              </span>
            </div>
            <span class="updated">Updated {formatDate(project.updatedAt)}</span>
          </div>
          {#if project.topics.length > 0}
            <div class="topics">
              {#each project.topics.slice(0, 3) as topic}
                <span class="topic">{topic}</span>
              {/each}
            </div>
          {/if}
        </a>
      {/each}
      {#each projects as project (project.id + '-clone2')}
        <a href={project.url} target="_blank" rel="noopener noreferrer" class="card">
          <div class="card-header">
            <h3 class="project-name">{project.name}</h3>
            {#if project.language}
              <span class="language">{project.language}</span>
            {/if}
          </div>
          <p class="description">{project.description}</p>
          <div class="card-footer">
            <div class="stats">
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                </svg>
                {project.stars}
              </span>
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                </svg>
                {project.forks}
              </span>
            </div>
            <span class="updated">Updated {formatDate(project.updatedAt)}</span>
          </div>
          {#if project.topics.length > 0}
            <div class="topics">
              {#each project.topics.slice(0, 3) as topic}
                <span class="topic">{topic}</span>
              {/each}
            </div>
          {/if}
        </a>
      {/each}
      </div>
    </div>
    <div class="carousel-title">
      <h2 class="title-line"><span class="title-word">team</span> <span class="title-word">reagent</span></h2>
    </div>
  </section>
{/if}

<style>
  .github-projects-carousel {
    position: relative;
    overflow: hidden;
    width: 100%;
    max-width: 100vw;
    margin: 0;
    padding: calc(clamp(20rem, 50vh, 20rem) + 1rem) 0 1rem var(--hero-left-pad, 1.25rem);
    min-height: calc(clamp(20rem, 50vh, 30rem) + 22rem);
    z-index: 2;
    color: #f8f9fa;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
    touch-action: pan-y pinch-zoom;
  }

  .github-projects-carousel.interacting {
    cursor: grabbing !important;
  }

  .github-projects-carousel:not(.interacting) {
    cursor: grab;
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-width: 100vw;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .carousel-title {
    position: absolute;
    bottom: 19rem;
    left: var(--hero-left-pad, 1.25rem);
    z-index: 3;
    color: #f8f9fa;
    pointer-events: none;
    text-align: left;
  }

  .title-word {
    display: inline;
  }

  .title-line {
    margin: 0;
    line-height: 1.05;
    letter-spacing: -0.01em;
    font-weight: 200;
    font-size: clamp(2.25rem, 7vw, 6rem);
    color: #000000;
    display: block;
  }

  .belt {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    gap: clamp(1rem, 3vw, 1.5rem);
    width: max-content;
    will-change: transform;
    padding-top: calc(clamp(20rem, 50vh, 30rem) + 5rem);
    padding-left: var(--hero-left-pad, 1.25rem);
    padding-right: var(--hero-left-pad, 1.25rem);
    z-index: 1;
  }

  .card {
    flex: 0 0 auto;
    width: clamp(18rem, 85vw, 24rem);
    max-width: calc(100vw - 3rem);
    background: rgba(16, 18, 23, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 0.75rem;
    padding: clamp(1rem, 2vw, 1.5rem);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
    text-decoration: none;
    color: inherit;
    backdrop-filter: blur(8px);
    box-sizing: border-box;
    cursor: pointer;
    pointer-events: auto;
    position: relative;
  }

  .card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(16, 18, 23, 0.95);
  }

  .card:active {
    transform: translateY(-2px) scale(1.01);
    transition: transform 0.1s ease;
  }

  .card:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .project-name {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 300;
    color: #f8f9fa;
    line-height: 1.3;
    flex: 1;
  }

  .language {
    font-size: 0.875rem;
    color: #a7adba;
    padding: 0.25rem 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.25rem;
    white-space: nowrap;
  }

  .description {
    margin: 0;
    color: #e5e7eb;
    font-size: 0.95rem;
    line-height: 1.5;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 400;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .stats {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: #a7adba;
    font-size: 0.875rem;
  }

  .stat svg {
    opacity: 0.7;
  }

  .updated {
    color: #6b7280;
    font-size: 0.8rem;
  }

  .topics {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: auto;
  }

  .topic {
    font-size: 0.75rem;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid rgba(96, 165, 250, 0.2);
  }

  @media (max-width: 51.25rem) {
    .github-projects-carousel {
      padding: calc(clamp(15rem, 40vh, 25rem) + 0.75rem) 0 1.5rem var(--hero-left-pad, 1.25rem);
      min-height: calc(clamp(20rem, 50vh, 30rem) + 15rem);
    }

    .hero-overlay {
      height: 100%;
    }

    .carousel-title {
      bottom: 20rem;
    }

    .title-word {
      display: block;
    }

    .title-line {
      font-size: clamp(3.5rem, 14vw, 6rem);
    }

    .belt {
      padding-top: calc(clamp(15rem, 40vh, 25rem) + 0.5rem);
      padding-left: var(--hero-left-pad, 1.25rem);
      padding-right: var(--hero-left-pad, 1.25rem);
      gap: 1rem;
    }

    .card {
      width: clamp(16rem, 90vw, 20rem);
      padding: 1.25rem;
    }

    .project-name {
      font-size: 1.1rem;
    }

    .card-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .stats {
      gap: 0.75rem;
    }
  }

  @media (max-width: 30rem) {
    .card {
      width: calc(100vw - 2rem);
      max-width: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .belt {
      animation: none;
    }
    .card {
      transition: none;
    }
  }
</style>

