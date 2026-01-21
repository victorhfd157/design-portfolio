#!/usr/bin/env python3
"""
Script para aplicar design PREMIUM a todos os guias
"""

from docx import Document
import os
import re
import glob

# Template HTML Premium
PREMIUM_TEMPLATE = """<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Geração Futuro</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&family=Space+Grotesk:wght@300;500;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * {{ scroll-behavior: smooth; }}
        
        body {{ 
            background-color: #020617; 
            color: white; 
            font-family: 'Outfit', sans-serif;
            overflow-x: hidden;
        }}
        
        /* Glassmorphism Premium */
        .glass-premium {{ 
            background: rgba(15, 23, 42, 0.7);
            backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.125);
            box-shadow: 
                0 8px 32px rgba(0, 0, 0, 0.37),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }}
        
        /* Header Premium */
        .header-premium {{
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(20px) saturate(180%);
            border-bottom: 1px solid rgba(168, 85, 247, 0.2);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }}
        
        /* Sidebar */
        .sidebar {{
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.85) 100%);
            backdrop-filter: blur(20px);
            border-right: 1px solid rgba(168, 85, 247, 0.2);
            box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
        }}
        
        .sidebar-link {{
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-left: 3px solid transparent;
        }}
        
        .sidebar-link:hover {{
            background: rgba(168, 85, 247, 0.1);
            border-left-color: #a855f7;
            transform: translateX(4px);
        }}
        
        .sidebar-link.active {{
            background: rgba(168, 85, 247, 0.15);
            border-left-color: #22d3ee;
            color: #22d3ee;
        }}
        
        /* Typography */
        .gradient-text {{
            background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #22d3ee 100%);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientShift 8s ease infinite;
        }}
        
        @keyframes gradientShift {{
            0%, 100% {{ background-position: 0% 50%; }}
            50% {{ background-position: 100% 50%; }}
        }}
        
        .content-section h2 {{ 
            color: #a855f7; 
            margin-top: 3.5rem; 
            margin-bottom: 1.75rem; 
            font-size: 2rem; 
            font-weight: 900;
            border-bottom: 3px solid rgba(168, 85, 247, 0.3);
            padding-bottom: 0.75rem;
            position: relative;
        }}
        
        .content-section h2::before {{
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            width: 80px;
            height: 3px;
            background: linear-gradient(90deg, #a855f7, #22d3ee);
            border-radius: 2px;
        }}
        
        .content-section h3 {{ 
            color: #22d3ee; 
            margin-top: 2.5rem; 
            margin-bottom: 1.25rem; 
            font-size: 1.5rem; 
            font-weight: 700;
        }}
        
        .content-section p {{ 
            margin-bottom: 1.5rem; 
            line-height: 2; 
            color: #cbd5e1; 
            font-size: 1.0625rem;
        }}
        
        .content-section ul, .content-section ol {{ 
            margin-left: 2.5rem; 
            margin-bottom: 2rem; 
            color: #cbd5e1;
        }}
        
        .content-section li {{ 
            margin-bottom: 1rem; 
            line-height: 1.8;
        }}
        
        .content-section li::marker {{ 
            color: #a855f7;
            font-weight: 700;
        }}
        
        /* Activity Box Premium */
        .activity-box {{ 
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.18) 0%, rgba(34, 211, 238, 0.12) 100%);
            border-left: 5px solid #a855f7;
            padding: 2.5rem;
            margin: 2.5rem 0;
            border-radius: 1.25rem;
            box-shadow: 
                0 10px 40px rgba(168, 85, 247, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
        }}
        
        .activity-box::before {{
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(50%, -50%);
        }}
        
        /* Info Box */
        .info-box {{
            background: rgba(34, 211, 238, 0.12);
            border-left: 4px solid #22d3ee;
            padding: 2rem;
            margin: 2rem 0;
            border-radius: 1rem;
            box-shadow: 0 4px 16px rgba(34, 211, 238, 0.15);
        }}
        
        /* Animations */
        @keyframes fadeInUp {{
            from {{
                opacity: 0;
                transform: translateY(30px);
            }}
            to {{
                opacity: 1;
                transform: translateY(0);
            }}
        }}
        
        .fade-in-up {{
            animation: fadeInUp 0.6s ease-out forwards;
        }}
        
        /* Scroll Progress */
        .scroll-progress {{
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #a855f7, #22d3ee);
            z-index: 9999;
            transition: width 0.1s ease;
        }}
        
        /* Hover Effects */
        .hover-lift {{
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }}
        
        .hover-lift:hover {{
            transform: translateY(-4px);
            box-shadow: 0 12px 48px rgba(168, 85, 247, 0.3);
        }}
        
        /* Responsive */
        @media (max-width: 1024px) {{
            .sidebar {{ display: none; }}
        }}
    </style>
</head>
<body class="antialiased">
    <!-- Scroll Progress -->
    <div class="scroll-progress" id="scrollProgress"></div>
    
    <!-- Background -->
    <div class="fixed inset-0 -z-10">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-slate-950 to-cyan-950/20"></div>
        <div class="absolute inset-0" style="background-image: radial-gradient(1px 1px at 50px 50px, rgba(255,255,255,0.3) 50%, transparent 100%); background-size: 500px 500px; opacity: 0.3;"></div>
    </div>

    <!-- Header -->
    <nav class="sticky top-0 z-50 header-premium py-4 px-6">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="../../index.html" class="flex items-center gap-3 text-white hover:text-purple-300 transition-all hover:scale-105">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                <span class="font-medium">Voltar ao Hub</span>
            </a>
            <div class="flex items-center gap-3">
                <span class="text-xs uppercase tracking-widest text-cyan-400 font-bold">{module_title}</span>
                <a href="../../modulo{module_num}/sessao{session_num}/" class="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white text-sm font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl">
                    Ver Apresentação
                </a>
            </div>
        </div>
    </nav>

    <!-- Main Layout -->
    <div class="flex max-w-7xl mx-auto px-6 py-12 gap-8">
        <!-- Sidebar -->
        <aside class="hidden lg:block w-80 flex-shrink-0">
            <div class="sidebar rounded-2xl p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                <h3 class="text-white font-bold text-lg mb-6 flex items-center gap-2">
                    <svg class="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                    Navegação
                </h3>
                <nav class="space-y-2">
                    {toc_html}
                </nav>
            </div>
        </aside>

        <!-- Content -->
        <main class="flex-1 min-w-0">
            <!-- Title -->
            <div class="mb-12 fade-in-up">
                <div class="flex items-center gap-3 mb-4">
                    <span class="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-purple-200 text-xs font-bold uppercase tracking-wider border border-purple-500/30">
                        Guia do Formador
                    </span>
                </div>
                <h1 class="text-6xl lg:text-7xl font-display font-black mb-4 gradient-text leading-tight">
                    {title}
                </h1>
                <p class="text-xl text-slate-300">Guia completo para conduzir esta sessão com sucesso</p>
            </div>

            <!-- Content -->
            <div class="glass-premium rounded-2xl p-8 lg:p-12 content-section hover-lift">
                {content}
            </div>

            <!-- Download -->
            <div class="mt-8 glass-premium rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover-lift">
                <div>
                    <h3 class="text-white font-bold mb-1">Documento Original</h3>
                    <p class="text-slate-400 text-sm">Faça download do ficheiro Word completo</p>
                </div>
                <a href="../modulo{module_num}/{word_filename}" download class="px-6 py-3 rounded-full bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 hover:border-white/30 transition-all flex items-center gap-2 text-white font-medium shadow-lg hover:scale-105">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Download Word
                </a>
            </div>
        </main>
    </div>

    <!-- Footer -->
    <footer class="mt-20 border-t border-white/10 py-8 bg-black/30">
        <div class="max-w-7xl mx-auto px-6 text-center text-slate-400 text-sm">
            <p>act.academy | Geração Futuro © 2026</p>
        </div>
    </footer>

    <!-- Scripts -->
    <script>
        // Scroll Progress
        window.addEventListener('scroll', () => {{
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('scrollProgress').style.width = scrolled + '%';
        }});
        
        // Active Section Highlight
        const sections = document.querySelectorAll('.content-section h2[id]');
        const navLinks = document.querySelectorAll('.sidebar-link');
        
        window.addEventListener('scroll', () => {{
            let current = '';
            sections.forEach(section => {{
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 100) {{
                    current = section.getAttribute('id');
                }}
            }});
            
            navLinks.forEach(link => {{
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {{
                    link.classList.add('active');
                }}
            }});
        }});
    </script>
</body>
</html>"""

