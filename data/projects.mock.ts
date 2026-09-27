import type { Project } from "@/types/project";
import { technologiesById } from "./technologies.mock";

function resolveTech(ids: string[]) {
  return ids
    .map((id) => technologiesById.get(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
}

export const projects: Project[] = [
  {
    id: "letterdrop",
    slug: "letterdrop",
    name: "LetterDrop",
    summary:
      "Plataforma de newsletter baseada em microsserviços NestJS e RabbitMQ, com processamento assíncrono, entrega idempotente e recuperação de falhas.",
    highlights: [
      "Arquitetura com API e Mailer separados",
      "Comunicação assíncrona com RabbitMQ",
      "Idempotência na entrega de emails",
      "Dead Letter Queue (DLQ) para contenção de falhas",
      "Recuperação de processamento através de checkpoints",
      "Autenticação JWT e RBAC (controle de acesso por perfil)",
      "Rate limiting e logging estruturado com Pino",
      "Testes unitários e E2E com Jest",
      "Ambiente containerizado com Docker Compose",
      "Documentação OpenAPI via Swagger",
    ],
    technologies: resolveTech([
      "nestjs",
      "typescript",
      "rabbitmq",
      "postgresql",
      "typeorm",
      "jwt",
      "jest",
      "docker",
      "swagger",
      "resend",
      "pino",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/LetterDrop",
    featured: true,
    ranking: 100,
    sections: [
      {
        id: "letterdrop-overview",
        type: "overview",
        content: `LetterDrop é uma plataforma robusta de gerenciamento e envio de newsletters projetada com foco em escalabilidade, resiliência e desacoplamento de responsabilidades.

O sistema foi concebido para resolver os gargalos comuns em envios massivos de emails, onde picos de requisições ou instabilidades temporárias em provedores externos podem comprometer a estabilidade de uma aplicação monolítica tradicional.`,
      },
      {
        id: "letterdrop-architecture",
        type: "architecture",
        content: `A solução foi estruturada em dois microsserviços independentes que operam em conjunto:

### 1. LetterDrop API (Serviço Transacional)
- Responsável pelo gerenciamento de usuários, campanhas, listas de inscritos e agendamentos.
- Camada de autenticação com **JWT** e controle de acesso baseado em papéis (**RBAC**).
- Persistência estruturada com **PostgreSQL** e **TypeORM**.
- Publicação assíncrona de eventos de disparo de emails na fila do **RabbitMQ**.

### 2. LetterDrop Mailer (Consumidor de Envios)
- Microsserviço consumidor dedicado exclusivamente ao processamento e despacho de mensagens.
- Integração direta com a API do **Resend** para entrega de emails transacionais e em lote.
- Gerenciamento de taxa de envio, controle de concorrência e estratégias de fallback.

\`\`\`
[ Cliente HTTP ] ──► [ LetterDrop API ] ──► [ PostgreSQL ]
                           │
                           ▼
                    [ RabbitMQ Exchange ]
                     ├──► [ Fila Principal: emails.send ] ──► [ LetterDrop Mailer ] ──► [ Resend API ]
                     └──► [ Dead Letter Queue (DLQ) ]
\`\`\``,
      },
      {
        id: "letterdrop-how-it-works",
        type: "how-it-works",
        content: `O fluxo de disparo de campanhas segue um pipeline orientado a eventos:

1. **Agendamento e Publicação**: O usuário cria ou agenda uma campanha via API. A API valida o conteúdo e publica lotes de destinatários na fila do RabbitMQ.
2. **Consumo Concorrente**: O serviço Mailer consome as mensagens da fila de acordo com o limite de concorrência configurado.
3. **Validação de Idempotência**: Antes de efetuar a chamada ao provedor de email, o Mailer verifica chaves de idempotência únicas para assegurar que nenhum destinatário receba mensagens duplicadas em casos de reprocessamento.
4. **Registro de Checkpoints**: O progresso do lote é persistido no PostgreSQL a cada bloco processado com sucesso.
5. **Tratamento de Falhas e DLQ**: Mensagens que falham repetidamente após o número limite de tentativas de retry são direcionadas para a Dead Letter Queue para análise e reprocessamento posterior sem travar a fila principal.`,
      },
      {
        id: "letterdrop-features",
        type: "features",
        content: `- **Gerenciamento de Assinantes**: Cadastro, confirmação de inscrição e segmentação por listas e tópicos de interesse.
- **Campanhas e Templates**: Suporte à criação de newsletters em HTML/Markdown com tags de personalização.
- **Autenticação Segura**: Login com JWT, refresh tokens e proteção de rotas com guards e decorators customizados no NestJS.
- **Resiliência e Idempotência**: Garantia de entrega *at-least-once* com proteções contra duplicidade de envio.
- **Dead Letter Queue (DLQ)**: Isolamento de mensagens corrompidas ou falhas permanentes.
- **Auditoria e Logs**: Log estruturado em formato JSON com **Pino** para rastreabilidade de eventos e métricas.
- **Documentação Interativa**: Swagger/OpenAPI disponível para todos os endpoints da API.`,
      },
      {
        id: "letterdrop-decisions",
        type: "decisions",
        content: `### Microsserviços vs. Monólito
A separação em dois serviços (API e Mailer) isola a carga pesada de processamento I/O de rede gerada pelos envios de email, garantindo que a API transacional responda com baixa latência mesmo durante grandes campanhas.

### RabbitMQ como Message Broker
O RabbitMQ foi selecionado pela sua maturidade em roteamento flexível de mensagens, suporte nativo a Dead Letter Exchanges e mecanismos avançados de confirmação de entrega (*acknowledgements*).

### Idempotência com Checkpoints
Para evitar cobranças indevidas e desgaste com usuários por múltiplos envios em caso de reinício de nós, cada mensagem carrega um hash identificador único registrado em banco antes e após o envio.`,
      },
    ],
  },
  {
    id: "linkshortener",
    slug: "linkshortener",
    name: "LinkShortener",
    summary:
      "Encurtador de URLs serverless desenvolvido na AWS, com rastreamento de acessos, autenticação por API key e expiração automática de registros.",
    highlights: [
      "Arquitetura 100% Serverless na AWS",
      "Alta performance com DynamoDB e TTL nativo",
      "Autenticação de endpoints com Lambda Authorizer",
      "Infraestrutura como Código (IaC) com CloudFormation",
      "Pipeline automatizado de CI/CD com GitHub Actions",
      "Monitoramento e alertas com CloudWatch e SNS",
    ],
    technologies: resolveTech([
      "python",
      "awslambda",
      "apigateway",
      "dynamodb",
      "cloudformation",
      "githubactions",
      "cloudwatch",
      "sns",
      "cicd",
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
        content: `LinkShortener é uma plataforma de encurtamento de URLs e telemetria construída sob o paradigma **Serverless** na AWS.

O projeto foi planejado para operar com alta disponibilidade, custo próximo de zero em períodos ociosos e capacidade de escalar instantaneamente para suportar dezenas de milhares de requisições simultâneas sem gerenciamento de servidores.`,
      },
      {
        id: "linkshortener-architecture",
        type: "architecture",
        content: `Toda a infraestrutura foi modelada como código (**IaC**) através do **AWS CloudFormation** e provisionada de forma contínua via **GitHub Actions**:

- **Amazon API Gateway**: Ponto de entrada HTTP com roteamento REST e validação de requisições.
- **Lambda Authorizer**: Função dedicada em Python responsável pela validação e controle de cotas das API Keys.
- **AWS Lambda (Python)**: Funções serverless individuais para criação de links curtos, resolução de redirecionamentos e estatísticas de acesso.
- **Amazon DynamoDB**: Banco de dados NoSQL de chave-valor com particionamento otimizado e recurso de **Time to Live (TTL)**.
- **CloudWatch & SNS**: Coleta de métricas operacionais, contagem de erros 4xx/5xx e disparo de notificações automáticas via tópicos SNS.`,
      },
      {
        id: "linkshortener-how-it-works",
        type: "how-it-works",
        content: `O ciclo de vida de um link no sistema é composto por duas etapas:

1. **Criação da URL Encurtada**:
   - O cliente envia uma requisição \`POST /shorten\` com a URL de destino e um tempo de validade opcional.
   - O Lambda Authorizer valida a credencial do requisitante.
   - A função Lambda gera um código alfanumérico curto e salva o registro no DynamoDB com o atributo \`TimeToLive\`.
2. **Redirecionamento e Telemetria**:
   - Ao acessar o endereço encurtado, o API Gateway aciona a Lambda de resolução.
   - O registro é consultado no DynamoDB; se válido, a Lambda incrementa o contador de cliques atômico e devolve uma resposta \`HTTP 301 Moved Permanently\`.
   - Caso o TTL tenha expirado, o DynamoDB purga o item automaticamente sem custo adicional de computação.`,
      },
      {
        id: "linkshortener-features",
        type: "features",
        content: `- **Geração Rápida de Links**: Algoritmo otimizado para gerar slugs curtos e únicos com baixa colisão.
- **Expiração Automática**: Definição de prazo de validade por link gerenciado pelo TTL do DynamoDB.
- **Proteção de API**: Autenticação customizada via Lambda Authorizer para chamadas administrativas.
- **Telemetria de Acessos**: Contabilização atômica de visualizações e cliques por link encurtado.
- **Infraestrutura Automatizada**: Deploy completo e reproduzível com CloudFormation e pipeline de CI/CD.`,
      },
      {
        id: "linkshortener-decisions",
        type: "decisions",
        content: `### DynamoDB com TTL Nativo
O uso do TTL nativo eliminou a necessidade de workers ou tarefas cron periódicas para limpeza de dados expirados, reduzindo o custo operacional e simplificando o código.

### Lambda Authorizer Dedicado
Desacopla a camada de segurança da lógica de negócio. Requisições não autenticadas ou com tokens inválidos são barradas na borda antes de incorrer em tempo de execução das Lambdas principais.`,
      },
    ],
  },
  {
    id: "supportdesk",
    slug: "supportdesk",
    name: "SupportDesk",
    summary:
      "Plataforma fullstack de gerenciamento de tickets de suporte, desenvolvida para explorar controle de acesso por perfil, APIs REST e infraestrutura containerizada.",
    highlights: [
      "Dois perfis: cliente e agente",
      "Controle de acesso baseado em funções (RBAC)",
      "Autenticação JWT com middleware de autorização",
      "State machine para ciclo de vida dos tickets",
      "API REST tipada com TypeScript e validação Zod",
      "Persistência em MongoDB com Mongoose",
      "Testes de integração com Jest e Supertest",
      "Docker Compose com NGINX como reverse proxy",
      "Frontend React com TanStack React Query",
    ],
    technologies: resolveTech([
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
      "reactrouter",
      "reactquery",
      "styledcomponents",
      "axios",
      "docker",
      "nginx",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/SupportDesk",
    coverImage: "https://i.imgur.com/zPxxCk0.png",
    featured: true,
    ranking: 85,
    sections: [
      {
        id: "supportdesk-overview",
        type: "overview",
        content: `SupportDesk é uma plataforma fullstack concebida para gerenciar fluxos completos de atendimento ao cliente e chamados técnicos de TI.

O foco central do projeto foi o desenvolvimento de uma arquitetura resiliente com controle de acesso rigoroso por perfil (RBAC), uma máquina de estados finita para governança do ciclo de vida dos chamados e cobertura abrangente de testes de integração.`,
      },
      {
        id: "supportdesk-how-it-works",
        type: "how-it-works",
        content: `A aplicação opera com duas personas principais:

- **Clientes**: Registram chamados categorizados por criticidade, anexam detalhes e acompanham o histórico de respostas em tempo real.
- **Agentes de Suporte**: Visualizam o painel de triagem, assumem a responsabilidade por tickets, alteram status e respondem aos clientes.

### Máquina de Estados dos Chamados
Os tickets seguem transições estritas de estado:

\`\`\`
[ Aberto ] ──► [ Em Atendimento ] ──► [ Aguardando Cliente ]
                       │                         │
                       ▼                         ▼
                 [ Resolvido ] ─────────► [ Fechado ]
\`\`\`

Transições inválidas (como reabrir um chamado fechado sem privilégios ou pular etapas de triagem) são bloqueadas tanto na camada de domínio do backend quanto na interface.`,
      },
      {
        id: "supportdesk-architecture",
        type: "architecture",
        content: `### Backend (Node.js + Express + TypeScript)
- Arquitetura em camadas com separação clara entre rotas, controllers, services e repositórios.
- Validação estrita de contratos de entrada e saída com **Zod**.
- Modelagem de documentos e relacionamentos com **MongoDB** e **Mongoose**.
- Bateria de testes de integração ponta a ponta com **Jest** e **Supertest**.

### Frontend (React + Vite + TanStack Query)
- Single Page Application com roteamento protegido por roles via **React Router**.
- Gerenciamento de cache e sincronização de dados remotos com **TanStack React Query**.
- Estilização modular com **Styled Components**.

### Infraestrutura (Docker + NGINX)
- Orquestração completa de serviços (Frontend, Backend, MongoDB) via **Docker Compose**.
- **NGINX** configurado como proxy reverso para terminação de requisições e roteamento de tráfego.`,
      },
      {
        id: "supportdesk-features",
        type: "features",
        content: `- **Autenticação JWT**: Login com tokens assinados, expiração configurada e armazenamento seguro.
- **Role-Based Access Control (RBAC)**: Permissões distintas e isoladas entre perfis de Cliente e Agente.
- **Gestão de Tickets**: Criação, atribuição a agentes, priorização e fechamento formal de chamados.
- **Timeline de Interações**: Histórico cronológico de mensagens e trocas de status de cada chamado.
- **Validação de Schemas**: Validação de todos os payloads HTTP com Zod antes de atingir as regras de negócio.`,
      },
      {
        id: "supportdesk-screenshots",
        type: "screenshots",
        content: "Capturas de tela das principais interfaces da aplicação SupportDesk.",
        images: [
          "https://i.imgur.com/zPxxCk0.png",
          "https://i.imgur.com/7CIwg5R.png",
          "https://i.imgur.com/WUWEZum.png",
          "https://i.imgur.com/w11GC8q.png",
        ],
      },
    ],
  },
  {
    id: "pedeai",
    slug: "pedeai",
    name: "PedeAi",
    summary:
      "Sistema de pedidos via Telegram com automação de workflows através do n8n, cache Redis e assistente baseado no Google Gemini.",
    highlights: [
      "Bot de pedidos integrado ao Telegram",
      "Workflows de automação com n8n",
      "Máquina de estados para o fluxo de pedidos",
      "PostgreSQL para catálogo e transações",
      "Redis para cache e histórico de conversas",
      "TTL de sessões e rate limiting",
      "Integração com Google Gemini",
      "Agent handoff entre fluxo determinístico e IA",
      "Ambiente em Docker Compose",
      "Documentação Swagger/OpenAPI",
    ],
    technologies: resolveTech([
      "nodejs",
      "express",
      "postgresql",
      "n8n",
      "docker",
      "redis",
      "gemini",
      "telegram",
      "swagger",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/PedeAi",
    coverImage: "https://i.imgur.com/FiRIJcS.png",
    featured: true,
    ranking: 80,
    sections: [
      {
        id: "pedeai-overview",
        type: "overview",
        content: `PedeAi é uma solução de autoatendimento e pedidos no Telegram desenvolvida para restaurantes e estabelecimentos comerciais.

O projeto une automação determinística de compras com a flexibilidade da inteligência artificial generativa (**Google Gemini**), criando uma experiência de atendimento ágil, fluida e personalizada.`,
      },
      {
        id: "pedeai-architecture",
        type: "architecture",
        content: `A arquitetura foi estruturada para integrar múltiplos serviços especializados:

- **Telegram Bot API**: Interface de conversação acessível aos clientes finais.
- **API Backend (Node.js/Express)**: Recebe webhooks do Telegram, processa regras de negócio e expõe documentação no Swagger.
- **n8n Workflow Engine**: Orquestração visual de fluxos de pedido, notificações e webhooks externos.
- **Redis**: Armazenamento em memória para estado da conversa, controle de sessão com TTL e rate limiting.
- **PostgreSQL**: Banco de dados relacional para cardápio, dados de clientes e histórico de pedidos fechados.
- **Google Gemini API**: Modelo de linguagem invocado dinamicamente para sanar dúvidas sobre o cardápio e sugerir itens.`,
      },
      {
        id: "pedeai-how-it-works",
        type: "how-it-works",
        content: `O sistema emprega uma estratégia híbrida de atendimento com **Agent Handoff**:

1. **Início e Identificação**: O cliente envia uma mensagem no Telegram. O backend localiza o contexto da sessão armazenado no Redis.
2. **Navegação Determinística**: Para adicionar itens ao carrinho, selecionar variações e fechar a compra, o bot utiliza botões inline e uma máquina de estados previsível.
3. **Agent Handoff para IA**: Se o cliente faz perguntas abertas (*ex: "Qual opção não contém glúten?"* ou *"Qual a recomendação de sobremesa?"*), o sistema redireciona a mensagem ao Gemini com o contexto do catálogo injetado via prompt estruturado.
4. **Finalização do Pedido**: Ao confirmar o pedido, o n8n registra a transação no PostgreSQL e emite alertas para a cozinha.`,
      },
      {
        id: "pedeai-features",
        type: "features",
        content: `- **Catálogo Interativo**: Apresentação de categorias, itens, fotos e adicionais no Telegram.
- **Carrinho Dinâmico**: Adição, remoção e cálculo automático de totais por sessão.
- **Handoff Inteligente**: Alternância suave entre bot estruturado e assistente com IA.
- **Gestão de Sessões**: Expiração e recuperação de conversas baseadas em TTL no Redis.
- **Proteção contra Abuso**: Rate limiting por usuário para prevenção de spam.
- **Containerização Total**: Ambiente completo reproduzível via Docker Compose.`,
      },
      {
        id: "pedeai-screenshots",
        type: "screenshots",
        content: "Fluxo de atendimento e telas do bot PedeAi.",
        images: ["https://i.imgur.com/FiRIJcS.png"],
      },
    ],
  },
  {
    id: "dialogo",
    slug: "dialogo",
    name: "DialoGO",
    summary:
      "Plataforma de chat em tempo real desenvolvida para explorar WebSockets, Socket.IO e arquitetura moderna de frontend.",
    highlights: [
      "Comunicação em tempo real com Socket.IO",
      "Autenticação JWT com persistência de sessão",
      "Gerenciamento de estado global com Context API",
      "Rotas protegidas no frontend",
      "Salas de chat públicas e privadas",
      "Busca e filtros de conversas",
      "Atualização de mensagens e status em tempo real",
      "Interface responsiva com Tailwind CSS",
    ],
    technologies: resolveTech([
      "react",
      "typescript",
      "vite",
      "tailwindcss",
      "socketio",
      "eslint",
    ]),
    repositoryUrl: "https://github.com/DavidEricson00/DialoGO-Frontend",
    coverImage:
      "https://github.com/user-attachments/assets/fe3386d4-5ebe-4bc8-adfa-58f7f1234167",
    featured: false,
    ranking: 75,
    sections: [
      {
        id: "dialogo-overview",
        type: "overview",
        content: `DialoGO é uma plataforma de comunicação em tempo real projetada para demonstrar uma arquitetura de frontend moderna orientada a eventos e WebSockets.

O projeto explora a sincronização instantânea de estado entre múltiplos clientes conectados, controle de salas de conversa e feedback visual de digitação e presença.`,
      },
      {
        id: "dialogo-architecture",
        type: "architecture",
        content: `### Frontend (React + TypeScript + Vite + Tailwind CSS)
- **Socket.IO Client**: Gerenciamento de conexões persistentes WebSocket com reconexão automática.
- **React Context API**: Centralização do estado de autenticação, conexões ativas e lista de conversas.
- **Tailwind CSS**: Design system baseado em tema escuro, layout responsivo e transições suaves.
- **Modularidade de Componentes**: Divisão estrita entre componentes de UI, hooks customizados de socket e guards de rota.`,
      },
      {
        id: "dialogo-how-it-works",
        type: "how-it-works",
        content: `1. **Autenticação e Conexão**: O usuário efetua login e recebe um token JWT. A conexão Socket.IO é inicializada transmitindo a credencial no handshake.
2. **Entrada em Salas**: O usuário seleciona ou ingressa em salas temáticas de discussão.
3. **Troca de Mensagens**: Mensagens enviadas disparam eventos socket que são distribuídos para todos os participantes da sala em fração de milissegundos.
4. **Eventos de Presença**: Indicadores de digitação e alteração de status online/offline são transmitidos de forma assíncrona.`,
      },
      {
        id: "dialogo-features",
        type: "features",
        content: `- **Mensagens Instantâneas**: Transmissão em tempo real sem polling HTTP.
- **Salas de Conversa**: Criação e navegação entre diferentes canais de bate-papo.
- **Filtros e Busca**: Localização rápida de conversas e contatos.
- **Interface Responsiva**: Experiência otimizada para navegadores desktop e dispositivos móveis.
- **Proteção de Acesso**: Redirecionamento automático de usuários não autenticados.`,
      },
      {
        id: "dialogo-screenshots",
        type: "screenshots",
        content: "Visual da interface do DialoGO com chat rooms e design responsivo.",
        images: [
          "https://github.com/user-attachments/assets/fe3386d4-5ebe-4bc8-adfa-58f7f1234167",
          "https://github.com/user-attachments/assets/947693ca-da98-4f6e-8957-a43f328e9e9f",
          "https://github.com/user-attachments/assets/bfd731cf-2ed8-4a61-b430-4c567eb59120",
        ],
      },
    ],
  },
];

/**
 * Returns all featured projects sorted by ranking in descending order
 */
export function getFeaturedProjects(): Project[] {
  return projects
    .filter((project) => project.featured)
    .sort((a, b) => (b.ranking ?? 0) - (a.ranking ?? 0));
}

/**
 * Returns all projects sorted by ranking in descending order (highest ranking first)
 */
export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => (b.ranking ?? 0) - (a.ranking ?? 0));
}

/**
 * Finds a project by its slug
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/**
 * Returns unique technologies used in any registered project
 */
export function getAvailableProjectTechnologies() {
  const map = new Map<string, (typeof projects)[0]["technologies"][0]>();
  for (const proj of projects) {
    for (const tech of proj.technologies) {
      if (!map.has(tech.id)) {
        map.set(tech.id, tech);
      }
    }
  }
  return Array.from(map.values());
}
