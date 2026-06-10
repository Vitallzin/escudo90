# Loja Camisas

Projeto profissional para uma loja online de camisas de time, organizado em frontend, backend, painel administrativo, banco de dados, infraestrutura e documentacao.

## Estrutura do projeto

```text
loja-camisas/
|
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── ui/
│       │   ├── layout/
│       │   ├── forms/
│       │   └── product/
│       ├── pages/
│       ├── features/
│       │   ├── auth/
│       │   ├── products/
│       │   ├── cart/
│       │   ├── checkout/
│       │   ├── orders/
│       │   ├── favorites/
│       │   └── profile/
│       ├── hooks/
│       ├── services/
│       ├── contexts/
│       ├── routes/
│       ├── store/
│       ├── types/
│       ├── utils/
│       ├── constants/
│       ├── styles/
│       ├── App.tsx
│       └── main.tsx
│
├── backend/
│   └── src/
│       ├── modules/
│       │   ├── auth/
│       │   ├── users/
│       │   ├── products/
│       │   ├── categories/
│       │   ├── orders/
│       │   ├── payments/
│       │   ├── coupons/
│       │   ├── favorites/
│       │   ├── reviews/
│       │   └── shipping/
│       ├── middleware/
│       ├── config/
│       ├── database/
│       ├── services/
│       ├── utils/
│       ├── jobs/
│       └── app.ts
│
├── admin/
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── features/
│       │   ├── dashboard/
│       │   ├── products/
│       │   ├── orders/
│       │   ├── users/
│       │   ├── coupons/
│       │   └── settings/
│       ├── services/
│       ├── hooks/
│       ├── routes/
│       └── main.tsx
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema/
│
├── infra/
│   ├── docker/
│   ├── nginx/
│   ├── monitoring/
│   └── deploy/
│
├── docs/
│   ├── requisitos.md
│   ├── arquitetura.md
│   ├── banco-de-dados.md
│   └── api.md
│
├── .env.example
├── docker-compose.yml
├── README.md
└── package.json
```

## Visao geral

- `frontend`: loja publica para clientes comprarem camisas de time.
- `backend`: API, regras de negocio, pagamentos, pedidos e integracoes.
- `admin`: painel interno para gerenciar produtos, pedidos, clientes e cupons.
- `database`: migrations, seeds e modelos do banco.
- `infra`: configuracoes de Docker, Nginx, monitoramento e deploy.
- `docs`: documentacao do produto, arquitetura, banco e API.

## Comandos iniciais

```bash
npm install
npm run dev
npm run backend:dev
npm run build
```

## Backend

A API roda em `http://localhost:3333` e possui módulos para autenticação,
usuários, produtos, categorias, favoritos, avaliações, cupons, frete, pedidos,
pagamentos e administração.

Credenciais iniciais:

- Admin: `admin@escudonoventa.com` / `admin123`
- Cliente: `cliente@escudonoventa.com` / `cliente123`

## Objetivo do produto

A Loja Camisas sera uma plataforma completa para venda de camisas de clubes e selecoes, com catalogo organizado, favoritos, carrinho, checkout, pedidos, cupons, avaliacoes, frete e painel administrativo.
