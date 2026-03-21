import { subscribeToOrderEvents } from "@/lib/order-events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

const formatSseMessage = (event, payload) =>
  `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;

export async function GET(request) {
  let unsubscribe = () => {};
  let heartbeatId = null;
  let isClosed = false;

  const stream = new ReadableStream({
    start(controller) {
      const closeStream = () => {
        if (isClosed) return;
        isClosed = true;
        unsubscribe();

        if (heartbeatId) {
          clearInterval(heartbeatId);
          heartbeatId = null;
        }

        try {
          controller.close();
        } catch {
          // The runtime may already have closed the stream.
        }
      };

      const send = (event, payload) => {
        if (isClosed) return;

        try {
          controller.enqueue(
            encoder.encode(formatSseMessage(event, payload))
          );
        } catch {
          closeStream();
        }
      };

      send("connected", {
        type: "connected",
        timestamp: new Date().toISOString(),
      });

      unsubscribe = subscribeToOrderEvents((payload) => {
        send("orders", payload);
      });

      heartbeatId = setInterval(() => {
        send("heartbeat", {
          type: "heartbeat",
          timestamp: new Date().toISOString(),
        });
      }, 15000);

      request.signal.addEventListener(
        "abort",
        () => {
          closeStream();
        },
        { once: true }
      );
    },
    cancel() {
      isClosed = true;
      unsubscribe();

      if (heartbeatId) {
        clearInterval(heartbeatId);
        heartbeatId = null;
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
