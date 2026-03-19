import express from "express";
import { OAuth2Client } from "google-auth-library";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log("Server starting...");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("APP_URL:", process.env.APP_URL);

  app.use(express.json());
  app.use(cookieParser());

  // Google Fit OAuth Config
  const getRedirectUri = () => {
    let baseUrl = process.env.APP_URL || "http://localhost:3000";
    // Ensure no trailing slash
    baseUrl = baseUrl.replace(/\/$/, "");
    return `${baseUrl}/auth/google-fit/callback`;
  };

  const getOAuth2Client = () => {
    const CLIENT_ID = process.env.GOOGLE_FIT_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_FIT_CLIENT_SECRET;
    const REDIRECT_URI = getRedirectUri();
    
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.warn("WARNING: GOOGLE_FIT_CLIENT_ID or GOOGLE_FIT_CLIENT_SECRET is missing from environment variables.");
    }
    
    return new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

app.get("/api/debug/env", (req, res) => {
  res.json({
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    geminiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
    hasUserGeminiKey: !!process.env.USER_GEMINI_API_KEY,
    userGeminiKeyLength: process.env.USER_GEMINI_API_KEY?.length || 0,
    hasGoogleFitClientId: !!process.env.GOOGLE_FIT_CLIENT_ID,
    hasGoogleFitClientSecret: !!process.env.GOOGLE_FIT_CLIENT_SECRET,
    appUrl: process.env.APP_URL,
    nodeEnv: process.env.NODE_ENV
  });
});

// Google Fit Config Info
app.get("/api/auth/google-fit/config", (req, res) => {
  res.json({
    redirectUri: getRedirectUri(),
    clientIdConfigured: !!process.env.GOOGLE_FIT_CLIENT_ID,
    clientSecretConfigured: !!process.env.GOOGLE_FIT_CLIENT_SECRET
  });
});

// Google Fit Auth URL
app.get("/api/auth/google-fit/url", (req, res) => {
  try {
    const client = getOAuth2Client();
    if (!process.env.GOOGLE_FIT_CLIENT_ID || !process.env.GOOGLE_FIT_CLIENT_SECRET) {
      return res.status(500).json({ error: "Google Fit credentials are not configured in environment variables." });
    }
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/fitness.activity.read",
        "https://www.googleapis.com/auth/fitness.body.read",
        "https://www.googleapis.com/auth/fitness.nutrition.read",
        "https://www.googleapis.com/auth/fitness.heart_rate.read",
        "https://www.googleapis.com/auth/fitness.blood_pressure.read"
      ],
      prompt: "consent"
    });
    res.json({ url });
  } catch (error) {
    console.error("Error generating auth URL:", error);
    res.status(500).json({ error: "Failed to generate authentication URL" });
  }
});

// Google Fit Callback
app.get("/auth/google-fit/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
    const client = getOAuth2Client();
    const { tokens } = await client.getToken(code as string);
    
    // We send the tokens back to the frontend via postMessage
    // The frontend will then store them in Firestore
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'GOOGLE_FIT_AUTH_SUCCESS', 
                tokens: ${JSON.stringify(tokens)} 
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Authentication failed");
  }
});

// Proxy to fetch Google Fit data
app.post("/api/google-fit/data", async (req, res) => {
  const { tokens, startTime, endTime } = req.body;
  if (!tokens) return res.status(400).send("No tokens provided");

  try {
    const client = getOAuth2Client();
    client.setCredentials(tokens);

    // Fetch aggregated data
    const response = await client.request({
      url: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      method: "POST",
      data: {
        aggregateBy: [
          { dataTypeName: "com.google.calories.expended" },
          { dataTypeName: "com.google.step_count.delta" },
          { dataTypeName: "com.google.distance.delta" },
          { dataTypeName: "com.google.active_minutes" },
          { dataTypeName: "com.google.heart_rate.bpm" },
          { dataTypeName: "com.google.blood_pressure" }
        ],
        bucketByTime: { durationMillis: 86400000 }, // 1 day
        startTimeMillis: startTime,
        endTimeMillis: endTime
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching Google Fit data:", error);
    res.status(500).send("Failed to fetch data");
  }
});

/**
 * Apple Health Webhook
 * This endpoint allows 3rd party apps (like Health Auto Export) to sync Apple Health data
 * to the NABD platform via a POST request.
 */
app.post("/api/apple-health/webhook", async (req, res) => {
  const { userId, data } = req.body;
  if (!userId || !data) {
    return res.status(400).json({ error: "Missing userId or data" });
  }

  console.log(`Received Apple Health data for user: ${userId}`);
  // In a real app, you'd process the data and save it to Firestore here.
  // For this demo, we'll just acknowledge receipt.
  // The frontend will handle the display if we save it to the user's daily log.
  res.json({ status: "success", message: "Data received" });
});

  // Vite middleware setup
  const distPath = path.join(process.cwd(), 'dist');
  const indexPath = path.join(distPath, 'index.html');

  if (process.env.NODE_ENV === "production" || fs.existsSync(indexPath)) {
    console.log("Mode: Production (serving static files)");
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Build artifacts not found. Please run 'npm run build'.");
      }
    });
  } else {
    console.log("Mode: Development (using Vite middleware)");
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.error("Failed to start Vite dev server:", e);
      // In dev mode, we want to know if Vite fails to start
      throw e;
    }
  }

  // Error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled Error:", err);
    res.status(500).send("Internal Server Error");
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
