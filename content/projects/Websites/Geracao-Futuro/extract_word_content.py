#!/usr/bin/env python3
"""
Script para extrair conteúdo dos arquivos Word e gerar guias HTML completos
"""

from docx import Document
import os
import re

def extract_word_content(docx_path):
    """Extrai texto estruturado de um arquivo Word"""
    try:
        doc = Document(docx_path)
        content = {
            'title': '',
            'sections': []
        }
        
        current_section = None
        
        for para in doc.paragraphs:
            text = para.text.strip()
            if not text:
                continue
            
            # Detecta título principal
            if 'Sessão' in text and '–' in text:
                content['title'] = text
            
            # Detecta seções (títulos em negrito ou com formatação especial)
            elif para.style.name.startswith('Heading') or any(run.bold for run in para.runs if run.text.strip()):
                if current_section:
                    content['sections'].append(current_section)
                current_section = {
                    'heading': text,
                    'content': []
                }
            elif current_section:
                current_section['content'].append(text)
        
        if current_section:
            content['sections'].append(current_section)
        
        return content
    except Exception as e:
        print(f"❌ Erro ao ler {docx_path}: {e}")
        return None

def generate_html_from_content(content, module_num, session_num, module_title):
    """Gera HTML a partir do conteúdo extraído"""
    
    if not content or not content.get('sections'):
        return None
    
    # Gera seções HTML
    sections_html = ""
    for section in content['sections']:
        heading = section['heading']
        section_content = section['content']
        
        # Detecta tipo de seção
        if any(keyword in heading.lower() for keyword in ['objetivo', 'competência']):
            icon = "🎯"
        elif any(keyword in heading.lower() for keyword in ['material', 'recurso']):
            icon = "📦"
        elif any(keyword in heading.lower() for keyword in ['preparação', 'antes']):
            icon = "🔧"
        elif any(keyword in heading.lower() for keyword in ['atividade', 'exercício']):
            icon = "🚀"
        elif any(keyword in heading.lower() for keyword in ['avaliação']):
            icon = "📊"
        else:
            icon = "📝"
        
        sections_html += f'<h2>{icon} {heading}</h2>\n'
        
        # Adiciona conteúdo
        for item in section_content:
            # Detecta listas
            if item.startswith('•') or item.startswith('-') or re.match(r'^\d+\.', item):
                if '<ul' not in sections_html[-50:] and '<ol' not in sections_html[-50:]:
                    list_type = 'ol' if re.match(r'^\d+\.', item) else 'ul'
                    sections_html += f'<{list_type} class="list-disc">\n'
                
                clean_item = re.sub(r'^[•\-\d+\.]\s*', '', item)
                sections_html += f'<li>{clean_item}</li>\n'
            else:
                # Fecha lista se estava aberta
                if sections_html.endswith('</li>\n'):
                    if '<ul' in sections_html[-200:]:
                        sections_html += '</ul>\n'
                    elif '<ol' in sections_html[-200:]:
                        sections_html += '</ol>\n'
                
                sections_html += f'<p>{item}</p>\n'
    
    return sections_html

# Testa com Sessão 1
print("🔍 Extraindo conteúdo da Sessão 1...")
content = extract_word_content('resources/modulo1/Sessão 1.docx')

if content:
    print(f"✅ Título: {content['title']}")
    print(f"📚 {len(content['sections'])} seções encontradas:")
    for i, section in enumerate(content['sections'][:5], 1):
        print(f"   {i}. {section['heading']} ({len(section['content'])} itens)")
    
    print("\n💡 Exemplo de conteúdo da primeira seção:")
    if content['sections']:
        print(f"   Título: {content['sections'][0]['heading']}")
        print(f"   Primeiros itens: {content['sections'][0]['content'][:2]}")
else:
    print("❌ Não foi possível extrair conteúdo")
