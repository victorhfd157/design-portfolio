import { Project } from '../types';

// Helper to load projects dynamically
export async function loadProjects(): Promise<Project[]> {
    // 1. Load all data.json files
    const dataFiles = import.meta.glob('/content/projects/*/data.json', { eager: true });

    // 2. Load all images (we need their resolved URLs)
    // We glob all images in content/projects
    const imageFiles = import.meta.glob('/content/projects/**/*.{png,jpg,jpeg,webp,svg}', { eager: true, as: 'url' });

    const projects: Project[] = [];

    for (const path in dataFiles) {
        const module = dataFiles[path] as { default: any };
        const data = module.default;

        // Extract slug from path: /content/projects/{slug}/data.json
        const slug = path.split('/').slice(-2, -1)[0];

        // Resolve Image URLs
        // The data.json should contain relative paths like "./cover.png" or just "cover.png"
        // We need to map them to the resolved URL from imageFiles

        const resolveImage = (relativePath: string) => {
            // Construct the absolute path key that matches imageFiles keys
            // path is like /content/projects/samsara-studio/data.json
            // relativePath is like "cover.png"
            // target is /content/projects/samsara-studio/cover.png
            const dir = path.substring(0, path.lastIndexOf('/'));
            const cleanRelative = relativePath.startsWith('./') ? relativePath.slice(2) : relativePath;
            const fullPath = `${dir}/${cleanRelative}`;

            return imageFiles[fullPath] || relativePath; // Fallback to original if not found (e.g. external URL)
        };

        const project: Project = {
            ...data,
            id: data.id || slug, // Use slug as ID if not provided, or keep numeric if preferred
            imageUrl: resolveImage(data.imageUrl),
            gallery: data.gallery ? data.gallery.map((img: string) => resolveImage(img)) : []
        };

        projects.push(project);
    }

    // Sort by ID or Year if needed
    return projects.sort((a, b) => Number(a.id) - Number(b.id));
}
