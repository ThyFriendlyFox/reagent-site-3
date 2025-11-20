<script lang="ts">
  import { onMount } from 'svelte';

  interface ProcessStep {
    title: string;
    description: string;
  }

  interface Product {
    name: string;
    displayName: string;
    description: string;
    url: string;
  }

  const processSteps: ProcessStep[] = [
    {
      title: 'Discord Hub',
      description: 'Our Discord server serves as the central nervous system of our community. It\'s where real-time conversations happen, where quick questions get immediate answers, and where spontaneous collaborations are born. Members share breakthrough moments, seek immediate feedback on prototypes, and coordinate collaborative efforts.'
    },
    {
      title: 'Creative Forum Board',
      description: 'This is where imagination runs wild. The Creative Forum Board is designed for exploration, brainstorming, and early-stage concept development. Here, members share raw ideas, experimental thoughts, and "what if" scenarios without the pressure of immediate implementation.'
    },
    {
      title: 'Project Forum Board',
      description: 'When ideas are ready to become reality, they graduate to the Project Forum Board. This space focuses on planning, execution, and refinement. Here, concepts transform into actionable roadmaps, prototypes, and eventually polished implementations.'
    },
    {
      title: 'Validation & Assistance',
      description: 'Our forum systems provide immediate feedback loops that help members understand the potential and practical challenges of their concepts. Our community includes experienced developers, researchers, and entrepreneurs who can quickly identify both the promise and pitfalls of new concepts.'
    },
    {
      title: 'Implementation',
      description: 'From concept to implementation, our community infrastructure supports the complete lifecycle of innovation. Whether you\'re a seasoned professional or someone completely new to the field, our systems provide the support structure needed to transform concepts into reality.'
    }
  ];

  const products: Product[] = [
    {
      name: 'openlawn',
      displayName: 'OpenLawn',
      description: 'The ultimate AI-powered CRM platform for modern lawn care businesses. Features multi-crew management, smart route optimization, real-time GPS tracking, and AI-powered customer intelligence.',
      url: 'https://github.com/reagent-systems/openlawn'
    },
    {
      name: 'tetra',
      displayName: 'Tetra',
      description: 'An AI-powered Android automation agent that can understand screen content and perform actions autonomously using OpenAI\'s GPT models and Android\'s Accessibility Services.',
      url: 'https://github.com/reagent-systems/tetra'
    },
    {
      name: 'Spark',
      displayName: 'Spark',
      description: 'An innovative AI agent designed to ignite creativity and accelerate idea generation and prototyping.',
      url: 'https://github.com/reagent-systems/Spark'
    },
    {
      name: 'mcp-x-posting',
      displayName: 'MCP X Posting',
      description: 'A powerful tool for automated social media posting and content management using AI agents.',
      url: 'https://github.com/reagent-systems/mcp-x-posting'
    },
    {
      name: 'Simple-Agent-Core',
      displayName: 'Simple-Agent',
      description: 'An accessible AI agent platform that makes it easy to create and deploy intelligent assistants for everyday tasks.',
      url: 'https://github.com/reagent-systems/Simple-Agent-Core'
    }
  ];

  let processElements: (HTMLElement | null)[] = [];
  let productElements: (HTMLElement | null)[] = [];
  let visibleProcessSteps = new Set<number>();
  let visibleProducts = new Set<number>();

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          const type = entry.target.getAttribute('data-type') || '';
          const newSet = type === 'process' 
            ? new Set(visibleProcessSteps)
            : new Set(visibleProducts);
          
          if (entry.isIntersecting) {
            newSet.add(index);
          } else {
            newSet.delete(index);
          }
          
          if (type === 'process') {
            visibleProcessSteps = newSet;
          } else {
            visibleProducts = newSet;
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    [...processElements, ...productElements].forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      [...processElements, ...productElements].forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  });
</script>

