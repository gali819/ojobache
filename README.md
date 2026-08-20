# 🕳️ OjoBache

Mapa colaborativo de baches para Tucumán, Argentina.

## Requisitos

- PHP 8.2+
- Composer 2+
- Node.js 18+
- MySQL

## Instalación local

### Backend

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Demo estática gratis

El backend Laravel necesita PHP y MySQL, por eso GitHub Pages no sirve para la app completa. Para mostrar el proyecto gratis hay un modo demo del frontend con datos falsos y `sessionStorage`.

### Probar demo local

```bash
cd frontend
$env:VITE_DEMO_MODE="true"
npm run dev
```

Admin demo:

- URL: `/admin/login`
- Email: `admin@ojobache.com`
- Password: `demo1234`

Los reportes, votos, fotos y cambios de admin se guardan solo en la pestaña del navegador y se pierden al cerrarla.

### Publicar en GitHub Pages

1. Verificá que el repo no tenga secretos: `.env` está ignorado y no debe subirse.
2. Hacé público el repo en GitHub si querés que Pages sea gratis.
3. En GitHub, entrá a `Settings > Pages` y elegí `GitHub Actions` como source.
4. Hacé push a la rama `Ramon`, `main` o `master`.
5. El workflow `.github/workflows/demo-pages.yml` genera el frontend cons `VITE_DEMO_MODE=true` y publica `frontend/dist`.

URL esperada: `https://gali819.github.io/ojobache/`

## Acceso admin

URL: http://localhost:5173/admin/login  
Email: admin@ojobache.com  
Password: (configurar en .env con ADMIN_PASSWORD)

## Stack

- Laravel 12 + React 18 + Vite
- MySQL + Tailwind CSS + Leaflet
