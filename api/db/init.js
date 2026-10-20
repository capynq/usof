import { loadConfig } from "../src/config/env.js";
import { setupDatabase } from "./setup.js";

const config = loadConfig();
const recreate = process.argv.includes("--recreate");

await setupDatabase(config, { recreate });
