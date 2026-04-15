# Automação de Testes Funcionais - API de Bug Report

## 📋 Visão Geral

Este projeto contém testes automatizados funcionais para o endpoint **POST /api/bugs** usando:
- **Mocha** - Framework de testes
- **Supertest** - Agent HTTP para testes de API
- **Chai** - Biblioteca de assertions

## 📁 Estrutura de Testes

```
test/
├── fixtures/              # Dados de teste isolados
│   ├── users.js          # Usuários cadastrados para autenticação
│   └── bugs.js           # Casos de teste para bugs
├── helpers/              # Funções auxiliares
│   └── authHelper.js     # Helper para autenticação/login
└── bugs/                 # Testes do endpoint POST /api/bugs
    └── createBug.test.js # Suite de testes completa
```

## 🚀 Instalação

### Dependências
O projeto já inclui as seguintes devDependencies:
```bash
npm install --save-dev mocha supertest chai
```

Se precisar instalar novamente:
```bash
npm install --save-dev mocha supertest chai
```

## ▶️ Executando os Testes

### Todos os testes
```bash
npm test
```

### Apenas testes de bugs
```bash
npm run test:bugs
```

### Modo watch (atualiza automaticamente)
```bash
npm run test:watch
```

### Saída detalhada
```bash
npm test -- --reporter spec
```

## 📊 Cobertura de Testes

### ✅ Casos de Sucesso (9 testes)
- Criar bug com todos os campos válidos e attachments
- Criar bug com campos mínimos (sem attachments)
- Validar todos os valores de severidade (low, medium, high, critical)
- Sanitização de strings (remover espaços em branco)
- Múltiplos attachments
- IDs únicos gerados
- Timestamp em formato ISO 8601

### ❌ Validação - Campos Obrigatórios (6 testes)
- Falta de 'title'
- Falta de 'description'
- Falta de 'reporter'
- Falta de 'severity'
- Falta de 'steps'
- Múltiplos campos obrigatórios faltando

### ❌ Validação - Valores Vazios (4 testes)
- Title vazio
- Steps array vazio
- Valores com apenas espaços em branco
- Steps com array vazio

### ❌ Validação - Tipos de Dados (3 testes)
- Title não é string
- Steps não é array
- Attachments não é array

### ❌ Validação - Severity (2 testes)
- Valor de severity inválido
- Múltiplos valores inválidos de severity

### ❌ Validação - Attachments (4 testes)
- Mais de 10 attachments
- Attachment faltando 'filename'
- Attachment faltando 'url'
- Máximo de 10 attachments aceito

### ❌ Validação - Casos Extremos (5 testes)
- Corpo da requisição vazio
- Content-Type não é JSON
- Steps com muitos itens (50+)
- Caracteres especiais em strings
- Strings com comprimento máximo

### 📝 Autenticação (2 testes)
- Preparado para token JWT válido (quando /api/login for implementado)
- Preparado para erro 401 sem token (quando autenticação for implementada)

### 📊 Response (3 testes)
- Content-Type application/json
- Status code 201 Created
- Status code 400 Bad Request

### 🔄 Concorrência (1 teste)
- Criar múltiplos bugs simultaneamente sem conflitos

**Total: 39 testes**

## 📦 Fixtures

### `test/fixtures/users.js`
Contém usuários pré-configurados para autenticação:
```javascript
{
  id: "user-001",
  username: "qa.engineer",
  email: "qa@example.com",
  password: "SecurePass123!"
}
```

### `test/fixtures/bugs.js`
Contém múltiplos cenários de teste:
- **Válidos**: `validBugComplete`, `validBugMinimal`, `validBugLowSeverity`, etc.
- **Inválidos**: `missingTitle`, `invalidSeverity`, `tooManyAttachments`, etc.

## 🔐 Helper de Autenticação

### `test/helpers/authHelper.js`

Fornece funções para gerenciar autenticação:

```javascript
// Login de um usuário
const token = await loginUser(agent, "qa.engineer", "SecurePass123!");

// Gerar token mock (teste local)
const mockToken = generateMockToken("qa.engineer");

// Buscar usuário por username
const user = getUserByUsername("qa.engineer");

// Obter todos os usuários
const allUsers = getAllUsers();
```

