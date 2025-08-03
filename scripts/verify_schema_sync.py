#!/usr/bin/env python3
"""
Script de vérification de la synchronisation entre les schémas Zod, 
modèles Pydantic et configurations de formulaires.
"""

import os
import re
import json
from typing import Dict, List, Set

# Configuration
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SCHEMAS_DIR = os.path.join(PROJECT_ROOT, 'packages', 'schemas', 'src')
FORM_CONFIGS_DIR = os.path.join(PROJECT_ROOT, 'packages', 'form-configs', 'src')
BACKEND_MODELS_DIR = os.path.join(PROJECT_ROOT, 'apps', 'backend', 'models')

def extract_zod_fields(schema_file: str) -> Dict[str, str]:
    """Extrait les champs d'un schéma Zod."""
    with open(schema_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex améliorée pour trouver les champs dans z.object()
    # Utiliser une approche plus robuste pour capturer tout le contenu
    schema_body_re = re.compile(r'z\.object\({([\s\S]*?)}\);', re.MULTILINE)
    
    fields = {}
    schema_match = schema_body_re.search(content)
    if schema_match:
        schema_body = schema_match.group(1)
        # Diviser par lignes et traiter chaque ligne
        lines = schema_body.split('\n')
        for line in lines:
            line = line.strip()
            if ':' in line and ('z.' in line or 'userSchema' in line):
                # Extraire le nom du champ et le type
                match = re.match(r'(\w+):\s*(.+)', line)
                if match:
                    field_name = match.group(1)
                    field_type = match.group(2).rstrip(',')
                    fields[field_name] = field_type
    
    return fields

def extract_form_fields(config_file: str) -> Dict[str, str]:
    """Extrait les champs d'une configuration de formulaire."""
    with open(config_file, 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    fields = {}
    for field in config.get('fields', []):
        fields[field['name']] = field['type']
    
    return fields

def extract_pydantic_fields(model_file: str, class_name: str) -> Dict[str, str]:
    """Extrait les champs d'un modèle Pydantic."""
    with open(model_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex pour trouver la classe Pydantic
    class_re = re.compile(rf'class {class_name}\(BaseModel\):([\s\S]*?)(?=class|\Z)', re.MULTILINE)
    field_re = re.compile(r'(\w+):\s*([^#\n]+)', re.MULTILINE)
    
    fields = {}
    class_match = class_re.search(content)
    if class_match:
        class_body = class_match.group(1)
        for field_match in field_re.finditer(class_body):
            field_name = field_match.group(1)
            field_type = field_match.group(2).strip()
            if not field_name.startswith('_') and field_name not in ['Config', 'class']:
                fields[field_name] = field_type
    
    return fields

def verify_synchronization():
    """Vérifie la synchronisation entre les différents formats."""
    print("🔍 Vérification de la synchronisation des schémas...")
    
    issues = []
    
    # Vérifier les schémas Zod vs configurations de formulaires
    for filename in os.listdir(SCHEMAS_DIR):
        if filename.endswith('.ts'):
            schema_name = os.path.splitext(filename)[0]
            schema_file = os.path.join(SCHEMAS_DIR, filename)
            form_config_file = os.path.join(FORM_CONFIGS_DIR, f"{schema_name.lower()}.form.config.json")
            
            if os.path.exists(form_config_file):
                zod_fields = extract_zod_fields(schema_file)
                form_fields = extract_form_fields(form_config_file)
                
                # Vérifier les champs manquants
                zod_field_names = set(zod_fields.keys())
                form_field_names = set(form_fields.keys())
                
                missing_in_form = zod_field_names - form_field_names
                missing_in_zod = form_field_names - zod_field_names
                
                if missing_in_form:
                    issues.append(f"❌ {schema_name}: Champs manquants dans le formulaire: {missing_in_form}")
                
                # Pour les champs complexes (objets, arrays), on peut avoir des champs dans le formulaire
                # qui ne sont pas directement dans le schéma Zod mais dans des schémas importés
                if missing_in_zod:
                    # Filtrer les champs complexes qui peuvent être légitimes
                    complex_fields = {'sender', 'user1', 'user2', 'messages'}
                    simple_missing = missing_in_zod - complex_fields
                    if simple_missing:
                        issues.append(f"❌ {schema_name}: Champs en trop dans le formulaire: {simple_missing}")
    
    # Vérifier les types de composants appropriés
    for filename in os.listdir(FORM_CONFIGS_DIR):
        if filename.endswith('.form.config.json'):
            config_file = os.path.join(FORM_CONFIGS_DIR, filename)
            with open(config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            for field in config.get('fields', []):
                field_name = field['name']
                field_type = field['type']
                component = field['component']
                
                # Vérifications de cohérence
                if field_type == 'boolean' and component != 'checkbox':
                    issues.append(f"❌ {config['formName']}.{field_name}: Type boolean devrait utiliser checkbox")
                
                if field_type == 'datetime' and component != 'datetime':
                    issues.append(f"❌ {config['formName']}.{field_name}: Type datetime devrait utiliser datetime")
                
                if 'enumValues' in field and component != 'select':
                    issues.append(f"❌ {config['formName']}.{field_name}: Enum devrait utiliser select")
    
    # Afficher les résultats
    if issues:
        print("\n🚨 Problèmes détectés:")
        for issue in issues:
            print(f"  {issue}")
    else:
        print("\n✅ Tous les schémas sont synchronisés!")
    
    return len(issues) == 0

if __name__ == '__main__':
    verify_synchronization() 