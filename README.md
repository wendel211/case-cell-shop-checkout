# CaseCellShop

Mini checkout de capinhas desenvolvido como solução para o desafio técnico Junior Full Stack.

O projeto é composto por um backend em NestJS expondo uma API REST de produtos e checkout, e um frontend em React com Vite consumindo essa API.

## Stack

| Camada | Tecnologias |
|--------|------------|
| Backend | NestJS, TypeScript, Jest |
| Frontend | React, TypeScript, Vite |
| Estilo | CSS puro com identidade visual inspirada nas cores da PeoplePro |

## Como executar

Clone o repositório e instale as dependências separadamente em cada camada.

### Backend

```bash
cd backend
npm install
npm run start:dev
```

A API estará disponível em:

```
http://localhost:3333
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O Vite exibirá a URL local no terminal após a inicialização.

## Endpoints da API

### Health check

```http
GET /health
```

Retorna uma mensagem de confirmação indicando que a API está operacional.

### Listar produtos

```http
GET /products
```

Retorna a lista de capinhas disponíveis com preço e estoque atual.

**Exemplo de resposta:**

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

**Body:**

```json
{
  "productId": "case-iphone-15",
  "quantity": 1
}
```

**Resposta de sucesso (`200`):**

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

**Respostas de erro:**

| Status | Descrição |
|--------|-----------|
| `400` | Dados inválidos na requisição |
| `404` | Produto não encontrado |
| `409` | Estoque insuficiente para a quantidade solicitada |

## Validação e build

### Backend

```bash
cd backend
npm run test        # testes unitários
npm run test:e2e    # testes end-to-end
npm run build       # build de produção
```

### Frontend

```bash
cd frontend
npm run lint        # análise estática
npm run build       # build de produção
```

## Decisões técnicas

**NestJS no backend**: Escolha alinhada com a stack mencionada na vaga, aproveitando o sistema de módulos, injeção de dependência e suporte nativo a TypeScript.

**Dados em memória**: Repositório in-memory para manter o projeto autocontido e sem dependências externas, facilitando a execução local sem configuração de banco de dados.

**Validação no checkout**: O endpoint valida produto, quantidade e disponibilidade de estoque antes de confirmar o pedido, retornando erros semânticos com os status HTTP apropriados.

**Imagens no frontend**: Os assets de imagem são mantidos no bundle do frontend; a API é responsável apenas pelos dados de produto.

**Estados de UI explícitos**: O frontend trata os estados de carregamento, erro e confirmação de compra, tornando o fluxo mais robusto e a experiência mais previsível.

## Respostas conceituais

As respostas da parte conceitual estão em:

```
docs/respostas-conceituais.md
```
