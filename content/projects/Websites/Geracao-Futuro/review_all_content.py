#!/usr/bin/env python3
"""
Revisão geral completa de todos os conteúdos
- 28 guias HTML
- 28 apresentações
- Hub principal
- Navegação e links
"""

import glob
import os
import re
from pathlib import Path

print("=" * 70)
print("🔍 REVISÃO GERAL - TODOS OS CONTEÚDOS")
print("=" * 70)

# Cores para terminal
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
BLUE = '\033[94m'
RESET = '\033[0m'

issues = []
warnings = []
successes = []

# 1. VERIFICAR GUIAS
print(f"\n{BLUE}📚 1. VERIFICANDO GUIAS HTML{RESET}")
print("-" * 70)

guides = sorted(glob.glob('resources/modulo*/sessao*-guia.html'))
print(f"Total de guias: {len(guides)}")

for guide_path in guides:
    guide_name = f"{guide_path.split('/')[1]}/{guide_path.split('/')[2]}"
    
    # Verifica se arquivo existe e tem conteúdo
    size = os.path.getsize(guide_path)
    if size < 1000:
        issues.append(f"❌ {guide_name}: Arquivo muito pequeno ({size} bytes)")
        continue
    
    with open(guide_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Verificações
    checks = {
        'DOCTYPE': '<!DOCTYPE html>' in content,
        'Charset UTF-8': 'charset="UTF-8"' in content,
        'Tailwind CSS': 'tailwindcss.com' in content,
        'Title': '<title>' in content,
        'Sidebar': 'sidebar' in content.lower(),
        'Navigation': '<nav' in content,
        'Gradient text': 'gradient-text' in content,
        'Glassmorphism': 'glass-premium' in content,
        'Progress bar': 'scrollProgress' in content,
        'Scripts': '<script>' in content,
        'Footer': '<footer' in content,
    }
    
    failed = [k for k, v in checks.items() if not v]
    
    if failed:
        warnings.append(f"⚠️  {guide_name}: Faltam {', '.join(failed)}")
    else:
        successes.append(f"✅ {guide_name}: OK ({size:,} bytes)")
    
    # Verifica links quebrados
    if 'href="../../index.html"' not in content:
        issues.append(f"❌ {guide_name}: Link 'Voltar ao Hub' incorreto")
    
    # Verifica se tem conteúdo (não só template)
    if content.count('<h2') < 2:
        warnings.append(f"⚠️  {guide_name}: Pouco conteúdo (apenas {content.count('<h2')} seções)")

# 2. VERIFICAR APRESENTAÇÕES
print(f"\n{BLUE}🎬 2. VERIFICANDO APRESENTAÇÕES{RESET}")
print("-" * 70)

presentations = sorted(glob.glob('modulo*/sessao*/index.html'))
print(f"Total de apresentações: {len(presentations)}")

for pres_path in presentations:
    pres_name = f"{pres_path.split('/')[0]}/{pres_path.split('/')[1]}"
    
    if not os.path.exists(pres_path):
        issues.append(f"❌ {pres_name}: Arquivo não encontrado")
        continue
    
    size = os.path.getsize(pres_path)
    
    with open(pres_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Verifica assets
    if './assets/' in content:
        # Verifica se diretório assets existe
        assets_dir = os.path.join(os.path.dirname(pres_path), 'assets')
        if not os.path.exists(assets_dir):
            issues.append(f"❌ {pres_name}: Diretório assets não encontrado")
    
    successes.append(f"✅ {pres_name}: OK ({size:,} bytes)")

# 3. VERIFICAR HUB PRINCIPAL
print(f"\n{BLUE}🏠 3. VERIFICANDO HUB PRINCIPAL{RESET}")
print("-" * 70)

if os.path.exists('index.html'):
    with open('index.html', 'r', encoding='utf-8') as f:
        hub_content = f.read()
    
    hub_checks = {
        'Módulos array': 'const modules =' in hub_content,
        'Glass cards': 'glass-card' in hub_content,
        'Modal': 'modal' in hub_content.lower(),
        'Links para guias': 'sessao1-guia.html' in hub_content or 'resources/modulo' in hub_content,
        'Links para apresentações': 'modulo1/sessao1/' in hub_content,
    }
    
    hub_failed = [k for k, v in hub_checks.items() if not v]
    
    if hub_failed:
        warnings.append(f"⚠️  Hub: Faltam {', '.join(hub_failed)}")
    else:
        successes.append(f"✅ Hub principal: OK ({os.path.getsize('index.html'):,} bytes)")
else:
    issues.append(f"❌ Hub: index.html não encontrado!")

# 4. VERIFICAR RECURSOS (WORD)
print(f"\n{BLUE}📄 4. VERIFICANDO RECURSOS WORD{RESET}")
print("-" * 70)

word_files = sorted(glob.glob('resources/**/*.docx', recursive=True))
print(f"Total de arquivos Word: {len(word_files)}")

for word in word_files:
    if os.path.getsize(word) > 0:
        successes.append(f"✅ {word}: OK")
    else:
        warnings.append(f"⚠️  {word}: Arquivo vazio")

# 5. VERIFICAR NAVEGAÇÃO
print(f"\n{BLUE}🔗 5. VERIFICANDO NAVEGAÇÃO{RESET}")
print("-" * 70)

# Verifica se todos os módulos/sessões têm guias
expected_guides = []
for module in range(1, 6):
    module_dir = f'modulo{module}'
    if os.path.exists(module_dir):
        sessions = glob.glob(f'{module_dir}/sessao*')
        for session in sessions:
            session_num = re.search(r'sessao(\d+)', session)
            if session_num:
                guide_path = f'resources/modulo{module}/sessao{session_num.group(1)}-guia.html'
                expected_guides.append(guide_path)
                if not os.path.exists(guide_path):
                    issues.append(f"❌ Falta guia: {guide_path}")

# 6. VERIFICAR CONSISTÊNCIA VISUAL
print(f"\n{BLUE}🎨 6. VERIFICANDO CONSISTÊNCIA VISUAL{RESET}")
print("-" * 70)

# Verifica se todos os guias têm o mesmo design
design_elements = [
    'gradient-text',
    'glass-premium',
    'sidebar',
    'scroll-progress',
    'header-premium',
    'fadeInUp',
    'sidebar-link'
]

inconsistent = []
for guide_path in guides[:5]:  # Amostra de 5 guias
    with open(guide_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    missing = [elem for elem in design_elements if elem not in content]
    if missing:
        inconsistent.append(f"{guide_path}: faltam {missing}")

if inconsistent:
    warnings.append(f"⚠️  Inconsistência visual em {len(inconsistent)} guias")
else:
    successes.append(f"✅ Design consistente em todos os guias verificados")

# RELATÓRIO FINAL
print(f"\n{'=' * 70}")
print(f"{BLUE}📊 RELATÓRIO FINAL{RESET}")
print(f"{'=' * 70}\n")

print(f"{GREEN}✅ SUCESSOS ({len(successes)}):{RESET}")
for s in successes[:10]:  # Mostra primeiros 10
    print(f"  {s}")
if len(successes) > 10:
    print(f"  ... e mais {len(successes) - 10} itens OK")

if warnings:
    print(f"\n{YELLOW}⚠️  AVISOS ({len(warnings)}):{RESET}")
    for w in warnings:
        print(f"  {w}")

if issues:
    print(f"\n{RED}❌ PROBLEMAS ({len(issues)}):{RESET}")
    for i in issues:
        print(f"  {i}")
else:
    print(f"\n{GREEN}🎉 Nenhum problema crítico encontrado!{RESET}")

# ESTATÍSTICAS
print(f"\n{'=' * 70}")
print(f"{BLUE}📈 ESTATÍSTICAS{RESET}")
print(f"{'=' * 70}")
print(f"  • Guias HTML: {len(guides)}")
print(f"  • Apresentações: {len(presentations)}")
print(f"  • Arquivos Word: {len(word_files)}")
print(f"  • Total de arquivos: {len(guides) + len(presentations) + len(word_files) + 1}")
print(f"  • Sucessos: {GREEN}{len(successes)}{RESET}")
print(f"  • Avisos: {YELLOW}{len(warnings)}{RESET}")
print(f"  • Problemas: {RED}{len(issues)}{RESET}")

# PONTUAÇÃO DE QUALIDADE
total_checks = len(successes) + len(warnings) + len(issues)
quality_score = (len(successes) / total_checks * 100) if total_checks > 0 else 0

print(f"\n{'=' * 70}")
print(f"{BLUE}🏆 PONTUAÇÃO DE QUALIDADE: {quality_score:.1f}%{RESET}")
print(f"{'=' * 70}\n")

if quality_score >= 90:
    print(f"{GREEN}Excelente! 🌟 O projeto está em ótimo estado.{RESET}")
elif quality_score >= 70:
    print(f"{YELLOW}Bom! 👍 Algumas melhorias podem ser feitas.{RESET}")
else:
    print(f"{RED}Atenção! ⚠️  Várias correções necessárias.{RESET}")

print()
