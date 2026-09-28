import type { Post } from "@/types/post";

export const posts: Post[] = [
//   {
//     id: "microsservicos-resilientes-rabbitmq-nestjs",
//     slug: "microsservicos-resilientes-rabbitmq-nestjs",
//     title: "Construindo Microsserviços Resilientes com NestJS, RabbitMQ e Dead Letter Queues",
//     date: "2025-03-20",
//     content: `Em sistemas distribuídos modernos, o envio de notificações e processamento de cargas assíncronas em segundo plano exige muito mais do que apenas disparar uma requisição HTTP. 

// Quando lidamos com provedores externos instáveis ou picos repentinos de tráfego, desacoplar a ingestão da execução torna-se fundamental para manter a API responsiva e com baixa latência.

// ---

// ### Por que Mensageria Assíncrona?

// Ao isolar a camada transacional da camada de entrega pesada, eliminamos o risco de um timeout em uma API externa travar a thread de execução do nosso backend:

// 1. **Desacoplamento Temporal**: O cliente não aguarda a entrega física do e-mail ou processamento de arquivos.
// 2. **Buffer de Carga**: O RabbitMQ absorve picos momentâneos sem sobrecarregar os nós consumidores.
// 3. **Controle de Concorrência**: Podemos escalar os workers consumidores horizontalmente conforme a demanda da fila.

// ---

// ### Estratégia de Idempotência e Checkpoints

// Para assegurar que nenhuma mensagem seja processada em duplicidade caso um nó seja reiniciado durante a execução, associamos um identificador exclusivo (**idempotency key**) a cada payload:

// \`\`\`typescript
// interface EmailPayload {
//   idempotencyKey: string;
//   recipientEmail: string;
//   templateId: string;
//   context: Record<string, unknown>;
// }

// @Injectable()
// export class MailerConsumer {
//   constructor(
//     private readonly checkpointRepo: CheckpointRepository,
//     private readonly mailProvider: MailProvider,
//   ) {}

//   @RabbitSubscribe({
//     exchange: 'newsletter.exchange',
//     routingKey: 'email.send',
//     queue: 'newsletter.mailer.queue',
//   })
//   async handleSendEmail(payload: EmailPayload): Promise<void> {
//     const alreadyProcessed = await this.checkpointRepo.exists(payload.idempotencyKey);
//     if (alreadyProcessed) {
//       // Ignora silenciosamente ou confirma o ack
//       return;
//     }

//     await this.mailProvider.send(payload);
//     await this.checkpointRepo.save(payload.idempotencyKey, 'COMPLETED');
//   }
// }
// \`\`\`

// ---

// ### Tratamento de Falhas com Dead Letter Queue (DLQ)

// Mensagens corrompidas ou falhas permanentes (*ex: e-mail inválido ou credencial revogada*) não devem travar a fila principal indefinidamente em loops infinitos de retry.

// > **Regra de Ouro**: Configure um número máximo de tentativas de retry com backoff exponencial. Se o limite for atingido, roteie a mensagem para uma **DLQ (Dead Letter Queue)** para inspeção posterior.

// \`\`\`
// [ API Transacional ] ──► [ Exchange Principal ]
//                                 │
//                                 ▼
//                        [ Fila de Envios ] ──► [ Worker ]
//                                 │ (falha após N retries)
//                                 ▼
//                        [ Dead Letter Queue ] ──► [ Alerta / Dashboard ]
// \`\`\`

// Com essa abordagem, garantimos resiliência, rastreabilidade e zero perda de mensagens na nossa infraestrutura.`,
//   },
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
