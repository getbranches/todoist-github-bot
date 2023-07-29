import type { IncomingHttpHeaders } from "http";

export function getSignature(headers: IncomingHttpHeaders): string | undefined {
  const header = headers['x-hub-signature-256'];
  if (!header) {
    return undefined;
  }

  if (Array.isArray(header)) {
    return header[0];
  }

  return header;
}

export function getEventName(headers: IncomingHttpHeaders): string | undefined {
  const header = headers['x-github-event'];
  if (!header) {
    return undefined;
  }

  if (Array.isArray(header)) {
    return header[0];
  }

  return header;
}