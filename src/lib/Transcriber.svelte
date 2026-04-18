<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { prepareAudio } from './audioUtils';
    import { APP_STATUS } from './config';
    
    // Sub-componentes
    import Setup from './components/Setup.svelte';
    import DropZone from './components/DropZone.svelte';
    import Result from './components/Result.svelte';

    // Estados reactivos (Svelte 5)
    let status = $state(APP_STATUS.IDLE); 
    let progress = $state(0);
    let transcription = $state('');
    let errorMessage = $state('');
    let selectedLanguage = $state('es');
    let selectedModel = $state('Xenova/whisper-tiny');
    let copied = $state(false);
    let worker: Worker;

    onMount(() => {
        worker = new Worker(new URL('../worker.ts', import.meta.url), { type: 'module' });
        
        worker.onmessage = (event: MessageEvent) => {
            const { type, progress: p, result, message } = event.data;
            
            if (type === 'load-progress' && p.status === 'progress') {
                status = APP_STATUS.LOADING;
                progress = Math.round(p.progress);
            } else if (type === 'load-complete') {
                status = APP_STATUS.READY;
            } else if (type === 'transcribe-complete') {
                status = APP_STATUS.READY;
                transcription = result.text;
            } else if (type === 'error') {
                status = APP_STATUS.ERROR;
                errorMessage = message;
            }
        };

        return () => worker.terminate();
    });

    const loadModel = () => {
        status = APP_STATUS.LOADING;
        progress = 0;
        worker.postMessage({ type: 'load', model: selectedModel });
    };

    const processFile = async (file: File) => {
        if (!file || status !== APP_STATUS.READY) return;
        try {
            status = APP_STATUS.TRANSCRIBING;
            transcription = '';
            const audioData = await prepareAudio(file);
            worker.postMessage({ 
                type: 'transcribe', 
                audio: audioData, 
                language: selectedLanguage, 
                model: selectedModel 
            });
        } catch (e) {
            status = APP_STATUS.ERROR;
            errorMessage = (e as Error).message;
        }
    };

    const copyTranscription = async () => {
        if (!transcription) return;
        await navigator.clipboard.writeText(transcription);
        copied = true;
        setTimeout(() => copied = false, 2000);
    };
</script>

<div class="transcriber-container">
    {#if status === APP_STATUS.IDLE || status === APP_STATUS.ERROR}
        <Setup 
            bind:selectedModel 
            bind:selectedLanguage 
            onInitialize={loadModel} 
            {errorMessage} 
        />
    {:else if status === APP_STATUS.LOADING}
        <div class="loading-state" in:fade>
            <div class="loader-circle"></div>
            <p>preparando sistema {progress}%</p>
        </div>
    {:else}
        <div class="active-state" in:fade>
            <div class="meta-header">
                <span>{selectedModel.split('/')[1]} / {selectedLanguage}</span>
                <button class="reset-link" onclick={() => status = APP_STATUS.IDLE}>cambiar</button>
            </div>

            <DropZone 
                onFileSelect={processFile} 
                isBusy={status === APP_STATUS.TRANSCRIBING} 
            />

            {#if transcription}
                <Result {transcription} {copied} onCopy={copyTranscription} />
            {/if}
        </div>
    {/if}
</div>

<style>
    .transcriber-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 4rem 0;
    }

    .loader-circle {
        width: 24px;
        height: 24px;
        border: 1px solid var(--border);
        border-top-color: var(--accent);
        border-radius: 50%;
        animation: rotate 1s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes rotate { to { transform: rotate(360deg); } }

    .active-state {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .meta-header {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: var(--text-muted);
        border-bottom: 1px solid var(--border);
        padding-bottom: 1rem;
    }

    .reset-link {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0;
        text-decoration: underline;
        transition: color 0.2s;
    }

    .reset-link:hover { color: var(--accent); }
</style>
