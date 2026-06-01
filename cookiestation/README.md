# CookieStation

CookieStation é um gerenciador de histórias com foco em criação colaborativa, leitura imersiva e interação entre autores.

## O que é

CookieStation permite que autores publiquem histórias, criem capítulos, editem conteúdos e conversem com leitores ou outros autores em tempo real.

## Principais funcionalidades

- Publicação de histórias com capítulos
- Editor de histórico com feedback de leitura
- Página de perfil do autor com obras publicadas
- Chat entre usuários para interação comunitária
- Biblioteca de histórias públicas por gênero
- Temas light/dark e controles de áudio ambiente

## Stack

- React 19
- TypeScript
- Vite
- Firebase Authentication
- Firestore
- Framer Motion
- SweetAlert2

## Como usar

No diretório `cookiestation`:

```bash
npm install
npm run dev
```

Antes de rodar, copie `.env.example` para `.env.local` e preencha com as credenciais do app web do Firebase:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:0000000000000000000000
```

Para gerar uma build de produção:

```bash
npm run build
```

## Status atual

- Correções aplicadas ao frontend `cookiestation`
- `npm run lint` passa sem erros
- `npm run build` conclui com sucesso

## Observações

Certifique-se de configurar o Firebase corretamente em `src/services/firebase.ts` antes de rodar a aplicação.
