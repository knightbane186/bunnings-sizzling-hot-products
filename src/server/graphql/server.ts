import http from "node:http";
import { defaultInputDirectory } from "../io/inputLoader";
import { logger } from "../logger";
import { executeSizzlingHotProductsQuery } from "./schema";

const DEFAULT_QUERY = `{
  sizzlingHotProducts {
    daily {
      date
      productId
      productName
      salesCount
    }
    period {
      startDate
      endDate
      productId
      productName
      salesCount
    }
  }
}`;

function readRequestBody(request: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk: Buffer) => {
      body += chunk.toString("utf8");
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

async function handleGraphqlRequest(
  request: http.IncomingMessage,
  response: http.ServerResponse
): Promise<void> {
  const startedAt = Date.now();
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };

  if (request.method === "OPTIONS") {
    response.writeHead(204, headers);
    response.end();
    return;
  }

  if (request.method !== "POST") {
    response.writeHead(200, headers);
    response.end(
      JSON.stringify({
        message: "POST a GraphQL JSON body to /graphql.",
        example: { query: DEFAULT_QUERY }
      })
    );
    return;
  }

  const body = await readRequestBody(request);
  const payload = body ? (JSON.parse(body) as { query?: string }) : {};
  const result = await executeSizzlingHotProductsQuery({
    query: payload.query ?? DEFAULT_QUERY,
    inputDirectory: defaultInputDirectory(),
    today: "23/04/2026"
  });

  response.writeHead(200, headers);
  response.end(JSON.stringify(result, null, 2));
  logger.info("GraphQL request completed", {
    method: request.method,
    durationMs: Date.now() - startedAt
  });
}

export function startGraphqlServer(port = 4000, host = "127.0.0.1"): http.Server {
  const server = http.createServer((request, response) => {
    if (request.url !== "/graphql") {
      response.writeHead(404, {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      });
      response.end(JSON.stringify({ error: "Not found. Use /graphql." }));
      return;
    }

    handleGraphqlRequest(request, response).catch((error: unknown) => {
      logger.error("GraphQL request failed", {
        method: request.method,
        url: request.url,
        message: error instanceof Error ? error.message : "Unknown error"
      });
      response.writeHead(500, {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      });
      response.end(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error"
        })
      );
    });
  });

  server.listen(port, host, () => {
    logger.info("GraphQL server ready", {
      url: `http://${host}:${port}/graphql`
    });
  });

  return server;
}

if (require.main === module) {
  startGraphqlServer(Number(process.env.PORT ?? 4000), process.env.HOST ?? "0.0.0.0");
}