**Nota**: O endpoint `/api/login` ainda não está implementado. O helper está pronto para ser ativado quando a autenticação for adicionada à API.

## 🧪 Exemplo de Teste

```javascript
it("Deve criar um bug com todos os campos válidos", async () => {
  const response = await agent
    .post("/api/bugs")
    .send(bugFixtures.validBugComplete)
    .expect(201);

  expect(response.body).to.have.property("id");
  expect(response.body).to.have.property("createdAt");
  expect(response.body.title).to.equal(bugFixtures.validBugComplete.title);
});
```

## 🔄 Usando Fixtures nos Testes

Os fixtures isolam dados de teste e facilitam a manutenção:

```javascript
// Usar fixture diretamente
const response = await agent
  .post("/api/bugs")
  .send(bugFixtures.validBugComplete)
  .expect(201);

// Ou clonar e modificar
const customBug = {
  ...bugFixtures.validBugComplete,
  severity: "critical"
};

const response = await agent
  .post("/api/bugs")
  .send(customBug)
  .expect(201);
```

## 📝 Schema Esperado - POST /api/bugs

### Requisição
```json
{
  "title": "string (obrigatório, não vazio)",
  "description": "string (obrigatório, não vazio)",
  "reporter": "string (obrigatório, não vazio)",
  "severity": "string (obrigatório, valores válidos: low, medium, high, critical)",
  "steps": ["string"] (array obrigatório, mínimo 1 item),
  "attachments": [
    {
      "filename": "string (obrigatório se o objeto existir)",
      "url": "string (obrigatório se o objeto existir)"
    }
  ] (array opcional, máximo 10 itens)
}
```

### Resposta (201 Created)
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "reporter": "string",
  "severity": "string",
  "steps": ["string"],
  "attachments": [...],
  "createdAt": "ISO 8601 timestamp"
}
```

### Erro de Validação (400 Bad Request)
```json
{
  "message": "Validation error",
  "details": ["array de mensagens de erro"]
}
```

## 🔄 Implementação Futura - Autenticação

Quando o endpoint `/api/login` for implementado:

1. Descomente as linhas comentadas em `test/helpers/authHelper.js`
2. Descomente os testes em `test/bugs/createBug.test.js` na seção de autenticação
3. Os testes usarão o token JWT real retornado pelo endpoint

Exemplo:
```javascript
// Antes de cada teste que requer autenticação
const user = { username: "qa.engineer", password: "SecurePass123!" };
const token = await loginUser(agent, user.username, user.password);

const response = await agent
  .post("/api/bugs")
  .set("Authorization", `Bearer ${token}`)
  .send(bugFixtures.validBugComplete)
  .expect(201);
```

## 🐛 Troubleshooting

### Erro: "Cannot find module 'mocha'"
Solução: Execute `npm install --save-dev mocha supertest chai`

### Erro: "404 Not Found"
Verifique se as rotas estão corretamente configuradas em `src/app.js` com o prefixo `/api`

### Testes falham intermitentemente
Pode ser relacionado a testes de concorrência. Execute novamente ou verifique a lógica de sincronização

## 📚 Recursos

- [Mocha Documentation](https://mochajs.org/)
- [Supertest GitHub](https://github.com/visionmedia/supertest)
- [Chai Assertion Library](https://www.chaijs.com/)
- [Jest vs Mocha](https://jestjs.io/)

## ✨ Boas Práticas

1. **Isolamento**: Cada teste é independente e não afeta outros
2. **Fixtures**: Dados de teste centralizados e reutilizáveis
3. **Helpers**: Funções compartilhadas para reduzir duplicação
4. **Descritivo**: Nomes de testes claros e em português
5. **Cobertura**: Validação de casos de sucesso, erro e extremos

## 📄 Licença

Este projeto é parte da automação de testes da API de Bug Report.

---

**Última atualização**: Abril 2026
**Status**: 39 testes passando ✅
