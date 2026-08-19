# OjoBache frontend

Frontend React/Vite de OjoBache.

## Desarrollo con backend

```bash
cp .env.example .env
npm install
npm run dev
```

Si `VITE_API_URL` queda vacio, Vite usa el proxy local hacia `http://127.0.0.1:8000`.

## Demo estatica

```bash
$env:VITE_DEMO_MODE="true"
npm run dev
```

La demo no llama al backend: usa datos mock en `sessionStorage`.

Admin demo:

- Email: `admin@ojobache.com`
- Password: `demo1234`

## Build para GitHub Pages

El workflow del repo ejecuta:

```bash
VITE_DEMO_MODE=true npm run build
```

Tambien define `VITE_BASE_PATH` para que los assets funcionen bajo `https://gali819.github.io/ojobache/`.
