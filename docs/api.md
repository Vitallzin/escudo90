# API

Backend em TypeScript com servidor HTTP nativo do Node, organizado por módulos.

## Como rodar

```bash
npm run backend:dev
```

Base local:

```text
http://localhost:3333
```

## Autenticação

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/recover-password`
- `GET /auth/me`
- `GET /auth/demo/customer`
- `GET /auth/demo/admin`

Use o token retornado no login:

```text
Authorization: Bearer TOKEN
```

Usuários de teste:

- Admin: `admin@escudonoventa.com` / `admin123`
- Cliente: `cliente@escudonoventa.com` / `cliente123`

## Loja

- `GET /health`
- `GET /categories`
- `GET /products`
- `GET /products/:id`
- `GET /products/:productId/reviews`
- `POST /products/:productId/reviews`
- `GET /favorites`
- `POST /favorites/:productId`
- `DELETE /favorites/:productId`
- `POST /shipping/quote`
- `GET /coupons/validate?code=TORCIDA10`

## Cliente

- `GET /users/me`
- `PATCH /users/me`
- `POST /users/me/addresses`
- `GET /orders`
- `GET /orders/:id`
- `POST /orders`
- `POST /payments/intent`

## Administração

- `GET /admin/dashboard`
- `GET /admin/users`
- `GET /admin/inventory`
- `POST /admin/products`
- `PATCH /admin/products/:id`
- `GET /admin/coupons`
- `POST /admin/coupons`
- `PATCH /admin/orders/:id/status`
