<script>
  import Hero from '$lib/components/landing/Hero.svelte';
  import Demo from '$lib/components/landing/Demo.svelte';
  import Features from '$lib/components/landing/Features.svelte';
  import Install from '$lib/components/landing/Install.svelte';
  import Footer from '$lib/components/landing/Footer.svelte';
</script>

<svelte:head>
  <title>pforge — Turn your GitHub into a public roadmap</title>
  <meta name="description" content="Zero database. One command. A public roadmap your users actually understand." />
</svelte:head>

<main>
  <Hero />
  <Demo />
  <Features />
  <Install />
  <Footer />
</main>
