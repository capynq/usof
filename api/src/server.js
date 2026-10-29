import { loadConfig } from "./config/env.js";
import { createDatabasePool } from "./config/database.js";
import { createApp } from "./app.js";

let database;

try {
  const config = loadConfig();
  database = createDatabasePool(config);
  await database.query("SELECT id FROM users LIMIT 1");
  const app = await createApp(config, database);
  const server = app.listen(config.port, () => {
    console.log(`Usof listening on port ${config.port}`);
    if (config.mailMode === "file") console.log("Development mail mode! No mails!");
  });
  server.on("error", async () => {
    console.error("HTTP server failed to start");
    await database.end();
    process.exitCode = 1;
  });

  const shutdown = () => {
    server.close(async () => {
      await database.end();
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
} catch (error) {
  console.error(
    database
      ? "Startup failed: check MySQL connectivity and run db:init first."
      : `Startup failed: ${error.message}`,
  );
  if (database) await database.end();
  process.exitCode = 1;
}
