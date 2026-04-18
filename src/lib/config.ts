export interface WhisperModel {
    id: string;
    name: string;
    info: string;
    desc: string;
}

export interface WhisperLanguage {
    code: string;
    name: string;
}

export const MODELS: WhisperModel[] = [
    { id: 'Xenova/whisper-tiny', name: 'tiny', info: '40mb', desc: 'Ultra-rápido pero poco preciso.' },
    { id: 'Xenova/whisper-base', name: 'base', info: '145mb', desc: 'Rápido y ligero.' },
    { id: 'Xenova/whisper-small', name: 'small', info: '480mb', desc: 'Más lento, alta precisión.' },
];

export const LANGUAGES: WhisperLanguage[] = [
    { code: 'es', name: 'Español' },
    { code: 'ca', name: 'Catalán' },
    { code: 'en', name: 'Inglés' },
    { code: 'fr', name: 'Francés' },
    { code: 'de', name: 'Alemán' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Ruso' },
];

export enum APP_STATUS {
    IDLE = 'idle',
    LOADING = 'loading',
    READY = 'ready',
    TRANSCRIBING = 'transcribing',
    ERROR = 'error'
}
