/**
 * @fileoverview Interdit les imports relatifs vers les packages partagés
 * @author Dominus Silens
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Interdit les imports relatifs vers les packages partagés",
      category: "Best Practices",
      recommended: true,
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          packages: {
            type: "array",
            items: { type: "string" },
            default: ["packages"]
          },
          aliases: {
            type: "object",
            additionalProperties: { type: "string" }
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      noRelativeParentImports: "Utilisez un alias au lieu d'un import relatif vers '{{package}}'. Exemple: import { {{export}} } from '{{alias}}'"
    }
  },

  create(context) {
    const options = context.options[0] || {};
    const packages = options.packages || ["packages"];
    const aliases = options.aliases || {
      "@types": "packages/types/src",
      "@ui-core": "packages/ui-core/src",
      "@services": "packages/services/src",
      "@hooks-shared": "packages/hooks-shared/src",
      "@schemas": "packages/schemas/src",
      "@schemas-zod": "packages/schemas-zod/src"
    };

    // Patterns pour détecter les imports relatifs vers packages
    const relativePatterns = [
      /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/packages\/([^'"]+)['"]/g,
      /from\s+['"]\.\.\/\.\.\/\.\.\/packages\/([^'"]+)['"]/g,
      /from\s+['"]\.\.\/\.\.\/packages\/([^'"]+)['"]/g,
      /from\s+['"]\.\.\/packages\/([^'"]+)['"]/g,
      /from\s+['"]packages\/([^'"]+)['"]/g
    ];

    function findBestAlias(packagePath) {
      for (const [alias, targetPath] of Object.entries(aliases)) {
        if (packagePath.startsWith(targetPath)) {
          const remainingPath = packagePath.slice(targetPath.length);
          return `${alias}${remainingPath}`;
        }
      }
      return null;
    }

    function reportRelativeImport(node, packagePath) {
      const alias = findBestAlias(packagePath);
      const exportName = node.source.value.split('/').pop().replace(/\.(ts|tsx|js|jsx)$/, '');
      
      context.report({
        node,
        messageId: "noRelativeParentImports",
        data: {
          package: packagePath,
          export: exportName,
          alias: alias || "@types"
        },
        fix(fixer) {
          if (alias) {
            return fixer.replaceText(
              node.source,
              `'${alias}'`
            );
          }
          return null;
        }
      });
    }

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        
        // Vérifier si c'est un import relatif vers packages
        for (const pattern of relativePatterns) {
          const match = source.match(pattern);
          if (match) {
            const packagePath = match[1];
            reportRelativeImport(node, packagePath);
            break;
          }
        }
      }
    };
  },
}; 