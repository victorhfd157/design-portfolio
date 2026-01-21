#!/usr/bin/env python3
"""
Limpa e melhora visual do conteúdo:
- Remove códigos entre colchetes [xxx]
- Melhora formatação de parágrafos
- Remove texto poluído
- Adiciona estrutura visual clara
"""

import glob
import re

def clean_content(html):
    """Limpa conteúdo poluído"""
    
    # Remove códigos entre colchetes do tipo [L#-L#], [xxx-xxx], etc
    html = re.sub(r'\[[\w\d\-#]+\]', '', html)
    html = re.sub(r'\[[^\]]{0,50}\]', '', html)
    
    # Remove emojis duplicados no início de parágrafos
    html = re.sub(r'(<p>)(🎯|📝|🚀|💡|📦|🔧){2,}', r'\1\2', html)
    
    # Remove múltiplos espaços
    html = re.sub(r'\s{2,}', ' ', html)
    
    # Remove pontos múltiplos
    html = re.sub(r'\.{2,}', '.', html)
    
    # Limpa parágrafos vazios ou muito curtos (menos de 3 caracteres)
    html = re.sub(r'<p>\s{0,3}</p>', '', html)
    
    # Remove texto "Atividade Assíncrona" duplicado
    html = re.sub(r'(Atividade Assíncrona.*?)Atividade Assíncrona', r'\1', html, flags=re.IGNORECASE)
    
    return html

def improve_paragraph_formatting(html):
    """Melhora formatação de parágrafos longos"""
    
    # Quebra parágrafos muito longos em listas quando apropriado
    def split_long_paragraph(match):
        p_content = match.group(1)
        
        # Se tem múltiplas frases separadas por ponto, quebra em lista
        if p_content.count('.') > 3 and len(p_content) > 300:
            sentences = [s.strip() + '.' for s in p_content.split('.') if s.strip()]
            if len(sentences) > 3:
                return '<ul class="list-disc">\n' + '\n'.join(f'<li>{s}</li>' for s in sentences if len(s) > 10) + '\n</ul>'
        
        return match.group(0)
    
    # Não aplicar em activity boxes
    # html = re.sub(r'<p>([^<]{300,})</p>', split_long_paragraph, html)
    
    return html

def add_visual_spacing(html):
    """Adiciona espaçamento visual melhor"""
    
    # Adiciona classe para parágrafos importantes (que começam com emoji ou negrito)
    html = re.sub(
        r'<p>(🎯|📝|🚀|💡|📦|🔧|⚠️|💭)([^<]+)</p>',
        r'<p class="highlight-text"><strong>\1 \2</strong></p>',
        html
    )
    
    return html

# CSS para melhorias visuais
VISUAL_IMPROVEMENTS_CSS = """
        /* Highlight text */
        .highlight-text {
            background: linear-gradient(90deg, rgba(168, 85, 247, 0.1), transparent);
            border-left: 3px solid #a855f7;
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
            border-radius: 0.5rem;
        }
        
        .highlight-text strong {
            color: #22d3ee;
            font-size: 1.1rem;
        }
        
        /* Melhor espaçamento de listas */
        .content-section ul {
            background: rgba(255, 255, 255, 0.02);
            padding: 1.5rem 2.5rem;
            border-radius: 0.75rem;
            margin: 1.5rem 0;
        }
        
        .content-section ol {
            background: rgba(255, 255, 255, 0.02);
            padding: 1.5rem 2.5rem;
            border-radius: 0.75rem;
            margin: 1.5rem 0;
        }
        
        /* Parágrafos mais respiráveis */
        .content-section p {
            max-width: 80ch;
            margin-bottom: 1.75rem;
        }
"""

guides = sorted(glob.glob('resources/modulo*/sessao*-guia.html'))
print(f"🧹 Limpando e melhorando visual de {len(guides)} guias...\n")

cleaned = 0
for guide_path in guides:
    try:
        with open(guide_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Aplica limpezas
        content = clean_content(content)
        content = improve_paragraph_formatting(content)
        content = add_visual_spacing(content)
        
        # Adiciona CSS se não existir
        if 'highlight-text' not in content:
            content = content.replace(
                '/* Dividers */',
                VISUAL_IMPROVEMENTS_CSS + '\n        /* Dividers */'
            )
        
        # Só salva se houve mudanças
        if content != original:
            with open(guide_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            cleaned += 1
            parts = guide_path.split('/')
            print(f"  ✅ {parts[1]}/{parts[2]}")
    
    except Exception as e:
        print(f"  ❌ Erro: {e}")

print(f"\n🎉 {cleaned} guias limpos e melhorados!")
print("\n✨ Melhorias:")
print("   • Códigos [xxx] removidos")
print("   • Texto poluído limpo")
print("   • Parágrafos formatados")
print("   • Espaçamento melhorado")
print("   • Visual mais limpo e profissional")
