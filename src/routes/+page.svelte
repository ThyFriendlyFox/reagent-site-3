<script lang="ts">
  import HeroHeader from '$lib/components/HeroHeader.svelte';
  const backgroundImageUrl = "/backgrounds/placeholder.jpg";
  const backgroundVideoUrl = "";
</script>

<HeroHeader {backgroundImageUrl} {backgroundVideoUrl}>
  <div class="hero-copy" style="pointer-events:auto">
    <div class="subtitle">Agent Research</div>
    <h1 class="headline">
      <span>Open Source</span><br />
      <span>Privacy First</span>
    </h1>
  </div>
</HeroHeader>

<style>
  .hero-copy {
    position: absolute;
    left: 1.5rem;
    top: 6.5rem;
    color: rgba(15, 15, 15, 0.92);
    text-shadow: 0 1px 0 rgba(255,255,255,0.4);
  }
  .subtitle {
    font-family: "avionic wide book", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial;
    font-size: 1rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.8;
    margin-bottom: 0.25rem;
  }
  .headline {
    font-family: "avionic wide book", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial;
    font-size: 3rem;
    line-height: 1.05;
    margin: 0;
    text-transform: lowercase;
  }
</style>
