import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

async function loadApiSpec(): Promise<object> {
  try {
    const specPath = path.join(process.cwd(), "public", "api-spec.json");
    const specContent = await fs.readFile(specPath, "utf-8");
    return JSON.parse(specContent);
  } catch (error) {
    console.error("Failed to load API spec:", error);
    return {
      error: "Failed to load API specification",
    };
  }
}

function getSwaggerUI(specUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sun Tracker API Documentation</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui.css">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #fafafa;
      font-family: sans-serif;
    }
    .topbar {
      background-color: #1c1c1c;
      padding: 10px 0;
    }
    .topbar h1 {
      margin: 0;
      padding: 0 20px;
      color: white;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="topbar">
    <h1>Sun Tracker API Documentation</h1>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui.bundle.js"></script>
  <script>
    window.onload = () => {
      const ui = SwaggerUIBundle({
        url: "${specUrl}",
        dom_id: "#swagger-ui",
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset,
        ],
        layout: "StandaloneLayout",
      });
    };
  </script>
</body>
</html>`;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const accept = request.headers.get("accept") || "";
  const format = searchParams.get("format") || "";

  // If format=json or Accept header includes application/json, return JSON
  if (format === "json" || accept.includes("application/json")) {
    const spec = await loadApiSpec();
    return NextResponse.json(spec, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // If Accept header includes text/html, return Swagger UI
  if (accept.includes("text/html")) {
    const html = getSwaggerUI("/api/docs?format=json");
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // Default: return Swagger UI HTML
  const html = getSwaggerUI("/api/docs?format=json");
  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
