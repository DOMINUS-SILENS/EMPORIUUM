#!/usr/bin/env python3
import re

# Test avec le contenu du fichier Message.ts
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
field_re = re.compile(r'(\w+):\s*(z\.[\w\W]+?)(?:,|\s*})', re.MULTILINE)

schema_match = schema_body_re.search(content)
if schema_match:
    schema_body = schema_match.group(1)
    print("Schema body:")
    print(schema_body)
    print("\nFields found:")
    for field_match in field_re.finditer(schema_body):
        field_name = field_match.group(1)
        field_type = field_match.group(2)
        print(f"  {field_name}: {field_type}")
else:
    print("No schema body found") 