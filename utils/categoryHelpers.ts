// Category color system
export const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
        'BRANDING': 'from-purple-500/80 to-pink-500/80',
        'UX/UI': 'from-blue-500/80 to-cyan-500/80',
        'E-LEARNING': 'from-green-500/80 to-emerald-500/80',
        'WEBSITE': 'from-orange-500/80 to-red-500/80',
        'APP DESIGN': 'from-indigo-500/80 to-purple-500/80',
        'MOTION': 'from-yellow-500/80 to-orange-500/80',
        'VIDEO': 'from-red-500/80 to-rose-500/80',
    };

    return categoryColors[category.toUpperCase()] || 'from-gray-500/80 to-gray-600/80';
};

// Check if project is new (<30 days)
export const isNewProject = (date: string): boolean => {
    const projectDate = new Date(date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - projectDate.getTime()) / (1000 * 60 * 60 * 24));

    return daysDiff < 30;
};

export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short'
    });
};
