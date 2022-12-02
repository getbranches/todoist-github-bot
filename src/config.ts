import { cleanEnv, num, str } from 'envalid';

export const config = cleanEnv(process.env, {
  PORT: num({ default: 8080 }),
  SELF_URL: str({ default: 'http://localhost:8080' }),
  LOG_LEVEL: str({
    default: 'info',
    choices: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
  }),
  TODOIST_CLIENT_ID: str({
    default: '1fa980bfbe9c4c5484c5e4e03bd3aed2',
  }),
  TODOIST_CLIENT_SECRET: str({
    default: 'c9a1d02842ca49268a85673e5d429167',
  }),
});
