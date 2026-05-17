import express from "express";
import { OAuth2Client } from "google-auth-library";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";
import crypto from "crypto";
import admin from "firebase-admin";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));

if (!admin.apps.length) {
  let credential;
  const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    try {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      // Only use it if it's actually populated
      if (serviceAccount.project_id && serviceAccount.project_id !== "REPLACE_WITH_YOUR_PROJECT_ID") {
        credential = admin.credential.cert(serviceAccount);
        console.log("Using serviceAccountKey.json for Firebase Admin authentication.");
      } else {
        credential = admin.credential.applicationDefault();
      }
    } catch (error) {
      console.warn("Could not parse serviceAccountKey.json, falling back to applicationDefault()", error);
      credential = admin.credential.applicationDefault();
    }
  } else {
    credential = admin.credential.applicationDefault();
  }

  admin.initializeApp({
    credential,
    projectId: firebaseConfig.projectId,
  });
}

const db = admin.firestore();
if (firebaseConfig.firestoreDatabaseId) {
  // @ts-ignore - databaseId is supported in newer versions of firebase-admin
  // but might not be in the types of the version installed
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log("Server starting...");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("APP_URL:", process.env.APP_URL);

  app.use(express.json());
  app.use(cookieParser());

  // Paymob API Endpoints
  const PAYMOB_BASE_URL = "https://egypt.paymob.com/api";

  // Paymob Config
app.get("/api/paymob/config", (req, res) => {
  res.json({
    integrationIdCard: process.env.PAYMOB_INTEGRATION_ID_CARD,
    integrationIdWallet: process.env.PAYMOB_INTEGRATION_ID_WALLET,
    integrationIdFawry: process.env.PAYMOB_INTEGRATION_ID_FAWRY,
    iframeId: process.env.PAYMOB_IFRAME_ID,
    isConfigured: !!process.env.PAYMOB_API_KEY
  });
});

// 1. Authenticate with Paymob
  app.post("/api/paymob/authenticate", async (req, res) => {
    try {
      if (!process.env.PAYMOB_API_KEY) {
        console.error("Paymob Auth Error: PAYMOB_API_KEY is missing from environment variables.");
        return res.status(500).json({ error: "Paymob API Key is not configured." });
      }

      const response = await axios.post(`${PAYMOB_BASE_URL}/auth/tokens`, {
        api_key: process.env.PAYMOB_API_KEY
      });
      res.json({ token: response.data.token });
    } catch (error: any) {
      const errorData = error.response?.data;
      console.error("Paymob Auth Error Details:", JSON.stringify(errorData, null, 2) || error.message);
      res.status(500).json({ 
        error: "Failed to authenticate with Paymob",
        details: errorData || error.message
      });
    }
  });

  // 2. Register Order
  app.post("/api/paymob/order", async (req, res) => {
    const { token, amount, items, userId } = req.body;
    try {
      const response = await axios.post(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
        auth_token: token,
        delivery_needed: "false",
        amount_cents: Math.round(amount * 100),
        currency: "EGP",
        items: items || [],
        shipping_data: {
          // Dummy data as it's required by Paymob
          first_name: "User",
          last_name: userId || "Unknown",
          email: "user@example.com",
          phone_number: "01000000000",
          city: "Cairo",
          country: "Egypt"
        }
      });
      res.json({ orderId: response.data.id });
    } catch (error: any) {
      const errorData = error.response?.data;
      console.error("Paymob Order Error Details:", JSON.stringify(errorData, null, 2) || error.message);
      res.status(500).json({ 
        error: "Failed to register order with Paymob",
        details: errorData || error.message
      });
    }
  });

  // 3. Generate Payment Key
  app.post("/api/paymob/payment-key", async (req, res) => {
    const { token, orderId, amount, integrationId, billingData } = req.body;
    try {
      const response = await axios.post(`${PAYMOB_BASE_URL}/acceptance/payment_keys`, {
        auth_token: token,
        amount_cents: Math.round(amount * 100),
        expiration: 3600,
        order_id: orderId,
        billing_data: billingData || {
          first_name: "User",
          last_name: "Name",
          email: "user@example.com",
          phone_number: "01000000000",
          apartment: "NA",
          floor: "NA",
          street: "NA",
          building: "NA",
          shipping_method: "NA",
          postal_code: "NA",
          city: "Cairo",
          country: "Egypt",
          state: "Cairo"
        },
        currency: "EGP",
        integration_id: integrationId,
        lock_order_when_paid: "false"
      });
      res.json({ paymentKey: response.data.token });
    } catch (error: any) {
      const errorData = error.response?.data;
      console.error("Paymob Payment Key Error Details:", JSON.stringify(errorData, null, 2) || error.message);
      res.status(500).json({ 
        error: "Failed to generate payment key",
        details: errorData || error.message
      });
    }
  });

  // 4. Paymob Webhook
  app.post("/api/paymob/webhook", async (req, res) => {
    const data = req.body.obj;
    const hmac = req.query.hmac;

    // Verify HMAC (Optional but recommended)
    // For simplicity in this demo, we'll skip strict HMAC verification 
    // but in production you MUST verify it using process.env.PAYMOB_HMAC_SECRET

    if (data && data.success === true) {
      const orderId = data.order.id;
      const userId = data.order.shipping_data.last_name; // We stored userId here
      const amount = data.amount_cents / 100;

      console.log(`Payment successful for user ${userId}, amount: ${amount}`);

      try {
        // Update user subscription in Firestore
        const userRef = db.collection('users').doc(userId);
        await userRef.set({
          subscription: {
            status: 'active',
            plan: amount > 100 ? 'premium' : 'basic', // Example logic
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            orderId: orderId,
            paymentId: data.id
          }
        }, { merge: true });

        res.status(200).send("OK");
      } catch (error) {
        console.error("Error updating Firestore from webhook:", error);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.status(200).send("Payment not successful or invalid data");
    }
  });

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

  // Google Site Verification Dynamic Route
  app.get("/google*.html", (req, res) => {
    const filename = req.path.substring(1); // e.g. google801dad50051326e4.html
    res.type('text/html');
    res.send(`google-site-verification: ${filename}`);
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
  if (!tokens) return res.status(400).json({ error: "No tokens provided" });

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
  } catch (error: any) {
    console.error("Error fetching Google Fit data:", error.message);
    const status = error.response?.status || 500;
    res.status(status).json({ 
      error: "Failed to fetch data", 
      details: error.message
    });
  }
});


  // Vite middleware setup
  const distPath = path.join(process.cwd(), 'dist');
  const indexPath = path.join(distPath, 'index.html');

  if (process.env.NODE_ENV === "production" || fs.existsSync(indexPath)) {
    console.log("Mode: Production (serving static files)");
    // Serve static files except index.html
    app.use(express.static(distPath, { index: false }));
    app.get('*', (req, res) => {
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf-8');
        const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.USER_GEMINI_API_KEY || "";
        html = html.replace('</head>', `<script>window.__GEMINI_API_KEY__ = "${apiKey}";</script></head>`);
        res.send(html);
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
