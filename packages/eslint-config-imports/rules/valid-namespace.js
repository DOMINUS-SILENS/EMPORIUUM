/**
 * @fileoverview Valide les alias utilisés dans les imports
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
      description: "Valide que les alias utilisés sont dans la liste des alias autorisés",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          validAliases: {
            type: "array",
            items: { type: "string" },
            default: [
              "@types",
              "@types-user",
              "@shared-types",
              "@ui-core",
              "@ui",
              "@components",
              "@utils",
              "@services",
              "@api-client",
              "@hooks",
              "@hooks-auth",
              "@hooks-shared",
              "@schemas",
              "@schemas-zod",
              "@form-generator",
              "@form-configs",
              "@config-vite",
              "@config-env",
              "@py-common"
            ]
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      invalidAlias: "Alias invalide '{{alias}}'. Alias valides: {{validAliases}}"
    }
  },

  create(context) {
    const options = context.options[0] || {};
    const validAliases = options.validAliases || [
      "@types",
      "@types-user",
      "@shared-types",
      "@ui-core",
      "@ui",
      "@components",
      "@utils",
      "@services",
      "@api-client",
      "@hooks",
      "@hooks-auth",
      "@hooks-shared",
      "@schemas",
      "@schemas-zod",
      "@form-generator",
      "@form-configs",
      "@config-vite",
      "@config-env",
      "@py-common"
    ];

    function isValidAlias(alias) {
      return validAliases.some(validAlias => alias.startsWith(validAlias));
    }

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        
        // Vérifier si c'est un alias (commence par @)
        if (source.startsWith('@')) {
          if (!isValidAlias(source)) {
            context.report({
              node,
              messageId: "invalidAlias",
              data: {
                alias: source,
                validAliases: validAliases.join(', ')
              }
            });
          }
        }
      }
    };
  },
}; 