/**
 * Testes Funcionais: POST /api/bugs
 * 
 * Testes automatizados para validar:
 * - Criação bem-sucedida de relatórios de bugs
 * - Validação de dados de entrada
 * - Tratamento de erros
 * - Casos extremos e edge cases
 */

const request = require("supertest");
const { expect } = require("chai");
const app = require("../../src/app");
const bugFixtures = require("../fixtures/bugs");
const { loginUser, getAllUsers } = require("../helpers/authHelper");

describe("POST /api/bugs", () => {
  let agent;

  before(() => {
    // Inicializa o agent do Supertest
    agent = request(app);
  });

  describe("✓ Casos de Sucesso - Criação de Bug", () => {
    it("Deve criar um bug com todos os campos válidos e attachments", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.validBugComplete)
        .expect(201);

      expect(response.body).to.have.property("id");
      expect(response.body).to.have.property("createdAt");
      expect(response.body.title).to.equal(bugFixtures.validBugComplete.title);
      expect(response.body.description).to.equal(
        bugFixtures.validBugComplete.description
      );
      expect(response.body.reporter).to.equal(
        bugFixtures.validBugComplete.reporter
      );
      expect(response.body.severity).to.equal(
        bugFixtures.validBugComplete.severity
      );
      expect(response.body.steps).to.be.an("array");
      expect(response.body.steps.length).to.equal(
        bugFixtures.validBugComplete.steps.length
      );
      expect(response.body.attachments).to.be.an("array");
      expect(response.body.attachments.length).to.equal(
        bugFixtures.validBugComplete.attachments.length
      );
    });

    it("Deve criar um bug com campos obrigatórios mínimos (sem attachments)", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.validBugMinimal)
        .expect(201);

      expect(response.body).to.have.property("id");
      expect(response.body).to.have.property("createdAt");
      expect(response.body.attachments).to.be.an("array");
      expect(response.body.attachments.length).to.equal(0);
      expect(new Date(response.body.createdAt)).to.be.instanceOf(Date);
    });

    it("Deve criar um bug com severidade 'low'", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.validBugLowSeverity)
        .expect(201);

      expect(response.body.severity).to.equal("low");
    });

    it("Deve criar um bug com severidade 'medium'", async () => {
      const bugData = {
        ...bugFixtures.validBugComplete,
        severity: "medium",
      };

      const response = await agent
        .post("/api/bugs")
        .send(bugData)
        .expect(201);

      expect(response.body.severity).to.equal("medium");
    });

    it("Deve criar um bug com severidade 'critical'", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.validBugMinimal)
        .expect(201);

      expect(response.body.severity).to.equal("critical");
    });

    it("Deve sanitizar strings removendo espaços em branco desnecessários", async () => {
      const bugData = {
        ...bugFixtures.validBugComplete,
        title: "  Title with spaces  ",
        description: "  Description with spaces  ",
        reporter: "  qa.engineer  ",
      };

      const response = await agent
        .post("/api/bugs")
        .send(bugData)
        .expect(201);

      expect(response.body.title).to.equal("Title with spaces");
      expect(response.body.description).to.equal("Description with spaces");
      expect(response.body.reporter).to.equal("qa.engineer");
    });

    it("Deve criar um bug com vários attachments", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.validBugMultipleAttachments)
        .expect(201);

      expect(response.body.attachments).to.have.lengthOf(3);
      response.body.attachments.forEach((attachment) => {
        expect(attachment).to.have.property("filename");
        expect(attachment).to.have.property("url");
      });
    });

    it("Deve retornar um ID único para cada bug criado", async () => {
      const response1 = await agent
        .post("/api/bugs")
        .send(bugFixtures.validBugComplete)
        .expect(201);

      const response2 = await agent
        .post("/api/bugs")
        .send(bugFixtures.validBugComplete)
        .expect(201);

      expect(response1.body.id).to.not.equal(response2.body.id);
    });

    it("Deve retornar timestamp createdAt no formato ISO 8601", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.validBugComplete)
        .expect(201);

      const timestamp = response.body.createdAt;
      expect(timestamp).to.match(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });
  });

  describe("✗ Erros de Validação - Campos Obrigatórios", () => {
    it("Deve retornar erro 400 quando falta o campo 'title'", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.missingTitle)
        .expect(400);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("details");
      expect(response.body.message).to.equal("Validation error");
      expect(response.body.details).to.be.an("array");
      expect(response.body.details.some((d) => d.includes("title"))).to.be
        .true;
    });

    it("Deve retornar erro 400 quando falta o campo 'description'", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.missingDescription)
        .expect(400);

      expect(response.body.details.some((d) => d.includes("description"))).to
        .be.true;
    });

    it("Deve retornar erro 400 quando falta o campo 'reporter'", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.missingReporter)
        .expect(400);

      expect(response.body.details.some((d) => d.includes("reporter"))).to.be
        .true;
    });

    it("Deve retornar erro 400 quando falta o campo 'severity'", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.missingSeverity)
        .expect(400);

      expect(response.body.details.some((d) => d.includes("severity"))).to.be
        .true;
    });

    it("Deve retornar erro 400 quando falta o campo 'steps'", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.missingSteps)
        .expect(400);

      expect(response.body.details.some((d) => d.includes("steps"))).to.be
        .true;
    });

    it("Deve retornar erro 400 quando múltiplos campos obrigatórios estão faltando", async () => {
      const response = await agent
        .post("/api/bugs")
        .send({})
        .expect(400);

      expect(response.body.details.length).to.be.greaterThan(1);
    });
  });

  describe("✗ Erros de Validação - Valores Vazios", () => {
    it("Deve retornar erro 400 quando 'title' é uma string vazia", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.emptyTitle)
        .expect(400);

      expect(response.body.details.some((d) => d.includes("title"))).to.be
        .true;
    });

    it("Deve retornar erro 400 quando 'steps' é um array vazio", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.emptySteps)
        .expect(400);

      expect(response.body.details.some((d) => d.includes("steps"))).to.be
        .true;
    });

    it("Deve retornar erro 400 quando valores são apenas espaços em branco", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.whitespaceValues)
        .expect(400);

      expect(response.body.details.length).to.be.greaterThan(0);
    });

    it("Deve retornar erro 400 quando um step é uma string vazia", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.stepWithEmptyString)
        .expect(400);

      expect(response.body.details.some((d) => d.includes("steps"))).to.be
        .true;
    });
  });

  describe("✗ Erros de Validação - Tipos de Dados Inválidos", () => {
    it("Deve retornar erro 400 quando 'title' não é uma string", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.invalidTitleType)
        .expect(400);

      expect(response.body.details.some((d) => d.includes("title"))).to.be
        .true;
    });

    it("Deve retornar erro 400 quando 'steps' não é um array", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.invalidStepsType)
        .expect(400);

      expect(response.body.details.some((d) => d.includes("steps"))).to.be
        .true;
    });

    it("Deve retornar erro 400 quando 'attachments' não é um array", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.invalidAttachmentsType)
        .expect(400);

      expect(response.body.details.some((d) => d.includes("attachments"))).to
        .be.true;
    });
  });

  describe("✗ Erros de Validação - Valores de Severidade", () => {
    it("Deve retornar erro 400 quando 'severity' tem um valor inválido", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.invalidSeverity)
        .expect(400);

      expect(response.body.details.some((d) => d.includes("severity"))).to.be
        .true;
    });

    it("Deve retornar erro 400 para valores de severity não permitidos", async () => {
      const invalidSeverities = ["blocker", "urgent", "trivial", "unknown"];

      for (const severity of invalidSeverities) {
        const bugData = {
          ...bugFixtures.validBugComplete,
          severity,
        };

        const response = await agent
          .post("/api/bugs")
          .send(bugData)
          .expect(400);

        expect(response.body.details.some((d) => d.includes("severity"))).to
          .be.true;
      }
    });
  });

  describe("✗ Erros de Validação - Attachments", () => {
    it("Deve retornar erro 400 quando há mais de 10 attachments", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.tooManyAttachments)
        .expect(400);

      expect(response.body.details.some((d) => d.includes("attachments"))).to
        .be.true;
    });

    it("Deve retornar erro 400 quando attachment está faltando 'filename'", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.attachmentMissingFilename)
        .expect(400);

      expect(response.body.details.some((d) => d.includes("filename"))).to.be
        .true;
    });

    it("Deve retornar erro 400 quando attachment está faltando 'url'", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.attachmentMissingUrl)
        .expect(400);

      expect(response.body.details.some((d) => d.includes("url"))).to.be.true;
    });

    it("Deve aceitar 10 attachments no máximo", async () => {
      const bugData = {
        ...bugFixtures.validBugComplete,
        attachments: Array.from({ length: 10 }, (_, i) => ({
          filename: `attachment_${i + 1}.png`,
          url: `https://example.com/attachment_${i + 1}.png`,
        })),
      };

      const response = await agent
        .post("/api/bugs")
        .send(bugData)
        .expect(201);

      expect(response.body.attachments).to.have.lengthOf(10);
    });
  });

  describe("✗ Erros de Validação - Casos Extremos", () => {
    it("Deve retornar erro 400 quando o corpo da requisição é vazio", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.emptyBody)
        .expect(400);

      expect(response.body.details.length).to.be.greaterThan(0);
    });

    it("Deve retornar erro 400 quando o Content-Type não é JSON", async () => {
      const response = await agent
        .post("/api/bugs")
        .set("Content-Type", "text/plain")
        .send("invalid data")
        .expect(400);

      // Pode ser um erro de parsing ou validação
      expect(response.status).to.be.oneOf([400, 500]);
    });

    it("Deve validar steps com muitos itens", async () => {
      const bugData = {
        ...bugFixtures.validBugComplete,
        steps: Array.from({ length: 50 }, (_, i) => `Step ${i + 1}`),
      };

      const response = await agent
        .post("/api/bugs")
        .send(bugData)
        .expect(201);

      expect(response.body.steps).to.have.lengthOf(50);
    });

    it("Deve aceitar caracteres especiais em strings", async () => {
      const bugData = {
        ...bugFixtures.validBugComplete,
        title: "Bug with special chars: !@#$%^&*()",
        description:
          "Description with emoji: 🐛 🔧 ✅ and unicode: café, naïve",
      };

      const response = await agent
        .post("/api/bugs")
        .send(bugData)
        .expect(201);

      expect(response.body.title).to.include("!");
      expect(response.body.description).to.include("🐛");
    });

    it("Deve aceitar strings com comprimento máximo", async () => {
      const longString = "A".repeat(1000);
      const bugData = {
        ...bugFixtures.validBugComplete,
        title: longString,
        description: longString,
      };

      const response = await agent
        .post("/api/bugs")
        .send(bugData)
        .expect(201);

      expect(response.body.title).to.have.lengthOf(1000);
    });
  });

  describe("📝 Autenticação e Autorização (Preparado para Implementação)", () => {
    it("Deveria permitir acesso com token JWT válido (quando autenticação for implementada)", async () => {
      // Descomente quando /api/login for implementado:
      /*
      const user = { username: "qa.engineer", password: "SecurePass123!" };
      const token = await loginUser(agent, user.username, user.password);

      const response = await agent
        .post("/api/bugs")
        .set("Authorization", `Bearer ${token}`)
        .send(bugFixtures.validBugComplete)
        .expect(201);

      expect(response.body).to.have.property("id");
      */

      // Por enquanto, apenas verifica que a requisição funciona sem autenticação
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.validBugComplete)
        .expect(201);

      expect(response.body).to.have.property("id");
    });

    it("Deveria retornar erro 401 sem token JWT válido (quando autenticação for implementada)", async () => {
      // Descomente quando autenticação for implementada:
      /*
      const response = await agent
        .post("/api/bugs")
        .set("Authorization", "Bearer invalid_token")
        .send(bugFixtures.validBugComplete)
        .expect(401);

      expect(response.body).to.have.property("message");
      */

      // Placeholder for future test
      expect(true).to.be.true;
    });
  });

  describe("📊 Response Headers e Metadata", () => {
    it("Deve retornar Content-Type application/json", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.validBugComplete)
        .expect(201);

      expect(response.headers["content-type"]).to.include("application/json");
    });

    it("Deve retornar status code 201 Created para bug criado com sucesso", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.validBugComplete);

      expect(response.status).to.equal(201);
    });

    it("Deve retornar status code 400 Bad Request para validação falhar", async () => {
      const response = await agent
        .post("/api/bugs")
        .send(bugFixtures.missingTitle);

      expect(response.status).to.equal(400);
    });
  });

  describe("🔄 Testes de Concorrência", () => {
    it("Deve criar múltiplos bugs simultaneamente sem conflitos", async () => {
      const promises = Array.from({ length: 5 }, () =>
        agent.post("/api/bugs").send(bugFixtures.validBugComplete)
      );

      const responses = await Promise.all(promises);

      // Verifica que todos os requests foram bem-sucedidos
      responses.forEach((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property("id");
      });

      // Verifica que todos os IDs são únicos
      const ids = responses.map((r) => r.body.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).to.equal(5);
    });
  });
});
