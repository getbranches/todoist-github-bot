import { cleanEnv, num, str } from 'envalid';

export const config = cleanEnv(process.env, {
  PORT: num({ default: 8080 }),
  ADMIN_PORT: num({ default: 8081 }),
  SELF_URL: str({ default: 'http://localhost:8080' }),
  WEBHOOK_SECRET: str({ devDefault: 'not-a-secret' }),
  LOG_LEVEL: str({
    default: 'info',
    choices: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
  }),
});

export type Config = Readonly<typeof config>;
