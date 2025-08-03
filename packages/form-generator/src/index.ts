import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import * as ts from 'typescript';

// Paths are relative to the project root, assuming the script is run from there.
const PROJECT_ROOT = process.cwd();
const SCHEMAS_DIR = path.resolve(PROJECT_ROOT, 'packages/schemas/src');
const OUTPUT_DIR = path.resolve(PROJECT_ROOT, 'packages/form-configs/src');

/**
 * Extracts detailed information from a Zod field definition using the AST.
 * @param fieldNode The AST node for the Zod field (e.g., `z.string().min(5)`).
 * @returns A structured object with the field's properties.
 */
function extractZodFieldInfo(fieldNode: ts.Expression): any {
    const info: any = {
        component: 'input', // Default component
        type: 'text',       // Default type
        required: true,
        validation: {},
    };

    let currentNode = fieldNode;
    while (ts.isCallExpression(currentNode)) {
        const expression = currentNode.expression;
        if (ts.isPropertyAccessExpression(expression)) {
            const propName = expression.name.getText();
            const args = currentNode.arguments;

            switch (propName) {
                case 'string':
                    info.type = 'text';
                    break;
                case 'email':
                    info.type = 'email';
                    break;
                case 'number':
                    info.type = 'number';
                    break;
                case 'optional':
                case 'nullable':
                    info.required = false;
                    break;
                case 'min':
                    if (args.length > 0 && ts.isNumericLiteral(args[0])) {
                        info.validation.minLength = parseInt(args[0].text, 10);
                    }
                    break;
                case 'max':
                    if (args.length > 0 && ts.isNumericLiteral(args[0])) {
                        info.validation.maxLength = parseInt(args[0].text, 10);
                    }
                    break;
                case 'default':
                    if (args.length > 0) {
                        info.defaultValue = (args[0] as any).text || '';
                    }
                    break;
                case 'enum':
                    info.component = 'select';
                    if (args.length > 0 && ts.isArrayLiteralExpression(args[0])) {
                        info.enumValues = args[0].elements.map(el => (el as ts.StringLiteral).text);
                    }
                    break;
            }
        }
        currentNode = (currentNode.expression as ts.PropertyAccessExpression).expression;
    }

    // Infer password type by field name convention
    if (info.name?.toLowerCase().includes('password')) {
        info.type = 'password';
    }

    return info;
}

/**
 * Parses a Zod schema file to extract form configuration.
 * @param sourceFile The source file to parse.
 * @returns The generated form configuration object, or null if no schema is found.
 */
function parseSchemaFile(sourceFile: ts.SourceFile): any | null {
    let formConfig: any = null;

    function visit(node: ts.Node) {
        // Find `export const xxxSchema = z.object({...})`
        if (ts.isVariableDeclaration(node) && node.name.getText().endsWith('Schema') && node.initializer && ts.isCallExpression(node.initializer)) {
            const callExpr = node.initializer;
            const propAccess = callExpr.expression;

            // Check if it's a z.object call
            if (ts.isPropertyAccessExpression(propAccess) && propAccess.name.getText() === 'object') {
                const formNameRaw = node.name.getText().replace(/Schema$/, '');
                const formName = formNameRaw.charAt(0).toLowerCase() + formNameRaw.slice(1);

                formConfig = { formName, fields: [] };

                const objectLiteral = callExpr.arguments[0] as ts.ObjectLiteralExpression;
                objectLiteral.properties.forEach(prop => {
                    if (ts.isPropertyAssignment(prop) && prop.initializer) {
                        const fieldName = prop.name.getText();
                        const fieldInfo = extractZodFieldInfo(prop.initializer);

                        // Finalize field configuration
                        const finalField = {
                            name: fieldName,
                            component: fieldInfo.component,
                            type: fieldInfo.type,
                            label: `${formName}.${fieldName}.label`,
                            placeholder: `${formName}.${fieldName}.placeholder`,
                            description: `${formName}.${fieldName}.description`,
                            required: fieldInfo.required,
                            ...(fieldInfo.defaultValue && { defaultValue: fieldInfo.defaultValue }),
                            ...(fieldInfo.enumValues && { enumValues: fieldInfo.enumValues }),
                            ...(Object.keys(fieldInfo.validation).length > 0 && { validation: fieldInfo.validation }),
                        };

                        formConfig.fields.push(finalField);
                    }
                });
            }
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return formConfig;
}

/**
 * Main function to generate form configurations.
 */
async function generateForms() {
    console.log('--- Starting form config generation ---');

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const schemaFiles = await glob(`${SCHEMAS_DIR}/**/*.ts`);
    const program = ts.createProgram(schemaFiles, { allowJs: true });

    for (const file of schemaFiles) {
        const sourceFile = program.getSourceFile(file);

        if (sourceFile) {
            const config = parseSchemaFile(sourceFile);
            if (config && config.formName) {
                const outputFileName = `${config.formName}.form.config.json`;
                const outputPath = path.join(OUTPUT_DIR, outputFileName);
                fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
                console.log(`-> Generated ${outputFileName}`);
            }
        }
    }

    console.log('--- Form config generation complete. ---');
}

generateForms().catch(console.error);

