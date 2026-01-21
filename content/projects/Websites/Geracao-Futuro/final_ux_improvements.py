#!/usr/bin/env python3
"""
Melhorias finais de UI/UX para todos os guias:
- Espaçamento otimizado
- Contraste melhorado
- Acessibilidade
- Micro-interações
- Performance
"""

import glob
import re

# CSS de melhorias finais UI/UX
FINAL_UX_IMPROVEMENTS = """
        /* ========== MELHORIAS FINAIS UI/UX ========== */
        
        /* Melhor legibilidade */
        body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
        }
        
        /* Scrollbar customizada */
        ::-webkit-scrollbar {
            width: 12px;
        }
        
        ::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.5);
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #8B5CF6, #06B6D4);
            border-radius: 6px;
            border: 2px solid rgba(15, 23, 42, 0.5);
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #A78BFA, #22D3EE);
        }
        
        /* Focus states para acessibilidade */
        a:focus, button:focus {
            outline: 2px solid #22D3EE;
            outline-offset: 4px;
        }
        
        /* Melhor contraste em textos */
        p, li {
            color: #E2E8F0;
            font-weight: 400;
        }
        
        /* Links melhorados */
        a {
            color: #22D3EE;
            text-decoration: none;
            transition: all 0.2s ease;
        }
        
        a:hover {
            color: #67E8F9;
            text-decoration: underline;
        }
        
        /* Cards com melhor hierarquia visual */
        .content-card, .content-card-ultra {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .content-card:hover, .content-card-ultra:hover {
            border-color: rgba(139, 92, 246, 0.4);
        }
        
        /* Espaçamento consistente */
        h2 + p, h3 + p {
            margin-top: 0;
        }
        
        p + h2, p + h3 {
            margin-top: 3rem;
        }
        
        /* Listas mais legíveis */
        ul li, ol li {
            padding-left: 1rem;
            position: relative;
        }
        
        ul li::before {
            content: '';
            position: absolute;
            left: -1rem;
            top: 0.75em;
            width: 6px;
            height: 6px;
            background: #8B5CF6;
            border-radius: 50%;
        }
        
        /* Botões melhorados */
        button, .btn, a[class*="btn"] {
            cursor: pointer;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        }
        
        /* Loading states */
        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }
        
        /* Responsividade aprimorada */
        @media (max-width: 768px) {
            h1 { font-size: 3rem !important; }
            h2 { font-size: 1.75rem !important; }
            h3 { font-size: 1.35rem !important; }
            p { font-size: 1rem !important; }
            
            .content-card, .content-card-ultra {
                padding: 2rem !important;
            }
        }
        
        /* Melhor feedback visual */
        .nav-item:active {
            transform: scale(0.98);
        }
        
        /* Transições suaves em todos os interativos */
        * {
            transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
            transition-duration: 200ms;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Previne transições em animações de scroll */
        html.smooth-scroll * {
            transition: none !important;
        }
        
        /* Print styles */
        @media print {
            .premium-header, .ultra-sidebar, footer {
                display: none !important;
            }
            
            body {
                background: white !important;
                color: black !important;
            }
        }
"""

# Script principal
guides = glob.glob('resources/modulo*/sessao*-guia.html') + glob.glob('resources/modulo*/estrutura-guia.html')
print(f"🎨 Aplicando melhorias finais de UI/UX em {len(guides)} guias...\n")

improved = 0
for guide_path in guides:
    try:
        with open(guide_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Adiciona CSS de melhorias se não existir
        if 'MELHORIAS FINAIS UI/UX' not in content:
            # Insere antes do fechamento de </style>
            content = content.replace('</style>', f'{FINAL_UX_IMPROVEMENTS}\n    </style>')
        
        # Melhora acessibilidade de imagens (se houver)
        content = re.sub(r'<img([^>]*)>', r'<img\1 loading="lazy">', content)
        
        # Adiciona lang em listas quando apropriado
        content = re.sub(r'<ul([^>]*)>', r'<ul\1 class="space-y-3">', content)
        content = re.sub(r'<ol([^>]*)>', r'<ol\1 class="space-y-3">', content)
        
        # Melhora parágrafos vazios
        content = re.sub(r'<p>\s*</p>', '', content)
        
        # Adiciona ARIA labels aos botões principais
        if 'Voltar ao Hub' in content and 'aria-label' not in content.split('Voltar ao Hub')[0][-100:]:
            content = re.sub(
                r'(<a[^>]*>.*?Voltar ao Hub)',
                r'<a aria-label="Voltar para o hub principal"\1',
                content,
                count=1
            )
        
        if content != original:
            with open(guide_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            improved += 1
            parts = guide_path.split('/')
            print(f"  ✅ {parts[1]}/{parts[2]}")
    
    except Exception as e:
        print(f"  ❌ Erro: {e}")

print(f"\n🎉 {improved} guias melhorados!")
print("\n✨ Melhorias aplicadas:")
print("   • Scrollbar customizada")
print("   • Focus states para acessibilidade")
print("   • Contraste de texto melhorado")
print("   • Links com hover effects")
print("   • Espaçamento consistente")
print("   • Listas mais legíveis")
print("   • Responsividade mobile otimizada")
print("   • Transições suaves")
print("   • Print styles")
print("   • Loading lazy de imagens")
print("   • ARIA labels")
