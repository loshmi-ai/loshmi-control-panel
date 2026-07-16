import { getLogger } from "@logtape/logtape";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import {
  type EntryContext,
  type RouterContextProvider,
  ServerRouter,
} from "react-router";

const logger = getLogger(["ui-lib", "entry-server"]);

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: RouterContextProvider,
) {
  let shellRendered = false;
  const userAgent = request.headers.get("user-agent");

  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      onError(error: unknown) {
        responseStatusCode = 500;

        if (shellRendered) {
          logger.error("React Router stream render failed after shell render.", {
            error,
          });
        }
      },
    },
  );
  shellRendered = true;

  if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
