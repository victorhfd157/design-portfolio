#!/usr/bin/env python3
"""
Script para gerar páginas HTML de guias para todas as sessões
Baseado no template da Sessão 1
"""

import os
import json

# Estrutura de módulos (mesma do index.html)
modules = [
    {
        "number": 1,
        "title": "Módulo 1",
        "sessions": [
            {"number": 1, "title": "Sessão 1: O que é a IA?"},
            {"number": 2, "title": "Sessão 2: Onde está a IA?"},
            {"number": 3, "title": "Sessão 3: Tipos de IA"}
        ]
    },
    {
        "number": 2,
        "title": "Módulo 2",
        "sessions": [
            {"number": 1, "title": "Sessão 1: Pensamento Computacional"},
            {"number": 2, "title": "Sessão 2: Algoritmos"},
            {"number": 3, "title": "Sessão 3: tomar decisões com 'se... então...' – introdução à lógica condicional"},
            {"number": 4, "title": "Sessão 4: Loops"},
            {"number": 5, "title": "Sessão 5"}
        ]
    },
    {
        "number": 3,
        "title": "Módulo 3",
        "sessions": [
            {"number": 1, "title": "Sessão 1: Introdução ao Scratch"},
            {"number": 2, "title": "Sessão 2: Programar Jogo de Reações"},
            {"number": 3, "title": "Sessão 3: Introdução à IA no Scratch"},
            {"number": 4, "title": "Sessão 4: Meu Jogo Inteligente"},
            {"number": 5, "title": "Sessão 5: Criar Jogos"},
            {"number": 6, "title": "Sessão 6: Melhorar Equilibrar Testar Jogo"},
            {"number": 7, "title": "Sessão 7: Sensores"},
            {"number": 8, "title": "Sessão 8: Showroom"}
        ]
    },
    {
        "number": 4,
        "title": "Módulo 4",
        "sessions": [
            {"number": 1, "title": "Sessão 1: Robótica Educativa"},
            {"number": 2, "title": "Sessão 2: Robô Virtual"},
            {"number": 3, "title": "Sessão 3: Seguidor de Linha"},
            {"number": 4, "title": "Sessão 4: Ambientes Inteligentes"},
            {"number": 5, "title": "Sessão 5: Vamos criar o nosso projeto de robótica com IA!"},
            {"number": 6, "title": "Sessão 6: Robô Inteligente"},
            {"number": 7, "title": "Sessão 7: Projetos de Robótica"}
        ]
    },
    {
        "number": 5,
        "title": "Módulo 5",
        "sessions": [
            {"number": 1, "title": "Sessão 1: IA Criativa"},
            {"number": 2, "title": "Sessão 2: criar imagens com ia – ilustração e estilo visual"},
            {"number": 3, "title": "Sessão 3"},
            {"number": 4, "title": "Sessão 4: Criar Música e Sons"},
            {"number": 6, "title": "Sessão 6: Portfólio Criativo"}
        ]
    }
]

