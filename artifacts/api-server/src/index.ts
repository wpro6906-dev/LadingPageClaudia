import app from "./app";
import { logger } from "./lib/logger";
import { db, adminTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const ADMIN_USERNAME = "ClaudiaAlzate";
const ADMIN_PASSWORD = "Claudia123";

async function seedAdmin() {
  try {
    const [existing] = await db
      .select()
      .from(adminTable)
      .where(eq(adminTable.username, ADMIN_USERNAME));

    if (!existing) {
      await db.insert(adminTable).values({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
      logger.info({ username: ADMIN_USERNAME }, "Admin user created in DB");
    } else if (existing.password !== ADMIN_PASSWORD) {
      await db
        .update(adminTable)
        .set({ password: ADMIN_PASSWORD })
        .where(eq(adminTable.id, existing.id));
      logger.info({ username: ADMIN_USERNAME }, "Admin password updated in DB");
    } else {
      logger.info({ username: ADMIN_USERNAME }, "Admin user already exists");
    }
  } catch (err) {
    logger.error({ err }, "Failed to seed admin — will rely on env fallback");
  }
}

const port = Number(process.env["PORT"] || 3000);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env["PORT"]}"`);
}

seedAdmin().finally(() => {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
});
