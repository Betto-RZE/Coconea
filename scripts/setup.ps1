# Setup script para desarrollo local de Coconea (Windows PowerShell)
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Iniciando configuración local de Coconea" -ForegroundColor Green
Write-Host "Presupuesto objetivo: $0 MXN" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# 1. Copiar .env si no existe
if (!(Test-Path -Path ".env")) {
    Write-Host "Creando .env a partir de .env.example..." -ForegroundColor Cyan
    Copy-Item -Path ".env.example" -Destination ".env"
} else {
    Write-Host ".env ya existe." -ForegroundColor Yellow
}

# 2. Levantar PostgreSQL local en Docker Compose
Write-Host "Iniciando PostgreSQL local con Docker Compose..." -ForegroundColor Cyan
docker compose -f infrastructure/docker-compose.yml up -d

# 3. Instalar dependencias con pnpm
Write-Host "Instalando dependencias con pnpm..." -ForegroundColor Cyan
pnpm install

Write-Host "=========================================" -ForegroundColor Green
Write-Host "¡Configuración completada exitosamente!" -ForegroundColor Green
Write-Host "Para iniciar todos los servicios en desarrollo ejecuta: pnpm dev" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Green