def generate_guide_html(module_num, session_num, session_title, module_title):
    """Gera o HTML para um guia de sessão"""
    
    # Caminho relativo para voltar ao hub (../../ sai de resources/moduloX/)
    hub_path = "../../index.html"
    presentation_path = f"../../modulo{module_num}/sessao{session_num}/"
    
    html = f'''<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guia da {session_title} | Geração Futuro</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&family=Space+Grotesk:wght@300;500;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {{
            theme: {{
                extend: {{
                    fontFamily: {{
                        display: ['Outfit', 'sans-serif'],
                        tech: ['Space Grotesk', 'sans-serif'],
                    }}
                }}
            }}
        }}
    </script>
    <style>
        body {{
            background-color: #020617;
            color: white;
            font-family: 'Outfit', sans-serif;
        }}
        .glass-card {{
            background: rgba(30, 41, 59, 0.4);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }}
        .content-section h2 {{
            color: #a855f7;
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-size: 1.5rem;
            font-weight: 700;
        }}
        .content-section h3 {{
            color: #22d3ee;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            font-size: 1.25rem;
            font-weight: 600;
        }}
        .content-section p {{
            margin-bottom: 1rem;
            line-height: 1.8;
            color: #cbd5e1;
        }}
        .content-section ul, .content-section ol {{
            margin-left: 1.5rem;
            margin-bottom: 1rem;
            color: #cbd5e1;
        }}
        .content-section li {{
            margin-bottom: 0.5rem;
            line-height: 1.6;
        }}
        .activity-box {{
            background: rgba(168, 85, 247, 0.1);
            border-left: 4px solid #a855f7;
            padding: 1.5rem;
            margin: 1.5rem 0;
            border-radius: 0.5rem;
        }}
        .time-badge {{
            background: rgba(34, 211, 238, 0.2);
            color: #22d3ee;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
        }}
    </style>
</head>
<body class="antialiased">
    <!-- Background -->
    <div class="fixed inset-0 -z-10">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-slate-950 to-cyan-950/20"></div>
        <div class="absolute inset-0" style="background-image: radial-gradient(1px 1px at 50px 50px, rgba(255,255,255,0.3) 50%, transparent 100%); background-size: 500px 500px; opacity: 0.3;"></div>
    </div>

    <!-- Header -->
    <nav class="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 py-4 px-6">
        <div class="max-w-5xl mx-auto flex items-center justify-between">
            <a href="{hub_path}" class="flex items-center gap-3 text-white hover:text-purple-300 transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                <span class="font-medium">Voltar ao Hub</span>
            </a>
            <div class="flex items-center gap-3">
                <span class="text-xs uppercase tracking-widest text-cyan-400 font-bold">{module_title}</span>
                <a href="{presentation_path}" class="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all">
                    Ver Apresentação
                </a>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-5xl mx-auto px-6 py-12">
        <!-- Title Section -->
        <div class="mb-12">
            <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">Guia do Formador</span>
                <span class="time-badge">⏱ 45-60 minutos</span>
            </div>
            <h1 class="text-5xl font-display font-black text-white mb-4">
                {session_title}
            </h1>
            <p class="text-xl text-slate-400">
                Guia completo para conduzir esta sessão sobre Inteligência Artificial
            </p>
        </div>

        <!-- Content Placeholder -->
        <div class="glass-card rounded-2xl p-8 content-section">
            <div class="bg-yellow-500/10 border-l-4 border-yellow-500 p-6 rounded mb-8">
                <h3 class="text-yellow-300 mt-0 mb-2">📝 Conteúdo em Desenvolvimento</h3>
                <p class="text-yellow-100/80">Este guia está a ser preparado. Por enquanto, pode consultar o documento Word original através do botão abaixo.</p>
                <p class="text-yellow-100/80 mt-2">O guia completo incluirá:</p>
                <ul class="list-disc ml-6 mt-2 text-yellow-100/80">
                    <li>Objetivos de aprendizagem detalhados</li>
                    <li>Materiais necessários</li>
                    <li>Preparação passo a passo</li>
                    <li>Atividades práticas com timing</li>
                    <li>Dicas pedagógicas</li>
                    <li>Recursos adicionais</li>
                </ul>
            </div>

            <h2>📋 Estrutura Prevista</h2>
            <p>Esta sessão faz parte do {module_title} e aborda tópicos essenciais para o desenvolvimento das competências em IA dos alunos.</p>
            
            <h3>Próximos Passos:</h3>
            <ol class="list-decimal">
                <li>Consulte o documento Word original para o conteúdo completo</li>
                <li>Reveja a apresentação interativa</li>
                <li>Prepare os materiais necessários</li>
                <li>Familiarize-se com as atividades propostas</li>
            </ol>
        </div>

        <!-- Download Original -->
        <div class="mt-8 glass-card rounded-2xl p-6 flex items-center justify-between">
            <div>
                <h3 class="text-white font-bold mb-1">Documento Original</h3>
                <p class="text-slate-400 text-sm">Faça download do ficheiro Word completo com todo o conteúdo</p>
            </div>
            <a href="../modulo{module_num}/M{module_num} - Sessão {session_num}.docx" download class="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all flex items-center gap-2 text-white font-medium">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Download Word
            </a>
        </div>
    </main>

    <footer class="mt-20 border-t border-white/5 py-8">
        <div class="max-w-5xl mx-auto px-6 text-center text-slate-500 text-sm">
            <p>act.academy | Geração Futuro © 2026</p>
        </div>
    </footer>
</body>
</html>'''
    
    return html

def main():
    """Gera todos os guias HTML"""
    base_dir = "/Users/victorduarte/Downloads/Deploy All Design V5.9/resources"
    
    created_count = 0
    skipped_count = 0
    
    for module in modules:
        module_num = module["number"]
        module_title = module["title"]
        module_dir = os.path.join(base_dir, f"modulo{module_num}")
        
        # Cria diretório se não existir
        os.makedirs(module_dir, exist_ok=True)
        
        for session in module["sessions"]:
            session_num = session["number"]
            session_title = session["title"]
            
            # Nome do arquivo
            filename = f"sessao{session_num}-guia.html"
            filepath = os.path.join(module_dir, filename)
            
            # Pula se já existe (para não sobrescrever o guia completo da sessão 1)
            if os.path.exists(filepath):
                print(f"⏭️  Pulando {module_title} - {session_title} (já existe)")
                skipped_count += 1
                continue
            
            # Gera o HTML
            html_content = generate_guide_html(module_num, session_num, session_title, module_title)
            
            # Salva o arquivo
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            print(f"✅ Criado: {module_title} - {session_title}")
            created_count += 1
    
    print(f"\n🎉 Concluído!")
    print(f"   📄 {created_count} guias criados")
    print(f"   ⏭️  {skipped_count} guias pulados (já existiam)")
    print(f"\n💡 Agora você pode clicar nos botões de guia no hub para ver as páginas!")

if __name__ == "__main__":
    main()
