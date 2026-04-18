<script lang="ts">
    interface Props {
        onFileSelect: (file: File) => void;
        isBusy: boolean;
    }

    let { onFileSelect, isBusy }: Props = $props();

    function onDrop(e: DragEvent) {
        e.preventDefault();
        if (isBusy) return;
        const file = e.dataTransfer?.files[0];
        if (file) onFileSelect(file);
    }

    function handleChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) onFileSelect(file);
    }
</script>

<label 
    class="drop-area {isBusy ? 'busy' : ''}" 
    ondragover={(e) => e.preventDefault()} 
    ondrop={onDrop}
>
    <input 
        type="file" 
        accept="audio/*,video/*" 
        onchange={handleChange} 
        disabled={isBusy} 
    />
    {#if isBusy}
        <p class="pulse">escuchando...</p>
    {:else}
        <p>arrastra un audio o selecciona un archivo</p>
    {/if}
</label>

<style>
    .drop-area {
        height: 160px;
        border: 1px dashed var(--border);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        color: var(--text-muted);
    }

    .drop-area:hover:not(.busy) {
        border-color: var(--accent);
        color: var(--accent);
    }

    .drop-area.busy { 
        cursor: wait; 
        border-style: solid; 
        border-color: var(--accent);
        color: var(--accent);
    }

    .pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

    input[type="file"] { display: none; }
</style>
