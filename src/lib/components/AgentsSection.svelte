<script lang="ts">
  import { onMount } from 'svelte';
  
  let progressBar: HTMLElement;
  let currentStep = 0;
  let isScrolling = false;
  let stepElements: HTMLElement[] = [];
  let sectionElement: HTMLElement;
  
  const steps = [
    {
      id: 'boundary',
      title: 'What is the AI boundary?',
      content: `The AI boundary is the gap between what we want computers to do for us and what computers are currently able to do. It's been a little over 40 years since the first easy-to-use computer was introduced to the public, and since then software has been torn between ever-complicated systems and easy-to-use interfaces. As systems become more complicated, it makes sense for these systems to be maintained and managed and interacted with, through another system. That's where an AI Agent comes in.`
    },
    {
      id: 'agent',
      title: 'What is an AI Agent?',
      content: `Think of an agent as an intelligent computer wrapped up as a software package. Instead of you dealing with complicated software, the software deals with itself for you. A fully autonomous AI Agent is intelligent enough and capable enough to design any workflow it needs to accomplish a task. This is a new paradigm for interacting with software, but you can simply think of it as your computer doing any task you give it!`
    },
    {
      id: 'progress',
      title: 'How close are we to fully autonomous AI Agents?',
      content: `Pretty close! Members of our team led the research group to create the world's first AI Agent, and we pushed the boundary further than ever before. Multi-agent systems, emergent engineering, evolutionary algorithms- you name it, we've been using it. We're still pushing the boundary today, with all of our existing apps and more coming out for you to try!`
    },
    {
      id: 'capability',
      title: 'Will an AI Agent do what I want it to do?',
      content: `Our goal is to make AI Agents do everything you want it to do. If you find it's not up for the task, please let us know, as our goal is push the boundary, and you found one!`
    }
  ];
  
  onMount(() => {
    const handleScroll = () => {
      if (isScrolling) return;
      
      if (!sectionElement) return;
      
      const sectionRect = sectionElement.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionHeight = sectionRect.height;
      const windowHeight = window.innerHeight;
      
      // Check if section is in view
      if (sectionTop > windowHeight || sectionTop + sectionHeight < 0) {
        return;
      }
      
      // Calculate progress within the section (0 to 1)
      const sectionProgress = Math.max(0, Math.min(1, -sectionTop / (sectionHeight - windowHeight)));
      
      // Update progress bar
      if (progressBar) {
        progressBar.style.width = `${sectionProgress * 100}%`;
      }
      
      // Determine current step based on scroll position within section
      const newStep = Math.floor(sectionProgress * steps.length);
      const clampedStep = Math.max(0, Math.min(newStep, steps.length - 1));
      
      if (clampedStep !== currentStep) {
        currentStep = clampedStep;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set up intersection observer for step elements
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = stepElements.indexOf(entry.target as HTMLElement);
            if (stepIndex !== -1 && stepIndex !== currentStep) {
              currentStep = stepIndex;
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
      }
    );
    
    stepElements.forEach((element) => {
      if (element) observer.observe(element);
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  });
  
  function scrollToStep(stepIndex: number) {
    if (isScrolling || !stepElements[stepIndex]) return;
    
    isScrolling = true;
    
    stepElements[stepIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    
    setTimeout(() => {
      isScrolling = false;
    }, 1000);
  }
</script>

<section id="agents" class="scrollytelling-section" bind:this={sectionElement}>
  <!-- Progress Bar -->
  <div class="progress-container">
    <div class="progress-bar" bind:this={progressBar}></div>
  </div>
  
  <!-- Navigation Dots -->
  <div class="navigation-dots">
    {#each steps as step, index}
      <button 
        class="dot {currentStep === index ? 'active' : ''}"
        on:click={() => scrollToStep(index)}
        aria-label="Go to {step.title}"
      ></button>
    {/each}
  </div>
  
  <!-- Steps Container -->
  <div class="steps-container">
    {#each steps as step, index}
      <div class="step" class:active={currentStep === index} bind:this={stepElements[index]}>
        <div class="step-content">
          <div class="step-number">{String(index + 1).padStart(2, '0')}</div>
          <h2 class="step-title">{step.title}</h2>
          <div class="step-text">
            {step.content}
          </div>
        </div>
        
      </div>
    {/each}
  </div>
</section>

<style>
  .scrollytelling-section {
    position: relative;
    min-height: 400vh; /* 4 steps * 100vh each */
    background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-700) 100%);
  }
  
  .progress-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 100;
  }
  
  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #00d4ff, #0099cc);
    width: 0%;
    transition: width 0.1s ease;
  }
  
  .navigation-dots {
    position: fixed;
    right: 2rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 50;
  }
  
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .dot:hover {
    border-color: rgba(255, 255, 255, 0.6);
    transform: scale(1.2);
  }
  
  .dot.active {
    background: #00d4ff;
    border-color: #00d4ff;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
  }
  
  .steps-container {
    position: relative;
  }
  
  .step {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    opacity: 0.3;
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }
  
  .step.active {
    opacity: 1;
  }
  
  .step-content {
    max-width: 800px;
    text-align: center;
    z-index: 2;
  }
  
  .step-number {
    font-size: 1rem;
    color: #00d4ff;
    font-weight: 300;
    letter-spacing: 0.2em;
    margin-bottom: 1rem;
    opacity: 0.8;
  }
  
  .step-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 200;
    margin-bottom: 2rem;
    line-height: 1.2;
    color: var(--white);
  }
  
  .step-text {
    font-size: 1.2rem;
    line-height: 1.8;
    color: var(--gray-400);
    max-width: 600px;
    margin: 0 auto;
  }
  
  
  /* Mobile Responsive */
  @media (max-width: 768px) {
    .navigation-dots {
      right: 1rem;
      gap: 0.5rem;
    }
    
    .dot {
      width: 10px;
      height: 10px;
    }
    
    .step {
      padding: 2rem 1rem;
    }
    
    .step-title {
      font-size: clamp(1.5rem, 6vw, 2.5rem);
    }
    
    .step-text {
      font-size: 1rem;
    }
    
  }
  
  @media (max-width: 480px) {
    .step-content {
      max-width: 100%;
    }
  }
</style>
