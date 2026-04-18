import { pipeline, env, type AutomaticSpeechRecognitionPipeline } from '@huggingface/transformers';

// Configurar para usar archivos locales si es necesario o permitir descarga
env.allowLocalModels = false;
env.useBrowserCache = true;

class WhisperWorker {
    static instance: AutomaticSpeechRecognitionPipeline | null = null;
    static currentModel: string | null = null;

    static async getInstance(model: string, progress_callback?: (progress: any) => void): Promise<AutomaticSpeechRecognitionPipeline> {
        if (this.instance !== null && this.currentModel !== model) {
            this.instance = null;
        }

        if (this.instance === null) {
            this.currentModel = model;
            // @ts-ignore - Pipeline types might be complex for automatic-speech-recognition in some versions
            this.instance = await pipeline('automatic-speech-recognition', model, {
                device: 'wasm',
                // Volvemos a fp32 que es el estado estable conocido para base/small
                dtype: {
                    encoder_model: 'fp32',
                    decoder_model_merged: 'fp32',
                },
                progress_callback,
            });
        }
        return this.instance!;
    }
}

// En TS, self necesita ser casteado para acceder a APIs de Worker
const ctx: DedicatedWorkerGlobalScope = self as any;

ctx.addEventListener('message', async (event: MessageEvent) => {
    const { type, audio, model, language = null } = event.data;

    if (type === 'load') {
        try {
            await WhisperWorker.getInstance(model, (progress) => {
                ctx.postMessage({ type: 'load-progress', progress });
            });
            ctx.postMessage({ type: 'load-complete' });
        } catch (error) {
            ctx.postMessage({ type: 'error', message: (error as Error).message });
        }
    } else if (type === 'transcribe') {
        try {
            const transcriber = await WhisperWorker.getInstance(model);
            
            const result = await transcriber(audio, {
                task: 'transcribe',
                language: language,
                chunk_length_s: 30,
                stride_length_s: 5,
                return_timestamps: false,
                callback_function: (p: any) => {
                    ctx.postMessage({ type: 'transcribe-progress', partial: p });
                }
            });

            ctx.postMessage({ type: 'transcribe-complete', result });
        } catch (error) {
            ctx.postMessage({ type: 'error', message: (error as Error).message });
        }
    }
});
