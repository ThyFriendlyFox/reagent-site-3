<script lang="ts">
  const email = 'support@reagent-systems.com';
  const subject = encodeURIComponent('Research Inquiry');
  const body = encodeURIComponent(
    'Hello,\n\n' +
    'I am interested in learning more about your research that is currently undergoing review processes.\n\n' +
    'Could you please provide me with additional information?\n\n' +
    'Thank you!'
  );
  
  const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
  
  function handleEmailClick(event: MouseEvent) {
    event.preventDefault();
    window.location.href = mailtoLink;
  }
</script>

<section id="research" class="section">
  <div class="section-content">
    <h2 class="section-title">research</h2>

    <div class="research-details">
      <h3 class="details-title">Decentralized Federated Learning Network</h3>
      
      <div class="research-content">
        <div class="research-item">
          <p>We propose a decentralized federated learning network to train a 1.58-bit FP4 quantized language model based on Hinton's forward-forward algorithm, trained on function calls. This approach enables training language models that are far cheaper, faster, and more private than traditional methods.</p>
        </div>

        <div class="research-item">
          <h4 class="research-item-title">Key Innovations</h4>
          <ul class="research-list">
            <li><strong>Forward-Forward Algorithm:</strong> Replaces backpropagation with dual forward passes, enabling greater parallelization of Large Language Model training</li>
            <li><strong>Ternary Weights & FP4 Quantization:</strong> Extreme compression (log2(3) ~1.58 bits) achieving 10-100x cost reductions while maintaining accuracy</li>
            <li><strong>Federated Learning:</strong> Decentralized training on edge devices, keeping data local and preserving privacy</li>
            <li><strong>Function Call Training:</strong> Specialized datasets generated from application usage patterns</li>
          </ul>
        </div>

        <div class="research-item">
          <h4 class="research-item-title">Advantages Over Traditional Methods</h4>
          <p>Unlike traditional transformer-based LLMs that rely on backpropagation, high-bit precision (FP16/32), and massive centralized GPU clusters, our approach eliminates backpropagation entirely, uses extreme quantization, and decentralizes training via federated protocols. This results in:</p>
          <ul class="research-list">
            <li>10-100x cost reductions compared to centralized training</li>
            <li>Faster convergence through parallelism</li>
            <li>Inherent privacy by keeping data local—no raw data sharing</li>
            <li>Ability to run on edge devices, mobile processors, and embedded systems</li>
          </ul>
        </div>

        <div class="research-item">
          <h4 class="research-item-title">Potential Applications</h4>
          <p>Our model architecture can be embedded into systems ranging from microcontrollers to cloud-based applications. By making the model incredibly small and accurate, we can extend AI capabilities to smaller devices where competition remains low due to limited compute. Mobile devices are a primary target, where our model runs faster, maintains privacy, and is dedicated to function calls—essential for effective AI agents.</p>
        </div>

        <div class="research-item">
          <h4 class="research-item-title">Status</h4>
          <p>This research is currently under review through the National Science Foundation (NSF) SBIR program. Our team, originating from the AutoGPT research and development lab in 2023, has developed three applications, three agents, and a framework for training LLM models on Apple Silicon hardware.</p>
        </div>
      </div>
    </div>

    <div class="section-body">
      <p>Our research focuses on advancing the frontiers of artificial intelligence, machine learning, and human-AI collaboration.</p>
      <p>Our current research is undergoing review processes. If you'd like to learn more, please get in touch with us.</p>
    </div>
    <a 
      href={mailtoLink}
      on:click={handleEmailClick}
      class="email-button"
    >
      <button type="button">Contact Us About Research</button>
    </a>
  </div>
</section>

<style>
  .section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: var(--gray-700);
    color: var(--white);
  }
  
  .section-content {
    max-width: 1200px;
    text-align: center;
  }
  
  .section-title {
    font-size: 3rem;
    font-weight: 200;
    margin-bottom: 2rem;
    letter-spacing: 0.05em;
    color: var(--white);
  }
  
  .section-body {
    font-size: 1.2rem;
    line-height: 1.6;
    max-width: 800px;
    margin: 4rem auto 3rem;
    color: var(--gray-400);
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .section-body p {
    margin-bottom: 1rem;
  }

  .section-body p:last-child {
    margin-bottom: 0;
  }

  .email-button {
    display: inline-block;
    text-decoration: none;
    margin-top: 2rem;
  }

  .email-button button {
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    border: 0.0625rem solid rgba(255, 255, 255, 0.2);
    border-radius: 0.5rem;
    color: var(--white);
    font-size: 1rem;
    font-weight: 200;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .email-button button:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .email-button button:active {
    transform: translateY(0);
  }

  .research-details {
    margin-top: 2rem;
    text-align: left;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    padding: 2.5rem;
    background: rgba(255, 255, 255, 0.03);
    border: 0.0625rem solid rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
  }

  .details-title {
    font-size: 1.75rem;
    font-weight: 200;
    margin-bottom: 2rem;
    letter-spacing: 0.05em;
    color: var(--white);
    text-align: center;
  }

  .research-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .research-item {
    margin-bottom: 0;
  }

  .research-item-title {
    font-size: 1.25rem;
    font-weight: 200;
    margin-bottom: 0.75rem;
    color: var(--white);
    letter-spacing: 0.02em;
  }

  .research-item p {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--gray-400);
    margin-bottom: 0.75rem;
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .research-item p:last-child {
    margin-bottom: 0;
  }

  .research-list {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0 0 0;
  }

  .research-list li {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--gray-400);
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
    position: relative;
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .research-list li:last-child {
    margin-bottom: 0;
  }

  .research-list li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--white);
    font-size: 1.2rem;
    line-height: 1.4;
  }

  .research-list li strong {
    color: var(--white);
    font-weight: 200;
  }
  
  @media (max-width: 768px) {
    .section-title {
      font-size: 2rem;
    }
    
    .section-body {
      font-size: 1rem;
      margin-top: 2rem;
      margin-bottom: 2rem;
    }

    .email-button {
      width: 100%;
    }

    .email-button button {
      width: 100%;
    }

    .research-details {
      margin-top: 1.5rem;
      padding: 1.5rem;
    }

    .details-title {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .research-content {
      gap: 1.5rem;
    }

    .research-item-title {
      font-size: 1.125rem;
    }

    .research-item p,
    .research-list li {
      font-size: 0.9375rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .email-button button {
      transition: none;
    }
  }
</style>
