#!/bin/bash

# Script de vérification des images du site mariage
# Vérifie que toutes les images référencées dans index.html existent et sont valides

echo "🔍 Vérification des images du site..."
echo ""

cd "$(dirname "$0")"

# Compteurs
total=0
found=0
missing=0
invalid=0

# Extraire toutes les références d'images
images=$(grep -o 'src="assets/[^"]*"' index.html | sed 's/src="//;s/"//')

echo "📸 Images à vérifier:"
echo ""

for img in $images; do
    ((total++))
    if [ -f "$img" ]; then
        # Vérifier le format du fichier
        file_type=$(file "$img" | grep -i "JPEG\|PNG\|GIF\|WebP")
        if [ ! -z "$file_type" ]; then
            echo "✅ $img - OK"
            ((found++))
        else
            echo "⚠️  $img - Format invalide: $(file "$img")"
            ((invalid++))
        fi
    else
        echo "❌ $img - MANQUANT"
        ((missing++))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RÉSUMÉ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Total d'images référencées: $total"
echo "✅ Images valides: $found"
echo "❌ Images manquantes: $missing"
echo "⚠️  Images format invalide: $invalid"
echo ""

if [ $missing -eq 0 ] && [ $invalid -eq 0 ]; then
    echo "🎉 Toutes les images sont présentes et valides !"
    exit 0
else
    echo "⚠️  Certaines images ont des problèmes."
    exit 1
fi

