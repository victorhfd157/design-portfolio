#!/usr/bin/env python3
"""
Melhora a estrutura hierárquica dos tópicos em todos os guias
- Agrupa tópicos relacionados
- Cria hierarquia clara (H2 > H3 > H4)
- Adiciona ícones consistentes
- Remove duplicações
"""

import glob
import re

# Mapeamento de ícones por categoria
ICONS = {
    'objetivo': '🎯',
    'competência': '🎯',
    'material': '📦',
    'recurso': '📦',
    'preparação': '🔧',
    'guião': '🔧',
    'atividade': '🚀',
    'exercício': '🚀',
    'dinâmica': '🚀',
    'jogo': '🎮',
    'desafio': '🚀',
    'avaliação': '📊',
    'slide': '🎬',
    'conteúdo': '🎬',
    'teasing': '🎮',
    'enriquecimento': '🌟',
    'reflexão': '💭',
    'discussão': '💬',
    'conceito': '💡',
    'estrutura': '📋',
    'temporal': '⏱️',
    'ficha': '📄',
    'exemplo': '💡',
    'dica': '💡',
    'importante': '⚠️',
}

def get_icon(text):
    """Retorna ícone apropriado para o texto"""
    text_lower = text.lower()
    for keyword, icon in ICONS.items():
        if keyword in text_lower:
            return icon
    return '📝'

def categorize_section(text):
    """Categoriza seção para agrupamento"""
    text_lower = text.lower()
    
    if any(k in text_lower for k in ['objetivo', 'competência']):
        return 'objetivos'
    elif any(k in text_lower for k in ['material', 'recurso']):
        return 'materiais'
    elif any(k in text_lower for k in ['preparação', 'guião', 'estrutura temporal']):
        return 'preparacao'
    elif any(k in text_lower for k in ['atividade', 'exercício', 'jogo', 'desafio', 'dinâmica']):
        return 'atividades'
    elif any(k in text_lower for k in ['slide', 'conteúdo dos slides']):
        return 'slides'
    elif any(k in text_lower for k in ['avaliação', 'critério']):
        return 'avaliacao'
    elif any(k in text_lower for k in ['ficha']):
        return 'fichas'
    elif any(k in text_lower for k in ['teasing']):
        return 'teasing'
    elif any(k in text_lower for k in ['enriquecimento']):
        return 'enriquecimento'
    else:
        return 'outros'

def restructure_content(html_content):
    """Reestrutura o conteúdo HTML com hierarquia melhorada"""
    
    # Extrai área de conteúdo
    match = re.search(r'(<div class="glass-premium.*?content-section.*?>)(.*?)(</div>\s*<div class="mt-8)', 
                     html_content, re.DOTALL)
    
    if not match:
        return html_content
    
    prefix = match.group(1)
    content = match.group(2)
    suffix = match.group(3)
    
    # Parse seções H2
    sections = []
    current_section = None
    
    parts = re.split(r'(<h2[^>]*>.*?</h2>)', content, flags=re.DOTALL)
    
    for part in parts:
        if re.match(r'<h2', part):
            # É um H2
            h2_text = re.sub(r'<[^>]+>', '', part).strip()
            
            # Adiciona seção anterior se houver
            if current_section:
                sections.append(current_section)
            
            # Nova seção
            icon = get_icon(h2_text)
            category = categorize_section(h2_text)
            
            # Remove ícone duplicado se já existir
            clean_text = h2_text
            for emoji in ['🎯', '📦', '🔧', '🚀', '📊', '🎬', '📝', '💡', '🧩', '🎮', '🌟', '💭', '💬', '📋', '⏱️', '📄', '⚠️']:
                clean_text = clean_text.replace(emoji, '').strip()
            
            current_section = {
                'title': clean_text,
                'icon': icon,
                'category': category,
                'content': []
            }
        elif current_section is not None:
            # É conteúdo da seção
            current_section['content'].append(part)
    
    if current_section:
        sections.append(current_section)
    
    # Agrupa por categoria
    grouped = {}
    for section in sections:
        cat = section['category']
        if cat not in grouped:
            grouped[cat] = []
        grouped[cat].append(section)
    
    # Ordem preferencial de categorias
    category_order = [
        ('objetivos', 'Objetivos e Competências'),
        ('materiais', 'Materiais e Recursos'),
        ('preparacao', 'Preparação e Estrutura'),
        ('teasing', 'Atividade Teasing'),
        ('atividades', 'Atividades Práticas'),
        ('slides', 'Conteúdo dos Slides'),
        ('fichas', 'Fichas de Atividades'),
        ('avaliacao', 'Avaliação'),
        ('enriquecimento', 'Atividades de Enriquecimento'),
        ('outros', 'Outros Conteúdos')
    ]
    
    # Reconstrói HTML com estrutura melhorada
    new_content = []
    
    for cat_key, cat_title in category_order:
        if cat_key not in grouped or not grouped[cat_key]:
            continue
        
        cat_icon = {
            'objetivos': '🎯',
    # (continued with rest of icons)
            'materiais': '📦',
            'preparacao': '🔧',
            'teasing': '🎮',
            'atividades': '🚀',
            'slides': '🎬',
            'fichas': '📄',
            'avaliacao': '📊',
            'enriquecimento': '🌟',
            'outros': '📝'
        }[cat_key]
        
        # Se há mais de 1 seção nesta categoria, cria seção principal
        if len(grouped[cat_key]) > 1:
            new_content.append(f'\n<h2 id="cat-{cat_key}">{cat_icon} {cat_title}</h2>\n')
            
            # Subsections como H3
            for section in grouped[cat_key]:
                new_content.append(f'<h3 id="sec-{cat_key}-{len(new_content)}">{section["icon"]} {section["title"]}</h3>\n')
                new_content.extend(section['content'])
        else:
            # Só uma seção, mantém como H2
            section = grouped[cat_key][0]
            new_content.append(f'\n<h2 id="sec-{cat_key}">{section["icon"]} {section["title"]}</h2>\n')
            new_content.extend(section['content'])
    
    # Reconstrói HTML completo
    new_html = html_content[:match.start()] + prefix + ''.join(new_content) + suffix + html_content[match.end():]
    
    return new_html

# Processa todos os guias
guides = sorted(glob.glob('resources/modulo*/sessao*-guia.html'))
print(f"🔄 Reestruturando {len(guides)} guias...\n")

improved = 0
for guide_path in guides:
    try:
        with open(guide_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = restructure_content(content)
        
        if new_content != content:
            with open(guide_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            improved += 1
            parts = guide_path.split('/')
            print(f"  ✅ {parts[1]}/{parts[2]}")
        
    except Exception as e:
        print(f"  ❌ Erro em {guide_path}: {e}")

print(f"\n🎉 {improved} guias reestruturados!")
print("\n✨ Melhorias aplicadas:")
print("   • Seções agrupadas por categoria")
print("   • Hierarquia clara (H2 > H3)")
print("   • Ícones consistentes")
print("   • Navegação organizada")
print("   • IDs únicos para links")
