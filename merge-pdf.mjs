// merge-pdf.mjs
import PDFMerger from 'pdf-merger-js';
import path from 'path';
import fs from 'fs';

async function mergePDFs(inputPaths, outputPath) {
    const merger = new PDFMerger();

    for (const pdfPath of inputPaths) {
        if (fs.existsSync(pdfPath)) {
            await merger.add(pdfPath);
        } else {
            console.error(`❌ File not found: ${pdfPath}`);
            process.exit(1);
        }
    }

    const outputDir = path.dirname(outputPath);
    fs.mkdirSync(outputDir, { recursive: true });

    await merger.save(outputPath);
    console.log(`✅ PDFs merged successfully to: ${outputPath}`);
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 3) {
    console.error("Usage: node merge-pdf.mjs <pdf1> <pdf2> ... <output.pdf>");
    process.exit(1);
}

const outputPath = args.pop();
const inputPDFs = args;

mergePDFs(inputPDFs, outputPath);
