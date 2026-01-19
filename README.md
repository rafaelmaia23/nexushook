# 🚀 NexusHook

O **NexusHook** é uma infraestrutura de mensageria assíncrona baseada no modelo **Webhook-as-a-Service**.  
O sistema atua como um intermediário resiliente entre serviços, garantindo que notificações de eventos — como vendas, alterações de status ou alertas — sejam entregues aos destinatários finais com:

- garantia de entrega
- retentativas automáticas
- rastreabilidade completa

---

## O Problema que Resolve

Sistemas distribuídos falham — e falham o tempo todo.  
Quando o **Sistema A** tenta avisar o **Sistema B** sobre um evento e o destino está fora do ar, a informação simplesmente evapora.

O NexusHook resolve isso através de quatro pilares:

- **Desacoplamento** – o sistema de origem não precisa esperar a resposta do destino
- **Resiliência** – retentativas automáticas com espera exponencial (backoff)
- **Observabilidade** – logs detalhados de cada tentativa de entrega
- **Segurança** – assinatura de payloads para garantir autenticidade

---

## Tech Stack e Ferramentas

### Backend

- **Runtime:** Node.js (v20+)
- **Linguagem:** TypeScript
- **Framework Web:** Express (flexibilidade) ou Fastify (performance)
- **Banco de Dados:** PostgreSQL
- **ORMs possíveis:**
  - Prisma – produtividade e tipagem automática
  - Drizzle ORM – abordagem SQL-like e foco em performance
- **Fila e Cache:** Redis + BullMQ
- **Autenticação:** Passport.js (JWT e Local)
- **Validação:** Zod — tipagem forte do input ao output
- **Logging & Observabilidade:**
  - Winston ou Pino para logs estruturados
  - Morgan para requisições HTTP
- **Testes:** Jest ou Vitest

### Frontend

- **Framework:** Next.js (App Router)
- **Estilização:** Tailwind CSS + ShadcnUI
- **Gerenciamento de dados:** TanStack Query (React Query)

### Infraestrutura e Qualidade

- **Containerização:** Docker e Docker Compose
- **Padronização:** ESLint + Prettier
- **Documentação:** Swagger / OpenAPI 3.0

## Backlog de Funcionalidades

### Infraestrutura & Setup

- [ ] Configuração de ambiente com Docker (Node, Postgres, Redis)
- [ ] Boilerplate TypeScript com validação de .env via Zod
- [ ] Middleware global de erro e Logger estruturado (Winston/Pino)
- [ ] Healthcheck e padronização de retornos da API

### Autenticação & Identidade

- [ ] Gestão de Usuários (CRUD, Hash de senha, Validação de E-mail)
- [ ] Auth JWT (Login, Logout e Refresh Token)
- [ ] Sistema de API Keys: geração de chaves únicas para autenticação entre sistemas

### Gestão de Webhooks (CRUD)

- [ ] Registro de endpoints de destino
- [ ] Funcionalidade de Ativar/Desativar e Soft Delete
- [ ] Segurança: geração de Secret Key por webhook para assinatura HMAC

### Processamento e Mensageria

- [ ] Ingestão de eventos via POST com resposta imediata (202 Accepted)
- [ ] Integração BullMQ: Producer (API) e Consumer (Worker)
- [ ] Estratégia de Retry com backoff exponencial
- [ ] Assinatura de payload no header da requisição de saída
- [ ] Proteção SSRF básica (bloqueio de URLs locais)

### Histórico e Logs

- [ ] Gravação de logs de entrega com status, tempo e payload
- [ ] Listagem paginada de eventos e tentativas de disparo

### Frontend

- [ ] Dashboard com métricas simples (Sucesso vs Falha)
- [ ] Tela de gerenciamento de webhooks e visualização de logs
- [ ] Documentação interativa via Swagger

## Cronograma de Execução

### 📅 MÊS 1: O Motor e a Infra

**Objetivo:** Receber um evento, colocar na fila e entregar no destino com logs.

---

#### Semana 1 – O Alicerce

**Objetivos:**

- Configuração do Docker (Postgres, Redis, Node)
- Setup do projeto (TS, ESLint, Prettier, Zod para .env)
- Modelagem e Migrations iniciais (User, Webhook, Event)

**Dia 1 - Setup Docker & Ambiente**

- Setup Docker & Ambiente
- Criar docker-compose.yml com Postgres 16 e Redis Alpine
- Criar .env.example
- Testar conexão com banco via DBeaver/TablePlus

