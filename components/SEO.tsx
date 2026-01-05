import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article' | 'profile';
    author?: string;
    keywords?: string[];
}

const SEO: React.FC<SEOProps> = ({
    title = 'Victor Duarte - Creative Designer & Developer',
    description = 'Portfolio of Victor Duarte, a creative designer and developer specializing in stunning digital experiences, branding, and UI/UX design.',
    image = 'https://victorduarte.com/og-image.jpg',
    type = 'website',
    author = 'Victor Duarte',
    keywords = [
        'designer',
        'developer',
        'portfolio',
        'UI/UX',
        'branding',
        'web design',
        'creative',
        'Victor Duarte',
    ],
}) => {
    const location = useLocation();
    const canonicalUrl = `https://victorduarte.com${location.pathname}`;

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />
            <meta name="author" content={author} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="Victor Duarte Portfolio" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:creator" content="@victorduarte" />

            {/* Additional Meta */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Person',
                    name: 'Victor Duarte',
                    url: 'https://victorduarte.com',
                    image: image,
                    sameAs: [
                        'https://linkedin.com/in/victorduarte',
                        'https://github.com/victorduarte',
                        'https://dribbble.com/victorduarte',
                    ],
                    jobTitle: 'Creative Designer & Developer',
                    worksFor: {
                        '@type': 'Organization',
                        name: 'Freelance',
                    },
                    description: description,
                })}
            </script>
        </Helmet>
    );
};

export default SEO;
