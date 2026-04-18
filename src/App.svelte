<script>
  import Transcriber from "./lib/Transcriber.svelte";
</script>

<main>
  <header>
    <h1>Whisper Web</h1>
    <p class="subtitle">
      Convierte audio en texto, privado y seguro directamente en tu navegador.
    </p>
  </header>

  <Transcriber />

  <footer>
    <p>Desarrollado por igisbert.</p>
  </footer>
</main>

<style>
  main {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  header {
    margin-top: 2rem;
  }

  footer {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
    font-size: 0.875rem;
    color: #9ca3af;
  }
</style>
