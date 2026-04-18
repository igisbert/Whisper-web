<script lang="ts">
    import { fade } from 'svelte/transition';

    interface Props {
        transcription: string;
        onCopy: () => void;
        copied: boolean;
    }

    let { transcription, onCopy, copied }: Props = $props();
</script>

<div class="result" in:fade>
    <div class="result-meta">
        <span>transcripción</span>
        <button class="copy" onclick={onCopy}>
            {copied ? 'copiado' : 'copiar'}
        </button>
    </div>
    <div class="text">{transcription}</div>
</div>

<style>
    .result {
        margin-top: 3rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .result-meta {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .copy {
        background: none;
        border: none;
        color: var(--accent);
        text-decoration: underline;
        cursor: pointer;
        padding: 0;
    }

    .text {
        font-size: 1.15rem;
        line-height: 1.7;
        font-weight: 300;
        color: #d4d4d4;
        background: #121212;
        padding: 1.5rem;
        border-radius: 8px;
        text-align: left;
    }
</style>
