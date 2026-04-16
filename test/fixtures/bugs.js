/**
 * Fixture: Casos de teste para o endpoint POST /api/bugs
 * Contém dados válidos, inválidos e casos extremos
 */

const bugFixtures = {
  // Caso de sucesso - Bug válido completo
  validBugComplete: {
    title: "Login button not responding on mobile",
    description: "When clicking the login button on mobile devices, nothing happens. The button appears to be disabled but no error message is shown.",
    reporter: "qa.engineer",
    severity: "high",
    steps: [
      "Open the application on a mobile device",
      "Navigate to the login page",
      "Enter valid credentials",
      "Click the login button",
    ],
    attachments: [
      {
        filename: "screenshot_mobile.png",
        url: "https://example.com/screenshots/mobile.png",
      },
      {
        filename: "console_error.log",
        url: "https://example.com/logs/console.log",
      },
    ],
  },

  // Caso de sucesso - Bug mínimo válido (sem attachments)
  validBugMinimal: {
    title: "Database connection timeout",
    description: "The application fails to connect to the database after 30 seconds of inactivity.",
    reporter: "dev.tester",
    severity: "critical",
    steps: [
      "Start the application",
      "Wait 30 seconds without any activity",
      "Try to perform any database operation",
    ],
  },

  // Caso de sucesso - Bug com severidade baixa
  validBugLowSeverity: {
    title: "Typo in welcome message",
    description: "The welcome message has a spelling mistake in the word 'Welcome'.",
    reporter: "report.bug",
    severity: "low",
    steps: [
      "Load the application",
      "Check the welcome message displayed on the home page",
    ],
  },

  // Caso de sucesso - Bug com múltiplos attachments
  validBugMultipleAttachments: {
    title: "Performance issue on dashboard",
    description: "The dashboard takes more than 5 seconds to load with large datasets.",
    reporter: "qa.engineer",
    severity: "medium",
    steps: [
      "Login to the application",
      "Navigate to the dashboard",
      "Load a large dataset",
      "Observe load time",
    ],
    attachments: [
      {
        filename: "dashboard_performance.json",
        url: "https://example.com/metrics/performance.json",
      },
      {
        filename: "network_logs.har",
        url: "https://example.com/logs/network.har",
      },
      {
        filename: "cpu_usage.png",
        url: "https://example.com/graphs/cpu.png",
      },
    ],
  },

  // Erro: Falta do campo obrigatório 'title'
  missingTitle: {
    description: "Missing title field in the bug report.",
    reporter: "qa.engineer",
    severity: "high",
    steps: ["Step 1", "Step 2"],
  },

  // Erro: Falta do campo obrigatório 'description'
  missingDescription: {
    title: "Bug report without description",
    reporter: "qa.engineer",
    severity: "high",
    steps: ["Step 1"],
  },

  // Erro: Falta do campo obrigatório 'reporter'
  missingReporter: {
    title: "Bug without reporter",
    description: "This bug report doesn't have a reporter assigned.",
    severity: "medium",
    steps: ["Step 1"],
  },

  // Erro: Falta do campo obrigatório 'severity'
  missingSeverity: {
    title: "Bug without severity",
    description: "Missing severity level in the bug report.",
    reporter: "qa.engineer",
    steps: ["Step 1"],
  },

  // Erro: Falta do campo obrigatório 'steps'
  missingSteps: {
    title: "Bug without reproduction steps",
    description: "This bug report doesn't contain reproduction steps.",
    reporter: "qa.engineer",
    severity: "high",
  },

  // Erro: 'title' é uma string vazia
  emptyTitle: {
    title: "",
    description: "Valid description with empty title.",
    reporter: "qa.engineer",
    severity: "high",
    steps: ["Step 1"],
  },

  // Erro: 'steps' é um array vazio
  emptySteps: {
    title: "Bug with empty steps",
    description: "This bug has an empty steps array.",
    reporter: "qa.engineer",
    severity: "high",
    steps: [],
  },

  // Erro: 'severity' com valor inválido
  invalidSeverity: {
    title: "Bug with invalid severity",
    description: "This bug has an invalid severity value.",
    reporter: "qa.engineer",
    severity: "blocker",
    steps: ["Step 1"],
  },

  // Erro: 'title' não é uma string
  invalidTitleType: {
    title: 12345,
    description: "Title is a number instead of string.",
    reporter: "qa.engineer",
    severity: "high",
    steps: ["Step 1"],
  },

  // Erro: 'steps' não é um array
  invalidStepsType: {
    title: "Bug with invalid steps type",
    description: "Steps field is not an array.",
    reporter: "qa.engineer",
    severity: "high",
    steps: "Step 1, Step 2",
  },

  // Erro: 'attachments' não é um array
  invalidAttachmentsType: {
    title: "Invalid attachments type",
    description: "Attachments field is not an array.",
    reporter: "qa.engineer",
    severity: "high",
    steps: ["Step 1"],
    attachments: { filename: "test.png", url: "https://example.com" },
  },

  // Erro: Mais de 10 attachments
  tooManyAttachments: {
    title: "Too many attachments",
    description: "This bug has more than 10 attachments.",
    reporter: "qa.engineer",
    severity: "high",
    steps: ["Step 1"],
    attachments: Array.from({ length: 11 }, (_, i) => ({
      filename: `attachment_${i + 1}.png`,
      url: `https://example.com/attachment_${i + 1}.png`,
    })),
  },

  // Erro: Attachment sem filename
  attachmentMissingFilename: {
    title: "Attachment without filename",
    description: "Testing attachment validation.",
    reporter: "qa.engineer",
    severity: "high",
    steps: ["Step 1"],
    attachments: [
      {
        url: "https://example.com/file.png",
      },
    ],
  },

  // Erro: Attachment sem url
  attachmentMissingUrl: {
    title: "Attachment without URL",
    description: "Testing attachment validation.",
    reporter: "qa.engineer",
    severity: "high",
    steps: ["Step 1"],
    attachments: [
      {
        filename: "test.png",
      },
    ],
  },

  // Erro: Step com string vazia
  stepWithEmptyString: {
    title: "Bug with empty step",
    description: "One of the steps is an empty string.",
    reporter: "qa.engineer",
    severity: "high",
    steps: ["Step 1", "", "Step 3"],
  },

  // Erro: Valores com espaços em branco
  whitespaceValues: {
    title: "   ",
    description: "   ",
    reporter: "   ",
    severity: "high",
    steps: ["Step 1"],
  },

  // Corpo vazio
  emptyBody: {},

  // Null body
  nullBody: null,
};

module.exports = bugFixtures;
