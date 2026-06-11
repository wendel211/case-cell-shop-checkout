# CaseCellShop

Mini checkout de capinhas desenvolvido para o desafio Junior Full Stack.

O projeto tem um backend em NestJS com uma API simples de produtos e checkout, e um frontend em React com Vite consumindo essa API.

## Tecnologias

- Backend: NestJS, TypeScript e Jest
- Frontend: React, TypeScript e Vite
- Estilo: CSS puro com interface inspirada nas cores da PeoplePro

## Como rodar o projeto

Clone o repositorio e instale as dependencias separadamente no backend e no frontend.

### Backend

```bash
cd backend
npm install
npm run start:dev
```

O backend roda em:

```text
http://localhost:3333
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O Vite vai mostrar a URL local do frontend no terminal.

## Endpoints da API

### Health check

```http
GET /health
```

Retorna uma mensagem simples para confirmar que a API esta no ar.

### Listar produtos

```http
GET /products
```

Retorna as capinhas disponiveis, com preco e estoque.

Exemplo de resposta:

```json
[
  {
    "id": "case-iphone-15",
    "name": "Capinha Silicone Transparente",
    "model": "iPhone 15",
    "priceInCents": 3990,
    "stock": 10
  }
]
```

### Finalizar compra

```http
POST /checkout
```

Body:

```json
{
  "productId": "case-iphone-15",
  "quantity": 1
}
```

Resposta de sucesso:

```json
{
  "message": "Compra realizada com sucesso.",
  "orderId": "ord_123456789",
  "productId": "case-iphone-15",
  "quantity": 1,
  "totalInCents": 3990,
  "remainingStock": 9
}
```

Possiveis erros:

- `400`: dados invalidos
- `404`: produto nao encontrado
- `409`: estoque insuficiente

## Como testar

### Backend

```bash
cd backend
npm run test
npm run test:e2e
npm run build
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

## Decisoes tomadas

- Usei NestJS no backend porque a vaga tem mais relacao com essa stack.
- Mantive os dados em memoria para deixar o desafio simples e facil de rodar.
- O checkout valida produto, quantidade e estoque antes de confirmar a compra.
- O frontend busca os produtos na API e mantem apenas as imagens no proprio frontend.
- A interface mostra carregamento, erro e confirmacao de compra para deixar o fluxo mais completo.

## Respostas conceituais

As respostas da parte conceitual estao em:

```text
docs/respostas-conceituais.md
```
