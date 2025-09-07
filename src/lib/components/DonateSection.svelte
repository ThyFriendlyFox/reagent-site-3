<script lang="ts">
  // Donate section component
</script>

<section id="donate" class="section">
  <div class="section-content">
    <h2 class="section-title">donate</h2>
    <div class="section-body">
      <p>Support our research and development efforts to advance AI technology for the benefit of all.</p>
      <!-- Add more content as needed -->
    </div>
  </div>
</section>

<style>
  .section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 2rem 6rem 2rem; /* extra bottom padding for alert */
    background: var(--gray-900);
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
  }
  
  .section-body {
    font-size: 1.2rem;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
  }
  
  @media (max-width: 768px) {
    .section-title {
      font-size: 2rem;
    }
    
    .section-body {
      font-size: 1rem;
    }
  }
</style>
