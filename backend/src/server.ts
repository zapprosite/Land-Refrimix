import { app } from './app.js';

const desired = Number(process.env.PORT || 4000);
const server = app.listen(desired, () => {
  const addr = server.address();
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify({
      level: 30,
      ts: new Date().toISOString(),
      operation: 'server_start',
      desired,
      actual: typeof addr === 'object' && addr ? addr.port : desired,
    }),
  );
});
