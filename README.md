# Whisper Web

Aplicación de transcripción de audio a texto que funciona íntegramente en el navegador, garantizando la privacidad al procesar los datos de forma local.

## Características

- **Privacidad**: El audio no sale de tu dispositivo; la transcripción se realiza mediante Transformers.js y WASM.
- **Modelos**: Soporta diferentes variantes del modelo Whisper de OpenAI.
- **Tecnología**: Desarrollado con Svelte 5 y Vite.
- **Uso Offline**: Una vez descargado el modelo, el navegador lo almacena en caché para su uso posterior.

## Instalación y desarrollo

1. Instala las dependencias:

   ```bash
   pnpm install
   ```

2. Inicia el servidor de desarrollo:

   ```bash
   pnpm run dev
   ```

3. Genera la versión de producción:
   ```bash
   pnpm run build
   ```

## Requisitos

- Navegador moderno con soporte para Web Workers y WASM.
- Conexión a internet inicial para la descarga de los modelos desde Hugging Face.
