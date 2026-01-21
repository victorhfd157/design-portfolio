#!/usr/bin/env python3
"""
Reorganiza navegação lateral para mostrar tópicos agrupados
Exemplo: Slides, Objetivos, Atividades (ao invés de todos os h2s)
"""

import glob
import re
from collections import defaultdict

def create_grouped_navigation(content):
    """Cria navegação agrupada por tópicos"""
    
    # Extrai todos os H2 com IDs
    h2_pattern = re.compile(r'<h2[^>]*id="([^"]*)"[^>]*>(.*?)</h2>', re.DOTALL)
    sections = []
    
    for match in h2_pattern.finditer(content):
        section_id = match.group(1)
        section_text = re.sub(r'<[^>]+>', '', match.group(2)).strip()
        
        # Remove emojis para análise
        clean_text = section_text
        for emoji in ['🎯', '📦', '🔧', '🚀', '📊', '🎬', '📝', '💡', '🧩', '🎮', '🌟', '💭', '💬', '📋', '⏱️', '📄', '⚠️']:
            clean_text = clean_text.replace(emoji, '').strip()
        
        sections.append({
            'id': section_id,
            'text': section_text,
            'clean': clean_text.lower()
        })
    
    # Agrupa por categoria
    categories = defaultdict(list)
    
    for section in sections:
        text_lower = section['clean']
        
        # Determina categoria
        if any(kw in text_lower for kw in ['objetivo', 'competência']):
            categories['🎯 Objetivos e Competências'].append(section)
        elif any(kw in text_lower for kw in ['material', 'recurso']):
            categories['📦 Materiais e Recursos'].append(section)
        elif any(kw in text_lower for kw in ['preparação', 'guião', 'estrutura']):
            categories['🔧 Preparação'].append(section)
        elif any(kw in text_lower for kw in ['teasing']):
            categories['🎮 Atividade Teasing'].append(section)
        elif any(kw in text_lower for kw in ['atividade', 'exercício', 'jogo', 'desafio', 'dinâmica']):
            categories['🚀 Atividades Práticas'].append(section)
        elif any(kw in text_lower for kw in ['slide', 'conteúdo dos slide']):
            categories['🎬 Slides'].append(section)
        elif any(kw in text_lower for kw in ['ficha']):
            categories['📄 Fichas de Trabalho'].append(section)
        elif any(kw in text_lower for kw in ['avaliação', 'critério']):
            categories['📊 Avaliação'].append(section)
        elif any(kw in text_lower for kw in ['enriquecimento']):
            categories['🌟 Enriquecimento'].append(section)
        elif any(kw in text_lower for kw in ['reflexão', 'discussão']):
            categories['💭 Reflexão'].append(section)
        else:
            categories['📝 Outros Conteúdos'].append(section)
    
    # Ordem de exibição
    category_order = [
        '🎯 Objetivos e Competências',
        '📦 Materiais e Recursos', 
        '🔧 Preparação',
        '🎮 Atividade Teasing',
        '🚀 Atividades Práticas',
        '🎬 Slides',
        '📄 Fichas de Trabalho',
        '📊 Avaliação',
        '💭 Reflexão',
        '🌟 Enriquecimento',
        '📝 Outros Conteúdos'
    ]
    
    # Gera HTML da navegação
    nav_html = []
    
    for category in category_order:
        if category not in categories or not categories[category]:
            continue
        
        # Pega o primeiro item da categoria para navegação principal
        first_item = categories[category][0]
        
        # Cria link da categoria
        nav_html.append(
            f'<a href="#{first_item["id"]}" class="sidebar-link flex items-center py-2.5 px-3 rounded-lg text-sm text-slate-300 hover:text-white transition-all">'
            f'<span class="sidebar-link-icon">{category.split()[0]}</span>'
            f'<span class="flex-1">{" ".join(category.split()[1:])}</span>'
            f'</a>'
        )
    
    return '\n'.join(nav_html)

# Processa todos os guias
guides = sorted(glob.glob('resources/modulo*/sessao*-guia.html'))
print(f"🔄 Reorganizando navegação de {len(guides)} guias...\n")

for guide_path in guides:
    try:
        with open(guide_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Gera nova navegação
        new_nav = create_grouped_navigation(content)
        
        # Substitui navegação antiga
        nav_pattern = re.compile(
            r'(<nav class="space-y-2">)(.*?)(</nav>)',
            re.DOTALL
        )
        
        if nav_pattern.search(content):
            content = nav_pattern.sub(
                rf'\1\n{new_nav}\n\3',
                content
            )
            
            with open(guide_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            parts = guide_path.split('/')
            print(f"  ✅ {parts[1]}/{parts[2]}")
        
    except Exception as e:
        print(f"  ❌ Erro: {e}")

print(f"\n🎉 Navegação reorganizada!")
print("\n✨ Agora a sidebar mostra:")
print("   • 🎯 Objetivos e Competências")
print("   • 📦 Materiais e Recursos")
print("   • 🔧 Preparação")
print("   • 🎮 Atividade Teasing")
print("   • 🚀 Atividades Práticas")
print("   • 🎬 Slides")
print("   • 📄 Fichas de Trabalho")
print("   • 📊 Avaliação")
print("   • 🌟 Enriquecimento")
print("\n📌 Ao clicar, navega para aquela seção!")