def extract_content_and_toc(html_path):
    """Extrai conteúdo e gera TOC de um guia existente"""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extrai conteúdo da seção
    match = re.search(r'<div class="glass-card.*?content-section">(.*?)</div>\s*<div class="mt-8', content, re.DOTALL)
    if not match:
        match = re.search(r'<div class="glass-card.*?>(.*?)</div>\s*</main>', content, re.DOTALL)
    
    if match:
        section_content = match.group(1)
    else:
        return "", ""
    
    # Gera TOC baseado em h2
    toc_items = []
    h2_pattern = re.compile(r'<h2[^>]*>(.+?)</h2>', re.DOTALL)
    
    for i, match in enumerate(h2_pattern.finditer(section_content)):
        title = re.sub(r'<[^>]+>', '', match.group(1)).strip()
        section_id = f"section-{i}"
        
        # Adiciona ID ao h2
        section_content = section_content.replace(
            match.group(0),
            f'<h2 id="{section_id}">{match.group(1)}</h2>',
            1
        )
        
        # Adiciona ao TOC
        icon = title.split()[0] if title.split()[0] in ['🎯', '📦', '🔧', '🚀', '📊', '🎬', '📝', '💡'] else '📄'
        clean_title = ' '.join(title.split()[1:]) if icon in title else title
        toc_items.append(
            f'<a href="#{section_id}" class="sidebar-link block py-2.5 px-4 rounded-lg text-sm text-slate-300 hover:text-white transition-all">'
            f'{icon} {clean_title[:50]}'
            f'</a>'
        )
    
    toc_html = '\\n'.join(toc_items) if toc_items else '<p class="text-slate-400 text-sm">Sem índice</p>'
    
    return section_content, toc_html

