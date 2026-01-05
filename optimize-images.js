import sharp from 'sharp';
import { readdir, mkdir, copyFile, stat } from 'fs/promises';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECTS_DIR = join(__dirname, 'content', 'projects');
const BACKUP_DIR = join(__dirname, 'content', 'projects-backup');
const MAX_WIDTH = 2000;
const QUALITY = 85;

// Image extensions to process
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

async function ensureDir(dir) {
    try {
        await mkdir(dir, { recursive: true });
    } catch (error) {
        if (error.code !== 'EEXIST') throw error;
    }
}

async function getAllImageFiles(dir, fileList = []) {
    const files = await readdir(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = join(dir, file.name);

        if (file.isDirectory()) {
            await getAllImageFiles(fullPath, fileList);
        } else {
            const ext = extname(file.name).toLowerCase();
            if (IMAGE_EXTENSIONS.includes(ext)) {
                fileList.push(fullPath);
            }
        }
    }

    return fileList;
}

async function getFileSize(filePath) {
    const stats = await stat(filePath);
    return stats.size;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

async function optimizeImage(inputPath, outputPath) {
    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // Resize if image is wider than MAX_WIDTH
        let pipeline = image;
        if (metadata.width > MAX_WIDTH) {
            pipeline = pipeline.resize(MAX_WIDTH, null, {
                withoutEnlargement: true,
                fit: 'inside'
            });
        }

        // Convert to WebP
        await pipeline
            .webp({ quality: QUALITY })
            .toFile(outputPath);

        return true;
    } catch (error) {
        console.error(`Error optimizing ${inputPath}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('🚀 Starting image optimization...\n');

    // Get all image files
    const imageFiles = await getAllImageFiles(PROJECTS_DIR);
    console.log(`Found ${imageFiles.length} images to optimize\n`);

    if (imageFiles.length === 0) {
        console.log('No images found to optimize.');
        return;
    }

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    let successCount = 0;
    let errorCount = 0;

    // Process each image
    for (let i = 0; i < imageFiles.length; i++) {
        const inputPath = imageFiles[i];
        const relativePath = inputPath.replace(PROJECTS_DIR, '');
        const backupPath = join(BACKUP_DIR, relativePath);

        // Create output path with .webp extension
        const outputPath = inputPath.replace(extname(inputPath), '.webp');

        console.log(`[${i + 1}/${imageFiles.length}] Processing: ${relativePath}`);

        try {
            // Get original size
            const originalSize = await getFileSize(inputPath);
            totalOriginalSize += originalSize;

            // Create backup directory structure
            await ensureDir(dirname(backupPath));

            // Backup original file
            await copyFile(inputPath, backupPath);

            // Optimize image
            const success = await optimizeImage(inputPath, outputPath);

            if (success) {
                // Get optimized size
                const optimizedSize = await getFileSize(outputPath);
                totalOptimizedSize += optimizedSize;

                const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
                console.log(`  ✓ ${formatBytes(originalSize)} → ${formatBytes(optimizedSize)} (${savings}% reduction)`);

                successCount++;
            } else {
                errorCount++;
            }
        } catch (error) {
            console.error(`  ✗ Error: ${error.message}`);
            errorCount++;
        }

        console.log('');
    }

    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 Optimization Summary');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Total images processed: ${imageFiles.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Original total size: ${formatBytes(totalOriginalSize)}`);
    console.log(`Optimized total size: ${formatBytes(totalOptimizedSize)}`);
    console.log(`Total savings: ${formatBytes(totalOriginalSize - totalOptimizedSize)} (${((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)}%)`);
    console.log('═══════════════════════════════════════════════════════');
    console.log(`\n✓ Original images backed up to: ${BACKUP_DIR}`);
    console.log('✓ Optimization complete!\n');
}

main().catch(console.error);
