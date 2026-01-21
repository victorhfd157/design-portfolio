#!/usr/bin/env python3
"""
ULTRA-PREMIUM UI/UX para todos os guias
- Design profissional de alto nível
- Animações fluidas
- Micro-interações
- Cards premium
- Tipografia sofisticada
- Responsividade perfeita
"""

import glob

ULTRA_PREMIUM_TEMPLATE = """<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Geração Futuro</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * {{
            scroll-behavior: smooth;
        }}
        
        :root {{
            --primary: #8B5CF6;
            --primary-light: #A78BFA;
            --primary-dark: #7C3AED;
            --secondary: #06B6D4;
            --secondary-light: #22D3EE;
            --accent: #F59E0B;
            --bg-dark: #0F172A;
            --bg-darker: #020617;
            --text-primary: #F8FAFC;
            --text-secondary: #CBD5E1;
            --text-muted: #64748B;
        }}
        
        body {{
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
            font-family: 'Inter', sans-serif;
            color: var(--text-primary);
            overflow-x: hidden;
        }}
        
        /* Animated Background */
        .animated-bg {{
            position: fixed;
            inset: 0;
            z-index: -1;
            background: 
                radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.15), transparent),
                radial-gradient(ellipse 60% 50% at 50% 120%, rgba(6, 182, 212, 0.12), transparent);
        }}
        
        .animated-bg::before {{
            content: '';
            position: absolute;
            inset: 0;
            background-image: 
                radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
            animation: pulse 15s ease-in-out infinite;
        }}
        
        @keyframes pulse {{
            0%, 100% {{ opacity: 1; }}
            50% {{ opacity: 0.5; }}
        }}
        
        /* Premium Header */
        .premium-header {{
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(20px) saturate(180%);
            border-bottom: 1px solid rgba(139, 92, 246, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }}
        
        /* Ultra Premium Sidebar */
        .ultra-sidebar {{
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.9));
            backdrop-filter: blur(24px) saturate(150%);
            border-right: 1px solid rgba(139, 92, 246, 0.25);
            box-shadow: 8px 0 40px rgba(0, 0, 0, 0.3);
        }}
        
        .sidebar-header {{
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(6, 182, 212, 0.2));
            border-bottom: 2px solid rgba(139, 92, 246, 0.4);
            padding: 1.5rem;
            border-radius: 1rem;
            margin-bottom: 1.5rem;
        }}
        
        .nav-item {{
            position: relative;
            padding: 1rem 1.25rem;
            margin: 0.5rem 0;
            border-radius: 0.75rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
        }}
        
        .nav-item::before {{
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 0;
            background: linear-gradient(180deg, var(--primary), var(--secondary));
            border-radius: 0 4px 4px 0;
            transition: height 0.3s ease;
        }}
        
        .nav-item:hover {{
            background: linear-gradient(90deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.05));
            transform: translateX(8px);
        }}
        
        .nav-item:hover::before {{
            height: 70%;
        }}
        
        .nav-item.active {{
            background: linear-gradient(90deg, rgba(139, 92, 246, 0.25), rgba(6, 182, 212, 0.15));
            border: 1px solid rgba(139, 92, 246, 0.3);
        }}
        
        .nav-item.active::before {{
            height: 100%;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
        }}
        
        .nav-icon {{
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.1));
            border-radius: 0.75rem;
            font-size: 1.25rem;
            transition: all 0.3s ease;
        }}
        
        .nav-item:hover .nav-icon {{
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(6, 182, 212, 0.2));
            transform: scale(1.1) rotate(5deg);
        }}
        
        .nav-item.active .nav-icon {{
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }}
        
        /* Progress Circle */
        .progress-circle {{
            width: 120px;
            height: 120px;
            position: relative;
        }}
        
        .progress-ring {{
            transform: rotate(-90deg);
        }}
        
        .progress-ring-circle {{
            stroke: var(--primary);
            stroke-dasharray: 283;
            stroke-dashoffset: 283;
            transition: stroke-dashoffset 0.5s ease;
        }}
        
        /* Content Cards Ultra Premium */
        .content-card {{
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.6));
            backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(139, 92, 246, 0.2);
            border-radius: 1.5rem;
            padding: 3rem;
            margin: 2rem 0;
            box-shadow: 
                0 20px 60px rgba(0, 0, 0, 0.4),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }}
        
        .content-card:hover {{
            transform: translateY(-4px);
            box-shadow: 
                0 30px 80px rgba(139, 92, 246, 0.3),
                0 0 0 1px rgba(139, 92, 246, 0.3) inset;
            border-color: rgba(139, 92, 246, 0.4);
        }}
        
        /* Typography Ultra Premium */
        .title-gradient {{
            background: linear-gradient(135deg, #A78BFA 0%, #EC4899 50%, #22D3EE 100%);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientFlow 8s ease infinite;
            font-weight: 900;
            letter-spacing: -0.02em;
        }}
        
        @keyframes gradientFlow {{
            0%, 100% {{ background-position: 0% 50%; }}
            50% {{ background-position: 100% 50%; }}
        }}
        
        h2 {{
            color: var(--primary-light);
            font-weight: 800;
            font-size: 2.25rem;
            margin: 4rem 0 2rem;
            position: relative;
            padding-bottom: 1rem;
        }}
        
        h2::after {{
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            border-radius: 2px;
        }}
        
        h3 {{
            color: var(--secondary-light);
            font-weight: 700;
            font-size: 1.75rem;
            margin: 3rem 0 1.5rem;
        }}
        
        p {{
            color: var(--text-secondary);
            line-height: 2;
            font-size: 1.0625rem;
            margin-bottom: 1.75rem;
            max-width: 75ch;
        }}
        
        ul, ol {{
            margin: 2rem 0;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 1rem;
            border-left: 4px solid var(--primary);
        }}
        
        li {{
            color: var(--text-secondary);
            margin: 1rem 0;
            line-height: 1.8;
            padding-left: 0.5rem;
        }}
        
        li::marker {{
            color: var(--primary);
            font-weight: 700;
        }}
        
        /* Premium Activity Card */
        .activity-premium {{
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.1));
            border: 2px solid rgba(139, 92, 246, 0.3);
            border-radius: 1.5rem;
            padding: 3rem;
            margin: 3rem 0;
            position: relative;
            overflow: hidden;
        }}
        
        .activity-premium::before {{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
        }}
        
        .activity-premium::after {{
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 70%);
            border-radius: 50%;
        }}
        
        /* Badge Premium */
        .badge-premium {{
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(6, 182, 212, 0.15));
            border: 1px solid rgba(6, 182, 212, 0.4);
            border-radius: 2rem;
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--secondary-light);
            box-shadow: 0 4px 16px rgba(6, 182, 212, 0.2);
        }}
        
        /* Section Divider Premium */
        .divider-premium {{
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.6), transparent);
            margin: 5rem 0;
            position: relative;
        }}
        
        .divider-premium::before {{
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            background: var(--primary);
            border-radius: 50%;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.8);
        }}
        
        /* Scroll Progress */
        .scroll-indicator {{
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            z-index: 9999;
            transition: width 0.1s ease;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
        }}
        
        /* Responsive */
        @media (max-width: 1024px) {{
            .ultra-sidebar {{ display: none; }}
        }}
        
        /* Scroll Reveal Animation */
        .reveal {{
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }}
        
        .reveal.active {{
            opacity: 1;
            transform: translateY(0);
        }}
    </style>
</head>
<body>
    <!-- Scroll Progress -->
    <div class="scroll-indicator" id="scrollIndicator"></div>
    
    <!-- Animated Background -->
    <div class="animated-bg"></div>
    
    <!-- Header -->
    <header class="premium-header sticky top-0 z-50 py-5 px-6">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <a href="../../index.html" class="flex items-center gap-3 text-white hover:text-purple-300 transition-all duration-300 hover:scale-105 group">
                <svg class="w-6 h-6 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                <span class="font-semibold">Voltar ao Hub</span>
            </a>
            <div class="flex items-center gap-4">
                <span class="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 text-sm font-bold text-cyan-400 uppercase tracking-wider">
                    {module_title}
                </span>
                <a href="../../modulo{module_num}/sessao{session_num}/" class="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-purple-500/50">
                    Ver Apresentação
                </a>
            </div>
        </div>
    </header>
    
    <!-- Main Layout -->
    <div class="flex max-w-7xl mx-auto px-6 py-12 gap-10">
        <!-- Ultra Sidebar -->
        <aside class="hidden lg:block w-96 flex-shrink-0">
            <div class="ultra-sidebar rounded-2xl p-6 sticky top-28">
                <!-- Header -->
                <div class="sidebar-header">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-white font-bold text-lg">Navegação</h3>
                        <svg class="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                    </div>
                    <p class="text-xs text-slate-400">Clique para navegar rapidamente</p>
                </div>
                
                <!-- Navigation -->
                <nav class="space-y-2 mb-8">
                    {navigation_html}
                </nav>
                
                <!-- Progress -->
                <div class="mt-auto p-5 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-xl border border-purple-500/30">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-sm font-semibold text-slate-300">Progresso</span>
                        <span class="text-lg font-bold text-cyan-400" id="progressPercent">0%</span>
                    </div>
                    <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full transition-all duration-300" id="progressBar" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        </aside>
        
        <!-- Content -->
        <main class="flex-1 min-w-0">
            <!-- Title Section -->
            <div class="mb-16 reveal">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border border-purple-500/40 mb-6">
                    <span class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                    <span class="text-xs font-bold uppercase tracking-wider text-purple-200">Guia do Formador</span>
                </div>
                <h1 class="text-7xl font-display font-black mb-6 title-gradient leading-tight">
                    {title}
                </h1>
                <p class="text-2xl text-slate-300 font-light">Guia completo para conduzir esta sessão com excelência</p>
            </div>
            
            <!-- Content -->
            <div class="content-card reveal">
                {content}
            </div>
            
            <!-- Download Section -->
            <div class="mt-12 p-8 rounded-2xl bg-gradient-to-r from-purple-600/10 to-cyan-600/10 border border-purple-500/30 flex items-center justify-between reveal">
                <div class="flex items-center gap-6">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
                        <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-white font-bold text-lg mb-1">Documento Original</h3>
                        <p class="text-slate-400">Faça download do ficheiro Word completo</p>
                    </div>
                </div>
                <a href="../modulo{module_num}/{word_filename}" download class="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-purple-500/50 flex items-center gap-3">
                    <span>Download Word</span>
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                </a>
            </div>
        </main>
    </div>
    
    <!-- Footer -->
    <footer class="mt-32 border-t border-white/10 py-12 bg-black/30">
        <div class="max-w-7xl mx-auto px-6 text-center">
            <p class="text-slate-400 text-sm">act.academy | Geração Futuro © 2026</p>
        </div>
    </footer>
    
    <!-- Scripts -->
    <script>
        // Scroll Progress
        function updateProgress() {{
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            document.getElementById('scrollIndicator').style.width = scrolled + '%';
            document.getElementById('progressBar').style.width = scrolled + '%';
            document.getElementById('progressPercent').textContent = Math.round(scrolled) + '%';
        }}
        
        window.addEventListener('scroll', updateProgress);
        
        // Scroll Reveal
        function reveal() {{
            const reveals = document.querySelectorAll('.reveal');
            reveals.forEach(element => {{
                const windowHeight = window.innerHeight;
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < windowHeight - elementVisible) {{
                    element.classList.add('active');
                }}
            }});
        }}
        
        window.addEventListener('scroll', reveal);
        reveal(); // Initial check
        
        // Active Navigation
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('h2[id]');
        
        window.addEventListener('scroll', () => {{
            let current = '';
            sections.forEach(section => {{
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 150) {{
                    current = section.getAttribute('id');
                }}
            }});
            
            navItems.forEach(item => {{
                item.classList.remove('active');
                if (item.querySelector('a').getAttribute('href') === '#' + current) {{
                    item.classList.add('active');
                }}
            }});
        }});
    </script>
</body>
</html>"""

print("🎨 Este template será aplicado em breve...")
print("Criando versão ultra-premium dos guias...")
