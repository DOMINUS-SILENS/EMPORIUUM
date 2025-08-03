import sys
import importlib
import inspect
from pathlib import Path
from pydantic import BaseModel

def main():
    print("--- Starting Pydantic to JSON Schema generation ---")
    project_root = Path(__file__).parent.parent
    schemas_dir = project_root / 'apps' / 'backend' / 'src' / 'schemas'
    output_dir = project_root / 'packages' / 'schemas' / 'json'

    # Add backend src to path for imports
    sys.path.insert(0, str(project_root / 'apps' / 'backend' / 'src'))

    # Ensure output directory exists
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"Outputting JSON Schemas to: {output_dir}")

    schema_files = list(schemas_dir.glob('*.py'))

    for py_file in schema_files:
        if py_file.name == '__init__.py':
            continue

        module_name = f"schemas.{py_file.stem}"
        try:
            module = importlib.import_module(module_name)
            print(f"\n[INFO] Processing module: {module_name}")

            for name, obj in inspect.getmembers(module):
                if inspect.isclass(obj) and issubclass(obj, BaseModel) and obj is not BaseModel:
                    print(f"  - Found Pydantic model: {name}")
                    json_schema = obj.schema_json(indent=2)
                    output_file = output_dir / f"{name}.json"
                    with open(output_file, 'w') as f:
                        f.write(json_schema)
                    print(f"    \033[92m-> Saved {output_file.name}\033[0m")

        except Exception as e:
            print(f"[ERROR] Failed to process {module_name}: {e}")

    print("\n--- JSON Schema generation complete ---")

if __name__ == "__main__":
    main()
