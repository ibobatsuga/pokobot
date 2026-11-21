import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const host = url.origin;

  const openApiSpec = {
    openapi: "3.1.0",
    info: {
      title: "PokoBot CRM & WhatsApp Engine API",
      description:
        "OpenAPI and MCP Tools Interface for PokoBot by FLUXY.ID. Connects Claude, GPTs, Cursor, and Antigravity directly to WAHA WhatsApp instances and CRM pipelines.",
      version: "1.0.0",
    },
    servers: [
      {
        url: host,
        description: "PokoBot Production Gateway",
      },
    ],
    paths: {
      "/api/sendText": {
        post: {
          summary: "Send WhatsApp message via WAHA",
          operationId: "sendWhatsAppMessage",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    chatId: {
                      type: "string",
                      example: "6281234567890@c.us",
                    },
                    text: {
                      type: "string",
                      example: "Halo, ini pesan otomatis dari PokoBot AI.",
                    },
                    session: {
                      type: "string",
                      default: "default",
                    },
                  },
                  required: ["chatId", "text"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Message sent successfully",
            },
          },
        },
      },
      "/api/sendFile": {
        post: {
          summary: "Send WhatsApp document, image, or media file with optional caption via WAHA",
          operationId: "sendWhatsAppFile",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    chatId: {
                      type: "string",
                      example: "6281234567890@c.us",
                      description: "Destination WhatsApp ID or phone number",
                    },
                    caption: {
                      type: "string",
                      example: "Berikut adalah file dokumen yang Anda minta",
                      description: "Optional caption for the file",
                    },
                    file: {
                      type: "object",
                      properties: {
                        url: {
                          type: "string",
                          example: "https://example.com/catalog.pdf",
                          description: "Direct URL of the file to send",
                        },
                        data: {
                          type: "string",
                          description: "Base64 encoded file content (alternative to url)",
                        },
                        mimetype: {
                          type: "string",
                          example: "application/pdf",
                        },
                        filename: {
                          type: "string",
                          example: "catalog.pdf",
                        },
                      },
                      required: [],
                    },
                    session: {
                      type: "string",
                      default: "default",
                    },
                  },
                  required: ["chatId"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "File dispatched successfully",
            },
          },
        },
      },
      "/api/status": {
        get: {
          summary: "Check WAHA & PokoBot status",
          operationId: "getStatus",
          responses: {
            "200": {
              description: "System health check response",
            },
          },
        },
      },
    },
  };

  return NextResponse.json(openApiSpec);
}
