import { Router } from "express";
import { db, profileTable, DEFAULT_VISUAL_CONFIG } from "@workspace/db";
import { requireAuth } from "./auth";

const router = Router();

function serializeProfile(profile: typeof profileTable.$inferSelect) {
  let parsedConfig: Record<string, unknown> | null = null;
  try {
    parsedConfig = profile.visualConfig ? JSON.parse(profile.visualConfig) : null;
  } catch {
    parsedConfig = null;
  }
  if (!parsedConfig) {
    try {
      parsedConfig = JSON.parse(DEFAULT_VISUAL_CONFIG);
    } catch {
      parsedConfig = {};
    }
  }
  return {
    name: profile.name,
    subtitle: profile.subtitle,
    tagline: profile.tagline,
    logoUrl: profile.logoUrl,
    backgroundUrl: profile.backgroundUrl,
    primaryColor: profile.primaryColor,
    goldColor: profile.goldColor,
    fontTitle: profile.fontTitle,
    fontBody: profile.fontBody,
    visualConfig: parsedConfig,
  };
}

router.get("/profile", async (req, res) => {
  const [profile] = await db.select().from(profileTable).limit(1);
  if (!profile) {
    return res.status(404).json({ error: "Profile not found" });
  }
  return res.json(serializeProfile(profile));
});

router.patch("/profile", requireAuth, async (req, res) => {
  const body = req.body as Record<string, unknown>;
  const allowed = ["name", "subtitle", "tagline", "logoUrl", "backgroundUrl", "primaryColor", "goldColor", "fontTitle", "fontBody"];
  const updates: Record<string, unknown> = {};

  const keyMap: Record<string, string> = {
    logoUrl: "logo_url",
    backgroundUrl: "background_url",
    primaryColor: "primary_color",
    goldColor: "gold_color",
    fontTitle: "font_title",
    fontBody: "font_body",
    visualConfig: "visual_config",
  };

  for (const key of allowed) {
    if (key in body) {
      const dbKey = keyMap[key] ?? key;
      updates[dbKey] = body[key];
    }
  }

  if ("visualConfig" in body) {
    updates["visual_config"] = typeof body.visualConfig === "string"
      ? body.visualConfig
      : JSON.stringify(body.visualConfig);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const [updated] = await db.update(profileTable).set(updates as any).returning();
  return res.json(serializeProfile(updated));
});

export default router;
