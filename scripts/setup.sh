#!/usr/bin/env bash
set -e

echo "========================================="
echo "Iniciando configuración local de Coconea"
echo "Presupuesto objetivo: $0 MXN"
echo "========================================="

# 1. Copiar .env si no existe
if [ ! -f ".env" ]; then
    echo "Creando .env a partir de .env.example..."
    cp .env.example .env
else
    echo ".env ya existe."
fi

# 2. Levantar PostgreSQL local en Docker Compose
echo "Iniciando PostgreSQL local con Docker Compose..."
docker compose -f infrastructure/docker-compose.yml up -d

# 3. Instalar dependencias con pnpm
echo "Instalando dependencias con pnpm..."
pnpm install

echo "========================================="
echo "¡Configuración completada exitosamente!"
echo "Para iniciar todos los servicios ejecuta: pnpm dev"
echo "========================================="
