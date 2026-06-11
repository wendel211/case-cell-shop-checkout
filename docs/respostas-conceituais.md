# Respostas Conceituais - Desafio CaseCellShop

## Pergunta 1 - Leitura inicial dos problemas

### Problema 1 - Lentidão na vitrine

A loja virtual consulta o ERP diretamente para buscar produtos, preços e estoque. Como o ERP é um sistema mais pesado e centralizado, com arquitetura monolítica, ele provavelmente não foi pensado para aguentar muitos acessos da vitrine ao mesmo tempo. Além disso, parece não existir uma camada de cache, ou seja, informações que poderiam ser reaproveitadas, como nome do produto, preço e descrição, acabam sendo buscadas várias vezes no ERP sem necessidade. Para o cliente, isso deixa a loja lenta e pode fazer ele desistir antes de comprar. Para o negócio, o impacto é direto: menos vendas, mais abandono e uma imagem ruim da empresa. Minha primeira ação seria analisar o tempo de resposta do ERP e entender quais chamadas são feitas quando a vitrine carrega. A partir disso, pensaria em colocar cache ou uma base de leitura para a loja não depender do ERP em toda requisição.

### Problema 2 - Consistência de estoque

O problema provavelmente acontece quando mais de um cliente tenta comprar o mesmo produto ao mesmo tempo. Se duas requisições leem o estoque antes de ele ser atualizado, as duas podem entender que ainda existe produto disponível e aí as duas compras passam. Isso evidencia falta de controle de concorrência no checkout: a validação e a baixa do estoque precisam acontecer juntas, sem que outra requisição interfira no meio. Para a empresa, vender um produto sem estoque gera cancelamentos, estornos e frustração para o cliente, sendo o tipo de bug que parece pequeno, mas causa um estrago grande. O caminho seria investigar como o estoque é validado no checkout e se a baixa acontece de uma vez só. Uma melhoria seria criar uma reserva de estoque no momento da compra, para garantir que duas compras não consumam a mesma unidade.

### Problema 3 - Resiliência do checkout

O checkout depende de uma chamada síncrona para o ERP: o cliente finaliza a compra, a loja chama o ERP, o ERP processa o pedido e só depois a loja responde. Se o ERP demora demais, a requisição pode dar timeout e o cliente perde a compra mesmo estando no último passo. Na minha visão, esse é o problema mais crítico dos três, porque acontece exatamente no momento da conversão, quando o cliente já decidiu comprar, mas não consegue concluir. O que eu faria primeiro seria olhar logs e tempos de resposta do ERP durante o checkout para entender a gravidade. Como melhoria, faria sentido registrar o pedido rapidamente na loja e processar a comunicação com o ERP em segundo plano, usando fila e tentativas de reprocessamento.

---

## Pergunta 2 - Infraestrutura e serviços de apoio

Para suportar muitos acessos, eu tentaria diminuir a dependência direta do ERP em cada requisição. A ideia central é ter camadas intermediárias para que a vitrine e o checkout não precisem bater no ERP a todo momento.

Um cache como Redis atuaria como uma memória rápida entre a loja e o ERP: informações de produtos e preços ficariam armazenadas por um tempo curto, e a loja responderia direto do cache sem precisar consultar o ERP a cada acesso. Uma CDN cuidaria dos arquivos estáticos como imagens, CSS e JavaScript, entregando esse conteúdo de servidores mais próximos do usuário e aliviando o servidor principal. Já uma fila de mensagens, como RabbitMQ ou similar, serviria para desacoplar processos pesados como faturamento: em vez de o cliente ficar esperando o ERP processar tudo, a aplicação registra o pedido e joga o restante na fila para processar em segundo plano. Por fim, um monitoramento de métricas e erros teria o papel de tornar os problemas visíveis, permitindo agir rápido antes que um gargalo vire uma queda.

---

## Pergunta 3 - SDD: Spec-Driven Development

Antes de implementar o endpoint `POST /checkout`, eu definiria primeiro o contrato da API. Para este desafio, o endpoint precisa receber um `productId` (identificador do produto) e uma `quantity` (quantidade que o cliente deseja comprar).

```json
{
  "productId": "case-iphone-15",
  "quantity": 2
}
```

Em caso de sucesso, a API retorna `201 Created`:

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

Em caso de erro, a API retorna uma mensagem clara com o status HTTP adequado:

| Status | Situação |
|---|---|
| `400 Bad Request` | Dados inválidos, como quantidade menor que 1 |
| `404 Not Found` | Produto não encontrado |
| `409 Conflict` | Estoque insuficiente |
| `503 Service Unavailable` | Serviço temporariamente indisponível |

Definir esse contrato antes de sair programando ajuda bastante: deixa claro o que o frontend deve enviar, o que o backend deve responder e quais erros precisam ser tratados. Na prática, isso também facilita na hora de escrever testes e evita retrabalho.

---

## Pergunta 4 - TDD: Test-Driven Development

Para o endpoint `POST /checkout`, eu escreveria testes para os principais cenários:

1. Compra realizada com sucesso quando o produto existe e tem estoque suficiente.
2. Erro quando `productId` não é enviado.
3. Erro quando `quantity` é zero, negativa ou não é um número.
4. Erro quando o produto não existe.
5. Erro quando a quantidade solicitada é maior que o estoque disponível.
6. Verificar se o estoque diminui depois de uma compra com sucesso.
7. Verificar se o sistema evita duas compras consumindo o mesmo estoque ao mesmo tempo.

Escrever os testes antes me força a pensar no comportamento esperado antes de sair codificando. Funciona como um guia: primeiro defino o que a rota precisa fazer, depois implemento até os testes passarem. Além disso, ter esses testes prontos ajuda a pegar rápido se alguma mudança futura quebrar uma regra importante, como permitir compra sem estoque.

---

## Pergunta 5 - Uso de IA no desenvolvimento

Se eu fosse usar IA para resolver o problema de furo de estoque, focaria as perguntas exatamente nesse ponto: como garantir que duas compras simultâneas não consumam a mesma unidade. Os prompts que eu usaria seriam diretos ao problema:

```text
Estou implementando POST /checkout com NestJS e TypeScript usando dados em memória. Como evitar race condition quando duas requisições simultâneas tentam consumir o mesmo estoque? Considere atomicidade na validação e baixa do estoque.
```

```text
Revise este trecho de código de checkout e aponte falhas de concorrência e consistência de estoque. Sugira melhorias considerando que o projeto usa dados em memória e não possui banco de dados.
```

```text
Quais testes eu deveria escrever para garantir que o endpoint POST /checkout nunca venda mais estoque do que o disponível, mesmo com requisições paralelas?
```

Eu usaria a IA para entender as opções de solução, revisar o código, refatoração da solução, contudo não daria autonomia total a IA, a revisão é muito importante. E as responsabilidades finais seriam minhas, validando com testes e entendendo o que foi implementado.