**Dia 2 - Boilerplate Node + TS**

- Boilerplate Node + TypeScript
- npm init e configuração do tsconfig.json
- ESLint + Prettier
- Estrutura de pastas: src/core, src/modules, src/shared

**Dia 3 - Validação & Server**

- Validação de .env com Zod
- Servidor Express com GET /health
- Configurar ts-node-dev ou tsx para live reload
- implementar CORS
- Implementar Helmet - segurança de headers

**Dia 4 - Modelagem de Dados**

- Instalar ORM (ex: Prisma)
- Criar schema inicial: User e WebhookConfig
- Primeira migration

**Dia 5 - Relacionamentos & Seed**

- Tabelas Event e DeliveryLog
- Criar seed.ts com usuário e webhook de teste

---

#### Semana 2 – Autenticação e Gestão

**Objetivos:**

- Cadastro/Login com JWT
- CRUD de Webhooks
- Sistema de API Keys

**Dia 6 - User Domain**

- Rotas de cadastro e login
- Hash com BCrypt
- Repositório de usuário

**Dia 7 - Autenticação JWT**

- Middleware JWT
- Rota protegida GET /me

**Dia 8 - CRUD de Webhooks I**

- POST /webhooks
- Validação com Zod (z.string().url())

**Dia 9 - CRUD de Webhooks II**

- GET /webhooks
- DELETE /webhooks/:id com soft delete

**Dia 10 - API Key System**

- Coluna apiKey no usuário
- Endpoint para gerar nova chave
- Middleware x-api-key

---

#### Semana 3 – A Ingestão e a Fila

**Objetivos:**

- POST /v1/events
- Integração com BullMQ
- Validação de payloads

**Dia 11 - Event Ingestion**

- Endpoint de ingestão
- Validação da apiKey
- verificar regras do CORS

**Dia 12 - Configuração BullMQ**

- Configuração BullMQ
- Fila webhook-delivery

**Dia 13 - Producer Logic**

- Producer:  
  webhookQueue.add('dispatch', { payload, userId })

**Dia 14 - Persistência de Evento**

- Persistir evento com status PENDING
- Enviar ID para fila

**Dia 15 - Refinamento & Erros**

- Error handler global
- Tratamento para Redis offline (503)

---

#### Semana 4 – Worker e Entrega

**Objetivos:**

- Consumer da fila
- Disparo HTTP
- Logs no banco

**Dia 16 - Worker Setup**

- worker.ts como processo separado
- Processador da fila

**Dia 17 - HTTP Dispatcher**

- Dispatcher com Axios/Fetch
- Timeout de 10s

**Dia 18 - Log de Entrega**

- Registro em DeliveryLogs
- statusCode, responseBody, latency

**Dia 19 - Atualização de Status**

- Atualizar evento para SUCCESS/FAILED

**Dia 20 - Teste de Ponta a Ponta**

- Teste com Webhook.site
- Validação ponta a ponta

---

### ✅ Checklist de Fim do Mês 1

- [ ] Projeto sobe com docker-compose up
- [ ] Cadastro e login funcionando
- [ ] API retorna 202 ao enviar evento
- [ ] Evento e log gravados no banco

### 📅 MÊS 2: Resiliência e Maturidade

**Objetivo:** Tornar o sistema robusto, seguro e digno de um ambiente de produção.

---

#### Semana 5 – Inteligência de Retentativas

**Dia 21 – Configuração de Backoff**

- Estudar opções de attempts e backoff do BullMQ
- Configurar modo exponential (dobrar tempo a cada falha)

**Dia 22 – Lógica Not-Found vs Error**

- Diferenciar 404 de 500/Timeout
- Definir quando vale a pena retry

**Dia 23 – Limite de Tentativas**

- Marcar evento como PERMANENT_FAIL após 5 tentativas
- Sincronizar status da fila com banco

**Dia 24 – Eventos do BullMQ**

- Escutar .on('failed') e .on('retrying')
- Gerar logs em tempo real

---

#### Semana 6 – Segurança Avançada

**Dia 25 – Implementação de HMAC**

- Util para gerar SHA256 com secret do webhook
- Padronizar função de assinatura

**Dia 26 – Headers de Assinatura**

- Enviar X-Hub-Signature no Worker
- Validar formato do header

**Dia 27 – Proteção SSRF I**

- Bloquear localhost e 127.0.0.1
- Bloquear faixas internas 192.168/10.x/172.x

**Dia 28 – Proteção SSRF II**

