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
      "Comunicação assíncrona através do RabbitMQ",
      "Idempotência na entrega de emails",
      "Dead Letter Queue",
      "Recuperação de processamento através de checkpoints",
      "JWT e controle de acesso por perfil",
      "Rate limiting",
      "Testes unitários e e2e",
      "Docker Compose",
      "Swagger/OpenAPI",
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
    screenshots: [],
    featured: true,
    featuredOrder: 1,
    ranking: 100,
  },
  {
    id: "linkshortener",
    slug: "linkshortener",
    name: "LinkShortener",
    summary:
      "Encurtador de URLs serverless desenvolvido na AWS, com rastreamento de acessos, autenticação por API key e expiração automática de registros.",
    highlights: [
      "AWS Lambda",
      "API Gateway",
      "DynamoDB",
      "TTL",
      "Lambda Authorizer",
      "CloudFormation",
      "GitHub Actions",
      "CI/CD",
      "CloudWatch",
      "SNS",
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
    screenshots: [],
    featured: true,
    featuredOrder: 2,
    ranking: 90,
  },
  {
    id: "supportdesk",
    slug: "supportdesk",
    name: "SupportDesk",
    summary:
      "Plataforma fullstack de gerenciamento de tickets de suporte, desenvolvida para explorar controle de acesso por perfil, APIs REST e infraestrutura containerizada.",
    highlights: [
      "Dois perfis: cliente e agente",
      "Controle de acesso baseado em funções",
      "Autenticação JWT",
      "State machine para ciclo de vida dos tickets",
      "API REST",
      "MongoDB",
      "Testes de integração com Jest e Supertest",
      "Docker Compose",
      "NGINX como reverse proxy",
      "React + TanStack React Query",
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
    screenshots: [
      "https://i.imgur.com/zPxxCk0.png",
      "https://i.imgur.com/7CIwg5R.png",
      "https://i.imgur.com/WUWEZum.png",
      "https://i.imgur.com/w11GC8q.png",
    ],
    featured: true,
    featuredOrder: 3,
    ranking: 85,
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
      "PostgreSQL",
      "Redis para cache e histórico de conversas",
      "TTL de sessões",
      "Rate limiting",
      "Integração com Gemini",
      "Agent handoff entre fluxo determinístico e IA",
      "Docker Compose",
      "Webhooks",
      "Swagger/OpenAPI",
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
    screenshots: ["https://i.imgur.com/FiRIJcS.png"],
    featured: true,
    featuredOrder: 4,
    ranking: 80,
  },
  {
    id: "dialogo",
    slug: "dialogo",
    name: "DialoGO",
    summary:
      "Plataforma de chat em tempo real desenvolvida para explorar WebSockets, Socket.IO e arquitetura moderna de frontend.",
    highlights: [
      "Comunicação em tempo real com Socket.IO",
      "Autenticação JWT",
      "Context API",
      "Protected routes",
      "Gerenciamento de chats",
      "Busca e filtros de chats",
      "Chat rooms",
      "Atualização de mensagens em tempo real",
      "Interface responsiva",
      "Arquitetura modular de frontend",
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
    screenshots: [
      "https://github.com/user-attachments/assets/fe3386d4-5ebe-4bc8-adfa-58f7f1234167",
      "https://github.com/user-attachments/assets/947693ca-da98-4f6e-8957-a43f328e9e9f",
      "https://github.com/user-attachments/assets/bfd731cf-2ed8-4a61-b430-4c567eb59120",
    ],
    featured: false,
    ranking: 75,
  },
];

/**
 * Returns all featured projects sorted by `featuredOrder`
 */
export function getFeaturedProjects(): Project[] {
  return projects
    .filter((project) => project.featured)
    .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999));
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
