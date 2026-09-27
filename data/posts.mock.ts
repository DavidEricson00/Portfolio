import type { Post } from "@/types/post";

export const posts: Post[] = [
  {
    id: "microsservicos-resilientes-rabbitmq-nestjs",
    slug: "microsservicos-resilientes-rabbitmq-nestjs",
    title: "Construindo Microsserviços Resilientes com NestJS, RabbitMQ e Dead Letter Queues",
    date: "2025-03-20",
    content: `Em sistemas distribuídos modernos, o envio de notificações e processamento de cargas assíncronas em segundo plano exige muito mais do que apenas disparar uma requisição HTTP. 

Quando lidamos com provedores externos instáveis ou picos repentinos de tráfego, desacoplar a ingestão da execução torna-se fundamental para manter a API responsiva e com baixa latência.

---

### Por que Mensageria Assíncrona?

Ao isolar a camada transacional da camada de entrega pesada, eliminamos o risco de um timeout em uma API externa travar a thread de execução do nosso backend:

1. **Desacoplamento Temporal**: O cliente não aguarda a entrega física do e-mail ou processamento de arquivos.
2. **Buffer de Carga**: O RabbitMQ absorve picos momentâneos sem sobrecarregar os nós consumidores.
3. **Controle de Concorrência**: Podemos escalar os workers consumidores horizontalmente conforme a demanda da fila.

---

### Estratégia de Idempotência e Checkpoints

Para assegurar que nenhuma mensagem seja processada em duplicidade caso um nó seja reiniciado durante a execução, associamos um identificador exclusivo (**idempotency key**) a cada payload:

\`\`\`typescript
interface EmailPayload {
  idempotencyKey: string;
  recipientEmail: string;
  templateId: string;
  context: Record<string, unknown>;
}

@Injectable()
export class MailerConsumer {
  constructor(
    private readonly checkpointRepo: CheckpointRepository,
    private readonly mailProvider: MailProvider,
  ) {}

  @RabbitSubscribe({
    exchange: 'newsletter.exchange',
    routingKey: 'email.send',
    queue: 'newsletter.mailer.queue',
  })
  async handleSendEmail(payload: EmailPayload): Promise<void> {
    const alreadyProcessed = await this.checkpointRepo.exists(payload.idempotencyKey);
    if (alreadyProcessed) {
      // Ignora silenciosamente ou confirma o ack
      return;
    }

    await this.mailProvider.send(payload);
    await this.checkpointRepo.save(payload.idempotencyKey, 'COMPLETED');
  }
}
\`\`\`

---

### Tratamento de Falhas com Dead Letter Queue (DLQ)

Mensagens corrompidas ou falhas permanentes (*ex: e-mail inválido ou credencial revogada*) não devem travar a fila principal indefinidamente em loops infinitos de retry.

> **Regra de Ouro**: Configure um número máximo de tentativas de retry com backoff exponencial. Se o limite for atingido, roteie a mensagem para uma **DLQ (Dead Letter Queue)** para inspeção posterior.

\`\`\`
[ API Transacional ] ──► [ Exchange Principal ]
                                │
                                ▼
                       [ Fila de Envios ] ──► [ Worker ]
                                │ (falha após N retries)
                                ▼
                       [ Dead Letter Queue ] ──► [ Alerta / Dashboard ]
\`\`\`

Com essa abordagem, garantimos resiliência, rastreabilidade e zero perda de mensagens na nossa infraestrutura.`,
  },
  {
    id: "arquitetura-serverless-aws-lambda-dynamodb",
    slug: "arquitetura-serverless-aws-lambda-dynamodb",
    title: "APIs Serverless de Baixo Custo: Maximizando DynamoDB TTL e Lambda Authorizers",
    date: "2025-02-28",
    content: `Projetar arquiteturas na nuvem não se resume a utilizar os serviços mais populares, mas sim a escolher as ferramentas certas que garantam escalabilidade elástica com o menor custo operacional possível.

Neste artigo, exploramos padrões arquiteturais utilizando **Amazon API Gateway**, **AWS Lambda** e **Amazon DynamoDB** para criar serviços eficientes com manutenção zero de servidores.

---

### Reduzindo Custos com DynamoDB TTL

Muitas aplicações necessitam de registros temporários, tais como:
- URLs encurtadas com validade determinada
- Códigos de verificação (OTP)
- Sessões de autenticação temporárias

Em vez de criar workers periódicos ou cron jobs para rodar \`DELETE\` em banco de dados, o DynamoDB oferece a funcionalidade nativa de **Time to Live (TTL)**.

| Funcionalidade | Cron Job Tradicional | DynamoDB TTL Nativo |
| :--- | :--- | :--- |
| **Custo de Computação** | Exige Lambda/EC2 ativa | Gratuito (Sem custo de gravação) |
| **Impacto na Capacidade** | Consome WCU do banco | Não consome WCU |
| **Manutenção** | Código extra e monitoramento | Configuração declarativa |

---

### Protegendo Endpoints com Lambda Authorizers

Ao invés de embutir a lógica de validação de tokens ou API Keys dentro de cada função de negócio, utilizamos um **Lambda Authorizer** diretamente no API Gateway:

\`\`\`python
def lambda_handler(event, context):
    token = event.get('authorizationToken')
    api_key = event.get('headers', {}).get('x-api-key')
    
    if validate_api_key(api_key):
        return generate_policy('user', 'Allow', event['methodArn'])
        
    return generate_policy('user', 'Deny', event['methodArn'])

def generate_policy(principal_id, effect, resource):
    return {
        'principalId': principal_id,
        'policyDocument': {
            'Version': '2012-10-17',
            'Statement': [{
                'Action': 'execute-api:Invoke',
                'Effect': effect,
                'Resource': resource
            }]
        }
    }
\`\`\`

> Ao barrar requisições inválidas antes mesmo de invocar a Lambda principal, reduzimos consideravelmente os custos de execução e latência das chamadas não autorizadas.`,
  },
  {
    id: "maquinas-de-estado-fluxos-criticos-backend",
    slug: "maquinas-de-estado-fluxos-criticos-backend",
    title: "Modelagem de Máquinas de Estados Finitas no Backend para Fluxos Críticos",
    date: "2025-01-14",
    content: `Em aplicações comerciais como sistemas de atendimento, pedidos ou pagamentos, gerenciar o status de uma entidade através de simples colunas de texto sem regras estritas é uma das principais fontes de bugs em produção.

O uso de uma **Máquina de Estados Finita (FSM - Finite State Machine)** no domínio do backend garante previsibilidade absoluta sobre quais transições são válidas em cada momento do ciclo de vida de um recurso.

---

### O Problema do Status Livre

Imagine um ticket de suporte técnico ou pedido que pode estar nos seguintes estados:
- \`ABERTO\`
- \`EM_ATENDIMENTO\`
- \`AGUARDANDO_CLIENTE\`
- \`RESOLVIDO\`
- \`FECHADO\`

Sem uma máquina de estados explícita, um desenvolvedor desatento poderia executar:

\`\`\`typescript
// ❌ Código vulnerável a inconsistências
ticket.status = 'FECHADO';
await ticketRepo.save(ticket);
\`\`\`

Isso permitiria fechar um ticket diretamente sem triagem prévia, violando regras de negócio e métricas de SLA.

---

### Implementando a Matriz de Transição

Uma implementação robusta define explicitamente o grafo de transições permitidas:

\`\`\`typescript
export type TicketStatus = 
  | 'ABERTO' 
  | 'EM_ATENDIMENTO' 
  | 'AGUARDANDO_CLIENTE' 
  | 'RESOLVIDO' 
  | 'FECHADO';

export const TICKET_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  ABERTO: ['EM_ATENDIMENTO', 'FECHADO'],
  EM_ATENDIMENTO: ['AGUARDANDO_CLIENTE', 'RESOLVIDO', 'FECHADO'],
  AGUARDANDO_CLIENTE: ['EM_ATENDIMENTO', 'RESOLVIDO', 'FECHADO'],
  RESOLVIDO: ['FECHADO', 'EM_ATENDIMENTO'], // Reabertura se necessário
  FECHADO: [], // Estado terminal
};

export function canTransition(current: TicketStatus, next: TicketStatus): boolean {
  return TICKET_TRANSITIONS[current]?.includes(next) ?? false;
}
\`\`\`

### Benefícios Práticos

- **Prevenção de Estados Impossíveis**: Transições inválidas são rejeitadas na camada de domínio antes de qualquer gravação em banco.
- **Auditoria Transparente**: Toda mudança de estado pode disparar eventos de telemetria automáticos.
- **Clareza de Código**: O fluxo da aplicação fica documentado na própria estrutura de dados.`,
  },
];

/**
 * Returns all posts sorted from newest to oldest
 */
export function getAllPosts(): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

/**
 * Finds a post by its slug
 */
export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/**
 * Formats a date string (YYYY-MM-DD) into Portuguese localized format
 */
export function formatPostDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Estimates reading time in minutes based on words count
 */
export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
