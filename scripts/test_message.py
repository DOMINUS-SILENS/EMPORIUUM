#!/usr/bin/env python3
import re

# Test avec le contenu exact du fichier Message.ts
content = '''import { z } from "zod";
import { userSchema } from "./User";

// Schéma pour un message
export const messageSchema = z.object({
  id: z.number().int(),
  content: z.string(),
  sender_id: z.number().int(),
  created_at: z.string().datetime({ offset: true }),
  is_read: z.boolean(),
  sender: userSchema,
});

// Inferred type
export type Message = z.infer<typeof messageSchema>;
'''

# Regex pour trouver les champs dans z.object()
schema_body_re = re.compile(r'z\.object\({([\s\S]*?)}\)', re.MULTILINE)

schema_match = schema_body_re.search(content)
if schema_match:
    schema_body = schema_match.group(1)
    print("Schema body:")
    print(repr(schema_body))
    print("\nLines:")
    lines = schema_body.split('\n')
    for i, line in enumerate(lines):
        line = line.strip()
        print(f"Line {i}: '{line}'")
        if ':' in line:
            print(f"  Contains ':' and 'z.': {'z.' in line}")
            match = re.match(r'(\w+):\s*(.+)', line)
            if match:
                field_name = match.group(1)
                field_type = match.group(2).rstrip(',')
                print(f"  Found field: {field_name} -> {field_type}")
else:
    print("No schema body found") 