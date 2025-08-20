#!/usr/bin/env bash
set -euo pipefail
FRONT_DIR="/srv/movies/MoviesAngular"
COMPOSE_DIR="/srv/movies"
BRANCH="main"
ANGULAR_BUILD_CONFIG="production"
log() { printf "\n\033[1;32m[%s]\033[0m %s\n" "$(date +%H:%M:%S)" "$*"; }
if docker compose version >/dev/null 2>&1; then DC="docker compose";
elif command -v docker-compose >/dev/null 2>&1; then DC="docker-compose";
else echo "ERROR: instala docker compose (plugin) o docker-compose."; exit 1; fi
[ -d "$FRONT_DIR/.git" ] || { echo "ERROR: falta repo en $FRONT_DIR"; exit 1; }
[ -f "$COMPOSE_DIR/docker-compose.yml" ] || { echo "ERROR: falta compose en $COMPOSE_DIR"; exit 1; }
log "Actualizando frontend a origin/$BRANCH"
cd "$FRONT_DIR"
git fetch origin && git checkout "$BRANCH" && git reset --hard "origin/$BRANCH"
log "Instalando deps y build Angular (legacy peer deps)"
docker run --rm -v "$PWD":/app -w /app node:20 bash -lc "
  npm ci --legacy-peer-deps
  npm run build -- --configuration $ANGULAR_BUILD_CONFIG
"
log "Refrescando Nginx"
cd "$COMPOSE_DIR" && $DC --env-file /srv/movies/.env -f /srv/movies/docker-compose.yml up -d --no-deps nginx
log "Limpieza de imágenes huérfanas"
docker image prune -f || true
log "✅ Frontend desplegado."
