import { sign } from '@octokit/webhooks-methods';
import { fastify } from 'fastify';
import * as reconciler from 'reconciler';
import { describe, expect, test, vi } from 'vitest';
import { eventsPlugin } from '../src/plugin';
import { example } from './__fixtures__/issues';

describe('plugin-events-api', () => {
  test('POST /webhook', async () => {
    const issueEvent = JSON.stringify(
      example.examples.find(e => e.action === 'opened'),
    );
    const spy = vi.spyOn(reconciler, 'handleEvent');
    const app = fastify();
    const secret = 'not-a-secret';
    void app.register(eventsPlugin, { secret });
    spy.mockImplementationOnce(() => Promise.resolve());

    const v = await sign({ secret }, issueEvent);

    const response = await app.inject({
      method: 'POST',
      url: '/webhook',
      headers: {
        'x-github-event': 'issues',
        'content-type': 'application/json',
        'x-hub-signature-256': v,
      },
      body: issueEvent,
    });

    expect(response.statusCode).toBe(204);
    expect(spy).toHaveBeenCalled();
  });

  test('POST /webhook with invalid event', async () => {
    const invalidEvent = JSON.stringify({ invalid: true });
    const spy = vi.spyOn(reconciler, 'handleEvent');
    const app = fastify();
    const secret = 'not-a-secret';
    void app.register(eventsPlugin, { secret });
    spy.mockImplementationOnce(() => Promise.resolve());

    const v = await sign({ secret }, invalidEvent);

    const response = await app.inject({
      method: 'POST',
      url: '/webhook',
      headers: {
        'x-github-event': 'invalid',
        'content-type': 'application/json',
        'x-hub-signature-256': v,
      },
      body: invalidEvent,
    });

    expect(response.statusCode).toBe(400);
    expect(spy).not.toHaveBeenCalled();
  });

  test('POST /webhook with invalid signature', async () => {
    const issueEvent = JSON.stringify(
      example.examples.find(e => e.action === 'opened'),
    );
    const spy = vi.spyOn(reconciler, 'handleEvent');
    const app = fastify();

    void app.register(eventsPlugin, { secret: 'correct-secret' });
    spy.mockImplementationOnce(() => Promise.resolve());

    const v = await sign({ secret: 'wrong-secret' }, issueEvent);

    const response = await app.inject({
      method: 'POST',
      url: '/webhook',
      headers: {
        'x-github-event': 'issues',
        'content-type': 'application/json',
        'x-hub-signature-256': v,
      },
      body: issueEvent,
    });

    expect(response.statusCode).toBe(401);
    expect(spy).not.toHaveBeenCalled();
  });
});
