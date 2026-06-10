# Respostas conceituais - Desafio CaseCellShop

## Pergunta 1 - Leitura inicial dos problemas

### Problema 1 - Performance da vitrine

**O que pode estar causando**

A loja parece depender muito do ERP para carregar a vitrine. Então, sempre que alguém acessa os produtos, a aplicação precisa consultar o ERP para buscar informações como preço, estoque e dados do produto.

Como o ERP também cuida de outras áreas importantes da empresa, ele pode ficar sobrecarregado com muitos acessos ao mesmo tempo. Também pode estar faltando cache para evitar consultas repetidas.

**Impacto**

Para o cliente, a loja fica lenta e a experiência piora. Muitas pessoas podem desistir antes de comprar.

Para o negócio, isso pode gerar menos vendas, mais abandono da página e perda de confiança na marca.

**Como eu investigaria**

Eu começaria olhando os tempos de resposta da API do ERP e quais chamadas são feitas ao abrir a vitrine. Depois, pensaria em usar cache ou uma base de leitura para diminuir a dependência direta do ERP.

### Problema 2 - Consistência de estoque

**O que pode estar causando**

Esse problema provavelmente acontece quando duas ou mais pessoas tentam comprar o mesmo produto ao mesmo tempo. Se o sistema consulta o estoque antes de atualizar a quantidade disponível, mais de uma compra pode ser aprovada para o mesmo item.

Na prática, faltaria uma forma segura de validar e baixar o estoque no momento da compra.

**Impacto**

O cliente pode comprar um produto e depois descobrir que ele não está disponível. Isso gera frustração.

Para a empresa, causa cancelamentos, estornos, retrabalho no atendimento e perda de confiança.

**Como eu investigaria**

Eu verificaria como o checkout valida o estoque e se a baixa acontece junto com a confirmação da compra. Uma melhoria seria reservar o estoque no momento do checkout, garantindo que a mesma unidade não seja vendida duas vezes.

### Problema 3 - Resiliência do checkout

**O que pode estar causando**

O checkout parece depender de uma resposta imediata do ERP. O cliente finaliza a compra, a loja chama o ERP, e só depois de o ERP processar tudo a loja responde.

Se o ERP demora demais, a requisição pode dar timeout e a compra falha.

**Impacto**

Esse problema é crítico porque acontece no final da jornada. O cliente já escolheu o produto e decidiu comprar, mas não consegue concluir.

Para o negócio, isso representa perda direta de vendas. Também pode gerar dúvida se o pedido foi criado ou não.

**Como eu investigaria**

Eu olharia logs, tempos de resposta e erros de timeout no checkout. Como melhoria, pensaria em registrar o pedido rapidamente e deixar a comunicação mais demorada com o ERP para uma fila em segundo plano.

## Pergunta 2 - Infraestrutura e serviços de apoio

Eu tentaria fazer a loja depender menos do ERP em tempo real. O ERP continuaria sendo o sistema principal, mas a loja teria camadas de apoio para aguentar mais acessos.

**Cache**

Um cache, como Redis, ajudaria a guardar dados muito acessados, como produtos e preços. Isso deixaria a vitrine mais rápida e reduziria chamadas ao ERP.

**CDN**

Uma CDN ajudaria a entregar imagens das capinhas, CSS e JavaScript com mais velocidade. Isso melhora a experiência do usuário e diminui carga no servidor.

**Base de leitura**

Uma base de leitura poderia receber uma cópia dos dados importantes do ERP. Assim, a vitrine consultaria essa base em vez de consultar o ERP toda hora.

**Fila**

Uma fila ajudaria em tarefas mais demoradas, como faturamento e integração com o ERP. A loja poderia registrar o pedido e processar essas etapas em segundo plano.

**Monitoramento**

Também é importante acompanhar tempo de resposta, erros e pedidos com falha. Assim fica mais fácil descobrir problemas antes que afetem muitos clientes.

## Pergunta 3 - SDD: Spec-Driven Development

Antes de implementar o `POST /checkout`, eu definiria primeiro o que a rota precisa receber e responder.

Para este desafio, a entrada poderia ser:

```json
{
  "productId": "case-iphone-15",
  "quantity": 2
}
```

O `productId` identifica o produto, e o `quantity` informa a quantidade que o cliente quer comprar.

Em caso de sucesso, a resposta poderia ser:

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

Em caso de erro, a API deve retornar uma mensagem clara:

| Status | Quando usar |
| --- | --- |
| `400 Bad Request` | Dados inválidos |
| `404 Not Found` | Produto não encontrado |
| `409 Conflict` | Estoque insuficiente |
| `503 Service Unavailable` | Serviço indisponível |

Exemplo:

```json
{
  "message": "Estoque insuficiente para a quantidade solicitada."
}
```

Definir esse contrato antes ajuda porque o frontend sabe o que enviar, o backend sabe o que validar e os testes ficam mais fáceis de escrever.

## Pergunta 4 - TDD: Test-Driven Development

Eu escreveria testes para os principais casos do `POST /checkout`:

1. Compra com sucesso quando existe estoque.
2. Erro quando o produto não é enviado.
3. Erro quando a quantidade é inválida.
4. Erro quando o produto não existe.
5. Erro quando o estoque é insuficiente.
6. Verificar se o estoque diminui depois da compra.
7. Verificar se duas compras ao mesmo tempo não vendem mais do que existe em estoque.

Escrever os testes antes ajuda a pensar melhor nas regras antes de implementar. Primeiro eu defino o comportamento esperado, depois escrevo o código para fazer esses testes passarem.

Isso também ajuda a evitar que uma mudança futura quebre uma regra importante do checkout.

## Pergunta 5 - Uso de IA no desenvolvimento

Eu usaria IA como apoio para pensar em soluções, revisar ideias e lembrar de cenários de teste. Alguns prompts que eu usaria:

```text
Estou criando um checkout em Node.js e TypeScript. Como posso evitar que duas compras ao mesmo tempo consumam o mesmo item do estoque?
```

```text
Quais testes são importantes para garantir que um checkout não venda mais produtos do que o estoque disponível?
```

```text
Revise este fluxo de checkout e aponte possíveis problemas de validação ou concorrência.
```

```text
Explique de forma simples como funciona uma reserva de estoque em um e-commerce.
```

Mesmo usando IA, eu revisaria tudo antes de aplicar. A IA ajuda bastante, mas a responsabilidade de entender, testar e entregar a solução continua sendo minha.
