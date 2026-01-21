#!/usr/bin/env python3
"""
Melhora visual da estrutura de tópicos:
- Adiciona dividers entre seções principais
- Cria cards para atividades
- Melhora espaçamento
- Adiciona badges de tempo
"""

import glob
import re

IMPROVEMENTS_CSS = """
        /* Dividers entre seções */
        .section-divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent);
            margin: 4rem 0;
        }
        
        /* Cards de atividade melhorados */
        .activity-card {
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(34, 211, 238, 0.1));
            border: 2px solid rgba(168, 85, 247, 0.3);
            border-radius: 1.5rem;
            padding: 2.5rem;
            margin: 2rem 0;
            position: relative;
            overflow: hidden;
        }
        
        .activity-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #a855f7, #22d3ee);
        }
        
        /* Badge de timing */
        .time-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(34, 211, 238, 0.2);
            color: #22d3ee;
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-size: 0.875rem;
            font-weight: 600;
            border: 1px solid rgba(34, 211, 238, 0.3);
        }
        
        /* Seção destacada */
        .highlight-section {
            background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.05));
            border-left: 4px solid #fbbf24;
            padding: 2rem;
            border-radius: 1rem;
            margin: 2rem 0;
        }
        
        /* Labels de categoria */
        .category-label {
            display: inline-block;
            background: rgba(168, 85, 247, 0.2);
            color: #a855f7;
            padding: 0.25rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
        }
"""

guides = sorted(glob.glob('resources/modulo*/sessao*-guia.html'))
print(f"✨ Melhorando estrutura visual de {len(guides)} guias...\n")

for guide_path in guides:
    try:
        with open(guide_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Adiciona CSS de melhorias
        if '/* Activity Box Premium */' in content and 'section-divider' not in content:
            content = content.replace(
                '/* Activity Box Premium */',
                IMPROVEMENTS_CSS + '\n        /* Activity Box Premium */'
            )
        
        # Adiciona dividers após cada H2 (exceto a primeira)
        h2_count = 0
        def add_divider(match):
            nonlocal h2_count
            h2_count += 1
            if h2_count > 1:
                return f'<div class="section-divider"></div>\n{match.group(0)}'
            return match.group(0)
        
        content = re.sub(r'<h2[^>]*>', add_divider, content)
        
        # Identifica e melhora atividades (texto que contém tempo)
        def enhance_activity(match):
            full_text = match.group(0)
            # Se contém indicação de tempo, adiciona badge
            if re.search(r'\d+\s*(min|minutos)', full_text, re.IGNORECASE):
                time_match = re.search(r'(\d+)\s*(min|minutos)', full_text, re.IGNORECASE)
                if time_match:
                    time_text = f'{time_match.group(1)} min'
                    # Adiciona badge de tempo após o h2/h3
                    enhanced = full_text.replace(
                        '</h2>',
                        f'</h2>\n<div class="time-badge">⏱️ {time_text}</div>'
                    ).replace(
                        '</h3>',
                        f'</h3>\n<div class="time-badge">⏱️ {time_text}</div>'
                    )
                    return enhanced
            return full_text
        
        content = re.sub(r'<h[23][^>]*>.*?</h[23]>', enhance_activity, content)
        
        # Envolve conteúdos de "Atividade" em cards
        def wrap_activity(match):
            # Pega todo conteúdo até próximo H2 ou fim
            return match.group(0).replace(
                '<h2',
                '<div class="activity-card">\n<h2'
            )
        
        # Procura por seções de atividades e adiciona marcação
        if '🚀' in content or 'Atividade' in content:
            # Adiciona classe especial a h2 de atividades
            content = re.sub(
                r'<h2([^>]*)>(🚀[^<]*Atividade[^<]*)</h2>',
                r'<h2\1><span class="category-label">Prática</span> \2</h2>',
                content,
                flags=re.IGNORECASE
            )
        
        # Adiciona labels a objetivos
        content = re.sub(
            r'<h2([^>]*)>(🎯[^<]*Objetivo[^<]*)</h2>',
            r'<h2\1><span class="category-label">Objetivos</span> \2</h2>',
            content,
            flags=re.IGNORECASE
        )
        
        # Salva
        with open(guide_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        parts = guide_path.split('/')
        print(f"  ✅ {parts[1]}/{parts[2]}")
        
    except Exception as e:
        print(f"  ❌ Erro: {e}")

print(f"\n🎉 Estrutura visual melhorada!")
print("\n✨ Melhorias aplicadas:")
print("   • Dividers entre seções principais")
print("   • Badges de tempo em atividades")
print("   • Labels de categoria (Objetivos, Prática)")
print("   • Cards destacados para atividades")
print("   • Seções visualmente separadas")
print("   • Hierarquia mais clara")