- Validar URL após resolução DNS
- Mitigar DNS Rebinding

**Dia 29 – Rotação de Secret**

- PATCH /webhooks/:id/rotate-secret
- Invalidar chave antiga

---

#### Semana 7 – Observabilidade e Performance

**Dia 30 – Logs Estruturados**

- Substituir console.log por Winston/Pino
- Níveis info/warn/error

**Dia 31 – Refinamento do Delivery Log**

- Salvar headers de resposta
- Melhorar debug de falhas

**Dia 32 – Paginação de Logs**

- limit/offset em GET /events e /logs
- Evitar retornos gigantes

**Dia 33 – Morgan & Latência**

- Logar tempo das rotas
- Salvar latência do disparo

**Dia 34 – Dashboard de Saúde**

- GET /stats com sucessos/falhas 24h
- SQL com COUNT e GROUP BY

---

#### Semana 8 – Qualidade e Testes

**Dia 35 – Setup de Testes**

- Instalar Jest/Vitest
- Banco isolado para testes

**Dia 36 – Testes de Segurança**

- Testar HMAC
- Testar bloqueio SSRF

**Dia 37 – Testes de Serviço**

- Mocks de API Key
- Validação de usuários

**Dia 38 – Integração I**

- Fluxo API → criação no banco
- Validação de evento pendente

**Dia 39 – Integração II**

- Mock de HTTP do Worker
- Verificar DeliveryLog

---

### ✅ Checklist de Fim do Mês 2

- [ ] Reenvio automático com backoff
- [ ] Assinatura digital nos envios
- [ ] Bloqueio de URLs perigosas
- [ ] Logs paginados e legíveis
- [ ] Suíte de testes crítica

### 📅 MÊS 3: Interface e Entrega Final

**Objetivo:** Criar a interface visual e colocar o projeto no ar.

---

#### Semana 9 – Frontend: Estrutura e Auth

**Dia 40 – Setup Next.js & Tailwind**

- Iniciar projeto com App Router
- Configurar Tailwind CSS
- Instalar ShadcnUI (Button, Input, Card, Toast)

**Dia 41 – Consumo de API & Auth Context**

- Configurar Axios ou TanStack Query
- Criar contexto para JWT e usuário

**Dia 42 – Tela de Login e Cadastro**

- Formulários com React Hook Form + Zod
- Salvar token em cookie/localStorage

**Dia 43 – Middleware de Proteção**

- Bloquear /dashboard para não autenticados
- Redirecionar para /login

---

#### Semana 10 – Frontend: Gestão e Logs

**Dia 44 – Listagem de Webhooks**

- Tabela ou cards
- Badge Ativo/Inativo

**Dia 45 – Criação e Edição**

- Modal para novo webhook
- Feedback com Toasts

**Dia 46 – Dashboard de Logs**

- Tabela com status coloridos
- Verde 200, Amarelo retry, Vermelho erro

**Dia 47 – Detalhes do Log & JSON**

- Modal/collapsible com payload
- Exibir resposta do destino

**Dia 48 – Gestão de API Keys**

- Tela para visualizar chaves
- Copiar e ocultar/mostrar

---

#### Semana 11 – Documentação e Polimento

**Dia 49 – Swagger / OpenAPI**

- swagger-ui-express
- Exemplos de request e response

**Dia 50 – Diagrama de Arquitetura**

- Fluxo API → Redis → Worker → Destino
- Excalidraw ou Mermaid

**Dia 51 – README Técnico**

- Como rodar com Docker
- Decisões técnicas e motivação

**Dia 52 – Refinamento de UX**

- Skeletons de loading
- Estados vazios amigáveis

**Dia 53 – Responsividade**

- Teste mobile real
- Ajustes de layout

---

#### Semana 12 – Deploy e Apresentação

**Dia 54 – Deploy Backend & Worker**

- Railway/Render/Fly.io
- Postgres e Redis em produção

**Dia 55 – Deploy do Frontend**

- Vercel conectado ao GitHub
- Variável API_URL

**Dia 56 – Teste em Produção**

- Disparo real com API Key
- Validação via Webhook.site

**Dia 57 – Gravação do Vídeo**

- Fluxo completo na demo
- Loom ou OBS

**Dia 58 – O Launch**

- Post no LinkedIn
- Links do GitHub e demo

---

### ✅ Checklist Final do Projeto

- [ ] Backend com retentativas e proteção SSRF
- [ ] Frontend funcional com logs claros
- [ ] Documentação Swagger e README
- [ ] Projeto online e testável
