import type { WebhookEvent } from '@octokit/webhooks-types';
import type { SynchronizeFunctions } from 'reconciler';
import { handleIssuesEvent, isIssuesEvent } from './issue-event';
export * from './issue-event';

const supportedEvents = ['issues'] as const;
export type SupportedEvent = (typeof supportedEvents)[number];

export function isSupportedEvent(
  event: string | string[] | undefined,
): event is SupportedEvent {
  if (typeof event === 'string') {
    return supportedEvents.includes(event as SupportedEvent);
  }

  if (Array.isArray(event)) {
    return event.every((e) => supportedEvents.includes(e as SupportedEvent));
  }

  return false;
}

export function handleEvent(
  eventName: SupportedEvent,
  event: WebhookEvent,
  sync: SynchronizeFunctions,
): void {
  if (isIssuesEvent(eventName, event)) {
    handleIssuesEvent(event, sync);
  }
}
