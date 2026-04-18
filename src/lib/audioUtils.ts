/**
 * Prepares audio file for Whisper (16kHz, mono Float32Array)
 */
export async function prepareAudio(file: File): Promise<Float32Array> {
    // Manejo de prefijos heredados para máxima compatibilidad
    // @ts-ignore
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    
    const audioContext = new AudioContextClass({
        sampleRate: 16000,
    });

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    let audioData: Float32Array;
    
    if (audioBuffer.numberOfChannels > 1) {
        const left = audioBuffer.getChannelData(0);
        const right = audioBuffer.getChannelData(1);
        audioData = new Float32Array(left.length);
        for (let i = 0; i < left.length; i++) {
            audioData[i] = (left[i] + right[i]) / 2;
        }
    } else {
        audioData = audioBuffer.getChannelData(0);
    }

    await audioContext.close();
    return audioData;
}
