import type { ZodSchema } from 'zod';

// Interface pour les imports dynamiques de schémas
export interface SchemaImport {
  schema: ZodSchema;
  alias: string;
  package: string;
}

// Configuration des imports dynamiques par alias
export const DYNAMIC_SCHEMA_IMPORTS = {
  '@schemas': {
    User: 'packages/schemas/src/User.ts',
    UserCreate: 'packages/schemas/src/UserCreate.ts',
    UserUpdate: 'packages/schemas/src/UserUpdate.ts',
    UserInDB: 'packages/schemas/src/UserInDB.ts',
    Login: 'packages/schemas/src/Login.ts',
    Token: 'packages/schemas/src/Token.ts',
    TokenData: 'packages/schemas/src/TokenData.ts',
    PasswordUpdate: 'packages/schemas/src/PasswordUpdate.ts',
    Message: 'packages/schemas/src/Message.ts',
    MessageCreate: 'packages/schemas/src/MessageCreate.ts',
    Conversation: 'packages/schemas/src/Conversation.ts',
    ConversationCreate: 'packages/schemas/src/ConversationCreate.ts'
  },
  '@schemas-zod': {
    UserSchema: 'packages/schemas-zod/src/UserSchema.ts',
    ProductSchema: 'packages/schemas-zod/src/ProductSchema.ts',
    OrderSchema: 'packages/schemas-zod/src/OrderSchema.ts'
  },
  '@types': {
    User: 'packages/types/src/user.ts',
    Product: 'packages/types/src/product.ts',
    Order: 'packages/types/src/order.ts',
    AuthResponse: 'packages/types/src/auth.ts'
  }
} as const;

// Fonction pour importer dynamiquement un schéma
export async function importSchema<T = any>(
  alias: keyof typeof DYNAMIC_SCHEMA_IMPORTS,
  schemaName: string
): Promise<ZodSchema<T>> {
  const aliasConfig = DYNAMIC_SCHEMA_IMPORTS[alias];
  if (!aliasConfig) {
    throw new Error(`Alias non reconnu: ${alias}`);
  }

  const schemaPath = aliasConfig[schemaName as keyof typeof aliasConfig];
  if (!schemaPath) {
    throw new Error(`Schéma non trouvé: ${schemaName} dans ${alias}`);
  }

  try {
    const module = await import(schemaPath);
    return module.default || module[schemaName];
  } catch (error) {
    throw new Error(`Erreur lors de l'import du schéma ${schemaName}: ${error}`);
  }
}

// Fonction pour importer plusieurs schémas
export async function importSchemas<T extends Record<string, any>>(
  imports: Array<{ alias: keyof typeof DYNAMIC_SCHEMA_IMPORTS; schema: string }>
): Promise<T> {
  const results: any = {};
  
  for (const { alias, schema } of imports) {
    results[schema] = await importSchema(alias, schema);
  }
  
  return results as T;
}

// Fonction pour valider avec un schéma importé dynamiquement
export async function validateWithSchema<T>(
  alias: keyof typeof DYNAMIC_SCHEMA_IMPORTS,
  schemaName: string,
  data: any
): Promise<T> {
  const schema = await importSchema<T>(alias, schemaName);
  return schema.parse(data);
}

// Fonction pour obtenir la liste des schémas disponibles
export function getAvailableSchemas(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  
  for (const [alias, schemas] of Object.entries(DYNAMIC_SCHEMA_IMPORTS)) {
    result[alias] = Object.keys(schemas);
  }
  
  return result;
}

// Fonction pour vérifier si un schéma existe
export function schemaExists(
  alias: keyof typeof DYNAMIC_SCHEMA_IMPORTS,
  schemaName: string
): boolean {
  const aliasConfig = DYNAMIC_SCHEMA_IMPORTS[alias];
  return aliasConfig && schemaName in aliasConfig;
}

// Export par défaut pour faciliter l'import
export default {
  importSchema,
  importSchemas,
  validateWithSchema,
  getAvailableSchemas,
  schemaExists,
  DYNAMIC_SCHEMA_IMPORTS
}; 