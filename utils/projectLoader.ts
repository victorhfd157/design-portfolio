import { Project } from '../types';

// Helper to load projects dynamically
export async function loadProjects(): Promise<Project[]> {
    // 1. Load all data.json files recursively
    // This will match /content/projects/data.json, /content/projects/branding/project-a/data.json, etc.
    const dataFiles = import.meta.glob('/content/projects/**/data.json', { eager: true });

    // 2. Load all images (we need their resolved URLs)
    // We glob all images in content/projects recursively
    const imageFiles = import.meta.glob('/content/projects/**/*.{png,jpg,jpeg,webp,svg}', { eager: true, as: 'url' });

    const projects: Project[] = [];

    for (const path in dataFiles) {
        const module = dataFiles[path] as { default: any };
        const data = module.default;

        // Extract slug from path. 
        // If path is /content/projects/branding/my-project/data.json, slug is my-project
        // If path is /content/projects/my-project/data.json, slug is my-project
        const parts = path.split('/');
        const slug = parts[parts.length - 2];

        // Determine Categories
        let categories: string[] = [];

        // Priority 1: Explicit 'categories' array in data.json
        if (Array.isArray(data.categories)) {
            categories = data.categories;
        }
        // Priority 2: Explicit 'category' string in data.json (legacy support)
        else if (data.category) {
            categories = [data.category];
        }
        // Priority 3: Folder name if nested
        // Example: /content/projects/Branding/ProjectA/data.json -> Category: Branding
        // We check if the parent folder is NOT 'projects'
        else {
            const parentFolder = parts[parts.length - 3];
            if (parentFolder !== 'projects') {
                // Capitalize first letter
                categories = [parentFolder.charAt(0).toUpperCase() + parentFolder.slice(1)];
            } else {
                categories = ['Uncategorized'];
            }
        }

        // Resolve Image URLs
        const resolveImage = (relativePath: string) => {
            if (!relativePath) return '';
            const dir = path.substring(0, path.lastIndexOf('/'));
            const cleanRelative = relativePath.startsWith('./') ? relativePath.slice(2) : relativePath;
            const fullPath = `${dir}/${cleanRelative}`;

            return imageFiles[fullPath] || relativePath;
        };

        const project: Project = {
            ...data,
            id: data.id || slug,
            categories: categories,
            imageUrl: resolveImage(data.imageUrl),
            gallery: data.gallery ? data.gallery.map((img: string) => resolveImage(img)) : []
        };

        // Remove legacy category field if present in spread
        if ('category' in project) {
            delete (project as any).category;
        }

        projects.push(project);
    }

    // Sort by ID or Year if needed
    return projects.sort((a, b) => Number(a.id) - Number(b.id));
}
