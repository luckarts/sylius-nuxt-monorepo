#!/bin/bash

echo "🚀 Configuration de la Homepage Personnalisée"
echo "=============================================="
echo ""

# Couleurs pour le terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Étape 1 : Vérifier npm
echo -e "${BLUE}[1/4]${NC} Vérification de npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠️  npm n'est pas installé. Veuillez installer Node.js et npm.${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} npm est installé"
echo ""

# Étape 2 : Compiler les assets
echo -e "${BLUE}[2/4]${NC} Compilation des assets..."
npm run dev
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Assets compilés avec succès"
else
    echo -e "${YELLOW}⚠️  Erreur lors de la compilation des assets${NC}"
    exit 1
fi
echo ""

# Étape 3 : Vider le cache
echo -e "${BLUE}[3/4]${NC} Vidage du cache Symfony..."
php bin/console cache:clear
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Cache vidé avec succès"
else
    echo -e "${YELLOW}⚠️  Erreur lors du vidage du cache${NC}"
    exit 1
fi
echo ""

# Étape 4 : Afficher les instructions suivantes
echo -e "${BLUE}[4/4]${NC} Configuration terminée !"
echo ""
echo "=============================================="
echo -e "${GREEN}✅ La homepage est prête !${NC}"
echo "=============================================="
echo ""
echo "📝 Prochaines étapes :"
echo ""
echo "1. Créez les blocs CMS dans l'admin :"
echo "   • Bloc 'homepage_hero' - Bannière principale"
echo "   • Bloc 'homepage_about' - Section à propos"
echo ""
echo "2. Consultez la documentation :"
echo "   • Guide rapide : HOMEPAGE_QUICKSTART.md"
echo "   • Guide complet : doc/homepage-setup-guide.md"
echo ""
echo "3. Visitez votre homepage :"
echo "   • http://localhost/"
echo ""
echo "=============================================="
echo ""
echo "🎨 Personnalisation :"
echo "   • Couleurs : assets/shop/scss/_variables.scss"
echo "   • Traductions : translations/messages.fr.yaml"
echo "   • Templates : templates/bundles/SyliusShopBundle/homepage/"
echo ""
echo "=============================================="

