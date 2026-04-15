function buildServerUrl(req) {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.get("host");

  return `${protocol}://${host}`;
}

function buildOpenApiSpec(req) {
  return {
    openapi: "3.0.3",
    info: {
      title: "Bug Report API",
      version: "1.0.0",
      description:
        "API documentation for creating bug reports with validation for severity, reproduction steps, and attachments.",
    },
    servers: [
      {
        url: buildServerUrl(req),
        description: "Current server",
      },
    ],
    tags: [
      {
        name: "Bugs",
        description: "Operations related to bug report submission.",
      },
    ],
    paths: {
      "/bugs": {
        post: {
          tags: ["Bugs"],
          summary: "Create a bug report",
          description:
            "Creates a new bug report and stores it in memory. The request body is validated before the report is created.",
          operationId: "createBug",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateBugRequest",
                },
                examples: {
                  validBugReport: {
                    summary: "Valid request example",
                    value: {
                      title: "Checkout button stops working after coupon is applied",
                      description:
                        "After applying a coupon code, clicking the checkout button does not trigger navigation.",
                      reporter: "qa.team@company.com",
                      severity: "high",
                      steps: [
                        "Open the cart page.",
                        "Apply a valid coupon code.",
                        "Click the checkout button.",
                      ],
                      attachments: [
                        {
                          filename: "checkout-error.png",
                          url: "https://example.com/files/checkout-error.png",
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Bug report created successfully.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/BugReport",
                  },
                  examples: {
                    created: {
                      summary: "Created bug report",
                      value: {
                        id: "c6df10f5-b037-4f3d-a012-f0b5ea7e6f7b",
                        title:
                          "Checkout button stops working after coupon is applied",
                        description:
                          "After applying a coupon code, clicking the checkout button does not trigger navigation.",
                        reporter: "qa.team@company.com",
                        severity: "high",
                        steps: [
                          "Open the cart page.",
                          "Apply a valid coupon code.",
                          "Click the checkout button.",
                        ],
                        attachments: [
                          {
                            filename: "checkout-error.png",
                            url: "https://example.com/files/checkout-error.png",
                          },
                        ],
                        createdAt: "2026-04-14T21:40:00.000Z",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description:
                "Validation error. Returned when required fields are missing or malformed.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ValidationError",
                  },
                  examples: {
                    invalidSeverity: {
                      summary: "Invalid severity",
                      value: {
                        message: "Validation error",
                        details: [
                          "severity must be one of: low, medium, high, critical.",
                        ],
                      },
                    },
                    missingFields: {
                      summary: "Missing required fields",
                      value: {
                        message: "Validation error",
                        details: [
                          "title is required.",
                          "description is required.",
                          "reporter is required.",
                          "severity is required.",
                          "steps is required.",
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Attachment: {
          type: "object",
          additionalProperties: false,
          required: ["filename", "url"],
          properties: {
            filename: {
              type: "string",
              description: "Attachment file name.",
              example: "checkout-error.png",
            },
            url: {
              type: "string",
              description: "Public URL for the attachment.",
              example: "https://example.com/files/checkout-error.png",
            },
          },
        },
        CreateBugRequest: {
          type: "object",
          additionalProperties: false,
          required: ["title", "description", "reporter", "severity", "steps"],
          properties: {
            title: {
              type: "string",
              description: "Short summary of the bug.",
              minLength: 1,
            },
            description: {
              type: "string",
              description: "Detailed explanation of the bug behavior.",
              minLength: 1,
            },
            reporter: {
              type: "string",
              description: "Name or identifier of the person reporting the bug.",
              minLength: 1,
            },
            severity: {
              type: "string",
              description: "Business impact level of the bug.",
              enum: ["low", "medium", "high", "critical"],
            },
            steps: {
              type: "array",
              description: "Ordered list of reproduction steps.",
              minItems: 1,
              items: {
                type: "string",
                minLength: 1,
              },
            },
            attachments: {
              type: "array",
              description: "Optional evidence files related to the bug report.",
              maxItems: 10,
              items: {
                $ref: "#/components/schemas/Attachment",
              },
            },
          },
        },
        BugReport: {
          allOf: [
            {
              $ref: "#/components/schemas/CreateBugRequest",
            },
            {
              type: "object",
              required: ["id", "createdAt"],
              properties: {
                id: {
                  type: "string",
                  format: "uuid",
                  description: "Generated bug report identifier.",
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  description: "ISO timestamp when the bug report was created.",
                },
              },
            },
          ],
        },
        ValidationError: {
          type: "object",
          required: ["message", "details"],
          properties: {
            message: {
              type: "string",
              example: "Validation error",
            },
            details: {
              type: "array",
              description: "List of validation failures.",
              items: {
                type: "string",
              },
            },
          },
        },
      },
    },
  };
}

module.exports = buildOpenApiSpec;
