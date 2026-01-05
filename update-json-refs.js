import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECTS_DIR = join(__dirname, 'content', 'projects');

async function getAllDataJsonFiles(dir, fileList = []) {
    const files = await readdir(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = join(dir, file.name);

        if (file.isDirectory()) {
            await getAllDataJsonFiles(fullPath, fileList);
        } else if (file.name === 'data.json') {
            fileList.push(fullPath);
        }
    }

    return fileList;
}

function updateImageExtensions(jsonString) {
    // Replace .png, .jpg, .jpeg with .webp
    return jsonString
        .replace(/\.png"/g, '.webp"')
        .replace(/\.jpg"/g, '.webp"')
        .replace(/\.jpeg"/g, '.webp"');
}

async function main() {
    console.log('🔄 Updating data.json files to use WebP images...\n');

    const dataJsonFiles = await getAllDataJsonFiles(PROJECTS_DIR);
    console.log(`Found ${dataJsonFiles.length} data.json files\n`);

    let updatedCount = 0;

    for (const filePath of dataJsonFiles) {
        const content = await readFile(filePath, 'utf-8');
        const updatedContent = updateImageExtensions(content);

        if (content !== updatedContent) {
            await writeFile(filePath, updatedContent, 'utf-8');
            const relativePath = filePath.replace(PROJECTS_DIR, '');
            console.log(`✓ Updated: ${relativePath}`);
            updatedCount++;
        }
    }

    console.log(`\n✓ Updated ${updatedCount} data.json files to use .webp extensions\n`);
}

main().catch(console.error);
