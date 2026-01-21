#!/usr/bin/env python3
"""
Cria guias HTML premium para as Estruturas de cada Módulo
Similar aos guias de sessão, mas para visão geral do módulo
"""

from docx import Document
import os
import re

# Template para estrutura de módulo
MODULE_STRUCTURE_TEMPLATE = """<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Geração Futuro</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * {{ scroll-behavior: smooth; }}
        
        body {{
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
            font-family: 'Inter', sans-serif;
            color: #F8FAFC;
        }}
        
        .animated-bg {{
            position: fixed;
            inset: 0;
            z-index: -1;
            background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.15), transparent),
                        radial-gradient(ellipse 60% 50% at 50% 120%, rgba(6, 182, 212, 0.12), transparent);
            animation: bgPulse 15s ease-in-out infinite;
        }}
        
        @keyframes bgPulse {{
            0%, 100% {{ opacity: 1; }}
            50% {{ opacity: 0.7; }}
        }}
        
        .premium-header {{
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(20px) saturate(180%);
            border-bottom: 1px solid rgba(139, 92, 246, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }}
        
        .content-card {{
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.6));
            backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(139, 92, 246, 0.2);
            border-radius: 1.5rem;
            padding: 3rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }}
        
        .title-gradient {{
            background: linear-gradient(135deg, #A78BFA 0%, #EC4899 50%, #22D3EE 100%);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientFlow 8s ease infinite;
        }}
        
        @keyframes gradientFlow {{
            0%, 100% {{ background-position: 0% 50%; }}
            50% {{ background-position: 100% 50%; }}
        }}
        
        h2 {{
            color: #A78BFA;
            font-weight: 800;
            font-size: 2rem;
            margin: 3rem 0 1.5rem;
        }}
        
        h3 {{
            color: #22D3EE;
            font-weight: 700;
            font-size: 1.5rem;
            margin: 2rem 0 1rem;
        }}
        
        p {{
            color: #CBD5E1;
            line-height: 2;
            margin-bottom: 1.5rem;
        }}
        
        ul, ol {{
            margin: 2rem 0;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 1rem;
            border-left: 4px solid #8B5CF6;
        }}
        
        li {{
            color: #CBD5E1;
            margin: 1rem 0;
            line-height: 1.8;
        }}
    </style>
</head>
<body>
    <div class="animated-bg"></div>
    
    <header class="premium-header sticky top-0 z-50 py-5 px-6">
        <div class="max-w-6xl mx-auto flex items-center justify-between">
            <a href="../../index.html" class="flex items-center gap-3 text-white hover:text-purple-300 transition-all">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                <span class="font-semibold">Voltar ao Hub</span>
            </a>
            <span class="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 text-sm font-bold text-cyan-400 uppercase">
                {module_badge}
            </span>
        </div>
    </header>
    
    <main class="max-w-5xl mx-auto px-6 py-12">
        <div class="mb-12">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border border-purple-500/40 mb-6">
                <span class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                <span class="text-xs font-bold uppercase tracking-wider text-purple-200">Estrutura do Módulo</span>
            </div>
            <h1 class="text-6xl font-black mb-6 title-gradient leading-tight">
                {title}
            </h1>
            <p class="text-xl text-slate-300">Visão geral e estrutura completa do módulo</p>
        </div>
        
        <div class="content-card">
            {content}
        </div>
        
        <div class="mt-12 p-8 rounded-2xl bg-gradient-to-r from-purple-600/10 to-cyan-600/10 border border-purple-500/30 flex items-center justify-between">
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
            <a href="{word_filename}" download class="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-3">
                <span>Download Word</span>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
            </a>
        </div>
    </main>
    
    <footer class="mt-32 border-t border-white/10 py-12 bg-black/30">
        <div class="max-w-5xl mx-auto px-6 text-center">
            <p class="text-slate-400 text-sm">act.academy | Geração Futuro © 2026</p>
        </div>
    </footer>
</body>
</html>"""

def extract_structure_content(docx_path):
    """Extrai conteúdo do arquivo de estrutura"""
    try:
        doc = Document(docx_path)
        html_parts = []
        
        for para in doc.paragraphs:
            text = para.text.strip()
            if not text:
                continue
            
            # Detecta headings
            if para.style.name.startswith('Heading') or (para.runs and any(run.bold for run in para.runs if len(run.text) > 10)):
                level = 'h2' if 'Heading 1' in para.style.name or 'Módulo' in text else 'h3'
                html_parts.append(f'<{level}>{text}</{level}>')
            elif text.startswith('•') or text.startswith('-'):
                html_parts.append(f'<li>{text[1:].strip()}</li>')
            else:
                html_parts.append(f'<p>{text}</p>')
        
        # Agrupa listas
        content = '\\n'.join(html_parts)
        content = re.sub(r'(<li>.*?</li>)', r'<ul>\\1</ul>', content, flags=re.DOTALL)
        
        return content
    except Exception as e:
        return f"<p>Erro ao processar conteúdo: {e}</p>"

# Mapeia estruturas de módulo
module_structures = [
    (1, "Módulo 1 - Estrutura.docx"),
    (2, "Módulo 2 - Estrutura.docx"),
    (3, "Módulo 3 - Estrutura.docx"),
    (4, "Módulo 4 - Estrutura.docx"),
    (5, "Módulo 5 - Estrutura.docx"),
]

print("🏗️  Criando guias de estrutura para os módulos...\\n")

created = 0
for module_num, word_filename in module_structures:
    docx_path = f"resources/modulo{module_num}/{word_filename}"
    output_path = f"resources/modulo{module_num}/estrutura-guia.html"
    
    if not os.path.exists(docx_path):
        print(f"  ⚠️  Módulo {module_num}: Arquivo não encontrado")
        continue
    
    try:
        # Extrai conteúdo
        content = extract_structure_content(docx_path)
        
        # Define título
        title = f"Módulo {module_num} - Estrutura"
        module_badge = f"Módulo {module_num}"
        
        # Gera HTML
        html = MODULE_STRUCTURE_TEMPLATE.format(
            title=title,
            module_badge=module_badge,
            content=content,
            word_filename=word_filename
        )
        
        # Salva
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print(f"  ✅ Módulo {module_num}: estrutura-guia.html criado")
        created += 1
        
    except Exception as e:
        print(f"  ❌ Módulo {module_num}: Erro - {e}")

print(f"\\n🎉 {created} guias de estrutura criados!")
print("\\n📍 Localizações:")
for i in range(1, 6):
    print(f"   • resources/modulo{i}/estrutura-guia.html")