# Processa todos os guias
guides = sorted(glob.glob('resources/modulo*/sessao*-guia.html'))
print(f"🎨 Aplicando design PREMIUM a {len(guides)} guias...\\n")

for guide_path in guides:
    try:
        # Extrai info do caminho
        parts = guide_path.split('/')
        module_num = parts[1].replace('modulo', '')
        session_num = parts[2].split('-')[0].replace('sessao', '')
        
        # Lê guia atual
        with open(guide_path, 'r', encoding='utf-8') as f:
            current_content = f.read()
        
        # Extrai título
        title_match = re.search(r'<h1[^>]*>(.+?)</h1>', current_content, re.DOTALL)
        title = re.sub(r'<[^>]+>', '', title_match.group(1)).strip() if title_match else f"Sessão {session_num}"
        
        # Extrai conteúdo e gera TOC
        content, toc_html = extract_content_and_toc(guide_path)
        
        # Encontra nome do arquivo Word
        word_match = re.search(r'href="\\.\\./(modulo\\d+/[^"]+\\.docx)"', current_content)
        word_filename = word_match.group(1).split('/')[-1] if word_match else f"Sessão {session_num}.docx"
        
        # Gera novo HTML
        new_html = PREMIUM_TEMPLATE.format(
            title=title,
            module_title=f"Módulo {module_num}",
            module_num=module_num,
            session_num=session_num,
            content=content,
            toc_html=toc_html,
            word_filename=word_filename
        )
        
        # Salva
        with open(guide_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
        
        print(f"✨ {parts[1]}/sessao{session_num}: {title[:60]}")
        
    except Exception as e:
        print(f"❌ Erro em {guide_path}: {e}")

print(f"\\n🎉 Design premium aplicado com sucesso!")
print("\\n💎 Melhorias:")
print("   • Sidebar de navegação fixa")
print("   • Animações suaves")
print("   • Glassmorphism avançado")
print("   • Gradientes dinâmicos")
print("   • Scroll progress bar")
print("   • Hover effects premium")
