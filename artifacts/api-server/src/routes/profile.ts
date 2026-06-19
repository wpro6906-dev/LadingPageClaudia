import { Router } from "express";
import { db, profileTable } from "@workspace/db";
import { requireAuth } from "./auth";

const router = Router();

router.get("/profile", async (req, res) => {
  const [profile] = await db.select().from(profileTable).limit(1);
  if (!profile) {
    return res.status(404).json({ error: "Profile not found" });
  }
  return res.json({
    name: profile.name,
    subtitle: profile.subtitle,
    tagline: profile.tagline,
    logoUrl: profile.logoUrl,
    backgroundUrl: profile.backgroundUrl,
    primaryColor: profile.primaryColor,
    goldColor: profile.goldColor,
    fontTitle: profile.fontTitle,
    fontBody: profile.fontBody,
  });
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
  };

  for (const key of allowed) {
    if (key in body) {
      const dbKey = keyMap[key] ?? key;
      updates[dbKey] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const [updated] = await db.update(profileTable).set(updates as any).returning();
  return res.json({
    name: updated.name,
    subtitle: updated.subtitle,
    tagline: updated.tagline,
    logoUrl: updated.logoUrl,
    backgroundUrl: updated.backgroundUrl,
    primaryColor: updated.primaryColor,
    goldColor: updated.goldColor,
    fontTitle: updated.fontTitle,
    fontBody: updated.fontBody,
  });
});

export default router;
