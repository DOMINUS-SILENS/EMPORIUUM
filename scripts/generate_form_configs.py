import os
import re
import json

# --- Configuration ---
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SCHEMAS_DIR = os.path.join(PROJECT_ROOT, 'packages', 'schemas', 'src')
OUTPUT_DIR = os.path.join(PROJECT_ROOT, 'packages', 'form-configs', 'src')

# --- Regular Expressions ---
# More robust regex to find the content inside z.object(), ignoring export type
SCHEMA_BODY_RE = re.compile(r'z\.object\({([\s\S]*?)}\)', re.MULTILINE)
# Handles optional quotes around field names
FIELD_RE = re.compile(r'([\'\"]?(\w+)[\'\"]?):\s*(z\.[\w\W]+?)(?:,|$)', re.MULTILINE)

def parse_field_details(field_str):
    """Parses a Zod field string to extract details."""
    details = {
        'component': 'input',
        'type': 'text',
        'required': True,
        'validation': {}
    }

    field_str_lower = field_str.lower()
    
    # Type detection
    if 'string' in field_str_lower:
        if 'email' in field_str_lower:
            details['type'] = 'email'
        elif 'datetime' in field_str_lower:
            details['type'] = 'datetime'
            details['component'] = 'datetime'
        else:
            details['type'] = 'text'
    elif 'number' in field_str_lower or 'int' in field_str_lower:
        details['type'] = 'number'
    elif 'boolean' in field_str_lower:
        details['type'] = 'boolean'
        details['component'] = 'checkbox'
    elif 'array' in field_str_lower:
        details['type'] = 'array'
        details['component'] = 'array'
    elif 'object' in field_str_lower:
        details['type'] = 'object'
        details['component'] = 'object'

    # Required/Optional detection
    if 'optional' in field_str_lower or 'nullable' in field_str_lower:
        details['required'] = False

    # Validation rules
    min_match = re.search(r'\.min\((\d+)\)', field_str)
    if min_match:
        details['validation']['minLength'] = int(min_match.group(1))

    max_match = re.search(r'\.max\((\d+)\)', field_str)
    if max_match:
        details['validation']['maxLength'] = int(max_match.group(1))
        
    # Enum detection
    enum_match = re.search(r'\.enum\((\[.*?\])\)', field_str)
    if enum_match:
        details['component'] = 'select'
        try:
            enum_values_str = enum_match.group(1).replace("'", '"')
            details['enumValues'] = json.loads(enum_values_str)
        except json.JSONDecodeError:
            pass

    return details

def generate_configs():
    """Main function to generate form configurations."""
    print('--- Starting form config generation (Python - Improved) ---')
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    for filename in os.listdir(SCHEMAS_DIR):
        if filename.endswith('.ts'):
            filepath = os.path.join(SCHEMAS_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Derive form name from filename for robustness
            form_name_raw = os.path.splitext(filename)[0]
            form_name = form_name_raw[0].lower() + form_name_raw[1:]

            schema_body_match = SCHEMA_BODY_RE.search(content)
            if not schema_body_match:
                continue

            schema_body = schema_body_match.group(1)
            config = {'formName': form_name, 'fields': []}

            for field_match in FIELD_RE.finditer(schema_body):
                # group(2) captures the name without quotes
                field_name, field_def = field_match.group(2), field_match.group(3)
                
                field_def_lower = field_def.lower()
                if 'password' in field_name.lower():
                    field_def_lower += '.password'

                field_details = parse_field_details(field_def_lower)
                
                if 'password' in field_def_lower:
                    field_details['type'] = 'password'

                final_field = {
                    'name': field_name,
                    'component': field_details['component'],
                    'type': field_details['type'],
                    'label': f'{form_name}.{field_name}.label',
                    'placeholder': f'{form_name}.{field_name}.placeholder',
                    'description': f'{form_name}.{field_name}.description',
                    'required': field_details['required']
                }
                if field_details.get('enumValues'):
                    final_field['enumValues'] = field_details['enumValues']
                if field_details.get('validation'):
                    final_field['validation'] = field_details['validation']

                config['fields'].append(final_field)

            if not config['fields']:
                continue

            output_filename = f'{form_name}.form.config.json'
            output_path = os.path.join(OUTPUT_DIR, output_filename)
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2)
            print(f'-> Generated {output_filename}')

    print('--- Form config generation complete. ---')

if __name__ == '__main__':
    generate_configs()
