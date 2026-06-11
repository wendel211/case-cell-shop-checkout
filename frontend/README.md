# CaseCellShop - Frontend

Interface do CaseCellShop, uma loja de capinhas para celular com fluxo de checkout integrado ao backend.

## Tecnologias

- React
- TypeScript
- Vite
- CSS puro

## Estrutura principal

```text
src/
|-- App.tsx
|-- App.css
|-- index.css
|-- main.tsx
`-- data/
    `-- products.ts
```

## Funcionalidades

- Lista produtos vindos da API do backend.
- Mostra imagem, modelo, preco e estoque de cada capinha.
- Permite selecionar o produto desejado.
- Permite aumentar e diminuir a quantidade respeitando o estoque.
- Mostra resumo do pedido com total e estoque apos a compra.
- Envia a compra para `POST /checkout`.
- Exibe feedback de sucesso ou erro.
- Bloqueia o botao enquanto a compra esta sendo processada.

## Como rodar

```bash
npm install
npm run dev
```

O Vite vai mostrar a URL local no terminal, geralmente:

```text
http://localhost:5173
```

O backend precisa estar rodando em:

```text
http://localhost:3333
```

## Scripts

| Script | Descricao |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Compila TypeScript e gera o build |
| `npm run preview` | Visualiza o build localmente |
| `npm run lint` | Executa o ESLint |

## Integracao com a API

O frontend busca os produtos em:

```http
GET http://localhost:3333/products
```

Ao finalizar a compra, envia:

```http
POST http://localhost:3333/checkout
```

As imagens das capinhas ficam no frontend, dentro da pasta `public`, e sao associadas aos produtos pelo `id`.

## Decisoes tecnicas

- Mantive o visual em CSS puro para evitar dependencias extras.
- Usei uma interface em portugues e com cores inspiradas na PeoplePro.
- Deixei os dados principais vindo da API, mantendo localmente apenas as imagens.
- Usei `Intl.NumberFormat` para formatar valores em Real.
- Criei estados de carregamento, erro e sucesso para deixar o fluxo mais claro.
