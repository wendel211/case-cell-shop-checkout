# CaseCellShop - Backend

API REST do CaseCellShop, responsavel por listar produtos e finalizar compras.

## Tecnologias

- NestJS
- TypeScript
- Jest
- Supertest

## Estrutura principal

```text
src/
|-- products/
|   |-- products.controller.ts
|   |-- products.service.ts
|   |-- products.module.ts
|   `-- products.types.ts
|-- checkout/
|   |-- checkout.controller.ts
|   |-- checkout.service.ts
|   |-- checkout.service.spec.ts
|   |-- checkout.module.ts
|   `-- checkout.dto.ts
|-- app.module.ts
|-- app.controller.ts
|-- app.service.ts
`-- main.ts

test/
|-- app.e2e-spec.ts
`-- jest-e2e.json
```

## Como rodar

```bash
npm install
npm run start:dev
```

A API roda por padrao em:

```text
http://localhost:3333
```

## Endpoints

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/health` | Verifica se a API esta no ar |
| `GET` | `/products` | Lista os produtos disponiveis |
| `POST` | `/checkout` | Finaliza uma compra |

## Checkout

O endpoint `POST /checkout` espera:

```json
{
  "productId": "case-iphone-15",
  "quantity": 1
}
```

Em caso de sucesso, retorna os dados do pedido, o total e o estoque restante.

Erros tratados:

- `400`: dados invalidos
- `404`: produto nao encontrado
- `409`: estoque insuficiente

## Scripts

| Script | Descricao |
| --- | --- |
| `npm run start:dev` | Inicia a API em modo desenvolvimento |
| `npm run build` | Compila o projeto |
| `npm run test` | Executa testes unitarios |
| `npm run test:e2e` | Executa testes end-to-end |
| `npm run lint` | Executa o ESLint |

## Decisoes tecnicas

- Usei NestJS por ser uma stack mais alinhada com a vaga.
- Mantive os produtos em memoria para simplificar o desafio.
- Habilitei CORS para permitir a comunicacao com o frontend.
- Separei `products` e `checkout` em modulos diferentes para manter a organizacao.
- O checkout valida produto, quantidade e estoque antes de reduzir o estoque.
