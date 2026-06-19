import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import crypto from "crypto";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

const SESSION_SECRET = process.env.SESSION_SECRET || "claudia-alzate-secret-key";
const sessions = new Map<string, { adminId: number; username: string }>();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(SESSION_SECRET));

app.use((req: any, _res, next) => {
  const token = req.cookies?.["session"];
  if (token && sessions.has(token)) {
    req.session = sessions.get(token);
    req._sessionToken = token;
  } else {
    req.session = null;
  }
  next();
});

app.use((req: any, res: any, next) => {
  const originalJson = res.json.bind(res);
  const originalEnd = res.end.bind(res);

  const flushSession = () => {
    if (req.session === null && req._sessionToken) {
      sessions.delete(req._sessionToken);
      res.clearCookie("session");
    } else if (req.session && !req._sessionToken) {
      const token = crypto.randomBytes(32).toString("hex");
      sessions.set(token, req.session);
      res.cookie("session", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
  };

  res.json = (body: any) => {
    flushSession();
    return originalJson(body);
  };

  res.end = (...args: any[]) => {
    flushSession();
    return originalEnd(...args);
  };

  next();
});

app.use("/api", router);

export default app;
