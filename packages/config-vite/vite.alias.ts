import { fileURLToPath, URL } from "node:url";
import { dirname, resolve } from "node:path";
import type { AliasOptions } from "vite";

// Ce fichier doit être appelé depuis vite.config.ts via import
export function createAppAliases(appRootUrl: string): AliasOptions {
  const appSrc = resolve(fileURLToPath(new URL(appRootUrl, import.meta.url)), "src");

  return [
    {
      find: "@",
      replacement: appSrc,
    },
    // Packages partagés - alignés avec tsconfig.base.json
    {
      find: "@types",
      replacement: fileURLToPath(new URL("../packages/types/src", import.meta.url)),
    },
    {
      find: "@types-user",
      replacement: fileURLToPath(new URL("../packages/types-user/src", import.meta.url)),
    },
    {
      find: "@shared-types",
      replacement: fileURLToPath(new URL("../packages/shared-types/src", import.meta.url)),
    },
    {
      find: "@ui-core",
      replacement: fileURLToPath(new URL("../packages/ui-core/src", import.meta.url)),
    },
    {
      find: "@ui",
      replacement: fileURLToPath(new URL("../packages/ui/src", import.meta.url)),
    },
    {
      find: "@components",
      replacement: fileURLToPath(new URL("../packages/components", import.meta.url)),
    },
    {
      find: "@utils",
      replacement: fileURLToPath(new URL("../packages/utils/src", import.meta.url)),
    },
    {
      find: "@services",
      replacement: fileURLToPath(new URL("../packages/services/src", import.meta.url)),
    },
    {
      find: "@api-client",
      replacement: fileURLToPath(new URL("../packages/api-client/src", import.meta.url)),
    },
    {
      find: "@hooks",
      replacement: fileURLToPath(new URL("../packages/hooks/src", import.meta.url)),
    },
    {
      find: "@hooks-auth",
      replacement: fileURLToPath(new URL("../packages/hooks-auth/src", import.meta.url)),
    },
    {
      find: "@hooks-shared",
      replacement: fileURLToPath(new URL("../packages/hooks-shared/src", import.meta.url)),
    },
    {
      find: "@schemas",
      replacement: fileURLToPath(new URL("../packages/schemas/src", import.meta.url)),
    },
    {
      find: "@schemas-zod",
      replacement: fileURLToPath(new URL("../packages/schemas-zod/src", import.meta.url)),
    },
    {
      find: "@form-generator",
      replacement: fileURLToPath(new URL("../packages/form-generator/src", import.meta.url)),
    },
    {
      find: "@form-configs",
      replacement: fileURLToPath(new URL("../packages/form-configs/src", import.meta.url)),
    },
    {
      find: "@config-vite",
      replacement: fileURLToPath(new URL("../packages/config-vite/src", import.meta.url)),
    },
    {
      find: "@config-env",
      replacement: fileURLToPath(new URL("../packages/config-env/src", import.meta.url)),
    },
    {
      find: "@py-common",
      replacement: fileURLToPath(new URL("../packages/py-common/src", import.meta.url)),
    },
  ];
}