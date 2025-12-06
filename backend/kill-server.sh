#!/bin/bash
# Script pour arrêter proprement le serveur local

PORT=${1:-8000}

echo "Recherche des processus sur le port $PORT..."
PID=$(lsof -ti :$PORT)

if [ -z "$PID" ]; then
    echo "Aucun processus trouvé sur le port $PORT"
else
    echo "Arrêt du processus $PID sur le port $PORT..."
    kill -15 $PID 2>/dev/null
    sleep 1

    # Vérifier si le processus est toujours actif
    if lsof -ti :$PORT > /dev/null 2>&1; then
        echo "Processus résistant, utilisation de kill -9..."
        kill -9 $PID
    fi

    echo "✓ Serveur arrêté"
fi
