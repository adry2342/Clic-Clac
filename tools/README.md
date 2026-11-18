# Herramientas de desarrollo

- `node tools/review.js [juego|all] [carpeta]`: un bot juega cada minijuego, guarda una hoja de fotogramas por fase, mide el tiempo por fotograma (p95) y comprueba que pulsar 75 ms tarde se marca como "tarde/te pasaste". Deja un `informe.txt`.

Necesita Node y Playwright: `npm i -D playwright && npx playwright install chromium`.