<section id="products" class="section">
  <div class="wrap">
    <h2 class="section-title">products</h2>
    <p class="section-subtitle">From idea to implementation: Our product creation process and top solutions</p>
  </div>

  <div class="products-container">
    <div class="products-split">
      <!-- Left Side: Process Steps -->
      <div class="process-column">
        <h3 class="column-title">Our Process</h3>
        <div class="process-steps">
          {#each processSteps as step, index}
            <div 
              class="process-step"
              class:visible={visibleProcessSteps.has(index)}
              bind:this={processElements[index]}
              data-index={index}
              data-type="process"
            >
              <div class="step-number">{index + 1}</div>
              <div class="step-content">
                <h4 class="step-title">{step.title}</h4>
                <p class="step-description">{step.description}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Right Side: Products -->
      <div class="products-column">
        <h3 class="column-title">Top Products</h3>
        <div class="products-list">
          {#each products as product, index}
            <div 
              class="product-card"
              class:visible={visibleProducts.has(index)}
              bind:this={productElements[index]}
              data-index={index}
              data-type="product"
            >
              <h4 class="product-name">{product.displayName}</h4>
              <p class="product-description">{product.description}</p>
              {#if product.url}
                <a href={product.url} class="product-link" target="_blank" rel="noopener noreferrer">
                  View on GitHub →
                </a>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .section {
    position: relative;
    background: var(--gray-700);
    padding: 4rem 0;
    border-top: 0.0625rem solid rgba(255,255,255,0.08);
    border-bottom: 0.0625rem solid rgba(255,255,255,0.06);
    min-height: 100vh;
  }

  .wrap {
    max-width: var(--container);
    margin: 0 auto;
    padding: 0 var(--pad);
    text-align: center;
    margin-bottom: 4rem;
  }

  .section-title {
    margin: 0 0 1rem 0;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 200;
    color: var(--white);
    letter-spacing: 0.05em;
  }

  .section-subtitle {
    margin: 0;
    font-size: 1.125rem;
    color: var(--gray-400);
    line-height: 1.6;
  }

  .products-container {
    max-width: var(--container);
    margin: 0 auto;
    padding: 0 var(--pad);
  }

  .products-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;
  }

  .process-column,
  .products-column {
    display: flex;
    flex-direction: column;
  }

  .column-title {
    margin: 0 0 2rem 0;
    font-size: 1.5rem;
    font-weight: 200;
    color: var(--white);
    letter-spacing: 0.05em;
    text-align: left;
  }

  .process-steps {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .process-step {
    display: flex;
    gap: 1.5rem;
    opacity: 0;
    transform: translateX(-2rem);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  .process-step.visible {
    opacity: 1;
    transform: translateX(0);
  }

  .step-number {
    flex-shrink: 0;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: 0.0625rem solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 200;
    color: var(--white);
  }

  .step-content {
    flex: 1;
  }

  .step-title {
    margin: 0 0 0.75rem 0;
    font-size: 1.25rem;
    font-weight: 200;
    color: var(--white);
  }

  .step-description {
    margin: 0;
    font-size: 0.9375rem;
    color: var(--gray-400);
    line-height: 1.7;
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .products-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .product-card {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0.75rem;
    padding: 2rem;
    opacity: 0;
    transform: translateX(2rem);
    transition: opacity 0.8s ease, transform 0.8s ease, box-shadow 0.3s ease;
    position: relative;
    border: 0.125rem solid transparent;
    background-clip: padding-box;
    cursor: pointer;
  }

  .product-card:hover {
    transform: translateX(0) translateY(-4px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.4),
      0 0 30px rgba(255, 215, 0, 0.3),
      inset 0 0 20px rgba(255, 215, 0, 0.08);
  }

  .product-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 0.75rem;
    padding: 0.125rem;
    background: linear-gradient(
      135deg,
      #d4af37 0%,
      #ffd700 25%,
      #ffed4e 50%,
      #ffd700 75%,
      #d4af37 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0.6;
    animation: goldShine 3s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes goldShine {
    0%, 100% {
      background: linear-gradient(
        135deg,
        #d4af37 0%,
        #ffd700 25%,
        #ffed4e 50%,
        #ffd700 75%,
        #d4af37 100%
      );
      opacity: 0.6;
    }
    50% {
      background: linear-gradient(
        135deg,
        #ffd700 0%,
        #ffed4e 25%,
        #fff8dc 50%,
        #ffed4e 75%,
        #ffd700 100%
      );
      opacity: 0.9;
    }
  }

  .product-card.visible {
    opacity: 1;
    transform: translateX(0);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(255, 215, 0, 0.2),
      inset 0 0 20px rgba(255, 215, 0, 0.05);
  }

  .product-card.visible::before {
    opacity: 0.9;
  }

  .product-name {
    margin: 0 0 1rem 0;
    font-size: 1.75rem;
    font-weight: 200;
    color: var(--white);
    letter-spacing: 0.02em;
  }

  .product-description {
    margin: 0 0 1rem 0;
    font-size: 0.9375rem;
    color: var(--gray-400);
    line-height: 1.7;
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .product-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--gray-400);
    text-decoration: none;
    font-size: 0.9375rem;
    transition: color 0.3s ease, transform 0.2s ease;
    position: relative;
    z-index: 1;
    pointer-events: auto;
  }

  .product-link:hover {
    color: var(--white);
    transform: translateX(4px);
  }

  .product-card:hover .product-link {
    color: var(--white);
  }

  @media (max-width: 51.25rem) {
    .section {
      padding: 3rem 0;
    }

    .wrap {
      margin-bottom: 3rem;
    }

    .section-title {
      margin-bottom: 0.75rem;
    }

    .section-subtitle {
      font-size: 1rem;
    }

    .products-split {
      grid-template-columns: 1fr;
      gap: 3rem;
    }

    .column-title {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .process-step {
      flex-direction: column;
      gap: 1rem;
    }

    .step-number {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1rem;
    }

    .product-card {
      padding: 1.5rem;
    }

    .product-name {
      font-size: 1.5rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .process-step,
    .product-card {
      transition: none;
      opacity: 1;
      transform: none;
    }
    .product-card::before {
      animation: none;
    }
  }
</style>
