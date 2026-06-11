# Registro de uso de IA

Este arquivo registra como a IA foi usada como durante o desenvolvimento do desafio CaseCellShop.

## 1. Planejamento inicial do desafio

```text
Atue como um engenheiro de software sênior. Quero resolver este desafio de engenharia full stack do zero, com foco em qualidade, clareza e entregável profissional, vamos orquestrar a arquitetura inicial do projeto.
```

```text
Usaremos NestJS. 

Considere:
- organização por módulos;
- injeção de dependências;
- testes;
- facilidade de evoluir o backend.

Depois, sugira uma estrutura inicial simples para a API, sem adicionar complexidade desnecessária.
```

```text
Atue como um backend engineer revisando o contrato de uma API de checkout.

Preciso implementar o endpoint POST /checkout para comprar capinhas de celular.

Defina um contrato claro contendo:
- body esperado;
- resposta de sucesso;
- status HTTP adequados para erro;
- mensagens de erro simples;
- validações obrigatórias;
- comportamento esperado quando não houver estoque.

O endpoint deve ser fácil de consumir pelo frontend e fácil de testar.
```

```text
Atue como um engenheiro NestJS. Quero implementar uma API simples para o desafio, mantendo o código limpo e incremental.

Requisitos:
- GET /health para verificar se a API está online;
- GET /products para listar produtos;
- POST /checkout para finalizar compra;
- validação de productId e quantity;
- erro para produto inexistente;
- erro para estoque insuficiente;
- atualização do estoque após compra bem-sucedida.

Use dados em memória para manter o desafio simples. Separe responsabilidades entre módulo de produtos e módulo de checkout. Evite banco de dados, autenticação ou recursos fora do escopo.
```

```text
Atue como um engenheiro de qualidade revisando o fluxo de checkout.

Liste os testes mais importantes para garantir que o endpoint POST /checkout está correto.

Os testes devem cobrir:
- compra com sucesso;
- productId ausente;
- quantity inválida;
- produto inexistente;
- estoque insuficiente;
- redução do estoque após compra;
- comportamento esperado em chamadas reais via HTTP.

Priorize testes que protejam regras de negócio e evitem regressão.
```

```text
Atue como um designer de produto e frontend engineer. Quero melhorar a interface do checkout sem alterar a regra de negócio.

Objetivo:
- deixar a tela elegante, clara e em português;
- usar uma paleta inspirada na identidade visual da PeoplePro, com preto, branco e laranja;
- manter contraste adequado para leitura;
- evitar scroll desnecessário em desktop;
- exibir feedbacks de erro e sucesso de forma discreta e profissional;
- manter o foco no fluxo de compra.

Revise também se textos, botões, cards e estados de erro estão consistentes para uma experiência real de checkout.
```

```text
Analise o frontend considerando que a integração já foi feita e faça uma validação completa para verificar se está tudo correto.

Se faltar integração, sugira o menor passo possível para:
- buscar produtos em GET /products;
- manter imagens locais associadas por id;
- enviar compra para POST /checkout;
- atualizar estoque após sucesso;
- mostrar erro quando a API não responder.

O objetivo é ter uma integração real, mas sem criar uma camada complexa demais para o tamanho do desafio.
```

```text
Atue como um avaliador técnico lendo o repositório de um desafio full stack.

Revise a documentação e indique o que precisa existir para que outra pessoa consiga rodar e avaliar o projeto sem perguntar nada.

A documentação deve conter:
- descrição do projeto;
- tecnologias usadas;
- como rodar backend e frontend;
- endpoints da API;
- exemplos de request e response;
- comandos de teste, lint e build;
- decisões técnicas;
- limitações assumidas.

Mantenha o texto claro, direto e organizado para GitHub.
```

```text
Atue como um revisor final de entrega técnica.

Analise o projeto considerando:
- estado do Git;
- histórico de commits;
- arquivos de documentação;
- testes automatizados;
- build do backend;
- lint e build do frontend;
- presença de arquivos desnecessários no repositório;
- clareza do fluxo para o avaliador.

Liste apenas o que ainda falta corrigir antes do push final.
```

## Observações finais

- A IA foi usada como apoio.
- As sugestões foram revisadas antes de entrar no projeto.
- Os testes, lint e builds foram executados para validar a entrega.
- O escopo foi mantido simples para respeitar o tamanho do desafio.
- Também usei a IA para melhorar os próprios prompts, deixando as perguntas mais claras, específicas e úteis para cada etapa do desenvolvimento.