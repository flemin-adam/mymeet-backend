import {ApplicationConfig, MymeetBackendApplication} from './application';
const dotenv = require('dotenv').config();

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new MymeetBackendApplication(options);
  await app.boot();
  console.log("Boot Complete");
  await app.start();
  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  const port = (process.env.PORT ?? 3000)
  // Run the application
  const config = {
    rest: {
      port,
      host: process.env.HOST,
      cors: {
        origin: `${process.env.CORS_ORIGIN}`?.split(" ") ?? '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 86400,
        credentials: true,
      },
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
    websocket: {
      port,
      cors: {
        origins: `${process.env.CORS_ORIGIN}`,
        methods: ["GET", "POST"]
      }
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
