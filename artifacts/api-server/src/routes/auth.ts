import { Router } from "express";
import { db, adminTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const USER_CREDENTIALS = { username: "claudyalzate", password: "claudy321" };

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const credentialsSchema = z.object({
  username: z.string().min(1).optional(),
  password: z.string().min(1).optional(),
  currentPassword: z.string().optional(),
});

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.adminId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

function requireAnyAuth(req: any, res: any, next: any) {
  if (req.session?.adminId || req.userSession?.username) {
    return next();
  }
  return res.status(401).json({ error: "Not authenticated" });
}

router.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const { username, password } = parsed.data;

  // Check user credentials (dashboard user)
  if (username === USER_CREDENTIALS.username && password === USER_CREDENTIALS.password) {
    (req as any).userSession = { username };
    req.log.info({ username }, "User logged in via unified login");
    return res.json({ username, role: "user" });
  }

  // Check admin credentials in DB — fallback to env/hardcoded if DB is unavailable
  try {
    const [admin] = await db.select().from(adminTable).where(eq(adminTable.username, username));
    if (admin && admin.password === password) {
      (req as any).session = { adminId: admin.id, username: admin.username };
      req.log.info({ adminId: admin.id }, "Admin logged in");
      return res.json({ username: admin.username, role: "admin" });
    }
  } catch (err) {
    req.log.error({ err }, "DB error during admin login — falling back to env credentials");
    const envUser = process.env.ADMIN_USERNAME || "admin";
    const envPass = process.env.ADMIN_PASSWORD || "admin123";
    if (username === envUser && password === envPass) {
      (req as any).session = { adminId: 1, username };
      req.log.info({ username }, "Admin logged in via env fallback");
      return res.json({ username, role: "admin" });
    }
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

router.post("/auth/logout", (req, res) => {
  (req as any).session = null;
  return res.json({ ok: true });
});

router.get("/auth/me", requireAuth, async (req, res) => {
  const session = (req as any).session;
  return res.json({ username: session.username });
});

router.patch("/auth/credentials", requireAuth, async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const session = (req as any).session;
  const updates: Record<string, string> = {};
  if (parsed.data.username) updates.username = parsed.data.username;
  if (parsed.data.password) updates.password = parsed.data.password;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Nothing to update" });
  }
  await db.update(adminTable).set(updates).where(eq(adminTable.id, session.adminId));
  if (parsed.data.username) {
    (req as any).session.username = parsed.data.username;
  }
  req.log.info({ adminId: session.adminId }, "Credentials updated");
  return res.json({ ok: true });
});

export { requireAuth, requireAnyAuth };
export default router;
