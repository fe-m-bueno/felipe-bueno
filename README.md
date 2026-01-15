# Felipe Bueno - Portfolio

Portfólio pessoal desenvolvido com Next.js 14, apresentando meus projetos e experiência profissional como desenvolvedor fullstack.

## Sobre o Projeto

Este é um site de portfólio moderno e responsivo que utiliza as mais recentes tecnologias web para proporcionar uma experiência fluida e envolvente. O projeto inclui internacionalização (i18n), integração com a API do Last.fm para exibir músicas recentemente tocadas, e um sistema de contato funcional.

## Principais Funcionalidades

- Design responsivo com animações suaves usando Framer Motion
- Suporte a tema claro/escuro
- Internacionalização (Português e Inglês)
- Integração com Last.fm para exibir atividade musical
- Formulário de contato funcional com validação
- Seção de projetos com filtros e categorização
- SEO otimizado com metadados estruturados
- Analytics e métricas de performance com Vercel

## Stack Tecnológica

### Frontend

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- i18next (internacionalização)

### Backend

- Next.js API Routes
- Nodemailer / Resend (envio de emails)
- Zod (validação de schemas)

### Ferramentas e Bibliotecas

- Lucide React (ícones)
- Iconify (biblioteca de ícones)
- Vercel Analytics & Speed Insights
- Embla Carousel

## Instalação e Execução

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/felipe-bueno.git
cd felipe-bueno
npm install
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Configuração de Email
EMAIL_USER=seu-email@exemplo.com
EMAIL_PASS=sua-senha-de-app

# Last.fm API (opcional)
LASTFM_API_KEY=sua-chave-api
LASTFM_USERNAME=seu-usuario
```

### Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Build de Produção

Para gerar a build otimizada:

```bash
npm run build
npm start
```

## Estrutura do Projeto

```
felipe-bueno/
├── app/                    # Rotas e páginas (App Router)
│   ├── api/               # API routes
│   ├── projects/          # Página de projetos
│   └── layout.tsx         # Layout principal
├── components/            # Componentes React reutilizáveis
├── data/                  # Dados estáticos (projetos, experiências)
├── hooks/                 # Custom React hooks
├── lib/                   # Utilitários e helpers
├── locales/               # Arquivos de tradução (i18n)
│   ├── en/
│   └── pt/
├── public/                # Assets estáticos
└── utils/                 # Funções utilitárias
```

## Deployment

O projeto está configurado para deploy automático na Vercel. Qualquer push para a branch principal aciona um novo deploy.

Para fazer deploy manual:

```bash
vercel --prod
```

## Licença

Este projeto é de uso pessoal. Todos os direitos reservados.
