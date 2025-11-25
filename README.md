# Design Portfolio AI

Um portfólio moderno e interativo com integração de IA para análise de projetos e geração de insights.

## 🚀 Tecnologias

- **React** + **TypeScript**
- **Vite** - Build tool
- **Google Gemini AI** - Análise inteligente de projetos
- **EmailJS** - Envio de emails
- **Recharts** - Gráficos e visualizações
- **React Router** - Navegação

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/victorhfd157/design-portfolio.git
cd design-portfolio

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves de API
```

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_GEMINI_API_KEY=sua_chave_gemini_aqui
```

Para obter a chave da API Gemini:
1. Acesse [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crie uma nova API key
3. Cole no arquivo `.env.local`

## 🛠️ Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## 🌐 Deploy

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/victorhfd157/design-portfolio)

1. Conecte seu repositório GitHub
2. Configure a variável de ambiente `VITE_GEMINI_API_KEY`
3. Deploy!

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/victorhfd157/design-portfolio)

1. Conecte seu repositório GitHub
2. Configure a variável de ambiente `VITE_GEMINI_API_KEY`
3. Deploy!

## 📁 Estrutura do Projeto

```
design-portfolio/
├── components/          # Componentes React
├── contexts/           # Context API (Theme, Language)
├── content/            # Conteúdo dos projetos
│   └── projects/       # Projetos individuais
├── fonts/              # Fontes customizadas
├── public/             # Arquivos públicos
├── services/           # Serviços (Gemini AI)
├── utils/              # Utilitários
├── App.tsx             # Componente principal
├── index.html          # HTML principal
└── vite.config.ts      # Configuração Vite
```

## 🎨 Funcionalidades

- ✨ Design moderno e responsivo
- 🌓 Modo claro/escuro
- 🌍 Suporte a múltiplos idiomas (PT/EN)
- 🤖 Análise de projetos com IA
- 📊 Visualização de dados com gráficos
- 📧 Formulário de contato funcional
- 🎭 Animações suaves e interativas

## 📝 Adicionando Novos Projetos

Para adicionar um novo projeto, crie uma pasta em `content/projects/` com:

1. `data.json` - Metadados do projeto
2. Imagens do projeto

Exemplo de `data.json`:

```json
{
  "id": "meu-projeto",
  "title": "Meu Projeto",
  "description": "Descrição do projeto",
  "category": "Web Design",
  "tags": ["React", "TypeScript"],
  "images": ["image1.jpg", "image2.jpg"],
  "year": 2024
}
```

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

Victor Hugo - [@victorhfd157](https://github.com/victorhfd157)
