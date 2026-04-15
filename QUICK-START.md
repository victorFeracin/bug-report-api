# 🚀 Quick Start - Testes de API de Bugs

## ⚡ Início Rápido

### 1. Instalar dependências (já feito)
```bash
npm install --save-dev mocha supertest chai
```

### 2. Rodar todos os testes
```bash
npm test
```

**Resultado esperado**: ✅ 39 passing

### 3. Rodar apenas testes de bugs
```bash
npm run test:bugs
```

### 4. Modo watch (reexecuta ao salvar)
```bash
npm run test:watch
```

---

## 📝 Exemplos de Uso

### ✅ Teste de Sucesso

```javascript
const { expect } = require("chai");
const request = require("supertest");
const app = require("../../src/app");
const bugFixtures = require("../fixtures/bugs");

describe("POST /api/bugs - Sucesso", () => {
  it("Deve criar um bug válido", async () => {
    const response = await request(app)
      .post("/api/bugs")
      .send(bugFixtures.validBugComplete)
      .expect(201);

    expect(response.body).to.have.property("id");
    expect(response.body.title).to.equal("Login button not responding on mobile");
  });
});
```

### ❌ Teste de Erro

```javascript
it("Deve retornar erro 400 quando title está faltando", async () => {
  const response = await request(app)
    .post("/api/bugs")
    .send(bugFixtures.missingTitle)
    .expect(400);

  expect(response.body.message).to.equal("Validation error");
  expect(response.body.details).to.include.something.that.includes("title");
});
```

### 🔐 Teste com Autenticação (Quando implementado)

```javascript
const { loginUser } = require("../helpers/authHelper");

it("Deve criar bug com token JWT válido", async () => {
  const agent = request(app);
  const token = await loginUser(agent, "qa.engineer", "SecurePass123!");

  const response = await agent
    .post("/api/bugs")
    .set("Authorization", `Bearer ${token}`)
    .send(bugFixtures.validBugComplete)
    .expect(201);

  expect(response.body).to.have.property("id");
});
```

---

## 🎯 Estrutura de um Teste Típico

```javascript
describe("POST /api/bugs", () => {
  let agent;

  // Executado antes de todos os testes
  before(() => {
    agent = request(app);
  });

  describe("✓ Testes de Sucesso", () => {
    it("Descrição do teste em português", async () => {
      // 1. Prepare dados
      const bugData = bugFixtures.validBugComplete;

      // 2. Faça a requisição
      const response = await agent
        .post("/api/bugs")
        .send(bugData);

      // 3. Valide o resultado
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("id");
      expect(response.body.title).to.equal(bugData.title);
    });
  });
});
```

---

## 📊 Dados de Teste (Fixtures)

### Usar um fixture predefinido
```javascript
const validBug = bugFixtures.validBugComplete;

const response = await agent
  .post("/api/bugs")
  .send(validBug)
  .expect(201);
```

### Clonar e modificar um fixture
```javascript
const customBug = {
  ...bugFixtures.validBugComplete,
  severity: "low",  // Mudar severidade
  title: "Bug customizado"  // Mudar título
};

const response = await agent
  .post("/api/bugs")
  .send(customBug)
  .expect(201);
```

### Criar novo fixture inline
```javascript
const newBug = {
  title: "Meu novo bug",
  description: "Descrição do bug",
  reporter: "qa.engineer",
  severity: "high",
  steps: ["Passo 1", "Passo 2"],
};

const response = await agent
  .post("/api/bugs")
  .send(newBug)
  .expect(201);
```

---

## 🔍 Assertions Comuns

```javascript
// Igualdade
expect(response.status).to.equal(201);
expect(response.body.title).to.equal("expected title");

// Existência
expect(response.body).to.have.property("id");
expect(response.body.attachments).to.exist;

// Tipo de dados
expect(response.body.id).to.be.a("string");
expect(response.body.steps).to.be.an("array");

// Magnitude
expect(response.body.attachments).to.have.lengthOf(3);
expect(response.body.steps).to.have.length.greaterThan(0);

// Conteúdo
expect(response.body.details).to.include("title is required");
expect(response.body.severity).to.be.oneOf(["low", "medium", "high", "critical"]);

// Condicional
expect(response.body.createdAt).to.match(/^\d{4}-\d{2}-\d{2}/);
expect(response.headers["content-type"]).to.include("application/json");
```

