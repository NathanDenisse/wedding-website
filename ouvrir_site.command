#!/bin/bash

# Script pour ouvrir le site localement dans le navigateur
# Double-cliquez simplement sur ce fichier pour l'exécuter

cd "$(dirname "$0")"

echo "🚀 Lancement du serveur local..."
echo ""

# Tuer les anciens serveurs sur le port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null

# Lancer le serveur
python3 -m http.server 8000 > /dev/null 2>&1 &
SERVER_PID=$!

sleep 2

echo "✅ Serveur démarré !"
echo "📂 Dossier: $(pwd)"
echo "🌐 URL: http://localhost:8000"
echo ""
echo "🌍 Ouverture du navigateur..."

# Ouvrir le navigateur
open http://localhost:8000/index.html

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Le site est maintenant ouvert dans votre navigateur !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "ℹ️  Pour arrêter le serveur, fermez cette fenêtre"
echo "   ou appuyez sur Ctrl+C"
echo ""

# Garder le terminal ouvert
wait $SERVER_PID

