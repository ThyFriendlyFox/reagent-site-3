<script lang="ts">
  // Team section component
</script>

<section id="team" class="team-section">
  <div class="wrap">
    <h2 class="section-title">Team</h2>
    <div class="team-content">
      <p class="team-description">Meet the people behind Reagent Systems.</p>
      <!-- Team members can be added here -->
    </div>
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
    margin: 0 0 2rem 0;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 200;
    color: var(--white);
    text-align: center;
  }

  .team-content {
    max-width: 60rem;
    margin: 0 auto;
  }

  .team-description {
    margin: 0;
    font-size: 1.125rem;
    color: var(--gray-400);
    text-align: center;
    line-height: 1.6;
  }

  @media (max-width: 51.25rem) {
    .team-section {
      padding: 3rem 0;
    }

    .section-title {
      margin-bottom: 1.5rem;
    }
  }
</style>