---

## 📝 Adicionar Novo Teste

### 1. Criar novo arquivo de teste
```bash
# Criar: test/bugs/updateBug.test.js
```

### 2. Importar dependências
```javascript
const request = require("supertest");
const { expect } = require("chai");
const app = require("../../src/app");
const bugFixtures = require("../fixtures/bugs");
```

### 3. Escrever testes
```javascript
describe("PUT /api/bugs/:id", () => {
  let agent;

  before(() => {
    agent = request(app);
  });

  it("Deve atualizar um bug existente", async () => {
    // Seus testes aqui
  });
});
```

### 4. Executar
```bash
npm test
```

---

## 🐛 Debugging de Testes

### Ver saída completa
```bash
npm test -- --reporter json > results.json
npm test -- --reporter tap
```

### Executar teste específico
```bash
npm test -- --grep "Deve criar um bug"
```

### Stop no primeiro erro
```bash
npm test -- --bail
```

### Aumentar timeout
```bash
npm test -- --timeout 20000
```

---

## 🛠️ Troubleshooting

### Erro: "Cannot find module"
```bash
npm install --save-dev mocha supertest chai
```

### Erro: "404 Not Found"
Verificar se a rota está em `src/app.js` com prefixo `/api`

### Testes lentos
Aumentar timeout em `.mocharc.json`:
```json
{
  "timeout": 15000
}
```

### Erro de Port em uso
A aplicação não está rodando em background. Normalmente não é necessário pois o Supertest inicia a aplicação.

---

## 🔐 Preparar para Autenticação

Quando o endpoint `/api/login` for implementado:

### 1. Descomente em `test/helpers/authHelper.js`
```javascript
// Descomente:
// const response = await agent.post("/api/login").send(...)
// return response.body.token;
```

### 2. Descomente em `test/bugs/createBug.test.js`
```javascript
it("Deveria permitir acesso com token JWT válido", async () => {
  // Descomente o código
});
```

### 3. Execute
```bash
npm test
```

---

## 📚 Referências

- [Mocha Docs](https://mochajs.org/)
- [Supertest GitHub](https://github.com/visionmedia/supertest)
- [Chai Assertions](https://www.chaijs.com/api/)
- [Jest vs Mocha](https://www.npmjs.com/package/jest)

---

## 💡 Dicas e Truques

### Testar múltiplos cenários
```javascript
const severities = ["low", "medium", "high", "critical"];

for (const severity of severities) {
  it(`Deve aceitar severity '${severity}'`, async () => {
    const bugData = {
      ...bugFixtures.validBugComplete,
      severity
    };

    const response = await agent
      .post("/api/bugs")
      .send(bugData)
      .expect(201);

    expect(response.body.severity).to.equal(severity);
  });
}
```

### Testar concorrência
```javascript
it("Deve criar múltiplos bugs simultaneamente", async () => {
  const promises = Array.from({ length: 5 }, () =>
    agent.post("/api/bugs").send(bugFixtures.validBugComplete)
  );

  const responses = await Promise.all(promises);

  responses.forEach(r => expect(r.status).to.equal(201));
});
```

### Testar com diferentes headers
```javascript
const response = await agent
  .post("/api/bugs")
  .set("Content-Type", "application/json")
  .set("Authorization", "Bearer token")
  .send(bugData)
  .expect(201);
```

---

## 📞 Suporte

Para problemas:

1. **Ver logs**: `npm test -- --reporter spec`
2. **Verificar fixtures**: `test/fixtures/bugs.js`
3. **Ler documentação**: `TEST-GUIDE.md`
4. **Checar API**: `src/app.js`, `src/routes/bugRoutes.js`

---

**Versão**: 1.0.0
**Última atualização**: Abril 2026
**Status**: Pronto para Produção ✅
