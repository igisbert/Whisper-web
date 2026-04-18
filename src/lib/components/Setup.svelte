<script lang="ts">
  import { fade } from "svelte/transition";
  import { MODELS, LANGUAGES } from "../config";

  interface Props {
    selectedModel: string;
    selectedLanguage: string;
    onInitialize: () => void;
    errorMessage?: string;
  }

  let {
    selectedModel = $bindable(),
    selectedLanguage = $bindable(),
    onInitialize,
    errorMessage,
  }: Props = $props();
</script>

<div class="setup" in:fade={{ duration: 600 }}>
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}

  <div class="settings">
    <div class="row">
      <span>usar modelo</span>
      <div class="select-col">
        <select name="models" bind:value={selectedModel}>
          {#each MODELS as m}
            <option value={m.id}>{m.name} ({m.info})</option>
          {/each}
        </select>
        <p class="model-desc">
          {MODELS.find((m) => m.id === selectedModel)?.desc}
        </p>
      </div>
    </div>
    <div class="row">
      <span>en idioma</span>
      <div class="select-col">
        <select name="languages" bind:value={selectedLanguage}>
          {#each LANGUAGES as lang}
            <option value={lang.code}>{lang.name}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <button class="action" onclick={onInitialize}> inicializar </button>
</div>

<style>
  .setup {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .settings {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .row {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0rem;
  }

  .row span {
    font-size: 0.9rem;
    color: var(--text-muted);
    white-space: nowrap;
    width: 120px;
    padding-top: 8px;
  }

  .select-col {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex-grow: 1;
  }

  .model-desc {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin: 0;
    line-height: 1.4;
  }

  .action {
    margin-top: 2rem;
    background: var(--accent);
    color: var(--bg);
    border: none;
    padding: 1rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;

    @supports (corner-shape: squircle) {
      & {
        corner-shape: squircle;
        border-radius: 2rem;
      }
    }
  }

  .action:hover {
    opacity: 0.9;
  }
  .error {
    color: #ef4444;
    font-size: 0.9rem;
  }
</style>
