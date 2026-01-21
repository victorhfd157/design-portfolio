#!/usr/bin/env python3
"""
Melhora o menu de navegação de todos os guias com ícones e animações
"""

import glob
import re

# Melhorias no CSS para navegação
IMPROVED_NAV_CSS = """
        /* Sidebar Melhorada */
        .sidebar {
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.85) 100%);
            backdrop-filter: blur(20px);
            border-right: 1px solid rgba(168, 85, 247, 0.3);
            box-shadow: 4px 0 24px rgba(0, 0, 0, 0.4);
        }
        
        .sidebar-header {
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(34, 211, 238, 0.2));
            border-bottom: 2px solid rgba(168, 85, 247, 0.3);
            padding: 1.25rem;
            margin-bottom: 1rem;
            border-radius: 0.75rem;
        }
        
        .sidebar-link {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-left: 3px solid transparent;
            position: relative;
            padding-left: 1rem;
        }
        
        .sidebar-link::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 0;
            background: linear-gradient(180deg, #a855f7, #22d3ee);
            border-radius: 0 3px 3px 0;
            transition: height 0.3s ease;
        }
        
        .sidebar-link:hover {
            background: linear-gradient(90deg, rgba(168, 85, 247, 0.15), transparent);
            border-left-color: transparent;
            transform: translateX(4px);
            color: white;
        }
        
        .sidebar-link:hover::before {
            height: 100%;
        }
        
        .sidebar-link.active {
            background: linear-gradient(90deg, rgba(168, 85, 247, 0.25), rgba(34, 211, 238, 0.1));
            border-left-color: transparent;
            color: #22d3ee;
            font-weight: 600;
        }
        
        .sidebar-link.active::before {
            height: 100%;
            box-shadow: 0 0 12px rgba(168, 85, 247, 0.6);
        }
        
        .sidebar-link-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            background: rgba(168, 85, 247, 0.15);
            border-radius: 6px;
            margin-right: 0.75rem;
            font-size: 0.875rem;
            transition: all 0.3s ease;
        }
        
        .sidebar-link:hover .sidebar-link-icon {
            background: rgba(168, 85, 247, 0.3);
            transform: scale(1.1);
        }
        
        .sidebar-link.active .sidebar-link-icon {
            background: linear-gradient(135deg, #a855f7, #22d3ee);
            box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
        }
        
        .nav-section {
            margin-bottom: 1.5rem;
        }
        
        .nav-section-title {
            color: #a855f7;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 0.5rem 1rem;
            margin-bottom: 0.5rem;
            opacity: 0.7;
        }
        
        .sidebar-progress {
            margin-top: 1.5rem;
            padding: 1rem;
            background: rgba(168, 85, 247, 0.1);
            border-radius: 0.75rem;
            border: 1px solid rgba(168, 85, 247, 0.2);
        }
        
        .progress-bar {
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
            margin-top: 0.5rem;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #a855f7, #22d3ee);
            border-radius: 3px;
            transition: width 0.3s ease;
            box-shadow: 0 0 8px rgba(168, 85, 247, 0.6);
        }
"""

guides = sorted(glob.glob('resources/modulo*/sessao*-guia.html'))
print(f"🎨 Melhorando navegação de {len(guides)} guias...\\n")

for guide_path in guides:
    try:
        with open(guide_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Substitui CSS da sidebar
        if '.sidebar {' in content:
            # Remove CSS antigo da sidebar
            content = re.sub(
                r'/\* Sidebar \*/.*?\.sidebar-link\.active \{[^}]+\}',
                IMPROVED_NAV_CSS.strip(),
                content,
                flags=re.DOTALL
            )
            
            # Melhora o HTML da sidebar
            # Adiciona ícones e organização
            if '<nav class="space-y-2">' in content:
                # Extrai os links atuais
                nav_section = re.search(r'<nav class="space-y-2">(.*?)</nav>', content, re.DOTALL)
                if nav_section:
                    links_html = nav_section.group(1)
                    
                    # Processa cada link para adicionar ícone
                    new_links = []
                    link_pattern = r'<a href="(#[^"]+)" class="sidebar-link[^"]*">([^<]+)</a>'
                    
                    for match in re.finditer(link_pattern, links_html):
                        href = match.group(1)
                        text = match.group(2).strip()
                        
                        # Extrai emoji se existir
                        emoji = ''
                        clean_text = text
                        if text and text[0] in ['🎯', '📦', '🔧', '🚀', '📊', '🎬', '📝', '💡', '🧩']:
                            emoji = text[0]
                            clean_text = text[1:].strip()
                        
                        # Cria novo link com ícone
                        new_link = f'''<a href="{href}" class="sidebar-link flex items-center py-2.5 px-3 rounded-lg text-sm text-slate-300 hover:text-white transition-all">
                            <span class="sidebar-link-icon">{emoji if emoji else '📄'}</span>
                            <span class="flex-1">{clean_text[:40]}</span>
                        </a>'''
                        new_links.append(new_link)
                    
                    # Reconstrói navegação
                    new_nav = '<nav class="space-y-2">\\n' + '\\n'.join(new_links) + '\\n</nav>'
                    content = content.replace(nav_section.group(0), new_nav)
            
            # Adiciona header da sidebar melhorado
            if '<div class="sidebar rounded-2xl p-6' in content:
                sidebar_header = '''<div class="sidebar-header">
                        <div class="flex items-center gap-2 mb-2">
                            <svg class="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                            <h3 class="text-white font-bold text-base">Navegação</h3>
                        </div>
                        <p class="text-xs text-slate-400">Clique para navegar</p>
                    </div>'''
                
                content = re.sub(
                    r'<h3 class="text-white font-bold text-lg mb-6[^>]*>.*?</h3>',
                    sidebar_header,
                    content
                )
            
            # Adiciona barra de progresso
            if '</nav>' in content and 'sidebar-progress' not in content:
                progress_html = '''
                    <div class="sidebar-progress">
                        <div class="text-xs font-semibold text-slate-300 mb-1">Progresso da Leitura</div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="readProgress" style="width: 0%"></div>
                        </div>
                        <div class="text-xs text-slate-400 mt-2" id="progressText">0% lido</div>
                    </div>'''
                
                content = content.replace('</nav>', f'</nav>{progress_html}')
            
            # Atualiza script para progresso
            if 'window.addEventListener' in content and 'readProgress' not in content:
                new_script = '''
        // Scroll Progress
        const updateProgress = () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            document.getElementById('scrollProgress').style.width = scrolled + '%';
            
            const readProg = document.getElementById('readProgress');
            const progText = document.getElementById('progressText');
            if (readProg) {
                readProg.style.width = scrolled.toFixed(0) + '%';
            }
            if (progText) {
                progText.textContent = scrolled.toFixed(0) + '% lido';
            }
        };
        
        window.addEventListener('scroll', updateProgress);'''
                
                content = re.sub(
                    r'window\.addEventListener\(\'scroll\', \(\) => \{[^}]+\}\);',
                    new_script.strip(),
                    content
                )
            
            with open(guide_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✨ {guide_path.split('/')[1]}/{guide_path.split('/')[2]}")
        
    except Exception as e:
        print(f"❌ Erro em {guide_path}: {e}")

print(f"\\n🎉 Navegação melhorada!")
print("\\n💎 Melhorias aplicadas:")
print("   • Ícones em cada item")
print("   • Animação de barra lateral")
print("   • Destaque da seção ativa")
print("   • Barra de progresso de leitura")
print("   • Hover effects melhorados")
print("   • Header da sidebar estilizado")
