# Respostas Conceituais - Desafio CaseCellShop

## Pergunta 1 - Leitura inicial dos problemas

A loja virtual consulta o ERP diretamente para buscar produtos, preços e estoque. Como o ERP é um sistema central e monolítico, ele pode não estar preparado para receber milhões de acessos da vitrine ao mesmo tempo.

Também parece não existir uma camada de cache. Então informações que poderiam ser reaproveitadas, como nome do produto, preço e descrição, acabam sendo buscadas várias vezes no ERP. O cliente espera muito tempo para ver os produtos e pode desistir da compra antes mesmo de começar. Para o negócio, isso reduz vendas, aumenta abandono da loja e piora a imagem da empresa. Eu começaria analisando o tempo de resposta da API do ERP e quais chamadas são feitas quando a vitrine carrega. Depois, tentaria colocar uma camada de cache ou uma base de leitura para que a loja não precise consultar o ERP em toda requisição.

### Problema 2 - Consistência de estoque

O problema provavelmente acontece quando mais de um cliente tenta comprar o mesmo produto ao mesmo tempo. Se duas requisições leem o estoque antes de ele ser atualizado, as duas podem entender que ainda existe produto disponível.

Isso indica falta de controle de concorrência no momento do checkout. A validação e a baixa do estoque precisam acontecer de forma segura. A empresa acaba vendendo produtos que não possui. Isso gera cancelamentos, estornos, retrabalho para o time interno e frustração para o cliente. Além disso, o cliente perde confiança na loja quando compra um item e depois descobre que ele não está disponível.

Eu investigaria como o estoque é validado no checkout e se a baixa é feita de forma atômica. Uma melhoria seria criar uma reserva de estoque no momento da compra, garantindo que duas compras não consumam a mesma unidade.

### Problema 3 - Resiliência do checkout

O checkout depende de uma chamada síncrona para o ERP. O cliente finaliza a compra, a loja chama o ERP, o ERP processa o pedido e só depois a loja responde para o cliente.

Se o ERP demora demais, a requisição pode dar timeout e o cliente perde a compra, mesmo estando no último passo.

Esse é um problema muito crítico porque acontece no momento da conversão. O cliente já decidiu comprar, mas não consegue concluir o pedido.

Para o negócio, isso significa perda direta de receita. Também pode gerar inconsistência se o ERP processar algo, mas a loja não receber a resposta. Eu verificaria logs e tempos de resposta do ERP durante o checkout. Como melhoria, pensaria em registrar o pedido rapidamente na loja e processar a comunicação com o ERP em segundo plano, usando fila e tentativas de reprocessamento.

## Pergunta 2 - Infraestrutura e serviços de apoio

Para suportar muitos acessos, eu tentaria diminuir a dependência direta do ERP em cada requisição da loja. O ERP continuaria sendo importante, mas a vitrine e parte do checkout teriam camadas intermediárias para absorver melhor o volume de acessos.

Alguns conceitos e serviços que ajudariam:

### Cache

Um cache, como Redis, poderia guardar informações de produtos, preços e estoque por um tempo curto. Assim, a loja responderia mais rápido e faria menos chamadas ao ERP.

### CDN

Uma CDN poderia entregar arquivos estáticos, como imagens das capinhas, CSS e JavaScript. Isso melhora o tempo de carregamento para o usuário e reduz carga no datacenter da empresa.

### Banco ou base de leitura

Uma base de leitura poderia receber dados sincronizados do ERP. A vitrine consultaria essa base em vez de consultar diretamente o ERP toda hora.

### Fila

Uma fila ajudaria em processos mais lentos, como faturamento e integração com o ERP. Em vez de deixar o cliente esperando muito tempo, a aplicação poderia registrar a compra e processar o restante em segundo plano.

### Monitoramento

Também seria importante acompanhar métricas como tempo de resposta, erros, quantidade de pedidos com falha e tamanho da fila. Sem monitoramento, fica difícil saber onde está o gargalo.

## Pergunta 3 - SDD: Spec-Driven Development

Antes de implementar o endpoint `POST /checkout`, eu definiria primeiro o contrato da API.

Para este desafio, o endpoint precisa receber:

```json
{
  "productId": "case-iphone-15",
  "quantity": 2
}
```

Onde:

- `productId` é o identificador do produto.
- `quantity` é a quantidade que o cliente deseja comprar.

Em caso de sucesso, a API poderia retornar `201 Created`:

```json
{
  "message": "Compra realizada com sucesso.",
  "orderId": "ord_123",
  "productId": "case-iphone-15",
  "quantity": 2,
  "totalInCents": 7980,
  "remainingStock": 8
}
```

Em caso de erro, a API deve retornar uma mensagem clara e um status HTTP adequado:

| Status | Situação |
| --- | --- |
| `400 Bad Request` | Dados inválidos, como quantidade menor que 1 |
| `404 Not Found` | Produto não encontrado |
| `409 Conflict` | Estoque insuficiente |
| `503 Service Unavailable` | Serviço temporariamente indisponível |

Exemplo de erro:

```json
{
  "message": "Estoque insuficiente para a quantidade solicitada."
}
```

Definir esse contrato antes de programar é importante porque deixa claro o que o frontend deve enviar, o que o backend deve responder e quais erros precisam ser tratados. Isso também ajuda a escrever testes e evita retrabalho.

## Pergunta 4 - TDD: Test-Driven Development

Para o endpoint `POST /checkout`, eu escreveria testes para os principais cenários:

1. Compra realizada com sucesso quando o produto existe e tem estoque suficiente.
2. Erro quando `productId` não é enviado.
3. Erro quando `quantity` é zero, negativa ou não é um número.
4. Erro quando o produto não existe.
5. Erro quando a quantidade solicitada é maior que o estoque disponível.
6. Verificar se o estoque diminui depois de uma compra com sucesso.
7. Verificar se o sistema evita duas compras consumindo o mesmo estoque ao mesmo tempo.

Eu vejo vantagem em escrever os testes antes porque isso ajuda a pensar no comportamento esperado antes de sair codificando. Os testes funcionam como uma espécie de guia: primeiro eu defino o que a rota precisa fazer, depois implemento até os testes passarem.

Também ajuda a evitar que uma mudança futura quebre uma regra importante, como permitir compra sem estoque.

## Pergunta 5 - Uso de IA no desenvolvimento

Se eu fosse usar IA para ajudar no problema de furo de estoque, eu faria perguntas bem específicas, sempre revisando a resposta antes de aplicar.

Exemplos de prompts que eu usaria:

```text
Estou implementando um checkout em Node.js e TypeScript. Como posso evitar que duas compras simultâneas consumam o mesmo item de estoque?
```

```text
Quais testes devo escrever para garantir que meu endpoint POST /checkout não venda mais produtos do que o estoque disponível?
```

```text
Revise este fluxo de checkout e aponte possíveis problemas de concorrência, validação e atualização de estoque.
```

```text
Explique de forma simples a diferença entre reserva de estoque, baixa de estoque e controle de concorrência em um e-commerce.
```

Eu usaria a IA como apoio para pensar em soluções, revisar o código e lembrar de cenários de teste. Mesmo assim, eu não copiaria tudo automaticamente. A responsabilidade final seria minha, validando com testes e entendendo o que foi implementado.
