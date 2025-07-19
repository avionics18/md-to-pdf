const fs = require("fs");
const path = require("path");
const { mdToPdf } = require("md-to-pdf");

// --- Helper to show usage and exit ---
function showUsage() {
    console.error(`
❌ Missing or invalid arguments.

✅ Usage:
    node convert.js <input-directory> <output-directory>

📌 Example:
    node convert.js ./codes ./pdfs
  `);
    process.exit(1);
}

// --- Validate CLI Args ---
const args = process.argv.slice(2);
if (args.length !== 2) {
    showUsage();
}

const [inputDir, outputDir] = args.map((dir) => path.resolve(dir));
const templatePath = path.join(__dirname, "template", "template.html");
console.log(templatePath);

// --- Check if input directory exists ---
if (!fs.existsSync(inputDir)) {
    console.error(`❌ Input directory does not exist: ${inputDir}`);
    showUsage();
}

// --- Create output directory if it doesn't exist ---
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// --- Start Conversion ---
(async () => {
    const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".md"));
    if (files.length === 0) {
        console.warn(`⚠️ No markdown (.md) files found in ${inputDir}`);
        return;
    }

    for (const file of files) {
        const inputPath = path.join(inputDir, file);
        const baseName = path.basename(file, ".md");
        const outputPath = path.join(outputDir, `${baseName}.pdf`);

        console.log(`📄 Converting ${file} → ${baseName}.pdf`);

        await mdToPdf(
            { path: inputPath },
            {
                dest: outputPath,
                document_title: baseName,
                // template: fs.readFileSync(templatePath, "utf-8"),
                stylesheet: ['template/style-light.css'],
                highlight_style: "github",
                pdf_options: {
                    format: "A4",
                    margin: {
                        top: "15mm",
                        bottom: "15mm",
                        right: "20mm",
                        left: "20mm",
                    },
                    printBackground: true,
                },
            }
        );

        console.log(`✅ Saved: ${outputPath}`);
    }
})();
