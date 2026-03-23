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

## Acceso admin

URL: http://localhost:5173/admin/login  
Email: admin@ojobache.com  
Password: (configurar en .env con ADMIN_PASSWORD)

## Stack

- Laravel 12 + React 18 + Vite
- MySQL + Tailwind CSS + Leaflet
