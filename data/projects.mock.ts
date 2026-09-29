import type { Project } from "@/types/project";
import { technologiesById } from "./technologies.mock";

function resolveTech(ids: string[]) {
  return ids
    .map((id) => technologiesById.get(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .sort((a, b) => (b.ranking ?? 0) - (a.ranking ?? 0));
}

export const projects: Project[] = [
  // ============================================================
  // LETTERDROP
  // ============================================================
  {
    id: "letterdrop",
    slug: "letterdrop",
    name: "LetterDrop",
    summary:
      "Plataforma de newsletters construída com NestJS e microsserviços, utilizando RabbitMQ para processamento assíncrono, rastreamento idempotente de entregas e tratamento resiliente de falhas.",
    technologies: resolveTech([
      "git",
      "github",
      "nodejs",
      "typescript",
      "nestjs",
      "postgresql",
      "typeorm",
      "rabbitmq",
      "jwt",
      "zod",
      "swagger",
      "pino",
      "resend",
      "jest",
      "docker",
      "eslint",
      "sqlite",
      "prettier",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/LetterDrop",
    featured: true,
    ranking: 100,
    highlights: [
      "Arquitetura com dois microsserviços NestJS",
      "Comunicação assíncrona através de RabbitMQ",
      "Processamento de newsletters em lotes",
      "Entrega idempotente com checkpoint de processamento",
      "Dead Letter Queue para mensagens que falharam",
      "Tratamento de bounces através do Resend",
      "Controle de acesso com JWT e RBAC",
      "Docker Compose para infraestrutura completa",
    ],
    sections: [
      {
        id: "letterdrop-overview",
        type: "overview",
        content: `
  O LetterDrop é uma plataforma de newsletters desenvolvida para explorar arquitetura de microsserviços, comunicação assíncrona e processamento resiliente de mensagens.

  A aplicação possui uma API principal responsável por autenticação, assinantes e newsletters, além de um microsserviço separado responsável pelo envio dos emails.

  O projeto utiliza RabbitMQ para desacoplar a criação de uma campanha do processamento potencialmente demorado de milhares de emails.
        `,
      },
      {
        id: "letterdrop-architecture",
        type: "architecture",
        content: `
  A arquitetura é composta por dois serviços NestJS:

  API:
  - REST API
  - Autenticação e autorização
  - Gerenciamento de assinantes
  - Gerenciamento de newsletters
  - Persistência PostgreSQL
  - Publicação de eventos no RabbitMQ

  Mailer:
  - Consumidores RabbitMQ
  - Processamento dos envios
  - Integração com Resend
  - Rastreamento das entregas
  - Tratamento de falhas e DLQ

  PostgreSQL é utilizado como banco compartilhado, mas acessado diretamente apenas pela API.

  RabbitMQ funciona como camada de comunicação entre os serviços, utilizando exchanges, filas, consumidores e Dead Letter Queue.
        `,
      },
      {
        id: "letterdrop-how-it-works",
        type: "how-it-works",
        content: `
  Quando um administrador envia uma newsletter, a API não realiza todos os envios diretamente.

  Primeiro, a newsletter muda para o estado QUEUED e a API publica um evento no RabbitMQ.

  O Mailer consome esse evento e começa a processar os assinantes em lotes de 5, utilizando concorrência e rate limiting configuráveis.

  Cada entrega é registrada individualmente. Caso o processo seja interrompido, o Mailer consegue continuar a partir do checkpoint armazenado sem precisar reenviar tudo novamente.
        `,
      },
      {
        id: "letterdrop-features",
        type: "features",
        content: `
  O projeto possui diversos fluxos voltados para confiabilidade e observabilidade:

  - Cadastro e confirmação de assinantes
  - Cancelamento de inscrição
  - Criação e gerenciamento de newsletters
  - Autenticação JWT
  - RBAC para ADMIN e SUPER_ADMIN
  - Envio assíncrono de newsletters
  - Processamento em lotes
  - Controle de entregas individuais
  - Retomada através de checkpoints
  - Dead Letter Queue
  - Tratamento de emails rejeitados pelo provedor
  - Estados DRAFT, QUEUED, PROCESSING, SENT, PARTIAL e FAILED
  - Estados PENDING, CONFIRMED, UNSUBSCRIBED e BOUNCED
        `,
      },
      {
        id: "letterdrop-decisions",
        type: "decisions",
        content: `
  A separação entre API e Mailer evita que uma operação potencialmente longa bloqueie a API.

  RabbitMQ permite que o trabalho permaneça na fila mesmo quando o Mailer está indisponível.

  O rastreamento individual das entregas e o checkpoint evitam o reprocessamento desnecessário de assinantes já processados.

  Mensagens que não conseguem ser processadas são encaminhadas para uma Dead Letter Queue, permitindo análise posterior das falhas.

  Tokens de confirmação e cancelamento são armazenados utilizando SHA-256 em vez do valor original.
        `,
      },
      {
        id: "letterdrop-process",
        type: "process",
        content: `
  O fluxo principal pode ser resumido como:

  Admin
  → API NestJS
  → RabbitMQ
  → Mailer NestJS
  → Resend
  → rastreamento da entrega

  Em caso de falha:

  Consumer
  → Dead Letter Exchange
  → Dead Letter Queue
  → DeadLettersConsumer

  Esse fluxo permite separar a responsabilidade de receber a solicitação da responsabilidade de executar os envios.
        `,
      },
      {
        id: "letterdrop-learnings",
        type: "learnings",
        content: `
  O LetterDrop foi um dos projetos mais aprofundados do portfólio e serviu para estudar conceitos de arquitetura distribuída que vão além de uma API REST tradicional.

  Os principais aprendizados envolveram microsserviços, RabbitMQ, processamento assíncrono, idempotência, checkpoints, Dead Letter Queue, comunicação interna entre serviços, rate limiting e tratamento de falhas.

  Também houve contato com documentação de APIs, testes unitários e e2e, health checks, Docker e validação de configuração com Zod.
        `,
      },
    ],
  },

  // ============================================================
  // LINKSHORTENER
  // ============================================================

  {
    id: "linkshortener",
    slug: "linkshortener",
    name: "LinkShortener",
    summary:
      "Encurtador de URLs serverless desenvolvido na AWS, com rastreamento de acessos, autenticação por API Key, infraestrutura como código e expiração automática de dados.",
    highlights: [
      "Arquitetura serverless com AWS Lambda",
      "API Gateway e Lambda Authorizer",
      "DynamoDB com TTL",
      "Rastreamento assíncrono de acessos",
      "Infraestrutura como código com CloudFormation",
      "CI/CD com GitHub Actions",
      "Observabilidade com CloudWatch",
      "Alertas automáticos via SNS",
      "IAM com princípio do menor privilégio",
    ],
    technologies: resolveTech([
      "git",
      "github",
      "python",
      "aws",
      "awslambda",
      "apigateway",
      "dynamodb",
      "s3",
      "cloudformation",
      "githubactions",
      "cloudwatch",
      "sns",
      "pytest",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/LinkShortener",
    liveUrl:
      "http://link-shortener-099771438356.s3-website.us-east-2.amazonaws.com/index.html",
    featured: true,
    ranking: 90,

    sections: [
      {
        id: "linkshortener-overview",
        type: "overview",
        content: `O **LinkShortener** é um encurtador de URLs construído sobre uma arquitetura serverless na AWS.

O projeto foi desenvolvido para colocar em prática diversos conceitos de infraestrutura em nuvem em uma única aplicação: **Lambda, API Gateway, DynamoDB, S3, CloudFormation, IAM, CI/CD, observabilidade e processamento assíncrono**.

Apesar de possuir uma funcionalidade simples para o usuário, sua infraestrutura envolve vários serviços independentes trabalhando em conjunto.`,
      },

      {
        id: "linkshortener-how-it-works",
        type: "how-it-works",
        content: `O sistema possui três fluxos principais.

### Criação de links

O cliente envia uma URL para a API. Antes de chegar à função principal, a requisição passa pelo **Lambda Authorizer**, que valida a API Key.

Depois disso, a Lambda valida os dados, gera o identificador curto e armazena o registro no DynamoDB.

### Redirecionamento

Quando alguém acessa o identificador curto:

1. API Gateway recebe a requisição.
2. A Lambda consulta o DynamoDB.
3. O registro é localizado através do slug.
4. A aplicação retorna um redirecionamento HTTP 301.
5. O registro de acesso é processado de forma assíncrona pela Lambda de analytics.

### Analytics

A função de analytics registra os acessos em uma tabela separada do DynamoDB.

Esse fluxo mantém o redirecionamento independente do processamento das métricas.`,
      },

      {
        id: "linkshortener-architecture",
        type: "architecture",
        content: `A arquitetura utiliza serviços gerenciados da AWS para evitar a necessidade de servidores persistentes.

\`\`\`
                 ┌──────────────┐
                 │    Cliente   │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │ API Gateway  │
                 └──────┬───────┘
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
      Lambda Authorizer      Lambda Principal
                                   │
                                   ▼
                              DynamoDB
                                   │
                                   ▼
                           Lambda Analytics
                                   │
                                   ▼
                              Clicks Table
\`\`\`

A infraestrutura é definida como código através do **CloudFormation**.

O frontend estático é hospedado no **Amazon S3**, enquanto as funções backend são executadas pelo AWS Lambda.`,
      },

      {
        id: "linkshortener-features",
        type: "features",
        content: `- **Encurtamento de URLs** através de identificadores curtos.
- **Redirecionamento HTTP 301** para os endereços originais.
- **Contagem de acessos** através de uma função de analytics.
- **API Key** para proteger a criação de links.
- **Validação de payloads** e limites de tamanho.
- **Expiração automática** de links e registros de analytics através do TTL do DynamoDB.
- **Dashboard de observabilidade** no CloudWatch.
- **Alertas de erros** através do SNS.
- **Deploy automatizado** com GitHub Actions.
- **Infraestrutura reproduzível** com CloudFormation.`,
      },

      {
        id: "linkshortener-decisions",
        type: "decisions",
        content: `### Arquitetura Serverless

A utilização de Lambda, API Gateway e DynamoDB elimina a necessidade de manter servidores dedicados para a aplicação.

### DynamoDB com TTL

O TTL permite que links e registros antigos sejam removidos automaticamente, sem a necessidade de workers ou tarefas periódicas de limpeza.

### Lambda Authorizer

A autenticação da rota de criação fica separada da lógica principal da aplicação.

### IAM com menor privilégio

Cada função Lambda possui apenas as permissões necessárias para executar sua responsabilidade, evitando acesso desnecessário aos demais recursos.

### Infraestrutura como código

O CloudFormation concentra a definição dos recursos da aplicação e permite reproduzir a infraestrutura através do pipeline de deploy.`,
      },

      {
        id: "linkshortener-process",
        type: "process",
        content: `O projeto foi utilizado para praticar uma visão mais completa do ciclo de desenvolvimento de uma aplicação serverless.

Além da implementação das funções, foram trabalhados:

- definição de infraestrutura através de CloudFormation;
- testes automatizados com pytest;
- pipeline de CI/CD;
- deploy de backend e frontend;
- leitura dinâmica dos recursos criados pelo CloudFormation;
- monitoramento através do CloudWatch;
- alertas de falha com SNS;
- aplicação de princípios de segurança através do IAM.`,
      },
    ],
  },

  // ============================================================
  // SUPPORTDESK
  // ============================================================

  {
    id: "supportdesk",
    slug: "supportdesk",
    name: "SupportDesk",
    summary:
      "Plataforma fullstack de gerenciamento de tickets de suporte, com RBAC, API REST, máquina de estados, cache no frontend e infraestrutura containerizada.",
    highlights: [
      "Backend Node.js + Express e frontend React",
      "Controle de acesso por perfil",
      "Máquina de estados para tickets",
      "API REST com validação Zod",
      "MongoDB com Mongoose",
      "Cache e sincronização de dados com TanStack React Query",
      "Testes de integração com Jest e Supertest",
      "Docker Compose",
      "NGINX como reverse proxy",
    ],
    technologies: resolveTech([
      "git",
      "github",
      "nodejs",
      "express",
      "typescript",
      "mongodb",
      "mongoose",
      "jwt",
      "zod",
      "jest",
      "supertest",
      "react",
      "vite",
      "tanstackquery",
      "bcrypt",
      "axios",
      "docker",
      "nginx",
      "reactrouter",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/SupportDesk",
    coverImage: "https://i.imgur.com/zPxxCk0.png",
    featured: true,
    ranking: 85,

    sections: [
      {
        id: "supportdesk-overview",
        type: "overview",
        content: `O **SupportDesk** é uma plataforma fullstack para gerenciamento de chamados de suporte.

O projeto foi desenvolvido para explorar principalmente **controle de acesso por perfil, arquitetura de API REST, máquina de estados, cache de dados no frontend, testes de integração e infraestrutura containerizada**.

A aplicação possui dois perfis principais: clientes, responsáveis por abrir chamados, e agentes, responsáveis pelo atendimento e resolução.`,
      },

      {
        id: "supportdesk-how-it-works",
        type: "how-it-works",
        content: `O fluxo da aplicação gira em torno do ciclo de vida dos tickets.

### Cliente

O cliente pode criar chamados, acompanhar seus tickets, adicionar comentários e cancelar seus próprios chamados quando permitido.

### Agente

O agente pode visualizar tickets, assumir chamados, liberar a atribuição, responder e encerrá-los de acordo com as regras de negócio.

### Ciclo de vida

\`\`\`
Aberto
  │
  ▼
Em atendimento
  │
  ▼
Fechado

Aberto ─────────► Cancelado
\`\`\`

As transições são controladas pelo backend de acordo com o perfil do usuário e o estado atual do ticket.`,
      },

      {
        id: "supportdesk-architecture",
        type: "architecture",
        content: `O projeto reúne frontend, backend, banco de dados e proxy reverso em uma infraestrutura baseada em Docker Compose.

### Backend

O backend utiliza uma arquitetura em camadas:

\`\`\`
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
MongoDB
\`\`\`

A API utiliza:

- Node.js;
- Express;
- TypeScript;
- Zod;
- JWT;
- Mongoose;
- tratamento global de erros;
- Jest e Supertest.

### Frontend

O frontend utiliza React e Vite.

O estado remoto é gerenciado através do **TanStack React Query**, enquanto o React Router organiza as rotas públicas e protegidas.

### Infraestrutura

Os serviços são executados através do Docker Compose:

- frontend;
- backend;
- MongoDB;
- NGINX.

O NGINX funciona como **reverse proxy**, encaminhando as requisições para os serviços correspondentes.`,
      },

      {
        id: "supportdesk-features",
        type: "features",
        content: `- **Autenticação com JWT**.
- **RBAC** para separar permissões entre clientes e agentes.
- **Criação e gerenciamento de tickets**.
- **Atribuição de tickets** para agentes.
- **Comentários** dentro dos chamados.
- **Controle de transições de estado**.
- **Validação de requisições** com Zod.
- **Cache e sincronização de dados remotos** com TanStack React Query.
- **Testes de integração** com Jest e Supertest.
- **Infraestrutura containerizada** com Docker Compose.
- **Reverse proxy** utilizando NGINX.`,
      },

      {
        id: "supportdesk-decisions",
        type: "decisions",
        content: `### Máquina de estados para tickets

O ciclo de vida dos chamados possui regras próprias para cada transição. Centralizar essas regras evita que a aplicação aceite combinações inválidas de estados.

### RBAC

As permissões são determinadas pelo papel do usuário. Isso evita depender apenas da interface para esconder operações que não deveriam estar disponíveis para determinado perfil.

### TanStack React Query

O projeto utiliza o React Query para lidar com estado remoto, cache e sincronização das informações vindas da API.

### NGINX como reverse proxy

O NGINX centraliza a entrada das requisições e encaminha o tráfego para frontend e backend dentro da infraestrutura Docker.

### Supertest

Os testes de integração verificam o comportamento da API de forma próxima ao fluxo real de utilização, incluindo autenticação e ciclo completo dos tickets.`,
      },

      {
        id: "supportdesk-screenshots",
        type: "screenshots",
        content: "Capturas de tela da interface do SupportDesk.",
        images: [
          "https://i.imgur.com/zPxxCk0.png",
          "https://i.imgur.com/7CIwg5R.png",
          "https://i.imgur.com/WUWEZum.png",
          "https://i.imgur.com/w11GC8q.png",
        ],
      },

      {
        id: "supportdesk-learnings",
        type: "learnings",
        content: `O SupportDesk foi importante principalmente para aprofundar conceitos que vão além da implementação de endpoints.

Entre os principais aprendizados estão:

- aplicação prática de **cache e sincronização de estado remoto**;
- utilização de **reverse proxy** com NGINX;
- modelagem de regras através de uma máquina de estados;
- separação de responsabilidades em uma API em camadas;
- testes de integração com **Supertest**;
- aplicação de autorização tanto na API quanto na interface;
- execução de uma aplicação fullstack através de Docker Compose.`,
      },
    ],
  },

  // ============================================================
  // PEDEAI
  // ============================================================

  {
    id: "pedeai",
    slug: "pedeai",
    name: "PedeAi",
    summary:
      "Plataforma de pedidos via Telegram que combina automação de workflows com n8n, backend Node.js, PostgreSQL, Redis e assistência baseada em Gemini.",
    highlights: [
      "Automação de atendimento com n8n",
      "Bot de pedidos integrado ao Telegram",
      "Máquina de estados para o fluxo de pedidos",
      "PostgreSQL com triggers e JSONB",
      "Redis para cache e sessões",
      "Invalidação de cache baseada em alterações",
      "Assistente com Google Gemini",
      "Agent handoff entre automação e IA",
      "Rate limiting e proteção contra abuso",
      "Docker Compose",
    ],
    technologies: resolveTech([
      "git",
      "github",
      "nodejs",
      "express",
      "postgresql",
      "n8n",
      "docker",
      "redis",
      "gemini",
      "telegram",
      "swagger",
      "axios",
      "ngrok",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/PedeAi",
    coverImage: "https://i.imgur.com/FiRIJcS.png",
    featured: true,
    ranking: 80,

    sections: [
      {
        id: "pedeai-overview",
        type: "overview",
        content: `O **PedeAi** é uma plataforma de automação de pedidos para restaurantes construída em torno de um bot do Telegram.

O projeto combina uma **API REST em Node.js**, automação de workflows com **n8n**, PostgreSQL, Redis e um assistente baseado no **Google Gemini**.

A ideia central é unir um fluxo determinístico, responsável pelas etapas do pedido, com inteligência artificial para lidar com perguntas que não se encaixam diretamente nas opções previstas pelo fluxo.`,
      },

      {
        id: "pedeai-how-it-works",
        type: "how-it-works",
        content: `O atendimento começa no Telegram e é orquestrado pelo workflow do n8n.

1. O usuário envia uma mensagem para o bot.
2. O n8n identifica o usuário e recupera seu estado de sessão.
3. O workflow determina qual etapa do atendimento deve ser executada.
4. Para operações estruturadas, o n8n consulta ou altera informações através da API backend.
5. O estado da conversa é atualizado.
6. A resposta é enviada novamente pelo Telegram.

Quando a mensagem não corresponde ao fluxo conhecido, acontece o **agent handoff** para o chatbot baseado em Gemini.

Nesse caso, o backend fornece ao modelo o contexto necessário sobre o cardápio e devolve a resposta para que o n8n continue a interação com o usuário.`,
      },

      {
        id: "pedeai-architecture",
        type: "architecture",
        content: `O projeto conecta diferentes serviços especializados:

\`\`\`
                    Telegram
                       │
                       ▼
                      n8n
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
      PostgreSQL    Backend       Gemini
          │            │
          │            ▼
          │          Redis
          │
          ▼
      Dados dos pedidos
\`\`\`

### Backend

O backend utiliza uma arquitetura em camadas:

\`\`\`
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
PostgreSQL
\`\`\`

### n8n

O n8n concentra a lógica de automação do chatbot, incluindo:

- recebimento das mensagens;
- gerenciamento do fluxo;
- consulta de sessão;
- menus dinâmicos;
- chamadas para a API;
- notificações;
- agent handoff.

### Redis

O Redis é utilizado para:

- cache do cardápio;
- histórico recente de conversas com o Gemini;
- TTL das sessões;
- rate limiting.

O projeto também possui invalidação do cache do cardápio quando os produtos são alterados.`,
      },

      {
        id: "pedeai-features",
        type: "features",
        content: `- **Catálogo dinâmico** baseado nos dados do backend.
- **Menus interativos** através do Telegram.
- **Carrinho e criação de pedidos**.
- **Máquina de estados** para controlar o fluxo de atendimento.
- **Sessões persistidas** no PostgreSQL.
- **Cache de cardápio** com Redis.
- **Histórico de conversa** com TTL.
- **Rate limiting** por usuário.
- **Notificações de mudança de status** através de webhooks.
- **Assistente Gemini** para perguntas em linguagem natural.
- **Agent handoff** entre fluxo determinístico e IA.
- **Documentação REST** com Swagger.
- **Ambiente completo** executado com Docker Compose.`,
      },

      {
        id: "pedeai-decisions",
        type: "decisions",
        content: `### n8n para orquestração

A utilização do n8n permite concentrar a lógica de automação em workflows visuais, mantendo o backend responsável pelas regras e operações de dados da aplicação.

### Fluxo determinístico + IA

O sistema não delega todo o atendimento para o modelo de linguagem.

As etapas previsíveis, como navegação do cardápio e fechamento do pedido, continuam sendo controladas por estados definidos.

O Gemini entra quando o usuário faz perguntas livres que precisam de interpretação de linguagem natural.

### Redis para cache

O cardápio é consultado frequentemente durante as conversas. O cache reduz consultas repetidas ao banco e possui invalidação quando os produtos são modificados.

### Agent handoff

A separação entre automação e IA permite que cada abordagem seja utilizada no tipo de problema em que ela é mais adequada.`,
      },

      {
        id: "pedeai-screenshots",
        type: "screenshots",
        content: "Visual do fluxo de atendimento automatizado do PedeAi.",
        images: ["https://i.imgur.com/FiRIJcS.png"],
      },

      {
        id: "pedeai-learnings",
        type: "learnings",
        content: `O PedeAi reúne vários conceitos em um único fluxo de aplicação.

O projeto permitiu aprofundar:

- automação de workflows com **n8n**;
- integração entre serviços independentes;
- modelagem de máquinas de estados;
- uso de Redis para cache e sessões;
- invalidação de cache;
- integração de modelos de linguagem com aplicações reais;
- processamento de linguagem natural;
- agent handoff entre lógica determinística e LLM;
- webhooks;
- infraestrutura com Docker Compose.`,
      },
    ],
  },

  // ============================================================
  // AGENDAIA
  // ============================================================

  {
    id: "agendaia",
    slug: "agendaia",
    name: "AgendaIA",
    summary:
      "Bot de agenda para Telegram que interpreta comandos em linguagem natural com Gemini e executa operações no Google Calendar.",
    highlights: [
      "Processamento de linguagem natural com Gemini",
      "Integração com Google Calendar",
      "Autenticação OAuth2",
      "Saída estruturada validada com Zod",
      "Criação, consulta e cancelamento de eventos",
      "Detecção de conflitos antes do agendamento",
      "Interface baseada em Telegram",
    ],
    technologies: resolveTech([
      "git",
      "github",
      "nodejs",
      "typescript",
      "gemini",
      "telegram",
      "zod",
      "googlecalendar",
      "googleapis",
      "datefns",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/AgendaIA",
    featured: true,
    ranking: 75,

    sections: [
      {
        id: "agendaia-overview",
        type: "overview",
        content: `O **AgendaIA** é um bot para Telegram desenvolvido como um estudo de integração entre **inteligência artificial, processamento de linguagem natural e APIs externas**.

Em vez de exigir comandos rígidos, o usuário pode enviar mensagens em linguagem natural, como:

> "agende uma reunião amanhã às 17h"

O sistema interpreta a intenção da mensagem e transforma o pedido em uma estrutura que pode ser processada pela integração com o Google Calendar.`,
      },

      {
        id: "agendaia-how-it-works",
        type: "how-it-works",
        content: `O fluxo começa com uma mensagem enviada pelo usuário no Telegram.

1. O bot recebe a mensagem através do Telegram.
2. A mensagem é enviada ao **Gemini 2.5 Flash**.
3. O modelo identifica a intenção da solicitação.
4. A resposta do modelo é estruturada em campos como ação, data, horário, título e duração.
5. O resultado é validado através de **Zod**.
6. A aplicação verifica conflitos no Google Calendar quando necessário.
7. A operação correspondente é executada através da API do Google Calendar.
8. O bot retorna o resultado ao usuário.

As intenções suportadas incluem criação, consulta e cancelamento de reuniões.`,
      },

      {
        id: "agendaia-architecture",
        type: "architecture",
        content: `A aplicação é organizada em módulos com responsabilidades específicas:

\`\`\`
Telegram
   │
   ▼
Bot
   │
   ▼
Gemini
   │
   ▼
Intent estruturada
   │
   ▼
Zod
   │
   ▼
Google Calendar
\`\`\`

### Bot

Responsável por receber mensagens, direcioná-las para o processamento e enviar as respostas ao usuário.

### IA

O módulo de IA utiliza o Gemini para transformar linguagem natural em uma intenção estruturada.

### Validação

O resultado produzido pelo modelo passa por um schema Zod antes de ser utilizado pela aplicação.

### Google Calendar

A integração utiliza OAuth2 e a API do Google Calendar para consultar, criar e cancelar eventos, incluindo verificação de disponibilidade antes de novos agendamentos.`,
      },

      {
        id: "agendaia-features",
        type: "features",
        content: `- **Criação de reuniões** através de linguagem natural.
- **Consulta de compromissos** de um determinado dia.
- **Cancelamento de reuniões** por data e horário.
- **Detecção de conflitos** antes de criar eventos.
- **Interpretação de intenções** através do Gemini.
- **Saída estruturada** validada com Zod.
- **Integração OAuth2** com o Google Calendar.
- **Interface conversacional** através do Telegram.`,
      },

      {
        id: "agendaia-decisions",
        type: "decisions",
        content: `### Linguagem natural em vez de comandos rígidos

O usuário não precisa conhecer uma sintaxe específica para interagir com o bot. A aplicação recebe mensagens comuns e utiliza o modelo para identificar a intenção.

### Saída estruturada

Em vez de utilizar a resposta textual do modelo diretamente, a aplicação trabalha com uma estrutura contendo a ação e os dados necessários para executar a operação.

Isso permite separar a interpretação feita pela IA da lógica responsável por alterar o calendário.

### Zod como camada de validação

A resposta gerada pelo modelo é validada antes de chegar à integração com o Google Calendar.

### Verificação de conflitos

A criação de eventos passa por uma verificação de disponibilidade antes da confirmação do agendamento.`,
      },

      {
        id: "agendaia-learnings",
        type: "learnings",
        content: `O AgendaIA funciona principalmente como um estudo de caso sobre integração de IA em uma aplicação tradicional.

Os principais conceitos explorados foram:

- processamento de linguagem natural;
- structured output;
- validação de respostas de modelos;
- integração com APIs externas;
- OAuth2;
- interpretação de intenções;
- transformação de linguagem natural em operações determinísticas;
- integração de um LLM com uma interface conversacional.`,
      },
    ],
  },

  // ============================================================
  // DIALOGO
  // ============================================================

  {
    id: "dialogo",
    slug: "dialogo",
    name: "DialoGO",
    summary:
      "Plataforma de chat em tempo real construída com React, Node.js, Express, PostgreSQL e Socket.IO, explorando comunicação via WebSockets, autenticação e arquitetura fullstack em camadas.",
    coverImage:
      "https://github.com/user-attachments/assets/fe3386d4-5ebe-4bc8-adfa-58f7f1234167",
    technologies: resolveTech([
      "git",
      "github",
      "nodejs",
      "express",
      "typescript",
      "react",
      "vite",
      "tailwindcss",
      "postgresql",
      "socketio",
      "jwt",
      "bcrypt",
      "eslint",
      "reactrouter",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/DialoGO-Frontend",
    featured: true,
    ranking: 75,
    highlights: [
      "Comunicação em tempo real com Socket.IO",
      "Arquitetura fullstack com frontend e backend separados",
      "Autenticação JWT também aplicada às conexões Socket.IO",
      "Chats organizados em rooms",
      "Arquitetura backend Controller → Service → Repository",
      "PostgreSQL para usuários, chats, membros e mensagens",
      "Interface responsiva para gerenciamento de chats",
      "Busca, filtros e ordenação de salas",
    ],
    sections: [
      {
        id: "dialogo-overview",
        type: "overview",
        content: `
  O DialoGO é uma plataforma completa de chat em tempo real desenvolvida para estudar profundamente WebSockets e comunicação bidirecional entre cliente e servidor.

  O projeto reúne um frontend React + TypeScript e um backend Node.js + Express, utilizando Socket.IO para comunicação em tempo real e PostgreSQL para persistência dos dados.

  O projeto foi desenvolvido como uma exploração prática de arquitetura fullstack, autenticação e aplicações que precisam atualizar informações sem depender de refresh manual.
        `,
      },
      {
        id: "dialogo-architecture",
        type: "architecture",
        content: `
  O projeto é dividido em frontend e backend, mas funciona como uma única aplicação.

  O frontend utiliza React, Vite, TypeScript e Tailwind CSS, com Context API para gerenciamento de estado global.

  O backend utiliza Node.js e Express e segue uma arquitetura em três camadas:

  Controller
  → Service
  → Repository

  Os controllers lidam com HTTP, os services concentram regras de negócio e os repositories são responsáveis pelo acesso ao PostgreSQL.

  A comunicação em tempo real utiliza Socket.IO.
        `,
      },
      {
        id: "dialogo-how-it-works",
        type: "how-it-works",
        content: `
  Após o login, o frontend armazena a sessão do usuário e utiliza JWT nas requisições protegidas.

  A conexão Socket.IO também é autenticada através do JWT.

  Cada chat funciona como uma socket room. Quando usuários entram em uma sala, o servidor consegue transmitir mensagens apenas para os participantes daquele chat.

  Quando uma mensagem é enviada, o backend processa a comunicação através do Socket.IO e transmite o novo conteúdo aos usuários conectados à sala.
        `,
      },
      {
        id: "dialogo-features",
        type: "features",
        content: `
  O DialoGO possui:

  - Login e cadastro
  - Autenticação JWT
  - Proteção de rotas
  - Autenticação de sockets
  - Criação de chats
  - Exclusão de chats
  - Entrada e saída de chats
  - Chats protegidos por senha
  - Identificação do proprietário
  - Lista de membros
  - Mensagens em tempo real
  - Auto-scroll
  - Busca de chats
  - Ordenação
  - Filtro por quantidade de membros
  - Filtro por proteção de senha
  - Interface responsiva
  - Modais reutilizáveis
  - Estados de loading e erro
        `,
      },
      {
        id: "dialogo-decisions",
        type: "decisions",
        content: `
  Socket.IO foi utilizado para abstrair a comunicação em tempo real e permitir trabalhar com conexões autenticadas, rooms e broadcasting.

  No backend, a divisão Controller → Service → Repository foi utilizada para separar responsabilidades e manter as regras de negócio afastadas da camada HTTP.

  No frontend, Context API foi utilizada para centralizar autenticação e conexão Socket.IO através de providers dedicados.
        `,
      },
      {
        id: "dialogo-screenshots",
        type: "screenshots",
        content: "Interface da plataforma de chat em tempo real.",
        images: [
          "https://github.com/user-attachments/assets/fe3386d4-5ebe-4bc8-adfa-58f7f1234167",
          "https://github.com/user-attachments/assets/947693ca-da98-4f6e-8957-a43f328e9f9e9f",
          "https://github.com/user-attachments/assets/bfd731cf-2ed8-4a61-b430-4c567eb59120",
        ],
      },
      {
        id: "dialogo-learnings",
        type: "learnings",
        content: `
  O principal objetivo do DialoGO foi compreender como aplicações em tempo real funcionam além do modelo tradicional de requisição e resposta HTTP.

  O projeto aprofundou conceitos de WebSockets, rooms, broadcasting, autenticação de conexões, gerenciamento de estado e arquitetura em camadas.

  A experiência também serviu como aplicação prática dos conceitos de sockets estudados anteriormente no TalkShell.
        `,
      },
    ],
  },

  // ============================================================
  // ME CONTE UMA HISTÓRIA
  // ============================================================

  {
    id: "me-conte-uma-historia",
    slug: "me-conte-uma-historia",
    name: "Me Conte uma História",
    summary:
      "Jogo educativo web que apresenta lendas do folclore brasileiro através de um mapa interativo, cenas ilustradas e diálogos.",
    highlights: [
      "Jogo educativo voltado ao público infantil",
      "Mapa interativo com diferentes regiões",
      "Narrativas baseadas no folclore brasileiro",
      "Sistema de diálogos e cenas sequenciais",
      "Navegação por mouse e teclado",
      "Interface responsiva",
      "Projeto estático executado diretamente no navegador",
    ],
    technologies: resolveTech([
      "git",
      "github",
      "javascript",
      "html5",
      "css3",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/MeConteUmaHistoria",
    liveUrl: "https://davidericson00.github.io/MeConteUmaHistoria/",
    featured: false,
    ranking: 50,

    sections: [
      {
        id: "me-conte-uma-historia-overview",
        type: "overview",
        content: `**Me Conte uma História** é um jogo educativo interativo criado em grupo durante o ensino médio.

O projeto apresenta lendas do folclore brasileiro através de uma experiência inspirada em jogos **point-and-click**, utilizando um mapa interativo para permitir que o jogador escolha diferentes histórias.

O projeto foi pensado para aproximar crianças e jovens da cultura popular brasileira através de uma experiência visual e interativa.`,
      },

      {
        id: "me-conte-uma-historia-how-it-works",
        type: "how-it-works",
        content: `A experiência começa em um mapa que apresenta diferentes pontos de interação.

Ao selecionar uma região, o jogador é direcionado para a narrativa correspondente.

Cada história é composta por uma sequência de cenas ilustradas e diálogos.

O avanço pode ser realizado através do botão visual da interface ou utilizando as teclas **Espaço** e **Enter**.

O fluxo é controlado por uma lógica JavaScript responsável por trocar as cenas, carregar as imagens correspondentes e avançar os diálogos.`,
      },

      {
        id: "me-conte-uma-historia-features",
        type: "features",
        content: `- **Mapa interativo** para seleção das histórias.
- **Narrativas ilustradas** com cenas sequenciais.
- **Sistema de diálogos** com apresentação visual personalizada.
- **Navegação por teclado** através de Espaço e Enter.
- **Interface responsiva** para diferentes tamanhos de tela.
- **Três lendas disponíveis**:
  - Cabeça de Cuia;
  - Papa-Figo;
  - Pedra da Glória.`,
      },

      {
        id: "me-conte-uma-historia-architecture",
        type: "architecture",
        content: `O projeto é totalmente estático e foi construído utilizando tecnologias web fundamentais.

### HTML

Responsável pelas páginas do mapa e das histórias.

### CSS

Controla a identidade visual, transições, efeitos de interação, fontes e adaptação para diferentes tamanhos de tela.

### JavaScript

O arquivo \`story.js\` concentra a lógica responsável pelo fluxo das narrativas, incluindo:

- transição entre cenas;
- carregamento de imagens;
- avanço dos diálogos;
- controle da interação do jogador.

A estrutura das histórias é organizada em diretórios independentes, enquanto os recursos compartilhados ficam na pasta \`assets\`.`,
      },

      {
        id: "me-conte-uma-historia-custom",
        type: "custom",
        content: `### Lendas apresentadas

**Cabeça de Cuia**

A história de Crispim, personagem que, após desobedecer e maltratar sua mãe, recebe uma maldição e se transforma em uma criatura com a cabeça em formato de cuia.

**Papa-Figo**

Uma lenda popular dos interiores de Pernambuco apresentada através da lembrança de uma senhora sobre sua juventude.

**Pedra da Glória**

Uma narrativa relacionada a uma rocha em uma cachoeira lendária, envolvendo rituais antigos e seres do imaginário indígena.

O projeto utiliza essas histórias como ponto de partida para apresentar elementos do folclore brasileiro de maneira interativa.`,
      },

      {
        id: "me-conte-uma-historia-screenshots",
        type: "screenshots",
        content: "Capturas de tela do jogo.",
        images: [
          "https://i.imgur.com/D9zIUZr.png",
          "https://i.imgur.com/nXiFBYl.png",
        ],
      },

      {
        id: "me-conte-uma-historia-learnings",
        type: "learnings",
        content: `Por ter sido desenvolvido durante o ensino médio e em grupo, o projeto representa uma experiência inicial de desenvolvimento de aplicações web com uma proposta diferente de sistemas tradicionais.

Além da implementação técnica, o projeto envolveu a transformação de conteúdo cultural em uma experiência interativa e educativa.

O resultado combina desenvolvimento web, narrativa, ilustração e interação com o usuário em uma aplicação executada diretamente no navegador.`,
      },
    ],
  },

  // ============================================================
  // TEAMUP
  // ============================================================

  {
    id: "teamup",
    slug: "teamup",
    name: "TeamUP!",
    summary:
      "Plataforma fullstack de gerenciamento de projetos e atividades, desenvolvida para explorar o ecossistema Laravel com autenticação, controle de acesso, relacionamentos Eloquent e tarefas agendadas.",
    coverImage: "https://i.imgur.com/mmkglfF.png",
    technologies: resolveTech([
      "git",
      "github",
      "laravel",
      "php",
      "react",
      "typescript",
      "vite",
      "tailwindcss",
      "axios",
      "zustand",
      "mysql",
      "reactrouter",
      "sanctum"
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/TeamUP",
    featured: false,
    ranking: 60,
    highlights: [
      "API REST estruturada com Laravel 12",
      "Autenticação baseada em tokens com Laravel Sanctum",
      "Controle de acesso por função com middleware",
      "Relacionamentos Eloquent com eager loading",
      "Agendamento automático para expiração de atividades",
      "SPA em React + TypeScript integrada à API",
      "Gerenciamento de projetos, membros e atividades",
    ],
    sections: [
      {
        id: "teamup-overview",
        type: "overview",
        content: `
  O TeamUP é uma plataforma fullstack de gerenciamento de projetos e atividades criada para aprofundar o estudo do ecossistema Laravel.

  O projeto combina uma API REST desenvolvida com Laravel 12 e um frontend em React + TypeScript, permitindo trabalhar desde autenticação e autorização até modelagem relacional, filtros e tarefas agendadas.

  O backend utiliza convenções e recursos nativos do Laravel, enquanto o frontend funciona como uma SPA consumindo a API através do Axios.
        `,
      },
      {
        id: "teamup-architecture",
        type: "architecture",
        content: `
  A aplicação é dividida entre um backend Laravel e um frontend React.

  No backend, a API utiliza controllers, middleware, models Eloquent, Form Requests e comandos agendados. O controle de acesso é aplicado através de middleware de função.

  No frontend, a aplicação é organizada em páginas, componentes, serviços, tipos, rotas protegidas e um store persistido de autenticação com Zustand.

  O projeto também utiliza uma estrutura relacional envolvendo usuários, projetos, membros e atividades.
        `,
      },
      {
        id: "teamup-how-it-works",
        type: "how-it-works",
        content: `
  O usuário realiza autenticação através da API Laravel e recebe um token do Sanctum.

  As requisições protegidas enviam esse token no header Authorization. O backend verifica a autenticação e, quando necessário, aplica as regras de acesso por função.

  Projetos podem possuir membros e atividades atribuídas aos usuários. Cada projeto também possui um token próprio utilizado para permitir que outros usuários entrem nele.

  As atividades possuem diferentes estados e podem ser filtradas por status, responsável e situação do projeto.
        `,
      },
      {
        id: "teamup-features",
        type: "features",
        content: `
  Entre as principais funcionalidades estão:

  - Cadastro e login de usuários
  - Controle de acesso por função
  - Criação e gerenciamento de projetos
  - Entrada em projetos através de token
  - Gerenciamento de membros
  - Criação e atribuição de atividades
  - Filtros de atividades
  - Alteração de status
  - Conclusão e desatribuição de atividades
  - Expiração automática de atividades atrasadas
  - Dashboard com estatísticas do usuário
        `,
      },
      {
        id: "teamup-decisions",
        type: "decisions",
        content: `
  O projeto foi estruturado principalmente para explorar recursos importantes do Laravel.

  Sanctum foi utilizado para autenticação baseada em tokens, enquanto o Eloquent concentra o relacionamento entre usuários, projetos e atividades.

  O eager loading é utilizado nos endpoints relevantes para carregar relacionamentos necessários de forma mais eficiente.

  A separação entre controllers, services do frontend, models e middleware também ajudou a manter as responsabilidades organizadas.
        `,
      },
      {
        id: "teamup-screenshots",
        type: "screenshots",
        content: "Interface da plataforma de gerenciamento de projetos e atividades.",
        images: [
          "https://i.imgur.com/mmkglfF.png",
          "https://i.imgur.com/69fBJlY.png",
          "https://i.imgur.com/Ro8xsxb.png",
          "https://i.imgur.com/3vqAZYM.png",
        ],
      },
      {
        id: "teamup-learnings",
        type: "learnings",
        content: `
  O principal objetivo do projeto foi aprofundar o conhecimento em Laravel, especialmente Sanctum, Eloquent, middleware, Form Requests, controllers e Scheduler.

  Também permitiu trabalhar com modelagem relacional, tabelas pivot, eager loading, filtros e integração entre uma API Laravel e uma aplicação React.
        `,
      },
    ],
  },

  // ============================================================
  // LOCALFAQ AI
  // ============================================================

  {
    id: "localfaq-ai",
    slug: "localfaq-ai",
    name: "LocalFAQ AI",
    summary:
      "Chatbot de FAQ para Telegram construído com n8n e Ollama, explorando integração de LLM local, contexto empresarial e workflows automatizados sem inferência em nuvem.",
    coverImage: "https://i.imgur.com/oRnQ0Fo.png",
    technologies: resolveTech([
      "git",
      "github",
      "n8n",
      "ollama",
      "docker",
      "ngrok",
      "telegram",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/LocalFAQ-AI",
    featured: false,
    ranking: 35,
    highlights: [
      "LLM local executada através do Ollama",
      "Modelo phi3:mini",
      "Workflow automatizado com n8n",
      "Integração com Telegram",
      "Contexto empresarial injetado no prompt",
      "Fallback para respostas inválidas ou indisponíveis",
      "Execução local sem custos de inferência em nuvem",
    ],
    sections: [
      {
        id: "localfaq-overview",
        type: "overview",
        content: `
  O LocalFAQ AI é um chatbot de FAQ para Telegram criado para explorar integração de modelos de linguagem locais com workflows automatizados.

  A aplicação utiliza n8n para orquestrar o fluxo, Ollama para executar o modelo phi3:mini localmente e Telegram como interface de interação.
        `,
      },
      {
        id: "localfaq-how-it-works",
        type: "how-it-works",
        content: `
  O usuário envia uma mensagem pelo Telegram.

  O n8n recebe a mensagem através de um webhook e verifica se ela é um texto.

  Em seguida, o workflow injeta informações estruturadas sobre a empresa no contexto enviado ao Ollama.

  O modelo phi3:mini gera a resposta utilizando esse contexto.

  Caso o modelo não consiga produzir uma resposta válida, o workflow envia uma mensagem de fallback ao usuário.
        `,
      },
      {
        id: "localfaq-architecture",
        type: "architecture",
        content: `
  O fluxo principal é:

  Telegram
  → n8n Webhook
  → validação da mensagem
  → Company Context
  → Ollama
  → phi3:mini
  → validação da resposta
  → Telegram

  O conhecimento da empresa é inserido diretamente no prompt através do node Company Context, utilizando uma abordagem de prompt-stuffing em vez de banco vetorial.
        `,
      },
      {
        id: "localfaq-features",
        type: "features",
        content: `
  O bot possui:

  - Atendimento através do Telegram
  - Contexto customizável da empresa
  - Respostas baseadas no contexto fornecido
  - Limite de tamanho das respostas
  - Fallback para informações indisponíveis
  - Tratamento de mensagens que não são texto
  - Execução local do modelo
  - Workflow totalmente orquestrado pelo n8n
        `,
      },
      {
        id: "localfaq-decisions",
        type: "decisions",
        content: `
  O projeto utiliza phi3:mini por ser um modelo pequeno, com requisitos de hardware mais baixos e inferência local.

  O contexto empresarial é colocado diretamente no prompt em vez de utilizar uma infraestrutura de embeddings ou banco vetorial.

  Essa escolha mantém a arquitetura simples e adequada ao objetivo de estudar integração de IA local com automação.
        `,
      },
      {
        id: "localfaq-screenshots",
        type: "screenshots",
        content: "Workflow principal desenvolvido no n8n.",
        images: ["https://i.imgur.com/oRnQ0Fo.png"],
      },
      {
        id: "localfaq-learnings",
        type: "learnings",
        content: `
  O projeto foi desenvolvido principalmente para aprender a integrar LLMs locais com ferramentas de automação.

  A experiência envolveu Ollama, configuração de modelos locais, construção de prompts com contexto empresarial, tratamento de respostas e integração entre n8n, Telegram e um servidor local.
        `,
      },
    ],
  },

  // ============================================================
  // DISCORD TIERMAKER
  // ============================================================

  {
    id: "discord-tiermaker",
    slug: "discord-tiermaker",
    name: "Discord TierMaker",
    summary:
      "Bot para Discord que permite criar enquetes diretamente dentro de servidores utilizando comandos slash e o sistema nativo de polls da plataforma.",
    technologies: resolveTech([
      "git",
      "github",
      "nodejs",
      "discordjs",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/Discord-TierMaker",
    featured: false,
    ranking: 40,
    highlights: [
      "Comandos slash integrados ao Discord",
      "Criação de enquetes diretamente no servidor",
      "Até 10 opções por enquete",
      "Duração configurável",
      "Suporte a emojis nas opções",
      "Uso do formato nativo de polls do Discord",
    ],
    sections: [
      {
        id: "discord-tiermaker-overview",
        type: "overview",
        content: `
  O Discord TierMaker é um bot para Discord criado para permitir que usuários criem enquetes diretamente dentro de um servidor através de comandos slash.

  O projeto explora a criação de um bot funcional integrado à plataforma Discord, com parâmetros configuráveis para título, opções e duração da votação.
        `,
      },
      {
        id: "discord-tiermaker-how-it-works",
        type: "how-it-works",
        content: `
  O usuário executa o comando /poll dentro do servidor e fornece o título, as opções e a duração da enquete.

  O bot interpreta os parâmetros recebidos e cria a enquete utilizando o formato nativo de polls do Discord.
        `,
      },
      {
        id: "discord-tiermaker-features",
        type: "features",
        content: `
  - Comando /poll
  - Título personalizado
  - Até 10 opções
  - Emojis nas opções
  - Duração configurável em horas
  - Polls nativos do Discord
  - Integração direta com servidores Discord
        `,
      },
      {
        id: "discord-tiermaker-decisions",
        type: "decisions",
        content: `
  A proposta foi manter o bot pequeno e focado em uma funcionalidade específica.

  Em vez de criar uma interface própria, o projeto utiliza a própria plataforma Discord como interface para criação e participação nas enquetes.
        `,
      },
      {
        id: "discord-tiermaker-learnings",
        type: "learnings",
        content: `
  O projeto permitiu explorar o desenvolvimento de bots para Discord, comandos slash e integração de uma aplicação externa com uma plataforma de comunicação já utilizada por comunidades e equipes.
        `,
      },
    ],
  },

  // ============================================================
  // DAVIDLOG
  // ============================================================

  {
    id: "davidlog",
    slug: "davidlog",
    name: "DavidLog",
    summary:
      "Blog minimalista desenvolvido em PHP para explorar fundamentos da linguagem, deploy automatizado, cache de assets e publicação em hospedagem compartilhada.",
    technologies: resolveTech([
      "git",
      "github",
      "php",
      "html5",
      "css3",
      "githubactions",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/DavidLog",
    liveUrl: "https://davidericson00.page.gd",
    featured: false,
    ranking: 30,
    highlights: [
      "Blog desenvolvido sem banco de dados",
      "Implementação em PHP",
      "Deploy automatizado com GitHub Actions",
      "Hospedagem compartilhada",
      "Cache de assets estáticos",
      "Aplicação simples e leve",
    ],
    sections: [
      {
        id: "davidlog-overview",
        type: "overview",
        content: `
  O DavidLog é um blog simples desenvolvido em PHP para estudar os fundamentos da linguagem e colocar em prática conceitos básicos de desenvolvimento web.

  A aplicação não utiliza banco de dados. O foco está na simplicidade da estrutura, organização das páginas, deploy e funcionamento em uma hospedagem compartilhada.
        `,
      },
      {
        id: "davidlog-architecture",
        type: "architecture",
        content: `
  O projeto possui uma estrutura simples baseada em PHP, HTML e CSS.

  Não existe uma camada de banco de dados. O conteúdo é organizado diretamente na aplicação, mantendo a implementação pequena e fácil de compreender.

  O deploy é automatizado através do GitHub Actions e realizado por FTP para a hospedagem.
        `,
      },
      {
        id: "davidlog-features",
        type: "features",
        content: `
  - Sistema simples de blog
  - Organização de posts
  - Assets estáticos
  - Deploy automático
  - Cache-friendly assets
  - Hospedagem compartilhada
  - Implementação sem banco de dados
        `,
      },
      {
        id: "davidlog-process",
        type: "process",
        content: `
  Cada commit realizado na branch main pode disparar o workflow de deploy.

  O GitHub Actions realiza a publicação dos arquivos através de FTP na hospedagem utilizada pelo projeto.
        `,
      },
      {
        id: "davidlog-learnings",
        type: "learnings",
        content: `
  O DavidLog foi desenvolvido principalmente para aprender PHP e entender como estruturar uma aplicação web pequena.

  Também serviu para estudar automação de deploy, cache de assets, hospedagem compartilhada e algumas práticas básicas de segurança web.
        `,
      },
    ],
  },

  // ============================================================
  // TALKSHELL
  // ============================================================

  {
    id: "talkshell",
    slug: "talkshell",
    name: "TalkShell",
    summary:
      "Aplicação de chat via terminal desenvolvida em Python para estudar sockets TCP, arquitetura cliente-servidor, comunicação em tempo real e múltiplos clientes com threads.",
    technologies: resolveTech([
      "git",
      "github",
      "python",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/TalkShell",
    featured: false,
    ranking: 25,
    highlights: [
      "Comunicação cliente-servidor via TCP",
      "Sockets utilizando apenas recursos nativos do Python",
      "Múltiplos clientes simultâneos",
      "Broadcast de mensagens em tempo real",
      "Processamento concorrente com threads",
      "Interface totalmente baseada em terminal",
      "Modo SEND e VIEW",
    ],
    sections: [
      {
        id: "talkshell-overview",
        type: "overview",
        content: `
  O TalkShell é uma aplicação de chat executada inteiramente pelo terminal, criada para estudar os fundamentos de comunicação através de sockets.

  O projeto implementa um servidor TCP capaz de receber múltiplos clientes e transmitir mensagens entre eles utilizando apenas módulos nativos do Python.
        `,
      },
      {
        id: "talkshell-architecture",
        type: "architecture",
        content: `
  A aplicação possui duas partes principais:

  server.py
  → aceita conexões
  → gerencia clientes
  → recebe mensagens
  → realiza o broadcast

  client.py
  → conecta ao servidor
  → envia mensagens
  → recebe mensagens
  → possui modos SEND e VIEW

  Threads são utilizadas no servidor para lidar com múltiplos clientes simultaneamente.
        `,
      },
      {
        id: "talkshell-how-it-works",
        type: "how-it-works",
        content: `
  O servidor é iniciado em uma porta TCP e fica aguardando conexões.

  Cada cliente estabelece uma conexão com o servidor e recebe um identificador de usuário.

  Quando um cliente envia uma mensagem, o servidor realiza o broadcast para os clientes conectados.

  O modo SEND permite enviar e receber mensagens, enquanto o modo VIEW funciona somente para leitura.
        `,
      },
      {
        id: "talkshell-features",
        type: "features",
        content: `
  - Chat em tempo real via terminal
  - Múltiplos clientes
  - Identificação por usuário
  - Broadcast de mensagens
  - Modo SEND
  - Modo VIEW
  - Comandos básicos de desconexão
  - Comunicação TCP
        `,
      },
      {
        id: "talkshell-decisions",
        type: "decisions",
        content: `
  O projeto utiliza somente os módulos socket e threading do Python para manter o foco nos conceitos fundamentais de redes.

  Não existe interface gráfica nem dependências externas. Toda a interação acontece através do terminal.
        `,
      },
      {
        id: "talkshell-learnings",
        type: "learnings",
        content: `
  O TalkShell foi criado especificamente para estudar sockets antes da implementação de comunicação em tempo real no DialoGO.

  O projeto permitiu compreender a comunicação cliente-servidor, sockets TCP, threads, broadcast e a criação de um protocolo simples de comunicação.
        `,
      },
    ],
  },

  // ============================================================
  // STICKIT
  // ============================================================

  {
    id: "stickit",
    slug: "stickit",
    name: "StickIt!",
    summary:
      "Aplicação de notas adesivas com frontend em Next.js e backend em Spring Boot, combinando uma interface moderna com uma API REST estruturada em camadas.",
    coverImage: "https://i.imgur.com/H2ajzWa.png",
    technologies: resolveTech([
      "git",
      "github",
      "nextjs",
      "react",
      "typescript",
      "tailwindcss",
      "java",
      "springboot",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/StickIt-Frontend",
    featured: false,
    ranking: 55,
    highlights: [
      "Frontend em Next.js com App Router",
      "Backend REST desenvolvido com Spring Boot",
      "Arquitetura Controller → Service → Repository",
      "DTOs para separar domínio e contratos da API",
      "Validação com Jakarta Validation",
      "Tratamento global de exceções",
      "Persistência com Spring Data JPA e Hibernate",
      "Interface responsiva de notas adesivas",
    ],
    sections: [
      {
        id: "stickit-overview",
        type: "overview",
        content: `
  O StickIt é uma aplicação web de notas adesivas criada para estudar Java e Spring Boot através de uma aplicação fullstack funcional.

  O frontend utiliza Next.js, React, TypeScript e Tailwind CSS, enquanto o backend fornece uma API REST construída com Spring Boot.

  O resultado é uma aplicação simples, mas que permite explorar conceitos importantes de arquitetura backend e integração entre frontend e API.
        `,
      },
      {
        id: "stickit-architecture",
        type: "architecture",
        content: `
  O projeto é dividido entre frontend e backend.

  O frontend utiliza Next.js com App Router e possui componentes reutilizáveis, serviços para comunicação com a API e tipos específicos para as entidades.

  O backend utiliza uma arquitetura em camadas:

  Controller
  → Service
  → Repository

  Os controllers lidam com HTTP, os services concentram a lógica de negócio e os repositories são responsáveis pelo acesso aos dados através do Spring Data JPA.
        `,
      },
      {
        id: "stickit-how-it-works",
        type: "how-it-works",
        content: `
  O frontend envia requisições HTTP para a API Spring Boot.

  A API recebe os dados através de DTOs, executa as validações necessárias e encaminha a operação para a camada de serviço.

  O service executa as regras da aplicação e utiliza o repository para persistir ou consultar as notas.

  As respostas são retornadas através de DTOs, evitando expor diretamente as entidades do domínio.
        `,
      },
      {
        id: "stickit-features",
        type: "features",
        content: `
  - Criação de notas
  - Escolha de cores
  - Edição através de modal
  - Exclusão de notas
  - Persistência através de API REST
  - Atualizações da interface sem reload
  - Layout responsivo
  - Organização visual por cores
  - Interface simples e intuitiva
        `,
      },
      {
        id: "stickit-decisions",
        type: "decisions",
        content: `
  O backend foi estruturado com separação clara de responsabilidades.

  DTOs são utilizados para controlar os contratos externos da API, evitando expor diretamente as entidades.

  A validação utiliza Jakarta Validation e o tratamento de erros é centralizado através de @ControllerAdvice.

  Essa estrutura mantém os controllers menores e facilita a evolução da API.
        `,
      },
      {
        id: "stickit-screenshots",
        type: "screenshots",
        content: "Interface da aplicação de notas adesivas.",
        images: [
          "https://i.imgur.com/H2ajzWa.png",
          "https://i.imgur.com/zDTRXV9.png",
          "https://i.imgur.com/KB68jwg.png",
        ],
      },
      {
        id: "stickit-learnings",
        type: "learnings",
        content: `
  O StickIt foi desenvolvido para aprender Java e Spring Boot na prática.

  Foi o projeto utilizado para explorar uma arquitetura REST em camadas, Spring Data JPA, Hibernate, DTOs, validação, tratamento global de exceções e integração de uma API Java com um frontend moderno.

  Mesmo sendo uma aplicação relativamente simples, o projeto serviu como uma implementação prática de conceitos importantes do ecossistema Spring.
        `,
      },
    ],
  },

  // ============================================================
  // YOUTUBE CLI DOWNLOADER
  // ============================================================

  {
    id: "youtube-cli-downloader",
    slug: "youtube-cli-downloader",
    name: "YouTube CLI Downloader",
    summary:
      "Ferramenta de linha de comando para baixar vídeos e extrair áudios do YouTube, com suporte a playlists e diretórios personalizados.",
    technologies: resolveTech([
      "git",
      "github",
      "python",
      "ytdlp",
      "ffmpeg",
      "nodejs",
    ]),
    repositoryUrl:
      "https://github.com/DavidEricson00/yt-cli-downloader",
    featured: false,
    ranking: 48,
    sections: [
      {
        id: "overview",
        type: "overview",
        content:
          "Ferramenta CLI criada para resolver uma necessidade pessoal de download e organização de conteúdo do YouTube. O programa permite baixar vídeos em MP4, extrair áudio em MP3, trabalhar com playlists e escolher como os arquivos serão organizados no computador.",
      },
      {
        id: "how-it-works",
        type: "how-it-works",
        content:
          "O usuário escolhe o tipo de conteúdo que deseja baixar, informa a origem e define o diretório de destino. O projeto utiliza o yt-dlp para realizar o download e o FFmpeg para as etapas de conversão e processamento de mídia.",
      },
      {
        id: "features",
        type: "features",
        content:
          "- Download de vídeos em MP4\n- Extração de áudio em MP3\n- Suporte a playlists\n- Diretório de download personalizado\n- Pasta geral para downloads\n- Interface interativa no terminal\n- Versão em português",
      },
      {
        id: "architecture",
        type: "architecture",
        content:
          "A aplicação funciona como uma CLI em Python e delega o processamento de mídia para ferramentas especializadas. O yt-dlp é responsável pela obtenção do conteúdo e o FFmpeg entra nas operações de conversão e processamento dos arquivos.",
      },
      {
        id: "decisions",
        type: "decisions",
        content:
          "A escolha de utilizar yt-dlp e FFmpeg em vez de implementar diretamente o processamento de mídia mantém o projeto simples e aproveita ferramentas consolidadas para tarefas específicas.",
      },
      {
        id: "learnings",
        type: "learnings",
        content:
          "O projeto foi principalmente uma experiência prática com CLI, integração entre programas externos e automação de tarefas no computador. Também foi uma oportunidade de utilizar uma ferramenta de processamento de mídia bastante comum em aplicações que trabalham com conversão e manipulação de arquivos.",
      },
    ],
    highlights: [
      "Download de vídeos e playlists",
      "Extração de áudio em MP3",
      "Processamento de mídia com FFmpeg",
      "Diretórios de download configuráveis",
      "Ferramenta criada para uma necessidade real",
    ],
  },

  // ============================================================
  // CONTACTME
  // ============================================================

  {
    id: "contactme",
    slug: "contactme",
    name: "ContactME",
    summary:
      "Aplicação web de gerenciamento de contatos desenvolvida em PHP, com CRUD completo e persistência em MySQL.",
    coverImage: "https://i.imgur.com/tz7FABM.png",
    technologies: resolveTech([
      "git",
      "github",
      "php",
      "mysql",
      "bootstrap",
      "html5",
      "css3",
      "javascript",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/ContactME",
    featured: false,
    ranking: 20,
    sections: [
      {
        id: "overview",
        type: "overview",
        content:
          "ContactME foi meu primeiro projeto em PHP. A aplicação permite cadastrar e gerenciar contatos com informações como nome, telefone, e-mail e data de nascimento.",
      },
      {
        id: "features",
        type: "features",
        content:
          "- Cadastro de contatos\n- Listagem de contatos\n- Visualização de informações\n- Edição de registros\n- Exclusão de contatos\n- Interface responsiva com Bootstrap",
      },
      {
        id: "architecture",
        type: "architecture",
        content:
          "A aplicação utiliza PHP para a lógica do servidor e interação com o banco de dados MySQL, enquanto HTML, CSS, JavaScript e Bootstrap compõem a interface.",
      },
      {
        id: "screenshots",
        type: "screenshots",
        content: "",
        images: [
          "https://i.imgur.com/tz7FABM.png",
          "https://i.imgur.com/VynJ73V.png",
          "https://i.imgur.com/XNzid1d.png",
        ],
      },
      {
        id: "learnings",
        type: "learnings",
        content:
          "Foi um projeto inicial de estudo de PHP, seguindo um tutorial como base e realizando algumas alterações em relação ao projeto original. Serviu principalmente para compreender a estrutura de uma aplicação web tradicional com PHP, banco de dados e CRUD.",
      },
    ],
    highlights: [
      "Primeiro projeto em PHP",
      "CRUD completo",
      "Persistência em MySQL",
      "Interface responsiva com Bootstrap",
    ],
  },

  // ============================================================
  // JAVA USER SIGNUP 
  // ============================================================

  {
    id: "java-user-signup",
    slug: "java-user-signup",
    name: "Java User Signup",
    summary:
      "Aplicação de linha de comando em Java para cadastro e validação de usuários, com exceções personalizadas e persistência em arquivo.",
    technologies: resolveTech([
      "git",
      "github",
      "java",
    ]),
    repositoryUrl:
      "https://github.com/DavidEricson00/Java-User_Signup",
    featured: false,
    ranking: 8,
    sections: [
      {
        id: "overview",
        type: "overview",
        content:
          "Programa de linha de comando criado durante os estudos de Java para praticar validação de dados, tratamento de exceções e manipulação de arquivos locais.",
      },
      {
        id: "features",
        type: "features",
        content:
          "- Cadastro de usuários\n- Validação de nome, idade e e-mail\n- Exceções personalizadas\n- Listagem de usuários\n- Leitura de dados de arquivo\n- Salvamento de dados em arquivo",
      },
      {
        id: "learnings",
        type: "learnings",
        content:
          "O projeto foi desenvolvido principalmente como preparação para uma avaliação de Java. O foco esteve no uso de exceções personalizadas, validação de entradas e operações básicas com arquivos locais.",
      },
    ],
    highlights: [
      "Exceções personalizadas",
      "Validação de dados",
      "Leitura e escrita de arquivos",
      "Projeto de estudo de Java",
    ],
  },

  // ============================================================
  // WEB CALCULATOR
  // ============================================================

  {
    id: "web-calculator",
    slug: "web-calculator",
    name: "Web Calculator",
    summary:
      "Calculadora web desenvolvida com HTML, CSS e JavaScript para praticar interfaces dinâmicas e manipulação do DOM.",
    technologies: resolveTech([
      "git",
      "github",
      "html5",
      "css3",
      "javascript",
    ]),
    repositoryUrl:
      "https://github.com/DavidEricson00/Web-Calculator",
    liveUrl:
      "https://davidericson00.github.io/Web-Calculator/",
    featured: false,
    ranking: 12,
    sections: [
      {
        id: "overview",
        type: "overview",
        content:
          "Calculadora web criada no início dos meus estudos de desenvolvimento web, quando ainda estava aprendendo a transformar uma página estática em uma interface interativa.",
      },
      {
        id: "features",
        type: "features",
        content:
          "- Adição\n- Subtração\n- Multiplicação\n- Divisão\n- Tratamento de divisão por zero\n- Ajuste dinâmico do tamanho do texto exibido\n- Interface baseada em grid",
      },
      {
        id: "process",
        type: "process",
        content:
          "O projeto acabou exigindo mais trabalho do que eu esperava principalmente na construção do layout em grid e no controle da lógica que impede comportamentos inválidos durante a utilização da calculadora.",
      },
      {
        id: "learnings",
        type: "learnings",
        content:
          "Foi um dos meus primeiros contatos com JavaScript para criar uma interface realmente dinâmica, praticando eventos, manipulação de elementos e lógica no navegador.",
      },
    ],
    highlights: [
      "Primeiros estudos de JavaScript no navegador",
      "Interface baseada em CSS Grid",
      "Manipulação dinâmica da calculadora",
      "Publicado via GitHub Pages",
    ],
  },

  // ============================================================
  // ELEMENTAL BATTLE
  // ============================================================

  {
    id: "elemental-battle",
    slug: "elemental-battle",
    name: "Elemental Battle",
    summary:
      "Simulador de batalhas em Java desenvolvido para estudar orientação a objetos, classes, regras de combate e composição de sistemas.",
    coverImage: "https://imgur.com/txKsYRt.png",
    technologies: resolveTech([
      "git",
      "github",
      "java",
    ]),
    repositoryUrl:
      "https://github.com/DavidEricson00/Elemental_Battle",
    featured: false,
    ranking: 18,
    sections: [
      {
        id: "overview",
        type: "overview",
        content:
          "Elemental Battle é um pequeno jogo de batalha em Java criado para aprofundar os estudos da linguagem e principalmente dos princípios de orientação a objetos.",
      },
      {
        id: "how-it-works",
        type: "how-it-works",
        content:
          "Duas criaturas elementais entram em uma batalha por turnos. Cada elemento possui atributos próprios, pode atacar ou se defender e possui relações de fraqueza contra determinados tipos.",
      },
      {
        id: "features",
        type: "features",
        content:
          "- Batalhas por turnos\n- Ataque e defesa\n- Sistema de fraquezas entre elementos\n- Elementos pré-definidos\n- Criação de elementos personalizados\n- Sprites em ASCII",
      },
      {
        id: "architecture",
        type: "architecture",
        content:
          "O projeto separa responsabilidades entre as classes responsáveis pelos elementos, ciclo da batalha, menu principal e apresentação das informações.",
      },
      {
        id: "learnings",
        type: "learnings",
        content:
          "O principal objetivo foi praticar classes, objetos, métodos e organização de responsabilidades em Java através de um projeto com regras de negócio simples.",
      },
    ],
    highlights: [
      "Estudo de orientação a objetos",
      "Batalha por turnos",
      "Sistema de fraquezas",
      "Criação de elementos personalizados",
      "Interface em ASCII",
    ],
  },

  // ============================================================
  // JAVA BURGER BUILDER
  // ============================================================

  {
    id: "java-burger-builder",
    slug: "java-burger-builder",
    name: "Java Burger Builder",
    summary:
      "Aplicação de linha de comando para montagem de hambúrgueres, criada para praticar Factory Methods e conceitos fundamentais de Java.",
    technologies: resolveTech([
      "git",
      "github",
      "java",
    ]),
    repositoryUrl:
      "https://github.com/DavidEricson00/Java-Burger_Builder",
    featured: false,
    ranking: 6,
    sections: [
      {
        id: "overview",
        type: "overview",
        content:
          "Projeto de estudo em Java no qual o usuário pode montar um hambúrguer escolhendo diferentes ingredientes e acompanhando o preço final.",
      },
      {
        id: "features",
        type: "features",
        content:
          "- Escolha de pães\n- Queijos\n- Carnes\n- Vegetais\n- Molhos\n- Extras\n- Cálculo do preço final\n- Revisão do pedido",
      },
      {
        id: "decisions",
        type: "decisions",
        content:
          "O projeto foi desenvolvido principalmente para estudar Factory Methods e praticar uma aplicação do padrão em um domínio pequeno e fácil de visualizar.",
      },
      {
        id: "learnings",
        type: "learnings",
        content:
          "O foco não estava em criar um sistema completo, mas em entender como padrões de projeto podem organizar a criação de objetos dentro de uma aplicação Java.",
      },
    ],
    highlights: [
      "Estudo de Factory Methods",
      "Aplicação CLI",
      "Composição de ingredientes",
      "Cálculo de preço",
    ],
  },

  // ============================================================
  // HANGMAN GAME
  // ============================================================

  {
    id: "hangman-game",
    slug: "hangman-game",
    name: "Hangman Game",
    summary:
      "Jogo de forca em Python com modos jogador contra jogador e jogador contra máquina.",
    coverImage: "https://i.imgur.com/05lZqFr.png",
    technologies: resolveTech([
      "git",
      "github",
      "python",
    ]),
    repositoryUrl:
      "https://github.com/DavidEricson00/Hangman_Game",
    featured: false,
    ranking: 10,
    sections: [
      {
        id: "overview",
        type: "overview",
        content:
          "Um dos primeiros projetos desenvolvidos durante meus estudos de Python. O jogo implementa diferentes modos de partida e controle das tentativas do jogador.",
      },
      {
        id: "features",
        type: "features",
        content:
          "- Jogador contra jogador\n- Jogador contra máquina\n- Palavras aleatórias\n- Controle de letras utilizadas\n- Sistema de tentativas\n- Versão em português",
      },
      {
        id: "learnings",
        type: "learnings",
        content:
          "O projeto serviu para praticar os fundamentos de Python, incluindo funções, strings, bibliotecas e tratamento de erros. Também foi o primeiro projeto em que utilizei try/except.",
      },
      {
        id: "screenshots",
        type: "screenshots",
        content: "",
        images: [
          "https://i.imgur.com/05lZqFr.png",
        ],
      },
    ],
    highlights: [
      "Primeiros estudos de Python",
      "Modo PvP e PvE",
      "Tratamento de erros",
      "Jogo totalmente executado no terminal",
    ],
  },

  // ============================================================
  //  TIC-TAC-TOE
  // ============================================================

  {
    id: "tic-tac-toe",
    slug: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    summary:
      "Jogo da velha em Python com modos jogador contra jogador e jogador contra computador.",
    technologies: resolveTech([
      "git",
      "github",
      "python",
    ]),
    repositoryUrl:
      "https://github.com/DavidEricson00/Tic-Tac-Toe",
    featured: false,
    ranking: 8,
    sections: [
      {
        id: "overview",
        type: "overview",
        content:
          "Jogo da velha desenvolvido no início dos meus estudos de Python para praticar orientação a objetos, interação com o usuário e tratamento de erros.",
      },
      {
        id: "features",
        type: "features",
        content:
          "- Jogador contra jogador\n- Jogador contra computador\n- Alternância de turnos\n- Definição aleatória de quem começa\n- Detecção de vitória\n- Detecção de empate",
      },
      {
        id: "architecture",
        type: "architecture",
        content:
          "O projeto separa o funcionamento geral do jogo, jogadores, modos PvP/PvC e funções auxiliares em diferentes módulos Python.",
      },
      {
        id: "learnings",
        type: "learnings",
        content:
          "Foi desenvolvido para consolidar os primeiros conceitos de Python, incluindo classes, funções, módulos, try/except e utilização de bibliotecas padrão.",
      },
    ],
    highlights: [
      "PvP e PvC",
      "Orientação a objetos",
      "Tratamento de erros",
      "Primeiros estudos de Python",
    ],
  },

  // ============================================================
  // SPACIONAVE
  // ============================================================

  {
    id: "spacionave",
    slug: "spacionave",
    name: "Spacionave",
    summary:
      "Jogo endless runner desenvolvido em Python com Pygame, com combate, obstáculos, animações, pontuação e sistema de áudio.",
    coverImage: "https://i.imgur.com/oO4y9DF.png",
    technologies: resolveTech([
      "git",
      "github",
      "python",
      "pygame",
    ]),
    repositoryUrl:
      "https://github.com/DavidEricson00/Spacionave",
    featured: false,
    ranking: 25,
    sections: [
      {
        id: "overview",
        type: "overview",
        content:
          "Spacionave foi meu primeiro jogo completo. O jogador controla uma nave espacial em um cenário endless runner, tentando sobreviver o maior tempo possível enquanto enfrenta obstáculos.",
      },
      {
        id: "how-it-works",
        type: "how-it-works",
        content:
          "A nave pode se movimentar, disparar projéteis e utilizar habilidades de movimento. O jogador precisa desviar dos obstáculos e administrar sua munição enquanto tenta aumentar o tempo de sobrevivência.",
      },
      {
        id: "features",
        type: "features",
        content:
          "- Movimentação com WASD\n- Disparo de projéteis\n- Sistema de munição\n- Diferentes obstáculos\n- Animações de explosão e movimento\n- Sistema de pontuação baseado em sobrevivência\n- Efeitos sonoros e música",
      },
      {
        id: "screenshots",
        type: "screenshots",
        content: "",
        images: [
          "https://i.imgur.com/oO4y9DF.png",
          "https://imgur.com/cWZYLhU.png",
        ],
      },
      {
        id: "learnings",
        type: "learnings",
        content:
          "O projeto foi minha primeira experiência com desenvolvimento de jogos e com uma biblioteca gráfica. O foco foi aprender Pygame e entender como diferentes sistemas de gameplay podem funcionar juntos em uma aplicação interativa.",
      },
    ],
    highlights: [
      "Meu primeiro jogo completo",
      "Python + Pygame",
      "Sistema de combate",
      "Animações",
      "Áudio e música",
      "Sistema de pontuação",
    ],
  },

  // ============================================================
  // C CALCULATOR
  // ============================================================

  {
    id: "c-calculator",
    slug: "c-calculator",
    name: "C Calculator",
    summary:
      "Calculadora de terminal desenvolvida em C para praticar funções, entrada de dados e estruturas de controle.",
    technologies: resolveTech([
      "git",
      "github",
      "c",
    ]),
    repositoryUrl:
      "https://github.com/DavidEricson00/C-Calculator",
    featured: false,
    ranking: 4,
    sections: [
      {
        id: "overview",
        type: "overview",
        content:
          "Projeto inicial desenvolvido durante meus estudos de C para praticar operações básicas, funções, entrada de dados e estruturas de controle.",
      },
      {
        id: "features",
        type: "features",
        content:
          "- Adição\n- Subtração\n- Multiplicação\n- Divisão\n- Tratamento de divisão por zero",
      },
      {
        id: "architecture",
        type: "architecture",
        content:
          "O código é dividido entre o arquivo principal e módulos responsáveis pelas operações e funções auxiliares.",
      },
      {
        id: "learnings",
        type: "learnings",
        content:
          "Projeto desenvolvido nos primeiros estudos de C para compreender funções, entrada de dados, controle de fluxo e compilação de programas.",
      },
    ],
    highlights: [
      "Primeiros estudos de C",
      "Separação em módulos",
      "Funções e controle de fluxo",
    ],
  },

  // ============================================================
  // MARKET SYSTEM
  // ============================================================

  {
    id: "market-system",
    slug: "market-system",
    name: "Market System",
    summary:
      "Sistema de mercado em Python com gerenciamento de produtos, carrinho de compras e persistência em SQLite.",
    technologies: resolveTech([
      "git",
      "github",
      "python",
      "sqlite",
    ]),
    repositoryUrl:
      "https://github.com/DavidEricson00/Market_System",
    featured: false,
    ranking: 22,
    sections: [
      {
        id: "overview",
        type: "overview",
        content:
          "Sistema de mercado desenvolvido durante os primeiros estudos de Python. A aplicação possui áreas distintas para administração do estoque e utilização do catálogo por clientes.",
      },
      {
        id: "features",
        type: "features",
        content:
          "- Cadastro de produtos\n- Alteração e remoção de produtos\n- Consulta do estoque\n- Carrinho de compras\n- Processamento de compras\n- Atualização automática do estoque\n- Autenticação da área administrativa",
      },
      {
        id: "architecture",
        type: "architecture",
        content:
          "A aplicação utiliza Python para a lógica do sistema e SQLite para persistência dos produtos e demais informações necessárias ao funcionamento do mercado.",
      },
      {
        id: "learnings",
        type: "learnings",
        content:
          "Foi minha primeira experiência utilizando um banco de dados em Python. O projeto serviu para praticar CRUD, persistência, interação com o usuário e organização de um pequeno sistema de domínio.",
      },
    ],
    highlights: [
      "Primeiro contato com banco de dados em Python",
      "SQLite",
      "CRUD de produtos",
      "Carrinho de compras",
      "Controle de estoque",
    ],
  },

  // ============================================================
  // VIVERE+
  // ============================================================

  {
    id: "vivere",
    slug: "vivere",
    name: "Vivere+",
    summary:
      "Plataforma de experiências desenvolvida em equipe, com marketplace de eventos, autenticação, gerenciamento de tickets e API REST integrada ao frontend.",
    technologies: resolveTech([
      "git",
      "github",
      "react",
      "typescript",
      "vite",
      "mui",
      "reacthookform",
      "yup",
      "axios",
      "nodejs",
      "express",
      "postgresql",
      "prisma",
      "jwt",
      "swagger",
      "docker",
      "jest",
      "supertest",
      "githubactions",
      "eslint",
      "prettier",
      "reactrouter",
      "bcrypt",
    ]),
    repositoryUrl:
      "https://github.com/vivereTeam/vivere-front",
    featured: false,
    ranking: 58,
    sections: [
      {
        id: "overview",
        type: "overview",
        content:
          "Vivere+ é uma plataforma de eCommerce de experiências que conecta usuários a eventos como workshops, passeios culturais e aulas especializadas. O projeto foi desenvolvido em equipe e representa meu primeiro contato com um projeto web de maior escala e com um fluxo de desenvolvimento colaborativo mais estruturado.",
      },
      {
        id: "architecture",
        type: "architecture",
        content:
          "O sistema é dividido entre um frontend em React e uma API backend em Node.js com Express. O frontend utiliza React Router, Material UI, React Hook Form, Yup e Axios. A API utiliza PostgreSQL com Prisma, autenticação JWT, Swagger para documentação e Docker para o ambiente do backend.\n\nFrontend: https://github.com/vivereTeam/vivere-front\nBackend: https://github.com/vivereTeam/vivere-back",
      },
      {
        id: "how-it-works",
        type: "how-it-works",
        content:
          "Usuários podem navegar pelas experiências disponíveis, pesquisar e filtrar eventos, criar uma conta, autenticar-se e adicionar tickets ao carrinho. Usuários administrativos possuem acesso ao gerenciamento dos eventos.",
      },
      {
        id: "features",
        type: "features",
        content:
          "- Marketplace de experiências\n- Autenticação com JWT\n- Perfis de administrador e cliente\n- CRUD de eventos\n- Busca e filtros\n- Upload de imagens\n- Carrinho de tickets\n- Checkout\n- Recuperação de senha\n- API REST documentada com Swagger",
      },
      {
        id: "process",
        type: "process",
        content:
          "O desenvolvimento foi realizado em equipe utilizando um fluxo baseado em Kanban no GitHub, Issues para organização das tarefas, divisão de responsabilidades, reuniões semanais e acompanhamento das entregas. Também houve utilização de pair programming e code reviews em partes do projeto.",
      },
      {
        id: "decisions",
        type: "decisions",
        content:
          "A separação entre frontend e backend permitiu dividir claramente as responsabilidades da aplicação. No backend, a utilização de Prisma, JWT, Swagger e Docker ajudou a estruturar a API e seu ambiente de desenvolvimento.",
      },
      {
        id: "screenshots",
        type: "screenshots",
        content: "",
        images: [],
      },
      {
        id: "learnings",
        type: "learnings",
        content:
          "O principal aprendizado foi trabalhar em uma aplicação web maior em equipe. Além da parte técnica, o projeto me deu experiência prática com divisão de tarefas, acompanhamento por Issues, reuniões, revisão de código e integração do trabalho de diferentes pessoas em uma mesma aplicação.",
      },
      {
        id: "custom",
        type: "custom",
        content:
          "Este foi meu primeiro projeto web de maior escala desenvolvido em equipe. A experiência foi importante principalmente por sair do modelo de projetos individuais e entrar em um fluxo de desenvolvimento colaborativo.",
      },
    ],
    highlights: [
      "Primeiro projeto web de maior escala em equipe",
      "React + Node.js + PostgreSQL",
      "Marketplace de experiências",
      "Autenticação e controle de acesso",
      "API REST documentada com Swagger",
      "Kanban e GitHub Issues",
      "Reuniões semanais e divisão de tarefas",
    ],
  },

  // ============================================================
  // RAPADURA CLICKER
  // ============================================================

  {
    id: "rapadura-clicker",
    slug: "rapadura-clicker",
    name: "Rapadura Clicker",
    summary:
      "Jogo clicker/idle desenvolvido em Godot, com progressão completa, construções, upgrades, conquistas e uma experiência planejada para ter começo, meio e fim.",
    coverImage:
      "https://img.itch.zone/aW1nLzI1MDE0NDk1LnBuZw==/original/xTLIV4.png",
    technologies: resolveTech([
      "godot",
    ]),
    featured: false,
    ranking: 50,
    liveUrl:
      "https://davidericson00.itch.io/rapaduraclicker",
    sections: [
      {
        id: "overview",
        type: "overview",
        content:
          "Rapadura Clicker é um jogo do gênero clicker/idle inspirado em jogos como Cookie Clicker, mas com identidade própria. O objetivo é produzir o máximo de rapaduras possível através de cliques, construções e upgrades.",
      },
      {
        id: "how-it-works",
        type: "how-it-works",
        content:
          "A progressão começa com produção manual através dos cliques. Conforme o jogador avança, novas construções passam a produzir rapaduras automaticamente e upgrades aumentam diferentes aspectos da produção, criando uma combinação de gameplay ativo e passivo.",
      },
      {
        id: "features",
        type: "features",
        content:
          "- Gameplay clicker e idle\n- Mais de 40 upgrades\n- Construções com produção automática\n- Mais de 60 conquistas\n- Progressão baseada em produção e melhorias\n- Gameplay ativo e passivo\n- Progressão com final definido",
      },
      {
        id: "process",
        type: "process",
        content:
          "O projeto foi desenvolvido como meu primeiro jogo de maior escala em Godot. Diferentemente dos projetos de estudo mais simples, a experiência foi planejada como um jogo completo, com progressão, conteúdo, balanceamento e uma duração definida.",
      },
      {
        id: "screenshots",
        type: "screenshots",
        content: "",
        images: [
          "https://img.itch.zone/aW1hZ2UvNDE5NTUxOC8yNTAxMzgwNi5wbmc=/original/BO743B.png",
          "https://img.itch.zone/aW1hZ2UvNDE5NTUxOC8yNTAxMzgwNy5wbmc=/original/fSC8sZ.png",
          "https://img.itch.zone/aW1hZ2UvNDE5NTUxOC8yNTAxMzgwOC5wbmc=/original/ahQRnF.png",
        ],
      },
      {
        id: "learnings",
        type: "learnings",
        content:
          "O principal aprendizado foi desenvolver um projeto completo utilizando Godot, passando não apenas pela implementação das mecânicas, mas também por progressão, conteúdo, balanceamento e construção de uma experiência que possui começo, desenvolvimento e final.",
      },
      {
        id: "custom",
        type: "custom",
        content:
          "O jogo possui versões para Windows, Linux e macOS e está publicado no itch.io.",
      },
    ],
    highlights: [
      "Meu primeiro jogo de maior escala",
      "Primeiro projeto completo em Godot",
      "Mais de 40 upgrades",
      "60 conquistas",
      "Gameplay ativo e passivo",
      "Progressão com final definido",
      "Versões para Windows, Linux e macOS",
    ],
  },
];

/**
 * Retorna os projetos destacados da Home,
 * ordenados pelo ranking.
 */
export function getFeaturedProjects(): Project[] {
  return projects
    .filter((project) => project.featured)
    .sort((a, b) => (b.ranking ?? 0) - (a.ranking ?? 0));
}

/**
 * Retorna todos os projetos ordenados pelo ranking.
 */
export function getAllProjects(): Project[] {
  return [...projects].sort(
    (a, b) => (b.ranking ?? 0) - (a.ranking ?? 0),
  );
}

/**
 * Busca um projeto pelo slug.
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/**
 * Retorna as tecnologias utilizadas pelos projetos cadastrados.
 */
export function getAvailableProjectTechnologies() {
  const map = new Map<string, (typeof projects)[0]["technologies"][0]>();

  for (const project of projects) {
    for (const technology of project.technologies) {
      if (!map.has(technology.id)) {
        map.set(technology.id, technology);
      }
    }
  }

  return Array.from(map.values());
}