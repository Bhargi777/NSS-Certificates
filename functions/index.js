// functions/index.js
const express = require('express');
const bodyParser = require('body-parser');
const {Storage} = require('@google-cloud/storage');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load mapping.json (deploy with the function)
const mapping = require('./mapping.json');

// Environment: set BUCKET_NAME via functions config (or env)
const BUCKET_NAME = process.env.BUCKET_NAME || (process.env.FUNCTIONS_EMULATOR ? process.env.BUCKET_NAME : null);
if (!BUCKET_NAME) {
  console.warn('BUCKET_NAME not set; set env var or functions config storage.bucket');
}

const storage = new Storage();
const bucket = storage.bucket(BUCKET_NAME);

const app = express();
app.use(bodyParser.json());

// Basic IP-based rate limit (tune values)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max requests per IP per window
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// helper: normalize name
const normalize = s => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

app.post('/', async (req, res) => {
  try {
    const {roll, name} = req.body || {};
    if (!roll || !name) return res.status(400).json({ error: 'roll and name required' });

    const normalRoll = String(roll).trim().toUpperCase();
    const normalName = normalize(name);

    const record = mapping[normalRoll];
    if (!record) return res.status(404).json({ error: 'Roll number not found' });

    if (normalize(record.name) !== normalName) return res.status(403).json({ error: 'Name does not match records' });

    const fileKey = record.filename; // e.g., "CERT_20BCS001.pdf"
    const file = bucket.file(fileKey);

    const [exists] = await file.exists();
    if (!exists) return res.status(404).json({ error: 'Certificate file not found. Contact support.' });

    // Generate V4 signed URL valid for 5 minutes (300 seconds)
    const expiresMs = Date.now() + 5 * 60 * 1000;
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: expiresMs,
    });

    // Log (Cloud Logging). Do NOT log PII more than necessary if not required.
    console.log(`served ${normalRoll} to ${req.ip}`);

    return res.json({ url });
  } catch (err) {
    console.error('error in getCert:', err);
    return res.status(500).json({ error: 'Server error generating link' });
  }
});

// Export as Firebase Function
const functions = require('firebase-functions');
exports.getCert = functions.region('us-central1').https.onRequest(app);
