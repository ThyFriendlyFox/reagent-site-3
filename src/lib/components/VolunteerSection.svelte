<script lang="ts">
  let name = '';
  let email = '';
  let skills = '';
  let interests = '';
  let message = '';

  function handleSubmit(event: Event) {
    event.preventDefault();
    // Form submission logic can be added here if needed
    // The submit button also acts as a link to Discord
    window.open('https://discord.reagent-systems.com', '_blank');
  }
</script>

<section id="volunteer" class="section">
  <div class="section-content">
    <h2 class="section-title">volunteer</h2>
    <div class="section-body">
      <p>Join our community of researchers, developers, and AI enthusiasts working together to advance the field.</p>
    </div>
    
    <form on:submit={handleSubmit} class="volunteer-form">
      <div class="form-row">
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            bind:value={name}
            placeholder="Your name"
            required
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            bind:value={email}
            placeholder="your.email@example.com"
            required
          />
        </div>
      </div>
      
      <div class="form-group">
        <label for="skills">Skills & Expertise</label>
        <input 
          type="text" 
          id="skills" 
          name="skills" 
          bind:value={skills}
          placeholder="e.g., Python, Machine Learning, Research, UI/UX Design"
        />
      </div>
      
      <div class="form-group">
        <label for="interests">Areas of Interest</label>
        <input 
          type="text" 
          id="interests" 
          name="interests" 
          bind:value={interests}
          placeholder="e.g., Federated Learning, AI Agents, Open Source Development"
        />
      </div>
      
      <div class="form-group">
        <label for="message">Message (Optional)</label>
        <textarea 
          id="message" 
          name="message" 
          bind:value={message}
          placeholder="Tell us why you're interested in volunteering..."
          rows="4"
        ></textarea>
      </div>
      
      <a 
        href="https://discord.reagent-systems.com" 
        target="_blank" 
        rel="noopener noreferrer"
        class="submit-button"
      >
        <button type="submit">Join Discord Community</button>
      </a>
    </form>
  </div>
</section>

<style>
  .section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background: var(--gray-700);
    color: var(--white);
    border-top: 0.0625rem solid rgba(255,255,255,0.08);
    border-bottom: 0.0625rem solid rgba(255,255,255,0.06);
  }
  
  .section-content {
    max-width: 800px;
    width: 100%;
    text-align: center;
  }
  
  .section-title {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 200;
    margin-bottom: 1rem;
    letter-spacing: 0.05em;
    color: var(--white);
  }
  
  .section-body {
    font-size: 1.125rem;
    line-height: 1.6;
    margin-bottom: 3rem;
    color: var(--gray-400);
  }

  .volunteer-form {
    text-align: left;
    background: rgba(255, 255, 255, 0.03);
    border: 0.0625rem solid rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
    padding: 2.5rem;
    margin-top: 2rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9375rem;
    color: var(--white);
    font-weight: 200;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 0.875rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    color: var(--white);
    font-size: 0.9375rem;
    font-family: inherit;
    transition: all 0.3s ease;
    box-sizing: border-box;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }

  .form-group input::placeholder,
  .form-group textarea::placeholder {
    color: var(--gray-400);
    opacity: 0.7;
  }

  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }

  .submit-button {
    display: inline-block;
    text-decoration: none;
    margin-top: 1rem;
    width: 100%;
  }

  .submit-button button {
    width: 100%;
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

  .submit-button button:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .submit-button button:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    .section {
      padding: 3rem 1rem;
    }

    .section-title {
      font-size: 2rem;
    }
    
    .section-body {
      font-size: 1rem;
    }

    .volunteer-form {
      padding: 1.5rem;
    }

    .form-row {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .form-group input,
    .form-group textarea,
    .submit-button button {
      transition: none;
    }
  }
</style>
