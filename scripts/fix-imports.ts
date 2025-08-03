import fs from "fs";
import path from "path";
import glob from "glob";

// 📦 Corrige les mauvais imports basés sur le nom incorrect dans package.json

const PACKAGES_DIR = path.join(__dirname, "packages");

function getCorrectMappings(): Record<string, string> {
  const mappings: Record<string, string> = {};

  const packages = fs.readdirSync(PACKAGES_DIR);
  for (const pkg of packages) {
    const packageJsonPath = path.join(PACKAGES_DIR, pkg, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const json = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      const correctedName = `@${pkg.replace(/-/g, "/")}`;
      if (json.name && json.name !== correctedName) {
        mappings[json.name] = correctedName;
      }
    }
  }

  return mappings;
}

function fixImportsInFile(filePath: string, mappings: Record<string, string>) {
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  for (const [bad, good] of Object.entries(mappings)) {
    const regex = new RegExp(`(['"\`])${bad}(/[^'"\`]*)?\\1`, "g");
    content = content.replace(regex, (_match, quote, suffix = "") => {
      modified = true;
      return `${quote}${good}${suffix}${quote}`;
    });
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Corrigé : ${filePath}`);
  }
}

function main() {
  const mappings = getCorrectMappings();
  if (Object.keys(mappings).length === 0) {
    console.log("✅ Aucun nom de package incorrect détecté.");
    return;
  }

  const files = glob.sync("**/*.{ts,tsx}", {
    ignore: ["node_modules/**", "dist/**"],
  });

  for (const file of files) {
    fixImportsInFile(file, mappings);
  }

  console.log("🎉 Correction des imports terminée !");
}

main();
