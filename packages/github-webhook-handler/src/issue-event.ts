import type { IssuesEvent } from '@octokit/webhooks-types';
import type { SynchronizeFunctions } from 'utils';

export function isIssuesEvent(
  eventName: string,
  _event: unknown,
): _event is IssuesEvent {
  return eventName === 'issues';
}

export function handleIssuesEvent(
  event: IssuesEvent,
  sync: SynchronizeFunctions,
): void {
  if (event.action === 'opened') {
    sync.addTodo({
      externalId: event.issue.id,
      title: event.issue.title,
    });
  }

  if (event.action === 'closed') {
    sync.completeTodo(event.issue.id);
  }

  if (event.action === 'deleted') {
    sync.removeTodo(event.issue.id);
  }

  if (event.action === 'deleted') {
    sync.removeTodo(event.issue.id);
  }
}
