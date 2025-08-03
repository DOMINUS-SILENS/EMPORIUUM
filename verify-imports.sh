#!/bin/bash

# Script de vérification des imports pour le monorepo
# Usage: ./verify-imports.sh [--fix] [--check] [--sync]

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier que pnpm est installé
check_pnpm() {
    if ! command -v pnpm &> /dev/null; then
        log_error "pnpm n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    fi
}

# Vérifier la structure du projet
check_project_structure() {
    log_info "Vérification de la structure du projet..."
    
    if [ ! -f "package.json" ]; then
        log_error "package.json non trouvé. Êtes-vous dans le répertoire racine du projet ?"
        exit 1
    fi
    
    if [ ! -d "apps" ] || [ ! -d "packages" ]; then
        log_error "Structure monorepo non trouvée (apps/ et packages/ manquants)"
        exit 1
    fi
    
    log_success "Structure du projet OK"
}

# Fonction principale de vérification
verify_imports() {
    log_info "Vérification des imports..."
    
    # Exécuter le script de vérification
    if node scripts/verify-imports.js; then
        log_success "Vérification des imports terminée"
        return 0
    else
        log_error "Problèmes détectés dans les imports"
        return 1
    fi
}

# Fonction de correction automatique
fix_imports() {
    log_info "Correction automatique des imports..."
    
    if node scripts/fix-imports.js; then
        log_success "Correction des imports terminée"
    else
        log_error "Erreur lors de la correction des imports"
        return 1
    fi
}

# Fonction de synchronisation des alias
sync_aliases() {
    log_info "Synchronisation des alias..."
    
    if node scripts/sync-aliases.js; then
        log_success "Synchronisation des alias terminée"
    else
        log_error "Erreur lors de la synchronisation des alias"
        return 1
    fi
}

# Fonction de vérification des alias
check_aliases() {
    log_info "Vérification de la cohérence des alias..."
    
    if node scripts/check-aliases.js; then
        log_success "Vérification des alias terminée"
    else
        log_error "Problèmes détectés dans les alias"
        return 1
    fi
}

# Fonction de build pour tester la résolution
test_build() {
    log_info "Test de build pour vérifier la résolution..."
    
    if pnpm build; then
        log_success "Build réussi - résolution des imports OK"
    else
        log_error "Build échoué - problèmes de résolution détectés"
        return 1
    fi
}

# Fonction d'aide
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --fix      Corriger automatiquement les imports problématiques"
    echo "  --sync     Synchroniser les alias entre tsconfig et vite.config"
    echo "  --check    Vérifier la cohérence des alias"
    echo "  --build    Tester la résolution avec un build"
    echo "  --all      Exécuter toutes les vérifications et corrections"
    echo "  --help     Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 --fix           # Corriger les imports"
    echo "  $0 --check         # Vérifier les alias"
    echo "  $0 --all           # Tout vérifier et corriger"
}

# Fonction principale
main() {
    local fix=false
    local sync=false
    local check=false
    local build=false
    local all=false
    
    # Parser les arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --fix)
                fix=true
                shift
                ;;
            --sync)
                sync=true
                shift
                ;;
            --check)
                check=true
                shift
                ;;
            --build)
                build=true
                shift
                ;;
            --all)
                all=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                log_error "Option inconnue: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Si aucune option n'est spécifiée, afficher l'aide
    if [ "$fix" = false ] && [ "$sync" = false ] && [ "$check" = false ] && [ "$build" = false ] && [ "$all" = false ]; then
        show_help
        exit 0
    fi
    
    # Vérifications préliminaires
    check_pnpm
    check_project_structure
    
    # Exécution des actions
    local exit_code=0
    
    if [ "$all" = true ] || [ "$fix" = true ]; then
        fix_imports || exit_code=1
    fi
    
    if [ "$all" = true ] || [ "$sync" = true ]; then
        sync_aliases || exit_code=1
    fi
    
    if [ "$all" = true ] || [ "$check" = true ]; then
        check_aliases || exit_code=1
    fi
    
    if [ "$all" = true ] || [ "$build" = true ]; then
        test_build || exit_code=1
    fi
    
    # Vérification finale des imports
    if [ "$all" = true ]; then
        verify_imports || exit_code=1
    fi
    
    if [ $exit_code -eq 0 ]; then
        log_success "Toutes les vérifications sont passées !"
    else
        log_error "Certaines vérifications ont échoué"
    fi
    
    exit $exit_code
}

# Exécuter le script principal
main "$@" 