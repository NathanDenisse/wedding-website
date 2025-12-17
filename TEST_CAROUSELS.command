#!/bin/bash

# Script de test des carousels
cd "$(dirname "$0")"

echo "🧪 TEST DES CAROUSELS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ouvrir la page de test
echo "📂 Ouverture de la page de test..."
open test-carousel.html

sleep 2

# Ouvrir aussi la vraie page
echo "📂 Ouverture du site principal..."
open index.html

echo ""
echo "✅ Pages ouvertes dans votre navigateur !"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 VÉRIFICATIONS À FAIRE :"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✓ Page de test (test-carousel.html) :"
echo "  • Les 3 carousels s'affichent-ils ?"
echo "  • Pouvez-vous naviguer avec les flèches ?"
echo "  • Les dots changent-ils ?"
echo ""
echo "✓ Site principal (index.html) :"
echo "  • Section 'Notre histoire'"
echo "  • Carousel Jullouville (étape 1) - visible directement"
echo "  • Cliquez sur les boutons '+' pour révéler les autres"
echo ""
echo "📋 Si tout fonctionne, ouvrez la Console du navigateur"
echo "   (F12 ou Cmd+Option+I) pour voir les logs de debug"
echo ""



