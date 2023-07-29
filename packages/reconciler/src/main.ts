import type { WebhookEvent } from '@octokit/webhooks-types';
import {
  type SupportedEvent,
  handleIssuesEvent,
  isIssuesEvent,
} from 'github-webhook-handler';
import type { AddTodo, ID, Logger, SynchronizeFunctions, Todo } from 'utils';
export { isSupportedEvent } from 'github-webhook-handler';

interface SynchronizeItems {
  toBeAdded: Map<ID, AddTodo>;
  toBeUpdated: Map<ID, Todo>;
  toBeRemoved: Set<ID>;
  toBeCompleted: Set<ID>;
}

interface MakeSynchronizeFunctionsResult {
  sync: SynchronizeFunctions;
  items: SynchronizeItems;
}

function makeSynchronizeFunctions(
  logger: Logger,
): MakeSynchronizeFunctionsResult {
  const todosToBeAdded = new Map<ID, AddTodo>();
  const todosToBeUpdated = new Map<ID, Todo>();
  const todosToBeRemoved = new Set<ID>();
  const todosToBeCompleted = new Set<ID>();

  return {
    sync: {
      addTodo(issue: AddTodo): void {
        logger.debug({ issue }, 'addTodo');
        todosToBeAdded.set(issue.externalId, issue);
      },
      completeTodo(issueId: ID): void {
        logger.debug({ issueId }, 'completeTodo');
        todosToBeCompleted.add(issueId);
      },
      removeTodo(issueId: ID): void {
        logger.debug({ issueId }, 'removeTodo');
        todosToBeRemoved.add(issueId);
      },
      updateTodo(issue: Todo): void {
        logger.debug({ issue }, 'updateTodo');
        todosToBeUpdated.set(issue.externalId, issue);
      },
    },
    items: {
      toBeAdded: todosToBeAdded,
      toBeUpdated: todosToBeUpdated,
      toBeRemoved: todosToBeRemoved,
      toBeCompleted: todosToBeCompleted,
    },
  };
}

export async function handleEvent(
  eventName: SupportedEvent,
  event: WebhookEvent,
  logger: Logger,
): Promise<void> {
  const { sync, items } = makeSynchronizeFunctions(logger);
  if (isIssuesEvent(eventName, event)) {
    handleIssuesEvent(event, sync);
  }

  logger.debug({ items }, 'items');
}
